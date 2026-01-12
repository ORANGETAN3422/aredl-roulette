<script lang="ts">
    import { currentSaveFile } from "../helpers/statusStore";
    import LevelCard from "./LevelCard.svelte";
</script>

<!-- {#if $currentSaveFile}
    <div class="levels-list">
        {#each $currentSaveFile.levels as level, index}
            <LevelCard
                name={level.name}
                position={level.position ?? index + 1}
                min_percentage={index + 1}
                level_id={level.level_id}
            />
        {/each}
    </div>
{/if} -->

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
