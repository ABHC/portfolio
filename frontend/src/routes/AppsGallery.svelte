<script lang="ts">

    interface Props {
        projects: readonly ProjectItem[];
    }

    let { projects }: Props = $props();

    import { 
        trans,
        locale
    } from './store';

    import type { 
        ProjectItem, 
        Media, 
    } from '$lib/types/projects';

</script>
  
<section class="apps-gallery">
    <div class="projects-list">
        {#each projects as project}
            {#if project.display}
                <a 
                    href="/projects/{project.id}"
                    class="project-item"
                    data-sveltekit-preload-data="hover"
                >
                    <div class="project-header">
                        <div class="header-left">
                            {#each project.genres as genre}
                                {#if genre === "app"}
                                    <span class="genre-badge">
                                        <icon class="material-symbols-outlined">devices</icon>
                                    </span>
                                {:else if genre === "tool"}
                                    <span class="genre-badge">
                                        <icon class="material-symbols-outlined">home_repair_service</icon>
                                    </span>
                                {:else if genre === "showcase"}
                                    <span class="genre-badge">
                                        <icon class="material-symbols-outlined">globe</icon>
                                    </span>
                                {:else if genre === "backend"}
                                    <span class="genre-badge">
                                        <icon class="material-symbols-outlined">database</icon>
                                    </span>
                                {/if}
                            {/each}
                            <span class="origin-badge">{project.origin}</span>
                            {#if project.years}
                                <span class="years-badge">{project.years}</span>
                            {/if}
                        </div>
                        
                        <icon class="material-symbols-outlined chevron">chevron_right</icon>
                    </div>

                    <div class="project-body">
                        <div class="project-id">
                            <h3 class="project-name">{project.name || project.id}</h3>
                            <h4 class="project-title">{project.title[$locale]}</h4>
                        </div>

                        {#if project.tags[$locale].length > 0}
                            <div class="tags-container">
                                {#each project.tags[$locale].slice(0, 4) as tag}
                                    <span class="tech-tag">{tag}</span>
                                {/each}
                                {#if project.tags[$locale].length > 4}
                                    <span class="tech-tag more">+{project.tags[$locale].length - 4}</span>
                                {/if}
                            </div>
                        {/if}
                    </div>

                    <!--<div class="project-footer">
                        {#if project.demo}
                            <button class="demo-badge">
                                <icon class="material-symbols-outlined">open_in_new</icon>
                                {$trans?.projects_gallery.demo_btn}
                            </button>
                        {/if}
                    </div>-->
                </a>
            {/if}
        {/each}
    </div>
</section>

<style>
    .apps-gallery {
        width: 100%;
        color: var(--text);
    }

    .projects-list {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        padding: 1rem 0;
        max-width: 1200px;
        margin: 0 auto;
    }

    .project-item {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1.75rem;
        background: var(--card);
        border-radius: 12px;
        border-left: 4px solid transparent;
        text-decoration: none;
        color: inherit;
        transition: all 0.3s ease;
        cursor: pointer;
    }

    .project-item:hover {
        border-left-color: var(--accent);
        background: var(--highlight);
        transform: translateX(8px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    }

    .project-item:hover .chevron {
        transform: translateX(4px);
        color: var(--accent);
    }

    .project-item:hover .genre-badge {
        /*background: rgba(29, 179, 148, 0.8);*/
        /*transform: scale(1.1);*/
        opacity: 1;
        transform: rotate(15deg) scale(1.1);
    }

    .project-item:hover .tech-tag {
        transform: scale(1.1);
    }

    .project-item:hover .origin-badge {
        animation: pulse 1.5s ease-in-out infinite;
    }

    .project-item:hover .years-badge {
        animation: pulse 1.5s ease-in-out 0.2s infinite;
    }

    .project-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .header-left {
        display: flex;
        gap: 0.75rem;
        align-items: center;
    }

    .genre-badge {
        display: flex; 
        align-items: center;
        justify-content: center;
        padding: 0.5rem;
        background: var(--accent);
        opacity: 0.8;
        /*background: rgba(29, 179, 148, 0.5);*/
        color: var(--text-accent);
        border-radius: 8px;
        transition: all 0.3s ease;
    }

    .origin-badge,
    .years-badge {
        display: inline-block;
        padding: 0.35rem 0.75rem;
        background: var(--accent);
        color: var(--text-accent);
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .years-badge {
        background: #4a4543;
    }

    .chevron {
        font-size: 28px;
        transition: all 0.3s ease;
        opacity: 0.6;
    }

    .project-body {
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
    }

    .project-id {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .project-name {
        font-size: 1.5rem;
        font-weight: 700;
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .project-title {
        font-size: 1.125rem;
        font-weight: 500;
        margin: 0;
        opacity: 0.85;
        font-style: italic;
    }

    .project-excerpt {
        font-size: 0.95rem;
        line-height: 1.6;
        opacity: 0.8;
        margin: 0.5rem 0 0 0;
        text-align: justify;
    }

    .tags-container {
        display: flex;
        flex-wrap: wrap;
        gap: 0.8rem;
        margin-top: 0.75rem;
    }

    .tech-tag {
        padding: 0.35rem 0.75rem;
        background: var(--accent);
        color: var(--text-accent);
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;
    }

    .tech-tag.more {
        background: var(--accent-dark);
    }

    .project-footer {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-top: 0.5rem;
    }

    .demo-badge {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.5rem 1rem;
        background: var(--accent);
        color: var(--text-accent);
        border: none;
        border-radius: 8px;
        font-size: 0.875rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .demo-badge:hover {
        background: var(--accent-dark);
        transform: scale(1.05);
    }

    .demo-badge icon {
        font-size: 18px;
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
        .projects-list {
            gap: 1rem;
        }

        .project-item {
            padding: 1.25rem;
        }

        .project-name {
            font-size: 1.25rem;
        }

        .project-title {
            font-size: 1rem;
        }

        .project-excerpt {
            display: none;
        }

        .tags-container {
            margin-top: 0.5rem;
        }
    }

    @media (min-width: 1400px) {
        .projects-list {
            max-width: 1400px;
        }
    }
</style>