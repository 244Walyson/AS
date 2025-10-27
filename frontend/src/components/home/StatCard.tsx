import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  iconColor,
  iconBgColor,
  trend,
}: StatCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${iconBgColor}`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              trend.isPositive
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            <span>
              {trend.isPositive ? "+" : ""}
              {trend.value}%
            </span>
            <span className="text-xs">vs mês anterior</span>
          </div>
        )}
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  );
};

export default StatCard;
