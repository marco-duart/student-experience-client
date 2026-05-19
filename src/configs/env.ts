const env = {
  BASE_URL: import.meta.env.VITE_BASE_URL as string,
  API_KEY: import.meta.env.VITE_API_KEY as string,
  YOUTUBE_API_KEY: import.meta.env.VITE_YOUTUBE_API_KEY as string,
  YOUTUBE_USER_ID: import.meta.env.VITE_YOUTUBE_USER_ID as string | undefined,
  YOUTUBE_CHANNEL_ID: import.meta.env.VITE_YOUTUBE_CHANNEL_ID as
    | string
    | undefined,
};

export { env };
