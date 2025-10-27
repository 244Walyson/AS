import { TrendingUp, MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";

interface TopPostsListProps {
  data: Array<{
    id: string;
    content: string;
    commentCount: number;
    sentimentsStats: Array<{
      sentiment: string;
      count: number;
    }>;
  }>;
}

const TopPostsList = ({ data }: TopPostsListProps) => {
  const t = useTranslations("dashboard.overview");

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
      case "positive":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "negative":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {t("charts.topEngagedPosts")}
        </h2>
      </div>

      <div className="space-y-4">
        {data?.length > 0 ? (
          data.map((post) => (
            <div
              key={post.id}
              className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="flex justify-between items-start mb-3">
                <p className="text-gray-700 dark:text-gray-300 flex-1 mr-4 line-clamp-2">
                  {post.content || t("posts.noContent")}
                </p>
                <div className="flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                  <MessageSquare className="w-4 h-4" />
                  {post.commentCount} {t("posts.comments")}
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                {post.sentimentsStats?.map((stat) => (
                  <span
                    key={stat.sentiment}
                    className={`text-xs px-2 py-1 rounded-full font-medium ${getSentimentColor(
                      stat.sentiment
                    )}`}
                  >
                    {t(`sentiments.${stat.sentiment}`)}: {stat.count}
                  </span>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Nenhum post encontrado
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopPostsList;
