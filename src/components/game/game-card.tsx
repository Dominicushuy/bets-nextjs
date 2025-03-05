"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GameRound } from "@/types/database";
import { Clock, Users, Award, CheckCircle, AlertCircle } from "lucide-react";

interface GameCardProps {
  game: GameRound;
  compact?: boolean;
}

export default function GameCard({ game, compact = false }: GameCardProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [totalBets, setTotalBets] = useState<number>(game.total_bets || 0);
  const [gameStatus, setGameStatus] = useState<string>(game.status);

  // Tính toán thời gian còn lại
  useEffect(() => {
    if (game.status !== "active") return;

    const calculateTimeLeft = () => {
      // Thời gian kết thúc (ví dụ: 1 giờ sau khi bắt đầu)
      const startTime = new Date(game.start_time).getTime();
      const endTime = game.end_time
        ? new Date(game.end_time).getTime()
        : startTime + 60 * 60 * 1000; // Mặc định 1 giờ

      const now = new Date().getTime();
      const difference = endTime - now;

      if (difference <= 0) {
        setTimeLeft("Đã kết thúc");
        setGameStatus("completed");
        return;
      }

      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    setTimeLeft(calculateTimeLeft() || "");

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      if (newTimeLeft) {
        setTimeLeft(newTimeLeft);
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [game]);

  // Setup real-time subscription cho bets count
  // useEffect(() => {
  //   const { data: subscription } = supabase
  //     .channel(`game_${game.id}_bets`)
  //     .on(
  //       "postgres_changes",
  //       {
  //         event: "INSERT",
  //         schema: "public",
  //         table: "bets",
  //         filter: `game_round_id=eq.${game.id}`,
  //       },
  //       (payload) => {
  //         setTotalBets((prev) => prev + 1);
  //       }
  //     )
  //     .subscribe();

  //   return () => {
  //     subscription.unsubscribe();
  //   };
  // }, [game.id]);

  const getStatusBadge = () => {
    switch (gameStatus) {
      case "active":
        return (
          <Badge variant="success" className="flex items-center">
            <Clock className="mr-1 h-3 w-3" />
            Đang diễn ra
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="secondary" className="flex items-center">
            <CheckCircle className="mr-1 h-3 w-3" />
            Đã kết thúc
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="warning" className="flex items-center">
            <Clock className="mr-1 h-3 w-3" />
            Sắp diễn ra
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="flex items-center">
            <AlertCircle className="mr-1 h-3 w-3" />
            {gameStatus}
          </Badge>
        );
    }
  };

  // Format created_by là 10 ký tự đầu của ID nếu không có creator.phone
  const creatorPhone =
    game.creator?.phone || game.created_by.substring(0, 10) + "...";

  if (compact) {
    return (
      <Card className="h-full hover:shadow-md transition-shadow">
        <div className="p-4 flex flex-col h-full">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium">Lượt #{game.id.substring(0, 8)}</h3>
              <p className="text-sm text-gray-500">
                {new Date(game.start_time).toLocaleString("vi-VN")}
              </p>
            </div>
            {getStatusBadge()}
          </div>

          <div className="flex flex-col justify-between flex-grow">
            <div className="text-sm mt-2">
              <div className="flex items-center text-gray-600">
                <Users className="h-4 w-4 mr-1" />
                <span>{totalBets} lượt đặt</span>
              </div>

              {gameStatus === "active" && timeLeft && (
                <div className="mt-1 font-medium text-primary-600">
                  Còn lại: {timeLeft}
                </div>
              )}

              {gameStatus === "completed" && game.winning_number && (
                <div className="mt-1 font-medium text-green-600 flex items-center">
                  <Award className="h-4 w-4 mr-1" />
                  Số trúng: {game.winning_number}
                </div>
              )}
            </div>

            <Link href={`/games/${game.id}`} className="mt-4">
              <Button
                variant={gameStatus === "active" ? "primary" : "outline"}
                size="sm"
                className="w-full"
              >
                {gameStatus === "active" ? "Đặt cược" : "Xem chi tiết"}
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold">
              Lượt chơi #{game.id.substring(0, 8)}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Tạo bởi: {creatorPhone}
            </p>
          </div>
          {getStatusBadge()}
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm text-gray-600">Bắt đầu:</p>
            <p className="font-medium">
              {new Date(game.start_time).toLocaleString("vi-VN")}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Kết thúc:</p>
            <p className="font-medium">
              {game.end_time
                ? new Date(game.end_time).toLocaleString("vi-VN")
                : "Chưa kết thúc"}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center text-gray-600 mb-2">
            <Users className="h-5 w-5 mr-2" />
            <span>{totalBets} lượt đặt cược</span>
          </div>

          {gameStatus === "active" && timeLeft && (
            <div className="bg-blue-50 text-blue-700 p-2 rounded-md flex items-center justify-center mt-2 font-medium">
              <Clock className="h-5 w-5 mr-2" />
              Thời gian còn lại: {timeLeft}
            </div>
          )}

          {gameStatus === "completed" && game.winning_number && (
            <div className="bg-green-50 text-green-700 p-2 rounded-md flex items-center justify-center mt-2 font-medium">
              <Award className="h-5 w-5 mr-2" />
              Số trúng thưởng: {game.winning_number}
            </div>
          )}
        </div>

        <div className="mt-6">
          <Link href={`/games/${game.id}`}>
            <Button
              variant={gameStatus === "active" ? "primary" : "outline"}
              className="w-full"
            >
              {gameStatus === "active" ? "Đặt cược ngay" : "Xem chi tiết"}
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
