<script lang="ts">
    import { onMount } from "svelte";
    import Chart from "chart.js/auto";

    export let slope: number = 0;
    export let p1 = { x: 0, y: 5 };
    export let p2 = { x: 100, y: 5 };

    let canvas: HTMLCanvasElement;
    let chart: Chart<"line", { x: number; y: number }[], unknown>;

    let dragging = false;
    let lastMouse = { x: 0, y: 0 };
    const tolerance = 1.5;

    export function recalcLine() {
        slope = Math.round(((p2.y - p1.y) / (p2.x - p1.x)) * 1000) / 100;
        chart.data.datasets[0].data = [p1, p2];
        chart.data.datasets[0].borderColor = getGradient();
        chart.update("none");
    }

    function getGradient() {
        const ctx = canvas.getContext("2d")!;
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);

        const blend = (slope + 1) / 2;

        gradient.addColorStop(
            0,
            `rgba(${Math.round(255 * (1 - blend))},0,${Math.round(255 * blend)},1)`,
        );
        gradient.addColorStop(
            1,
            `rgba(${Math.round(255 * blend)},0,${Math.round(255 * (1 - blend))},1)`,
        );

        return gradient;
    }

    function screenToChart(evt: MouseEvent) {
        const rect = canvas.getBoundingClientRect();
        const x = evt.clientX - rect.left;
        const y = evt.clientY - rect.top;
        const xScale = chart.scales.x;
        const yScale = chart.scales.y;
        return {
            x: xScale.getValueForPixel(x),
            y: yScale.getValueForPixel(y),
        };
    }

    function distanceToLine(px: number, py: number) {
        const { x: x1, y: y1 } = p1;
        const { x: x2, y: y2 } = p2;
        return (
            Math.abs((y2 - y1) * px - (x2 - x1) * py + x2 * y1 - y2 * x1) /
            Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2)
        );
    }

    function onMouseDown(evt: MouseEvent) {
        const { x, y } = screenToChart(evt);
        if (
            x !== undefined &&
            y !== undefined &&
            distanceToLine(x, y) < tolerance
        ) {
            dragging = true;
            lastMouse = { x, y };
        }
    }

    function onMouseUp() {
        dragging = false;
    }

    function onMouseMove(evt: MouseEvent) {
        if (!dragging) return;
        const { x, y } = screenToChart(evt);
        if (x === undefined || y === undefined) return;

        const totalWidth = p2.x - p1.x;
        const strength = 1.2;
        const weightP1 = ((p2.x - x) / totalWidth) * strength;
        const weightP2 = ((x - p1.x) / totalWidth) * strength;

        const dy = y - lastMouse.y;

        const nextp1y = p1.y + dy * weightP1;
        const nextp2y = p2.y + dy * weightP2;

        if (nextp1y >= 0 && nextp1y <= 10) p1.y = nextp1y;
        if (nextp2y >= 0 && nextp2y <= 10) p2.y = nextp2y;

        lastMouse = { x, y };
        recalcLine();
    }

    onMount(() => {
        chart = new Chart(canvas, {
            type: "line",
            data: {
                datasets: [
                    {
                        data: [p1, p2],
                        borderWidth: 3,
                        borderColor: getGradient(),
                        pointRadius: 0,
                        pointHoverRadius: 0,
                        fill: false,
                    },
                ],
            },
            options: {
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false },
                },
                scales: {
                    x: {
                        display: true,
                        type: "linear",
                        min: 0,
                        max: 100,
                        ticks: {
                            stepSize: 100,
                            callback: function (value) {
                                return value + "%";
                            },
                        },
                        grid: {
                            drawTicks: false,
                            //drawBorder: true,
                            drawOnChartArea: false,
                        },
                    },
                    y: {
                        display: true,
                        min: 0,
                        max: 10,
                        ticks: {
                            callback: function (value) {
                                if (value === 0) return "Easier";
                                if (value === 10) return "Harder";
                                return "";
                            },
                            stepSize: 10,
                        },
                        grid: {
                            drawTicks: false,
                            drawOnChartArea: false,
                        },
                    },
                },
            },
        });

        canvas.addEventListener("mousedown", onMouseDown);
        canvas.addEventListener("mousemove", onMouseMove);
        canvas.addEventListener("mouseup", onMouseUp);
        canvas.addEventListener("mouseleave", onMouseUp);
    });
</script>

<canvas bind:this={canvas}></canvas>
