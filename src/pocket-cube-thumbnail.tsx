import React, { useEffect } from 'react';
import { useRef } from 'react';

const vec = (x, y, z) => ({ x, y, z });
const sub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
const cross = (a, b) => ({ x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x });
const dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;
const normalize = (a) => {
  const l = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
  return { x: a.x / l, y: a.y / l, z: a.z / l };
};

const camera = (eye, target, aspect) => {
  const up = { x: 0.0, y: 0.0, z: 1.0 };
  const fov = 60.0;
  const znear = 0.1;
  const zfar = 1000.0;

  const f = normalize(sub(target, eye));
  const s = normalize(cross(f, up));
  const u = cross(s, f);
  const t = { x: -dot(s, eye), y: -dot(u, eye), z: -dot(f, eye) };

  const r0 = Math.tan(fov * 0.008726646259971647884618453842);
  const r1 = r0 * Math.max(1.0 / aspect, 1.0);
  const r2 = r0 * Math.max(aspect, 1.0);
  const r3 = (zfar + znear) / (zfar - znear);
  const r4 = (2.0 * zfar * znear) / (zfar - znear);

  return new Float32Array([
    s.x / r2, u.x / r1, r3 * f.x, f.x,
    s.y / r2, u.y / r1, r3 * f.y, f.y,
    s.z / r2, u.z / r1, r3 * f.z, f.z,
    t.x / r2, t.y / r1, r3 * t.z - r4, t.z,
  ]);
};

const quatmul = (a, b) => ({
  x: a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y,
  y: a.w * b.y + a.y * b.w + a.z * b.x - a.x * b.z,
  z: a.w * b.z + a.z * b.w + a.x * b.y - a.y * b.x,
  w: a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z,
});

const qtransform = (a, b) => {
  const tx = b.y * a.z - a.y * b.z - a.w * b.x;
  const ty = a.x * b.z - b.x * a.z - a.w * b.y;
  const tz = b.x * a.y - a.x * b.y - a.w * b.z;
  return {
    x: b.x + (ty * a.z - a.y * tz) * 2.0,
    y: b.y + (a.x * tz - tx * a.z) * 2.0,
    z: b.z + (tx * a.y - a.x * ty) * 2.0,
  };
};

const u = 0.9;
const v = 0.9707;
const w = 0.9577;

const rgb = (r, g, b) => [r / 255, g / 255, b / 255];

const c0 = rgb(0, 0, 0);
const c1 = rgb(255, 88, 0);
const c2 = rgb(0, 155, 72);
const c3 = rgb(255, 213, 0);
const c4 = rgb(183, 18, 52);
const c5 = rgb(0, 70, 173);
const c6 = rgb(255, 255, 255);

const rect = (f, ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz, r, g, b) => [
  ...f(ax, ay, az), r, g, b,
  ...f(bx, by, bz), r, g, b,
  ...f(cx, cy, cz), r, g, b,
  ...f(ax, ay, az), r, g, b,
  ...f(cx, cy, cz), r, g, b,
  ...f(dx, dy, dz), r, g, b,
];

const face = (f, [r, g, b]) => [
  ...rect(f, u, u, 1, -u, u, 1, -u, -u, 1, u, -u, 1, r, g, b),
  ...rect(f, -u, -u, 1, -v, -u, v, -w, -w, w, -u, -v, v, 0, 0, 0),
  ...rect(f, -u, u, 1, -u, v, v, -w, w, w, -v, u, v, 0, 0, 0),
  ...rect(f, u, -u, 1, u, -v, v, w, -w, w, v, -u, v, 0, 0, 0),
  ...rect(f, u, u, 1, v, u, v, w, w, w, u, v, v, 0, 0, 0),
  ...rect(f, -u, -u, 1, -u, u, 1, -v, u, v, -v, -u, v, 0, 0, 0),
  ...rect(f, -u, u, 1, u, u, 1, u, v, v, -u, v, v, 0, 0, 0),
  ...rect(f, u, u, 1, u, -u, 1, v, -u, v, v, u, v, 0, 0, 0),
  ...rect(f, u, -u, 1, -u, -u, 1, -u, -v, v, u, -v, v, 0, 0, 0),
];

const cube = (f, c1, c2, c3, c4, c5, c6) => [
  ...face((x, y, z) => f(-z, x, y), c1),
  ...face((x, y, z) => f(x, -z, y), c2),
  ...face((x, y, z) => f(x, y, -z), c3),
  ...face((x, y, z) => f(z, x, y), c4),
  ...face((x, y, z) => f(x, z, y), c5),
  ...face((x, y, z) => f(x, y, z), c6),
];

const vertexData = new Float32Array([
  ...cube((x, y, z) => [x - 1, y - 1, z - 1], c1, c2, c3, c0, c0, c0),
  ...cube((x, y, z) => [x - 1, y - 1, z + 1], c1, c2, c0, c0, c0, c6),
  ...cube((x, y, z) => [x - 1, y + 1, z - 1], c1, c0, c3, c0, c5, c0),
  ...cube((x, y, z) => [x - 1, y + 1, z + 1], c1, c0, c0, c0, c5, c6),
  ...cube((x, y, z) => [x + 1, y - 1, z - 1], c0, c2, c3, c4, c0, c0),
  ...cube((x, y, z) => [x + 1, y - 1, z + 1], c0, c2, c0, c4, c0, c6),
  ...cube((x, y, z) => [x + 1, y + 1, z - 1], c0, c0, c3, c4, c5, c0),
  ...cube((x, y, z) => [x + 1, y + 1, z + 1], c0, c0, c0, c4, c5, c6),
]);

