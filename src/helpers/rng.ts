export function sfc32(a: number, b: number, c: number, d: number) {
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

export function getRand(seed: number) {
    let a = seed | 0;
    let b = (seed ^ 0xdeadbeef) >>> 0;
    let c = (seed ^ 0xcafebabe) >>> 0;
    let d = (seed ^ 0xfaceb00c) >>> 0;

    return sfc32(a, b, c, d);
}

export function getRandInt32() {
    return Math.floor(Math.random() * 4294967295)
}