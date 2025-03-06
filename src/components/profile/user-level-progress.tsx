// src/components/profile/user-level-progress.tsx
"use client";

import { useLevelProgress } from "@/hooks/profile-hooks";
import { Badge } from "@/components/ui/badge";
import { Award, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui/card";

interface UserLevelProgressProps {
  userId: string;
  className?: string;
  compact?: boolean;
}

export default function UserLevelProgress({
  userId,
  className = "",
  compact = false,
}: UserLevelProgressProps) {
  const { data: levelData, isLoading, error } = useLevelProgress(userId);

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-2 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  if (error || !levelData) {
    return (
      <div className={`text-sm text-red-500 ${className}`}>
        Không thể tải thông tin cấp độ
      </div>
    );
  }

  if (compact) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Badge variant="primary" className="flex items-center space-x-1">
          <Award className="h-3 w-3" />
          <span>Level {levelData.currentLevel}</span>
        </Badge>
        {!levelData.isMaxLevel && (
          <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full"
              style={{ width: `${levelData.progress}%` }}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2">
          <Award className="h-5 w-5 text-primary-500" />
          <h3 className="font-semibold">Cấp độ hiện tại</h3>
        </div>
        <Badge variant="primary">Level {levelData.currentLevel}</Badge>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600">{levelData.currentLevelName}</p>
      </div>

      {!levelData.isMaxLevel ? (
        <>
          <div className="mb-1 flex justify-between text-xs text-gray-600">
            <span>{levelData.currentXP} XP</span>
            <span>{levelData.nextLevelXP} XP</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-primary-500 rounded-full"
              style={{ width: `${levelData.progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-sm">
            <span>
              Còn{" "}
              <span className="font-semibold">{levelData.remainingXP} XP</span>{" "}
              để lên cấp tiếp theo
            </span>
            <div className="flex items-center text-primary-600">
              <ChevronUp className="h-4 w-4" />
              <span className="font-medium">{levelData.nextLevelName}</span>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-2">
          <Badge variant="success">Cấp độ tối đa</Badge>
          <p className="text-sm text-gray-600 mt-2">
            Bạn đã đạt cấp độ cao nhất!
          </p>
        </div>
      )}
    </Card>
  );
}
