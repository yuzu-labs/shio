import client from '../../utils/http';

const reportAPI = {
  getTranscript: (videoId: string) =>
    client
      .get(`/transcript`, {
        params: {
          vid: videoId,
        },
      })
      .then((response) => response.data),
};

export default reportAPI;
