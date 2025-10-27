import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";

interface TopEmotionsChartProps {
  data: Array<{
    emotion: string;
    count: number;
    percentage: number;
  }>;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: {
      percentage: number;
    };
  }>;
  label?: string;
}

interface CustomXAxisTickProps {
  x: number;
  y: number;
  payload: {
    value: string;
  };
}

const getEmotionEmoji = (emotion: string) => {
  const emojiMap: Record<string, string> = {
    joy: "😄",
    love: "❤️",
    excitement: "🎉",
    gratitude: "🙏",
    curiosity: "🤔",
    sadness: "😢",
    anger: "😠",
    fear: "😨",
    surprise: "😲",
    disgust: "🤢",
  };
  return emojiMap[emotion?.toLowerCase()] || "😊";
};

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload?.length) {
    const data = payload[0];
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
          {label}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {data.value} ocorrências ({data.payload.percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

const CustomXAxisTick = ({ x, y, payload }: CustomXAxisTickProps) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="middle"
        fill="#6b7280"
        fontSize={12}
      >
        <tspan x={0} dy={-5}>
          {getEmotionEmoji(payload.value)}
        </tspan>
        <tspan x={0} dy={12}>
          {payload.value}
        </tspan>
      </text>
    </g>
  );
};

const TopEmotionsChart = ({ data }: TopEmotionsChartProps) => {
  const t = useTranslations("dashboard.overview");

  const chartData = data.map((item) => ({
    emotion: t(`emotions.${item.emotion}`) || item.emotion,
    count: item.count,
    percentage: item.percentage,
    emoji: getEmotionEmoji(item.emotion),
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {t("charts.topEmotions")}
        </h2>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="emotion"
              stroke="#6b7280"
              fontSize={12}
              tick={<CustomXAxisTick />}
              height={80}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => value.toString()}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="count"
              fill="#8b5cf6"
              radius={[4, 4, 0, 0]}
              className="hover:opacity-80 transition-opacity"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 space-y-3">
        {data.map((emotion) => (
          <div
            key={emotion.emotion}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {getEmotionEmoji(emotion.emotion)}
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                {t(`emotions.${emotion.emotion}`) || emotion.emotion}
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {emotion.count}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {emotion.percentage}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopEmotionsChart;
