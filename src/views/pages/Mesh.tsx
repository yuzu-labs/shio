import React from 'react';
import './Mesh.scss';

type Props = {};

const Mesh = (props: Props) => {
  return (
    <div className="absolute">
      <div className="absolute inset-0 justify-center">
        <div id="bg-shape1" className="opacity-50 bg-blur"></div>
        <div id="bg-shape2" className="opacity-50 bg-blur"></div>
        <div id="bg-shape3" className="opacity-50 bg-blur"></div>
      </div>
      <div className="front">
        <h1>Hello World.</h1>
      </div>
    </div>
  );
};

export default Mesh;
