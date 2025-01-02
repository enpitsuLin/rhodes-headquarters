<script setup lang="ts">
import Base from './Base.vue'
import ResidentCharacter from './ResidentCharacter.vue'
import type { BuildingManufacture } from '~/types'

const props = defineProps<{
  data: BuildingManufacture
}>()

const formula: { [id: string]: string } = {
  1: '基础作战记录',
  2: '初级作战记录',
  3: '中级作战记录',
  4: '赤金',
  5: '先锋双芯片',
  6: '近卫双芯片',
  7: '重装双芯片',
  8: '狙击双芯片',
  9: '术师双芯片',
  10: '医疗双芯片',
  11: '辅助双芯片',
  12: '特种双芯片',
  13: '源石碎片',
  14: '源石碎片',
}

const formulaName = computed(() => {
  return formula[props.data.formulaId]
})
</script>

<template>
  <Base title="制造站" :level="3" color="#FFD800">
    <template #icon>
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_502_882)">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M54.1813 8.69752L22.8187 -9.51C21.6933 -10.1633 20.3067 -10.1633 19.1813 -9.51L-12.1813 8.69752C-13.3067 9.35085 -14 10.5583 -14 11.865V48.28C-14 49.5867 -13.3067 50.7941 -12.1813 51.4474L19.1813 69.6549C20.3067 70.3083 21.6933 70.3083 22.8187 69.6549L54.1813 51.4474C55.3067 50.7941 56 49.5867 56 48.28V11.865C56 10.5583 55.3067 9.35085 54.1813 8.69752ZM21.6053 -4.9322C21.2306 -5.14926 20.7694 -5.14926 20.3947 -4.9322L5.80839 3.51837C5.38849 4.306 5.92076 5.01929 6.24869 5.28308L35.765 5.28308C36.096 5.00886 36.6129 4.29646 36.1828 3.51327L21.6053 -4.9322ZM51.513 47.0455V13.0994C51.513 12.6634 51.2815 12.2607 50.9058 12.043L44.8492 8.53414L26.456 8.53417L24.8394 10.9725H15.9482L14.3316 8.53414H-2.84921L-8.90581 12.043C-9.28146 12.2607 -9.51296 12.6634 -9.51296 13.0994V47.0455C-9.51296 47.4814 -9.28146 47.8842 -8.9058 48.1018L9.77684 58.9256H32.2232L50.9058 48.1018C51.2815 47.8842 51.513 47.4814 51.513 47.0455Z" fill="#44464B" />
          <path d="M11.5026 12.598C11.5026 11.9247 12.0454 11.3788 12.715 11.3788H28.4767C29.1463 11.3788 29.6891 11.9247 29.6891 12.598V30.8852C29.6891 32.2318 28.6035 33.3235 27.2642 33.3235H13.9275C12.5882 33.3235 11.5026 32.2318 11.5026 30.8852V12.598Z" fill="#44464B" />
          <path d="M14.3316 33.7299H26.456V34.949H14.3316V33.7299Z" fill="#44464B" />
          <path d="M17.1606 34.949H18.3731V36.5746H17.1606V34.949Z" fill="#44464B" />
          <path d="M22.8187 34.949H24.0311V36.5746H22.8187V34.949Z" fill="#44464B" />
          <path d="M19.9896 34.949H21.2021V38.2001H19.9896V34.949Z" fill="#44464B" />
          <path d="M28.0725 43.8894L20.7979 48.5628L13.5233 43.8894L20.7979 39.4192L28.0725 43.8894Z" fill="#44464B" />
          <path d="M22.0104 56.4873H21.2021V49.1724L28.8808 44.7022V52.4235L22.0104 56.4873Z" fill="#44464B" />
          <path d="M19.5855 56.4873H20.3938V49.1724L12.715 44.7022V52.4235L19.5855 56.4873Z" fill="#44464B" />
        </g>
        <defs>
          <clipPath id="clip0_502_882">
            <rect width="60" height="60" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </template>
    <template #info>
      <div w-full flex="inline items-center justify-between">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M9.42857 2.28571L3.42857 5.71429L3.42857 12.5714L9.42857 16L15.4286 12.5714V5.71429L9.42857 2.28571ZM9.42857 2.85714L4 6L9.31754 9.21143L9.42857 15.4286L14.8571 12.2857V6L9.42857 2.85714Z" fill="#FFD802" />
          <path d="M2.28571 16V1.71429L0 6.28571H1.14286V16H2.28571Z" fill="#FFD802" />
          <path d="M0.571429 1.14286H16V0H0.571429V1.14286Z" fill="#FFD802" />
        </svg>

        <span>
          <span class="text-#ffd800">{{ data.weight }}</span>/{{ data.capacity }}
        </span>
      </div>
      <div class="text-#ffd800">
        {{ formulaName }}
      </div>
    </template>
    <ResidentCharacter
      v-for="i in data.chars"
      :key="i.charId"
      :resident="i"
    />
  </Base>
</template>
