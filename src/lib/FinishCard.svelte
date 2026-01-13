<script lang="ts">
    import { showRemainingLevels } from "../helpers/progress";
    import { currentSaveFile } from "../helpers/statusStore";

    function handleViewAll() {
        if ($currentSaveFile) {
            showRemainingLevels($currentSaveFile);
        }
    }
</script>

<div class="level-card">
    <p class="title">Roulette Finished</p>
    <p>Score: {($currentSaveFile?.current ?? 0) - 1}</p>
    <p>Highest Percentage: {($currentSaveFile?.current_percentage ?? 0) - 1}</p>
    {#if ($currentSaveFile?.current_percentage ?? 0) < 101}
        <button class="view-all" onclick={handleViewAll}
            >View Remaining Levels</button
        >
    {:else}
        <p>gg</p>
    {/if}
</div>

<style>
    .level-card {
        position: relative;
        width: 95%;
        height: 175px;
        background-color: #222;
        border-radius: 12px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        margin-bottom: 1rem;
        margin-left: 2.5%;
        color: #fff;
        overflow: hidden;
        text-align: center;
    }

    .title {
        font-size: 2rem;
        margin: 0;
        padding-left: 5px;
        padding-top: 15px;
        line-height: 1.2;
        transition: text-decoration 0.2s ease-in-out;
        color: white;
    }

    .view-all {
        margin-top: 10px;
        background-color: rgb(100, 100, 180);
    }
</style>
