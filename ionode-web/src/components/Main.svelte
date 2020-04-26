<script>
  import { onMount } from "svelte";
  import io from "socket.io-client";

  import { config } from "../config/index";
  import Agent from "./Agent.svelte";
  import Metric from "./Metric.svelte";
  const socket = io(config.serverHost);
  let agents = [];

  onMount(async () => {
    try {
      const response = await fetch(`${config.serverHost}/agents`);
      agents = await response.json();
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("agent/connected", payload => {
    const { uuid } = payload.agent;
    const existing = agents.find(agent => agent.uuid === uuid);
    if (!existing) {
      agents.push(payload.agent);
    }
  });
</script>

<Metric uuid="f4d9697a-839d-4394-9cc7-89b6911409f9" type="rss" {socket} />
