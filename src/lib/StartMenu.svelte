<script lang="ts">
    import { getRandInt32 } from "../helpers/rng";
    import { createNewRun } from "../helpers/createList";
    import { listCreationStatus, rouletteStatus } from "../helpers/statusStore";
    import { startRun } from "../helpers/progress";
    import {
        aredlTags,
        decodeSave,
        type ExtraDetails,
    } from "../helpers/saving";
    import { fly } from "svelte/transition";

    import DownArrowPng from "/down-arrow.png";

    let isSaveLoaded: boolean = false;
    let advancedOptionsCollapsed: boolean = true;
    let currentSeed: number = getRandInt32();

    let startingRange: number = 0;
    let endingRange: number = 0;

    let mainListBlock: number = 100;
    let extendedListBlock: number = 100;
    let mainListCap: number = 100;
    let extendedListCap: number = 100;
    let minumimEnjoyment: number = 0;
    let maximumEnjoyment: number = 100;
    let prioritiseIncluded: boolean = false;

    let fileInput: HTMLInputElement;

    let tagStates: Record<string, "none" | "included" | "blocked"> = {};
    resetTags();

    function openFilePicker() {
        fileInput.click();
    }

    async function handleFile(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;

        if (!file.name.endsWith(".txt")) {
            alert("Please select a .txt file");
            return;
        }

        const text = await file.text();
        startRun(decodeSave(text));
    }

    function tagButtonClick(tag: string) {
        const current = tagStates[tag] || "none";

        if (current === "none") tagStates[tag] = "blocked";
        else if (current === "blocked") tagStates[tag] = "included";
        else if (current === "included") tagStates[tag] = "none";
    }

    function resetTags() {
        aredlTags.forEach((tag) => {
            tagStates[tag] = "none";
        });
    }

    function fuckCss(tag: string): string {
        let safe = tag.replace(/[^a-zA-Z0-9_-]/g, "-");

        if (/^[0-9]/.test(safe)) {
            safe = "_" + safe;
        }

        return safe;
    }

    function runChecks() {
        let hasError: boolean = false;
        let rangeIsZero = startingRange === 0 && endingRange === 0;

        const rangeErrorEl = document.getElementById("range-error")!;
        const seedErrorEl = document.getElementById("seed-error")!;
        const edelErrorEl = document.getElementById("edel-error")!;

        rangeErrorEl.textContent = "";
        seedErrorEl.textContent = "";
        edelErrorEl.textContent = "";

        if (startingRange < 0 || endingRange < 0) {
            rangeErrorEl.textContent = "Ranges must be non-negative.";
            rangeErrorEl.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            hasError = true;
        }
        if (!rangeIsZero && endingRange - startingRange < 100) {
            rangeErrorEl.textContent = "Range must be at least 100.";
            rangeErrorEl.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            hasError = true;
        }

        let includeLegacy = (
            document.getElementById("legacy") as HTMLInputElement
        ).checked;
        let includeDuo = (document.getElementById("duo") as HTMLInputElement)
            .checked;

        if (minumimEnjoyment > maximumEnjoyment) {
            edelErrorEl.textContent =
                "Minimum enjoyment cannot be greater than maximum enjoyment";
            edelErrorEl.scrollIntoView({ behavior: "smooth", block: "center" });
            hasError = true;
        }
        if (hasError) return;

        rangeErrorEl.textContent = "";
        seedErrorEl.textContent = "";
        edelErrorEl.textContent = "";

        let extraDetails: ExtraDetails = {
            mainListBlock,
            extendedListBlock,
            mainListCap,
            extendedListCap,
            blockedTags: Object.keys(tagStates).filter(
                (t) => tagStates[t] === "blocked",
            ),
            includedTags: Object.keys(tagStates).filter(
                (t) => tagStates[t] === "included",
            ),
            minimumEnjoyment: minumimEnjoyment,
            maximumEnjoyment: maximumEnjoyment,
            prioritiseIncluded: prioritiseIncluded,
        };

        createNewRun(
            currentSeed,
            startingRange,
            endingRange,
            includeLegacy,
            includeDuo,
            extraDetails,
        );
    }

    listCreationStatus.subscribe((value) => {
        if (value === "idle") currentSeed = getRandInt32();
    });
</script>

