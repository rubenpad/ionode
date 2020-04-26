<script>
  import { onMount } from "svelte";
  import Chart from "chart.js";
  import moment from "moment";

  import { config } from "../config/index.js";

  export let uuid;
  export let type;
  export let socket;

  let canvas;
  let chart;
  let metrics = [];
  const data = [];
  const labels = [];

  onMount(async () => {
    try {
      const metricsResponse = await fetch(
        `${config.serverHost}/metrics/${uuid}/${type}`
      );
      metrics = await metricsResponse.json();
    } catch (error) {}

    if (Array.isArray(metrics)) {
      metrics.forEach(metric => {
        labels.push(moment(metric.createdAt).format("HH:mm:ss"));
        data.push(metric.value);
      });
    }

    const ctx = canvas.getContext("2d");
    chart = new Chart(ctx, {
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

    socket.on("agent/message", payload => {
      if (payload.agent.uuid === uuid) {
        const metricFound = payload.metrics.find(
          metric => metric.type === type
        );

        const length = labels.length || data.length;

        // Just show 20 metric values in the chart
        // if length is > 20 remove the first element
        // and push a new one last
        if (length >= 20) {
          labels.shift();
          data.shift();
        }

        labels.push(moment(metricFound.createdAt).format("HH:mm:ss"));
        data.push(metricFound.value);

        chart.update();
      }
    });
  });
</script>

<style>
  canvas {
    margin-bottom: 36px;
  }
</style>

<canvas bind:this={canvas} />
