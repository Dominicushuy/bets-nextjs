'use client'

import { useState, useEffect, useRef } from 'react'
import { Download, Copy, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface RewardQRProps {
  code: string
  size?: number
  className?: string
  includeText?: boolean
  logo?: string
  downloadable?: boolean
  background?: string
  foreground?: string
  borderRadius?: number
  title?: string
  frameColor?: string
  showFrame?: boolean
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
  fileName?: string
  color?: string
}

export default function RewardQR({
  code,
  size = 200,
  className = '',
  includeText = false,
  logo,
  downloadable = false,
  background = '#FFFFFF',
  foreground = '#000000',
  borderRadius = 0,
  title,
  frameColor = '#F3F4F6',
  showFrame = true,
  errorCorrectionLevel = 'H',
  fileName,
  color,
}: RewardQRProps) {
  const qrContainerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // CSS variables for custom color
  const customColorStyles = color
    ? ({
        '--qr-accent-color': color,
        '--qr-button-hover': `${color}20`, // Adding 20% opacity
      } as React.CSSProperties)
    : {}

  // Generate QR code
  useEffect(() => {
    setIsLoading(true)
    setError(null)

    if (typeof window !== 'undefined') {
      import('qrcode')
        .then((QRCode) => {
          if (qrContainerRef.current) {
            // Clear previous content
            qrContainerRef.current.innerHTML = ''

            // Create canvas element
            const canvas = document.createElement('canvas')
            canvasRef.current = canvas
            qrContainerRef.current.appendChild(canvas)

            // Apply border radius to canvas
            if (borderRadius > 0) {
              canvas.style.borderRadius = `${borderRadius}px`
            }

            // Options for QR code
            const options = {
              width: size,
              height: size,
              margin: 1,
              color: {
                dark: foreground,
                light: background,
              },
              errorCorrectionLevel: errorCorrectionLevel,
            }

            // Generate QR code
            QRCode.toCanvas(canvas, code, options, (err) => {
              if (err) {
                console.error('Error generating QR code:', err)
                setError('Failed to generate QR code')
                setIsLoading(false)
                return
              }

              // Add logo if provided
              if (logo) {
                const context = canvas.getContext('2d')
                if (context) {
                  const img = new Image()
                  img.onload = () => {
                    // Calculate logo position and size
                    const logoSize = size * 0.22
                    const logoX = (size - logoSize) / 2
                    const logoY = (size - logoSize) / 2

                    // Draw white circle as background for logo
                    context.fillStyle = background
                    context.beginPath()
                    context.arc(
                      size / 2,
                      size / 2,
                      logoSize / 1.7,
                      0,
                      2 * Math.PI
                    )
                    context.fill()

                    // Draw logo with rounded corners
                    const borderRadius = logoSize * 0.2
                    roundedImage(
                      context,
                      logoX,
                      logoY,
                      logoSize,
                      logoSize,
                      borderRadius,
                      img
                    )

                    setIsLoading(false)
                  }

                  img.onerror = () => {
                    setError('Failed to load logo')
                    setIsLoading(false)
                  }

                  img.src = logo
                } else {
                  setIsLoading(false)
                }
              } else {
                setIsLoading(false)
              }
            })
          }
        })
        .catch((err) => {
          console.error('Error loading QRCode library:', err)
          setError('Failed to load QR code library')
          setIsLoading(false)
        })
    }
  }, [
    code,
    size,
    logo,
    background,
    foreground,
    borderRadius,
    errorCorrectionLevel,
  ])

  // Helper function to draw rounded images
  const roundedImage = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    img: HTMLImageElement
  ) => {
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.arcTo(x + width, y, x + width, y + height, radius)
    ctx.arcTo(x + width, y + height, x, y + height, radius)
    ctx.arcTo(x, y + height, x, y, radius)
    ctx.arcTo(x, y, x + width, y, radius)
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(img, x, y, width, height)
    ctx.restore()
  }

  // Handle download
  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement('a')

      // Determine file name
      let downloadFileName = fileName || `qrcode-${code.substring(0, 8)}`

      // Add .png extension if not already present
      if (!downloadFileName.toLowerCase().endsWith('.png')) {
        downloadFileName += '.png'
      }

      link.download = downloadFileName
      link.href = canvasRef.current.toDataURL('image/png')
      link.click()
    }
  }

  // Handle copy
  const handleCopy = async () => {
    if (code) {
      try {
        await navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }
  }

  // Custom button class based on color prop
  const getCustomButtonClass = () => {
    if (!color) return ''
    return 'custom-colored-button'
  }

  return (
    <div
      className={cn('flex flex-col items-center', className)}
      style={customColorStyles}>
      {title && (
        <div
          className={cn(
            'text-sm font-medium mb-2 text-center',
            color ? 'custom-title' : ''
          )}>
          {title}
        </div>
      )}

      <div
        className={cn(
          'relative',
          showFrame && 'border p-4 rounded-xl shadow-sm',
          showFrame && frameColor !== '#F3F4F6' ? '' : 'bg-gray-100',
          color && showFrame ? 'custom-frame' : ''
        )}
        style={{
          backgroundColor: showFrame
            ? color
              ? undefined
              : frameColor
            : 'transparent',
          ...(color && showFrame ? { borderColor: `${color}40` } : {}),
        }}>
        {isLoading && (
          <div className='absolute inset-0 flex items-center justify-center bg-white/50 rounded-lg z-10'>
            <Loader2
              className={cn(
                'h-8 w-8 animate-spin',
                color ? 'custom-loader' : 'text-gray-400'
              )}
              style={color ? { color } : {}}
            />
          </div>
        )}

        <div
          ref={qrContainerRef}
          className={cn(
            'bg-white rounded-lg overflow-hidden transition-all duration-300',
            error
              ? color
                ? 'custom-error-border'
                : 'border-red-300'
              : 'border-transparent',
            borderRadius > 0 ? '' : 'rounded-lg'
          )}
          style={{
            width: size,
            height: size,
            ...(error && color ? { borderColor: color } : {}),
          }}
        />

        {error && (
          <div
            className={cn(
              'text-sm mt-2 text-center',
              color ? 'custom-error' : 'text-red-500'
            )}
            style={color ? { color } : {}}>
            {error}
          </div>
        )}
      </div>

      {includeText && (
        <div
          className={cn(
            'mt-3 text-sm text-gray-600 font-mono bg-gray-50 px-3 py-1 rounded-md border select-all',
            color ? 'custom-code-display' : ''
          )}
          style={color ? { borderColor: `${color}40` } : {}}>
          {code}
        </div>
      )}

      {(downloadable || includeText) && (
        <div className='flex gap-2 mt-3'>
          {downloadable && (
            <Button
              size='sm'
              variant='outline'
              onClick={handleDownload}
              disabled={isLoading || !!error}
              title={`Download QR code as ${fileName || 'PNG'}`}
              className={getCustomButtonClass()}
              style={
                color
                  ? {
                      borderColor: `${color}40`,
                      color: error || isLoading ? undefined : color,
                    }
                  : {}
              }>
              <Download className='h-4 w-4 mr-1' />
              Download
            </Button>
          )}

          {includeText && (
            <Button
              size='sm'
              variant='outline'
              onClick={handleCopy}
              title='Copy code to clipboard'
              className={getCustomButtonClass()}
              style={
                color
                  ? {
                      borderColor: `${color}40`,
                      color: copied ? undefined : color,
                      background: copied ? `${color}10` : undefined,
                    }
                  : {}
              }>
              {copied ? (
                <Check
                  className={cn(
                    'h-4 w-4 mr-1',
                    color ? 'custom-check' : 'text-green-500'
                  )}
                  style={color ? { color } : {}}
                />
              ) : (
                <Copy className='h-4 w-4 mr-1' />
              )}
              {copied ? 'Copied!' : 'Copy Code'}
            </Button>
          )}
        </div>
      )}

      {/* Add CSS for custom colored elements */}
      {color && (
        <style jsx>{`
          .custom-colored-button:hover:not(:disabled) {
            background-color: var(--qr-button-hover);
            border-color: var(--qr-accent-color);
          }

          .custom-colored-button:active:not(:disabled) {
            background-color: var(--qr-button-hover);
          }

          .custom-check {
            color: var(--qr-accent-color);
          }

          .custom-loader {
            color: var(--qr-accent-color);
          }

          .custom-error {
            color: var(--qr-accent-color);
          }

          .custom-error-border {
            border: 1px solid var(--qr-accent-color);
          }

          .custom-frame {
            border-color: color-mix(
              in srgb,
              var(--qr-accent-color) 40%,
              transparent
            );
          }

          .custom-title {
            color: var(--qr-accent-color);
          }

          .custom-code-display {
            border-color: color-mix(
              in srgb,
              var(--qr-accent-color) 40%,
              transparent
            );
          }
        `}</style>
      )}
    </div>
  )
}
