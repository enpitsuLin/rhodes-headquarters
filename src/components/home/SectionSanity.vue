<script setup lang="ts">
import { useSanityInfo } from '~/composables/status/ap'
import type { Status } from '~/types'
import SectionTitle from '~/components/home/SectionTitle.vue'

const props = defineProps<{ status: Status }>()

const { max, current, completeRecovery, nextAdd } = useSanityInfo(props.status.ap)
</script>

<template>
  <section flex="~ col">
    <SectionTitle title="理智" sub="Sanity" />
    <div relative>
      <div absolute right-0 top-5px c-border>
        <svg width="71" height="75" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="m28.506 13.617 14.343-.84-6.816 21.865 9.918-.349-15.733 24.714 5.46-21.322-9.24.388 2.068-24.456Z" fill="currentColor" />
          <path d="m31.479 47.635.349-1.272-5.667-6.498-1.366.107 6.684 7.663Z" fill="currentColor" />
          <path d="m63.18 35.215-3.949-7.779 7.858.201-3.91 7.578Zm-.727-20.775 4.594 12.097-8-.205 3.406-11.892Zm-4.32 11.098L52.7 16.963l9.036-4.013-3.604 12.588Zm-18.423 6.44 12.122-14.333 5.643 8.903-17.765 5.43Zm6.285-26.555 14.597 6.832-8.468 3.761-6.129-10.593Zm-13.209 5.863L24.71 2.723l17.006 1.285-8.93 7.278ZM19.848 13.11l-7.726.72 9.33-9.705-1.604 8.985Zm4.067 13.27-11.716-.21 7.937-11.338 3.779 11.549Zm-1.04 10.636-8.347 1.205 9.402-9.715-1.055 8.51Zm-.278 17.113-.155-.03-6.45-6.873 6.806-8.182-.2 15.085Zm-12.106-2.282 4.72-3.849 5.4 5.756-10.12-1.907Zm-1.98-7.926 5.79 3.4-5.208 4.248-.581-7.648ZM4.29 34.087l7.72 4.92-3.938 2.644-3.782-7.564Zm-.68-2.338 7.125-4.164L12.29 37.88l-8.88-5.657.2-.475Zm5.733-13.673 1.217 8.338-6.244 3.649 5.027-11.987Zm4.05 19.738-1.596-10.55 11.606.207-10.01 10.343Zm.983 8.278-5.838-3.43 4.148-2.785 1.69 6.215Zm-.668-6.643 8.324-1.201-6.52 7.837-1.804-6.636Zm-3.356-23.778.605-.63 8.228-.766L11.5 25.253l-1.334-9.142.185-.44Zm53.303-4.897-19.448-9.11L22.189 0 8.54 14.198.98 32.227l5.428 10.855.84 11.048 14.538 2.585L21.269 75l4.736-7.408 2.164-7.89-4.477 6.994.4-10.884 5.84-2.535.372-1.36-6.166 2.677.006-.174-.45-.084.205-15.392.548.628.133-1.52-.243-.279.275-.085.104-1.184-.697.218 1.114-8.987h.35l.096-1.098h-.193l.227-.396.228-2.599-1.062 1.846-3.734-11.41 5.696-.726.098-1.12-5.85.746 1.833-10.28.107-.11.154.012 8.513 9.026-.815.104 3.463-.215 9.035-7.364.976.457 6.52 11.271-6.6-1.614-.328 1.051 7.056 1.726-12.028 14.221-.447 1.436 3.119-.133 14.259-4.358-8.683 7.08-1.448 2.598L58.142 27.72l4.36 8.587-16.845 1.61-1.733 3.11 20.523-2.356 5.572-11.34-6.364-16.557Z" fill="currentColor" /></svg>
      </div>
      <div flex="~ col gap-4px" p="x-4px y-8px" relative h-85px>
        <div flex="~ justify-between items-center">
          <span text-24px font-bold leading-27px>{{ current }}/{{ max }}</span>
          <span v-if="current === max">理智已完全恢复!</span>
          <span v-else>下次恢复: {{ nextAdd.duration.readable }}</span>
        </div>
        <div flex="~ justify-between items-center" leading-17px>
          <span>全部恢复需要:</span>
          <span v-if="current === max">-</span>
          <span v-else>{{ completeRecovery.duration.readable }}</span>
        </div>
        <div flex="~ justify-between items-center" leading-17px>
          <span>预计恢复时间:</span>
          <span v-if="current === max">-</span>
          <span v-else>{{ completeRecovery.date.readable }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
