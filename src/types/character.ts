/**
 * 干员信息
 */
export interface CharacterInfo {
  id: string
  name: string
  nationId: string
  groupId: string
  displayNumber: string
  /** 主职业 */
  profession: string
  /** 分支 */
  subProfessionId: string
  rarity: 0 | 1 | 2 | 3 | 4 | 5
}

/** 干员数据 */
export interface Character {
  /** 干员角色ID */
  charId: CharacterInfo['id']
  /** 干员皮肤Id */
  skinId: Skin['id']
  level: number
  /** 精英化等级 */
  evolvePhase: 0 | 1 | 2
  /** 潜能等级 */
  potentialRank: number
  skills: CharacterSkill[]
  /** 技能等级 */
  mainSkillLvl: number
  /** 模组 */
  equip: CharacterEquip[]
  favorPercent: number
  defaultSkillId: string
  gainTime: number
  defaultEquipId?: EquipmentInfo['id']
}

/** 干员技能 */
export interface CharacterSkill {
  id: string
  /** 技能专精等级 */
  specializeLevel: number
}

/** 干员模组 */
export interface CharacterEquip {
  id: EquipmentInfo['id']
  level: number
}

/** 助战干员 */
export interface AssistCharacter extends Omit<Character, 'skills' | 'equip' | 'favorPercent' | 'defaultSkillId' | 'gainTime' | 'defaultEquipId'> {
  equip: null
  skillId: CharacterSkill['id']
  specializeLevel: CharacterSkill['specializeLevel']
}

/** 皮肤数据 */
export interface Skin {
  id: string
  /** 获得时间 */
  ts: number
}

/** 皮肤信息 */
export interface SkinInfo {
  id: string
  brandId: string
  sortId: number
  displayTagId: string
}

/**
 * 角色模组信息
 */
export interface EquipmentInfo {
  id: string
  name: string
  shiningColor: string
  typeIcon: string
  typeName2?: string
}
