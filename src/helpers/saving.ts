export function encodeSave(save: any) {
    let s = save;
    let levelsTrimmed: any[] = [];
    s.levels.forEach((level: { name: any; positions: any; level_id: any; }) => {
        levelsTrimmed.push([btoa(level.name), (level.positions).toString(36), (level.level_id).toString(36)]);
    });

    s.levels = levelsTrimmed;
    s.seed = (s.seed).toString(36);
    s.startRange = (s.startRange).toString(36);
    s.endRange = (s.endRange).toString(36);
    s.current = (s.current).toString(36);
    s.date = (Date.parse(s.date)).toString(36);

    console.log(JSON.stringify(s));

    return JSON.stringify(s);
}

export function decodeSave(save: string) {
    let parsedSave: any = JSON.parse(save);

    parsedSave.seed = parseInt(parsedSave.seed, 36);
    parsedSave.startRange = parseInt(parsedSave.startRange, 36);
    parsedSave.endRange = parseInt(parsedSave.endRange, 36);
    parsedSave.current = parseInt(parsedSave.current, 36);
    parsedSave.date = new Date(parseInt(parsedSave.date, 36)).toISOString();

    console.log(parsedSave.levels);
}