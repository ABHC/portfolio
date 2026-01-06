<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { locale, trans } from '../../store';
    import type { ProjectItem, Media, SimpleMedia, Media3D } from '$lib/types/projects';

    interface PageData {
        project: ProjectItem;
        section: 'hardware' | 'software';
    }

    let { data }: { data: PageData } = $props();
    
    let active_media_index = $state(0);

    function isSimpleMedia(media: Media): media is SimpleMedia {
        return media.type !== '3d';
    }

    function handleBack() {
        goto('/#section-' + data.section);
    }
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
    <div class="content-grid">
        <!-- Left: Media Viewer -->
        <section class="media-section">
            <!-- Main Media Display -->
            <div class="main-media">
                {#if isSimpleMedia(data.project.media[active_media_index])}
                    {@const media = data.project.media[active_media_index] as SimpleMedia}
                    {#if media.type === 'image' || media.type === 'gif'}
                        <img src={media.src} alt={data.project.title[$locale]} />
                    {:else if media.type === 'video'}
                        <video controls>
                            <source src={media.src} type="video/mp4" />
                            <track kind="captions" />
                        </video>
                    {/if}
                {/if}
            </div>

            <!-- Media Thumbnails -->
            {#if data.project.media.length > 1}
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
            {/if}
        </section>

        <!-- Right: Project Information -->
        <section class="info-section">
            <!-- Description -->
            <div class="info-block">
                <div class="block-title">
                    <h2>{$trans?.projects_gallery.description}</h2>
                    <hr>
                </div>
                <p class="description-text">{data.project.description[$locale]}</p>
            </div>

            <!-- Team -->
            {#if data.project.partners.length > 0}
                <div class="info-block">
                    <div class="block-title">
                        <h2>{$trans?.projects_gallery.team}</h2>
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
            {#if data.project.tags[$locale].length > 0}
                <div class="info-block">
                    <div class="block-title">
                        <h2>{$trans?.projects_gallery.tags}</h2>
                        <hr>
                    </div>
                    <div class="tags-container">
                        {#each data.project.tags[$locale] as tag}
                            <span class="tag">{tag}</span>
                        {/each}
                    </div>
                </div>
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
    }

    .media-section {
        position: sticky;
        top: 2rem;
        height: fit-content;
    }

    .main-media {
        width: 100%;
        aspect-ratio: 16 / 9;
        background: var(--card);
        border-radius: 12px;
        overflow: hidden;
        margin-bottom: 1rem;
    }

    .main-media img,
    .main-media video {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .media-thumbnails {
        display: flex;
        gap: 0.75rem;
        overflow-x: auto;
        padding-bottom: 0.5rem;
    }

    .thumbnail {
        width: 100px;
        height: 70px;
        flex-shrink: 0;
        border: 2px solid transparent;
        border-radius: 6px;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.2s ease;
        background: var(--card);
        padding: 0;
    }

    .thumbnail img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .thumbnail:hover {
        border-color: var(--accent-light);
    }

    .thumbnail.active {
        border-color: var(--accent);
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