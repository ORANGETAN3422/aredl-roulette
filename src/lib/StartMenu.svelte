<script lang="ts">
    let isSaveLoaded = false;
    let currentSeed = 0;

    function sfc32(a: number, b: number, c: number, d: number) {
        a |= 0;
        b |= 0;
        c |= 0;
        d |= 0;
        let t = (((a + b) | 0) + d) | 0;
        d = (d + 1) | 0;
        a = b ^ (b >>> 9);
        b = (c + (c << 3)) | 0;
        c = (c << 21) | (c >>> 11);
        c = (c + t) | 0;
        return (t >>> 0) / 4294967296;
    }

    function getRand(seed: number) {
        let a = seed | 0;
        let b = (seed ^ 0xdeadbeef) >>> 0;
        let c = (seed ^ 0xcafebabe) >>> 0;
        let d = (seed ^ 0xfaceb00c) >>> 0;

        return sfc32(a, b, c, d);
    }

    function randomiseSeed() {
        currentSeed = Math.floor(Math.random() * 4294967295);
    }
    randomiseSeed();
</script>

<div class="start-menu">
    <h2>Start New Run <br /> or Load Save</h2>
    <div class="options">
        <input type="checkbox" name="legacy" id="legacy" />
        <label for="legacy">Include Legacy Levels</label>
        <br />
        <input type="checkbox" name="duo" id="duo" />
        <label for="duo">Include Duo Mode</label>
    </div>

    <br />

    <div class="range">
        <input type="number" name="start" id="start" class="range-input" />
        <label for="start">Starting Range</label>
        <br />
        <input type="number" name="end" id="end" class="range-input" />
        <label for="end">Ending Range</label>
    </div>

    <br />

    <div class="seed">
        <input
            type="number"
            name="seed"
            id="seed"
            class="range-input"
            bind:value={currentSeed}
        />
        <label for="start">Seed</label>
        <br />
        <button class="random-seed-btn" onclick={randomiseSeed}
            >Random Seed</button
        >
    </div>

    <div class="start-menu-buttons">
        <button class="start-btn">Start</button>
        <button class="load-btn">Load Save</button>
    </div>
    <br />
    <p class="subtext">{isSaveLoaded ? "(Save Loaded)" : "(No Save Loaded)"}</p>
</div>

<style>
    .start-menu {
        margin-top: 20px;
        display: flex;
        flex-direction: column;

        flex: 1 1 auto;
        max-width: 600px;
        min-width: 320px;
        min-height: 350px;

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

    .range-input {
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
    }
    .load-btn {
        background-color: rgb(100, 100, 180);
    }
    .random-seed-btn {
        background-color: rgb(100, 120, 160);
        scale: 0.8;
    }

    .subtext {
        color: #888;
        font-size: 0.8em;
    }
</style>
