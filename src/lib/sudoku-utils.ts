export type SudokuGrid = (number | null)[][];
export type Difficulty = 'easy' | 'medium' | 'hard';

// Create empty 9x9 grid
export function createEmptyGrid(): SudokuGrid {
  return Array(9).fill(null).map(() => Array(9).fill(null));
}

// Check if a number can be placed at the given position
export function isValidMove(grid: SudokuGrid, row: number, col: number, num: number): boolean {
  // Check row
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === num) return false;
  }
  
  // Check column
  for (let i = 0; i < 9; i++) {
    if (grid[i][col] === num) return false;
  }
  
  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  
  for (let i = boxRow; i < boxRow + 3; i++) {
    for (let j = boxCol; j < boxCol + 3; j++) {
      if (grid[i][j] === num) return false;
    }
  }
  
  return true;
}

// Get all conflicts for a given position and number
export function getConflicts(grid: SudokuGrid, row: number, col: number, num: number): Array<{row: number, col: number}> {
  const conflicts: Array<{row: number, col: number}> = [];
  
  // Check row conflicts
  for (let i = 0; i < 9; i++) {
    if (i !== col && grid[row][i] === num) {
      conflicts.push({row, col: i});
    }
  }
  
  // Check column conflicts
  for (let i = 0; i < 9; i++) {
    if (i !== row && grid[i][col] === num) {
      conflicts.push({row: i, col});
    }
  }
  
  // Check 3x3 box conflicts
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  
  for (let i = boxRow; i < boxRow + 3; i++) {
    for (let j = boxCol; j < boxCol + 3; j++) {
      if ((i !== row || j !== col) && grid[i][j] === num) {
        conflicts.push({row: i, col: j});
      }
    }
  }
  
  return conflicts;
}

// Check if the grid is complete and valid
export function isGridComplete(grid: SudokuGrid): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === null) return false;
      if (!isValidMove(grid.map((r, i) => r.map((c, j) => i === row && j === col ? null : c)), row, col, grid[row][col]!)) {
        return false;
      }
    }
  }
  return true;
}

// Find empty cell (returns null if grid is full)
export function findEmptyCell(grid: SudokuGrid): {row: number, col: number} | null {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === null) {
        return {row, col};
      }
    }
  }
  return null;
}

// Solve sudoku using backtracking algorithm
export function solveSudoku(grid: SudokuGrid): boolean {
  const emptyCell = findEmptyCell(grid);
  
  if (!emptyCell) return true; // Grid is complete
  
  const {row, col} = emptyCell;
  
  for (let num = 1; num <= 9; num++) {
    if (isValidMove(grid, row, col, num)) {
      grid[row][col] = num;
      
      if (solveSudoku(grid)) return true;
      
      grid[row][col] = null; // Backtrack
    }
  }
  
  return false;
}

// Create a deep copy of the grid
export function cloneGrid(grid: SudokuGrid): SudokuGrid {
  return grid.map(row => [...row]);
}

// Get a hint for the current grid
export function getHint(grid: SudokuGrid): {row: number, col: number, value: number} | null {
  const emptyCell = findEmptyCell(grid);
  if (!emptyCell) return null;
  
  const solvedGrid = cloneGrid(grid);
  if (solveSudoku(solvedGrid)) {
    const {row, col} = emptyCell;
    return {
      row,
      col,
      value: solvedGrid[row][col]!
    };
  }
  
  return null;
}

// Check if a cell has any conflicts
export function hasConflict(grid: SudokuGrid, row: number, col: number): boolean {
  const value = grid[row][col];
  if (value === null) return false;
  
  return getConflicts(grid, row, col, value).length > 0;
}

// Get all cells that have conflicts
export function getAllConflicts(grid: SudokuGrid): Array<{row: number, col: number}> {
  const conflicts: Array<{row: number, col: number}> = [];
  
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (hasConflict(grid, row, col)) {
        conflicts.push({row, col});
      }
    }
  }
  
  return conflicts;
}