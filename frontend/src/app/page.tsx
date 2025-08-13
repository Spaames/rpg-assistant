'use client'

import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import HexGrid from "@/components/HexGrid";

export default function Page() {
    const [background, setBackground] = useState<string | null>(null);
    const [socket, setSocket] = useState<Socket | null>(null);
	const [fightOn, setFightOn] = useState<boolean>(false);
    const [npc, setNpc] = useState<number | null>(null);

    useEffect(() => {
        const socket = io('ws://localhost:3001');

        socket.on('current_scene', (data: { scene: string }) => {
            setBackground(`/data/scenes/${data.scene}`);
            console.log('F: Scène mise à jour:', data.scene);
        });

        setSocket(socket);

        // Cleanup function should only disconnect
        return () => {
            socket.disconnect();
        };
    }, []);

	useEffect(() => {
        const timer = setTimeout(() => setFightOn(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="w-screen h-screen bg-black flex items-center justify-center overflow-hidden">
            <div
                className="aspect-video w-full h-full max-w-full max-h-full flex items-center justify-center bg-center bg-no-repeat bg-contain"
                style={
                    background
                        ? {
                            backgroundImage: `url(${background})`,
                        }
                        : {}
                }
            >
				{/* Hex grid overlay */}
                {fightOn && (
                    <div className="absolute inset-0 pointer-events-none z-20">
                        <HexGrid npc={npc}/>
                    </div>
                )}
            </div>
        </div>
    );
}
