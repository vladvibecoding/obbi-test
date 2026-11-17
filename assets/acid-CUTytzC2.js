//# allFunctionsCalledOnLoad
import{$ as e,Cr as t,Jt as n,Nt as r,O as i,P as a,Ut as o,V as s,Xn as c,Z as l,d as u,nn as d,nr as f,qn as p,u as m,ur as ee,v as h,wr as g,wt as _}from"./three.core-DVTiNhEy.js";import{o as v}from"./src-BI6MMqKu.js";import{t as y}from"./trail-emitter-DtJSWeMd.js";import{t as te}from"./trail-slots-BYU9mmsR.js";var b=e=>new h().setHex(v(e),p),x=b(`green`),S=b(`sea-green/-1`).multiplyScalar(.48),C=x.clone().lerp(b(`yellow`),.16).multiplyScalar(1.75),w=b(`white`).lerp(b(`yellow`),.06),T=`
  float acidSmooth(float x) { return smoothstep(0.0, 1.0, x); }
`,E=`
    vLiquidLocal = local;
    vLiquidNormal = normalize(normalMatrix * objectNormal);
    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vLiquidViewPosition = -mvPosition.xyz;
    #include <logdepthbuf_vertex>
`,D=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  varying vec3 vLiquidNormal, vLiquidViewPosition, vLiquidLocal;
`,ne=`
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
  }`;function k(){return{centre:{value:new g},radius:{value:new t(1.05,1.05)},enabled:{value:0}}}function re(e,t,n={}){let{bubble:r=!1,face:i}=n,a={...n.defines};return r&&(a.ACID_BUBBLE=1),i&&(a.ACID_FACE=1),new c({name:e,vertexShader:t,fragmentShader:O,defines:a,uniforms:{...n.uniforms,acidGreen:{value:x},acidDeep:{value:S},acidLime:{value:C},acidWhite:{value:w},...i?{acidFaceCentre:i.centre,acidFaceRadius:i.radius,acidFaceEnabled:i.enabled}:{}},side:r?0:2,forceSinglePass:!r,transparent:r,depthTest:!0,depthWrite:!r,toneMapped:!0,blending:1})}var A=Math.PI*2,j=A/15,ie=[1,.55,.3],M=[72,40,22],N=[16,9,5],P=10,F=7,ae=25,I=11,oe=18,L=9,se=.004,ce=.01,le=.01,ue=1/24,de=6,fe=[0,1,4],pe=[2,3,5],me=fe.length*ae,he=me+pe.length*oe,R=`
  ${D}
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
`,ge=`
  ${R}
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
    vec3 angles = vec3(angle, angle + ${ce}, angle - ${ce});
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
    ${E}
  }`,_e=`
  ${R}
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
    vec4 u = clamp(position.y + vec4(0.0, 0.0, 0.0, ${le}), -1.0, 1.0);
    float uBefore = clamp(position.y - ${le}, -1.0, 1.0);
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
    ${E}
  }`,z=(e,t)=>t===0?e:t===1?Math.min(1,e+se):Math.max(0,e-se),ve=[1.04,1.43,1.23],ye=[0,1.8,3.2],be=[.74,1.12,.89],xe=[.6,2.7,4.1],B=[1.16,.74,1.07],V=[3.7,4.6,4.2],Se=[.36,.45,.39];function H(e,t){return Float64Array.from(e,t)}var U=(e,t)=>[H(e,e=>Math.sin(e*t)),H(e,e=>Math.cos(e*t))],W=[];for(let e=0;e<ae;e+=1)for(let t=0;t<3;t+=1)W.push(z(e*ue,t));var Ce=W.length,we=e=>{let t=W.findIndex(t=>Math.abs(t-e)<1e-9);return t>=0?t:(W.push(e),W.length-1)},Te=Int32Array.from({length:Ce},(e,t)=>we(Math.min(1,W[t]+ue))),Ee=Int32Array.from({length:Ce},(e,t)=>we(Math.max(0,W[t]-ue))),G=W.length,K={t:Float64Array.from(W),arch:H(W,e=>Math.sin(e*Math.PI)),arch92:H(W,e=>Math.sin(e*Math.PI*.92)),arch66:H(W,e=>Math.sin(e*Math.PI*.66)),wave50:U(W,5),wave41:U(W,4.1),wave52:U(W,5.2),wave47:U(W,4.7),ripple13:U(W,13),ripple27:U(W,27),bulgeLow:H(W,e=>Math.exp(-(((e-.28)/.18)**2))),bulgeHigh:H(W,e=>Math.exp(-(((e-.52)/.18)**2)))},De=G*3,q=[];for(let e=0;e<oe;e+=1)for(let t=0;t<3;t+=1)q.push(z(e/17,t));var Oe=H(q,e=>Math.max(0,Math.sin(Math.PI*e))),J={t:Float64Array.from(q),arch:Oe,archPow:Oe.map(e=>e**.68),rise:H(q,e=>Math.sin(e*Math.PI*.82)),wave88:U(q,8.8),wave171:U(q,17.1),wave214:U(q,21.4),waveX:V.map(e=>U(q,e)),wave46:U(q,4.6),wave48:U(q,4.8)},Y=(e,t,n,r)=>e*r+t*n;function ke(e,t,n,r,i){let{phase:a,lift:o,bend:s,motion:c}=t,l=.72+Math.sin(a)*.2+Math.sin(a*.61+1.2)*.08,u=Math.sin(a),d=Math.cos(a),f=a*.72,p=a*(e===0?.58:e===1?1:.61),m=Math.sin(f),ee=Math.cos(f),h=Math.sin(p),g=Math.cos(p),[_,v]=e===0?K.wave41:e===1?K.wave52:K.wave47,y=Math.sin(a*1.3),te=Math.cos(a*1.3),b=K.t,x=K.arch,[S,C]=K.wave50;for(let t=0;t<G;t+=1){let r=b[t],i=x[t],a=Y(_[t],v[t],h,g),u=t*3;if(e===2)n[u]=-1.6-i*.36*o-s*r*.34,n[u+1]=-2.24+(r*3.16-r*r*.12)*o,n[u+2]=1.31-r*.28*o+a*r*.13*o-s*r*.13-c*.1;else if(e===0){let e=Y(m,ee,S[t],C[t]);n[u]=-1.87-i*.32*o+e*r*.16*o-s*r*r*.38,n[u+1]=-2.25+(r*(3.08+l*.64)-r*r*.15)*o,n[u+2]=-.64-r*.77*o+a*r*.18*o-s*r*r*.85-c*r*.3*o}else n[u]=1.82+(r*.72-i*.17)*o+s*r*.46,n[u+1]=-2.21+K.arch92[t]*(2.98+l*.55)*o,n[u+2]=.14-K.arch66[t]*.75*o+a*r*.11*o-s*r*.74-c*.25*o}let w=e===2?.26:e===0?.29:.23,T=e===2?.18:e===0?.24:.22,E=e===1?K.bulgeHigh:K.bulgeLow,D=(.78+l*.22)*(.6+o*.4),[ne,O]=K.ripple13,[k,re]=K.ripple27;for(let e=0,t=0,o=0;e<Ce;e+=1){let c=b[e],l=Te[e]*3,f=Ee[e]*3,p=n[l]-n[f],m=n[l+1]-n[f+1],ee=n[l+2]-n[f+2],h=Math.max(Math.sqrt(p*p+m*m+ee*ee),1e-6),g=1+(ne[e]*te-O[e]*y)*.16+Y(k[e],re[e],u,d)*.055,_=((i+t)*de+o*2)*4,v=e*3;r[_]=n[v],r[_+1]=n[v+1],r[_+2]=n[v+2],r[_+3]=(.035+(1-c)*w+E[e]*T)*g*D*(1+s*(1-c)*.42),r[_+4]=p/h,r[_+5]=m/h,r[_+6]=ee/h,r[_+7]=c*24*.62-a,++o===3&&(o=0,t+=1)}}function Ae(e,t,n,r){let{phase:i,lift:a,bend:o,motion:s}=t,c=Math.sin(i),l=Math.cos(i),u=Math.sin(i*.7),d=Math.cos(i*.7),f=Math.sin(i*1.1),p=Math.cos(i*1.1),m=i*Se[e],ee=Math.sin(m),h=Math.cos(m),[g,_]=J.waveX[e],v=B[e],{t:y,arch:te,archPow:b,rise:x}=J,[S,C]=J.wave88,[w,T]=J.wave171,[E,D]=J.wave214,[ne,O]=J.wave46,[k,re]=J.wave48;for(let t=0,m=0,A=0;t<q.length;t+=1){let j=y[t],ie=te[t],M=(.07+b[t]*v)*(.78+(S[t]*l-C[t]*c)*.14+Y(w[t],T[t],u,d)*.08)*(.2+a*.8+o*ie*.38),N=Y(g[t],_[t],ee,h),P,F,ae;e===2?(P=.74+N*.26*a,F=-2.22+(j*3.04+Y(ne[t],O[t],c,l)*.06)*a,ae=1.48+ie*.21*a+o*j*.14-s*.1):e===0?(P=-.32+N*.3*a,F=-2.23+(j*3.45+Y(k[t],re[t],c,l)*.08)*a,ae=-1.85-ie*.28*a-o*j*.82-s*.24*a):(P=1.99+N*.24*a+o*j*.38,F=-2.3+x[t]*3.18*a,ae=.08-j*.88*a-o*j*.66-s*j*.29*a);let I=((r+m)*de+A*2)*4;n[I]=P,n[I+1]=M,n[I+2]=F,n[I+3]=ie,n[I+4]=(E[t]*p-D[t]*f)*.075,n[I+5]=ae,n[I+6]=j*8.1-i,n[I+7]=j*18.3+i*.8,++A===3&&(A=0,m+=1)}}function je(){let e=new Float32Array(831);for(let t=0;t<ae;t+=1)for(let n=0;n<I;n+=1){let r=(t*I+n)*3;e[r]=t/24,e[r+1]=n*A/I}e[827]=-1,e[828]=1,e[830]=1;let t=[];for(let e=0;e<24;e+=1)for(let n=0;n<I;n+=1){let r=e*I+n,i=e*I+(n+1)%I,a=r+I,o=i+I;t.push(r,a,i,i,a,o)}for(let e=0;e<I;e+=1){let n=(e+1)%I;t.push(275,e,n,276,264+n,264+e)}let n=new u;return n.setAttribute(`position`,new m(e,3)),n.setIndex(t),n}function Me(){let e=new Float32Array(972);for(let t=0;t<2;t+=1)for(let n=0;n<oe;n+=1)for(let r=0;r<L;r+=1){let i=(t*162+n*L+r)*3;e[i]=n/17,e[i+1]=r/8*2-1,e[i+2]=t===0?1:-1}let t=[];for(let e=0;e<17;e+=1)for(let n=0;n<8;n+=1){let r=e*L+n,i=r+1,a=r+L,o=a+1;t.push(r,i,a,i,o,a,r+162,a+162,i+162,i+162,a+162,o+162)}let n=(e,n)=>{t.push(e,e+162,n,n,e+162,n+162)};for(let e=0;e<8;e+=1){n(e,e+1);let t=153+e;n(t+1,t)}for(let e=0;e<17;e+=1)n((e+1)*L,e*L),n((e+1)*L-1,(e+2)*L-1);let r=new u;return r.setAttribute(`position`,new m(e,3)),r.setIndex(t),r}function Ne(t,n,r,i,a,o){t.setAttribute(`acidPart`,new l(new Float32Array(r),1)),t.setAttribute(`acidRow`,new l(Float32Array.from(r,(e,t)=>i+t*a),1));let s=new e(t,n,r.length);return s.name=o,s.frustumCulled=!1,s.castShadow=s.receiveShadow=!1,s}function Pe(o,c){let l=k(),u={value:new t(1,0)},p={value:Array.from({length:6},()=>new t)},m={value:new g(0,1,-.45)},ee=new Float32Array(de*he*4),h=new i(ee,de,he,d,s);h.minFilter=h.magFilter=r,h.generateMipmaps=!1;let v=new Float64Array(De),y={phase:0,lift:0,bend:0,motion:0},te={acidOrbit:u,acidCycles:p,acidClear:m,acidShape:{value:h}},b=re(`Acid_Aura_Jets`,ge,{uniforms:te,face:l}),x=re(`Acid_Aura_Sheets`,_e,{uniforms:te,face:l}),S=re(`Acid_Aura_Drops`,ne,{face:l}),C=re(`Acid_Aura_Bubbles`,ne,{bubble:!0,face:l}),w=Ne(je(),b,fe,0,ae,`Acid_Aura_Jets`),T=Ne(Me(),x,pe,me,oe,`Acid_Aura_Sheets`),E=c?.getObjectByName(`mixamorigHead_06`)??null,D=new g,O=new g,I=new g,L=0,se=1,ce=-.45,le=new f(1,10,7),ue=new f(1,16,11),R=new e(le,S,M[0]),z=new e(ue,C,N[0]);R.name=`Acid_Aura_Ballistic_Drops`,z.name=`Acid_Aura_Growing_Bubbles`;for(let e of[R,z])e.instanceMatrix.setUsage(a),e.frustumCulled=!1,e.castShadow=e.receiveShadow=!1,e.count=0,e.visible=!1;o.add(w,T,R,z);let B=new Float32Array(M[0]*P),V=new Float32Array(N[0]*F),Se=new _,H=new g,U=new g,W=new n,Ce=new g(0,1,0),we=new g,Te=new n,Ee=0,G=0,K=0,q=!1,Oe=0,J=1,Y=0,Pe=0,X=0,Z=1916576133,Fe=.45,Ie=1.5,Le=2.2,Re=.2,ze=new Float64Array([-.2,-1.1,-2.2,-.8,-.75,-2.45]),Be=new Float64Array([4.4,2.9,5.7,3.6,3.8,5.1]),Ve=ze.slice(),He=Be.slice(),Q=()=>(Z^=Z<<13,Z^=Z>>>17,Z^=Z<<5,(Z>>>0)/4294967296),$=e=>Math.max(1,Math.round(e*ie[Ee])),Ue=(e,t,n,r=0)=>{let i=(e*L+n*se)/Math.max(.001,Math.hypot(e,n)),a=Math.max(0,Math.min(1,(i+.25)/.65));a=a*a*(3-2*a);let o=ce-r,s=o-.65;return t<=s||a===0?t:t+(s+(o-s)*(1-Math.exp(-(t-s)/(o-s)))-t)*a},We=(e,t=0)=>{let n=e.x*J+e.z*Y,r=-e.x*Y+e.z*J;e.set(n,Ue(n,e.y,r,t),r)},Ge=()=>{for(let e=0;e<6;e+=1){G>=Ve[e]+He[e]&&(Ve[e]=G,He[e]=(e===0?3.5:e===1?2.6:e===2?4.5:e===4?3.2:3)+Q()*(e===2?2.1:1.6));let t=Math.max(0,Math.min(1,(G-Ve[e])/He[e])),n=Math.min(1,t/(e===1?.16:.24));n=n*n*(3-2*n);let r=Math.max(0,Math.min(1,(t-(e===2?.42:.34))/(e===2?.55:.61)));r=r*r*(3-2*r);let i=.56+n*(1-r)*.44;p.value[e].set(i,r*(i-.56)/.44)}},Ke=()=>{u.value.set(J,Y),m.value.set(L,se,ce)},qe=()=>{y.motion=K;for(let e=0;e<fe.length;e+=1){let t=p.value[fe[e]];y.phase=G*ve[e]+ye[e],y.lift=t.x,y.bend=t.y,ke(e,y,v,ee,e*ae)}for(let e=0;e<pe.length;e+=1){let t=p.value[pe[e]];y.phase=G*be[e]+xe[e],y.lift=t.x,y.bend=t.y,Ae(e,y,ee,me+e*oe)}h.needsUpdate=!0},Je=(e,t,n,r,i,a,o,s)=>{if(Pe>=M[Ee])return;let c=Pe++*P;B[c]=e,B[c+1]=t,B[c+2]=n,B[c+3]=r,B[c+4]=i,B[c+5]=a,B[c+6]=o,B[c+7]=s,B[c+8]=0,B[c+9]=Q()*A},Ye=e=>{let t=$(e===0?3:e===-1?7:5);for(let n=0;n<t;n+=1){let t=e===0?(Q()-.5)*1.2:e*(1.78+Q()*.38),r=e===-1?-.6:e===1?-1.16:-.78,i=(Q()<.48?1:-1)*(e===0?1.95:.55+Q()*.95),a=n===0?.18+Q()*.06:.055+Q()*.11;Je(t,r,i,e*(.32+Q()*.8),1.6+Q()*1.3,-.3-Q()*.8-K*.35,a,.62+Q()*.37)}},Xe=()=>{if(X>=N[Ee])return;let e=X++*F,t=Q()*A,n=1.72+Q()*.53;V[e]=Math.cos(t)*n,V[e+1]=-2.2+Q()*1.65,V[e+2]=Math.sin(t)*n,V[e+3]=.105+Q()**2*.28,V[e+4]=1.4+Q()*1.45,V[e+5]=0,V[e+6]=Q()*A},Ze=(e,t)=>{e.count=t,e.visible=t>0,t!==0&&(e.instanceMatrix.clearUpdateRanges(),e.instanceMatrix.addUpdateRange(0,t*16),e.instanceMatrix.needsUpdate=!0)},Qe=e=>{let t=0;for(;t<X;){let n=t*F,r=V[n+5]+e,i=V[n+4],a=r/i;if(a>=1){let e=V[n],r=V[n+1]+i*.43,a=V[n+2]-K*.2,o=$(3);for(let t=0;t<o;t+=1){let t=Q()*A;Je(e,r,a,Math.cos(t)*.65,.45+Q()*.45,Math.sin(t)*.65,.025+Q()*.04,.35+Q()*.2)}let s=--X;t!==s&&V.copyWithin(n,s*F,(s+1)*F);continue}V[n+5]=r;let o=V[n+6],s=V[n+3]*(.2+.8*(1-(1-a)**2)),c=Math.sin(r*2.1+o)*.065;H.set(V[n]+Math.sin(r*.94+o)*.1,V[n+1]+r*.43,V[n+2]+Math.cos(r*1.17+o)*.07-K*.2),U.set(s*(1+c),s*(1-c),s),W.setFromAxisAngle(Ce,o+r*.25),We(H,s*1.07),W.premultiply(Te),Se.compose(H,W,U),z.setMatrixAt(t,Se),t+=1}Ze(z,X)},$e=e=>{let t=0;for(;t<Pe;){let n=t*P,r=B[n+8]+e,i=B[n+7],a=B[n+1]+B[n+4]*r-4.1*r*r;if(r>=i||a<-2.49){let e=--Pe;t!==e&&B.copyWithin(n,e*P,(e+1)*P);continue}B[n+8]=r;let o=r/i,s=B[n+6]*(1-o**4*.78);H.set(B[n]+B[n+3]*r,a,B[n+2]+B[n+5]*r),we.set(B[n+3],B[n+4]-8.2*r,B[n+5]);let c=we.length();c>1e-6?we.multiplyScalar(1/c):we.copy(Ce),W.setFromUnitVectors(Ce,we);let l=1.05+Math.min(c*.1,.42),u=Math.sin(r*3+B[n+9])*.06;U.set(s*(1+u)/Math.sqrt(l),s*l,s*(1-u)/Math.sqrt(l)),We(H,s*l),W.premultiply(Te),Se.compose(H,W,U),R.setMatrixAt(t,Se),t+=1}Ze(R,Pe)},et=()=>{Pe=X=0,R.count=z.count=0,R.visible=z.visible=!1};return Ge(),Ke(),qe(),{setTier(e){q||(Ee=e,Pe=Math.min(Pe,M[Ee]),X=Math.min(X,N[Ee]))},step(e,t){q||!Number.isFinite(e)||e<=0||(G+=e,Oe=(Oe+e*j)%A,J=Math.cos(Oe),Y=Math.sin(Oe),Te.setFromAxisAngle(Ce,Oe),K+=(+!!t-K)*(1-Math.exp(-e*3)),Ge(),G>=Fe&&(Ye(-1),Fe=G+2.3+Q()*1.3),G>=Ie&&(Ye(1),Ie=G+3+Q()*1.6),G>=Le&&(Ye(0),Le=G+4.2+Q()*1.5),G>=Re&&(Xe(),Re=G+(.45+Q()*.6)/ie[Ee]),Qe(e),$e(e),Ke(),qe())},view(e){if(q)return;if(e.updateMatrixWorld(),o.updateWorldMatrix(!0,!1),E!==null){D.set(-.00570525,.6573547,.02455115),E.localToWorld(D);let e=1.00256*E.matrixWorld.getMaxScaleOnAxis()+.14;l.radius.value.set(e,e)}else D.set(0,1.3,0),o.localToWorld(D);O.copy(D),o.worldToLocal(O),e.getWorldPosition(I),o.worldToLocal(I);let t=Math.hypot(I.x-O.x,I.z-O.z),n=L,r=se,i=ce;t>.001&&(L=(I.x-O.x)/t,se=(I.z-O.z)/t),ce=Math.min(-.45,O.y-l.radius.value.y-.15),l.centre.value.copy(D).applyMatrix4(e.matrixWorldInverse).multiplyScalar(-1),l.enabled.value=+(E!==null&&l.centre.value.z>.1),Ke(),Math.abs(L-n)+Math.abs(se-r)+Math.abs(ce-i)>.002&&(Qe(0),$e(0))},reset(){q||(G=K=0,Z=1916576133,Oe=Y=0,J=1,Te.identity(),Fe=.45,Ie=1.5,Le=2.2,Re=.2,Ve.set(ze),He.set(Be),et(),Ge(),Ke(),qe())},dispose(){if(!q){q=!0;for(let e of[w,T,R,z])e.removeFromParent(),e.geometry.dispose(),e.dispose();b.dispose(),x.dispose(),S.dispose(),C.dispose(),h.dispose()}}}}var X=Math.PI*2,Z=9,Fe=1.85,Ie=1.35,Le=[.46,.62,.84],Re=[1,.74,.55],ze=4608,Be=3072,Ve=1024,He=512,Q=384,$=65536,Ue=8192,We=`
  ${D}
  uniform float acidClock, acidHead, acidTail;
  // Время рождения ближней и дальней станции отрезка.
  attribute vec2 acidRibbonBorn;
  // Фаза ряби ближней и дальней станции, их номера.
  attribute vec4 acidRibbonTag;
  ${T}

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
    return vec2(across, belly * 0.085 + ripple);
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
    float k = clamp(acidAge / ${Fe.toFixed(2)}, 0.0, 1.0);
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
    vec3 transformed = acidStation + side * here.x * tip
      + vec3(0.0, 0.025 + here.y * acidLift, 0.0);

    // Нормали из поверхности: соседние узлы поперёк, уклон и рябь вдоль, как
    // разности соседних рядов. Блики показывают рябь и высокий мокрый берег.
    float qBefore = max(0.0, q - 0.125), qAfter = min(1.0, q + 0.125);
    vec2 before = acidProfile(qBefore), after = acidProfile(qAfter);
    vec3 acrossTangent = side * (after.x - before.x) * tip
      + vec3(0.0, (after.y - before.y) * acidLift, 0.0);
    float run = max(length(farPoint.xz - nearPoint.xz), 0.001);
    // Рядом стоящие станции дают рябь со сдвигом фазы 9.2 × 0.46 рад.
    float rippleSlope = cos(acidPhase - acidAge * 5.4 + q * 4.0) * sin(q * PI) * 0.018 * -1.93;
    vec3 alongTangent = vec3(acidHeading.x, (farPoint.y - nearPoint.y) / run + rippleSlope * acidLift,
      acidHeading.y);
    vec3 objectNormal = cross(acrossTangent, alongTangent);
    float normalLength = length(objectNormal);
    objectNormal = normalLength < 1e-6 ? vec3(0.0, 1.0, 0.0) : objectNormal / normalLength;
    if (objectNormal.y < 0.0) objectNormal = -objectNormal;
    vec3 local = transformed;
    ${E}
  }`,Ge=`
  ${D}
  uniform float acidClock;
  attribute float acidBorn;
  ${T}

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
      float lift = max(0.0, vy * flight - 4.8 * flight * flight);
      centre = origin + vec3(motion.x * flight, 0.05 + lift, motion.z * flight);
      if (thrown && age < apex) {
        vec3 velocity = vec3(motion.x, vy - 9.6 * flight, motion.z);
        float speed = length(velocity);
        if (speed > 1e-6) turn = acidAlign(velocity / speed);
        size = vec3(radius * 0.72, radius * (1.15 + speed * 0.23), radius * 0.72);
      } else {
        float spread = radius * (1.2 + acidSmooth((age - flight) * 5.0) * 0.8) * remaining;
        size = vec3(spread, radius * 0.16 * remaining, spread * 0.8);
      }
      bool shown = size.y >= 0.0001;
    #elif ACID_SHAPE == 1
      float grown = radius * (0.18 + acidSmooth(k / 0.64) * 0.82) * (1.0 - acidSmooth((k - 0.66) / 0.06));
      centre = origin + vec3(0.0, 0.06 + grown * 0.35, 0.0);
      size = vec3(grown, grown * 0.82, grown);
      bool shown = k < 0.72 && grown > 0.0002;
    #else
      float pop = (k - 0.72) / 0.28;
      float ring = radius * (0.9 + pop * 2.6);
      centre = origin + vec3(0.0, 0.045, 0.0);
      size = vec3(ring, (1.0 - pop) * 0.4, ring);
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
    ${E}
  }`,Ke=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  uniform float acidClock;
  attribute float acidBorn;
  varying vec2 vUv;
  varying vec2 vMist;
  ${T}
  void main() {
    float age = max(0.0, acidClock - acidBorn);
    float k = clamp(age / ${Ie.toFixed(2)}, 0.0, 1.0);
    float seed = instanceMatrix[0].x;
    float size = instanceMatrix[0].y * (0.5 + k * 1.15);
    vec3 drift = vec3(sin(seed + age * 1.5) * age * 0.16, age * 0.52, cos(seed) * age * 0.12);
    vec4 centre = modelViewMatrix * vec4(instanceMatrix[3].xyz + drift, 1.0);
    centre.xy += position.xy * vec2(size, size * 1.5);
    gl_Position = projectionMatrix * centre;
    vUv = uv;
    vMist = vec2(acidSmooth(k / 0.18) * (1.0 - acidSmooth((k - 0.32) / 0.68)) * 0.13, seed);
    #include <logdepthbuf_vertex>
  }`,qe=`
  #include <common>
  #include <logdepthbuf_pars_fragment>
  uniform float acidClock;
  uniform vec3 acidMistGreen, acidMistDeep;
  varying vec2 vUv;
  varying vec2 vMist;
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
    if (alpha < 0.002) discard;
    #include <logdepthbuf_fragment>
    gl_FragColor = vec4(mix(acidMistDeep, acidMistGreen, cloud), alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`;function Je(t,n,r,i,o,s){let c=new l(new Float32Array(i*o),o).setUsage(a);n.setAttribute(o===1?`acidBorn`:`acidRibbonBorn`,c);let u=s===null?null:new l(new Float32Array(i*s.width),s.width).setUsage(a);u!==null&&s!==null&&n.setAttribute(s.name,u);let d=new e(n,r,i);return d.instanceMatrix.setUsage(a),d.name=r.name,d.count=0,d.visible=!1,d.frustumCulled=!1,d.castShadow=!1,d.receiveShadow=!1,t.add(d),{mesh:d,data:d.instanceMatrix.array,born:c,extra:u,attributes:u===null?[d.instanceMatrix,c]:[d.instanceMatrix,c,u],until:new Float64Array(i),capacity:i,count:0,slots:te(),appendStart:-1,rebased:!1}}function Ye(e){if(e.count===e.capacity)return-1;let t=e.count++;return e.appendStart<0&&(e.appendStart=t),t}function Xe(e){e.count=e.mesh.count=0,e.mesh.visible=!1,e.slots.clear(),e.appendStart=-1,e.rebased=!1;for(let t of e.attributes)t.clearUpdateRanges()}function Ze(e,t,n){let r=0;for(;r<e.count;){if(e.until[r]>t){r+=1;continue}n?.(r);let i=--e.count;if(r!==i){e.until[r]=e.until[i];for(let t of e.attributes){let e=t.itemSize;t.array.copyWithin(r*e,i*e,(i+1)*e)}e.slots.moved(r)}}}function Qe(e,t){let n=e.born.array;for(let n=0;n<e.count;n+=1)e.until[n]=e.until[n]-t;for(let r=0;r<e.count*e.born.itemSize;r+=1)n[r]=n[r]-t;e.rebased=!0}function $e(e){e.mesh.count=e.count,e.mesh.visible=e.count>0;for(let t of e.attributes){let n=!1;t===e.born&&e.rebased&&e.count>0?(t.addUpdateRange(0,e.count*t.itemSize),n=!0):n=e.slots.upload(t,e.appendStart,e.count),n&&(t.needsUpdate=!0)}e.slots.clear(),e.appendStart=-1,e.rebased=!1}function et(e){e.mesh.removeFromParent(),e.mesh.geometry.dispose(),e.mesh.material.dispose(),e.mesh.dispose()}function tt(){let e=new u,t=new Float32Array(54);for(let e=0;e<2;e+=1)for(let n=0;n<Z;n+=1){let r=(e*Z+n)*3;t[r]=n/8,t[r+1]=e}e.setAttribute(`position`,new m(t,3));let n=[];for(let e=0;e<8;e+=1){let t=e,r=Z+e;n.push(t,t+1,r,t+1,r+1,r)}return e.setIndex(n),e}function nt(e,t){let n={value:0},r={value:0},i={value:0},a=re(`Acid_Wet_Surface`,We,{uniforms:{acidClock:n,acidHead:r,acidTail:i}}),s=(e,t)=>re(e,Ge,{bubble:t===1,defines:{ACID_SHAPE:t},uniforms:{acidClock:n}}),l=new ee(1,.035,5,20);l.rotateX(Math.PI/2);let u=new h().setHex(v(`green`),p).lerp(new h().setHex(v(`yellow`),p),.24),d=new h().setHex(v(`sea-green/-1`),p),m=new c({name:`Acid_Low_Vapour`,vertexShader:Ke,fragmentShader:qe,uniforms:{acidClock:n,acidMistGreen:{value:u},acidMistDeep:{value:d}},transparent:!0,depthWrite:!1,side:2,forceSinglePass:!0,toneMapped:!0}),_=Je(e,tt(),a,ze,2,{name:`acidRibbonTag`,width:4}),te=Je(e,new f(1,10,7),s(`Acid_Spray_And_Satellites`,0),Be,1,null),b=Je(e,new f(1,14,9),s(`Acid_Boiling_Bubbles`,1),Ve,1,null),x=Je(e,l,s(`Acid_Pop_Ripples`,2),He,1,null),S=Je(e,new o(1,1),m,Q,1,null);S.mesh.renderOrder=3;let C=[_,te,b,x,S],w=y(1024),T=new g,E=new Float64Array(Ue),D=new Float64Array(10),ne=!1,O=0,k=0,A=0,j=0,ie=0,M=!1,N=2076712242,P=()=>(N^=N<<13,N^=N>>>17,N^=N<<5,(N>>>0)/4294967296),F=(e,t,n,r,i,a,o)=>{let s=o===1?b:te,c=Ye(s);if(c<0)return;let l=(P()-.5)*(o===1?1.5:2.5),u=(P()-.5)*3.4,d=.9+P()*.75,f=(o===1?.12:.045)+P()*(o===1?.17:.1),p=-a*u-i*P()*.8,m=o===0?1.4+P()*2.6:0,ee=i*u-a*P()*.8,h=s.data,g=c*16;h.fill(0,g,g+16),h[g]=p,h[g+1]=m,h[g+2]=ee,h[g+3]=f,h[g+4]=d,h[g+5]=o,h[g+12]=e-a*l,h[g+13]=t,h[g+14]=n+i*l,h[g+15]=1,s.born.setX(c,r),s.until[c]=r+d*(o===1?.72:1)},ae=e=>{let t=b.born.getX(e),n=b.data[e*16+4];if(t+n<=k)return;let r=Ye(x);r<0||(x.data.set(b.data.subarray(e*16,e*16+16),r*16),x.born.setX(r,t),x.until[r]=t+n)},I=(e,t,n,r)=>{let i=Ye(S);if(i<0)return;let a=(P()-.5)*1.7,o=P()*X,s=.65+P()*.6,c=S.data,l=i*16;c.fill(0,l,l+16),c[l]=o,c[l+1]=s,c[l+12]=e+a,c[l+13]=t+.1,c[l+14]=n,c[l+15]=1,S.born.setX(i,r),S.until[i]=r+Ie},oe=(e,t,n,r,i,a)=>{if(k-r>=Fe)return;let o=A++,s=ie;ie+=Le[O],E[o%Ue]=r;let c=.88+Math.sin(s*1.87)*.17+Math.sin(s*5.27+1.4)*.09,l=.98+Math.sin(s*2.23+2)*.19+Math.sin(s*4.1)*.11,u=Math.sin(s*.93)*.18+Math.sin(s*2.8)*.05,d=s*9.2%X,f=o%$;if(ne&&k-D[3]<Fe){let o=Ye(_);if(o>=0){let s=_.data,p=o*16;s[p]=D[0],s[p+1]=D[1],s[p+2]=D[2],s[p+3]=D[4],s[p+4]=e,s[p+5]=t,s[p+6]=n,s[p+7]=i,s[p+8]=D[5],s[p+9]=a,s[p+10]=D[6],s[p+11]=c,s[p+12]=D[7],s[p+13]=l,s[p+14]=D[8],s[p+15]=u,_.born.setXY(o,D[3],r),_.extra.setXYZW(o,D[9],d,(f+$-1)%$,f),_.until[o]=D[3]+Fe}}D[0]=e,D[1]=t,D[2]=n,D[3]=r,D[4]=i,D[5]=a,D[6]=c,D[7]=l,D[8]=u,D[9]=d,ne=!0;let p=Re[O],m=()=>p>=1||P()<p;o%2==0&&m()&&F(e,t,n,r,i,a,0),o%3==0&&m()&&F(e,t,n,r,i,a,1),o%4==0&&m()&&F(e,t,n,r,i,a,2),o%9==0&&m()&&I(e,t,n,r)},L=()=>{for(let e of C)Xe(e);k=A=j=ie=0,ne=!1,n.value=r.value=i.value=0;for(let e of C)$e(e)};return{setTier(e){M||(O=e)},step(e,a){if(M)return;t.getWorldPosition(T);let o=w.step(T.x,T.y,T.z,e,a,Le[O]);if(w.cleared){L();return}if(!Number.isFinite(e)||e<=0)return;if(k+=e,k>=128){let e=Math.floor(k/128)*128;k-=e;for(let t of C)Qe(t,e);for(let t=j;t<A;t+=1){let n=t%Ue;E[n]=E[n]-e}D[3]-=e}for(Ze(_,k),Ze(te,k),Ze(b,k,ae),Ze(x,k),Ze(S,k);j<A&&k-E[j%Ue]>=Fe;)j+=1;let s=Math.hypot(w.direction[0],w.direction[2]),c=s>1e-6?w.direction[0]/s:0,l=s>1e-6?w.direction[2]/s:1;for(let e=0;e<o;e+=1){let t=e*3;oe(w.positions[t],w.positions[t+1],w.positions[t+2],k-w.elapsed[e],c,l)}n.value=k,r.value=(A+$-1)%$,i.value=j%$;for(let e of C)$e(e)},reset(){M||(L(),w.reset(),N=2076712242)},dispose(){if(!M){M=!0;for(let e of C)et(e)}}}}function rt(e,t,n){return nt(e,t)}function it(e,t,n){return Pe(t,n.character)}export{it as createAcidAuraEffect,rt as createAcidTrailEffect};