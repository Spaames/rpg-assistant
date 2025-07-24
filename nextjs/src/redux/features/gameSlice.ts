import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from "@/redux/store";

interface GameState {
    loading: boolean;
    error: string | null;
    gameData: any; // Replace 'any' with your actual game data type
}