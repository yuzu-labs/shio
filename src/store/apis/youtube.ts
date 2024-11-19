import client from '../../utils/http';

const youtubeAPI = {
  getVideos: (videoId: string, part: string) =>
    client
      .get('/youtube/videos', {
        params: {
          vid: videoId,
          part,
        },
      })
      .then((response) => response.data),
};

export default youtubeAPI;
