//# allFunctionsCalledOnLoad
import{$ as e,At as t,B as n,Bn as r,Bt as i,Ct as a,Dt as o,Et as s,F as c,Jt as l,K as u,O as d,Ot as f,P as p,Q as m,R as h,Rt as g,St as _,Tr as v,Tt as y,Ut as b,Xn as x,Y as S,Z as C,Zn as w,b as T,c as E,d as D,ft as O,g as k,h as A,jt as j,l as M,nr as N,or as P,pt as F,qn as I,tn as L,u as R,ur as z,v as B,wr as V,wt as H}from"./three.core-DVTiNhEy.js";import{o as U}from"./src-BIhDzOTA.js";import{o as W}from"./src-BI6MMqKu.js";import{a as G,c as K,i as q,n as J,o as ee,s as Y,t as X}from"./tail-field-D7RgIifh.js";function Z(){let e=X(`diamondFacets`);return e.wrapS=r,e.magFilter=O,e.minFilter=F,e.generateMipmaps=!0,e.anisotropy=4,e}function Q(){let e=[[.46,.5],[.82,.31],[1,.21]].map(([e,t])=>Array.from({length:8},(n,r)=>{let i=r/8*Math.PI*2;return new V(Math.sin(i)*t,e,Math.cos(i)*t)})),r=[`cyan/1`,`white`,`blue`,`lavender/1`,`cyan/2`,`blue/1`,`white`,`cyan`].map(e=>new B(W(e))),i=[],a=[],o=(e,t,n,r)=>{for(let o of[e,t,n])i.push(o.x,o.y,o.z),a.push(r.r,r.g,r.b)},s=new V,c=new V(0,1,0);for(let t=0;t<8;t++){let n=(t+1)%8;o(s,e[0][n],e[0][t],r[t]);for(let i=0;i<e.length-1;i++){let a=e[i],s=e[i+1];o(a[t],a[n],s[t],r[(t+i+1)%r.length]),o(a[n],s[n],s[t],r[(t+i+3)%r.length])}o(c,e[2][t],e[2][n],r[(t+1)%r.length])}let l=new D;l.setAttribute(`position`,new n(i,3)),l.setAttribute(`color`,new n(a,3)),l.computeVertexNormals(),l.computeBoundingSphere();let u=new t({color:16777215,vertexColors:!0,roughness:.13,metalness:.035,clearcoat:.65,clearcoatRoughness:.13});return u.name=`Diamond_Cut_Gem_Tip`,{geometry:l,material:u}}function $(){let e=Z(),n=Q(),r={value:0},i=new B(W(`white`)),a=new B(W(`cyan/1`)),o=new B(W(`blue/-2`)),s=new B(W(`lavender/1`)),c={matte:new j({color:16777215,roughness:.19,metalness:.03,normalMap:e}),velvet:new t({color:16777215,roughness:.33,metalness:.02,normalMap:e,sheen:.32,sheenColor:i,sheenRoughness:.65}),satin:new t({color:16777215,roughness:.09,metalness:.03,normalMap:e,clearcoat:.75,clearcoatRoughness:.13,ior:1.6})};for(let[e,t]of Object.entries(c))t.name=`Tail_Diamond_`+e,t.customProgramCacheKey=()=>`tail-diamond-`+e+`-v2`,t.onBeforeCompile=e=>{e.uniforms.diamondTime=r,e.uniforms.diamondWhite={value:i},e.uniforms.diamondCold={value:a},e.uniforms.diamondDeepBlue={value:o},e.uniforms.diamondViolet={value:s},e.fragmentShader=`
        uniform float diamondTime;
        uniform vec3 diamondWhite;
        uniform vec3 diamondCold;
        uniform vec3 diamondDeepBlue;
        uniform vec3 diamondViolet;
      `+e.fragmentShader.replace(`#include <color_fragment>`,`#include <color_fragment>
          vec4 diamondFace = texture2D(normalMap, vNormalMapUv);
          vec3 diamondTone = mix(diamondDeepBlue, diamondCold,
            smoothstep(0.27, 0.71, diamondFace.b));
          diamondTone = mix(diamondTone, diamondWhite,
            smoothstep(0.7, 0.96, diamondFace.b));
          diamondTone = mix(diamondTone, diamondViolet,
            (1.0 - smoothstep(0.32, 0.58, diamondFace.b)) * 0.24);
          diffuseColor.rgb *= diamondTone;`).replace(`#include <roughnessmap_fragment>`,`#include <roughnessmap_fragment>
          roughnessFactor *= 0.76 + diamondFace.b * 0.23;`).replace(`#include <normal_fragment_maps>`,`
          vec2 diamondSlope = (diamondFace.rg * 2.0 - 1.0) * normalScale * 1.16;
          vec3 diamondNormal = vec3(diamondSlope,
            sqrt(max(0.04, 1.0 - dot(diamondSlope, diamondSlope))));
          normal = normalize(tbn * diamondNormal);`).replace(`#include <clearcoat_normal_fragment_maps>`,`#include <clearcoat_normal_fragment_maps>
          #ifdef USE_CLEARCOAT
            clearcoatNormal = normal;
          #endif`).replace(`#include <emissivemap_fragment>`,`#include <emissivemap_fragment>
          vec3 diamondView = normalize(vViewPosition);
          vec3 diamondRay = reflect(-diamondView, normal);
          vec3 diamondKey = normalize(mat3(viewMatrix) * vec3(-0.55, 0.68, 0.48));
          vec3 diamondFill = normalize(mat3(viewMatrix) * vec3(0.7, 0.15, -0.65));
          float diamondFlash = pow(max(0.0, dot(diamondRay, diamondKey)), 28.0);
          float diamondEdge = pow(max(0.0, dot(diamondRay, diamondFill)), 19.0);
          float diamondInner = pow(max(0.0,
            sin(diamondTime * 0.83 + diamondFace.a * 6.28318530718)), 12.0);
          totalEmissiveRadiance += diamondWhite * diamondFlash * 1.25
            + diamondViolet * diamondEdge * 0.26
            + diamondCold * (0.012 + diamondInner * 0.075);`)};let l=!1;return{materials:c,update(e){!l&&e>0&&Number.isFinite(e)&&(r.value+=Math.min(e,.1))},createEffect(e){let t=q(e,{kind:`glint`,color:W(`cyan`),secondaryColor:W(`white`),capacity:32,interval:.055,life:1.1,size:.039,speed:.052,rise:.032,minV:.12,maxV:.96,opacity:.98,additive:!1,orbit:.8,spread:.036,rotationSpeed:.72}),r=Y(e,n,{name:`Diamond_Faceted_Tip`,width:.095,height:.12,embed:.018});return K(t,r,`Diamond_Glints_And_Tip`)},dispose(){l||(l=!0,Object.values(c).forEach(e=>e.dispose()),e.dispose(),n.geometry.dispose(),n.material.dispose())}}}function te(){let e=X(`poisonField`);return e.wrapS=r,e.wrapT=r,e.magFilter=O,e.minFilter=F,e.generateMipmaps=!0,e.anisotropy=4,e}function ne(){let e=new A([new V(0,0,0),new V(0,.16,0),new V(.05,.34,0),new V(.18,.58,0),new V(.42,.82,0),new V(.63,.98,0),new V(.74,1,0),new V(.8,.9,0),new V(.72,.76,0)],!1,`catmullrom`,.3),r=new V,i=new V,a=new V,o=new V(0,0,1),s=Array.from({length:14},(t,n)=>{let s=n/14;e.getPoint(s,r),e.getTangent(s,i).normalize(),a.crossVectors(i,o).normalize();let c=(.105+Math.exp(-(((s-.17)/.15)**2))*.13)*(1-s)**.8;return Array.from({length:6},(e,t)=>{let n=t/6*Math.PI*2;return r.clone().addScaledVector(a,Math.cos(n)*c).addScaledVector(o,Math.sin(n)*c*.82)})}),c=new B(W(`night`)).lerp(new B(W(`sea-green/-2`)),.32),l=new B(W(`green/1`)).lerp(new B(W(`yellow/1`)),.5),u=[],d=[],f=(e,t,n,r)=>{for(let i of[e,t,n])u.push(i.x,i.y,i.z),d.push(r.r,r.g,r.b)},p=e.getPoint(0),m=e.getPoint(1);for(let e=0;e<6;e++){let t=(e+1)%6,n=c.clone().lerp(l,e===0?.7:e===5?.26:.055);f(p,s[0][e],s[0][t],n);for(let r=0;r<s.length-1;r++){let i=s[r],a=s[r+1];f(i[e],a[e],i[t],n),f(i[t],a[e],a[t],n)}f(s[13][e],m,s[13][t],n)}let h=new D;h.setAttribute(`position`,new n(u,3)),h.setAttribute(`color`,new n(d,3)),h.computeVertexNormals(),h.computeBoundingSphere();let g=new t({color:16777215,vertexColors:!0,roughness:.32,metalness:.08,clearcoat:.25,clearcoatRoughness:.28});return g.name=`Poison_Scorpion_Stinger`,{geometry:h,material:g}}function re(){let e=te(),n=ne(),r={value:0},i=new B(W(`sea-green`)),a=new B(W(`green/1`)).lerp(new B(W(`yellow/1`)),.57),o=new B(W(`black`)).lerp(new B(W(`sea-green/-2`)),.17),s={matte:new j({map:e,roughness:.48}),velvet:new t({map:e,roughness:.67,sheen:.38,sheenColor:i,sheenRoughness:.8}),satin:new t({map:e,roughness:.22,clearcoat:.62,clearcoatRoughness:.2})};for(let[e,t]of Object.entries(s))t.name=`Tail_Poison_`+e,t.customProgramCacheKey=()=>`tail-poison-`+e+`-v2`,t.onBeforeCompile=e=>{e.uniforms.poisonTime=r,e.uniforms.poisonGreen={value:i},e.uniforms.poisonLime={value:a},e.uniforms.poisonShell={value:o},e.vertexShader=`varying float vPoisonScale;
`+e.vertexShader.replace(`#include <uv_vertex>`,`#include <uv_vertex>
          vPoisonScale = length(modelMatrix[0].xyz);`),e.fragmentShader=`
        uniform float poisonTime;
        uniform vec3 poisonGreen;
        uniform vec3 poisonLime;
        uniform vec3 poisonShell;
        varying float vPoisonScale;
      `+e.fragmentShader.replace(`#include <map_fragment>`,`
          vec4 poisonFixed = texture2D(map, vMapUv);
          vec2 poisonDrift = vec2(poisonTime * 0.035, -poisonTime * 0.065);
          vec2 poisonWarp = texture2D(map,
            vMapUv * vec2(2.0, 1.0) - poisonDrift * 0.64).ba - 0.5;
          vec2 poisonFlow = texture2D(map,
            vMapUv + poisonDrift + poisonWarp * vec2(0.072, 0.047)).gb;
          float poisonTip = 1.0 - smoothstep(0.955, 1.0, vMapUv.y);
          float poisonShellMask = poisonFixed.r * poisonTip;
          float poisonMass = smoothstep(0.2, 0.78,
            poisonFlow.x * 0.77 + poisonFlow.y * 0.23);
          poisonMass = mix(0.54, poisonMass, poisonTip);
          float poisonPocket = smoothstep(0.55, 0.88, poisonMass);
          vec3 poisonBody = mix(poisonGreen * 0.25, poisonLime * 1.1, poisonMass);
          poisonBody = mix(poisonBody, poisonLime * 1.06, poisonPocket * 0.16);
          diffuseColor.rgb *= mix(poisonBody, poisonShell, poisonShellMask);
          float poisonHeight = poisonMass * (1.0 - poisonShellMask) * 0.016
            + poisonShellMask * 0.019;`).replace(`#include <roughnessmap_fragment>`,`#include <roughnessmap_fragment>
          roughnessFactor = mix(roughnessFactor * 0.78,
            max(0.59, roughnessFactor), poisonShellMask);`).replace(`#include <normal_fragment_maps>`,`#include <normal_fragment_maps>
          vec3 poisonDx = dFdx(-vViewPosition);
          vec3 poisonDy = dFdy(-vViewPosition);
          vec3 poisonR1 = cross(poisonDy, normal);
          vec3 poisonR2 = cross(normal, poisonDx);
          float poisonDet = dot(poisonDx, poisonR1);
          vec3 poisonGradient = sign(poisonDet)
            * (dFdx(poisonHeight) * poisonR1 + dFdy(poisonHeight) * poisonR2);
          normal = normalize(max(abs(poisonDet), 1e-10) * normal
            - poisonGradient * vPoisonScale);`).replace(`#include <clearcoat_normal_fragment_maps>`,`#include <clearcoat_normal_fragment_maps>
          #ifdef USE_CLEARCOAT
            clearcoatNormal = normal;
          #endif`).replace(`#include <emissivemap_fragment>`,`#include <emissivemap_fragment>
          totalEmissiveRadiance += poisonLime
            * (0.07 + poisonPocket * 0.19) * (1.0 - poisonShellMask);`)};let c=!1;return{materials:s,update(e){!c&&e>0&&Number.isFinite(e)&&(r.value+=Math.min(e,.1))},createEffect(e){let t=q(e,{kind:`drop`,color:a.getHex(),secondaryColor:W(`sea-green/1`),capacity:18,interval:.095,life:1,size:.026,speed:.035,rise:-.025,gravity:.23,normalYMax:-.08,minV:.15,maxV:.95,opacity:.95,spread:.008}),r=q(e,{kind:`smoke`,color:W(`sea-green`),secondaryColor:a.getHex(),capacity:24,interval:.09,life:1.9,size:.09,speed:.026,rise:.043,minV:.12,maxV:.93,opacity:.76,additive:!1,orbit:.3,spread:.055,stretch:1.14,rotationSpeed:.3}),i=new u;i.name=`Poison_Drops_And_Gas`,i.visible=!1,i.add(t.object,r.object);let o=!1,s={object:i,setActive(e){o||(i.visible=e,t.setActive(e),r.setActive(e))},update(e){o||!i.visible||(t.update(e),r.update(e))},dispose(){o||(o=!0,t.dispose(),r.dispose(),i.removeFromParent(),i.clear())}},c=Y(e,n,{name:`Poison_Hooked_Stinger_Tip`,width:.13,height:.12,depth:.1,embed:.012});return K(s,c,`Poison_Cloud_And_Stinger`)},dispose(){c||(c=!0,Object.values(s).forEach(e=>e.dispose()),e.dispose(),n.geometry.dispose(),n.material.dispose())}}}function ie(){let e=X(`runeField`);return e.wrapS=r,e.magFilter=O,e.minFilter=F,e.generateMipmaps=!0,e.anisotropy=4,e}function ae(){let e=ie(),n={value:0},r=new B(W(`night`)).lerp(new B(W(`blue/-2`)),.36),i=new B(W(`black`)),a=new B(W(`beige/2`)).lerp(new B(W(`white`)),.25),o=new B(W(`white`)).lerp(new B(W(`cyan/2`)),.14),s={matte:new j({map:e,roughness:.87}),velvet:new t({map:e,roughness:.99,sheen:.46,sheenColor:new B(W(`blue/1`)),sheenRoughness:.94}),satin:new t({map:e,roughness:.42,clearcoat:.23,clearcoatRoughness:.4})};for(let[e,t]of Object.entries(s))t.name=`Tail_Runes_`+e,t.customProgramCacheKey=()=>`tail-runes-`+e+`-v2`,t.onBeforeCompile=e=>{e.uniforms.runesTime=n,e.uniforms.runesBase={value:r},e.uniforms.runesIncision={value:i},e.uniforms.runesBone={value:a},e.uniforms.runesLight={value:o},e.vertexShader=`varying float vRunesScale;
`+e.vertexShader.replace(`#include <uv_vertex>`,`#include <uv_vertex>
          vRunesScale = length(modelMatrix[0].xyz);`),e.fragmentShader=`
        uniform float runesTime;
        uniform vec3 runesBase;
        uniform vec3 runesIncision;
        uniform vec3 runesBone;
        uniform vec3 runesLight;
        varying float vRunesScale;
      `+e.fragmentShader.replace(`#include <map_fragment>`,`
          float runesTip = 1.0 - smoothstep(0.93, 1.0, vMapUv.y);
          vec2 runesUv = vec2(vMapUv.x + runesTime * 0.065,
            vMapUv.y + sin(runesTime * 2.0) * 0.009 * runesTip);
          vec4 runesField = texture2D(map, runesUv);
          runesField.rg *= runesTip;
          float runesAngle = vMapUv.x * 6.28318530718;
          float runesGrain = sin(runesAngle * 41.0 + sin(vMapUv.y * 133.0) * 0.4)
            * sin(runesAngle * 23.0 - vMapUv.y * 79.0)
            * (1.0 - smoothstep(0.94, 1.0, vMapUv.y));
          vec3 runesBody = runesBase * (0.95 + runesGrain * 0.045);
          runesBody = mix(runesBody, runesIncision, runesField.g * 0.79);
          float runesAge = fract(runesTime / 3.2 - runesField.a);
          float runesHead = runesAge / 0.085;
          float runesWritten = smoothstep(runesField.b - 0.035, runesField.b + 0.025, runesHead);
          float runesGlow = runesWritten * (1.0 - smoothstep(0.19, 0.3, runesAge));
          float runesPulse = pow(0.5 + 0.5
            * sin(runesTime * 3.8 + runesField.a * 6.28318530718), 2.0);
          vec3 runesInk = mix(runesBone, runesLight,
            min(1.0, runesGlow * 0.72 + runesPulse * 0.25));
          diffuseColor.rgb *= mix(runesBody, runesInk, runesField.r);
          float runesHeight = -runesField.g * 0.011 + runesGrain * 0.00065;`).replace(`#include <roughnessmap_fragment>`,`#include <roughnessmap_fragment>
          roughnessFactor = mix(roughnessFactor,
            max(0.36, roughnessFactor * 0.69), runesField.r);`).replace(`#include <normal_fragment_maps>`,`#include <normal_fragment_maps>
          vec3 runesDx = dFdx(-vViewPosition);
          vec3 runesDy = dFdy(-vViewPosition);
          vec3 runesR1 = cross(runesDy, normal);
          vec3 runesR2 = cross(normal, runesDx);
          float runesDet = dot(runesDx, runesR1);
          vec3 runesGradient = sign(runesDet)
            * (dFdx(runesHeight) * runesR1 + dFdy(runesHeight) * runesR2);
          normal = normalize(max(abs(runesDet), 1e-10) * normal
            - runesGradient * vRunesScale);`).replace(`#include <clearcoat_normal_fragment_maps>`,`#include <clearcoat_normal_fragment_maps>
          #ifdef USE_CLEARCOAT
            clearcoatNormal = normal;
          #endif`).replace(`#include <emissivemap_fragment>`,`#include <emissivemap_fragment>
          totalEmissiveRadiance += runesLight * runesField.r
            * (0.12 + runesGlow * 1.7 + runesPulse * 0.32);`)};let c=!1;return{materials:s,update(e){!c&&e>0&&Number.isFinite(e)&&(n.value+=Math.min(e,.1))},createEffect(e){return q(e,{kind:`rune`,color:W(`cyan`),secondaryColor:W(`blue/1`),capacity:24,interval:.085,life:1.65,size:.058,speed:.035,rise:.035,minV:.14,maxV:.94,opacity:.96,additive:!1,orbit:1.15,spread:.08,stretch:1.14,rotationSpeed:.35})},dispose(){c||(c=!0,Object.values(s).forEach(e=>e.dispose()),e.dispose())}}}function oe(){let e=X(`cursedField`);return e.wrapS=r,e.magFilter=O,e.minFilter=F,e.generateMipmaps=!0,e.anisotropy=4,e}function se(){let e=oe(),n={value:0},r=new B(W(`white`)).lerp(new B(W(`beige/2`)),.23),i=new B(W(`beige/1`)).lerp(new B(W(`white`)),.48),a=new B(W(`black`)),o={matte:new j({map:e,roughness:.79}),velvet:new t({map:e,roughness:.95,sheen:.43,sheenColor:r,sheenRoughness:.86}),satin:new t({map:e,roughness:.33,clearcoat:.25,clearcoatRoughness:.29})};for(let[e,t]of Object.entries(o))t.name=`Tail_Cursed_`+e,t.customProgramCacheKey=()=>`tail-cursed-`+e+`-v2`,t.onBeforeCompile=e=>{e.uniforms.cursedTime=n,e.uniforms.cursedWax={value:r},e.uniforms.cursedOldWax={value:i},e.uniforms.cursedVein={value:a},e.vertexShader=`varying float vCursedScale;
`+e.vertexShader.replace(`#include <uv_vertex>`,`#include <uv_vertex>
          vCursedScale = length(modelMatrix[0].xyz);`),e.fragmentShader=`
        uniform float cursedTime;
        uniform vec3 cursedWax;
        uniform vec3 cursedOldWax;
        uniform vec3 cursedVein;
        varying float vCursedScale;
      `+e.fragmentShader.replace(`#include <map_fragment>`,`
          float cursedTip = 1.0 - smoothstep(0.94, 1.0, vMapUv.y);
          vec2 cursedUv = vec2(vMapUv.x + sin(cursedTime * 0.72
            + vMapUv.y * 9.0) * 0.016 * cursedTip, vMapUv.y);
          vec4 cursedField = texture2D(map, cursedUv);
          cursedField.r *= cursedTip;
          float cursedAge = fract(cursedTime / 4.8 - cursedField.b);
          float cursedSpread = smoothstep(0.025, 0.57, cursedAge)
            * (1.0 - smoothstep(0.68, 0.99, cursedAge));
          float cursedHead = 0.23 + cursedSpread * 0.74;
          float cursedGrowth = 1.0 - smoothstep(cursedHead - 0.035,
            cursedHead + 0.035, cursedField.g);
          float cursedMark = smoothstep(0.035, 0.49, cursedField.r) * cursedGrowth;
          vec3 cursedBody = mix(cursedOldWax, cursedWax,
            smoothstep(0.14, 0.85, cursedField.a));
          diffuseColor.rgb *= mix(cursedBody, cursedVein, cursedMark);
          float cursedHeight = (cursedField.a - 0.5) * 0.0015
            - cursedMark * 0.011;`).replace(`#include <roughnessmap_fragment>`,`#include <roughnessmap_fragment>
          roughnessFactor = mix(roughnessFactor,
            max(0.75, roughnessFactor), cursedMark);`).replace(`#include <normal_fragment_maps>`,`#include <normal_fragment_maps>
          vec3 cursedDx = dFdx(-vViewPosition);
          vec3 cursedDy = dFdy(-vViewPosition);
          vec3 cursedR1 = cross(cursedDy, normal);
          vec3 cursedR2 = cross(normal, cursedDx);
          float cursedDet = dot(cursedDx, cursedR1);
          vec3 cursedGradient = sign(cursedDet)
            * (dFdx(cursedHeight) * cursedR1 + dFdy(cursedHeight) * cursedR2);
          normal = normalize(max(abs(cursedDet), 1e-10) * normal
            - cursedGradient * vCursedScale);`).replace(`#include <clearcoat_normal_fragment_maps>`,`#include <clearcoat_normal_fragment_maps>
          #ifdef USE_CLEARCOAT
            clearcoatNormal = normal;
          #endif`).replace(`#include <emissivemap_fragment>`,`#include <emissivemap_fragment>
          float cursedRim = pow(1.0 - abs(dot(normal, normalize(vViewPosition))), 3.0);
          totalEmissiveRadiance += cursedWax
            * (0.012 + cursedRim * 0.025) * (1.0 - cursedMark);`)};let s=!1;return{materials:o,update(e){!s&&e>0&&Number.isFinite(e)&&(n.value+=Math.min(e,.1))},createEffect(e){let t=q(e,{kind:`flake`,color:W(`black`),secondaryColor:W(`dark-grey/-2`),capacity:20,interval:.075,life:1.45,size:.038,speed:.037,rise:.025,gravity:.011,minV:.12,maxV:.95,opacity:.96,orbit:.75,spread:.075,rotationSpeed:1.4}),n=q(e,{kind:`smoke`,color:W(`black`),secondaryColor:W(`night/-2`),capacity:24,interval:.095,life:2,size:.085,speed:.018,rise:.023,minV:.16,maxV:.94,opacity:.83,additive:!1,orbit:-.22,spread:.055,stretch:1.06,rotationSpeed:-.24}),r=new u;r.name=`Cursed_Flakes_And_Gloom`,r.visible=!1,r.add(t.object,n.object);let i=!1;return{object:r,setActive(e){i||(r.visible=e,t.setActive(e),n.setActive(e))},update(e){i||!r.visible||(t.update(e),n.update(e))},dispose(){i||(i=!0,t.dispose(),n.dispose(),r.removeFromParent(),r.clear())}}},dispose(){s||(s=!0,Object.values(o).forEach(e=>e.dispose()),e.dispose())}}}var ce=e=>e-Math.round(e);function le(){let e=X(`bandageField`);return e.wrapS=r,e.magFilter=O,e.minFilter=F,e.generateMipmaps=!0,e.anisotropy=4,e}function ue(){let e=X(`ribbonMap`);return e.colorSpace=I,e.magFilter=O,e.minFilter=F,e.generateMipmaps=!0,e.anisotropy=2,e}function de(e,t){let n=new u;n.name=`Mummy_Fluttering_Bandages`,n.visible=!1;let r=q(e,{kind:`dust`,color:W(`beige/2`),secondaryColor:W(`cyan/1`),capacity:12,interval:.11,life:1.2,size:.011,speed:.013,rise:.04,minV:.12,maxV:.94,opacity:.55,orbit:.55,spread:.012});n.add(r.object);let i=e.geometry.getAttribute(`uv`),o=e.geometry.getAttribute(`normal`),s=e.geometry.getAttribute(`position`),c=new E().setFromBufferAttribute(s).getSize(new V).length(),l=[[.08,.16],[.26,.31],[.48,.43],[.67,.58],[.87,.72],[.14,.85]].map(([e,t])=>{let n=0,r=1/0;for(let a=0;a<i.count;a++){let o=ce(i.getX(a)-e),s=(i.getY(a)-t)*6,c=o*o+s*s;c<r&&(r=c,n=a)}return n}),d=l.length*11*2,f=new Float32Array(d*3),m=new Float32Array(d*2),h=[];for(let e=0;e<l.length;e++){let t=e*11*2;for(let e=0;e<=10;e++)if(m.set([0,e/10,1,e/10],(t+e*2)*2),e<10){let n=t+e*2;h.push(n,n+1,n+2,n+1,n+3,n+2)}}let g=new D,_=new R(f,3).setUsage(p),v=new R(new Float32Array(d*3),3).setUsage(p),b=v.array;g.setAttribute(`position`,_),g.setAttribute(`normal`,v),g.setAttribute(`uv`,new R(m,2)),g.setIndex(h);let x=new j({color:W(`beige/1`),map:t,roughness:1,metalness:0,side:2,alphaTest:.2});x.name=`Mummy_Loose_Cloth`;let S=new y(g,x);S.frustumCulled=!1,n.add(S);let C=new a,w=new V,T=new V,O=new V,k=new V,A=new V,M=new V,N=new V,P=new V(0,1,0),F=new V(1,0,0),I=0,L=!1,z=!1;function B(){e.updateWorldMatrix(!0,!1),C.getNormalMatrix(e.matrixWorld);let t=c*e.matrixWorld.getMaxScaleOnAxis();for(let n=0;n<l.length;n++){let r=l[n];e.getVertexPosition(r,w).applyMatrix4(e.matrixWorld),O.fromBufferAttribute(o,r),T.copy(O);let i=e.geometry.morphAttributes.normal;for(let t=0;t<(i?.length??0);t++)k.fromBufferAttribute(i[t],r),e.geometry.morphTargetsRelative||k.sub(O),T.addScaledVector(k,e.morphTargetInfluences?.[t]??0);T.applyNormalMatrix(C),A.crossVectors(T,Math.abs(T.y)>.9?F:P).normalize(),M.crossVectors(A,T).normalize();let a=t*(.2+n%3*.035),s=t*(.021+n%2*.005);for(let e=0;e<=10;e++){let t=e/10,r=I*(3.4+n*.18)-t*6.5+n*1.7,i=Math.sin(r)*a*.22*t,o=Math.sin(r*.72+n)*a*.14*t;N.copy(w).addScaledVector(T,s*.35+a*t*.67).addScaledVector(A,i).addScaledVector(M,o),N.y-=a*t*t*.24;let c=Math.sin(r*.57)*t*.85,l=s*(1-t*.34);for(let t=0;t<2;t++){let r=t===0?-1:1,i=(n*11+e)*2+t;f[i*3]=N.x+r*l*(A.x*Math.cos(c)+M.x*Math.sin(c)),f[i*3+1]=N.y+r*l*(A.y*Math.cos(c)+M.y*Math.sin(c)),f[i*3+2]=N.z+r*l*(A.z*Math.cos(c)+M.z*Math.sin(c))}}}_.needsUpdate=!0,b.fill(0);for(let e=0;e<h.length;e+=3){let t=h[e]*3,n=h[e+1]*3,r=h[e+2]*3,i=f[n]-f[t],a=f[n+1]-f[t+1],o=f[n+2]-f[t+2],s=f[r]-f[t],c=f[r+1]-f[t+1],l=f[r+2]-f[t+2],u=a*l-o*c,d=o*s-i*l,p=i*c-a*s;b[t]=b[t]+u,b[t+1]=b[t+1]+d,b[t+2]=b[t+2]+p,b[n]=b[n]+u,b[n+1]=b[n+1]+d,b[n+2]=b[n+2]+p,b[r]=b[r]+u,b[r+1]=b[r+1]+d,b[r+2]=b[r+2]+p}for(let e=0;e<b.length;e+=3){let t=Math.hypot(b[e],b[e+1],b[e+2]);t>1e-12?(b[e]=b[e]/t,b[e+1]=b[e+1]/t,b[e+2]=b[e+2]/t):(b[e]=0,b[e+1]=1,b[e+2]=0)}v.needsUpdate=!0}return{object:n,setActive(e){z||L===e||(L=e,n.visible=e,r.setActive(e),e&&B())},update(e){z||!L||(e>0&&Number.isFinite(e)&&(I+=Math.min(e,.1)),r.update(e),B())},dispose(){z||(z=!0,L=!1,n.visible=!1,n.removeFromParent(),r.dispose(),g.dispose(),x.dispose())}}}function fe(){let e=le(),n=ue(),r={value:0},i={value:new B(W(`beige/1`))},a={value:new B(W(`beige/-2`))},o={value:new B(W(`cyan/1`))},s={value:new B(W(`white`))},c={matte:new j({roughness:1,bumpMap:e,bumpScale:.0055}),velvet:new t({roughness:1,bumpMap:e,bumpScale:.006,sheen:.35,sheenColor:W(`beige/1`),sheenRoughness:1}),satin:new t({roughness:.65,bumpMap:e,bumpScale:.0055,clearcoat:.1,clearcoatRoughness:.65})};for(let[t,n]of Object.entries(c))n.name=`Tail_Mummy_${t}`,n.onBeforeCompile=t=>{t.uniforms.mummyField={value:e},t.uniforms.mummyTime=r,t.uniforms.mummyCloth=i,t.uniforms.mummyWorn=a,t.uniforms.mummyGlow=o,t.uniforms.mummyCore=s,t.vertexShader=`varying vec2 vMummyUv;\n${t.vertexShader}`.replace(`#include <uv_vertex>`,`#include <uv_vertex>
 vMummyUv = uv;`),t.fragmentShader=`
        uniform sampler2D mummyField;
        uniform float mummyTime;
        uniform vec3 mummyCloth, mummyWorn, mummyGlow, mummyCore;
        varying vec2 vMummyUv;
        ${t.fragmentShader}`.replace(`#include <color_fragment>`,`#include <color_fragment>
          vec4 mummySample = texture2D(mummyField, vMummyUv);
          vec3 mummyFabric = mix(mummyWorn * 0.48, mummyCloth, smoothstep(0.08, 0.80, mummySample.g));
          mummyFabric *= 0.76 + mummySample.r * 0.38;
          mummyFabric = mix(mummyFabric, mummyCloth, mummySample.a * 0.55);
          diffuseColor.rgb = mix(mummyFabric, mummyGlow * 0.3, mummySample.b);`).replace(`#include <emissivemap_fragment>`,`#include <emissivemap_fragment>
          float mummyPulse = 0.72 + 0.28 * sin(mummyTime * 1.3 - vMummyUv.y * 9.0);
          float mummyBright = smoothstep(0.28, 0.95, mummySample.b);
          totalEmissiveRadiance += mummyGlow * mummySample.b * mummyPulse * 1.3;
          totalEmissiveRadiance += mummyCore * mummyBright * mummyPulse * 0.5;`)},n.customProgramCacheKey=()=>`tail-mummy-bandages-v2`;let l=!1;return{materials:c,update(e){!l&&e>0&&Number.isFinite(e)&&(r.value+=Math.min(e,.1))},createEffect(e){return de(e,n)},dispose(){l||(l=!0,Object.values(c).forEach(e=>e.dispose()),e.dispose(),n.dispose())}}}var pe=e=>e-Math.round(e);function me(){let e=X(`pharaohField`);return e.wrapS=r,e.magFilter=O,e.minFilter=F,e.generateMipmaps=!0,e.anisotropy=4,e}function he(){let e=X(`pyramidEyeMap`);return e.colorSpace=I,e.magFilter=O,e.minFilter=F,e.generateMipmaps=!0,e.anisotropy=4,e}function ge(){let e=[[-.5,0,-.5],[.5,0,-.5],[.5,0,.5],[-.5,0,.5]],t=[],r=[];for(let n=0;n<e.length;n++)t.push(...e[n],0,1,0,...e[(n+1)%e.length]),r.push(0,0,.5,1,1,0);for(let n of[0,1,2,0,2,3])t.push(...e[n]),r.push(.04,.96);let i=new D;return i.setAttribute(`position`,new n(t,3)),i.setAttribute(`uv`,new n(r,2)),i.computeVertexNormals(),i.computeBoundingSphere(),i}function _e(e,t,n){let r=new u;r.name=`Pharaoh_Royal_Aura`,r.visible=!1;let i=q(e,{kind:`glint`,color:W(`yellow`),secondaryColor:W(`orange/1`),capacity:18,interval:.09,life:1.55,size:.024,speed:.014,rise:.027,minV:.1,maxV:.96,opacity:.9,additive:!1,orbit:1.2,spread:.025,rotationSpeed:.6});r.add(i.object);let o=[.23,.52,.8],c=e.geometry.getAttribute(`uv`),l=e.geometry.getAttribute(`normal`),d=e.geometry.getAttribute(`position`),f=new E().setFromBufferAttribute(d).getSize(new V).length(),m=0,h=-1/0,g=new Set;for(let e=0;e<c.count;e++){let t=c.getY(e);t>h&&(h=t,m=e),g.add(t)}let _=[...g].filter(e=>e<h-1e-6).sort((e,t)=>t-e).slice(0,2).map(e=>{let t=new Map;for(let n=0;n<c.count;n++){if(Math.abs(c.getY(n)-e)>1e-6)continue;let r=Math.round((c.getX(n)-Math.floor(c.getX(n)))*12)%12;t.has(r)||t.set(r,n)}return[...t].sort(([e],[t])=>e-t).map(([,e])=>e)}),v=new y(t,n);v.name=`Pharaoh_Gold_Eye_Tip`,v.frustumCulled=!1,r.add(v);let b=new V,x=new V,S=new V,C=new V,w=new V,T=new V,O=new V,k=new V,A=new H,j=o.flatMap(e=>Array.from({length:12},(t,n)=>{let r=0,i=1/0,a=n/12;for(let t=0;t<c.count;t++){let n=pe(c.getX(t)-a),o=(c.getY(t)-e)*6,s=n*n+o*o;s<i&&(i=s,r=t)}return{index:r,position:new V,normal:new V}})),M=new Float32Array(o.length*24*4*3),N=new Float32Array(o.length*24*4*2),P=[];for(let e=0;e<o.length;e++)for(let t=0;t<24;t++){let n=(e*24+t)*4;N.set([t/24,0,t/24,1,(t+1)/24,0,(t+1)/24,1],n*2),t%8<6&&P.push(n,n+1,n+2,n+1,n+3,n+2)}let F=new D,I=new R(M,3).setUsage(p);F.setAttribute(`position`,I),F.setAttribute(`uv`,new R(N,2)),F.setIndex(P);let L={value:0},z={value:new B(W(`orange`))},U=new s({color:W(`yellow`),transparent:!0,opacity:.9,blending:1,depthWrite:!1,side:2,toneMapped:!0});U.name=`Pharaoh_Gold_Magic_Rings`,U.forceSinglePass=!0,U.onBeforeCompile=e=>{e.uniforms.royalTime=L,e.uniforms.royalEdge=z,e.vertexShader=`varying vec2 vRoyalUv;\n${e.vertexShader}`.replace(`#include <uv_vertex>`,`#include <uv_vertex>
 vRoyalUv = uv;`),e.fragmentShader=`uniform float royalTime; uniform vec3 royalEdge; varying vec2 vRoyalUv;\n${e.fragmentShader}`.replace(`#include <color_fragment>`,`#include <color_fragment>
        float royalCore = pow(max(0.0, sin(vRoyalUv.y * 3.14159265)), 0.65);
        float royalLight = 0.72 + 0.28 * sin(vRoyalUv.x * 18.8495559 - royalTime * 2.1);
        diffuseColor.rgb = mix(royalEdge, diffuseColor.rgb, royalCore);
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(1.0), royalCore * 0.2);
        diffuseColor.a *= royalCore * royalLight;`)},U.customProgramCacheKey=()=>`pharaoh-royal-rings-v2`;let G=new y(F,U);G.frustumCulled=!1,G.renderOrder=1,r.add(G);let K=new a,J=new V,ee=new V,Y=new V,X=new V,Z=!1,Q=!1;function $(){e.updateWorldMatrix(!0,!1),K.getNormalMatrix(e.matrixWorld);let t=f*e.matrixWorld.getMaxScaleOnAxis();e.getVertexPosition(m,b).applyMatrix4(e.matrixWorld),x.set(0,0,0),S.set(0,0,0);for(let t=0;t<_.length;t++){let n=_[t],r=t===0?x:S;for(let t of n)e.getVertexPosition(t,C).applyMatrix4(e.matrixWorld),r.add(C);n.length>0&&r.divideScalar(n.length)}T.copy(b).sub(x),T.lengthSq()<1e-12&&T.copy(x).sub(S),T.lengthSq()<1e-12&&T.set(0,1,0).transformDirection(e.matrixWorld),T.normalize();let n=_[0]?.[0]??m;e.getVertexPosition(n,w).applyMatrix4(e.matrixWorld),O.copy(w).sub(x),O.addScaledVector(T,-O.dot(T)),O.lengthSq()<1e-12&&(O.set(1,0,0).transformDirection(e.matrixWorld),O.addScaledVector(T,-O.dot(T)),O.lengthSq()<1e-12&&(O.set(0,0,1).transformDirection(e.matrixWorld),O.addScaledVector(T,-O.dot(T)))),O.normalize(),k.crossVectors(O,T).normalize(),O.crossVectors(T,k).normalize(),A.makeBasis(O,T,k),v.position.copy(b).addScaledVector(T,-t*.025),v.quaternion.setFromRotationMatrix(A),v.scale.set(t*.09,t*.1,t*.09),v.updateMatrix();for(let t of j){e.getVertexPosition(t.index,t.position).applyMatrix4(e.matrixWorld),J.fromBufferAttribute(l,t.index),t.normal.copy(J);let n=e.geometry.morphAttributes.normal;for(let r=0;r<(n?.length??0);r++)ee.fromBufferAttribute(n[r],t.index),e.geometry.morphTargetsRelative||ee.sub(J),t.normal.addScaledVector(ee,e.morphTargetInfluences?.[r]??0);t.normal.applyNormalMatrix(K)}for(let e=0;e<o.length;e++){let n=L.value*(e%2?-.14:.18)+e*.13;for(let r=0;r<24;r++)for(let i=0;i<4;i++){let a=(((r+Math.floor(i/2))/24+n)%1+1)%1*12,o=Math.floor(a),s=j[e*12+o],c=j[e*12+(o+1)%12];Y.copy(s.position).lerp(c.position,a-o),X.copy(s.normal).lerp(c.normal,a-o).normalize(),Y.addScaledVector(X,t*(.065+i%2*.032));let l=(e*24+r)*4+i;M[l*3]=Y.x,M[l*3+1]=Y.y,M[l*3+2]=Y.z}}I.needsUpdate=!0}return{object:r,setActive(e){Q||Z===e||(Z=e,r.visible=e,i.setActive(e),e&&$())},update(e){Q||!Z||(e>0&&Number.isFinite(e)&&(L.value+=Math.min(e,.1)),i.update(e),$())},dispose(){Q||(Q=!0,Z=!1,r.visible=!1,r.removeFromParent(),i.dispose(),F.dispose(),U.dispose())}}}function ve(){let e=me(),n=he(),r=ge(),i=new j({color:16777215,map:n,metalness:.63,roughness:.34});i.name=`Pharaoh_Gold_Pyramid_Eye`;let a={value:0},o={value:new B(W(`blue`))},s={value:new B(W(`blue/-2`))},c={value:new B(W(`yellow`))},l={value:new B(W(`crimson`))},u={value:new B(W(`red/1`))},d={matte:new j({roughness:.78,bumpMap:e,bumpScale:.0015}),velvet:new t({roughness:.91,bumpMap:e,bumpScale:.0015,sheen:.38,sheenColor:W(`cyan/-1`),sheenRoughness:.88}),satin:new t({roughness:.3,bumpMap:e,bumpScale:.0015,clearcoat:.34,clearcoatRoughness:.3})};for(let[t,n]of Object.entries(d))n.name=`Tail_Pharaoh_${t}`,n.onBeforeCompile=t=>{t.uniforms.pharaohField={value:e},t.uniforms.pharaohTime=a,t.uniforms.pharaohBlue=o,t.uniforms.pharaohDeepBlue=s,t.uniforms.pharaohGold=c,t.uniforms.pharaohRuby=l,t.uniforms.pharaohRubyLight=u,t.vertexShader=`varying vec2 vPharaohUv;\n${t.vertexShader}`.replace(`#include <uv_vertex>`,`#include <uv_vertex>
 vPharaohUv = uv;`),t.fragmentShader=`
        uniform sampler2D pharaohField;
        uniform float pharaohTime;
        uniform vec3 pharaohBlue, pharaohDeepBlue, pharaohGold, pharaohRuby, pharaohRubyLight;
        varying vec2 vPharaohUv;
        ${t.fragmentShader}`.replace(`#include <color_fragment>`,`#include <color_fragment>
          vec4 pharaohSample = texture2D(pharaohField, vPharaohUv);
          vec3 pharaohEnamel = mix(pharaohDeepBlue, pharaohBlue, 0.63 + pharaohSample.b * 0.3);
          vec3 pharaohStone = mix(pharaohRuby, pharaohRubyLight, pharaohSample.b * 0.62);
          diffuseColor.rgb = mix(pharaohEnamel, pharaohGold * (0.66 + pharaohSample.b * 0.42), pharaohSample.r);
          diffuseColor.rgb = mix(diffuseColor.rgb, pharaohStone, pharaohSample.g);
          diffuseColor.rgb *= 1.0 - pharaohSample.a * 0.63;`).replace(`#include <roughnessmap_fragment>`,`#include <roughnessmap_fragment>
          roughnessFactor *= mix(0.92, 0.6, max(pharaohSample.r, pharaohSample.g));`).replace(`#include <metalnessmap_fragment>`,`#include <metalnessmap_fragment>
          metalnessFactor = mix(0.015, 0.77, pharaohSample.r * (1.0 - pharaohSample.g));`).replace(`#include <emissivemap_fragment>`,`#include <emissivemap_fragment>
          float pharaohPulse = 0.5 + 0.5 * sin(pharaohTime * 1.04719755);
          float pharaohSweep = pow(max(0.0, cos(vPharaohUv.y * 6.2831853 - pharaohTime * 1.25663706)), 14.0);
          totalEmissiveRadiance += pharaohRubyLight * pharaohSample.g * (0.035 + pharaohPulse * 0.13);
          totalEmissiveRadiance += pharaohBlue * pharaohSweep * 0.055
            * (1.0 - pharaohSample.r) * (1.0 - pharaohSample.g)
            * (1.0 - smoothstep(0.92, 1.0, vPharaohUv.y));`)},n.customProgramCacheKey=()=>`tail-pharaoh-cobra-v1`;let f=!1;return{materials:d,update(e){!f&&e>0&&Number.isFinite(e)&&(a.value+=Math.min(e,.1))},createEffect(e){return _e(e,r,i)},dispose(){f||(f=!0,Object.values(d).forEach(e=>e.dispose()),e.dispose(),r.dispose(),i.dispose(),n.dispose())}}}function ye(){let e=X(`smokeField`);return e.wrapS=r,e.wrapT=r,e.magFilter=O,e.minFilter=F,e.generateMipmaps=!0,e.anisotropy=2,e}function be(){let e=ye(),n={value:0},r={value:new B(W(`violet/-1`))},i={value:new B(W(`lilac/1`))},a={value:new B(W(`cyan/1`))},o={value:new B(W(`lavender/2`))},s={matte:new j({roughness:1,metalness:0}),velvet:new t({roughness:1,metalness:0,sheen:.35,sheenColor:W(`lilac/1`),sheenRoughness:1}),satin:new t({roughness:.75,metalness:0,clearcoat:.06,clearcoatRoughness:.85})};for(let[t,c]of Object.entries(s))c.name=`Tail_Djinn_${t}`,c.transparent=!0,c.opacity=1,c.depthWrite=!1,c.side=0,c.onBeforeCompile=t=>{t.uniforms.djinnField={value:e},t.uniforms.djinnTime=n,t.uniforms.djinnDark=r,t.uniforms.djinnLilac=i,t.uniforms.djinnCyan=a,t.uniforms.djinnPale=o,t.vertexShader=`varying vec2 vDjinnUv;\n${t.vertexShader}`.replace(`#include <uv_vertex>`,`#include <uv_vertex>
 vDjinnUv = uv;`),t.fragmentShader=`
        uniform sampler2D djinnField;
        uniform float djinnTime;
        uniform vec3 djinnDark, djinnLilac, djinnCyan, djinnPale;
        varying vec2 vDjinnUv;
        ${t.fragmentShader}`.replace(`#include <color_fragment>`,`#include <color_fragment>
          vec2 djinnUv = vec2(vDjinnUv.x, vDjinnUv.y * 1.65);
          vec3 djinnA = texture2D(djinnField, djinnUv + vec2(djinnTime * 0.018, -djinnTime * 0.025)).rgb;
          vec3 djinnB = texture2D(djinnField,
            djinnUv * vec2(2.0, 1.0) + (djinnA.rg - 0.5) * 0.15
            + vec2(-djinnTime * 0.012, -djinnTime * 0.018)).rgb;
          float djinnDensity = smoothstep(0.19, 0.79, djinnA.r * 0.64 + djinnB.g * 0.36);
          float djinnStream = smoothstep(0.38, 0.76, djinnA.g * 0.65 + djinnB.r * 0.35);
          float djinnCurl = pow(max(0.0, 1.0 - abs(djinnA.r + djinnB.g - 0.99) * 3.8), 3.0);
          float djinnTip = 1.0 - smoothstep(0.84, 1.0, vDjinnUv.y);
          float djinnPole = 1.0 - smoothstep(0.96, 1.0, vDjinnUv.y);
          vec3 djinnCloud = mix(djinnDark, djinnLilac, djinnDensity * 0.78);
          djinnCloud = mix(djinnCloud, djinnCyan, djinnStream * 0.72 * djinnDensity);
          vec3 djinnTipColor = mix(djinnLilac, djinnCyan, 0.28);
          vec3 djinnSurface = mix(djinnCloud, djinnPale, djinnCurl * 0.23 * djinnTip);
          diffuseColor.rgb = mix(djinnTipColor, djinnSurface, djinnPole);
          float djinnOpacity = mix(0.26, 0.6, djinnDensity) * mix(0.83, 1.0, djinnTip);
          diffuseColor.a *= mix(0.4, djinnOpacity, djinnPole);`).replace(`#include <emissivemap_fragment>`,`#include <emissivemap_fragment>
          totalEmissiveRadiance += djinnCyan * djinnStream * djinnDensity * 0.22 * djinnTip;
          totalEmissiveRadiance += djinnPale * djinnCurl * 0.14 * djinnTip;`)},c.customProgramCacheKey=()=>`tail-djinn-cloud-v2`;let c=!1;return{materials:s,update(e){!c&&e>0&&Number.isFinite(e)&&(n.value+=Math.min(e,.1))},createEffect(e){let t=q(e,{kind:`smoke`,color:W(`lavender`),secondaryColor:W(`cyan`),capacity:32,interval:.065,life:2,size:.064,speed:.012,rise:.023,minV:.07,maxV:.98,opacity:.62,orbit:1.1,spread:.038,stretch:1.65,rotationSpeed:.72}),n=q(e,{kind:`smoke`,color:W(`cyan/1`),secondaryColor:W(`lavender/2`),capacity:12,interval:.16,life:1.8,size:.033,speed:.011,rise:.037,minV:.06,maxV:.97,opacity:.42,additive:!0,orbit:1.8,spread:.055,stretch:2.7,rotationSpeed:-1.05}),r=new u;r.name=`Djinn_Whole_Tail_Vortex`,r.visible=!1,r.add(t.object,n.object);let i=!1;return{object:r,setActive(e){i||(r.visible=e,t.setActive(e),n.setActive(e))},update(e){i||!r.visible||(t.update(e),n.update(e))},dispose(){i||(i=!0,r.visible=!1,r.removeFromParent(),t.dispose(),n.dispose())}}},dispose(){c||(c=!0,Object.values(s).forEach(e=>e.dispose()),e.dispose())}}}function xe(){let e=J(`dragonMaps`,2).map(e=>(e.wrapS=r,e.magFilter=O,e.minFilter=F,e.generateMipmaps=!0,e.anisotropy=4,e));return e[0].colorSpace=I,e[0].name=`Dragon_Armor_Color`,e[1].name=`Dragon_Armor_Field`,{color:e[0],field:e[1]}}function Se(){let e=xe(),n={value:0},r={matte:new j({roughness:.77,metalness:.27}),velvet:new t({roughness:.98,metalness:.1,sheen:.45,sheenColor:new B(8045215),sheenRoughness:.85}),satin:new t({roughness:.42,metalness:.32,clearcoat:.5,clearcoatRoughness:.26})};for(let[t,i]of Object.entries(r))i.name=`Tail_Dragon_${t}`,i.map=e.color,i.bumpMap=e.field,i.bumpScale=t===`velvet`?.003:.004,i.roughnessMap=e.field,i.customProgramCacheKey=()=>`sand-dragon-armor-v2`,i.onBeforeCompile=t=>{t.uniforms.dragonTime=n,t.uniforms.dragonField={value:e.field},t.vertexShader=`varying vec2 vDragonUv;\n${t.vertexShader}`.replace(`#include <uv_vertex>`,`#include <uv_vertex>
vDragonUv = uv;`),t.fragmentShader=`uniform float dragonTime;
        uniform sampler2D dragonField;
        varying vec2 vDragonUv;
        ${t.fragmentShader}`.replace(`#include <color_fragment>`,`#include <color_fragment>
          float dragonTip = 1.0 - smoothstep(0.94, 1.0, vDragonUv.y);
          vec4 dragonFieldValue = texture2D(dragonField, vDragonUv);
          // Широкая волна постоянно проходит туда и обратно, освещая целый ряд щитов.
          float dragonPhase = mod(dragonTime, 3.6) / 1.8;
          float dragonFront = (1.0 - abs(dragonPhase - 1.0)) * 1.36 - 0.18;
          float dragonWave = 1.0 - smoothstep(0.10, 0.29, abs(vDragonUv.y - dragonFront));
          float dragonArmor = dragonFieldValue.b * 0.78 + dragonFieldValue.a * 0.24;
          float dragonGlow = dragonWave * dragonArmor * dragonTip;
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.30, 0.96, 0.55), clamp(dragonGlow * 0.78, 0.0, 0.85));`).replace(`#include <emissivemap_fragment>`,`#include <emissivemap_fragment>
          totalEmissiveRadiance += vec3(0.12, 0.86, 0.38) * dragonGlow * 3.2;`)};return{materials:r,update(e){e>0&&Number.isFinite(e)&&(n.value+=Math.min(e,.1))},createEffect(e){let t=q(e,{kind:`glint`,color:8650675,secondaryColor:2727284,capacity:20,interval:.075,life:1.2,size:.045,speed:.07,rise:.075,minV:.12,maxV:.91,opacity:1,spread:.055,orbit:1.8,rotationSpeed:1.5}),n=q(e,{kind:`smoke`,color:2932103,secondaryColor:750424,capacity:10,interval:.15,life:1.25,size:.06,speed:.018,rise:.028,minV:.12,maxV:.9,opacity:.42,spread:.07,orbit:1,stretch:1.25,rotationSpeed:.6}),r=new u;r.name=`Dragon_Emerald_Aura`,r.visible=!1,r.add(t.object,n.object);let i=!1;return{object:r,setActive(e){i||(r.visible=e,t.setActive(e),n.setActive(e))},update(e){i||(t.update(e),n.update(e))},dispose(){i||(i=!0,r.visible=!1,t.dispose(),n.dispose(),r.removeFromParent())}}},dispose(){Object.values(r).forEach(e=>e.dispose()),e.color.dispose(),e.field.dispose()}}}function Ce(){let e=J(`phoenixMaps`,2).map(e=>(e.wrapS=r,e.magFilter=O,e.minFilter=F,e.generateMipmaps=!0,e.anisotropy=4,e));return e[0].colorSpace=I,e[0].name=`Phoenix_Feather_Color`,e[1].name=`Phoenix_Feather_Field`,{color:e[0],field:e[1]}}function we(e){let t=[],r=[],i=[];for(let e=0;e<=14;e++){let n=e/14,a=_.smoothstep(n,.11,.22),o=_.lerp(.016,.003,n)+Math.max(0,Math.sin(n*Math.PI))**.72*.34*a,s=Math.sin(n*Math.PI)*.05+n*.07,c=.006+Math.sin(n*Math.PI)*.036,l=s-o*(1.04+Math.sin(n*23)*.045),u=s+o*(.94+Math.sin(n*19+1)*.04);if(t.push(l,n,c*.2,s,n,c,u,n,c*.2,l,n,-c*.2,s,n,-c*.63,u,n,-c*.2),r.push(0,n,.5,n,1,n,0,n,.5,n,1,n),e<14){let t=e*6,n=t+6;i.push(t,t+1,n,t+1,n+1,n,t+1,t+2,n+1,t+2,n+2,n+1,t+3,n+3,t+4,t+4,n+3,n+4,t+4,n+4,t+5,t+5,n+4,n+5,t,n,t+3,n,n+3,t+3,t+2,t+5,n+2,t+5,n+5,n+2)}}i.push(0,3,1,3,4,1,1,4,2,4,5,2),i.push(84,85,87,87,85,88,85,86,88,88,86,89);let a=new D;a.setAttribute(`position`,new n(t,3)),a.setAttribute(`uv`,new n(r,2)),a.setIndex(i),a.computeVertexNormals(),a.computeBoundingSphere();let o=X(`phoenixTipFeather`);o.colorSpace=I,o.magFilter=O,o.minFilter=F,o.generateMipmaps=!0,o.anisotropy=4;let s=new j({color:16777215,map:o,roughness:.58,metalness:.025});return s.name=`Phoenix_Three_Dimensional_Tip_Feather`,s.customProgramCacheKey=()=>`phoenix-tip-rebirth-v1`,s.onBeforeCompile=t=>{t.uniforms.phoenixTipTime=e,t.fragmentShader=`uniform float phoenixTipTime;\n${t.fragmentShader}`.replace(`#include <color_fragment>`,`#include <color_fragment>
        float phoenixTipPhase = mod(phoenixTipTime, 8.2);
        float phoenixTipAsh = smoothstep(1.37, 1.64, phoenixTipPhase)
          * (1.0 - smoothstep(3.33, 3.6, phoenixTipPhase));
        float phoenixTipLuminance = dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722));
        vec3 phoenixTipSpent = vec3(0.075, 0.065, 0.09) + phoenixTipLuminance * vec3(0.2, 0.18, 0.23);
        diffuseColor.rgb = mix(diffuseColor.rgb, phoenixTipSpent, phoenixTipAsh * 0.92);
        float phoenixTipWave = 1.0 - smoothstep(0.035, 0.19, abs(phoenixTipPhase - 3.45));`).replace(`#include <emissivemap_fragment>`,`#include <emissivemap_fragment>
        float phoenixTipStem = 1.0 - smoothstep(0.025, 0.12, abs(vMapUv.x - 0.5));
        totalEmissiveRadiance += vec3(1.0, 0.37, 0.055) * phoenixTipWave * (0.38 + phoenixTipStem * 0.55);`)},{geometry:a,material:s,map:o}}function Te(){let e=Ce(),n={value:0},r=we(n),i={matte:new j({roughness:.9,metalness:.04}),velvet:new t({roughness:1,metalness:0,sheen:.9,sheenColor:new B(16102262),sheenRoughness:.73}),satin:new t({roughness:.38,metalness:.08,clearcoat:.2,clearcoatRoughness:.4})};for(let[t,r]of Object.entries(i))r.name=`Tail_Phoenix_${t}`,r.map=e.color,r.bumpMap=e.field,r.bumpScale=t===`velvet`?.002:.0028,r.roughnessMap=e.field,r.customProgramCacheKey=()=>`sand-phoenix-rebirth-v1`,r.onBeforeCompile=t=>{t.uniforms.phoenixTime=n,t.uniforms.phoenixField={value:e.field},t.vertexShader=`varying vec2 vPhoenixUv;\n${t.vertexShader}`.replace(`#include <uv_vertex>`,`#include <uv_vertex>
vPhoenixUv = uv;`),t.fragmentShader=`uniform float phoenixTime;
        uniform sampler2D phoenixField;
        varying vec2 vPhoenixUv;
        ${t.fragmentShader}`.replace(`#include <color_fragment>`,`#include <color_fragment>
          vec4 phoenixFieldValue = texture2D(phoenixField, vPhoenixUv);
          float phoenixPhase = mod(phoenixTime, 8.2);
          float phoenixAshFront = phoenixPhase / 1.55 * 1.16 - 0.08;
          float phoenixRebirthFront = (phoenixPhase - 2.15) / 1.35 * 1.16 - 0.08;
          float phoenixSpent = 1.0 - smoothstep(phoenixAshFront - 0.06, phoenixAshFront + 0.06, vPhoenixUv.y);
          float phoenixRestored = 1.0 - smoothstep(phoenixRebirthFront - 0.07, phoenixRebirthFront + 0.07, vPhoenixUv.y);
          float phoenixAsh = phoenixSpent * (1.0 - phoenixRestored);
          // Пепельная стадия сохраняет читаемые перья и никогда не скрывает хвост.
          float phoenixLuminance = dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722));
          vec3 phoenixAshColor = vec3(0.075, 0.065, 0.090) + phoenixLuminance * vec3(0.20, 0.18, 0.23);
          diffuseColor.rgb = mix(diffuseColor.rgb, phoenixAshColor, phoenixAsh * 0.92);
          float phoenixTip = 1.0 - smoothstep(0.965, 1.0, vPhoenixUv.y);
          float phoenixWave = (1.0 - smoothstep(0.025, 0.125, abs(vPhoenixUv.y - phoenixRebirthFront)))
            * step(2.15, phoenixPhase) * (1.0 - step(3.65, phoenixPhase)) * phoenixTip;
          float phoenixGold = phoenixFieldValue.a;
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(1.0, 0.47, 0.105), phoenixWave * 0.38);
          float phoenixHealthy = (1.0 - phoenixAsh) * phoenixTip;
          float phoenixGleam = 0.5 + 0.5 * sin(phoenixTime * 1.3 - vPhoenixUv.y * 12.0);`).replace(`#include <emissivemap_fragment>`,`#include <emissivemap_fragment>
          totalEmissiveRadiance += vec3(1.0, 0.37, 0.055) * phoenixWave
            * (phoenixFieldValue.b * 0.48 + phoenixGold * 1.1)
            + vec3(0.48, 0.105, 0.018) * phoenixGold * phoenixHealthy * phoenixGleam * 0.15;`)};let a=!1;return{materials:i,update(e){!a&&e>0&&Number.isFinite(e)&&(n.value+=Math.min(e,.1))},createEffect(e){let t=q(e,{kind:`flake`,color:6509412,secondaryColor:11966850,capacity:24,interval:.08,life:1.55,size:.031,speed:.06,rise:.135,gravity:.035,minV:.12,maxV:.92,opacity:.95,spread:.055,orbit:1,rotationSpeed:2,gate:()=>+(n.value%8.2<2.15)}),i=q(e,{kind:`smoke`,color:7823729,secondaryColor:13080696,capacity:12,interval:.17,life:1.3,size:.07,speed:.025,rise:.095,minV:.12,maxV:.9,opacity:.52,spread:.07,orbit:.65,stretch:1.4,rotationSpeed:.9,gate:()=>+(n.value%8.2<2.55)}),a=q(e,{kind:`feather`,color:16765065,secondaryColor:13586747,capacity:20,interval:.11,life:1.5,size:.072,speed:.095,rise:.125,gravity:.025,minV:.12,maxV:.92,opacity:1,spread:.075,orbit:1,stretch:1.7,rotationSpeed:2.5,gate:()=>{let e=n.value%8.2;return e>2.15&&e<3.65?1:e>=3.65?.3:0}}),o=new u;o.name=`Phoenix_Rebirth_Particles`,o.visible=!1,o.add(t.object,i.object,a.object);let s=!1,c={object:o,setActive(e){s||(o.visible=e,t.setActive(e),i.setActive(e),a.setActive(e))},update(e){s||(t.update(e),i.update(e),a.update(e))},dispose(){s||(s=!0,o.visible=!1,t.dispose(),i.dispose(),a.dispose(),o.removeFromParent())}},l=Y(e,r,{name:`Phoenix_Volume_Feather_Tip`,width:.15,height:.17,depth:.14,embed:.012});return K(c,l,`Phoenix_Rebirth_And_Tip_Feather`)},dispose(){a||(a=!0,Object.values(i).forEach(e=>e.dispose()),e.color.dispose(),e.field.dispose(),r.geometry.dispose(),r.material.dispose(),r.map.dispose())}}}var Ee=e=>{let t=Math.sin(e*127.1+311.7)*43758.5453;return t-Math.floor(t)};function De(){let e=X(`plasmaTexture`);return e.name=`Solar_Plasma_Field`,e.wrapS=e.wrapT=r,e.magFilter=O,e.minFilter=F,e.generateMipmaps=!0,e}function Oe(e,t,n){let r=t===0?2.1:2.75,i=t===0?1.35:1.55,a=(e+t*1.25)%r;n.opacity=_.smoothstep(a,0,.15)*(1-_.smoothstep(a,i*.63,i)),n.cycle=Math.floor((e+t*1.25)/r)}function ke(e,t,n){let r=e.geometry.getAttribute(`uv`),i=new Map;for(let e=0;e<r.count;e++){let t=r.getY(e),n=i.get(t);n||(n=new Map,i.set(t,n));let a=(r.getX(e)%1+1)%1;n.set(Math.round(a*12)%12,e)}let a=[...i].filter(([,e])=>e.size===12).sort(([e],[t])=>e-t).map(([e,t])=>({v:e,vertices:Array.from({length:12},(e,n)=>t.get(n))}));if(a.length<2)throw Error(`Солнечным аркам нужна развёртка Tail_Base`);let o=new E().setFromBufferAttribute(e.geometry.getAttribute(`position`)).getSize(new V).length(),s=new Float32Array(360),c=new Float32Array(360),l=new Float32Array(120),u=new Float32Array(120),d=new Float32Array(120),f=new Float32Array(120),m=[-1,1,-1,1,1,-1],h=[0,0,1,0,1,1];for(let e=0;e<120;e++)u[e]=m[e%6],d[e]=h[e%6],f[e]=Math.floor(e/60);let g=new D;g.setAttribute(`position`,new R(s,3).setUsage(p)),g.setAttribute(`end`,new R(c,3).setUsage(p)),g.setAttribute(`width`,new R(l,1).setUsage(p)),g.setAttribute(`side`,new R(u,1)),g.setAttribute(`along`,new R(d,1)),g.setAttribute(`arc`,new R(f,1));let v=new y(g,t);v.name=`Solar_Surface_Arcs`,v.visible=!1,v.frustumCulled=!1;let b=Array.from({length:22},()=>new V),x=new V,S=new V,C=new V,w=new V,T=new V,O=new V,k=Array.from({length:2},()=>({opacity:0,cycle:0})),A=!1,j=!1;function M(t,n,r){let i=(n%1+1)%1*12,a=Math.floor(i);e.getVertexPosition(t.vertices[a],x),e.getVertexPosition(t.vertices[(a+1)%12],S),r.copy(x).lerp(S,i-a)}function N(e,t,n){let r=1;for(;r<a.length-1&&a[r].v<t;)r++;let i=a[r-1],o=a[r];M(i,e,C),M(o,e,w),n.copy(C).lerp(w,_.clamp((t-i.v)/(o.v-i.v),0,1))}function P(){if(Oe(n.value,0,k[0]),Oe(n.value,1,k[1]),v.visible=A&&(k[0].opacity>.001||k[1].opacity>.001),!v.visible)return;e.updateWorldMatrix(!0,!1);let t=e.matrixWorld.getMaxScaleOnAxis();for(let r=0;r<2;r++){let i=k[r],a=i.cycle*29+r*61,u=Ee(a+17),d=.12+Ee(a+7)*.51,f=.17+Ee(a+31)*.07;for(let t=0;t<11;t++){let s=t/10,c=Math.sin(s*Math.PI),l=u+s*.14+c*Math.sin(n.value*1.2+a)*.029,p=d+s*f,m=b[r*11+t];N(l,p,m),N(l+.5,p,T),O.copy(m).sub(T).normalize(),m.addScaledVector(O,o*(.004+c*.14*i.opacity)),m.applyMatrix4(e.matrixWorld)}for(let e=0;e<10;e++){let n=b[r*11+e],i=b[r*11+e+1];for(let a=0;a<6;a++){let u=r*10*6+e*6+a;n.toArray(s,u*3),i.toArray(c,u*3);let d=(e+h[a])/10;l[u]=o*t*.014*(.35+Math.sin(d*Math.PI)*.65)}}}g.getAttribute(`position`).needsUpdate=!0,g.getAttribute(`end`).needsUpdate=!0,g.getAttribute(`width`).needsUpdate=!0}return{object:v,setActive(e){j||(A=e,e?P():v.visible=!1)},update(e){A&&!j&&e>0&&Number.isFinite(e)&&P()},dispose(){j||(j=!0,A=!1,v.visible=!1,v.removeFromParent(),g.dispose())}}}function Ae(){let e={value:0},n=De(),r={matte:new j({color:16758054,roughness:.8}),velvet:new t({color:16758054,roughness:1,sheen:.65,sheenColor:new B(16769939),sheenRoughness:.9}),satin:new t({color:16758054,roughness:.32,clearcoat:.25,clearcoatRoughness:.38})};for(let[t,i]of Object.entries(r))i.name=`Tail_Solar_${t}`,i.customProgramCacheKey=()=>`sand-solar-plasma-v1`,i.onBeforeCompile=t=>{t.uniforms.solarTime=e,t.uniforms.solarPlasma={value:n},t.vertexShader=`varying vec2 vSolarUv;\n${t.vertexShader}`.replace(`#include <uv_vertex>`,`#include <uv_vertex>
vSolarUv = uv;`),t.fragmentShader=`uniform float solarTime;
        uniform sampler2D solarPlasma;
        varying vec2 vSolarUv;
        ${t.fragmentShader}`.replace(`#include <color_fragment>`,`#include <color_fragment>
          vec2 solarUv = vec2(vSolarUv.x, vSolarUv.y * 1.3);
          vec2 solarWarp = texture2D(solarPlasma, solarUv + vec2(solarTime * 0.021, -solarTime * 0.033)).ba - 0.5;
          vec4 solarMain = texture2D(solarPlasma,
            solarUv + solarWarp * 0.34 + vec2(-solarTime * 0.041, solarTime * 0.067));
          vec4 solarCounter = texture2D(solarPlasma,
            solarUv * vec2(2.0, 1.7) - solarWarp * 0.23 + vec2(solarTime * 0.027, -solarTime * 0.042));
          // Холодных чёрных трещин нет: вся поверхность остаётся горячей плазмой.
          float solarBody = 1.0 - smoothstep(0.20, 0.95, solarMain.r * 0.82 + solarCounter.r * 0.18);
          float solarCore = smoothstep(0.44, 0.88, solarMain.g) * (0.60 + solarCounter.g * 0.40);
          float solarTip = 1.0 - smoothstep(0.94, 1.0, vSolarUv.y);
          solarBody = mix(0.54, solarBody, solarTip);
          solarCore *= solarTip;
          vec3 solarColor = mix(vec3(1.0, 0.055, 0.003), vec3(1.0, 0.43, 0.018), solarBody);
          solarColor = mix(solarColor, vec3(1.0, 0.79, 0.28), solarCore * 0.68);
          diffuseColor.rgb = solarColor;`).replace(`#include <roughnessmap_fragment>`,`#include <roughnessmap_fragment>
          roughnessFactor *= 0.76 + (1.0 - solarBody) * 0.24;`).replace(`#include <emissivemap_fragment>`,`#include <emissivemap_fragment>
          totalEmissiveRadiance += solarColor * (0.36 + solarBody * 0.36)
            + vec3(1.0, 0.60, 0.13) * solarCore * 0.34;`)};let i=new x({name:`Solar_Arcs`,transparent:!0,depthWrite:!1,side:2,toneMapped:!1,uniforms:{solarTime:e},vertexShader:`#include <common>
      #include <logdepthbuf_pars_vertex>
      attribute vec3 end;
      attribute float side;
      attribute float along;
      attribute float width;
      attribute float arc;
      varying float vSide;
      varying float vArc;
      void main() {
        vec4 startView = modelViewMatrix * vec4(position, 1.0);
        vec4 endView = modelViewMatrix * vec4(end, 1.0);
        vec2 delta = endView.xy - startView.xy;
        float distance = length(delta);
        vec2 perpendicular = distance > 0.00001 ? vec2(-delta.y, delta.x) / distance : vec2(1.0, 0.0);
        vec4 point = mix(startView, endView, along);
        point.xy += perpendicular * side * width;
        gl_Position = projectionMatrix * point;
        #include <logdepthbuf_vertex>
        vSide = side;
        vArc = arc;
      }`,fragmentShader:`#include <logdepthbuf_pars_fragment>
      uniform float solarTime;
      varying float vSide;
      varying float vArc;
      void main() {
        float life = mix(1.35, 1.55, vArc);
        float age = mod(solarTime + vArc * 1.25, mix(2.1, 2.75, vArc));
        float fade = smoothstep(0.0, 0.15, age) * (1.0 - smoothstep(life * 0.63, life, age));
        float core = 1.0 - smoothstep(0.22, 0.50, abs(vSide));
        float halo = 1.0 - smoothstep(0.28, 1.0, abs(vSide));
        #include <logdepthbuf_fragment>
        gl_FragColor = vec4(mix(vec3(1.0, 0.36, 0.045), vec3(1.0, 0.95, 0.72), core),
          max(core, halo * 0.75) * fade);
        #include <colorspace_fragment>
      }`});return{materials:r,update(t){t>0&&Number.isFinite(t)&&(e.value+=Math.min(t,.1))},createEffect(t){let n=ke(t,i,e),r=q(t,{kind:`smoke`,color:16746025,secondaryColor:16759631,capacity:18,interval:.1,life:1.5,size:.065,speed:.025,rise:.04,minV:.1,maxV:.93,opacity:.48,spread:.095,orbit:.9,stretch:1.4,rotationSpeed:.5}),a=q(t,{kind:`glint`,color:16772269,secondaryColor:16755001,capacity:14,interval:.085,life:.7,size:.065,speed:.085,rise:.055,minV:.12,maxV:.9,opacity:1,spread:.11,orbit:1.4,stretch:1.1,rotationSpeed:.75}),o=new u;o.name=`Solar_Corona`,o.visible=!1,o.add(n.object,r.object,a.object);let s=!1;return{object:o,setActive(e){s||(o.visible=e,n.setActive(e),r.setActive(e),a.setActive(e))},update(e){s||(n.update(e),r.update(e),a.update(e))},dispose(){s||(s=!0,o.visible=!1,n.dispose(),r.dispose(),a.dispose(),o.removeFromParent())}}},dispose(){Object.values(r).forEach(e=>e.dispose()),i.dispose(),n.dispose()}}}var je=Math.PI*2;function Me(){let e=X(`abyssMap`);return e.wrapS=r,e.magFilter=O,e.minFilter=F,e.generateMipmaps=!0,e.anisotropy=4,e}function Ne(){let n=Me(),r={value:0},i=new B(W(`black`)),a=new B(W(`blue`)),o=new B(W(`cyan/1`)),s={matte:new j({map:n,roughness:.59,metalness:.2}),velvet:new t({map:n,roughness:.91,sheen:.6,sheenColor:a,sheenRoughness:.8}),satin:new t({map:n,roughness:.28,metalness:.18,clearcoat:.4,clearcoatRoughness:.25})};for(let[e,t]of Object.entries(s))t.name=`Tail_Abyss_`+e,t.customProgramCacheKey=()=>`tail-abyss-`+e+`-v1`,t.onBeforeCompile=e=>{e.uniforms.abyssTime=r,e.uniforms.abyssBlack={value:i},e.uniforms.abyssBlue={value:a},e.uniforms.abyssCyan={value:o},e.fragmentShader=`uniform float abyssTime;
        uniform vec3 abyssBlack;
        uniform vec3 abyssBlue;
        uniform vec3 abyssCyan;
      `+e.fragmentShader.replace(`#include <map_fragment>`,`
          vec4 abyssField = texture2D(map, vMapUv);
          vec3 abyssView = normalize(vViewPosition);
          vec4 abyssBack = texture2D(map, vMapUv
            + abyssView.xy * vec2(0.018, 0.012) * abyssField.r);
          float abyssSteps = floor(abyssBack.g * 5.0) / 5.0;
          vec3 abyssTone = mix(abyssBlack * 0.33, abyssBlue * 0.3, abyssSteps);
          abyssTone = mix(abyssBlack * 1.2, abyssTone, abyssField.r);
          diffuseColor.rgb *= mix(abyssTone, abyssBlue * 0.63, abyssField.b * 0.72);
          float abyssFlow = fract(abyssBack.g * 2.2 - abyssTime * 0.36);
          float abyssLight = (1.0 - smoothstep(0.035, 0.14, abs(abyssFlow - 0.46)))
            * abyssField.r * abyssBack.g;`).replace(`#include <emissivemap_fragment>`,`#include <emissivemap_fragment>
          totalEmissiveRadiance += abyssBlue * abyssField.b * 0.52
            + abyssCyan * abyssLight * 0.7;`)};let c=new P(1),u=new j({color:16777215,roughness:.37,metalness:.38,emissive:W(`blue/-1`),emissiveIntensity:.16,flatShading:!0});u.name=`Abyss_Gravity_Shards`;let d=new B(W(`night`)),f=new B(W(`cyan/2`)),m=!1;return{materials:s,update(e){!m&&e>0&&Number.isFinite(e)&&(r.value+=Math.min(e,.1))},createEffect(t){let n=ee(t),i=new e(c,u,30);i.name=`Abyss_Three_Gravity_Streams`,i.instanceMatrix.setUsage(p),i.frustumCulled=!1,i.count=0,i.visible=!1;let a=[.21,.49,.78].map((e,t)=>({v:e,u:t===1?.7-Math.sin(e*11+1)*.075:.2+Math.sin(e*14)*.09,center:new V,normal:new V,tangent:new V,cross:new V})),o=Array.from({length:30},(e,t)=>({stream:Math.floor(t/10),offset:t%10/10,returns:t%10%3==0})),s=new V,m=new V,h=new H,g=new l,v=new l,y=new V(.37,.81,.45).normalize(),b=new V,x=new V,S=new B,C=!1,w=!1;function T(){n.update();for(let e of a)n.spine(e.v,s,e.tangent),n.sample(e.v,e.u,e.center,e.normal),e.tangent.addScaledVector(e.normal,-e.tangent.dot(e.normal)),e.tangent.lengthSq()<1e-8&&(m.set(+(Math.abs(e.normal.y)>.9),Math.abs(e.normal.y)>.9?0:1,0),e.tangent.crossVectors(m,e.normal)),e.tangent.normalize(),e.cross.crossVectors(e.normal,e.tangent).normalize();let e=0;for(let t=0;t<o.length;t++){let s=o[t],c=a[s.stream],l=r.value/4.4+s.offset+s.stream*.17,u=l-Math.floor(l),p=1,m=1,C=0;if(u<.68)C=u/.68,p=(1-C)**.88,m=_.smoothstep(u,0,.04)*(1-_.smoothstep(u,.56,.68));else if(s.returns&&u>.76){let e=(u-.76)/.24;p=_.smoothstep(e,0,1),C=1-p,m=_.smoothstep(e,0,.23)*(1-_.smoothstep(e,.64,1))}else continue;if(m<.02)continue;let w=s.stream*je/3+C*je*1.2,T=n.size*(.23+s.stream*.014)*p;x.copy(c.center).addScaledVector(c.tangent,Math.cos(w)*T).addScaledVector(c.cross,Math.sin(w)*T).addScaledVector(c.normal,n.size*.075*p),v.setFromAxisAngle(y,r.value*1.4+t*.61),g.copy(n.rotation).multiply(v);let E=n.size*(.033+s.stream*.004+t%2*.003)*m;b.set(E,E*1.9,E*.7),h.compose(x,g,b),i.setMatrixAt(e,h),S.copy(d).lerp(f,s.returns&&u>.76?.98:.67),i.setColorAt(e++,S)}i.count=e,i.instanceMatrix.needsUpdate=!0,i.instanceColor&&(i.instanceColor.needsUpdate=!0)}return{object:i,setActive(e){w||C===e||(C=e,i.visible=e,i.count=0,e&&T())},update(e){C&&!w&&e>0&&Number.isFinite(e)&&T()},dispose(){w||(w=!0,i.removeFromParent(),i.dispose())}}},dispose(){m||(m=!0,Object.values(s).forEach(e=>e.dispose()),n.dispose(),c.dispose(),u.dispose())}}}var Pe=e=>{let t=Math.sin(e*97.3+137.1)*43758.5453;return t-Math.floor(t)},Fe=`
  uniform float nightmareTime;
  uniform vec3 nightmareWhite;
  uniform vec3 nightmareIris;
  uniform vec3 nightmareDark;
  vec3 nightmareEye(vec2 p, float seed, out float cover) {
    float phase = fract(nightmareTime / (3.8 + seed * 1.7) + seed * 0.89);
    float blink = smoothstep(0.84, 0.9, phase) * (1.0 - smoothstep(0.955, 1.0, phase));
    float opening = 0.055 + (1.0 - blink) * 0.945;
    float lid = pow(max(0.0, 1.0 - p.x * p.x), 0.7) * opening * 0.68;
    cover = (1.0 - smoothstep(max(0.0, lid - 0.055), lid + 0.018, abs(p.y)))
      * (1.0 - smoothstep(0.94, 1.055, abs(p.x)));
    float tick = floor(nightmareTime * 1.3 + seed * 5.0);
    float glance = sin(tick * 2.45 + seed * 13.0) * 0.2;
    vec2 irisPoint = p - vec2(glance, sin(nightmareTime * 0.9 + seed * 7.0) * 0.055);
    float iris = 1.0 - smoothstep(0.3, 0.38, length(irisPoint));
    float irisAngle = 0.0;
    if (dot(irisPoint, irisPoint) > 1e-10) irisAngle = atan(irisPoint.y, irisPoint.x);
    float stripes = 0.68 + sin(irisAngle * 17.0) * 0.18;
    float dome = sqrt(max(0.0, 1.0 - p.x * p.x - p.y * p.y));
    vec3 color = nightmareWhite * (0.72 + dome * 0.28);
    color = mix(color, nightmareIris * stripes, iris);
    float pupil = (1.0 - smoothstep(0.065, 0.11, abs(irisPoint.x)))
      * (1.0 - smoothstep(0.24, 0.31, abs(irisPoint.y)));
    color = mix(color, nightmareDark * 0.22, pupil);
    float glint = 1.0 - smoothstep(0.045, 0.1, length(irisPoint - vec2(-0.1, 0.11)));
    return mix(color, nightmareWhite * 1.4, glint * iris);
  }
`;function Ie(){let e=X(`nightmareMap`);return e.wrapS=r,e.magFilter=O,e.minFilter=F,e.generateMipmaps=!0,e.anisotropy=4,e}function Le(){let n=Ie(),r={value:0},i=new B(W(`night`)).lerp(new B(W(`sea-green/-2`)),.22),a=new B(W(`white`)),o=new B(W(`sea-green/1`)).lerp(new B(W(`cyan`)),.22),c={matte:new j({map:n,roughness:.67}),velvet:new t({map:n,roughness:.95,sheen:.44,sheenColor:o,sheenRoughness:.92}),satin:new t({map:n,roughness:.28,clearcoat:.43,clearcoatRoughness:.25})};function u(e){e.uniforms.nightmareTime=r,e.uniforms.nightmareWhite={value:a},e.uniforms.nightmareIris={value:o},e.uniforms.nightmareDark={value:i}}for(let[e,t]of Object.entries(c))t.name=`Tail_Nightmare_`+e,t.customProgramCacheKey=()=>`tail-nightmare-`+e+`-v1`,t.onBeforeCompile=e=>{u(e),e.fragmentShader=Fe+e.fragmentShader.replace(`#include <map_fragment>`,`
          vec4 nightmareField = texture2D(map, vMapUv);
          float nightmareCover;
          vec3 nightmareColor = nightmareEye(nightmareField.rg * 2.0 - 1.0,
            nightmareField.a, nightmareCover);
          nightmareCover *= nightmareField.b;
          float nightmareSkin = 0.75 + sin(vMapUv.y * 23.0 + nightmareTime * 0.65) * 0.16;
          diffuseColor.rgb *= mix(nightmareDark * nightmareSkin, nightmareColor, nightmareCover);`).replace(`#include <roughnessmap_fragment>`,`#include <roughnessmap_fragment>
          roughnessFactor = mix(roughnessFactor, max(0.17, roughnessFactor * 0.3), nightmareCover);`).replace(`#include <emissivemap_fragment>`,`#include <emissivemap_fragment>
          totalEmissiveRadiance += nightmareColor * nightmareCover * 0.24;`)};let f=new b(2,2);f.setAttribute(`nightmareSeed`,new C(Float32Array.from({length:8},(e,t)=>Pe(t+37)),1));let m=new d(new Uint8Array([255,255,255,255]),1,1);m.needsUpdate=!0;let h=new s({map:m,transparent:!0,depthWrite:!1,toneMapped:!1,opacity:.98});h.name=`Nightmare_Floating_Eyes`,h.customProgramCacheKey=()=>`nightmare-floating-eyes-v1`,h.onBeforeCompile=e=>{u(e),e.vertexShader=`attribute float nightmareSeed; varying float vNightmareSeed;
`+e.vertexShader.replace(`#include <begin_vertex>`,`#include <begin_vertex>
        vNightmareSeed = nightmareSeed;`).replace(`#include <project_vertex>`,`
          vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
          mvPosition.xy += transformed.xy * vec2(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz));
          gl_Position = projectionMatrix * mvPosition;`),e.fragmentShader=Fe+`varying float vNightmareSeed;
`+e.fragmentShader.replace(`#include <map_fragment>`,`
        float eyeCover;
        vec3 eyeColor = nightmareEye(vMapUv * 2.0 - 1.0, vNightmareSeed, eyeCover);
        diffuseColor.rgb *= eyeColor;
        diffuseColor.a *= eyeCover;
        if (diffuseColor.a < 0.015) discard;`)};let g=!1;return{materials:c,update(e){!g&&e>0&&Number.isFinite(e)&&(r.value+=Math.min(e,.1))},createEffect(t){let n=ee(t),i=new e(f,h,8);i.name=`Nightmare_Eight_Watching_Eyes`,i.frustumCulled=!1,i.instanceMatrix.setUsage(p),i.count=0,i.visible=!1;let a=new V,o=new V,s=new l,c=new H,u=[[.2,-.035,.225,.09],[.59,.075,-.205,.035],[.35,-.235,.025,.02],[.78,.23,-.035,.08],[.66,-.175,.155,-.135],[.28,.16,-.135,-.16],[.48,.025,.065,.255],[.84,.07,-.045,-.245]],d=!1,m=!1;function g(){n.update();for(let e=0;e<8;e++){let[t,l,d,f]=u[e];n.spine(t,a),a.x+=n.size*(l+Math.sin(r.value*(.32+e*.031)+e*1.7)*.018),a.y+=n.size*(d+Math.cos(r.value*.48+e*2.17)*.014),a.z+=n.size*(f+Math.sin(r.value*.39+e*.8)*.018);let p=n.size*(.085+e%3*.013);o.set(p,p*.77,p),c.compose(a,s,o),i.setMatrixAt(e,c)}i.count=8,i.instanceMatrix.needsUpdate=!0}return{object:i,setActive(e){m||d===e||(d=e,i.visible=e,i.count=0,e&&g())},update(e){d&&!m&&e>0&&Number.isFinite(e)&&g()},dispose(){m||(m=!0,i.removeFromParent(),i.dispose())}}},dispose(){g||(g=!0,Object.values(c).forEach(e=>e.dispose()),n.dispose(),m.dispose(),f.dispose(),h.dispose())}}}function Re(){let e=X(`demonArmor`);return e.wrapS=r,e.magFilter=O,e.minFilter=F,e.generateMipmaps=!0,e.anisotropy=4,e}function ze(){let n=Re(),r={value:0},i=new B(W(`black`)).lerp(new B(W(`dark-grey`)),.22),a=new B(W(`red`)).lerp(new B(W(`crimson/1`)),.45),o=new B(W(`violet/1`)),s={matte:new j({map:n,roughness:.61,metalness:.5}),velvet:new t({map:n,roughness:.94,metalness:.12,sheen:.6,sheenColor:o,sheenRoughness:.83}),satin:new t({map:n,roughness:.25,metalness:.56,clearcoat:.4,clearcoatRoughness:.21})};for(let[e,t]of Object.entries(s))t.name=`Tail_Demon_`+e,t.customProgramCacheKey=()=>`tail-demon-`+e+`-v1`,t.onBeforeCompile=e=>{e.uniforms.demonTime=r,e.uniforms.demonDark={value:i},e.uniforms.demonRed={value:a},e.uniforms.demonViolet={value:o},e.vertexShader=`varying float vDemonScale;
`+e.vertexShader.replace(`#include <uv_vertex>`,`#include <uv_vertex>
          vDemonScale = length(modelMatrix[0].xyz);`),e.fragmentShader=`uniform float demonTime;
        uniform vec3 demonDark;
        uniform vec3 demonRed;
        uniform vec3 demonViolet;
        varying float vDemonScale;
      `+e.fragmentShader.replace(`#include <map_fragment>`,`
          vec4 demonPlate = texture2D(map, vMapUv);
          float demonPulse = pow(max(0.0, sin(demonTime * 2.7 - demonPlate.b * 6.28318530718)), 4.0);
          diffuseColor.rgb *= mix(demonDark * (0.67 + demonPlate.a * 0.65),
            demonRed * (0.35 + demonPulse * 0.25), demonPlate.g);
          float demonHeight = demonPlate.a * 0.019 - demonPlate.g * 0.008;`).replace(`#include <normal_fragment_maps>`,`#include <normal_fragment_maps>
          vec3 demonDx = dFdx(-vViewPosition), demonDy = dFdy(-vViewPosition);
          vec3 demonR1 = cross(demonDy, normal), demonR2 = cross(normal, demonDx);
          float demonDet = dot(demonDx, demonR1);
          vec3 demonGradient = sign(demonDet)
            * (dFdx(demonHeight) * demonR1 + dFdy(demonHeight) * demonR2);
          normal = normalize(max(abs(demonDet), 1e-10) * normal - demonGradient * vDemonScale);`).replace(`#include <clearcoat_normal_fragment_maps>`,`#include <clearcoat_normal_fragment_maps>
          #ifdef USE_CLEARCOAT
            clearcoatNormal = normal;
          #endif`).replace(`#include <emissivemap_fragment>`,`#include <emissivemap_fragment>
          float demonRim = pow(1.0 - abs(dot(normal, normalize(vViewPosition))), 2.5);
          totalEmissiveRadiance += demonRed * demonPlate.g * (0.16 + demonPulse * 1.55)
            + demonViolet * demonRim * demonPlate.r * 0.3;`)};let c=new T(1,2,4,1);c.setAttribute(`demonBladeSeed`,new C(Float32Array.from({length:12},(e,t)=>t/12),1));let u=new j({color:16777215,roughness:.25,metalness:.6,flatShading:!0});u.name=`Demon_Twelve_Solid_Blades`,u.customProgramCacheKey=()=>`demon-solid-blades-v1`,u.onBeforeCompile=e=>{e.uniforms.demonTime=r,e.uniforms.demonDark={value:i},e.uniforms.demonRed={value:a},e.uniforms.demonViolet={value:o},e.vertexShader=`attribute float demonBladeSeed;
      varying float vDemonBladeSeed; varying vec2 vDemonBladeUv;
`+e.vertexShader.replace(`#include <begin_vertex>`,`#include <begin_vertex>
        vDemonBladeSeed = demonBladeSeed; vDemonBladeUv = uv;`),e.fragmentShader=`uniform float demonTime;
      uniform vec3 demonDark; uniform vec3 demonRed; uniform vec3 demonViolet;
      varying float vDemonBladeSeed; varying vec2 vDemonBladeUv;
`+e.fragmentShader.replace(`#include <color_fragment>`,`#include <color_fragment>
        float bladeStripe = 1.0 - smoothstep(0.025, 0.075,
          abs(fract(vDemonBladeUv.x * 4.0) - 0.5));
        diffuseColor.rgb *= mix(demonDark, demonRed * 0.6, bladeStripe);`).replace(`#include <emissivemap_fragment>`,`#include <emissivemap_fragment>
        float bladePulse = pow(max(0.0,
          sin(demonTime * 2.7 - vDemonBladeSeed * 6.28318530718)), 4.0);
        float bladeRim = pow(1.0 - abs(dot(normal, normalize(vViewPosition))), 2.0);
        totalEmissiveRadiance += demonRed * bladeStripe * (0.22 + bladePulse * 1.8)
          + demonViolet * bladeRim * 0.45;`)};let d=!1;return{materials:s,update(e){!d&&e>0&&Number.isFinite(e)&&(r.value+=Math.min(e,.1))},createEffect(t){let n=ee(t),r=new e(c,u,12);r.name=`Demon_Surface_Mounted_Spikes`,r.instanceMatrix.setUsage(p),r.frustumCulled=!1,r.count=0,r.visible=!1;let i=new V,a=new V,o=new V,s=new V,d=new V,f=new V,m=new V,h=new V,g=new V,_=new V,v=new l,y=new H,b=new H,x=Array.from({length:12},(e,t)=>({v:.16+Math.floor(t/3)*.205,u:t%3/3+Math.floor(t/3)%2/6,length:.105+t%3*.012})),S=!1,C=!1;function w(){n.update();for(let e=0;e<12;e++){let t=x[e];n.sample(t.v,t.u,o,s),n.spine(t.v,d,f),m.subVectors(o,d);let c=m.length();s.lengthSq()<1e-8&&s.copy(m).normalize(),s.dot(m)<0&&s.negate(),h.copy(f).addScaledVector(s,-f.dot(s)),h.lengthSq()<1e-8&&(_.set(+(Math.abs(s.y)>.9),Math.abs(s.y)>.9?0:1,0),h.crossVectors(_,s)),h.normalize(),g.crossVectors(h,s).normalize(),b.makeBasis(h,s,g),v.setFromRotationMatrix(b);let l=Math.max(n.size*.008,Math.min(n.size*.023,c*.42)),u=Math.min(c*.24,n.size*.003+l*l/Math.max(c*2,n.size*.001)),p=n.size*t.length;i.copy(o).addScaledVector(s,p*.5-u),a.set(l,p*.5,l*.62),y.compose(i,v,a),r.setMatrixAt(e,y)}r.count=12,r.instanceMatrix.needsUpdate=!0}return{object:r,setActive(e){C||S===e||(S=e,r.visible=e,r.count=0,e&&w())},update(e){S&&!C&&e>0&&Number.isFinite(e)&&w()},dispose(){C||(C=!0,r.removeFromParent(),r.dispose())}}},dispose(){d||(d=!0,Object.values(s).forEach(e=>e.dispose()),n.dispose(),c.dispose(),u.dispose())}}}var Be=Math.PI*2,Ve=3,He=.34,Ue=[0,2,4],We=[0,2,1],Ge=.07,Ke=.03,qe=6,Je=.06,Ye=6,Xe=6,Ze=.5,Qe=Ue.length*15+18,$e=0,et=1,tt=2,nt=[{colour:`cyan`,v:.35,offset:[-.2,-.08,0],yaw:-.2},{colour:`hot-pink`,v:1,offset:[.2,-.08,.06],yaw:-.45},{colour:`yellow`,v:.6,offset:[-.02,.36,-.06],yaw:-.3}],rt=-.32,it=`
  uniform float portalTime;
  uniform vec3 portalOpen;
  uniform vec3 portalCyan;
  uniform vec3 portalPink;
  uniform vec3 portalGold;
  vec3 portalTint(float index) {
    return index < 0.5 ? portalCyan : (index < 1.5 ? portalPink : portalGold);
  }
  float portalOpenOf(float index) {
    return index < 0.5 ? portalOpen.x : (index < 1.5 ? portalOpen.y : portalOpen.z);
  }
`,at=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  attribute float portalIndex;
  varying vec2 vDiscPoint;
  varying float vDiscIndex;
  void main() {
    vDiscPoint = position.xy;
    vDiscIndex = portalIndex;
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
    #include <logdepthbuf_vertex>
  }
