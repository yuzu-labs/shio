import React from 'react';
import { Box } from '@mui/joy';
import styles from './Mesh.module.scss';

type Props = {};

const Mesh = (props: Props) => {
  return (
    <>
      <Box
        sx={{
          position: 'absolute', // Absolute positioning
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}>
          <h1>Mesh Page</h1>
        </Box>
      </Box>
      <div className={styles['mesh-container']}>
        <div id={styles['bg-shape1']} className={styles['mesh-shape']}></div>
        <div id={styles['bg-shape2']} className={styles['mesh-shape']}></div>
        <div id={styles['bg-shape3']} className={styles['mesh-shape']}></div>
      </div>
    </>
  );
};

export default Mesh;
