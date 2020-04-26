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

    socket.on("agent/connected", payload => {
      const { uuid } = payload.agent;
      const existing = agents.some(agent => agent.uuid === uuid);
      if (!existing) {
        agents = [...agents, payload.agent];
      }
    });
  });
</script>

{#each agents as agent}
  <Agent uuid={agent.uuid} {socket} />
{:else}
  <p>Loading...</p>
{/each}
