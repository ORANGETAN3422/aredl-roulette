import { writable, get } from "svelte/store";
import type { SaveFile } from "./saving";

type LevelData = {
    name: string;
    position: number;
    min_percentage: number;
    level_id: number;
};

export const levels = writable<LevelData[]>([]);

export const listCreationStatus = writable<string>("idle");
export const rouletteStatus = writable<string>("creating");
export const currentSaveFile = writable<SaveFile | null>(null);

export function startRun(save: SaveFile) {
    currentSaveFile.set(save);
    listCreationStatus.set("finished");
    rouletteStatus.set("started");
    nextLevel(save.current_percentage)
}

export function resetRun() {
    currentSaveFile.set(null);
    listCreationStatus.set("idle");
    rouletteStatus.set("creating");
    resetLevels();
}

export function nextLevel(newPercentage: number) {
    // if you get a percentage greater than 1 then it will go to the next in queue
    let newSave = get(currentSaveFile)
    if (newSave) {
        newSave.current = (newSave.current ?? 0) + 1;
        newSave.current_percentage = newPercentage;

        let level: LevelData = {
            name: newSave.levels[newSave.current - 1].name,
            position: newSave.levels[newSave.current - 1].position,
            min_percentage: newPercentage,
            level_id: newSave.levels[newSave.current - 1].level_id
        }
        addLevel(level);
    }

    console.log(newSave);
}

export function addLevel(level: LevelData) {
    levels.update(l => [...l, level]);
}

export function resetLevels() {
    levels.set([]);
}