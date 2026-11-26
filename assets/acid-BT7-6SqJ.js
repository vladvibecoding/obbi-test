//# allFunctionsCalledOnLoad
import{$ as e,Cr as t,Jt as n,Nt as r,O as i,P as a,Ut as o,V as s,Xn as c,Z as l,d as u,nn as d,nr as f,qn as p,u as m,ur as h,v as g,wr as _,wt as v}from"./three.core-DVTiNhEy.js";import{o as y}from"./src-BI6MMqKu.js";import{n as b,r as ee,t as te}from"./trail-shape-BsaeWHuc.js";import{t as ne}from"./trail-slots-BYU9mmsR.js";var x=e=>new g().setHex(y(e),p),re=x(`green`),ie=x(`sea-green/-1`).multiplyScalar(.48),S=re.clone().lerp(x(`yellow`),.16).multiplyScalar(1.75),C=x(`white`).lerp(x(`yellow`),.06),w=`
  float acidSmooth(float x) { return smoothstep(0.0, 1.0, x); }
`,T=`
    vLiquidLocal = local;
    vLiquidNormal = normalize(normalMatrix * objectNormal);
    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vLiquidViewPosition = -mvPosition.xyz;
    #include <logdepthbuf_vertex>
`,E=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  varying vec3 vLiquidNormal, vLiquidViewPosition, vLiquidLocal;
`,D=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  varying vec3 vLiquidNormal, vLiquidViewPosition, vLiquidLocal;
  void main() {
    vLiquidLocal = position;
    #include <beginnormal_vertex>
    // Учитывает масштаб каждой оси экземпляра до normalMatrix меша.
    #include <defaultnormal_vertex>
    vLiquidNormal = normalize(transformedNormal);
    vec3 transformed = position;
    #include <project_vertex>
    vLiquidViewPosition = -mvPosition.xyz;
    #include <logdepthbuf_vertex>
  }`,O=`
  #include <common>
  #include <logdepthbuf_pars_fragment>
  uniform vec3 acidGreen, acidDeep, acidLime, acidWhite;
  #ifdef ACID_FACE
    uniform vec3 acidFaceCentre;
    uniform vec2 acidFaceRadius;
    uniform float acidFaceEnabled;
  #endif
  varying vec3 vLiquidNormal, vLiquidViewPosition, vLiquidLocal;

  float acidHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float acidValue(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(acidHash(i), acidHash(i + vec2(1.0, 0.0)), f.x),
      mix(acidHash(i + vec2(0.0, 1.0)), acidHash(i + vec2(1.0, 1.0)), f.x), f.y);
  }

  // Светлая полоса отражается в кривизне поверхности, а не нарисована на ней.
  float reflectedStrip(vec3 reflected) {
    vec3 stripAxis = normalize(vec3(-0.52, 0.79, 0.32));
    float distance = (dot(reflected, stripAxis) - 0.66) / 0.028;
    float band = exp(-distance * distance);
    float sky = smoothstep(-0.35, 0.25, reflected.y);
    float end = smoothstep(-0.70, -0.12, reflected.z);
    return band * sky * end;
  }

  void main() {
    #ifdef ACID_FACE
      // Перед лицом на экране жидкость не рисуется: голова видна сквозь ауру.
      if (acidFaceEnabled > 0.5 && vLiquidViewPosition.z < acidFaceCentre.z + acidFaceRadius.y) {
        vec2 offset = vLiquidViewPosition.xy / max(vLiquidViewPosition.z, 0.001)
          - acidFaceCentre.xy / max(acidFaceCentre.z, 0.001);
        float offAxis = sqrt(1.0 + dot(acidFaceCentre.xy, acidFaceCentre.xy)
          / max(acidFaceCentre.z * acidFaceCentre.z, 0.0001));
        vec2 radius = acidFaceRadius * offAxis
          / max(acidFaceCentre.z - max(acidFaceRadius.x, acidFaceRadius.y), 0.1);
        if (dot(offset / radius, offset / radius) < 1.0) discard;
      }
    #endif
    vec3 normal = normalize(vLiquidNormal);
    #ifdef DOUBLE_SIDED
      normal *= gl_FrontFacing ? 1.0 : -1.0;
    #endif
    vec3 eye = vLiquidViewPosition / max(length(vLiquidViewPosition), 0.00001);
    float facing = clamp(dot(normal, eye), 0.0, 1.0);
    float fresnel = pow(1.0 - facing, 5.0);
    vec3 light = normalize((viewMatrix * vec4(-0.45, 0.86, 0.26, 0.0)).xyz);
    vec3 halfway = (light + eye) / max(length(light + eye), 0.00001);
    float diffuse = max(dot(normal, light), 0.0);
    // Отражение остаётся в мировых осях при повороте камеры.
    vec3 reflected = transformDirectionByInverseViewMatrix(reflect(-eye, normal), viewMatrix);
    float strip = reflectedStrip(reflected);
    float sky = smoothstep(-0.15, 0.80, reflected.y);
    float specular = pow(max(dot(normal, halfway), 0.0), 150.0);

    #ifdef ACID_BUBBLE
      // У оболочки видимы кромка и блики; центральная поверхность не заливается.
      float rim = pow(1.0 - facing, 2.6);
      float reflection = strip * (0.18 + fresnel * 0.82) + specular * 0.85;
      float alpha = min(0.86, rim * 0.42 + reflection * 0.76);
      if (alpha < 0.006) discard;
      vec3 colour = mix(acidGreen, acidLime, 0.78);
      colour = mix(colour, acidWhite * 1.65, clamp(reflection, 0.0, 1.0));
      gl_FragColor = vec4(colour, alpha);
    #else
      // Кислота просвечивает: в лоб видна светящаяся толща, вскользь — тёмная
      // кромка. Взвесь внутри неровная, и толща не читается крашеным пластиком.
      vec2 murkAt = vLiquidLocal.xy * 2.3 + vLiquidLocal.z * 1.7;
      float murk = acidValue(murkAt) * 0.65 + acidValue(murkAt * 2.7 + 5.1) * 0.35;
      float glow = pow(facing, 1.3);
      vec3 colour = mix(acidDeep, acidGreen, smoothstep(0.0, 0.55, facing));
      colour = mix(colour, acidLime, glow * (0.45 + murk * 0.55));
      colour *= 0.82 + diffuse * 0.26;
      // Своё свечение: в тени кислота не гаснет до тёмной краски.
      colour += acidLime * (0.10 + glow * 0.12);
      vec3 environment = mix(acidDeep * 0.20, acidGreen * 0.40 + acidWhite * 0.08, sky);
      colour += environment * fresnel * 0.3;
      colour += acidWhite * (strip * (0.55 + fresnel * 0.85) + specular * 2.2);
      gl_FragColor = vec4(colour, 1.0);
    #endif
    #include <logdepthbuf_fragment>
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`;function ae(){return{centre:{value:new _},radius:{value:new t(1.05,1.05)},enabled:{value:0}}}function k(e,t,n={}){let{bubble:r=!1,face:i}=n,a={...n.defines};return r&&(a.ACID_BUBBLE=1),i&&(a.ACID_FACE=1),new c({name:e,vertexShader:t,fragmentShader:O,defines:a,uniforms:{...n.uniforms,acidGreen:{value:re},acidDeep:{value:ie},acidLime:{value:S},acidWhite:{value:C},...i?{acidFaceCentre:i.centre,acidFaceRadius:i.radius,acidFaceEnabled:i.enabled}:{}},side:r?0:2,forceSinglePass:!r,transparent:r,depthTest:!0,depthWrite:!r,toneMapped:!0,blending:1})}var A=Math.PI*2,j=A/15,oe=[1,.55,.3],M=[72,40,22],N=[16,9,5],P=10,F=7,se=25,I=11,L=18,R=9,ce=.004,le=.01,z=.01,B=1/24,ue=6,de=[0,1,4],fe=[2,3,5],pe=de.length*se,me=pe+fe.length*L,V=`
  ${E}
  uniform vec2 acidOrbit;
  // Направление к камере по земле и потолок под лицом.
  uniform vec3 acidClear;
  uniform highp sampler2D acidShape;
  attribute float acidPart, acidRow;

  // Понижение находится между камерой и головой, а не на фиксированной стороне тела.
  // Четыре точки за раз и без ветвей.
  vec4 acidFaceClear(vec4 x, vec4 y, vec4 z) {
    vec4 forward = (x * acidClear.x + z * acidClear.y) / max(vec4(0.001), sqrt(x * x + z * z));
    vec4 weight = smoothstep(0.0, 1.0, (forward + 0.25) / 0.65);
    float ceiling = acidClear.z, onset = ceiling - 0.65;
    vec4 lowered = onset + (ceiling - onset) * (1.0 - exp(-max(y - onset, 0.0) / (ceiling - onset)));
    // Ниже начала понижения точка остаётся на месте; на самом начале понижение нулевое.
    return y + (lowered - y) * weight * step(onset, y);
  }
  void acidOrbitPoints(inout vec4 x, inout vec4 y, inout vec4 z) {
    vec4 turnedX = x * acidOrbit.x + z * acidOrbit.y;
    vec4 turnedZ = -x * acidOrbit.y + z * acidOrbit.x;
    x = turnedX; z = turnedZ;
    y = acidFaceClear(turnedX, y, turnedZ);
  }
  vec3 acidOrbitDirection(vec3 d) {
    return vec3(d.x * acidOrbit.x + d.z * acidOrbit.y, d.y, -d.x * acidOrbit.y + d.z * acidOrbit.x);
  }
`,he=`
  ${V}
  // Оси сечения по касательной: n — вверх по сечению, b — вбок по земле.
  void tubeFrame(vec3 tangent, out vec3 n, out vec3 b) {
    float horizontal = length(tangent.xz);
    b = horizontal > 1e-6 ? vec3(-tangent.z / horizontal, 0.0, tangent.x / horizontal) : vec3(1.0, 0.0, 0.0);
    n = vec3(tangent.y * b.z, tangent.z * b.x - tangent.x * b.z, -tangent.y * b.x);
  }

  void main() {
    float t = position.x, angle = position.y;
    int row = int(acidRow + 0.5) + int(t * 24.0 + 0.5);
    // Кольцо вершины и соседние точки вдоль струи: центр и радиус, касательная
    // и сдвиг неровности сечения.
    vec4 centre = texelFetch(acidShape, ivec2(0, row), 0), axis = texelFetch(acidShape, ivec2(1, row), 0);
    vec4 centreAfter = texelFetch(acidShape, ivec2(2, row), 0), axisAfter = texelFetch(acidShape, ivec2(3, row), 0);
    vec4 centreBefore = texelFetch(acidShape, ivec2(4, row), 0), axisBefore = texelFetch(acidShape, ivec2(5, row), 0);
    vec3 n, b, nAfter, bAfter, nBefore, bBefore;
    tubeFrame(axis.xyz, n, b);
    tubeFrame(axisAfter.xyz, nAfter, bAfter);
    tubeFrame(axisBefore.xyz, nBefore, bBefore);
    vec3 angles = vec3(angle, angle + ${le}, angle - ${le});
    vec3 cosines = cos(angles) * 0.82, sines = sin(angles);
    // Неровность сечения: в вершине, у соседей вдоль и у соседей по кругу.
    vec4 uneven = 1.0 + sin(vec4(angles.xxx, angles.y) * 3.0
      + vec4(axis.w, axisAfter.w, axisBefore.w, axis.w)) * 0.10;
    float unevenBefore = 1.0 + sin(angles.z * 3.0 + axis.w) * 0.10;
    // Донце и макушка: центр крайнего кольца, нормаль вдоль струи.
    bool cap = position.z != 0.0;
    vec3 here = centre.xyz + (n * cosines.x + b * sines.x) * centre.w * uneven.x * (cap ? 0.0 : 1.0);
    vec3 after = centreAfter.xyz + (nAfter * cosines.x + bAfter * sines.x) * centreAfter.w * uneven.y;
    vec3 before = centreBefore.xyz + (nBefore * cosines.x + bBefore * sines.x) * centreBefore.w * uneven.z;
    vec3 next = centre.xyz + (n * cosines.y + b * sines.y) * centre.w * uneven.w;
    vec3 previous = centre.xyz + (n * cosines.z + b * sines.z) * centre.w * unevenBefore;
    vec4 px = vec4(here.x, after.x, before.x, next.x);
    vec4 py = vec4(here.y, after.y, before.y, next.y);
    vec4 pz = vec4(here.z, after.z, before.z, next.z);
    vec4 qx = vec4(previous.x), qy = vec4(previous.y), qz = vec4(previous.z);
    acidOrbitPoints(px, py, pz);
    acidOrbitPoints(qx, qy, qz);
    vec3 transformed = vec3(px.x, py.x, pz.x);
    vec3 alongTube = vec3(px.y - px.z, py.y - py.z, pz.y - pz.z);
    vec3 around = vec3(px.w - qx.x, py.w - qy.x, pz.w - qz.x);
    vec3 objectNormal = cross(alongTube, around);
    objectNormal /= max(length(objectNormal), 1e-8);
    if (cap) objectNormal = acidOrbitDirection(axis.xyz * position.z);
    vec3 local = transformed;
    ${T}
  }`,ge=`
  ${V}
  // Подъём и оседание каждого из шести объёмов.
  uniform vec2 acidCycles[6];

  // Четыре точки листа за раз. По строкам row: точка ряда по X, ширина, точка
  // ряда по Y, дуга; wave: разрыв кромки, точка ряда по Z, фазы двух волн гофра.
  void sheetPoints(mat4 row, mat4 wave, vec4 u, float face, float lift, float tilt,
    out vec4 x, out vec4 y, out vec4 z) {
    x = row[0] + u * row[1];
    y = row[2] + (u * row[3] * tilt + pow(abs(u), vec4(5.0)) * wave[0]) * lift;
    vec4 corrugation = sin(wave[2] + u * 4.6) * 0.105 + sin(wave[3] - u * 6.1) * 0.035;
    // Обе поверхности соединены по периметру: это тонкий объём, а не карточка.
    vec4 thickness = (0.025 + (1.0 - u * u) * 0.037 + row[3] * 0.018) * (0.65 + lift * 0.35);
    z = wave[1] + corrugation * lift + thickness * face;
  }

  void main() {
    int part = int(acidPart + 0.5);
    float lift = acidCycles[part].x;
    // Боковой лист выгнут дугой поперёк, задний и передний — нет.
    float tilt = part == 3 ? 0.15 : 0.0;
    float t = position.x, face = position.z;
    int index = int(acidRow + 0.5) + int(t * 17.0 + 0.5);
    vec4 shape = texelFetch(acidShape, ivec2(0, index), 0), wave = texelFetch(acidShape, ivec2(1, index), 0);
    vec4 shapeAfter = texelFetch(acidShape, ivec2(2, index), 0), waveAfter = texelFetch(acidShape, ivec2(3, index), 0);
    vec4 shapeBefore = texelFetch(acidShape, ivec2(4, index), 0), waveBefore = texelFetch(acidShape, ivec2(5, index), 0);
    vec4 u = clamp(position.y + vec4(0.0, 0.0, 0.0, ${z}), -1.0, 1.0);
    float uBefore = clamp(position.y - ${z}, -1.0, 1.0);
    // Нормаль следует изгибу уже после понижения: мокрые блики идут по форме.
    vec4 px, py, pz, qx, qy, qz;
    sheetPoints(transpose(mat4(shape, shapeAfter, shapeBefore, shape)),
      transpose(mat4(wave, waveAfter, waveBefore, wave)), u, face, lift, tilt, px, py, pz);
    sheetPoints(transpose(mat4(shape, shape, shape, shape)), transpose(mat4(wave, wave, wave, wave)),
      vec4(uBefore), face, lift, tilt, qx, qy, qz);
    acidOrbitPoints(px, py, pz);
    acidOrbitPoints(qx, qy, qz);
    vec3 transformed = vec3(px.x, py.x, pz.x);
    vec3 alongSheet = vec3(px.y - px.z, py.y - py.z, pz.y - pz.z);
    vec3 acrossSheet = vec3(px.w - qx.x, py.w - qy.x, pz.w - qz.x);
    vec3 objectNormal = face > 0.0 ? cross(acrossSheet, alongSheet) : cross(alongSheet, acrossSheet);
    objectNormal /= max(length(objectNormal), 1e-8);
    vec3 local = transformed;
    ${T}
  }`,H=(e,t)=>t===0?e:t===1?Math.min(1,e+ce):Math.max(0,e-ce),_e=[1.04,1.43,1.23],ve=[0,1.8,3.2],ye=[.74,1.12,.89],be=[.6,2.7,4.1],xe=[1.16,.74,1.07],Se=[3.7,4.6,4.2],Ce=[.36,.45,.39];function U(e,t){return Float64Array.from(e,t)}var W=(e,t)=>[U(e,e=>Math.sin(e*t)),U(e,e=>Math.cos(e*t))],G=[];for(let e=0;e<se;e+=1)for(let t=0;t<3;t+=1)G.push(H(e*B,t));var we=G.length,K=e=>{let t=G.findIndex(t=>Math.abs(t-e)<1e-9);return t>=0?t:(G.push(e),G.length-1)},q=Int32Array.from({length:we},(e,t)=>K(Math.min(1,G[t]+B))),Te=Int32Array.from({length:we},(e,t)=>K(Math.max(0,G[t]-B))),Ee=G.length,J={t:Float64Array.from(G),arch:U(G,e=>Math.sin(e*Math.PI)),arch92:U(G,e=>Math.sin(e*Math.PI*.92)),arch66:U(G,e=>Math.sin(e*Math.PI*.66)),wave50:W(G,5),wave41:W(G,4.1),wave52:W(G,5.2),wave47:W(G,4.7),ripple13:W(G,13),ripple27:W(G,27),bulgeLow:U(G,e=>Math.exp(-(((e-.28)/.18)**2))),bulgeHigh:U(G,e=>Math.exp(-(((e-.52)/.18)**2)))},De=Ee*3,Y=[];for(let e=0;e<L;e+=1)for(let t=0;t<3;t+=1)Y.push(H(e/17,t));var Oe=U(Y,e=>Math.max(0,Math.sin(Math.PI*e))),X={t:Float64Array.from(Y),arch:Oe,archPow:Oe.map(e=>e**.68),rise:U(Y,e=>Math.sin(e*Math.PI*.82)),wave88:W(Y,8.8),wave171:W(Y,17.1),wave214:W(Y,21.4),waveX:Se.map(e=>W(Y,e)),wave46:W(Y,4.6),wave48:W(Y,4.8)},Z=(e,t,n,r)=>e*r+t*n;function ke(e,t,n,r,i){let{phase:a,lift:o,bend:s,motion:c}=t,l=.72+Math.sin(a)*.2+Math.sin(a*.61+1.2)*.08,u=Math.sin(a),d=Math.cos(a),f=a*.72,p=a*(e===0?.58:e===1?1:.61),m=Math.sin(f),h=Math.cos(f),g=Math.sin(p),_=Math.cos(p),[v,y]=e===0?J.wave41:e===1?J.wave52:J.wave47,b=Math.sin(a*1.3),ee=Math.cos(a*1.3),te=J.t,ne=J.arch,[x,re]=J.wave50;for(let t=0;t<Ee;t+=1){let r=te[t],i=ne[t],a=Z(v[t],y[t],g,_),u=t*3;if(e===2)n[u]=-1.6-i*.36*o-s*r*.34,n[u+1]=-2.24+(r*3.16-r*r*.12)*o,n[u+2]=1.31-r*.28*o+a*r*.13*o-s*r*.13-c*.1;else if(e===0){let e=Z(m,h,x[t],re[t]);n[u]=-1.87-i*.32*o+e*r*.16*o-s*r*r*.38,n[u+1]=-2.25+(r*(3.08+l*.64)-r*r*.15)*o,n[u+2]=-.64-r*.77*o+a*r*.18*o-s*r*r*.85-c*r*.3*o}else n[u]=1.82+(r*.72-i*.17)*o+s*r*.46,n[u+1]=-2.21+J.arch92[t]*(2.98+l*.55)*o,n[u+2]=.14-J.arch66[t]*.75*o+a*r*.11*o-s*r*.74-c*.25*o}let ie=e===2?.26:e===0?.29:.23,S=e===2?.18:e===0?.24:.22,C=e===1?J.bulgeHigh:J.bulgeLow,w=(.78+l*.22)*(.6+o*.4),[T,E]=J.ripple13,[D,O]=J.ripple27;for(let e=0,t=0,o=0;e<we;e+=1){let c=te[e],l=q[e]*3,f=Te[e]*3,p=n[l]-n[f],m=n[l+1]-n[f+1],h=n[l+2]-n[f+2],g=Math.max(Math.sqrt(p*p+m*m+h*h),1e-6),_=1+(T[e]*ee-E[e]*b)*.16+Z(D[e],O[e],u,d)*.055,v=((i+t)*ue+o*2)*4,y=e*3;r[v]=n[y],r[v+1]=n[y+1],r[v+2]=n[y+2],r[v+3]=(.035+(1-c)*ie+C[e]*S)*_*w*(1+s*(1-c)*.42),r[v+4]=p/g,r[v+5]=m/g,r[v+6]=h/g,r[v+7]=c*24*.62-a,++o===3&&(o=0,t+=1)}}function Ae(e,t,n,r){let{phase:i,lift:a,bend:o,motion:s}=t,c=Math.sin(i),l=Math.cos(i),u=Math.sin(i*.7),d=Math.cos(i*.7),f=Math.sin(i*1.1),p=Math.cos(i*1.1),m=i*Ce[e],h=Math.sin(m),g=Math.cos(m),[_,v]=X.waveX[e],y=xe[e],{t:b,arch:ee,archPow:te,rise:ne}=X,[x,re]=X.wave88,[ie,S]=X.wave171,[C,w]=X.wave214,[T,E]=X.wave46,[D,O]=X.wave48;for(let t=0,m=0,ae=0;t<Y.length;t+=1){let k=b[t],A=ee[t],j=(.07+te[t]*y)*(.78+(x[t]*l-re[t]*c)*.14+Z(ie[t],S[t],u,d)*.08)*(.2+a*.8+o*A*.38),oe=Z(_[t],v[t],h,g),M,N,P;e===2?(M=.74+oe*.26*a,N=-2.22+(k*3.04+Z(T[t],E[t],c,l)*.06)*a,P=1.48+A*.21*a+o*k*.14-s*.1):e===0?(M=-.32+oe*.3*a,N=-2.23+(k*3.45+Z(D[t],O[t],c,l)*.08)*a,P=-1.85-A*.28*a-o*k*.82-s*.24*a):(M=1.99+oe*.24*a+o*k*.38,N=-2.3+ne[t]*3.18*a,P=.08-k*.88*a-o*k*.66-s*k*.29*a);let F=((r+m)*ue+ae*2)*4;n[F]=M,n[F+1]=j,n[F+2]=N,n[F+3]=A,n[F+4]=(C[t]*p-w[t]*f)*.075,n[F+5]=P,n[F+6]=k*8.1-i,n[F+7]=k*18.3+i*.8,++ae===3&&(ae=0,m+=1)}}function je(){let e=new Float32Array(831);for(let t=0;t<se;t+=1)for(let n=0;n<I;n+=1){let r=(t*I+n)*3;e[r]=t/24,e[r+1]=n*A/I}e[827]=-1,e[828]=1,e[830]=1;let t=[];for(let e=0;e<24;e+=1)for(let n=0;n<I;n+=1){let r=e*I+n,i=e*I+(n+1)%I,a=r+I,o=i+I;t.push(r,a,i,i,a,o)}for(let e=0;e<I;e+=1){let n=(e+1)%I;t.push(275,e,n,276,264+n,264+e)}let n=new u;return n.setAttribute(`position`,new m(e,3)),n.setIndex(t),n}function Me(){let e=new Float32Array(972);for(let t=0;t<2;t+=1)for(let n=0;n<L;n+=1)for(let r=0;r<R;r+=1){let i=(t*162+n*R+r)*3;e[i]=n/17,e[i+1]=r/8*2-1,e[i+2]=t===0?1:-1}let t=[];for(let e=0;e<17;e+=1)for(let n=0;n<8;n+=1){let r=e*R+n,i=r+1,a=r+R,o=a+1;t.push(r,i,a,i,o,a,r+162,a+162,i+162,i+162,a+162,o+162)}let n=(e,n)=>{t.push(e,e+162,n,n,e+162,n+162)};for(let e=0;e<8;e+=1){n(e,e+1);let t=153+e;n(t+1,t)}for(let e=0;e<17;e+=1)n((e+1)*R,e*R),n((e+1)*R-1,(e+2)*R-1);let r=new u;return r.setAttribute(`position`,new m(e,3)),r.setIndex(t),r}function Ne(t,n,r,i,a,o){t.setAttribute(`acidPart`,new l(new Float32Array(r),1)),t.setAttribute(`acidRow`,new l(Float32Array.from(r,(e,t)=>i+t*a),1));let s=new e(t,n,r.length);return s.name=o,s.frustumCulled=!1,s.castShadow=s.receiveShadow=!1,s}function Pe(o,c){let l=ae(),u={value:new t(1,0)},p={value:Array.from({length:6},()=>new t)},m={value:new _(0,1,-.45)},h=new Float32Array(ue*me*4),g=new i(h,ue,me,d,s);g.minFilter=g.magFilter=r,g.generateMipmaps=!1;let y=new Float64Array(De),b={phase:0,lift:0,bend:0,motion:0},ee={acidOrbit:u,acidCycles:p,acidClear:m,acidShape:{value:g}},te=k(`Acid_Aura_Jets`,he,{uniforms:ee,face:l}),ne=k(`Acid_Aura_Sheets`,ge,{uniforms:ee,face:l}),x=k(`Acid_Aura_Drops`,D,{face:l}),re=k(`Acid_Aura_Bubbles`,D,{bubble:!0,face:l}),ie=Ne(je(),te,de,0,se,`Acid_Aura_Jets`),S=Ne(Me(),ne,fe,pe,L,`Acid_Aura_Sheets`),C=c?.getObjectByName(`mixamorigHead_06`)??null,w=new _,T=new _,E=new _,O=0,I=1,R=-.45,ce=new f(1,10,7),le=new f(1,16,11),z=new e(ce,x,M[0]),B=new e(le,re,N[0]);z.name=`Acid_Aura_Ballistic_Drops`,B.name=`Acid_Aura_Growing_Bubbles`;for(let e of[z,B])e.instanceMatrix.setUsage(a),e.frustumCulled=!1,e.castShadow=e.receiveShadow=!1,e.count=0,e.visible=!1;o.add(ie,S,z,B);let V=new Float32Array(M[0]*P),H=new Float32Array(N[0]*F),xe=new v,Se=new _,Ce=new _,U=new n,W=new _(0,1,0),G=new _,we=new n,K=0,q=0,Te=0,Ee=!1,J=0,Y=1,Oe=0,X=0,Z=0,Pe=1916576133,Fe=.45,Ie=1.5,Le=2.2,Re=.2,ze=new Float64Array([-.2,-1.1,-2.2,-.8,-.75,-2.45]),Be=new Float64Array([4.4,2.9,5.7,3.6,3.8,5.1]),Ve=ze.slice(),He=Be.slice(),Q=()=>(Pe^=Pe<<13,Pe^=Pe>>>17,Pe^=Pe<<5,(Pe>>>0)/4294967296),Ue=e=>Math.max(1,Math.round(e*oe[K])),We=(e,t,n,r=0)=>{let i=(e*O+n*I)/Math.max(.001,Math.hypot(e,n)),a=Math.max(0,Math.min(1,(i+.25)/.65));a=a*a*(3-2*a);let o=R-r,s=o-.65;return t<=s||a===0?t:t+(s+(o-s)*(1-Math.exp(-(t-s)/(o-s)))-t)*a},$=(e,t=0)=>{let n=e.x*Y+e.z*Oe,r=-e.x*Oe+e.z*Y;e.set(n,We(n,e.y,r,t),r)},Ge=()=>{for(let e=0;e<6;e+=1){q>=Ve[e]+He[e]&&(Ve[e]=q,He[e]=(e===0?3.5:e===1?2.6:e===2?4.5:e===4?3.2:3)+Q()*(e===2?2.1:1.6));let t=Math.max(0,Math.min(1,(q-Ve[e])/He[e])),n=Math.min(1,t/(e===1?.16:.24));n=n*n*(3-2*n);let r=Math.max(0,Math.min(1,(t-(e===2?.42:.34))/(e===2?.55:.61)));r=r*r*(3-2*r);let i=.56+n*(1-r)*.44;p.value[e].set(i,r*(i-.56)/.44)}},Ke=()=>{u.value.set(Y,Oe),m.value.set(O,I,R)},qe=()=>{b.motion=Te;for(let e=0;e<de.length;e+=1){let t=p.value[de[e]];b.phase=q*_e[e]+ve[e],b.lift=t.x,b.bend=t.y,ke(e,b,y,h,e*se)}for(let e=0;e<fe.length;e+=1){let t=p.value[fe[e]];b.phase=q*ye[e]+be[e],b.lift=t.x,b.bend=t.y,Ae(e,b,h,pe+e*L)}g.needsUpdate=!0},Je=(e,t,n,r,i,a,o,s)=>{if(X>=M[K])return;let c=X++*P;V[c]=e,V[c+1]=t,V[c+2]=n,V[c+3]=r,V[c+4]=i,V[c+5]=a,V[c+6]=o,V[c+7]=s,V[c+8]=0,V[c+9]=Q()*A},Ye=e=>{let t=Ue(e===0?3:e===-1?7:5);for(let n=0;n<t;n+=1){let t=e===0?(Q()-.5)*1.2:e*(1.78+Q()*.38),r=e===-1?-.6:e===1?-1.16:-.78,i=(Q()<.48?1:-1)*(e===0?1.95:.55+Q()*.95),a=n===0?.18+Q()*.06:.055+Q()*.11;Je(t,r,i,e*(.32+Q()*.8),1.6+Q()*1.3,-.3-Q()*.8-Te*.35,a,.62+Q()*.37)}},Xe=()=>{if(Z>=N[K])return;let e=Z++*F,t=Q()*A,n=1.72+Q()*.53;H[e]=Math.cos(t)*n,H[e+1]=-2.2+Q()*1.65,H[e+2]=Math.sin(t)*n,H[e+3]=.105+Q()**2*.28,H[e+4]=1.4+Q()*1.45,H[e+5]=0,H[e+6]=Q()*A},Ze=(e,t)=>{e.count=t,e.visible=t>0,t!==0&&(e.instanceMatrix.clearUpdateRanges(),e.instanceMatrix.addUpdateRange(0,t*16),e.instanceMatrix.needsUpdate=!0)},Qe=e=>{let t=0;for(;t<Z;){let n=t*F,r=H[n+5]+e,i=H[n+4],a=r/i;if(a>=1){let e=H[n],r=H[n+1]+i*.43,a=H[n+2]-Te*.2,o=Ue(3);for(let t=0;t<o;t+=1){let t=Q()*A;Je(e,r,a,Math.cos(t)*.65,.45+Q()*.45,Math.sin(t)*.65,.025+Q()*.04,.35+Q()*.2)}let s=--Z;t!==s&&H.copyWithin(n,s*F,(s+1)*F);continue}H[n+5]=r;let o=H[n+6],s=H[n+3]*(.2+.8*(1-(1-a)**2)),c=Math.sin(r*2.1+o)*.065;Se.set(H[n]+Math.sin(r*.94+o)*.1,H[n+1]+r*.43,H[n+2]+Math.cos(r*1.17+o)*.07-Te*.2),Ce.set(s*(1+c),s*(1-c),s),U.setFromAxisAngle(W,o+r*.25),$(Se,s*1.07),U.premultiply(we),xe.compose(Se,U,Ce),B.setMatrixAt(t,xe),t+=1}Ze(B,Z)},$e=e=>{let t=0;for(;t<X;){let n=t*P,r=V[n+8]+e,i=V[n+7],a=V[n+1]+V[n+4]*r-4.1*r*r;if(r>=i||a<-2.49){let e=--X;t!==e&&V.copyWithin(n,e*P,(e+1)*P);continue}V[n+8]=r;let o=r/i,s=V[n+6]*(1-o**4*.78);Se.set(V[n]+V[n+3]*r,a,V[n+2]+V[n+5]*r),G.set(V[n+3],V[n+4]-8.2*r,V[n+5]);let c=G.length();c>1e-6?G.multiplyScalar(1/c):G.copy(W),U.setFromUnitVectors(W,G);let l=1.05+Math.min(c*.1,.42),u=Math.sin(r*3+V[n+9])*.06;Ce.set(s*(1+u)/Math.sqrt(l),s*l,s*(1-u)/Math.sqrt(l)),$(Se,s*l),U.premultiply(we),xe.compose(Se,U,Ce),z.setMatrixAt(t,xe),t+=1}Ze(z,X)},et=()=>{X=Z=0,z.count=B.count=0,z.visible=B.visible=!1};return Ge(),Ke(),qe(),{setTier(e){Ee||(K=e,X=Math.min(X,M[K]),Z=Math.min(Z,N[K]))},step(e,t){Ee||!Number.isFinite(e)||e<=0||(q+=e,J=(J+e*j)%A,Y=Math.cos(J),Oe=Math.sin(J),we.setFromAxisAngle(W,J),Te+=(+!!t-Te)*(1-Math.exp(-e*3)),Ge(),q>=Fe&&(Ye(-1),Fe=q+2.3+Q()*1.3),q>=Ie&&(Ye(1),Ie=q+3+Q()*1.6),q>=Le&&(Ye(0),Le=q+4.2+Q()*1.5),q>=Re&&(Xe(),Re=q+(.45+Q()*.6)/oe[K]),Qe(e),$e(e),Ke(),qe())},view(e){if(Ee)return;if(e.updateMatrixWorld(),o.updateWorldMatrix(!0,!1),C!==null){w.set(-.00570525,.6573547,.02455115),C.localToWorld(w);let e=1.00256*C.matrixWorld.getMaxScaleOnAxis()+.14;l.radius.value.set(e,e)}else w.set(0,1.3,0),o.localToWorld(w);T.copy(w),o.worldToLocal(T),e.getWorldPosition(E),o.worldToLocal(E);let t=Math.hypot(E.x-T.x,E.z-T.z),n=O,r=I,i=R;t>.001&&(O=(E.x-T.x)/t,I=(E.z-T.z)/t),R=Math.min(-.45,T.y-l.radius.value.y-.15),l.centre.value.copy(w).applyMatrix4(e.matrixWorldInverse).multiplyScalar(-1),l.enabled.value=+(C!==null&&l.centre.value.z>.1),Ke(),Math.abs(O-n)+Math.abs(I-r)+Math.abs(R-i)>.002&&(Qe(0),$e(0))},reset(){Ee||(q=Te=0,Pe=1916576133,J=Oe=0,Y=1,we.identity(),Fe=.45,Ie=1.5,Le=2.2,Re=.2,Ve.set(ze),He.set(Be),et(),Ge(),Ke(),qe())},dispose(){if(!Ee){Ee=!0;for(let e of[ie,S,z,B])e.removeFromParent(),e.geometry.dispose(),e.dispose();te.dispose(),ne.dispose(),x.dispose(),re.dispose(),g.dispose()}}}}var Fe=Math.PI*2,Ie=9,Le=1.85,Re=1.35,ze=[.46,.62,.84],Be=[1,.74,.55],Ve=4608,He=3072,Q=1024,Ue=512,We=384,$=65536,Ge=te.toFixed(3),Ke=(te+.12).toFixed(3),qe=8192,Je=`
  ${E}
  uniform float acidClock, acidHead, acidTail;
  // Облик следа: толщина множит вздутие ленты (берега запечены в данные).
  uniform float trailShapeThickness;
  // Время рождения ближней и дальней станции отрезка.
  attribute vec2 acidRibbonBorn;
  // Фаза ряби ближней и дальней станции, их номера.
  attribute vec4 acidRibbonTag;
  ${w}

  // Станция: точка, курс, берега и середина — неизменны с рождения.
  vec3 acidStation;
  vec2 acidHeading;
  float acidLeft, acidRight, acidCentre, acidAge, acidLift, acidPhase;

  // Поперечный профиль станции в точке q: смещение поперёк и высота.
  vec2 acidProfile(float q) {
    float u = q * 2.0 - 1.0;
    float across = (acidCentre + (u < 0.0 ? u * acidLeft : u * acidRight));
    float belly = sqrt(max(0.0, 1.0 - u * u));
    float ripple = sin(acidPhase - acidAge * 5.4 + q * 4.0) * sin(q * PI) * 0.018;
    return vec2(across, (belly * 0.085 + ripple) * trailShapeThickness);
  }

  void main() {
    float q = position.x;
    bool isFar = position.y > 0.5;
    vec3 nearPoint = instanceMatrix[0].xyz, farPoint = instanceMatrix[1].xyz;
    acidStation = isFar ? farPoint : nearPoint;
    acidHeading = isFar ? vec2(instanceMatrix[1].w, instanceMatrix[2].y)
      : vec2(instanceMatrix[0].w, instanceMatrix[2].x);
    float bankLeft = isFar ? instanceMatrix[2].w : instanceMatrix[2].z;
    float bankRight = isFar ? instanceMatrix[3].y : instanceMatrix[3].x;
    acidCentre = isFar ? instanceMatrix[3].w : instanceMatrix[3].z;
    float born = isFar ? acidRibbonBorn.y : acidRibbonBorn.x;
    acidPhase = isFar ? acidRibbonTag.y : acidRibbonTag.x;
    float serial = isFar ? acidRibbonTag.w : acidRibbonTag.z;

    acidAge = max(0.0, acidClock - born);
    float k = clamp(acidAge / ${Le.toFixed(2)}, 0.0, 1.0);
    float shrink = 1.0 - acidSmooth((k - 0.57) / 0.43);
    float spread = (0.82 + acidSmooth(acidAge / 0.28) * 0.34) * shrink;
    // Несовпадающие частоты делают берега неровными без отдельных круглых пятен.
    acidLeft = bankLeft * spread;
    acidRight = bankRight * spread;
    // Концы ленты сужаются: две станции у хвоста и полторы у головы.
    float fromTail = mod(serial - acidTail + ${$}.0, ${$}.0);
    float toHead = mod(acidHead - serial + ${$}.0, ${$}.0);
    float tip = acidSmooth(fromTail / 2.0) * acidSmooth(toHead / 1.5);
    acidLift = shrink * tip;

    vec3 side = vec3(-acidHeading.y, 0.0, acidHeading.x);
    vec2 here = acidProfile(q);
    // Кромка лужи лежит на TRAIL_FLOOR над полом, а не вровень с ним: иначе
    // пол и лента спорят за пиксель и кромка мерцает.
    vec3 transformed = acidStation + side * here.x * tip
      + vec3(0.0, ${Ge} + here.y * acidLift, 0.0);

    // Нормали из поверхности: соседние узлы поперёк, уклон и рябь вдоль, как
    // разности соседних рядов. Блики показывают рябь и высокий мокрый берег.
    float qBefore = max(0.0, q - 0.125), qAfter = min(1.0, q + 0.125);
    vec2 before = acidProfile(qBefore), after = acidProfile(qAfter);
    vec3 acrossTangent = side * (after.x - before.x) * tip
      + vec3(0.0, (after.y - before.y) * acidLift, 0.0);
    float run = max(length(farPoint.xz - nearPoint.xz), 0.001);
    // Рядом стоящие станции дают рябь со сдвигом фазы 9.2 × 0.46 рад.
    float rippleSlope = cos(acidPhase - acidAge * 5.4 + q * 4.0) * sin(q * PI) * 0.018 * -1.93 * trailShapeThickness;
    vec3 alongTangent = vec3(acidHeading.x, (farPoint.y - nearPoint.y) / run + rippleSlope * acidLift,
      acidHeading.y);
    vec3 objectNormal = cross(acrossTangent, alongTangent);
    float normalLength = length(objectNormal);
    objectNormal = normalLength < 1e-6 ? vec3(0.0, 1.0, 0.0) : objectNormal / normalLength;
    if (objectNormal.y < 0.0) objectNormal = -objectNormal;
    vec3 local = transformed;
    ${T}
  }`,Ye=`
  ${E}
  uniform float acidClock;
  // Облик следа: высота сжимает дугу брызг, толщина — высоту кольца.
  uniform float trailShapeThickness, trailShapeHeight;
  attribute float acidBorn;
  ${w}

  // Поворот, переводящий ось Y в единичный вектор v.
  mat3 acidAlign(vec3 v) {
    float c = v.y;
    if (c < -0.9999) return mat3(1.0, 0.0, 0.0, 0.0, -1.0, 0.0, 0.0, 0.0, -1.0);
    vec3 axis = vec3(v.z, 0.0, -v.x);
    mat3 skew = mat3(0.0, axis.z, -axis.y, -axis.z, 0.0, axis.x, axis.y, -axis.x, 0.0);
    return mat3(1.0) + skew + skew * skew * (1.0 / (1.0 + c));
  }

  void main() {
    // Данные частицы неизменны с рождения: скорость и радиус, жизнь, начало.
    vec4 motion = instanceMatrix[0];
    float life = instanceMatrix[1].x;
    vec3 origin = instanceMatrix[3].xyz;
    float radius = motion.w;
    float age = max(0.0, acidClock - acidBorn);
    float k = clamp(age / life, 0.0, 1.0);
    mat3 turn = mat3(1.0);
    vec3 centre = origin, size = vec3(0.0);
    #if ACID_SHAPE == 0
      float remaining = 1.0 - acidSmooth((k - 0.67) / 0.33);
      float vy = motion.y;
      bool thrown = instanceMatrix[1].y < 0.5;
      float apex = vy / 4.8;
      float flight = thrown ? min(age, apex) : 0.0;
      // Подъём и тяготение множатся вместе: дуга ниже, а капля падает в тот же миг.
      float lift = max(0.0, vy * flight - 4.8 * flight * flight) * trailShapeHeight;
      centre = origin + vec3(motion.x * flight, 0.05 + lift, motion.z * flight);
      if (thrown && age < apex) {
        vec3 velocity = vec3(motion.x, (vy - 9.6 * flight) * trailShapeHeight, motion.z);
        float speed = length(velocity);
        if (speed > 1e-6) turn = acidAlign(velocity / speed);
        size = vec3(radius * 0.72, radius * (1.15 + speed * 0.23), radius * 0.72);
        // Нижняя точка вытянутой капли — полуось эллипсоида по вертикали. Капля
        // держится над полом на TRAIL_FLOOR и на излёте ложится на эту высоту.
        float reach = length(vec3(turn[0].y, turn[1].y, turn[2].y) * size);
        centre.y = max(centre.y, origin.y + ${Ge} + reach);
      } else {
        float spread = radius * (1.2 + acidSmooth((age - flight) * 5.0) * 0.8) * remaining;
        size = vec3(spread, radius * 0.16 * remaining, spread * 0.8);
      }
      bool shown = size.y >= 0.0001;
    #elif ACID_SHAPE == 1
      float grown = radius * (0.18 + acidSmooth(k / 0.64) * 0.82) * (1.0 - acidSmooth((k - 0.66) / 0.06));
      // Низ пузыря не опускается ниже TRAIL_FLOOR над полом.
      centre = origin + vec3(0.0, max(0.06 + grown * 0.35, ${Ge} + grown * 0.82), 0.0);
      size = vec3(grown, grown * 0.82, grown);
      bool shown = k < 0.72 && grown > 0.0002;
    #else
      float pop = (k - 0.72) / 0.28;
      float ring = radius * (0.9 + pop * 2.6);
      // Плоское кольцо лежит на TRAIL_FLOOR над полом.
      centre = origin + vec3(0.0, ${Ge}, 0.0);
      size = vec3(ring, (1.0 - pop) * 0.4 * trailShapeThickness, ring);
      bool shown = pop >= 0.0 && pop < 0.999;
    #endif
    if (!shown) {
      // Скрытая частица схлопывается за плоскость отсечения целиком.
      vLiquidLocal = vLiquidNormal = vLiquidViewPosition = vec3(0.0);
      gl_Position = vec4(0.0, 0.0, 2.0, 1.0);
      return;
    }
    vec3 transformed = centre + turn * (position * size);
    vec3 objectNormal = turn * (normal / size);
    vec3 local = position;
    ${T}
  }`,Xe=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  uniform float acidClock;
  uniform float trailShapeThickness, trailShapeHeight;
  attribute float acidBorn;
  varying vec2 vUv;
  varying vec2 vMist;
  varying float vMistLift;
  ${w}
  void main() {
    float age = max(0.0, acidClock - acidBorn);
    float k = clamp(age / ${Re.toFixed(2)}, 0.0, 1.0);
    float seed = instanceMatrix[0].x;
    float size = instanceMatrix[0].y * (0.5 + k * 1.15);
    // Облик следа: снос пара вбок — толщина, подъём — высота.
    vec3 drift = vec3(sin(seed + age * 1.5) * age * 0.16 * trailShapeThickness, age * 0.52 * trailShapeHeight,
      cos(seed) * age * 0.12 * trailShapeThickness);
    vec4 centre = modelViewMatrix * vec4(instanceMatrix[3].xyz + drift, 1.0);
    vec2 card = position.xy * vec2(size, size * 1.5);
    centre.xy += card;
    // Высота точки карточки над полом (пол записан при рождении): столбец Y
    // вида переводит сдвиг карточки в мир.
    vMistLift = instanceMatrix[3].y + drift.y - instanceMatrix[0].z + dot(card, viewMatrix[1].xy);
    gl_Position = projectionMatrix * centre;
    vUv = uv;
    vMist = vec2(acidSmooth(k / 0.18) * (1.0 - acidSmooth((k - 0.32) / 0.68)) * 0.13, seed);
    #include <logdepthbuf_vertex>
  }`,Ze=`
  #include <common>
  #include <logdepthbuf_pars_fragment>
  uniform float acidClock;
  uniform vec3 acidMistGreen, acidMistDeep;
  varying vec2 vUv;
  varying vec2 vMist;
  varying float vMistLift;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x),
      mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
  }
  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float cloud = noise(vUv * 4.5 + vec2(vMist.y, -acidClock * 0.23));
    cloud = cloud * 0.65 + noise(vUv * 10.0 + vMist.y - acidClock * 0.16) * 0.35;
    float alpha = (1.0 - smoothstep(0.25, 1.0, dot(p, p))) * smoothstep(0.22, 0.75, cloud) * vMist.x;
    // Пар больше своей высоты над полом: низ карточки тает, не доходя до пола,
    // и пол не режет его кромкой и не спорит с ним за пиксель.
    alpha *= smoothstep(${Ge}, ${Ke}, vMistLift);
    if (alpha < 0.002) discard;
    #include <logdepthbuf_fragment>
    gl_FragColor = vec4(mix(acidMistDeep, acidMistGreen, cloud), alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`;function Qe(t,n,r,i,o,s){let c=new l(new Float32Array(i*o),o).setUsage(a);n.setAttribute(o===1?`acidBorn`:`acidRibbonBorn`,c);let u=s===null?null:new l(new Float32Array(i*s.width),s.width).setUsage(a);u!==null&&s!==null&&n.setAttribute(s.name,u);let d=new e(n,r,i);return d.instanceMatrix.setUsage(a),d.name=r.name,d.count=0,d.visible=!1,d.frustumCulled=!1,d.castShadow=!1,d.receiveShadow=!1,t.add(d),{mesh:d,data:d.instanceMatrix.array,born:c,extra:u,attributes:u===null?[d.instanceMatrix,c]:[d.instanceMatrix,c,u],until:new Float64Array(i),capacity:i,count:0,slots:ne(),appendStart:-1,rebased:!1}}function $e(e){if(e.count===e.capacity)return-1;let t=e.count++;return e.appendStart<0&&(e.appendStart=t),t}function et(e){e.count=e.mesh.count=0,e.mesh.visible=!1,e.slots.clear(),e.appendStart=-1,e.rebased=!1;for(let t of e.attributes)t.clearUpdateRanges()}function tt(e,t,n){let r=0;for(;r<e.count;){if(e.until[r]>t){r+=1;continue}n?.(r);let i=--e.count;if(r!==i){e.until[r]=e.until[i];for(let t of e.attributes){let e=t.itemSize;t.array.copyWithin(r*e,i*e,(i+1)*e)}e.slots.moved(r)}}}function nt(e,t){let n=e.born.array;for(let n=0;n<e.count;n+=1)e.until[n]=e.until[n]-t;for(let r=0;r<e.count*e.born.itemSize;r+=1)n[r]=n[r]-t;e.rebased=!0}function rt(e){e.mesh.count=e.count,e.mesh.visible=e.count>0;for(let t of e.attributes){let n=!1;t===e.born&&e.rebased&&e.count>0?(t.addUpdateRange(0,e.count*t.itemSize),n=!0):n=e.slots.upload(t,e.appendStart,e.count),n&&(t.needsUpdate=!0)}e.slots.clear(),e.appendStart=-1,e.rebased=!1}function it(e){e.mesh.removeFromParent(),e.mesh.geometry.dispose(),e.mesh.material.dispose(),e.mesh.dispose()}function at(){let e=new u,t=new Float32Array(54);for(let e=0;e<2;e+=1)for(let n=0;n<Ie;n+=1){let r=(e*Ie+n)*3;t[r]=n/8,t[r+1]=e}e.setAttribute(`position`,new m(t,3));let n=[];for(let e=0;e<8;e+=1){let t=e,r=Ie+e;n.push(t,t+1,r,t+1,r+1,r)}return e.setIndex(n),e}function ot(e,t,n=b){let r=n.thickness,i=n.height,a={value:r},s={value:i},l={value:0},u={value:0},d={value:0},m=k(`Acid_Wet_Surface`,Je,{uniforms:{acidClock:l,acidHead:u,acidTail:d,trailShapeThickness:a}}),v=(e,t)=>k(e,Ye,{bubble:t===1,defines:{ACID_SHAPE:t},uniforms:{acidClock:l,trailShapeThickness:a,trailShapeHeight:s}}),ne=new h(1,.035,5,20);ne.rotateX(Math.PI/2);let x=new g().setHex(y(`green`),p).lerp(new g().setHex(y(`yellow`),p),.24),re=new g().setHex(y(`sea-green/-1`),p),ie=new c({name:`Acid_Low_Vapour`,vertexShader:Xe,fragmentShader:Ze,uniforms:{acidClock:l,acidMistGreen:{value:x},acidMistDeep:{value:re},trailShapeThickness:a,trailShapeHeight:s},transparent:!0,depthWrite:!1,side:2,forceSinglePass:!0,toneMapped:!0}),S=Qe(e,at(),m,Ve,2,{name:`acidRibbonTag`,width:4}),C=Qe(e,new f(1,10,7),v(`Acid_Spray_And_Satellites`,0),He,1,null),w=Qe(e,new f(1,14,9),v(`Acid_Boiling_Bubbles`,1),Q,1,null),T=Qe(e,ne,v(`Acid_Pop_Ripples`,2),Ue,1,null),E=Qe(e,new o(1,1),ie,We,1,null);E.mesh.renderOrder=3;let D=[S,C,w,T,E],O=ee(1024),ae=new _,A=new Float64Array(qe),j=new Float64Array(10),oe=!1,M=0,N=0,P=0,F=0,se=0,I=!1,L=2076712242,R=()=>(L^=L<<13,L^=L>>>17,L^=L<<5,(L>>>0)/4294967296),ce=(e,t,n,i,a,o,s)=>{let c=s===1?w:C,l=$e(c);if(l<0)return;let u=(R()-.5)*(s===1?1.5:2.5)*r,d=(R()-.5)*3.4*r,f=.9+R()*.75,p=((s===1?.12:.045)+R()*(s===1?.17:.1))*r,m=-o*d-a*R()*.8,h=s===0?1.4+R()*2.6:0,g=a*d-o*R()*.8,_=c.data,v=l*16;_.fill(0,v,v+16),_[v]=m,_[v+1]=h,_[v+2]=g,_[v+3]=p,_[v+4]=f,_[v+5]=s,_[v+12]=e-o*u,_[v+13]=t,_[v+14]=n+a*u,_[v+15]=1,c.born.setX(l,i),c.until[l]=i+f*(s===1?.72:1)},le=e=>{let t=w.born.getX(e),n=w.data[e*16+4];if(t+n<=N)return;let r=$e(T);r<0||(T.data.set(w.data.subarray(e*16,e*16+16),r*16),T.born.setX(r,t),T.until[r]=t+n)},z=(e,t,n,a)=>{let o=$e(E);if(o<0)return;let s=(R()-.5)*1.7*r,c=R()*Fe,l=(.65+R()*.6)*r,u=E.data,d=o*16;u.fill(0,d,d+16),u[d]=c,u[d+1]=l,u[d+2]=t,u[d+12]=e+s,u[d+13]=t+Math.max(.1*i,te),u[d+14]=n,u[d+15]=1,E.born.setX(o,a),E.until[o]=a+Re},B=(e,t,n,i,a,o)=>{if(N-i>=Le)return;let s=P++,c=se;se+=ze[M],A[s%qe]=i;let l=(.88+Math.sin(c*1.87)*.17+Math.sin(c*5.27+1.4)*.09)*r,u=(.98+Math.sin(c*2.23+2)*.19+Math.sin(c*4.1)*.11)*r,d=(Math.sin(c*.93)*.18+Math.sin(c*2.8)*.05)*r,f=c*9.2%Fe,p=s%$;if(oe&&N-j[3]<Le){let r=$e(S);if(r>=0){let s=S.data,c=r*16;s[c]=j[0],s[c+1]=j[1],s[c+2]=j[2],s[c+3]=j[4],s[c+4]=e,s[c+5]=t,s[c+6]=n,s[c+7]=a,s[c+8]=j[5],s[c+9]=o,s[c+10]=j[6],s[c+11]=l,s[c+12]=j[7],s[c+13]=u,s[c+14]=j[8],s[c+15]=d,S.born.setXY(r,j[3],i),S.extra.setXYZW(r,j[9],f,(p+$-1)%$,p),S.until[r]=j[3]+Le}}j[0]=e,j[1]=t,j[2]=n,j[3]=i,j[4]=a,j[5]=o,j[6]=l,j[7]=u,j[8]=d,j[9]=f,oe=!0;let m=Be[M],h=()=>m>=1||R()<m;s%2==0&&h()&&ce(e,t,n,i,a,o,0),s%3==0&&h()&&ce(e,t,n,i,a,o,1),s%4==0&&h()&&ce(e,t,n,i,a,o,2),s%9==0&&h()&&z(e,t,n,i)},ue=()=>{for(let e of D)et(e);N=P=F=se=0,oe=!1,l.value=u.value=d.value=0;for(let e of D)rt(e)};return{setTier(e){I||(M=e)},step(e,n){if(I)return;t.getWorldPosition(ae);let r=O.step(ae.x,ae.y,ae.z,e,n,ze[M]);if(O.cleared){ue();return}if(!Number.isFinite(e)||e<=0)return;if(N+=e,N>=128){let e=Math.floor(N/128)*128;N-=e;for(let t of D)nt(t,e);for(let t=F;t<P;t+=1){let n=t%qe;A[n]=A[n]-e}j[3]-=e}for(tt(S,N),tt(C,N),tt(w,N,le),tt(T,N),tt(E,N);F<P&&N-A[F%qe]>=Le;)F+=1;let i=Math.hypot(O.direction[0],O.direction[2]),a=i>1e-6?O.direction[0]/i:0,o=i>1e-6?O.direction[2]/i:1;for(let e=0;e<r;e+=1){let t=e*3;B(O.positions[t],O.positions[t+1],O.positions[t+2],N-O.elapsed[e],a,o)}l.value=N,u.value=(P+$-1)%$,d.value=F%$;for(let e of D)rt(e)},reset(){I||(ue(),O.reset(),L=2076712242)},dispose(){if(!I){I=!0;for(let e of D)it(e)}}}}function st(e,t,n,r=b){return ot(e,t,r)}function ct(e,t,n){return Pe(t,n.character)}export{ct as createAcidAuraEffect,st as createAcidTrailEffect};