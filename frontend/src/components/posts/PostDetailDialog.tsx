"use client";
import {
  PostWithComments,
  CommentWithSentiment,
} from "@/@types/sentiments.type";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { format } from "date-fns";
import {
  MessageCircle,
  Calendar,
  TrendingUp,
  Heart,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from "recharts";

const COLORS = {
  positive: "#34d399",
  neutral: "#fbbf24",
  negative: "#f87171",
};

const EMOTION_COLORS: Record<string, string> = {
  joy: "#10b981",
  anger: "#ef4444",
  disgust: "#a855f7",
  sadness: "#3b82f6",
  surprise: "#f59e0b",
  fear: "#6366f1",
  love: "#ec4899",
};

const EMOTION_LABELS: Record<string, string> = {
  joy: "Alegria",
  anger: "Raiva",
  disgust: "Desgosto",
  sadness: "Tristeza",
  surprise: "Surpresa",
  fear: "Medo",
  love: "Amor",
};

interface PostDetailDialogProps {
  readonly post: PostWithComments;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PostDetailDialog({
  post,
  open,
  onOpenChange,
}: PostDetailDialogProps) {
  const sentimentData =
    post.sentimentsStats?.map((stat) => ({
      sentiment: stat.sentiment,
      count: Number(stat.count),
      percentage: Number(stat.percentage) || 0,
    })) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Análise Detalhada do Post
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Post Media and Info */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {/* Media */}
            {(post.s3MediaUrl || post.mediaUrl) && (
              <div className="relative w-full h-64 lg:h-80 rounded-lg overflow-hidden border">
                <Image
                  src={post.s3MediaUrl || post.mediaUrl || ""}
                  alt={post.caption || "Post image"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}

            {/* Post Info */}
            <div className="space-y-4">
              {post.caption && (
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                    Descrição
                  </h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {post.caption}
                  </p>
                </div>
              )}

              {post.timestamp && (
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {format(new Date(post.timestamp), "dd/MM/yyyy 'às' HH:mm")}
                  </span>
                </div>
              )}

              {/* Sentiment Badge */}
              <div className="flex items-center gap-2">
                <div
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: `${
                      COLORS[
                        post.prevailingSentiment
                          ?.sentiment as keyof typeof COLORS
                      ] || COLORS.neutral
                    }20`,
                    color:
                      COLORS[
                        post.prevailingSentiment
                          ?.sentiment as keyof typeof COLORS
                      ] || COLORS.neutral,
                  }}
                >
                  {(() => {
                    const sentiment = post.prevailingSentiment?.sentiment;
                    if (sentiment === "positive") return "Positivo";
                    if (sentiment === "negative") return "Negativo";
                    return "Neutro";
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Sentiment Distribution Chart */}
          {sentimentData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Distribuição de Sentimentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={sentimentData}
                        dataKey="percentage"
                        nameKey="sentiment"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                      >
                        {sentimentData.map((entry) => {
                          const sentimentKey =
                            entry.sentiment as keyof typeof COLORS;
                          return (
                            <Cell
                              key={entry.sentiment}
                              fill={COLORS[sentimentKey] || COLORS.neutral}
                            />
                          );
                        })}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 flex flex-col justify-center">
                    {sentimentData.map((stat) => (
                      <div
                        key={stat.sentiment}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor:
                                COLORS[stat.sentiment as keyof typeof COLORS] ||
                                COLORS.neutral,
                            }}
                          ></div>
                          <span className="text-sm font-medium capitalize">
                            {(() => {
                              if (stat.sentiment === "positive")
                                return "Positivo";
                              if (stat.sentiment === "negative")
                                return "Negativo";
                              return "Neutro";
                            })()}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {stat.count} comentários
                          </span>
                          <span className="text-sm font-semibold">
                            {stat.percentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comments List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Comentários ({post.commentsWithSentiments?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {post.commentsWithSentiments &&
              post.commentsWithSentiments.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {post.commentsWithSentiments.map((commentSentiment) => (
                    <CommentCard
                      key={commentSentiment.id}
                      commentSentiment={commentSentiment}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
                  Nenhum comentário encontrado
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CommentCard({
  commentSentiment,
}: {
  readonly commentSentiment: CommentWithSentiment;
}) {
  const sentiment = commentSentiment.sentiment;
  const sentimentColor =
    COLORS[sentiment as keyof typeof COLORS] || COLORS.neutral;

  return (
    <div className="p-4 rounded-lg border bg-slate-50 dark:bg-slate-800/50 space-y-3">
      {/* Comment Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-slate-900 dark:text-white">
              @{commentSentiment.comment?.username || "Anônimo"}
            </span>
            {commentSentiment.comment?.likeCount !== undefined && (
              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <Heart className="w-3 h-3" />
                {commentSentiment.comment.likeCount}
              </div>
            )}
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            {commentSentiment.comment?.text || "Sem texto"}
          </p>
          {commentSentiment.comment?.timestamp && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {format(
                new Date(commentSentiment.comment.timestamp),
                "dd/MM/yyyy HH:mm"
              )}
            </p>
          )}
        </div>
      </div>

      {/* Sentiment Analysis */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
        <span
          className="px-2 py-1 rounded-md text-xs font-medium"
          style={{
            backgroundColor: `${sentimentColor}20`,
            color: sentimentColor,
          }}
        >
          {(() => {
            if (sentiment === "positive") return "Positivo";
            if (sentiment === "negative") return "Negativo";
            return "Neutro";
          })()}
        </span>

        {commentSentiment.emotion && (
          <span
            className="px-2 py-1 rounded-md text-xs font-medium"
            style={{
              backgroundColor: `${
                EMOTION_COLORS[commentSentiment.emotion] || "#6366f1"
              }20`,
              color: EMOTION_COLORS[commentSentiment.emotion] || "#6366f1",
            }}
          >
            {EMOTION_LABELS[commentSentiment.emotion] ||
              commentSentiment.emotion}
          </span>
        )}

        {commentSentiment.sarcasm && (
          <span className="px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Sarcasmo
          </span>
        )}

        {commentSentiment.impact && (
          <span className="px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Impacto: {commentSentiment.impact}
          </span>
        )}

        {commentSentiment.tone && (
          <span className="px-2 py-1 rounded-md text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Tom: {commentSentiment.tone}
          </span>
        )}
      </div>

      {/* Additional Info */}
      {(commentSentiment.motivation ||
        commentSentiment.feedback ||
        commentSentiment.intensity) && (
        <div className="pt-2 space-y-1 text-xs text-slate-600 dark:text-slate-400">
          {commentSentiment.intensity && (
            <p>
              <span className="font-medium">Intensidade:</span>{" "}
              {commentSentiment.intensity}
            </p>
          )}
          {commentSentiment.motivation && (
            <p>
              <span className="font-medium">Motivação:</span>{" "}
              {commentSentiment.motivation}
            </p>
          )}
          {commentSentiment.feedback && (
            <p>
              <span className="font-medium">Feedback:</span>{" "}
              {commentSentiment.feedback}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
