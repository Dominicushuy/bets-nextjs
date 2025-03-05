// src/components/history/history-content.tsx
"use client";

import { useState } from "react";
import { useUserBets } from "@/hooks/game-hooks";
import { useUserPaymentRequests } from "@/hooks/payment-hooks";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/ui/loading";

interface HistoryContentProps {
  userId: string;
}

export default function HistoryContent({ userId }: HistoryContentProps) {
  const [activeTab, setActiveTab] = useState<"bets" | "payments">("bets");

  const { data: bets, isLoading: betsLoading } = useUserBets(userId);
  const { data: payments, isLoading: paymentsLoading } =
    useUserPaymentRequests(userId);

  const isLoading =
    (activeTab === "bets" && betsLoading) ||
    (activeTab === "payments" && paymentsLoading);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="warning">Đang chờ</Badge>;
      case "approved":
        return <Badge variant="success">Đã duyệt</Badge>;
      case "rejected":
        return <Badge variant="destructive">Từ chối</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "bets"
                ? "text-primary-600 border-b-2 border-primary-600"
                : "text-gray-600 hover:text-primary-600"
            }`}
            onClick={() => setActiveTab("bets")}
          >
            Lịch sử đặt cược
          </button>

          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "payments"
                ? "text-primary-600 border-b-2 border-primary-600"
                : "text-gray-600 hover:text-primary-600"
            }`}
            onClick={() => setActiveTab("payments")}
          >
            Lịch sử thanh toán
          </button>
        </div>
      </div>

      {activeTab === "bets" && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Lịch sử đặt cược</h3>

            {bets?.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                Bạn chưa có lịch sử đặt cược nào
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số đã chọn
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số tiền
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thời gian
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số trúng
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kết quả
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bets?.map((bet) => (
                      <tr key={bet.id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {bet.selected_number}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {bet.amount?.toLocaleString()} VND
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {new Date(bet.created_at).toLocaleString("vi-VN")}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {bet.game?.winning_number || "-"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {bet.game?.status === "completed" ? (
                            bet.is_winner ? (
                              <Badge variant="success">Thắng</Badge>
                            ) : (
                              <Badge variant="destructive">Thua</Badge>
                            )
                          ) : (
                            <Badge variant="secondary">
                              {bet.game?.status === "active"
                                ? "Đang diễn ra"
                                : "Chưa có kết quả"}
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>
      )}

      {activeTab === "payments" && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Lịch sử thanh toán</h3>

            {payments?.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                Bạn chưa có lịch sử thanh toán nào
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số tiền
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày yêu cầu
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày xử lý
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ghi chú
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payments?.map((payment) => (
                      <tr key={payment.id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {payment.amount?.toLocaleString()} VND
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {new Date(payment.request_date).toLocaleString(
                            "vi-VN"
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {getStatusBadge(payment.status)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {payment.processed_date
                            ? new Date(payment.processed_date).toLocaleString(
                                "vi-VN"
                              )
                            : "-"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {payment.notes || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
