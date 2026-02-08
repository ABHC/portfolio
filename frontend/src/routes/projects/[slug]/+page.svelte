<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { locale, trans } from '../../store';
    import type { ProjectItem, Media } from '$lib/types/projects';

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

    function capitalizeStr(str:string) {
        const cap_str = str[0].toUpperCase() + str.slice(1);
        return cap_str;
    };

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
    <title>{data.project.name} - {data.project.title[$locale]}</title>
    <meta name="description" content={data.project.description[$locale].substring(0, 160)} />
</svelte:head>

<article class="project-detail">
    <!-- Breadcrumb / Navigation -->
    <nav class="breadcrumb">
        <button onclick={handleBack} class="back-btn">
            <icon class="material-symbols-outlined">arrow_back</icon>
            {data.section === 'hardware' ? $trans?.menu.hardware : $trans?.menu.software}
        </button>
    </nav>

    <!-- Project Header -->
    <div class="project-header">
        <div class="project-name">
            <h1>{data.project.name}</h1>
            <h3>{data.project.title[$locale]}</h3>
        </div>
        <aside class="project-misc">
            <div class="badge">{data.project.origin}</div>
            <div class="badge">{data.project.years}</div>
        </aside>
    </div>

    <!-- Main Content Grid -->
    <div class="content-grid" id="main-grid">
        <!-- Left: Media Viewer -->
        <section class="media-section">
            <!-- Main Media Display -->
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

            <!-- Media Thumbnails -->
            <!--{#if data.project.media.length > 1}
                <div class="media-thumbnails">
                    {#each data.project.media as media, i}
                        {#if isSimpleMedia(media)}
                            <button 
                                class="thumbnail {active_media_index === i ? 'active' : ''}"
                                onclick={() => active_media_index = i}
                            >
                                <img src={media.src} alt="Preview {i + 1}" />
                            </button>
                        {/if}
                    {/each}
                </div>
            {/if}-->
        </section>

        <!-- Right: Project Information -->
        <section class="info-section">
            <!-- Description -->
            <div class="info-block">
                <div class="block-title">
                    <h2 id="desc-section">{$trans?.projects_gallery.description}</h2>
                    <hr>
                </div>
                <p class="description-text">{data.project.description[$locale]}</p>
            </div>

            <!-- Team -->
            {#if data.project.partners.length > 0}
                <div class="info-block">
                    <div class="block-title">
                        <h2 id="team-section">{$trans?.projects_gallery.team}</h2>
                        <hr>
                    </div>
                    <div class="team-grid">
                        {#each data.project.partners as partner}
                            <div class="team-member">
                                <img src={partner.avatar} alt={partner.name} class="avatar" />
                                <div class="member-info">
                                    <p class="member-name">{partner.name}</p>
                                    <p class="member-role">{partner[$locale]}</p>
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}

            <!-- Tags -->
            {#if !data.project.links && !data.project.models}
                {#if data.project.tags[$locale].length > 0}
                    <div class="info-block">
                        <div class="block-title">
                            <h2 id="tags-section">{$trans?.projects_gallery.tags}</h2>
                            <hr>
                        </div>
                        <div class="tags-container">
                            {#each data.project.tags[$locale] as tag}
                                <span class="tag">{tag}</span>
                            {/each}
                        </div>
                    </div>
                {/if}
            {/if}

            <!-- Demo Link -->
            {#if data.project.demo}
                <a href={data.project.demo} target="_blank" class="demo-link">
                    <button class="demo-btn accent">
                        {$trans?.projects_gallery.demo_btn}
                        <icon class="material-symbols-outlined">open_in_new</icon>
                    </button>
                </a>
            {/if}
        </section>
    </div>

    <!-- Secondary Content Grid -->
    {#if data.project.links || data.project.models}
        <div class="content-grid" id="secondary-grid">
            <section class="links-section">
                <div class="block-title">
                    <h2 id="links-section">{$trans?.projects_gallery.links}</h2>
                    <hr>
                </div>
                <div class="links-block">
                    <!-- 3D Model -->
                    {#if data.project.models}
                        <div class="demo-link">
                            <button class="demo-btn accent">
                                <icon class="material-symbols-outlined">3d_rotation</icon>
                                {$trans?.projects_gallery.model_link}
                            </button>
                        </div>
                    {/if}

                    <!-- Demo Links -->
                    {#each data.project.links as link}
                        <a href={link.url} target="_blank" class="demo-link">
                            <button class="demo-btn accent">
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
                            </button>
                        </a> 
                    {/each}
                </div>
            </section>

            <section class="info-section">
                <!-- Tags -->
                {#if data.project.tags[$locale].length > 0}
                    <div class="info-block full-block">
                        <div class="block-title">
                            <h2 id="tags-section">{$trans?.projects_gallery.tags}</h2>
                            <hr>
                        </div>
                        <div class="tags-container tags-align">
                            {#each data.project.tags[$locale] as tag}
                                <span class="tag">{tag}</span>
                            {/each}
                        </div>
                    </div>
                {/if}
            </section>
        </div>
    {/if}

    <section class="showcase-section">
        {#each showcase_media as media}
            <div class={media.fit ? "showcase-block no-16-9" : "showcase-block"}>
                {#if media.type === 'image' || media.type === 'gif'}
                    <img 
                        src={media.src} 
                        alt={data.project.title[$locale]} 
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
        max-width: 1400px;
        margin: 0 auto;
        padding: 2rem;
        color: var(--text);
        display: flex;
        flex-direction: column;
    }

    .breadcrumb {
        margin-bottom: 2rem;
    }

    .back-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.25rem;
        background: var(--card);
        border: none;
        border-radius: 8px;
        color: var(--text);
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .back-btn:hover {
        background: var(--accent);
        color: var(--text-accent);
        transform: translateX(-4px);
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

    .badge {
        display: inline-block;
        padding: 0.5rem 1rem;
        background: var(--accent-light);
        color: var(--text-accent);
        border-radius: 20px;
        font-size: 0.875rem;
        font-weight: 600;
        text-transform: uppercase;
        margin-bottom: 1rem;
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
        /*height: fit-content;*/
    }

    .main-media {
        width: 100%;
        aspect-ratio: 16 / 9;
        background: var(--card);
        border-radius: var(--radius-small-ev);
        overflow: hidden;
        margin-bottom: 1rem;
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

    .block-title {
        display: flex;
        align-items: baseline;
        margin-bottom: 1rem;
        gap: 10px;
    }

    .block-title h2 {
        font-size: 1.5rem;
        text-transform: uppercase;
    }

    .block-title hr {
        flex: 1;
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

    .team-member {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: var(--card);
        border-radius: 8px;
    }

    .avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        object-fit: cover;
    }

    .member-info {
        flex: 1;
    }

    .member-name {
        font-weight: 700;
        margin-bottom: 0.25rem;
    }

    .member-role {
        font-style: italic;
        opacity: 0.8;
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

    .tag {
        padding: 0.5rem 1rem;
        background: var(--accent-light);
        color: var(--text-accent);
        border-radius: 20px;
        font-size: 0.875rem;
    }

    .demo-link {
        display: block;
    }

    .demo-btn {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 1rem 2rem;
        border: none;
        border-radius: 8px;
        font-size: 1.125rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease;
        color: var(--text-accent);
    }

    .demo-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
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
        background: var(--card);
        border-radius: var(--radius-large-ev);
        overflow: hidden;
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
        
        /* Gradient pour la lisibilité du texte */
        /*background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.7) 0%,
            rgba(0, 0, 0, 0.3) 50%,
            rgba(0, 0, 0, 0) 100%
        );*/
        
        color: #ffffff;
        pointer-events: none;
    }

    .media-overlay p {
        padding: 0.75rem 1.25rem;
        background: var(--card);
        border: none;
        border-radius: 8px;
        color: var(--text);
        font-weight: 600;
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