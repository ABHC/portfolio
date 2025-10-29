<script lang="ts">

    import { 
        trans,
    } from './store';

    let projects = [
    { id: 1, name: 'Project One', img: '/five_keyboards.png', desc: 'UI tool for embedded systems' },
    { id: 2, name: 'Project Two', img: '/images/p2.webp', desc: 'Custom SvelteKit site for client' },
    { id: 3, name: 'Project Three', img: '/images/p3.webp', desc: 'Toolchain integration project' },
  ];
  let selected = projects[0];
</script>
  
<div class="section-title">
    <span>Apps</span>
    <hr>
</div>

<section class="software-section">
    <!-- Left: grid -->
    <div class="projects">
        {#each projects as p}
            <div 
                class="project-tile {selected.id === p.id ? 'active' : ''}"
                on:click={() => selected = p}
            >
                <span>{p.name}</span>
            </div>
        {/each}
    </div>

    <!-- Right: detail tile -->
    <div 
        class="detail-tile"
        style="--bg:url({selected.img});"
    >
        <div class="overlay">
            <h2>{selected.name}</h2>
            <p>{selected.desc}</p>
            <button class="demo-btn accent acc-highlight-dark">
                Voir la démo
            </button>
        </div>
    </div>
</section>

<style>
    .section-title {
        display: flex;
        align-items: baseline;
        margin-bottom: 20px;
    }

    .section-title hr {
        width: 100%;
    }

    .section-title span {
        font-size: 24px;
        text-transform: capitalize;
        margin-right: 10px;
    }

    .software-section {
        position: relative;
        display: flex;
        justify-content:space-around;
        min-height: 40vh;
    }
    
    /* left grid */
    .projects {
        position: relative;
        z-index: 1;
        width: 45%;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-content: center;
        gap: 1.5rem;
        padding: 2rem;
    }
    
    .project-tile {
        width: 110px;
        height: 110px;
        background: #333;
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.3s, transform 0.2s;
    }
    .project-tile:hover {
        background: #0a7864;
        transform: translateY(-4px);
    }
    .project-tile.active {
        background: #16a085ff;
    }
    
    /* right detail section */
    .detail-tile {
        z-index: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        text-align: center;
        background: #333;
        border-radius: 10px;
        background-image: var(--bg);
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        aspect-ratio: 16 / 9;
        width: 45%;
        transition: transform 0.3s ease;
    }

    .detail-tile h2 {
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }

    .detail-tile p {
        font-size: 1.1rem;
        max-width: 400px;
        color: #ccc;
    }

    .overlay {
        background: rgba(0,0,0,0.45);
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        padding: 2rem;
        gap: 1rem;
        text-align: center;
        transition: background 0.3s ease;
        width: 100%;
        z-index: 2;
    }

    .demo-btn {
        border: none;
        padding: 0.7rem 1.4rem;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.3s, transform 0.2s;
        z-index: 3;
    }
    
    /* responsive */
    @media (max-width: 800px) {
      .software-section {
            flex-direction: column;
      }
      .projects, .detail-tile {
            width: 100%;
      }
    }
</style>