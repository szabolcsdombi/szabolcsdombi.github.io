import React from 'react';

export const PythonThumbnail = ({ size }) => {
  return (
    <svg
      viewBox="0 0 200 200"
      style={{
        width: size,
        height: size,
      }}
    >
      <defs>
        <linearGradient id="linear-gradient-1" x1="486.72" y1="-53.76" x2="654.75" y2="-198.34" gradientTransform="translate(-264 -12.84) scale(.56 -.57)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#5a9fd4"/>
          <stop offset="1" stopColor="#306998"/>
        </linearGradient>
        <linearGradient id="linear-gradient-2" x1="719.72" y1="-285.84" x2="659.71" y2="-200.94" gradientTransform="translate(-264 -12.84) scale(.56 -.57)" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffd43b"/>
          <stop offset="1" stopColor="#ffe873"/>
        </linearGradient>
      </defs>
      <path fill="url(#linear-gradient-1)" d="m98.85,29.14c-5.73.03-11.2.52-16.02,1.37-14.18,2.51-16.76,7.75-16.76,17.42v12.77h33.52v4.26h-46.09c-9.74,0-18.27,5.85-20.94,16.99-3.08,12.77-3.21,20.73,0,34.06,2.38,9.92,8.07,16.99,17.81,16.99h11.52v-15.31c0-11.06,9.57-20.82,20.94-20.82h33.48c9.32,0,16.76-7.67,16.76-17.03v-31.91c0-9.08-7.66-15.91-16.76-17.42-5.76-.96-11.73-1.39-17.46-1.37Zm-18.12,10.27c3.46,0,6.29,2.87,6.29,6.41s-2.83,6.37-6.29,6.37-6.29-2.85-6.29-6.37,2.81-6.41,6.29-6.41Z"/>
      <path fill="url(#linear-gradient-2)" d="m137.24,64.96v14.88c0,11.54-9.78,21.25-20.94,21.25h-33.48c-9.17,0-16.76,7.85-16.76,17.03v31.91c0,9.08,7.9,14.43,16.76,17.03,10.61,3.12,20.78,3.68,33.48,0,8.44-2.44,16.76-7.36,16.76-17.03v-12.77h-33.48v-4.26h50.23c9.74,0,13.37-6.79,16.76-16.99,3.5-10.5,3.35-20.59,0-34.06-2.41-9.7-7-16.99-16.76-16.99h-12.58Zm-18.83,80.82c3.47,0,6.29,2.85,6.29,6.37s-2.81,6.41-6.29,6.41-6.29-2.87-6.29-6.41,2.83-6.37,6.29-6.37Z"/>
    </svg>
  );
};
