<script lang="ts">
	import StoreTest from './StoreTest.svelte';
    import DesignGallery from './DesignGallery.svelte';
    import AppsGallery from './AppsGallery.svelte';
    import ProjectsGallery from './ProjectsGallery.svelte';
    import ProjectsGrid from './ProjectsGrid.svelte';
    import Clients from './clients.svelte';
    import Profile from './Profile.svelte';

    import { projectsPromise, profilePromise } from '$lib/utils/projectsLoader';

    import { Headline, TileGrid } from '@abhc/spektral-ui';

    import {
        trans,
        languages_aria_label
    } from './store';
</script>

<!-- HARDWARE SECTION -->

<div 
    data-summary="hardware" 
    data-summary-label={$trans?.summary.hardware}
>
    <Headline size="md" uppercase>
        {$trans?.summary.hardware}
    </Headline>
</div>

{#await projectsPromise}
    <div class="alert alert-info">
        {$trans?.alerts.loading}
    </div>
{:then projects_data } 
    <ProjectsGrid 
        projects={projects_data.hardware} 
        image_mode="image"
    />
    <!--<DesignGallery projects={projects_data.hardware} />-->
{:catch error}
    <div class="alert alert-error">
        {$trans?.alerts.loading_error}&nbsp;{error.message}
    </div>
{/await}

<!-- APPS SECTION -->

<div data-summary="software" data-summary-label={$trans?.summary.software}>
    <Headline size="md" uppercase>
        {$trans?.summary.software}
    </Headline>
</div>

{#await projectsPromise}
    <div class="alert alert-info">
        {$trans?.alerts.loading}
    </div>
{:then projects_data } 
    <ProjectsGrid 
        projects={projects_data.software} 
        pattern="grid"
        pattern_opacity={0.2}
    />
{:catch error}
    <div class="alert alert-error">
        {$trans?.alerts.loading_error}&nbsp;{error.message}
    </div>
{/await}

<!-- GRAPHIC DESIGN SECTION -->

<div data-summary="graphic" data-summary-label={$trans?.summary.graphic}>
    <Headline size="md" uppercase>
        {$trans?.summary.graphic}
    </Headline>
</div>

{#await projectsPromise}
    <div class="alert alert-info">
        {$trans?.alerts.loading}
    </div>
{:then projects_data } 
    <ProjectsGrid 
        projects={projects_data.graphic} 
        pattern="grid"
        pattern_opacity={0.2}
        columns={4}
    />
{:catch error}
    <div class="alert alert-error">
        {$trans?.alerts.loading_error}&nbsp;{error.message}
    </div>
{/await}

<!-- PROFILE SECTION -->

<!--<div class="section-title">
    <h2 id="profile-section">{$trans?.summary.about}</h2>
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
{/await}-->

<!-- CLIENTS SECTION -->

<!--<div class="section-title">
    <h2 id="section-name">{$trans?.menu.management}</h2>
    <hr>
</div>

<Clients/>

<div class="container">
    <h1>Welcome to SvelteKit</h1>
    <p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
    <p>{$languages_aria_label}</p>

    <StoreTest/>
</div>-->

<style>

    .container {
        justify-content: flex-start;
        color: var(--spk-text);
    }

    .section-title {
        display: flex;
        align-items: baseline;
        margin: 20px 0;
        color: var(--spk-text);
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
        border-left: 4px solid var(--spk-accent);
    }

    .alert-success {
        background: var(--spk-accent);
        color: var(--spk-text-accent);
        border-color: var(--spk-accent-hover);
    }

    .alert-info {
        background: var(--spk-accent-muted);
        color: var(--spk-text);
        border-color: var(--spk-accent);
    }

    .alert-warning {
        background: var(--spk-accent-muted);
        color: var(--spk-text);
        border-color: var(--spk-warning);
    }

    .alert-error {
        background: var(--spk-accent-muted);
        color: var(--spk-text);
        border-color: var(--spk-error);
    }
</style>