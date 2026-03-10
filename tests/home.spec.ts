import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
	test('should load the home page', async ({ page }) => {
		await page.goto('/');

		// 检查页面加载成功
		await expect(page).toHaveTitle(/dozto-payment-h5/i);
	});

	test('should be accessible', async ({ page }) => {
		await page.goto('/');

		// 基本的可访问性检查 - 页面应该有内容
		const body = page.locator('body');
		await expect(body).not.toBeEmpty();
	});
});
