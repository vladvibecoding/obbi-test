//# allFunctionsCalledOnLoad
import{$ as e,Cr as t,P as n,St as r,Tt as i,Ut as a,Xn as o,Z as s,qn as c,v as l,wr as u,wt as d}from"./three.core-DVTiNhEy.js";import{o as f}from"./src-BI6MMqKu.js";import{n as p,r as m,t as h}from"./trail-shape-BsaeWHuc.js";import{t as g}from"./trail-slots-BYU9mmsR.js";var _=e=>new l().setHex(f(e),c);function v(e,t,n,r){return new o({name:e,vertexShader:t,uniforms:{...n,snowWhite:{value:_(`white`)},snowFog:{value:_(`fog`)},snowIce:{value:_(`cyan/2`)}},transparent:!0,depthWrite:!1,depthTest:!0,side:2,forceSinglePass:!0,blending:1,toneMapped:!0,fragmentShader:`
      #include <common>
      #include <logdepthbuf_pars_fragment>
      uniform vec3 snowWhite, snowFog, snowIce;
      varying vec2 vSnowUv;
      varying float vSnowFade, vSnowAge, vSnowSeed;

      float snowSegment(vec2 p, vec2 start, vec2 end) {
        vec2 axis = end - start;
        float along = clamp(dot(p - start, axis) / dot(axis, axis), 0.0, 1.0);
        return length(p - start - axis * along);
      }

      void main() {
        if (vSnowFade < 0.003) discard;
        vec2 p = vSnowUv * 2.0 - 1.0;
        float radius = length(p);
        ${r===`flake`?`
        // Сворачиваем шесть одинаковых лучей в один сектор; веточки симметричны.
        float angle = mod(atan(p.y, p.x) + PI / 6.0, PI / 3.0) - PI / 6.0;
        vec2 branch = vec2(cos(angle), abs(sin(angle))) * radius;
        float variation = fract(vSnowSeed * 0.719) - 0.5;
        float distanceToFlake = snowSegment(branch, vec2(0.055, 0.0), vec2(0.88, 0.0))
          - (0.053 + variation * 0.014);
        distanceToFlake = min(distanceToFlake,
          snowSegment(branch, vec2(0.30, 0.0), vec2(0.49, 0.23 + variation * 0.025)) - 0.041);
        distanceToFlake = min(distanceToFlake,
          snowSegment(branch, vec2(0.55, 0.0), vec2(0.73, 0.19 + variation * 0.025)) - 0.034);
        distanceToFlake = min(distanceToFlake, radius - 0.11);
        float edge = max(fwidth(distanceToFlake) * 0.9, 0.006);
        float silhouette = 1.0 - smoothstep(-edge, edge, distanceToFlake);
        if (silhouette < 0.003) discard;
        float bevel = 1.0 - smoothstep(-0.035, -0.005, distanceToFlake);
        float facet = 0.5 + 0.5 * cos(angle * 6.0);
        vec3 shade = mix(snowFog, snowIce, 0.13);
        vec3 colour = mix(snowWhite, shade, (1.0 - bevel) * 0.16);
        colour *= 0.96 + facet * 0.04;
        float glint = pow(max(0.0, sin(vSnowAge * 1.5 + vSnowSeed)), 12.0) * 0.10;
        colour = mix(colour, snowWhite, glint + bevel * 0.14);
        float alpha = silhouette * vSnowFade;
        `:`
        float edge = max(fwidth(radius) * 1.1, 0.012);
        float silhouette = 1.0 - smoothstep(0.82 - edge, 0.98 + edge, radius);
        if (silhouette < 0.003) discard;
        float dome = sqrt(max(0.0, 1.0 - min(1.0, radius * radius)));
        vec3 colour = mix(snowWhite, snowIce, (1.0 - dome) * 0.075);
        colour *= 0.94 + dome * 0.06;
        float alpha = silhouette * (0.65 + dome * 0.30) * vSnowFade;
        `}
        if (alpha < 0.003) discard;
        #include <logdepthbuf_fragment>
        gl_FragColor = vec4(colour, alpha);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`})}var y=e=>new l().setHex(f(e),c);function b(e,t,n,r){return new o({name:e,vertexShader:t,uniforms:{...n,snowWhite:{value:y(`white`)},snowIce:{value:y(`cyan/2`)},snowFog:{value:y(`fog`)}},transparent:!0,depthWrite:!1,depthTest:!0,side:2,forceSinglePass:!0,blending:1,toneMapped:!0,fragmentShader:`
      #include <common>
      #include <logdepthbuf_pars_fragment>
      uniform vec3 snowWhite, snowIce, snowFog;
      varying vec2 vSnowUv;
      varying float vSnowFade, vSnowAge, vSnowSeed;
      #ifdef SNOW_FLOOR_FADE
        varying float vSnowLift;
      #endif

      void main() {
        if (vSnowFade < 0.003) discard;
        vec2 p = vSnowUv * 2.0 - 1.0;
        float radius = length(p);
        ${r===`mist`?`
        // Несколько мягких складок меняют форму клочка, не оставляя край карточки.
        vec2 swirl = p + vec2(
          sin(p.y * 5.0 + vSnowSeed + vSnowAge * 0.8),
          cos(p.x * 4.0 - vSnowSeed + vSnowAge * 0.6)) * 0.095;
        vec2 left = (swirl - vec2(-0.25, 0.08)) / vec2(0.72, 0.52);
        vec2 right = (swirl - vec2(0.29, -0.09)) / vec2(0.54, 0.63);
        float cloud = exp(-dot(left, left) * 2.6) * 0.70
          + exp(-dot(right, right) * 2.8) * 0.65;
        float fold = sin(swirl.x * 7.0 + swirl.y * 5.0 + vSnowSeed + vSnowAge * 0.75);
        float fine = sin(swirl.x * 16.0 - swirl.y * 11.0 + fold * 1.1 - vSnowAge);
        float density = cloud * (0.74 + fold * 0.13 + fine * 0.08);
        float boundary = 1.0 - smoothstep(0.62, 1.02, radius);
        float alpha = density * boundary * 0.64 * vSnowFade;
        vec3 colour = mix(snowWhite, snowIce, 0.065 + (1.0 - density) * 0.055);
        colour = mix(colour, snowFog, (1.0 - fold) * 0.025);
        `:r===`spark`?`
        float edge = max(fwidth(radius), 0.009);
        float width = 0.024 + edge * 0.7;
        float vertical = exp(-abs(p.x) / width) * pow(max(0.0, 1.0 - abs(p.y)), 1.5);
        float horizontal = exp(-abs(p.y) / width) * pow(max(0.0, 1.0 - abs(p.x)), 1.5);
        float core = exp(-dot(p, p) * 150.0);
        float halo = exp(-dot(p, p) * 22.0) * 0.065;
        float silhouette = min(1.0, vertical + horizontal + core + halo)
          * (1.0 - smoothstep(0.82, 1.0, radius));
        float alpha = silhouette * vSnowFade;
        vec3 colour = mix(snowWhite, snowIce, (1.0 - core) * 0.08);
        `:`
        // Неровный пушистый комочек без пузырчатого контура.
        float roll = vSnowSeed + vSnowAge * 0.6;
        vec2 q = p + vec2(sin(p.y * 6.0 + roll), cos(p.x * 5.0 - roll)) * 0.075;
        vec2 a = (q - vec2(-0.25, 0.05)) / vec2(0.38, 0.46);
        vec2 b = (q - vec2(0.22, 0.16)) / vec2(0.43, 0.35);
        vec2 c = (q - vec2(0.03, -0.24)) / vec2(0.46, 0.32);
        float clump = exp(-dot(a, a) * 2.0) + exp(-dot(b, b) * 2.0)
          + exp(-dot(c, c) * 2.0);
        float silhouette = smoothstep(0.045, 0.48, clump)
          * (1.0 - smoothstep(0.72, 1.0, radius));
        float alpha = silhouette * (0.75 + min(1.0, clump) * 0.20) * vSnowFade;
        float shade = clamp(0.10 - p.y * 0.08, 0.015, 0.20);
        vec3 colour = mix(snowWhite, mix(snowFog, snowIce, 0.13), shade);
        `}
        #ifdef SNOW_FLOOR_FADE
          // Низ клочка следа тает над полом: пол не режет его кромкой, и
          // видимое не опускается ниже TRAIL_FLOOR.
          alpha *= smoothstep(${h.toFixed(3)}, ${(h+.12).toFixed(3)}, vSnowLift);
        #endif
        if (alpha < 0.003) discard;
        #include <logdepthbuf_fragment>
        gl_FragColor = vec4(colour, alpha);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`})}var x=new l(f(`white`)),S=new l(f(`fog`)),C=new l(f(`cyan/2`)),w=`
  vec3 snowSketchRotate(vec3 p, float pitch, float yaw, float roll) {
    p.yz = mat2(cos(pitch), -sin(pitch), sin(pitch), cos(pitch)) * p.yz;
    p.xz = mat2(cos(yaw), -sin(yaw), sin(yaw), cos(yaw)) * p.xz;
    p.xy = mat2(cos(roll), -sin(roll), sin(roll), cos(roll)) * p.xy;
    return p;
  }
  void snowSketchProject(vec3 centre, float size, float pitch, float yaw, float roll) {
    // Максимальный масштаб сохраняет прежний диаметр; базис берётся только из modelMatrix.
    vec3 x = modelMatrix[0].xyz, y = modelMatrix[1].xyz, z = modelMatrix[2].xyz;
    float sx = length(x), sy = length(y), sz = length(z);
    float modelScale = max(sx, max(sy, sz));
    mat3 basis = mat3(x / max(sx, 0.000001), y / max(sy, 0.000001), z / max(sz, 0.000001));
    vec3 offset = snowSketchRotate(vec3(position.xy * size * modelScale, 0.0), pitch, yaw, roll);
    vec4 world = modelMatrix * vec4(centre, 1.0) + vec4(basis * offset, 0.0);
    vec4 view = viewMatrix * world;
    vSnowView = -view.xyz;
    vec3 posedNormal = snowSketchRotate(vec3(0.0, 0.0, 1.0), pitch, yaw, roll);
    vSnowNormal = normalize(mat3(viewMatrix) * basis * posedNormal);
    gl_Position = projectionMatrix * view;
  }
`,T=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  uniform float snowClock, snowMotion;
  attribute vec4 snowCycle, snowOrbit, snowDrift;
  varying vec2 vSnowUv;
  varying vec3 vSnowView, vSnowNormal;
  varying float vSnowFade, vSnowAge, vSnowSeed;
  ${w}
  void main() {
    float age = fract(snowClock / snowCycle.y + snowCycle.x);
    float seconds = age * snowCycle.y;
    float seed = snowOrbit.w;
    float sway = snowClock * snowDrift.y + seed;
    float angle = seed + snowClock * snowCycle.z * snowDrift.w + sin(sway) * 0.18;
    float radius = snowOrbit.x + sin(sway) * snowDrift.x;
    vec3 centre = vec3(cos(angle) * radius,
      snowOrbit.y - age * snowOrbit.z + sin(sway + 1.7) * 0.08,
      sin(angle) * radius - snowMotion * (0.45 + age * 0.9));
    float diameter = length(instanceMatrix[0].xyz);
    float roll = seed + snowClock * snowDrift.z;
    float pitch = (fract(seed * 0.427) - 0.5) * 1.70 + sin(sway + seed * 0.3) * 0.35;
    float yaw = (fract(seed * 0.731) - 0.5) * PI2 + sin(sway + 1.7) * 0.30;
    snowSketchProject(centre, diameter, pitch, yaw, roll);
    #include <logdepthbuf_vertex>
    float envelope = smoothstep(0.0, 0.08, age) * (1.0 - smoothstep(0.86, 1.0, age));
    vSnowUv = uv; vSnowFade = snowCycle.w * envelope;
    vSnowAge = seconds; vSnowSeed = seed;
  }
