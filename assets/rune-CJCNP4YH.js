//# allFunctionsCalledOnLoad
import{$ as e,Cr as t,F as n,Jt as r,K as i,P as a,R as o,Rt as s,St as c,Xn as l,Z as u,Zn as d,d as f,qn as p,u as m,ur as h,v as g,wr as _,wt as ee}from"./three.core-DVTiNhEy.js";import{o as v}from"./src-BI6MMqKu.js";import{n as y,r as b,t as x}from"./trail-shape-BsaeWHuc.js";import{t as S}from"./trail-slots-BYU9mmsR.js";import{t as C}from"./BufferGeometryUtils-pFWRFHdl.js";var w=[[[0,-.65,0,.65],[0,.08,-.43,.48],[0,.08,.43,.48],[-.26,-.38,.26,-.38]],[[0,-.67,0,.67],[0,.5,.42,.15],[.42,.15,0,-.2],[0,.02,-.38,-.3]],[[-.35,-.54,0,-.22],[0,-.22,.35,-.54],[0,-.22,0,.62],[-.4,.25,0,.62],[0,.62,.4,.25]],[[-.4,.45,.4,.45],[.4,.45,-.25,-.42],[-.25,-.42,.35,-.42],[-.13,.1,.28,.1],[.05,.45,.05,.7]],[[-.4,-.35,0,-.62],[0,-.62,.4,-.35],[-.4,-.35,-.4,.4],[.4,-.35,.4,.4],[-.4,.4,0,.65],[0,.65,.4,.4],[0,-.28,0,.3]],[[-.32,-.6,-.32,.6],[-.32,.6,.35,.3],[.35,.3,-.1,-.05],[-.1,-.05,.32,-.42],[.32,-.42,.32,-.65]]],T=w.length,E=.085,D=.12;function O(e){let t=w[e%T],n=t.map(([e,n,r,i],a)=>{let s=Math.hypot(r-e,i-n),l=.046,u=new d;u.moveTo(-.046,-s/2),u.lineTo(l,-s/2),u.lineTo(l,s/2),u.lineTo(-.046,s/2),u.closePath();let f=new o(u,{depth:.055,bevelEnabled:!0,bevelSize:.014,bevelThickness:.012,bevelSegments:1,steps:1,curveSegments:1}),p=f.getAttribute(`position`),h=new Float32Array(p.count);for(let e=0;e<h.length;e+=1){let n=c.clamp(p.getY(e)/s+.5,0,1);h[e]=(a+n)/t.length}return f.setAttribute(`runeStroke`,new m(h,1)),f.deleteAttribute(`uv`),f.translate(0,0,-.0275),f.rotateZ(Math.atan2(i-n,r-e)-Math.PI/2),f.translate((e+r)/2,(n+i)/2,0),f}),r=C(n,!1);for(let e of n)e.dispose();r.computeBoundingBox();let i=r.getIndex();return{position:r.getAttribute(`position`).array,normal:r.getAttribute(`normal`).array,stroke:r.getAttribute(`runeStroke`).array,index:i===null?null:i.array,centre:r.boundingBox.getCenter(new _),low:r.boundingBox.min.clone()}}var k=null,A=0;function j(){return k??=Array.from({length:T},(e,t)=>O(t)),A+=1,k}function te(){--A,A===0&&(k=null)}function ne(e){let t=new f;return t.setAttribute(`position`,new m(e.position,3)),t.setAttribute(`normal`,new m(e.normal,3)),t.setAttribute(`runeStroke`,new m(e.stroke,1)),e.index!==null&&t.setIndex(new m(e.index,1)),t}function M(e,t){let n=new u(new Float32Array(t),1).setUsage(a),r=new u(new Float32Array(t).fill(1),1).setUsage(a),i=new u(new Float32Array(t),1).setUsage(a);return e.setAttribute(`runeAlpha`,n),e.setAttribute(`runeReveal`,r),e.setAttribute(`runeErase`,i),{alpha:n,reveal:r,erase:i}}var N=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  attribute float runeStroke, runeAlpha, runeReveal, runeErase;
  varying vec3 vRuneView, vRuneNormal, vRuneColour;
  varying vec4 vRuneState;
  void main() {
    #include <beginnormal_vertex>
    #include <defaultnormal_vertex>
    vRuneNormal = normalize(transformedNormal);
    vec3 transformed = position;
    #include <project_vertex>
    vRuneView = -mvPosition.xyz;
    vRuneColour = vec3(1.0);
    #ifdef USE_INSTANCING_COLOR
      vRuneColour = instanceColor;
    #endif
    vRuneState = vec4(runeStroke, runeAlpha, runeReveal, runeErase);
    #include <logdepthbuf_vertex>
  }`,P=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  uniform float runeClock;
  // Облик следа: толщина — размер и разлёт вбок, высота — подъём от земли.
  uniform float trailShapeThickness, trailShapeHeight;
  uniform vec3 runeViolet, runeLilac, runeWhite;
  attribute float runeStroke;
  // Рождение и неизменные с него данные: у знака тон и низ рамки начертания
  // (y, z), у осколка направление разлёта и номер.
  attribute vec4 runeTrail;
  varying vec3 vRuneView, vRuneNormal, vRuneColour;
  varying vec4 vRuneState;

  float runeEase(float x) { float t = clamp(x, 0.0, 1.0); return t * t * (3.0 - 2.0 * t); }
  mat3 runeYaw(float a) { float c = cos(a), s = sin(a); return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c); }
  mat3 runePitch(float a) { float c = cos(a), s = sin(a); return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c); }

  void main() {
    float age = max(0.0, runeClock - runeTrail.x);
    float shown = runeEase(age / 0.11) * (1.0 - runeEase((age - 1.3) / 0.55));
    vec3 local, bent, rise = vec3(0.0);
    float alpha, reveal = 1.0, erase = 0.0;
    #if defined(RUNE_GLYPH)
      // Знак лежит верхом по ходу бега; дописанный, он отрывается от земли
      // и встаёт лицом назад, к догоняющей камере.
      reveal = runeEase(age / 0.32);
      erase = runeEase((age - 1.05) / 0.8);
      float lift = runeEase((age - 0.4) / 1.0);
      mat3 turn = runePitch(-PI * 0.5 + lift * 1.15);
      float grown = 0.95 + runeEase(age / 0.24) * 0.05;
      local = turn * position * grown;
      bent = turn * normal;
      rise.y = lift * 0.95 * trailShapeHeight;
      // Встающий знак не уходит под пол: самая низкая точка его рамки после
      // наклона держится над ступнями. Наклон θ переводит низ рамки в
      // sin θ · y + cos θ · z.
      float tilt = lift * 1.15;
      float low = (sin(tilt) * runeTrail.z + cos(tilt) * runeTrail.w) * grown * length(instanceMatrix[0].xyz);
      rise.y = max(rise.y, ${x.toFixed(3)} - ${E.toFixed(3)} * trailShapeHeight - low);
      alpha = shown * 0.96;
      vRuneColour = mix(mix(runeViolet, runeLilac, runeTrail.y), runeWhite, 0.05 + (1.0 - reveal) * 0.12);
    #elif defined(RUNE_RING)
      mat3 turn = runeYaw(age * 0.12);
      float base = length(instanceMatrix[0].xyz);
      local = turn * position * (1.0 + runeEase(age / 0.4) * 0.1 * trailShapeThickness / base);
      bent = turn * normal;
      alpha = shown * 0.36 * runeEase(age / 0.2);
      vRuneColour = mix(runeViolet, runeLilac, runeTrail.y);
    #else
      // Осколки стёртых штрихов разлетаются только во второй половине жизни знака.
      float dissolve = (age - 0.95) / 0.9;
      alpha = runeEase(dissolve / 0.16) * (1.0 - runeEase(dissolve)) * 0.66;
      vec3 size = vec3(0.033, 0.11 + runeTrail.w * 0.025, 0.028) * max(0.01, 1.0 - dissolve) * trailShapeThickness;
      mat3 turn = runeYaw(dissolve * 0.8);
      local = turn * (position * size);
      bent = turn * (normal / size);
      float drift = (0.36 + dissolve * 0.58) * trailShapeThickness;
      rise = vec3(runeTrail.y * drift, dissolve * (0.4 + runeTrail.w * 0.08) * trailShapeHeight, runeTrail.z * drift);
      // Нижняя вершина осколка на size.y ниже центра: осколок не уходит под пол.
      rise.y = max(rise.y, ${x.toFixed(3)} + size.y - ${D.toFixed(3)} * trailShapeHeight);
      vRuneColour = mix(runeViolet, runeWhite, 0.28);
    #endif
    vRuneState = vec4(runeStroke, alpha, reveal, erase);
    vRuneView = vec3(0.0); vRuneNormal = vec3(0.0, 1.0, 0.0);
    if (alpha < 0.004) {
      // Невидимый экземпляр уходит за край кадра: его треугольники отсекаются
      // до растеризации и не тратят заливку.
      gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    } else {
      vec4 world = instanceMatrix * vec4(local, 1.0);
      world.xyz += rise;
      vec4 mvPosition = modelViewMatrix * world;
      gl_Position = projectionMatrix * mvPosition;
      vRuneView = -mvPosition.xyz;
      vRuneNormal = normalize(normalMatrix * (mat3(instanceMatrix) * bent));
    }
    #include <logdepthbuf_vertex>
  }`,F=`
  #include <common>
  #include <logdepthbuf_pars_fragment>
  uniform vec3 runeWhite;
  #ifdef RUNE_FACE
    uniform vec3 runeFaceCentre;
    uniform vec2 runeFaceRadius;
    uniform float runeFaceEnabled;
  #endif
  varying vec3 vRuneView, vRuneNormal, vRuneColour;
  varying vec4 vRuneState;
  void main() {
    float ink = (1.0 - smoothstep(vRuneState.z, vRuneState.z + 0.035, vRuneState.x))
      * smoothstep(vRuneState.w - 0.05, vRuneState.w, vRuneState.x);
    float alpha = ink * vRuneState.y;
    if (alpha < 0.004) discard;
    #ifdef RUNE_FACE
      if (runeFaceEnabled > 0.5 && vRuneView.z < runeFaceCentre.z + runeFaceRadius.y) {
        vec2 offset = vRuneView.xy / max(vRuneView.z, 0.001)
          - runeFaceCentre.xy / max(runeFaceCentre.z, 0.001);
        float offAxis = sqrt(1.0 + dot(runeFaceCentre.xy, runeFaceCentre.xy)
          / max(runeFaceCentre.z * runeFaceCentre.z, 0.0001));
        vec2 radius = runeFaceRadius * offAxis / max(runeFaceCentre.z - runeFaceRadius.x, 0.1);
        if (dot(offset / radius, offset / radius) < 1.0) discard;
      }
    #endif
    vec3 n = normalize(vRuneNormal);
    if (!gl_FrontFacing) n = -n;
    float face = max(0.0, dot(n, normalize(vec3(-0.4, 0.7, 0.6))));
    float edgeDistance = (vRuneState.x - vRuneState.z + 0.025) / 0.045;
    float edge = exp(-edgeDistance * edgeDistance);
    vec3 colour = vRuneColour * (0.62 + face * 0.46);
    colour = mix(colour, runeWhite, edge * 0.6);
    #include <logdepthbuf_fragment>
    gl_FragColor = vec4(colour, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`;function I(e,t){let n=e===`aura`,r=new l({name:n?`Rune_Incised_Light`:`Rune_Trail_${e}`,defines:n?{RUNE_FACE:1}:e===`glyph`?{RUNE_GLYPH:1}:e===`ring`?{RUNE_RING:1}:{RUNE_CHIP:1},transparent:!0,depthWrite:!1,toneMapped:!0,side:2,forceSinglePass:!0,uniforms:t,vertexShader:n?N:P,fragmentShader:F});return Object.assign(r.defaultAttributeValues,{runeStroke:[.5]}),r}var L=Math.PI*2,R=36,z=5,B=[8,6,4],V=B[0];function H(i,o){let s=I(`aura`,{runeFaceCentre:{value:new _},runeFaceRadius:{value:new t(1.05,1.05)},runeFaceEnabled:{value:0},runeWhite:{value:new g().setHex(v(`white`),p)}}),c=s.uniforms.runeFaceCentre.value,l=s.uniforms.runeFaceRadius.value,u=s.uniforms.runeFaceEnabled,d=new g().setHex(v(`lavender/2`),p),f=new g().setHex(v(`lilac/1`),p),m=new g().setHex(v(`white`),p),y=new g,b=j().map((t,n)=>{let r=ne(t),o=n<V-T?2:1,c=M(r,o),l=new e(r,s,o);return l.name=`Rune_Aura_Glyph_${n+1}`,l.instanceMatrix.setUsage(a),l.frustumCulled=!1,l.castShadow=l.receiveShadow=!1,l.renderOrder=2,l.visible=!1,l.count=0,i.add(l),{geometry:r,mesh:l,attributes:c,centre:t.centre,shown:0}}),x=new h(1,.013,5,26,.58);x.rotateX(Math.PI/2);let S=M(x,z),C=new e(x,s,z);C.name=`Rune_Aura_Broken_Magic_Circle`,C.instanceMatrix.setUsage(a),C.frustumCulled=!1,C.castShadow=C.receiveShadow=!1,C.renderOrder=2,C.visible=!1,C.count=0,i.add(C);for(let e=0;e<V;e+=1){let t=e%T,n=e<T?0:1;y.copy(d).lerp(f,e%3*.26),b[t].mesh.setColorAt(n,y)}y.copy(d).lerp(m,.17);for(let e=0;e<z;e+=1)C.setColorAt(e,y);let w=new Float64Array(V),E=new Float64Array(V),D=new Float64Array(V);for(let e=0;e<V;e+=1)D[e]=6.2+e*.37,w[e]=e*.61803398875%1*D[e];E.set(w);let O=new ee,k=new r,A=new r,N=new r,P=new _(0,1,0),F=new n,H=new _,U=new _,W=new _,G=o?.getObjectByName(`mixamorigHead_06`)??null,K=new _,q=0,J=0,Y=0,X=!1,Z=()=>{let e=B[Y];for(let e of b)e.shown=0;for(let t=0;t<e;t+=1){let n=t%T,r=t<T?0:1,i=b[n];i.shown=Math.max(i.shown,r+1);let a=E[t]/D[t],o=t*L/e+q,s=t%2==1,c=s?1.42+t%3*.065:1.22+t%3*.055,l=3.22+t%3*.19+Math.sin(a*L+t)*.075;H.set(Math.cos(o)*l,(s?.16:-1.29)+Math.sin(a*L+t*.73)*(s?.17:.1),Math.sin(o)*l-J*.22),F.set(Math.sin(a*L+t)*.11,Math.sin(q+t*.61)*.16,Math.sin(a*L*2+t*.4)*.095),A.setFromAxisAngle(P,Math.PI/2-o),N.setFromEuler(F),k.copy(A).multiply(N),W.copy(i.centre).multiplyScalar(c).applyQuaternion(k),H.sub(W),U.setScalar(c),O.compose(H,k,U),i.mesh.setMatrixAt(r,O);let u=Math.max(0,Math.min(1,a/.07));u=u*u*(3-2*u);let d=Math.max(0,Math.min(1,(a-.84)/.16));d=d*d*(3-2*d),i.attributes.alpha.setX(r,u*(1-d)*.94),i.attributes.reveal.setX(r,Math.min(1,a/.34)),i.attributes.erase.setX(r,Math.max(0,Math.min(1,(a-.67)/.3)))}for(let e of b)e.mesh.count=e.shown,e.mesh.visible=e.shown>0,e.mesh.instanceMatrix.needsUpdate=!0,e.attributes.alpha.needsUpdate=e.attributes.reveal.needsUpdate=e.attributes.erase.needsUpdate=!0;for(let e=0;e<z;e+=1){let t=e*L/z+q+Math.sin(q+e)*.05;k.setFromAxisAngle(P,-t),H.set(0,-2.24+e%2*.035,-J*.1),U.setScalar(2.67+e%3*.09+Math.sin(q*2+e)*.045),O.compose(H,k,U),C.setMatrixAt(e,O),S.alpha.setX(e,.31+Math.sin(q*2+e*.8)*.1),S.reveal.setX(e,1),S.erase.setX(e,0)}C.count=z,C.visible=!0,C.instanceMatrix.needsUpdate=!0,S.alpha.needsUpdate=S.reveal.needsUpdate=S.erase.needsUpdate=!0};return Z(),{setTier(e){X||e===Y||(Y=e,Z())},step(e,t){if(!(X||!Number.isFinite(e)||e<=0)){q=(q+e%R*L/R)%L,J+=(+!!t-J)*(1-Math.exp(-e*3));for(let t=0;t<V;t+=1)E[t]=(E[t]+e%D[t])%D[t];Z()}},view(e){if(X)return;if(G===null){u.value=0;return}e.updateMatrixWorld(),G.updateWorldMatrix(!0,!1),K.set(-.00570525,.6573547,.02455115),G.localToWorld(K);let t=1.00256*G.matrixWorld.getMaxScaleOnAxis()+.14;c.copy(K).applyMatrix4(e.matrixWorldInverse).multiplyScalar(-1),l.set(t,t),u.value=Number.isFinite(c.lengthSq())&&c.z>.1?1:0},reset(){X||(q=J=0,E.set(w),Z())},dispose(){if(!X){X=!0;for(let e of b)e.mesh.removeFromParent(),e.mesh.dispose(),e.geometry.dispose();C.removeFromParent(),C.dispose(),x.dispose(),s.dispose(),te()}}}}var U=Math.PI*2,W=1.85,G=[2.6,3.9,5.6],K=[2,2,1],q=[3,2,1],J=144,Y=1728,X=2592;function Z(t,n,r,i,o){let s=new u(new Float32Array(i*4),4).setUsage(a);n.setAttribute(`runeTrail`,s);let c=new e(n,r,i);return c.instanceMatrix.setUsage(a),c.name=o,c.count=0,c.visible=!1,c.frustumCulled=!1,c.castShadow=!1,c.receiveShadow=!1,t.add(c),{mesh:c,data:s,attributes:[c.instanceMatrix,s],born:new Float64Array(i),capacity:i,count:0,slots:S(),appendStart:-1,rebased:!1}}function Q(e,t,n,r,i,a){if(e.count===e.capacity)return;let o=e.count++;e.appendStart<0&&(e.appendStart=o),e.mesh.setMatrixAt(o,t),e.born[o]=n,e.data.setXYZW(o,n,r,i,a)}function re(e){e.count=e.mesh.count=0,e.mesh.visible=!1,e.slots.clear(),e.appendStart=-1,e.rebased=!1;for(let t of e.attributes)t.clearUpdateRanges()}function ie(e,t){let n=0;for(;n<e.count;){if(t-e.born[n]<W){n+=1;continue}let r=--e.count;if(n!==r){e.born[n]=e.born[r];for(let t of e.attributes){let e=t.itemSize;t.array.copyWithin(n*e,r*e,(r+1)*e)}e.slots.moved(n)}}}function ae(e,t){for(let n=0;n<e.count;n+=1)e.born[n]=e.born[n]-t,e.data.setX(n,e.born[n]);e.rebased=!0}function oe(e){e.mesh.count=e.count,e.mesh.visible=e.count>0;for(let t of e.attributes){let n=t.itemSize,r=!1;t===e.data&&e.rebased&&e.count>0?(t.addUpdateRange(0,e.count*n),r=!0):r=e.slots.upload(t,e.appendStart,e.count),r&&(t.needsUpdate=!0)}e.slots.clear(),e.appendStart=-1,e.rebased=!1}function $(e,t,n=y){let{thickness:a,height:o}=n,c={runeClock:{value:0},runeViolet:{value:new g().setHex(v(`lavender`),p)},runeLilac:{value:new g().setHex(v(`lilac/1`),p)},runeWhite:{value:new g().setHex(v(`white`),p)},trailShapeThickness:{value:a},trailShapeHeight:{value:o}},l=I(`glyph`,c),u=I(`ring`,c),d=I(`chip`,c),f=new i;f.name=`Rune_Written_Path`,e.add(f);let m=j(),S=m.map((e,t)=>Z(f,ne(e),l,J,`Rune_Path_Glyph_${t}`)),C=new h(1,.019,5,24,1.8);C.rotateX(-Math.PI/2);let w=Z(f,C,u,Y,`Rune_Path_Broken_Seals`),O=Z(f,new s(1,0),d,X,`Rune_Path_Erased_Strokes`),k=[...S,w,O],A=b(256),M=new _,N=new _,P=new _,F=new ee,L=new r,R=new _(0,1,0),z=0,B=0,V=0,H=!1,W=(e,t,n,r,i,s)=>{let c=V++,l=c%T,u=c%3,d=Math.atan2(i,s)+Math.PI+Math.sin(c*1.7)*.09,f=Math.sin(c*2.1)*.14*a;N.set(e-s*f,t+E*o,n+i*f),L.setFromAxisAngle(R,d),P.setScalar((1.38+u*.09)*a);let p=m[l].low;Q(S[l],F.compose(N,L,P),r,u*.25,p.y,p.z),N.set(e,t+Math.max(.048*o,x),n),P.setScalar((1.12+c%2*.07)*a);for(let e=0;e<K[z];e+=1)L.setFromAxisAngle(R,d+e*Math.PI+.3),Q(w,F.compose(N,L,P),r,e*.65,0,0);N.set(e,t+D*o,n),P.setScalar(1);for(let e=0;e<q[z];e+=1){let t=c*1.79+e*U/3;L.setFromAxisAngle(R,t),Q(O,F.compose(N,L,P),r,Math.cos(t),Math.sin(t),e)}},$=()=>{for(let e of k)re(e);B=0,V=0,c.runeClock.value=0;for(let e of k)oe(e)};return{setTier(e){H||(z=e)},step(e,n){if(H)return;t.getWorldPosition(M);let r=A.step(M.x,M.y,M.z,e,n,G[z]);if(A.cleared){$();return}if(!Number.isFinite(e)||e<=0)return;if(B+=e,B>=128){let e=Math.floor(B/128)*128;B-=e;for(let t of k)ae(t,e)}for(let e of k)ie(e,B);let i=Math.hypot(A.direction[0],A.direction[2]),a=i>1e-6?A.direction[0]/i:0,o=i>1e-6?A.direction[2]/i:1;for(let e=0;e<r;e+=1){let t=e*3;W(A.positions[t],A.positions[t+1],A.positions[t+2],B-A.elapsed[e],a,o)}c.runeClock.value=B;for(let e of k)oe(e)},reset(){H||($(),A.reset())},dispose(){if(!H){H=!0,f.removeFromParent();for(let e of k)e.mesh.geometry.dispose(),e.mesh.dispose();l.dispose(),u.dispose(),d.dispose(),te()}}}}function se(e,t,n,r=y){return $(e,t,r)}function ce(e,t,n){return H(t,n.character)}export{ce as createRuneAuraEffect,se as createRuneTrailEffect};