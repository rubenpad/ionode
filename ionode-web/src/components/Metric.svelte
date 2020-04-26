<script>
  import { onMount } from "svelte";
  import Chart from "chart.js";
  import moment from "moment";

  import { config } from "../config/index.js";

  export let uuid;
  export let type;
  let canvas;
  const data = [];
  const labels = [];

  onMount(async () => {
    const response = await fetch(
      `${config.serverHost}/metrics/${uuid}/${type}`
    );
    const metrics = await response.json();

    if (Array.isArray(metrics)) {
      metrics.forEach(metric => {
        labels.push(moment(metric.createdAt).format("HH:mm:ss"));
        data.push(metric.value);
      });
    }

    const ctx = canvas.getContext("2d");
    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: type,
            backgroundColor: "rgb(255, 99, 132)",
            borderColor: "rgb(255, 99, 132)",
            data
          }
        ]
      },
      options: {}
    });
  });
</script>

<style>
  canvas {
    margin-bottom: 36px;
  }
</style>

<canvas bind:this={canvas} />
