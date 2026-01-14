<script lang="ts">
    import { fetchLevel } from "../helpers/api";

    import { onMount } from "svelte";
    import {
        endGame,
        nextLevel,
        saveLevelPercentage,
    } from "../helpers/progress";

    export let name: string;
    export let position: number;
    export let min_percentage: number;
    export let level_id: number;
    export let completedOnStart: boolean;
    export let completedPercentage: number;

    let levelDetails: any = null;
    let showcaseLink: string;
    let showcaseThumb: string =
        "https://placehold.co/1280x720?text=No+Thumbnail";
    let levelThumb: string | null = null;
    let creator: string = "unknown";
    let completed = false;
    let completedPercentageLocal = 0;
    let userValue: number | null = null;

    function getYouTubeID(url: string): string | null {
        const regex =
            /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    async function fetchLevelDetails() {
        levelDetails = await fetchLevel(level_id);
        if (levelDetails) {
            creator = levelDetails.publisher.global_name;
            showcaseLink = levelDetails.verifications[0].video_url;

            const ytid = getYouTubeID(showcaseLink);
            if (!ytid) return null;
            showcaseThumb = await getYoutubeThumbnail(ytid);

            levelThumb = `https://raw.githubusercontent.com/All-Rated-Extreme-Demon-List/Thumbnails/main/levels/full/${level_id}.webp`;
        }
    }

    async function getYoutubeThumbnail(id: string): Promise<string> {
        const links = [
            //`https://img.youtube.com/vi/${id}/maxresdefault.jpg`, // this one takes too long
            `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
            `https://img.youtube.com/vi/${id}/sddefault.jpg`,
            `https://img.youtube.com/vi/${id}/mqdefault.jpg`,
        ];

        for (const url of links) {
            try {
                const res = await fetch(url, { method: "HEAD" });
                if (res.ok) return url;
            } catch {}
        }

        return "https://placehold.co/1280x720?text=No+Thumbnail";
    }

    onMount(() => {
        completed = completedOnStart;
        completedPercentageLocal = completedPercentage;
        fetchLevelDetails();
    });

    function handleDone() {
        if (userValue === null || userValue < min_percentage) return;
        saveLevelPercentage(userValue, name);
        nextLevel(userValue + 1);
        completedPercentageLocal = userValue;
        completed = true;
    }

    function handleGiveUp() {
        const confirmed = confirm(
            "Are you sure you want to give up? You cannot undo this action unless you have a save file.",
        );
        if (!confirmed) return;
        endGame();
        saveLevelPercentage(min_percentage, name);
        completedPercentageLocal = min_percentage;
        completed = true;
    }

    function validateInput(event: Event) {
        const value = parseInt((event.target as HTMLInputElement).value);
        if (isNaN(value) || value < 1) userValue = 1;
        else if (value > 100) userValue = 100;
        else userValue = value;
    }

    function openYoutubeVideo() {
        window.open(showcaseLink, "_blank");
    }
</script>

<div class="level-card">
    <div class="level-thumb">
        <img src={levelThumb} alt="" />
    </div>
    <div class="inner">
        <button
            class="thumbnail"
            onclick={openYoutubeVideo}
            aria-label="Open level showcase video"
        >
            <img src={showcaseThumb} alt="thumbnail for yt" />
        </button>
        <div class="info">
            <div class="title-row">
                <a
                    href={`https://aredl.net/list/${level_id}`}
                    target="_blank"
                    class="title">#{position} - {name}</a
                >
                {#if completed}
                    <p class="percentage-text">{completedPercentageLocal}%</p>
                {:else}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        class="title-icon"
                        aria-hidden="true"
                        onclick={() => {
                            navigator.clipboard.writeText(level_id.toString());
                        }}
                    >
                        <path
                            d="M192 0c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-200.6c0-17.4-7.1-34.1-19.7-46.2L370.6 17.8C358.7 6.4 342.8 0 326.3 0L192 0zM64 128c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-16-64 0 0 16-192 0 0-256 16 0 0-64-16 0z"
                        />
                    </svg>
                {/if}
            </div>
            <br />
            <p class="creator-title">by {creator}</p>
        </div>
        {#if !completed}
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
                    <button
                        class="done-btn"
                        onclick={handleDone}
                        disabled={userValue === null ||
                            userValue < min_percentage}>Done</button
                    >
                    <button class="giveup-btn" onclick={handleGiveUp}
                        >Give Up</button
                    >
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    .level-card {
        position: relative;
        width: 95%;
        height: 120px;
        background-color: #222;
        border-radius: 12px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        margin-bottom: 1rem;
        margin-left: 2.5%;
        color: #fff;
        overflow: hidden;
    }

    .inner {
        position: relative;
        padding: 0.5rem 1rem;
        display: flex;
        align-items: center;
        width: 100%;
        height: 100%;
        z-index: 100;
    }

    .level-thumb {
        position: absolute;
        top: -25px;
        right: -25px;
        width: 320px;
        height: 180px;
        z-index: 0;
        overflow: hidden;
        clip-path: polygon(45% 0, 100% 0, 100% 100%, 0% 100%);
        user-select: none;
        pointer-events: none;
        filter: blur(1px) brightness(0.7);
    }

    .thumbnail {
        width: 160px;
        height: 90px;
        border: none;
        background: none;
        padding: 0;
        cursor: pointer;
        border-radius: 3px;
        margin-right: 1rem;
        flex-shrink: 0;
        overflow: hidden;
        background-color: #222;
    }

    .thumbnail img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transform: scale(1.1);
        transform-origin: center;
        border-radius: 3px;
    }

    .info {
        margin-top: -45px;
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        flex: 1;
    }

    .title {
        font-size: 1.65rem;
        margin: 0;
        padding-left: 5px;
        line-height: 1.2;
        transition: text-decoration 0.2s ease-in-out;
        cursor: pointer;
        color: white;
    }

    .title:hover {
        text-decoration: underline;
    }

    .title-row {
        display: flex;
        align-items: center;
        gap: 0.4rem;
    }

    .title-icon {
        width: 1em;
        height: 1em;
        fill: currentColor;
        opacity: 0.85;
        cursor: pointer;
    }

    .percentage-text {
        font-size: 1.4rem;
        color: rgba(255, 255, 255, 0.8);
        margin-top: -8px;
        width: 1em;
        height: 1em;
        fill: currentColor;
        opacity: 0.85;
        cursor: pointer;
    }

    .title-icon:hover {
        filter: brightness(0.5);
    }

    .creator-title {
        font-size: 1.1rem;
        margin: 0;
        padding-left: 5px;
        line-height: 1.2;
        font-style: italic;
        font-weight: 300;
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
        background: #222;
        box-shadow: 0 0 16px 10px rgba(0, 0, 0, 0.6);
        z-index: 3;
    }

    .buttons {
        display: flex;
        gap: 0.5rem;
        margin-top: 0.5rem;
        box-shadow: 0 0 16px 10px rgba(0, 0, 0, 0.6);
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

    @media (max-width: 650px) {
        .level-card {
            width: 95%;
            height: auto; /* allow flexible height */
            margin-left: 2.5%;
            margin-bottom: 1rem;
        }

        .inner {
            flex-direction: column;
            align-items: flex-start;
            padding: 0.5rem;
        }

        .level-thumb {
            all: unset;
            bottom: -30%;
            left: 0;
            width: 100%;
            height: 60%;

            position: absolute;
            z-index: 0;
            overflow: hidden;
            user-select: none;
            pointer-events: none;
            filter: blur(1px) brightness(0.7);

            -webkit-mask-image: linear-gradient(
                to top,
                rgba(0, 0, 0, 1) 30%,
                rgba(0, 0, 0, 0) 100%
            );
            -webkit-mask-repeat: no-repeat;
            -webkit-mask-size: 100% 100%;
            mask-image: linear-gradient(
                to top,
                rgba(0, 0, 0, 0.5) 30%,
                rgba(0, 0, 0, 0) 100%
            );
            mask-repeat: no-repeat;
            mask-size: 100% 100%;
        }

        .thumbnail {
            width: 100%;
            height: auto;
            margin-right: 0;
            margin-bottom: 0.5rem;
        }

        .thumbnail img {
            width: 100%;
            height: auto;
            object-fit: cover;
            transform: scale(1.1);
            border-radius: 3px;
        }

        .info {
            margin-top: 0;
            width: 100%;
        }

        .title {
            font-size: 1.3rem;
            padding-left: 0;
        }

        .title-row {
            flex-direction: row;
            flex-wrap: wrap;
            gap: 0.3rem;
            align-items: center;
        }

        .percentage-text {
            font-size: 1.2rem;
            margin-top: -7px;
        }

        .creator-title {
            font-size: 0.9rem;
            padding-left: 0;
        }

        .right-side {
            width: 100%;
            margin-left: 0;
            margin-top: 0.5rem;
        }

        .right-side input[type="number"] {
            width: 100%;
            box-sizing: border-box;
        }

        .buttons {
            flex-direction: column;
            width: 100%;
        }

        .done-btn,
        .giveup-btn {
            width: 100%;
            padding: 0.5rem;
            font-size: 0.9rem;
        }
    }
</style>
