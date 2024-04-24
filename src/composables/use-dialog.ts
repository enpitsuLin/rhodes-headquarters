import * as dialog from '@zag-js/dialog'
import { normalizeProps, useMachine } from '@zag-js/vue'
import type { MaybeRef } from 'vue'

interface UseDialogOptions {
  open?: MaybeRef<boolean>
  onOpenChange?: (open: boolean) => void
}

let _id = 1

export function useDialog(options: UseDialogOptions) {
  const context = computed(() => {
    if (isRef(options.open)) {
      return {
        open: toValue(options.open),
      }
    }
    return {}
  })

  const [state, send] = useMachine(
    dialog.machine({
      'id': (++_id).toString(),
      'open.controlled': options.open !== undefined,
      'open': toValue(options.open),
      onOpenChange(details) {
        options.onOpenChange?.(details.open)
      },
    }),
    { context },
  )
  return computed(() => dialog.connect(state.value, send, normalizeProps))
}
