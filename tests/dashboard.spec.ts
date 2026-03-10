import { test, expect } from '@playwright/test';

test.describe('Dashboard Page', () => {
	test('should load the dashboard page', async ({ page }) => {
		await page.goto('/dashboard');

		// 检查页面标题
		await expect(page).toHaveTitle(/dozto-payment-h5/i);
	});

	test('should display sidebar navigation', async ({ page }) => {
		await page.goto('/dashboard');

		// 等待侧边栏加载
		const sidebar = page.locator('[role="navigation"]').first();
		await expect(sidebar).toBeVisible();
	});

	test('should display section cards', async ({ page }) => {
		await page.goto('/dashboard');

		// 检查统计卡片是否显示
		// 根据实际的卡片结构调整选择器
		const cards = page.locator('[class*="card"]');
		await expect(cards.first()).toBeVisible({ timeout: 10000 });
	});

	test('should display order list heading', async ({ page }) => {
		await page.goto('/dashboard');

		// 检查订单列表标题
		const heading = page.getByRole('heading', { name: /订单列表/i });
		await expect(heading).toBeVisible();
	});

	test('should handle loading state', async ({ page }) => {
		await page.goto('/dashboard');

		// 检查加载状态或数据显示
		const loadingOrData = page.locator('text=/Loading|订单/i').first();
		await expect(loadingOrData).toBeVisible({ timeout: 10000 });
	});
});
