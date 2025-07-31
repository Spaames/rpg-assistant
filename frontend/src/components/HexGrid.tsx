'use client';

import { useState, useLayoutEffect, useRef } from "react";
import { hexPoints } from "@/utils/functions";

export default function HexGrid() {
    // Hex grid mechanism
    const containerRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState({ width: 800, height: 600 });
    // Update size using ResizeObserver (more modern than window resize)
    useLayoutEffect(() => {
        const update = () => {
            if (containerRef.current) {
                const { offsetWidth, offsetHeight } = containerRef.current;
                setSize({ width: offsetWidth, height: offsetHeight });
            }
        };
        update(); // initial size
        const observer = new ResizeObserver(update);
        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);
    const { width, height } = size;
    const baseCols = 14;
    const baseRows = 8;
    const hexSize = Math.min(width / baseCols, height / baseRows);
    const hexHeight = hexSize * Math.sqrt(3) / 2;
    const cols = Math.ceil(width / (hexSize * 0.75));
    const rows = Math.ceil(height / hexHeight);
    const viewBox = {
        width: cols * hexSize * 0.75 + hexSize * 0.25,
        height: rows * hexHeight + hexHeight,
    };



    return (
        <div
            ref={containerRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
        >
            <svg
                className="w-full h-full"
                viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
                preserveAspectRatio="none"
            >
                {Array.from({ length: rows }, (_, row) =>
                    Array.from({ length: cols }, (_, col) => {
                        const x = col * hexSize * 0.75 + hexSize * 0.5;
                        const y = row * hexHeight + (col % 2 === 0 ? hexHeight / 2 : hexHeight);
                        const num = row * cols + col + 1;

                        return (
                            <g key={`${row}-${col}`}>
                                <polygon
                                    points={hexPoints(x, y, hexSize * 0.5)}
                                    fill="rgba(255,255,255,0.05)"
                                    stroke="rgba(255,255,255,0.15)"
                                    strokeWidth="2"
                                />
                                <text
                                    x={x}
                                    y={y}
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    fontSize={hexSize * 0.15}
                                    fill="rgba(255,255,255,0.5)"
                                    className="select-none pointer-events-none"
                                >
                                    {num}
                                </text>
                            </g>
                        );
                    })
                )}
            </svg>
        </div>
    );
}
