import re

readme_path = '/home/skloxo/aho/openclaw/project/Vibe-Trading/README.md'
with open(readme_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update navigation bar link
content = content.replace('<a href="#-api-服务">API / MCP</a>', '<a href="#-api-与-mcp-服务">API / MCP</a>')

# 2. Update Skill table categories
old_table = """| Data Source | 7 | `data-routing`, `tushare`, `yfinance`, `okx-market`, `akshare`, `mootdx`, `ccxt` |
| Strategy | 17 | `strategy-generate`, `cross-market-strategy`, `technical-basic`, `candlestick`, `ichimoku`, `elliott-wave`, `smc`, `multi-factor`, `ml-strategy` |
| Analysis | 17 | `factor-research`, `macro-analysis`, `global-macro`, `valuation-model`, `earnings-forecast`, `credit-analysis`, `dividend-analysis` |
| Asset Class | 9 | `options-strategy`, `options-advanced`, `convertible-bond`, `etf-analysis`, `asset-allocation`, `sector-rotation` |
| Crypto | 7 | `perp-funding-basis`, `liquidation-heatmap`, `stablecoin-flow`, `defi-yield`, `onchain-analysis` |
| Flow | 7 | `hk-connect-flow`, `us-etf-flow`, `edgar-sec-filings`, `financial-statement`, `adr-hshare` |
| Tool | 11 | `backtest-diagnose`, `report-generate`, `pine-script`, `doc-reader`, `web-reader`, `vnpy-export`, `alpha-zoo` |
| Risk Analysis | 1 | `ashare-pre-st-filter` |"""

new_table = """| 数据源 (Data Source) | 7 | `data-routing`, `tushare`, `yfinance`, `okx-market`, `akshare`, `mootdx`, `ccxt` |
| 交易策略 (Strategy) | 17 | `strategy-generate`, `cross-market-strategy`, `technical-basic`, `candlestick`, `ichimoku`, `elliott-wave`, `smc`, `multi-factor`, `ml-strategy` |
| 投研分析 (Analysis) | 17 | `factor-research`, `macro-analysis`, `global-macro`, `valuation-model`, `earnings-forecast`, `credit-analysis`, `dividend-analysis` |
| 资产类别 (Asset Class) | 9 | `options-strategy`, `options-advanced`, `convertible-bond`, `etf-analysis`, `asset-allocation`, `sector-rotation` |
| 加密货币 (Crypto) | 7 | `perp-funding-basis`, `liquidation-heatmap`, `stablecoin-flow`, `defi-yield`, `onchain-analysis` |
| 资金流向 (Flow) | 7 | `hk-connect-flow`, `us-etf-flow`, `edgar-sec-filings`, `financial-statement`, `adr-hshare` |
| 核心工具 (Tool) | 11 | `backtest-diagnose`, `report-generate`, `pine-script`, `doc-reader`, `web-reader`, `vnpy-export`, `alpha-zoo` |
| 风险分析 (Risk Analysis) | 1 | `ashare-pre-st-filter` |"""

content = content.replace(old_table, new_table)

# 3. Update summary headers
content = content.replace('<summary><b>Finance Skill Library</b>', '<summary><b>金融能力库 (Finance Skill Library)</b>')
content = content.replace('<summary><b>Preset Trading Teams</b>', '<summary><b>预设交易团队 (Preset Trading Teams)</b>')
content = content.replace('<summary><b>Alpha Zoo</b>', '<summary><b>Alpha 因子库 (Alpha Zoo)</b>')
content = content.replace('<summary><b>TUI 内 slash commands</b></summary>', '<summary><b>TUI 终端快捷指令 (Slash Commands)</b></summary>')
content = content.replace('<summary><b>Single run 与 flags</b></summary>', '<summary><b>单次运行命令与参数 (Single run & flags)</b></summary>')
content = content.replace('<summary><b>Claude Desktop</b></summary>', '<summary><b>Claude Desktop 客户端配置</b></summary>')
content = content.replace('<summary><b>OpenClaw</b></summary>', '<summary><b>OpenClaw 配置</b></summary>')
content = content.replace('<summary><b>Cursor / Windsurf / other MCP clients</b></summary>', '<summary><b>Cursor / Windsurf 及其他 MCP 客户端配置</b></summary>')
content = content.replace('<summary><b>OpenSpace — 自进化 skills</b></summary>', '<summary><b>OpenSpace — 自进化金融能力集成</b></summary>')

# 4. Fold paths in Quick Start
# Path A
content = content.replace(
    '### Path A: Docker（零配置）\n\n```bash',
    '<details>\n<summary><b>🐳 Path A: Docker 部署（零配置，点击展开）</b></summary>\n\n### Path A: Docker（零配置）\n\n```bash'
)

# Path B
content = content.replace(
    '### Path B: 本地安装\n\n```bash',
    '</details>\n\n<details>\n<summary><b>💻 Path B: 本地源码安装与开发（点击展开）</b></summary>\n\n### Path B: 本地安装\n\n```bash'
)

# Path C
content = content.replace(
    '### Path C: MCP 插件接入\n\n见下方 [MCP Plugin](#-mcp-plugin) 章节。',
    '</details>\n\n<details>\n<summary><b>🔌 Path C: MCP 插件接入（点击展开）</b></summary>\n\n见下方 [MCP 插件](#-api-与-mcp-服务) 章节。\n</details>'
)

# Path D
content = content.replace(
    '### Path D: ClawHub 一键安装\n\n```bash',
    '<details>\n<summary><b>📦 Path D: ClawHub 一键安装（点击展开）</b></summary>\n\n### Path D: ClawHub 一键安装\n\n```bash'
)

# Close Path D and open Environment variables
old_env_start = """skill + MCP config 会下载到你的智能体 skills 目录。详情见 [ClawHub install](#-mcp-plugin)。

---

<details>
<summary><b>🧠 环境变量配置（点击展开）</b></summary>"""

new_env_start = """skill + MCP config 会下载到你的智能体 skills 目录。详情见 [MCP 插件](#-api-与-mcp-服务)。
</details>

---

<details>
<summary><b>🧠 环境变量配置（.env 属性详解，点击展开）</b></summary>"""

content = content.replace(old_env_start, new_env_start)

# Close Env config and open Recommended Models
old_models_start = """**免费数据（无需 key）：** A 股通过 AKShare，港/美股通过 yfinance，加密通过 OKX，100+ 加密交易所通过 CCXT。系统会为每个市场自动选择最佳可用数据源。

### 🎯 推荐模型"""

new_models_start = """**免费数据（无需 key）：** A 股通过 AKShare，港/美股通过 yfinance，加密通过 OKX，100+ 加密交易所通过 CCXT。系统会为每个市场自动选择最佳可用数据源。

</details>

<details>
<summary><b>🎯 推荐的大语言模型（LLM）配置建议（点击展开）</b></summary>

### 🎯 推荐模型"""

content = content.replace(old_models_start, new_models_start)

# Close Recommended Models and open CLI Reference
old_cli_start = """默认 `agent/.env.example` 使用 DeepSeek 官方 API + `deepseek-v4-pro`；OpenRouter 用户可以使用 `deepseek/deepseek-v4-pro`。

---

</details>
<details>
<summary><b>🖥 CLI 参考（点击展开）</b></summary>"""

new_cli_start = """默认 `agent/.env.example` 使用 DeepSeek 官方 API + `deepseek-v4-pro`；OpenRouter 用户可以使用 `deepseek/deepseek-v4-pro`。

</details>

---

<details>
<summary><b>🖥 CLI 命令行与交互式 TUI 指南（点击展开）</b></summary>"""

content = content.replace(old_cli_start, new_cli_start)


# 5. API and MCP / Project Structure H2 headers and details
old_api_start = """vibe-trading-cnx run -p "总结该比亚迪季度财报中的核心风险及与业绩预期偏差"
```
</details>


---

<details>
<summary><b>🌐 API 服务（点击展开）</b></summary>"""

new_api_start = """vibe-trading-cnx run -p "总结该比亚迪季度财报中的核心风险及与业绩预期偏差"
```
</details>


---

## 🔌 API 与 MCP 服务

为保持主 README 易读，API 服务与 MCP 插件的详细配置及接口说明折叠在下方。

<details>
<summary><b>🌐 API 服务接口与安全策略（点击展开）</b></summary>"""

content = content.replace(old_api_start, new_api_start)

# MCP Plugin details rename
old_mcp_start = """---

</details>
<details>
<summary><b>🔌 MCP 插件（点击展开）</b></summary>"""

new_mcp_start = """---

</details>

<details>
<summary><b>🔌 MCP 插件与客户端集成配置（点击展开）</b></summary>"""

content = content.replace(old_mcp_start, new_mcp_start)

# Project structure H2 header and details
old_project_start = """</details>

---

</details>
<details>
<summary><b>📁 项目结构（点击展开）</b></summary>


<details>
<summary><b>点击展开</b></summary>"""

new_project_start = """</details>

---

</details>

## 📁 项目结构

为保持主 README 易读，详细的项目源码与目录结构折叠在下方。

<details>
<summary><b>📁 项目源码与目录结构（点击展开）</b></summary>"""

content = content.replace(old_project_start, new_project_start)

with open(readme_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Formatting completed successfully!")
