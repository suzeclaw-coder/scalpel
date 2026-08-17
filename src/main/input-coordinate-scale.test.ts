import { describe, expect, it } from 'vitest'
import { inputCoordinateScaleFactor } from './input-coordinate-scale'

describe('inputCoordinateScaleFactor', () => {
  it('keeps macOS pointer hit testing in Quartz points on Retina displays', () => {
    expect(inputCoordinateScaleFactor('darwin', 2)).toBe(1)
  })

  it('uses the display scale for Windows and Linux physical pointer coordinates', () => {
    expect(inputCoordinateScaleFactor('win32', 1.5)).toBe(1.5)
    expect(inputCoordinateScaleFactor('linux', 2)).toBe(2)
  })
})
