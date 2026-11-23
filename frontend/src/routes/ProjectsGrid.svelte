<script lang="ts">
    import { TileGrid, Tile, Badge } from '@abhc/spektral-ui';

    import {
        locale,
        adapted_color
    } from './store';

    import type {
        Columns,
        HeroSpan,
        ImagePosition,
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
        show_image?: boolean;
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
        aspect_ratio?: string;
    }

    let {
        projects,
        columns = 3,
        show_image = false,
        image_position = "center",
        hero_span = "half",
        pattern = "none",
        pattern_color = undefined,
        pattern_opacity = 0.4,
        pattern_size = "40px",
        pattern_effect = "none",
        pattern_effect_opacity = 1,
        pattern_mask = "none",
        pattern_mask_direction = "left",
        pattern_mask_size = 70,
        aspect_ratio = "4/3"
    }: Props = $props();

    const tiles = $derived(
        projects
            .filter(p => p.display)
            .map(p => ({
                id: p.id,
                name: p.name ?? p.id,
                href: `/projects/${p.id}`,
                hero: p.hero,
                src: show_image ? p.media[0]?.src : undefined,
                abstract: p.abstract[$locale],
                origin: { 
                    label: p.origin.label[$locale], 
                    palette: p.origin.palette, 
                    variant: p.origin.variant 
                },
                years: p.years
                    ? { 
                        label: p.years.label[$locale], 
                        palette: p.years.palette, 
                        variant: p.years.variant 
                    }
                    : undefined,
                corner: p.corner
                    ? { 
                        label: p.corner.label[$locale], 
                        palette: p.corner.palette, 
                        variant: p.corner.variant 
                    }
                    : undefined,
            }))
    );
</script>

<section class="grid-container">
    <TileGrid
        columns={columns}
        image_position={image_position}
        elevation_persist={true}
        pattern={pattern}
        pattern_color={pattern_color ?? $adapted_color}
        pattern_opacity={pattern_opacity}
        pattern_size={pattern_size}
        pattern_effect={pattern_effect}
        pattern_effect_opacity={pattern_effect_opacity}
        pattern_mask={pattern_mask}
        pattern_mask_direction={pattern_mask_direction}
        pattern_mask_size={pattern_mask_size}
        hero_span={hero_span}
        elevation="hard"
        aspect_ratio={aspect_ratio}
    >
        {#each tiles as tile (tile.id)}
            <Tile
                name={tile.name}
                abstract={tile.abstract}
                href={tile.href}
                hero={tile.hero}
                src={tile.src}
            >
                {#snippet corner()}
                    {#if tile.corner}
                        <Badge 
                            palette={tile.corner.palette ?? 'tone'} 
                            variant={tile.corner.variant} 
                            elevation="subtle"
                            size="sm"
                        >
                            {tile.corner.label}
                        </Badge>
                    {/if}
                {/snippet}
                
                {#snippet meta()}
                    {#if tile.years}
                        <Badge 
                            palette={tile.origin.palette ?? 'accent'} 
                            variant={tile.origin.variant} 
                            elevation="subtle"
                            uppercase
                            size="sm"
                        >
                            {tile.origin.label}
                        </Badge>
                    {/if}

                    {#if tile.years}
                        <Badge 
                            palette={tile.years.palette ?? 'accent'} 
                            variant={tile.years.variant} 
                            elevation="subtle"
                            uppercase
                            size="sm"
                        >
                            {tile.years.label}
                        </Badge>
                    {/if}
                {/snippet}
            </Tile>
        {/each}
    </TileGrid>
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
