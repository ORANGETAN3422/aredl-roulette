<script lang="ts">
    export let name: string;
    export let position: number;
    export let min_percentage: number;

    let userValue: number | null = null;

    function handleDone() {}

    function handleGiveUp() {}

    function validateInput(event: Event) {
        const value = parseInt((event.target as HTMLInputElement).value);
        if (isNaN(value) || value < 1) userValue = 1;
        else if (value > 99) userValue = 99;
        else userValue = value;
    }
</script>

<div class="level-card">
    <img
        class="thumbnail"
        src="https://placehold.co/600x400"
        alt="Level Thumbnail"
    />
    <div class="info">
        <p class="title">#{position} - {name}</p>
    </div>
    <div class="right-side">
        <input
            type="number"
            min="1"
            max="99"
            step="1"
            value={userValue}
            oninput={validateInput}
            id="score-input"
            placeholder={`At least ${min_percentage}%`}
        />
        <div class="buttons">
            <button class="done-btn" onclick={handleDone}>Done</button>
            <button class="giveup-btn" onclick={handleGiveUp}>Give Up</button>
        </div>
    </div>
</div>

<style>
    .level-card {
        display: flex;
        align-items: center;
        width: 95%;
        height: 120px;
        background-color: #222;
        border-radius: 12px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        padding: 0.5rem 1rem;
        margin-bottom: 1rem;
        margin-left: 2.5%;
        color: #fff;
    }

    .thumbnail {
        width: 160px;
        height: 90px;
        object-fit: cover;
        border-radius: 5px;
        margin-right: 1rem;
        flex-shrink: 0;
        scale: 1.1;
    }

    .info {
        display: flex;
        align-items: center;
        flex: 1;
    }

    .title {
        font-size: 1.6rem;
        margin: 0;
        padding-left: 5px;
        line-height: 1.2;
    }

    .right-side {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-left: 1rem;
    }

    .right-side input[type="number"] {
        width: 100%;
        height: 37px;
        margin-top: 0.2rem;
        padding: 0.2rem 0.4rem;
        border-radius: 4px;
        border: 1px solid #555;
        color: #fff;
    }

    .buttons {
        display: flex;
        gap: 0.5rem;
        margin-top: 0.5rem;
    }

    .done-btn {
        background-color: rgb(100, 180, 100);
        border: none;
        border-radius: 4px;
        padding: 0.3rem 0.6rem;
        color: #fff;
        cursor: pointer;
    }

    .giveup-btn {
        background-color: rgb(180, 100, 100);
        border: none;
        border-radius: 4px;
        padding: 0.3rem 0.6rem;
        color: #fff;
        cursor: pointer;
    }

    .done-btn:hover,
    .giveup-btn:hover {
        filter: brightness(1.2);
    }
</style>
