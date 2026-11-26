//# allFunctionsCalledOnLoad
import{$ as e,B as t,Cr as n,Jt as r,K as i,P as a,R as o,St as s,T as c,Xn as l,Z as u,Zn as d,d as f,nr as p,ot as m,u as h,v as g,wr as _,wt as v}from"./three.core-DVTiNhEy.js";import{W as y}from"./src-DVKJdJZg.js";import{o as b}from"./src-BI6MMqKu.js";import{n as x,r as S,t as C}from"./trail-shape-BsaeWHuc.js";import{t as w}from"./trail-slots-BYU9mmsR.js";var T=new g(b(`black`)),E=new g(b(`violet/1`)),D=new g(b(`white`)),O=new g(b(`violet/-1`));function k(){return new m([new n(0,-.75),new n(.13,-.69),new n(.24,-.48),new n(.26,-.15),new n(.2,.1),new n(.1,.35),new n(.035,.65),new n(0,.94)],8)}function A(){return{inkTime:{value:0},inkFaceCentre:{value:new _},inkFaceRadius:{value:new n(1.05,1.05)},inkFaceEnabled:{value:0}}}var j=`
  vec3 inkAlign(vec3 p, vec3 d) {
    float c = d.y;
    if (c < -0.999999) return vec3(-p.x, -p.y, p.z);
    vec3 v = vec3(d.z, 0.0, -d.x);
    return p * c + cross(v, p) + v * (dot(v, p) / (1.0 + c));
  }
`,M=`
  void inkProject(vec3 point, vec3 normal) {
    vec4 mvPosition = modelViewMatrix * vec4(point, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vInkView = -mvPosition.xyz;
    vInkNormal = normalize(normalMatrix * normal);
  }
`,N=`
  varying vec3 vInkView, vInkNormal, vInkColour;
  varying vec2 vInkUv;
  varying float vInkAlpha, vInkWet;
`,P=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  attribute float inkAlpha, inkWet;
  uniform vec3 inkColour;
  ${N}
  void main() {
    #include <beginnormal_vertex>
    #include <defaultnormal_vertex>
    vInkNormal = normalize(transformedNormal);
    vec3 transformed = position;
    #include <project_vertex>
    vInkView = -mvPosition.xyz; vInkColour = inkColour;
    vInkUv = uv; vInkAlpha = inkAlpha; vInkWet = inkWet;
    #include <logdepthbuf_vertex>
  }`,F=`
  #include <common>
  #include <logdepthbuf_pars_fragment>
  uniform float inkTime, inkFaceEnabled;
  uniform vec3 inkRim, inkWhite, inkFaceCentre;
  uniform vec2 inkFaceRadius;
  ${N}
  void main() {
    if (vInkAlpha < 0.003) discard;
    if (inkFaceEnabled > 0.5 && vInkView.z < inkFaceCentre.z + inkFaceRadius.y) {
      vec2 offset = vInkView.xy / max(vInkView.z, 0.001)
        - inkFaceCentre.xy / max(inkFaceCentre.z, 0.001);
      float offAxis = sqrt(1.0 + dot(inkFaceCentre.xy, inkFaceCentre.xy)
        / max(inkFaceCentre.z * inkFaceCentre.z, 0.0001));
      vec2 radius = inkFaceRadius * offAxis / max(inkFaceCentre.z - inkFaceRadius.x, 0.1);
      if (dot(offset / radius, offset / radius) < 1.0) discard;
    }
    vec3 normal = normalize(vInkNormal) * (gl_FrontFacing ? 1.0 : -1.0);
    vec3 view = normalize(vInkView + vec3(0.0001));
    vec3 light = normalize(mat3(viewMatrix) * vec3(-0.35, 0.84, 0.42));
    float face = max(0.0, dot(normal, view));
    float rim = pow(1.0 - face, 3.0);
    float gloss = pow(max(0.0, dot(normal, normalize(light + view))), 72.0) * vInkWet;
    float alpha = vInkAlpha, edge = 0.0, grain = 1.0;
    #ifdef INK_BRUSH
      float across = abs(vInkUv.y * 2.0 - 1.0);
      float fibres = sin(vInkUv.y * 123.0 + sin(vInkUv.x * 4.7) * 2.3 + inkTime * 0.06);
      grain = 0.89 + fibres * 0.07;
      edge = smoothstep(0.65, 0.93, across);
      alpha *= (1.0 - smoothstep(0.94, 1.0, across))
        * (1.0 - smoothstep(0.8, 1.0, fibres) * edge * 0.42);
    #endif
    vec3 colour = vInkColour * grain * (0.72 + max(0.0, dot(normal, light)) * 0.38);
    colour = mix(colour, inkRim, clamp(edge * 0.62 + rim * 0.23, 0.0, 0.78));
    colour += mix(inkRim, inkWhite, 0.68) * gloss * 0.58;
    if (alpha < 0.003) discard;
    #include <logdepthbuf_fragment>
    gl_FragColor = vec4(colour, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`;function I(e,t,n,r,i={}){let a=new l({name:e,defines:n?{INK_BRUSH:1}:{},transparent:!0,depthWrite:!1,side:2,forceSinglePass:!0,toneMapped:!0,uniforms:{...i,inkColour:{value:T},inkViolet:{value:O},inkRim:{value:E},inkWhite:{value:D},inkTime:r.inkTime,inkFaceCentre:r.inkFaceCentre,inkFaceRadius:r.inkFaceRadius,inkFaceEnabled:r.inkFaceEnabled},vertexShader:t,fragmentShader:F});return Object.assign(a.defaultAttributeValues,{inkAlpha:[1],inkWet:[1]}),a}function L(e,t){let n=new _;return r=>{if(!t){e.inkFaceEnabled.value=0;return}r.updateMatrixWorld(),t.updateWorldMatrix(!0,!1),n.set(-.00570525,.6573547,.02455115),t.localToWorld(n);let i=1.00256*t.matrixWorld.getMaxScaleOnAxis()+.14;e.inkFaceRadius.value.set(i,i);let a=e.inkFaceCentre.value;a.copy(n).applyMatrix4(r.matrixWorldInverse).multiplyScalar(-1),e.inkFaceEnabled.value=Number.isFinite(a.lengthSq())&&a.z>.1?1:0}}var R=Math.PI*2,z=56,B=25,V=7,H=[0,4,8,1,5,9,2,6,10,3,7],ee=[11,8,6],U=[56,32,18];function te(e){let t=e%3,n=Math.floor(e/3)%3,r=e%2,i=e>8.5,a={bearing:e*R/11,radius:2.61+e%4*.18,rate:.42+e*.031,offset:e*1.7,width:i?.1+r*.024:.31+e%4*.095,thickness:i?.015:.028};return t===0?{...a,turn:.44,sway:.19,swayRate:R,swayPhase:1,base:-2.02,rise:2.84+r*.34,lift:.12,liftRate:R,liftPhase:1}:t===1?{...a,turn:1.18+n*.19,sway:.08,swayRate:5.6,swayPhase:1,base:-1.59+n*.92,rise:0,lift:.44,liftRate:Math.PI,liftPhase:.16}:{...a,turn:.54,sway:.39,swayRate:Math.PI*1.4,swayPhase:.28,base:.84-r*.31,rise:-(2.66+n*.08),lift:.13,liftRate:5.7,liftPhase:1}}var W=Array.from({length:11},(e,t)=>te(t)),G=e=>.04+Math.max(0,Math.sin(e*Math.PI))**.52*.96,K=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  uniform float inkClock, inkMotion;
  uniform vec3 inkColour;
  // Экземпляр — мазок. Угол: азимут, уклон вдоль длины, размах и частота волны.
  attribute vec4 inkTurn;
  // Доля фазы в волне угла, радиус, начало и подъём высоты вдоль длины.
  attribute vec4 inkRise;
  // Размах, частота и доля фазы волны высоты; скорость фазы мазка.
  attribute vec4 inkLift;
  // Сдвиг фазы, полуширина, прибавка толщины, номер мазка.
  attribute vec4 inkStroke;
  // Вершина, общая для всех мазков: сужение к концам в своём ряду и на ±0.01
  // вдоль длины; выпуклость середины, рваный край и разность выпуклости поперёк;
  // разность соседних точек поперёк — по ширине, по рваному краю, по складке.
  attribute vec3 inkTaper, inkBand;
  attribute vec4 inkAcross;
  ${N}
  ${M}
  void main() {
    float t = position.x, v = position.y, side = position.z;
    float u = v * 2.0 - 1.0, phase = inkClock * inkLift.w + inkStroke.x, index = inkStroke.w;
    float back = side > 0.5 ? -1.0 : 1.0;
    // Доли длины: сама вершина и соседи на ±0.01, по которым считается нормаль.
    vec3 at = vec3(t, max(0.0, t - 0.01), min(1.0, t + 0.01));
    // Средняя линия: угол, радиус и высота — по волне каждый. Угол нужен во всех
    // трёх долях, производные до четвёртой по длине — только в самой вершине.
    vec3 sway = inkTurn.w * at + inkRise.x * phase, sinSway = sin(sway);
    vec2 waves = vec2(t * 4.3 + phase * 0.64, inkLift.y * t + inkLift.z * phase);
    vec2 sinWaves = sin(waves), cosWaves = cos(waves);
    float cosSway = cos(sway.x);
    vec3 angle = inkTurn.x + inkClock * PI2 / 14.0 + (at - 0.5) * inkTurn.y + sinSway * inkTurn.z;
    vec3 ox = cos(angle), oz = sin(angle);
    float rate = inkTurn.w * inkTurn.w, climb = inkLift.y * inkLift.y;
    vec4 a = vec4(inkTurn.y, 0.0, 0.0, 0.0) + vec4(cosSway, -sinSway.x, -cosSway, sinSway.x)
      * inkTurn.z * vec4(inkTurn.w, rate, rate * inkTurn.w, rate * rate);
    vec4 r = vec4(cosWaves.x, -sinWaves.x, -cosWaves.x, sinWaves.x)
      * vec4(${[1,2,3,4].map(e=>(.14*4.3**e).toFixed(5)).join(`, `)});
    vec4 y = vec4(inkRise.w, 0.0, 0.0, 0.0) + vec4(cosWaves.y, -sinWaves.y, -cosWaves.y, sinWaves.y)
      * inkLift.x * vec4(inkLift.y, climb, climb * inkLift.y, climb * climb);
    // В плоскости XZ линия — r·e^(iθ): каждая производная — комплексный
    // множитель к тому же e^(iθ).
    float r0 = inkRise.y + sinWaves.x * 0.14, square = a.x * a.x;
    vec4 re = vec4(r.x, r.y - r0 * square, r.z - 3.0 * a.x * (r.x * a.x + r0 * a.y),
      r.w - 6.0 * r.y * square - 12.0 * r.x * a.x * a.y - 3.0 * r0 * a.y * a.y - 4.0 * r0 * a.x * a.z + r0 * square * square);
    vec4 im = vec4(r0 * a.x, 2.0 * r.x * a.x + r0 * a.y, 3.0 * (r.y * a.x + r.x * a.y) + r0 * (a.z - square * a.x),
      4.0 * (r.z * a.x + r.x * a.z) + 6.0 * r.y * a.y + r0 * a.w - 4.0 * r.x * square * a.x - 6.0 * r0 * square * a.y);
    // Множители ряда Тейлора по осям, уже поделённые на факториалы.
    vec4 fall = vec4(1.0, 0.5, ${(1/6).toFixed(9)}, ${(1/24).toFixed(9)});
    vec4 cx = (ox.x * re - oz.x * im) * fall, cy = y * fall, cz = (oz.x * re + ox.x * im) * fall;
    // Разности точек линии рядом Тейлора: касательная в каждой из трёх долей —
    // по соседним рядам решётки, у концов на одну сторону, — и шаг центра
    // между соседями на ±0.01.
    float row = ${1/24};
    vec4 ahead = vec4(min(vec3(1.0), at + row), at.z) - t, behind = vec4(max(vec3(0.0), at - row), at.y) - t;
    vec4 ahead2 = ahead * ahead, behind2 = behind * behind;
    mat4 power = mat4(ahead - behind, ahead2 - behind2, ahead2 * ahead - behind2 * behind, ahead2 * ahead2 - behind2 * behind2);
    vec4 gapX = power * cx, gapY = power * cy, gapZ = power * cz;
    // Поперёк мазка — касательная, повёрнутая вокруг радиуса; если они совпали,
    // мазок разворачивается по окружности.
    vec3 sx = gapY.xyz * oz, sy = gapZ.xyz * ox - gapX.xyz * oz, sz = -gapY.xyz * ox;
    vec3 size = sx * sx + sy * sy + sz * sz, scale = inversesqrt(max(size, vec3(1e-30)));
    bvec3 open = greaterThan(size, vec3(0.00000000000001));
    sx = mix(-oz, sx * scale, open); sy = mix(vec3(0.0), sy * scale, open); sz = mix(ox, sz * scale, open);
    // Ширина с нажимом и рваным краем поперёк, складка и толщина по радиусу.
    float body = inkBand.x, edge = inkBand.y, flank = back * (0.018 + body * inkStroke.z);
    vec3 pressure = 0.86 + sin(at * 7.3 - phase) * 0.12 + sin(at * 26.0 + index) * 0.035;
    vec3 tear = sin(at * 31.0 + phase) * 0.085, crease = at * 8.9 + u * 3.4 - phase * 0.73, fold = sin(crease);
    vec3 reach = u * inkStroke.y * inkTaper * pressure * (1.0 + edge * tear);
    vec3 rim = fold * body * 0.048 + flank;
    vec3 centre = vec3(ox.x * r0, inkRise.z + t * inkRise.w + sinWaves.y * inkLift.x, oz.x * r0 - inkMotion * 0.18);
    vec3 spread = vec3(sx.x, sy.x, sz.x), outward = vec3(ox.x, 0.0, oz.x);
    vec3 point = centre + spread * reach.x + outward * rim.x;
    // Нормаль — по соседним точкам той же поверхности; тыльная смотрит назад.
    // Поперёк — их разность, разложенная на постоянные множители вершины;
    // вдоль — разность точек на ±0.01.
    float width = inkStroke.y * inkTaper.x * pressure.x;
    vec3 across = spread * (width * (inkAcross.x + inkAcross.y * tear.x))
      + outward * ((fold.x * inkAcross.z + cos(crease.x) * inkAcross.w) * 0.048 + back * inkBand.z * inkStroke.z);
    vec3 ends = vec3(0.0, -1.0, 1.0);
    vec3 along = vec3(gapX.w, gapY.w, gapZ.w)
      + vec3(dot(sx * reach + ox * rim, ends), dot(sy * reach, ends), dot(sz * reach + oz * rim, ends));
    vec3 surface = cross(across, along) * back;
    float extent = sqrt(dot(surface, surface));
    surface = extent > 0.00000001 ? surface / extent : vec3(0.0, 1.0, 0.0);
    inkProject(point, surface);
    vInkColour = inkColour; vInkUv = vec2(t, v);
    vInkAlpha = index > 8.5 ? 0.78 : 0.89 + mod(index, 3.0) * 0.035; vInkWet = 1.0;
    #include <logdepthbuf_vertex>
  }`,q=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  uniform float inkClock, inkMotion;
  uniform vec3 inkColour;
  // Начальный угол, радиус, высота, размер.
  attribute vec4 inkOrbit;
  // Жизнь, пауза, сдвиг цикла, угловая скорость.
  attribute vec4 inkCycle;
  attribute float inkSway;
  ${N}
  ${M}
  ${j}
  void main() {
    float life = inkCycle.x, age = mod(inkClock + inkCycle.z, life + inkCycle.y);
    float phase = min(1.0, age / life), angle = inkOrbit.x + inkClock * inkCycle.w;
    float envelope = 1.0, alpha = 0.90;
    if (age >= life) { envelope = 0.0; alpha = 0.0; }
    else if (age < 0.23) { float k = age / 0.23; envelope = k * k * (3.0 - 2.0 * k); }
    else if (age > life - 0.43) {
      float k = (age - life + 0.43) / 0.43; envelope = 1.0 - k * k * (3.0 - 2.0 * k);
      float fade = clamp((k - 0.65) / 0.35, 0.0, 1.0); alpha *= 1.0 - fade * fade * (3.0 - 2.0 * fade);
    }
    float radius = inkOrbit.y + sin(inkClock * 0.32 + inkSway) * 0.075;
    vec3 centre = vec3(cos(angle) * radius, inkOrbit.z + sin(phase * PI) * 0.46 - phase * 0.72,
      sin(angle) * radius - inkMotion * 0.16);
    vec3 heading = vec3(-sin(angle) * inkCycle.w * radius, (cos(phase * PI) * PI * 0.46 - 0.72) / life,
      cos(angle) * inkCycle.w * radius);
    vec3 direction = heading / max(length(heading), 0.000001);
    float size = max(0.001, inkOrbit.w * envelope);
    vec3 scale = vec3(size, size * (1.30 + phase * 0.83), size * 0.80);
    inkProject(centre + inkAlign(position * scale, direction), inkAlign(normal / scale, direction));
    vInkColour = inkColour; vInkUv = uv; vInkAlpha = alpha; vInkWet = 1.0;
    #include <logdepthbuf_vertex>
  }`;function J(e,t,n,r,i){let a=W[e],o=n*a.rate+a.offset,s=a.bearing+n*R/14+(t-.5)*a.turn+Math.sin(t*a.swayRate+o*a.swayPhase)*a.sway,c=a.radius+Math.sin(t*4.3+o*.64)*.14;return i.set(Math.cos(s)*c,a.base+t*a.rise+Math.sin(t*a.liftRate+o*a.liftPhase)*a.lift,Math.sin(s)*c-r*.18),s}function Y(){let e=new Float32Array(1050),t=new Float32Array(1050),n=new Float32Array(1050),r=new Float32Array(1400),i=[];for(let a=0;a<B;a+=1)for(let o=0;o<V;o+=1){let s=a*V+o,c=a/24,l=o/6*2-1,u=Math.max(-1,l-.05),d=Math.min(1,l+.05),f=1-u*u,p=1-d*d,m=[[t,3,[G(c),G(Math.max(0,c-.01)),G(Math.min(1,c+.01))]],[n,3,[1-l*l,Math.abs(l)**5,p-f]],[r,4,[d-u,d*Math.abs(d)**5-u*Math.abs(u)**5,Math.cos((d-l)*3.4)*p-Math.cos((u-l)*3.4)*f,Math.sin((d-l)*3.4)*p-Math.sin((u-l)*3.4)*f]]];for(let t=0;t<2;t+=1){let n=s+t*175;e[n*3]=c,e[n*3+1]=o/6,e[n*3+2]=t;for(let[e,t,r]of m)e.set(r,n*t)}if(a<24&&o<6){let e=s,t=e+1,n=e+V,r=n+1;i.push(e,t,n,t,r,n,e+175,n+175,t+175,t+175,n+175,r+175)}}let a=(e,t)=>{i.push(e,e+175,t,t,e+175,t+175)};for(let e=0;e<6;e+=1){a(e,e+1);let t=168+e;a(t+1,t)}for(let e=0;e<24;e+=1)a((e+1)*V,e*V),a((e+1)*V-1,(e+2)*V-1);let o=new f;o.setAttribute(`position`,new h(e,3)),o.setAttribute(`inkTaper`,new h(t,3)),o.setAttribute(`inkBand`,new h(n,3)),o.setAttribute(`inkAcross`,new h(r,4)),o.setIndex(new h(new Uint16Array(i),1));let s=(e,t,n)=>{let r=new Float32Array(11*t);H.forEach((e,i)=>r.set(n(W[e],e),i*t)),o.setAttribute(e,new u(r,t))};return s(`inkTurn`,4,e=>[e.bearing,e.turn,e.sway,e.swayRate]),s(`inkRise`,4,e=>[e.swayPhase,e.radius,e.base,e.rise]),s(`inkLift`,4,e=>[e.lift,e.liftRate,e.liftPhase,e.rate]),s(`inkStroke`,4,(e,t)=>[e.offset,e.width,e.thickness,t]),o}function ne(t,n){let r={value:0},i={value:0},a={inkClock:r,inkMotion:i},o=I(`Ink_Aura_Brush`,K,!0,n,a),s=I(`Ink_Aura_Drops`,q,!1,n,a),c=Y(),l=new e(c,o,11);l.name=`Ink_Aura_Curved_Strokes`,l.frustumCulled=!1,l.castShadow=l.receiveShadow=!1,l.renderOrder=2,t.add(l);let d=k(),f=new Float32Array(224),p=new Float32Array(224),m=new Float32Array(z),h=1832344219,g=()=>(h^=h<<13,h^=h>>>17,h^=h<<5,(h>>>0)/4294967296);for(let e=0;e<z;e+=1){let t=e*4,n=2.1+g()*1.2,r=.16+g()*.24;f[t]=g()*R,f[t+1]=2.62+g()*.78,f[t+2]=-1.98+g()*2.84,f[t+3]=.048+g()**2*.079,p[t]=n,p[t+1]=r,p[t+2]=g()*(n+r),p[t+3]=R/(13+e%4),m[e]=g()*R}d.setAttribute(`inkOrbit`,new u(f,4)),d.setAttribute(`inkCycle`,new u(p,4)),d.setAttribute(`inkSway`,new u(m,1));let v=new e(d,s,z);v.name=`Ink_Aura_Flying_Elongated_Drops`,v.frustumCulled=!1,v.castShadow=v.receiveShadow=!1,v.renderOrder=3,t.add(v);let y=new _,b=new _,x=Array.from({length:11},(e,t)=>(J(t,0,0,0,y),J(t,1,0,0,b),y.y<=b.y?0:1)),S=0,C=H,w=0,T=0,E=!1,D=()=>{l.count=ee[S],v.count=U[S],C=H.slice(0,ee[S])},O=()=>{r.value=w,i.value=T,n.inkTime.value=w};return D(),O(),{brushes:()=>C,source(e,t){let n=x[e],r=J(e,n,w,T,t),i=W[e],a=w*i.rate+i.offset,o=Math.sin(n*8.9-a*.73)*.048;return t.set(t.x+Math.cos(r)*o,t.y,t.z+Math.sin(r)*o)},setTier(e){E||(S=e,D())},step(e,t){E||!Number.isFinite(e)||e<=0||(w=(w+e%3600)%3600,T+=(+!!t-T)*(1-Math.exp(-e*3)),O())},reset(){E||(w=T=0,O())},dispose(){E||(E=!0,l.removeFromParent(),l.dispose(),c.dispose(),v.removeFromParent(),v.dispose(),d.dispose(),o.dispose(),s.dispose())}}}var re=48,ie=48,ae=8.6,oe=1.05,se=-y[1]/2,X=e=>{let t=s.clamp(e,0,1);return t*t*(3-2*t)};function Z(t,n,o,l){let d=I(`Ink_Drips`,P,!1,l),f=new i,m=new i;f.name=`Ink_Attached_Drips`,m.name=`Ink_Falling_Drips`,n.add(f),t.add(m);let h=(t,n,r,i)=>{let o=new u(new Float32Array(n),1).setUsage(a);t.setAttribute(`inkAlpha`,o);let s=new e(t,d,n);return s.name=r,s.count=0,s.frustumCulled=!1,s.castShadow=s.receiveShadow=!1,s.instanceMatrix.setUsage(a),i.add(s),{mesh:s,geometry:t,alpha:o}},g=h(k(),11,`Ink_Drips_Gathering`,f),y=h(new c(1,1,1,6),11,`Ink_Drips_Thin_Necks`,f),b=h(k(),re,`Ink_Drips_Free_Fall`,m),x=new p(1,12,6),S=x.getAttribute(`position`);for(let e=0;e<S.count;e+=1){let t=Math.atan2(S.getZ(e),S.getX(e)),n=1+Math.sin(t*5)*.1+Math.cos(t*7)*.07;S.setXYZ(e,S.getX(e)*n,S.getY(e),S.getZ(e)*n)}x.computeVertexNormals();let C=h(x,ie,`Ink_Drips_Impact_Blots`,m),w=h(k(),144,`Ink_Drips_Impact_Spray`,m),T=[g,y,b,C,w],E=new Float64Array(384),D=new Float64Array(240),O=new Uint8Array(re),A=new Uint8Array(ie),j=new Float64Array(33),M=new Uint8Array(11),N=new Uint8Array(11),F=new _,L=new _,R=new _,z=new _,B=new _,V=new _,H=new _,ee=new v,U=new r,te=new _(0,1,0),W=new _,G=!1,K=!1,q=0,J=0,Y=0,ne=()=>{O.fill(0),A.fill(0),M.fill(0),J=Y=0,K=!1;for(let e of T)e.mesh.count=0},Z=(e,t,n)=>{ee.compose(V,U,H),e.mesh.setMatrixAt(t,ee),e.alpha.setX(t,n)},ce=(e,t,n,r)=>{let i=Y,a=i*5;Y=(Y+1)%ie,A[i]=1,D[a]=e,D[a+1]=t,D[a+2]=n,D[a+3]=0,D[a+4]=r},Q=(e,t)=>{e.mesh.count=t,t!==0&&(e.mesh.instanceMatrix.addUpdateRange(0,t*16),e.mesh.instanceMatrix.needsUpdate=!0,e.alpha.addUpdateRange(0,t),e.alpha.needsUpdate=!0)},$=e=>{n.updateWorldMatrix(!0,!1),R.set(0,se,0).applyMatrix4(n.matrixWorld),n.getWorldPosition(L),(e>.25||K&&L.distanceTo(F)>24+e*1200)&&ne();let t=n.matrixWorld.getMaxScaleOnAxis(),r=0,i=0,a=0,c=0,l=0,u=o.brushes();N.fill(0);for(let e of u)N[e]=1;for(let e=0;e<11;e+=1)N[e]||(M[e]=0);for(let a of u){let c=a*3,l=1.35+a%5*.14,u=l*.67,d=a*.618034%1*l,f=(q+d)%l;o.source(a,z),B.copy(z).applyMatrix4(n.matrixWorld);let p=Math.max(.025,(B.y-R.y-.11)/Math.max(.001,t)),m=Math.min(.35+a%3*.035,p/1.69),h=.29+a%4*.038;if(f<u){let e=X(f/(u*.78)),t=X((f/u-.58)/.42),n=Math.max(.001,m*(.36+e*.64)),a=Math.max(.001,h*e*(1-t*.12));V.copy(z),V.y-=n*.94,U.identity(),H.set(a,n,a),Z(g,r++,e*.96);let o=n*(.16+t*.37),s=.024*e*(1-t*.88);V.copy(z),V.y-=o*.5,H.set(Math.max(.001,s),Math.max(.001,o),Math.max(.001,s)),Z(y,i++,e*.92)}let _=Math.floor((q-e+d-u)/l),v=Math.floor((q+d-u)/l);if(K&&M[a]&&e>0&&v>_){let n=q+d-u-v*l,r=s.clamp(1-n/e,0,1),i=J,a=i*8;J=(J+1)%re,E[a]=s.lerp(j[c],B.x,r),E[a+2]=s.lerp(j[c+2],B.z,r),E[a+3]=s.lerp(j[c+1],B.y,r)-m*t*.94,E[a+4]=n-e,E[a+5]=R.y,E[a+6]=h*.88*t,E[a+7]=m*t,O[i]=1}j[c]=B.x,j[c+1]=B.y,j[c+2]=B.z,M[a]=1}for(let t=0;t<re;t+=1){if(!O[t])continue;let n=t*8,r=E[n+4]+e;E[n+4]=r;let i=E[n+3]-.18*r-ae*r*r*.5,o=E[n+7]*(1+Math.min(r,.7)*.45),s=E[n+6];if(i-o*.75<=E[n+5]+.04){ce(E[n],E[n+5],E[n+2],s),O[t]=0;continue}E[n+1]=i,V.set(E[n],i,E[n+2]),U.identity(),H.set(s,o,s),Z(b,a++,.97)}for(let t=0;t<ie;t+=1){if(!A[t])continue;let n=t*5,r=D[n+3]+e;if(D[n+3]=r,r>=oe){A[t]=0;continue}let i=1-X((r-.38)/.67),a=D[n+4]*(.7+X(r/.19)*1.2);if(V.set(D[n],D[n+1]+.045,D[n+2]),U.setFromAxisAngle(te,t*2.4),H.set(a,.026*i+.004,a*.83),Z(C,c++,i*.93),r<.32)for(let e=0;e<3;e+=1){let i=t*2.4+e*Math.PI*2/3,a=r*.85;V.set(D[n]+Math.cos(i)*a,D[n+1]+.06+Math.max(0,r*1.25-4*r*r),D[n+2]+Math.sin(i)*a),W.set(Math.cos(i)*.85,1.25-r*8,Math.sin(i)*.85).normalize(),U.setFromUnitVectors(te,W);let o=1-X((r-.16)/.16);H.setScalar(Math.max(.001,.105*o)),H.y*=1.5,Z(w,l++,o*.92)}}Q(g,r),Q(y,i),Q(b,a),Q(C,c),Q(w,l),F.copy(L),K=!0};return $(0),{step(e){G||!Number.isFinite(e)||e<=0||(q+=e,$(e))},reset(){G||(q=0,ne(),$(0))},dispose(){if(!G){G=!0,f.removeFromParent(),m.removeFromParent(),d.dispose();for(let e of T)e.mesh.dispose(),e.geometry.dispose()}}}}var ce=Math.PI*2,Q=.8,$=2,le=.85,ue=9,de=3,fe=[4,7,13],pe=[3,5,10],me=3,he=[3,3,1],ge=393216,_e=ce/.06*8,ve=3072,ye=768,be=1536,xe=`
  float inkAge = max(0.0, inkClock - inkBirth);
  float inkGrow = smoothstep(0.0, 0.085, inkAge), inkDry = smoothstep(0.8, 2.0, inkAge);
  float inkFade = inkGrow * (1.0 - smoothstep(1.25, 2.0, inkAge));
`,Se=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  uniform float inkClock;
  // Облик следа: толщина множит ширину и вынос вбок, высота — подъём над ступнями.
  uniform float trailShapeThickness, trailShapeHeight;
  uniform vec3 inkColour, inkViolet;
  ${N}
  ${M}
`,Ce=`
  ${Se}
  attribute vec2 inkBorn;
  // Смещение второй станции от первой и номер первой.
  attribute vec4 inkSegment;
  // Курс первой и второй станции.
  attribute vec4 inkHeading;
  void main() {
    bool second = position.y > 0.5;
    float inkBirth = second ? inkBorn.y : inkBorn.x;
    float id = second ? mod(inkSegment.w + 1.0, ${ge}.0) : inkSegment.w;
    vec2 heading = second ? inkHeading.zw : inkHeading.xy;
    vec3 root = instanceMatrix[3].xyz + (second ? inkSegment.xyz : vec3(0.0));
    ${xe}
    float channel = position.z, v = position.x;
    bool broad = channel < 0.5;
    float pressure = 0.92 + sin(id * 0.23) * 0.27 + sin(id * 0.67) * 0.12;
    float width = (broad ? pressure : 0.10 + (sin(id * 0.33 + channel) + 1.0) * 0.065)
      * max(0.01, inkGrow * (1.0 - inkDry * 0.46)) * trailShapeThickness;
    float centre = (broad ? sin(id * 0.19) * 0.2
      : (channel < 1.5 ? -1.0 : 1.0) * (1.28 + sin(id * 0.29 + channel * 2.0) * 0.35)) * trailShapeThickness;
    float across = v * 2.0 - 1.0;
    float column = floor(v * 8.0 + 0.5);
    float fray = pow(abs(across), 5.0) * sin(id * 2.7 + column) * 0.085 * trailShapeThickness;
    float side = centre + across * width + fray;
    // Горб мазка — толщина краски на земле, а не высота над ней.
    float dome = sin(v * PI), height = (broad ? 0.07 : 0.038) * trailShapeThickness;
    // Края мазка лежат на высоте TRAIL_FLOOR над станцией, середина выгнута выше.
    vec3 point = root + vec3(heading.y * side, ${C.toFixed(3)} + dome * height * (1.0 - inkDry * 0.7), -heading.x * side);
    float slope = cos(v * PI) * height * PI / max(0.03, width * 2.0);
    vec3 surface = vec3(-heading.y * slope, 1.0, heading.x * slope) / sqrt(slope * slope + 1.0);
    inkProject(point, surface);
    vInkColour = inkColour; vInkUv = vec2(id * 0.18, v);
    vInkAlpha = inkFade * (broad ? 0.98 : 0.88); vInkWet = 1.0 - inkDry * 0.92;
    #include <logdepthbuf_vertex>
  }`,we=`
  ${Se}
  attribute float inkBorn;
  // Размер и сторона мазка: левая клякса темнее правой.
  attribute vec2 inkSplat;
  void main() {
    float inkBirth = inkBorn;
    ${xe}
    float size = inkSplat.x * inkGrow * (1.0 - inkDry * 0.25);
    // Размер в плане записан с толщиной; здесь она утоньшает и саму лепёшку.
    vec3 scale = vec3(max(0.005, size), 0.75 * trailShapeThickness, max(0.005, size * (1.1 + inkSplat.y * 0.5)));
    mat3 turn = mat3(instanceMatrix);
    inkProject(instanceMatrix[3].xyz + turn * (position * scale), turn * (normal / scale));
    vInkColour = mix(inkColour, inkViolet, 0.04 + inkSplat.y * 0.06);
    vInkUv = uv; vInkAlpha = inkFade * 0.97; vInkWet = 1.0 - inkDry * 0.9;
    #include <logdepthbuf_vertex>
  }`,Te=`
  ${Se}
  ${j}
  attribute float inkBorn;
  // Начальный сдвиг вбок, скорость вбок, номер капли на станции.
  attribute vec3 inkFlight;
  attribute vec2 inkHeading;
  void main() {
    float age = max(0.0, inkClock - inkBorn);
    float flight = age / ${le}, drop = inkFlight.z, velocity = 2.4 + drop * 0.3;
    float side = inkFlight.x + inkFlight.y * age;
    float dx = inkHeading.x, dz = inkHeading.y;
    // Вынос вбок записан с толщиной; высота множит старт, взлёт и тяжесть вместе:
    // дуга сжимается по вертикали, а время полёта то же.
    vec3 centre = instanceMatrix[3].xyz + vec3(dz * side + dx * age * 0.25,
      0.18 * trailShapeHeight + max(0.0, velocity * age - 3.4 * age * age) * trailShapeHeight,
      -dx * side + dz * age * 0.25);
    vec3 heading = vec3(dz * inkFlight.y + dx * 0.25, (velocity - 6.8 * age) * trailShapeHeight,
      -dx * inkFlight.y + dz * 0.25);
    vec3 direction = heading / max(length(heading), 0.000001);
    float envelope = smoothstep(0.0, 0.065, age) * (1.0 - smoothstep(0.64, 1.0, flight));
    float size = (0.12 + drop * 0.03) * max(0.008, envelope) * trailShapeThickness;
    vec3 scale = vec3(size, size * (1.65 + abs(velocity - 6.8 * age) * 0.2), size);
    // Капля не уходит под пол: низ повёрнутой капли — конец оси, смотрящий вниз,
    // плюс её ширина поперёк оси; он держится над станцией на TRAIL_FLOOR.
    // Падающая капля так ложится на пол, а не проходит сквозь.
    float below = (direction.y >= 0.0 ? 0.75 : 0.94) * scale.y * abs(direction.y)
      + 0.26 * size * sqrt(max(0.0, 1.0 - direction.y * direction.y));
    centre.y = max(centre.y, instanceMatrix[3].y + ${C.toFixed(3)} + below);
    inkProject(centre + inkAlign(position * scale, direction), inkAlign(normal / scale, direction));
    vInkColour = mix(inkColour, inkViolet, 0.08 + drop * 0.025);
    vInkUv = uv; vInkAlpha = envelope * 0.95; vInkWet = 1.0;
    #include <logdepthbuf_vertex>
  }`;function Ee(e){let t=new d;for(let n=0;n<=24;n+=1){let r=n/24*Math.PI*2,i=.66+Math.sin(r*5+e*1.4)*.17+Math.cos(r*7+e)*.12,a=Math.cos(r)*i,o=Math.sin(r)*i;n===0?t.moveTo(a,o):t.lineTo(a,o)}t.closePath();let n=new o(t,{depth:.024,steps:1,bevelEnabled:!0,bevelSegments:1,bevelSize:.018,bevelThickness:.014,curveSegments:1});return n.rotateX(-Math.PI/2),n}function De(){let e=[],n=[];for(let t=0;t<de;t+=1){let r=t*ue*2;for(let n=0;n<2;n+=1)for(let r=0;r<ue;r+=1)e.push(r/8,n,t);for(let e=0;e<8;e+=1){let t=r+e,i=t+ue;n.push(t,i,t+1,i,i+1,t+1)}}let r=new f;return r.setAttribute(`position`,new t(e,3)),r.setIndex(n),r}function Oe(t,n,r,i,o,s,c,l){let d=new u(new Float32Array(o*c),c).setUsage(a);r.setAttribute(`inkBorn`,d);let f=l.map(([e,t])=>{let n=new u(new Float32Array(o*t),t).setUsage(a);return r.setAttribute(e,n),n}),p=new e(r,i,o);return p.instanceMatrix.setUsage(a),p.name=n,p.count=0,p.visible=!1,p.frustumCulled=!1,p.castShadow=!1,p.receiveShadow=!1,t.add(p),{mesh:p,material:i,born:d,extra:f,attributes:[p.instanceMatrix,d,...f],times:new Float64Array(o*c),life:s,capacity:o,count:0,slots:w(),appendStart:-1,rebased:!1}}function ke(e){if(e.count===e.capacity)return-1;let t=e.count++;return e.appendStart<0&&(e.appendStart=t),t}function Ae(e){e.count=e.mesh.count=0,e.mesh.visible=!1,e.slots.clear(),e.appendStart=-1,e.rebased=!1;for(let t of e.attributes)t.clearUpdateRanges()}function je(e,t){let n=e.born.itemSize,r=0;for(;r<e.count;){if(t-e.times[r*n]<e.life){r+=1;continue}let i=--e.count;if(r!==i){e.times.copyWithin(r*n,i*n,(i+1)*n);for(let t of e.attributes){let e=t.itemSize;t.array.copyWithin(r*e,i*e,(i+1)*e)}e.slots.moved(r)}}}function Me(e,t){let n=e.count*e.born.itemSize;for(let r=0;r<n;r+=1)e.times[r]=e.times[r]-t,e.born.array[r]=e.times[r];e.rebased=!0}function Ne(e){e.mesh.count=e.count,e.mesh.visible=e.count>0;for(let t of e.attributes){let n=t.itemSize,r=!1;t===e.born&&e.rebased&&e.count>0?(t.addUpdateRange(0,e.count*n),r=!0):r=e.slots.upload(t,e.appendStart,e.count),r&&(t.needsUpdate=!0)}e.slots.clear(),e.appendStart=-1,e.rebased=!1}function Pe(e){e.mesh.removeFromParent(),e.mesh.geometry.dispose(),e.mesh.dispose()}function Fe(e,t,n=x){let i=A(),a={value:0},o=n.thickness,s=n.height,c=()=>({inkClock:a,trailShapeThickness:{value:o},trailShapeHeight:{value:s}}),l=I(`Ink_Brush`,Ce,!0,i,c()),u=I(`Ink_Splats`,we,!1,i,c()),d=I(`Ink_Drops`,Te,!1,i,c()),f=Oe(e,`Ink_Path_Strokes`,De(),l,ve,$,2,[[`inkSegment`,4],[`inkHeading`,4]]),p=[0,1].map(t=>Oe(e,`Ink_Path_Splats_${t}`,Ee(t),u,ye,$,1,[[`inkSplat`,2]])),m=Oe(e,`Ink_Path_Flying_Drops`,k(),d,be,le,1,[[`inkFlight`,3],[`inkHeading`,2]]),h=[f,...p,m],g=f.mesh.geometry.index.count/de,y=S(512),b=new _,C=new v,w=new r,T=new _,E=new _(1,1,1),D=new _(0,1,0),O=new Float64Array(7),j=!1,M=0,N=0,P=0,F=0,L=!1,R=(e,t,n,r,i,a)=>{let s=F;if(F=(F+1)%ge,j&&N-O[3]<$&&Math.hypot(e-O[0],t-O[1],n-O[2])<=Q*2.5){let o=ke(f);o>=0&&(C.makeTranslation(O[0],O[1],O[2]),f.mesh.setMatrixAt(o,C),f.times[o*2]=O[3],f.times[o*2+1]=r,f.born.setXY(o,O[3],r),f.extra[0].setXYZW(o,e-O[0],t-O[1],n-O[2],O[6]),f.extra[1].setXYZW(o,O[4],O[5],i,a))}O[0]=e,O[1]=t,O[2]=n,O[3]=r,O[4]=i,O[5]=a,O[6]=s,j=!0;let c=fe[M];if(s%c===0){let l=p[Math.floor(s/c)%2];for(let c=0;c<2;c+=1){let u=ke(l);if(u<0)break;let d=s*1.13+c*2.7,f=1.2+Math.sin(d*1.9)*.45,p=(c===0?-1:1)*f*o;T.set(e+a*p,t+.052,n-i*p),w.setFromAxisAngle(D,d),C.compose(T,w,E),l.mesh.setMatrixAt(u,C),l.times[u]=r,l.born.setX(u,r),l.extra[0].setXY(u,(.32+(Math.sin(d)+1)*.18)*o,c)}}if(s%pe[M]===0)for(let c=0;c<me;c+=1){let l=ke(m);if(l<0)break;let u=s*2.399963+c*2.5;C.makeTranslation(e,t,n),m.mesh.setMatrixAt(l,C),m.times[l]=r,m.born.setX(l,r),m.extra[0].setXYZ(l,Math.sin(u*1.4)*.7*o,Math.sin(u)*1.25*o,c),m.extra[1].setXY(l,i,a)}},z=()=>{for(let e of h)Ne(e);a.value=N,i.inkTime.value=P},B=()=>{for(let e of h)Ae(e);j=!1,N=0,F=0,z()},V=()=>{f.mesh.geometry.setDrawRange(0,g*he[M])};return V(),{setTier(e){L||(M=e,V())},step(e,n){if(L)return;t.getWorldPosition(b);let r=y.step(b.x,b.y,b.z,e,n,Q);if(y.cleared){B();return}if(!Number.isFinite(e)||e<=0)return;if(N+=e,P=(P+e)%_e,N>=128){let e=Math.floor(N/128)*128;N-=e,j&&(O[3]-=e);for(let t of h)Me(t,e)}for(let e of h)je(e,N);let i=Math.hypot(y.direction[0],y.direction[2]),a=i>1e-6?y.direction[0]/i:0,o=i>1e-6?y.direction[2]/i:1;for(let e=0;e<r;e+=1){let t=e*3;R(y.positions[t],y.positions[t+1],y.positions[t+2],N-y.elapsed[e],a,o)}z()},reset(){L||(B(),y.reset(),P=0,i.inkTime.value=0)},dispose(){if(!L){L=!0;for(let e of h)Pe(e);l.dispose(),u.dispose(),d.dispose()}}}}function Ie(e,t,n,r=x){return Fe(e,t,r)}function Le(e,t,n){let r=A(),i=ne(t,r),a=Z(e,t,i,r);return{step(e,t){i.step(e,t),a.step(e)},setTier:e=>i.setTier(e),reset(){i.reset(),a.reset()},view:L(r,n.character?.getObjectByName(`mixamorigHead_06`)),dispose(){a.dispose(),i.dispose()}}}export{Le as createInkAuraEffect,Ie as createInkTrailEffect};