`,E=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  uniform float snowClock;
  // Высота облика следа: оседание сжимается вместе со взлётом.
  uniform float trailShapeHeight;
  attribute vec2 snowBornLife;
  attribute vec4 snowVelocity, snowProfile;
  varying vec2 vSnowUv;
  varying vec3 vSnowView, vSnowNormal;
  varying float vSnowFade, vSnowAge, vSnowSeed;
  ${w}
  void main() {
    float age = max(0.0, snowClock - snowBornLife.x);
    float k = clamp(age / snowBornLife.y, 0.0, 1.0);
    float phase = snowProfile.w;
    float drift = (1.0 - exp(-age * 0.8)) / 0.8;
    vec3 root = instanceMatrix[3].xyz + snowVelocity.xyz * drift;
    root.x += (sin(age * snowProfile.y + phase) - sin(phase)) * snowProfile.x;
    root.z += (cos(age * snowProfile.y * 0.81 + phase) - cos(phase)) * snowProfile.x;
    root.y = max(snowVelocity.w, root.y - age * age * 0.46 * trailShapeHeight);
    float size = length(instanceMatrix[0].xyz);
    float turn = phase + age * (0.45 + sin(phase) * 1.1);
    float wobble = age * snowProfile.y + phase;
    float pitch = (fract(phase * 0.427) - 0.5) * 1.70 + sin(wobble + phase * 0.3) * 0.35;
    float yaw = (fract(phase * 0.731) - 0.5) * PI2 + sin(wobble + 1.7) * 0.30;
    snowSketchProject(root, size, pitch, yaw, turn);
    #include <logdepthbuf_vertex>
    vSnowUv = uv; vSnowAge = age; vSnowSeed = phase;
    vSnowFade = snowProfile.z * smoothstep(0.0, 0.025, k) * (1.0 - smoothstep(0.70, 1.0, k));
  }
`;function ee(e,n){return new o({name:e===`aura`?`Snow_Aura_Flakes_Sketch`:`Snow_Trail_Flakes_Sketch`,uniforms:{snowClock:{value:0},snowMotion:{value:0},...n,snowSketchWhite:{value:x},snowSketchFog:{value:S},snowSketchIce:{value:C},snowSketchFaceCentre:{value:new u},snowSketchFaceRadius:{value:new t(1.05,1.05)},snowSketchFaceEnabled:{value:0}},transparent:!0,depthWrite:!1,depthTest:!0,side:2,forceSinglePass:!0,blending:1,toneMapped:!0,vertexShader:e===`aura`?T:E,fragmentShader:`
      #include <common>
      #include <logdepthbuf_pars_fragment>
      uniform vec3 snowSketchWhite, snowSketchFog, snowSketchIce, snowSketchFaceCentre;
      uniform vec2 snowSketchFaceRadius;
      uniform float snowSketchFaceEnabled;
      varying vec2 vSnowUv;
      varying vec3 vSnowView, vSnowNormal;
      varying float vSnowFade, vSnowAge, vSnowSeed;
      float snowSegment(vec2 p, vec2 start, vec2 end) {
        vec2 axis = end - start;
        float along = clamp(dot(p - start, axis) / dot(axis, axis), 0.0, 1.0);
        return length(p - start - axis * along);
      }
      void main() {
        if (vSnowFade < 0.003) discard;
        if (snowSketchFaceEnabled > 0.5 && vSnowView.z < snowSketchFaceCentre.z + snowSketchFaceRadius.y) {
          vec2 offset = vSnowView.xy / max(vSnowView.z, 0.001)
            - snowSketchFaceCentre.xy / max(snowSketchFaceCentre.z, 0.001);
          float offAxis = sqrt(1.0 + dot(snowSketchFaceCentre.xy, snowSketchFaceCentre.xy)
            / max(snowSketchFaceCentre.z * snowSketchFaceCentre.z, 0.0001));
          vec2 radius = snowSketchFaceRadius * offAxis / max(snowSketchFaceCentre.z - snowSketchFaceRadius.x, 0.1);
          if (dot(offset / radius, offset / radius) < 1.0) discard;
        }
        vec2 p = vSnowUv * 2.0 - 1.0;
        float radius = length(p);
        float polarAngle = radius > 0.000001 ? atan(p.y, p.x) : 0.0;
        float angle = mod(polarAngle + PI / 6.0, PI / 3.0) - PI / 6.0;
        vec2 branch = vec2(cos(angle), abs(sin(angle))) * radius;
        float variation = fract(vSnowSeed * 0.719), style = floor(variation * 3.0);
        float distanceToFlake;
        if (style < 0.5) {
          // Дендрит: три пары ветвей на каждом из шести лучей.
          distanceToFlake = snowSegment(branch, vec2(0.05, 0.0), vec2(0.89, 0.0)) - 0.043;
          distanceToFlake = min(distanceToFlake, snowSegment(branch, vec2(0.26, 0.0), vec2(0.46, 0.23)) - 0.032);
          distanceToFlake = min(distanceToFlake, snowSegment(branch, vec2(0.50, 0.0), vec2(0.71, 0.19)) - 0.026);
          distanceToFlake = min(distanceToFlake, snowSegment(branch, vec2(0.71, 0.0), vec2(0.84, 0.12)) - 0.020);
          distanceToFlake = min(distanceToFlake, radius - 0.095);
        } else if (style < 1.5) {
          // Иголки: заметно более тонкие длинные лучи и одна небольшая развилка.
          distanceToFlake = snowSegment(branch, vec2(0.055, 0.0), vec2(0.94, 0.0)) - 0.022;
          distanceToFlake = min(distanceToFlake, snowSegment(branch, vec2(0.48, 0.0), vec2(0.66, 0.16)) - 0.014);
          distanceToFlake = min(distanceToFlake, radius - 0.077);
        } else {
          // Шестигранная пластинка с широкими треугольными зубцами.
          float hexagon = dot(branch, vec2(0.86602540378, 0.5)) - 0.35;
          float point = max(0.20 - branch.x, max(branch.x - 0.83,
            branch.y - (0.83 - branch.x) * 0.43));
          distanceToFlake = min(hexagon, point);
        }
        float edge = max(fwidth(distanceToFlake) * 0.9, 0.0045);
        float silhouette = 1.0 - smoothstep(-edge, edge, distanceToFlake);
        if (silhouette < 0.003) discard;
        float bevel = 1.0 - smoothstep(-0.038, -0.005, distanceToFlake);
        float facet = 0.5 + 0.5 * cos(angle * 6.0);
        vec3 normal = normalize(vSnowNormal) * (gl_FrontFacing ? 1.0 : -1.0);
        vec3 light = normalize(mat3(viewMatrix) * vec3(-0.32, 0.85, 0.41));
        vec3 coolEdge = mix(snowSketchFog, snowSketchIce, 0.095);
        vec3 colour = mix(snowSketchWhite, coolEdge, (1.0 - bevel) * 0.24);
        colour *= (0.94 + facet * 0.06) * (0.88 + abs(dot(normal, light)) * 0.12);
        float glint = pow(max(0.0, sin(vSnowAge * 1.5 + vSnowSeed)), 12.0) * 0.065;
        colour = mix(colour, snowSketchWhite, glint);
        #include <logdepthbuf_fragment>
        gl_FragColor = vec4(colour, silhouette * vSnowFade);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`})}function te(e,t,n){let r=(n??e.parent)?.getObjectByName(`mixamorigHead_06`),i=new u,a=new u;return n=>{n.updateMatrixWorld(),e.updateWorldMatrix(!0,!1);let o;r?(r.updateWorldMatrix(!0,!1),i.set(-.00570525,.6573547,.02455115),r.localToWorld(i),o=1.00256*r.matrixWorld.getMaxScaleOnAxis()+.14):(i.set(0,1.3,0),e.localToWorld(i),o=1.05*e.matrixWorld.getMaxScaleOnAxis()),a.copy(i).applyMatrix4(n.matrixWorldInverse).multiplyScalar(-1);for(let e of t)e.uniforms.snowSketchFaceCentre.value.copy(a),e.uniforms.snowSketchFaceRadius.value.set(o,o),e.uniforms.snowSketchFaceEnabled.value=Number.isFinite(a.lengthSq())&&a.z>.1?1:0}}var D=Math.PI*2,O=120,k=[180,120,72],A=[240,160,96],j=[24,16,10],M=[28,18,10],N=[3,4,5],ne=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  uniform float snowClock, snowMotion;
  // Phase, lifetime, orbit frequency, opacity.
  attribute vec4 snowCycle;
  // Radius, top, descent, initial angle.
  attribute vec4 snowOrbit;
  // Radial sway, sway frequency, rotation frequency, orbit direction.
  attribute vec4 snowDrift;
  varying vec2 vSnowUv;
  varying float vSnowFade, vSnowAge, vSnowSeed;

  void main() {
    float age = fract(snowClock / snowCycle.y + snowCycle.x);
    float seconds = age * snowCycle.y;
    float seed = snowOrbit.w;
    float sway = snowClock * snowDrift.y + seed;
    float angle = seed + snowClock * snowCycle.z * snowDrift.w
      + sin(sway) * 0.18;
    float radius = snowOrbit.x + sin(sway) * snowDrift.x;
    vec3 centre = vec3(cos(angle) * radius,
      snowOrbit.y - age * snowOrbit.z + sin(sway + 1.7) * 0.08,
      sin(angle) * radius - snowMotion * (0.45 + age * 0.9));

    vec3 axisX = modelViewMatrix[0].xyz;
    vec3 axisY = modelViewMatrix[1].xyz;
    vec3 axisZ = modelViewMatrix[2].xyz;
    float modelScale = max(length(axisX), max(length(axisY), length(axisZ)));
    float diameter = length(instanceMatrix[0].xyz) * modelScale;
    float roll = seed + snowClock * snowDrift.z;
    float cosine = cos(roll), sine = sin(roll);
    vec2 offset = position.xy * diameter;
    offset = vec2(cosine * offset.x - sine * offset.y,
      sine * offset.x + cosine * offset.y);
    vec4 viewCentre = modelViewMatrix * vec4(centre, 1.0);
    viewCentre.xy += offset;
    gl_Position = projectionMatrix * viewCentre;
    #include <logdepthbuf_vertex>

    // Обратный базис переводит весь повёрнутый billboard в оси тела.
    // Он учитывает ракурс камеры и неравномерный масштаб родителей.
    vec3 rowX = cross(axisY, axisZ);
    vec3 rowY = cross(axisZ, axisX);
    vec3 rowZ = cross(axisX, axisY);
    float determinant = dot(axisX, rowX);
    float divisor = (determinant < 0.0 ? -1.0 : 1.0)
      * max(abs(determinant), 0.000001);
    vec3 right = vec3(rowX.x, rowY.x, rowZ.x) / divisor;
    vec3 up = vec3(rowX.y, rowY.y, rowZ.y) / divisor;
    vec3 padding = 0.5 * diameter * (
      abs(right * cosine + up * sine) + abs(up * cosine - right * sine));
    float face = smoothstep(0.15, 0.65, centre.y + padding.y)
      * smoothstep(-0.5, 0.05, centre.z + padding.z)
      * (1.0 - smoothstep(1.05, 1.45, max(0.0, abs(centre.x) - padding.x)));
    float envelope = smoothstep(0.0, 0.08, age)
      * (1.0 - smoothstep(0.86, 1.0, age));
    vSnowUv = uv;
    vSnowFade = snowCycle.w * envelope * (1.0 - face);
    vSnowAge = seconds;
    vSnowSeed = seed;
  }`,re=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  uniform float snowClock, snowMotion;
  attribute vec4 snowCycle;
  attribute vec4 snowOrbit;
  attribute vec4 snowDrift;
  varying vec2 vSnowUv;
  varying float vSnowFade, vSnowAge, vSnowSeed;

  void main() {
    float age = fract(snowClock / snowCycle.y + snowCycle.x);
    float seconds = age * snowCycle.y;
    float seed = snowOrbit.w;
    float sway = snowClock * snowDrift.y + seed;
    float angle = seed + snowClock * snowCycle.z * snowDrift.w
      + sin(sway) * 0.25;
    float radius = snowOrbit.x + sin(sway) * snowDrift.x;
    vec3 centre = vec3(cos(angle) * radius,
      snowOrbit.y - age * snowOrbit.z + sin(sway + 1.7) * 0.05,
      sin(angle) * radius - snowMotion * (0.3 + age * 0.7));

    vec3 axisX = modelViewMatrix[0].xyz;
    vec3 axisY = modelViewMatrix[1].xyz;
    vec3 axisZ = modelViewMatrix[2].xyz;
    float modelScale = max(length(axisX), max(length(axisY), length(axisZ)));
    float diameter = length(instanceMatrix[0].xyz) * modelScale;
    float roll = seed + snowClock * snowDrift.z;
    float cosine = cos(roll), sine = sin(roll);
    vec2 offset = position.xy * diameter;
    offset = vec2(cosine * offset.x - sine * offset.y,
      sine * offset.x + cosine * offset.y);
    vec4 viewCentre = modelViewMatrix * vec4(centre, 1.0);
    viewCentre.xy += offset;
    gl_Position = projectionMatrix * viewCentre;
    #include <logdepthbuf_vertex>

    vec3 rowX = cross(axisY, axisZ);
    vec3 rowY = cross(axisZ, axisX);
    vec3 rowZ = cross(axisX, axisY);
    float determinant = dot(axisX, rowX);
    float divisor = (determinant < 0.0 ? -1.0 : 1.0)
      * max(abs(determinant), 0.000001);
    vec3 right = vec3(rowX.x, rowY.x, rowZ.x) / divisor;
    vec3 up = vec3(rowX.y, rowY.y, rowZ.y) / divisor;
    vec3 padding = 0.5 * diameter * (
      abs(right * cosine + up * sine) + abs(up * cosine - right * sine));
    float face = smoothstep(0.15, 0.65, centre.y + padding.y)
      * smoothstep(-0.5, 0.05, centre.z + padding.z)
      * (1.0 - smoothstep(1.05, 1.45, max(0.0, abs(centre.x) - padding.x)));
    vSnowUv = uv;
    vSnowFade = snowCycle.w * smoothstep(0.0, 0.08, age)
      * (1.0 - smoothstep(0.8, 1.0, age)) * (1.0 - face);
    vSnowAge = seconds;
    vSnowSeed = seed;
  }`,P=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  uniform float snowClock, snowMotion, snowSpark;
  attribute vec4 snowCycle;
  attribute vec4 snowOrbit;
  attribute vec4 snowDrift;
  varying vec2 vSnowUv;
  varying float vSnowFade, vSnowAge, vSnowSeed;

  void main() {
    float age = fract(snowClock / snowCycle.y + snowCycle.x);
    float seconds = age * snowCycle.y;
    float seed = snowOrbit.w;
    float sway = snowClock * snowDrift.y + seed;
    float angle = seed + snowClock * snowCycle.z * snowDrift.w
      + sin(sway) * 0.2;
    float radius = snowOrbit.x + sin(sway) * snowDrift.x;
    vec3 centre = vec3(cos(angle) * radius,
      snowOrbit.y - age * snowOrbit.z + sin(sway + 1.7) * 0.1,
      sin(angle) * radius - snowMotion * (0.25 + age * 0.5));

    vec3 axisX = modelViewMatrix[0].xyz;
    vec3 axisY = modelViewMatrix[1].xyz;
    vec3 axisZ = modelViewMatrix[2].xyz;
    float modelScale = max(length(axisX), max(length(axisY), length(axisZ)));
    vec2 size = vec2(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz)) * modelScale;
    float roll = seed + snowClock * snowDrift.z;
    float cosine = cos(roll), sine = sin(roll);
    vec2 offset = position.xy * size;
    offset = vec2(cosine * offset.x - sine * offset.y,
      sine * offset.x + cosine * offset.y);
    vec4 viewCentre = modelViewMatrix * vec4(centre, 1.0);
    viewCentre.xy += offset;
    gl_Position = projectionMatrix * viewCentre;
    #include <logdepthbuf_vertex>

    // Обе стороны повёрнутого клочка дают точный запас в локальных осях тела.
    vec3 rowX = cross(axisY, axisZ);
    vec3 rowY = cross(axisZ, axisX);
    vec3 rowZ = cross(axisX, axisY);
    float determinant = dot(axisX, rowX);
    float divisor = (determinant < 0.0 ? -1.0 : 1.0)
      * max(abs(determinant), 0.000001);
    vec3 right = vec3(rowX.x, rowY.x, rowZ.x) / divisor;
    vec3 up = vec3(rowX.y, rowY.y, rowZ.y) / divisor;
    vec3 padding = 0.5 * (size.x * abs(right * cosine + up * sine)
      + size.y * abs(up * cosine - right * sine));
    float face = smoothstep(0.15, 0.65, centre.y + padding.y)
      * smoothstep(-0.5, 0.05, centre.z + padding.z)
      * (1.0 - smoothstep(1.05, 1.45, max(0.0, abs(centre.x) - padding.x)));
    float envelope = smoothstep(0.0, 0.14, age)
      * (1.0 - smoothstep(0.75, 1.0, age));
    float flash = smoothstep(0.23, 0.255, age)
      * (1.0 - smoothstep(0.29, 0.325, age));
    vSnowUv = uv;
    vSnowFade = snowCycle.w * envelope * mix(1.0, flash, snowSpark) * (1.0 - face);
    vSnowAge = seconds;
    vSnowSeed = seed;
  }`;function F(t,n=!1){let r={value:0},i={value:0},o={snowClock:r,snowMotion:i},c=n?ee(`aura`,o):v(`Snow_Aura_Flakes`,ne,o,`flake`),l=new a(1,1),u=new s(new Float32Array(k[0]*4),4),f=new s(new Float32Array(k[0]*4),4),p=new s(new Float32Array(k[0]*4),4);l.setAttribute(`snowCycle`,u),l.setAttribute(`snowOrbit`,f),l.setAttribute(`snowDrift`,p);let m=new e(l,c,k[0]);m.name=c.name,m.frustumCulled=!1,m.castShadow=m.receiveShadow=!1,m.renderOrder=1,t.add(m);let h=v(`Snow_Aura_Powder`,re,o,`powder`),g=new a(1,1),_=new s(new Float32Array(A[0]*4),4),y=new s(new Float32Array(A[0]*4),4),x=new s(new Float32Array(A[0]*4),4);g.setAttribute(`snowCycle`,_),g.setAttribute(`snowOrbit`,y),g.setAttribute(`snowDrift`,x);let S=new e(g,h,A[0]);S.name=h.name,S.frustumCulled=!1,S.castShadow=S.receiveShadow=!1,t.add(S);let C=b(`Snow_Aura_Mist`,P,{...o,snowSpark:{value:0}},`mist`),w=new a(1,1),T=new s(new Float32Array(j[0]*4),4),E=new s(new Float32Array(j[0]*4),4),te=new s(new Float32Array(j[0]*4),4);w.setAttribute(`snowCycle`,T),w.setAttribute(`snowOrbit`,E),w.setAttribute(`snowDrift`,te);let F=new e(w,C,j[0]);F.name=C.name,F.frustumCulled=!1,F.castShadow=F.receiveShadow=!1,t.add(F);let ie=b(`Snow_Aura_Sparks`,P,{...o,snowSpark:{value:1}},`spark`),I=new a(1,1),ae=new s(new Float32Array(M[0]*4),4),oe=new s(new Float32Array(M[0]*4),4),se=new s(new Float32Array(M[0]*4),4);I.setAttribute(`snowCycle`,ae),I.setAttribute(`snowOrbit`,oe),I.setAttribute(`snowDrift`,se);let L=new e(I,ie,M[0]);L.name=ie.name,L.frustumCulled=!1,L.castShadow=L.receiveShadow=!1,L.renderOrder=2,t.add(L);let R=new d,ce=0,le=0,ue=0,z=1627030653,B=1136554389,V=279766591,de=2176460157,fe=!1,H=()=>(z^=z<<13,z^=z>>>17,z^=z<<5,(z>>>0)/4294967296),U=()=>(B^=B<<13,B^=B>>>17,B^=B<<5,(B>>>0)/4294967296),W=()=>(V^=V<<13,V^=V>>>17,V^=V<<5,(V>>>0)/4294967296),G=()=>(de^=de<<13,de^=de>>>17,de^=de<<5,(de>>>0)/4294967296);for(let e=0;e<k[0];e+=1){let t=(e*.61803398875+H()*.06)%1,n=12+Math.floor(H()*17),r=24+Math.floor(H()*19),i=18+Math.floor(H()*25),a=.38+H()*.38;R.makeScale(a,a,1),m.setMatrixAt(e,R),u.setXYZW(e,t,N[e%N.length],D*n/O,.82+H()*.16),f.setXYZW(e,1.7+H()*.95,2.55+H()*.5,5.15+H()*.55,H()*D),p.setXYZW(e,.1+H()*.18,D*r/O,D*i/O*(H()<.5?-1:1),H()<.5?-1:1)}m.instanceMatrix.needsUpdate=!0,u.needsUpdate=f.needsUpdate=p.needsUpdate=!0;for(let e=0;e<A[0];e+=1){let t=(e*.61803398875+U()*.05)%1,n=15+Math.floor(U()*22),r=30+Math.floor(U()*21),i=15+Math.floor(U()*18),a=.06+U()*.08;R.makeScale(a,a,1),S.setMatrixAt(e,R),_.setXYZW(e,t,N[e%N.length],D*n/O,.28+U()*.34),y.setXYZW(e,1.4+U()*1.05,2.35+U()*.55,4.95+U()*.6,U()*D),x.setXYZW(e,.12+U()*.22,D*r/O,D*i/O*(U()<.5?-1:1),U()<.5?-1:1)}S.instanceMatrix.needsUpdate=!0,_.needsUpdate=y.needsUpdate=x.needsUpdate=!0;for(let e=0;e<j[0];e+=1){let t=(e*.61803398875+W()*.05)%1,n=2+Math.floor(W()*6),r=7+Math.floor(W()*7),i=2+Math.floor(W()*5),a=1.1+W()*.7;R.makeScale(a,a*(.65+W()*.2),1),F.setMatrixAt(e,R),T.setXYZW(e,t,N[e%N.length],D*n/O,.35+W()*.17),E.setXYZW(e,2.1+W()*.7,.65+W()*.65,.85+W()*.75,W()*D),te.setXYZW(e,.05+W()*.1,D*r/O,D*i/O*(W()<.5?-1:1),W()<.5?-1:1)}F.instanceMatrix.needsUpdate=!0,T.needsUpdate=E.needsUpdate=te.needsUpdate=!0;for(let e=0;e<M[0];e+=1){let t=(e*.61803398875+G()*.04)%1,n=7+Math.floor(G()*10),r=15+Math.floor(G()*13),i=6+Math.floor(G()*13),a=.16+G()*.16;R.makeScale(a,a,1),L.setMatrixAt(e,R),ae.setXYZW(e,t,N[e%N.length],D*n/O,.8+G()*.2),oe.setXYZW(e,1.75+G()*.95,.6+G()*1.1,1.4+G()*.8,G()*D),se.setXYZW(e,.04+G()*.1,D*r/O,D*i/O*(G()<.5?-1:1),G()<.5?-1:1)}L.instanceMatrix.needsUpdate=!0,ae.needsUpdate=oe.needsUpdate=se.needsUpdate=!0;let pe=()=>{le=ue=0,r.value=i.value=0};return{step(e,t){if(fe||!Number.isFinite(e)||e<=0)return;let n=Math.min(e,.1);le=(le+n)%O,ue+=(+!!t-ue)*(1-Math.exp(-n/.25)),r.value=le,i.value=ue},setTier(e){fe||e===ce||e!==0&&e!==1&&e!==2||(ce=e,m.count=k[ce],S.count=A[ce],F.count=j[ce],L.count=M[ce])},reset(){fe||pe()},dispose(){fe||(fe=!0,m.removeFromParent(),l.dispose(),c.dispose(),m.dispose(),S.removeFromParent(),g.dispose(),h.dispose(),S.dispose(),F.removeFromParent(),w.dispose(),C.dispose(),F.dispose(),L.removeFromParent(),I.dispose(),ie.dispose(),L.dispose())}}}var ie=.04;function I(e,t,n){let i=[];e.traverse(e=>{e.isBone&&i.push(e)});let a=e=>i.find(t=>RegExp(`${e}ToeBase(?:_\\d+)?$`).test(t.name)),o=[{bone:a(`Left`),side:-1,height:0,descending:!1,observed:!1,cooldown:0},{bone:a(`Right`),side:1,height:0,descending:!1,observed:!1,cooldown:0}],s=new u,c=new u,l=()=>{for(let e of o)e.height=e.cooldown=0,e.descending=e.observed=!1};return{step(e,i,a){if(!Number.isFinite(e)||e<=0||!Number.isFinite(a))return;if(!i||e>.25){l();return}let u=.2+r.clamp((a-40)/53,0,1)*.08;c.setFromMatrixPosition(t.matrixWorld);for(let t of o){if(!t.bone)continue;s.setFromMatrixPosition(t.bone.matrixWorld);let r=s.y-c.y;if(t.cooldown+=e,!t.observed){t.height=r,t.observed=!0;continue}let i=r-t.height;i<-.002&&(t.descending=!0),t.descending&&i>.002&&t.cooldown>=.04&&t.height<=u&&(n(s.x,c.y+ie,s.z,t.side),t.descending=!1,t.cooldown=0),t.height=r}},reset:l}}var ae=Math.PI*2,oe=[.28,.42,.65],se=[3,2,2],L=2.4,R=28672,ce=1445701937,le=[.22,.34,.55],ue=[2,2,1],z=1.5,B=16384,V=878477799,de=[.9,1.4,2],fe=[1.2,1.8,2.7],H=[5,4,3],U=1.7,W=4096,G=.8,pe=1024,me=.65,he=256,ge=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  uniform float snowClock;
  // Высота облика следа: оседание сжимается вместе со взлётом.
  uniform float trailShapeHeight;
  attribute vec2 snowBornLife;
  // Начальная скорость и высота оседания в момент рождения.
  attribute vec4 snowVelocity;
  attribute vec4 snowProfile;
  varying vec2 vSnowUv;
  varying float vSnowFade, vSnowAge, vSnowSeed;

  void main() {
    float age = max(0.0, snowClock - snowBornLife.x);
    float k = clamp(age / snowBornLife.y, 0.0, 1.0);
    float phase = snowProfile.w;
    float drift = (1.0 - exp(-age * 0.8)) / 0.8;
    // Корень, скорость и профиль сохраняются в мире с рождения.
    vec3 root = instanceMatrix[3].xyz + snowVelocity.xyz * drift;
    root.x += (sin(age * snowProfile.y + phase) - sin(phase)) * snowProfile.x;
    root.z += (cos(age * snowProfile.y * 0.81 + phase) - cos(phase)) * snowProfile.x;
    root.y = max(snowVelocity.w, root.y - age * age * 0.46 * trailShapeHeight);
    float size = length(instanceMatrix[0].xyz);
    vec2 card = position.xy * size;
    float turn = phase + age * (0.45 + sin(phase) * 1.1);
    float c = cos(turn), s = sin(turn);
    card = vec2(c * card.x - s * card.y, s * card.x + c * card.y);
    vec4 centre = modelViewMatrix * vec4(root, 1.0);
    centre.xy += card * length(modelViewMatrix[0].xyz);
    gl_Position = projectionMatrix * centre;
    #include <logdepthbuf_vertex>
    vSnowUv = uv;
    vSnowAge = age;
    vSnowSeed = phase;
    vSnowFade = snowProfile.z * smoothstep(0.0, 0.025, k)
      * (1.0 - smoothstep(0.70, 1.0, k));
  }`,_e=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  uniform float powderClock, trailShapeHeight;
  attribute vec2 powderBornLife;
  attribute vec4 powderVelocity;
  attribute vec4 powderProfile;
  varying vec2 vSnowUv;
  varying float vSnowFade, vSnowAge, vSnowSeed;

  void main() {
    float age = max(0.0, powderClock - powderBornLife.x);
    float k = clamp(age / powderBornLife.y, 0.0, 1.0);
    float phase = powderProfile.w;
    float drift = (1.0 - exp(-age * 1.1)) / 1.1;
    vec3 root = instanceMatrix[3].xyz + powderVelocity.xyz * drift;
    root.x += (sin(age * powderProfile.y + phase) - sin(phase)) * powderProfile.x;
    root.z += (cos(age * powderProfile.y + phase) - cos(phase)) * powderProfile.x;
    root.y = max(powderVelocity.w, root.y - age * age * 0.60 * trailShapeHeight);
    float size = length(instanceMatrix[0].xyz);
    vec4 centre = modelViewMatrix * vec4(root, 1.0);
    centre.xy += position.xy * size * length(modelViewMatrix[0].xyz);
    gl_Position = projectionMatrix * centre;
    #include <logdepthbuf_vertex>
    vSnowUv = uv;
    vSnowAge = age;
    vSnowSeed = phase;
    vSnowFade = powderProfile.z * smoothstep(0.0, 0.035, k)
      * (1.0 - smoothstep(0.55, 1.0, k));
  }`,ve=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  uniform float snowAirClock, snowAirDrag, snowAirGravity, snowAirGrowth, snowAirFadeAt, snowAirLife;
  // Рождение и высота пола (ступней) в миг рождения; жизнь у слоя общая.
  attribute vec2 snowAirBornLife;
  // Скорость и упор: высота, ниже которой не опускается центр карточки, а у
  // искр — её нижний край.
  attribute vec4 snowAirVelocity;
  attribute vec4 snowAirProfile;
  varying vec2 vSnowUv;
  varying float vSnowFade, vSnowAge, vSnowSeed;
  #ifdef SNOW_FLOOR_FADE
    varying float vSnowLift;
  #endif

  void main() {
    float age = max(0.0, snowAirClock - snowAirBornLife.x);
    float k = clamp(age / snowAirLife, 0.0, 1.0);
    float phase = snowAirProfile.w;
    float drift = (1.0 - exp(-age * snowAirDrag)) / snowAirDrag;
    vec3 root = instanceMatrix[3].xyz + snowAirVelocity.xyz * drift;
    root.x += (sin(age * snowAirProfile.y + phase) - sin(phase)) * snowAirProfile.x;
    root.z += (cos(age * snowAirProfile.y * 0.81 + phase) - cos(phase)) * snowAirProfile.x;
    vec2 size = vec2(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz));
    vec2 card = position.xy * size * mix(1.0, snowAirGrowth, k);
    float turn = sin(phase) * 0.18 + age * sin(phase * 1.7) * 0.16;
    float c = cos(turn), s = sin(turn);
    #ifdef SNOW_FLOOR_FADE
      // Большая мягкая карточка не поднимается целиком над полом, иначе
      // закрывала бы дорогу: центр садится по прежнему упору, а низ тает
      // над полом частицы в шейдере пикселя.
      root.y = max(snowAirVelocity.w, root.y - age * age * snowAirGravity);
    #else
      // Искра оседает на пол, а не уходит под него: нижний край повёрнутой
      // и подросшей карточки держится не ниже упора.
      float reach = 0.5 * (abs(c) * size.y + abs(s) * size.x) * mix(1.0, snowAirGrowth, k);
      root.y = max(snowAirVelocity.w + reach, root.y - age * age * snowAirGravity);
    #endif
    card = vec2(c * card.x - s * card.y, s * card.x + c * card.y);
    vec4 centre = modelViewMatrix * vec4(root, 1.0);
    vec2 offset = card * length(modelViewMatrix[0].xyz);
    centre.xy += offset;
    gl_Position = projectionMatrix * centre;
    #include <logdepthbuf_vertex>
    #ifdef SNOW_FLOOR_FADE
      // Высота точки карточки над полом: столбец Y вида переводит сдвиг в мир.
      vSnowLift = root.y - snowAirBornLife.y + dot(offset, viewMatrix[1].xy);
    #endif
    vSnowUv = uv;
    vSnowAge = age;
    vSnowSeed = phase;
    vSnowFade = snowAirProfile.z * smoothstep(0.0, 0.04, k)
      * (1.0 - smoothstep(snowAirFadeAt, 1.0, k));
  }`;function ye(t,r,i,o,c,l,u){let f=b(r,ve,{snowAirClock:{value:0},snowAirDrag:{value:i===`burst`?2:.9},snowAirGravity:{value:(i===`burst`?1.6:i===`mist`?.18:.34)*u},snowAirGrowth:{value:i===`spark`?.78:i===`burst`?1.4:1.2},snowAirFadeAt:{value:i===`spark`?.35:.4},snowAirLife:{value:c}},i);i!==`spark`&&(f.defines={...f.defines,SNOW_FLOOR_FADE:1});let p=new a(1,1),m=new s(new Float32Array(o*2),2).setUsage(n),h=new s(new Float32Array(o*4),4).setUsage(n),_=new s(new Float32Array(o*4),4).setUsage(n);p.setAttribute(`snowAirBornLife`,m),p.setAttribute(`snowAirVelocity`,h),p.setAttribute(`snowAirProfile`,_);let v=new e(p,f,o);v.name=r,v.renderOrder=i===`spark`?3:2,v.instanceMatrix.setUsage(n),v.count=0,v.visible=!1,v.frustumCulled=!1,v.castShadow=!1,v.receiveShadow=!1,t.add(v);let y=[v.instanceMatrix,m,h,_],x=new Float64Array(o),S=new d,C=0,w=l,T=g(),E=-1,ee=!1;return{random(){return w^=w<<13,w^=w>>>17,w^=w<<5,(w>>>0)/4294967296},emit(e,t,n,r,i,a,s,c,l,u,d,f,p,g,y){if(C===o)return;let b=C++;E<0&&(E=b),S.makeScale(i,a,i),S.setPosition(t,n,r),v.setMatrixAt(b,S),x[b]=e,m.setXY(b,e,d),h.setXYZW(b,s,c,l,u),_.setXYZW(b,f,p,g,y)},expire(e){let t=0;for(;t<C;){if(e-x[t]<c){t+=1;continue}let n=--C;if(t!==n){x[t]=x[n];for(let e of y){let r=e.itemSize;e.array.copyWithin(t*r,n*r,(n+1)*r)}T.moved(t)}}},rebase(e){for(let t=0;t<C;t+=1)x[t]=x[t]-e,m.setX(t,x[t]);ee=!0},finish(e){v.count=C,v.visible=C>0,f.uniforms.snowAirClock.value=e;for(let e of y){let t=e.itemSize,n=!1;e===m&&ee&&C>0?(e.addUpdateRange(0,C*t),n=!0):n=T.upload(e,E,C),n&&(e.needsUpdate=!0)}T.clear(),E=-1,ee=!1},clear(){C=v.count=0,v.visible=!1,w=l,f.uniforms.snowAirClock.value=0,T.clear(),E=-1,ee=!1;for(let e of y)e.clearUpdateRanges()},dispose(){v.removeFromParent(),p.dispose(),f.dispose(),v.dispose()}}}function K(t,r,i=!1,o=p){let{thickness:c,height:l}=o,f={snowClock:{value:0},trailShapeHeight:{value:l}},_=i?ee(`trail`,f):v(`Snow_Trail_Flakes`,ge,f,`flake`),y=new a(1,1),b=new s(new Float32Array(R*2),2).setUsage(n),x=new s(new Float32Array(R*4),4).setUsage(n),S=new s(new Float32Array(R*4),4).setUsage(n);y.setAttribute(`snowBornLife`,b),y.setAttribute(`snowVelocity`,x),y.setAttribute(`snowProfile`,S);let C=new e(y,_,R);C.name=_.name,C.instanceMatrix.setUsage(n),C.count=0,C.visible=!1,C.frustumCulled=!1,C.castShadow=!1,C.receiveShadow=!1,t.add(C);let w=v(`Snow_Trail_Powder`,_e,{powderClock:{value:0},trailShapeHeight:{value:l}},`powder`),T=new a(1,1),E=new s(new Float32Array(B*2),2).setUsage(n),te=new s(new Float32Array(B*4),4).setUsage(n),D=new s(new Float32Array(B*4),4).setUsage(n);T.setAttribute(`powderBornLife`,E),T.setAttribute(`powderVelocity`,te),T.setAttribute(`powderProfile`,D);let O=new e(T,w,B);O.name=w.name,O.renderOrder=1,O.instanceMatrix.setUsage(n),O.count=0,O.visible=!1,O.frustumCulled=!1,O.castShadow=!1,O.receiveShadow=!1,t.add(O);let k=ye(t,`Snow_Trail_Mist`,`mist`,W,U,592409425,l),A=ye(t,`Snow_Trail_Spark`,`spark`,pe,G,1779778327,l),j=ye(t,`Snow_Trail_Burst`,`burst`,he,me,357139745,l),M=m(512),N=m(512),ne=[C.instanceMatrix,b,x,S],re=new Float64Array(R),P=m(2048),F=[O.instanceMatrix,E,te,D],I=new Float64Array(B),ve=m(2048),K=new u,be=new d,xe=0,q=0,J=0,Y=0,X=-1,Se=ce,Ce=g(),we=g(),Te=-1,Ee=!1,Z=0,De=V,Oe=0,ke=-1,Ae=-1,je=!1,Me=!1,Ne=!1,Q=()=>(Se^=Se<<13,Se^=Se>>>17,Se^=Se<<5,(Se>>>0)/4294967296),$=()=>(De^=De<<13,De^=De>>>17,De^=De<<5,(De>>>0)/4294967296),Pe=()=>{J=C.count=0,C.visible=!1,q=0,_.uniforms.snowClock.value=0,Ce.clear(),Te=-1,Ee=!1;for(let e of ne)e.clearUpdateRanges();Z=O.count=0,O.visible=!1,w.uniforms.powderClock.value=0,we.clear(),Ae=-1,je=!1;for(let e of F)e.clearUpdateRanges();k.clear(),A.clear(),j.clear(),Ne=!1},Fe=()=>{let e=0;for(;e<J;){if(q-re[e]<L){e+=1;continue}let t=--J;if(e!==t){re[e]=re[t];for(let n of ne){let r=n.itemSize;n.array.copyWithin(e*r,t*r,(t+1)*r)}Ce.moved(e)}}},Ie=()=>{let e=0;for(;e<Z;){if(q-I[e]<z){e+=1;continue}let t=--Z;if(e!==t){I[e]=I[t];for(let n of F){let r=n.itemSize;n.array.copyWithin(e*r,t*r,(t+1)*r)}we.moved(e)}}},Le=e=>{for(let t=0;t<J;t+=1)re[t]=re[t]-e,b.setX(t,re[t]);Ee=!0;for(let t=0;t<Z;t+=1)I[t]=I[t]-e,E.setX(t,I[t]);je=!0,k.rebase(e),A.rebase(e),j.rebase(e)},Re=e=>{if(J===R)return;let t=J++,n=e*3;Te<0&&(Te=t);let r=X,i=-Y,a=(Q()-.5)*1.5*c,o=-.08-Q()*.24,s=P.positions[n]+r*a+Y*o,u=P.positions[n+1],d=u+.18*l+Q()*.82*l,f=P.positions[n+2]+i*a+X*o,p=(.3+Q()*.38)*c;be.makeScale(p,p,p),be.setPosition(s,d,f),C.setMatrixAt(t,be),re[t]=q-P.elapsed[e],b.setXY(t,re[t],L);let m=(a<0?-1:1)*(.65+Q()*.7)*c,g=.28+Q()*.44;x.setXYZW(t,r*m-Y*g,(.12+Q()*.3)*l,i*m-X*g,u+Math.max(.06*l,h+p*.5)),S.setXYZW(t,(.04+Q()*.12)*c,1.6+Q()*1.5,.8+Q()*.18,Q()*ae)},ze=e=>{if(Z===B)return;let t=Z++,n=e*3;Ae<0&&(Ae=t);let r=ke,i=-Oe,a=($()-.5)*1.4*c,o=-.1-$()*.22,s=ve.positions[n]+r*a+Oe*o,u=ve.positions[n+1],d=u+.1*l+$()*.32*l,f=ve.positions[n+2]+i*a+ke*o,p=(.07+$()*.1)*c;be.makeScale(p,p,p),be.setPosition(s,d,f),O.setMatrixAt(t,be),I[t]=q-ve.elapsed[e],E.setXY(t,I[t],z);let m=(a<0?-1:1)*(.7+$()*1.1)*c,g=.32+$()*.5;te.setXYZW(t,r*m-Oe*g,(.14+$()*.18)*l,i*m-ke*g,u+Math.max(.045*l,h+p*.5)),D.setXYZW(t,(.02+$()*.05)*c,2+$()*1.8,.78+$()*.2,$()*ae)},Be=e=>{let t=e*3,n=X,r=-Y,i=(k.random()-.5)*1.3*c,a=-.1-k.random()*.25,o=M.positions[t+1],s=(1+k.random()*.65)*c,u=s*(.5+k.random()*.2),d=(i<0?-1:1)*(.08+k.random()*.2)*c,f=.16+k.random()*.16;k.emit(q-M.elapsed[e],M.positions[t]+n*i+Y*a,o+.12*l+k.random()*.18*l,M.positions[t+2]+r*i+X*a,s,u,n*d-Y*f,(.06+k.random()*.06)*l,r*d-X*f,o+.08*l,o,(.02+k.random()*.04)*c,1+k.random()*.7,.45+k.random()*.23,k.random()*ae)},Ve=e=>{let t=e*3,n=X,r=-Y,i=(A.random()-.5)*2.1*c,a=-.1-A.random()*.35,o=N.positions[t+1],s=(.13+A.random()*.12)*c,u=(i<0?-1:1)*(.15+A.random()*.25)*c,d=.12+A.random()*.23;A.emit(q-N.elapsed[e],N.positions[t]+n*i+Y*a,o+.18*l+A.random()*.67*l,N.positions[t+2]+r*i+X*a,s,s,n*u-Y*d,(.05+A.random()*.16)*l,r*u-X*d,o+h,o,(.015+A.random()*.035)*c,2+A.random()*1,.8+A.random()*.18,A.random()*ae)},He=(e,t,n,r)=>{let i=X,a=-Y,o=r*(.02+j.random()*.1)*c,s=-.02-j.random()*.1,u=(.26+j.random()*.28)*c,d=u*(.55+j.random()*.28),f=r*(.8+j.random()*1)*c,p=.18+j.random()*.5;j.emit(q,e+i*o+Y*s,t+.04*l+j.random()*.06*l,n+a*o+X*s,u,d,i*f-Y*p,(.35+j.random()*.5)*l,a*f-X*p,t+.015*l,t-ie,(.02+j.random()*.04)*c,2.4+j.random()*1.2,.62+j.random()*.28,j.random()*ae)},Ue=()=>{C.count=J,C.visible=J>0,_.uniforms.snowClock.value=q;for(let e of ne){let t=e.itemSize,n=!1;e===b&&Ee&&J>0?(e.addUpdateRange(0,J*t),n=!0):n=Ce.upload(e,Te,J),n&&(e.needsUpdate=!0)}Ce.clear(),Te=-1,Ee=!1},We=()=>{O.count=Z,O.visible=Z>0,w.uniforms.powderClock.value=q;for(let e of F){let t=e.itemSize,n=!1;e===E&&je&&Z>0?(e.addUpdateRange(0,Z*t),n=!0):n=we.upload(e,Ae,Z),n&&(e.needsUpdate=!0)}we.clear(),Ae=-1,je=!1};return{setTier(e){if(e!==0&&e!==1&&e!==2)throw RangeError(`Invalid snow trail tier`);Me||(xe=e)},step(e,t){if(Ne=!1,Me||!Number.isFinite(e)||e<=0)return;r.getWorldPosition(K);let n=P.step(K.x,K.y,K.z,e,t,oe[xe]),i=ve.step(K.x,K.y,K.z,e,t,le[xe]),a=M.step(K.x,K.y,K.z,e,t,de[xe]),o=N.step(K.x,K.y,K.z,e,t,fe[xe]);if(M.cleared||N.cleared){Pe();return}if(P.cleared||ve.cleared){Pe();return}if(q+=e,q>=128){let e=Math.floor(q/128)*128;q-=e,Le(e)}Fe(),Ie(),k.expire(q),A.expire(q),j.expire(q);let s=P.direction,c=Math.hypot(s[0],s[2]);c>1e-5&&(Y=s[0]/c,X=s[2]/c);let l=ve.direction,u=Math.hypot(l[0],l[2]);u>1e-5&&(Oe=l[0]/u,ke=l[2]/u);for(let e=0;e<n;e+=1)for(let t=0;t<se[xe];t+=1)Re(e);for(let e=0;e<i;e+=1)for(let t=0;t<ue[xe];t+=1)ze(e);for(let e=0;e<a;e+=1)Be(e);for(let e=0;e<o;e+=1)Ve(e);Ue(),We(),k.finish(q),A.finish(q),j.finish(q),Ne=t},burst(e,t,n,r){if(!(Me||!Ne||r!==-1&&r!==1||!Number.isFinite(e)||!Number.isFinite(t)||!Number.isFinite(n)||Math.max(Math.abs(e),Math.abs(t),Math.abs(n))>34028234663852886e22)){for(let i=0;i<H[xe];i+=1)He(e,t,n,r);j.finish(q)}},reset(){Me||(Pe(),P.reset(),Y=0,X=-1,Se=ce,ve.reset(),Oe=0,ke=-1,De=V,M.reset(),N.reset())},dispose(){Me||(Me=!0,C.removeFromParent(),y.dispose(),_.dispose(),C.dispose(),O.removeFromParent(),T.dispose(),w.dispose(),O.dispose(),k.dispose(),A.dispose(),j.dispose())}}}function be(e){let t=[];return e.traverse(e=>{if(!(e instanceof i))return;let n=e.material;n instanceof o&&n.uniforms.snowSketchFaceCentre!==void 0&&t.push(n)}),t}function xe(e,t,n,r=p){let i=K(e,t,!0,r),a=n.character===null?null:I(n.character,t,(e,t,n,r)=>i.burst(e,t,n,r)),o=te(t,be(e),n.character),s=new u,c=new u,l=!1;return{step(e,r){if(i.step(e,r),a===null||!Number.isFinite(e)||e<=0)return;t.getWorldPosition(s);let o=l?Math.hypot(s.x-c.x,s.z-c.z)/e:0;c.copy(s),l=!0,a.step(e,r&&n.grounded(),o)},setTier:e=>i.setTier(e),reset(){l=!1,i.reset(),a?.reset()},view:o,dispose(){a?.reset(),i.dispose()}}}function q(e,t,n){let r=F(t,!0);return{step:(e,t)=>r.step(e,t),setTier:e=>r.setTier(e),reset:()=>r.reset(),view:te(t,be(t),n.character),dispose:()=>r.dispose()}}export{q as createSnowAuraEffect,xe as createSnowTrailEffect};