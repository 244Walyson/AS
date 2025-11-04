"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Calendar, Loader2, BarChart3 } from "lucide-react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  CartesianGrid,
} from "recharts";
import { getSentimentTrend } from "@/services/sentiments.service";
import { SentimentTrend } from "@/@types/sentiments.type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

const COLORS = {
  positive: "#34d399",
  neutral: "#fbbf24",
  negative: "#f87171",
};

export default function TrendsScreen() {
  const [trendData, setTrendData] = useState<SentimentTrend[]>([]);
  const [period, setPeriod] = useState<"day" | "week" | "month">("day");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendData();
  }, [period]);

  const fetchTrendData = async () => {
    try {
      setLoading(true);
      const data = await getSentimentTrend({ period });
      setTrendData(data || []);
    } catch (error) {
      console.error("Erro ao carregar tendências:", error);
    } finally {
      setLoading(false);
    }
  };

  // Processar dados para o gráfico
  const processTrendData = () => {
    const grouped = trendData.reduce((acc, item) => {
      let dateKey: string;

      if (period === "day") {
        dateKey = format(new Date(item.date), "dd/MM");
      } else if (period === "week") {
        dateKey = format(new Date(item.date), "dd/MM");
      } else {
        dateKey = format(new Date(item.date), "MM/yyyy");
      }

      if (!acc[dateKey]) {
        acc[dateKey] = { date: dateKey, positive: 0, neutral: 0, negative: 0 };
      }

      if (item.sentiment === "positive") {
        acc[dateKey].positive = Number(item.count);
      } else if (item.sentiment === "negative") {
        acc[dateKey].negative = Number(item.count);
      } else {
        acc[dateKey].neutral = Number(item.count);
      }

      return acc;
    }, {} as Record<string, { date: string; positive: number; neutral: number; negative: number }>);

    return Object.values(grouped).sort((a, b) => {
      const [dayA, monthA] = a.date.split("/").map(Number);
      const [dayB, monthB] = b.date.split("/").map(Number);
      if (monthA !== monthB) return monthA - monthB;
      return dayA - dayB;
    });
  };

  const chartData = processTrendData();

  // Calcular estatísticas
  const stats = {
    total: trendData.reduce((sum, item) => sum + Number(item.count), 0),
    positive: trendData
      .filter((item) => item.sentiment === "positive")
      .reduce((sum, item) => sum + Number(item.count), 0),
    negative: trendData
      .filter((item) => item.sentiment === "negative")
      .reduce((sum, item) => sum + Number(item.count), 0),
    neutral: trendData
      .filter((item) => item.sentiment === "neutral")
      .reduce((sum, item) => sum + Number(item.count), 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="animate-spin w-8 h-8 text-slate-400 mx-auto mb-4" />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Carregando tendências...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-12 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
            <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Tendências de Sentimentos
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Análise temporal dos sentimentos ao longo do tempo
            </p>
          </div>
        </div>
        <Select
          value={period}
          onValueChange={(value: "day" | "week" | "month") => setPeriod(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione o período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Diário</SelectItem>
            <SelectItem value="week">Semanal</SelectItem>
            <SelectItem value="month">Mensal</SelectItem>
          </SelectContent>
        </Select>
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
                <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
                  <BarChart3 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                Total de Comentários
              </h3>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.total}
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
                <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                  <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                Positivos
              </h3>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {stats.positive}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {stats.total > 0
                  ? ((stats.positive / stats.total) * 100).toFixed(1)
                  : 0}
                %
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
                <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                  <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                Neutros
              </h3>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {stats.neutral}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {stats.total > 0
                  ? ((stats.neutral / stats.total) * 100).toFixed(1)
                  : 0}
                %
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
                <div className="p-3 rounded-lg bg-rose-100 dark:bg-rose-900/30">
                  <TrendingUp className="w-5 h-5 text-rose-600 dark:text-rose-400 rotate-180" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                Negativos
              </h3>
              <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                {stats.negative}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {stats.total > 0
                  ? ((stats.negative / stats.total) * 100).toFixed(1)
                  : 0}
                %
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Evolução Temporal dos Sentimentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <div className="flex items-center justify-center h-[400px]">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Nenhum dado disponível para o período selecionado
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
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
                  <Line
                    type="monotone"
                    dataKey="positive"
                    name="Positivo"
                    stroke={COLORS.positive}
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="neutral"
                    name="Neutro"
                    stroke={COLORS.neutral}
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="negative"
                    name="Negativo"
                    stroke={COLORS.negative}
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Tendência Geral
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    Sentimento Médio
                  </p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {stats.total > 0
                      ? (
                          (stats.positive * 1 +
                            stats.neutral * 0 -
                            stats.negative * 1) /
                          stats.total
                        ).toFixed(2)
                      : 0}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    Escala de -1 (negativo) a 1 (positivo)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Distribuição
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                  <span className="text-sm font-medium">Positivo</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {stats.total > 0
                      ? ((stats.positive / stats.total) * 100).toFixed(1)
                      : 0}
                    %
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                  <span className="text-sm font-medium">Neutro</span>
                  <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                    {stats.total > 0
                      ? ((stats.neutral / stats.total) * 100).toFixed(1)
                      : 0}
                    %
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-rose-50 dark:bg-rose-900/20">
                  <span className="text-sm font-medium">Negativo</span>
                  <span className="text-sm font-bold text-rose-600 dark:text-rose-400">
                    {stats.total > 0
                      ? ((stats.negative / stats.total) * 100).toFixed(1)
                      : 0}
                    %
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Período Selecionado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    Agregação
                  </p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white capitalize">
                    {(() => {
                      if (period === "day") return "Diária";
                      if (period === "week") return "Semanal";
                      return "Mensal";
                    })()}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    {chartData.length} pontos de dados
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
