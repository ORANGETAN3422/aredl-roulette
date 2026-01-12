import { writable } from "svelte/store";

export const listCreationStatus = writable<string>("idle");
export const rouletteStatus = writable<string>("creating");
export const currentSaveFile = writable<object | null>(null);

listCreationStatus.subscribe((value) => {
    console.log(value);
});