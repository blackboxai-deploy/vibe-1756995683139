"use client";

import { SudokuGrid as GridType, getAllConflicts } from "@/lib/sudoku-utils";
import { SudokuCell } from "./SudokuCell";

interface SudokuGridProps {
  grid: GridType;
  givenCells: boolean[][];
  selectedCell: {row: number, col: number} | null;
  onCellSelect: (row: number, col: number) => void;
  onCellChange: (row: number, col: number, value: number | null) => void;
}

export function SudokuGrid({
  grid,
  givenCells,
  selectedCell,
  onCellSelect,
  onCellChange
}: SudokuGridProps) {
  const conflicts = getAllConflicts(grid);
  const conflictSet = new Set(conflicts.map(c => `${c.row}-${c.col}`));

  return (
    <div className="inline-block p-4 bg-white border-2 border-gray-800 rounded-lg shadow-lg">
      <div 
        className="grid grid-cols-9 gap-0"
        role="grid"
        aria-label="Sudoku puzzle grid"
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
            const isGiven = givenCells[rowIndex][colIndex];
            const hasConflict = conflictSet.has(`${rowIndex}-${colIndex}`);
            
            return (
              <SudokuCell
                key={`${rowIndex}-${colIndex}`}
                value={cell}
                isSelected={isSelected}
                isGiven={isGiven}
                hasConflict={hasConflict}
                row={rowIndex}
                col={colIndex}
                onSelect={onCellSelect}
                onChange={onCellChange}
              />
            );
          })
        )}
      </div>
    </div>
  );
}