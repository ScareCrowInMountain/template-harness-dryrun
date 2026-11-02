# 第 4 节 工程门禁与交接（AI 辅助开发准则）

> 说明：本节为重写稿。原文第 1–4 条未在本次会话中保留，下文第 1–4 条按同一主题推定并补写；第 5–8 条按原建议重写。每条都给出"规则"与"落地方式"，落地方式对应模板仓库 `template-ts-supabase` 中的具体文件。

## 4.1 先有验收标准，再写代码

**规则**：每个任务开始前写清输入、输出、边界情况和"做到什么算完成"。AI 没有验收标准就会自己脑补一个。

**落地**：PR 模板第一栏 "What / Why" 必填并链接 issue；没有 issue 的 PR 由审查者直接退回。

## 4.2 测试和类型是硬门禁，不是建议

**规则**：严格 TypeScript（禁 `any`、禁未处理的 Promise）；覆盖率行 ≥ 80%、分支 ≥ 70%，低于阈值 CI 直接失败。阈值只能升不能降，降一次要在 `INCIDENTS.md` 记一笔。

**落地**：`tsconfig.json`、`eslint.config.js`、`vitest.config.ts`；CI 任务 `lint` `typecheck` `test`。

## 4.3 密钥不入库，依赖有清单

**规则**：所有配置走环境变量，`.env.example` 是唯一清单，启动时用 schema 校验，缺一项就起不来。密钥扫描每个 PR 跑一次、每周全量跑一次；高危依赖漏洞阻断合并。

**落地**：`src/lib/env.ts`、`.env.example`、`security.yml`（gitleaks、`pnpm audit`、CodeQL）、Dependabot。

## 4.4 主干受保护，所有改动走 PR

**规则**：`main` 禁止直推，线性历史，至少一位 CODEOWNER 批准，新提交后旧批准失效，管理员不豁免。每张数据表创建时同一个迁移里开 RLS，没开 RLS 的表 CI 失败。

**落地**：`scripts/setup-branch-protection.sh`、`.github/CODEOWNERS`、CI 任务 `db-migrations`。

## 4.5 限制体量

**规则**：AI 容易写出超大文件和超长函数。函数 ≤ 50 行、文件 ≤ 300 行、圈复杂度 ≤ 10、参数 ≤ 4、嵌套 ≤ 3 层，超了 lint 报错。单个 PR 改动不超过 400 行（不含 lockfile、快照、生成代码），超了拆开。纯移动/重命名或生成代码可加 `size-exempt` 标签，但要在 PR 里写原因，审查者确认。

**落地**：`eslint.config.js` 的 size 规则组；`pr-size.yml` + `scripts/check-pr-size.sh`。

## 4.6 研发接手前的检查清单

**规则**：以下任一项不满足，研发不接：

1. 从干净 clone 能本地跑起来；
2. 有 README 和运维手册（Runbook），手册里没有 `TODO`；
3. 依赖和密钥清单完整，每个变量有存放位置、轮换周期、负责人；
4. 有明确负责人和值班安排；
5. 监控和告警已接通，测试告警能到达频道；
6. 回滚方式已经演练过，手册里记录了日期和执行人。

**落地**：`docs/HANDOVER.md`（12 行逐项签字）、`docs/RUNBOOK.md` 模板。

## 4.7 出过的事故变成自动检查

**规则**：每次事故复盘的产出物是一条 lint 规则、一个测试或一项 CI 检查，不是准则里多一句话。写在文档里的规则时间一长没人记得，写进 CI 的会一直执行。事故 issue 没有附上"已加检查"链接不允许关闭。

**落地**：`docs/INCIDENTS.md`（日期 / 事故 / 根因 / 检查链接 四列表），issue 模板 `incident` 的必填项。

## 4.8 可以让第二个 AI 做审查，但不能代替人

**规则**：用另一个模型对每个 PR 做独立审查，只看安全和逻辑问题，不评论风格；结果以单条评论发出，作为人工审查的清单。AI 账号不在 CODEOWNERS 里、没有批准权限，分支保护仍要求人批准。最后批准必须是人。

**落地**：`ai-review.yml`（comment only）+ 分支保护的 `require_code_owner_reviews`。
