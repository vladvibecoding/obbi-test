//# allFunctionsCalledOnLoad
import{$ as e,F as t,Jt as n,P as r,Ut as i,Z as a,wr as o,wt as s}from"./three.core-DVTiNhEy.js";import{n as c,r as ee,t as te}from"./trail-shape-BsaeWHuc.js";import{t as l}from"./trail-slots-BYU9mmsR.js";import{n as ne,r as re,t as u}from"./storm-lightning-L19WqlLZ.js";var d=Math.PI*2,f=[8,5,3],ie=[.8,1,1.2],ae=.5,p=32768,m=384,h=1.65,oe=.65,se=1.2,ce=2,le=.72,ue=.6,de=.3,fe=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  uniform float stormClock, stormStyleClock;
  attribute vec2 stormBornLife;
  // Seed, pulse period, width, opacity.
  attribute vec4 stormProfile;
  varying vec2 vStormUv;
  varying float vStormFade, vStormAge, vStormSeed, vStormFlash, vStormConnected;
  ${u}

  vec3 stormTrailPoint(vec3 path) {
    return (instanceMatrix * vec4(path, 1.0)).xyz;
  }

  void main() {
    vStormUv = uv; vStormAge = 0.0; vStormSeed = stormProfile.x;
    vStormFade = vStormFlash = vStormConnected = 0.0;
    float age = max(0.0, stormClock - stormBornLife.x);
    float shape = mod(floor(stormStyleClock * 12.0 + stormProfile.x), 1440.0);
    float seconds = mod(age + stormProfile.x / 6.28318530718 * stormProfile.y, stormProfile.y);
    float primary = smoothstep(0.0, 0.012, seconds) * (1.0 - smoothstep(0.16, 0.23, seconds));
    float echo = 0.72 * smoothstep(0.29, 0.305, seconds) * (1.0 - smoothstep(0.37, 0.43, seconds));
    float flash = max(primary, echo)
      * (0.78 + 0.22 * step(0.25, fract(stormStyleClock * 18.0 + stormProfile.x)));
    float fade = stormProfile.w * flash
      * (1.0 - smoothstep(0.35, 1.0, clamp(age / stormBornLife.y, 0.0, 1.0)));
    // Невидимый импульс не вычисляет пространственные ветви и их касательную.
    if (fade < 0.003) {
      gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
      #include <logdepthbuf_vertex>
      return;
    }
    // Узел и соседние точки касательной считаются одним проходом по ветви.
    vec3 path, pathBefore, pathAfter;
    stormBoltFrame(stormProfile.x, shape, path, pathBefore, pathAfter);
    vec3 point = stormTrailPoint(path);
    vec3 beforePoint = stormTrailPoint(pathBefore);
    vec3 afterPoint = stormTrailPoint(pathAfter);
    vec4 viewPoint = modelViewMatrix * vec4(point, 1.0);
    // Точка проходит матрицы по очереди: произведение двух матриц в каждой вершине
    // удлиняет программу, а положение то же.
    vec4 before = projectionMatrix * (modelViewMatrix * vec4(beforePoint, 1.0));
    vec4 after = projectionMatrix * (modelViewMatrix * vec4(afterPoint, 1.0));
    vec2 tangent = (after.xy / max(abs(after.w), 0.0001) - before.xy / max(abs(before.w), 0.0001))
      / vec2(projectionMatrix[0][0], projectionMatrix[1][1]);
    vec2 side = dot(tangent, tangent) > 0.000000000001
      ? normalize(vec2(-tangent.y, tangent.x)) : vec2(1.0, 0.0);
    float width = stormProfile.z * stormBranch.w;
    viewPoint.xy += side * position.x * width * length(modelViewMatrix[0].xyz);
    gl_Position = projectionMatrix * viewPoint;
    #include <logdepthbuf_vertex>
    vStormFade = fade; vStormFlash = flash; vStormAge = seconds;
  }`,pe=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  uniform float stormClock;
  // Высота следа: взлёт искры записан с ней, здесь она множит и тяжесть.
  uniform float trailShapeHeight;
  attribute vec2 stormBornLife;
  attribute vec3 stormVelocity;
  attribute vec4 stormProfile;
  varying vec2 vStormUv;
  varying float vStormFade, vStormAge, vStormSeed, vStormFlash;
  void main() {
    float age = max(0.0, stormClock - stormBornLife.x);
    float k = clamp(age / stormBornLife.y, 0.0, 1.0);
    vec3 root = instanceMatrix[3].xyz;
    root += stormVelocity * age;
    root.y -= age * age * 0.08 * trailShapeHeight;
    vec4 point = modelViewMatrix * vec4(root, 1.0);
    vec2 size = vec2(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz));
    point.xy += position.xy * size * (1.0 - k * 0.35) * length(modelViewMatrix[0].xyz);
    gl_Position = projectionMatrix * point;
    #include <logdepthbuf_vertex>
    vStormUv = uv; vStormAge = age; vStormSeed = stormProfile.x; vStormFlash = 0.0;
    vStormFade = stormProfile.y * smoothstep(0.0, 0.02, k)
      * (1.0 - smoothstep(0.10, 1.0, k));
  }`;function me(u,me,he,ge=c){let g=ge.thickness,_=ge.height,v=new o,y=new o,b=ee(1024),x=new o(0,0,1),_e=new o(0,0,1),S=new s,ve=new n,ye=new t,C=new o,be=new o,w={stormClock:{value:0},stormStyleClock:{value:0}},T=re(`Storm_Trail_Bolts`,fe,w,`bolt`,`white`);T.uniforms.stormBlue.value.copy(T.uniforms.stormWhite.value);let E=ne(),D=new a(new Float32Array(p*2),2).setUsage(r),O=new a(new Float32Array(p*4),4).setUsage(r);E.setAttribute(`stormBornLife`,D),E.setAttribute(`stormProfile`,O);let k=new e(E,T,p);k.name=T.name,k.renderOrder=2,k.instanceMatrix.setUsage(r),k.count=0,k.visible=!1,k.frustumCulled=!1,k.castShadow=k.receiveShadow=!1,u.add(k);let A=[k.instanceMatrix,D,O],j=new Float64Array(p),M=re(`Storm_Trail_Sparks`,pe,{stormClock:w.stormClock,trailShapeHeight:{value:_}},`spark`),N=new i(1,1),P=new a(new Float32Array(m*2),2).setUsage(r),F=new a(new Float32Array(m*3),3).setUsage(r),I=new a(new Float32Array(m*4),4).setUsage(r);N.setAttribute(`stormBornLife`,P),N.setAttribute(`stormVelocity`,F),N.setAttribute(`stormProfile`,I);let L=new e(N,M,m);L.name=M.name,L.renderOrder=3,L.instanceMatrix.setUsage(r),L.count=0,L.visible=!1,L.frustumCulled=!1,L.castShadow=L.receiveShadow=!1,u.add(L);let xe=[L.instanceMatrix,P,F,I],R=new Float64Array(m),Se=0,z=0,B=0,V=!1,H=0,U=0,W=0,G=-1,K=-1,q=!1,J=l(),Y=l(),Ce=1687638817,we=1384791831,X=Ce,Z=we,Q=()=>(X^=X<<13,X^=X>>>17,X^=X<<5,(X>>>0)/4294967296),$=()=>(Z^=Z<<13,Z^=Z>>>17,Z^=Z<<5,(Z>>>0)/4294967296),Te=e=>{let t=x.z,n=-x.x;for(let r=0;r<f[Se]&&U!==p;r+=1){let i=U,a=Q()*2-1,o=Q()*d,s=Math.cbrt(Q()),c=Math.sqrt(Math.max(0,1-a*a)),ee=Math.cos(o)*c*s*1.3*g,l=se+Math.sin(o)*c*s*1.4;C.set(y.x+t*ee-x.x*l,y.y+oe*_+a*s*.2*_,y.z+n*ee-x.z*l);let ne=H%3,re=ne===0?1.15+Q()*.4:ne===1?1.05+Q()*.25:1.4+Q()*.55,u=ce;ye.set(-.85+Q()*1.7,Q()*d,-1.35+Q()*2.7),ve.setFromEuler(ye),be.setScalar(re*g),S.compose(C,ve,be);let f=S.elements;f[1]*=_,f[5]*=_,f[9]*=_;let ae=Q()*d,p=(.12+Q()*.06)*g,m=Math.abs(f[1])*le+Math.abs(f[5])*ue+Math.abs(f[9])*de+p/2;f[13]=Math.max(f[13],y.y-h*_+te+m);let fe=.93+Q()*.07;z-e>=u||(U+=1,k.setMatrixAt(i,S),j[i]=e,D.setXY(i,e,u),O.setXYZW(i,ae,ie[r%3],p,fe),G<0&&(G=i))}if(H%3==0&&W<m){let r=W,i=($()-.5)*1.6*g,a=.4+$()*1.4;C.set(y.x+t*i-x.x*a,y.y+oe*_+($()-.5)*.7*_,y.z+n*i-x.z*a);let o=(.08+$()*.07)*g,s=o*(1+$()*.8);C.y=Math.max(C.y,y.y-h*_+te+Math.hypot(o,s)/2),S.makeScale(o,s,1),S.setPosition(C),L.setMatrixAt(r,S),R[r]=e,P.setXY(r,e,.35+$()*.15),F.setXYZ(r,t*($()-.5)*.35*g-x.x*.12,.06*_+$()*.12*_,n*($()-.5)*.35*g-x.z*.12),I.setXYZW(r,$()*d,.65+$()*.25,0,0),z-e<P.getY(r)&&(W+=1,K<0&&(K=r))}H+=1},Ee=()=>{let e=0;for(;e<U;){if(z-j[e]<D.getY(e)){e+=1;continue}let t=--U;if(e!==t){j[e]=j[t];for(let n of A)n.array.copyWithin(e*n.itemSize,t*n.itemSize,(t+1)*n.itemSize);J.moved(e)}}for(e=0;e<W;){if(z-R[e]<P.getY(e)){e+=1;continue}let t=--W;if(e!==t){R[e]=R[t];for(let n of xe)n.array.copyWithin(e*n.itemSize,t*n.itemSize,(t+1)*n.itemSize);Y.moved(e)}}},De=e=>{z=B=H=0,q=!1,U=W=0,w.stormClock.value=w.stormStyleClock.value=0,k.count=L.count=0,k.visible=L.visible=!1,J.clear(),Y.clear(),G=K=-1;for(let e of A)e.clearUpdateRanges();for(let e of xe)e.clearUpdateRanges();e&&(X=Ce,Z=we,x.set(0,0,1))},Oe=()=>{w.stormClock.value=z,w.stormStyleClock.value=B,k.count=U,k.visible=k.count>0,L.count=W,L.visible=W>0;for(let e of A)e===D&&q&&U>0?(e.addUpdateRange(0,U*2),e.needsUpdate=!0):J.upload(e,G,U)&&(e.needsUpdate=!0);for(let e of xe)e===P&&q&&W>0?(e.addUpdateRange(0,W*2),e.needsUpdate=!0):Y.upload(e,K,W)&&(e.needsUpdate=!0);q=!1,J.clear(),Y.clear(),G=K=-1};return{setTier(e){if(e!==0&&e!==1&&e!==2)throw RangeError(`Invalid storm trail tier`);V||(Se=e)},step(e,t){if(V||!Number.isFinite(e)||e<=0)return;me.getWorldPosition(v),v.y+=h*_;let n=b.step(v.x,v.y,v.z,e,t,ae);if(b.cleared){De(!1);return}let r=Math.hypot(b.direction[0],b.direction[2]);n>0&&r>1e-5&&(_e.set(b.direction[0]/r,0,b.direction[2]/r),x.lerp(_e,1-Math.exp(-e*12)),x.lengthSq()<1e-10?x.copy(_e):x.normalize()),z+=e,B=(B+e)%120,Ee();for(let e=0;e<n;e+=1){let t=e*3;y.set(b.positions[t],b.positions[t+1],b.positions[t+2]),Te(z-b.elapsed[e])}if(z>=128){let e=Math.floor(z/128)*128;z-=e;for(let t=0;t<U;t+=1)j[t]=j[t]-e,D.setX(t,j[t]);for(let t=0;t<W;t+=1)R[t]=R[t]-e,P.setX(t,R[t]);q=!0}Oe()},reset(){V||(b.reset(),De(!0))},dispose(){V||(V=!0,k.removeFromParent(),L.removeFromParent(),E.dispose(),T.dispose(),k.dispose(),N.dispose(),M.dispose(),L.dispose())}}}export{me as createStormTrail};