import { test, expect } from '@playwright/test'

test.describe('ListInterns E2E', () => {
  test('should open Add User modal and add a new user', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/User list/i)
    const addUserButton = page.locator('button.add-user-btn')
    await expect(addUserButton).toBeVisible()
    await addUserButton.click()
    const modalTitle = page.locator('.add-user-title')
    await expect(modalTitle).toBeVisible()
    await expect(modalTitle).toHaveText('Add New User')
    const firstNameInput = page.locator('input[placeholder="Enter first name"]')
    const lastNameInput = page.locator('input[placeholder="Enter last name"]')
    await firstNameInput.fill('Jan')
    await lastNameInput.fill('Kowalski')
    const submitButton = page.locator('.submit-btn')
    await expect(submitButton).toBeVisible()
    await submitButton.click()
    await page.waitForResponse(
      response =>
        response.url().includes('https://reqres.in/api/users') &&
        response.status() === 201,
    )
    const msgLocator = page.locator('.n-notification-main')
    const titleLocator = page.locator('.n-notification-main__header')
    await expect(msgLocator).toBeVisible()
    await expect(titleLocator).toBeVisible()
    await expect(titleLocator).toHaveText('Success')
  })
})
