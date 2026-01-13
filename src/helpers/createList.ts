import { currentSaveFile, listCreationStatus } from "./statusStore";
import { createRNG } from "./rng";
import { type SaveFile, type Level } from "./saving";
import { startRun } from "./progress";

let levelsEndpoint = "https://aredl-roulette.vercel.app/api/aredl/levels";
let storedLevels: any;

export async function createNewRun(seed: number, startRange: number, endRange: number, includeLegacy: boolean, includeDuo: boolean) {
    listCreationStatus.set("Fethching Levels from AREDL...");

    if (!storedLevels) storedLevels = await fetchLevels();
    let levels = structuredClone(storedLevels);
    if (!levels) {
        listCreationStatus.set("error");
        console.log("Failed to fetch levels.");
        return;
    }

    // -------------------------------------------->
    listCreationStatus.set("Filtering Levels...");

    if (!includeLegacy) { levels = levels.filter((level: any) => (!level.legacy)); }
    if (!includeDuo) { levels = levels.filter((level: any) => (!level.two_player)); }

    if (startRange === 0 && endRange === 0) {
        startRange = 1;
        endRange = levels.length + 1;
    }
    if (endRange > levels.length) { endRange = levels.length + 1; }
    levels = levels.filter((level: any) => (level.position >= startRange && level.position <= endRange));

    // -------------------------------------------->
    listCreationStatus.set("Creating List...");

    const rng = createRNG(seed);
    function rngInt(rng: () => number) {
        return (rng() * 0x100000000) >>> 0;
    }

    let selectedLevels: any[] = [];
    for (let i = 0; i < 100; i++) {
        let index = rngInt(rng) % levels.length;
        selectedLevels.push(levels[index]);
        levels.splice(index, 1);
    }

    let trimmedArray: Level[] = [];
    selectedLevels.forEach((level) => {
        trimmedArray.push({
            //id: level.id,
            name: level.name,
            position: level.position,
            level_id: level.level_id,
            completed_percentage: 0,
        });
    });

    // -------------------------------------------->
    listCreationStatus.set("Creating Save...");
    let saveFile: SaveFile = {
        seed: seed,
        date: new Date().toISOString(),
        startRange: startRange,
        endRange: endRange,
        current: 1,
        current_percentage: 1,
        levels: trimmedArray
    };
    startRun(saveFile);
}

async function fetchLevels() {
    try {
        const response = await fetch(levelsEndpoint);
        if (!response.ok) {
            throw new Error(`Response Status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error((error as Error).message);
    }
}