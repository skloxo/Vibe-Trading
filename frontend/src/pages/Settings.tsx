import i18n from "@/i18n";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Database, KeyRound, Loader2, MessageSquare, RotateCcw, Save, Server, SlidersHorizontal, Plus, Trash2, Edit, Power } from "lucide-react";
import { toast } from "sonner";
import { api, isAuthRequiredError, type DataSourceSettings, type FeatureFlagsResponse, type LLMProviderOption, type LLMSettings, type FeishuChannel } from "@/lib/api";
import { getApiAuthKey, setApiAuthKey } from "@/lib/apiAuth";

interface LLMFormState {
  provider: string;
  model_name: string;
  base_url: string;
  temperature: number;
  timeout_seconds: number;
  max_retries: number;
  reasoning_effort: string;
}

const fieldClass =
  "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60";
const labelClass = "text-sm font-medium";
const hintClass = "text-xs text-muted-foreground";

function toForm(settings: LLMSettings): LLMFormState {
  return {
    provider: settings.provider,
    model_name: settings.model_name,
    base_url: settings.base_url,
    temperature: settings.temperature,
    timeout_seconds: settings.timeout_seconds,
    max_retries: settings.max_retries,
    reasoning_effort: settings.reasoning_effort || "",
  };
}

export function Settings() {
  
  const [settings, setSettings] = useState<LLMSettings | null>(null);
  const [dataSettings, setDataSettings] = useState<DataSourceSettings | null>(null);
  const [form, setForm] = useState<LLMFormState | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [localApiKey, setLocalApiKeyState] = useState(() => getApiAuthKey());
  const [clearApiKey, setClearApiKey] = useState(false);
  const [tushareToken, setTushareToken] = useState("");
  const [clearTushareToken, setClearTushareToken] = useState(false);
  const [iwencaiKey, setIwencaiKey] = useState("");
  const [clearIwencaiKey, setClearIwencaiKey] = useState(false);
  const [fredApiKey, setFredApiKey] = useState("");
  const [clearFredApiKey, setClearFredApiKey] = useState(false);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlagsResponse | null>(null);
  
  // Feishu platforms settings states
  const [feishuChannels, setFeishuChannels] = useState<FeishuChannel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState<FeishuChannel | null>(null);

  // Form states for the modal
  const [chanName, setChanName] = useState("");
  const [chanEnabled, setChanEnabled] = useState(true);
  const [chanAppId, setChanAppId] = useState("");
  const [chanAppSecret, setChanAppSecret] = useState("");
  const [chanAllowedUsers, setChanAllowedUsers] = useState("");
  const [chanAllowAllUsers, setChanAllowAllUsers] = useState(false);
  const [feishuSaving, setFeishuSaving] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dataSaving, setDataSaving] = useState(false);
  const [settingsLoadError, setSettingsLoadError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    Promise.all([api.getLLMSettings(), api.getDataSourceSettings(), api.getFeatureFlags(), api.getFeishuChannels()])
      .then(([llmData, dataSourceData, flagsData, feishuData]) => {
        if (!alive) return;
        setSettings(llmData);
        setForm(toForm(llmData));
        setDataSettings(dataSourceData);
        setFeatureFlags(flagsData);
        setFeishuChannels(feishuData);
        setSettingsLoadError(null);
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : "Unknown error";
        setSettingsLoadError(message);
        if (isAuthRequiredError(error)) {
          toast.error(message);
        } else {
          toast.error(i18n.t("settings.loadLlmSettingsFailed", { message }));
          toast.error(i18n.t("settings.loadDataSourceSettingsFailed", { message }));
        }
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => { alive = false; };
  }, []);

  const providers = settings?.providers ?? [];
  const selectedProvider = useMemo<LLMProviderOption | undefined>(
    () => providers.find((provider) => provider.name === form?.provider),
    [form?.provider, providers],
  );

  const applyProviderDefaults = (provider = selectedProvider) => {
    if (!provider || !form) return;
    setForm({
      ...form,
      model_name: provider.default_model,
      base_url: provider.default_base_url,
    });
  };

  const onProviderChange = (name: string) => {
    const provider = providers.find((item) => item.name === name);
    if (!provider || !form) return;
    setForm({
      ...form,
      provider: provider.name,
      model_name: provider.default_model,
      base_url: provider.default_base_url,
    });
    setApiKey("");
    setClearApiKey(false);
  };

  const submitLocalApiKey = (event: FormEvent) => {
    event.preventDefault();
    setApiAuthKey(localApiKey);
    toast.success(i18n.t("settings.localApiKeySaved"));
    window.location.reload();
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form) return;
    setSaving(true);
    try {
      const updated = await api.updateLLMSettings({
        provider: form.provider,
        model_name: form.model_name,
        base_url: form.base_url,
        api_key: apiKey.trim() || undefined,
        clear_api_key: clearApiKey,
        temperature: form.temperature,
        timeout_seconds: form.timeout_seconds,
        max_retries: form.max_retries,
        reasoning_effort: form.reasoning_effort || undefined,
      });
      setSettings(updated);
      setForm(toForm(updated));
      setApiKey("");
      setClearApiKey(false);
      toast.success(i18n.t("settings.llmSettingsSaved"));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(i18n.t("settings.saveLlmSettingsFailed", { message }));
    } finally {
      setSaving(false);
    }
  };

  const openAddModal = () => {
    setEditingChannel(null);
    setChanName("");
    setChanEnabled(true);
    setChanAppId("");
    setChanAppSecret("");
    setChanAllowedUsers("");
    setChanAllowAllUsers(false);
    setIsModalOpen(true);
  };

  const openEditModal = (channel: FeishuChannel) => {
    setEditingChannel(channel);
    setChanName(channel.name);
    setChanEnabled(channel.enabled);
    setChanAppId(channel.app_id);
    setChanAppSecret("");
    setChanAllowedUsers(channel.allowed_users);
    setChanAllowAllUsers(channel.allow_all_users);
    setIsModalOpen(true);
  };

  const submitFeishuChannel = async (event: FormEvent) => {
    event.preventDefault();
    setFeishuSaving(true);
    try {
      if (editingChannel) {
        const updated = await api.updateFeishuChannel(editingChannel.id, {
          name: chanName.trim(),
          app_id: chanAppId.trim(),
          app_secret: chanAppSecret.trim() || undefined,
          allowed_users: chanAllowedUsers.trim(),
          allow_all_users: chanAllowAllUsers,
          enabled: chanEnabled,
        });
        setFeishuChannels(feishuChannels.map((c) => (c.id === updated.id ? updated : c)));
        toast.success(i18n.t("settings.channelSaved") || "Feishu channel saved");
      } else {
        const created = await api.createFeishuChannel({
          name: chanName.trim(),
          app_id: chanAppId.trim(),
          app_secret: chanAppSecret.trim(),
          allowed_users: chanAllowedUsers.trim(),
          allow_all_users: chanAllowAllUsers,
          enabled: chanEnabled,
        });
        setFeishuChannels([...feishuChannels, created]);
        toast.success(i18n.t("settings.channelSaved") || "Feishu channel created");
      }
      setIsModalOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(i18n.t("settings.channelSaveFailed", { message }) || "Failed to save channel");
    } finally {
      setFeishuSaving(false);
    }
  };

  const toggleChannelEnabled = async (channel: FeishuChannel) => {
    try {
      const updated = await api.updateFeishuChannel(channel.id, {
        name: channel.name,
        app_id: channel.app_id,
        app_secret: undefined,
        allowed_users: channel.allowed_users,
        allow_all_users: channel.allow_all_users,
        enabled: !channel.enabled,
      });
      setFeishuChannels(feishuChannels.map((c) => (c.id === updated.id ? updated : c)));
      toast.success(i18n.t("settings.channelSaved") || "Feishu channel updated");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(i18n.t("settings.channelSaveFailed", { message }) || "Failed to toggle channel");
    }
  };

  const deleteChannel = async (id: string) => {
    if (!window.confirm(i18n.t("settings.deleteConfirm") || "Are you sure you want to delete this channel?")) {
      return;
    }
    try {
      await api.deleteFeishuChannel(id);
      setFeishuChannels(feishuChannels.filter((c) => c.id !== id));
      toast.success(i18n.t("settings.channelDeleted") || "Feishu channel deleted");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(i18n.t("settings.channelDeleteFailed", { message }) || "Failed to delete channel");
    }
  };

  const submitDataSources = async (event: FormEvent) => {
    event.preventDefault();
    setDataSaving(true);
    try {
      const updated = await api.updateDataSourceSettings({
        tushare_token: tushareToken.trim() || undefined,
        clear_tushare_token: clearTushareToken,
        iwencai_key: iwencaiKey.trim() || undefined,
        clear_iwencai_key: clearIwencaiKey,
        fred_api_key: fredApiKey.trim() || undefined,
        clear_fred_api_key: clearFredApiKey,
      });
      setDataSettings(updated);
      setTushareToken("");
      setClearTushareToken(false);
      setIwencaiKey("");
      setClearIwencaiKey(false);
      setFredApiKey("");
      setClearFredApiKey(false);
      toast.success(i18n.t("settings.dataSourceSettingsSaved"));
    } catch (error) {
      toast.error(i18n.t("settings.saveDataSourceSettingsFailed", { message: error instanceof Error ? error.message : "Unknown error" }));
    } finally {
      setDataSaving(false);
    }
  };

  const localApiAccessSection = (
    <form onSubmit={submitLocalApiKey} className="rounded-lg border bg-card p-5 shadow-sm">
      <div className="mb-4 space-y-1">
        <div className="flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-primary" />
          <h2 className="text-base font-semibold">{i18n.t("settings.localApiAccess")}</h2>
        </div>
        <p className="text-sm text-muted-foreground">{i18n.t("settings.localApiAccessDesc")}</p>
      </div>
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
        <label className="grid gap-2">
          <span className={labelClass}>{i18n.t("settings.serverApiKey")}</span>
          <input
            type="password"
            value={localApiKey}
            onChange={(event) => setLocalApiKeyState(event.target.value)}
            className={fieldClass}
            placeholder={i18n.t("settings.storedInBrowser")}
            autoComplete="current-password"
          />
        </label>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 self-end rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          <Save className="h-4 w-4" />
          {i18n.t("settings.save")}
        </button>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{i18n.t("settings.storedInBrowser")}</p>
    </form>
  );

  if (loading || !form || !settings || !dataSettings) {
    return (
      <div className="mx-auto max-w-5xl space-y-6 p-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">{i18n.t("settings.title")}</h1>
          <p className="max-w-3xl text-sm text-muted-foreground">{i18n.t("settings.subtitle")}</p>
        </div>
        {localApiAccessSection}
        <div className="flex min-h-32 items-center justify-center rounded-lg border bg-card p-5 text-sm text-muted-foreground">
          {settingsLoadError ? (
            <div className="text-center">
              <div className="font-medium text-foreground">{i18n.t("settings.unavailable")}</div>
              <div className="mt-1">{settingsLoadError}</div>
            </div>
          ) : (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {i18n.t("settings.loading")}
            </>
          )}
        </div>
      </div>
    );
  }

  const keyStatus = settings.api_key_configured
    ? i18n.t("settings.configured")
    : settings.api_key_required
      ? i18n.t("settings.keepCurrentKey")
      : selectedProvider?.auth_type === "oauth" && selectedProvider.login_command
        ? i18n.t("settings.providerUsesOauth", { command: selectedProvider.login_command })
        : i18n.t("settings.noApiKeyRequired");
  const apiKeyDisabled = !selectedProvider?.api_key_required || clearApiKey;
  const tushareStatus = dataSettings.tushare_token_configured
    ? i18n.t("settings.configured")
    : i18n.t("settings.keepCurrentToken");

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{i18n.t("settings.title")}</h1>
        <p className="max-w-3xl text-sm text-muted-foreground">{i18n.t("settings.subtitle")}</p>
      </div>

      {localApiAccessSection}

      <div className="space-y-2">
        <h2 className="text-lg font-semibold tracking-tight">{i18n.t("settings.llmSettings")}</h2>
        <p className="max-w-3xl text-sm text-muted-foreground">{i18n.t("settings.llmSettingsDesc")}</p>
      </div>

      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
        <section className="rounded-lg border bg-card p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <Server className="h-4 w-4 text-primary" />
            <h2 className="text-base font-semibold">{i18n.t("settings.connection")}</h2>
          </div>

          <div className="grid gap-4">
            <label className="grid gap-2">
              <span className={labelClass}>{i18n.t("settings.provider")}</span>
              <select
                value={form.provider}
                onChange={(event) => onProviderChange(event.target.value)}
                className={fieldClass}
              >
                {providers.map((provider) => (
                  <option key={provider.name} value={provider.name}>{provider.label}</option>
                ))}
              </select>
              <span className={hintClass}>{"Changing providers updates the recommended model and endpoint."}</span>
            </label>

            <label className="grid gap-2">
              <span className={labelClass}>{i18n.t("settings.model")}</span>
              <div className="flex gap-2">
                <input
                  value={form.model_name}
                  onChange={(event) => setForm({ ...form, model_name: event.target.value })}
                  className={fieldClass}
                  required
                />
                <button
                  type="button"
                  onClick={() => applyProviderDefaults()}
                  className="inline-flex shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  title={i18n.t("settings.useProviderDefaults")}
                >
                  <RotateCcw className="h-4 w-4" />
                  <span className="hidden sm:inline">{i18n.t("settings.useProviderDefaults")}</span>
                </button>
              </div>
              <span className={hintClass}>{i18n.t("settings.modelIdHint")}</span>
            </label>

            <label className="grid gap-2">
              <span className={labelClass}>{i18n.t("settings.baseUrl")}</span>
              <input
                value={form.base_url}
                onChange={(event) => setForm({ ...form, base_url: event.target.value })}
                className={fieldClass}
                placeholder={selectedProvider?.default_base_url}
                disabled={selectedProvider?.auth_type === "oauth"}
              />
            </label>

            <label className="grid gap-2">
              <span className={labelClass}>
                {selectedProvider?.auth_type === "oauth" ? "OAuth" : "API key"}
              </span>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  value={apiKey}
                  onChange={(event) => setApiKey(event.target.value)}
                  className={`${fieldClass} pl-9`}
                  placeholder={keyStatus}
                  autoComplete="current-password"
                  disabled={apiKeyDisabled}
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className={hintClass}>{keyStatus}</span>
                {selectedProvider?.api_key_required ? (
                  <label className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={clearApiKey}
                      onChange={(event) => {
                        setClearApiKey(event.target.checked);
                        if (event.target.checked) setApiKey("");
                      }}
                      className="h-3.5 w-3.5 accent-primary"
                    />
                    {i18n.t("settings.clearApiKey")}
                  </label>
                ) : null}
              </div>
            </label>
          </div>
        </section>

        <section className="rounded-lg border bg-card p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            <h2 className="text-base font-semibold">{i18n.t("settings.generation")}</h2>
          </div>

          <div className="grid gap-4">
            <label className="grid gap-2">
              <span className={labelClass}>{i18n.t("settings.temperature")}</span>
              <input
                type="number"
                min={0}
                max={2}
                step={0.1}
                value={form.temperature}
                onChange={(event) => setForm({ ...form, temperature: Number(event.target.value) })}
                className={fieldClass}
              />
            </label>

            <label className="grid gap-2">
              <span className={labelClass}>{i18n.t("settings.timeoutSeconds")}</span>
              <input
                type="number"
                min={1}
                max={3600}
                step={1}
                value={form.timeout_seconds}
                onChange={(event) => setForm({ ...form, timeout_seconds: Number(event.target.value) })}
                className={fieldClass}
              />
            </label>

            <label className="grid gap-2">
              <span className={labelClass}>{i18n.t("settings.maxRetries")}</span>
              <input
                type="number"
                min={0}
                max={20}
                step={1}
                value={form.max_retries}
                onChange={(event) => setForm({ ...form, max_retries: Number(event.target.value) })}
                className={fieldClass}
              />
            </label>

            <label className="grid gap-2">
              <span className={labelClass}>{i18n.t("settings.reasoningEffort")}</span>
              <select
                value={form.reasoning_effort}
                onChange={(event) => setForm({ ...form, reasoning_effort: event.target.value })}
                className={fieldClass}
              >
                <option value="">{i18n.t("settings.off")}</option>
                <option value="low">{i18n.t("settings.reasoningEffortLow")}</option>
                <option value="medium">{i18n.t("settings.reasoningEffortMedium")}</option>
                <option value="high">{i18n.t("settings.reasoningEffortHigh")}</option>
                <option value="max">{i18n.t("settings.reasoningEffortMax")}</option>
              </select>
              <span className={hintClass}>{i18n.t("settings.reasoningEffortDesc")}</span>
            </label>

            <div className="rounded-md border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{i18n.t("settings.saved")}: </span>
              <span className="break-all font-mono">{settings.env_path}</span>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? i18n.t("settings.saving") : i18n.t("settings.save")}
            </button>
          </div>
        </section>
      </form>

      <form onSubmit={submitDataSources} className="rounded-lg border bg-card p-5 shadow-sm">
        <div className="mb-5 space-y-1">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-primary" />
            <h2 className="text-base font-semibold">{i18n.t("settings.dataSourceSettings")}</h2>
          </div>
          <p className="text-sm text-muted-foreground">{i18n.t("settings.dataSourceSettingsDesc")}</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
          <div className="grid gap-4">
            <label className="grid gap-2">
              <span className={labelClass}>{i18n.t("settings.tushareToken")}</span>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  value={tushareToken}
                  onChange={(event) => setTushareToken(event.target.value)}
                  className={`${fieldClass} pl-9`}
                  placeholder={tushareStatus}
                  autoComplete="current-password"
                  disabled={clearTushareToken}
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className={hintClass}>{i18n.t("settings.tushareDesc")}</span>
                <label className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={clearTushareToken}
                    onChange={(event) => {
                      setClearTushareToken(event.target.checked);
                      if (event.target.checked) setTushareToken("");
                    }}
                    className="h-3.5 w-3.5 accent-primary"
                  />
                  {i18n.t("settings.clearTushareToken")}
                </label>
              </div>
            </label>

            <label className="grid gap-2">
              <span className={labelClass}>{i18n.t("settings.iwencaiApiKey")}</span>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  value={iwencaiKey}
                  onChange={(event) => setIwencaiKey(event.target.value)}
                  className={`${fieldClass} pl-9`}
                  placeholder={dataSettings.iwencai_key_configured ? i18n.t("settings.configured") : i18n.t("settings.keepCurrentKey")}
                  autoComplete="current-password"
                  disabled={clearIwencaiKey}
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className={hintClass}>{i18n.t("settings.iwencaiDesc")}</span>
                <label className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={clearIwencaiKey}
                    onChange={(event) => {
                      setClearIwencaiKey(event.target.checked);
                      if (event.target.checked) setIwencaiKey("");
                    }}
                    className="h-3.5 w-3.5 accent-primary"
                  />
                  {i18n.t("settings.clearSavedKey")}
                </label>
              </div>
            </label>

            <label className="grid gap-2">
              <span className={labelClass}>{i18n.t("settings.fredApiKey")}</span>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  value={fredApiKey}
                  onChange={(event) => setFredApiKey(event.target.value)}
                  className={`${fieldClass} pl-9`}
                  placeholder={dataSettings.fred_api_key_configured ? i18n.t("settings.configured") : i18n.t("settings.keepCurrentKey")}
                  autoComplete="current-password"
                  disabled={clearFredApiKey}
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className={hintClass}>{i18n.t("settings.fredDesc")}</span>
                <label className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={clearFredApiKey}
                    onChange={(event) => {
                      setClearFredApiKey(event.target.checked);
                      if (event.target.checked) setFredApiKey("");
                    }}
                    className="h-3.5 w-3.5 accent-primary"
                  />
                  {i18n.t("settings.clearSavedKey")}
                </label>
              </div>
            </label>

            <div className="rounded-md border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{i18n.t("settings.saved")}: </span>
              <span className="break-all font-mono">{dataSettings.env_path}</span>
            </div>

            <button
              type="submit"
              disabled={dataSaving}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {dataSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {dataSaving ? i18n.t("settings.saving") : i18n.t("settings.saveDataSourceSettings")}
            </button>
          </div>

          <div className="rounded-md border bg-muted/20 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-sm font-medium">{i18n.t("settings.baostock")}</span>
              <span className={`rounded-full px-2 py-0.5 text-xs ${dataSettings.baostock_supported ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                {dataSettings.baostock_supported ? i18n.t("settings.loaderAvailable") : i18n.t("settings.noProjectLoader")}
              </span>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>{dataSettings.baostock_message}</p>
              <p>
                {dataSettings.baostock_installed
                  ? i18n.t("settings.pythonPackageInstalled")
                  : i18n.t("settings.pythonPackageNotInstalled")}
              </p>
            </div>
          </div>
        </div>
      </form>

      <div className="rounded-lg border bg-card p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="space-y-1 pr-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <h2 className="text-base font-semibold">{i18n.t("settings.feishuTitle")}</h2>
            </div>
            <p className="text-xs text-muted-foreground">{i18n.t("settings.feishuDesc")}</p>
          </div>
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 text-xs font-medium transition"
          >
            <Plus className="h-3.5 w-3.5" />
            {i18n.t("settings.addChannel")}
          </button>
        </div>

        {feishuChannels.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            {i18n.t("settings.noChannels")}
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {feishuChannels.map((channel) => (
              <div key={channel.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{channel.name}</span>
                    <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium border ${
                      channel.enabled
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : "bg-muted text-muted-foreground border-border"
                    }`}>
                      {channel.enabled ? "Active" : "Disabled"}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground font-mono">
                    <span>App ID: {channel.app_id}</span>
                    <span>•</span>
                    <span>Secret: {channel.app_secret_configured ? "••••••••" : "Not Configured"}</span>
                    {channel.allowed_users && (
                      <>
                        <span>•</span>
                        <span>OpenIDs: {channel.allowed_users}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleChannelEnabled(channel)}
                    className={`rounded-md p-1.5 transition ${
                      channel.enabled
                        ? "text-green-500 hover:bg-green-500/10"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                    title={i18n.t("settings.feishuEnabled")}
                  >
                    <Power className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => openEditModal(channel)}
                    className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-md p-1.5 transition"
                    title={i18n.t("settings.editChannel")}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteChannel(channel.id)}
                    className="text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-md p-1.5 transition"
                    title={i18n.t("settings.deleteChannel")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-xl border bg-card p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              {editingChannel ? i18n.t("settings.editChannel") : i18n.t("settings.addChannel")}
            </h3>
            <form onSubmit={submitFeishuChannel} className="space-y-4">
              <label className="grid gap-1.5">
                <span className={labelClass}>{i18n.t("settings.channelName")}</span>
                <input
                  type="text"
                  required
                  value={chanName}
                  onChange={(e) => setChanName(e.target.value)}
                  className={fieldClass}
                  placeholder="e.g. 飞书监控机器人"
                />
              </label>

              <label className="grid gap-1.5">
                <span className={labelClass}>{i18n.t("settings.feishuAppId")}</span>
                <input
                  type="text"
                  required
                  value={chanAppId}
                  onChange={(e) => setChanAppId(e.target.value)}
                  className={fieldClass}
                  placeholder="cli_xxxxxxxx"
                />
              </label>

              <label className="grid gap-1.5">
                <span className={labelClass}>{i18n.t("settings.feishuAppSecret")}</span>
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    required={!editingChannel}
                    value={chanAppSecret}
                    onChange={(e) => setChanAppSecret(e.target.value)}
                    className={`${fieldClass} pl-9`}
                    placeholder={
                      editingChannel && editingChannel.app_secret_configured
                        ? i18n.t("settings.configured")
                        : "App Secret"
                    }
                    autoComplete="new-password"
                  />
                </div>
              </label>

              <label className="grid gap-1.5">
                <span className={labelClass}>{i18n.t("settings.feishuAllowedUsers")}</span>
                <input
                  type="text"
                  value={chanAllowedUsers}
                  onChange={(e) => setChanAllowedUsers(e.target.value)}
                  className={fieldClass}
                  disabled={chanAllowAllUsers}
                  placeholder="ou_xxxxxxxx,ou_yyyyyyyy"
                />
                <span className={hintClass}>{i18n.t("settings.feishuAllowedUsersDesc")}</span>
              </label>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="chanAllowAllUsers"
                  checked={chanAllowAllUsers}
                  onChange={(e) => setChanAllowAllUsers(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary"
                />
                <label htmlFor="chanAllowAllUsers" className="text-xs text-muted-foreground cursor-pointer select-none">
                  {i18n.t("settings.feishuAllowAllUsers")}
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="chanEnabled"
                  checked={chanEnabled}
                  onChange={(e) => setChanEnabled(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary"
                />
                <label htmlFor="chanEnabled" className="text-xs text-muted-foreground cursor-pointer select-none">
                  {i18n.t("settings.feishuEnabled")}
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 border-t pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent px-4 py-2 text-sm font-medium transition"
                >
                  {i18n.t("agent.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={feishuSaving}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-70 transition"
                >
                  {feishuSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {feishuSaving ? i18n.t("settings.saving") : i18n.t("settings.save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {featureFlags && (
        <div className="rounded-lg border bg-card p-5 shadow-sm">
          <div className="mb-5 space-y-1">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              <h2 className="text-base font-semibold">{i18n.t("settings.featureFlags")}</h2>
            </div>
            <p className="text-sm text-muted-foreground">{i18n.t("settings.featureFlagsDesc")}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="flex items-center justify-between rounded-md border bg-muted/20 px-4 py-3">
              <span className="text-sm font-medium">{i18n.t("settings.shellTools")}</span>
              <span className={featureFlags.shell_tools_enabled ? "text-success" : "text-muted-foreground"}>
                {featureFlags.shell_tools_enabled ? "✅" : "❌"}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-md border bg-muted/20 px-4 py-3">
              <span className="text-sm font-medium">{i18n.t("settings.scheduler")}</span>
              <span className={featureFlags.scheduler_enabled ? "text-success" : "text-muted-foreground"}>
                {featureFlags.scheduler_enabled ? "✅" : "❌"}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-md border bg-muted/20 px-4 py-3">
              <span className="text-sm font-medium">{i18n.t("settings.sessionRuntime")}</span>
              <span className={featureFlags.session_runtime_enabled ? "text-success" : "text-muted-foreground"}>
                {featureFlags.session_runtime_enabled ? "✅" : "❌"}
              </span>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {i18n.t("settings.flagsReadFrom", {
              env1: "VIBE_TRADING_ENABLE_SHELL_TOOLS",
              env2: "VIBE_TRADING_ENABLE_SCHEDULER",
              env3: "ENABLE_SESSION_RUNTIME",
              env_path: featureFlags.env_path
            })}
          </p>
        </div>
      )}
    </div>
  );
}
