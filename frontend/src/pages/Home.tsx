import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  BarChart3,
  Zap,
  UserCircle2,
  Network,
  Database,
  ShieldAlert,
  Wrench,
  Cpu,
  Layers,
  Settings,
  HelpCircle,
  Activity,
  CheckCircle2
} from "lucide-react";
import { useTranslation } from "react-i18next";

export function Home() {
  const { t, i18n } = useTranslation();
  const isZh = i18n.language?.startsWith("zh");

  // Features list
  const FEATURES = [
    {
      icon: Bot,
      title: isZh ? "AI 智能体联队" : "AI Agent Swarm",
      desc: isZh
        ? "基于双向 ReAct 推理，支持多角色（多头/空头/风控/PM）的投资委员会 debate 决策机制。"
        : "ReAct reasoning swarm with investment committee debate preset (bull vs bear, risk audit, PM decision)."
    },
    {
      icon: BarChart3,
      title: isZh ? "极速回测引擎" : "Built-in Backtest",
      desc: isZh
        ? "多数据源智能覆盖，提供日线与分钟级的 A 股及港股历史量化分析回测支持。"
        : "Built-in engine with multiple data sources covering minute-to-daily bars for A/H-shares."
    },
    {
      icon: Zap,
      title: isZh ? "实时流式输出" : "Real-time Streaming",
      desc: isZh
        ? "秒级呈现智能体决策树，实时直观展示其意图解析、代码生成和原子工具的调用链。"
        : "Watch the agent's decision tree, tool execution logs, and live code generation in real time."
    },
    {
      icon: UserCircle2,
      title: isZh ? "物理隔离沙箱" : "Isolated Sandbox",
      desc: isZh
        ? "使用租户 API Key 隔离运行环境。会话、执行记录、上传文件等均物理独立，确保资产隐私。"
        : "Physical isolation based on Tenant API Keys for sessions, policy runs, and file storage."
    }
  ];

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-16 pb-24">
      {/* 1. Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center space-y-6 pt-12">
        {/* Glow decoration */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold">
          <Activity className="h-3 w-3 animate-pulse" />
          <span>v0.1.10.cnx.1.3 Stable</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-orange-500 to-amber-500 bg-clip-text text-transparent">
          Vibe-Trading-CNX
        </h1>
        <p className="max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
          {isZh
            ? "基于大模型语义编排机制与高性能行情基建的专业量化策略研究与交易工作站。"
            : "Next-generation quantitative strategy research & transaction workstation powered by LLM orchestration."}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            to="/agent"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition shadow-lg shadow-primary/20"
          >
            {isZh ? "进入智能体工作区" : "Enter Agent Workspace"} 
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/monitor"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border bg-card hover:bg-muted transition text-foreground font-medium"
          >
            <Settings className="h-4 w-4 text-muted-foreground" />
            {isZh ? "系统配置与监控" : "Configure & Monitor"}
          </Link>
        </div>
      </section>

      {/* 2. Core Highlights Grid */}
      <section className="space-y-6">
        <h2 className="text-xl md:text-2xl font-bold text-center">
          {isZh ? "核心产品能力与优势" : "Core Capabilities & Advantages"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="border border-border/80 bg-card/40 backdrop-blur-sm rounded-xl p-6 space-y-4 hover:border-primary/40 hover:shadow-md transition-all duration-300"
            >
              <div className="inline-flex p-2.5 rounded-lg bg-primary/5 text-primary border border-primary/10">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-foreground text-sm">{title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. LLM Orchestration Section */}
      <section className="grid gap-8 lg:grid-cols-12 items-center border border-border/60 bg-muted/20 rounded-2xl p-6 md:p-8">
        <div className="lg:col-span-5 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-semibold border border-primary/20 bg-primary/5 text-primary">
            <Cpu className="h-3 w-3" />
            <span>{isZh ? "设计哲学" : "Orchestration Philosophy"}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">
            {isZh ? "大模型语义编排机制" : "LLM Semantic Orchestration"}
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
            {isZh ? (
              <>
                平台秉承<strong>「确定性优先 (Deterministic First)」</strong>原则。凡是可以通过确定性算法（如选股脚本、数据库查询或规则引擎）计算的部分，均直接执行流程化代码，绝不依赖大模型，以避免<strong>高昂 Token 消耗、网络延迟和输出幻觉</strong>。
                <br /><br />
                大模型的角色被精确定位为<strong>「语义路由器与原子服务编排器」</strong>：理解用户自然语言的意图，智能编排底层的行情网关、因子库和交易通道等原子工具，并在计算完成后进行高质量的金融研报整理输出。
              </>
            ) : (
              <>
                Vibe-Trading operates on a <strong>"Deterministic First"</strong> approach. We run deterministic Python scripts, indicators, or database queries directly, avoiding raw LLM computation for things that require exact calculation, eliminating <strong>unnecessary Token costs, latencies, and hallucinations</strong>.
                <br /><br />
                LLMs act as <strong>semantic routers & orchestrators</strong>: translating natural language intent, invoking atomic API tools (quotation gateways, stock factors, broker actions), and generating final formatted reports.
              </>
            )}
          </p>
        </div>
        <div className="lg:col-span-7 flex flex-col space-y-3.5">
          {/* Step 1 */}
          <div className="flex items-start gap-3 bg-card p-4 rounded-xl border border-border/60">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">1</div>
            <div>
              <h4 className="text-xs font-semibold">{isZh ? "自然语言输入 (User Prompt)" : "Natural Language Input (User Prompt)"}</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {isZh ? "用户使用日常语言描述策略意图：“帮我调取行情网关，看看比亚迪现在的买卖盘”" : "Users describe intentions, e.g., 'Check my connector portfolio concentration'"}
              </p>
            </div>
          </div>
          {/* Step 2 */}
          <div className="flex items-start gap-3 bg-card p-4 rounded-xl border border-border/60">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">2</div>
            <div>
              <h4 className="text-xs font-semibold">{isZh ? "语义路由与代码生成" : "Semantic Routing & Code Generation"}</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {isZh ? "主智能体提取参数并生成调用原子工具的代码片段，实时向前端流式传输思考链路。" : "The Agent Router extracts parameters, plans actions, and writes tool execution scripts dynamically."}
              </p>
            </div>
          </div>
          {/* Step 3 */}
          <div className="flex items-start gap-3 bg-card p-4 rounded-xl border border-border/60">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">3</div>
            <div>
              <h4 className="text-xs font-semibold">{isZh ? "确定性工具执行 (Deterministic Execution)" : "Deterministic Tool Execution"}</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {isZh ? "后台在租户沙箱中安全运行该代码，直连 TCP 行情网关或因子库，返回纯粹客观数据。" : "Scripts execute securely within tenant sandboxes, fetching raw quotes or factors directly."}
              </p>
            </div>
          </div>
          {/* Step 4 */}
          <div className="flex items-start gap-3 bg-card p-4 rounded-xl border border-border/60">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">4</div>
            <div>
              <h4 className="text-xs font-semibold">{isZh ? "结果融合与智能反馈" : "Result Fusion & Intelligent Feedback"}</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {isZh ? "智能体捕获执行数据，提炼并组织成排版美观、指标齐备的 HTML 或 PDF 回报报告。" : "The agent merges raw output into highly scannable, indicator-rich markdown / HTML reports."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. A/H Share Data Chain Guide */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl md:text-2xl font-bold">{isZh ? "AH股行情与交易数据链指引" : "A/H-Share Data Chain & Execution Flow"}</h2>
          <p className="text-xs text-muted-foreground max-w-xl mx-auto">
            {isZh ? "平台打通了高频行情获取、本地历史归档与多券商实盘交易之间的核心管道。" : "Bridges high-frequency quotes, localized databases, and multi-broker live trading."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: A-Shares */}
          <div className="border border-border/80 bg-card p-6 rounded-xl space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-red-500 font-bold text-sm">
                <Database className="h-4.5 w-4.5" />
                <span>{isZh ? "A股实时行情与持久化数据链" : "A-Share Quotation & DB Pipeline"}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isZh ? "专为国内A股设计的行情获取架构，保障低延迟、高并发和数据的客观稳固。" : "Engineered for high-frequency domestic A-shares data, ensuring robustness and consistency."}
              </p>
              <ul className="space-y-2.5 text-[11px] text-muted-foreground">
                <li className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>{isZh ? "通达信 TCP 行情网关" : "TDX TCP行情网关"}</strong>：{isZh ? "直连通达信行情，建立多测速池自动心跳与断线重连；网络超时自动降级至腾讯 L1 HTTP。" : "Low-latency TCP connection pool with auto speed checks and heartbeats; fallbacks to Tencent HTTP."}</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>{isZh ? "公共数据共享缓存" : "Shared memory Cache"}</strong>：{isZh ? "交易时间内单线程高频轮询指数和题材板块并存入内存公库，防止多租户并发访问触发券商封 IP 机制。" : "Global cache wheels index/sector quotes every 5s during trading hours to prevent IP bans."}</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>{isZh ? "自动收盘维护" : "Daily Close Maintenance"}</strong>：{isZh ? "每日 15:30 自动拉取基本面估值、题材板块映射、主力资金流向及两融杠杆，多节点补偿校验写入 local DB。" : "Scheduler polls valuation, funding flow, and margin data at 15:30 to rebuild stocks.db."}</span>
                </li>
              </ul>
            </div>
            <div className="p-3 bg-muted/40 rounded-lg border border-border/40 text-[10px] font-mono text-muted-foreground">
              {isZh ? "A股数据链: TDX TCP -> SharedMemory -> sqlite:stocks.db" : "A-Share Pipeline: TDX TCP -> SharedMemory -> sqlite:stocks.db"}
            </div>
          </div>

          {/* Right Column: H-Shares / Live Trading */}
          <div className="border border-border/80 bg-card p-6 rounded-xl space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-cyan-500 font-bold text-sm">
                <ShieldAlert className="h-4.5 w-4.5" />
                <span>{isZh ? "港股实盘/模拟交易风控链" : "H-Share Live & Risk Pipeline"}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isZh ? "通过可信连接器接入港股实盘（长桥、富途等），并实施严格的防暴走风控。" : "Connects to HK broker APIs with strict multi-layered safeguards against trade runs."}
              </p>
              <ul className="space-y-2.5 text-[11px] text-muted-foreground">
                <li className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>{isZh ? "OAuth 授权与只读默认" : "OAuth & Read-only Default"}</strong>：{isZh ? "券商接口优先仅赋予账户资产及持仓只读权限，只有当发生明确交易委托签署时才唤醒交易通道。" : "OAuth defaults to read-only summaries unless explicit credentials and trading keys are injected."}</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>{isZh ? "限额风控委托 (Mandates)" : "Trade Mandates"}</strong>：{isZh ? "每个连接均绑定委托规则（包含标的 Universe、单笔额度上限、到期日），超出限额的下单在前端即被直接驳回。" : "Every broker session must bind a mandate defining valid stock pool, size, and expiry."}</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>{isZh ? "全局紧急熔断闸 (Halt Switch)" : "Global Halt Switch"}</strong>：{isZh ? "系统后台提供一键紧急挂起。启用后，所有活跃交易连接将瞬间失效，任何下单指令直接返回失败。" : "One-click halt instantly suspends all runners, declining order requests immediately."}</span>
                </li>
              </ul>
            </div>
            <div className="p-3 bg-muted/40 rounded-lg border border-border/40 text-[10px] font-mono text-muted-foreground">
              {isZh ? "风控链: Broker API -> OAuth Token -> Mandate limits -> Global Halt" : "Risk Pipeline: Broker API -> OAuth Token -> Mandate limits -> Global Halt"}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Best Configuration Wizard */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl md:text-2xl font-bold">{isZh ? "系统最佳配置向导" : "System Configuration Wizard"}</h2>
          <p className="text-xs text-muted-foreground max-w-xl mx-auto">
            {isZh ? "新手开发者或交易员请按照以下步骤，快速配齐工作空间的核心基建配置。" : "Follow these steps to configure your quant environment keys and backtest engines."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div className="border border-border/60 bg-card p-5 rounded-xl space-y-3 relative">
            <div className="absolute top-4 right-4 text-2xl font-black text-primary/10">01</div>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/5 text-primary border border-primary/10">
              <UserCircle2 className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-xs">{isZh ? "步骤一：解锁后台" : "Step 1: Unlock Page"}</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {isZh
                ? "前往「设置」页面，先输入您的系统 API 认证密钥以解锁敏感设置项。"
                : "Navigate to Settings and enter your system password to unlock options."}
            </p>
          </div>

          {/* Step 2 */}
          <div className="border border-border/60 bg-card p-5 rounded-xl space-y-3 relative">
            <div className="absolute top-4 right-4 text-2xl font-black text-primary/10">02</div>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/5 text-primary border border-primary/10">
              <Cpu className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-xs">{isZh ? "步骤二：大模型后端" : "Step 2: LLM Backend"}</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {isZh
                ? "选择大语言模型服务商，填写正确的模型名称、基础 URL 和 API 认证密钥并保存。"
                : "Choose a provider (OpenAI, Gemini), input the model name, base URL, and key."}
            </p>
          </div>

          {/* Step 3 */}
          <div className="border border-border/60 bg-card p-5 rounded-xl space-y-3 relative">
            <div className="absolute top-4 right-4 text-2xl font-black text-primary/10">03</div>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/5 text-primary border border-primary/10">
              <Database className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-xs">{isZh ? "步骤三：配置数据源" : "Step 3: Data Sources"}</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {isZh
                ? "填写您的 Tushare 令牌；如果无密钥，系统会自动降级启用 Baostock 行情源。"
                : "Paste your Tushare API Token or leave empty to default to the TCP Baostock handler."}
            </p>
          </div>

          {/* Step 4 */}
          <div className="border border-border/60 bg-card p-5 rounded-xl space-y-3 relative">
            <div className="absolute top-4 right-4 text-2xl font-black text-primary/10">04</div>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/5 text-primary border border-primary/10">
              <Wrench className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-xs">{isZh ? "步骤四：监控与测试" : "Step 4: Verify"}</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {isZh
                ? "前往「服务监控」看板刷新网关，看到正常的 TCP 延迟指标后，即代表配置成功！"
                : "Open Monitor dashboard, refresh, verify connection latency and start testing."}
            </p>
          </div>
        </div>

        <div className="text-center pt-4">
          <Link
            to="/settings"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md border border-primary text-primary bg-primary/5 hover:bg-primary/10 transition"
          >
            <Settings className="h-3.5 w-3.5" />
            {isZh ? "立即前往配置设置" : "Configure Settings Now"}
          </Link>
        </div>
      </section>

      {/* 6. Help Info / Platforms */}
      <footer className="pt-8 border-t border-border/60 flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
        <div className="flex items-center gap-1">
          <HelpCircle className="h-4 w-4" />
          <span>{isZh ? "有疑问？请阅读共享技能使用指引" : "Need help? Check local platform guide skill."}</span>
        </div>
        <div>
          <span>&copy; 2026 Vibe-Trading-CNX. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
