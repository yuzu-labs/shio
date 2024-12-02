import React from 'react';
import YouTube from 'react-youtube';
import './YoutubeEmbed.scss';

type Props = React.ComponentProps<'div'> & {
  vid: string;
};

const YoutubeEmbed = (props: Props) => {
  return <YouTube id={props.id} className="shio-youtube__container" videoId={props.vid} />;
};

export default YoutubeEmbed;
