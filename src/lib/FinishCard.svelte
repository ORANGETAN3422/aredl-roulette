<script lang="ts">
    import { currentSaveFile } from "../helpers/statusStore";
</script>

<div class="level-card">
    <p class="title">Roulette Complete!</p>
    <p>Score: {$currentSaveFile?.current}</p>
    <p>Highest Percentage: {($currentSaveFile?.current_percentage ?? 0) - 1}</p>
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
</style>
