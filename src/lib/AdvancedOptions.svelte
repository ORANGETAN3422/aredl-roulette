<script lang="ts">
    import DownArrowPng from "/down-arrow.png";

    export let mainListBlock: number;
    export let extendedListBlock: number;
    export let mainListCap: number;
    export let extendedListCap: number;
    export let blockedTags: string[];
    export let aredlTags: string[];

    let collapsed = false;

    function toggleCollapse() {
        collapsed = !collapsed;
    }

    function tagButtonClick(tag: string) {
        if (blockedTags.includes(tag)) {
            blockedTags = blockedTags.filter((t) => t !== tag);
        } else {
            blockedTags = [...blockedTags, tag];
        }
    }

    function fuckCss(tag: string) {
        let safe = tag.replace(/[^a-zA-Z0-9_-]/g, "-");
        if (/^[0-9]/.test(safe)) safe = "_" + safe;
        return safe;
    }
</script>

<div class="advanced-options">
    <div class="advanced-options-con">
        <p class="advanced-options-label">Advanced Options</p>
        <button
            class={collapsed ? "hide-button" : "rotate hide-button"}
            on:click={toggleCollapse}
        >
            <img
                src={DownArrowPng}
                class="collapse-arrow"
                alt="Toggle advanced options"
            />
        </button>
    </div>

    <div class={collapsed ? "collapsed" : ""}>
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
        <p class="subtext">Leave both as 100% for default settings</p>
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
        <p class="subtext">Leave both as 100 for default settings</p>
        <hr />

        <div class="tag-options-con">
            <p>Blocked Tags</p>
            <p class="subtext">
                (click on a tag to block all levels with that tag)
            </p>
            {#each aredlTags as tag}
                <button
                    value={tag}
                    class={"tag-button " +
                        fuckCss(tag) +
                        (blockedTags.includes(tag) ? " blocked" : "")}
                    on:click={() => tagButtonClick(tag)}
                >
                    {tag}
                </button>
            {/each}
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
        margin-bottom: 5px;
    }

    .number-input {
        width: 50px;
        margin-left: 10px;
    }

    .collapsed {
        display: none;
    }

    .tag-button {
        font-size: 0.8em;
        transform: scale(0.95);
        transition: all 0.2s ease-in-out;
        margin: 2px;
    }
    .tag-button:hover {
        filter: brightness(1.2);
        transform: scale(1);
    }
    .tag-button.blocked {
        background-color: rgb(180, 100, 100);
    }

    .collapse-arrow {
        max-width: 2rem;
        filter: invert(1);
        margin-left: 5px;
    }

    .rotate {
        rotate: 180deg;
    }

    .hide-button {
        background: none;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 30px;
        width: 30px;
        margin-left: 10px;
        margin-top: -5px;
        padding: 0;
    }

    .subtext {
        color: #888;
        font-size: 0.8em;
    }

    .error-message {
        color: red;
    }

    .number-input {
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 5px;
        margin-bottom: 5px;
    }

    hr {
        color: #444;
    }
</style>