const corners = [
  { x: -1, y: -1, z: -1 },
  { x: -1, y: -1, z: 1 },
  { x: -1, y: 1, z: -1 },
  { x: -1, y: 1, z: 1 },
  { x: 1, y: -1, z: -1 },
  { x: 1, y: -1, z: 1 },
  { x: 1, y: 1, z: -1 },
  { x: 1, y: 1, z: 1 },
];

const vertexShaderCode = `
  #version 300 es
  precision highp float;

  vec3 qtransform(vec4 q, vec3 v) {
    return v + 2.0 * cross(cross(v, q.xyz) - q.w * v, q.xyz);
  }

  uniform mat4 mvp;
  uniform vec4 rotation;

  layout (location = 0) in vec3 in_vertex;
  layout (location = 1) in vec3 in_color;

  out vec3 v_color;

  void main() {
    v_color = in_color;
    gl_Position = mvp * vec4(qtransform(rotation, in_vertex), 1.0);
  }
`;

const fragmentShaderCode = `
  #version 300 es
  precision highp float;

  in vec3 v_color;

  layout (location = 0) out vec4 out_color;

  void main() {
    out_color = vec4(v_color, 1.0);
  }
`;

export const PocketCubeThumbnail = ({ size, resolution }) => {
  const ref = useRef(null);

  useEffect(() => {

    const rotations = [
      { x: 0, y: 0, z: 0, w: 1 },
      { x: 0, y: 0, z: 0, w: 1 },
      { x: 0, y: 0, z: 0, w: 1 },
      { x: 0, y: 0, z: 0, w: 1 },
      { x: 0, y: 0, z: 0, w: 1 },
      { x: 0, y: 0, z: 0, w: 1 },
      { x: 0, y: 0, z: 0, w: 1 },
      { x: 0, y: 0, z: 0, w: 1 },
    ];

    const turn = (layer, angle) => {
      for (let i = 0; i < 8; i++) {
        const t = qtransform(rotations[i], corners[i]);
        if ((layer === 0 && t.x < 0) || (layer === 1 && t.x > 0)) {
          rotations[i] = quatmul({ x: Math.sin(angle / 2), y: 0, z: 0, w: Math.cos(angle / 2) }, rotations[i]);
        }
        if ((layer === 2 && t.y < 0) || (layer === 3 && t.y > 0)) {
          rotations[i] = quatmul({ x: 0, y: Math.sin(angle / 2), z: 0, w: Math.cos(angle / 2) }, rotations[i]);
        }
        if ((layer === 4 && t.z < 0) || (layer === 5 && t.z > 0)) {
          rotations[i] = quatmul({ x: 0, y: 0, z: Math.sin(angle / 2), w: Math.cos(angle / 2) }, rotations[i]);
        }
      }
    };

    for (let i = 0; i < 100; i++) {
      turn(Math.floor(Math.random() * 6), Math.random() > 0.5 ? -Math.PI / 2 : Math.PI / 2)
    }

    function Select(prevLayer) {
      const self = this;
      self.next = () => {
        const frames = 20;
        const angle = Math.random() > 0.5 ? -Math.PI / 2 / frames : Math.PI / 2 / frames;
        let layer = prevLayer;
        while ((layer >> 1) === (prevLayer >> 1)) {
          layer = Math.floor(Math.random() * 6);
        }
        return new Turn(layer, angle, frames);
      };
    };

    function Turn(layer, angle, frames) {
      const self = this;
      self.counter = frames;
      self.layer = layer;
      self.angle = angle;
      self.next = () => {
        turn(self.layer, self.angle);
        self.counter -= 1;
        if (self.counter === 0) {
          return new Select(self.layer);
        }
        return self;
      };
    };

    const gl = ref.current.getContext('webgl2') as WebGL2RenderingContext;

    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 24, 12);
    gl.enableVertexAttribArray(0);
    gl.enableVertexAttribArray(1);

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

    const mvpUniform = gl.getUniformLocation(prog, 'mvp');
    const rotationUniform = gl.getUniformLocation(prog, 'rotation');

    let anim = null;
    let stateMachine = new Select(0);
    let t = 0;

    const render = () => {
      stateMachine = stateMachine.next();
      t += 0.03;

      gl.viewport(0, 0, resolution, resolution);
      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.enable(gl.DEPTH_TEST);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.useProgram(prog);
      gl.bindVertexArray(vao);

      const mvp = camera(vec(Math.cos(t) * 8.0, Math.sin(t) * 8.0, 3.5), vec(0.0, 0.0, 0.0), 1.0);
      gl.uniformMatrix4fv(mvpUniform, false, mvp);

      for (let i = 0; i < 8; i++) {
        gl.uniform4f(rotationUniform, rotations[i].x, rotations[i].y, rotations[i].z, rotations[i].w);
        gl.drawArrays(gl.TRIANGLES, 324 * i, 324);
      }

      anim = requestAnimationFrame(render);
    };

    anim = requestAnimationFrame(render);

    return () => {
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
