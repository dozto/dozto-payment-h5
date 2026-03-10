# E2E Tests

本项目使用 [Playwright](https://playwright.dev/) 进行端到端测试。

## 运行测试

```bash
# 运行所有 E2E 测试（无头模式）
bun run e2e

# 使用 UI 模式运行测试（推荐用于开发）
bun run e2e:ui

# 在有界面的浏览器中运行测试
bun run e2e:headed

# 调试模式运行测试
bun run e2e:debug

# 查看测试报告
bun run e2e:report
```

## 运行单个测试文件

```bash
# 运行特定测试文件
playwright test tests/dashboard.spec.ts

# 运行特定测试（使用 grep 过滤）
playwright test -g "should load the dashboard page"
```

## 编写测试

测试文件应该放在 `tests/` 目录下，使用 `.spec.ts` 后缀命名。

示例测试：

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
	test('should do something', async ({ page }) => {
		await page.goto('/some-page');
		await expect(page.getByRole('heading')).toBeVisible();
	});
});
```

## 浏览器配置

默认配置会在以下浏览器中运行测试：

- Chromium
- Firefox
- WebKit (Safari)

可以在 `playwright.config.ts` 中修改配置。

## 首次设置

如果是第一次运行测试，需要先安装浏览器：

```bash
bunx playwright install
```

或者只安装 Chromium（更快）：

```bash
bunx playwright install chromium
```
