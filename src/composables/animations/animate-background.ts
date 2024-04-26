import type { MaybeComputedElementRef, MaybeRef } from '@vueuse/core'
import { useEventListener, useRafFn } from '@vueuse/core'

class Dust {
  public x: number
  public y: number
  public vx: number = (Math.random() * 1 + 1) * 0.5
  public vy: number = (Math.random() * 1 + 0.01) * 0.5
  public shadowBlur: number = Math.random() * 3
  public shadowX: number = (Math.random() * 2) - 1
  public shadowY: number = (Math.random() * 2) - 1
  public radiusX: number = Math.random() * 1.5 + 0.5
  public radiusY: number = this.radiusX * (Math.random() * (1.3 - 0.3) + 0.3)
  public rotation: number = Math.PI * Math.floor(Math.random() * 2)
  constructor(x: number = 50, y: number = 50) {
    this.x = x
    this.y = y
  }
}

interface UseCanvasDustOptions {
  color: MaybeRef<string>
  dustQuantity: MaybeRef<number>
}

export function useCanvasDust(
  el: MaybeComputedElementRef<HTMLCanvasElement | null>,
  options: UseCanvasDustOptions = {
    color: '#fff',
    dustQuantity: 25,
  },
) {
  const dustQuantity = ref(options.dustQuantity)
  const color = toValue(options.color)
  const canvasEl = computed(() => toValue(el))
  const ctx = computed(() => canvasEl.value?.getContext('2d'))

  const dustArr = computed(() => {
    const points = calcPoint(dustQuantity.value)
    return points.map(point => new Dust(point.x, point.y))
  })

  useEventListener(window, 'resize', resize)

  function drawDust(dust: Dust) {
    if (!ctx.value)
      return
    ctx.value.beginPath()
    ctx.value.shadowBlur = dust.shadowBlur
    ctx.value.shadowOffsetX = dust.shadowX
    ctx.value.shadowOffsetY = dust.shadowY
    ctx.value.ellipse(dust.x, dust.y, dust.radiusX, dust.radiusY, dust.rotation, 0, Math.PI * 2)
    ctx.value.closePath()
    ctx.value.fill()
  }

  function resize() {
    if (!canvasEl.value || !ctx.value)
      return
    const {
      innerWidth: width,
      innerHeight: height,
    } = window
    dustQuantity.value = Math.floor((width + height) / 38)
    canvasEl.value.width = width
    canvasEl.value.height = height

    ctx.value.shadowColor = ctx.value.fillStyle = color
  }

  watchPostEffect(() => {
    if (canvasEl.value)
      resize()
  })

  return useRafFn(() => {
    dustArr.value.forEach((dust) => {
      ctx.value?.clearRect(dust.x - 6, dust.y - 6, 12, 12)
      if (dust.x < -5 || dust.y < -5) {
        const x = window.innerWidth
        const y = Math.floor(Math.random() * window.innerHeight)
        dust.x = x
        dust.y = y
      }
      else {
        dust.x -= dust.vx
        dust.y -= dust.vy
      }
      drawDust(dust)
    })
  })
}

function calcPoint(quantity: number) {
  return Array.from({ length: quantity }, () => {
    const x = Math.floor(Math.random() * window.innerWidth)
    const y = Math.floor(Math.random() * window.innerHeight)
    return { x, y }
  })
}
