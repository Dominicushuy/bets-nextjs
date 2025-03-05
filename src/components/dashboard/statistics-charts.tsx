"use client";

import { useMemo } from "react";
import { Card } from "../ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface StatisticsChartsProps {
  betsData: any[];
  userStatistics: any;
}

export default function StatisticsCharts({
  betsData,
  userStatistics,
}: StatisticsChartsProps) {
  // Prepare data for the Win/Loss chart
  const winLossData = useMemo(() => {
    if (!userStatistics) return [];

    const totalLost =
      userStatistics.total_games_played - (userStatistics.games_won || 0);

    return [
      { name: "Thắng", value: userStatistics.games_won || 0, color: "#10b981" },
      { name: "Thua", value: totalLost, color: "#ef4444" },
    ];
  }, [userStatistics]);

  // Prepare data for bets by day of week
  const betsByDayOfWeek = useMemo(() => {
    if (!betsData || betsData.length === 0) return [];

    const dayNames = [
      "Chủ nhật",
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
    ];
    const dayCounts = [0, 0, 0, 0, 0, 0, 0];

    betsData.forEach((bet) => {
      const date = new Date(bet.created_at);
      const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
      dayCounts[dayOfWeek]++;
    });

    return dayNames.map((day, index) => ({
      name: day,
      bets: dayCounts[index],
    }));
  }, [betsData]);

  // Get most frequently chosen numbers
  const popularNumbers = useMemo(() => {
    if (!betsData || betsData.length === 0) return [];

    const numberCounts: { [key: string]: number } = {};

    betsData.forEach((bet) => {
      const num = bet.selected_number;
      numberCounts[num] = (numberCounts[num] || 0) + 1;
    });

    // Convert to array and sort by frequency
    return Object.entries(numberCounts)
      .map(([number, count]) => ({ number, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 numbers
  }, [betsData]);

  if (!userStatistics || betsData.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8 text-gray-500">
          <p>Chưa có đủ dữ liệu để hiển thị thống kê</p>
        </div>
      </Card>
    );
  }

  const COLORS = ["#10b981", "#ef4444", "#f59e0b", "#3b82f6", "#8b5cf6"];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Win/Loss Chart */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Tỷ lệ thắng/thua</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={winLossData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(1)}%`
                    }
                  >
                    {winLossData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value} lượt`, "Số lượt"]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Bets by Day of Week */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">
              Lượt đặt theo ngày trong tuần
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={betsByDayOfWeek}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value} lượt`, "Số lượt đặt"]}
                  />
                  <Bar dataKey="bets" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>

      {/* Popular Numbers */}
      {popularNumbers.length > 0 && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">
              Số được chọn nhiều nhất
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={popularNumbers} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="number" type="category" />
                  <Tooltip
                    formatter={(value) => [`${value} lần`, "Số lần chọn"]}
                  />
                  <Bar dataKey="count" fill="#8b5cf6">
                    {popularNumbers.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
