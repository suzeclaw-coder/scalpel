import { describe, expect, it } from 'vitest'
import { clampPanelSize, DEFAULT_PANEL_WIDTH, resizePanel } from './panel-size'

const limits = { maxWidth: 900, maxHeight: 700 }

describe('panel size', () => {
  it('keeps the title bar wide enough for its navigation controls', () => {
    expect(clampPanelSize({ width: 320, height: 120 }, limits)).toEqual({ width: DEFAULT_PANEL_WIDTH, height: 300 })
  })

  it('grows a right-docked panel inward when its bottom-right grip moves left', () => {
    expect(resizePanel({ width: 640, height: 420 }, -80, 40, 'right', 1, limits)).toEqual({
      width: 720,
      height: 460,
    })
  })

  it('uses CSS-pixel deltas when the overlay is scaled', () => {
    expect(resizePanel({ width: 640, height: 420 }, 60, 60, 'left', 1.5, limits)).toEqual({
      width: 680,
      height: 460,
    })
  })
})
