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
  
/** Single 3D model file */
export interface Model3D {
    readonly file: string
    readonly color?: string
    readonly texture?: string
    readonly textureParams: TextureParams
}
  
/** Themes for 3D models */
export interface Theme {
    readonly id: string
    readonly fr: string
    readonly en: string
}
  
/** Base media interface */
export interface BaseMedia {
    readonly type: 'image' | 'gif' | 'video' | '3d' | 'tooltip'
}
  
/** Simple media (image, gif, video, tooltip) */
export interface SimpleMedia extends BaseMedia {
    readonly src: string
}
  
/** Complex 3D media */
export interface Media3D extends BaseMedia {
    readonly type: '3d'
    readonly models: readonly Model3D[]
    readonly themes?: readonly Theme[]
    readonly arch?: readonly string[]
}
  
/** Union of all media types */
export type Media = Readonly<SimpleMedia | Media3D>
  
/** Tags */
export interface Tags {
    readonly fr: readonly string[]
    readonly en: readonly string[]
}
  
/** Common structure for each project entry */
export interface ProjectItem {
    readonly id: string
    readonly display: boolean
    readonly origin: string
    readonly partners: readonly Partner[]
    readonly title: LocalizedText
    readonly description: LocalizedText
    readonly media: readonly Media[]
    readonly demo?: string
    readonly tags: Tags
}
  
/** Root project structure */
export interface ProjectsData {
    readonly software: readonly ProjectItem[]
    readonly hardware: readonly ProjectItem[]
}