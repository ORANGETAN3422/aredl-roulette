export function sfc32(a: number, b: number, c: number, d: number) {
    return function () {
        a |= 0;
        b |= 0;
        c |= 0;
        d |= 0;
        let t = (((a + b) | 0) + d) | 0;
        d = (d + 1) | 0;
        a = b ^ (b >>> 9);
        b = (c + (c << 3)) | 0;
        c = (c << 21) | (c >>> 11);
        c = (c + t) | 0;
        return (t >>> 0) / 4294967296;
    }
}

export function xmur3(str: string) {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
        h = (h << 13) | (h >>> 19);
    }
    return function () {
        h = Math.imul(h ^ (h >>> 16), 2246822507);
        h = Math.imul(h ^ (h >>> 13), 3266489909);
        return (h ^= h >>> 16) >>> 0;
    };
}

export function createRNG(seed: number) {
    const seed2 = xmur3(seed.toString());

    return sfc32(seed2(), seed2(), seed2(), seed2());
}

export function biasedRandom(rng: () => number, length: number, slope: number, t: number) {
    const dir = slope <= 0
        ? 1 - 2 * t      // 1 = low to high
        : 2 * t - 1;     //-1 = high to low
    const biasStrength = Math.abs(slope) * Math.abs(dir);

    const exponent = dir >= 0
        ? 1 + biasStrength * 4
        : 1 / (1 + biasStrength * 4);

    const r = rng();
    const biased = Math.pow(r, exponent);
    return Math.floor(biased * length);
}

export function getRandInt32() {
    return Math.floor(Math.random() * 4294967295)
}