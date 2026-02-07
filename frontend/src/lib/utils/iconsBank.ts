// $lib/utils/icons.ts
import type {SimpleIcon} from 'simple-icons';

import {
    siDassaultsystemes,
    siFreecad,
    siSvelte,
    siJavascript,
    siTypescript,
    siPython,
    siDocker,
    siInkscape,
    siFigma,
    siGit,
    siGithub,
    siGitlab,
    siLinux,
    siHtml5
} from 'simple-icons';

// Définition des clés d'icônes disponibles
export type IconKey =
    | 'Solidworks'
    | 'FreeCAD'
    | 'Svelte'
    | 'TypeScript'
    | 'Python'
    | 'Docker'
    | 'Inkscape'
    | 'Figma'
    | 'Git'
    | 'Github'
    | 'Gitlab'
    | 'Linux'
    | 'HTML'
    | 'JavaScript';

// Mapping des clés vers les objets d'icônes
const ICON_MAP: Record<IconKey, SimpleIcon> = {
    'Solidworks': siDassaultsystemes,
    'FreeCAD': siFreecad,
    'Svelte': siSvelte,
    'JavaScript': siJavascript,
    'TypeScript': siTypescript,
    'Python': siPython,
    'Docker': siDocker,
    'Inkscape': siInkscape,
    'Figma': siFigma,
    'Git': siGit,
    'Github': siGithub,
    'Gitlab': siGitlab, 
    'Linux': siLinux,
    'HTML': siHtml5,
};

// Fonction pour obtenir un objet icône
export function getIcon(name: IconKey): SimpleIcon | null {
    return ICON_MAP[name] || null;
}

// Fonction pour obtenir la couleur hexadécimale (avec #)
export function getIconColor(name: IconKey): string {
    const icon = ICON_MAP[name];
    return icon ? `#${icon.hex}` : '#cccccc';
}

// Fonction pour obtenir le chemin SVG
export function getIconPath(name: IconKey): string | null {
    const icon = ICON_MAP[name];
    return icon ? icon.path : null;
}

// Fonction pour générer le SVG complet
export function getIconSVG(
    name: IconKey, 
    options: {
    size?: number;
    color?: string;
    className?: string;
    } = {}
): string {
    const { size = 24, color = 'currentColor', className = '' } = options;
    const icon = ICON_MAP[name];
  
    if (!icon) {
        return '';
    }
  
    return `
        <svg 
        class="${className}"
        viewBox="0 0 24 24" 
        width="${size}" 
        height="${size}"
        fill="${color}"
        aria-label="${icon.title}"
        >
        <path d="${icon.path}" />
        </svg>
    `;
}

export function getContactIcon(type: string): SimpleIcon | null {
    // Mapping des types de contact vers les clés d'icônes
    const contactMap: Record<string, IconKey> = {
      'Github': 'Github',
      'Gitlab': 'Gitlab',
    };
    
    const iconKey = contactMap[type];
    return iconKey ? getIcon(iconKey) : null;
  }

// Fonction pour vérifier si une clé d'icône est valide
export function isValidIconKey(key: string): key is IconKey {
    return key in ICON_MAP;
}

// Exporte le mapping complet pour les cas avancés
export const iconMap = ICON_MAP;