import { writable } from "svelte/store";
import type { SaveFile } from "./saving";

export const listCreationStatus = writable<string>("idle");
export const rouletteStatus = writable<string>("creating");
export const currentSaveFile = writable<SaveFile | null>(null);

listCreationStatus.subscribe((value) => {
    console.log(value);
});