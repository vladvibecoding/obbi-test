//# allFunctionsCalledOnLoad
import{$ as e,Cr as t,Hn as n,K as r,P as i,Xn as a,d as o,ot as s,qn as c,u as l,v as u,wr as d,wt as f}from"./three.core-DVTiNhEy.js";import{o as p}from"./src-BI6MMqKu.js";import{t as m}from"./trail-emitter-DtJSWeMd.js";import{t as h}from"./trail-slots-BYU9mmsR.js";import{t as g}from"./BufferGeometryUtils-pFWRFHdl.js";function ee(){return new s([new t(0,-.5),new t(.64,-.43),new t(1,-.22),new t(.88,.03),new t(.49,.27),new t(.13,.43),new t(0,.5)],7)}function te(e,t,n){let r=[];for(let i=0;i<t;i+=1){let t=e.clone(),a=t.getAttribute(`position`).count;t.setAttribute(n,new l(new Float32Array(a).fill(i),1)),r.push(t)}let i=g(r);for(let e of r)e.dispose();if(e.dispose(),i===null)throw Error(`Rain shape copies do not merge`);return i}function ne(){let e=e=>new u().setHex(p(e),c);return{blue:e(`blue`),cyan:e(`cyan/1`),white:e(`white`)}}function re(){return{rainFaceCentre:{value:new d},rainFaceRadius:{value:new t(1.05,1.05)},rainFaceEnabled:{value:0}}}var _=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  uniform float rainClock;
  uniform vec3 rainBlue, rainCyan;
  varying vec3 vRainView, vRainNormal, vRainColour;
  varying vec2 vRainUv;
  varying float vRainAlpha;
  // Сколько прошло с записанного момента. Часы переносятся на 128 с, а
  // записанное в видеокарте — нет: разность берётся по кругу, в пределах ±64 с.
  float rainSince(float at) { return mod(rainClock - at + 64.0, 128.0) - 64.0; }
  // Кратчайший поворот оси Y в единичное направление d.
  vec3 rainTurn(vec3 p, vec3 d) {
    vec3 axis = vec3(d.z, 0.0, -d.x);
    return p * d.y + cross(axis, p) + axis * (dot(axis, p) / max(1.0 + d.y, 0.0001));
  }
