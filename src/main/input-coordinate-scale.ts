/**
 * uiohook and the target-window tracker both use Quartz screen points on
 * macOS. Electron renderer rects and BrowserWindow bounds use that same unit,
 * so Retina display scale must not be applied there. The native Windows and
 * Linux backends report physical pixels, where the display scale is required.
 */
export function inputCoordinateScaleFactor(platform: NodeJS.Platform, displayScaleFactor: number): number {
  return platform === 'darwin' ? 1 : displayScaleFactor
}
