let levelEndpoint = "https://aredl-roulette.vercel.app/api/gdbrowser/";
let aredlEndpoint = "https://api.aredl.net/v2"

export async function fetchLevel(id: number) {
    try {
        const response = await fetch(`${levelEndpoint}${id}`);
        if (!response.ok) {
            throw new Error(`Response Status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error((error as Error).message);
    }
}