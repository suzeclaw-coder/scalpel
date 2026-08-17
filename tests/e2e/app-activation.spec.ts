import { expect, test } from '@playwright/test'
import { launchScalpelE2E } from './helpers/electron'

test('reveals the hidden app window when the application is activated', async () => {
  const scalpel = await launchScalpelE2E()
  try {
    await scalpel.app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0]?.hide())
    await expect
      .poll(() => scalpel.app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0]?.isVisible()))
      .toBe(false)

    await scalpel.app.evaluate(({ app }) => app.emit('activate'))
    await expect
      .poll(() => scalpel.app.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0]?.isVisible()))
      .toBe(true)
  } finally {
    await scalpel.cleanup()
  }
})
