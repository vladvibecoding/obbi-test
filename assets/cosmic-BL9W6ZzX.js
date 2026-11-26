//# allFunctionsCalledOnLoad
import{$ as e,Cr as t,P as n,Rt as r,St as i,T as a,Tt as o,Xn as s,Z as c,d as l,qn as u,tr as d,u as f,ur as p,v as m,wr as h}from"./three.core-DVTiNhEy.js";import{o as g}from"./src-BI6MMqKu.js";import{n as _,r as v,t as y}from"./trail-shape-BsaeWHuc.js";import{t as b}from"./trail-slots-BYU9mmsR.js";import{t as x}from"./BufferGeometryUtils-pFWRFHdl.js";var S=e=>new m().setHex(g(e),u);function ee(){let e=[new r(1,0),new r(1,0),new r(1,0)];e[0].scale(.12,1,.12),e[1].scale(.68,.09,.09),e[2].scale(.075,.075,.52);let t=x(e,!1);for(let t of e)t.dispose();return t}function C(){return{cosmicFaceCentre:{value:new h},cosmicFaceRadius:{value:new t(1.05,1.05)},cosmicFaceEnabled:{value:0}}}var w=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  varying vec3 vCosmicView, vCosmicNormal, vCosmicColour, vCosmicLocal;
  varying vec2 vCosmicUv;
  varying float vCosmicAlpha;

  // Поворот вокруг единичной оси по косинусу и синусу угла.
  vec3 cosmicTurnCS(vec3 v, vec3 axis, float c, float s) {
    return v * c + cross(axis, v) * s + axis * dot(axis, v) * (1.0 - c);
  }
  vec3 cosmicTurn(vec3 v, vec3 axis, float angle) {
    return cosmicTurnCS(v, axis, cos(angle), sin(angle));
  }
