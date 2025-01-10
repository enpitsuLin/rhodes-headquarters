import type { Character } from './character'

/**
 * 基建进驻干员
 */
export interface ResidentCharacter {
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
  /** 槽位 ID */
  slotId: string
  /** 槽位状态 */
  slotState?: number
  /** 干员 */
  chars: ResidentCharacter[]
  /** 等级 */
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
  /** 氛围值 */
  comfort: number
}

/**
 * 基建人力办公室
 */
export interface BuildingHire extends BuildingRoom {
  /** 状态 */
  state: number
  /** 刷新次数 */
  refreshCount: number
  /** 完成工作时间 */
  completeWorkTime: number
}

/**
 * 基建制造站
 */
export interface BuildingManufacture extends BuildingRoom {
  /**
   * 生产力 1 为 100%
   */
  speed: number
  /** 完成数量 */
  complete: number
  /** 库存容量 */
  capacity: number
  /** 当前库存 */
  weight: number
  formulaId: string | number
  /**
   * 剩余制作数量
   * 一般都是剩 99 个
   */
  remain: number
  slotId: string
  /**
   * 完成工作时间
   * 预计填满库存时间
   */
  completeWorkTime: number
  /** 最后更新时间 */
  lastUpdateTime: number
}

/**
 * 基建会客室
 */
export interface BuildingMeeting extends BuildingRoom {
  clue: {
    /**
     * 线索板
     * - 1. RHINE: 莱茵生命
     * - 2. PENGUIN: 企鹅物流
     * - 3. BLACKSTEEL: 黑钢国际
     * - 4. URSUS: 乌萨斯学生自治团
     * - 5. GLASGOW: 格拉斯哥帮
     * - 6. KJERAG: 喀兰学院
     * - 7. RHODES: 罗德岛
     */
    board: ('RHINE' | 'PENGUIN' | 'BLACKSTEEL' | 'URSUS' | 'GLASGOW' | 'KJERAG' | 'RHODES')[]
    /** 已拥有线索数量 */
    own: number
    /** 已领取线索 */
    received: number
    /** 已领取每日线索获取 */
    dailyReward: boolean
    /** 传递线索数量 */
    needReceive: number
    /** 线索交流结束时间 */
    shareCompleteTime: number
    /** 线索交流中 */
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
  /** 订单 */
  stock: {
    delivery: {
      id: number
      count: number
      type: 'MATERIAL' | 'DIAMOND_SHD'
    }[]
    gain: {
      id: number
      count: number
      /**
       * 交付报酬
       * - GOLD: 龙门币
       * - DIAMOND: 合成玉
       */
      type: 'GOLD' | 'DIAMOND'
    }
    instId: number
    /**
     * 订单需求
     * - O_GOLD: 赤金
     * - O_DIAMOND: 原石碎片
     */
    type: 'O_GOLD' | 'O_DIAMOND'
  }[]
  stockLimit: number
  /**
   * 谈判策略
   * - O_GOLD: 赤金——龙门商法
   * - O_DIAMOND: 原石碎片——开采协力
   */
  strategy: 'O_GOLD' | 'O_DIAMOND'
  /** 订单完成时间 */
  completeWorkTime: number
  /** 最后更新时间 */
  lastUpdateTime: number
}

/**
 * 基建训练室
 */
export interface BuildingTraining extends Omit<BuildingRoom, 'chars'> {
  /** 训练干员 */
  trainee: Omit<ResidentCharacter, 'index' | 'bubble' | 'workTime'> & { targetSkill: number } | null
  /** 协助位干员 */
  trainer: Omit<ResidentCharacter, 'index' | 'bubble' | 'workTime'> | null
  remainPoint: number
  speed: number
  lastUpdateTime: number
  remainSecs: number
}

/** 基建建筑 */
export interface Building {
  /** 控制中枢 */
  control: BuildingControl
  /** 发电站 */
  powers: BuildingPower[]
  /** 制造站 */
  manufactures: BuildingManufacture[]
  /** 贸易站 */
  tradings: BuildingTrading[]
  /** 宿舍 */
  dormitories: BuildingDormitory[]
  /** 人力办公室 */
  hire: BuildingHire | null
  /** 训练室 */
  training: BuildingTraining | null
  /** 会客室 */
  meeting: BuildingMeeting | null
  /** 无人机 */
  labor: Labor
  /** 电梯 */
  elevators: Omit<BuildingRoom, 'chars'>[]
  /** 走廊 */
  corridors: Omit<BuildingRoom, 'chars'>[]
  /** 家具 */
  furniture: { total: number }
  /** 疲劳干员 */
  tiredChars: ResidentCharacter[]
}
