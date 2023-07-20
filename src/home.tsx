import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ZenglThumbnail } from './zengl-thumbnail';
import { ModernglThumbnail } from './moderngl-thumbnail';
import { PythonThumbnail } from './python-thumbnail';
import { BlenderThumbnail } from './blender-thumbnail';

const Post = ({ thumbnail, title, description, href }) => {
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();

  return (
    <a
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: '100%',
        backgroundColor: hover ? '#303030' : '#1e1e1e',
        display: 'flex',
        cursor: 'pointer',
      }}
    >
      <div
        style={{ flexShrink: 0 }}
      >
        {thumbnail}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '200px',
          overflow: 'hidden',
          flexGrow: 1,
        }}
      >
        <h5
          style={{
            fontSize: '24px',
            fontWeight: '500',
            margin: '18px 12px',
          }}
        >
          {title}
        </h5>
        <p
          style={{
            margin: '0 12px',
            color: '#ddd',
          }}
        >
          {description}
        </p>
      </div>
    </a>
  );
};

export const Home = () => {
  return (
    <>
      <div style={{ height: '60px' }} />
      <div
        style={{
          maxWidth: '725px',
          margin: 'auto',
        }}
      >
        Welcome to my personal website!
        This site serves as a digital reflection of my journey through the ever-evolving world of technology.
        Here, you'll find a collection of my personal projects, showcasing my expertise in various programming languages and frameworks.
      </div>
      <div style={{ height: '60px' }} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '10px',
          flexFlow: 'wrap',
          maxWidth: '800px',
          margin: 'auto',
        }}
      >
        <Post
          href="https://szabolcsdombi.com/otto-simulator/"
          thumbnail={<PythonThumbnail size={200} />}
          title="Otto Simulator"
          description="This project brings Otto to your browser. Even better, it allows you to simulate Otto within Python. The simulation implements the Gym Interface."
        />
        <Post
          href="https://github.com/szabolcsdombi/blender-docker-cli"
          thumbnail={<BlenderThumbnail size={200} />}
          title="Blender in Docker"
          description="Exporting assets as a build step and more."
        />
        <Post
          href="https://github.com/szabolcsdombi/zengl/discussions/37"
          thumbnail={<PythonThumbnail size={200} />}
          title="ZenGL and ModernGL"
          description="Why did I built two OpenGL Rendering libraries for Python?"
        />
        <Post
          href="https://szabolcsdombi.github.io/web-gym/"
          thumbnail={<PythonThumbnail size={200} />}
          title="Gym in the Browser"
          description="Gymnasium is a maintained fork of OpenAI's Gym library. This experiment intends to bring it to the web for demo purposes."
        />
        <Post
          href="https://github.com/szabolcsdombi/zengl"
          thumbnail={<ZenglThumbnail size={200} resolution={600} />}
          title="ZenGL"
          description="Self-Contained OpenGL Rendering Pipelines for Python."
        />
        <Post
          href="https://github.com/moderngl/moderngl"
          thumbnail={<ModernglThumbnail size={200} resolution={600} />}
          title="ModernGL"
          description="ModernGL is a Python wrapper over OpenGL that simplifies the creation of simple graphics applications like scientific simulations, games or user interfaces."
        />
        <Post
          href="https://github.com/szabolcsdombi/python-rigging"
          thumbnail={<PythonThumbnail size={200} />}
          title="Python Rigging"
          description="Python extension for rigging."
        />
        <Post
          href="https://github.com/szabolcsdombi/python-terrain"
          thumbnail={<PythonThumbnail size={200} />}
          title="Python Terrain"
          description="Python extension for terrain manipulation."
        />
        <Post
          href="https://github.com/szabolcsdombi/python-mesh-join"
          thumbnail={<PythonThumbnail size={200} />}
          title="Python Mesh Join"
          description="Python extension for joining indexed meshes."
        />
        <Post
          href="https://github.com/szabolcsdombi/python-capsule-shape"
          thumbnail={<PythonThumbnail size={200} />}
          title="Python Capsule Shape"
          description="Python extension for creating a renderable capsule shape."
        />
        <Post
          href="https://github.com/szabolcsdombi/python-depth-sort"
          thumbnail={<PythonThumbnail size={200} />}
          title="Python Depth Sort"
          description="Python extension for sorting the triangles of a mesh."
        />
        <Post
          href="https://github.com/szabolcsdombi/python-bezier"
          thumbnail={<PythonThumbnail size={200} />}
          title="Python Bezier"
          description="Python extension for generate=ing cubic bezier curves."
        />
        <Post
          href="https://github.com/szabolcsdombi/python-camera"
          thumbnail={<PythonThumbnail size={200} />}
          title="Python Camera"
          description="Python extension implementing a simple camera for 3D projects."
        />
        <Post
          href="https://github.com/szabolcsdombi/python-mesh-raycast"
          thumbnail={<PythonThumbnail size={200} />}
          title="Python Mesh Raycast"
          description="Python extension for calculating ray and triangle intersections."
        />
        <Post
          href="https://github.com/szabolcsdombi/python-mesh-normals"
          thumbnail={<PythonThumbnail size={200} />}
          title="Python Mesh Normals"
          description="Python extension for generating mesh normals from vertex data."
        />
        <Post
          href="https://github.com/szabolcsdombi/python-quickhull"
          thumbnail={<PythonThumbnail size={200} />}
          title="Python Quickhull"
          description="Python extension for building convex hulls from points."
        />
        <Post
          href="https://github.com/szabolcsdombi/python-compute-shader"
          thumbnail={<PythonThumbnail size={200} />}
          title="Python Compute Shapder"
          description="Python extension interfacing the OpenGL Compute Shaders and Storage Buffers."
        />
      </div>
      <div style={{ height: '60px' }} />
    </>
  );
};
