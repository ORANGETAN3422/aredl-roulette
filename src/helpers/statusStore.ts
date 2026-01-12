import { writable } from "svelte/store";
import type { SaveFile } from "./saving";

export const listCreationStatus = writable<string>("idle");
export const rouletteStatus = writable<string>("creating");
export const currentSaveFile = writable<SaveFile | null>(null);

// listCreationStatus.subscribe((value) => {
//     console.log(value);
// });

export function startRun(save: SaveFile) {
    currentSaveFile.set(save);
    listCreationStatus.set("finished");
    rouletteStatus.set("started");
    nextLevel(save.current_percentage, save.current)
}

export function resetRun() {
    currentSaveFile.set(null);
    listCreationStatus.set("idle");
    rouletteStatus.set("creating");
}

export function nextLevel(percentage: number, current: number) {

}