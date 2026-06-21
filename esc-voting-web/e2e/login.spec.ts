import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/login');
});

test('login - credentials valides - redirige vers my-tops', async ({ page }) => {
    await page.getByLabel('Adresse email').fill('test@escvoting.com');
    await page.getByLabel('Mot de passe').fill('Password1!');
    await page.getByRole('button', { name: 'Se connecter' }).click();
    await page.waitForURL('**/my-tops');
    await expect(page).toHaveURL(/.*my-tops/);
});

test('login - mauvais mot de passe - affiche un message d\'erreur', async ({ page }) => {
    await page.getByLabel('Adresse email').fill('test@escvoting.com');
    await page.getByLabel('Mot de passe').fill('mauvaismdp');
    await page.getByRole('button', { name: 'Se connecter' }).click();
    await expect(page.locator('.error-message')).toBeVisible();
});

test('login - lien inscription - navigue vers register', async ({ page }) => {
    await page.getByRole('link', { name: 'Creer un compte' }).click();
    await expect(page).toHaveURL(/.*register/);
});

test('login - toggle mot de passe - bascule la visibilité', async ({ page }) => {
    const input = page.getByLabel('Mot de passe');
    await input.fill('monmotdepasse');
    await expect(input).toHaveAttribute('type', 'password');
    await page.locator('.password-toggle').click();
    await expect(input).toHaveAttribute('type', 'text');
});
