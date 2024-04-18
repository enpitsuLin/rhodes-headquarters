import type { Character } from './character'

/**
 * 基建进驻干员
 */
export interface ResidentCharacters {
  charId: Character['charId']
  /** 疲劳值 */
  ap: number
  lastApAddTime: number
  index: number
  /** 工作时长 */
  workTime: number
  /** 对话气泡 */
  bubble: Record<'normal' | 'assist', {
    add: number
    ts: number
  }>
}

/**
 * 基建设施
 */
export interface BuildingRoom {
  slotId: string
  slotState?: number
  chars: ResidentCharacters[]
  level: number
}

/**
 * 基建无人机数据
 */
export interface Labor {
  /** 当前值 */
  value: number
  /** 最大无人机数 */
  maxValue: number
  remainSecs: number
  lastUpdateTime: number
}

/**
 * 基建控制中枢
 */
export interface BuildingControl extends BuildingRoom {
}

/**
 * 基建宿舍
 */
export interface BuildingDormitory extends BuildingRoom {
  comfort: number
}

/**
 * 基建人力办公室
 */
export interface BuildingHire extends BuildingRoom {
  state: number
  refreshCount: number
  completeWorkTime: number
}

/**
 * 基建制造站
 */
export interface BuildingManufacture extends BuildingRoom {
  speed: number
  complete: number
  capacity: number
  weight: number
  formulaId: string | number
  remain: number
  slotId: string
  completeWorkTime: number
  lastUpdateTime: number
}

/**
 * 基建会客室
 */
export interface BuildingMeeting extends BuildingRoom {
  clue: {
    board: ('RHINE' | 'PENGUIN' | 'BLACKSTEEL' | 'URSUS' | 'KJERAG' | 'RHODES' | 'GLASGOW')[]
    own: number
    received: number
    dailyReward: boolean
    needReceive: number
    shareCompleteTime: number
    sharing: boolean
  }
  lastUpdateTime: number
  completeWorkTime: number
}

/**
 * 基建发电站
 */
export interface BuildingPower extends BuildingRoom {
}

/**
 * 基建贸易站
 */
export interface BuildingTrading extends BuildingRoom {
  stock: {
    delivery: {
      id: number
      count: number
    }[]
    gain: {
      id: number
      count: number
      type: 'GOLD' | 'DIAMOND'
    }
    instId: number
    type: 'O_GOLD' | 'O_DIAMOND'
  }[]
  stockLimit: number
  strategy: 'O_GOLD' | 'O_DIAMOND'
  completeWorkTime: number
  lastUpdateTime: number
}

/**
 * 基建训练室
 */
export interface BuildingTraining extends Omit<BuildingRoom, 'chars'> {
  trainee?: Omit<ResidentCharacters, 'index' | 'bubble' | 'workTime'> & { targetSkill: number }
  trainer?: Omit<ResidentCharacters, 'index' | 'bubble' | 'workTime'>
  remainPoint: number
  speed: number
  lastUpdateTime: number
  remainSecs: number
}

/** 基建建筑 */
export interface Building {
  tiredChars: ResidentCharacters[]
  powers: BuildingPower[]
  manufactures: BuildingManufacture[]
  tradings: BuildingTrading[]
  dormitories: BuildingDormitory[]
  meeting: BuildingMeeting
  hire: BuildingHire
  training: BuildingTraining
  labor: Labor
  control: BuildingControl
  /** 电梯 */
  elevators: { slotId: string, slotState: number, level: 1 }[]
  /** 走廊 */
  corridors: { slotId: string, slotState: number, level: 1 }[]
  furniture: { total: number }
}
