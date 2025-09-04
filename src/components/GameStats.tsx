"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface GameStatsProps {
  isComplete: boolean;
  isPaused: boolean;
  onPauseToggle: () => void;
  hintsUsed: number;
  startTime: number;
  completionTime?: number;
}

export function GameStats({
  isComplete,
  isPaused,
  onPauseToggle,
  hintsUsed,
  startTime,
  completionTime
}: GameStatsProps) {
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    if (isComplete || isPaused) return;

    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [isComplete, isPaused]);

  const formatTime = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
    }
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const getDisplayTime = (): string => {
    if (isComplete && completionTime) {
      return formatTime(completionTime - startTime);
    }
    if (isPaused) {
      return formatTime(currentTime - startTime);
    }
    return formatTime(currentTime - startTime);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow border">
      {/* Timer Display */}
      <div className="text-center mb-4">
        <div className="text-3xl font-mono font-bold text-gray-800">
          {getDisplayTime()}
        </div>
        <div className="text-sm text-gray-500">
          {isComplete ? 'Final Time' : isPaused ? 'Paused' : 'Elapsed Time'}
        </div>
      </div>

      {/* Timer Controls */}
      {!isComplete && (
        <div className="flex justify-center mb-4">
          <Button
            onClick={onPauseToggle}
            variant="outline"
            size="sm"
            className="px-6"
          >
            {isPaused ? '▶ Resume' : '⏸ Pause'}
          </Button>
        </div>
      )}

      {/* Game Statistics */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Hints Used:</span>
          <span className="font-semibold">{hintsUsed}</span>
        </div>
        
        {isComplete && (
          <>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-semibold text-green-600">Complete ✓</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Performance:</span>
              <span className="font-semibold">
                {hintsUsed === 0 ? 'Perfect!' : hintsUsed <= 3 ? 'Great!' : 'Good!'}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Achievement Badges */}
      {isComplete && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-600 mb-2">Achievements:</div>
          <div className="flex flex-wrap gap-1">
            {hintsUsed === 0 && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                🏆 No Hints
              </span>
            )}
            {(completionTime && (completionTime - startTime) < 600000) && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                ⚡ Under 10 min
              </span>
            )}
            {(completionTime && (completionTime - startTime) < 300000) && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                🚀 Speed Run
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}