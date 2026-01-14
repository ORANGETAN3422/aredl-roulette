<script lang="ts">
    import DownArrowPng from "/down-arrow.png";
    import { aredlTags } from "../../helpers/saving";

    export let mainListBlock: number;
    export let extendedListBlock: number;
    export let mainListCap: number;
    export let extendedListCap: number;
    export let minimumEnjoyment: number;
    export let maximumEnjoyment: number;
    export let prioritiseIncluded: boolean;

    export let blockedTags: string[] = [];
    export let includedTags: string[] = [];

    let advancedOptionsCollapsed = true;

    let tagStates: Record<string, "none" | "included" | "blocked"> = {};

    resetTags();

    function tagButtonClick(tag: string) {
        const current = tagStates[tag] ?? "none";

        if (current === "none") tagStates[tag] = "blocked";
        else if (current === "blocked") tagStates[tag] = "included";
        else tagStates[tag] = "none";

        syncTags();
    }

    function resetTags() {
        aredlTags.forEach((tag) => (tagStates[tag] = "none"));
        syncTags();
    }

    function syncTags() {
        blockedTags = Object.keys(tagStates).filter(
            (t) => tagStates[t] === "blocked",
        );
        includedTags = Object.keys(tagStates).filter(
            (t) => tagStates[t] === "included",
        );
    }

    function fuckCss(tag: string): string {
        let safe = tag.replace(/[^a-zA-Z0-9_-]/g, "-");
        if (/^[0-9]/.test(safe)) safe = "_" + safe;
        return safe;
    }
</script>

<div class="advanced-options">
    <div class="advanced-options-con">
        <p class="advanced-options-label">Advanced Options</p>
        <button
            type="button"
            class={advancedOptionsCollapsed
                ? "hide-button"
                : "rotate hide-button"}
            on:click={() =>
                (advancedOptionsCollapsed = !advancedOptionsCollapsed)}
        >
            <img
                src={DownArrowPng}
                class="collapse-arrow"
                alt="Toggle advanced options"
            />
        </button>
    </div>

    <div class={advancedOptionsCollapsed ? "collapsed" : ""}>
        <hr />

        <div class="advanced-options-con">
            <p>Maximum EDEL Enjoyment:</p>
            <input
                type="number"
                class="number-input"
                bind:value={maximumEnjoyment}
            />
        </div>
        <p class="subtext">leave as 100 for default settings</p>

        <div class="advanced-options-con">
            <p>Minimum EDEL Enjoyment:</p>
            <input
                type="number"
                class="number-input"
                bind:value={minimumEnjoyment}
            />
        </div>
        <p class="subtext">leave as 0 for default settings</p>

        <p class="subtext error-message" id="edel-error"></p>

        <hr />

        <div class="advanced-options-con">
            <p>No Main Lists Past:</p>
            <input
                type="number"
                class="number-input"
                bind:value={mainListBlock}
            />
            <p>%</p>
        </div>

        <div class="advanced-options-con">
            <p>No Extended Lists Past:</p>
            <input
                type="number"
                class="number-input"
                bind:value={extendedListBlock}
            />
            <p>%</p>
        </div>

        <p class="subtext">leave both as 100% for default settings</p>

        <hr />

        <div class="advanced-options-con">
            <p>Maximum Main Lists:</p>
            <input
                type="number"
                class="number-input"
                bind:value={mainListCap}
            />
        </div>

        <div class="advanced-options-con">
            <p>Maximum Extended Lists:</p>
            <input
                type="number"
                class="number-input"
                bind:value={extendedListCap}
            />
        </div>

        <p class="subtext">leave both as 100 for default settings</p>

        <hr />

        <div class="tag-options-con">
            <div class="advanced-options-con">
                <label for="prioritise-tags">Prioritise Included Tags:</label>
                <input
                    id="prioritise-tags"
                    type="checkbox"
                    class="priority-check"
                    bind:checked={prioritiseIncluded}
                />
            </div>

            <p class="subtext">(Blocked tags are prioritised by default)</p>

            <p>Blocked Tags</p>
            <p class="subtext">
                (click on a tag to cycle between ignored, blocked or included)
            </p>

            {#each aredlTags as tag}
                <button
                    class={"tag-button " + fuckCss(tag) + " " + tagStates[tag]}
                    on:click={() => tagButtonClick(tag)}
                >
                    {tag}
                </button>
            {/each}

            <button class="reset-tags-btn" on:click={resetTags}>
                Reset All Tags
            </button>
        </div>
    </div>
</div>

<style>
    .advanced-options {
        text-align: left;
        outline: 1px solid #444;
        padding: 0.5em;
        margin-bottom: 10px;
    }

    .advanced-options-con {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .advanced-options-con .number-input {
        width: 50px;
        margin-left: 10px;
    }

    .advanced-options-label {
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

    /* tag styles */

    .tag-options-con {
        margin-top: 5px;
    }

    .tag-button {
        font-size: 0.8em;
        transform: scale(0.95);
        transition: all 0.2s ease-in-out;
    }

    .tag-button:hover {
        filter: brightness(1.2);
        transform: scale(1);
    }

    .tag-button.none {
        text-decoration: none;
        border: 1px #333 solid;
    }

    .tag-button.included {
        background-color: rgb(100, 180, 100);
        text-decoration: none;
    }

    .tag-button.blocked {
        background-color: rgb(180, 80, 80);
        text-decoration: line-through;
    }

    .reset-tags-btn {
        background-color: rgb(100, 120, 160);
        scale: 0.8;
        margin-top: 5px;
    }

    .priority-check {
        margin-left: 5px;
    }
</style>
