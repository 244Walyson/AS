import {
  getDashboardOverview,
  getRecentCommentsWithSentiment,
  getSentimentsTrend,
  getTopEmotions,
  getTopEngagedPosts,
} from "@/services/sentiments.service";
import {
  AlertCircle,
  FileText,
  MessageSquare,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import StatCard from "./StatCard";
import SentimentTrendChart from "./SentimentTrendChart";
import SentimentDistributionChart from "./SentimentDistributionChart";
import TopEmotionsChart from "./TopEmotionsChart";
import TopPostsList from "./TopPostsList";
import RecentCommentsList from "./RecentCommentsList";

interface DashboardData {
  totalPosts: number;
  totalComments: number;
  averageSentimentValue: string;
  sentimentDistribution: Array<{
    sentiment: string;
    percentage: number;
    count: number;
  }>;
}

const DashboardOverview = () => {
  const t = useTranslations("dashboard.overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overview, setOverview] = useState<DashboardData | null>(null);
  const [trend, setTrend] = useState([]);
  const [topEmotions, setTopEmotions] = useState([]);
  const [topPosts, setTopPosts] = useState([]);
  const [recentComments, setRecentComments] = useState([]);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [overviewRes, trendRes, emotionsRes, postsRes, commentsRes] =
        await Promise.all([
          getDashboardOverview(),
          getSentimentsTrend(7),
          getTopEmotions(5),
          getTopEngagedPosts(3),
          getRecentCommentsWithSentiment(5),
        ]);

      setOverview(overviewRes);
      setTrend(trendRes);
      setTopEmotions(emotionsRes);
      setTopPosts(postsRes);
      setRecentComments(commentsRes);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t("retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 space-y-6 overflow-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t("title")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">{t("subtitle")}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t("stats.totalPosts")}
          value={overview?.totalPosts || 0}
          icon={FileText}
          iconColor="text-blue-600 dark:text-blue-400"
          iconBgColor="bg-blue-100 dark:bg-blue-900/30"
          trend={{ value: 12, isPositive: true }}
        />

        <StatCard
          title={t("stats.analyzedComments")}
          value={overview?.totalComments || 0}
          icon={MessageSquare}
          iconColor="text-purple-600 dark:text-purple-400"
          iconBgColor="bg-purple-100 dark:bg-purple-900/30"
          trend={{ value: 8, isPositive: true }}
        />

        <StatCard
          title={t("stats.averageSentiment")}
          value={overview?.averageSentimentValue || "0.00"}
          icon={TrendingUp}
          iconColor="text-green-600 dark:text-green-400"
          iconBgColor="bg-green-100 dark:bg-green-900/30"
          trend={{ value: 5, isPositive: true }}
        />

        <StatCard
          title={t("stats.positiveSentiments")}
          value={`${
            overview?.sentimentDistribution?.find(
              (s: { sentiment: string }) => s.sentiment === "positive"
            )?.percentage || 0
          }%`}
          icon={Zap}
          iconColor="text-orange-600 dark:text-orange-400"
          iconBgColor="bg-orange-100 dark:bg-orange-900/30"
          trend={{ value: 3, isPositive: true }}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SentimentTrendChart data={trend} />
        <SentimentDistributionChart
          data={overview?.sentimentDistribution || []}
        />
      </div>

      {/* Emotions Chart */}
      <TopEmotionsChart data={topEmotions} />

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopPostsList data={topPosts} />
        <RecentCommentsList data={recentComments} />
      </div>
    </div>
  );
};

export default DashboardOverview;
