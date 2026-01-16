<script lang="ts">
    import { getRandInt32 } from "../helpers/rng";
    import { createNewRun } from "../helpers/createList";
    import { listCreationStatus, rouletteStatus } from "../helpers/statusStore";
    import { startRun } from "../helpers/progress";
    import {
        decodeSave,
        type ExtraDetails,
        type GenerationDetails,
    } from "../helpers/saving";
    import { fly } from "svelte/transition";

    import AdvancedOptions from "./StartMenuSections/AdvancedOptions.svelte";
    import RngOptions from "./StartMenuSections/GenerationOptions.svelte";
    import GenerationOptions from "./StartMenuSections/GenerationOptions.svelte";

    let isSaveLoaded: boolean = false;
    let currentSeed: number = getRandInt32();

    let startingRange: number = 0;
    let endingRange: number = 0;

    let mainListBlock: number = 100;
    let extendedListBlock: number = 100;
    let mainListCap: number = 100;
    let extendedListCap: number = 100;
    let minimumEnjoyment: number = 0;
    let maximumEnjoyment: number = 100;
    let prioritiseIncluded: boolean = false;
    let blockedTags: string[] = [];
    let includedTags: string[] = [];

    let slope: number;
    let p1 = { x: 0, y: 5 };
    let p2 = { x: 100, y: 5 };

    let fileInput: HTMLInputElement;

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

        if (minimumEnjoyment > maximumEnjoyment) {
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
            blockedTags,
            includedTags,
            minimumEnjoyment: minimumEnjoyment,
            maximumEnjoyment: maximumEnjoyment,
            prioritiseIncluded,
        };

        let generationDetails: GenerationDetails = {
            slope: slope,
        };

        createNewRun(
            currentSeed,
            startingRange,
            endingRange,
            includeLegacy,
            includeDuo,
            extraDetails,
            generationDetails,
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

                <!-- Main Options -->
                <div class="options">
                    <input type="checkbox" name="legacy" id="legacy" />
                    <label for="legacy">Include Legacy Levels</label>
                    <br />
                    <input type="checkbox" name="duo" id="duo" />
                    <label for="duo">Include 2P Levels</label>
                </div>
                <br />

                <!-- Range Options -->
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

                <!-- Seed Options -->
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

                <!-- Generation -->
                <RngOptions bind:slope bind:p1 bind:p2 />

                <!-- Advanced Options -->
                <AdvancedOptions
                    bind:mainListBlock
                    bind:extendedListBlock
                    bind:mainListCap
                    bind:extendedListCap
                    bind:minimumEnjoyment
                    bind:maximumEnjoyment
                    bind:prioritiseIncluded
                    bind:blockedTags
                    bind:includedTags
                />

                <!-- Start and Load Save Buttons -->
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
    .seed {
        text-align: left;
        outline: 1px solid #444;
        padding: 0.5em;
        margin-bottom: 10px;
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

    .random-seed-btn {
        background-color: rgb(100, 120, 160);
        scale: 0.8;
    }

    .subtext {
        color: #888;
        font-size: 0.8em;
    }

    .error-message {
        color: red;
    }

    @media (max-width: 830px) {
        .start-menu {
            margin-top: 170px;
        }
    }

    .start-menu,
    .number-input,
    .options,
    .range,
    .seed {
        transition:
            background-color 0.2s ease,
            box-shadow 0.2s ease,
            outline-color 0.2s ease;
    }

    @media (prefers-color-scheme: light) {
        .start-menu {
            background-color: #f4f4f6;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            outline: 1px dashed #cfcfcf;
        }

        .options,
        .range,
        .seed {
            outline: 1px solid #ccc;
        }

        .number-input {
            background-color: rgba(0, 0, 0, 0.05);
        }

        .subtext {
            color: #666;
        }

        .error-message {
            color: #c00;
        }

        h2 {
            text-decoration-color: #aaa;
        }
    }
</style>
