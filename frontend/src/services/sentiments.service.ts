import axiosInstance from "@/services/interceptor";

export const getDashboardOverview = async () => {
  try {
    const response = await axiosInstance.get(`/sentiments/dashboard/overview`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getSentimentsTrend = async (days: number = 30) => {
  try {
    const response = await axiosInstance.get(`/sentiments/trend`, {
      params: { days },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getTopEmotions = async (limit: number = 10) => {
  try {
    const response = await axiosInstance.get(`/sentiments/emotions/top`, {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getTopEngagedPosts = async (limit: number = 5) => {
  try {
    const response = await axiosInstance.get(`/sentiments/posts/top-engaged`, {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getToneAnalysis = async () => {
  try {
    const response = await axiosInstance.get(`/sentiments/tone/analysis`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getSarcasmStats = async () => {
  try {
    const response = await axiosInstance.get(`/sentiments/sarcasm/stats`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getRecentCommentsWithSentiment = async (limit: number = 10) => {
  try {
    const response = await axiosInstance.get(`/sentiments/comments/recent`, {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getImpactAnalysis = async () => {
  try {
    const response = await axiosInstance.get(`/sentiments/impact/analysis`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllSentiments = async () => {
  try {
    const response = await axiosInstance.get(`/sentiments`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllPosts = async (page: number = 1, size: number = 10) => {
  try {
    const response = await axiosInstance.get(`/sentiments/posts`, {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};