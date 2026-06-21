import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/register');
});

test('register - formulaire vide - bouton désactivé', async ({ page }) => {
    await expect(page.getByRole('button', { name: "S'inscrire" })).toBeDisabled();
});

test('register - mots de passe différents - bouton désactivé', async ({ page }) => {
    await page.getByLabel('Prénom').fill('Jean');
    await page.getByLabel('Nom').fill('Dupont');
    await page.getByLabel('Adresse email').fill('jean@test.com');
    await page.getByLabel('Mot de passe').fill('Password1!');
    await page.getByLabel('Confirmer le mot de passe').fill('AutrePassword!');
    await expect(page.getByRole('button', { name: "S'inscrire" })).toBeDisabled();
});

test('register - formulaire valide - bouton activé', async ({ page }) => {
    await page.getByLabel('Prénom').fill('Jean');
    await page.getByLabel('Nom').fill('Dupont');
    await page.getByLabel('Adresse email').fill('jean@test.com');
    await page.getByLabel('Mot de passe').fill('Password1!');
    await page.getByLabel('Confirmer le mot de passe').fill('Password1!');
    await expect(page.getByRole('button', { name: "S'inscrire" })).toBeEnabled();
});

test('register - email déjà utilisé - affiche un message d\'erreur', async ({ page }) => {
    await page.getByLabel('Prénom').fill('Jean');
    await page.getByLabel('Nom').fill('Dupont');
    await page.getByLabel('Adresse email').fill('existant@escvoting.com');
    await page.getByLabel('Mot de passe').fill('Password1!');
    await page.getByLabel('Confirmer le mot de passe').fill('Password1!');
    await page.getByRole('button', { name: "S'inscrire" }).click();
    await expect(page.locator('.error-banner')).toBeVisible();
});

test('register - lien connexion - navigue vers login', async ({ page }) => {
    await page.getByRole('link', { name: 'Se connecter' }).click();
    await expect(page).toHaveURL(/.*login/);
});
