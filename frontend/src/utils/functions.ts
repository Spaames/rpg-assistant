// Helper to get hexagon points
export function hexPoints(cx: number, cy: number, r: number) {
    return Array.from({ length: 6 })
        .map((_, i) => {
            const angle = Math.PI / 3 * i;
            const x = cx + r * Math.cos(angle);
            const y = cy + r * Math.sin(angle);
            return `${x},${y}`;
        })
        .join(' ');
}

// Function to get hexagon position based on hex number
export function getHexPosition(hexNumber: number, cols: number, hexSize: number, hexHeight: number) {
    const col = (hexNumber - 1) % cols;
    const row = Math.floor((hexNumber - 1) / cols);
    const x = col * hexSize * 0.75 + hexSize * 0.5;
    const y = row * hexHeight + (col % 2 === 0 ? hexHeight / 2 : hexHeight);
    return { x, y };
}