`,ot=`
  #include <logdepthbuf_pars_fragment>
  ${it}
  varying vec2 vDiscPoint;
  varying float vDiscIndex;
  void main() {
    vec3 tint = portalTint(vDiscIndex);
    float open = portalOpenOf(vDiscIndex);
    // Окно раскрывается от середины: в покое горит узкая воронка, вокруг
    // неё тёмная заслонка с медленными витками.
    float iris = mix(0.5, 1.0, open);
    float radius = length(vDiscPoint);
    float depth = radius / iris;
    float angle = atan(vDiscPoint.y, vDiscPoint.x);
    float spin = portalTime * (1.3 + open * 2.4) + vDiscIndex * 2.1;
    float arms = pow(0.5 + 0.5 * sin(angle * 3.0 + log(depth + 0.04) * 5.5 + spin * 2.0), 2.2);
    vec3 colour = mix(vec3(0.02, 0.0, 0.07), tint * 0.85, arms * smoothstep(0.08, 0.85, depth));
    colour = mix(colour, tint * 1.15 + 0.08, smoothstep(0.8, 1.0, depth) * 0.85);
    // Открытое окно светится изнутри: с той стороны уже летит шарик.
    colour += tint * (1.0 - smoothstep(0.0, 0.35, depth)) * open * 0.7;
    float shutterLines = pow(0.5 + 0.5 * sin(angle * 5.0 - radius * 9.0 + spin * 0.6), 4.0);
    vec3 shutter = vec3(0.03, 0.01, 0.08) + tint * (0.1 + shutterLines * 0.18);
    float edge = 1.0 - smoothstep(0.0, 0.07, abs(radius - iris));
    colour = mix(shutter, colour, 1.0 - smoothstep(iris - 0.015, iris + 0.015, radius));
    colour = mix(colour, tint * 1.2 + 0.12, edge * (1.0 - open) * 0.9);
    #include <logdepthbuf_fragment>
    gl_FragColor = vec4(colour, 1.0);
    #include <colorspace_fragment>
  }
