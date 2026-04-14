import { listCreationStatus } from "./statusStore";
import { fetchLevels } from "./api";
import { createRNG, biasedRandom } from "./rng";
import {
  type SaveFile,
  type Level,
  type ExtraDetails,
  type GenerationDetails,
} from "./saving";
import { levels, resetRun, startRun } from "./progress";
let storedLevels: any;

export const specialSeeds = ["heliopolis"];

export function isSpecialSeed(seed: number | string) {
  return specialSeeds.includes(seed.toString().toLowerCase());
}

export async function createNewRun(
  seed: number | string,
  startRange: number,
  endRange: number,
  includeLegacy: boolean,
  includeDuo: boolean,
  extra: ExtraDetails,
  generation: GenerationDetails,
) {
  let levels: Level[] | null = [];
  if (isSpecialSeed(seed)) {
    levels = executeSpecialSeed(seed.toString());
  } else {
    listCreationStatus.set("Fetching Levels from AREDL...");

    if (!storedLevels) storedLevels = await fetchLevels();
    levels = structuredClone(storedLevels);
    if (!levels) {
      listCreationStatus.set("error");
      console.log("Failed to fetch levels.");
      return;
    }

    // -------------------------------------------->
    listCreationStatus.set("Filtering Levels...");

    if (!includeLegacy) {
      levels = levels.filter((level: any) => !level.legacy);
    }
    if (!includeDuo) {
      levels = levels.filter((level: any) => !level.two_player);
    }

    levels = levels.filter((level: any) => {
      const hasIncluded = level.tags.some((tag: string) =>
        extra.includedTags.includes(tag),
      );
      const hasBlocked = level.tags.some((tag: string) =>
        extra.blockedTags.includes(tag),
      );

      if (hasIncluded && extra.prioritiseIncluded) return true;
      if (hasBlocked) return false;
      return true;
    });

    levels = levels.filter(
      (level: any) => level.edel_enjoyment > extra.minimumEnjoyment,
    );
    levels = levels.filter(
      (level: any) => level.edel_enjoyment < extra.maximumEnjoyment,
    );

    if (startRange === 0 && endRange === 0) {
      startRange = 1;
      endRange = levels.length + 1;
    }
    if (endRange > levels.length) {
      endRange = levels.length + 1;
    }
    levels = levels.filter(
      (level: any) =>
        level.position >= startRange && level.position <= endRange,
    );

    if (levels.length < 100) {
      alert(
        "Not enough levels to complete a full roulette. Please adjust your starting settings and try again.",
      );
      resetRun();
      return;
    }

    // -------------------------------------------->
    listCreationStatus.set("Creating List...");

    const rng = createRNG(seed as number);
    function rngInt(rng: () => number) {
      return (rng() * 0x100000000) >>> 0;
    }

    let currentMainLists = 0;
    let currentExtendedLists = 0;

    let selectedLevels: any[] = [];
    for (let i = 0; i < 100; i++) {
      let pool = levels.filter((level: any) => {
        if (isMain(level))
          return (
            currentMainLists < extra.mainListCap && i < extra.mainListBlock
          );
        if (isExtended(level))
          return (
            currentExtendedLists < extra.extendedListCap &&
            i < extra.extendedListBlock
          );
        return true;
      });

      if (pool.length === 0) {
        alert(
          "Not enough levels to complete a full roulette. Please adjust your starting settings and try again.",
        );
        resetRun();
        return;
      }

      const t = i / 99;
      let index = biasedRandom(rng, pool.length, generation.slope, t);
      let chosen = pool[index];

      if (isMain(chosen)) currentMainLists++;
      else if (isExtended(chosen)) currentExtendedLists++;

      selectedLevels.push(chosen);
      levels.splice(levels.indexOf(chosen), 1);
    }

    let trimmedArray: Level[] = [];
    selectedLevels.forEach((level) => {
      trimmedArray.push({
        name: level.name,
        position: level.position,
        level_id: level.level_id,
        completed_percentage: 0,
      });
    });

    levels = trimmedArray;
  }

  // -------------------------------------------->
  listCreationStatus.set("Creating Save...");
  let saveFile: SaveFile = {
    seed: seed,
    date: new Date().toISOString(),
    startRange: startRange,
    endRange: endRange,
    current: 1,
    current_percentage: 1,
    extra: extra,
    levels: levels || null,
  };
  startRun(saveFile);
}

function isMain(level: any) {
  return level.position >= 1 && level.position <= 75;
}

function isExtended(level: any) {
  return level.position > 75 && level.position <= 150;
}

function executeSpecialSeed(seed: string) {
  switch (seed.toLowerCase()) {
    case "heliopolis":
      return executeHeliopolis();
    default:
      return null;
  }
}

function executeHeliopolis() {
  let levels: Level[] = [];

  for (let i = 1; i <= 100; i++) {
    levels.push({
      name: "Heliopolis",
      position: i,
      level_id: 136530685,
      completed_percentage: 0,
    });
  }
  return levels;
}
