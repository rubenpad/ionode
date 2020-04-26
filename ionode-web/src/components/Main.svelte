<script>
  import { onMount } from "svelte";
  import io from "socket.io-client";

  import { config } from "../config/index";
  import Agent from "./Agent.svelte";

  const socket = io(config.serverHost);
  let agents = [];

  onMount(async () => {
    try {
      const response = await fetch(`${config.serverHost}/agents`);
      agents = await response.json();
    } catch (error) {
      console.log(error);
    }

    socket.on("agent/message", payload => {
      console.log("agent/message", payload);
    });

    socket.on("agent/connected", payload => {
      console.log("agent/connected", payload);
    });

    socket.on("agent/disconnected", payload => {
      console.log("agent/disconnected", payload);
    });
  });
</script>

{#each agents as agent}
  <Agent {agent} />
{:else}
  <p>Loading...</p>
{/each}
