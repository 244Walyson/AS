import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";

interface SentimentTrendChartProps {
  data: Array<{
    date: string;
    positive: number;
    negative: number;
    neutral: number;
  }>;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  const t = useTranslations("dashboard.overview");

  if (active && payload?.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
          {label
            ? new Date(label).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : ""}
        </p>
        {payload.map((entry, index) => (
          <div
            key={`${entry.dataKey}-${index}`}
            className="flex items-center gap-2 text-sm"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600 dark:text-gray-400">
              {(() => {
                switch (entry.dataKey) {
                  case "positive":
                    return t("sentiments.positive");
                  case "negative":
                    return t("sentiments.negative");
                  default:
                    return t("sentiments.neutral");
                }
              })()}
              :
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {entry.value}%
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const SentimentTrendChart = ({ data }: SentimentTrendChartProps) => {
  const t = useTranslations("dashboard.overview");

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {t("charts.sentimentTrend")}
        </h2>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                })
              }
            />
            <YAxis
              stroke="#6b7280"
              fontSize={12}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="positive"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="negative"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#ef4444", strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="neutral"
              stroke="#6b7280"
              strokeWidth={3}
              dot={{ fill: "#6b7280", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#6b7280", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {t("sentiments.positive")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {t("sentiments.negative")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-500"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {t("sentiments.neutral")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SentimentTrendChart;
