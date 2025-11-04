"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  Loader2,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Calendar,
  Image as ImageIcon,
} from "lucide-react";
import {
  getAllPosts,
  getPostWithComments,
} from "@/services/sentiments.service";
import { PaginatedPosts, PostWithComments } from "@/@types/sentiments.type";
import Image from "next/image";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import PostDetailDialog from "./PostDetailDialog";

const COLORS = {
  positive: "#34d399",
  neutral: "#fbbf24",
  negative: "#f87171",
};

interface SentimentStat {
  sentiment: string;
  count: string | number;
  percentage: string | number;
}

const getPrevailingSentiment = (
  sentimentsStats: SentimentStat[] | undefined
) => {
  if (!sentimentsStats || sentimentsStats.length === 0) {
    return { sentiment: "neutral", percentage: 0 };
  }

  const prevailing = sentimentsStats.reduce((prev, current) => {
    return Number(current.count) > Number(prev.count) ? current : prev;
  }, sentimentsStats[0]);

  return {
    sentiment: prevailing.sentiment,
    percentage: Number(prevailing.percentage) || 0,
  };
};

export default function PostsScreen() {
  const [postsData, setPostsData] = useState<PaginatedPosts | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<PostWithComments | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loadingPost, setLoadingPost] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const fetchPosts = async (page: number) => {
    try {
      setLoading(true);
      const data = await getAllPosts(page, 12);
      setPostsData(data);
    } catch (error) {
      console.error("Erro ao carregar posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = async (postId: string) => {
    try {
      setLoadingPost(postId);
      const postData = await getPostWithComments(postId);
      setSelectedPost(postData);
      setDialogOpen(true);
    } catch (error) {
      console.error("Erro ao carregar detalhes do post:", error);
    } finally {
      setLoadingPost(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="animate-spin w-8 h-8 text-slate-400 mx-auto mb-4" />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Carregando posts...
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
          <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Posts
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Visualize e analise todos os seus posts
          </p>
        </div>
      </div>

      {/* Posts Grid */}
      {postsData && postsData.content.length > 0 ? (
        <>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {postsData.content.map((post, index) => {
              const prevailing = getPrevailingSentiment(post.sentimentsStats);
              const sentimentColor =
                COLORS[prevailing.sentiment as keyof typeof COLORS] ||
                COLORS.neutral;

              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className="hover:shadow-lg transition-all cursor-pointer group"
                    onClick={() => handlePostClick(post.id)}
                  >
                    <CardContent className="p-0">
                      {/* Image/Media */}
                      {post.s3MediaUrl || post.mediaUrl ? (
                        <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                          <Image
                            src={post.s3MediaUrl || post.mediaUrl || ""}
                            alt={post.caption || "Post image"}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="w-full h-48 bg-slate-100 dark:bg-slate-800 flex items-center justify-center rounded-t-lg">
                          <ImageIcon className="w-12 h-12 text-slate-400" />
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-4 space-y-3">
                        {/* Caption */}
                        {post.caption && (
                          <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">
                            {post.caption}
                          </p>
                        )}

                        {/* Metadata */}
                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                          {post.timestamp && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>
                                {format(new Date(post.timestamp), "dd/MM/yyyy")}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Sentiment Badge */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: sentimentColor }}
                            ></div>
                            <span
                              className="text-xs font-medium capitalize"
                              style={{ color: sentimentColor }}
                            >
                              {(() => {
                                if (prevailing.sentiment === "positive")
                                  return "Positivo";
                                if (prevailing.sentiment === "negative")
                                  return "Negativo";
                                return "Neutro";
                              })()}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              ({prevailing.percentage.toFixed(1)}%)
                            </span>
                          </div>
                          {loadingPost === post.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                          ) : (
                            <MessageCircle className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Pagination */}
          {postsData.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchPosts(postsData.page - 1)}
                disabled={postsData.isFirstPage}
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </Button>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Página {postsData.page} de {postsData.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchPosts(postsData.page + 1)}
                disabled={postsData.isLastPage}
              >
                Próxima
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
            Nenhum post encontrado
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
            Seus posts aparecerão aqui quando estiverem disponíveis
          </p>
        </div>
      )}

      {/* Post Detail Dialog */}
      {selectedPost && (
        <PostDetailDialog
          post={selectedPost}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
    </div>
  );
}
