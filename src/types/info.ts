import type { Building } from './building'
import type { AssistCharacter, Character, CharacterInfo, EquipmentInfo, Skin, SkinInfo } from './character'

/** 游戏角色状态 */
export interface Status {
  uid: string
  name: string
  level: number
  avatar: Avatar
  /**
   * 注册时间
   * @note unix 时间戳
   */
  registerTs: number
  /** 主线进度 */
  mainStageProgress: string
  secretary: Pick<Character, 'charId' | 'skinId'>
  resume: string
  subscriptionEnd: number
  ap: ActionPoint
  storeTs: number
  lastOnlineTs: number
  charCnt: number
  furnitureCnt: number
  skinCnt: number
  exp: {
    current: number
    max: number
  }
}

/** 蚀刻章 */
export interface Medal {
  type: 'CUSTOM' | (string & {})
  template: string
  templateMedalList: []
  customMedalLayout: {
    id: string
    pos: [number, number]
  }[]
  total: 540
}

/** 头像设置 */
export interface Avatar {
  type: 'ICON' | (string & {})
  id: string
  url: string
}

/** 理智 */
export interface ActionPoint {
  current: number
  max: number
  lastApAddTime: number
  completeRecoveryTime: number
}

/** 公招 */
export interface Recruit {
  startTs: number
  finishTs: number
  state: 0 | 1 | 2 | 3
}

/**
 * 剿灭作战信息
 */
export interface Campaign {
  records: CampaignRecord[]
  reward: CampaignReward
}

/**
 * 剿灭作战纪录
 */
export interface CampaignRecord {
  campaignId: string
  maxKills: number
}

/**
 * 剿灭作战奖励
 */
export interface CampaignReward {
  current: number
  total: number
}

/**
 * 剿灭作战地图信息
 */
export interface CampaignLevelInfo {
  id: string
  name: string
  campaignZoneId: string
  picUrl: string
}

/**
 * 剿灭作战区域信息
 */
export interface CampaignZoneInfo {
  id: string
  name: string
}

/**
 * 保全派驻信息
 */
export interface Tower {
  records: TowerRecord[]
  reward: TowerReward
}

/**
 * 保全派驻纪录
 */
export interface TowerRecord {
  towerId: string
  best: number
}

/**
 * 保全派驻奖励
 */
export interface TowerReward {
  higherItem: { current: number, total: number }
  lowerItem: { current: number, total: number }
  termTs: number
}

/**
 * 保全派驻区域信息
 */
export interface TowerZoneInfo {
  id: string
  name: string
  subName: string
  picUrl: string
}

/**
 * 集成战略
 */
export interface Rogue {
  records: RougeRecord[]
}

/**
 * 集成战略记录
 */
export interface RougeRecord {
  rogueId: string
  relicCnt: number
  bank: { current: number, record: number }
  clearTime: number
  bpLevel: number
  medal: {
    total: number
    current: number
  }
}

/**
 * 集成战略主题信息
 */
export interface RogueThemeInfo {
  id: string
  name: string
  sort: number
  picUrl: string
}

/**
 * 日常周常
 */
export interface Routine {
  daily: { current: number, total: number }
  weekly: { current: number, total: number }
}

/**
 * 活动
 */
export interface Activity {
  actId: string
  actReplicaId: string
  zones: {
    zoneId: string
    zoneReplicaId: string
    clearedStage: number
    totalStage: number
  }[]
}

/**
 * 活动信息
 */
export interface ActivityInfo {
  id: string
  name: string
  startTime: number
  endTime: number
  rewardEndTime: number
  isReplicate: boolean
  type: 'MINISTORY' | 'SIDESTORY' | 'BRANCHLINE' | (string & {})
  dropItemIds: string[]
  shopGoodItemIds: string[]
  favorUpList: string[]
  picUrl: string
}

/**
 * 活动关卡信息
 */
export interface StageLevelInfo {
  id: string
  code: string
  name: string
  zoneId: string
  diffGroup: 'NONE' | (string & {})
  stageType: 'ACTIVITY' | (string & {})
  dangerLevel: '-' | (string & {})
  apCost: number
  difficulty: 'NORMAL' | (string & {})
}

export interface ManufactureFormulaInfo {
  id: string
  itemId: string
  count: number
  weight: number
  costs: unknown[]
  costPoint: number
}

export interface Sandbox {
  id: string
  name: string
  maxDay: number
  maxDayChallenge: number
  mainQuest: number
  subQuest: { id: string, name: string, done: boolean }[]
  baseLv: number
  unlockNode: number
  enemyKill: number
  createRift: number
  fixRift: number[]
  picUrl: string
}

export interface BindingInfo {
  showConfig: {
    charSwitch: boolean
    skinSwitch: boolean
    standingsSwitch: boolean
  }
  currentTs: number
  status: Status
  medal: Medal
  assistChars: AssistCharacter[]
  chars: Character[]
  recruit: Recruit[]
  charInfoMap: Record<string, CharacterInfo>
  building: Building
  skins: Skin[]
  skinInfoMap: { [id: string]: SkinInfo }
  campaign: Campaign
  campaignInfoMap: { [id: string]: CampaignLevelInfo }
  campaignZoneInfoMap: { [id: string]: CampaignZoneInfo }
  equipmentInfoMap: { [id: string]: EquipmentInfo }
  tower: Tower
  towerInfoMap: { [id: string]: TowerZoneInfo }
  rogue: Rogue
  rogueInfoMap: { [id: string]: RogueThemeInfo }
  routine: Routine
  activity: Activity[]
  activityInfoMap: { [id: string]: ActivityInfo }
  stageInfoMap: { [id: string]: StageLevelInfo }
  manufactureFormulaInfoMap: { [id: number]: ManufactureFormulaInfo }
  charAssets: unknown[]
  skinAssets: unknown[]
  activityBannerList: {
    list: {
      activityId: string
      imgUrl: string
      url: string
      startTs: number
      endTs: number
      offlineTs: number
    }[]
  }
  bossRush: {
    id: string
    record: {
      played: boolean
      stageId: string
      difficulty: string
    }
    picUrl: string
  }[]
  bannerList: unknown[]
  /** 沟槽的生稀盐酸 */
  sandbox: Sandbox[]
}
