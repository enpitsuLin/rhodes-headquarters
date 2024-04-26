<script setup lang="ts">
import AddAccountDialog from '~/components/dialog/AddAccountDialog.vue'

const open = ref(false)
</script>

<template>
  <AddAccountDialog v-model:open="open">
    <button
      type="button"
      shadow shadow-black:50
      absolute right-24px bottom-24px
      size-50px rounded-full bg="#35373c"
      scale="active:90" transition="transform"
      @click="open = true"
    >
      <div
        absolute left-5px top-5px
        size-40px bg="#494b50" rounded-full
        flex="inline items-center justify-center"
      >
        <div c="white hover:primary" transition-color>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 0H9V9H0V11H9V20H11V11H20V9H11V0Z" fill="currentColor" />
          </svg>
        </div>
      </div>
    </button>
  </AddAccountDialog>
</template>
