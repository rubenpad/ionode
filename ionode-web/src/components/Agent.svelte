<script>
  import { onMount, afterUpdate } from "svelte";
  import { fade } from "svelte/transition";

  import { config } from "../config/index.js";
  import Metric from "../components/Metric.svelte";

  export let socket;
  export let uuid;

  let name = "";
  let pid = 0;
  let hostname = "";
  let connected = false;
  let visible = true;
  let metrics = [];
  let error;

  onMount(async () => {
    const agentResponse = await fetch(`${config.serverHost}/agents/${uuid}`);

    const agent = await agentResponse.json();

    name = agent.name;
    pid = agent.pid;
    hostname = agent.hostname;
    connected = agent.connected;

    loadMetrics();

    socket.on("agent/disconnected", payload => {
      if (payload.agent.uuid === uuid) {
        connected = false;
      }
    });
  });

  async function loadMetrics() {
    try {
      const metricsResponse = await fetch(
        `${config.serverHost}/metrics/${uuid}`
      );
      metrics = await metricsResponse.json();
    } catch (error) {
      error = error;
    }
  }

  function toggleMetrics() {
    visible = visible ? false : true;
  }
</script>

<style>
  .metrics-title {
    text-align: center;
    font-size: 28px;
    letter-spacing: 1px;
    font-family: "Monserrat", sans-serif;
  }
  .button {
    text-transform: uppercase;
    color: #ff7a22;
    border: none;
    background: none;
    font-size: 14px;
    font-weight: 900;
    cursor: pointer;
    outline: 0;
    padding: 0;
    font-family: "Roboto", sans-serif;
  }
  .agent {
    max-width: 850px;
    box-sizing: border-box;
    border-radius: 4px;
    background: white;
    padding: 20px;
    font-family: "Roboto", sans-serif;
    margin: 24px 15px;
    box-shadow: 0 1px 3px 0 rgba(165, 165, 165, 0.2),
      0 2px 2px 0 rgba(163, 137, 137, 0.12), 0 0 2px 0 rgba(0, 0, 0, 0.14);
  }
  .agent-title {
    font-size: 32px;
    letter-spacing: 1px;
    margin: 0;
    font-family: "Monserrat", sans-serif;
  }
  .agent-host {
    font-size: 20px;
  }
  .agent-status {
    font-size: 20px;
  }
  .agent-status span {
    font-weight: bold;
    color: #ff7a22;
  }
  @media screen and (min-width: 850px) {
    .agent {
      padding: 20px 85px;
      margin: 24px auto;
    }
  }
</style>

<div class="agent">
  <div>
    <h2 class="agent-title">{name} - {pid}</h2>
    <p class="agent-host">{hostname}</p>
    <p class="agent-status">
      Connected:
      <span>{connected}</span>
    </p>
    <button on:click={toggleMetrics} class="button">Toggle Metrics</button>
    {#if visible}
      <div transition:fade>
        <h3 class="metrics-title">Metrics</h3>
        {#each metrics as metric}
          <Metric {uuid} type={metric.type} {socket} />
        {:else}
          <p>Loading...</p>
        {/each}
      </div>
    {/if}
  </div>

  {#if error}
    <p>{error}</p>
  {/if}
</div>
