import React, { useEffect } from 'react';
import { useRef } from 'react';

const vertexShaderCode = `
  #version 300 es
  precision highp float;

  mat4 perspective(float fovy, float aspect, float znear, float zfar) {
    float tan_half_fovy = tan(fovy * 0.008726646259971647884618453842);
    return mat4(
      1.0 / (aspect * tan_half_fovy), 0.0, 0.0, 0.0,
      0.0, 1.0 / (tan_half_fovy), 0.0, 0.0,
      0.0, 0.0, -(zfar + znear) / (zfar - znear), -1.0,
      0.0, 0.0, -(2.0 * zfar * znear) / (zfar - znear), 0.0
    );
  }

  mat4 lookat(vec3 eye, vec3 center, vec3 up) {
    vec3 f = normalize(center - eye);
    vec3 s = normalize(cross(f, up));
    vec3 u = cross(s, f);
    return mat4(
      s.x, u.x, -f.x, 0.0,
      s.y, u.y, -f.y, 0.0,
      s.z, u.z, -f.z, 0.0,
      -dot(s, eye), -dot(u, eye), dot(f, eye), 1.0
    );
  }

  const float pi = 3.1415926535897932384626;

  vec3 positions[4] = vec3[](
    vec3(0.0, 0.0, 0.5),
    vec3(0.0, 1.0, -0.5),
    vec3(1.0, 0.0, 0.5),
    vec3(1.0, 1.0, -0.5)
  );

  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  uniform vec2 offset;

  out vec3 v_vertex;
  out vec3 v_color;

  void main() {
    mat4 projection = perspective(45.0, 1.0, 0.1, 1000.0);
    mat4 view = lookat(vec3(offset.x, 4.0, offset.y), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 1.0));
    mat4 mvp = projection * view;

    v_vertex = positions[gl_VertexID];

    float r = pi - float(gl_InstanceID) * pi * 2.0 / 7.0;
    mat3 rotation = mat3(cos(r), 0.0, sin(r), 0.0, 1.0, 0.0, -sin(r), 0.0, cos(r));

    gl_Position = mvp * vec4(rotation * v_vertex, 1.0);
    v_color = hsv2rgb(vec3(float(gl_InstanceID) / 10.0, 1.0, 0.5));
  }
`;

const fragmentShaderCode = `
  #version 300 es
  precision highp float;

  in vec3 v_vertex;
  in vec3 v_color;

  layout (location = 0) out vec4 out_color;

  void main() {
    float u = smoothstep(0.48, 0.47, abs(v_vertex.x - 0.5));
    float v = smoothstep(0.48, 0.47, abs(v_vertex.y - 0.5));
    out_color = vec4(v_color * (u * v), 1.0);
    out_color.rgb = pow(out_color.rgb, vec3(1.0 / 2.2));
  }
`;

const clip = ({ x, y }) => {
  const length = Math.sqrt(x * x + y * y);
  if (length > 1.0) {
    return { x: x / length, y: y / length };
  }
  return { x, y };
};

export const ZenglThumbnail = ({ size, resolution }) => {
  const ref = useRef(null);
  const hover = useRef({ x: 0, y: 0});

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
      gl.uniform2f(gl.getUniformLocation(prog, 'offset'), hover.current.x, hover.current.y);
      anim = requestAnimationFrame(render);
    };

    const mousemove = (evt) => {
      const rect = ref.current.getBoundingClientRect();
      const cx = (rect.left + rect.right) / 2.0;
      const cy = (rect.top + rect.bottom) / 2.0;
      hover.current = clip({ x: (evt.clientX - cx) / resolution, y: (evt.clientY - cy) / resolution });
    };

    document.addEventListener('mousemove', mousemove);
    anim = requestAnimationFrame(render);

    return () => {
      document.removeEventListener('mousemove', mousemove);
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
  )
};
