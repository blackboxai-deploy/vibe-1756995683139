"use client";

import { Button } from "@/components/ui/button";
import { Difficulty } from "@/lib/sudoku-utils";

interface GameControlsProps {
  onNewGame: (difficulty: Difficulty) => void;
  onSolve: () => void;
  onReset: () => void;
  onHint: () => void;
  difficulty: Difficulty;
  isComplete: boolean;
  hintsUsed: number;
}

export function GameControls({
  onNewGame,
  onSolve,
  onReset,
  onHint,
  difficulty,
  isComplete,
  hintsUsed
}: GameControlsProps) {
  return (
    <div className="flex flex-col space-y-4">
      {/* New Game Buttons */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-700">Start New Game</h3>
        <div className="flex flex-col space-y-2">
          <Button 
            onClick={() => onNewGame('easy')}
            variant={difficulty === 'easy' ? 'default' : 'outline'}
            className="w-full"
          >
            Easy
          </Button>
          <Button 
            onClick={() => onNewGame('medium')}
            variant={difficulty === 'medium' ? 'default' : 'outline'}
            className="w-full"
          >
            Medium  
          </Button>
          <Button 
            onClick={() => onNewGame('hard')}
            variant={difficulty === 'hard' ? 'default' : 'outline'}
            className="w-full"
          >
            Hard
          </Button>
        </div>
      </div>

      {/* Game Actions */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-700">Game Actions</h3>
        <div className="flex flex-col space-y-2">
          <Button 
            onClick={onHint}
            variant="secondary"
            className="w-full"
            disabled={isComplete}
          >
            Hint ({hintsUsed} used)
          </Button>
          <Button 
            onClick={onReset}
            variant="outline" 
            className="w-full"
          >
            Reset
          </Button>
          <Button 
            onClick={onSolve}
            variant="destructive"
            className="w-full"
            disabled={isComplete}
          >
            Solve
          </Button>
        </div>
      </div>

      {/* Game Info */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-700">Difficulty</h3>
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="font-medium capitalize">{difficulty}</p>
          <p className="text-sm text-gray-600">
            {difficulty === 'easy' && '46-50 filled cells'}
            {difficulty === 'medium' && '32-40 filled cells'}  
            {difficulty === 'hard' && '22-30 filled cells'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {difficulty === 'easy' && 'Est. 5-15 minutes'}
            {difficulty === 'medium' && 'Est. 15-30 minutes'}
            {difficulty === 'hard' && 'Est. 30+ minutes'}
          </p>
        </div>
      </div>

      {isComplete && (
        <div className="p-4 bg-green-100 border border-green-300 rounded-lg">
          <h3 className="font-bold text-green-800">🎉 Congratulations!</h3>
          <p className="text-green-700 text-sm">Puzzle completed successfully!</p>
        </div>
      )}
    </div>
  );
}