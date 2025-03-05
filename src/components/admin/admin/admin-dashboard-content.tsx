"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/ui/loading";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  UserIcon,
  ActivityIcon,
  DollarSignIcon,
  PercentIcon,
  TrendingUpIcon,
  BoxIcon,
  TrendingDownIcon,
  RefreshCwIcon,
  CalendarIcon,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

// Custom hook to fetch dashboard data
const useDashboardData = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/dashboard-summary");
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }
      const result = await response.json();
      setData(result.data);
    } catch (err: any) {
      setError(
        err.message || "An error occurred while fetching dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
};

// Generate sample data for charts
const generateSampleRevenueData = () => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ];
  return months.map((month) => ({
    name: month,
    totalBets: Math.floor(Math.random() * 5000000) + 2000000,
    totalPayouts: Math.floor(Math.random() * 4000000) + 1000000,
    profit: Math.floor(Math.random() * 2000000) + 500000,
  }));
};

const generateUserActivityData = () => {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  return days.map((day) => ({
    name: day,
    users: Math.floor(Math.random() * 100) + 50,
    bets: Math.floor(Math.random() * 200) + 100,
  }));
};

export default function AdminDashboardContent() {
  const { data, loading, error, refetch } = useDashboardData();
  const [revenueData] = useState(generateSampleRevenueData);
  const [activityData] = useState(generateUserActivityData);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 rounded-lg text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={refetch} variant="primary">
          <RefreshCwIcon className="mr-2 h-4 w-4" />
          Thử lại
        </Button>
      </div>
    );
  }

  const statsCards = [
    {
      title: "Tổng người dùng",
      value: data.totalUsers,
      icon: <UserIcon className="h-6 w-6 text-blue-500" />,
      change: "+5%",
      trend: "up",
      link: "/admin/users",
    },
    {
      title: "Người dùng hoạt động",
      value: data.activeUsers,
      icon: <ActivityIcon className="h-6 w-6 text-green-500" />,
      change: "+12%",
      trend: "up",
      link: "/admin/users?status=active",
    },
    {
      title: "Yêu cầu thanh toán chờ xử lý",
      value: data.pendingPayments,
      icon: <DollarSignIcon className="h-6 w-6 text-yellow-500" />,
      change: "-3",
      trend: "down",
      link: "/admin/payment-requests",
    },
    {
      title: "Lượt chơi đang diễn ra",
      value: data.activeGames,
      icon: <BoxIcon className="h-6 w-6 text-purple-500" />,
      change: "+2",
      trend: "up",
      link: "/admin/games",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <Link href={stat.link} key={index}>
            <Card className="transition-transform hover:shadow-lg hover:-translate-y-1 cursor-pointer">
              <div className="p-4">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className="p-2 bg-gray-100 rounded-full">
                    {stat.icon}
                  </div>
                </div>
                <div className="mt-3">
                  <Badge
                    variant={stat.trend === "up" ? "success" : "danger"}
                    className="flex items-center w-fit"
                  >
                    {stat.trend === "up" ? (
                      <TrendingUpIcon className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDownIcon className="h-3 w-3 mr-1" />
                    )}
                    {stat.change}
                  </Badge>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Financial Summary */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold flex items-center">
            <DollarSignIcon className="h-5 w-5 mr-2 text-green-500" />
            Tổng quan tài chính
          </h2>
          <div className="flex space-x-2">
            <Badge className="flex items-center" variant="info">
              <CalendarIcon className="mr-1 h-3 w-3" />
              Tháng này
            </Badge>
          </div>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Tổng tiền đặt cược</p>
            <p className="text-2xl font-bold text-green-700 mt-1">
              {formatCurrency(data.totalBets)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Tổng tiền thưởng</p>
            <p className="text-2xl font-bold text-red-700 mt-1">
              {formatCurrency(data.totalPayouts)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Lợi nhuận</p>
            <p className="text-2xl font-bold text-blue-700 mt-1">
              {formatCurrency(data.profit)}
            </p>
          </div>
        </div>

        <div className="h-80 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={revenueData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value) => formatCurrency(value as number)}
                labelFormatter={(label) => `Tháng: ${label}`}
              />
              <Legend />
              <Bar
                dataKey="totalBets"
                name="Tổng tiền đặt cược"
                fill="#10b981"
              />
              <Bar
                dataKey="totalPayouts"
                name="Tổng tiền thưởng"
                fill="#ef4444"
              />
              <Bar dataKey="profit" name="Lợi nhuận" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Activity Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold flex items-center">
              <ActivityIcon className="h-5 w-5 mr-2 text-blue-500" />
              Hoạt động người dùng
            </h2>
          </div>
          <div className="p-4 flex flex-col space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Đăng ký hôm nay</span>
              <span className="font-semibold">{data.registrationsToday}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Lượt chơi đã hoàn thành</span>
              <span className="font-semibold">{data.completedGames}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tỷ lệ hoạt động</span>
              <span className="font-semibold">
                {Math.round((data.activeUsers / data.totalUsers) * 100)}%
              </span>
            </div>
          </div>
          <div className="h-64 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={activityData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  name="Người dùng"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="bets"
                  name="Lượt đặt cược"
                  stroke="#82ca9d"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold flex items-center">
              <PercentIcon className="h-5 w-5 mr-2 text-purple-500" />
              Tỷ lệ thắng thua
            </h2>
          </div>

          <div className="p-4">
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Tỷ lệ nhà cái thắng
              </h3>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                      {Math.round((data.profit / data.totalBets) * 100)}%
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-green-600">
                      {formatCurrency(data.profit)}
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                  <div
                    style={{
                      width: `${Math.round(
                        (data.profit / data.totalBets) * 100
                      )}%`,
                    }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                  ></div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Tỷ lệ người chơi thắng
              </h3>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-200">
                      {Math.round((data.totalPayouts / data.totalBets) * 100)}%
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-red-600">
                      {formatCurrency(data.totalPayouts)}
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-red-200">
                  <div
                    style={{
                      width: `${Math.round(
                        (data.totalPayouts / data.totalBets) * 100
                      )}%`,
                    }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <Link href="/admin/games">
                <Button variant="outline" className="w-full">
                  Quản lý lượt chơi
                </Button>
              </Link>
              <Link href="/admin/payment-requests">
                <Button variant="outline" className="w-full">
                  Quản lý thanh toán
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
