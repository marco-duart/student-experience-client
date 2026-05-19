import type { YouTubeVideo } from "@/types/domain";
import { prototypeMocks } from "@/lib/mock/prototype-data";

export const youtubeService = {
  async fetchChannelVideos(maxResults = 12): Promise<YouTubeVideo[]> {
    return prototypeMocks.videos(maxResults);
  },

  getChannelUrl(): string | null {
    return "/app/talks";
  },
};
