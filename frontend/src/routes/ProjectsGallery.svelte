<script lang="ts">

    interface Props {
        section: string;
        projects: readonly ProjectItem[];
    }

    let { section, projects }: Props = $props();

    import { 
        trans,
        locale
    } from './store';

    import type { 
        ProjectItem, 
        Media, 
        SimpleMedia, 
        Media3D 
    } from '$lib/types/projects';

    let selected: ProjectItem = $state(projects[0]);
    let active_tab: "description" | "team" | "tags" = $state("description");

    function isSimpleMedia(media: Media): media is SimpleMedia {
        return media.type !== '3d';
    }

</script>
  
<section 
    class="gallery-container"
    style="flex-direction: {section === 'hardware' ? 'row-reverse' : 'row'};"
>
    <!-- Left: grid & desc -->
    <div class="projects-overview">
        <div class="projects-grid">
            {#each projects as p}
                {#if p.display == true}
                    <button 
                        class="project-tile {selected.id === p.id ? 'active' : ''}"
                        onclick={() => selected = p}
                    >
                        <span>{p.id}</span>
                    </button>
                {/if}
            {/each}
        </div>
                
        <div class="projects-desc">
            <div class="tabs-nav">
                <button 
                    class="tab-button {active_tab === "description" ? 'active' : ''}" 
                    onclick={() => active_tab = "description"}
                >
                    <icon class="material-symbols-outlined">description</icon>
                </button>
                
                {#if selected.partners.length}
                    <button 
                        class="tab-button {active_tab === "team" ? 'active' : ''}" 
                        onclick={() => active_tab = "team"}
                    >
                        <icon class="material-symbols-outlined">groups</icon>
                    </button>
                {/if}

                {#if selected.tags[$locale].length}
                    <button 
                        class="tab-button {active_tab === "tags" ? 'active' : ''}" 
                        onclick={() => active_tab = "tags"}
                    >
                        <icon class="material-symbols-outlined">tag</icon>
                    </button>
                {/if}
            </div>

            <div class="content-container">
                {#if active_tab === "description"}
                    <!-- Projects Description -->
                    <div class="desc-title">
                        <h5 id="desc-h">{$trans?.projects_gallery.description}</h5>
                        <hr>
                    </div>

                    <div class="tab-content">
                        <p>{selected.description[$locale]}</p>
                    </div>
                {:else if active_tab === "team"}
                    <!-- Team -->
                    <div class="desc-title">
                        <h5 id="desc-h">{$trans?.projects_gallery.team}</h5>
                        <hr>
                    </div>

                    <div class="tab-content">
                        {#if selected.partners.length}
                            {#each selected.partners as person}
                                <div class="person">
                                    <img id="avatar" src={person.avatar} alt={person.name}/>
                                    <p id="name">{person.name}</p>
                                    <p id="job">{person[$locale]}</p>
                                </div>
                            {/each}
                        {/if}
                    </div>
                {:else if active_tab === "tags"}    
                    <!-- Tags : technos & skills -->
                    <div class="desc-title">
                        <h5 id="desc-h">{$trans?.projects_gallery.tags}</h5>
                        <hr>
                    </div>

                    <div class="tab-content tab-tags">
                        {#if selected.tags[$locale].length}
                            <div class="tags-container">
                                {#each selected.tags[$locale] as tag}
                                    <span class="tech-tag">{tag}</span>
                                {/each}
                            </div>
                        {/if}
                    </div>
                {/if}
            </div>
        </div>
    </div>

    <!-- Right: media tile -->
    <div 
        class="media-tile"
        style="--bg:url({isSimpleMedia(selected.media[0]) ? selected.media[0].src : ''});"
    >
        <div class="overlay">
            <h2>{selected.title[$locale]}</h2>
            
            {#if selected.demo}
                <a href={selected.demo} aria-label={$trans?.projects_gallery.demo_aria} target="_blank">
                    <button class="demo-btn accent acc-highlight-dark">
                        {$trans?.projects_gallery.demo_btn}
                    </button>
                </a>
            {:else}
                <button class="demo-btn accent acc-highlight-dark">
                    {$trans?.projects_gallery.modal_btn}
                </button>
            {/if}
        </div>
    </div>
</section>

<style>
    .gallery-container {
        position: relative;
        display: flex;
        justify-content:space-around;
        min-height: 40vh;
        color: var(--text);
    }
    
    /* left grid */
    .projects-overview {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        width: 45%;
        /*margin: 2% 0%;*/
    }

    .projects-grid {
        position: relative;
        z-index: 1;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-content: center;
        gap: 1.5rem;
    }
    
    .project-tile {
        width: 110px;
        height: 110px;
        background: var(--card);
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.3s, transform 0.2s;
    }
    .project-tile:hover {
        background: var(--accent-dark);
        color: var(--text-accent);
        transform: translateY(-4px);
    }
    .project-tile.active {
        background: var(--accent);
        color: var(--text-accent);
    }

    .projects-desc {
        width: 90%;
        height: 25vh;
        min-height: 200px;
        padding: 10px;
        background: var(--card);
        border-radius: 10px;
        text-align: justify;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    /*Desc Tile : description, team & tags*/
    .tab-button {
        padding: 0.5rem 1rem;
        background: none;
        border: none;
        border-bottom: 2px solid transparent;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .tab-button.active {
        border-bottom-color: var(--accent);
        color: var(--accent);
    }

    .desc-title {
            display: flex;
            align-items: baseline;
            gap: 10px;
        }

    .desc-title hr {
        flex: 1;
        min-width: 0;
    }

    .desc-title #desc-h {
        text-transform: uppercase;
        white-space: nowrap;
        flex-shrink: 0;
    }

    .person {
        display: flex;
        align-items: center;
        margin: 0 8px;
        gap: 10px;
    }

    .person img {
        width: 50px;
    }

    .person #name {
        text-transform: uppercase;
        font-weight: bold;
    }

    .person #job {
        font-style: italic;
    }

    .content-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
        flex: 1;
        min-height: 0;
    }


    .tab-content {
        display: flex;
        flex-direction: column;
        gap: 10px;
        height: 100%;
        overflow-y: auto;
        padding: 0 8px;
        scrollbar-color: var(--accent) transparent;
        scrollbar-width: thin;
    }

    .tab-tags {
        justify-content: center;
    }

    /* Tags styles */
    .tags-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
    }

    .tech-tag {
        background: var(--accent-light);
        color: var(--text-accent);
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
    }
    
    /* right detail section */
    .media-tile {
        z-index: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        text-align: center;
        background: var(--highlight);
        border-radius: 10px;
        background-image: var(--bg);
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        aspect-ratio: 16 / 9;
        width: 45%;
        transition: transform 0.3s ease;
    }

    .media-tile h2 {
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }

    .overlay {
        background: var(--overlay);
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        padding: 10px;
        gap: 10px;
        text-align: center;
        transition: background 0.3s ease;
        width: 100%;
        z-index: 2;
        border-radius: 0px 0px 10px 10px;
    }

    .demo-btn {
        border: none;
        padding: 0.7rem 1.4rem;
        padding: 12px 24px;
        margin: 5px;
        border-radius: 10px;
        font-weight: bold;
        color: var(--text-accent);
        cursor: pointer;
        transition: background 0.5s ease;
        z-index: 3;
    }
    
    /* responsive */
    @media (max-width: 800px) {}
</style>