<script lang="ts">
    import { page } from '$app/state';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { locale, trans } from '../../store';
    import Prose from '$lib/components/Prose.svelte';
    import type { ProjectItem, Media } from '$lib/types/projects';
    import { 
        Headline, 
        Badge, 
        Button, 
        ListItem, 
        Avatar 
    } from '@abhc/spektral-ui';


    interface PageData {
        project: ProjectItem;
        section: 'hardware' | 'software';
    }

    let { data }: { data: PageData } = $props();

    let active_media_index = $state(0);
    let info_section_height = $state(0);

    // Average height for a media item in 16:9 aspect ratio (estimate)
    const MEDIA_HEIGHT_ESTIMATE = 400; // pixels including margins
    const MEDIA_HEIGHT_MARGIN = 100; // Safety margin

    function handleBack() {
        goto('/#section-' + data.section);
    }

    function openExternal(url: string) {
        window.open(url, '_blank', 'noopener,noreferrer');
    }

    function capitalizeStr(str: string) {
        const cap_str = str[0].toUpperCase() + str.slice(1);
        return cap_str;
    }

    // Calculate how many media items fit in sidebar based on info section height
    const media_in_sidebar = $derived.by(() => {
        if (info_section_height === 0) return 1;

        // Calculate how many additional media can fit alongside the first one
        const available_height = info_section_height - MEDIA_HEIGHT_ESTIMATE;
        const additional_media = Math.floor(available_height / MEDIA_HEIGHT_ESTIMATE);

        // Total in sidebar = first media + additional ones that fit
        return Math.min(
            1 + Math.max(0, additional_media),
            (data.project.media).length
        );
    });

    // Derived banner media (displayed in sidebar)
    const banner_media = $derived((data.project.media).slice(0, media_in_sidebar));

    // Derived showcase media (rest of the media)
    const showcase_media = $derived((data.project.media).slice(media_in_sidebar));

    onMount(() => {
        // Initial calculation
        console.log(media_in_sidebar);
    });
</script>

<svelte:head>
    <title>{data.project.name} - {data.project.abstract[$locale]}</title>
    <meta name="description" content={data.project.description[$locale].substring(0, 160)} />
</svelte:head>

