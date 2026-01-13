<script lang="ts">
    import LevelCard from "./LevelCard.svelte";
    import FinishCard from "./FinishCard.svelte";
    import { currentSaveFile, rouletteStatus } from "../helpers/statusStore";
    import { levels } from "../helpers/progress";
    import { fly } from "svelte/transition";
    import { tick } from "svelte";

    let listElement: HTMLDivElement;
    let finishElement: HTMLDivElement | null = null;

    $: if ($levels.length) {
        scrollToLastCard();
    }
    $: if ($rouletteStatus === "completed") {
        scrollToFinish();
    }

    async function scrollToLastCard() {
        await tick();
        const cards = listElement.querySelectorAll(".level-card");
        cards[cards.length - 1]?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
        });
    }

    async function scrollToFinish() {
        await tick();
        finishElement?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
        });
    }
</script>

<div class="levels-list" bind:this={listElement}>
    {#each $levels as level, index}
        <div in:fly={{ y: 16, opacity: 0, duration: 250 }}>
            <LevelCard
                name={level.name}
                position={level.position ?? index + 1}
                min_percentage={level.min_percentage}
                level_id={level.level_id}
                completedOnStart={level.completed}
                completedPercentage={level.completed_percentage}
            />
        </div>
    {/each}
    {#if $rouletteStatus === "completed"}
        <div
            in:fly={{ y: 16, opacity: 0, duration: 300 }}
            bind:this={finishElement}
        >
            <FinishCard />
        </div>
    {/if}
</div>

<style>
    .levels-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-top: 120px;
        width: 95vw;
        height: calc(100vh - 120px);
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        overflow-x: hidden;
    }

    @media (max-width: 830px) {
        .levels-list {
            margin-top: 170px;
            height: calc(100vh - 170px);
        }
    }

    @media (max-width: 450px) {
        .levels-list {
            margin-top: 180px;
            height: calc(100vh - 180px);
            padding-bottom: 1rem;
        }
    }
</style>
