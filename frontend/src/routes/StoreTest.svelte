<script lang="ts">
	import {
		test_local,
		test_session,
		test_indexed,
		test_svelte
	} from './store';

	function resetAll() {
		test_local.set({ message: 'Hello localStorage' });
		test_session.set({ message: 'Hello sessionStorage' });
		test_indexed.set({ message: 'Hello indexedDB' });
		test_svelte.set({ message: 'Hello svelteStore' });
	}

	function reset(store: any, message: string) {
		store.set({ message });
	}
</script>

<h2 class="text-lg font-bold mb-4">🧪 Persist Store Test</h2>

<div class="space-y-4">
	<section>
		<h3 class="font-semibold">LocalStorage</h3>
		<pre>{$test_local?.message ?? '⏳ Loading...'}</pre>
		<div class="space-x-2">
			<button on:click={() => test_local.set({ message: 'Updated localStorage!' })}>Update</button>
			<button on:click={() => reset(test_local, 'Hello localStorage')}>Reset</button>
		</div>
	</section>

	<section>
		<h3 class="font-semibold">SessionStorage</h3>
		<pre>{$test_session?.message ?? '⏳ Loading...'}</pre>
		<div class="space-x-2">
			<button on:click={() => test_session.set({ message: 'Updated sessionStorage!' })}>Update</button>
			<button on:click={() => reset(test_session, 'Hello sessionStorage')}>Reset</button>
		</div>
	</section>

	<section>
		<h3 class="font-semibold">IndexedDB</h3>
		<pre>{$test_indexed?.message ?? '⏳ Loading...'}</pre>
		<div class="space-x-2">
			<button on:click={() => test_indexed.set({ message: 'Updated indexedDB!' })}>Update</button>
			<button on:click={() => reset(test_indexed, 'Hello indexedDB')}>Reset</button>
		</div>
	</section>

	<section>
		<h3 class="font-semibold">SvelteStore (ephemeral)</h3>
		<pre>{$test_svelte?.message ?? '⏳ Loading...'}</pre>
		<div class="space-x-2">
			<button on:click={() => test_svelte.set({ message: 'Updated svelteStore!' })}>Update</button>
			<button on:click={() => reset(test_svelte, 'Hello svelteStore')}>Reset</button>
		</div>
	</section>
</div>

<hr class="my-4" />

<button on:click={resetAll}>Reset all stores</button>

