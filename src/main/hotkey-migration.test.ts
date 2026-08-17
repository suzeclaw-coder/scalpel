import { describe, expect, it, vi } from 'vitest'
import { migrateLegacyHotkey, migrateLegacyHotkeys } from './hotkey-migration'

describe('migrateLegacyHotkey', () => {
  it('converts legacy macOS Option-letter glyphs to bindable physical keys', () => {
    expect(migrateLegacyHotkey('CommandOrControl+Alt+\u2202')).toBe('CommandOrControl+Alt+D')
    expect(migrateLegacyHotkey('CommandOrControl+Alt+\u00c5')).toBe('CommandOrControl+Alt+A')
  })

  it('preserves current and unknown accelerators unchanged', () => {
    expect(migrateLegacyHotkey('CommandOrControl+Shift+F')).toBe('CommandOrControl+Shift+F')
    expect(migrateLegacyHotkey('CommandOrControl+Phys:Semicolon:\u00c6')).toBe('CommandOrControl+Phys:Semicolon:\u00c6')
    expect(migrateLegacyHotkey('CommandOrControl+Alt+\u00c6')).toBe('CommandOrControl+Alt+\u00c6')
  })
})

describe('migrateLegacyHotkeys', () => {
  it('updates both persisted global hotkeys and leaves valid values alone', () => {
    const values = {
      hotkey: 'CommandOrControl+Alt+\u2202',
      priceCheckHotkey: 'CommandOrControl+Alt+\u00c5',
    }
    const store = {
      get: (key: keyof typeof values) => values[key],
      set: vi.fn((key: keyof typeof values, value: string) => {
        values[key] = value
      }),
    }

    expect(migrateLegacyHotkeys(store)).toEqual(['hotkey', 'priceCheckHotkey'])
    expect(values).toEqual({
      hotkey: 'CommandOrControl+Alt+D',
      priceCheckHotkey: 'CommandOrControl+Alt+A',
    })
    expect(migrateLegacyHotkeys(store)).toEqual([])
  })
})
