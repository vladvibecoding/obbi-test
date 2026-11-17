//# allFunctionsCalledOnLoad
import{$ as e,Cr as t,P as n,Rt as r,Xn as i,Y as a,Z as o,qn as s,v as c,wr as l}from"./three.core-DVTiNhEy.js";import{o as u}from"./src-BI6MMqKu.js";import{t as d}from"./trail-emitter-DtJSWeMd.js";import{t as f}from"./trail-slots-BYU9mmsR.js";import{n as p}from"./BufferGeometryUtils-pFWRFHdl.js";var m=e=>new c().setHex(u(e),s),h=m(`red`),g=m(`orange`),_=m(`yellow/1`),v=m(`white`).lerp(_,.6),y=h.clone().multiplyScalar(.16);function b(){return{fireClock:{value:0},fireTime:{value:0},fireOrbit:{value:0},fireMotion:{value:0},fireBulk:{value:1},fireFaceCentre:{value:new l},fireFaceRadius:{value:new t(1.05,1.05)},fireFaceEnabled:{value:0}}}function x(e){e.deleteAttribute(`uv`);let t=p(e);return e.dispose(),t}var S=()=>x(new a(1,1)),C=()=>x(new a(1,0)),w=()=>x(new r(1,0)),T=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  uniform float fireClock, fireTime, fireOrbit, fireMotion, fireBulk;
  // Сколько прошло с записанного момента. Часы следа переносятся на 128 с, а
  // записанное в видеокарте — нет: разность берётся по кругу, в пределах ±64 с.
  float fireSince(float at) { return mod(fireClock - at + 64.0, 128.0) - 64.0; }
  uniform vec3 fireRed, fireOrange, fireYellow, fireHot, fireCharcoal;
  varying vec3 vFireView, vFireColour, vFireNormal, vFireLocal;
  varying float vFireAlpha, vFireHeat, vFireSeed;

  // Поворот по углам Эйлера в порядке XYZ, как у THREE.Euler.
  mat3 fireEuler(vec3 e) {
    float a = cos(e.x), b = sin(e.x), c = cos(e.y), d = sin(e.y), g = cos(e.z), f = sin(e.z);
    float ag = a * g, af = a * f, bg = b * g, bf = b * f;
    return mat3(c * g, af + bg * d, bf - ag * d,
      -c * f, ag - bf * d, bg + af * d,
      d, -b * c, a * c);
  }

  // Частица вне своей жизни получает нулевой размер: треугольники без
  // площади не рисуются.
  void fireEmit(vec3 centre, mat3 turn, vec3 size, vec3 colour, float alpha, float heat, float seed) {
    vec4 mvPosition = modelViewMatrix * vec4(centre + turn * (position * size), 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vFireNormal = normalize(normalMatrix * (turn * (normal / max(abs(size), vec3(0.00001)))));
    vFireView = -mvPosition.xyz; vFireColour = colour; vFireLocal = position;
    vFireAlpha = alpha; vFireHeat = heat; vFireSeed = seed;
  }
`,E=`
  #include <common>
  #include <logdepthbuf_pars_fragment>
  uniform float fireTime, fireFaceEnabled;
  uniform vec3 fireFaceCentre, fireRed, fireOrange, fireYellow, fireHot;
  uniform vec2 fireFaceRadius;
  varying vec3 vFireView, vFireColour, vFireNormal, vFireLocal;
  varying float vFireAlpha, vFireHeat, vFireSeed;
  float fireHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float fireValue(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(fireHash(i), fireHash(i + vec2(1.0, 0.0)), f.x),
      mix(fireHash(i + vec2(0.0, 1.0)), fireHash(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  float fireFbm(vec2 p) {
    return fireValue(p) * 0.55 + fireValue(p * 2.13 + 3.7) * 0.3 + fireValue(p * 4.37 + 8.1) * 0.15;
  }
  vec3 fireRamp(float temperature) {
    vec3 colour = mix(fireRed * 0.5, fireRed, smoothstep(0.04, 0.28, temperature));
    colour = mix(colour, fireOrange, smoothstep(0.24, 0.55, temperature));
    colour = mix(colour, fireYellow, smoothstep(0.52, 0.82, temperature));
    return mix(colour, fireHot, smoothstep(0.82, 1.0, temperature));
  }
  void main() {
    if (vFireAlpha < 0.003) discard;
    if (fireFaceEnabled > 0.5 && vFireView.z < fireFaceCentre.z + fireFaceRadius.y) {
      vec2 offset = vFireView.xy / max(vFireView.z, 0.001)
        - fireFaceCentre.xy / max(fireFaceCentre.z, 0.001);
      float offAxis = sqrt(1.0 + dot(fireFaceCentre.xy, fireFaceCentre.xy)
        / max(fireFaceCentre.z * fireFaceCentre.z, 0.0001));
      vec2 radius = fireFaceRadius * offAxis / max(fireFaceCentre.z - fireFaceRadius.x, 0.1);
      if (dot(offset / radius, offset / radius) < 1.0) discard;
    }
    float facing = abs(dot(normalize(vFireNormal), normalize(vFireView)));
    float heat = clamp(vFireHeat, 0.0, 1.0);
    vec3 colour;
    float alpha = vFireAlpha;
    #ifdef FIRE_FLAME
      // Плотность клубка падает к краю, видному вскользь, и рвётся шумом,
      // который бежит вверх. Остывая, клубок теряет всё, кроме сгустков:
      // контура шара не остаётся, остаются лоскуты.
      float grain = fireFbm(vFireLocal.xy * 2.6 + vFireLocal.z * 1.3
        + vec2(vFireSeed * 7.1, vFireSeed * 3.3 - fireTime * 2.3));
      float density = facing * facing * 1.25 + (grain - 0.5) * 0.9;
      float threshold = 0.16 + (1.0 - heat) * 0.5;
      alpha *= smoothstep(threshold, threshold + 0.35, density);
      float temperature = clamp(heat * (0.3 + 0.75 * density), 0.0, 1.0);
      // Остывший край гаснет раньше, чем краснеет: на светлом небе он читался розовым.
      alpha *= smoothstep(0.06, 0.3, temperature);
      colour = fireRamp(temperature) * (1.0 + temperature * 0.22);
    #else
      // Уголёк остывает по своему цвету: искра желтеет, падающий уголь краснеет.
      colour = vFireColour * (1.0 + heat * 0.3);
      alpha *= 0.55 + 0.45 * smoothstep(0.1, 0.7, facing);
    #endif
    if (alpha < 0.004) discard;
    #include <logdepthbuf_fragment>
    gl_FragColor = vec4(colour, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    gl_FragColor = vec4(gl_FragColor.rgb * alpha, alpha * 0.85);
  }`;function D(e,t,n,r){return new i({name:e,defines:t===`flame`?{FIRE_FLAME:1}:{},transparent:!0,depthWrite:!1,depthTest:!0,side:0,forceSinglePass:!0,toneMapped:!0,blending:5,blendEquation:100,blendSrc:201,blendDst:205,uniforms:{...r,fireRed:{value:h},fireOrange:{value:g},fireYellow:{value:_},fireHot:{value:v},fireCharcoal:{value:y}},vertexShader:n,fragmentShader:E})}function O(e,t){let n=e?.getObjectByName(`mixamorigHead_06`)??null,r=new l,i=new l;return e=>{if(n===null){t.fireFaceEnabled.value=0;return}e.updateMatrixWorld(),n.updateWorldMatrix(!0,!1),r.set(-.00570525,.6573547,.02455115),n.localToWorld(r);let a=1.00256*n.matrixWorld.getMaxScaleOnAxis()+.14;i.copy(r).applyMatrix4(e.matrixWorldInverse).multiplyScalar(-1),t.fireFaceCentre.value.copy(i),t.fireFaceRadius.value.set(a,a),t.fireFaceEnabled.value=Number.isFinite(i.lengthSq())&&i.z>.1?1:0}}var k=Math.PI*2,A=16,j=12,M=192,N=112,P=120,F=12,I=1024,ee=[M,112,64],te=[N,64,36],ne=[1,1.08,1.18],re=[0,6,3,9,1,7,4,10,2,8,5,11],L=e=>P/Math.round(P/e),ie=`${T}
  // Начальная фаза и жизнь.
  attribute vec2 fireCycle;
  // Угол очага, радиус кольца, высота подъёма, ширина клубка.
  attribute vec4 fireSource;
  // Жар очага и зерно клубка.
  attribute vec2 fireDetail;
  void main() {
    float age = fract(fireCycle.x + fireClock / fireCycle.y);
    float puffSeed = fireDetail.y;
    float rise = age * (0.6 + 0.4 * age);
    float sway = sin(age * 5.3 + puffSeed) * 0.3 * age;
    float angle = fireSource.x + fireOrbit + (sin(puffSeed * 3.1) * 0.28 + sway * 0.4) / fireSource.y;
    float radius = fireSource.y + sin(puffSeed * 1.7) * 0.12 - age * 0.18;
    vec3 centre = vec3(cos(angle) * radius, -2.18 + rise * fireSource.z,
      sin(angle) * radius - fireMotion * age * 1.1);
    float birth = smoothstep(0.0, 0.14, age);
    float width = fireSource.w * fireBulk * (1.05 - age * 0.8) * (0.5 + birth * 0.5);
    // Клубок вытянут по ходу подъёма: ось Y поворачивается к направлению,
    // затем клубок крутится вокруг неё на своё зерно.
    vec3 lean = normalize(vec3(cos(angle) * sway * 0.6, 1.0,
      sin(angle) * sway * 0.6 - fireMotion * 0.5));
    vec4 q = normalize(vec4(lean.z, 0.0, -lean.x, 1.0 + lean.y));
    float xx = q.x * q.x * 2.0, xy = q.x * q.y * 2.0, xz = q.x * q.z * 2.0;
    float yy = q.y * q.y * 2.0, yz = q.y * q.z * 2.0, zz = q.z * q.z * 2.0;
    float wx = q.w * q.x * 2.0, wy = q.w * q.y * 2.0, wz = q.w * q.z * 2.0;
    mat3 toward = mat3(1.0 - yy - zz, xy + wz, xz - wy,
      xy - wz, 1.0 - xx - zz, yz + wx,
      xz + wy, yz - wx, 1.0 - xx - yy);
    float c = cos(puffSeed), s = sin(puffSeed);
    mat3 roll = mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
    fireEmit(centre, toward * roll, vec3(width, width * (1.35 + age * 1.1), width * 0.9), vec3(1.0),
      birth * (1.0 - smoothstep(0.55, 1.0, age)) * 0.95, fireDetail.x * (1.04 - age * 0.72), puffSeed);
    #include <logdepthbuf_vertex>
  }`,ae=`${T}
  attribute vec2 fireCycle;
  // Угол, радиус, начальная высота и подъём за жизнь.
  attribute vec4 fireOrbitShape;
  // Размер, зерно, вытянутость.
  attribute vec3 fireDetail;
  void main() {
    float age = fract(fireCycle.x + fireClock / fireCycle.y);
    float seed = fireDetail.y;
    float angle = fireOrbitShape.x + fireOrbit + age * (0.42 + sin(seed) * 0.17);
    float radius = fireOrbitShape.y + age * 0.38;
    vec3 centre = vec3(cos(angle) * radius,
      fireOrbitShape.z + age * fireOrbitShape.w + sin(age * 8.0 + seed) * 0.045,
      sin(angle) * radius - fireMotion * age * 0.35);
    mat3 turn = fireEuler(vec3(age * 2.5 + seed, angle, age * 4.4 + fireOrbitShape.x));
    float envelope = smoothstep(0.0, 0.065, age) * (1.0 - smoothstep(0.47, 0.97, age));
    float size = fireDetail.x * max(0.001, envelope);
    vec3 colour = mix(mix(fireYellow, fireOrange, smoothstep(0.0, 0.42, age)), fireRed,
      smoothstep(0.30, 0.88, age)) * (1.0 - smoothstep(0.55, 0.98, age) * 0.68);
    fireEmit(centre, turn, vec3(size * 0.64, size * fireDetail.z, size * 0.64), colour,
      smoothstep(0.0, 0.05, age) * (1.0 - smoothstep(0.74, 0.98, age)) * 0.93, 1.0, 0.0);
    #include <logdepthbuf_vertex>
  }`;function R(t,n){let r=b(),i=D(`Fire_Aura_Flame_Puffs`,`flame`,ie,r),a=D(`Fire_Aura_Rising_Embers`,`ember`,ae,r),s=S(),c=C(),l=new o(new Float32Array(384),2),u=new o(new Float32Array(768),4),d=new o(new Float32Array(384),2);s.setAttribute(`fireCycle`,l),s.setAttribute(`fireSource`,u),s.setAttribute(`fireDetail`,d);let f=new o(new Float32Array(224),2),p=new o(new Float32Array(448),4),m=new o(new Float32Array(336),3);c.setAttribute(`fireCycle`,f),c.setAttribute(`fireOrbitShape`,p),c.setAttribute(`fireDetail`,m);let h=new e(s,i,M),g=new e(c,a,N);h.name=i.name,g.name=a.name;for(let e of[h,g])e.frustumCulled=!1,e.castShadow=e.receiveShadow=!1,e.renderOrder=3,t.add(e);let _=O(n,r),v=1244264227,y=()=>(v^=v<<13,v^=v>>>17,v^=v<<5,(v>>>0)/4294967296),x=[];for(let e=0;e<A;e+=1){let t=e%3!=1,n=e*k/A+(y()-.5)*.22,r=2.05+y()*.55,i=t?2.6+y()*1.3:1.5+y()*.7,a=.48+y()*.2,o=.72+y()*.3,s=.86+y()*.14;x.push([n,r,i,a,L(o),s])}let w=Array.from({length:M},()=>y()*17);for(let e=0;e<j;e+=1)for(let t=0;t<A;t+=1){let n=e*A+t,r=re[e],i=w[t*j+r],[a,o,s,c,f,p]=x[t];l.setXY(n,(r+i/17*.6)/j,f),u.setXYZW(n,a,o,s,c),d.setXY(n,p,i)}for(let e=0;e<N;e+=1){let t=y(),n=1.25+y()*1.12,r=y()*k,i=2+y()*.83,a=-2.02+y()*1.03,o=1.15+y()*.28-a,s=.027+y()*.04,c=y()*k;f.setXY(e,t,L(n)),p.setXYZW(e,r,i,a,o),m.setXYZ(e,s,c,e%4==0?2.8:1.45)}let T=0,E=0,R=0,z=0,B=!1,V=()=>{h.count=ee[T],g.count=te[T],r.fireBulk.value=ne[T],r.fireClock.value=E,r.fireTime.value=R,r.fireOrbit.value=E%F*k/F,r.fireMotion.value=z};return V(),{setTier(e){B||(T=e,V())},step(e,t){B||!Number.isFinite(e)||e<=0||(E=(E+e)%P,R=(R+e)%I,z+=(+!!t-z)*(1-Math.exp(-e*4)),V())},view(e){B||_(e)},reset(){B||(E=R=z=0,V())},dispose(){B||(B=!0,h.removeFromParent(),g.removeFromParent(),h.dispose(),g.dispose(),s.dispose(),c.dispose(),i.dispose(),a.dispose())}}}var z=Math.PI*2,B=1.1,V=[8,4,3],oe=[4,2,1],H=[5,3,2],U=[1,1.08,1.18],W=1.85,G=11264,K=7680,se=8704,q=128,ce=1024,J=e=>{let t=Math.sin(e*127.1+311.7)*43758.5453123;return t-Math.floor(t)},Y=e=>e-Math.floor(e/z)*z,le=3,ue=`${T}
  void main() {
    // 5–6 — ход очага по земле, 7 — высота подъёма, 8 — курс,
    // 9 — ширина, 10 — жар, 11 — крен, 12 — зерно шума.
    vec4 a = instanceMatrix[0], b = instanceMatrix[1], c = instanceMatrix[2], d = instanceMatrix[3];
    float time = fireSince(a.w);
    float phase = time / b.x;
    float alive = step(0.0, time) * step(phase, 1.0);
    phase = clamp(phase, 0.0, 1.0);
    float rise = phase * (0.6 + 0.4 * phase);
    float birth = smoothstep(0.0, 0.16, phase);
    float width = c.y * fireBulk * (1.05 - phase * 0.78) * (0.5 + birth * 0.5) * alive;
    vec3 flow = vec3(b.y, 0.0, b.z);
    vec3 centre = a.xyz - flow * phase * 0.3 + vec3(0.0, rise * b.w, 0.0);
    mat3 turn = fireEuler(vec3(-0.2 * phase, c.x, c.w * phase));
    fireEmit(centre, turn, vec3(width, width * (1.3 + phase * 1.2), width * 0.9), vec3(1.0),
      birth * (1.0 - smoothstep(0.5, 1.0, phase)) * 0.95 * alive,
      c.z * (1.04 - phase * 0.72), d.x);
    #include <logdepthbuf_vertex>
  }`,de=`${T}
  void main() {
    // 5 — курс, 6 — размер, 7 — вытянутость, 8–9 — темп и фаза мерцания.
    vec4 a = instanceMatrix[0], b = instanceMatrix[1], c = instanceMatrix[2];
    float age = fireSince(a.w);
    float envelope = smoothstep(0.0, 0.065, age) * (1.0 - smoothstep(1.2, b.x, age));
    float size = b.z * max(0.01, envelope) * step(age, b.x);
    float cooling = smoothstep(0.22, 1.41, age);
    float glow = 0.8 + 0.2 * sin(fireTime * c.y + c.z);
    vec3 colour = cooling < 0.5 ? mix(fireOrange, fireRed, cooling * 2.0)
      : mix(fireRed, fireCharcoal, (cooling - 0.5) * 2.0);
    fireEmit(a.xyz, fireEuler(vec3(0.06, b.y, -0.08)),
      vec3(size * 1.1, size * 0.16, size * b.w), colour * glow,
      envelope * 0.96, 1.0 - cooling, 0.0);
    #include <logdepthbuf_vertex>
  }`,fe=`${T}
  void main() {
    // 5–6 — ход очага по земле, 7–8 — снос вбок и отставание за секунду,
    // 9 — взлёт, 10 — размер, 11 — вытянутость, 12–14 — начальные углы,
    // 15 — признак кувыркающегося уголька.
    vec4 a = instanceMatrix[0], b = instanceMatrix[1], c = instanceMatrix[2], d = instanceMatrix[3];
    float time = fireSince(a.w);
    float phase = time / b.x;
    float alive = step(0.0, time) * step(phase, 1.0);
    time = max(time, 0.0); phase = clamp(phase, 0.0, 1.0);
    float envelope = smoothstep(0.0, 0.055, time) * (1.0 - smoothstep(0.57, 1.0, phase));
    float side = b.w * time, along = -c.x * time;
    float gravity = d.w > 0.5 ? 1.15 : 0.48;
    vec3 centre = a.xyz + vec3(b.z * side + b.y * along,
      c.y * time - gravity * time * time, -b.y * side + b.z * along);
    mat3 turn = fireEuler(vec3(c.w, d.x, d.y) + d.w * vec3(time * 3.1, 0.0, time * 2.4));
    float size = c.z * max(0.01, envelope) * alive;
    vec3 colour = phase < 0.45 ? mix(fireHot, fireOrange, phase / 0.45)
      : mix(fireOrange, fireRed, (phase - 0.45) / 0.55);
    fireEmit(centre, turn, vec3(size, size * d.z, size), colour,
      envelope * 0.95 * alive, 1.0 - phase, 0.0);
    #include <logdepthbuf_vertex>
  }`;function X(t,r,i,a){let o=new e(r,i,a);return o.instanceMatrix.setUsage(n),o.name=i.name,o.renderOrder=3,o.count=0,o.visible=!1,o.frustumCulled=!1,o.castShadow=!1,o.receiveShadow=!1,t.add(o),{mesh:o,data:o.instanceMatrix,born:new Float64Array(a),life:new Float64Array(a),capacity:a,count:0,slots:f(),appendStart:-1}}function Z(e,t,n,r,i,a,o=0,s=0,c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0){if(e.count===e.capacity)return!1;let _=e.count++;e.appendStart<0&&(e.appendStart=_),e.born[_]=i,e.life[_]=a;let v=e.data.array,y=_*16;return v[y]=t,v[y+1]=n,v[y+2]=r,v[y+le]=i,v[y+4]=a,v[y+5]=o,v[y+6]=s,v[y+7]=c,v[y+8]=l,v[y+9]=u,v[y+10]=d,v[y+11]=f,v[y+12]=p,v[y+13]=m,v[y+14]=h,v[y+15]=g,!0}function pe(e){e.count=e.mesh.count=0,e.mesh.visible=!1,e.slots.clear(),e.appendStart=-1,e.data.clearUpdateRanges()}function me(e,t){let n=0,r=e.data.array;for(;n<e.count;){if(t-e.born[n]<e.life[n]){n+=1;continue}let i=--e.count;n!==i&&(e.born[n]=e.born[i],e.life[n]=e.life[i],r.copyWithin(n*16,i*16,(i+1)*16),e.slots.moved(n))}}function he(e,t){for(let n=0;n<e.count;n+=1)e.born[n]=e.born[n]-t}function Q(e){e.mesh.count=e.count,e.mesh.visible=e.count>0,e.slots.upload(e.data,e.appendStart,e.count)&&(e.data.needsUpdate=!0),e.slots.clear(),e.appendStart=-1}function ge(e){e.mesh.removeFromParent(),e.mesh.geometry.dispose(),e.mesh.dispose()}function $(e,t,n){let r=b(),i=D(`Fire_Path_Flame_Puffs`,`flame`,ue,r),a=D(`Fire_Path_Cooling_Coals`,`ember`,de,r),o=D(`Fire_Path_Rising_Sparks`,`ember`,fe,r),s=[i,a,o],c=X(e,S(),i,G),u=X(e,C(),a,K),f=X(e,w(),o,se),p=[c,u,f],m=O(n,r),h=d(512),g=new l,_=0,v=0,y=0,x=0,T=!1,E=(e,t,n,r,i,a)=>{let o=x++,s=Math.atan2(i,a),l=V[_];for(let u=0;u<l;u+=1){let d=o*7.31+u*3.71,f=J(d),p=e+u*.07*(8/l)+f*.05,m=.58+J(d+2)*.24;if(v-p>=m)continue;let h=l>1?u/(l-1)*.875:0,g=(J(d+4)-.5)*1.6,_=(J(d+5)-.5)*.8;if(!Z(c,t+a*g+i*_,n+.15,r-i*g+a*_,p,m,i,a,1.6+J(d+1)*1.1,Y(s+f*z),(.46+f*.26)*(1-h*.3),.98-h*.25,Math.sin(d)*.25,d%61))break}if(v-e<W)for(let s=0;s<oe[_];s+=1){let c=o*13.7+s*2.71,l=J(c),d=(l*2-1)*1.43,f=(J(c+1)-.5)*.87;if(!Z(u,t+a*d+i*f,n+.065,r-i*d+a*f,e,W,Y(c),.06+J(c+2)*.09,1.12+l*.7,7+l*6,Y(c)))break}for(let s=0;s<H[_];s+=1){let c=o*17.17+s*1.93,l=J(c),u=e+.03+J(c+2)*.35,d=.78+J(c+3)*.55;if(v-u>=d)continue;let p=s%3==0,m=(l*2-1)*1.15,h=(J(c+5)-.5)*.72;if(!Z(f,t+a*m+i*h,n+.16,r-i*m+a*h,u,d,i,a,Math.sin(c)*(p?.72:.42),.22+l*.53,p?1.45+l*1.55:2.1+l*1.8,p?.05+l*.031:.023+l*.021,p?1.25:4.2+l*2.3,p?Y(c):.12*Math.sin(c),Y(c*.73),p?0:.17*Math.sin(c),+!!p))break}},k=()=>{for(let e of p)pe(e),Q(e);v=y=x=0,r.fireClock.value=r.fireTime.value=0};return{setTier(e){T||(_=e,r.fireBulk.value=U[_])},step(e,n){if(T)return;t.getWorldPosition(g);let i=h.step(g.x,g.y,g.z,e,n,B);if(h.cleared){k();return}if(!Number.isFinite(e)||e<=0)return;if(v+=e,y=(y+e)%ce,v>=q){let e=Math.floor(v/q)*q;v-=e;for(let t of p)he(t,e)}for(let e of p)me(e,v);let a=Math.hypot(h.direction[0],h.direction[2]),o=a>1e-4?h.direction[0]/a:0,s=a>1e-4?h.direction[2]/a:1;for(let e=0;e<i;e+=1){let t=e*3;E(v-h.elapsed[e],h.positions[t],h.positions[t+1],h.positions[t+2],o,s)}for(let e of p)Q(e);r.fireClock.value=v,r.fireTime.value=y},view(e){T||m(e)},reset(){T||(h.reset(),k())},dispose(){if(!T){T=!0;for(let e of p)ge(e);for(let e of s)e.dispose()}}}}function _e(e,t,n){return $(e,t,n.character)}function ve(e,t,n){return R(t,n.character)}export{ve as createFireAuraEffect,_e as createFireTrailEffect};