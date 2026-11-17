//# allFunctionsCalledOnLoad
import{$ as e,Ut as t,Z as n,wt as r}from"./three.core-DVTiNhEy.js";import{n as i,r as a,t as o}from"./storm-lightning-L19WqlLZ.js";var s=Math.PI*2,c=120,l=[80,56,36],u=[96,64,40],d=[18,12,8],f=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  uniform float stormClock, stormMotion;
  // Phase, pulse period, orbital speed, opacity.
  attribute vec4 stormCycle;
  // Radius, height, vertical sway, initial angle.
  attribute vec4 stormOrbit;
  // Radial sway, sway speed, turn speed, orbit direction.
  attribute vec4 stormDrift;
  // Initial XYZ turn and halo width.
  attribute vec4 stormTurn;
  varying vec2 vStormUv;
  varying float vStormFade, vStormAge, vStormSeed, vStormFlash, vStormConnected;

  ${o}

  vec3 stormRotate(vec3 p, vec3 angle) {
    p.yz = mat2(cos(angle.x), -sin(angle.x), sin(angle.x), cos(angle.x)) * p.yz;
    p.xz = mat2(cos(angle.y), -sin(angle.y), sin(angle.y), cos(angle.y)) * p.xz;
    p.xy = mat2(cos(angle.z), -sin(angle.z), sin(angle.z), cos(angle.z)) * p.xy;
    return p;
  }

  vec3 stormArcOffset(vec3 path, float arcLength, vec3 turn) {
    vec3 offset = stormRotate(path, turn) * arcLength;
    offset.z -= stormMotion * path.y * arcLength * 0.55;
    return offset;
  }

  void main() {
    float age = fract(stormClock / stormCycle.y + stormCycle.x);
    float seed = stormOrbit.w;
    float sway = stormClock * stormDrift.y + seed;
    float angle = seed + stormClock * stormCycle.z * stormDrift.w + sin(sway) * 0.12;
    float radius = stormOrbit.x + sin(sway) * stormDrift.x;
    vec3 centre = vec3(cos(angle) * radius,
      stormOrbit.y + sin(sway + 1.7) * stormOrbit.z,
      sin(angle) * radius - stormMotion * (0.65 + stormCycle.x * 0.75));
    float arcLength = length(instanceMatrix[1].xyz);
    vec3 turn = stormTurn.xyz + vec3(sin(sway) * 0.12,
      stormClock * stormDrift.z, sin(sway + 1.1) * 0.16);
    float shape = mod(floor(stormClock * 12.0 + seed), 1440.0);
    // Узел и соседние точки касательной считаются одним проходом по ветви.
    vec3 path, pathBefore, pathAfter;
    stormBoltFrame(seed, shape, path, pathBefore, pathAfter);
    vec3 point = centre + stormArcOffset(path, arcLength, turn);
    vec4 viewPoint = modelViewMatrix * vec4(point, 1.0);
    vec4 viewBefore = modelViewMatrix * vec4(centre + stormArcOffset(pathBefore, arcLength, turn), 1.0);
    vec4 viewAfter = modelViewMatrix * vec4(centre + stormArcOffset(pathAfter, arcLength, turn), 1.0);
    vec4 projectedBefore = projectionMatrix * viewBefore;
    vec4 projectedAfter = projectionMatrix * viewAfter;
    vec2 tangent = (projectedAfter.xy / max(abs(projectedAfter.w), 0.0001)
      - projectedBefore.xy / max(abs(projectedBefore.w), 0.0001))
      / vec2(projectionMatrix[0][0], projectionMatrix[1][1]);
    vec2 side = dot(tangent, tangent) > 0.00000001
      ? vec2(-tangent.y, tangent.x) / max(length(tangent), 0.0001) : vec2(1.0, 0.0);
    vec3 axisX = modelViewMatrix[0].xyz;
    vec3 axisY = modelViewMatrix[1].xyz;
    vec3 axisZ = modelViewMatrix[2].xyz;
    float modelScale = max(length(axisX), max(length(axisY), length(axisZ)));
    float width = stormTurn.w * modelScale;
    viewPoint.xy += side * position.x * width * stormBranch.w;
    gl_Position = projectionMatrix * viewPoint;
    #include <logdepthbuf_vertex>

    // Запас всех ветвей и экранной ширины гасит целую дугу перед лицом.
    vec3 padding = (abs(stormRotate(vec3(0.65, 0.0, 0.0), turn))
      + abs(stormRotate(vec3(0.0, 0.60, 0.0), turn))
      + abs(stormRotate(vec3(0.0, 0.0, 0.35), turn))) * arcLength;
    padding.z += stormMotion * arcLength * 0.33;
    vec3 rowX = cross(axisY, axisZ), rowY = cross(axisZ, axisX), rowZ = cross(axisX, axisY);
    float determinant = dot(axisX, rowX);
    float divisor = (determinant < 0.0 ? -1.0 : 1.0) * max(abs(determinant), 0.000001);
    vec3 right = vec3(rowX.x, rowY.x, rowZ.x) / divisor;
    vec3 up = vec3(rowX.y, rowY.y, rowZ.y) / divisor;
    padding += 0.5 * width * (abs(right) + abs(up));
    float face = smoothstep(0.15, 0.65, centre.y + padding.y)
      * smoothstep(-0.5, 0.05, centre.z + padding.z)
      * (1.0 - smoothstep(1.05, 1.45, max(0.0, abs(centre.x) - padding.x)));
    float seconds = age * stormCycle.y;
    float primary = smoothstep(0.0, 0.012, seconds) * (1.0 - smoothstep(0.16, 0.23, seconds));
    float echo = 0.72 * smoothstep(0.29, 0.305, seconds) * (1.0 - smoothstep(0.37, 0.43, seconds));
    float flash = max(primary, echo) * (0.78 + 0.22 * step(0.25, fract(stormClock * 18.0 + seed)));
    vStormUv = uv;
    vStormFade = stormCycle.w * flash * (1.0 - face);
    vStormAge = seconds;
    vStormSeed = seed;
    vStormFlash = flash;
    vStormConnected = 0.0;
  }`,p=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  uniform float stormClock, stormMotion, stormLayer;
  attribute vec4 stormCycle, stormOrbit, stormDrift;
  varying vec2 vStormUv;
  varying float vStormFade, vStormAge, vStormSeed, vStormFlash;

  void main() {
    float age = fract(stormClock / stormCycle.y + stormCycle.x);
    float seed = stormOrbit.w;
    float sway = stormClock * stormDrift.y + seed;
    float angle = seed + stormClock * stormCycle.z * stormDrift.w + sin(sway) * 0.18;
    float radius = stormOrbit.x + sin(sway) * stormDrift.x;
    vec3 centre = vec3(cos(angle) * radius,
      stormOrbit.y + sin(sway + 1.7) * stormOrbit.z + stormLayer * age * 0.45,
      sin(angle) * radius - stormMotion * (0.40 + age * 0.75));
    vec3 axisX = modelViewMatrix[0].xyz;
    vec3 axisY = modelViewMatrix[1].xyz;
    vec3 axisZ = modelViewMatrix[2].xyz;
    float modelScale = max(length(axisX), max(length(axisY), length(axisZ)));
    vec2 size = vec2(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz)) * modelScale;
    float roll = seed + stormClock * stormDrift.z;
    float cosine = cos(roll), sine = sin(roll);
    vec2 offset = position.xy * size;
    offset = vec2(cosine * offset.x - sine * offset.y, sine * offset.x + cosine * offset.y);
    vec4 viewPoint = modelViewMatrix * vec4(centre, 1.0);
    viewPoint.xy += offset;
    gl_Position = projectionMatrix * viewPoint;
    #include <logdepthbuf_vertex>

    vec3 rowX = cross(axisY, axisZ), rowY = cross(axisZ, axisX), rowZ = cross(axisX, axisY);
    float determinant = dot(axisX, rowX);
    float divisor = (determinant < 0.0 ? -1.0 : 1.0) * max(abs(determinant), 0.000001);
    vec3 right = vec3(rowX.x, rowY.x, rowZ.x) / divisor;
    vec3 up = vec3(rowX.y, rowY.y, rowZ.y) / divisor;
    vec3 padding = 0.5 * (size.x * abs(right * cosine + up * sine)
      + size.y * abs(up * cosine - right * sine));
    float face = smoothstep(0.15, 0.65, centre.y + padding.y)
      * smoothstep(-0.5, 0.05, centre.z + padding.z)
      * (1.0 - smoothstep(1.05, 1.45, max(0.0, abs(centre.x) - padding.x)));
    float envelope = smoothstep(0.0, 0.06, age) * (1.0 - smoothstep(0.88, 1.0, age));
    float spark = smoothstep(0.18, 0.195, age) * (1.0 - smoothstep(0.24, 0.285, age));
    float pulseSeconds = fract(stormClock / 1.2 + stormCycle.x) * 1.2;
    float primary = smoothstep(0.0, 0.012, pulseSeconds) * (1.0 - smoothstep(0.16, 0.23, pulseSeconds));
    float echo = 0.72 * smoothstep(0.29, 0.305, pulseSeconds) * (1.0 - smoothstep(0.37, 0.43, pulseSeconds));
    float flash = max(primary, echo);
    vStormUv = uv;
    vStormFade = stormCycle.w * envelope * mix(1.0, spark, stormLayer) * (1.0 - face);
    vStormAge = age * stormCycle.y;
    vStormSeed = seed;
    vStormFlash = flash;
  }`;function m(o){let m={value:0},h={value:0},g={stormClock:m,stormMotion:h},_=new r,v=i(),y=new n(new Float32Array(l[0]*4),4),b=new n(new Float32Array(l[0]*4),4),x=new n(new Float32Array(l[0]*4),4),S=new n(new Float32Array(l[0]*4),4);v.setAttribute(`stormCycle`,y),v.setAttribute(`stormOrbit`,b),v.setAttribute(`stormDrift`,x),v.setAttribute(`stormTurn`,S);let C=a(`Storm_Aura_Bolts`,f,g,`bolt`,`white`);C.uniforms.stormBlue.value.copy(C.uniforms.stormWhite.value);let w=new e(v,C,l[0]);w.name=C.name,w.frustumCulled=!1,w.castShadow=w.receiveShadow=!1,w.renderOrder=1,o.add(w);let T=new t(1,1),E=new n(new Float32Array(d[0]*4),4),D=new n(new Float32Array(d[0]*4),4),O=new n(new Float32Array(d[0]*4),4);T.setAttribute(`stormCycle`,E),T.setAttribute(`stormOrbit`,D),T.setAttribute(`stormDrift`,O);let k=a(`Storm_Aura_Clouds`,p,{...g,stormLayer:{value:0}},`cloud`),A=new e(T,k,d[0]);A.name=k.name,A.frustumCulled=!1,A.castShadow=A.receiveShadow=!1,o.add(A);let j=new t(1,1),M=new n(new Float32Array(u[0]*4),4),N=new n(new Float32Array(u[0]*4),4),P=new n(new Float32Array(u[0]*4),4);j.setAttribute(`stormCycle`,M),j.setAttribute(`stormOrbit`,N),j.setAttribute(`stormDrift`,P);let F=a(`Storm_Aura_Sparks`,p,{...g,stormLayer:{value:1}},`spark`),I=new e(j,F,u[0]);I.name=F.name,I.frustumCulled=!1,I.castShadow=I.receiveShadow=!1,I.renderOrder=2,o.add(I);let L=1706822167,R=1138859397,z=313037759,B=()=>(L^=L<<13,L^=L>>>17,L^=L<<5,(L>>>0)/4294967296),V=()=>(R^=R<<13,R^=R>>>17,R^=R<<5,(R>>>0)/4294967296),H=()=>(z^=z<<13,z^=z>>>17,z^=z<<5,(z>>>0)/4294967296);for(let e=0;e<l[0];e+=1){let t=e%3,n=e<18?(Math.floor(e/3)/6+t*.117)%1:(e*.61803398875+B()*.035)%1,r=2+Math.floor(B()*4),i=5+Math.floor(B()*7),a=1+Math.floor(B()*4),o=t===0?1.15+B()*.4:t===1?1.05+B()*.25:1.4+B()*.55;_.makeScale(o,o,o),w.setMatrixAt(e,_),y.setXYZW(e,n,e<18?1.2:[.8,1,1.2][e%3],s*r/c,.93+B()*.07),b.setXYZW(e,2.45+B()*.65,[-1.95,-1.1,.35][t]+B()*.12,.05+B()*.08,e*.61803398875%1*s),x.setXYZW(e,.06+B()*.12,s*i/c,s*a/c*(B()<.5?-1:1),B()<.5?-1:1),S.setXYZW(e,-.85+B()*1.7,B()*s,-1.35+B()*2.7,.12+B()*.06)}w.instanceMatrix.needsUpdate=!0,y.needsUpdate=b.needsUpdate=x.needsUpdate=S.needsUpdate=!0;for(let e=0;e<d[0];e+=1){let t=(e*.61803398875+V()*.05)%1,n=.7+V()*.55;_.makeScale(n,n*(.52+V()*.2),1),A.setMatrixAt(e,_),E.setXYZW(e,t,[3,4,5][e%3],s*(2+Math.floor(V()*4))/c,.3+V()*.14),D.setXYZW(e,2.1+V()*.7,-1.75+V()*2.2,.08+V()*.14,V()*s),O.setXYZW(e,.05+V()*.1,s*(4+Math.floor(V()*5))/c,s*(1+Math.floor(V()*4))/c*(V()<.5?-1:1),V()<.5?-1:1)}A.instanceMatrix.needsUpdate=!0,E.needsUpdate=D.needsUpdate=O.needsUpdate=!0;for(let e=0;e<u[0];e+=1){let t=(e*.61803398875+H()*.05)%1,n=.08+H()*.07;_.makeScale(n,n*(1+H()*.8),1),I.setMatrixAt(e,_),M.setXYZW(e,t,[3,4,5][e%3],s*(5+Math.floor(H()*8))/c,.8+H()*.2),N.setXYZW(e,1.9+H()*1,-2.1+H()*3.25,.08+H()*.18,H()*s),P.setXYZW(e,.06+H()*.16,s*(10+Math.floor(H()*11))/c,s*(5+Math.floor(H()*8))/c*(H()<.5?-1:1),H()<.5?-1:1)}I.instanceMatrix.needsUpdate=!0,M.needsUpdate=N.needsUpdate=P.needsUpdate=!0;let U=0,W=0,G=0,K=!1;return{step(e,t){if(K||!Number.isFinite(e)||e<=0)return;let n=Math.min(e,.1);W=(W+n)%c,G+=(+!!t-G)*(1-Math.exp(-n/.25)),m.value=W,h.value=G},setTier(e){K||e===U||e!==0&&e!==1&&e!==2||(U=e,w.count=l[U],A.count=d[U],I.count=u[U])},reset(){K||(W=G=0,m.value=h.value=0)},dispose(){K||(K=!0,w.removeFromParent(),v.dispose(),C.dispose(),w.dispose(),A.removeFromParent(),T.dispose(),k.dispose(),A.dispose(),I.removeFromParent(),j.dispose(),F.dispose(),I.dispose())}}}export{m as createStormAura};