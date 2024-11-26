import React from 'react';
import YouTube from 'react-youtube';
import './YoutubeEmbed.scss';

type Props = {};

const YoutubeEmbed = (props: Props) => {
  return (
    <YouTube
      className="youtube-container"
      videoId="jDkdZd4f4S4"
      onReady={(e) => {
        console.log('ready');
      }}
    />
  );
};

export default YoutubeEmbed;