`,v=`gl_Position = vec4(0.0, 0.0, -2.0, 1.0); vRainAlpha = 0.0; return;`,y=`
  #include <common>
  #include <logdepthbuf_pars_fragment>
  uniform float rainFaceEnabled;
  uniform vec3 rainWhite, rainFaceCentre;
  uniform vec2 rainFaceRadius;
  varying vec3 vRainView, vRainNormal, vRainColour;
  varying vec2 vRainUv;
  varying float vRainAlpha;
  void main() {
    if (vRainAlpha < 0.003) discard;
    if (rainFaceEnabled > 0.5 && vRainView.z < rainFaceCentre.z + rainFaceRadius.y) {
      vec2 offset = vRainView.xy / max(vRainView.z, 0.001)
        - rainFaceCentre.xy / max(rainFaceCentre.z, 0.001);
      float offAxis = sqrt(1.0 + dot(rainFaceCentre.xy, rainFaceCentre.xy)
        / max(rainFaceCentre.z * rainFaceCentre.z, 0.0001));
      vec2 radius = rainFaceRadius * offAxis / max(rainFaceCentre.z - rainFaceRadius.x, 0.1);
      if (dot(offset / radius, offset / radius) < 1.0) discard;
    }
    vec3 normal = normalize(vRainNormal) * (gl_FrontFacing ? 1.0 : -1.0);
    vec3 view = normalize(vRainView + vec3(0.0001));
    vec3 light = normalize(mat3(viewMatrix) * vec3(-0.35, 0.84, 0.42));
    float rim = pow(1.0 - max(0.0, dot(normal, view)), 2.0);
    float shine = pow(max(0.0, dot(normal, normalize(light + view))), 46.0);
    vec3 colour = mix(vRainColour, rainWhite, clamp(rim * 0.48 + shine * 0.78, 0.0, 0.95));
    float alpha = vRainAlpha * (0.65 + rim * 0.27 + shine * 0.08);
    #ifdef RAIN_WET
      float across = abs(vRainUv.y * 2.0 - 1.0);
      float wetPatch = 0.72 + 0.28 * sin(vRainUv.x * 3.3 + sin(vRainUv.y * 18.0) * 1.7);
      alpha *= wetPatch * (1.0 - smoothstep(0.66, 1.0, across));
      colour = mix(vRainColour, rainWhite, shine * 0.65);
    #endif
    if (alpha < 0.003) discard;
    #include <logdepthbuf_fragment>
    gl_FragColor = vec4(colour, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`;function b(e,t,n,r=!1){return new a({name:e,transparent:!0,depthWrite:!1,side:2,forceSinglePass:!0,toneMapped:!0,defines:r?{RAIN_WET:1}:{},uniforms:n,vertexShader:_+t,fragmentShader:y})}function ie(e,t){let n=e?.getObjectByName(`mixamorigHead_06`)??null,r=new d,i=new d;return e=>{if(n===null)return;e.updateMatrixWorld(),n.updateWorldMatrix(!0,!1),r.set(-.00570525,.6573547,.02455115),n.localToWorld(r);let a=1.00256*n.matrixWorld.getMaxScaleOnAxis()+.14;i.copy(r).applyMatrix4(e.matrixWorldInverse).multiplyScalar(-1),t.rainFaceCentre.value.copy(i),t.rainFaceRadius.value.set(a,a),t.rainFaceEnabled.value=Number.isFinite(i.lengthSq())&&i.z>.1?1:0}}function x(t,n,r,a,o,s=0){let c=new e(n,r,a);return c.name=o,c.instanceMatrix.setUsage(i),c.count=0,c.visible=!1,c.frustumCulled=!1,c.castShadow=!1,c.receiveShadow=!1,c.renderOrder=s,c.raycast=()=>void 0,t.add(c),{mesh:c,data:c.instanceMatrix.array,capacity:a,ends:new Float64Array(a),count:0,slots:h(),appendStart:-1}}function S(e){if(e.count===e.capacity)return-1;let t=e.count++;return e.appendStart<0&&(e.appendStart=t),t}function ae(e,t){let n=0;for(;n<e.count;){if(e.ends[n]>t){n+=1;continue}let r=--e.count;n!==r&&(e.ends[n]=e.ends[r],e.data.copyWithin(n*16,r*16,(r+1)*16),e.slots.moved(n))}}function oe(e,t){for(let n=0;n<e.count;n+=1)e.ends[n]=e.ends[n]-t}function se(e){e.mesh.count=e.count,e.mesh.visible=e.count>0;let t=e.mesh.instanceMatrix;e.slots.upload(t,e.appendStart,e.count)&&(t.needsUpdate=!0),e.slots.clear(),e.appendStart=-1}function ce(e){e.count=e.mesh.count=0,e.mesh.visible=!1,e.slots.clear(),e.appendStart=-1,e.mesh.instanceMatrix.clearUpdateRanges()}function le(e){e.mesh.removeFromParent(),e.mesh.geometry.dispose(),e.mesh.dispose()}var C=Math.PI*2,w=160,T=384,E=768,D=[160,88,48],O=-2.5,k=`
  uniform float rainFloor, rainMotion;
  // Капля ливня: место в кольце, радиус, длина, начало цикла, период,
  // прозрачность и оттенок неизменны; падение считается по часам.
  void main() {
    vec4 drop = instanceMatrix[0];
    vec4 cycle = instanceMatrix[1];
    float phase = mod(rainClock - cycle.x, cycle.y) / cycle.y;
    float travel = max(0.5, 3.5 - rainFloor - drop.w);
    vec3 centre = vec3(drop.x, rainFloor + drop.w * 0.5 + travel * (1.0 - phase),
      drop.y - rainMotion * 0.20 * (1.0 - phase));
    vec3 scale = vec3(drop.z, drop.w, drop.z);
    vec4 mvPosition = modelViewMatrix * vec4(centre + position * scale, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vRainView = -mvPosition.xyz;
    vRainNormal = normalize(normalMatrix * (normal / scale));
    vRainColour = mix(rainBlue, rainCyan, cycle.w);
    vRainUv = uv;
    vRainAlpha = cycle.z;
    #include <logdepthbuf_vertex>
  }`,A=`
  void main() {
    vec4 spot = instanceMatrix[0];
    vec2 ring = instanceMatrix[1].xy;
    float age = max(0.0, rainSince(spot.w));
    if (age >= ring.y) { ${v} }
    float k = age / ring.y;
    vec4 mvPosition = viewMatrix * vec4(spot.xyz + position * (0.035 + ring.x * k), 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vRainView = -mvPosition.xyz;
    vRainNormal = normalize(mat3(viewMatrix) * normal);
    vRainColour = mix(rainBlue, rainCyan, 0.28);
    vRainUv = uv;
    vRainAlpha = 0.63 * pow(1.0 - k, 1.35);
    #include <logdepthbuf_vertex>
  }`,ue=`
  void main() {
    vec4 spot = instanceMatrix[0];
    vec4 fly = instanceMatrix[1];
    vec3 piece = instanceMatrix[2].xyz;
    float age = max(0.0, rainSince(spot.w));
    if (age >= piece.z) { ${v} }
    float k = age / fly.w;
    float shrink = 1.0 - max(0.0, (k - 0.62) / 0.38) * 0.88;
    vec3 centre = spot.xyz + vec3(fly.x * age, fly.y * age - 4.9 * age * age, fly.z * age);
    vec3 velocity = vec3(fly.x, fly.y - 9.8 * age, fly.z);
    vec3 direction = dot(velocity, velocity) > 1e-8 ? normalize(velocity) : vec3(0.0, 1.0, 0.0);
    vec3 scale = vec3(piece.x, piece.y, piece.x) * shrink;
    vec4 mvPosition = viewMatrix * vec4(centre + rainTurn(position * scale, direction), 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vRainView = -mvPosition.xyz;
    vRainNormal = normalize(mat3(viewMatrix) * rainTurn(normal / scale, direction));
    vRainColour = mix(rainBlue, rainCyan, 0.42);
    vRainUv = uv;
    vRainAlpha = 0.70 * pow(1.0 - k, 0.50);
    #include <logdepthbuf_vertex>
  }`;function j(t,r){let i=ne(),a=re(),o={value:0},s={value:O},c={value:0},l={rainClock:o,rainBlue:{value:i.blue},rainCyan:{value:i.cyan},rainWhite:{value:i.cyan.clone().lerp(i.white,.12)},...a},u=b(`Rain_Aura_Downpour`,k,{...l,rainFloor:s,rainMotion:c}),p=b(`Rain_Aura_Ripples`,A,l),m=b(`Rain_Aura_Splashes`,ue,l),h=[u,p,m],g=ie(r,a),te=ee(),_=new e(te,u,w);_.name=`Rain_Aura_Local_Downpour`,_.frustumCulled=!1,_.castShadow=_.receiveShadow=!1,_.renderOrder=3,_.raycast=()=>void 0,t.add(_);let v=new n(.76,1,28);v.rotateX(-Math.PI/2);let y=x(t,v,p,T,`Rain_Aura_World_Impact_Rings`,2),j=x(t,ee(),m,E,`Rain_Aura_World_Splashes`,3),M=[y,j],N=(e,t,n,r,i,a,o)=>{let s=t*16+n*4;e[s]=r,e[s+1]=i,e[s+2]=a,e[s+3]=o},P=_.instanceMatrix.array,de=new Float64Array(w),F=new Float64Array(w),fe=new Float64Array(w),I=new Float64Array(320),L=1180533147,R=()=>(L^=L<<13,L^=L>>>17,L^=L<<5,(L>>>0)/4294967296);for(let e=0;e<w;e+=1){let t=e%5==0,n=R()*C,r=Math.sqrt(1.7**2+R()*(3.7**2-1.7**2)),i=Math.cos(n)*r,a=Math.sin(n)*r,o=t?.055+R()*.043:.009+R()*.018,s=t?.17+R()*.15:.36+R()*.72,c=.66+R()*.46;fe[e]=R()*c;let l=t?.54+R()*.13:.76+R()*.16;I[e*2]=i,I[e*2+1]=a,de[e]=c,N(P,e,0,i,a,o,s),N(P,e,1,0,c,l,t?.16:.34),N(P,e,2,0,0,0,0),N(P,e,3,0,0,0,0)}let z=new d,B=new d,V=new d,H=new d,U=new d,pe=new d,W=new f,G=0,K=!1,me=!1,q=0,J=0,he=()=>{for(let e=0;e<w;e+=1)P[e*16+4]=q-F[e];_.instanceMatrix.clearUpdateRanges(),_.instanceMatrix.needsUpdate=!0},Y=()=>{for(let e of M)ce(e);me=!1},X=(e,n,r)=>{B.set(I[e*2],O,I[e*2+1]),U.copy(B).applyMatrix4(W),pe.copy(B).applyMatrix4(t.matrixWorld),z.copy(U).lerp(pe,n),z.y=H.y+(V.y-H.y)*n;let i=z.x,a=z.y,o=z.z,s=q-r,c=S(y);if(c>=0){let e=.28+R()*.25,t=.42+R()*.25;y.ends[c]=s+t,N(y.data,c,0,i,a+.016,o,s),N(y.data,c,1,e,t,0,0)}let l=3+e%3;for(let e=0;e<l&&(c=S(j),!(c<0));e+=1){let e=R()*C,t=.45+R()*.88,n=.86+R()*1.06,r=.016+R()*.026,l=.058+R()*.09,u=.22+R()*.15,d=(n+Math.sqrt(n*n+.392))/9.8,f=Math.min(u,d);j.ends[c]=s+f,N(j.data,c,0,i,a+.025,o,s),N(j.data,c,1,Math.cos(e)*t,n,Math.sin(e)*t,u),N(j.data,c,2,r,l,f,0)}},Z=()=>{o.value=q,c.value=J;for(let e of M)se(e)},Q=()=>{Y(),q=J=0,L=1180533147,F.set(fe),he(),Z()};return _.count=D[G],Q(),{setTier(e){K||e===G||(G=e,_.count=D[G])},step(e,n){if(K||!Number.isFinite(e)||e<=0)return;if(e>.25){Y(),Z();return}if(t.updateWorldMatrix(!0,!1),V.set(0,O,0).applyMatrix4(t.matrixWorld),!Number.isFinite(V.lengthSq())||!t.matrixWorld.elements.every(Number.isFinite)){Y(),Z();return}if((me?V.distanceTo(H):0)>24+e*1200){Y(),Z(),H.copy(V),W.copy(t.matrixWorld);return}me||=(H.copy(V),W.copy(t.matrixWorld),!0),q+=e,J+=(+!!n-J)*(1-Math.exp(-e*3));let r=!1;if(q>=128){let e=Math.floor(q/128)*128;q-=e,r=!0;for(let t of M)oe(t,e)}for(let e of M)ae(e,q);let i=D[G];for(let t=0;t<w;t+=1){let n=de[t],r=F[t],a=r+e;if(a>=n){let o=Math.max(0,Math.min(1,(n-r)/e));t<i&&X(t,o,e*(1-o)),F[t]=a-n}else F[t]=a}r&&he(),Z(),H.copy(V),W.copy(t.matrixWorld)},view(e){K||g(e)},reset(){K||Q()},dispose(){if(!K){K=!0,_.removeFromParent(),te.dispose(),_.dispose();for(let e of M)le(e);for(let e of h)e.dispose()}}}}var M=Math.PI*2,N=1.9,P=.8,de=6,F=[1,.55,.3],fe=.62,I=1.18,L=.32,R=3072,z=6144,B=12288,V=1024,H=8192,U=16,pe=P*3,W=M/3.3*64,G=7,K=e=>{let t=Math.sin(e*127.1+311.7)*43758.5453123;return t-Math.floor(t)},me=`
  // Падающая капля: точка удара, начало падения, высота, скорость, оттенок,
  // длина и радиус записаны, когда она начала падать.
  void main() {
    vec4 spot = instanceMatrix[0];
    vec4 fall = instanceMatrix[1];
    vec2 drop = instanceMatrix[2].xy;
    float t = rainSince(spot.w);
    if (t < 0.0 || t * fall.y >= fall.x) { ${v} }
    float appear = smoothstep(0.0, 1.0, t / 0.05);
    float h = fall.x - fall.y * t;
    vec3 tilt = normalize(vec3(-0.033, 1.0, 0.025));
    vec3 centre = vec3(spot.x - h * 0.033, spot.y + 0.064 + h + drop.x * appear * 0.5, spot.z + h * 0.025);
    vec3 scale = vec3(drop.y, max(0.001, drop.x * appear), drop.y);
    vec4 mvPosition = modelViewMatrix * vec4(centre + rainTurn(position * scale, tilt), 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vRainView = -mvPosition.xyz;
    vRainNormal = normalize(normalMatrix * rainTurn(normal / scale, tilt));
    vRainColour = mix(rainBlue, rainCyan, fall.z);
    vRainUv = uv;
    vRainAlpha = appear * 0.94;
    #include <logdepthbuf_vertex>
  }`,q=`
  attribute float rainRing;
  // Два водяных круга одной капли: второй расходится на 0.12 с позже, оба
  // гаснут вместе со станцией.
  void main() {
    vec4 spot = instanceMatrix[0];
    vec4 ring = instanceMatrix[1];
    float time = rainSince(spot.w) - rainRing * 0.12;
    float age = rainSince(ring.x);
    if (time < 0.0 || time >= ring.y || age >= ${N.toFixed(2)}) { ${v} }
    float progress = time / ring.y;
    float size = 0.11 + ring.z * sqrt(progress);
    float fade = 1.0 - smoothstep(0.0, 1.0, (age - 1.25) / 0.65);
    vec3 scale = vec3(size, 1.0, size);
    vec3 centre = vec3(spot.x, spot.y + 0.064 + rainRing * 0.009, spot.z);
    vec4 mvPosition = modelViewMatrix * vec4(centre + position * scale, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vRainView = -mvPosition.xyz;
    vRainNormal = normalize(normalMatrix * (normal / scale));
    vRainColour = mix(rainBlue, rainCyan, rainRing > 0.5 ? 0.08 : 0.28);
    vRainUv = uv;
    vRainAlpha = smoothstep(0.0, 1.0, time / 0.035) * (1.0 - smoothstep(0.0, 1.0, progress))
      * (rainRing > 0.5 ? 0.72 : 0.94) * fade;
    #include <logdepthbuf_vertex>
  }`,J=`
  attribute float rainPiece;
  // Три брызги удара большой капли разлетаются через треть оборота.
  void main() {
    vec4 spot = instanceMatrix[0];
    vec2 hit = instanceMatrix[1].xy;
    float hitAge = rainSince(spot.w);
    if (hitAge < 0.0 || hitAge >= ${L.toFixed(2)}) { ${v} }
    float angle = hit.x + rainPiece * PI2 / 3.0;
    float vx = cos(angle) * hit.y, vz = sin(angle) * hit.y;
    float h = 1.6 * hitAge - 5.0 * hitAge * hitAge;
    float appear = smoothstep(0.0, 1.0, hitAge / 0.025);
    vec3 centre = vec3(spot.x + vx * hitAge, spot.y + 0.11 + h, spot.z + vz * hitAge);
    vec3 direction = normalize(vec3(vx, 1.6 - 10.0 * hitAge, vz));
    float size = max(0.001, 0.052 * appear * (1.0 - smoothstep(0.0, 1.0, hitAge / 0.32) * 0.6));
    vec3 scale = vec3(size, size * 3.4, size);
    vec4 mvPosition = modelViewMatrix * vec4(centre + rainTurn(position * scale, direction), 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vRainView = -mvPosition.xyz;
    vRainNormal = normalize(normalMatrix * rainTurn(normal / scale, direction));
    vRainColour = mix(rainBlue, rainCyan, 0.42);
    vRainUv = uv;
    vRainAlpha = appear * (1.0 - smoothstep(0.0, 1.0, (hitAge - 0.2) / 0.12)) * 0.94;
    #include <logdepthbuf_vertex>
  }`,he=`
  uniform vec3 rainColour;
  // Отрезок мокрой полосы между двумя соседними станциями: uv.x выбирает
  // станцию, uv.y — место поперёк полосы.
  void main() {
    bool second = uv.x > 0.5;
    vec4 station = second ? instanceMatrix[1] : instanceMatrix[0];
    vec2 course = second ? instanceMatrix[2].zw : instanceMatrix[2].xy;
    vec4 band = instanceMatrix[3];
    float age = rainSince(station.w);
    float grow = smoothstep(0.0, 1.0, age / 0.14);
    float fade = 1.0 - smoothstep(0.0, 1.0, (age - 1.25) / 0.65);
    float side = (uv.y * 2.0 - 1.0) * (second ? band.y : band.x) * (0.65 + grow * 0.35);
    vec3 point = vec3(station.x + course.y * side, station.y + 0.032, station.z - course.x * side);
    vec4 mvPosition = modelViewMatrix * vec4(point, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vRainView = -mvPosition.xyz;
    vRainNormal = normalize(normalMatrix * vec3(0.0, 1.0, 0.0));
    vRainColour = rainColour;
    vRainUv = vec2(band.z + (second ? 0.23 : 0.0), uv.y);
    vRainAlpha = grow * fade * 0.48;
    #include <logdepthbuf_vertex>
  }`;function Y(){let e=new o,t=new Float32Array(28);for(let e=0;e<2;e+=1)for(let n=0;n<G;n+=1){let r=(e*G+n)*2;t[r]=e,t[r+1]=n/6}let n=[];for(let e=0;e<6;e+=1){let t=e,r=t+G;n.push(t,r,t+1,r,r+1,t+1)}return e.setAttribute(`position`,new l(new Float32Array(42),3)),e.setAttribute(`uv`,new l(t,2)),e.setIndex(n),e}function X(e,t,i){let a=ne(),o=re(),s={value:0},c=a.cyan.clone().lerp(a.white,.12),l={rainClock:s,rainBlue:{value:a.blue},rainCyan:{value:a.cyan},rainWhite:{value:c},...o},u=b(`Rain_Trail_Wet`,he,{...l,rainColour:{value:a.blue.clone().lerp(a.cyan,.1)}},!0),f=b(`Rain_Trail_Streaks`,me,l),p=b(`Rain_Trail_Ripples`,q,l),h=b(`Rain_Trail_Spray`,J,l),g=[u,f,p,h],_=ie(i,o),v=new r;v.name=`Rain_Water_Wake`,e.add(v);let y=new n(.86,1,28);y.rotateX(-Math.PI/2);let C=x(v,Y(),u,R,`Rain_Path_Wet_Surface`),w=x(v,ee(),f,z,`Rain_Path_Falling_Streaks`),T=x(v,te(y,2,`rainRing`),p,B,`Rain_Path_Expanding_Ripples`),E=x(v,te(ee(),3,`rainPiece`),h,V,`Rain_Path_Impact_Spray`),D=[C,w,T,E],O=new Float32Array(H*U),k=m(1024),A=new d,ue=0,j=0,G=0,X=0,Z=0,Q=!1,ge=!1,_e=0,ve=0,ye=0,be=0,xe=0,Se=1,Ce=0,we=0,$=(e,t,n,r,i,a,o)=>{let s=t*16+n*4;e.data[s]=r,e.data[s+1]=i,e.data[s+2]=a,e.data[s+3]=o},Te=(e,t,n,r,i,a,o)=>{for(let s=0;s<de&&Z<H;s+=1){let c=o*9+s*1.37,l=K(c),u=(s-2.5)*.7+(l-.5)*.65,d=(K(c+2.2)-.5)*1,f=K(c+.3)*.24,p=2.1+l*2.5,m=7.5+K(c+.7)*4.5,h=s%3==0,g=Z++*U;O[g]=e+a*u+i*d,O[g+1]=t,O[g+2]=n-i*u+a*d,O[g+3]=r,O[g+4]=f,O[g+5]=f+p/m,O[g+6]=p,O[g+7]=m,O[g+8]=.12+l*.32,O[g+9]=h?.4:.68+l*.5,O[g+10]=h?.085:.036+l*.018,O[g+11]=.88+l*.18,O[g+12]=.82+l*.26,O[g+13]=h?c%M:-1,O[g+14]=.7+l*.5,O[g+15]=0}},Ee=()=>{let e=0;for(;e<Z;){let t=e*U,n=O[t+3],r=O[t],i=O[t+1],a=O[t+2];if(O[t+15]===0){let o=n+O[t+4];if(j<o){e+=1;continue}let s=S(w);s>=0&&(w.ends[s]=j+fe,$(w,s,0,r,i,a,o),$(w,s,1,O[t+6],O[t+7],O[t+8],0),$(w,s,2,O[t+9],O[t+10],0,0)),O[t+15]=1}let o=n+O[t+5];if(j<o){e+=1;continue}let s=S(T);if(s>=0&&(T.ends[s]=j+I,$(T,s,0,r,i,a,o),$(T,s,1,n,O[t+11],O[t+12],0)),O[t+13]>=0){let e=S(E);e>=0&&(E.ends[e]=j+L,$(E,e,0,r,i,a,o),$(E,e,1,O[t+13],O[t+14],0,0))}let c=--Z;e!==c&&O.copyWithin(t,c*U,(c+1)*U)}},De=(e,t,n,r,i,a)=>{let o=G++,s=1.85+Math.sin(o*.37)*.23+Math.sin(o*.13)*.2;if(ge&&Math.hypot(e-_e,t-ve,n-ye)<=pe){let o=S(C);o>=0&&(C.ends[o]=be+N,$(C,o,0,_e,ve,ye,be),$(C,o,1,e,t,n,r),$(C,o,2,xe,Se,i,a),$(C,o,3,Ce,s,we,0))}ge=!0,_e=e,ve=t,ye=n,be=r,xe=i,Se=a,Ce=s,we=o*.23%W,X+=F[ue],!(X<1)&&(--X,Te(e,t,n,r,i,a,o))},Oe=()=>{s.value=j;for(let e of D)se(e);v.visible=D.some(e=>e.count>0)},ke=()=>{for(let e of D)ce(e);j=0,G=0,X=0,Z=0,ge=!1,Oe()};return ke(),{setTier(e){Q||(ue=e)},step(e,n){if(Q)return;t.getWorldPosition(A);let r=k.step(A.x,A.y,A.z,e,n,P);if(k.cleared){ke();return}if(!Number.isFinite(e)||e<=0)return;if(j+=e,j>=128){let e=Math.floor(j/128)*128;j-=e,be-=e;for(let t of D)oe(t,e);for(let t=0;t<Z;t+=1)O[t*U+3]=O[t*U+3]-e}for(let e of D)ae(e,j);let i=Math.hypot(k.direction[0],k.direction[2]),a=i>1e-6?k.direction[0]/i:0,o=i>1e-6?k.direction[2]/i:1;for(let e=0;e<r;e+=1)De(k.positions[e*3],k.positions[e*3+1],k.positions[e*3+2],j-k.elapsed[e],a,o);Ee(),Oe()},view(e){Q||_(e)},reset(){Q||(k.reset(),ke())},dispose(){if(!Q){Q=!0;for(let e of D)le(e);for(let e of g)e.dispose();v.removeFromParent()}}}}function Z(e,t,n){return X(e,t,n.character)}function Q(e,t,n){return j(t,n.character)}export{Q as createRainAuraEffect,Z as createRainTrailEffect};