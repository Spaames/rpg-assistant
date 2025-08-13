"use client"

import { useEffect, useRef, useState } from "react";

interface HexGridProps {
    npc?: number | null;
}

export default function HexGrid({ npc }: HexGridProps) {
    const SCALE = 0.9;

    const HEX_WIDTH = 136 * SCALE;        
    const HEX_HEIGHT = 156 * SCALE;       
    const VERTICAL_SPACING = 116 * SCALE; 
    const OFFSET = HEX_WIDTH / 2;         

    const [gridSize, setGridSize] = useState({ rows: 15, cols: 16 });
    const [characters] = useState({
        1: { hexId: 25, name: "Astrid", img: "/data/characters/astrid.png", hp: 25, maxHp: 100 },
        2: { hexId: 100, name: "Sorcier", img: "", hp: 80, maxHp: 80 }
    });

    const containerRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const updateGridSize = () => {
            if (containerRef.current) {
                const width = containerRef.current.offsetWidth;
                const height = containerRef.current.offsetHeight;
                const cols = Math.floor(width / HEX_WIDTH);
                const rows = Math.floor(height / HEX_HEIGHT);
                setGridSize({ rows: Math.max(7, rows), cols: Math.max(6, cols)});
            }
        };
        updateGridSize();
        window.addEventListener("resize", updateGridSize);
        return () => {
            window.removeEventListener("resize", updateGridSize);
        };
    }, [HEX_WIDTH, HEX_HEIGHT]);

    const generateHexagons = () => {
        const hexagons = [];
        let hexId = 1;
        for (let row = 0; row < gridSize.rows; row++) {
            for (let col = 0; col < gridSize.cols; col++) {
                const offsetX = (row % 2) * OFFSET;
                const x = col * HEX_WIDTH + offsetX;
                const y = row * VERTICAL_SPACING;
                hexagons.push({ id: hexId, x, y, row, col });
                hexId++;
            }
        }
        return hexagons;
    };

    const hexagons = generateHexagons();

    const getHexPosition = (hexId: number) => {
        return hexagons.find(hex => hex.id === hexId);
    };

    return (
        <div ref={containerRef} className="absolute inset-0 p-8">
            <svg 
                className="w-full h-full" 
                viewBox={`0 0 ${gridSize.cols * HEX_WIDTH + HEX_WIDTH} ${gridSize.rows * VERTICAL_SPACING + 60}`}
            >
                {hexagons.map((hex) => (
                    <g key={hex.id}>
                        <polygon
                            points={`${68 * SCALE},0 ${136 * SCALE},${39 * SCALE} ${136 * SCALE},${117 * SCALE} ${68 * SCALE},${156 * SCALE} 0,${117 * SCALE} 0,${39 * SCALE}`}
                            transform={`translate(${hex.x}, ${hex.y})`}
                            fill="rgba(255, 255, 255, 0.05)"
                            stroke="rgba(255, 255, 255, 0.2)"
                            strokeWidth={1 * SCALE}
                        />
                        <text
                            x={hex.x + OFFSET}
                            y={hex.y + (84 * SCALE)}
                            textAnchor="middle"
                            className="fill-white font-bold pointer-events-none select-none" 
                            style={{ fontSize: `${20 * SCALE}px` }}
                        >
                            {hex.id}
                        </text>
                    </g>
                ))}

                {Object.entries(characters).map(([charId, character]) => {
                    const hexPos = getHexPosition(character.hexId);
                    if (!hexPos) return null;

                    const centerX = hexPos.x + OFFSET;
                    const centerY = hexPos.y + (70 * SCALE);
                    const radius = 50 * SCALE;

                    return (
                        <g key={charId}>
                            <defs>
                                <clipPath id={`clip-${charId}`}>
                                    <circle
                                        cx={centerX}
                                        cy={centerY}
                                        r={radius}
                                    />
                                </clipPath>
                            </defs>

                            {character.img && (
                                <image
                                    href={character.img}
                                    x={centerX - radius}
                                    y={centerY - radius}
                                    width={radius * 2}
                                    height={radius * 2}
                                    clipPath={`url(#clip-${charId})`}
                                    preserveAspectRatio="xMidYMid slice"
                                />
                            )}

                            <circle
                                cx={centerX}      
                                cy={centerY}  
                                r={radius}                           
                                fill="none"
                                stroke="white"
                                strokeWidth={4 * SCALE}       
                            />

                            {/*
                            <text
                                x={centerX}
                                y={centerY + (radius + 18 * SCALE)}   
                                textAnchor="middle"
                                className="fill-white font-bold pointer-events-none"
                                style={{ fontSize: `${14 * SCALE}px` }} 
                            >
                                {character.name}
                            </text>
                            */}
                            
                            <g transform={`translate(${centerX - (35 * SCALE)}, ${centerY + (radius + 5 * SCALE)})`}>
                                <rect
                                    width={70 * SCALE}         
                                    height={10 * SCALE}      
                                    fill="rgba(0, 0, 0, 0.5)"
                                    rx={5 * SCALE}          
                                />
                                <rect
                                    width={(70 * SCALE) * (character.hp / character.maxHp)}
                                    height={10 * SCALE}
                                    fill={character.hp > character.maxHp * 0.5 ? "#00ff00" : character.hp > character.maxHp * 0.25 ? "#ffaa00" : "#ff0000"}
                                    rx={5 * SCALE}
                                />
                            </g>
                        </g>
                    );
                })}
            </svg>
        </div>
    )
}
