<script setup lang="ts">
import { SwitchContext, SwitchControl, SwitchHiddenInput, SwitchLabel, SwitchRoot, SwitchThumb } from '@ark-ui/vue'

const checked = defineModel<boolean>('checked')
</script>

<template>
  <SwitchRoot v-model:checked="checked">
    <SwitchControl>
      <SwitchThumb />
    </SwitchControl>
    <SwitchContext v-slot="api">
      <SwitchLabel sr-only>
        {{ api.checked ? '启用' : "禁用" }}
      </SwitchLabel>
    </SwitchContext>

    <SwitchHiddenInput />
  </SwitchRoot>
</template>

<style>
[data-scope='switch'][data-part='root'] {
  --at-apply: flex items-center relative w-fit;
  --switch-track-diff: calc(var(--switch-track-width) - var(--switch-track-height));
  --switch-thumb-x: var(--switch-track-diff);
  --switch-track-width: 1.875rem;
  --switch-track-height: 1rem;
  --thumb-size: calc(var(--switch-track-height) + 0.7rem);
}

[data-scope='switch'][data-part='control'] {
  --at-apply: inline-flex flex-shrink-0 [-webkit-box-pack:start] justify-start box-content rounded-full p-0.5 w-$switch-track-width h-$switch-track-height bg-#cbd5e0;

  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow,
    transform;
  transition-duration: 150ms;
}

[data-scope='switch'][data-part='control'][data-state='checked'] {
  --at-apply: bg-primary;
}

[data-scope='switch'][data-part='control'][data-focus] {
  --at-apply: shadow-[0_0_0_3px] shadow-primary/60;
}

[data-scope='switch'][data-part='control'][data-disabled] {
  --at-apply: op-40;
}

[data-scope='switch'][data-part='thumb'] {
  --at-apply: transition-property-transform duration-200 bg-white relative size-$switch-track-height rounded-inherit;
}

[data-scope='switch'][data-part='thumb']:before {
  --at-apply: transition-background-color ease-in-out duration-200 absolute bg-transparent content-empty size-$thumb-size z-1 left-1/2 top-1/2 -translate-1/2 rounded-inherit;
}

[data-scope='switch'][data-part='thumb'][data-hover]:before {
  --at-apply: bg-black/4.8
}

[data-scope='switch'][data-part='thumb'][data-hover][data-state='checked']:before {
  --at-apply: bg-black/29.5
}

[data-scope='switch'][data-part='thumb'][data-state='checked'] {
  --at-apply: transform translate-x-$switch-thumb-x;
}
</style>
