export function paintScreen(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.fillStyle = '#141311'
  ctx.fillRect(0, 0, width, height)

  ctx.strokeStyle = 'rgba(245, 243, 238, 0.16)'
  ctx.lineWidth = 2
  ctx.strokeRect(36, 36, width - 72, height - 72)

  ctx.fillStyle = 'rgba(245, 243, 238, 0.48)'
  ctx.font = '500 28px "Instrument Sans", system-ui, sans-serif'
  ctx.letterSpacing = '0.32em'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText('BARENCHI', 64, 96)

  ctx.strokeStyle = 'rgba(245, 243, 238, 0.14)'
  ctx.beginPath()
  ctx.moveTo(64, 118)
  ctx.lineTo(width - 64, 118)
  ctx.stroke()

  ctx.fillStyle = '#f5f3ee'
  ctx.font = '400 420px "Instrument Serif", "Times New Roman", serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.letterSpacing = '-0.06em'
  ctx.fillText('B', width / 2, height / 2 + 24)

  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.font = '500 22px "Instrument Sans", system-ui, sans-serif'
  ctx.fillStyle = '#4a2f24'
  ctx.letterSpacing = '0.18em'
  ctx.fillText('01', 64, height - 72)

  ctx.fillStyle = 'rgba(245, 243, 238, 0.4)'
  ctx.fillText('ENGINE', 118, height - 72)
}
