type HotkeySetting = 'hotkey' | 'priceCheckHotkey'

type HotkeyStore = {
  get(key: HotkeySetting): string
  set(key: HotkeySetting, value: string): void
}

// Older macOS builds persisted KeyboardEvent.key for Option-letter shortcuts.
// For example, Option+D became a glyph, which neither Electron nor uiohook can
// bind after a restart. These are the corresponding keys on the macOS layout
// that produced the existing stored values.
const LEGACY_MAC_OPTION_GLYPHS: Readonly<Record<string, string>> = {
  '\u00c5': 'A',
  '\u222b': 'B',
  '\u00c7': 'C',
  '\u2202': 'D',
  '\u0192': 'F',
  '\u00a9': 'G',
  '\u0131': 'I',
  '\u2206': 'J',
  '\u00ac': 'L',
  '\u00b5': 'M',
  '\u00d8': 'O',
  '\u03c0': 'P',
  '\u0152': 'Q',
  '\u00ae': 'R',
  '\u00df': 'S',
  '\u2020': 'T',
  '\u221a': 'V',
  '\u2211': 'W',
  '\u2248': 'X',
  '\u00a5': 'Y',
  '\u03a9': 'Z',
  '\u00a1': '1',
  '\u2122': '2',
  '\u00a3': '3',
  '\u00a2': '4',
  '\u221e': '5',
  '\u00a7': '6',
  '\u00b6': '7',
  '\u2022': '8',
  '\u00aa': '9',
  '\u00ba': '0',
}

/** Convert a persisted legacy Option-glyph hotkey into a bindable accelerator. */
export function migrateLegacyHotkey(accelerator: string): string {
  const lastPlus = accelerator.lastIndexOf('+')
  const prefix = lastPlus < 0 ? '' : accelerator.slice(0, lastPlus + 1)
  const key = accelerator.slice(lastPlus + 1)
  return prefix + (LEGACY_MAC_OPTION_GLYPHS[key] ?? key)
}

/** Persist every global hotkey that needs the legacy macOS glyph conversion. */
export function migrateLegacyHotkeys(store: HotkeyStore): HotkeySetting[] {
  const migrated: HotkeySetting[] = []
  for (const key of ['hotkey', 'priceCheckHotkey'] as const) {
    const current = store.get(key)
    const next = migrateLegacyHotkey(current)
    if (next === current) continue
    store.set(key, next)
    migrated.push(key)
  }
  return migrated
}
