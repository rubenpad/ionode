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
      const existing = agents.find(agent => agent.uuid === uuid);
      if (!existing) {
        agents.push(payload.agent);
      }
    });
  });
</script>

<Agent uuid="619e99ac-5bda-48b6-8dd4-69ace0ff183f" {socket} />
