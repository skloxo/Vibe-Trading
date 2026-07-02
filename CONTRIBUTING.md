# Contributing to Vibe-Trading-CNX

Vibe-Trading-CNX 是一个面向 A 股与港股市场的独立开源智能投研工作站。

本文件说明如何参与贡献。

---

## 开发环境快速启动

`ash
# 克隆仓库
git clone https://github.com/skloxo/Vibe-Trading-CNX.git
cd Vibe-Trading-CNX

# 启动开发容器（推荐）
docker compose up vibe-trading-dev

# 或本地安装依赖
pip install -e '.[dev]'
cd frontend && npm install && npm run dev
`

## 提交规范

提交信息请遵循 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

`
<type>(<scope>): <description>

类型（type）说明：
  feat     新功能
  fix      Bug 修复
  docs     文档更新
  style    格式调整（不影响逻辑）
  refactor 重构
  test     测试相关
  chore    构建/工具/依赖更新
  ui       前端界面改动
  data     数据层改动
`

示例：
`
feat(watchlist): 支持同花顺自选股双向同步
fix(tdx): 修复分批请求 URL 超长问题
ui(dashboard): 玻璃态卡片去重重构
`

## 开发流程

1. **Fork & Branch**：从 main 分支创建特性分支，命名格式 eature/cnx-<描述> 或 hotfix/cnx-<描述>。
2. **开发与测试**：在 dev 容器（:9888）中验证改动，确保核心单元测试通过：
   `ash
   pytest agent/tests/ --ignore=agent/tests/e2e_backtest -x
   `
3. **提交 PR**：提交 Pull Request 到 main，描述改动目的与影响范围。

## 代码风格

- **Python**：遵循 uff 格式检查规则（见 pyproject.toml）
- **TypeScript/React**：遵循项目 ESLint 配置
- **中文注释优先**：涉及业务逻辑的注释请用中文

## 上游参考

本项目从 [HKUDS/Vibe-Trading](https://github.com/HKUDS/Vibe-Trading) 演化而来，已于 2026-07 完全独立。
如需参考上游最新进展，使用项目内置的追踪脚本：

`ash
bash scripts/sync-upstream.sh --check
`

## 问题反馈

- **Bug 报告**：请通过 [GitHub Issues](https://github.com/skloxo/Vibe-Trading-CNX/issues) 提交，附上复现步骤与环境信息。
- **功能建议**：欢迎提 Issue 或 Discussion 讨论。

---

感谢每一位贡献者！🎉
