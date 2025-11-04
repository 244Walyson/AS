"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import {
  TrendingUp,
  MessageCircle,
  FileText,
  BarChart3,
  Loader2,
  Heart,
  CalendarDays,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Line,
  LineChart,
} from "recharts";
import {
  getDashboardOverview,
  getTopEmotions,
  getTopEngagedPosts,
  getRecentCommentsWithSentiment,
  getSentimentTrend,
} from "@/services/sentiments.service";
import {
  RecentComment,
  SentimentTrend,
  TopEmotion,
  TopEngagedPost,
  DashboardOverview as DashboardOverviewType,
} from "@/@types/sentiments.type";
import Image from "next/image";

const COLORS = {
  positive: "#34d399", // verde suave
  neutral: "#fbbf24", // amarelo mostarda leve
  negative: "#f87171", // vermelho suave
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

export default function DashboardOverview() {
  const [overview, setOverview] = useState<DashboardOverviewType | null>(null);
  const [emotions, setEmotions] = useState<TopEmotion[]>([]);
  const [posts, setPosts] = useState<TopEngagedPost[]>([]);
  const [comments, setComments] = useState<RecentComment[]>([]);
  const [sentimentTrend, setSentimentTrend] = useState<SentimentTrend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const [
          overviewData,
          emotionsData,
          postsData,
          commentsData,
          sentimentTrendData,
        ] = await Promise.all([
          getDashboardOverview(),
          getTopEmotions(5),
          getTopEngagedPosts(3),
          getRecentCommentsWithSentiment(3),
          getSentimentTrend({}),
        ]);

        setOverview(overviewData);
        setEmotions(emotionsData);
        setPosts(postsData);
        setComments(commentsData);
        setSentimentTrend(sentimentTrendData);
      } catch (error) {
        console.error("Erro ao carregar o dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Processar dados de tendência para o gráfico
  const processTrendData = (trendData: SentimentTrend[]) => {
    const grouped = trendData.reduce((acc, item) => {
      const date = format(new Date(item.date), "dd/MM");
      if (!acc[date]) {
        acc[date] = { date, positive: 0, negative: 0 };
      }
      if (item.sentiment === "positive") {
        acc[date].positive = Number(item.count);
      } else if (item.sentiment === "negative") {
        acc[date].negative = Number(item.count);
      }
      return acc;
    }, {} as Record<string, { date: string; positive: number; negative: number }>);

    return Object.values(grouped);
  };

  const chartData = processTrendData(sentimentTrend);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="animate-spin w-8 h-8 text-slate-400 mx-auto mb-4" />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Carregando dados...
          </p>
        </div>
      </div>
    );
  }

  const averageSentiment = overview?.averageSentimentValue
    ? Number(overview.averageSentimentValue) * 100
    : 0;

  return (
    <div className="p-12 space-y-6">
      {/* Stats Cards */}
      <button className="flex items-center gap-2 px-4 py-2 text-sm rounded-full bg-muted/60 hover:bg-muted transition-colors">
        <CalendarDays className="w-4 h-4" />
        Últimos 30 dias
      </button>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Sentimento Médio"
          value={`${averageSentiment.toFixed(1)}%`}
          icon={<TrendingUp className="w-5 h-5" />}
          color="emerald"
          delay={0}
        />
        <StatCard
          title="Comentários"
          value={overview?.totalComments ?? 0}
          icon={<MessageCircle className="w-5 h-5" />}
          color="blue"
          delay={0.1}
        />
        <StatCard
          title="Postagens"
          value={overview?.totalPosts ?? 0}
          icon={<FileText className="w-5 h-5" />}
          color="purple"
          delay={0.2}
        />
        <StatCard
          title="Emoções"
          value={emotions.length}
          icon={<BarChart3 className="w-5 h-5" />}
          color="pink"
          delay={0.3}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Gráfico de Tendência - 2 colunas */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Tendência de Sentimentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={sentimentTrend}
                  margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
                >
                  {/* <CartesianGrid
                    stroke="currentColor"
                    strokeDasharray="3 3"
                    className="opacity-20"
                  /> */}
                  <XAxis
                    dataKey="date"
                    stroke="currentColor"
                    tick={{ fill: "currentColor", fontSize: 12 }}
                  />
                  <YAxis
                    stroke="currentColor"
                    tick={{ fill: "currentColor", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />

                  {/* Linha positiva */}
                  <Line
                    type="monotone"
                    dataKey="positive"
                    name="Positivo"
                    stroke={COLORS.positive}
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />

                  <Line
                    type="monotone"
                    dataKey="negative"
                    name="Negativo"
                    stroke={COLORS.negative}
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="neutral"
                    name="Neutro"
                    stroke={COLORS.neutral}
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Gráfico de Pizza - 1 coluna */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Distribuição de Sentimentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={(overview?.sentimentDistribution || []).map(
                        (item) => ({
                          ...item,
                          percentage: Number(item.percentage),
                        })
                      )}
                      dataKey="percentage"
                      nameKey="sentiment"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {(overview?.sentimentDistribution || []).map((entry) => {
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
                  </PieChart>
                </ResponsiveContainer>

                <div className="w-full space-y-2 mt-4">
                  {(overview?.sentimentDistribution || []).map((item) => (
                    <div
                      key={item.sentiment}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor:
                              COLORS[item.sentiment as keyof typeof COLORS] ||
                              COLORS.neutral,
                          }}
                        ></div>
                        <span className="text-sm font-medium capitalize">
                          {(() => {
                            if (item.sentiment === "positive")
                              return "Positivo";
                            if (item.sentiment === "negative")
                              return "Negativo";
                            return "Neutro";
                          })()}
                        </span>
                      </div>
                      <span className="text-sm font-semibold">
                        {Number(item.percentage).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Emoções Top */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Emoções Identificadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {emotions.map((emotion, index) => (
                <motion.div
                  key={emotion.emotion}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  className="p-4 rounded-lg border bg-slate-50 dark:bg-slate-800/50 hover:shadow-md transition-all"
                >
                  <div className="text-center">
                    <div
                      className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center"
                      style={{
                        backgroundColor: `${
                          EMOTION_COLORS[emotion.emotion] || "#6366f1"
                        }20`,
                      }}
                    >
                      <div
                        className="w-8 h-8 rounded-full"
                        style={{
                          backgroundColor:
                            EMOTION_COLORS[emotion.emotion] || "#6366f1",
                        }}
                      />
                    </div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">
                      {EMOTION_LABELS[emotion.emotion] || emotion.emotion}
                    </p>
                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {Number(emotion.percentage).toFixed(1)}%
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {emotion.count}{" "}
                      {emotion.count === 1 ? "comentário" : "comentários"}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bottom Section - Posts e Comentários */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Posts com Maior Engajamento */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500" />
                Posts Mais Engajados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {posts.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
                  Nenhum post encontrado
                </p>
              ) : (
                posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="group p-4 rounded-lg border bg-slate-50 dark:bg-slate-800/50 hover:shadow-md transition-all"
                  >
                    <div className="flex gap-4">
                      {post.s3_media_url && (
                        <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border">
                          <Image
                            src={post.s3_media_url}
                            alt={post.caption || ""}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 line-clamp-2 mb-2">
                          {post.caption || "Sem descrição"}
                        </p>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                            <MessageCircle className="w-3.5 h-3.5" />
                            {post.comment_count} comentários
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                              post.prevailingSentiment.sentiment === "positive"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                            }`}
                          >
                            {post.prevailingSentiment.sentiment === "positive"
                              ? "Positivo"
                              : "Negativo"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Comentários Recentes */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-blue-500" />
                Comentários Recentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
                  Nenhum comentário encontrado
                </p>
              ) : (
                comments.map((c, index) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="p-4 rounded-lg border bg-slate-50 dark:bg-slate-800/50 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium ${(() => {
                          if (c.sentiment === "positive") {
                            return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
                          }
                          if (c.sentiment === "negative") {
                            return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400";
                          }
                          return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
                        })()}`}
                      >
                        {(() => {
                          if (c.sentiment === "positive") return "Positivo";
                          if (c.sentiment === "negative") return "Negativo";
                          return "Neutro";
                        })()}
                      </span>
                      {c.emotion && (
                        <span
                          className="text-xs px-2 py-1 rounded-md font-medium"
                          style={{
                            backgroundColor: `${
                              EMOTION_COLORS[c.emotion] || "#6366f1"
                            }20`,
                            color: EMOTION_COLORS[c.emotion] || "#6366f1",
                          }}
                        >
                          {EMOTION_LABELS[c.emotion] || c.emotion}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-3 leading-relaxed">
                      {c.comment?.text || "Sem texto"}
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-medium">
                        @{c.comment?.username || "Anônimo"}
                      </span>
                      <span>
                        {c.comment?.timestamp || c.timestamp
                          ? format(
                              new Date(
                                c.comment?.timestamp || c.timestamp || ""
                              ),
                              "dd/MM/yyyy HH:mm"
                            )
                          : "-"}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
  delay,
}: Readonly<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  delay: number;
}>) {
  const colorClasses = {
    emerald: {
      bg: "from-emerald-500 to-emerald-600",
      text: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    blue: {
      bg: "from-blue-500 to-blue-600",
      text: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
    },
    purple: {
      bg: "from-purple-500 to-purple-600",
      text: "text-purple-600 dark:text-purple-400",
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
    },
    pink: {
      bg: "from-pink-500 to-pink-600",
      text: "text-pink-600 dark:text-pink-400",
      iconBg: "bg-pink-100 dark:bg-pink-900/30",
    },
  };

  const colors = colorClasses[color as keyof typeof colorClasses];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-lg ${colors.iconBg}`}>
              <div className={colors.text}>{icon}</div>
            </div>
          </div>
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            {title}
          </h3>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {value}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
