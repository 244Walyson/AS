import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  TooltipProps,
} from "recharts";
import { BarChart3 } from "lucide-react";
import { useTranslations } from "next-intl";

interface SentimentDistributionChartProps {
  data: Array<{
    sentiment: string;
    percentage: number;
    count: number;
  }>;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      count: number;
      percentage: number;
    };
  }>;
}

interface CustomLegendProps {
  payload?: Array<{
    value: string;
    color: string;
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload?.length) {
    const data = payload[0];
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
          {data.name}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {data.value}% ({data.payload.count} comentários)
        </p>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: CustomLegendProps) => {
  if (!payload) return null;

  return (
    <div className="flex justify-center gap-4 mt-4">
      {payload.map((entry) => (
        <div key={entry.value} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const SentimentDistributionChart = ({
  data,
}: SentimentDistributionChartProps) => {
  const t = useTranslations("dashboard.overview");

  const COLORS = {
    positive: "#10b981",
    negative: "#ef4444",
    neutral: "#6b7280",
  };

  const chartData = data.map((item) => ({
    name: t(`sentiments.${item.sentiment}`),
    value: item.percentage,
    count: item.count,
    sentiment: item.sentiment,
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {t("charts.sentimentDistribution")}
        </h2>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ value }) => `${value}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.sentiment}
                  fill={COLORS[entry.sentiment as keyof typeof COLORS]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 space-y-2">
        {data.map((item) => (
          <div
            key={item.sentiment}
            className="flex justify-between items-center"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor:
                    COLORS[item.sentiment as keyof typeof COLORS],
                }}
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                {t(`sentiments.${item.sentiment}`)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {item.percentage}%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                ({item.count})
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SentimentDistributionChart;
