//# allFunctionsCalledOnLoad
import{$ as e,Cr as t,P as n,Rt as r,St as i,T as a,Tt as o,Xn as s,Z as c,d as l,qn as u,tr as d,u as f,ur as p,v as m,wr as h}from"./three.core-DVTiNhEy.js";import{o as g}from"./src-BI6MMqKu.js";import{t as _}from"./trail-emitter-DtJSWeMd.js";import{t as v}from"./trail-slots-BYU9mmsR.js";import{t as y}from"./BufferGeometryUtils-pFWRFHdl.js";var b=e=>new m().setHex(g(e),u);function ee(){let e=[new r(1,0),new r(1,0),new r(1,0)];e[0].scale(.12,1,.12),e[1].scale(.68,.09,.09),e[2].scale(.075,.075,.52);let t=y(e,!1);for(let t of e)t.dispose();return t}function x(){return{cosmicFaceCentre:{value:new h},cosmicFaceRadius:{value:new t(1.05,1.05)},cosmicFaceEnabled:{value:0}}}var S=`
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
`,C=`
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
  }`;function w(e,t,n,r,i=x()){return new s({name:e,defines:n?{COSMIC_MIST:1}:{},transparent:!0,depthWrite:!1,toneMapped:!0,side:2,forceSinglePass:!0,uniforms:{cosmicTime:{value:0},cosmicColour:{value:b(`blue/1`)},cosmicWhite:{value:b(`white`)},...i,...r},vertexShader:t,fragmentShader:C})}var T=Math.PI*2,E=15,D=320,O=26,k=23,A=5,te=[320,176,96],j=[15,10,6],M=[0,8,4,12,2,10,6,14,1,9,5,13,3,11,7],N=`
  ${S}
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
    float centreAngle = band * PI2 / ${E.toFixed(1)} + cosmicClock * PI2 / 14.0;
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
  }`,P=`
  ${S}
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
  }`,F=`
  ${S}
  uniform vec3 cosmicColour;
  attribute float cosmicAlpha;
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <logdepthbuf_vertex>
    vCosmicNormal = normalize(normalMatrix * normal);
    vCosmicView = -mvPosition.xyz; vCosmicLocal = position; vCosmicColour = cosmicColour;
    vCosmicUv = uv; vCosmicAlpha = cosmicAlpha;
  }`;function I(e){let t=3450,n=new Float32Array(t*2),r=new Float32Array(t*4),i=new Float32Array(t),a=new Float32Array(t*3),o=new Float32Array(t),s=[];for(let t=0;t<E;t+=1){let c=t*230,l=e[t%e.length],u=M.indexOf(t);for(let e=0;e<k;e+=1)for(let d=0;d<A;d+=1){let f=e*A+d;for(let s=0;s<2;s+=1){let p=c+f+s*115;n[p*2]=e/22,n[p*2+1]=d/4,r[p*4]=t,r[p*4+1]=t%3,r[p*4+2]=t%2,r[p*4+3]=u,i[p]=s===0?1:-1,a[p*3]=l.r,a[p*3+1]=l.g,a[p*3+2]=l.b,o[p]=.54+t%3*.13}if(e<22&&d<4){let e=c+f,t=e+1,n=e+A,r=n+1;s.push(e,t,n,t,r,n,e+115,n+115,t+115,t+115,n+115,r+115)}}let d=(e,t)=>{s.push(c+e,c+e+115,c+t,c+t,c+e+115,c+t+115)};for(let e=0;e<4;e+=1){d(e,e+1);let t=110+e;d(t+1,t)}for(let e=0;e<22;e+=1)d((e+1)*A,e*A),d((e+1)*A-1,(e+2)*A-1)}let c=new l;return c.setAttribute(`position`,new f(new Float32Array(t*3),3)),c.setAttribute(`uv`,new f(n,2)),c.setAttribute(`cosmicBand`,new f(r,4)),c.setAttribute(`cosmicSide`,new f(i,1)),c.setAttribute(`cosmicTint`,new f(a,3)),c.setAttribute(`cosmicAlpha`,new f(o,1)),c.setIndex(s),c}function L(t,n){let r=b(`blue/1`),i=b(`cyan/1`),a=b(`lavender/1`),s=b(`white`),l=[r,b(`blue/-2`),b(`blue`),b(`violet/1`),r.clone().lerp(a,.22)],u={value:0},d={value:0},g={value:E},_=x(),v={cosmicTime:u,cosmicClock:u,cosmicMotion:d},y=w(`Cosmic_Aura_Torn_Ribbons`,N,!0,{...v,cosmicMistShown:g},_),S=w(`Cosmic_Aura_Stars`,P,!1,v,_),C=w(`Cosmic_Aura_Orbits`,F,!1,{...v,cosmicColour:{value:i.clone()}},_),k=I(l),A=new o(k,y);A.name=`Cosmic_Aura_Torn_Ribbons`;let M=ee(),L=M.clone(),R=e=>({orbit:new Float32Array(e*4),spin:new Float32Array(e*4),life:new Float32Array(e*4),star:new Float32Array(e*2),tint:new Float32Array(e*3)}),z=R(D),ne=R(O),B=new m,V=2018235237,H=()=>(V^=V<<13,V^=V>>>17,V^=V<<5,(V>>>0)/4294967296);for(let e=0;e<346;e+=1){let t=e>=D,n=e%7,r=t?ne:z,o=t?e-D:e,c=Array(13);c[0]=t?(e-D)*T/O+.27:n*T/7+(H()-.5)*.52,c[1]=t?3.05+H()*.67:2.35+n%3*.3+(H()-.5)*.55,c[2]=t?-1.75+H()*3.02:-1.63+n%4*.84+(H()-.5)*.65,c[3]=t?.16+H()*.12:.037+H()**2*.065,c[4]=T/(12+n),c[5]=H()*T,c[6]=(H()-.5)*1.4,c[7]=(H()-.5)*1.9;let l=4+H()*3;c[8]=l,c[9]=.3+H()*.3,c[10]=.5+H()*.4,c[11]=l*.3,c[12]=H()*(l+c[11]),t?B.copy(s).lerp(i,.18):B.copy(i).lerp(s,.43+H()*.25).lerp(a,n===4?.25:0),r.orbit.set([c[0],c[1],c[2],c[3]],o*4),r.spin.set([c[4],c[5],c[6],c[7]],o*4),r.life.set([c[8],c[9],c[10],c[11]],o*4),r.star.set([c[12],+!!t],o*2),r.tint.set([B.r,B.g,B.b],o*3)}let re=(t,n,r,i)=>{t.setAttribute(`cosmicOrbit`,new c(n.orbit,4)),t.setAttribute(`cosmicSpin`,new c(n.spin,4)),t.setAttribute(`cosmicLife`,new c(n.life,4)),t.setAttribute(`cosmicStar`,new c(n.star,2)),t.setAttribute(`cosmicTint`,new c(n.tint,3));let a=new e(t,S,r);return a.name=i,a},U=re(M,z,D,`Cosmic_Aura_Star_Clusters`),W=re(L,ne,O,`Cosmic_Aura_Bright_Stars`),G=Array.from({length:3},(e,t)=>{let n=new p(1,.01+t*.003,5,54,1.85+t*.49);n.rotateX(Math.PI/2),n.setAttribute(`cosmicAlpha`,new f(new Float32Array(n.getAttribute(`position`).count).fill(.25+t*.055),1));let r=new o(n,C);return r.name=`Cosmic_Aura_Open_Orbit_${t+1}`,r}),ie=[A,...G,U,W];for(let e of ie)e.frustumCulled=!1,e.castShadow=e.receiveShadow=!1,e.renderOrder=e===W?4:e===U?3:2,t.add(e);let K=n?.getObjectByName(`mixamorigHead_06`)??null,q=new h,J=0,Y=0,X=!1,Z=()=>{u.value=J,d.value=Y;for(let e=0;e<G.length;e+=1){let t=G[e],n=J*T/(14+e*2);t.position.set(0,-.46+e*.15,-Y*.12),t.rotation.set(.34+e*.2,n+e*2.05,-.22+e*.26),t.scale.setScalar(2.9+e*.17+Math.sin(J*.16+e)*.025)}};return Z(),{setTier(e){X||(U.count=te[e],g.value=j[e])},step(e,t){X||!Number.isFinite(e)||e<=0||(J=(J+e%3600)%3600,Y+=(+!!t-Y)*(1-Math.exp(-e*3)),Z())},view(e){if(!X){if(n===null){_.cosmicFaceEnabled.value=0;return}if(e.updateMatrixWorld(),t.updateWorldMatrix(!0,!1),K){K.updateWorldMatrix(!0,!1),q.set(-.00570525,.6573547,.02455115),K.localToWorld(q);let e=1.00256*K.matrixWorld.getMaxScaleOnAxis()+.14;_.cosmicFaceRadius.value.set(e,e)}else{q.set(0,1.3,0),t.localToWorld(q);let e=1.05*t.matrixWorld.getMaxScaleOnAxis();_.cosmicFaceRadius.value.set(e,e)}_.cosmicFaceCentre.value.copy(q).applyMatrix4(e.matrixWorldInverse).multiplyScalar(-1),_.cosmicFaceEnabled.value=Number.isFinite(_.cosmicFaceCentre.value.lengthSq())&&_.cosmicFaceCentre.value.z>.1?1:0}},reset(){X||(J=Y=0,Z())},dispose(){if(!X){X=!0;for(let e of ie)e.removeFromParent();k.dispose();for(let e of G)e.geometry.dispose();U.dispose(),W.dispose(),M.dispose(),L.dispose(),y.dispose(),S.dispose(),C.dispose()}}}}var R=Math.PI*2,z=1.75,ne=[.8,1.1,1.6],B=[5,4,3],V=5,H=8,re=2,U=4e3,W=2560,G=12288,ie=3584,K=2048,q=5,J=3600,Y=`
  float cosmicFade(float age) {
    return smoothstep(0.0, 0.12, age) * (1.0 - smoothstep(0.85, ${z.toFixed(2)}, age));
  }
`,X=`
  ${S}
  ${Y}
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
  }`,Z=`
  ${S}
  ${Y}
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
  }`,ae=`
  ${S}
  ${Y}
  uniform float cosmicClock, cosmicOpacity;
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
    float drift = sin(id * 0.37) * age * 0.14;
    float twist = channel * 0.62 + 0.18 + sin(id * 0.21) * 0.3;
    float width = (1.35 + sin(id * 0.27 + channel * 2.0) * 0.32) * (1.0 + age * 0.24);
    float across = (column / ${4 .toFixed(1)} * 2.0 - 1.0) * width;
    float side = across * cos(twist) + drift;
    float height = 0.75 + across * sin(twist) * 0.48 + age * 0.22
      + sin(id * 0.31 + column * 0.7 + channel) * 0.16;
    vec3 world = vec3(station.x + course.y * side, station.y + height, station.z - course.x * side);
    vec4 mvPosition = modelViewMatrix * vec4(world, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <logdepthbuf_vertex>
    vCosmicNormal = normalize(normalMatrix * vec3(-course.y * sin(twist), cos(twist), course.x * sin(twist)));
    vCosmicView = -mvPosition.xyz; vCosmicLocal = world; vCosmicColour = cosmicColour;
    vCosmicUv = uv; vCosmicAlpha = cosmicFade(age) * cosmicOpacity;
  }`;function Q(t,r,i,a,o,s){let l=new c(new Float32Array(o),1).setUsage(n);i.setAttribute(`cosmicBorn`,l);let u=s?new c(new Float32Array(o*4),4).setUsage(n):null;u&&i.setAttribute(`cosmicShape`,u);let f=new e(i,a,o);f.instanceMatrix.setUsage(n),f.name=r,f.count=0,f.visible=!1,f.frustumCulled=!1,f.castShadow=!1,f.receiveShadow=!1,f.boundingSphere=new d(new h,1/0),f.raycast=()=>{},t.add(f);let p=[f.instanceMatrix,l];return u&&p.push(u),{mesh:f,data:f.instanceMatrix.array,shape:u,bornAttribute:l,attributes:p,born:new Float64Array(o),capacity:o,count:0,slots:v(),appendStart:-1,rebased:!1}}function oe(e,t){if(e.count===e.capacity)return-1;let n=e.count++;return e.appendStart<0&&(e.appendStart=n),e.born[n]=t,e.bornAttribute.setX(n,t),n}function se(e){e.count=e.mesh.count=0,e.mesh.visible=!1,e.slots.clear(),e.appendStart=-1,e.rebased=!1;for(let t of e.attributes)t.clearUpdateRanges()}function ce(e,t){let n=0;for(;n<e.count;){if(t-e.born[n]<z){n+=1;continue}let r=--e.count;if(n!==r){e.born[n]=e.born[r];for(let t of e.attributes){let e=t.itemSize;t.array.copyWithin(n*e,r*e,(r+1)*e)}e.slots.moved(n)}}}function le(e,t){for(let n=0;n<e.count;n+=1)e.born[n]=e.born[n]-t,e.bornAttribute.setX(n,e.born[n]);e.rebased=!0}function ue(e){e.mesh.count=e.count,e.mesh.visible=e.count>0;for(let t of e.attributes){let n=!1;t===e.bornAttribute&&e.rebased&&e.count>0?(t.addUpdateRange(0,e.count),n=!0):n=e.slots.upload(t,e.appendStart,e.count),n&&(t.needsUpdate=!0)}e.slots.clear(),e.appendStart=-1,e.rebased=!1}function de(e){let t=new l,n=e*2*q,r=new Float32Array(n*3),i=new Float32Array(n*2),a=new Float32Array(n*3),o=[];for(let n=0;n<e;n+=1){let e=n*2*q;for(let t=0;t<2;t+=1)for(let r=0;r<q;r+=1){let o=e+t*q+r;i[o*2]=.5,i[o*2+1]=r/4,a[o*3]=t,a[o*3+1]=r,a[o*3+2]=n}for(let t=0;t<4;t+=1){let n=e+t,r=n+q;o.push(n,r,n+1,r,r+1,n+1)}t.addGroup(n*4*6,24,n)}return t.setAttribute(`position`,new f(r,3)),t.setAttribute(`uv`,new f(i,2)),t.setAttribute(`cosmicRibbon`,new f(a,3)),t.setIndex(o),t}function fe(e,t){let n=b(`blue/1`),o=b(`cyan/1`),s=b(`blue/-2`),c=b(`blue`),l=b(`violet/1`),u=b(`lavender/1`),d=b(`white`),f={value:0},p={value:0},g={cosmicClock:f,cosmicTime:p},v=w(`Cosmic_Stars`,X,!1,g),y=w(`Cosmic_Star_Links`,Z,!1,g),x=[{colour:n,mix:1,opacity:.65},{colour:s,mix:1,opacity:.42},{colour:c,mix:1,opacity:.6},{colour:l,mix:1,opacity:.5},{colour:u,mix:.22,opacity:.5}].map(({colour:e,mix:t,opacity:r},i)=>w(`Cosmic_Path_Nebula_${i}`,ae,!0,{...g,cosmicOpacity:{value:r},cosmicColour:{value:n.clone().lerp(e,t)}})),S=Q(e,`Cosmic_Path_Stardust`,new r(1,0),v,G,!0),C=Q(e,`Cosmic_Path_Constellations`,ee(),v,ie,!0),T=Q(e,`Cosmic_Path_Star_Links`,new a(1,1,1,5),y,K,!1),E=Q(e,`Cosmic_Path_Nebula`,de(x.length),x,W,!1),D=[S,C,T,E],O=_(512),k=new h,A=new m,te=new h,j=new h,M=new h,N=0,P=0,F=0,I=!1,L=!1,q=0,Y=0,fe=0,$=0,pe=0,me=1,he=0,ge=(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h,g,_)=>{let v=oe(e,t);if(v<0)return;let y=e.data,b=v*16;y[b]=n,y[b+1]=r,y[b+2]=i,y[b+3]=c,y[b+4]=a,y[b+5]=o,y[b+6]=s,y[b+7]=l,y[b+8]=A.r,y[b+9]=A.g,y[b+10]=A.b,y[b+11]=u,y[b+12]=d,y[b+13]=f,y[b+14]=p,y[b+15]=m,e.shape.setXYZW(v,h,g,_,0)},_e=(e,t,n,r,i,a,o)=>{let s=oe(T,e);if(s<0)return;M.subVectors(j,te);let c=M.length();M.multiplyScalar(1/Math.max(c,1e-6));let l=T.data,u=s*16;l[u]=j.x,l[u+1]=j.y,l[u+2]=j.z,l[u+3]=i,l[u+4]=t,l[u+5]=n,l[u+6]=r,l[u+7]=c,l[u+8]=M.x,l[u+9]=M.y,l[u+10]=M.z,l[u+11]=a,l[u+12]=A.r,l[u+13]=A.g,l[u+14]=A.b,l[u+15]=o},ve=(e,t,r,a,s,c)=>{let l=F;if(F=(F+1)%U,L&&P-$<z){let n=oe(E,$);if(n>=0){let i=E.data,o=n*16;i[o]=q,i[o+1]=Y,i[o+2]=fe,i[o+3]=he,i[o+4]=e,i[o+5]=t,i[o+6]=r,i[o+7]=l,i[o+8]=pe,i[o+9]=me,i[o+10]=s,i[o+11]=c,i[o+12]=a-$,i[o+13]=i[o+14]=i[o+15]=0}}L=!0,q=e,Y=t,fe=r,$=a,pe=s,me=c,he=l;let u=Math.sin(l*.37)*.14;for(let n=0;n<B[N];n+=1){let i=l*2.399963+n*4.7,f=Math.sin(i)*(.7+n%3*.28),p=Math.cos(i*1.71)*.38,m=.028+(Math.sin(i*2.1)*.5+.5)*.025;A.copy(o).lerp(d,.45+n%3*.2),ge(S,a,e+c*f+s*p,t+.3+(Math.sin(i*1.31)*.5+.5)*1.55,r-s*f+c*p,c*u,.16,-s*u,0,.65,(a*1.7+i)%R,0,1,0,i%R,m,m,.2)}if(l%re===0){let n=l*1.37,i=Math.sin(n)*1.45,f=.19+(Math.cos(n*1.71)*.5+.5)*.13;A.copy(d).lerp(o,.18),ge(C,a,e+c*i,t+.65+(Math.sin(n*.83)*.5+.5)*.95,r-s*i,c*u,.2,-s*u,1,.94,0,0,1,0,n%R,f,f,.4)}if(l%V===0){let i=Math.floor(l/V),u=3+i%3;for(let l=0;l<u;l+=1){let f=l/(u-1),p=(f-.5)*2.2,m=Math.sin(l*2.2+i*.83)*.78;j.set(e+c*p+s*m,t+.48+Math.sin(l*1.7+i)*.22+f*.46,r-s*p+c*m);let h=l===1?.22:.095+l%2*.035;A.copy(o).lerp(d,.75),ge(C,a,j.x,j.y,j.z,0,.12,0,2,.94,0,0,1,0,(i*.72+l*.3)%R,h,h,0),l>0&&(A.copy(n).lerp(o,.62),_e(a,0,.12,0,.012,0,.48)),te.copy(j)}}if(l%H===7){let n=Math.sin(l*1.17)*1.65;j.set(e+c*n,t+1.12+Math.sin(l)*.38,r-s*n),M.set(s,.24,c).normalize();let u=Math.hypot(M.z,M.x),f=u>1e-6?M.z/u:1,p=u>1e-6?-M.x/u:0,m=Math.acos(i.clamp(M.y,-1,1));A.copy(d),ge(C,a,j.x,j.y,j.z,s*1.25,.3,c*1.25,2,.82,0,f,0,p,m,.09,.3,0),te.copy(j).addScaledVector(M,-.65),A.copy(o),_e(a,s*1.25,.3,c*1.25,.02,-.65/z,.32)}},ye=()=>{for(let e of D)se(e),ue(e);P=0,F=0,L=!1,f.value=0},be=()=>{ye(),O.reset(),p.value=0};return{setTier(e){I||(N=e)},step(e,n){if(I)return;t.getWorldPosition(k);let r=O.step(k.x,k.y,k.z,e,n,ne[N]);if(O.cleared){ye();return}if(!Number.isFinite(e)||e<=0)return;if(P+=e,p.value=(p.value+e)%J,P>=128){let e=Math.floor(P/128)*128;P-=e,$-=e;for(let t of D)le(t,e)}for(let e of D)ce(e,P);let i=Math.hypot(O.direction[0],O.direction[2]),a=i>1e-6?O.direction[0]/i:0,o=i>1e-6?O.direction[2]/i:1;for(let e=0;e<r;e+=1){let t=e*3;ve(O.positions[t],O.positions[t+1],O.positions[t+2],P-O.elapsed[e],a,o)}f.value=P;for(let e of D)ue(e)},reset(){I||be()},dispose(){if(!I){I=!0;for(let e of D)e.mesh.removeFromParent(),e.mesh.geometry.dispose(),e.mesh.dispose();v.dispose(),y.dispose();for(let e of x)e.dispose()}}}}function $(e,t,n){return fe(e,t)}function pe(e,t,n){return L(t,n.character)}export{pe as createCosmicAuraEffect,$ as createCosmicTrailEffect};