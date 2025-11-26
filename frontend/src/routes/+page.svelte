<script lang="ts">
	import StoreTest from './StoreTest.svelte';
    import ProjectsGallery from './ProjectsGallery.svelte';
    import Clients from './clients.svelte';

    import projectsData from '$lib/data/projects.json' assert { type: 'json' };
    import type { ProjectsData, ProjectItem } from '$lib/types/projects';
    
    const all_projects = projectsData as ProjectsData;
    let software_data: readonly ProjectItem[] = all_projects.software;
    let hardware_data: readonly ProjectItem[] = all_projects.hardware;


    import { 
        trans,
        languages_aria_label
    } from './store';
</script>

<div class="section-title">
    <h2 id="section-name">{$trans?.menu.hardware}</h2>
    <hr>
</div>

<ProjectsGallery
    section = {"hardware"}
    projects = {hardware_data}
/>

<div class="section-title">
    <h2 id="section-name">{$trans?.menu.software}</h2>
    <hr>
</div>

<ProjectsGallery
    section = {"software"}
    projects = {software_data}
/>

<div class="section-title">
    <h2 id="section-name">{$trans?.menu.management}</h2>
    <hr>
</div>

<Clients/>

<div class="section-title">
    <h2 id="section-name">{$trans?.menu.about}</h2>
    <hr>
</div>

<div class="container">
    <h1>Welcome to SvelteKit</h1>
    <p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
    <p>{$languages_aria_label}</p>

    <!--<Software/>-->
    <StoreTest/>
</div>

<style>

    .container {
        justify-content: flex-start;
        color: var(--text);
    }

    .section-title {
            display: flex;
            align-items: baseline;
            margin: 20px 0;
            color: var(--text);
        }

    .section-title hr {
        width: 100%;
    }

    .section-title #section-name {
        text-transform: uppercase;
        margin-right: 10px;
    }


</style>