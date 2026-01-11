/* -----------------------------------------
* PROJECTS.JSON TYPES
* ----------------------------------------- */

/** Language-specific text */
export interface LocalizedText {
    readonly fr: string
    readonly en: string
}
  
/** Contributor or collaborator */
export interface Partner {
    readonly name: string
    readonly avatar: string
    readonly fr: string
    readonly en: string
}
  
/** Parameters for texture mapping in 3D models */
export interface TextureParams {
    readonly scale: number
    readonly rotation: number
    readonly offsetX: number
    readonly offsetY: number
}

/** Single part/component of a 3D model */
export interface ModelPart {
    readonly file: string
    readonly color?: string
    readonly texture?: string
    readonly textureParams: TextureParams
}

/** Theme customisation option */
export interface ThemeCustomisation {
    readonly type: 'theme'
    readonly id: string
    readonly fr: string
    readonly en: string
    readonly preview: string
    readonly src: string
}

/** Base customisation interface - can be extended for other types */
export interface BaseCustomisation {
    readonly type: string
    readonly id: string
    readonly fr: string
    readonly en: string
}

/** Union type for all possible customisations */
export type Customisation = ThemeCustomisation | BaseCustomisation

/** Complete 3D model with parts and optional customisations */
export interface Model3D {
    readonly id: string
    readonly fr: string
    readonly en: string
    readonly parts: readonly ModelPart[]
    readonly customisations?: readonly Customisation[]
}
  
/** Flexbox layout configuration for media overlay (inside only) */
export interface MediaLayoutInside {
    readonly position: 'inside'
    readonly 'flex-direction'?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
    readonly 'align-content'?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'stretch'
    readonly 'justify-content'?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
    readonly 'align-items'?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'
}

/** Simple layout for outside labels */
export interface MediaLayoutOutside {
    readonly position: 'outside'
}

/** Union type for layout configurations */
export type MediaLayout = MediaLayoutInside | MediaLayoutOutside

/** Video-specific properties */
export interface VideoProperties {
    readonly autoplay?: boolean
    readonly controls?: boolean
    readonly muted?: boolean
    readonly loop?: boolean
}

/** Base media interface */
interface BaseMedia {
    readonly type: 'image' | 'gif' | 'video' | 'tooltip'
    readonly src: string
    readonly fit?: 'cover' | 'contain'
    readonly label?: MediaLabel
}

/** Image or GIF media */
export interface ImageMedia extends BaseMedia {
    readonly type: 'image' | 'gif' | 'tooltip'
}

/** Video media with specific properties */
export interface VideoMedia extends BaseMedia {
    readonly type: 'video'
    readonly props?: VideoProperties
}

/** Union type for all media */
export type Media = ImageMedia | VideoMedia
  
/** Links */
export interface Links {
    readonly type: 'demo' | 'github' | 'gitlab' 
    readonly url: string
}

/** Tags */
export interface Tags {
    readonly fr: readonly string[]
    readonly en: readonly string[]
}

/** Projects sub-categories */
export type GenresTypes = 'app' | 'tool' | 'showcase' | 'backend' |'study' | 'design' | 'industrialisation';
  
/** Common structure for each project entry */
export interface ProjectItem {
    readonly id: string
    readonly display: boolean
    readonly hero: boolean
    readonly name?: string
    readonly origin: string
    readonly years?: string
    readonly genres: readonly GenresTypes[];
    readonly partners: readonly Partner[]
    readonly title: LocalizedText
    readonly description: LocalizedText
    readonly media: readonly Media[]
    readonly models: readonly Model3D[]
    readonly links?: readonly Links[]
    readonly demo?: string
    readonly tags: Tags
}
  
/** Root project structure */
export interface ProjectsData {
    readonly software: readonly ProjectItem[]
    readonly hardware: readonly ProjectItem[]
}