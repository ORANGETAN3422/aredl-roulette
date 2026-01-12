<script lang="ts">
    import { getRandInt32 } from "../helpers/rng";
    import { createNewRun } from "../helpers/createList";
    import {
        currentSaveFile,
        listCreationStatus,
        rouletteStatus,
        startRun,
    } from "../helpers/statusStore";
    import { decodeSave } from "../helpers/saving";

    let isSaveLoaded = false;
    let currentSeed = getRandInt32();

    let startingRange = 0;
    let endingRange = 0;

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
        let rangeIsZero = startingRange === 0 && endingRange === 0;
        if (startingRange < 0 || endingRange < 0) {
            document.getElementById("range-error")!.textContent =
                "Ranges must be non-negative.";
            return;
        }
        if (!rangeIsZero && endingRange - startingRange < 100) {
            document.getElementById("range-error")!.textContent =
                "Range must be at least 100.";
            return;
        }

        let includeLegacy = (
            document.getElementById("legacy") as HTMLInputElement
        ).checked;
        let includeDuo = (document.getElementById("duo") as HTMLInputElement)
            .checked;

        document.getElementById("range-error")!.textContent = "";
        document.getElementById("seed-error")!.textContent = "";
        createNewRun(
            currentSeed,
            startingRange,
            endingRange,
            includeLegacy,
            includeDuo,
        );
    }
</script>

{#if $rouletteStatus === "creating"}
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
                    Keep both values as 0 for all AREDL levels to be included
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
            <br />
            <p class="subtext">
                {isSaveLoaded ? "(Save Loaded)" : "(No Save Loaded)"}
            </p>
        {/if}
    </div>
{/if}

<style>
    .start-menu {
        margin-top: 120px;
        display: flex;
        flex-direction: column;

        flex-grow: 0;
        flex-shrink: 0;
        max-width: 600px;
        min-width: 320px;
        height: 480px;

        background-color: #222;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        border-radius: 10px;

        padding: 1.5em;
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
</style>
