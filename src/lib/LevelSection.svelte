<script lang="ts">
    import LevelCard from "./LevelCard.svelte";
    import { levels } from "../helpers/statusStore";
</script>

<div class="levels-list">
    {#each $levels as level, index}
        <LevelCard
            name={level.name}
            position={level.position ?? index + 1}
            min_percentage={level.min_percentage}
            level_id={level.level_id}
        />
    {/each}
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
