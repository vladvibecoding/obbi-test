//# allFunctionsCalledOnLoad
import{$ as e,Cr as t,Hn as n,K as r,P as i,Xn as a,d as o,ot as s,qn as c,u as l,v as u,wr as d,wt as f}from"./three.core-DVTiNhEy.js";import{o as p}from"./src-BI6MMqKu.js";import{n as m,r as ee,t as h}from"./trail-shape-BsaeWHuc.js";import{t as g}from"./trail-slots-BYU9mmsR.js";import{t as _}from"./BufferGeometryUtils-pFWRFHdl.js";function te(){return new s([new t(0,-.5),new t(.64,-.43),new t(1,-.22),new t(.88,.03),new t(.49,.27),new t(.13,.43),new t(0,.5)],7)}function ne(e,t,n){let r=[];for(let i=0;i<t;i+=1){let t=e.clone(),a=t.getAttribute(`position`).count;t.setAttribute(n,new l(new Float32Array(a).fill(i),1)),r.push(t)}let i=_(r);for(let e of r)e.dispose();if(e.dispose(),i===null)throw Error(`Rain shape copies do not merge`);return i}function re(){let e=e=>new u().setHex(p(e),c);return{blue:e(`blue`),cyan:e(`cyan/1`),white:e(`white`)}}function ie(){return{rainFaceCentre:{value:new d},rainFaceRadius:{value:new t(1.05,1.05)},rainFaceEnabled:{value:0}}}var v=`
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
`,y=`gl_Position = vec4(0.0, 0.0, -2.0, 1.0); vRainAlpha = 0.0; return;`,b=`
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
  }`;function x(e,t,n,r=!1){return new a({name:e,transparent:!0,depthWrite:!1,side:2,forceSinglePass:!0,toneMapped:!0,defines:r?{RAIN_WET:1}:{},uniforms:n,vertexShader:v+t,fragmentShader:b})}function ae(e,t){let n=e?.getObjectByName(`mixamorigHead_06`)??null,r=new d,i=new d;return e=>{if(n===null)return;e.updateMatrixWorld(),n.updateWorldMatrix(!0,!1),r.set(-.00570525,.6573547,.02455115),n.localToWorld(r);let a=1.00256*n.matrixWorld.getMaxScaleOnAxis()+.14;i.copy(r).applyMatrix4(e.matrixWorldInverse).multiplyScalar(-1),t.rainFaceCentre.value.copy(i),t.rainFaceRadius.value.set(a,a),t.rainFaceEnabled.value=Number.isFinite(i.lengthSq())&&i.z>.1?1:0}}function S(t,n,r,a,o,s=0){let c=new e(n,r,a);return c.name=o,c.instanceMatrix.setUsage(i),c.count=0,c.visible=!1,c.frustumCulled=!1,c.castShadow=!1,c.receiveShadow=!1,c.renderOrder=s,c.raycast=()=>void 0,t.add(c),{mesh:c,data:c.instanceMatrix.array,capacity:a,ends:new Float64Array(a),count:0,slots:g(),appendStart:-1}}function C(e){if(e.count===e.capacity)return-1;let t=e.count++;return e.appendStart<0&&(e.appendStart=t),t}function oe(e,t){let n=0;for(;n<e.count;){if(e.ends[n]>t){n+=1;continue}let r=--e.count;n!==r&&(e.ends[n]=e.ends[r],e.data.copyWithin(n*16,r*16,(r+1)*16),e.slots.moved(n))}}function se(e,t){for(let n=0;n<e.count;n+=1)e.ends[n]=e.ends[n]-t}function ce(e){e.mesh.count=e.count,e.mesh.visible=e.count>0;let t=e.mesh.instanceMatrix;e.slots.upload(t,e.appendStart,e.count)&&(t.needsUpdate=!0),e.slots.clear(),e.appendStart=-1}function le(e){e.count=e.mesh.count=0,e.mesh.visible=!1,e.slots.clear(),e.appendStart=-1,e.mesh.instanceMatrix.clearUpdateRanges()}function ue(e){e.mesh.removeFromParent(),e.mesh.geometry.dispose(),e.mesh.dispose()}var w=Math.PI*2,T=160,E=384,D=768,O=[160,88,48],k=-2.5,A=`
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
  }`,j=`
  void main() {
    vec4 spot = instanceMatrix[0];
    vec2 ring = instanceMatrix[1].xy;
    float age = max(0.0, rainSince(spot.w));
    if (age >= ring.y) { ${y} }
    float k = age / ring.y;
    vec4 mvPosition = viewMatrix * vec4(spot.xyz + position * (0.035 + ring.x * k), 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vRainView = -mvPosition.xyz;
    vRainNormal = normalize(mat3(viewMatrix) * normal);
    vRainColour = mix(rainBlue, rainCyan, 0.28);
    vRainUv = uv;
    vRainAlpha = 0.63 * pow(1.0 - k, 1.35);
    #include <logdepthbuf_vertex>
  }`,M=`
  void main() {
    vec4 spot = instanceMatrix[0];
    vec4 fly = instanceMatrix[1];
    vec3 piece = instanceMatrix[2].xyz;
    float age = max(0.0, rainSince(spot.w));
    if (age >= piece.z) { ${y} }
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
  }`;function N(t,r){let i=re(),a=ie(),o={value:0},s={value:k},c={value:0},l={rainClock:o,rainBlue:{value:i.blue},rainCyan:{value:i.cyan},rainWhite:{value:i.cyan.clone().lerp(i.white,.12)},...a},u=x(`Rain_Aura_Downpour`,A,{...l,rainFloor:s,rainMotion:c}),p=x(`Rain_Aura_Ripples`,j,l),m=x(`Rain_Aura_Splashes`,M,l),ee=[u,p,m],h=ae(r,a),g=te(),_=new e(g,u,T);_.name=`Rain_Aura_Local_Downpour`,_.frustumCulled=!1,_.castShadow=_.receiveShadow=!1,_.renderOrder=3,_.raycast=()=>void 0,t.add(_);let ne=new n(.76,1,28);ne.rotateX(-Math.PI/2);let v=S(t,ne,p,E,`Rain_Aura_World_Impact_Rings`,2),y=S(t,te(),m,D,`Rain_Aura_World_Splashes`,3),b=[v,y],N=(e,t,n,r,i,a,o)=>{let s=t*16+n*4;e[s]=r,e[s+1]=i,e[s+2]=a,e[s+3]=o},P=_.instanceMatrix.array,de=new Float64Array(T),F=new Float64Array(T),fe=new Float64Array(T),I=new Float64Array(320),L=1180533147,R=()=>(L^=L<<13,L^=L>>>17,L^=L<<5,(L>>>0)/4294967296);for(let e=0;e<T;e+=1){let t=e%5==0,n=R()*w,r=Math.sqrt(1.7**2+R()*(3.7**2-1.7**2)),i=Math.cos(n)*r,a=Math.sin(n)*r,o=t?.055+R()*.043:.009+R()*.018,s=t?.17+R()*.15:.36+R()*.72,c=.66+R()*.46;fe[e]=R()*c;let l=t?.54+R()*.13:.76+R()*.16;I[e*2]=i,I[e*2+1]=a,de[e]=c,N(P,e,0,i,a,o,s),N(P,e,1,0,c,l,t?.16:.34),N(P,e,2,0,0,0,0),N(P,e,3,0,0,0,0)}let z=new d,pe=new d,B=new d,V=new d,me=new d,he=new d,H=new f,U=0,W=!1,G=!1,K=0,q=0,ge=()=>{for(let e=0;e<T;e+=1)P[e*16+4]=K-F[e];_.instanceMatrix.clearUpdateRanges(),_.instanceMatrix.needsUpdate=!0},J=()=>{for(let e of b)le(e);G=!1},_e=(e,n,r)=>{pe.set(I[e*2],k,I[e*2+1]),me.copy(pe).applyMatrix4(H),he.copy(pe).applyMatrix4(t.matrixWorld),z.copy(me).lerp(he,n),z.y=V.y+(B.y-V.y)*n;let i=z.x,a=z.y,o=z.z,s=K-r,c=C(v);if(c>=0){let e=.28+R()*.25,t=.42+R()*.25;v.ends[c]=s+t,N(v.data,c,0,i,a+.016,o,s),N(v.data,c,1,e,t,0,0)}let l=3+e%3;for(let e=0;e<l&&(c=C(y),!(c<0));e+=1){let e=R()*w,t=.45+R()*.88,n=.86+R()*1.06,r=.016+R()*.026,l=.058+R()*.09,u=.22+R()*.15,d=(n+Math.sqrt(n*n+.392))/9.8,f=Math.min(u,d);y.ends[c]=s+f,N(y.data,c,0,i,a+.025,o,s),N(y.data,c,1,Math.cos(e)*t,n,Math.sin(e)*t,u),N(y.data,c,2,r,l,f,0)}},Y=()=>{o.value=K,c.value=q;for(let e of b)ce(e)},ve=()=>{J(),K=q=0,L=1180533147,F.set(fe),ge(),Y()};return _.count=O[U],ve(),{setTier(e){W||e===U||(U=e,_.count=O[U])},step(e,n){if(W||!Number.isFinite(e)||e<=0)return;if(e>.25){J(),Y();return}if(t.updateWorldMatrix(!0,!1),B.set(0,k,0).applyMatrix4(t.matrixWorld),!Number.isFinite(B.lengthSq())||!t.matrixWorld.elements.every(Number.isFinite)){J(),Y();return}if((G?B.distanceTo(V):0)>24+e*1200){J(),Y(),V.copy(B),H.copy(t.matrixWorld);return}G||=(V.copy(B),H.copy(t.matrixWorld),!0),K+=e,q+=(+!!n-q)*(1-Math.exp(-e*3));let r=!1;if(K>=128){let e=Math.floor(K/128)*128;K-=e,r=!0;for(let t of b)se(t,e)}for(let e of b)oe(e,K);let i=O[U];for(let t=0;t<T;t+=1){let n=de[t],r=F[t],a=r+e;if(a>=n){let o=Math.max(0,Math.min(1,(n-r)/e));t<i&&_e(t,o,e*(1-o)),F[t]=a-n}else F[t]=a}r&&ge(),Y(),V.copy(B),H.copy(t.matrixWorld)},view(e){W||h(e)},reset(){W||ve()},dispose(){if(!W){W=!0,_.removeFromParent(),g.dispose(),_.dispose();for(let e of b)ue(e);for(let e of ee)e.dispose()}}}}var P=Math.PI*2,de=1.9,F=.8,fe=6,I=[1,.55,.3],L=.62,R=1.18,z=.32,pe=3072,B=6144,V=12288,me=1024,he=8192,H=16,U=F*3,W=P/3.3*64,G=7,K=h.toFixed(3),q=e=>{let t=Math.sin(e*127.1+311.7)*43758.5453123;return t-Math.floor(t)},ge=`
  // Падающая капля: точка удара, начало падения, высота, скорость, оттенок,
  // длина и радиус записаны, когда она начала падать.
  void main() {
    vec4 spot = instanceMatrix[0];
    vec4 fall = instanceMatrix[1];
    vec2 drop = instanceMatrix[2].xy;
    float t = rainSince(spot.w);
    if (t < 0.0 || t * fall.y >= fall.x) { ${y} }
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
  }`,J=`
  uniform float trailShapeThickness;
  attribute float rainRing;
  // Два водяных круга одной капли: второй расходится на 0.12 с позже, оба
  // гаснут вместе со станцией.
  void main() {
    vec4 spot = instanceMatrix[0];
    vec4 ring = instanceMatrix[1];
    float time = rainSince(spot.w) - rainRing * 0.12;
    float age = rainSince(ring.x);
    if (time < 0.0 || time >= ring.y || age >= ${de.toFixed(2)}) { ${y} }
    float progress = time / ring.y;
    // Облик следа: начальный круг — толщина; рост круга запечён в данные.
    float size = 0.11 * trailShapeThickness + ring.z * sqrt(progress);
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
  }`,_e=`
  uniform float trailShapeThickness, trailShapeHeight;
  attribute float rainPiece;
  // Три брызги удара большой капли разлетаются через треть оборота.
  void main() {
    vec4 spot = instanceMatrix[0];
    vec2 hit = instanceMatrix[1].xy;
    float hitAge = rainSince(spot.w);
    if (hitAge < 0.0 || hitAge >= ${z.toFixed(2)}) { ${y} }
    float angle = hit.x + rainPiece * PI2 / 3.0;
    float vx = cos(angle) * hit.y, vz = sin(angle) * hit.y;
    // Облик следа: дуга брызг сжимается по высоте целиком, разлёт вбок запечён в данные.
    float h = (1.6 * hitAge - 5.0 * hitAge * hitAge) * trailShapeHeight;
    float appear = smoothstep(0.0, 1.0, hitAge / 0.025);
    vec3 centre = vec3(spot.x + vx * hitAge, spot.y + 0.11 + h, spot.z + vz * hitAge);
    vec3 direction = normalize(vec3(vx, (1.6 - 10.0 * hitAge) * trailShapeHeight, vz));
    float size = max(0.001, 0.052 * trailShapeThickness * appear * (1.0 - smoothstep(0.0, 1.0, hitAge / 0.32) * 0.6));
    vec3 scale = vec3(size, size * 3.4, size);
    // Капля длиной 1 и радиусом 1, повёрнутая по полёту: её нижняя точка не
    // ниже полудлины по вертикали плюс радиуса вбок. Брызга держится над полом
    // на TRAIL_FLOOR и на излёте ложится на эту высоту.
    float reach = scale.y * 0.5 * abs(direction.y) + scale.x * sqrt(max(0.0, 1.0 - direction.y * direction.y));
    centre.y = max(centre.y, spot.y + ${K} + reach);
    vec4 mvPosition = modelViewMatrix * vec4(centre + rainTurn(position * scale, direction), 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vRainView = -mvPosition.xyz;
    vRainNormal = normalize(normalMatrix * rainTurn(normal / scale, direction));
    vRainColour = mix(rainBlue, rainCyan, 0.42);
    vRainUv = uv;
    vRainAlpha = appear * (1.0 - smoothstep(0.0, 1.0, (hitAge - 0.2) / 0.12)) * 0.94;
    #include <logdepthbuf_vertex>
  }`,Y=`
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
    // Мокрая полоса лежит на TRAIL_FLOOR над полом, а не вровень с ним: иначе
    // пол и полоса спорят за пиксель и полоса мерцает.
    vec3 point = vec3(station.x + course.y * side, station.y + ${K}, station.z - course.x * side);
    vec4 mvPosition = modelViewMatrix * vec4(point, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vRainView = -mvPosition.xyz;
    vRainNormal = normalize(normalMatrix * vec3(0.0, 1.0, 0.0));
    vRainColour = rainColour;
    vRainUv = vec2(band.z + (second ? 0.23 : 0.0), uv.y);
    vRainAlpha = grow * fade * 0.48;
    #include <logdepthbuf_vertex>
  }`;function ve(){let e=new o,t=new Float32Array(28);for(let e=0;e<2;e+=1)for(let n=0;n<G;n+=1){let r=(e*G+n)*2;t[r]=e,t[r+1]=n/6}let n=[];for(let e=0;e<6;e+=1){let t=e,r=t+G;n.push(t,r,t+1,r,r+1,t+1)}return e.setAttribute(`position`,new l(new Float32Array(42),3)),e.setAttribute(`uv`,new l(t,2)),e.setIndex(n),e}function ye(e,t,i,a=m){let o=a.thickness,s=a.height,c=re(),l=ie(),u={value:0},f=c.cyan.clone().lerp(c.white,.12),p={rainClock:u,rainBlue:{value:c.blue},rainCyan:{value:c.cyan},rainWhite:{value:f},...l,trailShapeThickness:{value:o},trailShapeHeight:{value:s}},h=x(`Rain_Trail_Wet`,Y,{...p,rainColour:{value:c.blue.clone().lerp(c.cyan,.1)}},!0),g=x(`Rain_Trail_Streaks`,ge,p),_=x(`Rain_Trail_Ripples`,J,p),v=x(`Rain_Trail_Spray`,_e,p),y=[h,g,_,v],b=ae(i,l),w=new r;w.name=`Rain_Water_Wake`,e.add(w);let T=new n(.86,1,28);T.rotateX(-Math.PI/2);let E=S(w,ve(),h,pe,`Rain_Path_Wet_Surface`),D=S(w,te(),g,B,`Rain_Path_Falling_Streaks`),O=S(w,ne(T,2,`rainRing`),_,V,`Rain_Path_Expanding_Ripples`),k=S(w,ne(te(),3,`rainPiece`),v,me,`Rain_Path_Impact_Spray`),A=[E,D,O,k],j=new Float32Array(he*H),M=ee(1024),N=new d,G=0,K=0,ye=0,X=0,Z=0,Q=!1,be=!1,xe=0,Se=0,Ce=0,we=0,Te=0,Ee=1,De=0,Oe=0,$=(e,t,n,r,i,a,o)=>{let s=t*16+n*4;e.data[s]=r,e.data[s+1]=i,e.data[s+2]=a,e.data[s+3]=o},ke=(e,t,n,r,i,a,c)=>{for(let l=0;l<fe&&Z<he;l+=1){let u=c*9+l*1.37,d=q(u),f=((l-2.5)*.7+(d-.5)*.65)*o,p=(q(u+2.2)-.5)*1,m=q(u+.3)*.24,ee=2.1+d*2.5,h=7.5+q(u+.7)*4.5,g=l%3==0,_=Z++*H;j[_]=e+a*f+i*p,j[_+1]=t,j[_+2]=n-i*f+a*p,j[_+3]=r,j[_+4]=m,j[_+5]=m+ee/h,j[_+6]=ee*s,j[_+7]=h*s,j[_+8]=.12+d*.32,j[_+9]=(g?.4:.68+d*.5)*o,j[_+10]=(g?.085:.036+d*.018)*o,j[_+11]=.88+d*.18,j[_+12]=(.82+d*.26)*o,j[_+13]=g?u%P:-1,j[_+14]=(.7+d*.5)*o,j[_+15]=0}},Ae=()=>{let e=0;for(;e<Z;){let t=e*H,n=j[t+3],r=j[t],i=j[t+1],a=j[t+2];if(j[t+15]===0){let o=n+j[t+4];if(K<o){e+=1;continue}let s=C(D);s>=0&&(D.ends[s]=K+L,$(D,s,0,r,i,a,o),$(D,s,1,j[t+6],j[t+7],j[t+8],0),$(D,s,2,j[t+9],j[t+10],0,0)),j[t+15]=1}let o=n+j[t+5];if(K<o){e+=1;continue}let s=C(O);if(s>=0&&(O.ends[s]=K+R,$(O,s,0,r,i,a,o),$(O,s,1,n,j[t+11],j[t+12],0)),j[t+13]>=0){let e=C(k);e>=0&&(k.ends[e]=K+z,$(k,e,0,r,i,a,o),$(k,e,1,j[t+13],j[t+14],0,0))}let c=--Z;e!==c&&j.copyWithin(t,c*H,(c+1)*H)}},je=(e,t,n,r,i,a)=>{let s=ye++,c=(1.85+Math.sin(s*.37)*.23+Math.sin(s*.13)*.2)*o;if(be&&Math.hypot(e-xe,t-Se,n-Ce)<=U){let o=C(E);o>=0&&(E.ends[o]=we+de,$(E,o,0,xe,Se,Ce,we),$(E,o,1,e,t,n,r),$(E,o,2,Te,Ee,i,a),$(E,o,3,De,c,Oe,0))}be=!0,xe=e,Se=t,Ce=n,we=r,Te=i,Ee=a,De=c,Oe=s*.23%W,X+=I[G],!(X<1)&&(--X,ke(e,t,n,r,i,a,s))},Me=()=>{u.value=K;for(let e of A)ce(e);w.visible=A.some(e=>e.count>0)},Ne=()=>{for(let e of A)le(e);K=0,ye=0,X=0,Z=0,be=!1,Me()};return Ne(),{setTier(e){Q||(G=e)},step(e,n){if(Q)return;t.getWorldPosition(N);let r=M.step(N.x,N.y,N.z,e,n,F);if(M.cleared){Ne();return}if(!Number.isFinite(e)||e<=0)return;if(K+=e,K>=128){let e=Math.floor(K/128)*128;K-=e,we-=e;for(let t of A)se(t,e);for(let t=0;t<Z;t+=1)j[t*H+3]=j[t*H+3]-e}for(let e of A)oe(e,K);let i=Math.hypot(M.direction[0],M.direction[2]),a=i>1e-6?M.direction[0]/i:0,o=i>1e-6?M.direction[2]/i:1;for(let e=0;e<r;e+=1)je(M.positions[e*3],M.positions[e*3+1],M.positions[e*3+2],K-M.elapsed[e],a,o);Ae(),Me()},view(e){Q||b(e)},reset(){Q||(M.reset(),Ne())},dispose(){if(!Q){Q=!0;for(let e of A)ue(e);for(let e of y)e.dispose();w.removeFromParent()}}}}function X(e,t,n,r=m){return ye(e,t,n.character,r)}function Z(e,t,n){return N(t,n.character)}export{Z as createRainAuraEffect,X as createRainTrailEffect};