`,st=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  attribute vec3 spriteStart;
  attribute vec3 spriteEnd;
  attribute vec4 spriteShape;
  attribute vec3 spriteTint;
  attribute vec4 spriteClip;
  varying vec2 vSpriteUv;
  varying vec4 vSpriteShape;
  varying vec3 vSpriteTint;
  varying float vSpriteLength;
  varying float vSpriteClip;
  void main() {
    vSpriteUv = position.xy;
    vSpriteShape = spriteShape;
    vSpriteTint = spriteTint;
    // Оси экрана в пространстве группы: полоска всегда лежит лицом к камере.
    vec3 right = normalize(vec3(modelViewMatrix[0][0], modelViewMatrix[1][0], modelViewMatrix[2][0]));
    vec3 up = normalize(vec3(modelViewMatrix[0][1], modelViewMatrix[1][1], modelViewMatrix[2][1]));
    vec3 delta = spriteEnd - spriteStart;
    vec2 screen = vec2(dot(delta, right), dot(delta, up));
    float span = length(screen);
    vec2 along = span > 0.000001 ? screen / span : vec2(0.0, 1.0);
    vec2 across = vec2(along.y, -along.x);
    float width = spriteShape.x;
    vSpriteLength = span / max(width, 0.000001);
    vec2 offset = along * position.y * (span + width) + across * position.x * width;
    vec3 corner = mix(spriteStart, spriteEnd, 0.5) + right * offset.x + up * offset.y;
    // Плоскость окна режет шарик: за ней он уже по ту сторону портала.
    vSpriteClip = dot(spriteClip.xyz, corner) + spriteClip.w;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(corner, 1.0);
    #include <logdepthbuf_vertex>
  }
`,ct=`
  #include <logdepthbuf_pars_fragment>
  varying vec2 vSpriteUv;
  varying vec4 vSpriteShape;
  varying vec3 vSpriteTint;
  varying float vSpriteLength;
  varying float vSpriteClip;
  void main() {
    if (vSpriteClip < 0.0) discard;
    float glow;
    float core;
    if (vSpriteShape.z > 1.5) {
      // Шарик плотный, как стеклянная бусина: на светлом небе дымка бы растаяла.
      vec2 p = vSpriteUv * 2.0;
      float r = length(p);
      float body = 1.0 - smoothstep(0.42, 0.5, r);
      glow = max(body, exp(-r * r * 4.0) * 0.75 * (1.0 - smoothstep(0.8, 1.0, r)));
      core = body * (1.0 - smoothstep(0.0, 0.3, length(p - vec2(-0.13, 0.15))));
    } else if (vSpriteShape.z < 0.5) {
      float r = length(vSpriteUv) * 2.0;
      glow = exp(-r * r * 3.0) * (1.0 - smoothstep(0.8, 1.0, r));
      core = exp(-r * r * 14.0);
    } else {
      float along = vSpriteUv.y * (vSpriteLength + 1.0);
      float d = length(vec2(max(abs(along) - vSpriteLength * 0.5, 0.0), vSpriteUv.x)) * 2.0;
      float head = smoothstep(-0.5 * vSpriteLength - 0.5, 0.5 * vSpriteLength + 0.5, along);
      glow = exp(-d * d * 2.4) * (1.0 - smoothstep(0.85, 1.0, d)) * mix(0.4, 1.0, head);
      core = exp(-d * d * 10.0) * head;
    }
    float alpha = glow * vSpriteShape.y;
    if (alpha < 0.006) discard;
    #include <logdepthbuf_fragment>
    // Насыщенный край и лишь чуть светлее сердцевина: бледное ядро на светлом
    // небе сливается с фоном. Тональная кривая выбелила бы цвет, она выключена.
    vec3 colour = mix(vSpriteTint * 0.55, vSpriteTint, smoothstep(0.25, 0.9, glow));
    colour = mix(colour, vec3(1.0), core * vSpriteShape.w);
    gl_FragColor = vec4(colour, 1.0);
    #include <colorspace_fragment>
    // Часть света складывается с фоном: горит на тёмном и не тает на светлом.
    gl_FragColor = vec4(gl_FragColor.rgb * alpha, alpha * 0.92);
  }
`;function lt(e,t,n){let r=Math.max(0,e+t),i=Math.floor(r/Ve);return n.step=i,n.phase=r-i*Ve,n.source=We[i%3],n.target=(n.source+1)%3,n.next=We[(i+1)%3],n}function ut(e,t,n){let r=_.smoothstep,i=0,a=0,o=0,s=(e,t)=>{e===0?i=Math.max(i,t):e===1?a=Math.max(a,t):o=Math.max(o,t)};for(let t of Ue){let{phase:i,source:a,target:o,next:c}=lt(e,t,n);s(a,1-r(i,He,.79)),s(o,1-r(i,.49,1.29)),s(c,r(i,2.2,Ve)),s((c+1)%3,r(i,2.78,Ve))}t.set(i,a,o)}function dt(){let t={value:0},r={value:new V},i=nt.map(e=>new B(W(e.colour))),a={portalTime:t,portalOpen:r,portalCyan:{value:i[0]},portalPink:{value:i[1]},portalGold:{value:i[2]}},o=G(`Portal`,t,`
    float portalTip = 1.0 - smoothstep(0.965, 1.0, vVoidUv.y);
    float portalAround = abs(fract(vVoidUv.x) - 0.5);
    float portalFlow = vVoidUv.y * 10.0 + portalAround * 1.6 - voidTime * 0.85;
    float portalBand = abs(fract(portalFlow) - 0.5);
    float portalChevron = (1.0 - smoothstep(0.045, 0.1, portalBand)) * portalTip;
    float portalWhich = mod(floor(portalFlow), 3.0);
    vec3 portalHue = portalWhich < 0.5 ? vec3(0.0, 0.43, 0.84)
      : (portalWhich < 1.5 ? vec3(1.0, 0.0, 0.52) : vec3(0.91, 0.61, 0.03));
    float portalSwirl = 0.5 + 0.5 * sin((vVoidUv.x * 2.0 - vVoidUv.y * 7.0 + voidTime * 0.35) * 6.2832);
    diffuseColor.rgb = mix(vec3(0.035, 0.01, 0.11), vec3(0.15, 0.045, 0.34), portalSwirl * 0.7);
    diffuseColor.rgb = mix(diffuseColor.rgb, portalHue, portalChevron * 0.8);
  `,`
    totalEmissiveRadiance += portalHue * portalChevron * 0.75
      + vec3(0.2, 0.04, 0.42) * portalSwirl * 0.1 * portalTip;
  `),s=new z(1,.13,8,40),d=new k(.9,40);for(let e of[s,d])e.setAttribute(`portalIndex`,new C(new Float32Array([0,1,2]),1));let f=new j({color:16777215,roughness:.3,metalness:.45,toneMapped:!1});f.name=`Portal_Rims`,f.customProgramCacheKey=()=>`portal-rims-v4`,f.onBeforeCompile=e=>{Object.assign(e.uniforms,a),e.vertexShader=`attribute float portalIndex;
varying float vPortalIndex;
varying float vPortalAround;
`+e.vertexShader.replace(`#include <begin_vertex>`,`#include <begin_vertex>
        vPortalIndex = portalIndex;
        vPortalAround = uv.x;`),e.fragmentShader=it+`varying float vPortalIndex;
varying float vPortalAround;
`+e.fragmentShader.replace(`#include <color_fragment>`,`#include <color_fragment>
          vec3 rimTint = portalTint(vPortalIndex);
          float rimOpen = portalOpenOf(vPortalIndex);
          diffuseColor.rgb *= rimTint * 0.4;`).replace(`#include <emissivemap_fragment>`,`#include <emissivemap_fragment>
          // По ободу бегут три светлых отрезка, у открытого окна — быстрее.
          float rimRun = pow(0.5 + 0.5 * sin((vPortalAround * 3.0 - portalTime * (0.5 + rimOpen * 1.2)) * 6.2832), 6.0);
          totalEmissiveRadiance += rimTint * (0.45 + rimOpen * 0.5 + rimRun * (0.3 + rimOpen * 0.5));`)};let h=new x({name:`Portal_Vortices`,uniforms:a,vertexShader:at,fragmentShader:ot,side:2,toneMapped:!1}),g=new x({name:`Portal_Light_Orbs`,vertexShader:st,fragmentShader:ct,transparent:!0,depthWrite:!1,side:2,forceSinglePass:!0,toneMapped:!1,blending:5,blendEquation:100,blendSrc:201,blendDst:205}),_={phase:0,source:0,target:0,next:0,step:0},b=!1;return{materials:o,update(e){b||!(e>0)||!Number.isFinite(e)||(t.value+=Math.min(e,.1),ut(t.value,r.value,_))},createEffect(a){let o=ee(a),_=new e(s,f,3),b=new e(d,h,3),x=new m;x.setAttribute(`position`,new n([-.5,-.5,0,.5,-.5,0,-.5,.5,0,.5,.5,0],3)),x.setIndex([0,1,2,2,1,3]);let S=e=>new C(new Float32Array(Qe*e),e).setUsage(p),w=S(3),T=S(3),E=S(4),D=S(3),O=S(4);x.setAttribute(`spriteStart`,w),x.setAttribute(`spriteEnd`,T),x.setAttribute(`spriteShape`,E),x.setAttribute(`spriteTint`,D),x.setAttribute(`spriteClip`,O),x.instanceCount=0;let k=new y(x,g),A=new u;A.name=`Portal_Three_Gates_And_Light_Orbs`,_.name=`Portal_Rims`,b.name=`Portal_Vortices`,k.name=`Portal_Light_Orbs`,A.add(_,b,k),A.visible=!1,_.frustumCulled=b.frustumCulled=k.frustumCulled=!1,_.instanceMatrix.setUsage(p),b.instanceMatrix.setUsage(p),_.count=b.count=0;let j=nt.map(()=>({center:new V,normal:new V,right:new V,up:new V,rotation:new l,plane:new v})),M=nt.map(e=>new l().setFromEuler(new c(rt,e.yaw,0,`YXZ`))),N=nt.map(e=>new V(...e.offset)),P={phase:0,source:0,target:0,next:0,step:0},F=new V,I=new V,L=new V,R=new H,z=new V,B=new V,U=new V,W=[new V,new V,new V,new V],G=new v(0,0,0,1),K=0,q=1,J=!1,Y=!1;function X(e,t,n,r,i,a,o,s){K>=Qe||r<=.004||n<=0||(w.setXYZ(K,e.x,e.y,e.z),T.setXYZ(K,t.x,t.y,t.z),E.setXYZW(K,n,r,i,a),D.setXYZ(K,o.r,o.g,o.b),O.setXYZW(K,s.x,s.y,s.z,s.w),K++)}function Z(e,t,n){let{phase:r,source:i,target:a,next:o}=lt(e,t,P),s=q*Ke;if(r<He){let e=1-2*r/He,t=e>0?j[i]:j[a];return n.copy(t.center).addScaledVector(t.normal,s*Math.abs(e)),e>0?i:a}let c=j[a],l=j[o],u=(r-He)/2.66,d=1-u,f=q*.2;return W[0].copy(c.center).addScaledVector(c.normal,s),W[1].copy(W[0]).addScaledVector(c.normal,f),W[3].copy(l.center).addScaledVector(l.normal,s),W[2].copy(W[3]).addScaledVector(l.normal,f),n.copy(W[0]).multiplyScalar(d*d*d).addScaledVector(W[1],3*d*d*u).addScaledVector(W[2],3*d*u*u).addScaledVector(W[3],u*u*u),-1}function Q(){o.update(),q=o.size;let e=t.value,n=r.value;for(let e=0;e<j.length;e++){let t=j[e];o.spine(nt[e].v,F),I.copy(N[e]).multiplyScalar(q).applyQuaternion(o.rotation),t.center.copy(F).add(I),t.rotation.copy(o.rotation).multiply(M[e]),t.normal.set(0,0,1).applyQuaternion(t.rotation),t.right.set(1,0,0).applyQuaternion(t.rotation),t.up.set(0,1,0).applyQuaternion(t.rotation),t.plane.set(t.normal.x,t.normal.y,t.normal.z,-t.normal.dot(t.center));let r=n.getComponent(e);L.setScalar(q*Ge*(.9+r*.14)),R.compose(t.center,t.rotation,L),_.setMatrixAt(e,R),b.setMatrixAt(e,R)}_.count=b.count=j.length,_.instanceMatrix.needsUpdate=b.instanceMatrix.needsUpdate=!0,K=0;let a=q*Ke;for(let t=0;t<j.length;t++){let r=j[t],o=n.getComponent(t),s=q*Ge;for(let n=0;n<Ye;n++){let c=(e*(.45+o*.5)+n/Ye+t*.13)%1,l=n*Be/Ye+c*2.4+t,u=s*(1.45-c*1.15),d=s*.12;z.copy(r.center).addScaledVector(r.normal,d).addScaledVector(r.right,Math.cos(l)*u).addScaledVector(r.up,Math.sin(l)*u);let f=l-.35,p=u+s*.12;B.copy(r.center).addScaledVector(r.normal,d).addScaledVector(r.right,Math.cos(f)*p).addScaledVector(r.up,Math.sin(f)*p);let m=Math.sin(c*Math.PI);X(B,z,a*.5,m*(.5+o*.5),et,.15,i[t],G)}}for(let t of Ue){let{phase:n,source:r,target:o,step:s}=lt(e,t,P),c=n<He*.5?(We[(s+2)%3]+1)%3:o,l=i[c];if(n<He){let e=a*(1-2*n/He),t=j[r],s=j[o];z.copy(t.center).addScaledVector(t.normal,e),X(z,z,a*2.8,1,tt,.7,i[r],t.plane),z.copy(s.center).addScaledVector(s.normal,-e),X(z,z,a*2.8,1,tt,.7,i[o],s.plane)}else Z(e,t,z),X(z,z,a*2.8,1,tt,.7,l,G);let u=Z(e,t,B);for(let n=0;n<qe;n++){let r=Z(e-(n+1)*Je,t,U);if(r!==u&&r!==-1&&u!==-1)break;let i=1-n/qe,o=r>=0?j[r].plane:u>=0?j[u].plane:G;X(U,B,a*1.7*i,.95*Math.sqrt(i),et,0,l,o),B.copy(U),u=r}let d=n-He*.5;if(d>=0&&d<Ze){let e=j[o],t=d/Ze;X(e.center,e.center,q*Ge*(1.6+t*1.4),(1-t)*.55,$e,.2,i[o],G);for(let n=0;n<Xe;n++){let r=n*Be/Xe+s*1.7,c=q*.16*(1-(1-t)*(1-t));U.copy(e.center).addScaledVector(e.normal,c*.6).addScaledVector(e.right,Math.cos(r)*c).addScaledVector(e.up,Math.sin(r)*c),B.copy(U).lerp(e.center,.3),X(B,U,a*.55*(1-t),1-t,et,.3,i[o],G)}}}x.instanceCount=K,w.needsUpdate=T.needsUpdate=E.needsUpdate=!0,D.needsUpdate=O.needsUpdate=!0}return{object:A,setActive(e){Y||J===e||(J=e,A.visible=e,_.count=b.count=0,x.instanceCount=0,e&&Q())},update(e){J&&!Y&&e>0&&Number.isFinite(e)&&Q()},dispose(){Y||(Y=!0,_.dispose(),b.dispose(),x.dispose(),A.removeFromParent(),A.clear())}}},dispose(){b||(b=!0,Object.values(o).forEach(e=>e.dispose()),s.dispose(),d.dispose(),f.dispose(),h.dispose(),g.dispose())}}}var ft=8,pt=8,mt=`attribute float destructionSegment;
  uniform float destructionTime, destructionSize;`,ht=`
  float destructionPhase = mod(destructionTime, 8.0);
  float destructionDelay = destructionSegment * 0.065;
  float destructionOpen = smoothstep(0.8 + destructionDelay, 2.0 + destructionDelay, destructionPhase)
    * (1.0 - smoothstep(4.0 + destructionDelay, 5.7 + destructionDelay, destructionPhase));
  float destructionWeight = destructionSegment < 0.5 ? 0.13 : 1.0;
  vec3 destructionShift = vec3(sin(destructionSegment * 2.399963) * 0.15,
    -(0.055 + destructionSegment * 0.013), cos(destructionSegment * 2.399963) * 0.09);
  transformed += destructionShift * destructionSize * destructionOpen * destructionWeight;`;function gt(e,t){let n=(e%pt+pt)%pt,r=t*.065;return _.smoothstep(n,.8+r,2+r)*(1-_.smoothstep(n,4+r,5.7+r))}function _t(e){let t=e.index?e.toNonIndexed():e.clone(),n=t.getAttribute(`uv`),r=new Float32Array(n.count);for(let e=0;e<n.count;e+=3){let t=(n.getY(e)+n.getY(e+1)+n.getY(e+2))/3,i=Math.min(7,Math.floor(t*ft));r[e]=r[e+1]=r[e+2]=i}return t.setAttribute(`destructionSegment`,new R(r,1)),t}function vt(){let n={value:0},r={value:1},i={matte:new j({roughness:.88,metalness:.16}),velvet:new t({roughness:1,sheen:.48,sheenColor:new B(10647749),sheenRoughness:.88}),satin:new t({roughness:.36,metalness:.24,clearcoat:.22,clearcoatRoughness:.4})};for(let[e,t]of Object.entries(i))t.name=`Tail_Destruction_${e}`,t.side=2,t.customProgramCacheKey=()=>`void-destruction-segments-v1`,t.onBeforeCompile=e=>{e.uniforms.destructionTime=n,e.uniforms.destructionSize=r,e.vertexShader=`${mt}
        varying vec2 vDestructionUv;
        varying float vDestructionPart;
        ${e.vertexShader}`.replace(`#include <uv_vertex>`,`#include <uv_vertex>
vDestructionUv = uv;
vDestructionPart = destructionSegment;`).replace(`#include <displacementmap_vertex>`,`#include <displacementmap_vertex>
          ${ht}`),e.fragmentShader=`uniform float destructionTime;
        varying vec2 vDestructionUv;
        varying float vDestructionPart;
        ${e.fragmentShader}`.replace(`#include <color_fragment>`,`#include <color_fragment>
          float destructionLine = abs(fract(vDestructionUv.y * 8.0 + 0.5) - 0.5);
          float destructionEdge = 1.0 - smoothstep(0.025, 0.105, destructionLine);
          float destructionScar = pow(max(0.0, cos(vDestructionUv.x * 18.849556
            + vDestructionUv.y * 25.0 + sin(vDestructionUv.y * 19.0))), 16.0);
          float destructionTip = 1.0 - smoothstep(0.95, 1.0, vDestructionUv.y);
          float destructionPulse = 0.58 + sin(destructionTime * 1.7 + vDestructionPart * 1.1) * 0.22;
          vec3 destructionStone = mix(vec3(0.023, 0.012, 0.035), vec3(0.095, 0.050, 0.14),
            0.5 + 0.5 * sin(vDestructionPart * 2.1));
          diffuseColor.rgb = mix(destructionStone, vec3(0.17, 0.10, 0.27), destructionScar * 0.55 * destructionTip);`).replace(`#include <emissivemap_fragment>`,`#include <emissivemap_fragment>
          totalEmissiveRadiance += vec3(0.40, 0.14, 0.86)
            * (destructionEdge * 0.92 + destructionScar * 0.24) * destructionPulse * destructionTip;`)};let d=new o({depthPacking:L,side:2}),m=new f({side:2});for(let[e,t]of[[`Depth`,d],[`Distance`,m]])t.name=`Tail_Destruction_${e}`,t.customProgramCacheKey=()=>`void-destruction-segments-${e.toLowerCase()}-v1`,t.onBeforeCompile=e=>{e.uniforms.destructionTime=n,e.uniforms.destructionSize=r,e.vertexShader=`${mt}\n${e.vertexShader}`.replace(`#include <displacementmap_vertex>`,`#include <displacementmap_vertex>
          ${ht}`)};let h=new S(1,0),g=new j({color:6901888,roughness:.77,metalness:.18,emissive:4464737,emissiveIntensity:.3}),v=new s({color:9655003,side:2,transparent:!0,opacity:.72,depthWrite:!1,forceSinglePass:!0,toneMapped:!1}),b=!1;return{materials:i,update(e){!b&&e>0&&Number.isFinite(e)&&(n.value+=Math.min(e,.1))},createEffect(t){let i=t.geometry,o=_t(i),s=new E().setFromBufferAttribute(o.getAttribute(`position`)).getSize(new V).length();r.value=s;let f=ee(t),b=q(t,{kind:`flake`,color:9922003,secondaryColor:5256799,capacity:18,interval:.085,life:1.1,size:.03,speed:.09,rise:.055,gravity:.1,spread:.045,rotationSpeed:2.1,gate:()=>.35+gt(n.value,4)*.65}),x=new e(h,g,18);x.name=`Destruction_Detached_Shards`,x.instanceMatrix.setUsage(p),x.frustumCulled=!1,x.count=0;let S=new u;S.name=`Destruction_Fragments`,S.visible=!1;let C=new Float32Array(522),w=new R(C,3).setUsage(p),T=new D;T.setAttribute(`position`,w);let O=[];for(let e=0;e<3;e++)for(let t=0;t<28;t++){let n=(e*29+t)*2;O.push(n,n+1,n+2,n+1,n+3,n+2)}T.setIndex(O);let k=new y(T,v);k.name=`Destruction_Persistent_Aura`,k.frustumCulled=!1,S.add(x,b.object,k),U(S,{mesh:t,geometry:o,depth:d});let A=Array.from({length:12},()=>({cycle:-1/0,position:new V,direction:new V})),j=new V,M=new V,N=new V,P=new H,F=new a,I=new V,L=new l,z=new c,B=new V,W=new V(0,1,0),G=new V(1,0,0),K=t.frustumCulled,J=!1,Y=!1,X=t.customDepthMaterial,Z=t.customDistanceMaterial;function Q(){t.customDepthMaterial===d&&(t.customDepthMaterial=X),t.customDistanceMaterial===m&&(t.customDistanceMaterial=Z)}function $(e){let t=Math.min(7,Math.floor(e*8)),r=gt(n.value,t)*(t===0?.13:1);N.set(Math.sin(t*2.399963)*.15,-(.055+t*.013),Math.cos(t*2.399963)*.09).multiplyScalar(s*r).applyMatrix3(F)}function te(){f.update(),F.setFromMatrix4(t.matrixWorld);let e=0;for(let t=0;t<A.length;t++){let r=n.value-1-t*.135,i=Math.floor(r/pt),a=(r%pt+pt)%pt;if(a>=1.65)continue;let o=A[t];if(o.cycle!==i){o.cycle=i;let e=.1+t/A.length*.8;f.sample(e,t*.381966,o.position,o.direction),$(e),o.position.add(N)}j.copy(o.position).addScaledVector(o.direction,f.size*a*.13),j.y+=f.size*(a*.07-a*a*.11);let s=_.smoothstep(a,0,.1)*(1-_.smoothstep(a,1.1,1.65));I.setScalar(f.size*(.026+t%3*.008)*s),z.set(t*1.3+a*2.1,t*.9+a*2.7,a*1.8),L.setFromEuler(z),P.compose(j,L,I),x.setMatrixAt(e++,P)}for(let t=0;t<6;t++){let r=.16+t*.137;f.sample(r,t/3+n.value*.055,j,M),$(r),j.add(N).addScaledVector(M,f.size*(.065+Math.sin(n.value*.7+t)*.014)),I.setScalar(f.size*(.014+t%2*.006)),z.set(t+n.value*.2,t*.8,n.value*.16),L.setFromEuler(z),x.setMatrixAt(e++,P.compose(j,L,I))}for(let e=0;e<3;e++)for(let t=0;t<=28;t++){let r=t/28,i=.07+r*.89,a=e/3+r*.75+n.value*.08;f.sample(i,a,j,M),$(i),j.add(N).addScaledVector(M,f.size*(.025+Math.sin(r*Math.PI)*.027)),B.crossVectors(M,Math.abs(M.y)>.9?G:W).normalize();let o=f.size*(.004+.003*Math.sin(r*Math.PI)**2)*(.85+Math.sin(r*13-n.value*1.3+e)*.15);for(let n=0;n<2;n++){let r=((e*29+t)*2+n)*3,i=n===0?-1:1;C[r]=j.x+B.x*o*i,C[r+1]=j.y+B.y*o*i,C[r+2]=j.z+B.z*o*i}}w.needsUpdate=!0,x.count=e,x.instanceMatrix.needsUpdate=!0}return{object:S,shapesTail:!0,setActive(e){if(!Y){if(e){if(J||(X=t.customDepthMaterial,Z=t.customDistanceMaterial),t.geometry=o,t.frustumCulled=!1,t.customDepthMaterial=d,t.customDistanceMaterial=m,!J)for(let e of A)e.cycle=-1/0;J=!0,S.visible=!0,b.setActive(!0),te()}else J=!1,S.visible=!1,b.setActive(!1),x.count=0,Q(),t.geometry===o&&(t.geometry=i,t.frustumCulled=K)}},update(e){J&&!Y&&e>0&&Number.isFinite(e)&&(te(),b.update(e))},dispose(){Y||(Y=!0,J=!1,S.visible=!1,Q(),t.geometry===o&&(t.geometry=i,t.frustumCulled=K),b.dispose(),x.removeFromParent(),x.dispose(),S.removeFromParent(),o.dispose(),T.dispose())}}},dispose(){b||(b=!0,Object.values(i).forEach(e=>e.dispose()),d.dispose(),m.dispose(),h.dispose(),g.dispose(),v.dispose())}}}var yt=Math.PI*2,bt=[{v:.27,radius:.23,size:.047,speed:.87,phase:0,color:10456296},{v:.5,radius:.265,size:.057,speed:.7,phase:yt/3,color:6147289},{v:.72,radius:.3,size:.067,speed:.53,phase:yt*2/3,color:15839867}];function xt(){let e=X(`starField`);return e.name=`Cosmic_Stars_And_Nebula`,e.wrapS=r,e.magFilter=O,e.minFilter=F,e.generateMipmaps=!0,e}function St(){let e=X(`planetMap`);return e.name=`Cosmic_Planet_Bands`,e.wrapS=r,e.colorSpace=I,e.magFilter=O,e.minFilter=F,e.generateMipmaps=!0,e}function Ct(){let e=[],t=[],r=[],i=new V,a=new B,o=new B(131337),s=new B(1115937),c=new B(16741659),l=new B(16769148),u=new B(4356863),d=new B(6680319),f=new B(14875647);function p(n,o,s){let c=n.index?n.toNonIndexed():n,l=c.getAttribute(`position`);for(let n=0;n<l.count;n++)i.fromBufferAttribute(l,n),e.push(i.x,i.y,i.z),s(i,a),t.push(a.r,a.g,a.b),r.push(o);c!==n&&c.dispose(),n.dispose()}let m=new N(.57,10,6);m.scale(1,1,.72),p(m,0,(e,t)=>t.copy(o).lerp(s,Math.max(0,e.z)*.55)),p(new z(.84,.14,4,28),0,(e,t)=>{let n=Math.atan2(e.y,e.x),r=(.5+.5*Math.sin(n*5+e.z*12))**2;t.copy(c).lerp(l,r*.85)}),p(new S(.23,1),1,(e,t)=>t.copy(d).lerp(f,Math.max(0,1-Math.abs(e.z)*3)));for(let e of[-1,1]){let t=[],r=[[.13,.11],[.095,.3],[.035,.94],[0,1.22]];for(let n=0;n<r.length-1;n++){let[i,a]=r[n],[o,s]=r[n+1];for(let n=0;n<8;n++){let r=n/8*yt,c=(n+1)/8*yt,l=[Math.cos(r)*i,Math.sin(r)*i,a*e],u=[Math.cos(c)*i,Math.sin(c)*i,a*e],d=[Math.cos(r)*o,Math.sin(r)*o,s*e],f=[Math.cos(c)*o,Math.sin(c)*o,s*e];e>0?t.push(...l,...u,...d,...d,...u,...f):t.push(...l,...d,...u,...d,...f,...u)}}let i=new D;i.setAttribute(`position`,new n(t,3)),p(i,1,(e,t)=>{let n=Math.abs(e.z);t.copy(f).lerp(d,_.smoothstep(n,.12,.65)),t.lerp(u,_.smoothstep(n,.7,1.22)*.65)})}p(new z(.31,.035,3,20),1,(e,t)=>t.copy(d));let h=new D;return h.name=`Cosmic_Black_Hole_And_Quasar_Geometry`,h.setAttribute(`position`,new n(e,3)),h.setAttribute(`color`,new n(t,3)),h.setAttribute(`celestialBody`,new n(r,1)),h}function wt(){let n={value:0},r=xt(),i=St(),a={matte:new j({roughness:.75,metalness:.1}),velvet:new t({roughness:1,sheen:.75,sheenColor:new B(8742088),sheenRoughness:.85}),satin:new t({roughness:.27,metalness:.12,clearcoat:.4,clearcoatRoughness:.25})};for(let[e,t]of Object.entries(a))t.name=`Tail_Cosmic_${e}`,t.customProgramCacheKey=()=>`void-cosmic-galaxies-v1`,t.onBeforeCompile=e=>{e.uniforms.cosmicTime=n,e.uniforms.cosmicStars={value:r},e.vertexShader=`varying vec2 vCosmicUv;\n${e.vertexShader}`.replace(`#include <uv_vertex>`,`#include <uv_vertex>
vCosmicUv = uv;`),e.fragmentShader=`uniform float cosmicTime;
        uniform sampler2D cosmicStars;
        varying vec2 vCosmicUv;
        ${e.fragmentShader}`.replace(`#include <color_fragment>`,`#include <color_fragment>
          vec4 cosmicField = texture2D(cosmicStars, vCosmicUv);
          vec2 cosmicGalaxy = vec2((fract(vCosmicUv.x * 2.0 + 0.5) - 0.5) * 2.3,
            (fract(vCosmicUv.y * 3.0) - 0.5) * 2.1);
          cosmicGalaxy += (vViewPosition / max(length(vViewPosition), 0.0001)).xy * 0.04;
          float cosmicRadius = length(cosmicGalaxy);
          float cosmicAngle = atan(cosmicGalaxy.y, cosmicGalaxy.x + 0.00001);
          float cosmicArms = pow(max(0.0, 0.5 + 0.5 * cos(cosmicAngle * 2.0 + cosmicRadius * 14.0 - cosmicTime * 0.48)), 3.0);
          float cosmicDisk = (1.0 - smoothstep(0.46, 0.95, cosmicRadius)) * smoothstep(0.035, 0.20, cosmicRadius);
          float cosmicCore = 1.0 - smoothstep(0.025, 0.12, cosmicRadius);
          float cosmicTip = 1.0 - smoothstep(0.955, 1.0, vCosmicUv.y);
          float cosmicNebula = smoothstep(0.32, 0.88, cosmicField.r) * cosmicTip;
          float cosmicSpiral = cosmicArms * cosmicDisk * cosmicTip;
          float cosmicTwinkle = 0.62 + 0.38 * sin(cosmicTime * (1.1 + cosmicField.b * 1.8) + cosmicField.b * 19.0);
          float cosmicStarlight = cosmicField.g * cosmicTwinkle * cosmicTip;
          vec3 cosmicCloud = mix(vec3(0.03, 0.012, 0.08), vec3(0.13, 0.032, 0.24), cosmicNebula);
          cosmicCloud = mix(cosmicCloud, vec3(0.055, 0.22, 0.38), cosmicSpiral * 0.6);
          diffuseColor.rgb = mix(cosmicCloud, vec3(0.32, 0.20, 0.46), cosmicCore * cosmicTip * 0.65);`).replace(`#include <emissivemap_fragment>`,`#include <emissivemap_fragment>
          totalEmissiveRadiance += vec3(0.26, 0.10, 0.65) * cosmicSpiral * 0.9
            + vec3(0.12, 0.39, 0.75) * cosmicNebula * 0.24
            + vec3(0.9, 0.79, 1.0) * cosmicCore * cosmicTip * 1.35
            + vec3(0.69, 0.87, 1.0) * cosmicStarlight * 1.8;`)};let o=new N(1,12,8),d=new j({map:i,roughness:.82,emissive:3613521,emissiveIntensity:.16}),f=new z(1,.055,3,32),m=new s({color:15777161}),h=new z(1,.007,3,36),g=new s({color:9864415,transparent:!0,opacity:.34,depthWrite:!1}),_=Ct(),v=!1;return{materials:a,update(e){!v&&e>0&&Number.isFinite(e)&&(n.value+=Math.min(e,.1))},createEffect(t){let r=ee(t),i=q(t,{kind:`glint`,color:14083839,secondaryColor:10981615,capacity:24,interval:.085,life:1.35,size:.037,speed:.022,rise:.025,spread:.095,orbit:.85,rotationSpeed:.6}),a=new e(o,d,3);a.name=`Cosmic_Orbiting_Planets`,a.instanceMatrix.setUsage(p),a.frustumCulled=!1;for(let[e,t]of bt.entries())a.setColorAt(e,new B(t.color));let s=new y(f,m);s.name=`Cosmic_Planet_Ring`,s.frustumCulled=!1;let v=new e(h,g,bt.length);v.name=`Cosmic_Spine_Orbit_Paths`,v.instanceMatrix.setUsage(p),v.frustumCulled=!1;let b=new H,S=new H,C=new x({name:`Cosmic_Compact_Celestial_Bodies`,uniforms:{cosmicTime:n,blackHoleMatrix:{value:b},quasarMatrix:{value:S}},vertexShader:`#include <common>
          #include <logdepthbuf_pars_vertex>
          attribute vec3 color; attribute float celestialBody;
          uniform mat4 blackHoleMatrix; uniform mat4 quasarMatrix;
          varying vec3 vCelestialColor; varying float vCelestialBody;
          void main() {
            vCelestialColor = color; vCelestialBody = celestialBody;
            vec4 worldPosition;
            if (celestialBody < 0.5) worldPosition = blackHoleMatrix * vec4(position, 1.0);
            else worldPosition = quasarMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * viewMatrix * worldPosition;
            #include <logdepthbuf_vertex>
          }`,fragmentShader:`#include <logdepthbuf_pars_fragment>
          uniform float cosmicTime;
          varying vec3 vCelestialColor; varying float vCelestialBody;
          void main() {
            float pulse = vCelestialBody < 0.5 ? 1.0 : 0.94 + 0.06 * sin(cosmicTime * 4.5);
            #include <logdepthbuf_fragment>
            gl_FragColor = vec4(vCelestialColor * pulse, 1.0);
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }`}),w=new y(_,C);w.name=`Cosmic_Black_Hole_And_Quasar`,w.frustumCulled=!1;let T=new u;T.name=`Cosmic_Miniature_System`,T.visible=!1,T.add(a,s,v,w,i.object);let E=new V,D=new V,O=new V,k=new V,A=new V,j=new V,M=new l,N=new l,P=new c,F=new H,I=new H,L=!1,R=!1;function z(e,t,n){r.spine(e,D,k,A),j.crossVectors(k,A).normalize(),I.makeBasis(A,j,k),N.setFromRotationMatrix(I),E.copy(D).addScaledVector(A,Math.cos(t)*n).addScaledVector(j,Math.sin(t)*n)}function U(){r.update();for(let e=0;e<bt.length;e++){let t=bt[e],i=n.value*t.speed+t.phase,o=r.size*t.radius;z(t.v,i,o),O.setScalar(o),F.compose(D,N,O),v.setMatrixAt(e,F),P.set(.35+e*.24,n.value*t.speed*.65+t.phase,.25),M.setFromEuler(P).premultiply(N),O.setScalar(r.size*t.size),F.compose(E,M,O),a.setMatrixAt(e,F),e===2&&(s.position.copy(E),P.set(.85,i*.3,.33),s.quaternion.setFromEuler(P).premultiply(N),s.scale.setScalar(r.size*.105))}a.instanceMatrix.needsUpdate=!0,v.instanceMatrix.needsUpdate=!0,z(.39,.65-n.value*.31,r.size*.255),P.set(.32,0,n.value*.62),M.setFromEuler(P).premultiply(N),O.setScalar(r.size*.062),b.compose(E,M,O),z(.82,3.65+n.value*.42,r.size*.245),O.setScalar(r.size*.072),S.compose(E,N,O)}return{object:T,setActive(e){R||(L=e,T.visible=e,i.setActive(e),e&&U())},update(e){L&&!R&&e>0&&Number.isFinite(e)&&(U(),i.update(e))},dispose(){R||(R=!0,L=!1,T.visible=!1,i.dispose(),a.removeFromParent(),a.dispose(),s.removeFromParent(),v.removeFromParent(),v.dispose(),w.removeFromParent(),C.dispose(),T.removeFromParent(),T.clear())}}},dispose(){v||(v=!0,Object.values(a).forEach(e=>e.dispose()),r.dispose(),i.dispose(),o.dispose(),d.dispose(),f.dispose(),m.dispose(),h.dispose(),g.dispose(),_.dispose())}}}var Tt=Math.PI*2,Et=6.85,Dt=[.1,.41,.57],Ot=.68,kt=24,At=3,jt=25,Mt=`if (vTimeUv.y > timeRevealFront) discard;`;function Nt(e){let t=e%Et;return .02+.98*_.smoothstep(t,.4,1.6)*(1-_.smoothstep(t,4.8,6.1))}function Pt(){let e=X(`clockAtlas`);return e.name=`Time_Digits`,e.magFilter=O,e.minFilter=O,e}function Ft(){let e=new w;e.absarc(0,0,1,0,Tt,!1);let t=new i;t.absarc(0,0,Ot,0,Tt,!0),e.holes.push(t);let n=new h(e,{depth:.12,steps:1,curveSegments:24,bevelEnabled:!0,bevelThickness:.018,bevelSize:.018,bevelSegments:1});return n.translate(0,0,-.06),n.setAttribute(`timeRingIndex`,new C(new Float32Array([0,1,2]),1)),n.setAttribute(`timeRingSection`,new C(new Float32Array(Dt),1)),n}function It(e){let t=e.getAttribute(`uv`),n=e.index,r=n?.count??t.count,i=new Map;for(let e=0;e<r;e+=3)for(let r=0;r<3;r++){let a=n?n.getX(e+r):e+r,o=n?n.getX(e+(r+1)%3):e+(r+1)%3;t.getY(a)>t.getY(o)&&([a,o]=[o,a]);let s=t.getY(a),c=t.getY(o);if(c-s<1e-8)continue;let l=i.get(s);l||(l={high:c,edges:new Map},i.set(s,l));let u=t.getX(a),d=t.getX(o),f=(Math.round(u*12)%12+12)%12,p=(Math.round(d*12)%12+12)%12,m=d-u;m-=Math.round(m);let h=((u+(c<.999999?m*.5:0))%1+1)%1;l.edges.set(`${f}:${p}`,{low:a,high:o,order:h})}let a=[...i].sort(([e],[t])=>e-t).map(([e,t])=>({low:e,high:t.high,edges:[...t.edges.values()].sort((e,t)=>e.order-t.order)}));if(!a.length||a.some(e=>e.edges.length>kt||kt%e.edges.length!==0))throw Error(`Неизвестная топология Tail_Base для фронта роста`);return a}function Lt(){let e=new D;e.setAttribute(`position`,new R(new Float32Array(228),3).setUsage(p)),e.setAttribute(`normal`,new R(new Float32Array(228),3).setUsage(p)),e.setAttribute(`uv`,new R(new Float32Array(152),2).setUsage(p));let t=[];for(let e=0;e<2;e++)for(let n=0;n<kt;n++){let r=e*jt+n,i=r+1,a=r+jt,o=i+jt;t.push(r,i,a,i,o,a)}for(let e=0;e<kt;e++)t.push(50+e,50+e+1,75);return e.setIndex(t),e}function Rt(){let n={value:0},r={value:Nt(0)},i=Pt(),a={matte:new j({roughness:.82,metalness:.24}),velvet:new t({roughness:1,sheen:.5,sheenColor:new B(10141643),sheenRoughness:.8}),satin:new t({roughness:.29,metalness:.36,clearcoat:.3,clearcoatRoughness:.3})};for(let[e,t]of Object.entries(a))t.name=`Tail_Time_${e}`,t.customProgramCacheKey=()=>`void-time-reveal-and-clock-v2`,t.onBeforeCompile=e=>{e.uniforms.tailClockTime=n,e.uniforms.timeRevealFront=r,e.vertexShader=`varying vec2 vTimeUv;
        ${e.vertexShader}`.replace(`#include <uv_vertex>`,`#include <uv_vertex>
vTimeUv = uv;`),e.fragmentShader=`uniform float tailClockTime;
        uniform float timeRevealFront;
        varying vec2 vTimeUv;
        ${e.fragmentShader}`.replace(`#include <color_fragment>`,`#include <color_fragment>
          ${Mt}
          vec2 clockPoint = vec2(fract(vTimeUv.x * 2.0 + 0.5) - 0.5, fract(vTimeUv.y * 2.0) - 0.5) * 2.0;
          float clockRadius = length(clockPoint);
          float clockAngle = atan(clockPoint.y, clockPoint.x + 0.00001);
          float clockFace = 1.0 - smoothstep(0.72, 0.81, clockRadius);
          float clockRim = 1.0 - smoothstep(0.025, 0.065, abs(clockRadius - 0.69));
          float clockTicks = (1.0 - smoothstep(0.025, 0.10,
            abs(fract(clockAngle / 6.2831853 * 12.0 + 0.5) - 0.5)))
            * smoothstep(0.49, 0.56, clockRadius) * (1.0 - smoothstep(0.63, 0.69, clockRadius));
          float clockWarp = tailClockTime * 2.8 + sin(tailClockTime * 1.35) * 6.0;
          vec2 clockMinute = vec2(cos(clockWarp), sin(clockWarp));
          vec2 clockHour = vec2(cos(clockWarp * 0.18 + 0.9), sin(clockWarp * 0.18 + 0.9));
          float clockHands = max(1.0 - smoothstep(0.024, 0.053,
            length(clockPoint - clockMinute * clamp(dot(clockPoint, clockMinute), 0.0, 0.48))),
            1.0 - smoothstep(0.028, 0.062,
            length(clockPoint - clockHour * clamp(dot(clockPoint, clockHour), 0.0, 0.32))));
          float clockTip = 1.0 - smoothstep(0.955, 1.0, vTimeUv.y);
          float clockMark = max(clockRim, max(clockTicks, clockHands)) * clockTip;
          diffuseColor.rgb = mix(vec3(0.016, 0.060, 0.078), vec3(0.25, 0.20, 0.10), clockFace * clockTip);
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.86, 0.66, 0.25), clockMark * 0.75);`).replace(`#include <emissivemap_fragment>`,`#include <emissivemap_fragment>
          totalEmissiveRadiance += vec3(0.58, 0.84, 0.80) * clockMark * 0.90;`)};let s=Object.keys(a),c=Object.fromEntries(s.map(e=>{let t=a[e].clone();return t.onBeforeCompile=a[e].onBeforeCompile,t.customProgramCacheKey=a[e].customProgramCacheKey,[e,t]})),d=new o({depthPacking:L}),m=new f;for(let[e,t]of[[`Depth`,d],[`Distance`,m]])t.name=`Tail_Time_${e}`,t.customProgramCacheKey=()=>`void-time-reveal-${e.toLowerCase()}-v1`,t.onBeforeCompile=e=>{e.uniforms.timeRevealFront=r,e.vertexShader=`varying vec2 vTimeUv;\n${e.vertexShader}`.replace(`#include <uv_vertex>`,`#include <uv_vertex>
vTimeUv = uv;`),e.fragmentShader=`uniform float timeRevealFront;
        varying vec2 vTimeUv;\n${e.fragmentShader}`.replace(`#include <clipping_planes_fragment>`,`#include <clipping_planes_fragment>
          ${Mt}`)};let h=new x({name:`Time_Orbiting_Numbers`,transparent:!0,depthWrite:!1,side:2,forceSinglePass:!0,toneMapped:!1,uniforms:{clockAtlas:{value:i}},vertexShader:`#include <common>
      #include <logdepthbuf_pars_vertex>
      attribute float timeGlyph;
      varying vec2 vGlyphUv;
      void main() {
        vGlyphUv = vec2((uv.x + timeGlyph) / 10.0, uv.y);
        vec4 center = modelViewMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
        center.xy += position.xy * vec2(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz));
        gl_Position = projectionMatrix * center;
        #include <logdepthbuf_vertex>
      }`,fragmentShader:`#include <logdepthbuf_pars_fragment>
      uniform sampler2D clockAtlas;
      varying vec2 vGlyphUv;
      void main() {
        float alpha = texture2D(clockAtlas, vGlyphUv).a;
        #include <logdepthbuf_fragment>
        gl_FragColor = vec4(0.015, 0.48, 0.45, alpha * 0.95);
        #include <colorspace_fragment>
      }`}),g=Ft(),v=new j({roughness:.38,metalness:.52,transparent:!0,depthWrite:!1,forceSinglePass:!0});v.name=`Time_Solid_Clock_Rings`,v.customProgramCacheKey=()=>`void-time-solid-clock-rings-reveal-v2`,v.onBeforeCompile=e=>{e.uniforms.ringClockTime=n,e.uniforms.timeRevealFront=r,e.vertexShader=`attribute float timeRingIndex, timeRingSection;
      varying vec2 vTimeRingPoint;
      varying float vTimeRingIndex, vTimeRingSection;
      ${e.vertexShader}`.replace(`#include <begin_vertex>`,`#include <begin_vertex>
        vTimeRingPoint = position.xy;
        vTimeRingIndex = timeRingIndex;
        vTimeRingSection = timeRingSection;`),e.fragmentShader=`uniform float ringClockTime, timeRevealFront;
      varying vec2 vTimeRingPoint;
      varying float vTimeRingIndex, vTimeRingSection;
      ${e.fragmentShader}`.replace(`#include <color_fragment>`,`#include <color_fragment>
        float ringAlpha = smoothstep(vTimeRingSection + 0.012, vTimeRingSection + 0.055, timeRevealFront);
        if (ringAlpha < 0.005) discard;
        diffuseColor.a *= ringAlpha;
        float ringRadius = length(vTimeRingPoint);
        float ringAngle = atan(vTimeRingPoint.y, vTimeRingPoint.x + 0.00001);
        float ringFace = smoothstep(0.70, 0.745, ringRadius) * (1.0 - smoothstep(0.965, 1.005, ringRadius));
        float ringHour = abs(fract(ringAngle / 6.2831853 * 12.0 + 0.5) - 0.5);
        float ringTicks = (1.0 - smoothstep(0.045, 0.12, ringHour))
          * smoothstep(0.835, 0.86, ringRadius) * (1.0 - smoothstep(0.94, 0.965, ringRadius));
        float ringDirection = mod(vTimeRingIndex, 2.0) < 0.5 ? 1.0 : -1.0;
        float ringWarp = (ringClockTime * (1.7 + vTimeRingIndex * 0.55)
          + sin(ringClockTime * 1.35) * 3.0) * ringDirection;
        vec2 ringMinute = vec2(cos(ringWarp), sin(ringWarp));
        vec2 ringHourHand = vec2(cos(ringWarp * 0.20 + 1.1), sin(ringWarp * 0.20 + 1.1));
        float ringMinuteMark = 1.0 - smoothstep(0.018, 0.040,
          length(vTimeRingPoint - ringMinute * clamp(dot(vTimeRingPoint, ringMinute), 0.745, 0.945)));
        float ringHourMark = 1.0 - smoothstep(0.024, 0.048,
          length(vTimeRingPoint - ringHourHand * clamp(dot(vTimeRingPoint, ringHourHand), 0.745, 0.86)));
        float ringBezel = max(1.0 - smoothstep(0.008, 0.025, abs(ringRadius - 0.70)),
          1.0 - smoothstep(0.008, 0.025, abs(ringRadius - 0.985)));
        vec3 ringGold = vec3(0.56, 0.31, 0.045);
        vec3 ringDial = mix(vec3(0.012, 0.075, 0.085), vec3(0.055, 0.11, 0.10), mod(vTimeRingIndex, 2.0));
        diffuseColor.rgb = mix(ringGold, ringDial, ringFace);
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.88, 0.63, 0.20), max(ringTicks, ringBezel));
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.14, 0.70, 0.61), ringHourMark);
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(1.0, 0.74, 0.22), ringMinuteMark);`).replace(`#include <emissivemap_fragment>`,`#include <emissivemap_fragment>
        totalEmissiveRadiance += vec3(0.19, 0.56, 0.47) * ringHourMark * 0.5
          + vec3(0.72, 0.40, 0.045) * (ringMinuteMark * 0.55 + ringTicks * 0.16);`)};let S=!1;return{materials:a,update(e){!S&&e>0&&Number.isFinite(e)&&(n.value+=Math.min(e,.1),r.value=Nt(n.value))},createEffect(t){let i=t.geometry,o=i.clone(),f=o.getAttribute(`uv`),x=It(o),S=ee(t),w=q(t,{kind:`glint`,color:9625555,secondaryColor:15253870,capacity:14,interval:.13,life:1.05,size:.038,speed:.025,rise:.045,spread:.065,orbit:1.1,minV:.002,maxV:.015,gate:()=>+(r.value>.06)}),T=new b(2,2),E=new C(new Float32Array(8),1).setUsage(p);T.setAttribute(`timeGlyph`,E);let D=new e(T,h,8);D.name=`Time_Floating_Numbers`,D.instanceMatrix.setUsage(p),D.frustumCulled=!1;let O=new e(g,v,Dt.length);O.name=`Time_Spine_Clock_Rings`,O.instanceMatrix.setUsage(p),O.frustumCulled=!1;let k=Lt(),A=new y(k,a.matte);A.name=`Time_Rounded_Growth_Front`,A.frustumCulled=!1;let j=new u;j.name=`Time_Rewind_Field`,j.visible=!1,j.add(D,O,A,w.object),U(j,{mesh:t,geometry:o,depth:d});let M=new V,N=new V,P=new V,F=new V,I=new l,L=new V,R=new V,z=new V,B=new V,W=new V,G=new V,K=new l,J=new l,Y=new V(0,0,1),X=new H,Z=new H,Q=new V,$=new V,te=new V,ne=new V,re=new V,ie=Array.from({length:kt},()=>new V),ae=new Float32Array(kt),oe=k.getAttribute(`position`),se=k.getAttribute(`normal`),ce=k.getAttribute(`uv`),le=k.index,ue=1,de=!1,fe=!1,pe=t.customDepthMaterial,me=t.customDistanceMaterial;function he(){t.customDepthMaterial===d&&(t.customDepthMaterial=pe),t.customDistanceMaterial===m&&(t.customDistanceMaterial=me)}function ge(){let e=r.value,n=Array.isArray(t.material)?t.material[0]:t.material,i=s.find(e=>a[e]===n);if(A.material=i===void 0?n:c[i],A.castShadow=t.castShadow,A.receiveShadow=t.receiveShadow,A.visible=e<.999999,!A.visible)return;let o=0,l=x.length-1;for(;o<l;){let t=o+l>>1;x[t].high<e?o=t+1:l=t}let u=x[o],d=_.clamp((e-u.low)/(u.high-u.low),0,1);Q.set(0,0,0);for(let e=0;e<kt;e++){let n=u.edges[Math.floor(e*u.edges.length/kt)];t.getVertexPosition(n.low,te),t.getVertexPosition(n.high,ne),ie[e].copy(te).lerp(ne,d).applyMatrix4(t.matrixWorld);let r=_.lerp(f.getX(n.low),f.getX(n.high),d);ae[e]=(r%1+1)%1,Q.add(ie[e])}Q.divideScalar(kt),S.spine(e,L,$);let p=0,m=0;for(let e=0;e<kt;e++)G.subVectors(ie[e],Q),W.subVectors(ie[(e+1)%kt],Q),B.crossVectors(G,W),m+=B.dot($),p=Math.max(p,G.length());let h=m<0?-1:1;if(ue!==h){for(let e=0;e<le.count;e+=3){let t=le.getX(e+1);le.setX(e+1,le.getX(e+2)),le.setX(e+2,t)}le.needsUpdate=!0,ue=h}let g=p*.72;for(let t=0;t<At;t++){let n=t/At*Math.PI*.5,r=Math.cos(n),i=Math.sin(n);for(let n=0;n<=kt;n++){G.subVectors(ie[n%kt],Q),N.copy(Q).addScaledVector(G,r).addScaledVector($,g*i),re.copy(G).addScaledVector($,-G.dot($)),re.lengthSq()<1e-16&&re.copy(z),re.normalize().multiplyScalar(r).addScaledVector($,i).normalize();let a=t*jt+n;oe.setXYZ(a,N.x,N.y,N.z),se.setXYZ(a,re.x,re.y,re.z);let o=n===kt?ae[0]+1:ae[n];ce.setXY(a,o,Math.max(0,e-1e-6))}}N.copy(Q).addScaledVector($,g),oe.setXYZ(75,N.x,N.y,N.z),se.setXYZ(75,$.x,$.y,$.z),ce.setXY(75,.5,Math.max(0,e-1e-6)),oe.needsUpdate=!0,se.needsUpdate=!0,ce.needsUpdate=!0}function _e(){S.update();let e=r.value;S.spine(e*.5,M),ge();let t=S.size*(.19+e*.1),i=n.value*2.8+Math.sin(n.value*1.35)*6;for(let e=0;e<8;e++){let n=e+2,r=n/10*Tt+i*.13;P.set(Math.cos(r)*t,Math.sin(r)*t*.73,Math.sin(r*1.7+n)*S.size*.12).applyQuaternion(S.rotation),N.copy(M).add(P),F.set(S.size*.048,S.size*.077,1),X.compose(N,I,F),D.setMatrixAt(e,X);let a=(Math.floor(i*2+n*3)%10+10)%10;E.setX(e,a)}D.instanceMatrix.needsUpdate=!0,E.needsUpdate=!0;let a=0;for(let e=0;e<Dt.length;e++){let t=Dt[e];S.spine(t,L,R,z);let r=0;for(let e=0;e<12;e++)S.sample(t,e/12,W),G.subVectors(W,L).addScaledVector(R,-G.dot(R)),r=Math.max(r,G.length());let o=Math.max(S.size*(.14+e*.04),r*1.8,a+S.size*.025);a=o,N.copy(L),B.crossVectors(R,z).normalize(),Z.makeBasis(z,B,R),K.setFromRotationMatrix(Z);let s=e===1?-1:1;J.setFromAxisAngle(Y,(n.value*(.45+e*.23)+i*.04)*s),K.multiply(J),F.setScalar(o),X.compose(N,K,F),O.setMatrixAt(e,X)}O.instanceMatrix.needsUpdate=!0}return{object:j,shapesTail:!0,setActive(e){fe||(e&&!de&&(pe=t.customDepthMaterial,me=t.customDistanceMaterial),de=e,j.visible=e,w.setActive(e),e?(t.geometry=o,t.customDepthMaterial=d,t.customDistanceMaterial=m,_e()):(he(),t.geometry===o&&(t.geometry=i)))},update(e){de&&!fe&&e>0&&Number.isFinite(e)&&(_e(),w.update(e))},dispose(){fe||(fe=!0,de=!1,j.visible=!1,he(),t.geometry===o&&(t.geometry=i),w.dispose(),D.removeFromParent(),D.dispose(),O.removeFromParent(),O.dispose(),A.removeFromParent(),k.dispose(),T.dispose(),o.dispose(),j.removeFromParent())}}},dispose(){S||(S=!0,Object.values(a).forEach(e=>e.dispose()),Object.values(c).forEach(e=>e.dispose()),d.dispose(),m.dispose(),h.dispose(),g.dispose(),v.dispose(),i.dispose())}}}var zt=Math.PI*2;function Bt(){let t={value:0},n=G(`Fate`,t,`
    float fateTip = 1.0 - smoothstep(0.96, 1.0, vVoidUv.y);
    float fateThread = 0.0;
    float fateKnot = 0.0;
    for (int i = 0; i < 3; i++) {
      float offset = float(i) / 3.0;
      float path = offset + sin(vVoidUv.y * 11.0 + voidTime * 0.75 + float(i) * 2.1) * 0.105;
      float dx = abs(fract(vVoidUv.x - path + 0.5) - 0.5);
      fateThread = max(fateThread, 1.0 - smoothstep(0.028, 0.055, dx));
      float knotY = abs(fract(vVoidUv.y * 5.0 + offset + sin(voidTime * 0.65) * 0.11) - 0.5);
      fateKnot = max(fateKnot, 1.0 - smoothstep(0.08, 0.16, length(vec2(dx * 2.4, knotY))));
    }
    fateThread *= fateTip;
    fateKnot *= fateTip;
    float fateWeave = sin(vVoidUv.x * 301.59) * sin(vVoidUv.y * 290.0) * 0.012 * fateTip;
    vec3 fateBody = vec3(0.025, 0.018, 0.045) + fateWeave;
    fateBody = mix(fateBody, vec3(0.72, 0.012, 0.075), fateThread);
    fateBody = mix(fateBody, vec3(1.0, 0.62, 0.12), fateKnot);
    diffuseColor.rgb = fateBody;
  `,`
    totalEmissiveRadiance += vec3(0.5, 0.008, 0.025) * fateThread * 0.48
      + vec3(1.0, 0.36, 0.035) * fateKnot * 0.45;
  `),r=new s({color:14887254,side:2,toneMapped:!1}),i=new S(1,0),a=new j({color:16762707,emissive:11154439,emissiveIntensity:.4,roughness:.33,metalness:.35}),o=!1;return{materials:n,update(e){!o&&e>0&&Number.isFinite(e)&&(t.value+=Math.min(e,.1))},createEffect(n){let o=ee(n),s=new u;s.name=`Fate_Threads`,s.visible=!1;let c=new Float32Array(522),d=[];for(let e=0;e<3;e++)for(let t=0;t<28;t++){let n=(e*29+t)*2;d.push(n,n+1,n+2,n+1,n+3,n+2)}let f=new D,m=new R(c,3).setUsage(p);f.setAttribute(`position`,m),f.setIndex(d);let h=new y(f,r);h.frustumCulled=!1;let g=new e(i,a,9);g.instanceMatrix.setUsage(p),g.frustumCulled=!1,s.add(h,g);let _=new V,v=new V,b=new V,x=new H,S=new l,C=new V,w=new V(0,1,0),T=new V(1,0,0),E=!1,O=!1;function k(e,n){let r=e/3+Math.sin(n*5+t.value*.7+e)*.16;o.sample(.13+n*.77,r,_,v);let i=Math.sin(n*Math.PI)*(.08+.025*Math.sin(t.value+e));_.addScaledVector(v,o.size*(.035+i)),_.y+=Math.sin(n*zt+t.value*.8+e*2)*o.size*.018}function A(){o.update();for(let e=0;e<3;e++){for(let t=0;t<=28;t++){k(e,t/28),b.crossVectors(v,Math.abs(v.y)>.9?T:w).normalize();for(let n=0;n<2;n++){let r=n===0?-1:1,i=((e*29+t)*2+n)*3;c[i]=_.x+b.x*o.size*.008*r,c[i+1]=_.y+b.y*o.size*.008*r,c[i+2]=_.z+b.z*o.size*.008*r}}for(let n=0;n<3;n++){let r=.14+n*.34+Math.sin(t.value*.7+e)*.045;k(e,r),C.setScalar(o.size*(n===1?.024:.018)),S.setFromAxisAngle(w,t.value*.7+n+e),g.setMatrixAt(e*3+n,x.compose(_,S,C))}}m.needsUpdate=!0,g.instanceMatrix.needsUpdate=!0}return{object:s,setActive(e){O||(E=e,s.visible=e,e&&A())},update(e){E&&!O&&e>0&&Number.isFinite(e)&&A()},dispose(){O||(O=!0,s.removeFromParent(),f.dispose(),g.dispose())}}},dispose(){o||(o=!0,Object.values(n).forEach(e=>e.dispose()),r.dispose(),a.dispose(),i.dispose())}}}function Vt(){let t={value:0},n=G(`Chaos`,t,`
    vec2 chaosGrid = vVoidUv * vec2(4.0, 11.0);
    vec2 chaosCell = floor(chaosGrid);
    vec2 chaosP = fract(chaosGrid) - 0.5;
    float chaosPhase = voidTime * 0.62 + dot(chaosCell, vec2(0.41, 0.19));
    float chaosBlend = smoothstep(0.22, 0.78, fract(chaosPhase));
    float chaosTurn = floor(chaosPhase) * 1.5707963 + chaosBlend * 1.5707963;
    chaosP = mat2(cos(chaosTurn), sin(chaosTurn), -sin(chaosTurn), cos(chaosTurn)) * chaosP;
    float chaosSquare = max(abs(chaosP.x), abs(chaosP.y));
    float chaosDiamond = (abs(chaosP.x) + abs(chaosP.y)) * 0.72;
    float chaosShape = mix(chaosSquare, chaosDiamond, 0.5 + 0.5 * sin(chaosPhase * 1.7));
    float chaosMask = 1.0 - smoothstep(0.25, 0.32, chaosShape);
    float chaosPink = step(0.65, sin(chaosCell.x * 7.0 + chaosCell.y * 2.3));
    vec3 chaosTile = mix(vec3(0.82, 0.88, 0.94), vec3(0.95, 0.006, 0.28), chaosPink);
    float chaosTip = 1.0 - smoothstep(0.94, 1.0, vVoidUv.y);
    diffuseColor.rgb = mix(vec3(0.012, 0.008, 0.026), chaosTile, chaosMask * chaosTip);
  `,`totalEmissiveRadiance += vec3(0.55, 0.002, 0.13) * chaosPink * chaosMask * chaosTip * 0.36;`),r=[new M(1,1,1),new g(.7,0)],i=new j({roughness:.37,metalness:.15}),a=[new B(16315647),new B(15538026),new B(3809613)],o=!1;return{materials:n,update(e){!o&&e>0&&Number.isFinite(e)&&(t.value+=Math.min(e,.1))},createEffect(n){let o=ee(n),s=new u;s.name=`Chaos_Shifting_Fragments`,s.visible=!1;let d=r.map(t=>{let n=new e(t,i,6);n.frustumCulled=!1,n.instanceMatrix.setUsage(p);for(let e=0;e<6;e++)n.setColorAt(e,a[e%a.length]);return s.add(n),n}),f=new V,m=new V,h=new V,g=new H,v=new l,y=new c,b=!1,x=!1;function S(){o.update();for(let e=0;e<12;e++){let n=t.value*.55+e*.37,r=Math.floor(n),i=_.smoothstep(n%1,.2,.85),a=t=>Math.sin(t*2.17+e*4.13),s=_.lerp(a(r),a(r+1),i);o.sample(.13+e/11*.77,e*.382+s*.13,f,m),f.addScaledVector(m,o.size*(.09+.06*(s*.5+.5))),f.y+=s*o.size*.04;let c=o.size*(.036+e%3*.008);h.set(c,c*(.8+i*.5),c),y.set(t.value*.6+e,s*2+e*.7,t.value*(e%2?-.8:.8)),v.setFromEuler(y),d[e%2].setMatrixAt(Math.floor(e/2),g.compose(f,v,h))}d.forEach(e=>{e.instanceMatrix.needsUpdate=!0})}return{object:s,setActive(e){x||(b=e,s.visible=e,e&&S())},update(e){b&&!x&&e>0&&Number.isFinite(e)&&S()},dispose(){x||(x=!0,s.removeFromParent(),d.forEach(e=>e.dispose()))}}},dispose(){o||(o=!0,Object.values(n).forEach(e=>e.dispose()),r.forEach(e=>e.dispose()),i.dispose())}}}var Ht=Math.PI*2;function Ut(){let t={value:0},n=G(`Infinity`,t,`
    float infinityTip = 1.0 - smoothstep(0.96, 1.0, vVoidUv.y);
    float infinityRibbon = 0.0;
    float infinityDepth = 0.0;
    for (int layer = 0; layer < 3; layer++) {
      float depth = float(layer);
      float path = 0.5 + sin(vVoidUv.y * 12.56637 + depth * 0.72 - voidTime * 0.55)
        * (0.29 - depth * 0.065);
      float edge = abs(fract(vVoidUv.x - path + 0.5) - 0.5);
      float ribbon = 1.0 - smoothstep(0.018, 0.045, edge);
      infinityDepth += ribbon * (0.36 - depth * 0.11);
      infinityRibbon = max(infinityRibbon, ribbon * (1.0 - depth * 0.31));
    }
    infinityRibbon *= infinityTip;
    infinityDepth *= infinityTip;
    float infinityPulse = pow(0.5 + 0.5 * sin(vVoidUv.y * 16.0 - voidTime * 3.0), 7.0);
    diffuseColor.rgb = mix(vec3(0.008, 0.012, 0.035), vec3(0.16, 0.69, 0.94), infinityRibbon * 0.8);
    diffuseColor.rgb += vec3(0.1, 0.18, 0.27) * infinityDepth;
  `,`
    totalEmissiveRadiance += vec3(0.08, 0.38, 0.75) * infinityRibbon * 0.38
      + vec3(0.68, 0.9, 1.0) * infinityRibbon * infinityPulse * 0.55;
  `),r=new s({vertexColors:!0,toneMapped:!1}),i=new S(1,1),a=new s({color:13039359,toneMapped:!1}),o=new z(1,.17,6,24),c=new s({color:7828708,toneMapped:!1}),d=!1;return{materials:n,update(e){!d&&e>0&&Number.isFinite(e)&&(t.value+=Math.min(e,.1))},createEffect(n){let s=ee(n),d=new u;d.name=`Infinity_Unbroken_Loop`,d.visible=!1;let f=new Float32Array(1746),m=new Float32Array(f.length),h=[];for(let e=0;e<96;e++)for(let t=0;t<6;t++){let n=e*6+t,r=e*6+(t+1)%6;h.push(n,n+6,r,r,n+6,r+6)}let g=new D,_=new R(f,3).setUsage(p),v=new R(m,3).setUsage(p);g.setAttribute(`position`,_),g.setAttribute(`color`,v),g.setIndex(h);let b=new y(g,r);b.frustumCulled=!1;let x=new e(i,a,3);x.instanceMatrix.setUsage(p),x.frustumCulled=!1;let S=new y(o,c);S.name=`Infinity_Stem_Clasp`,S.frustumCulled=!1,d.add(b,x,S);let C=new V,w=new V,T=new V,E=new V,O=new V,k=new V,A=new V(0,0,1),j=new V,M=new V,N=new V,P=new V,F=new V,I=new V(0,0,1),L=new H,z=new l,U=new B(3903459),W=new B(10583276),G=new B(14220543),K=new B,q=Array.from({length:49},()=>({point:new V,tangent:new V,radial:new V,binormal:new V})),J=!1,Y=!1;function X(e,t){let n=(.5+Math.cos(e)*.5)*(q.length-1),r=Math.min(q.length-2,Math.floor(n)),i=n-r,a=q[r],o=q[r+1];t.lerpVectors(a.point,o.point,i),M.lerpVectors(a.radial,o.radial,i).normalize(),N.lerpVectors(a.binormal,o.binormal,i).normalize(),t.addScaledVector(M,Math.sin(e*2)*s.size*.15).addScaledVector(N,Math.sin(e)*s.size*.032)}function Z(){s.update();for(let e=0;e<q.length;e++){let t=q[e];s.spine(.22+.66*e/(q.length-1),t.point,t.tangent,t.radial),t.binormal.crossVectors(t.tangent,t.radial).normalize(),t.radial.multiplyScalar(Math.SQRT1_2).addScaledVector(t.binormal,Math.SQRT1_2),t.binormal.crossVectors(t.tangent,t.radial).normalize()}s.spine(.55,S.position,P),s.sample(.55,0,F),S.scale.setScalar(F.distanceTo(S.position)+s.size*.004),S.quaternion.setFromUnitVectors(I,P);for(let e=0;e<=96;e++){let n=e/96*Ht;X(n,C),X(n+.003,w),T.copy(w).sub(C).normalize(),A.copy(N),E.crossVectors(T,A).normalize(),O.crossVectors(E,T).normalize();let r=(.5+.5*Math.cos(n*3-t.value*2.2))**12;K.copy(U).lerp(W,.5+.5*Math.sin(n)).lerp(G,r);for(let t=0;t<6;t++){let n=t/6*Ht;k.copy(E).multiplyScalar(Math.cos(n)).addScaledVector(O,Math.sin(n)).multiplyScalar(s.size*(.0075+r*.0025));let i=(e*6+t)*3;f[i]=C.x+k.x,f[i+1]=C.y+k.y,f[i+2]=C.z+k.z,m[i]=K.r,m[i+1]=K.g,m[i+2]=K.b}}for(let e=0;e<3;e++)X(t.value*2.2/3+e*Ht/3,C),j.setScalar(s.size*.022),x.setMatrixAt(e,L.compose(C,z,j));_.needsUpdate=!0,v.needsUpdate=!0,x.instanceMatrix.needsUpdate=!0}return{object:d,setActive(e){Y||(J=e,d.visible=e,e&&Z())},update(e){J&&!Y&&e>0&&Number.isFinite(e)&&Z()},dispose(){Y||(Y=!0,d.removeFromParent(),g.dispose(),x.dispose())}}},dispose(){d||(d=!0,Object.values(n).forEach(e=>e.dispose()),r.dispose(),a.dispose(),i.dispose(),o.dispose(),c.dispose())}}}var Wt={"2:1":$,"2:2":re,"2:3":ae,"2:4":se,"2:5":fe,"2:6":ve,"2:7":be,"2:8":Se,"2:9":Te,"2:10":Ae,"3:1":Ne,"3:2":Le,"3:3":ze,"3:4":dt,"3:5":vt,"3:6":wt,"3:7":Rt,"3:8":Bt,"3:9":Vt,"3:10":Ut};export{Wt as SPECIAL_TAIL_FACTORIES};