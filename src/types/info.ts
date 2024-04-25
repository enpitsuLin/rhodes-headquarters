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
}

/** 头像设置 */
export interface Avatar {
  // eslint-disable-next-line ts/ban-types
  type: 'ICON' | (string & {})
  id: string
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
  state: 1 | 2 | 3
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
}

/**
 * 集成战略主题信息
 */
export interface RogueThemeInfo {
  id: string
  name: string
  sort: number
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
  type: string
}

/**
 * 活动关卡信息
 */
export interface StageLevelInfo {
  id: string
  code: string
  name: string
}

export interface ManufactureFormulaInfo {
  id: string
  itemId: string
  count: number
  weight: number
  costPoint: number
}

export interface BindingInfo {
  showConfig: {
    charSwitch: boolean
    skinSwitch: boolean
    standingsSwitch: boolean
  }
  currentTs: number
  status: Status
  assistChars: AssistCharacter[]
  chars: Character[]
  recruit: Recruit[]
  charInfoMap: { [id: string]: CharacterInfo }
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
  charAssets: never[]
  skinAssets: never[]
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
  }[]
}