<article class="project-detail">
    <!-- Breadcrumb / Navigation ------------------------------------------- -->
    <nav class="breadcrumb">
        <Button
            variant="flat"
            palette="tone"
            animate="left"
            onclick={handleBack}
        >
            <icon class="material-symbols-outlined">arrow_back</icon>
            {data.section === 'hardware' ? $trans?.summary.hardware : $trans?.summary.software}
        </Button>
    </nav>

    <!-- Project Header ----------------------------------------------------- -->
    <div class="project-header">
        <div class="project-name">
            <h1>{data.project.name}</h1>
            <h3>{data.project.abstract[$locale]}</h3>
        </div>
        <aside class="project-misc">
            <Badge palette="accent" elevation="hard" uppercase>
                {data.project.origin}
            </Badge>
            <Badge palette="neutral" elevation="hard" uppercase>
                {data.project.years}
            </Badge>
        </aside>
    </div>

    <!-- Main Content Grid -------------------------------------------------- -->
    <div class="content-grid" id="main-grid">
        <!-- Left: Media Viewer -->
        <section class="media-section">
            {#each banner_media as media}
                <div class="main-media">
                    {#if media.type === 'image' || media.type === 'gif'}
                        <img src={media.src} alt={media.label?.[$locale] ?? ''} />
                        {#if media.label}
                            <div
                                class="media-overlay"
                                style="
                                    flex-direction: {media.label.layout?.['flex-direction'] ?? 'column'};
                                    align-items: {media.label.layout?.['align-items'] ?? 'center'};
                                    justify-content: {media.label.layout?.['justify-content'] ?? 'center'};
                                "
                            >
                                <p>{media.label[$locale]}</p>
                            </div>
                        {/if}
                    {:else if media.type === 'video'}
                        <video
                            src={media.src}
                            autoplay={media.props?.autoplay ?? false}
                            controls={media.props?.controls ?? true}
                            muted={media.props?.muted ?? false}
                            loop={media.props?.loop ?? false}
                        ></video>
                    {/if}
                </div>
            {/each}
        </section>

        <!-- Right: Project Information -->
        <section class="info-section" bind:clientHeight={info_section_height}>
            <!-- Description -->
            <div class="info-block flush-top">
                <Headline size="sm" uppercase>
                    {$trans?.projects_gallery.description}
                </Headline>
                <div class="description-text">
                    <Prose source={data.project.description[$locale]} />
                </div>
            </div>

            <!-- Team -->
            {#if data.project.partners.length > 0}
                <div class="info-block">
                    <Headline size="sm" uppercase>
                        {$trans?.projects_gallery.team}
                    </Headline>
                    <div class="team-grid">
                        {#each data.project.partners as partner}
                            <ListItem
                                label={partner.name}
                                palette="tone"
                                elevation="hard"
                            >
                                {#snippet leading()}
                                    <Avatar
                                        shape="circular"
                                        size="md"
                                        label={partner.label}
                                        src={partner.avatar}
                                        alt={partner.name}
                                    />
                                {/snippet}
                                {partner[$locale]}
                            </ListItem>
                        {/each}
                    </div>
                </div>
            {/if}

            <!-- Tags -->
            {#if !data.project.links && !data.project.models}
                {#if data.project.tags[$locale].length > 0}
                    <div class="info-block">
                        <Headline size="sm" uppercase>
                            {$trans?.projects_gallery.tags}
                        </Headline>
                        <div class="tags-container">
                            {#each data.project.tags[$locale] as tag}
                                <Badge palette="accent" elevation="hard">
                                    {tag}
                                </Badge>
                            {/each}
                        </div>
                    </div>
                {/if}
            {/if}

            <!-- Demo Link -->
            {#if data.project.demo}
                <Button
                    variant="flat"
                    palette="accent"
                    elevation="hard"
                    elevation_persist
                    size="lg"
                    onclick={() => openExternal(data.project.demo!)}
                >
                    {$trans?.projects_gallery.demo_btn}
                    <icon class="material-symbols-outlined">open_in_new</icon>
                </Button>
            {/if}
        </section>
    </div>

    <!-- Secondary Content Grid --------------------------------------------- -->
    {#if data.project.links || data.project.models}
        <div class="content-grid" id="secondary-grid">
            <section class="links-section">
                <Headline size="sm" uppercase>
                    {$trans?.projects_gallery.links}
                </Headline>
                <div class="links-block">
                    <!-- 3D Model -->
                    {#if data.project.models}
                        <Button
                            variant="flat"
                            palette="accent"
                            elevation="hard"
                            elevation_persist
                            size="lg"
                        >
                            <icon class="material-symbols-outlined">3d_rotation</icon>
                            {$trans?.projects_gallery.model_link}
                        </Button>
                    {/if}

                    <!-- Demo Links -->
                    {#each data.project.links as link}
                        <Button
                            variant="flat"
                            palette="accent"
                            elevation="hard"
                            elevation_persist
                            size="lg"
                            onclick={() => openExternal(link.url)}
                        >
                            {#if link.type === "github"}
                                <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                                {capitalizeStr(link.type)}
                            {:else if link.type === "gitlab"}
                                <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z"/>
                                </svg>
                                {capitalizeStr(link.type)}
                            {:else}
                                <icon class="material-symbols-outlined">open_in_new</icon>
                                {$trans?.projects_gallery.demo_link}
                            {/if}
                        </Button>
                    {/each}
                </div>
            </section>

            <section class="info-section">
                <!-- Tags -->
                {#if data.project.tags[$locale].length > 0}
                    <div class="info-block full-block">
                        <Headline size="sm" uppercase>
                            {$trans?.projects_gallery.tags}
                        </Headline>
                        <div class="tags-container tags-align">
                            {#each data.project.tags[$locale] as tag}
                                <Badge palette="accent" elevation="hard">
                                    {tag}
                                </Badge>
                            {/each}
                        </div>
                    </div>
                {/if}
            </section>
        </div>
    {/if}

    <!-- Showcase ----------------------------------------------------------- -->
    <section class="showcase-section">
        {#each showcase_media as media}
            <div class={media.fit ? "showcase-block no-16-9" : "showcase-block"}>
                {#if media.type === 'image' || media.type === 'gif'}
                    <img
                        src={media.src}
                        alt={data.project.abstract[$locale]}
                        style="object-fit: {media.fit ?? 'cover'};"
                    />
                    {#if media.label && media.label.layout?.position === "inside"}
                        <div
                            class="media-overlay"
                            style="
                                flex-direction: {media.label.layout?.['flex-direction'] ?? 'column'};
                                align-items: {media.label.layout?.['align-items'] ?? 'center'};
                                justify-content: {media.label.layout?.['justify-content'] ?? 'center'};
                            "
                        >
                            <p>{media.label[$locale]}</p>
                        </div>
                    {/if}
                {:else if media.type === 'video'}
                    <video
                        src={media.src}
                        autoplay={media.props?.autoplay ?? false}
                        controls={media.props?.controls ?? true}
                        muted={media.props?.muted ?? false}
                        loop={media.props?.loop ?? false}
                    ></video>
                {/if}
            </div>
            {#if media.label && media.label.layout?.position === "outside"}
                <p class="outside-label">
                    {media.label[$locale]}
                </p>
            {/if}
        {/each}
    </section>
</article>

<style>
    .project-detail {
        /*max-width: 1400px;*/
        /*margin: 0 auto;*/
        padding: 2rem;
        color: var(--spk-text);
        display: flex;
        flex-direction: column;
    }

    .breadcrumb {
        margin-bottom: 2rem;
    }

    .project-header {
        display: flex;
        align-items: center;
        gap: 50px;
        margin-bottom: 3rem;
    }

    .project-misc {
        display: flex;
        gap: 20px;
    }

    .project-header h1 {
        font-size: 2.5rem;
        margin: 0;
    }

    .content-grid {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 3rem;
        margin-bottom: 1.5rem;
    }

    .media-section {
        top: 2rem;
    }

    .main-media {
        width: 100%;
        aspect-ratio: 16 / 9;
        background: var(--spk-tone);
        overflow: hidden;
        margin-bottom: 1rem;
        box-shadow: var(--spk-elevation-hard) var(--spk-shadow-hard);
    }

    .main-media img,
    .main-media video {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .info-section {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .info-block {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    /* Align Headline with the top edge of the left media (kill UA heading margin). */
    .flush-top :global(h1),
    .flush-top :global(h2),
    .flush-top :global(h3) {
        margin-top: 0;
    }

    .full-block {
        display: flex;
        flex-direction: column;
        flex: 1;
    }

    .description-text {
        line-height: 1.8;
        text-align: justify;
    }

    .team-grid {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    /* Avatar inside ListItem leading slot — orthogonal corners per global aesthetic */
    .partner-avatar {
        width: 60px;
        height: 60px;
        object-fit: cover;
        display: block;
    }

    .tags-container {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
    }

    .tags-align {
        align-items: center;
        flex: 1;
        align-content: center;
    }

    .social-icon {
        width: 24px;
        height: 24px;
        position: relative;
        z-index: 1;
        transition: all 0.3s ease;
    }

    .links-section {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .links-block {
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        gap: 2rem;
    }

    .showcase-section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 1rem;
    }

    .showcase-block {
        position: relative;
        width: 100%;
        aspect-ratio: 16 / 9;
        background: var(--spk-tone);
        overflow: hidden;
        box-shadow: var(--spk-elevation-hard) var(--spk-shadow-hard);
    }

    .showcase-block img,
    .showcase-block video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }

    .no-16-9 {
        aspect-ratio: auto;
    }

    .media-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        padding: 2rem;
        color: #ffffff;
        pointer-events: none;
    }

    .media-overlay p {
        padding: 0.75rem 1.25rem;
        background: var(--spk-tone);
        color: var(--spk-text);
        font-weight: 600;
        box-shadow: var(--spk-elevation-hard) var(--spk-shadow-hard);
    }

    .outside-label {
        margin: 0.5rem 1.5rem;
        text-align: justify;
        font-style: italic;
    }

    @media (max-width: 1024px) {
        .content-grid {
            grid-template-columns: 1fr;
        }

        .media-section {
            position: static;
        }
    }

    @media (max-width: 768px) {
        .project-detail {
            padding: 1rem;
        }

        .project-header h1 {
            font-size: 1.75rem;
        }
    }
</style>
