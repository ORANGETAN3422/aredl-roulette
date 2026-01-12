import { currentSaveFile, listCreationStatus } from "./statusStore";
import { createRNG } from "./rng";

let levelsEndpoint = "https://aredl-roulette.vercel.app/api/aredl/levels";

export async function createNewRun(seed: number, startRange: number, endRange: number, includeLegacy: boolean, includeDuo: boolean) {
    listCreationStatus.set("Fethching Levels from AREDL...");

    let levels = await fetchLevels();
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

    // -------------------------------------------->
    listCreationStatus.set("Creating Save...");
    let saveFile: {
        seed: number;
        startRange: number;
        endRange: number;
        levels: any[]
    } = {
        seed: seed,
        startRange: startRange,
        endRange: endRange,
        levels: selectedLevels
    };
    currentSaveFile.set(saveFile);
    listCreationStatus.set("Finished Creating Run");
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