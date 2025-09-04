"use client";

import { useState, useEffect, useCallback } from "react";
import { SudokuGrid } from "./SudokuGrid";
import { GameControls } from "./GameControls";
import { GameStats } from "./GameStats";
import { 
  SudokuGrid as GridType, 
  Difficulty, 
  isGridComplete,
  getHint,
  cloneGrid
} from "@/lib/sudoku-utils";
import { generateValidPuzzle } from "@/lib/sudoku-generator";

interface GameState {
  puzzle: GridType;
  solution: GridType;
  currentGrid: GridType;
  givenCells: boolean[][];
  selectedCell: {row: number, col: number} | null;
  difficulty: Difficulty;
  isComplete: boolean;
  isPaused: boolean;
  hintsUsed: number;
  startTime: number;
  completionTime?: number;
}

export function SudokuGame() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const {puzzle, solution} = generateValidPuzzle('medium');
    const givenCells = puzzle.map(row => row.map(cell => cell !== null));
    
    return {
      puzzle: cloneGrid(puzzle),
      solution: cloneGrid(solution),
      currentGrid: cloneGrid(puzzle),
      givenCells,
      selectedCell: null,
      difficulty: 'medium',
      isComplete: false,
      isPaused: false,
      hintsUsed: 0,
      startTime: Date.now()
    };
  });

  // Check for completion whenever grid changes
  useEffect(() => {
    if (!gameState.isComplete && isGridComplete(gameState.currentGrid)) {
      setGameState(prev => ({
        ...prev,
        isComplete: true,
        completionTime: Date.now()
      }));
    }
  }, [gameState.currentGrid, gameState.isComplete]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameState.selectedCell || gameState.isPaused) return;

      const {row, col} = gameState.selectedCell;
      let newRow = row;
      let newCol = col;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          newRow = Math.max(0, row - 1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          newRow = Math.min(8, row + 1);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          newCol = Math.max(0, col - 1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          newCol = Math.min(8, col + 1);
          break;
        default:
          return;
      }

      setGameState(prev => ({
        ...prev,
        selectedCell: {row: newRow, col: newCol}
      }));
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.selectedCell, gameState.isPaused]);

  const startNewGame = useCallback((difficulty: Difficulty) => {
    const {puzzle, solution} = generateValidPuzzle(difficulty);
    const givenCells = puzzle.map(row => row.map(cell => cell !== null));
    
    setGameState({
      puzzle: cloneGrid(puzzle),
      solution: cloneGrid(solution),
      currentGrid: cloneGrid(puzzle),
      givenCells,
      selectedCell: null,
      difficulty,
      isComplete: false,
      isPaused: false,
      hintsUsed: 0,
      startTime: Date.now()
    });
  }, []);

  const handleCellSelect = useCallback((row: number, col: number) => {
    if (gameState.isPaused || gameState.isComplete) return;
    
    setGameState(prev => ({
      ...prev,
      selectedCell: {row, col}
    }));
  }, [gameState.isPaused, gameState.isComplete]);

  const handleCellChange = useCallback((row: number, col: number, value: number | null) => {
    if (gameState.givenCells[row][col] || gameState.isPaused || gameState.isComplete) return;

    setGameState(prev => {
      const newGrid = cloneGrid(prev.currentGrid);
      newGrid[row][col] = value;
      
      return {
        ...prev,
        currentGrid: newGrid
      };
    });
  }, [gameState.givenCells, gameState.isPaused, gameState.isComplete]);

  const handleSolve = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      currentGrid: cloneGrid(prev.solution),
      isComplete: true,
      completionTime: Date.now()
    }));
  }, []);

  const handleReset = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      currentGrid: cloneGrid(prev.puzzle),
      selectedCell: null,
      isComplete: false,
      completionTime: undefined,
      startTime: Date.now(),
      hintsUsed: 0
    }));
  }, []);

  const handleHint = useCallback(() => {
    const hint = getHint(gameState.currentGrid);
    if (!hint) return;

    setGameState(prev => {
      const newGrid = cloneGrid(prev.currentGrid);
      newGrid[hint.row][hint.col] = hint.value;
      
      return {
        ...prev,
        currentGrid: newGrid,
        hintsUsed: prev.hintsUsed + 1,
        selectedCell: {row: hint.row, col: hint.col}
      };
    });
  }, [gameState.currentGrid]);

  const handlePauseToggle = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPaused: !prev.isPaused
    }));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Sudoku</h1>
          <p className="text-gray-600">Fill the 9×9 grid with digits so each row, column, and 3×3 box contains all digits 1-9</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Game Grid */}
          <div className="lg:col-span-2 flex justify-center">
            <div className="relative">
              {gameState.isPaused && (
                <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl mb-2">⏸</div>
                    <div className="font-semibold">Game Paused</div>
                    <div className="text-sm text-gray-600">Click Resume to continue</div>
                  </div>
                </div>
              )}
              
              <SudokuGrid
                grid={gameState.currentGrid}
                givenCells={gameState.givenCells}
                selectedCell={gameState.selectedCell}
                onCellSelect={handleCellSelect}
                onCellChange={handleCellChange}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Game Stats */}
            <GameStats
              isComplete={gameState.isComplete}
              isPaused={gameState.isPaused}
              onPauseToggle={handlePauseToggle}
              hintsUsed={gameState.hintsUsed}
              startTime={gameState.startTime}
              completionTime={gameState.completionTime}
            />

            {/* Game Controls */}
            <GameControls
              onNewGame={startNewGame}
              onSolve={handleSolve}
              onReset={handleReset}
              onHint={handleHint}
              difficulty={gameState.difficulty}
              isComplete={gameState.isComplete}
              hintsUsed={gameState.hintsUsed}
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Use arrow keys to navigate • Type 1-9 to fill cells • Press Backspace to clear</p>
        </div>
      </div>
    </div>
  );
}