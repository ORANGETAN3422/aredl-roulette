let aredlEndpoint = "https://aredl-roulette.vercel.app/api/aredl/level/"
let levelsEndpoint = "https://aredl-roulette.vercel.app/api/aredl/levels";

export async function fetchLevel(id: number) {
    try {
        const response = await fetch(`${aredlEndpoint}${id}`);
        if (!response.ok) {
            throw new Error(`Response Status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error((error as Error).message);
    }
}

export async function fetchLevels() {
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