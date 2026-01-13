import { currentSaveFile, listCreationStatus, rouletteStatus } from "./statusStore";
import { saveToBrowser, type SaveFile } from "./saving";
import { get, writable } from "svelte/store";

type LevelData = {
    name: string;
    position: number;
    min_percentage: number;
    level_id: number;
    completed: boolean;
    completed_percentage: number;
};

export const levels = writable<LevelData[]>([]);

export function startRun(save: SaveFile) {
    resetRun();
    currentSaveFile.set(save);
    listCreationStatus.set("finished");
    rouletteStatus.set("started");
    saveToBrowser(save);

    // create dummy cards for saves with progress. Do this for every card except for the current
    for (let i = 0; i < save.current - 1; i++) {
        createDummyCard(save, i);
    }
    if (save.current_percentage >= 101) {
        createDummyCard(save, save.current - 1);
        endGame();
        return;
    }
    createActiveCard(save, save.current - 1, save.current_percentage);
}

export function nextLevel(newPercentage: number, completed: boolean = false) {
    // if you get a percentage greater than 1 then it will go to the next in queue
    let newSave = get(currentSaveFile)
    if (!newSave) return;

    if (newPercentage === 101) {
        newSave.current_percentage = newPercentage;
        endGame();
        return;
    }

    // set save file to the next level, and save entered percentage
    newSave.current = (newSave.current ?? 0) + 1;
    newSave.current_percentage = newPercentage;

    let level: LevelData = {
        name: newSave.levels[newSave.current - 1].name,
        position: newSave.levels[newSave.current - 1].position,
        min_percentage: newPercentage,
        level_id: newSave.levels[newSave.current - 1].level_id,
        completed: completed,
        completed_percentage: newSave.levels[newSave.current - 1].completed_percentage,
    }
    currentSaveFile.set(newSave);
    saveToBrowser(structuredClone(newSave));
    addLevel(level);
}

export function createActiveCard(save: SaveFile, index: number, percentage: number) {
    let saveInfo = structuredClone(save.levels[index]);
    let level: LevelData = {
        name: saveInfo.name,
        position: saveInfo.position,
        min_percentage: percentage,
        level_id: saveInfo.level_id,
        completed: false,
        completed_percentage: saveInfo.completed_percentage
    }
    addLevel(level);
}

export function createDummyCard(save: SaveFile, index: number) {
    let saveInfo = structuredClone(save.levels[index]);
    let level: LevelData = {
        name: saveInfo.name,
        position: saveInfo.position,
        min_percentage: 0, // this is a dummy card for display so this is useless
        level_id: saveInfo.level_id,
        completed: true, // again, this is a dummy so this should be true because there is no interaction
        completed_percentage: saveInfo.completed_percentage
    }
    addLevel(level);
}

export function addLevel(level: LevelData) {
    levels.update(l => [...l, level]);
}

export function resetLevels() {
    levels.set([]);
}

export function endGame() {
    rouletteStatus.set("completed");
}

export function resetRun() {
    currentSaveFile.set(null);
    listCreationStatus.set("idle");
    rouletteStatus.set("creating");
    resetLevels();
}

export function saveLevelPercentage(percentage: number, name: string) {
    let newSave = get(currentSaveFile);
    if (!newSave) return

    for (let i = 0; i < newSave.levels.length; i++) {
        let level = newSave.levels[i]
        if (level.name === name) {
            level.completed_percentage = percentage;
        }
    }
    currentSaveFile.set(newSave);
}