{#if $rouletteStatus === "creating"}
    <div in:fly={{ y: 16, opacity: 0, duration: 250 }}>
        <div class="start-menu">
            {#if $listCreationStatus !== "idle"}
                <p>{$listCreationStatus}</p>
            {:else if $listCreationStatus === "idle"}
                <h2>Start New Run <br /> or Load Save</h2>
                <div class="options">
                    <input type="checkbox" name="legacy" id="legacy" />
                    <label for="legacy">Include Legacy Levels</label>
                    <br />
                    <input type="checkbox" name="duo" id="duo" />
                    <label for="duo">Include 2P Levels</label>
                </div>

                <br />

                <div class="range">
                    <p class="subtext">
                        Keep both values as 0 for all AREDL levels to be
                        included
                    </p>
                    <input
                        type="number"
                        name="start"
                        id="start"
                        class="number-input"
                        placeholder="Starting Range"
                        bind:value={startingRange}
                        onkeypress={(e) => {
                            if (!/[0-9]/.test(e.key)) e.preventDefault();
                        }}
                    />
                    <label for="start">Starting Range</label>
                    <br />
                    <input
                        type="number"
                        name="end"
                        id="end"
                        class="number-input"
                        placeholder="Ending Range"
                        bind:value={endingRange}
                        onkeypress={(e) => {
                            if (!/[0-9]/.test(e.key)) e.preventDefault();
                        }}
                    />
                    <label for="end">Ending Range</label>
                    <br />
                    <p class="subtext error-message" id="range-error"></p>
                </div>

                <br />

                <div class="seed">
                    <input
                        type="number"
                        name="seed"
                        id="seed"
                        class="number-input"
                        placeholder="Seed"
                        bind:value={currentSeed}
                        onkeypress={(e) => {
                            if (!/[0-9]/.test(e.key)) e.preventDefault();
                        }}
                    />
                    <label for="start">Seed</label>
                    <br />
                    <button
                        class="random-seed-btn"
                        onclick={() => {
                            currentSeed = getRandInt32();
                        }}>Random Seed</button
                    >
                    <br />
                    <p class="subtext error-message" id="seed-error"></p>
                </div>
                <div class="advanced-options">
                    <div class="advanced-options-con">
                        <p class="advanced-options-label">Advanced Options</p>
                        <button
                            type="button"
                            class={advancedOptionsCollapsed
                                ? "hide-button"
                                : "rotate hide-button"}
                            onclick={() => {
                                advancedOptionsCollapsed =
                                    !advancedOptionsCollapsed;
                            }}
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
                                name="enjoyment"
                                id="enjoyment"
                                class="number-input"
                                placeholder="100"
                                bind:value={maximumEnjoyment}
                            />
                        </div>
                        <p class="subtext">leave as 100 for default settings</p>
                        <div class="advanced-options-con">
                            <p>Minimum EDEL Enjoyment:</p>
                            <input
                                type="number"
                                name="enjoyment"
                                id="enjoyment"
                                class="number-input"
                                placeholder="100"
                                bind:value={minumimEnjoyment}
                            />
                        </div>
                        <p class="subtext">leave as 0 for default settings</p>
                        <p class="subtext error-message" id="edel-error"></p>
                        <hr />
                        <div class="advanced-options-con">
                            <p>No Main Lists Past:</p>
                            <input
                                type="number"
                                name="main-list-block"
                                id="main-list-bloack"
                                class="number-input"
                                placeholder="100"
                                bind:value={mainListBlock}
                                onkeypress={(e) => {
                                    const allowed = /[0-9.]/;
                                    if (
                                        !allowed.test(e.key) ||
                                        (e.key === "." &&
                                            e.currentTarget.value.includes("."))
                                    ) {
                                        e.preventDefault();
                                    }
                                }}
                            />
                            <p>%</p>
                        </div>
                        <div class="advanced-options-con">
                            <p>No Extended Lists Past:</p>
                            <input
                                type="number"
                                name="extended-list-block"
                                id="extended-list-bloack"
                                class="number-input"
                                placeholder="100"
                                bind:value={extendedListBlock}
                                onkeypress={(e) => {
                                    if (!/[0-9]/.test(e.key))
                                        e.preventDefault();
                                }}
                            />
                            <p>%</p>
                        </div>
                        <p class="subtext">
                            leave both as 100% for default settings
                        </p>
                        <hr />
                        <div class="advanced-options-con">
                            <p>Maximum Main Lists:</p>
                            <input
                                type="number"
                                name="main-list-cap"
                                id="main-list-cap"
                                class="number-input"
                                placeholder="100"
                                bind:value={mainListCap}
                                onkeypress={(e) => {
                                    if (!/[0-9]/.test(e.key))
                                        e.preventDefault();
                                }}
                            />
                        </div>
                        <div class="advanced-options-con">
                            <p>Maximum Extended Lists:</p>
                            <input
                                type="number"
                                name="extended-list-cap"
                                id="extended-list-cap"
                                class="number-input"
                                placeholder="100"
                                bind:value={extendedListCap}
                                onkeypress={(e) => {
                                    if (!/[0-9]/.test(e.key))
                                        e.preventDefault();
                                }}
                            />
                        </div>
                        <p class="subtext">
                            leave both as 100 for default settings
                        </p>
                        <hr />
                        <div class="tag-options-con">
                            <div class="advanced-options-con">
                                <label for="priority-switch"
                                    >Prioritise Included Tags:</label
                                >
                                <input
                                    type="checkbox"
                                    class="priority-check"
                                    id="priority-switch"
                                    bind:checked={prioritiseIncluded}
                                />
                            </div>
                            <p class="subtext">
                                (Blocked tags are prioritised by default)
                            </p>
                            <p>Blocked Tags</p>
                            <p class="subtext">
                                (click on a tag to cycle between ignored,
                                blocked or included)
                            </p>
                            {#each aredlTags as tag}
                                <button
                                    class={"tag-button " +
                                        fuckCss(tag) +
                                        " " +
                                        tagStates[tag]}
                                    onclick={() => tagButtonClick(tag)}
                                >
                                    {tag}
                                </button>
                            {/each}
                            <button class="reset-tags-btn" onclick={resetTags}
                                >Reset All Tags</button
                            >
                        </div>
                    </div>
                </div>

                <div class="start-menu-buttons">
                    <button class="start-btn" onclick={runChecks}>Start</button>
                    <button class="load-btn" onclick={openFilePicker}
                        >Load Save</button
                    >
                    <input
                        type="file"
                        accept=".txt"
                        bind:this={fileInput}
                        onchange={handleFile}
                        style="display: none"
                    />
                </div>
                <p class="subtext">
                    {isSaveLoaded ? "(Save Loaded)" : "(No Save Loaded)"}
                </p>
            {/if}
        </div>
    </div>
{/if}

<style>
    .start-menu {
        margin-top: 120px;
        display: flex;
        flex-direction: column;

        flex-grow: 0;
        flex-shrink: 0;
        max-width: 385px;
        min-width: 320px;
        padding: 1.5em;

        background-color: #222;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        border-radius: 10px;

        height: auto;
        max-height: calc(100vh - 140px);
        overflow-y: auto;
    }

    h2 {
        text-align: center;
        text-decoration: underline;
        text-decoration-style: dashed;
        font-size: 1.8em;
        line-height: 1em;
        margin-bottom: 20px;
    }

    .options,
    .range,
    .seed,
    .advanced-options {
        text-align: left;
        outline: 1px solid #444;
        padding: 0.5em;
        margin-bottom: 10px;
    }

    .advanced-options-con {
        display: flex;
        flex-direction: row;
    }

    .advanced-options-con .number-input {
        width: 50px;
        margin-left: 10px;
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

    .start-menu-buttons {
        margin-top: auto;
        display: flex;
        justify-content: center;
        gap: 1em;
    }

    .start-btn {
        background-color: rgb(100, 180, 100);
        margin-bottom: 4px;
    }
    .load-btn {
        background-color: rgb(100, 100, 180);
        margin-bottom: 4px;
    }
    .random-seed-btn,
    .reset-tags-btn {
        background-color: rgb(100, 120, 160);
        scale: 0.8;
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

    .priority-check {
        margin-left: 5px;
    }

    hr {
        color: #444;
        margin-top: 5px;
        margin-bottom: 5px;
    }

    @media (max-width: 830px) {
        .start-menu {
            margin-top: 170px;
        }
    }
</style>
