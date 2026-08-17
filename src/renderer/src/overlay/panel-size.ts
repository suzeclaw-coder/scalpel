import type { OverlayPanelSize } from '@shared/types'

// The title bar holds the core game tools, optional plugin tabs, settings, and
// close control in one fixed rail. 640px keeps that rail fully visible without
// needing a wrapped or scrollable navigation row.
export const DEFAULT_PANEL_WIDTH = 640
export const MIN_PANEL_WIDTH = 640
export const MIN_PANEL_HEIGHT = 300

export interface PanelSizeLimits {
  maxWidth: number
  maxHeight: number
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(Math.min(value, max), Math.min(min, max))
}

export function clampPanelSize(size: OverlayPanelSize, limits: PanelSizeLimits): OverlayPanelSize {
  return {
    width: clamp(size.width, MIN_PANEL_WIDTH, limits.maxWidth),
    height: clamp(size.height, MIN_PANEL_HEIGHT, limits.maxHeight),
  }
}

export function resizePanel(
  start: OverlayPanelSize,
  deltaX: number,
  deltaY: number,
  side: 'left' | 'right',
  scale: number,
  limits: PanelSizeLimits,
): OverlayPanelSize {
  const cssDeltaX = deltaX / Math.max(scale, 0.01)
  const cssDeltaY = deltaY / Math.max(scale, 0.01)
  return clampPanelSize(
    {
      // A right-docked panel is anchored on its outer edge, so dragging the
      // bottom-right grip left expands it inward instead of past the game HUD.
      width: start.width + (side === 'right' ? -cssDeltaX : cssDeltaX),
      height: start.height + cssDeltaY,
    },
    limits,
  )
}
