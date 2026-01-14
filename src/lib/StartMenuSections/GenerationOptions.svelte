<script lang="ts">
    import DownArrowPng from "/down-arrow.png";
    import Graph from "./Graph.svelte";

    let generationOptionsCollapsed = false;
</script>

<div class="generation-options">
    <div class="generation-options-con">
        <p class="generation-options-label">Generation Options</p>
        <button
            type="button"
            class={generationOptionsCollapsed
                ? "hide-button"
                : "rotate hide-button"}
            on:click={() =>
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
        <Graph />
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
</style>
