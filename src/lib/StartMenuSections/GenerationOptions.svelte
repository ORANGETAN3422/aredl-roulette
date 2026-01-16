<script lang="ts">
    import DownArrowPng from "/down-arrow.png";
    import Graph from "./Graph.svelte";

    let graphRef: Graph;

    export let slope: number = 0;
    export let p1 = { x: 0, y: 5 };
    export let p2 = { x: 100, y: 5 };

    let generationOptionsCollapsed = false;

    function resetGraph() {
        slope = 0;
        p1 = { x: 0, y: 5 };
        p2 = { x: 100, y: 5 };
        graphRef.recalcLine();
    }
</script>

<div class="generation-options">
    <div class="generation-options-con">
        <p class="generation-options-label">Generation Options</p>
        <button
            type="button"
            class={generationOptionsCollapsed
                ? "hide-button"
                : "rotate hide-button"}
            onclick={() =>
                (generationOptionsCollapsed = !generationOptionsCollapsed)}
        >
            <img
                src={DownArrowPng}
                class="collapse-arrow"
                alt="Toggle advanced options"
            />
        </button>
    </div>
    <div class={generationOptionsCollapsed ? "collapsed" : ""}>
        <hr />
        <p>Difficulty Progression</p>
        <Graph bind:slope bind:p1 bind:p2 bind:this={graphRef} />
        <button class="reset-graph-btn" onclick={resetGraph}>Reset</button>
        <p class="subtext">
            Adjusting this graph changes how level difficulty is weighted as the
            roulette progresses. Red increases the chance of harder levels being
            generated, while blue increases the chance of easier levels. If the
            line is straight, then generation is even throughout the entire
            roulette.
        </p>
    </div>
</div>

<style>
    .generation-options {
        text-align: left;
        outline: 1px solid #444;
        padding: 0.5em;
        margin-bottom: 10px;
    }

    .generation-options-con {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .generation-con .number-input {
        width: 50px;
        margin-left: 10px;
    }

    .generation-options-label {
        font-weight: bold;
    }

    .rotate {
        rotate: 180deg;
    }

    .collapsed {
        display: none;
    }

    .number-input {
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 5px;
        margin-bottom: 5px;
    }

    .hide-button {
        height: 30px;
        width: 30px;
        margin-left: 10px;
        margin-top: -5px;
        background: none;

        display: flex;
        align-items: center;
        justify-content: center;

        padding: 0;
    }

    .reset-graph-btn {
        background: rgb(100, 100, 180);
        scale: 0.8;
    }

    .collapse-arrow {
        max-width: 2rem;
        filter: invert(1);
        margin: 0;
    }

    .subtext {
        color: #888;
        font-size: 0.8em;
    }

    .error-message {
        color: red;
    }

    hr {
        color: #444;
        margin-top: 5px;
        margin-bottom: 5px;
    }

    @media (prefers-color-scheme: light) {
        .generation-options {
            outline: 1px solid #ccc;
        }

        .number-input {
            background-color: rgba(0, 0, 0, 0.05);
        }

        .subtext {
            color: #666;
        }

        .collapse-arrow {
            filter: invert(0);
        }
    }
</style>
