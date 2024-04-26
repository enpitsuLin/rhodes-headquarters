import type { MaybeRef } from '@vueuse/core'
import * as presence from '@zag-js/presence'
import { normalizeProps, useMachine } from '@zag-js/vue'

interface UsePresenceOptions {
  present: MaybeRef<boolean>
  onExitComplete?: () => void
}

export function usePresence(options: UsePresenceOptions) {
  const context = computed(() => {
    return {
      present: toValue(options.present),
      onExitComplete: options.onExitComplete,
    }
  })
  const [state, send] = useMachine(
    presence.machine({
      present: context.value.present,
      onExitComplete() {
        context.value.onExitComplete?.()
      },
    }),
    {
      context,
    },
  )

  return computed(() => presence.connect(state.value, send, normalizeProps))
}
