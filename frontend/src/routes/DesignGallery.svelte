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

<section class="design-gallery">
    <div class="projects-grid">
        {#each projects as project}
            {#if project.display}
                <a 
                    href="/projects/{project.id}"
                    class="project-card {project.hero === true ? 'hero-card' : ''}"
                    data-sveltekit-preload-data="hover"
                    style="--bg-image: url('{project.media[0].src}');"
                >
                    <div class="card-overlay">
                        <div class="card-content">
                            <span class="origin-badge">{project.origin}</span>
                            <h3 class="project-title">{project.name}</h3>
                            <h5 class="project-excerpt">
                                {project.title[$locale].length > 42
                                  ? project.title[$locale].substring(0, 42) + '…'
                                  : project.title[$locale]}
                            </h5>
                        </div>
                    </div>
                </a>
            {/if}
        {/each}
    </div>
</section>

<style>
    .design-gallery {
        width: 100%;
        color: var(--text);
    }

    .projects-grid {
        /*display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));*/
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 2rem;
        padding: 1rem 0;
    }

    .project-card {
        position: relative;
        width: 400px;
        aspect-ratio: 4 / 3;
        border-radius: 12px;
        overflow: hidden;
        background-image: var(--bg-image);
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        cursor: pointer;
        text-decoration: none;
        color: inherit;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .project-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
    }

    .hero-card {
        width: 400px;
        aspect-ratio: 4 / 3;
    }

    .card-overlay {
        background: var(--overlay);
    }

    .card-overlay {
        position: absolute;
        inset: 0;
        background:
            linear-gradient(
                to top,
                rgba(0, 0, 0, 0.65) 0%,   /* Strong reading zone */
                rgba(0, 0, 0, 0.45) 50%,
                rgba(0, 0, 0, 0.1) 100%
            ),
            rgba(220, 217, 206, 0.1); /* Subtle UI tint */
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding: 1.5rem;
        transition: background 0.3s ease;
        z-index: 2;
    }

    .card-content {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        z-index: 3;
    }

    .origin-badge {
        display: inline-block;
        width: fit-content;
        padding: 0.35rem 0.75rem;
        background: var(--accent);
        color: var(--text-accent);
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .project-title {
        font-size: 1.5rem;
        font-weight: 700;
        margin: 0;
        color: #ffffff;
        line-height: 1.3;
    }

    .project-excerpt {
        margin: 0;
        opacity: 0.85;
        font-style: italic;
        color: var(--text-accent);
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
        .projects-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }

        .project-card {
            aspect-ratio: 16 / 9;
        }

        .project-title {
            font-size: 1.25rem;
        }

        .project-excerpt {
            display: none;
        }
    }

    @media (min-width: 769px) and (max-width: 1024px) {
        .projects-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (min-width: 1400px) {
        .projects-grid {
            grid-template-columns: repeat(3, 1fr);
        }
    }
</style>