//# allFunctionsCalledOnLoad
import{$ as e,Cr as t,P as n,St as r,Tt as i,Ut as a,Xn as o,Z as s,qn as c,v as l,wr as u,wt as d}from"./three.core-DVTiNhEy.js";import{o as f}from"./src-BI6MMqKu.js";import{t as p}from"./trail-emitter-DtJSWeMd.js";import{t as m}from"./trail-slots-BYU9mmsR.js";var h=e=>new l().setHex(f(e),c);function ee(e,t,n,r){return new o({name:e,vertexShader:t,uniforms:{...n,snowWhite:{value:h(`white`)},snowFog:{value:h(`fog`)},snowIce:{value:h(`cyan/2`)}},transparent:!0,depthWrite:!1,depthTest:!0,side:2,forceSinglePass:!0,blending:1,toneMapped:!0,fragmentShader:`
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
      }`})}var g=e=>new l().setHex(f(e),c);function _(e,t,n,r){return new o({name:e,vertexShader:t,uniforms:{...n,snowWhite:{value:g(`white`)},snowIce:{value:g(`cyan/2`)},snowFog:{value:g(`fog`)}},transparent:!0,depthWrite:!1,depthTest:!0,side:2,forceSinglePass:!0,blending:1,toneMapped:!0,fragmentShader:`
      #include <common>
      #include <logdepthbuf_pars_fragment>
      uniform vec3 snowWhite, snowIce, snowFog;
      varying vec2 vSnowUv;
      varying float vSnowFade, vSnowAge, vSnowSeed;

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
        if (alpha < 0.003) discard;
        #include <logdepthbuf_fragment>
        gl_FragColor = vec4(colour, alpha);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`})}var v=new l(f(`white`)),y=new l(f(`fog`)),b=new l(f(`cyan/2`)),x=`
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
`,S=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  uniform float snowClock, snowMotion;
  attribute vec4 snowCycle, snowOrbit, snowDrift;
  varying vec2 vSnowUv;
  varying vec3 vSnowView, vSnowNormal;
  varying float vSnowFade, vSnowAge, vSnowSeed;
  ${x}
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
`,C=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  uniform float snowClock;
  attribute vec2 snowBornLife;
  attribute vec4 snowVelocity, snowProfile;
  varying vec2 vSnowUv;
  varying vec3 vSnowView, vSnowNormal;
  varying float vSnowFade, vSnowAge, vSnowSeed;
  ${x}
  void main() {
    float age = max(0.0, snowClock - snowBornLife.x);
    float k = clamp(age / snowBornLife.y, 0.0, 1.0);
    float phase = snowProfile.w;
    float drift = (1.0 - exp(-age * 0.8)) / 0.8;
    vec3 root = instanceMatrix[3].xyz + snowVelocity.xyz * drift;
    root.x += (sin(age * snowProfile.y + phase) - sin(phase)) * snowProfile.x;
    root.z += (cos(age * snowProfile.y * 0.81 + phase) - cos(phase)) * snowProfile.x;
    root.y = max(snowVelocity.w, root.y - age * age * 0.46);
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
`;function te(e,n){return new o({name:e===`aura`?`Snow_Aura_Flakes_Sketch`:`Snow_Trail_Flakes_Sketch`,uniforms:{snowClock:{value:0},snowMotion:{value:0},...n,snowSketchWhite:{value:v},snowSketchFog:{value:y},snowSketchIce:{value:b},snowSketchFaceCentre:{value:new u},snowSketchFaceRadius:{value:new t(1.05,1.05)},snowSketchFaceEnabled:{value:0}},transparent:!0,depthWrite:!1,depthTest:!0,side:2,forceSinglePass:!0,blending:1,toneMapped:!0,vertexShader:e===`aura`?S:C,fragmentShader:`
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
      }`})}function w(e,t,n){let r=(n??e.parent)?.getObjectByName(`mixamorigHead_06`),i=new u,a=new u;return n=>{n.updateMatrixWorld(),e.updateWorldMatrix(!0,!1);let o;r?(r.updateWorldMatrix(!0,!1),i.set(-.00570525,.6573547,.02455115),r.localToWorld(i),o=1.00256*r.matrixWorld.getMaxScaleOnAxis()+.14):(i.set(0,1.3,0),e.localToWorld(i),o=1.05*e.matrixWorld.getMaxScaleOnAxis()),a.copy(i).applyMatrix4(n.matrixWorldInverse).multiplyScalar(-1);for(let e of t)e.uniforms.snowSketchFaceCentre.value.copy(a),e.uniforms.snowSketchFaceRadius.value.set(o,o),e.uniforms.snowSketchFaceEnabled.value=Number.isFinite(a.lengthSq())&&a.z>.1?1:0}}var T=Math.PI*2,E=120,D=[180,120,72],O=[240,160,96],k=[24,16,10],A=[28,18,10],j=[3,4,5],ne=`
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
  }`,M=`
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
  }`,N=`
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
  }`;function P(t,n=!1){let r={value:0},i={value:0},o={snowClock:r,snowMotion:i},c=n?te(`aura`,o):ee(`Snow_Aura_Flakes`,ne,o,`flake`),l=new a(1,1),u=new s(new Float32Array(D[0]*4),4),f=new s(new Float32Array(D[0]*4),4),p=new s(new Float32Array(D[0]*4),4);l.setAttribute(`snowCycle`,u),l.setAttribute(`snowOrbit`,f),l.setAttribute(`snowDrift`,p);let m=new e(l,c,D[0]);m.name=c.name,m.frustumCulled=!1,m.castShadow=m.receiveShadow=!1,m.renderOrder=1,t.add(m);let h=ee(`Snow_Aura_Powder`,M,o,`powder`),g=new a(1,1),v=new s(new Float32Array(O[0]*4),4),y=new s(new Float32Array(O[0]*4),4),b=new s(new Float32Array(O[0]*4),4);g.setAttribute(`snowCycle`,v),g.setAttribute(`snowOrbit`,y),g.setAttribute(`snowDrift`,b);let x=new e(g,h,O[0]);x.name=h.name,x.frustumCulled=!1,x.castShadow=x.receiveShadow=!1,t.add(x);let S=_(`Snow_Aura_Mist`,N,{...o,snowSpark:{value:0}},`mist`),C=new a(1,1),w=new s(new Float32Array(k[0]*4),4),P=new s(new Float32Array(k[0]*4),4),F=new s(new Float32Array(k[0]*4),4);C.setAttribute(`snowCycle`,w),C.setAttribute(`snowOrbit`,P),C.setAttribute(`snowDrift`,F);let I=new e(C,S,k[0]);I.name=S.name,I.frustumCulled=!1,I.castShadow=I.receiveShadow=!1,t.add(I);let re=_(`Snow_Aura_Sparks`,N,{...o,snowSpark:{value:1}},`spark`),ie=new a(1,1),ae=new s(new Float32Array(A[0]*4),4),L=new s(new Float32Array(A[0]*4),4),oe=new s(new Float32Array(A[0]*4),4);ie.setAttribute(`snowCycle`,ae),ie.setAttribute(`snowOrbit`,L),ie.setAttribute(`snowDrift`,oe);let R=new e(ie,re,A[0]);R.name=re.name,R.frustumCulled=!1,R.castShadow=R.receiveShadow=!1,R.renderOrder=2,t.add(R);let z=new d,se=0,B=0,ce=0,le=1627030653,V=1136554389,ue=279766591,de=2176460157,fe=!1,H=()=>(le^=le<<13,le^=le>>>17,le^=le<<5,(le>>>0)/4294967296),U=()=>(V^=V<<13,V^=V>>>17,V^=V<<5,(V>>>0)/4294967296),W=()=>(ue^=ue<<13,ue^=ue>>>17,ue^=ue<<5,(ue>>>0)/4294967296),G=()=>(de^=de<<13,de^=de>>>17,de^=de<<5,(de>>>0)/4294967296);for(let e=0;e<D[0];e+=1){let t=(e*.61803398875+H()*.06)%1,n=12+Math.floor(H()*17),r=24+Math.floor(H()*19),i=18+Math.floor(H()*25),a=.38+H()*.38;z.makeScale(a,a,1),m.setMatrixAt(e,z),u.setXYZW(e,t,j[e%j.length],T*n/E,.82+H()*.16),f.setXYZW(e,1.7+H()*.95,2.55+H()*.5,5.15+H()*.55,H()*T),p.setXYZW(e,.1+H()*.18,T*r/E,T*i/E*(H()<.5?-1:1),H()<.5?-1:1)}m.instanceMatrix.needsUpdate=!0,u.needsUpdate=f.needsUpdate=p.needsUpdate=!0;for(let e=0;e<O[0];e+=1){let t=(e*.61803398875+U()*.05)%1,n=15+Math.floor(U()*22),r=30+Math.floor(U()*21),i=15+Math.floor(U()*18),a=.06+U()*.08;z.makeScale(a,a,1),x.setMatrixAt(e,z),v.setXYZW(e,t,j[e%j.length],T*n/E,.28+U()*.34),y.setXYZW(e,1.4+U()*1.05,2.35+U()*.55,4.95+U()*.6,U()*T),b.setXYZW(e,.12+U()*.22,T*r/E,T*i/E*(U()<.5?-1:1),U()<.5?-1:1)}x.instanceMatrix.needsUpdate=!0,v.needsUpdate=y.needsUpdate=b.needsUpdate=!0;for(let e=0;e<k[0];e+=1){let t=(e*.61803398875+W()*.05)%1,n=2+Math.floor(W()*6),r=7+Math.floor(W()*7),i=2+Math.floor(W()*5),a=1.1+W()*.7;z.makeScale(a,a*(.65+W()*.2),1),I.setMatrixAt(e,z),w.setXYZW(e,t,j[e%j.length],T*n/E,.35+W()*.17),P.setXYZW(e,2.1+W()*.7,.65+W()*.65,.85+W()*.75,W()*T),F.setXYZW(e,.05+W()*.1,T*r/E,T*i/E*(W()<.5?-1:1),W()<.5?-1:1)}I.instanceMatrix.needsUpdate=!0,w.needsUpdate=P.needsUpdate=F.needsUpdate=!0;for(let e=0;e<A[0];e+=1){let t=(e*.61803398875+G()*.04)%1,n=7+Math.floor(G()*10),r=15+Math.floor(G()*13),i=6+Math.floor(G()*13),a=.16+G()*.16;z.makeScale(a,a,1),R.setMatrixAt(e,z),ae.setXYZW(e,t,j[e%j.length],T*n/E,.8+G()*.2),L.setXYZW(e,1.75+G()*.95,.6+G()*1.1,1.4+G()*.8,G()*T),oe.setXYZW(e,.04+G()*.1,T*r/E,T*i/E*(G()<.5?-1:1),G()<.5?-1:1)}R.instanceMatrix.needsUpdate=!0,ae.needsUpdate=L.needsUpdate=oe.needsUpdate=!0;let pe=()=>{B=ce=0,r.value=i.value=0};return{step(e,t){if(fe||!Number.isFinite(e)||e<=0)return;let n=Math.min(e,.1);B=(B+n)%E,ce+=(+!!t-ce)*(1-Math.exp(-n/.25)),r.value=B,i.value=ce},setTier(e){fe||e===se||e!==0&&e!==1&&e!==2||(se=e,m.count=D[se],x.count=O[se],I.count=k[se],R.count=A[se])},reset(){fe||pe()},dispose(){fe||(fe=!0,m.removeFromParent(),l.dispose(),c.dispose(),m.dispose(),x.removeFromParent(),g.dispose(),h.dispose(),x.dispose(),I.removeFromParent(),C.dispose(),S.dispose(),I.dispose(),R.removeFromParent(),ie.dispose(),re.dispose(),R.dispose())}}}function F(e,t,n){let i=[];e.traverse(e=>{e.isBone&&i.push(e)});let a=e=>i.find(t=>RegExp(`${e}ToeBase(?:_\\d+)?$`).test(t.name)),o=[{bone:a(`Left`),side:-1,height:0,descending:!1,observed:!1,cooldown:0},{bone:a(`Right`),side:1,height:0,descending:!1,observed:!1,cooldown:0}],s=new u,c=new u,l=()=>{for(let e of o)e.height=e.cooldown=0,e.descending=e.observed=!1};return{step(e,i,a){if(!Number.isFinite(e)||e<=0||!Number.isFinite(a))return;if(!i||e>.25){l();return}let u=.2+r.clamp((a-40)/53,0,1)*.08;c.setFromMatrixPosition(t.matrixWorld);for(let t of o){if(!t.bone)continue;s.setFromMatrixPosition(t.bone.matrixWorld);let r=s.y-c.y;if(t.cooldown+=e,!t.observed){t.height=r,t.observed=!0;continue}let i=r-t.height;i<-.002&&(t.descending=!0),t.descending&&i>.002&&t.cooldown>=.04&&t.height<=u&&(n(s.x,c.y+.04,s.z,t.side),t.descending=!1,t.cooldown=0),t.height=r}},reset:l}}var I=Math.PI*2,re=[.28,.42,.65],ie=[3,2,2],ae=2.4,L=28672,oe=1445701937,R=[.22,.34,.55],z=[2,2,1],se=1.5,B=16384,ce=878477799,le=[.9,1.4,2],V=[1.2,1.8,2.7],ue=[5,4,3],de=1.7,fe=4096,H=.8,U=1024,W=.65,G=256,pe=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  uniform float snowClock;
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
    root.y = max(snowVelocity.w, root.y - age * age * 0.46);
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
  }`,me=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  uniform float powderClock;
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
    root.y = max(powderVelocity.w, root.y - age * age * 0.60);
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
  }`,K=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  uniform float snowAirClock, snowAirDrag, snowAirGravity, snowAirGrowth, snowAirFadeAt;
  attribute vec2 snowAirBornLife;
  attribute vec4 snowAirVelocity;
  attribute vec4 snowAirProfile;
  varying vec2 vSnowUv;
  varying float vSnowFade, vSnowAge, vSnowSeed;

  void main() {
    float age = max(0.0, snowAirClock - snowAirBornLife.x);
    float k = clamp(age / snowAirBornLife.y, 0.0, 1.0);
    float phase = snowAirProfile.w;
    float drift = (1.0 - exp(-age * snowAirDrag)) / snowAirDrag;
    vec3 root = instanceMatrix[3].xyz + snowAirVelocity.xyz * drift;
    root.x += (sin(age * snowAirProfile.y + phase) - sin(phase)) * snowAirProfile.x;
    root.z += (cos(age * snowAirProfile.y * 0.81 + phase) - cos(phase)) * snowAirProfile.x;
    root.y = max(snowAirVelocity.w, root.y - age * age * snowAirGravity);
    vec2 size = vec2(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz));
    vec2 card = position.xy * size * mix(1.0, snowAirGrowth, k);
    float turn = sin(phase) * 0.18 + age * sin(phase * 1.7) * 0.16;
    float c = cos(turn), s = sin(turn);
    card = vec2(c * card.x - s * card.y, s * card.x + c * card.y);
    vec4 centre = modelViewMatrix * vec4(root, 1.0);
    centre.xy += card * length(modelViewMatrix[0].xyz);
    gl_Position = projectionMatrix * centre;
    #include <logdepthbuf_vertex>
    vSnowUv = uv;
    vSnowAge = age;
    vSnowSeed = phase;
    vSnowFade = snowAirProfile.z * smoothstep(0.0, 0.04, k)
      * (1.0 - smoothstep(snowAirFadeAt, 1.0, k));
  }`;function he(t,r,i,o,c,l){let u=_(r,K,{snowAirClock:{value:0},snowAirDrag:{value:i===`burst`?2:.9},snowAirGravity:{value:i===`burst`?1.6:i===`mist`?.18:.34},snowAirGrowth:{value:i===`spark`?.78:i===`burst`?1.4:1.2},snowAirFadeAt:{value:i===`spark`?.35:.4}},i),f=new a(1,1),p=new s(new Float32Array(o*2),2).setUsage(n),h=new s(new Float32Array(o*4),4).setUsage(n),ee=new s(new Float32Array(o*4),4).setUsage(n);f.setAttribute(`snowAirBornLife`,p),f.setAttribute(`snowAirVelocity`,h),f.setAttribute(`snowAirProfile`,ee);let g=new e(f,u,o);g.name=r,g.renderOrder=i===`spark`?3:2,g.instanceMatrix.setUsage(n),g.count=0,g.visible=!1,g.frustumCulled=!1,g.castShadow=!1,g.receiveShadow=!1,t.add(g);let v=[g.instanceMatrix,p,h,ee],y=new Float64Array(o),b=new d,x=0,S=l,C=m(),te=-1,w=!1;return{random(){return S^=S<<13,S^=S>>>17,S^=S<<5,(S>>>0)/4294967296},emit(e,t,n,r,i,a,s,l,u,d,f,m,_,v){if(x===o)return;let S=x++;te<0&&(te=S),b.makeScale(i,a,i),b.setPosition(t,n,r),g.setMatrixAt(S,b),y[S]=e,p.setXY(S,e,c),h.setXYZW(S,s,l,u,d),ee.setXYZW(S,f,m,_,v)},expire(e){let t=0;for(;t<x;){if(e-y[t]<c){t+=1;continue}let n=--x;if(t!==n){y[t]=y[n];for(let e of v){let r=e.itemSize;e.array.copyWithin(t*r,n*r,(n+1)*r)}C.moved(t)}}},rebase(e){for(let t=0;t<x;t+=1)y[t]=y[t]-e,p.setX(t,y[t]);w=!0},finish(e){g.count=x,g.visible=x>0,u.uniforms.snowAirClock.value=e;for(let e of v){let t=e.itemSize,n=!1;e===p&&w&&x>0?(e.addUpdateRange(0,x*t),n=!0):n=C.upload(e,te,x),n&&(e.needsUpdate=!0)}C.clear(),te=-1,w=!1},clear(){x=g.count=0,g.visible=!1,S=l,u.uniforms.snowAirClock.value=0,C.clear(),te=-1,w=!1;for(let e of v)e.clearUpdateRanges()},dispose(){g.removeFromParent(),f.dispose(),u.dispose(),g.dispose()}}}function q(t,r,i=!1){let o={snowClock:{value:0}},c=i?te(`trail`,o):ee(`Snow_Trail_Flakes`,pe,o,`flake`),l=new a(1,1),f=new s(new Float32Array(L*2),2).setUsage(n),h=new s(new Float32Array(L*4),4).setUsage(n),g=new s(new Float32Array(L*4),4).setUsage(n);l.setAttribute(`snowBornLife`,f),l.setAttribute(`snowVelocity`,h),l.setAttribute(`snowProfile`,g);let _=new e(l,c,L);_.name=c.name,_.instanceMatrix.setUsage(n),_.count=0,_.visible=!1,_.frustumCulled=!1,_.castShadow=!1,_.receiveShadow=!1,t.add(_);let v=ee(`Snow_Trail_Powder`,me,{powderClock:{value:0}},`powder`),y=new a(1,1),b=new s(new Float32Array(B*2),2).setUsage(n),x=new s(new Float32Array(B*4),4).setUsage(n),S=new s(new Float32Array(B*4),4).setUsage(n);y.setAttribute(`powderBornLife`,b),y.setAttribute(`powderVelocity`,x),y.setAttribute(`powderProfile`,S);let C=new e(y,v,B);C.name=v.name,C.renderOrder=1,C.instanceMatrix.setUsage(n),C.count=0,C.visible=!1,C.frustumCulled=!1,C.castShadow=!1,C.receiveShadow=!1,t.add(C);let w=he(t,`Snow_Trail_Mist`,`mist`,fe,de,592409425),T=he(t,`Snow_Trail_Spark`,`spark`,U,H,1779778327),E=he(t,`Snow_Trail_Burst`,`burst`,G,W,357139745),D=p(512),O=p(512),k=[_.instanceMatrix,f,h,g],A=new Float64Array(L),j=p(2048),ne=[C.instanceMatrix,b,x,S],M=new Float64Array(B),N=p(2048),P=new u,F=new d,K=0,q=0,J=0,Y=0,X=-1,ge=oe,_e=m(),ve=m(),ye=-1,be=!1,Z=0,xe=ce,Se=0,Ce=-1,we=-1,Te=!1,Ee=!1,De=!1,Q=()=>(ge^=ge<<13,ge^=ge>>>17,ge^=ge<<5,(ge>>>0)/4294967296),$=()=>(xe^=xe<<13,xe^=xe>>>17,xe^=xe<<5,(xe>>>0)/4294967296),Oe=()=>{J=_.count=0,_.visible=!1,q=0,c.uniforms.snowClock.value=0,_e.clear(),ye=-1,be=!1;for(let e of k)e.clearUpdateRanges();Z=C.count=0,C.visible=!1,v.uniforms.powderClock.value=0,ve.clear(),we=-1,Te=!1;for(let e of ne)e.clearUpdateRanges();w.clear(),T.clear(),E.clear(),De=!1},ke=()=>{let e=0;for(;e<J;){if(q-A[e]<ae){e+=1;continue}let t=--J;if(e!==t){A[e]=A[t];for(let n of k){let r=n.itemSize;n.array.copyWithin(e*r,t*r,(t+1)*r)}_e.moved(e)}}},Ae=()=>{let e=0;for(;e<Z;){if(q-M[e]<se){e+=1;continue}let t=--Z;if(e!==t){M[e]=M[t];for(let n of ne){let r=n.itemSize;n.array.copyWithin(e*r,t*r,(t+1)*r)}ve.moved(e)}}},je=e=>{for(let t=0;t<J;t+=1)A[t]=A[t]-e,f.setX(t,A[t]);be=!0;for(let t=0;t<Z;t+=1)M[t]=M[t]-e,b.setX(t,M[t]);Te=!0,w.rebase(e),T.rebase(e),E.rebase(e)},Me=e=>{if(J===L)return;let t=J++,n=e*3;ye<0&&(ye=t);let r=X,i=-Y,a=(Q()-.5)*1.5,o=-.08-Q()*.24,s=j.positions[n]+r*a+Y*o,c=j.positions[n+1],l=c+.18+Q()*.82,u=j.positions[n+2]+i*a+X*o,d=.3+Q()*.38;F.makeScale(d,d,d),F.setPosition(s,l,u),_.setMatrixAt(t,F),A[t]=q-j.elapsed[e],f.setXY(t,A[t],ae);let p=(a<0?-1:1)*(.65+Q()*.7),m=.28+Q()*.44;h.setXYZW(t,r*p-Y*m,.12+Q()*.3,i*p-X*m,c+.06),g.setXYZW(t,.04+Q()*.12,1.6+Q()*1.5,.8+Q()*.18,Q()*I)},Ne=e=>{if(Z===B)return;let t=Z++,n=e*3;we<0&&(we=t);let r=Ce,i=-Se,a=($()-.5)*1.4,o=-.1-$()*.22,s=N.positions[n]+r*a+Se*o,c=N.positions[n+1],l=c+.1+$()*.32,u=N.positions[n+2]+i*a+Ce*o,d=.07+$()*.1;F.makeScale(d,d,d),F.setPosition(s,l,u),C.setMatrixAt(t,F),M[t]=q-N.elapsed[e],b.setXY(t,M[t],se);let f=(a<0?-1:1)*(.7+$()*1.1),p=.32+$()*.5;x.setXYZW(t,r*f-Se*p,.14+$()*.18,i*f-Ce*p,c+.045),S.setXYZW(t,.02+$()*.05,2+$()*1.8,.78+$()*.2,$()*I)},Pe=e=>{let t=e*3,n=X,r=-Y,i=(w.random()-.5)*1.3,a=-.1-w.random()*.25,o=D.positions[t+1],s=1+w.random()*.65,c=s*(.5+w.random()*.2),l=(i<0?-1:1)*(.08+w.random()*.2),u=.16+w.random()*.16;w.emit(q-D.elapsed[e],D.positions[t]+n*i+Y*a,o+.12+w.random()*.18,D.positions[t+2]+r*i+X*a,s,c,n*l-Y*u,.06+w.random()*.06,r*l-X*u,o+.08,.02+w.random()*.04,1+w.random()*.7,.45+w.random()*.23,w.random()*I)},Fe=e=>{let t=e*3,n=X,r=-Y,i=(T.random()-.5)*2.1,a=-.1-T.random()*.35,o=O.positions[t+1],s=.13+T.random()*.12,c=(i<0?-1:1)*(.15+T.random()*.25),l=.12+T.random()*.23;T.emit(q-O.elapsed[e],O.positions[t]+n*i+Y*a,o+.18+T.random()*.67,O.positions[t+2]+r*i+X*a,s,s,n*c-Y*l,.05+T.random()*.16,r*c-X*l,o+.06,.015+T.random()*.035,2+T.random()*1,.8+T.random()*.18,T.random()*I)},Ie=(e,t,n,r)=>{let i=X,a=-Y,o=r*(.02+E.random()*.1),s=-.02-E.random()*.1,c=.26+E.random()*.28,l=c*(.55+E.random()*.28),u=r*(.8+E.random()*1),d=.18+E.random()*.5;E.emit(q,e+i*o+Y*s,t+.04+E.random()*.06,n+a*o+X*s,c,l,i*u-Y*d,.35+E.random()*.5,a*u-X*d,t+.015,.02+E.random()*.04,2.4+E.random()*1.2,.62+E.random()*.28,E.random()*I)},Le=()=>{_.count=J,_.visible=J>0,c.uniforms.snowClock.value=q;for(let e of k){let t=e.itemSize,n=!1;e===f&&be&&J>0?(e.addUpdateRange(0,J*t),n=!0):n=_e.upload(e,ye,J),n&&(e.needsUpdate=!0)}_e.clear(),ye=-1,be=!1},Re=()=>{C.count=Z,C.visible=Z>0,v.uniforms.powderClock.value=q;for(let e of ne){let t=e.itemSize,n=!1;e===b&&Te&&Z>0?(e.addUpdateRange(0,Z*t),n=!0):n=ve.upload(e,we,Z),n&&(e.needsUpdate=!0)}ve.clear(),we=-1,Te=!1};return{setTier(e){if(e!==0&&e!==1&&e!==2)throw RangeError(`Invalid snow trail tier`);Ee||(K=e)},step(e,t){if(De=!1,Ee||!Number.isFinite(e)||e<=0)return;r.getWorldPosition(P);let n=j.step(P.x,P.y,P.z,e,t,re[K]),i=N.step(P.x,P.y,P.z,e,t,R[K]),a=D.step(P.x,P.y,P.z,e,t,le[K]),o=O.step(P.x,P.y,P.z,e,t,V[K]);if(D.cleared||O.cleared){Oe();return}if(j.cleared||N.cleared){Oe();return}if(q+=e,q>=128){let e=Math.floor(q/128)*128;q-=e,je(e)}ke(),Ae(),w.expire(q),T.expire(q),E.expire(q);let s=j.direction,c=Math.hypot(s[0],s[2]);c>1e-5&&(Y=s[0]/c,X=s[2]/c);let l=N.direction,u=Math.hypot(l[0],l[2]);u>1e-5&&(Se=l[0]/u,Ce=l[2]/u);for(let e=0;e<n;e+=1)for(let t=0;t<ie[K];t+=1)Me(e);for(let e=0;e<i;e+=1)for(let t=0;t<z[K];t+=1)Ne(e);for(let e=0;e<a;e+=1)Pe(e);for(let e=0;e<o;e+=1)Fe(e);Le(),Re(),w.finish(q),T.finish(q),E.finish(q),De=t},burst(e,t,n,r){if(!(Ee||!De||r!==-1&&r!==1||!Number.isFinite(e)||!Number.isFinite(t)||!Number.isFinite(n)||Math.max(Math.abs(e),Math.abs(t),Math.abs(n))>34028234663852886e22)){for(let i=0;i<ue[K];i+=1)Ie(e,t,n,r);E.finish(q)}},reset(){Ee||(Oe(),j.reset(),Y=0,X=-1,ge=oe,N.reset(),Se=0,Ce=-1,xe=ce,D.reset(),O.reset())},dispose(){Ee||(Ee=!0,_.removeFromParent(),l.dispose(),c.dispose(),_.dispose(),C.removeFromParent(),y.dispose(),v.dispose(),C.dispose(),w.dispose(),T.dispose(),E.dispose())}}}function J(e){let t=[];return e.traverse(e=>{if(!(e instanceof i))return;let n=e.material;n instanceof o&&n.uniforms.snowSketchFaceCentre!==void 0&&t.push(n)}),t}function Y(e,t,n){let r=q(e,t,!0),i=n.character===null?null:F(n.character,t,(e,t,n,i)=>r.burst(e,t,n,i)),a=w(t,J(e),n.character),o=new u,s=new u,c=!1;return{step(e,a){if(r.step(e,a),i===null||!Number.isFinite(e)||e<=0)return;t.getWorldPosition(o);let l=c?Math.hypot(o.x-s.x,o.z-s.z)/e:0;s.copy(o),c=!0,i.step(e,a&&n.grounded(),l)},setTier:e=>r.setTier(e),reset(){c=!1,r.reset(),i?.reset()},view:a,dispose(){i?.reset(),r.dispose()}}}function X(e,t,n){let r=P(t,!0);return{step:(e,t)=>r.step(e,t),setTier:e=>r.setTier(e),reset:()=>r.reset(),view:w(t,J(t),n.character),dispose:()=>r.dispose()}}export{X as createSnowAuraEffect,Y as createSnowTrailEffect};