`,T=`
  #include <common>
  #include <logdepthbuf_pars_fragment>
  uniform float cosmicTime, cosmicFaceEnabled;
  uniform vec3 cosmicWhite, cosmicFaceCentre;
  uniform vec2 cosmicFaceRadius;
  varying vec3 vCosmicView, vCosmicNormal, vCosmicColour, vCosmicLocal;
  varying vec2 vCosmicUv;
  varying float vCosmicAlpha;
  float hash(vec3 p) {
    p = fract(p * vec3(0.1031, 0.1030, 0.0973));
    p += dot(p, p.yxz + 33.33);
    return fract((p.x + p.y) * p.z);
  }
  float noise(vec3 p) {
    vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
      mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
      mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
  }
  void main() {
    if (vCosmicAlpha < 0.002) discard;
    if (cosmicFaceEnabled > 0.5 && vCosmicView.z < cosmicFaceCentre.z + cosmicFaceRadius.y) {
      vec2 offset = vCosmicView.xy / max(vCosmicView.z, 0.001)
        - cosmicFaceCentre.xy / max(cosmicFaceCentre.z, 0.001);
      float offAxis = sqrt(1.0 + dot(cosmicFaceCentre.xy, cosmicFaceCentre.xy)
        / max(cosmicFaceCentre.z * cosmicFaceCentre.z, 0.0001));
      vec2 radius = cosmicFaceRadius * offAxis / max(cosmicFaceCentre.z - cosmicFaceRadius.x, 0.1);
      if (dot(offset / radius, offset / radius) < 1.0) discard;
    }
    float alpha;
    vec3 colour;
    #ifdef COSMIC_MIST
      vec3 p = vCosmicLocal * 0.9 + vec3(vCosmicUv.x * 4.0, vCosmicUv.y * 2.0, cosmicTime * 0.045);
      float density = noise(p + vec3(cosmicTime * 0.025, 0.0, 0.0)) * 0.66
        + noise(p * 2.7 - vec3(0.0, cosmicTime * 0.06, 0.0)) * 0.34;
      float edge = smoothstep(0.0, 0.13, vCosmicUv.x) * (1.0 - smoothstep(0.84, 1.0, vCosmicUv.x));
      edge *= pow(max(0.0, 1.0 - abs(vCosmicUv.y * 2.0 - 1.0)), 1.2);
      alpha = vCosmicAlpha * edge * smoothstep(0.26, 0.74, density) * 0.68;
      colour = vCosmicColour * (0.56 + density * 0.85);
      colour = mix(colour, cosmicWhite, smoothstep(0.74, 0.95, density) * 0.16);
    #else
      vec3 n = normalize(vCosmicNormal);
      float face = abs(dot(n, normalize(vCosmicView + vec3(0.0001))));
      colour = mix(vCosmicColour, cosmicWhite, face * 0.3) * 1.18;
      alpha = vCosmicAlpha;
    #endif
    if (alpha < 0.003) discard;
    #include <logdepthbuf_fragment>
    gl_FragColor = vec4(colour, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`;function E(e,t,n,r,i=C()){return new s({name:e,defines:n?{COSMIC_MIST:1}:{},transparent:!0,depthWrite:!1,toneMapped:!0,side:2,forceSinglePass:!0,uniforms:{cosmicTime:{value:0},cosmicColour:{value:S(`blue/1`)},cosmicWhite:{value:S(`white`)},...i,...r},vertexShader:t,fragmentShader:T})}var D=Math.PI*2,O=15,k=320,A=26,j=23,M=5,N=[320,176,96],P=[15,10,6],F=[0,8,4,12,2,10,6,14,1,9,5,13,3,11,7],te=`
  ${w}
  uniform float cosmicClock, cosmicMotion, cosmicMistShown;
  // Номер полосы, его остатки от деления на 3 и на 2, место в очереди ступеней.
  attribute vec4 cosmicBand;
  // Лицевой слой (+1) или изнанка (-1) толщины полосы.
  attribute float cosmicSide;
  attribute vec3 cosmicTint;
  attribute float cosmicAlpha;
  void main() {
    if (cosmicBand.w >= cosmicMistShown) {
      // Полоса снята ступенью: треугольник уходит за дальнюю плоскость.
      gl_Position = vec4(0.0, 0.0, 2.0, 1.0);
      return;
    }
    float band = cosmicBand.x, thirds = cosmicBand.y, halves = cosmicBand.z;
    float t = uv.x, u = uv.y * 2.0 - 1.0;
    float phase = cosmicClock * (0.23 + band * 0.027);
    float centreAngle = band * PI2 / ${O.toFixed(1)} + cosmicClock * PI2 / 14.0;
    float span = 0.97 + thirds * 0.27, width = 0.37 + thirds * 0.11;
    float angle = centreAngle + (t - 0.5) * span + sin(t * 6.1 + phase) * 0.10;
    float taper = 0.23 + pow(max(sin(t * PI), 0.0), 0.70) * 0.77;
    float radius = 2.28 + halves * 0.28 + sin(t * 5.2 + phase * 0.7) * 0.18 + u * 0.08;
    float curl = sin(t * 8.0 + phase + u * 2.7) * 0.18 + sin(t * 17.3 - phase) * 0.045;
    float y = -1.48 + thirds * 0.94 + sin(t * 4.8 + phase * 0.61) * 0.29
      + u * width * taper + curl + pow(abs(u), 5.0) * sin(t * 19.0 - phase) * 0.055;
    float thickness = 0.022 + (1.0 - u * u) * 0.026;
    float r = radius + cosmicSide * thickness;
    vec3 local = vec3(cos(angle) * r, y, sin(angle) * r - cosmicMotion * 0.18);
    vec4 mvPosition = modelViewMatrix * vec4(local, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <logdepthbuf_vertex>
    vCosmicNormal = vec3(0.0, 0.0, 1.0);
    vCosmicView = -mvPosition.xyz; vCosmicLocal = local; vCosmicColour = cosmicTint;
    vCosmicUv = uv; vCosmicAlpha = cosmicAlpha;
  }`,I=`
  ${w}
  uniform float cosmicClock, cosmicMotion;
  // Угол, радиус, высота, размер.
  attribute vec4 cosmicOrbit;
  // Угловая скорость, фаза, наклоны по X и Z.
  attribute vec4 cosmicSpin;
  // Жизнь, рост, сжатие, пауза до следующего рождения.
  attribute vec4 cosmicLife;
  // Сдвиг цикла, яркая ли звезда.
  attribute vec2 cosmicStar;
  attribute vec3 cosmicTint;

  // Поворот Эйлера в порядке XYZ, как у Object3D.
  mat3 cosmicEuler(vec3 e) {
    float a = cos(e.x), b = sin(e.x), c = cos(e.y), d = sin(e.y), f = cos(e.z), g = sin(e.z);
    float af = a * f, ag = a * g, bf = b * f, bg = b * g;
    return mat3(vec3(c * f, ag + bf * d, bg - af * d),
      vec3(-c * g, af - bg * d, bf + ag * d),
      vec3(d, -b * c, a * c));
  }

  void main() {
    float phase = cosmicSpin.y;
    float angle = cosmicOrbit.x + cosmicClock * cosmicSpin.x;
    float radius = cosmicOrbit.y + sin(cosmicClock * 0.21 + phase) * 0.055;
    float life = cosmicLife.x, grow = cosmicLife.y, collapse = cosmicLife.z;
    float age = mod(cosmicClock + cosmicStar.x, life + cosmicLife.w);
    float envelope = 1.0, fade = 1.0;
    if (age >= life) {
      envelope = 0.0; fade = 0.0;
    } else if (age < grow) {
      float k = age / grow; envelope = k * k * (3.0 - 2.0 * k);
    } else if (age > life - collapse) {
      float k = (age - life + collapse) / collapse;
      envelope = 1.0 - k * k * (3.0 - 2.0 * k);
      // Основное исчезновение — сжатие формы; прозрачность гаснет лишь у самой точки.
      float last = clamp((k - 0.74) / 0.26, 0.0, 1.0);
      fade = 1.0 - last * last * (3.0 - 2.0 * last);
    }
    vec3 centre = vec3(cos(angle) * radius, cosmicOrbit.z + sin(cosmicClock * 0.25 + phase) * 0.10,
      sin(angle) * radius - cosmicMotion * 0.16);
    mat3 turn = cosmicEuler(vec3(cosmicSpin.z + sin(cosmicClock * 0.18 + phase) * 0.12,
      phase + cosmicClock * 0.055, cosmicSpin.w + sin(cosmicClock * 0.22 + phase) * 0.09));
    float size = max(0.001, cosmicOrbit.w * envelope * (1.0 + sin(cosmicClock * 0.31 + phase) * 0.055));
    vec4 mvPosition = modelViewMatrix * vec4(centre + turn * (position * size), 1.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <logdepthbuf_vertex>
    float alpha = cosmicStar.y > 0.5 ? 0.78 + sin(cosmicClock * 0.43 + phase) * 0.12
      : 0.43 + sin(cosmicClock * 0.71 + phase) * 0.16;
    vCosmicNormal = normalize(normalMatrix * (turn * normal));
    vCosmicView = -mvPosition.xyz; vCosmicLocal = position; vCosmicColour = cosmicTint;
    vCosmicUv = uv; vCosmicAlpha = alpha * fade;
  }`,L=`
  ${w}
  uniform vec3 cosmicColour;
  attribute float cosmicAlpha;
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <logdepthbuf_vertex>
    vCosmicNormal = normalize(normalMatrix * normal);
    vCosmicView = -mvPosition.xyz; vCosmicLocal = position; vCosmicColour = cosmicColour;
    vCosmicUv = uv; vCosmicAlpha = cosmicAlpha;
  }`;function ne(e){let t=3450,n=new Float32Array(t*2),r=new Float32Array(t*4),i=new Float32Array(t),a=new Float32Array(t*3),o=new Float32Array(t),s=[];for(let t=0;t<O;t+=1){let c=t*230,l=e[t%e.length],u=F.indexOf(t);for(let e=0;e<j;e+=1)for(let d=0;d<M;d+=1){let f=e*M+d;for(let s=0;s<2;s+=1){let p=c+f+s*115;n[p*2]=e/22,n[p*2+1]=d/4,r[p*4]=t,r[p*4+1]=t%3,r[p*4+2]=t%2,r[p*4+3]=u,i[p]=s===0?1:-1,a[p*3]=l.r,a[p*3+1]=l.g,a[p*3+2]=l.b,o[p]=.54+t%3*.13}if(e<22&&d<4){let e=c+f,t=e+1,n=e+M,r=n+1;s.push(e,t,n,t,r,n,e+115,n+115,t+115,t+115,n+115,r+115)}}let d=(e,t)=>{s.push(c+e,c+e+115,c+t,c+t,c+e+115,c+t+115)};for(let e=0;e<4;e+=1){d(e,e+1);let t=110+e;d(t+1,t)}for(let e=0;e<22;e+=1)d((e+1)*M,e*M),d((e+1)*M-1,(e+2)*M-1)}let c=new l;return c.setAttribute(`position`,new f(new Float32Array(t*3),3)),c.setAttribute(`uv`,new f(n,2)),c.setAttribute(`cosmicBand`,new f(r,4)),c.setAttribute(`cosmicSide`,new f(i,1)),c.setAttribute(`cosmicTint`,new f(a,3)),c.setAttribute(`cosmicAlpha`,new f(o,1)),c.setIndex(s),c}function R(t,n){let r=S(`blue/1`),i=S(`cyan/1`),a=S(`lavender/1`),s=S(`white`),l=[r,S(`blue/-2`),S(`blue`),S(`violet/1`),r.clone().lerp(a,.22)],u={value:0},d={value:0},g={value:O},_=C(),v={cosmicTime:u,cosmicClock:u,cosmicMotion:d},y=E(`Cosmic_Aura_Torn_Ribbons`,te,!0,{...v,cosmicMistShown:g},_),b=E(`Cosmic_Aura_Stars`,I,!1,v,_),x=E(`Cosmic_Aura_Orbits`,L,!1,{...v,cosmicColour:{value:i.clone()}},_),w=ne(l),T=new o(w,y);T.name=`Cosmic_Aura_Torn_Ribbons`;let j=ee(),M=j.clone(),F=e=>({orbit:new Float32Array(e*4),spin:new Float32Array(e*4),life:new Float32Array(e*4),star:new Float32Array(e*2),tint:new Float32Array(e*3)}),R=F(k),z=F(A),B=new m,V=2018235237,H=()=>(V^=V<<13,V^=V>>>17,V^=V<<5,(V>>>0)/4294967296);for(let e=0;e<346;e+=1){let t=e>=k,n=e%7,r=t?z:R,o=t?e-k:e,c=Array(13);c[0]=t?(e-k)*D/A+.27:n*D/7+(H()-.5)*.52,c[1]=t?3.05+H()*.67:2.35+n%3*.3+(H()-.5)*.55,c[2]=t?-1.75+H()*3.02:-1.63+n%4*.84+(H()-.5)*.65,c[3]=t?.16+H()*.12:.037+H()**2*.065,c[4]=D/(12+n),c[5]=H()*D,c[6]=(H()-.5)*1.4,c[7]=(H()-.5)*1.9;let l=4+H()*3;c[8]=l,c[9]=.3+H()*.3,c[10]=.5+H()*.4,c[11]=l*.3,c[12]=H()*(l+c[11]),t?B.copy(s).lerp(i,.18):B.copy(i).lerp(s,.43+H()*.25).lerp(a,n===4?.25:0),r.orbit.set([c[0],c[1],c[2],c[3]],o*4),r.spin.set([c[4],c[5],c[6],c[7]],o*4),r.life.set([c[8],c[9],c[10],c[11]],o*4),r.star.set([c[12],+!!t],o*2),r.tint.set([B.r,B.g,B.b],o*3)}let U=(t,n,r,i)=>{t.setAttribute(`cosmicOrbit`,new c(n.orbit,4)),t.setAttribute(`cosmicSpin`,new c(n.spin,4)),t.setAttribute(`cosmicLife`,new c(n.life,4)),t.setAttribute(`cosmicStar`,new c(n.star,2)),t.setAttribute(`cosmicTint`,new c(n.tint,3));let a=new e(t,b,r);return a.name=i,a},W=U(j,R,k,`Cosmic_Aura_Star_Clusters`),G=U(M,z,A,`Cosmic_Aura_Bright_Stars`),K=Array.from({length:3},(e,t)=>{let n=new p(1,.01+t*.003,5,54,1.85+t*.49);n.rotateX(Math.PI/2),n.setAttribute(`cosmicAlpha`,new f(new Float32Array(n.getAttribute(`position`).count).fill(.25+t*.055),1));let r=new o(n,x);return r.name=`Cosmic_Aura_Open_Orbit_${t+1}`,r}),re=[T,...K,W,G];for(let e of re)e.frustumCulled=!1,e.castShadow=e.receiveShadow=!1,e.renderOrder=e===G?4:e===W?3:2,t.add(e);let q=n?.getObjectByName(`mixamorigHead_06`)??null,J=new h,Y=0,X=0,Z=!1,Q=()=>{u.value=Y,d.value=X;for(let e=0;e<K.length;e+=1){let t=K[e],n=Y*D/(14+e*2);t.position.set(0,-.46+e*.15,-X*.12),t.rotation.set(.34+e*.2,n+e*2.05,-.22+e*.26),t.scale.setScalar(2.9+e*.17+Math.sin(Y*.16+e)*.025)}};return Q(),{setTier(e){Z||(W.count=N[e],g.value=P[e])},step(e,t){Z||!Number.isFinite(e)||e<=0||(Y=(Y+e%3600)%3600,X+=(+!!t-X)*(1-Math.exp(-e*3)),Q())},view(e){if(!Z){if(n===null){_.cosmicFaceEnabled.value=0;return}if(e.updateMatrixWorld(),t.updateWorldMatrix(!0,!1),q){q.updateWorldMatrix(!0,!1),J.set(-.00570525,.6573547,.02455115),q.localToWorld(J);let e=1.00256*q.matrixWorld.getMaxScaleOnAxis()+.14;_.cosmicFaceRadius.value.set(e,e)}else{J.set(0,1.3,0),t.localToWorld(J);let e=1.05*t.matrixWorld.getMaxScaleOnAxis();_.cosmicFaceRadius.value.set(e,e)}_.cosmicFaceCentre.value.copy(J).applyMatrix4(e.matrixWorldInverse).multiplyScalar(-1),_.cosmicFaceEnabled.value=Number.isFinite(_.cosmicFaceCentre.value.lengthSq())&&_.cosmicFaceCentre.value.z>.1?1:0}},reset(){Z||(Y=X=0,Q())},dispose(){if(!Z){Z=!0;for(let e of re)e.removeFromParent();w.dispose();for(let e of K)e.geometry.dispose();W.dispose(),G.dispose(),j.dispose(),M.dispose(),y.dispose(),b.dispose(),x.dispose()}}}}var z=Math.PI*2,B=1.75,V=[.8,1.1,1.6],H=[5,4,3],U=5,W=8,G=2,K=4e3,re=2560,q=12288,J=3584,Y=2048,X=5,Z=3600,Q=`
  float cosmicFade(float age) {
    return smoothstep(0.0, 0.12, age) * (1.0 - smoothstep(0.85, ${B.toFixed(2)}, age));
  }
`,ie=`
  ${w}
  ${Q}
  uniform float cosmicClock;
  attribute float cosmicBorn;
  // Размер поперёк и вдоль, скорость поворота.
  attribute vec4 cosmicShape;
  void main() {
    vec4 base = instanceMatrix[0], motion = instanceMatrix[1];
    vec4 tint = instanceMatrix[2], turn = instanceMatrix[3];
    float age = max(0.0, cosmicClock - cosmicBorn);
    float fade = cosmicFade(age);
    vec3 size = vec3(cosmicShape.x, cosmicShape.y, cosmicShape.x);
    float alpha;
    if (base.w < 0.5) {
      // Пыль мерцает по общим часам: фаза включает момент рождения.
      alpha = fade * (motion.w + sin(age * 1.7 + tint.w) * 0.2);
    } else if (base.w < 1.5) {
      // Одиночная звезда рождается и гаснет размером.
      size = max(size * fade, vec3(0.001));
      alpha = smoothstep(0.0, 0.18, fade) * motion.w;
    } else {
      alpha = fade * motion.w;
    }
    float angle = turn.w + age * cosmicShape.z;
    vec3 local = cosmicTurn(position * size, turn.xyz, angle);
    vec4 mvPosition = modelViewMatrix * vec4(base.xyz + motion.xyz * age + local, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <logdepthbuf_vertex>
    vCosmicNormal = normalize(normalMatrix * cosmicTurn(normal / size, turn.xyz, angle));
    vCosmicView = -mvPosition.xyz; vCosmicLocal = position; vCosmicColour = tint.rgb;
    vCosmicUv = uv; vCosmicAlpha = alpha;
  }`,ae=`
  ${w}
  ${Q}
  uniform float cosmicClock;
  attribute float cosmicBorn;
  void main() {
    vec4 end = instanceMatrix[0], motion = instanceMatrix[1];
    vec4 course = instanceMatrix[2], tint = instanceMatrix[3];
    float age = max(0.0, cosmicClock - cosmicBorn);
    float span = max(0.0, motion.w + course.w * age);
    // Ось цилиндра поворачивается из вертикали в курс связи.
    vec3 axis = vec3(course.z, 0.0, -course.x);
    float s = length(axis), c = course.y;
    axis = s > 0.000001 ? axis / s : vec3(1.0, 0.0, 0.0);
    vec3 size = vec3(end.w, span, end.w);
    vec3 local = cosmicTurnCS(position * size, axis, c, s);
    vec3 middle = end.xyz + motion.xyz * age - course.xyz * span * 0.5;
    vec4 mvPosition = modelViewMatrix * vec4(middle + local, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <logdepthbuf_vertex>
    vec3 n = normal / vec3(end.w, max(span, 0.0001), end.w);
    vCosmicNormal = normalize(normalMatrix * cosmicTurnCS(n, axis, c, s));
    vCosmicView = -mvPosition.xyz; vCosmicLocal = position; vCosmicColour = tint.rgb;
    vCosmicUv = uv; vCosmicAlpha = cosmicFade(age) * tint.w;
  }`,oe=`
  ${w}
  ${Q}
  uniform float cosmicClock, cosmicOpacity;
  // Облик следа: толщина множит ширину и снос полосы, высота — всё над ступнями.
  uniform float trailShapeThickness, trailShapeHeight;
  uniform vec3 cosmicColour;
  attribute float cosmicBorn;
  // Станция (0 — старшая, 1 — младшая), столбец и слой туманности.
  attribute vec3 cosmicRibbon;
  void main() {
    bool younger = cosmicRibbon.x > 0.5;
    vec4 station = younger ? instanceMatrix[1] : instanceMatrix[0];
    vec2 course = younger ? instanceMatrix[2].zw : instanceMatrix[2].xy;
    float age = max(0.0, cosmicClock - cosmicBorn - (younger ? instanceMatrix[3].x : 0.0));
    float id = station.w, column = cosmicRibbon.y, channel = cosmicRibbon.z;
    float drift = sin(id * 0.37) * age * 0.14 * trailShapeThickness;
    float twist = channel * 0.62 + 0.18 + sin(id * 0.21) * 0.3;
    float width = (1.35 + sin(id * 0.27 + channel * 2.0) * 0.32) * (1.0 + age * 0.24) * trailShapeThickness;
    float across = (column / ${4 .toFixed(1)} * 2.0 - 1.0) * width;
    float side = across * cos(twist) + drift;
    float height = 0.75 * trailShapeHeight + across * sin(twist) * 0.48 * trailShapeHeight
      + age * 0.22 * trailShapeHeight + sin(id * 0.31 + column * 0.7 + channel) * 0.16 * trailShapeHeight;
    // Скрученный край полосы опускается ниже ступней; пол его спрятал бы, а
    // вровень с полом он мерцает. Край ложится на высоту над ступнями станции.
    height = max(height, ${y.toFixed(2)});
    vec3 world = vec3(station.x + course.y * side, station.y + height, station.z - course.x * side);
    vec4 mvPosition = modelViewMatrix * vec4(world, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <logdepthbuf_vertex>
    vCosmicNormal = normalize(normalMatrix * vec3(-course.y * sin(twist), cos(twist), course.x * sin(twist)));
    vCosmicView = -mvPosition.xyz; vCosmicLocal = world; vCosmicColour = cosmicColour;
    vCosmicUv = uv; vCosmicAlpha = cosmicFade(age) * cosmicOpacity;
  }`;function se(t,r,i,a,o,s){let l=new c(new Float32Array(o),1).setUsage(n);i.setAttribute(`cosmicBorn`,l);let u=s?new c(new Float32Array(o*4),4).setUsage(n):null;u&&i.setAttribute(`cosmicShape`,u);let f=new e(i,a,o);f.instanceMatrix.setUsage(n),f.name=r,f.count=0,f.visible=!1,f.frustumCulled=!1,f.castShadow=!1,f.receiveShadow=!1,f.boundingSphere=new d(new h,1/0),f.raycast=()=>{},t.add(f);let p=[f.instanceMatrix,l];return u&&p.push(u),{mesh:f,data:f.instanceMatrix.array,shape:u,bornAttribute:l,attributes:p,born:new Float64Array(o),capacity:o,count:0,slots:b(),appendStart:-1,rebased:!1}}function ce(e,t){if(e.count===e.capacity)return-1;let n=e.count++;return e.appendStart<0&&(e.appendStart=n),e.born[n]=t,e.bornAttribute.setX(n,t),n}function le(e){e.count=e.mesh.count=0,e.mesh.visible=!1,e.slots.clear(),e.appendStart=-1,e.rebased=!1;for(let t of e.attributes)t.clearUpdateRanges()}function ue(e,t){let n=0;for(;n<e.count;){if(t-e.born[n]<B){n+=1;continue}let r=--e.count;if(n!==r){e.born[n]=e.born[r];for(let t of e.attributes){let e=t.itemSize;t.array.copyWithin(n*e,r*e,(r+1)*e)}e.slots.moved(n)}}}function de(e,t){for(let n=0;n<e.count;n+=1)e.born[n]=e.born[n]-t,e.bornAttribute.setX(n,e.born[n]);e.rebased=!0}function fe(e){e.mesh.count=e.count,e.mesh.visible=e.count>0;for(let t of e.attributes){let n=!1;t===e.bornAttribute&&e.rebased&&e.count>0?(t.addUpdateRange(0,e.count),n=!0):n=e.slots.upload(t,e.appendStart,e.count),n&&(t.needsUpdate=!0)}e.slots.clear(),e.appendStart=-1,e.rebased=!1}function pe(e){let t=new l,n=e*2*X,r=new Float32Array(n*3),i=new Float32Array(n*2),a=new Float32Array(n*3),o=[];for(let n=0;n<e;n+=1){let e=n*2*X;for(let t=0;t<2;t+=1)for(let r=0;r<X;r+=1){let o=e+t*X+r;i[o*2]=.5,i[o*2+1]=r/4,a[o*3]=t,a[o*3+1]=r,a[o*3+2]=n}for(let t=0;t<4;t+=1){let n=e+t,r=n+X;o.push(n,r,n+1,r,r+1,n+1)}t.addGroup(n*4*6,24,n)}return t.setAttribute(`position`,new f(r,3)),t.setAttribute(`uv`,new f(i,2)),t.setAttribute(`cosmicRibbon`,new f(a,3)),t.setIndex(o),t}function me(e,t,n=_){let o=n.thickness,s=n.height,c=S(`blue/1`),l=S(`cyan/1`),u=S(`blue/-2`),d=S(`blue`),f=S(`violet/1`),p=S(`lavender/1`),g=S(`white`),b={value:0},x={value:0},C={cosmicClock:b,cosmicTime:x},w=E(`Cosmic_Stars`,ie,!1,C),T=E(`Cosmic_Star_Links`,ae,!1,C),D=[{colour:c,mix:1,opacity:.65},{colour:u,mix:1,opacity:.42},{colour:d,mix:1,opacity:.6},{colour:f,mix:1,opacity:.5},{colour:p,mix:.22,opacity:.5}].map(({colour:e,mix:t,opacity:n},r)=>E(`Cosmic_Path_Nebula_${r}`,oe,!0,{...C,cosmicOpacity:{value:n},cosmicColour:{value:c.clone().lerp(e,t)},trailShapeThickness:{value:o},trailShapeHeight:{value:s}})),O=se(e,`Cosmic_Path_Stardust`,new r(1,0),w,q,!0),k=se(e,`Cosmic_Path_Constellations`,ee(),w,J,!0),A=se(e,`Cosmic_Path_Star_Links`,new a(1,1,1,5),T,Y,!1),j=se(e,`Cosmic_Path_Nebula`,pe(D.length),D,re,!1),M=[O,k,A,j],N=v(512),P=new h,F=new m,te=new h,I=new h,L=new h,ne=0,R=0,X=0,Q=!1,me=!1,he=0,ge=0,_e=0,$=0,ve=0,ye=1,be=0,xe=(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h,g,_)=>{let v=ce(e,t);if(v<0)return;let y=e.data,b=v*16;y[b]=n,y[b+1]=r,y[b+2]=i,y[b+3]=c,y[b+4]=a,y[b+5]=o,y[b+6]=s,y[b+7]=l,y[b+8]=F.r,y[b+9]=F.g,y[b+10]=F.b,y[b+11]=u,y[b+12]=d,y[b+13]=f,y[b+14]=p,y[b+15]=m,e.shape.setXYZW(v,h,g,_,0)},Se=(e,t,n,r,i,a,o)=>{let s=ce(A,e);if(s<0)return;L.subVectors(I,te);let c=L.length();L.multiplyScalar(1/Math.max(c,1e-6));let l=A.data,u=s*16;l[u]=I.x,l[u+1]=I.y,l[u+2]=I.z,l[u+3]=i,l[u+4]=t,l[u+5]=n,l[u+6]=r,l[u+7]=c,l[u+8]=L.x,l[u+9]=L.y,l[u+10]=L.z,l[u+11]=a,l[u+12]=F.r,l[u+13]=F.g,l[u+14]=F.b,l[u+15]=o},Ce=(e,t,n,r,a,u)=>{let d=X;if(X=(X+1)%K,me&&R-$<B){let i=ce(j,$);if(i>=0){let o=j.data,s=i*16;o[s]=he,o[s+1]=ge,o[s+2]=_e,o[s+3]=be,o[s+4]=e,o[s+5]=t,o[s+6]=n,o[s+7]=d,o[s+8]=ve,o[s+9]=ye,o[s+10]=a,o[s+11]=u,o[s+12]=r-$,o[s+13]=o[s+14]=o[s+15]=0}}me=!0,he=e,ge=t,_e=n,$=r,ve=a,ye=u,be=d;let f=Math.sin(d*.37)*.14*o;for(let i=0;i<H[ne];i+=1){let c=d*2.399963+i*4.7,p=Math.sin(c)*(.7+i%3*.28)*o,m=Math.cos(c*1.71)*.38,h=(.028+(Math.sin(c*2.1)*.5+.5)*.025)*o;F.copy(l).lerp(g,.45+i%3*.2),xe(O,r,e+u*p+a*m,Math.max(t+.3*s+(Math.sin(c*1.31)*.5+.5)*1.55*s,t+y+h),n-a*p+u*m,u*f,.16*s,-a*f,0,.65,(r*1.7+c)%z,0,1,0,c%z,h,h,.2)}if(d%G===0){let i=d*1.37,c=Math.sin(i)*1.45*o,p=(.19+(Math.cos(i*1.71)*.5+.5)*.13)*o;F.copy(g).lerp(l,.18),xe(k,r,e+u*c,Math.max(t+.65*s+(Math.sin(i*.83)*.5+.5)*.95*s,t+y+p),n-a*c,u*f,.2*s,-a*f,1,.94,0,0,1,0,i%z,p,p,.4)}if(d%U===0){let i=Math.floor(d/U),f=3+i%3;for(let d=0;d<f;d+=1){let p=d/(f-1),m=(p-.5)*2.2*o,h=Math.sin(d*2.2+i*.83)*.78;I.set(e+u*m+a*h,t+.48*s+Math.sin(d*1.7+i)*.22*s+p*.46*s,n-a*m+u*h);let _=(d===1?.22:.095+d%2*.035)*o;I.y=Math.max(I.y,t+y+_),F.copy(l).lerp(g,.75),xe(k,r,I.x,I.y,I.z,0,.12*s,0,2,.94,0,0,1,0,(i*.72+d*.3)%z,_,_,0),d>0&&(F.copy(c).lerp(l,.62),Se(r,0,.12*s,0,.012*o,0,.48)),te.copy(I)}}if(d%W===7){let c=Math.sin(d*1.17)*1.65*o;I.set(e+u*c,t+1.12*s+Math.sin(d)*.38*s,n-a*c),L.set(a,.24*s,u).normalize(),I.y=Math.max(I.y,t+y+.3*o+.65*L.y);let f=Math.hypot(L.z,L.x),p=f>1e-6?L.z/f:1,m=f>1e-6?-L.x/f:0,h=Math.acos(i.clamp(L.y,-1,1));F.copy(g),xe(k,r,I.x,I.y,I.z,a*1.25,.3*s,u*1.25,2,.82,0,p,0,m,h,.09*o,.3*o,0),te.copy(I).addScaledVector(L,-.65),F.copy(l),Se(r,a*1.25,.3*s,u*1.25,.02*o,-.65/B,.32)}},we=()=>{for(let e of M)le(e),fe(e);R=0,X=0,me=!1,b.value=0},Te=()=>{we(),N.reset(),x.value=0};return{setTier(e){Q||(ne=e)},step(e,n){if(Q)return;t.getWorldPosition(P);let r=N.step(P.x,P.y,P.z,e,n,V[ne]);if(N.cleared){we();return}if(!Number.isFinite(e)||e<=0)return;if(R+=e,x.value=(x.value+e)%Z,R>=128){let e=Math.floor(R/128)*128;R-=e,$-=e;for(let t of M)de(t,e)}for(let e of M)ue(e,R);let i=Math.hypot(N.direction[0],N.direction[2]),a=i>1e-6?N.direction[0]/i:0,o=i>1e-6?N.direction[2]/i:1;for(let e=0;e<r;e+=1){let t=e*3;Ce(N.positions[t],N.positions[t+1],N.positions[t+2],R-N.elapsed[e],a,o)}b.value=R;for(let e of M)fe(e)},reset(){Q||Te()},dispose(){if(!Q){Q=!0;for(let e of M)e.mesh.removeFromParent(),e.mesh.geometry.dispose(),e.mesh.dispose();w.dispose(),T.dispose();for(let e of D)e.dispose()}}}}function he(e,t,n,r=_){return me(e,t,r)}function ge(e,t,n){return R(t,n.character)}export{ge as createCosmicAuraEffect,he as createCosmicTrailEffect};