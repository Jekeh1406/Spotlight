import { test, expect } from '@playwright/test';

// Pitfall 3 — Isolation : connexion via UI avant chaque test
test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Adresse email').fill('test@escvoting.com');
    await page.getByLabel('Mot de passe').fill('Password1!');
    await page.getByRole('button', { name: 'Se connecter' }).click();
    await page.waitForURL('**/my-tops');
});

test('vote - cliquer sur une chanson - ouvre la modale de vote', async ({ page }) => {
    // Pitfall 1 — locator cible l'élément cliquable visible par l'utilisateur
    await page.locator('.unvoted-item').first().click();

    // Pitfall 2 — toBeVisible() attend automatiquement l'ouverture de la modale
    await expect(page.locator('.modal.active')).toBeVisible();
    await expect(page.getByText('🎤 Voix')).toBeVisible();
});

test('vote - fermer la modale - revient à la liste', async ({ page }) => {
    await page.locator('.unvoted-item').first().click();
    await expect(page.locator('.modal.active')).toBeVisible();

    await page.getByRole('button', { name: 'Annuler' }).click();

    // Pitfall 2 — toBeHidden() attend automatiquement la fermeture
    await expect(page.locator('.modal.active')).toBeHidden();
});
