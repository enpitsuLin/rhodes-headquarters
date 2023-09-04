/**
 * Arknights玩家数据
 **/
export interface Player {
  activity: Activity
  activityInfoMap: { [id: string]: ActivityInfo }
  assistChars: AssistCharacter[]
  building: Infrastructure
  campaign: Campaign
  campaignInfoMap: { [id: string]: CampaignLevelInfo }
  campaignZoneInfoMap: { [id: string]: CampaignZoneInfo }
  chars: Character[]
  charInfoMap: { [id: string]: CharacterInfo }
  currentTs: number
  equipmentInfoMap: { [id: string]: EquipmentInfo }
  recruit: Recruit[]
  rouge: Rouge
  rougeInfoMap: { [id: string]: RougeThemeInfo }
  routine: Mission
  skins: Skin[]
  skinInfoMap: { [id: string]: SkinInfo }
  stageInfoMap: { [id: string]: StageLevelInfo }
  status: PlayerStatus
  tower: Tower
  towerInfoMap: { [id: string]: TowerZoneInfo }
  zoneInfoMap: { [id: string]: ZoneInfo }
}

/**
* Arknights活动
*/
export interface Activity {
  actId: string
  actReplicaId: string
  type: string
}

/**
* Arknights活动信息
*/
export interface ActivityInfo {
  id: string
  name: string
  startTime: number
  endTime: number
  isReplicate: boolean
  type: string
}

/**
* Arknights助战干员
**/
export interface AssistCharacter {
  charId: string
  equip?: Equipment
  evolvePhase: 0 | 1 | 2
  level: number
  mainSkillLvl: 1 | 2 | 3 | 4 | 5 | 6 | 7
  potentialRank: 1 | 2 | 3 | 4 | 5 | 6
  skillId: string
  skinId: string
  specializeLevel: 0 | 1 | 2 | 3
}

/**
* Arknights干员模组
*/
export interface Equipment {
  id: string
  level: 0 | 1 | 2 | 3
}

/**
* Arknights模组信息
*/
export interface EquipmentInfo {
  id: string
  desc: string
  name: string
  shiningColor: string
  typeIcon: string
}

/**
* Arknights基建信息
*/
export interface Infrastructure {
  control: InfrastructureControl
  dormitories: InfrastructureDormitory[]
  hire: InfrastructureHire
  manufactures: InfrastructureManufacture[]
  meeting: InfrastructureMeeting
  furniture: { total: number }
  labor: ArknightsBuildLabor
  powers: InfrastructurePower[]
  tradings: InfrastructureTrading[]
  training: InfrastructureTraining
}

/**
* Arknights基建进驻干员
*/
export interface ResidentCharacters {
  charId: string
  index: number
  ap: number
}

/**
* Arknights基建设施
*/
export interface InfrastructureRoom {
  chars: ResidentCharacters[]
  level: number
}

/**
* Arknights基建无人机
*/
export interface ArknightsBuildLabor {
  value: number
  maxValue: number
  remainSecs: number
  lastUpdateTime: number
}

/**
* Arknights基建控制中枢
*/
export interface InfrastructureControl extends InfrastructureRoom {
}

/**
* Arknights基建宿舍
*/
export interface InfrastructureDormitory extends InfrastructureRoom {
  comfort: number
  slotId: string
}

/**
* Arknights基建人力办公室
*/
export interface InfrastructureHire extends InfrastructureRoom {
  refreshCount: number
  completeWorkTime: number
}

/**
* Arknights基建制造站
*/
export interface InfrastructureManufacture extends InfrastructureRoom {
  speed: number
  complete: number
  capacity: number
  weight: number
  formulaId: number
  remain: number
  slotId: string
}

/**
* Arknights基建会客室
*/
export interface InfrastructureMeeting extends InfrastructureRoom {
  clue: {
    board: ('RHINE' | 'PENGUIN' | 'BLACKSTEEL' | 'URSUS' | 'KJERAG' | 'RHODES' | 'GLASGOW')[]
    own: number
    received: number
    shareCompleteTime: number
    sharing: boolean
  }
}

/**
* Arknights基建发电站
*/
export interface InfrastructurePower extends InfrastructureRoom {
  slotId: string
}

/**
* Arknights基建贸易站
*/
export interface InfrastructureTrading extends InfrastructureRoom {
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
  slotId: string
}

/**
* Arknights基建训练室
*/
export interface InfrastructureTraining extends InfrastructureRoom {
  remainPoint: number
  remainSecs: number
  trainee?: InfrastructureTrainee
  trainer?: ResidentCharacters
}

