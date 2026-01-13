export interface SaveFile {
    seed: number;
    date: string;
    startRange: number;
    endRange: number;
    current: number;
    current_percentage: number;
    levels: Level[];
}

export interface Level {
    name: string;
    position: number;
    level_id: number;
    completed_percentage: number;
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
    let s = structuredClone(save);
    let levelsTrimmed: any[] = [];
    s.levels.forEach((level: Level) => {
        levelsTrimmed.push([btoa(level.name), (level.position).toString(36), (level.level_id).toString(36), (level.completed_percentage).toString(36)]);
    });

    s.levels = levelsTrimmed;
    s.seed = (s.seed).toString(36);
    s.startRange = (s.startRange).toString(36);
    s.endRange = (s.endRange).toString(36);
    s.current = (s.current).toString(36);
    s.date = (Date.parse(s.date)).toString(36);

    let string = JSON.stringify(s);
    string = string.replaceAll('"],["', '+');
    string = string.replaceAll('","', '-');
    string = string.replace("seed", "!");
    string = string.replace("startRange", "@");
    string = string.replace("endRange", "#");
    string = string.replace("current", "$");
    string = string.replace("date", "%");
    string = string.replace("levels", "&");
    string = string.replace("current_percentage", "*")

    return string;
}

export function decodeSave(save: string) {
    let cleanedSave = save.replaceAll('+', '"],["');
    cleanedSave = cleanedSave.replaceAll('-', '","');
    cleanedSave = cleanedSave.replace("!", "seed");
    cleanedSave = cleanedSave.replace("@", "startRange");
    cleanedSave = cleanedSave.replace("#", "endRange");
    cleanedSave = cleanedSave.replace("$", "current");
    cleanedSave = cleanedSave.replace("%", "date");
    cleanedSave = cleanedSave.replace("&", "levels");
    cleanedSave = cleanedSave.replace("*", "current_percentage")

    let parsedSave: any = JSON.parse(cleanedSave);
    parsedSave.seed = parseInt(parsedSave.seed, 36);
    parsedSave.startRange = parseInt(parsedSave.startRange, 36);
    parsedSave.endRange = parseInt(parsedSave.endRange, 36);
    parsedSave.current = parseInt(parsedSave.current, 36);
    parsedSave.date = new Date(parseInt(parsedSave.date, 36)).toISOString();

    let levelsExpanded: any[] = [];
    parsedSave.levels.forEach((level: [string, string, string, string]) => {
        levelsExpanded.push({ name: atob(level[0]), position: parseInt(level[1], 36), level_id: parseInt(level[2], 36), completed_percentage: parseInt(level[3], 36) });
    });

    parsedSave.levels = levelsExpanded;
    return parsedSave;
}