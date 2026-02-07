/* -----------------------------------------
* PROFIL.JSON TYPES
* ----------------------------------------- */

import type { IconKey } from '$lib/utils/iconsBank';

/** Language-specific text */
export interface LocalizedText {
    readonly fr: string
    readonly en: string
}

/** Language-specific array of text */
export interface LocalizedTextArray {
    readonly fr: readonly string[]
    readonly en: readonly string[]
}

/** Personal information */
export interface PersonalInfo {
    readonly id: Identity[]
    readonly firstname: string
    readonly secondname: string
    readonly thirdname: string
    readonly nickname: LocalizedText
    readonly surname: string
    readonly tagline: LocalizedTextArray
    readonly about: LocalizedTextArray
    readonly portrait: string
}

export interface Identity {
    readonly type: string
    readonly name: string
    readonly display: boolean
}

/** Study or certification entry */
export interface Study {
    readonly type: 'diploma' | 'certificate'
    readonly name: LocalizedText
    readonly school: string
    readonly college: string | null
    readonly description: LocalizedTextArray
    readonly years: string
    readonly display: boolean
}

/** Job experience entry */
export interface Job {
    readonly position: LocalizedText
    readonly company: string
    readonly city: string
    readonly country: string
    readonly description: LocalizedTextArray
    readonly start: number
    readonly end: number
    readonly display: boolean
}

/** Language proficiency */
export interface Language {
    readonly id: string
    readonly name: LocalizedText
    readonly level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
    readonly description: LocalizedText
    readonly display: boolean
}

/** Tool or software */
export interface Tool {
    readonly name: IconKey
    readonly display: boolean
}

/** Skills categorised by domain */
export interface Skills {
    readonly fr: {
        readonly hardware: readonly string[]
        readonly software: readonly string[]
        readonly management: readonly string[]
    }
    readonly en: {
        readonly hardware: readonly string[]
        readonly software: readonly string[]
        readonly management: readonly string[]
    }
}

/** Contact information */
export interface Contact {
    readonly type: 'Phone' | 'Mail' | 'Linkedin' | 'Github' | 'Gitlab'
    readonly address: string
    readonly icon: null | string
    readonly display: boolean
}

/** Reference or testimonial */
export interface Reference {
    readonly person: string
    readonly position: LocalizedText
    readonly portrait: string
    readonly content: LocalizedTextArray
    readonly display: boolean
}

/** Root profil structure */
export interface ProfileData {
    readonly me: PersonalInfo
    readonly studies: readonly Study[]
    readonly jobs: readonly Job[]
    readonly languages: readonly Language[]
    readonly tools: readonly Tool[]
    readonly skills: Skills
    readonly contact: readonly Contact[]
    readonly references: readonly Reference[]
}