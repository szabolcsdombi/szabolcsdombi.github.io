import React, { useEffect } from 'react';
import { useRef } from 'react';

const vertexShaderCode = `
  #version 300 es
  precision highp float;

  vec2 vertex[3] = vec2[](
    vec2(1.0, 0.0),
    vec2(-0.5, -0.86),
    vec2(-0.5, 0.86)
  );

  vec3 color[3] = vec3[](
    vec3(0.0, 0.0, 1.0),
    vec3(0.0, 1.0, 0.0),
    vec3(1.0, 0.0, 0.0)
  );

  const float pi = 3.1415926535897932384626;

  uniform float state;

  out vec3 v_color;

  void main() {
    v_color = color[gl_VertexID];
    float r = (float(gl_InstanceID) - 4.0) * (state * 0.28);
    mat2 rot = mat2(cos(r), -sin(r), sin(r), cos(r));
    gl_Position = vec4(rot * vertex[gl_VertexID] * 0.95, 0.0, 1.0);
  }
`;

const fragmentShaderCode = `
  #version 300 es
  precision highp float;

  in vec3 v_color;
  out vec4 f_color;

  void main() {
    f_color = vec4(pow(v_color, vec3(1.0 / 2.2)), 1.0);
  }
`;

const near = ({ x, y }) => 1.0 - Math.min(Math.sqrt(x * x + y * y) - 0.1, 1.0);

export const ModernglThumbnail = ({ size, resolution }) => {
  const ref = useRef(null);
  const hover = useRef(1.0);

  useEffect(() => {
    const gl = ref.current.getContext('webgl2') as WebGL2RenderingContext;

    const vs = gl.createShader(gl.VERTEX_SHADER);
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(vs, vertexShaderCode.trim());
    gl.shaderSource(fs, fragmentShaderCode.trim());
    gl.compileShader(vs);
    gl.compileShader(fs);

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);

    let anim = null;

    const render = () => {
      gl.viewport(0, 0, resolution, resolution);
      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.enable(gl.DEPTH_TEST);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.useProgram(prog);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, 7);
      gl.uniform1f(gl.getUniformLocation(prog, 'state'), hover.current);
      anim = requestAnimationFrame(render);
    };

    const mousemove = (evt) => {
      const { clientX, clientY } = evt;
      const rect = ref.current.getBoundingClientRect();
      const cx = (rect.left + rect.right) / 2.0;
      const cy = (rect.top + rect.bottom) / 2.0;
      hover.current = near({ x: (clientX - cx) / resolution, y: (clientY - cy) / resolution });
    };

    const touchmove = (evt) => {
      const { clientX, clientY } = evt.touches[0];
      const rect = ref.current.getBoundingClientRect();
      const cx = (rect.left + rect.right) / 2.0;
      const cy = (rect.top + rect.bottom) / 2.0;
      hover.current = near({ x: (clientX - cx) / resolution, y: (clientY - cy) / resolution });
    };

    document.addEventListener('mousemove', mousemove);
    document.addEventListener('touchmove', touchmove);
    anim = requestAnimationFrame(render);

    return () => {
      document.removeEventListener('mousemove', mousemove);
      document.removeEventListener('touchmove', touchmove);
      cancelAnimationFrame(anim);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      width={resolution}
      height={resolution}
      style={{
        width: size,
        height: size,
      }}
    />
  );
};
