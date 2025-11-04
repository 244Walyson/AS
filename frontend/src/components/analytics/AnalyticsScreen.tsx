"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  TrendingUp,
  AlertCircle,
  Heart,
  Loader2,
  Sparkles,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  getToneAnalysis,
  getSarcasmStats,
  getImpactAnalysis,
  getTopEmotions,
} from "@/services/sentiments.service";
import {
  ToneAnalysis,
  SarcasmStats,
  ImpactAnalysis,
  TopEmotion,
} from "@/@types/sentiments.type";

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

const TONE_COLORS: Record<string, string> = {
  formal: "#3b82f6",
  informal: "#f59e0b",
  neutral: "#6b7280",
  positive: "#10b981",
  negative: "#ef4444",
};

const IMPACT_COLORS: Record<string, string> = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#10b981",
};

export default function AnalyticsScreen() {
  const [toneAnalysis, setToneAnalysis] = useState<ToneAnalysis[]>([]);
  const [sarcasmStats, setSarcasmStats] = useState<SarcasmStats | null>(null);
  const [impactAnalysis, setImpactAnalysis] = useState<ImpactAnalysis[]>([]);
  const [topEmotions, setTopEmotions] = useState<TopEmotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [toneData, sarcasmData, impactData, emotionsData] =
          await Promise.all([
            getToneAnalysis(),
            getSarcasmStats(),
            getImpactAnalysis(),
            getTopEmotions(10),
          ]);

        setToneAnalysis(toneData || []);
        setSarcasmStats(sarcasmData || null);
        setImpactAnalysis(impactData || []);
        setTopEmotions(emotionsData || []);
      } catch (error) {
        console.error("Erro ao carregar análises:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="animate-spin w-8 h-8 text-slate-400 mx-auto mb-4" />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Carregando análises...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-12 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
          <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Análises Detalhadas
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Análises profundas de tom, sarcasmo, impacto e emoções
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                Análises de Tom
              </h3>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {toneAnalysis.length}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <AlertCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                Sarcasmo Detectado
              </h3>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {sarcasmStats?.sarcastic || 0}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {sarcasmStats?.percentage || "0"}% do total
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                  <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                Níveis de Impacto
              </h3>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {impactAnalysis.length}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-pink-100 dark:bg-pink-900/30">
                  <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                Emoções Únicas
              </h3>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {topEmotions.length}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Análise de Tom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Análise de Tom
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={toneAnalysis}>
                  <XAxis
                    dataKey="tone"
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
                  <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {toneAnalysis.map((tone) => (
                  <div
                    key={tone.tone}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor:
                            TONE_COLORS[tone.tone.toLowerCase()] || "#6b7280",
                        }}
                      ></div>
                      <span className="text-sm font-medium capitalize">
                        {tone.tone}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {tone.count} comentários
                      </span>
                      <span className="text-sm font-semibold">
                        {Number(tone.percentage).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Análise de Impacto */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Análise de Impacto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={impactAnalysis}
                    dataKey="percentage"
                    nameKey="impact"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {impactAnalysis.map((entry) => (
                      <Cell
                        key={entry.impact}
                        fill={
                          IMPACT_COLORS[entry.impact.toLowerCase()] || "#6b7280"
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {impactAnalysis.map((impact) => (
                  <div
                    key={impact.impact}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor:
                            IMPACT_COLORS[impact.impact.toLowerCase()] ||
                            "#6b7280",
                        }}
                      ></div>
                      <span className="text-sm font-medium capitalize">
                        {(() => {
                          if (impact.impact === "high") return "Alto";
                          if (impact.impact === "medium") return "Médio";
                          return "Baixo";
                        })()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {impact.count} comentários
                      </span>
                      <span className="text-sm font-semibold">
                        {Number(impact.percentage).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Sarcasmo e Emoções */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Estatísticas de Sarcasmo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-purple-500" />
                Detecção de Sarcasmo
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sarcasmStats ? (
                <div className="space-y-4">
                  <div className="p-6 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Total de comentários
                      </span>
                      <span className="text-xl font-bold text-slate-900 dark:text-white">
                        {sarcasmStats.total}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Com sarcasmo
                      </span>
                      <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                        {sarcasmStats.sarcastic}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                    <div
                      className="bg-purple-600 h-3 rounded-full transition-all"
                      style={{
                        width: `${sarcasmStats.percentage}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                    {sarcasmStats.percentage}% dos comentários contêm sarcasmo
                  </p>
                </div>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
                  Nenhum dado de sarcasmo disponível
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Emoções */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-500" />
                Top 10 Emoções
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topEmotions.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
                    Nenhuma emoção encontrada
                  </p>
                ) : (
                  topEmotions.map((emotion, index) => (
                    <div
                      key={emotion.emotion}
                      className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                    >
                      <div
                        className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold text-white"
                        style={{
                          backgroundColor:
                            EMOTION_COLORS[emotion.emotion] || "#6366f1",
                        }}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {EMOTION_LABELS[emotion.emotion] || emotion.emotion}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {emotion.count} comentários
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {Number(emotion.percentage).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
