import { Clock, MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";

interface RecentCommentsListProps {
  data: Array<{
    id: string;
    comment: {
      content: string;
    };
    sentiment: string;
    emotion?: string;
    createdAt: string;
  }>;
}

const RecentCommentsList = ({ data }: RecentCommentsListProps) => {
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {t("charts.recentComments")}
        </h2>
      </div>

      <div className="space-y-3">
        {data?.length > 0 ? (
          data.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="flex justify-between items-start mb-3">
                <p className="text-sm text-gray-700 dark:text-gray-300 flex-1 mr-4 line-clamp-2">
                  {item.comment?.content}
                </p>
                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {formatDate(item.createdAt)}
                </span>
              </div>

              <div className="flex gap-2 items-center flex-wrap">
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${getSentimentColor(
                    item.sentiment
                  )}`}
                >
                  {t(`sentiments.${item.sentiment}`)}
                </span>
                {item.emotion && (
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 font-medium">
                    {getEmotionEmoji(item.emotion)}{" "}
                    {t(`emotions.${item.emotion}`) || item.emotion}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Nenhum comentário encontrado
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentCommentsList;
