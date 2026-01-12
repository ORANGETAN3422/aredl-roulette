export interface SaveFile {
    seed: number;
    date: string;
    startRange: number;
    endRange: number;
    current: number;
    levels: Level[];
}

export interface Level {
    name: string;
    position: number;
    level_id: number;
}

export function StartRun(save: SaveFile) {

}

export function downloadSave(save: string) {
    const blob = new Blob([save], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "aredl-roulette-save.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export function encodeSave(save: any) {
    let s = save;
    let levelsTrimmed: any[] = [];
    s.levels.forEach((level: Level) => {
        levelsTrimmed.push([btoa(level.name), (level.position).toString(36), (level.level_id).toString(36)]);
    });

    s.levels = levelsTrimmed;
    s.seed = (s.seed).toString(36);
    s.startRange = (s.startRange).toString(36);
    s.endRange = (s.endRange).toString(36);
    s.current = (s.current).toString(36);
    s.date = (Date.parse(s.date)).toString(36);

    let string = JSON.stringify(s);
    string = string.replaceAll('"],["', "+");
    string = string.replaceAll('","', "^");
    string = string.replace("seed", "s-");
    string = string.replace("startRange", "sr-");
    string = string.replace("endRange", "er-");
    string = string.replace("current", "c-");
    string = string.replace("date", "d-");
    string = string.replace("levels", "l-");

    return string;
}

export function decodeSave(save: string) {
    let cleanedSave = save.replaceAll('+', '"],["');
    cleanedSave = cleanedSave.replaceAll('^', '","');
    cleanedSave = cleanedSave.replace("s-", "seed");
    cleanedSave = cleanedSave.replace("sr-", "startRange");
    cleanedSave = cleanedSave.replace("er-", "endRange");
    cleanedSave = cleanedSave.replace("c-", "current");
    cleanedSave = cleanedSave.replace("d-", "date");
    cleanedSave = cleanedSave.replace("l-", "levels");

    let parsedSave: any = JSON.parse(cleanedSave);
    parsedSave.seed = parseInt(parsedSave.seed, 36);
    parsedSave.startRange = parseInt(parsedSave.startRange, 36);
    parsedSave.endRange = parseInt(parsedSave.endRange, 36);
    parsedSave.current = parseInt(parsedSave.current, 36);
    parsedSave.date = new Date(parseInt(parsedSave.date, 36)).toISOString();

    let levelsExpanded: any[] = [];
    parsedSave.levels.forEach((level: [string, string, string]) => {
        levelsExpanded.push({ name: atob(level[0]), position: parseInt(level[1], 36), level_id: parseInt(level[2], 36) });
    });

    parsedSave.levels = levelsExpanded;
    return parsedSave;
}