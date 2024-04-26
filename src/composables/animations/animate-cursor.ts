import { useEventListener, useMutationObserver } from '@vueuse/core'

const interactiveSelector = `a,input,button,textarea,[data-cursor-interacting]` as const

export function useAnimateCursor() {
  const now = shallowRef(new MouseEvent(''))
  const nowX = ref(0)
  const nowY = ref(0)

  const updatedAt = ref(0)

  const moving = ref(false)
  const fading = ref(false)

  const container = ref<HTMLDivElement>()
  const outer = ref<HTMLDivElement>()
  const effecter = ref<HTMLDivElement>()

  const first = ref(true)

  function setPosition(x = nowX.value, y = nowY.value) {
    if (!outer.value)
      return
    outer.value.style.transform = `translate(calc(${x.toFixed(2)}px - 50%), calc(${y.toFixed(2)}px - 50%))`
  }

  function onMove(timestamp: number) {
    if (now.value !== undefined) {
      const delX = now.value.x - nowX.value
      const delY = now.value.y - nowY.value
      nowX.value += delX * Math.min(0.025 * (timestamp - updatedAt.value), 1)
      nowY.value += delY * Math.min(0.025 * (timestamp - updatedAt.value), 1)
      setPosition()
      updatedAt.value = timestamp
      if (Math.abs(delX) > 0.1 || Math.abs(delY) > 0.1) {
        requestAnimationFrame(onMove)
      }
      else {
        setPosition(now.value.x, now.value.y)
        moving.value = false
      }
    }
  }

  function reset(mouse: MouseEvent) {
    if (!outer.value)
      return
    outer.value.style.top = '0'
    outer.value.style.left = '0'
    if (!moving.value) {
      moving.value = true
      requestAnimationFrame(onMove)
    }
    now.value = mouse
    if (first.value) {
      first.value = false
      nowX.value = now.value.x
      nowY.value = now.value.y
      setPosition()
    }
  }

  function effect(mouse: MouseEvent) {
    if (!effecter.value)
      return
    if (!fading.value) {
      fading.value = true
      effecter.value.style.left = `${String(mouse.x)}px`
      effecter.value.style.top = `${String(mouse.y)}px`
      effecter.value.style.transition
        = 'transform .5s cubic-bezier(0.22, 0.61, 0.21, 1) ,opacity .5s cubic-bezier(0.22, 0.61, 0.21, 1)'
      effecter.value.style.transform = 'translate(-50%, -50%) scale(1)'
      effecter.value.style.opacity = '0'
      setTimeout(() => {
        if (!effecter.value)
          return
        fading.value = false
        effecter.value.style.transition = ''
        effecter.value.style.transform = 'translate(-50%, -50%) scale(0)'
        effecter.value.style.opacity = '1'
      }, 500)
    }
  }

  function onHold() {
    if (!outer.value)
      return
    outer.value.style.height = '20px'
    outer.value.style.width = '20px'
    outer.value.style.background = 'hsl(var(--foreground) / 0.3)'
  }

  function relax() {
    if (!outer.value)
      return
    outer.value.style.height = '28px'
    outer.value.style.width = '28px'
    outer.value.style.background = 'unset'
  }

  useEventListener('mousemove', reset, { passive: true })
  useEventListener('click', effect, { passive: true })

  useMutationObserver(
    () => document as unknown as HTMLElement,
    () => {
      document.querySelectorAll(interactiveSelector).forEach((item) => {
        item.addEventListener('mouseover', onHold, { passive: true })
        item.addEventListener('mouseout', relax, { passive: true })
      })
    },
    { childList: true, subtree: true },
  )

  watchPostEffect(() => {
    if (!outer.value || !effecter.value)
      return
    outer.value.style.top = '-100%'
    effecter.value.style.transform = 'translate(-50%, -50%) scale(0)'
    effecter.value.style.opacity = '1'
  })

  return {
    container,
    outer,
    effecter,
  }
}
