export const getYoutubeVideoId = (url: string) => {
  const pattern =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/|youtube\.com\/v\/|youtube\.com\/attribution_link\?.*v%3D)([a-zA-Z0-9_-]{11})/;
  const match = url.match(pattern);

  return match ? match[1] : null;
};

export const isValidYoutubeVideoID = (videoId: string) => /^[a-zA-Z0-9_-]{11}$/.test(videoId);
