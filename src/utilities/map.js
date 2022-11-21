export function map(value, start1, end1, start2, end2) {
    return start2 + ((end2 - start2) * (value - start1)) / (end1 - start1);
}
