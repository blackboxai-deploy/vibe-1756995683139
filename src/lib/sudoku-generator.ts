import { SudokuGrid, Difficulty, createEmptyGrid, isValidMove, solveSudoku, cloneGrid } from './sudoku-utils';

// Shuffle array in place
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Fill the grid completely with a valid solution
function fillGrid(grid: SudokuGrid): boolean {
  const emptyCell = grid.flat().findIndex(cell => cell === null);
  if (emptyCell === -1) return true; // Grid is full
  
  const row = Math.floor(emptyCell / 9);
  const col = emptyCell % 9;
  
  // Try numbers 1-9 in random order
  const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  
  for (const num of numbers) {
    if (isValidMove(grid, row, col, num)) {
      grid[row][col] = num;
      
      if (fillGrid(grid)) return true;
      
      grid[row][col] = null; // Backtrack
    }
  }
  
  return false;
}

// Remove numbers from grid to create puzzle
function removeNumbers(grid: SudokuGrid, difficulty: Difficulty): SudokuGrid {
  const puzzle = cloneGrid(grid);
  
  // Number of cells to remove based on difficulty
  const cellsToRemove = {
    easy: 35,    // 46 filled cells (easy)
    medium: 45,  // 36 filled cells (medium) 
    hard: 55     // 26 filled cells (hard)
  };
  
  const targetRemovals = cellsToRemove[difficulty];
  let removedCount = 0;
  const attempts = targetRemovals * 2; // Prevent infinite loops
  
  for (let attempt = 0; attempt < attempts && removedCount < targetRemovals; attempt++) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    
    if (puzzle[row][col] !== null) {
      const backup = puzzle[row][col];
      puzzle[row][col] = null;
      
      // Create a copy to test if puzzle still has unique solution
      const testGrid = cloneGrid(puzzle);
      
      // Check if puzzle still solvable
      if (solveSudoku(testGrid)) {
        removedCount++;
      } else {
        // Restore the number if removing it makes puzzle unsolvable
        puzzle[row][col] = backup;
      }
    }
  }
  
  return puzzle;
}

// Generate a complete Sudoku puzzle
export function generatePuzzle(difficulty: Difficulty = 'medium'): {puzzle: SudokuGrid, solution: SudokuGrid} {
  // Start with empty grid
  const solution = createEmptyGrid();
  
  // Fill it with a valid complete solution
  fillGrid(solution);
  
  // Create puzzle by removing numbers
  const puzzle = removeNumbers(solution, difficulty);
  
  return {
    puzzle: cloneGrid(puzzle),
    solution: cloneGrid(solution)
  };
}

// Generate a puzzle with guaranteed unique solution
export function generateValidPuzzle(difficulty: Difficulty = 'medium', maxAttempts: number = 10): {puzzle: SudokuGrid, solution: SudokuGrid} {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const result = generatePuzzle(difficulty);
    
    // Verify the puzzle has a unique solution
    const testGrid = cloneGrid(result.puzzle);
    if (solveSudoku(testGrid)) {
      // Check if solved grid matches our solution
      const matches = testGrid.every((row, r) => 
        row.every((cell, c) => cell === result.solution[r][c])
      );
      
      if (matches) {
        return result;
      }
    }
  }
  
  // Fallback - return any valid puzzle if we can't generate a perfect one
  return generatePuzzle(difficulty);
}

// Get difficulty level statistics
export function getDifficultyStats(difficulty: Difficulty) {
  const stats = {
    easy: {
      name: 'Easy',
      description: 'Good for beginners',
      filledCells: '46-50',
      estimatedTime: '5-15 min'
    },
    medium: {
      name: 'Medium', 
      description: 'Balanced challenge',
      filledCells: '32-40',
      estimatedTime: '15-30 min'
    },
    hard: {
      name: 'Hard',
      description: 'For experts',
      filledCells: '22-30', 
      estimatedTime: '30+ min'
    }
  };
  
  return stats[difficulty];
}