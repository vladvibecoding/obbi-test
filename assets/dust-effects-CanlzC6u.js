//# allFunctionsCalledOnLoad
import{$ as e,O as t,P as n,Ut as r,Xn as i,Z as a,ft as o,pt as s,qn as c,v as l,wr as u,wt as d}from"./three.core-DVTiNhEy.js";import{o as f}from"./src-BI6MMqKu.js";import{n as p,r as m,t as h}from"./trail-shape-BsaeWHuc.js";var g=[1,.55,.3],_=Math.PI*2,v=new d,y=new Float32Array(18),b=new Float32Array(18),x=new l,S=h+.12,C=[`beige/1`,`beige`,`beige/-1`,`beige/2`,`brown/2`,`brown/1`],w=[`brown/1`,`brown`,`beige/-1`,`beige/1`,`brown/2`,`beige`];for(let e=0;e<C.length;e+=1)x.setHex(f(C[e]),c).toArray(y,e*3),x.setHex(f(w[e]),c).toArray(b,e*3);var T=null,E=0;function D(e,t){let n=Math.sin(e*127.1+t*311.7)*43758.5453123;return n-Math.floor(n)}function O(e,t){let n=Math.floor(e),r=Math.floor(t),i=e-n,a=t-r,o=i*i*(3-2*i),s=a*a*(3-2*a),c=D(n,r),l=D(n+1,r),u=D(n,r+1),d=D(n+1,r+1);return c+(l-c)*o+(u-c)*s+(c-l-u+d)*o*s}function k(e){let n=e?32:128,r=new Uint8Array(n*n*4);for(let t=0;t<n;t+=1)for(let i=0;i<n;i+=1){let a=(i+.5)/n*2-1,o=(t+.5)/n*2-1,s,c=1;if(e){let e=Math.abs(a*.86+o*.12)+Math.abs(o*1.2-a*.1);s=Math.max(0,Math.min(1,(1-e)*5)),c=.82+.18*Math.max(0,1-Math.abs(a+o)*.5)}else{let e=O(a*3.4+17,o*3.4+21),t=O(a*10.3+4,o*10.3+9),n=(e-.5)*.22,r=Math.hypot(a+n,o-n*.7),i=Math.max(0,1-r),l=Math.exp(-((a+.06)**2*2.5+(o-.02)**2*3)),u=Math.exp(-((a+.38)**2*11+(o+.13)**2*13)),d=Math.exp(-((a-.4)**2*13+(o-.2)**2*10)),f=Math.exp(-((a+.02)**2*18+(o-.44)**2*19)),p=O(a*6.2+e*1.8,o*6.2+e*1.8);s=Math.min(1,(l*.7+u*.4+d*.42+f*.32)*Math.min(1,i*5)*(.48+e*.38+p*.3+t*.12)),c=.88+t*.12}let l=(t*n+i)*4;r[l]=r[l+1]=r[l+2]=Math.round(c*255),r[l+3]=Math.round(s*255)}let i=new t(r,n,n);return i.name=e?`Dust_Grain`:`Dust_Cloud`,i.magFilter=o,i.minFilter=s,i.generateMipmaps=!0,i.needsUpdate=!0,i}function A(){return T??={cloud:k(!1),grain:k(!0)},E+=1,T}function j(){--E,E===0&&T!==null&&(T.cloud.dispose(),T.grain.dispose(),T=null)}function M(t,o,s,c){let l=new i({name:c,uniforms:{dustMap:{value:o}},transparent:!0,depthWrite:!1,depthTest:!0,side:2,blending:1,toneMapped:!0,vertexShader:`
      #include <common>
      #include <logdepthbuf_pars_vertex>
      attribute float dustFade;
      attribute float dustTurn;
      varying vec2 vDustUv;
      varying vec3 vDustTint;
      varying float vDustFade;
      void main() {
        vec4 centre = modelViewMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
        vec2 size = vec2(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz));
        vec2 card = position.xy * size;
        float c = cos(dustTurn), s = sin(dustTurn);
        card = mat2(c, s, -s, c) * card;
        centre.xy += card * length(modelViewMatrix[0].xyz);
        gl_Position = projectionMatrix * centre;
        #include <logdepthbuf_vertex>
        vDustUv = uv;
        vDustTint = instanceColor;
        vDustFade = dustFade;
      }`,fragmentShader:`
      #include <logdepthbuf_pars_fragment>
      uniform sampler2D dustMap;
      varying vec2 vDustUv;
      varying vec3 vDustTint;
      varying float vDustFade;
      void main() {
        vec4 dust = texture2D(dustMap, vDustUv);
        float alpha = dust.a * vDustFade;
        if (alpha < 0.002) discard;
        #include <logdepthbuf_fragment>
        gl_FragColor = vec4(dust.rgb * vDustTint, alpha);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`}),u=new r(1,1),d=new a(new Float32Array(s),1).setUsage(n),f=new a(new Float32Array(s),1).setUsage(n),p=new a(new Float32Array(s*3),3).setUsage(n);u.setAttribute(`dustFade`,d),u.setAttribute(`dustTurn`,f);let m=new e(u,l,s);return m.name=c,m.instanceMatrix.setUsage(n),m.instanceColor=p,m.count=0,m.frustumCulled=!1,m.castShadow=!1,m.receiveShadow=!1,t.add(m),{mesh:m,fade:d,turn:f,tint:p,age:new Float32Array(s),life:new Float32Array(s),x:new Float32Array(s),y:new Float32Array(s),z:new Float32Array(s),vx:new Float32Array(s),vy:new Float32Array(s),vz:new Float32Array(s),size:new Float32Array(s),phase:new Float32Array(s),spin:new Float32Array(s),radius:new Float32Array(s),side:new Int8Array(s),colour:new Float32Array(s*3),next:0}}function N(e,t,n,r){let i=e.next;e.next=(i+1)%e.life.length,e.age[i]=0,e.life[i]=t;let a=r*3,o=i*3;return e.colour[o]=n[a],e.colour[o+1]=n[a+1],e.colour[o+2]=n[a+2],i}function P(e,t){for(let n=0;n<e.life.length;n+=1)e.age[n]<e.life[n]&&(e.age[n]+=t)}function F(e,t,n,r,i,a,o,s,c,l){v.makeScale(o,s,1).setPosition(r,i,a),e.mesh.setMatrixAt(n,v),e.turn.setX(n,c),e.fade.setX(n,l);let u=t*3;e.tint.setXYZ(n,e.colour[u],e.colour[u+1],e.colour[u+2])}function I(e,t){e.mesh.count=t,e.mesh.visible=t>0,t!==0&&(e.mesh.instanceMatrix.needsUpdate=!0,e.fade.needsUpdate=!0,e.turn.needsUpdate=!0,e.tint.needsUpdate=!0)}function L(e){e.life.fill(0),e.next=0,e.mesh.count=0,e.mesh.visible=!1}function R(e){e.mesh.removeFromParent(),e.mesh.geometry.dispose(),e.mesh.material.dispose(),e.mesh.dispose()}function z(t,o,s,c,l,u){let d=new i({name:c,uniforms:{dustMap:{value:o},dustClock:{value:0},trailShapeThickness:{value:u.thickness},trailShapeHeight:{value:u.height}},transparent:!0,depthWrite:!1,depthTest:!0,side:2,forceSinglePass:!0,blending:1,toneMapped:!0,vertexShader:`
      #include <common>
      #include <logdepthbuf_pars_vertex>
      uniform float dustClock;
      uniform float trailShapeThickness;
      uniform float trailShapeHeight;
      attribute vec4 dustState;
      attribute vec3 dustVelocity;
      varying vec2 vDustUv;
      varying vec3 vDustTint;
      varying float vDustFade;
      varying float vDustLift;
      void main() {
        float age = max(0.0, dustClock - dustState.x);
        float k = clamp(age / dustState.y, 0.0, 1.0);
        float phase = dustState.z;
        vec2 size = vec2(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz));
        ${l?`
        float drag = (1.0 - exp(-age * 1.6)) / 1.6;
        // Облик следа: взлёт и падение песчинки сжимаются по высоте целиком.
        vec3 drift = vec3(dustVelocity.x * drag,
          max(-0.03, dustVelocity.y * age - age * age * 1.6) * trailShapeHeight, dustVelocity.z * drag);
        size *= 1.0 - k * 0.45;
        float fade = pow(1.0 - k, 0.8) * 0.86;`:`
        float drag = (1.0 - exp(-age * 2.2)) / 2.2;
        // Облик следа: завиток уходит вбок от скорости — толщина; подъём клуба — высота.
        float curl = (sin(phase + age * 4.2) - sin(phase)) * 0.24 * trailShapeThickness;
        vec3 drift = vec3(dustVelocity.x * drag + dustVelocity.z * curl,
          max(-0.06, age * 0.95 - age * age * 0.7) * trailShapeHeight, dustVelocity.z * drag - dustVelocity.x * curl);
        size *= 0.75 + k * 1.25;
        size.y *= 0.88 - k * 0.26;
        float fade = (0.55 + 0.45 * min(1.0, k / 0.1)) * (1.0 - k) * 0.68;`}
        // Матрица остаётся в мировой точке рождения. Только собственный дрейф
        // клуба или песчинки движется; координаты персонажа сюда не поступают.
        vec3 place = (instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz + drift;
        // Пол — высота ступней в миг рождения, записанная в свободное число матрицы.
        float floorY = instanceMatrix[0].w;
        ${l?`
        // Песчинка приземляется: карточка целиком, при любом повороте, над полом.
        place.y = max(place.y, floorY + ${h.toFixed(3)} + 0.5 * length(size));`:``}
        vec4 centre = modelViewMatrix * vec4(place, 1.0);
        vec2 card = position.xy * size;
        float turn = phase + age * dustState.w;
        float c = cos(turn), s = sin(turn);
        card = mat2(c, s, -s, c) * card;
        card *= length(modelViewMatrix[0].xyz);
        centre.xy += card;
        gl_Position = projectionMatrix * centre;
        #include <logdepthbuf_vertex>
        vDustUv = uv;
        vDustTint = instanceColor;
        vDustFade = fade;
        // Высота точки карточки над полом: столбец Y вида переводит сдвиг в мир.
        vDustLift = place.y - floorY + dot(card, viewMatrix[1].xy);
      }`,fragmentShader:`
      #include <logdepthbuf_pars_fragment>
      uniform sampler2D dustMap;
      varying vec2 vDustUv;
      varying vec3 vDustTint;
      varying float vDustFade;
      varying float vDustLift;
      void main() {
        vec4 dust = texture2D(dustMap, vDustUv);
        float alpha = dust.a * vDustFade;
        ${l?``:`
        // Клуб больше своей высоты над полом: низ карточки тает, не доходя до
        // пола, и пол не режет его ровной кромкой и не спорит с ним за пиксель.
        alpha *= smoothstep(${h.toFixed(3)}, ${S.toFixed(3)}, vDustLift);`}
        if (alpha < 0.002) discard;
        #include <logdepthbuf_fragment>
        gl_FragColor = vec4(dust.rgb * vDustTint, alpha);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`}),f=new r(1,1),p=new a(new Float32Array(s*4),4).setUsage(n),m=new a(new Float32Array(s*3),3).setUsage(n),g=new a(new Float32Array(s*3),3).setUsage(n);f.setAttribute(`dustState`,p),f.setAttribute(`dustVelocity`,m);let _=new e(f,d,s);return _.name=c,_.instanceMatrix.setUsage(n),_.instanceColor=g,_.count=0,_.visible=!1,_.frustumCulled=!1,_.castShadow=!1,_.receiveShadow=!1,_.raycast=()=>void 0,t.add(_),{mesh:_,state:p,velocity:m,tint:g,attributes:[_.instanceMatrix,p,m,g],expires:new Float64Array(s),dirty:!1}}function B(e,t){for(let n of e.attributes)n.addUpdateRange(t*n.itemSize,n.itemSize);e.dirty=!0}function V(e,t){let n=0;for(;n<e.mesh.count;){if(e.expires[n]>t+1e-9){n+=1;continue}let r=--e.mesh.count;n!==r&&(e.mesh.instanceMatrix.array.copyWithin(n*16,r*16,r*16+16),e.state.array.copyWithin(n*4,r*4,r*4+4),e.velocity.array.copyWithin(n*3,r*3,r*3+3),e.tint.array.copyWithin(n*3,r*3,r*3+3),e.expires[n]=e.expires[r],B(e,n))}}function H(e,t){if(e.mesh.material.uniforms.dustClock.value=t,e.mesh.visible=e.mesh.count>0,e.dirty)for(let t of e.attributes)t.needsUpdate=!0;e.dirty=!1}function U(e){e.mesh.count=0,e.mesh.visible=!1;for(let t of e.attributes)t.clearUpdateRanges();e.dirty=!1}function W(e){e.mesh.removeFromParent(),e.mesh.geometry.dispose(),e.mesh.material.dispose(),e.mesh.dispose()}function G(e,t,n,r=p){let i=r.thickness,a=r.height,o=A(),s=z(e,o.cloud,16384,`Dust_Trail_Clouds`,!1,r),c=z(e,o.grain,4096,`Dust_Trail_Grains`,!0,r),l=m(),d=m(),f=new u,h=[.45,.65,1],g=[16384,8192,4096],x=[4096,3072,1536],S=[3,3,2],C=0,w=0,T=0,E=-1,D=!1,O=120762001,k=()=>(O^=O<<13,O^=O>>>17,O^=O<<5,(O>>>0)/4294967296),M=(e,t,n,r)=>{if(n===0)return;let o=Math.hypot(t.direction[0],t.direction[2]);o>1e-5&&(T=t.direction[0]/o,E=t.direction[2]/o);let s=E,c=-T,l=r?x[C]:g[C],u=r?1:S[C],d=r?1.35:1.5;for(let o=0;o<n;o+=1){let n=o*3,f=w-t.elapsed[o];for(let o=0;o<u&&e.mesh.count<l;o+=1){let o=e.mesh.count++,l=(k()-.5)*(r?.65:.45)*i,u=(r?.06+k()*.085:1.3+k()*.7)*i;v.makeScale(u,r?u*.72:u,1).setPosition(t.positions[n]+s*l,t.positions[n+1]+(r?.08+k()*.14:.3+k()*.22)*a,t.positions[n+2]+c*l),v.elements[3]=t.positions[n+1],e.mesh.setMatrixAt(o,v);let p=k()*_,m=r?(k()-.5)*9:(k()<.5?-1:1)*(.45+k()*.45);e.state.setXYZW(o,f,d,p,m);let h=(k()-.5)*(r?.9:.6)*i,g=r?.4+k()*.8:.65;e.velocity.setXYZ(o,s*h-T*g,r?.65+k()*1.4:0,c*h-E*g);let x=r?b:y,S=Math.floor(k()*6)*3;e.tint.setXYZ(o,x[S],x[S+1],x[S+2]),e.expires[o]=f+d,B(e,o)}}},N=()=>{l.reset(),d.reset(),U(s),U(c),w=T=0,E=-1,H(s,w),H(c,w)};return{setTier(e){D||e===C||(C=e,s.mesh.count=Math.min(s.mesh.count,g[C]),c.mesh.count=Math.min(c.mesh.count,x[C]),H(s,w),H(c,w))},step(e,n){if(D)return;if(!Number.isFinite(e)||e<=0){l.step(0,0,0,e,!1,h[C]),d.step(0,0,0,e,!1,h[C]);return}t.getWorldPosition(f),w+=Math.min(e,.25),V(s,w),V(c,w);let r=l.step(f.x,f.y,f.z,e,n,h[C]),i=d.step(f.x,f.y,f.z,e,n,h[C]);(l.cleared||d.cleared)&&(U(s),U(c),T=0,E=-1),M(s,l,r,!1),M(c,d,i,!0),s.mesh.count===0&&c.mesh.count===0&&(w=0),H(s,w),H(c,w)},reset(){D||N()},dispose(){D||(D=!0,W(s),W(c),j())}}}function K(e,t){let n=A(),r=M(t,n.cloud,80,`Dust_Aura_Clouds`),i=M(t,n.grain,96,`Dust_Aura_Grains`),a=0,o=0,s=0,c=0,l=!1,u=119167011,d=()=>(u^=u<<13,u^=u>>>17,u^=u<<5,(u>>>0)/4294967296),f=(e,t,n)=>{let r=N(e,.98+d()*.3,t?b:y,Math.floor(d()*6));e.age[r]=n,e.side[r]=d()<(t?.72:.58)?0:d()<.5?-1:1,e.radius[r]=e.side[r]===0?1.35+d()*.62:1.65+d()*.22,e.y[r]=-2.3+d()*.18,e.phase[r]=d()*_,e.spin[r]=.25+d()*.6,e.size[r]=t?.05+d()*.08:1+d()*.6},p=()=>{let e=0;for(let t=0;t<r.life.length;t+=1){let n=r.age[t],i=r.life[t];if(n>=i)continue;let a=n/i,o=r.phase[t],s=r.side[t],l,u,d;if(s===0){let e=o+n*(3.6+c*.35),i=r.radius[t]+Math.sin(o+a*5.2)*.14+a*.18;l=Math.cos(e)*i,d=Math.sin(e)*i,u=r.y[t]+Math.sin(a*Math.PI)*.42+a*.1}else{let e=o+a*5.6;l=s*(r.radius[t]+Math.sin(e)*.28),d=-.3+Math.cos(e)*.65,u=r.y[t]+a*3.4}let f=.65+Math.sin(a*Math.PI)*.62+a*.2,p=r.size[t]*f,m=Math.min(1,a/.1)*(1-a)**.7*(s===0?.65:.55);F(r,t,e++,l,u,d,p*1.18,p*.9,o+n*r.spin[t],m)}I(r,e),e=0;for(let t=0;t<i.life.length;t+=1){let n=i.age[t],r=i.life[t];if(n>=r)continue;let a=n/r,o=i.phase[t],s=i.side[t],l=o+n*(4.8+c*.5),u=i.radius[t]+Math.sin(o+a*4.3)*.16,d=s===0?Math.cos(l)*u:s*(u+Math.sin(l)*.22),f=s===0?Math.sin(l)*u:-.3+Math.cos(l)*.7,p=i.y[t]+(s===0?Math.sin(a*Math.PI)*.75:a*3.15),m=i.size[t]*(.8+Math.sin(a*Math.PI)*.25);F(i,t,e++,d,p,f,m,m*.68,o+n*5,Math.min(1,a/.08)*(1-a)**.75*.86)}I(i,e)},m=()=>{L(r),L(i),a=o=0,c=0;for(let e=0;e<Math.round(48*g[s]);e+=1)f(r,!1,d()*.98);for(let e=0;e<Math.round(68*g[s]);e+=1)f(i,!0,d()*.98);p()};return m(),{setTier(e){s=e},step(e,t){if(l||!Number.isFinite(e)||e<=0)return;let n=Math.min(e,.1);c+=(+!!t-c)*Math.min(1,n*4),P(r,n),P(i,n),a+=n*48*g[s],o+=n*68*g[s];let u=Math.floor(a),m=Math.floor(o);a-=u,o-=m;for(let e=0;e<u;e+=1)f(r,!1,d()*n);for(let e=0;e<m;e+=1)f(i,!0,d()*n);p()},reset(){l||m()},dispose(){l||(l=!0,R(r),R(i),j())}}}export{K as createDustAura,G as createDustTrail};