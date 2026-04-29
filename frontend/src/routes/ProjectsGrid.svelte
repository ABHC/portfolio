<script lang="ts">
    import { TileGrid } from '@abhc/spektral-ui';

    import { 
        trans,
        locale,
        theme_color
    } from './store';

    import type { 
        Tile, 
        TileMedia, 
        Columns, 
        HeroSpan, 
        ImageMode, 
        ImagePosition, 
        TileGridElevation, 
        TileGridEffect, 
        TileGridMask, 
        TileGridMaskDirection, 
        PatternPreset,
    } from '@abhc/spektral-ui';

    import type {
        ProjectItem,
    } from '$lib/types/projects';

    interface Props {
        projects: readonly ProjectItem[];
        columns?: Columns;
        image_mode?: ImageMode;
        image_position?: ImagePosition;
        hero_span?: HeroSpan;
        pattern?: PatternPreset;
        pattern_color?: string;
        pattern_opacity?: number;
        pattern_size?: string;
        pattern_effect?: TileGridEffect;
        pattern_effect_opacity?: number;
        pattern_mask?: TileGridMask;
        pattern_mask_direction?: TileGridMaskDirection;
        pattern_mask_size?: number;
    }

    let {
        projects,
        columns = 3,
        image_mode = "flat",
        image_position = "center",
        hero_span = "half",
        pattern = "none",
        pattern_color = undefined,
        pattern_opacity = 0.4,
        pattern_size = "40px",
        pattern_effect = "none",
        pattern_effect_opacity = 1,
        pattern_mask= "none",
        pattern_mask_direction = "left",
        pattern_mask_size = 70
    }: Props = $props();

    const tiles: Tile[] = $derived(
        projects
            .filter(p => p.display)
            .map(p => ({
                id: p.id,
                name: p.name ?? p.id,
                origin: p.origin,
                years: p.years,
                display: p.display,
                hero: p.hero,
                hero_text: { ...p.medal } as Record<string, string>,
                media: p.media.map(m => ({ src: m.src, type: m.type })),
                abstract: { ...p.abstract } as Record<string, string>,
            }))
    );

    let adapted_color : string = $derived(
        $theme_color === "dark" ? "white" : "black"
    );
</script>
  
<section class="grid-container">
    <TileGrid
        locale={$locale}
        tiles={tiles}
        columns={columns}
        image_mode={image_mode}
        image_position={image_position}
        elevation_persist={true}
        pattern={pattern}
        pattern_color={pattern_color ?? adapted_color}
        pattern_opacity={pattern_opacity}
        pattern_size={pattern_size}
        pattern_effect={pattern_effect}
        pattern_effect_opacity={pattern_effect_opacity}
        pattern_mask={pattern_mask}
        pattern_mask_direction={pattern_mask_direction}
        pattern_mask_size={pattern_mask_size}
        hero_span={hero_span}
        show_hero_badge={true}
        href_base="/projects"
        elevation="hard"
    />
</section>

<style>
    .grid-container {
        /*width: 100%;
        color: var(--text);*/
    }

    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
            opacity: 1;
        }
        50% {
            transform: scale(1.05);
            opacity: 0.9;
        }
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {

    }

    @media (min-width: 1400px) {

    }
</style>