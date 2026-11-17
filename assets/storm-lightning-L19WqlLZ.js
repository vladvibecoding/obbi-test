//# allFunctionsCalledOnLoad
import{B as e,Xn as t,d as n,qn as r,v as i}from"./three.core-DVTiNhEy.js";import{o as a}from"./src-BI6MMqKu.js";var o=e=>new i().setHex(a(e),r),s=`
  // Номер ветви, глубина (0 ствол, 1 ветвь, 2 развилка), её первичная ветвь, ширина в вершине.
  attribute vec4 stormBranch;
  // Узел вершины, число отрезков ветви, узел ствола под первичной ветвью и узел ветви под развилкой.
  attribute vec4 stormKnot;

  // fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453) для нескольких p: dot по каждой
  // доле, как раньше, а синус, множитель и дробная часть — одной командой на все доли.
  vec3 stormBoltHash(vec2 a, vec2 b, vec2 c) {
    vec2 k = vec2(127.1, 311.7);
    return fract(sin(vec3(dot(a, k), dot(b, k), dot(c, k))) * 43758.5453);
  }

  vec4 stormBoltHash(vec2 a, vec2 b, vec2 c, vec2 d) {
    vec2 k = vec2(127.1, 311.7);
    return fract(sin(vec4(dot(a, k), dot(b, k), dot(c, k), dot(d, k))) * 43758.5453);
  }

  // Точка ветви и две точки для касательной: на 0.018 пути назад и вперёд.
  // Вершины ленты стоят ровно в узлах ломаной, поэтому точка — сам узел, а точки
  // касательной лежат на соседних отрезках той же ветви. У крайнего узла соседа
  // нет, и точка касательной совпадает с ним, как при обрезке t до [0, 1].
  void stormBoltFrame(float seed, float shape, out vec3 point, out vec3 before, out vec3 after) {
    float branch = stormBranch.x, depth = stormBranch.y, primary = stormBranch.z;
    float count = stormKnot.y;
    vec3 root = vec3(0.0, -0.5, 0.0), end = vec3(0.0, 0.5, 0.0);
    vec3 previous = root, next = root;
    point = root;
    // Шаги по глубине ведут к корню своей ветви, три последних дают её узлы.
    int steps = int(depth) + 3;
    for (int i = 0; i < steps; i++) {
      float stage = min(float(i), depth);
      bool side = stage > 0.5, last = stage > 1.5, attach = float(i) < depth;
      float n = last ? 3.0 : side ? 4.0 : 8.0;
      float id = last ? branch : side ? primary : 0.0;
      float knot = attach ? (side ? stormKnot.w : stormKnot.z)
        : clamp(stormKnot.x + float(i) - depth - 1.0, 0.0, n);
      vec3 rate = side ? vec3(8.1, 6.7, 4.3) : vec3(7.3, 3.9, 5.7);
      vec3 shift = side ? vec3(0.0) : vec3(0.0, 47.0, 19.0);
      vec3 lift = side ? vec3(0.0, 41.0, 13.0) : vec3(0.0, 7.0, 31.0);
      vec3 bend = last ? vec3(0.018, 0.010, 0.012) : side ? vec3(0.028, 0.016, 0.025) : vec3(0.16, 0.035, 0.10);
      float interior = step(0.5, knot) * (1.0 - step(n - 0.5, knot));
      vec3 noise = stormBoltHash(vec2(seed + knot * rate.x + id * 43.0 + shift.x, shape + lift.x),
        vec2(seed + knot * rate.y + id * 31.0 + shift.y, shape + lift.y),
        vec2(seed + knot * rate.z + id * 29.0 + shift.z, shape + lift.z)) * 2.0 - 1.0;
      vec3 value = mix(root, end, knot / n) + noise * bend * interior;
      if (attach) {
        // Узел родителя стал корнем, конец ветви — корень плюс вылет: по x знак
        // чередуется с номером ветви, по z выбирается хешем.
        float child = side ? branch : primary;
        vec4 reachLift = side ? vec4(73.0, 83.0, 97.0, 61.0) : vec4(11.0, 23.0, 37.0, 53.0);
        vec3 base = side ? vec3(0.10, 0.08, 0.03) : vec3(0.24, 0.10, 0.05);
        vec3 span = side ? vec3(0.04, 0.04, 0.035) : vec3(0.12, 0.06, 0.05);
        vec4 pull = stormBoltHash(vec2(seed + child, shape + reachLift.x), vec2(seed + child * 3.0, shape + reachLift.y),
          vec2(seed + child * 5.0, shape + reachLift.z), vec2(seed + child * 17.0, shape + reachLift.w));
        float signX = mod(child, 2.0) > 0.5 ? -1.0 : 1.0;
        float signZ = pull.w < 0.5 ? -1.0 : 1.0;
        root = value;
        end = value + vec3(signX * (base.x + span.x * pull.x), base.y + span.y * pull.y,
          signZ * (base.z + span.z * pull.z));
      } else {
        previous = point; point = next; next = value;
      }
    }
    float reach = 0.018 * count;
    before = mix(point, previous, reach);
    after = mix(point, next, reach);
  }`,c=Math.fround;function l(e,t){let n=e=>c(1+c(t*c(c(e)-1)));if(e===0)return 1;if(e<5)return c(c(.45)*n(.18));let r=(e-4)%2==1?.5:.75;return c(c(c(c(.45)*c(1+c(r*c(c(.18)-1))))*c(.7))*n(.1))}function u(){let t=[],r=[],i=[],a=[];for(let e=0;e<9;e+=1){let n=e===0?8:e<5?4:3,o=e===0?0:e<5?1:2,s=e===0?0:e<5?e:e-4,u=s===0?0:[2,3,5,6][s-1],d=s===0?0:s%2==1?2:3;for(let f=0;f<n;f+=1){let p=f/n,m=(f+1)/n;for(let[h,g]of[[0,0],[1,0],[0,1],[1,0],[1,1],[0,1]]){let _=g===0?p:m;t.push(h-.5,_-.5,0),r.push(h,_),i.push(e,o,s,l(e,c(_))),a.push(f+g,n,u,d)}}}let o=new n;return o.setAttribute(`position`,new e(t,3)),o.setAttribute(`uv`,new e(r,2)),o.setAttribute(`stormBranch`,new e(i,4)),o.setAttribute(`stormKnot`,new e(a,4)),o}var d=`
  #include <common>
  #include <logdepthbuf_pars_fragment>
  uniform vec3 stormWhite, stormBlue, stormViolet, stormNight;
  varying vec2 vStormUv;
  varying float vStormFade, vStormAge, vStormSeed, vStormFlash;
`,f=`
    if (alpha < 0.003) discard;
    #include <logdepthbuf_fragment>
    gl_FragColor = vec4(colour, clamp(alpha, 0.0, 0.98));
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
`,p=`${d}
  uniform vec3 stormBlack;
  varying float vStormConnected;
  void main() {
    if (vStormFade < 0.003) discard;
    float across = abs(vStormUv.x * 2.0 - 1.0);
    float edge = max(fwidth(across), 0.015);
    float core = 1.0 - smoothstep(0.16 - edge, 0.16 + edge, across);
    float fill = 1.0 - smoothstep(0.60 - edge, 0.60 + edge, across);
    float outline = 1.0 - smoothstep(0.90 - edge, 0.90 + edge, across);
    float tip = mix(smoothstep(0.0, 0.025, vStormUv.y)
      * (1.0 - smoothstep(0.95, 1.0, vStormUv.y)), 1.0, vStormConnected);
    vec3 light = mix(stormBlue, stormWhite, core * 0.98);
    vec3 colour = mix(stormBlack, light, fill);
    float alpha = outline * 0.98 * tip * vStormFade;
${f}
  }`,m=`${d}
  void main() {
    if (vStormFade < 0.003) discard;
    vec2 p = vStormUv * 2.0 - 1.0;
    float radius = length(p);
    float edge = max(fwidth(radius), 0.014);
    float width = 0.045 + edge * 0.55;
    float vertical = exp(-abs(p.x) / width) * pow(max(0.0, 1.0 - abs(p.y)), 1.5);
    float horizontal = exp(-abs(p.y) / width) * pow(max(0.0, 1.0 - abs(p.x)), 1.5);
    float core = exp(-dot(p, p) * 75.0);
    float halo = exp(-dot(p, p) * 14.0) * 0.09;
    vec3 colour = mix(stormBlue, stormWhite, 0.52 + core * 0.45);
    float alpha = min(1.0, vertical + horizontal + core + halo)
      * (1.0 - smoothstep(0.78, 1.0, radius)) * vStormFade;
${f}
  }`,h=`${d}
  float stormCloudHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float stormCloudNoise(vec2 p) {
    vec2 cell = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(stormCloudHash(cell), stormCloudHash(cell + vec2(1.0, 0.0)), f.x),
      mix(stormCloudHash(cell + vec2(0.0, 1.0)), stormCloudHash(cell + vec2(1.0, 1.0)), f.x), f.y);
  }
  void main() {
    if (vStormFade < 0.003) discard;
    vec2 p = vStormUv * 2.0 - 1.0;
    vec2 drift = vec2(vStormAge * 0.11, -vStormAge * 0.07);
    vec2 field = p * 2.7 + vec2(vStormSeed * 1.7, vStormSeed * 0.73) + drift;
    float folds = stormCloudNoise(field) * 0.68 + stormCloudNoise(field * 2.1 - drift) * 0.32;
    float radius = length(p * vec2(0.91, 1.04));
    float silhouette = 1.0 - smoothstep(0.42 + folds * 0.20, 0.84 + folds * 0.12, radius);
    float mass = smoothstep(0.15, 0.86, folds);
    float rim = pow(max(0.0, radius), 1.7) * silhouette;
    vec3 colour = mix(stormNight, stormViolet, 0.16 + mass * 0.48);
    colour = mix(colour, stormBlue, rim * (0.16 + vStormFlash * 0.48));
    colour = mix(colour, stormWhite, vStormFlash * (0.10 + mass * 0.24));
    float alpha = silhouette * (0.35 + mass * 0.30) * vStormFade;
${f}
  }`;function g(e,n,r,i,a=`black`){return new t({name:e,vertexShader:n,fragmentShader:i===`bolt`?p:i===`spark`?m:h,uniforms:{...r,stormWhite:{value:o(`white`)},stormBlue:{value:o(`cyan/1`)},stormViolet:{value:o(`lavender/-1`)},stormNight:{value:o(`night`)},...i===`bolt`?{stormBlack:{value:o(a)}}:{}},transparent:!0,depthWrite:!1,depthTest:!0,side:2,forceSinglePass:!0,blending:1,toneMapped:!0})}export{u as n,g as r,s as t};