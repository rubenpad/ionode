<script>
  import { onMount } from "svelte";

  import { config } from "../config/index";
  import Agent from "./Agent.svelte";

  let agents = [];

  onMount(async () => {
    try {
      const response = await fetch(`${config.serverHost}/agents`);
      agents = await response.json();
    } catch (error) {
      console.log(error);
    }
  });
</script>

{#each agents as agent}
  <Agent {agent} />
{:else}
  <p>Loading...</p>
{/each}
