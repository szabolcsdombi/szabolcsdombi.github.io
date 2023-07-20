import React from 'react';
import { HomeIcon } from './home-icon';
import { GitHubIcon } from './github-icon';
import { useNavigate } from 'react-router-dom';

const ProfilePicture = () => {
  return (
    <div
      style={{
        flexGrow: 1,
        gap: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        padding: '12px 0',
        userSelect: 'none',
      }}
    >
      <img
        alt="Profile Picture"
        src="https://avatars.githubusercontent.com/u/11232402?v=4"
        style={{
          width: '86px',
          height: '86px',
          borderRadius: '50%',
          border: '1px solid black',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          fontSize: '28px',
          textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
          fontWeight: '500',
          whiteSpace: 'nowrap',
        }}
      >
        Szabolcs Dombi
      </div>
    </div>
  );
};

export const TopBar = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        backgroundColor: '#111',
        borderBottom: '1px solid black',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
      }}
    >
      <a
        href="/"
        onClick={(evt) => {
          evt.preventDefault();
          navigate('/');
        }}
        style={{
          display: 'block',
          width: '24px',
          height: '24px',
          margin: '12px',
        }}
      >
        <HomeIcon />
      </a>
      <ProfilePicture />
      <a
        href="https://github.com/szabolcsdombi/"
        style={{
          display: 'block',
          width: '24px',
          height: '24px',
          margin: '12px',
        }}
      >
        <GitHubIcon />
      </a>
    </div>
  );
};
