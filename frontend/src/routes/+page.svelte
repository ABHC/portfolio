<script lang="ts">
	import StoreTest from './StoreTest.svelte';
    import DesignGallery from './DesignGallery.svelte';
    import AppsGallery from './AppsGallery.svelte';
    import ProjectsGallery from './ProjectsGallery.svelte';
    import Clients from './clients.svelte';
    import Profile from './Profile.svelte';

    import { projectsPromise, profilePromise } from '$lib/utils/projectsLoader';

    import {
        trans,
        languages_aria_label
    } from './store';
</script>

<!-- HARDWARE SECTION -->

<div class="section-title">
    <h2 id="hardware-section">{$trans?.menu.hardware}</h2>
    <hr>
</div>

{#await projectsPromise}
    <div class="alert alert-info">
        {$trans?.alerts.loading}
    </div>
{:then projects_data } 
    <DesignGallery projects={projects_data.hardware} />
{:catch error}
    <div class="alert alert-error">
        {$trans?.alerts.loading_error}&nbsp;{error.message}
    </div>
{/await}

<!-- APPS SECTION -->

<div class="section-title">
    <h2 id="software-section">{$trans?.menu.software}</h2>
    <hr>
</div>

{#await projectsPromise}
    <div class="alert alert-info">
        {$trans?.alerts.loading}
    </div>
{:then projects_data } 
    <AppsGallery projects={projects_data.software} />
{:catch error}
    <div class="alert alert-error">
        {$trans?.alerts.loading_error}&nbsp;{error.message}
    </div>
{/await}

<!-- GRAPHIC DESIGN SECTION -->

<div class="section-title">
    <h2 id="graphic-section">{$trans?.menu.visuals}</h2>
    <hr>
</div>

<!-- PROFILE SECTION -->

<div class="section-title">
    <h2 id="profile-section">{$trans?.menu.about}</h2>
    <hr>
</div>

{#await profilePromise}
    <div class="alert alert-info">
        {$trans?.alerts.loading}
    </div>
{:then profile_data } 
    <Profile profile={profile_data} />
{:catch error}
    <div class="alert alert-error">
        {$trans?.alerts.loading_error}&nbsp;{error.message}
    </div>
{/await}

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

    .section-title h2 {
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