<script lang="ts">
    import LevelCard from "./LevelCard.svelte";
    import FinishCard from "./FinishCard.svelte";
    import { levels, rouletteStatus } from "../helpers/statusStore";
    import { fly } from "svelte/transition";
</script>

<div class="levels-list">
    {#each $levels as level, index}
        <div in:fly={{ y: 16, opacity: 0, duration: 250 }}>
            <LevelCard
                name={level.name}
                position={level.position ?? index + 1}
                min_percentage={level.min_percentage}
                level_id={level.level_id}
            />
        </div>
    {/each}
    {#if $rouletteStatus === "completed"}
        <div in:fly={{ y: 16, opacity: 0, duration: 300 }}>
            <FinishCard />
        </div>
    {/if}
</div>

<style>
    .levels-list {
        flex-direction: column;
        gap: 0.5rem;
        margin-top: 120px;
        width: 95vw;
        height: calc(100vh - 120px);
        overflow-y: scroll;
        overflow-x: hidden;
    }

    @media (max-width: 830px) {
        .levels-list {
            margin-top: 170px;
            height: calc(100vh - 170px);
        }
    }
</style>
