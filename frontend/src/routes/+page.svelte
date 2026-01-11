<script lang="ts">
	import StoreTest from './StoreTest.svelte';
    import DesignGallery from './DesignGallery.svelte';
    import AppsGallery from './AppsGallery.svelte';
    import ProjectsGallery from './ProjectsGallery.svelte';
    import Clients from './clients.svelte';

    import { loadProjectsData } from '$lib/utils/projectsLoader';
    import type { ProjectsData, ProjectItem } from '$lib/types/projects';

    import { 
        trans,
        languages_aria_label
    } from './store';

	// Load projects asynchronously
	let projectsDataPromise: Promise<ProjectsData> = loadProjectsData();
</script>

<div class="section-title">
    <h2 id="section-name">{$trans?.menu.hardware}</h2>
    <hr>
</div>

<!-- HARDWARE SECTION -->

{#await projectsDataPromise}
    <div class="alert alert-info">
        {$trans?.alerts.loading}
    </div>
{:then projects_data } 
    <DesignGallery projects={projects_data.hardware} />
    <!--<ProjectsGallery
        section = {"hardware"}
        projects = {projects_data.hardware}
    />-->
{:catch error}
    <div class="alert alert-error">
        {$trans?.alerts.loading_error}&nbsp;{error.message}
    </div>
{/await}

<!-- APPS SECTION -->

<div class="section-title">
    <h2 id="section-name">{$trans?.menu.software}</h2>
    <hr>
</div>

{#await projectsDataPromise}
    <div class="alert alert-info">
        {$trans?.alerts.loading}
    </div>
{:then projects_data } 
    <AppsGallery projects={projects_data.software} />
    <!--<ProjectsGallery
        section = {"software"}
        projects = {projects_data.software}
    />-->
{:catch error}
    <div class="alert alert-error">
        {$trans?.alerts.loading_error}&nbsp;{error.message}
    </div>
{/await}

<!-- GRAPHIC DESIGN SECTION -->

<div class="section-title">
    <h2 id="section-name">{$trans?.menu.graphic}</h2>
    <hr>
</div>

<!-- PROFIL SECTION -->

<div class="section-title">
    <h2 id="section-name">{$trans?.menu.about}</h2>
    <hr>
</div>

<!-- CLIENTS SECTION -->

<div class="section-title">
    <h2 id="section-name">{$trans?.menu.management}</h2>
    <hr>
</div>

<Clients/>

<div class="container">
    <h1>Welcome to SvelteKit</h1>
    <p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
    <p>{$languages_aria_label}</p>

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

    /* Alert/Badge Components */
    .alert {
        padding: 15px 20px;
        border-radius: 8px;
        margin-bottom: 15px;
        border-left: 4px solid var(--accent);
    }

    .alert-success {
        background: var(--accent);
        color: var(--text-accent);
        border-color: var(--accent-dark);
    }

    .alert-info {
        background: var(--highlight);
        color: var(--text);
        border-color: var(--accent);
    }

    .alert-warning {
        background: var(--highlight);
        color: var(--text);
        border-color: var(--warning-accent);
    }

    .alert-error {
        background: var(--highlight);
        color: var(--text);
        border-color: var(--error-accent);
    }
</style>