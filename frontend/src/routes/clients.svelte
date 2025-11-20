<script lang="ts">

    import { 
        trans,
    } from './store';
</script>

<!-- Clients -->
  <section id="clients">
    <h2 class="text-2xl font-semibold mb-8">Clients</h2>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center">
      {#each Array(10) as _, i}
      <img src="/logos/client-{i + 1}.svg" alt="Client logo" class="grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition" />
      {/each}
    </div>
  </section>