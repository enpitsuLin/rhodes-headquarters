import { Fragment } from 'vue'

export { }

export const BUILDING_TYPE_NAME_MAPPING = {
  control: '控制室',
  dormitory: '宿舍',
  hire: '人力办公室',
  manufacture: '制造站',
  meeting: '会客室',
  power: '发电站',
  trading: '贸易站',
  training: '训练室',
}

export interface BuildingState {
  type: keyof typeof BUILDING_TYPE_NAME_MAPPING
}

const BuildingStateInjectKey = Symbol('BuildingInjectKey') as InjectionKey<ComputedRef<BuildingState>>

/**
 * 用于消费对于注入的基建建筑数据的 composable
 */
export function useBuildingState() {
  const ctx = inject(BuildingStateInjectKey, null)
  if (!ctx)
    throw new Error('BuildingState is not provided')
  return ctx
}

export const BuildingStateProvider = defineComponent(
  (props, { slots }) => {
    provide(BuildingStateInjectKey, computed(() => props.state))
    return () => h(Fragment, slots.default?.())
  },
  {
    props: {
      state: {
        type: Object as PropType<BuildingState>,
        required: true,
      },
    },
  },
)