/**
* Arknights基建训练室受训干员
*/
export interface InfrastructureTrainee extends ResidentCharacters {
  targetSkill: number
}

/**
* Arknights剿灭作战信息
*/
export interface Campaign {
  records: CampaignRecord
  reward: CampaignReward
}

/**
* Arknights剿灭作战纪录
*/
export interface CampaignRecord {
  campaignId: string
  maxKills: number
}

/**
* Arknights剿灭作战奖励
*/
export interface CampaignReward {
  current: number
  total: number
}

/**
* Arknights剿灭作战地图信息
*/
export interface CampaignLevelInfo {
  id: string
  name: string
  campaignZoneId: string
}

/**
* Arknights剿灭作战区域信息
*/
export interface CampaignZoneInfo {
  id: string
  name: string
}

/**
* Arknights干员
*/
export interface Character {
  charId: string
  skinId: string
  level: number
  evolvePhase: 0 | 1 | 2
  potentialRank: 1 | 2 | 3 | 4 | 5 | 6
  mainSkillLvl: 1 | 2 | 3 | 4 | 5 | 6 | 7
  favorPercent: number
  gainTime: number
  skills: {
    id: string
    specializeLevel: 0 | 1 | 2 | 3
  }[]
  defaultEquipId: string
  defaultSkillId: string
  equip: {
    id: string
    level: 1 | 2 | 3
  }[]
}

/**
* Arknights干员信息
*/
export interface CharacterInfo {
  id: string
  name: string
  nationId: string
  groupId: string
  profession: string
  subProfessionId: string
  rarity: 0 | 1 | 2 | 3 | 4 | 5
}

/**
* Arknights公开招募
*/
export interface Recruit {
  startTs: number
  finishTs: number
  /** @deprecated 现在已移除 */
  duration: number
  /** @deprecated 现在已移除 */
  selectTags: { tagId: number; pick: number }[]
  /** 1-闲置 2-招募中 3-招募完成 */
  state: number
}

/**
* Arknights集成战略
*/
export interface Rouge {
  records: RougeRecord[]
}

/**
* Arknights集成战略记录
*/
export interface RougeRecord {
  rougeId: string
  clearTime: number
  relicCnt: number
  bank: { current: number; record: number }
  mission: { current: number; total: number }
}

/**
* Arknights集成战略主题信息
*/
export interface RougeThemeInfo {
  id: string
  name: string
  sort: number
}

/**
* Arknights日常周常
*/
export interface Mission {
  daily: { current: number; total: number }
  weekly: { current: number; total: number }
}

/**
* Arknights时装
*/
export interface Skin {
  id: string
  ts: number
}

/**
* Arknights时装信息
*/
export interface SkinInfo {
  avatarId: string
  brandName: string
  displayTagId: string
  id: string
  illustId: string
  name: string
  portraitId: string
}

/**
* Arknights活动关卡信息
*/
export interface StageLevelInfo {
  id: string
  code: string
  name: string
}

/**
* Arknights玩家状态
*/
export interface PlayerStatus {
  ap: PlayerStatusAp
  avatar: PlayerAvatar
  level: number
  name: string
  registerTs: number
  resume: string
  secretary: PlayerSecretary
  mainStageProgress: string
  uid: string
}

/**
* Arknights玩家理智信息
*/
export interface PlayerStatusAp {
  current: number
  max: number
  lastApAddTime: number
  completeRecoveryTime: number
}

/**
* Arknights玩家头像
*/
export interface PlayerAvatar {
  type: string
  id: string
}

/**
* Arknights玩家助理干员
*/
export interface PlayerSecretary {
  charId: string
  skinId: string
}

/**
* Arknights保全派驻信息
*/
export interface Tower {
  records: TowerRecord
  reward: TowerReward
}

/**
* Arknights保全派驻纪录
*/
export interface TowerRecord {
  towerId: string
  best: number
  hasHard: boolean
  stageNum: number
  unlockHard: boolean
}

/**
* Arknights保全派驻奖励
*/
export interface TowerReward {
  higherItem: { current: number; total: number }
  lowerItem: { current: number; total: number }
  termTs: number
}

/**
* Arknights保全派驻区域信息
*/
export interface TowerZoneInfo {
  id: string
  name: string
  subName: string
  hasHard: boolean
  stageNum: number
}

/**
* Arknights关卡区域信息
*/
export interface ZoneInfo {
  id: string
  name: string
}
