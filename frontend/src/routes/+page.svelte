<script lang="ts">
	import StoreTest from './StoreTest.svelte';
    import Software from './software.svelte';
    import Clients from './clients.svelte';

    import { 
        trans,
        languages_aria_label
    } from './store';
</script>


<Software/>
<div class="container">
    <h1>Welcome to SvelteKit</h1>
    <p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
    <p>{$languages_aria_label}</p>

    <!--<Software/>-->
    <Clients/>
    <StoreTest/>
</div>

<style>

.container {
    justify-content: flex-start;
}

</style>