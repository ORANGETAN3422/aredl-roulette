<script lang="ts">
    import StartMenu from "./lib/StartMenu.svelte";
    import LevelSection from "./lib/LevelSection.svelte";
    import { downloadSave, encodeSave } from "./helpers/saving";
    import { currentSaveFile } from "./helpers/statusStore";
    import { resetRun } from "./helpers/progress";

    function downloadCurrentSave() {
        if ($currentSaveFile) {
            downloadSave(encodeSave($currentSaveFile));
        } else {
            alert("No save file available to download.");
        }
    }

    function resetConfirm() {
        if (!$currentSaveFile) return;
        const confirmed = confirm(
            "Are you sure you want to reset the run? You cannot undo this action unless you have a save file.",
        );
        if (!confirmed) return;

        resetRun();
    }
</script>

<div class="wrapper">
    <div class="outline-thing">
        <h1>AREDL Roulette</h1>

        <div class="right-menu">
            <div class="top-content">
                <p>Seed: {$currentSaveFile?.seed}</p>
            </div>

            <div class="bottom-buttons">
                <button class="restart-btn" onclick={resetConfirm}
                    >Restart</button
                >
                <button class="download-save-btn" onclick={downloadCurrentSave}>
                    Download Save
                </button>
            </div>
        </div>

        <div class="left-menu">
            <a href="https://aredl.net/">AREDL Homepage</a> <br />
            <a href="https://matcool.github.io/extreme-demon-roulette/"
                >Matcool's original Roulette</a
            > <br />
            <a href="https://github.com/ORANGETAN3422"
                >This Roulette's Repository</a
            > <br />
            <br />
        </div>
    </div>

    <StartMenu />
    <LevelSection />
</div>

<style>
    .outline-thing {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 120px;
    }

    h1 {
        font-size: 2.6em;
        line-height: 1.1;
        text-align: center;
        margin-bottom: 2rem;
        margin-top: 30px;
    }

    .right-menu {
        position: fixed;
        top: 1rem;
        right: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: max-content;
        align-items: flex-end;
    }

    .left-menu {
        position: fixed;
        top: 1rem;
        left: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: max-content;
        align-items: flex-start;
        text-align: left;
        font-style: italic;
        text-decoration: underline;
    }

    .top-content {
        margin-bottom: 1rem;
        font-size: 0.9rem;
        text-align: right;
        font-style: italic;
    }

    .bottom-buttons {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        align-items: flex-start;
    }

    .restart-btn,
    .download-save-btn {
        flex: 0 0 auto;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 5px;
        color: #fff;
        cursor: pointer;
    }

    .restart-btn {
        background-color: rgb(180, 100, 100);
    }

    .download-save-btn {
        background-color: rgb(100, 100, 180);
    }

    .restart-btn:hover,
    .download-save-btn:hover {
        filter: brightness(1.2);
    }

    .wrapper {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        overflow-y: hidden;
        overflow-x: hidden;
        display: flex;
        align-items: center;
        flex-direction: column;
    }

    @media (max-width: 830px) {
        .outline-thing {
            height: 180px;
        }
        .right-menu {
            top: 5em;
        }
        .left-menu {
            top: 5em;
        }
    }
</style>
