import { writable } from "svelte/store";

export const listCreationStatus = writable<string>("idle");