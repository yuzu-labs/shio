import client from '../../utils/http';

const reportAPI = {
  getTranscript: (videoId: string) =>
    client
      .get(`https://youtubetranscript.com`, {
        params: {
          server_vid2: videoId,
        },
      })
      .then((response) => response.data),
};

export default reportAPI;
