"use client";

import { cn } from "@/lib/utils";

interface SudokuCellProps {
  value: number | null;
  isSelected: boolean;
  isGiven: boolean;
  hasConflict: boolean;
  row: number;
  col: number;
  onSelect: (row: number, col: number) => void;
  onChange: (row: number, col: number, value: number | null) => void;
}

export function SudokuCell({
  value,
  isSelected,
  isGiven,
  hasConflict,
  row,
  col,
  onSelect,
  onChange
}: SudokuCellProps) {
  const handleClick = () => {
    onSelect(row, col);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isGiven) return; // Can't edit given numbers
    
    const key = e.key;
    
    if (key >= '1' && key <= '9') {
      const num = parseInt(key);
      onChange(row, col, num);
    } else if (key === 'Backspace' || key === 'Delete' || key === '0') {
      onChange(row, col, null);
    }
  };

  const isRightBorder = col === 2 || col === 5;
  const isBottomBorder = row === 2 || row === 5;

  return (
    <div
      className={cn(
        "w-12 h-12 border border-gray-300 flex items-center justify-center cursor-pointer select-none transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500",
        {
          // 3x3 box borders
          "border-r-2 border-r-gray-700": isRightBorder,
          "border-b-2 border-b-gray-700": isBottomBorder,
          // Cell states
          "bg-blue-100 ring-2 ring-blue-400": isSelected,
          "bg-red-100 text-red-700": hasConflict,
          "bg-gray-100 font-bold text-gray-900": isGiven,
          "bg-white text-gray-700": !isGiven && !hasConflict && !isSelected,
          "hover:bg-gray-50": !isSelected && !hasConflict,
          // Text styling
          "font-semibold": value !== null,
          "text-lg": true
        }
      )}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="gridcell"
      aria-label={`Cell ${row + 1}, ${col + 1}${value ? `, value ${value}` : ', empty'}${isGiven ? ', given' : ''}${hasConflict ? ', has conflict' : ''}`}
    >
      {value || ''}
    </div>
  );
}