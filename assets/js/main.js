var at=Object.defineProperty;var De=l=>{throw TypeError(l)};var rt=(l,e,t)=>e in l?at(l,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):l[e]=t;var be=(l,e,t)=>rt(l,typeof e!="symbol"?e+"":e,t),Re=(l,e,t)=>e.has(l)||De("Cannot "+t);var j=(l,e,t)=>(Re(l,e,"read from private field"),t?t.call(l):e.get(l)),ge=(l,e,t)=>e.has(l)?De("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(l):e.set(l,t),Z=(l,e,t,o)=>(Re(l,e,"write to private field"),o?o.call(l,t):e.set(l,t),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const n of i.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&o(n)}).observe(document,{childList:!0,subtree:!0});function t(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(a){if(a.ep)return;a.ep=!0;const i=t(a);fetch(a.href,i)}})();/*! Capacitor: https://capacitorjs.com/ - MIT License */var pe;(function(l){l.Unimplemented="UNIMPLEMENTED",l.Unavailable="UNAVAILABLE"})(pe||(pe={}));class Pe extends Error{constructor(e,t,o){super(e),this.message=e,this.code=t,this.data=o}}const it=l=>{var e,t;return l!=null&&l.androidBridge?"android":!((t=(e=l==null?void 0:l.webkit)===null||e===void 0?void 0:e.messageHandlers)===null||t===void 0)&&t.bridge?"ios":"web"},nt=l=>{const e=l.CapacitorCustomPlatform||null,t=l.Capacitor||{},o=t.Plugins=t.Plugins||{},a=()=>e!==null?e.name:it(l),i=()=>a()!=="web",n=h=>{const x=f.get(h);return!!(x!=null&&x.platforms.has(a())||c(h))},c=h=>{var x;return(x=t.PluginHeaders)===null||x===void 0?void 0:x.find(L=>L.name===h)},d=h=>l.console.error(h),f=new Map,k=(h,x={})=>{const L=f.get(h);if(L)return console.warn(`Capacitor plugin "${h}" already registered. Cannot register plugins twice.`),L.proxy;const T=a(),N=c(h);let v;const A=async()=>(!v&&T in x?v=typeof x[T]=="function"?v=await x[T]():v=x[T]:e!==null&&!v&&"web"in x&&(v=typeof x.web=="function"?v=await x.web():v=x.web),v),U=(M,z)=>{var B,K;if(N){const ee=N==null?void 0:N.methods.find(H=>z===H.name);if(ee)return ee.rtype==="promise"?H=>t.nativePromise(h,z.toString(),H):(H,se)=>t.nativeCallback(h,z.toString(),H,se);if(M)return(B=M[z])===null||B===void 0?void 0:B.bind(M)}else{if(M)return(K=M[z])===null||K===void 0?void 0:K.bind(M);throw new Pe(`"${h}" plugin is not implemented on ${T}`,pe.Unimplemented)}},O=M=>{let z;const B=(...K)=>{const ee=A().then(H=>{const se=U(H,M);if(se){const ne=se(...K);return z=ne==null?void 0:ne.remove,ne}else throw new Pe(`"${h}.${M}()" is not implemented on ${T}`,pe.Unimplemented)});return M==="addListener"&&(ee.remove=async()=>z()),ee};return B.toString=()=>`${M.toString()}() { [capacitor code] }`,Object.defineProperty(B,"name",{value:M,writable:!1,configurable:!1}),B},q=O("addListener"),G=O("removeListener"),R=(M,z)=>{const B=q({eventName:M},z),K=async()=>{const H=await B;G({eventName:M,callbackId:H},z)},ee=new Promise(H=>B.then(()=>H({remove:K})));return ee.remove=async()=>{console.warn("Using addListener() without 'await' is deprecated."),await K()},ee},V=new Proxy({},{get(M,z){switch(z){case"$$typeof":return;case"toJSON":return()=>({});case"addListener":return N?R:q;case"removeListener":return G;default:return O(z)}}});return o[h]=V,f.set(h,{name:h,proxy:V,platforms:new Set([...Object.keys(x),...N?[T]:[]])}),V};return t.convertFileSrc||(t.convertFileSrc=h=>h),t.getPlatform=a,t.handleError=d,t.isNativePlatform=i,t.isPluginAvailable=n,t.registerPlugin=k,t.Exception=Pe,t.DEBUG=!!t.DEBUG,t.isLoggingEnabled=!!t.isLoggingEnabled,t},st=l=>l.Capacitor=nt(l),$=st(typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{}),me=$.registerPlugin;class qe{constructor(){this.listeners={},this.retainedEventArguments={},this.windowListeners={}}addListener(e,t){let o=!1;this.listeners[e]||(this.listeners[e]=[],o=!0),this.listeners[e].push(t);const i=this.windowListeners[e];i&&!i.registered&&this.addWindowListener(i),o&&this.sendRetainedArgumentsForEvent(e);const n=async()=>this.removeListener(e,t);return Promise.resolve({remove:n})}async removeAllListeners(){this.listeners={};for(const e in this.windowListeners)this.removeWindowListener(this.windowListeners[e]);this.windowListeners={}}notifyListeners(e,t,o){const a=this.listeners[e];if(!a){if(o){let i=this.retainedEventArguments[e];i||(i=[]),i.push(t),this.retainedEventArguments[e]=i}return}a.forEach(i=>i(t))}hasListeners(e){return!!this.listeners[e].length}registerWindowListener(e,t){this.windowListeners[t]={registered:!1,windowEventName:e,pluginEventName:t,handler:o=>{this.notifyListeners(t,o)}}}unimplemented(e="not implemented"){return new $.Exception(e,pe.Unimplemented)}unavailable(e="not available"){return new $.Exception(e,pe.Unavailable)}async removeListener(e,t){const o=this.listeners[e];if(!o)return;const a=o.indexOf(t);this.listeners[e].splice(a,1),this.listeners[e].length||this.removeWindowListener(this.windowListeners[e])}addWindowListener(e){window.addEventListener(e.windowEventName,e.handler),e.registered=!0}removeWindowListener(e){e&&(window.removeEventListener(e.windowEventName,e.handler),e.registered=!1)}sendRetainedArgumentsForEvent(e){const t=this.retainedEventArguments[e];t&&(delete this.retainedEventArguments[e],t.forEach(o=>{this.notifyListeners(e,o)}))}}const _e=l=>encodeURIComponent(l).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape),je=l=>l.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent);class lt extends qe{async getCookies(){const e=document.cookie,t={};return e.split(";").forEach(o=>{if(o.length<=0)return;let[a,i]=o.replace(/=/,"CAP_COOKIE").split("CAP_COOKIE");a=je(a).trim(),i=je(i).trim(),t[a]=i}),t}async setCookie(e){try{const t=_e(e.key),o=_e(e.value),a=`; expires=${(e.expires||"").replace("expires=","")}`,i=(e.path||"/").replace("path=",""),n=e.url!=null&&e.url.length>0?`domain=${e.url}`:"";document.cookie=`${t}=${o||""}${a}; path=${i}; ${n};`}catch(t){return Promise.reject(t)}}async deleteCookie(e){try{document.cookie=`${e.key}=; Max-Age=0`}catch(t){return Promise.reject(t)}}async clearCookies(){try{const e=document.cookie.split(";")||[];for(const t of e)document.cookie=t.replace(/^ +/,"").replace(/=.*/,`=;expires=${new Date().toUTCString()};path=/`)}catch(e){return Promise.reject(e)}}async clearAllCookies(){try{await this.clearCookies()}catch(e){return Promise.reject(e)}}}me("CapacitorCookies",{web:()=>new lt});const ct=async l=>new Promise((e,t)=>{const o=new FileReader;o.onload=()=>{const a=o.result;e(a.indexOf(",")>=0?a.split(",")[1]:a)},o.onerror=a=>t(a),o.readAsDataURL(l)}),dt=(l={})=>{const e=Object.keys(l);return Object.keys(l).map(a=>a.toLocaleLowerCase()).reduce((a,i,n)=>(a[i]=l[e[n]],a),{})},ft=(l,e=!0)=>l?Object.entries(l).reduce((o,a)=>{const[i,n]=a;let c,d;return Array.isArray(n)?(d="",n.forEach(f=>{c=e?encodeURIComponent(f):f,d+=`${i}=${c}&`}),d.slice(0,-1)):(c=e?encodeURIComponent(n):n,d=`${i}=${c}`),`${o}&${d}`},"").substr(1):null,mt=(l,e={})=>{const t=Object.assign({method:l.method||"GET",headers:l.headers},e),a=dt(l.headers)["content-type"]||"";if(typeof l.data=="string")t.body=l.data;else if(a.includes("application/x-www-form-urlencoded")){const i=new URLSearchParams;for(const[n,c]of Object.entries(l.data||{}))i.set(n,c);t.body=i.toString()}else if(a.includes("multipart/form-data")||l.data instanceof FormData){const i=new FormData;if(l.data instanceof FormData)l.data.forEach((c,d)=>{i.append(d,c)});else for(const c of Object.keys(l.data))i.append(c,l.data[c]);t.body=i;const n=new Headers(t.headers);n.delete("content-type"),t.headers=n}else(a.includes("application/json")||typeof l.data=="object")&&(t.body=JSON.stringify(l.data));return t};class gt extends qe{async request(e){const t=mt(e,e.webFetchExtra),o=ft(e.params,e.shouldEncodeUrlParams),a=o?`${e.url}?${o}`:e.url,i=await fetch(a,t),n=i.headers.get("content-type")||"";let{responseType:c="text"}=i.ok?e:{};n.includes("application/json")&&(c="json");let d,f;switch(c){case"arraybuffer":case"blob":f=await i.blob(),d=await ct(f);break;case"json":d=await i.json();break;case"document":case"text":default:d=await i.text()}const k={};return i.headers.forEach((h,x)=>{k[x]=h}),{data:d,headers:k,status:i.status,url:i.url}}async get(e){return this.request(Object.assign(Object.assign({},e),{method:"GET"}))}async post(e){return this.request(Object.assign(Object.assign({},e),{method:"POST"}))}async put(e){return this.request(Object.assign(Object.assign({},e),{method:"PUT"}))}async patch(e){return this.request(Object.assign(Object.assign({},e),{method:"PATCH"}))}async delete(e){return this.request(Object.assign(Object.assign({},e),{method:"DELETE"}))}}me("CapacitorHttp",{web:()=>new gt});const ut=[{id:"vg_characters",name:"VG Characters",data:{SONIC:"a1b1c1d1c2","LARA CROFT":"a3b3c4d3c2d2c3b2a2",MARIO:"d4d3c4b4a4"}},{id:"chess",name:"Ajedrez",data:{PAWN:"a1a2a3b3",QUEEN:"d4c4b4a4b3",KING:"c3c2b3b2",KNIGHT:"c3b3c2b2c1d1",BISHOP:"d3c2d2c1b1a1"}},{id:"planets",name:"Planetas",data:{MARS:"c4b3c3b4",MERCURY:"c4d4c3d2c2d1c1",NEPTUNE:"a3a2b1b2c2d3d4",SATURN:"b4b3b2c2c3d3",URANUS:"c2c3b3a3a4b4",VENUS:"a1a2a3a4b4"}}],re=ut.reduce((l,{id:e,name:t,data:o})=>(l[e]={name:t,data:o},l),{}),Q=Object.keys(re);class ht{constructor(e,t,o){this.board=e,this.board.querySelectorAll("svg").forEach(a=>a.remove()),this.svgContainer=document.createElementNS("http://www.w3.org/2000/svg","svg"),this.svgContainer.id="lines",this.board.insertBefore(this.svgContainer,this.board.firstChild),this.onSelectionUpdate=o,this.selected=[],this._isPointerDown=!1,this._isDragging=!1,this.potentialUndo=null,this.startedInsideBoard=!1,this._lastTouchMove=null,this._lastTouchEvent=null,this._wasSelecting=!1}reset(){this.selected.forEach(e=>document.getElementById(`mark-${e}`).classList.remove("selected")),this.svgContainer.innerHTML="",this.selected=[],this.potentialUndo=null}resetControls(){[this._isPointerDown,this._isDragging,this.potentialUndo,this.startedInsideBoard]=[!1,!1,null,!1]}getCurrentSelection(){return[...this.selected]}drawLine(){this.svgContainer.innerHTML="",this.selected.forEach((e,t)=>{if(t===0)return;const o=document.createElementNS("http://www.w3.org/2000/svg","line"),[a,i]=[this.selected[t-1],e].map(c=>document.getElementById(`mark-${c}`).getBoundingClientRect()),n=this.board.getBoundingClientRect();["x1","y1","x2","y2"].forEach((c,d)=>{const f=d<2?a:i;o.setAttribute(c,f[c.startsWith("x")?"x":"y"]+f.width/2-n[c.startsWith("x")?"x":"y"])}),this.svgContainer.appendChild(o)})}handleLetterSelection(e){const t=this.selected.length;if(this.selected.includes(e))return e===this.selected[t-1]?(this.potentialUndo=e,this.onSelectionUpdate(this.selected),!0):e===this.selected[t-2]?(document.getElementById(`mark-${this.selected[t-1]}`).classList.remove("selected"),this.selected.pop(),this.drawLine(),this.onSelectionUpdate(this.selected),!0):!1;if(this.potentialUndo=null,!t||this.areAdjacent(this.selected[t-1],e)){const o=document.getElementById(`mark-${e}`);return this.selected.push(e),o.classList.add("selected"),this.drawLine(),this.onSelectionUpdate(this.selected),!0}return this.isDragging?!1:(this.reset(),document.getElementById(`mark-${e}`).classList.add("selected"),this.selected.push(e),this.onSelectionUpdate(this.selected),!0)}areAdjacent(e,t){if(e===t)return!1;const[o,a]=[e.charCodeAt(0)-97,parseInt(e[1])-1],[i,n]=[t.charCodeAt(0)-97,parseInt(t[1])-1];return Math.abs(o-i)<=1&&Math.abs(a-n)<=1}handlePointerDown(e){var a;const t=!!((a=e==null?void 0:e.target)!=null&&a.closest(".board"));if(this.startedInsideBoard=t,!t)return;const o=this.getHitboxFromEvent(e);if(!o){this.isDragging||this.reset();return}e.preventDefault(),this._isPointerDown=!0,this._isDragging=!1,this.handleLetterSelection(o.dataset.position)}handlePointerMove(e){var a;if(!this._isPointerDown||!((a=e.target)!=null&&a.closest(".board"))||(e.preventDefault(),!this.startedInsideBoard&&!this._isDragging))return;const t=this.getHitboxFromEvent(e);if(!t)return;const o=t.dataset.position;this.selected[this.selected.length-1]!==o&&(this._isDragging=!0,this.handleLetterSelection(o))}handlePointerUp(e){var t;if(!this._isDragging&&this.potentialUndo){const o=this.getHitboxFromEvent(e);o&&this.potentialUndo===o.dataset.position&&(document.getElementById(`mark-${this.potentialUndo}`).classList.remove("selected"),this.selected.pop(),this.drawLine())}(t=e==null?void 0:e.target)!=null&&t.closest(".board")?(this._isPointerDown=!1,this._isDragging=!1):(this.resetControls(),this.reset())}handlePointerOut(){return this._isPointerDown=!1,this._isDragging||this.selected.length>0}handlePointerEnter(e){e.buttons>0&&(this.startedInsideBoard||this.selected.length>0)&&(this._isPointerDown=!0)}getHitboxFromEvent(e){var t,o,a;if(!e)return null;if(e.touches||e.changedTouches){const i=((t=e.touches)==null?void 0:t[0])||((o=e.changedTouches)==null?void 0:o[0]);if(!i)return null;const n=document.elementFromPoint(i.clientX,i.clientY);return n==null?void 0:n.closest(".hitbox")}return(a=e.target)==null?void 0:a.closest(".hitbox")}isPlayableArea(e){return e!=null&&e.target?e.target.closest(".hitbox")||e.target.closest(".board"):!1}get isDragging(){return this._isDragging}get isPointerDown(){return this._isPointerDown}handleTouchMove(e){e.preventDefault(),this.handlePointerMove(e)}getWasSelecting(){return this._wasSelecting}setWasSelecting(e){this._wasSelecting=e}}var Ae={};(function l(e,t,o,a){var i=!!(e.Worker&&e.Blob&&e.Promise&&e.OffscreenCanvas&&e.OffscreenCanvasRenderingContext2D&&e.HTMLCanvasElement&&e.HTMLCanvasElement.prototype.transferControlToOffscreen&&e.URL&&e.URL.createObjectURL),n=typeof Path2D=="function"&&typeof DOMMatrix=="function",c=function(){if(!e.OffscreenCanvas)return!1;var s=new OffscreenCanvas(1,1),r=s.getContext("2d");r.fillRect(0,0,1,1);var m=s.transferToImageBitmap();try{r.createPattern(m,"no-repeat")}catch{return!1}return!0}();function d(){}function f(s){var r=t.exports.Promise,m=r!==void 0?r:e.Promise;return typeof m=="function"?new m(s):(s(d,d),null)}var k=function(s,r){return{transform:function(m){if(s)return m;if(r.has(m))return r.get(m);var u=new OffscreenCanvas(m.width,m.height),p=u.getContext("2d");return p.drawImage(m,0,0),r.set(m,u),u},clear:function(){r.clear()}}}(c,new Map),h=function(){var s=Math.floor(16.666666666666668),r,m,u={},p=0;return typeof requestAnimationFrame=="function"&&typeof cancelAnimationFrame=="function"?(r=function(b){var y=Math.random();return u[y]=requestAnimationFrame(function g(w){p===w||p+s-1<w?(p=w,delete u[y],b()):u[y]=requestAnimationFrame(g)}),y},m=function(b){u[b]&&cancelAnimationFrame(u[b])}):(r=function(b){return setTimeout(b,s)},m=function(b){return clearTimeout(b)}),{frame:r,cancel:m}}(),x=function(){var s,r,m={};function u(p){function b(y,g){p.postMessage({options:y||{},callback:g})}p.init=function(g){var w=g.transferControlToOffscreen();p.postMessage({canvas:w},[w])},p.fire=function(g,w,C){if(r)return b(g,null),r;var I=Math.random().toString(36).slice(2);return r=f(function(P){function F(_){_.data.callback===I&&(delete m[I],p.removeEventListener("message",F),r=null,k.clear(),C(),P())}p.addEventListener("message",F),b(g,I),m[I]=F.bind(null,{data:{callback:I}})}),r},p.reset=function(){p.postMessage({reset:!0});for(var g in m)m[g](),delete m[g]}}return function(){if(s)return s;if(!o&&i){var p=["var CONFETTI, SIZE = {}, module = {};","("+l.toString()+")(this, module, true, SIZE);","onmessage = function(msg) {","  if (msg.data.options) {","    CONFETTI(msg.data.options).then(function () {","      if (msg.data.callback) {","        postMessage({ callback: msg.data.callback });","      }","    });","  } else if (msg.data.reset) {","    CONFETTI && CONFETTI.reset();","  } else if (msg.data.resize) {","    SIZE.width = msg.data.resize.width;","    SIZE.height = msg.data.resize.height;","  } else if (msg.data.canvas) {","    SIZE.width = msg.data.canvas.width;","    SIZE.height = msg.data.canvas.height;","    CONFETTI = module.exports.create(msg.data.canvas);","  }","}"].join(`
`);try{s=new Worker(URL.createObjectURL(new Blob([p])))}catch(b){return typeof console!==void 0&&typeof console.warn=="function"&&console.warn("🎊 Could not load worker",b),null}u(s)}return s}}(),L={particleCount:50,angle:90,spread:45,startVelocity:45,decay:.9,gravity:1,drift:0,ticks:200,x:.5,y:.5,shapes:["square","circle"],zIndex:100,colors:["#26ccff","#a25afd","#ff5e7e","#88ff5a","#fcff42","#ffa62d","#ff36ff"],disableForReducedMotion:!1,scalar:1};function T(s,r){return r?r(s):s}function N(s){return s!=null}function v(s,r,m){return T(s&&N(s[r])?s[r]:L[r],m)}function A(s){return s<0?0:Math.floor(s)}function U(s,r){return Math.floor(Math.random()*(r-s))+s}function O(s){return parseInt(s,16)}function q(s){return s.map(G)}function G(s){var r=String(s).replace(/[^0-9a-f]/gi,"");return r.length<6&&(r=r[0]+r[0]+r[1]+r[1]+r[2]+r[2]),{r:O(r.substring(0,2)),g:O(r.substring(2,4)),b:O(r.substring(4,6))}}function R(s){var r=v(s,"origin",Object);return r.x=v(r,"x",Number),r.y=v(r,"y",Number),r}function V(s){s.width=document.documentElement.clientWidth,s.height=document.documentElement.clientHeight}function M(s){var r=s.getBoundingClientRect();s.width=r.width,s.height=r.height}function z(s){var r=document.createElement("canvas");return r.style.position="fixed",r.style.top="0px",r.style.left="0px",r.style.pointerEvents="none",r.style.zIndex=s,r}function B(s,r,m,u,p,b,y,g,w){s.save(),s.translate(r,m),s.rotate(b),s.scale(u,p),s.arc(0,0,1,y,g,w),s.restore()}function K(s){var r=s.angle*(Math.PI/180),m=s.spread*(Math.PI/180);return{x:s.x,y:s.y,wobble:Math.random()*10,wobbleSpeed:Math.min(.11,Math.random()*.1+.05),velocity:s.startVelocity*.5+Math.random()*s.startVelocity,angle2D:-r+(.5*m-Math.random()*m),tiltAngle:(Math.random()*(.75-.25)+.25)*Math.PI,color:s.color,shape:s.shape,tick:0,totalTicks:s.ticks,decay:s.decay,drift:s.drift,random:Math.random()+2,tiltSin:0,tiltCos:0,wobbleX:0,wobbleY:0,gravity:s.gravity*3,ovalScalar:.6,scalar:s.scalar,flat:s.flat}}function ee(s,r){r.x+=Math.cos(r.angle2D)*r.velocity+r.drift,r.y+=Math.sin(r.angle2D)*r.velocity+r.gravity,r.velocity*=r.decay,r.flat?(r.wobble=0,r.wobbleX=r.x+10*r.scalar,r.wobbleY=r.y+10*r.scalar,r.tiltSin=0,r.tiltCos=0,r.random=1):(r.wobble+=r.wobbleSpeed,r.wobbleX=r.x+10*r.scalar*Math.cos(r.wobble),r.wobbleY=r.y+10*r.scalar*Math.sin(r.wobble),r.tiltAngle+=.1,r.tiltSin=Math.sin(r.tiltAngle),r.tiltCos=Math.cos(r.tiltAngle),r.random=Math.random()+2);var m=r.tick++/r.totalTicks,u=r.x+r.random*r.tiltCos,p=r.y+r.random*r.tiltSin,b=r.wobbleX+r.random*r.tiltCos,y=r.wobbleY+r.random*r.tiltSin;if(s.fillStyle="rgba("+r.color.r+", "+r.color.g+", "+r.color.b+", "+(1-m)+")",s.beginPath(),n&&r.shape.type==="path"&&typeof r.shape.path=="string"&&Array.isArray(r.shape.matrix))s.fill(Ye(r.shape.path,r.shape.matrix,r.x,r.y,Math.abs(b-u)*.1,Math.abs(y-p)*.1,Math.PI/10*r.wobble));else if(r.shape.type==="bitmap"){var g=Math.PI/10*r.wobble,w=Math.abs(b-u)*.1,C=Math.abs(y-p)*.1,I=r.shape.bitmap.width*r.scalar,P=r.shape.bitmap.height*r.scalar,F=new DOMMatrix([Math.cos(g)*w,Math.sin(g)*w,-Math.sin(g)*C,Math.cos(g)*C,r.x,r.y]);F.multiplySelf(new DOMMatrix(r.shape.matrix));var _=s.createPattern(k.transform(r.shape.bitmap),"no-repeat");_.setTransform(F),s.globalAlpha=1-m,s.fillStyle=_,s.fillRect(r.x-I/2,r.y-P/2,I,P),s.globalAlpha=1}else if(r.shape==="circle")s.ellipse?s.ellipse(r.x,r.y,Math.abs(b-u)*r.ovalScalar,Math.abs(y-p)*r.ovalScalar,Math.PI/10*r.wobble,0,2*Math.PI):B(s,r.x,r.y,Math.abs(b-u)*r.ovalScalar,Math.abs(y-p)*r.ovalScalar,Math.PI/10*r.wobble,0,2*Math.PI);else if(r.shape==="star")for(var E=Math.PI/2*3,Y=4*r.scalar,J=8*r.scalar,X=r.x,ae=r.y,le=5,te=Math.PI/le;le--;)X=r.x+Math.cos(E)*J,ae=r.y+Math.sin(E)*J,s.lineTo(X,ae),E+=te,X=r.x+Math.cos(E)*Y,ae=r.y+Math.sin(E)*Y,s.lineTo(X,ae),E+=te;else s.moveTo(Math.floor(r.x),Math.floor(r.y)),s.lineTo(Math.floor(r.wobbleX),Math.floor(p)),s.lineTo(Math.floor(b),Math.floor(y)),s.lineTo(Math.floor(u),Math.floor(r.wobbleY));return s.closePath(),s.fill(),r.tick<r.totalTicks}function H(s,r,m,u,p){var b=r.slice(),y=s.getContext("2d"),g,w,C=f(function(I){function P(){g=w=null,y.clearRect(0,0,u.width,u.height),k.clear(),p(),I()}function F(){o&&!(u.width===a.width&&u.height===a.height)&&(u.width=s.width=a.width,u.height=s.height=a.height),!u.width&&!u.height&&(m(s),u.width=s.width,u.height=s.height),y.clearRect(0,0,u.width,u.height),b=b.filter(function(_){return ee(y,_)}),b.length?g=h.frame(F):P()}g=h.frame(F),w=P});return{addFettis:function(I){return b=b.concat(I),C},canvas:s,promise:C,reset:function(){g&&h.cancel(g),w&&w()}}}function se(s,r){var m=!s,u=!!v(r||{},"resize"),p=!1,b=v(r,"disableForReducedMotion",Boolean),y=i&&!!v(r||{},"useWorker"),g=y?x():null,w=m?V:M,C=s&&g?!!s.__confetti_initialized:!1,I=typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion)").matches,P;function F(E,Y,J){for(var X=v(E,"particleCount",A),ae=v(E,"angle",Number),le=v(E,"spread",Number),te=v(E,"startVelocity",Number),Ke=v(E,"decay",Number),Je=v(E,"gravity",Number),Xe=v(E,"drift",Number),Ie=v(E,"colors",q),Ze=v(E,"ticks",Number),Fe=v(E,"shapes"),Qe=v(E,"scalar"),et=!!v(E,"flat"),Ne=R(E),Oe=X,Ce=[],tt=s.width*Ne.x,ot=s.height*Ne.y;Oe--;)Ce.push(K({x:tt,y:ot,angle:ae,spread:le,startVelocity:te,color:Ie[Oe%Ie.length],shape:Fe[U(0,Fe.length)],ticks:Ze,decay:Ke,gravity:Je,drift:Xe,scalar:Qe,flat:et}));return P?P.addFettis(Ce):(P=H(s,Ce,w,Y,J),P.promise)}function _(E){var Y=b||v(E,"disableForReducedMotion",Boolean),J=v(E,"zIndex",Number);if(Y&&I)return f(function(te){te()});m&&P?s=P.canvas:m&&!s&&(s=z(J),document.body.appendChild(s)),u&&!C&&w(s);var X={width:s.width,height:s.height};g&&!C&&g.init(s),C=!0,g&&(s.__confetti_initialized=!0);function ae(){if(g){var te={getBoundingClientRect:function(){if(!m)return s.getBoundingClientRect()}};w(te),g.postMessage({resize:{width:te.width,height:te.height}});return}X.width=X.height=null}function le(){P=null,u&&(p=!1,e.removeEventListener("resize",ae)),m&&s&&(document.body.contains(s)&&document.body.removeChild(s),s=null,C=!1)}return u&&!p&&(p=!0,e.addEventListener("resize",ae,!1)),g?g.fire(E,X,le):F(E,X,le)}return _.reset=function(){g&&g.reset(),P&&P.reset()},_}var ne;function ze(){return ne||(ne=se(null,{useWorker:!0,resize:!0})),ne}function Ye(s,r,m,u,p,b,y){var g=new Path2D(s),w=new Path2D;w.addPath(g,new DOMMatrix(r));var C=new Path2D;return C.addPath(w,new DOMMatrix([Math.cos(y)*p,Math.sin(y)*p,-Math.sin(y)*b,Math.cos(y)*b,m,u])),C}function He(s){if(!n)throw new Error("path confetti are not supported in this browser");var r,m;typeof s=="string"?r=s:(r=s.path,m=s.matrix);var u=new Path2D(r),p=document.createElement("canvas"),b=p.getContext("2d");if(!m){for(var y=1e3,g=y,w=y,C=0,I=0,P,F,_=0;_<y;_+=2)for(var E=0;E<y;E+=2)b.isPointInPath(u,_,E,"nonzero")&&(g=Math.min(g,_),w=Math.min(w,E),C=Math.max(C,_),I=Math.max(I,E));P=C-g,F=I-w;var Y=10,J=Math.min(Y/P,Y/F);m=[J,0,0,J,-Math.round(P/2+g)*J,-Math.round(F/2+w)*J]}return{type:"path",path:r,matrix:m}}function Ge(s){var r,m=1,u="#000000",p='"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "EmojiOne Color", "Android Emoji", "Twemoji Mozilla", "system emoji", sans-serif';typeof s=="string"?r=s:(r=s.text,m="scalar"in s?s.scalar:m,p="fontFamily"in s?s.fontFamily:p,u="color"in s?s.color:u);var b=10*m,y=""+b+"px "+p,g=new OffscreenCanvas(b,b),w=g.getContext("2d");w.font=y;var C=w.measureText(r),I=Math.ceil(C.actualBoundingBoxRight+C.actualBoundingBoxLeft),P=Math.ceil(C.actualBoundingBoxAscent+C.actualBoundingBoxDescent),F=2,_=C.actualBoundingBoxLeft+F,E=C.actualBoundingBoxAscent+F;I+=F+F,P+=F+F,g=new OffscreenCanvas(I,P),w=g.getContext("2d"),w.font=y,w.fillStyle=u,w.fillText(r,_,E);var Y=1/m;return{type:"bitmap",bitmap:g.transferToImageBitmap(),matrix:[Y,0,0,Y,-I*Y/2,-P*Y/2]}}t.exports=function(){return ze().apply(this,arguments)},t.exports.reset=function(){ze().reset()},t.exports.create=se,t.exports.shapeFromPath=He,t.exports.shapeFromText=Ge})(function(){return typeof window<"u"?window:typeof self<"u"?self:this||{}}(),Ae,!1);const pt=Ae.exports;Ae.exports.create;const bt="modulepreload",yt=function(l,e){return new URL(l,e).href},Be={},Te=function(e,t,o){let a=Promise.resolve();if(t&&t.length>0){const n=document.getElementsByTagName("link"),c=document.querySelector("meta[property=csp-nonce]"),d=(c==null?void 0:c.nonce)||(c==null?void 0:c.getAttribute("nonce"));a=Promise.allSettled(t.map(f=>{if(f=yt(f,o),f in Be)return;Be[f]=!0;const k=f.endsWith(".css"),h=k?'[rel="stylesheet"]':"";if(!!o)for(let T=n.length-1;T>=0;T--){const N=n[T];if(N.href===f&&(!k||N.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${f}"]${h}`))return;const L=document.createElement("link");if(L.rel=k?"stylesheet":bt,k||(L.as="script"),L.crossOrigin="",L.href=f,d&&L.setAttribute("nonce",d),document.head.appendChild(L),k)return new Promise((T,N)=>{L.addEventListener("load",T),L.addEventListener("error",()=>N(new Error(`Unable to preload CSS for ${f}`)))})}))}function i(n){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=n,window.dispatchEvent(c),!c.defaultPrevented)throw n}return a.then(n=>{for(const c of n||[])c.status==="rejected"&&i(c.reason);return e().catch(i)})},ie=me("Preferences",{web:()=>Te(()=>import("./web.DiSoNpLB.js"),[],import.meta.url).then(l=>new l.PreferencesWeb)});var we,W;class S{static async initialize(){if(!j(this,we))try{const e=await this.get(this.KEYS.SETTINGS);e?Z(this,W,e):await this.set(this.KEYS.SETTINGS,j(this,W)),Z(this,we,!0),console.log("✅ Storage inicializado:",j(this,W))}catch(e){console.error("❌ Error inicializando Storage:",e)}}static async get(e,t=null){try{const{value:o}=await ie.get({key:e});return o?JSON.parse(o):t}catch{try{const a=localStorage.getItem(e);return a?JSON.parse(a):t}catch(a){return console.error(`Error leyendo ${e}:`,a),t}}}static async set(e,t){try{return await ie.set({key:e,value:JSON.stringify(t)}),e===this.KEYS.SETTINGS&&Z(this,W,t),!0}catch{try{return localStorage.setItem(e,JSON.stringify(t)),e===this.KEYS.SETTINGS&&Z(this,W,t),!0}catch(a){return console.error(`Error guardando ${e}:`,a),!1}}}static get isVibrationEnabled(){return j(this,W).vibrationEnabled}static get isNotificationEnabled(){return j(this,W).notificationEnabled}static async setVibrationEnabled(e){return j(this,W).vibrationEnabled=e,this.set(this.KEYS.SETTINGS,j(this,W))}static async setNotificationEnabled(e){return j(this,W).notificationEnabled=e,this.set(this.KEYS.SETTINGS,j(this,W))}static async getCurrentLevel(){return this.get(this.KEYS.CURRENT_LEVEL)}static async setCurrentLevel(e){return this.set(this.KEYS.CURRENT_LEVEL,e)}static async getCurrentTheme(){return this.get(this.KEYS.THEME)}static async setCurrentTheme(e){return this.set(this.KEYS.THEME,e)}static async resetToDefaults(){Z(this,W,{vibrationEnabled:!0,notificationEnabled:!0}),await Promise.all([this.set(this.KEYS.SETTINGS,j(this,W)),this.set(this.KEYS.THEME,"dark"),this.set(this.KEYS.CURRENT_LEVEL,Q[0])])}}we=new WeakMap,W=new WeakMap,be(S,"KEYS",{THEME:"theme",CURRENT_LEVEL:"currentLevel",SETTINGS:"settings"}),ge(S,we,!1),ge(S,W,{vibrationEnabled:!0,notificationEnabled:!0});var We;(function(l){l[l.Sunday=1]="Sunday",l[l.Monday=2]="Monday",l[l.Tuesday=3]="Tuesday",l[l.Wednesday=4]="Wednesday",l[l.Thursday=5]="Thursday",l[l.Friday=6]="Friday",l[l.Saturday=7]="Saturday"})(We||(We={}));const ce=me("LocalNotifications",{web:()=>Te(()=>import("./web.B4BGIex0.js"),[],import.meta.url).then(l=>new l.LocalNotificationsWeb)}),ve=me("App",{web:()=>Te(()=>import("./web.0urCVRTF.js"),[],import.meta.url).then(l=>new l.AppWeb)});var ke;(function(l){l.Heavy="HEAVY",l.Medium="MEDIUM",l.Light="LIGHT"})(ke||(ke={}));var Le;(function(l){l.Success="SUCCESS",l.Warning="WARNING",l.Error="ERROR"})(Le||(Le={}));const xe=me("Haptics",{web:()=>Te(()=>import("./web.CYgRyw0C.js"),[],import.meta.url).then(l=>new l.HapticsWeb)});var Se;(function(l){l.Dark="DARK",l.Light="LIGHT",l.Default="DEFAULT"})(Se||(Se={}));var $e;(function(l){l.None="NONE",l.Slide="SLIDE",l.Fade="FADE"})($e||($e={}));const ye=me("StatusBar");var de,he,fe;class D{static get isInitialized(){return j(this,de)}static async initialize(){console.group("🎮 Inicialización de GameSalad"),console.time("initialization");try{return $.isNative||(await this.cleanupServiceWorker(),await this.setupWebServices()),console.log("Estado inicial:",{readyState:document.readyState,fontsLoaded:document.fonts.check('1em "Rubik"'),viewport:{width:window.innerWidth,height:window.innerHeight}}),await this.initializeStorage(),$.isNative&&await this.setupNativeServices(),Z(this,de,!0),console.timeEnd("initialization"),!0}catch(e){return console.error("[Capacitor] ❌ Error:",e),!1}finally{console.groupEnd()}}static async cleanupServiceWorker(){if("serviceWorker"in navigator)try{const e=await navigator.serviceWorker.getRegistrations();await Promise.all(e.map(o=>(console.log("Desregistrando SW:",o.scope),o.unregister())));const t=await caches.keys();await Promise.all(t.map(o=>(console.log("Eliminando caché:",o),caches.delete(o)))),console.log("✅ Service Workers y caches limpiados")}catch(e){console.warn("Error limpiando SW:",e)}}static async setupWebServices(){console.group("[Capacitor] Configurando servicios web");try{if("serviceWorker"in navigator)try{Z(this,fe,await navigator.serviceWorker.register("./sw.js",{scope:"./",type:"module"})),console.log("✅ Notification SW registrado"),await navigator.serviceWorker.ready}catch(e){console.warn("❌ Error registrando Notification SW:",e)}if("Notification"in window){const e=await Notification.requestPermission();console.log("- Permisos de notificación:",e)}console.log("✅ Servicios web configurados")}catch(e){console.error("❌ Error configurando servicios web:",e)}console.groupEnd()}static async setupNativeServices(){console.group("[Capacitor] Configurando servicios nativos");const e=[{name:"App",instance:ve},{name:"Haptics",instance:xe},{name:"LocalNotifications",instance:ce},{name:"Preferences",instance:ie}];for(const{name:t,instance:o}of e)try{const a=$.isPluginAvailable(t);if(console.log(`- ${t}: ${a?"✓":"✗"}`),a&&o&&t==="LocalNotifications"){const i=await o.checkPermissions();console.log(`  Permisos: ${i.display}`)}}catch(a){console.warn(`❌ Error verificando ${t}:`,a)}try{$.getPlatform()==="ios"?(await ye.setOverlaysWebView(!0),await ye.setStyle({style:Se.Light})):(await ye.setOverlaysWebView(!1),await ye.setBackgroundColor({color:"#000000"}),await ye.setStyle({style:Se.Dark}))}catch(t){console.warn("[Capacitor] No se pudo configurar StatusBar:",t)}this.setupAppListeners(),console.log("✅ Configuración nativa completada"),console.groupEnd()}static async setupWebNotifications(){if("Notification"in window){const e=await Notification.requestPermission();console.log("Permisos de notificación web:",e)}}static async setupServiceWorker(){if(!j(this,de))try{if(this.setupAppListeners(),Z(this,he,$.isNative),console.log("Plataforma nativa:",j(this,he)),"serviceWorker"in navigator)try{!(window.location.hostname==="localhost"||window.location.hostname.includes("192.168.")||window.location.hostname.includes("127.0.0.1"))||window.location.protocol==="http:"?(Z(this,fe,await navigator.serviceWorker.register("/sw.js",{scope:"/",type:"classic",updateViaCache:"none"})),console.log("✅ Service Worker registrado:",j(this,fe))):console.log("Service Worker no registrado en desarrollo local")}catch(e){console.warn("Service Worker no disponible:",e)}Z(this,de,!0),console.log("✅ Servicios nativos inicializados")}catch(e){console.error("❌ Error inicializando servicios nativos:",e)}}static setupAppListeners(){ve.addListener("backButton",({canGoBack:e})=>{e||ve.exitApp()}),ve.addListener("appStateChange",({isActive:e})=>{e?document.dispatchEvent(new Event("appResume")):document.dispatchEvent(new Event("appPause"))})}static async initializeNotifications(){var e;if(console.group("🔔 Inicializando sistema de notificaciones"),j(this,he))try{console.log("📱 Intentando usar notificaciones nativas...");const{display:t}=await ce.checkPermissions();if(console.log("Estado de permisos nativos:",t),t==="granted"||t==="prompt"){const o=await ce.requestPermissions();if(console.log("Nuevos permisos nativos:",o.display),o.display==="granted"){console.log("✅ Notificaciones nativas activadas"),console.groupEnd();return}}}catch(t){console.warn("❌ Notificaciones nativas no disponibles:",t)}if("Notification"in window)try{let t=Notification.permission;if(t==="default"&&(console.log("📱 Solicitando permisos de notificación..."),t=await Notification.requestPermission()),t==="granted"){(e=j(this,fe))!=null&&e.active?console.log("✅ Service Worker notifications activadas"):console.log("✅ Web Notifications activadas"),console.groupEnd();return}else console.warn("❌ Permisos de notificación denegados:",t)}catch(t){console.warn("❌ Error solicitando permisos:",t)}console.warn("❌ No hay sistema de notificaciones disponible"),console.groupEnd()}static async vibrate(e="MEDIUM"){try{switch(e.toUpperCase()){case"LIGHT":await xe.impact({style:ke.Light});break;case"HEAVY":await xe.notification({type:Le.Success});break;case"MEDIUM":default:await xe.impact({style:ke.Medium})}return!0}catch{return console.warn("Haptics no disponible"),!1}}static getIconPath(){console.group("🖼️ Obteniendo rutas de iconos");const e=$.getPlatform();let t;return e==="android"?t="ic_notification":e==="ios"?t="AppIcon":t="./assets/images/icon.png",console.log("Plataforma:",e),console.log("Icono seleccionado:",t),console.groupEnd(),t}static async sendNotification(e,t){console.group("📱 Enviando notificación");try{const o=$.getPlatform();if(console.log("Plataforma detectada:",o),o==="android"||o==="ios"){console.log(`Usando notificaciones nativas (${o})`);const a=await ce.requestPermissions();if(console.log("Permisos:",a),a.display!=="granted")throw new Error(`Permiso denegado en ${o}`);const i=new Date(Date.now()+2e3),n={title:e,body:t,id:Math.floor(Date.now()/1e3),schedule:{at:i,allowWhileIdle:!0},autoCancel:!0,smallIcon:o==="android"?"ic_notification":"AppIcon",android:{channelId:"default",importance:4,priority:3,visibility:1,smallIcon:"ic_notification"}};return await ce.schedule({notifications:[n]}),console.log(`✅ Notificación ${o} programada para:`,i),!0}if(typeof window>"u"||typeof window.Notification>"u")throw console.warn("❌ API Notification no está disponible"),new Error("Notificaciones web no soportadas");if(o!=="android"&&o!=="ios"&&!("Notification"in window))throw console.warn("❌ API Notification no está disponible en este entorno"),new Error("Notificaciones web no soportadas");if("Notification"in window&&"serviceWorker"in navigator){if(console.log("Usando notificaciones web"),await Notification.requestPermission()==="granted")return await(await navigator.serviceWorker.ready).showNotification(e,{body:t,icon:"./assets/images/icon.png",vibrate:[200,100,200],requireInteraction:!0,data:{url:window.location.origin}}),console.log("✅ Notificación web enviada"),!0;throw new Error("Permiso de notificación denegado")}throw new Error("Sistema de notificaciones no disponible")}catch(o){throw console.error("❌ Error en notificación:",o),o}finally{console.groupEnd()}}static async scheduleNativeNotification(e,t,o){console.group("📱 Programando notificación nativa");try{console.log("Cancelando notificaciones anteriores..."),await ce.cancel({notifications:[{id:1}]});const a=new Date(Date.now()+o*60*60*1e3);return console.log("Tiempo programado:",a),await ce.schedule({notifications:[{title:e,body:t,id:1,schedule:{at:a,allowWhileIdle:!0},actionTypeId:"OPEN_APP"}]}),console.log("✅ Notificación nativa programada"),console.groupEnd(),!0}catch(a){return console.error("❌ Error en notificación nativa:",a),console.groupEnd(),!1}}static isMobile(){return/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)||"maxTouchPoints"in navigator&&navigator.maxTouchPoints>0}static async scheduleMobileNotification(e,t){console.group("📱 Programando Service Worker notification");try{const o=await navigator.serviceWorker.ready;return console.log("Service Worker listo"),await o.showNotification(e,{body:t,icon:"./assets/images/icon.png",vibrate:[200,100,200]}),console.log("✅ Service Worker notification mostrada"),console.groupEnd(),!0}catch(o){return console.error("❌ Error en Service Worker notification:",o),console.groupEnd(),!1}}static async saveData(e,t){try{return await ie.set({key:e,value:JSON.stringify(t)}),!0}catch{return console.warn("Error guardando en Preferences, usando localStorage"),localStorage.setItem(e,JSON.stringify(t)),!1}}static async getData(e,t=null){try{const{value:o}=await ie.get({key:e});return o?JSON.parse(o):t}catch{console.warn("Error leyendo de Preferences, usando localStorage");const o=localStorage.getItem(e);return o?JSON.parse(o):t}}static async removeData(e){try{return await ie.remove({key:e}),!0}catch{return localStorage.removeItem(e),!1}}static async clearData(){try{return await ie.clear(),!0}catch{return localStorage.clear(),!1}}static async logToNative(e,t={}){this._recentLogs||(this._recentLogs=new Set);const o=`${e}-${JSON.stringify(t)}`;this._recentLogs.has(o)||(this._recentLogs.add(o),setTimeout(()=>this._recentLogs.delete(o),1e3),$.getPlatform()==="android"?console.debug(`[GameSalad] ${e}`,JSON.stringify(t,null,2)):console.log(e,t))}static async initializeStorage(){try{if($.isNative){const t="_test_storage_";await ie.set({key:t,value:"test"}),await ie.remove({key:t})}else{const t="_test_storage_";localStorage.setItem(t,"test"),localStorage.removeItem(t)}const e={vibrationEnabled:await this.getData("vibrationEnabled",!0),notificationEnabled:await this.getData("notificationEnabled",!0)};return console.log("✅ Storage inicializado:",e),e}catch(e){return console.error("❌ Error inicializando Storage:",e),{vibrationEnabled:!0,notificationEnabled:!0}}}static async adjustTitle(e,t,o,a){const i=(performance.now()/1e3).toFixed(3);console.log(`⏱️ [${i}] Ajustando título:`,{texto:e,contenedor:t,disponible:o,anchoActual:a});const n=e==="VG Characters";if(!e||a<=o)return console.log(`⏱️ [${i}] No necesita ajuste`),n&&document.dispatchEvent(new CustomEvent("title-adjusted",{detail:{timestamp:i,texto:e,anchoActual:a,disponible:o,final:!0}})),!0;document.dispatchEvent(new CustomEvent("title-adjusted",{detail:{timestamp:i,texto:e,anchoActual:a,disponible:o,needed:!0}}))}}de=new WeakMap,he=new WeakMap,fe=new WeakMap,ge(D,de,!1),ge(D,he,!1),ge(D,fe,null);class oe{static async measureText(e,t){const o=document.createElement("div");o.style.cssText=`
            position: absolute;
            visibility: hidden;
            white-space: pre;
            ${Object.entries(t).map(([i,n])=>`${i}:${n}`).join(";")}
        `,o.textContent=e,document.body.appendChild(o);const a={width:o.offsetWidth,height:o.offsetHeight,left:o.offsetLeft,top:o.offsetTop};return document.body.removeChild(o),a}static animateWordFound(e,t,o){return new Promise(a=>{const i=document.getElementById(`tile-${e[e.length-1]}`),n=i.querySelector(".text"),c=t.querySelector("span");c.style.opacity="0";const d=window.getComputedStyle(c),f={source:window.getComputedStyle(n),target:window.getComputedStyle(t)};(async()=>{const k=await Promise.all([...o].map(async A=>this.measureText(A,{"font-size":d.fontSize,"font-family":"var(--font-family-content)","font-weight":f.target.fontWeight,"letter-spacing":f.target.letterSpacing,"text-transform":f.target.textTransform,"font-feature-settings":f.target.fontFeatureSettings}))),h=k.reduce((A,U)=>A+U.width,0),x=c.getBoundingClientRect(),L=i.getBoundingClientRect(),T=(x.width-h)/2,N=[...o].map((A,U)=>{const O=document.createElement("span");O.textContent=A===" "?" ":A,O.className="animated-letter";const q=L.left+L.width/2,G=L.top+L.height/2;O.style.cssText=`
                        position: fixed;
                        left: ${q}px;
                        top: ${G}px;
                        transform: translate(-50%, -50%);
                        opacity: 1;
                    `,document.body.appendChild(O);const R=k.slice(0,U).reduce((z,B)=>z+B.width,0),V=x.left+T+R+k[U].width/2,M=x.top+x.height/2;return{element:O,endX:V,endY:M,startX:q,startY:G,sourceStyles:f.source,targetStyles:f.target}});N.forEach(({element:A,endX:U,endY:O,startX:q,startY:G},R)=>{setTimeout(()=>{A.classList.add("animating"),requestAnimationFrame(()=>{A.classList.add("in-transit");const V=U-q,M=O-G;A.style.cssText+=`
                                font-size: ${d.fontSize};
                                color: white;
                                transform: translate(
                                    calc(-50% + ${V}px),
                                    calc(-50% + ${M}px)
                                );
                            `;const z=B=>{B.propertyName==="transform"&&(A.removeEventListener("transitionend",z),A.classList.remove("animating","in-transit"),R===N.length-1&&(c.textContent=o,c.style.opacity="1",requestAnimationFrame(()=>{document.querySelectorAll(".animated-letter").forEach(K=>K.remove())})))};A.addEventListener("transitionend",z)})},R*this.DURATIONS.LETTER_DELAY)}),e.forEach(A=>{document.getElementById(`tile-${A}`).classList.add("found-temp")});const v=N.length*this.DURATIONS.LETTER_DELAY+this.DURATIONS.LETTER_ANIMATION;setTimeout(()=>{e.forEach(A=>{document.getElementById(`tile-${A}`).classList.remove("found-temp")}),a(v)},v)})()})}static async animateUnusedCells(e){e.forEach(t=>{const o=document.getElementById(`tile-${t}`);requestAnimationFrame(()=>o.classList.add("unused"))})}static async animateVictory(e){document.getElementById("victory-modal").classList.add("active"),await new Promise(o=>requestAnimationFrame(o)),await this.confetti.start(),e==null||e()}static resetSelectionWithDelay(e){setTimeout(()=>e.reset(),this.DURATIONS.SELECTION_RESET)}static updateCellStates(e,{add:t=[],remove:o=[]}){e.forEach(a=>{t.length&&requestAnimationFrame(()=>a.classList.add(...t)),o.length&&a.classList.remove(...o)})}static stopConfetti(){this.confetti.stop()}static cleanupAnimations(){const e=document.querySelectorAll(".animated-letter");e.length>0&&e.forEach(t=>t.remove())}static bindDebugEvents(){document.addEventListener("keydown",e=>{if(e.key.toLowerCase()==="t"&&this.confetti.test(),!isNaN(parseInt(e.key))&&e.key!=="0"){const t=parseInt(e.key)/10;this.confetti.test(t)}})}}be(oe,"DURATIONS",{LETTER_DELAY:50,LETTER_ANIMATION:300,VICTORY_DELAY:300}),be(oe,"confetti",{instance:null,async initialize(){const e=document.getElementById("confetti-canvas");if(!e){console.warn("❌ No se encontró el canvas");return}try{this.instance=pt.create(e,{resize:!0})}catch(t){console.error("❌ Error creando instancia:",t)}},async fire(e){this.instance||await this.initialize(),this.instance&&this.instance(e)},getColors(){const e=getComputedStyle(document.documentElement).getPropertyValue("--confetti-colors").trim();return e?e.split(",").map(t=>t.trim()):["#ffd700","#ff3939","#00ff7f","#4169e1","#ff69b4"]},stop(){this.instance&&(this.instance.reset(),this.instance=null)},start(){return new Promise(e=>{(async()=>{this.instance||await this.initialize();const o=this.getColors();await this.executeFirstWave(o),await new Promise(a=>setTimeout(a,250)),await this.executeSecondWave(o),e()})()})},async executeConfettiSequence(e){const t=this.getColors();await this.executeFirstWave(t),await new Promise(o=>setTimeout(o,250)),await this.executeSecondWave(t),e()},async executeFirstWave(e){this.fire({particleCount:100,spread:70,origin:{x:.1,y:.35},colors:e}),this.fire({particleCount:100,spread:70,origin:{x:.9,y:.35},colors:e}),S.isVibrationEnabled&&await D.vibrate("MEDIUM")},async executeSecondWave(e){this.fire({particleCount:150,spread:100,origin:{x:.5,y:.3},gravity:1.2,scalar:1.2,drift:0,ticks:300,colors:e}),S.isVibrationEnabled&&await D.vibrate("HEAVY")},test(e=.5,t=.35){this.fire({particleCount:50,spread:70,origin:{x:e,y:t},colors:this.getColors()})}});oe.bindDebugEvents();const Ee=`/* stylelint-disable no-unknown-custom-properties */
/* Transición suave entre temas */
.theme-transitioning {
    opacity: 0.3;
    pointer-events: none;
    transition: opacity 0.05s ease-out;
}
*,
*::before,
*::after {
    box-sizing: border-box;
}
* {
    margin: 0;
}
img,
picture,
video,
canvas,
svg {
    display: block;
    max-width: 100%;
}
input,
button,
textarea,
select {
    font: inherit;
}
p,
h1,
h2,
h3,
h4,
h5,
h6 {
    overflow-wrap: break-word;
}
p {
    text-wrap: pretty;
}
h1,
h2,
h3,
h4,
h5,
h6 {
    text-wrap: balance;
}
/* stylelint-disable-next-line selector-id-pattern */
#__next,
#root {
    isolation: isolate;
}
:root {
    /* Dimensiones base */
    --game-width: min(95vw, 600px);
    --game-height: 100dvh;
    /* Espaciado y gaps */
    --cell-gap: clamp(2px, 0.5dvh, 4px);
    --board-outer-gap: max(var(--cell-gap), 4px);
    /* Alturas de secciones */
    --header-height: clamp(40px, 5dvh, 50px);
    --title-height: clamp(40px, 8dvh, 60px);
    /* Aumentado desde 30px/5dvh/40px */
    --words-height: clamp(80px, 20dvh, 160px);
    /* Eliminar el padding base del tablero */
    --board-side-margin: clamp(8px, 2vw, 16px);
    --board-width: min(calc(var(--game-width) - (var(--board-side-margin) * 2)),
            calc((100dvh - var(--header-height) - var(--title-height) - var(--words-height) - (var(--game-dynamic-gap) * 4))));
    --board-height: var(--board-width);
    --cell-size: calc((var(--board-width) - (var(--cell-gap) * 3)) / 4);
    /* Simplificar el cálculo */
    --mark-size: calc(var(--cell-size) * 0.6);
    --line-width: clamp(4px, 1dvh, 10px);
    /* Elementos de palabras */
    --word-height: clamp(32px, calc(var(--board-width) * 0.12), 50px);
    --word-padding-block: clamp(4px, calc(var(--word-height) * 0.1), 6px);
    --word-padding-inline: clamp(12px, calc(var(--word-height) * 0.3), 24px);
    --word-content-width: auto;
    --word-font-size: clamp(16px, calc(var(--word-height) * 0.45), 24px);
    --word-list-gap: clamp(8px, calc(var(--board-width) * 0.02), 16px);
    /* Fuentes */
    --font-size-ui: 1.1rem;
    --font-size-text: clamp(12px, 3.5cqw, 16px);
    --font-size-modal-h2: 1.2rem;
    /* Layout y contenedores */
    --modal-width: min(90%, var(--game-width));
    --modal-border-radius: min(16px, 3vw);
    --safe-area-bottom: env(safe-area-inset-bottom, 0);
    /* Efectos y animaciones */
    --modal-backdrop: rgb(0 0 0 / 70%);
    --blur-overlay: blur(4px);
    --animation-duration-found: 500ms;
    --animation-duration-particle: 350ms;
    --animation-timing: cubic-bezier(0.2, 0, 0.2, 1);
    --transition-base: all 0.3s var(--animation-timing);
    /* Efectos visuales */
    --effect-ambient: linear-gradient(var(--effect-color-1, transparent),
            var(--effect-color-2, transparent));
    --effect-glow: 0 0 var(--glow-radius, 20px) var(--glow-color, transparent);
    --effect-blur: var(--blur-amount, 0);
    --effect-overlay: var(--overlay-color, transparent);
    /* Efectos base */
    --shadow-opacity: 0.3;
    --shadow-sm: 0 4px 6px rgb(0 0 0 / var(--shadow-opacity));
    --shadow-md: 0 8px 12px rgb(0 0 0 / var(--shadow-opacity));
    --shadow-lg: 0 12px 24px rgb(0 0 0 / var(--shadow-opacity));
    /* Dimensiones del título */
    --title-padding-inline: clamp(12px, 3vw, 20px);
    --title-min-font: clamp(1.8rem, 5vw, 2.5rem);
    /* Aumentado el mínimo */
    --font-size-title: clamp(var(--title-min-font), 10vw, 3.5rem);
    /* Aumentado el máximo */
    /* Modificar las variables de espaciado */
    --game-min-gap: clamp(4px, 1dvh, 8px);
    --game-dynamic-gap: clamp(var(--game-min-gap), 3dvh, 24px);
    /* Nueva variable para el margen lateral */
    --platform-scale: 1;
}
/* Ajustes específicos para Android */
[data-platform="android"] {
    --platform-scale: 1.2;
    /* 20% más grande en Android */
    --title-min-font: clamp(2rem, 6vw, 2.8rem);
    /* Mínimos más grandes para Android */
}
html {
    background: #121212;
    height: -webkit-fill-available;
}
/* Modificar la transición del body */
body {
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: var(--game-height);
    background: var(--color-bg);
    color: var(--color-text);
    font-family: var(--font-cell-family);
    align-items: center;
    min-height: 100dvh;
    max-height: 100dvh;
    padding-bottom: var(--safe-area-bottom);
    opacity: 1;
    transition: opacity 0.2s ease-out, background-color 0.2s ease-out;
}
body.js-loading {
    opacity: 1;
    background: #121212;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 0;
}
/* Modificar la transición del overlay de carga */
.js-loading-overlay {
    position: fixed;
    inset: 0;
    background: #121212;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    transition: opacity 0.3s ease-out, visibility 0.3s ease-out;
}
.js-loading-overlay.hidden {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
}
.loader {
    width: 48px;
    height: 48px;
    border: 5px solid #fff;
    border-bottom-color: #5e5e5e;
    border-radius: 50%;
    animation: rotation 1s linear infinite;
}
@keyframes rotation {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
.toolbar {
    width: 100%;
    height: var(--header-height);
    max-width: var(--game-width);
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 10;
    color: var(--color-ui);
    font-family: var(--font-toolbar-family);
    font-size: var(--font-size-ui);
}
.level-number {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: var(--font-size-ui);
}
.menu {
    all: unset;
    width: calc(var(--font-size-ui) * 1.3);
    height: calc(var(--font-size-ui) * 1.3);
    position: relative;
    cursor: pointer;
}
svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
}
.menu svg {
    width: 100%;
    height: 100%;
}
.menu svg path {
    transition: transform 0.2s ease;
    stroke: var(--color-ui);
}
.menu::before,
.menu::after,
.menu-middle,
.menu div {
    display: none;
}
.title-container {
    width: 100%;
    height: var(--title-height);
    margin: 0;
    padding: 0 var(--title-padding-inline);
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 0 0 auto;
    margin-top: auto;
    min-height: var(--title-height);
}
.title {
    width: 100%;
    margin: 0;
    font-size: min(24px, calc(var(--font-size-title) * var(--platform-scale)));
    transform-origin: center;
    line-height: 1.2;
    color: var(--color-title);
    font-family: var(--font-title-family);
    text-align: center;
    white-space: nowrap;
    overflow: visible;
    outline: 0;
    display: block;
    min-height: 1.2em;
}
.no-select {
    user-select: none;
}
.board {
    position: relative;
    width: var(--board-width);
    height: var(--board-width);
    min-height: var(--board-width);
    max-height: var(--board-width);
    max-width: var(--board-width);
    display: grid;
    grid-template-columns: repeat(4, var(--cell-size));
    grid-template-rows: repeat(4, var(--cell-size));
    gap: var(--cell-gap);
    padding: 0;
    flex: 0 0 auto;
    background: transparent;
    touch-action: none;
    user-select: none;
    box-sizing: border-box;
    margin: auto 0;
    place-content: center;
}
.board svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}
.board svg:not(:first-child) {
    display: none;
}
.cell {
    position: relative;
    background: var(--color-cell);
    border-radius: var(--cell-radius);
    display: flex;
    align-items: center;
    justify-content: center;
    border: var(--border-light);
    box-shadow: var(--shadow-sm), var(--shadow-md);
    transition: var(--transition-base);
    backface-visibility: hidden;
    transform-origin: center;
    width: var(--cell-size);
    height: var(--cell-size);
    aspect-ratio: 1;
    font-weight: var(--font-cell-weight);
}
.cell::before,
.cell::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
}
.cell::before {
    background: var(--effect-ambient);
    mix-blend-mode: var(--blend-before, overlay);
    z-index: 1;
}
.cell::after {
    background: var(--effect-overlay);
    mix-blend-mode: var(--blend-after, multiply);
    z-index: 2;
}
.hitbox {
    position: absolute;
    inset: 0;
    margin: auto;
    width: 70%;
    height: 70%;
    border-radius: 15px;
    background: transparent;
    border: none;
    cursor: pointer;
    z-index: 4;
}
.mark {
    position: absolute;
    width: var(--mark-size);
    height: var(--mark-size);
    top: calc(50% - var(--mark-size) / 2);
    border-radius: calc(var(--cell-radius) * 1.5);
    z-index: 2;
    pointer-events: none;
    transition: var(--transition-base);
    backface-visibility: hidden;
    will-change: transform, background-color;
}
.mark.selected {
    background: var(--color-selected);
}
.hitbox:hover+.mark:not(.selected) {
    background: var(--color-hover);
}
.text {
    font-size: calc(var(--cell-size) * 0.6);
    color: var(--color-letters);
    z-index: 3;
    pointer-events: none;
    transition: var(--transition-base);
    backface-visibility: hidden;
    will-change: transform, color;
}
.cell.found-temp {
    background: var(--found-bg);
    box-shadow: var(--found-shadow);
    animation: cell-found var(--animation-duration-found) var(--animation-timing) forwards;
    animation-duration: var(--animation-duration-found);
    animation-timing-function: var(--animation-timing);
    transition: all calc(var(--animation-duration-found) * 0.5) var(--animation-timing);
    will-change: transform;
    transform: translate(0) scale(var(--found-scale));
}
.cell.found-temp .text {
    color: white;
    transform: scale(1.1);
}
.cell.unused {
    transform: scale(var(--unused-scale));
    opacity: var(--unused-opacity);
}
.board svg line {
    stroke: var(--color-line);
    stroke-width: var(--line-width);
    stroke-linecap: var(--line-cap, round);
    stroke-dasharray: var(--line-dash, none);
    animation: var(--line-animation, none);
    z-index: inherit;
}
.modal-overlay {
    position: fixed;
    inset: 0;
    background: var(--modal-backdrop);
    backdrop-filter: var(--blur-overlay);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
    height: 100dvh;
    opacity: 0;
    visibility: hidden;
    transition:
        opacity 0.3s ease-out,
        visibility 0.3s ease-out;
}
.modal-overlay.active {
    opacity: 1;
    visibility: visible;
}
.modal-content {
    background: var(--color-modal);
    border-radius: var(--modal-border-radius);
    color: var(--color-menu);
    padding: min(24px, 4vw);
    width: var(--modal-width);
    min-height: var(--modal-min-height);
    max-height: var(--modal-max-height);
    border: var(--border-light);
    box-shadow: var(--shadow-lg);
    z-index: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    transform: scale(0.95);
    opacity: 0;
    transition:
        transform 0.3s var(--animation-timing),
        opacity 0.3s var(--animation-timing);
}
.modal-overlay.active .modal-content {
    transform: scale(1);
    opacity: 1;
    animation: modal-open 0.3s ease-out;
}
.modal-content h2 {
    font-size: var(--font-size-modal-h2);
    margin-bottom: 16px;
    text-align: center;
}
.menu-options {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: min(16px, 3vh);
    margin: auto 0;
    padding: min(16px, 3vh) 0;
}
.menu-options button {
    all: unset;
    background: var(--color-button);
    padding: 8px;
    border-radius: 8px;
    text-align: center;
    cursor: pointer;
    transition: background-color 0.2s ease;
    font-size: var(--font-size-ui);
}
.menu-options button:hover {
    background: var(--color-hover);
}
.modal-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
}
.back-button {
    all: unset;
    width: 24px;
    height: 24px;
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
}
.arrow-left {
    width: 8px;
    height: 8px;
    border-left: 2px solid var(--color-ui);
    border-bottom: 2px solid var(--color-ui);
    transform: rotate(45deg);
}
.theme-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 12px;
    padding: 12px;
    max-height: 60vh;
    overflow: hidden auto;
    /* Volver a la alineación original */
    align-items: start;
    justify-content: space-between;
}
.theme-option {
    border: none;
    cursor: pointer;
    background: transparent;
    transition: transform 0.2s ease;
    /* Asegurar altura fija */
    height: 110px;
    width: 100%;
    padding: 0;
    /* Mantener el display flex pero centrar contenido */
    display: flex;
    align-items: center;
    justify-content: center;
}
.theme-category {
    grid-column: 1 / -1;
    color: var(--color-text);
    font-size: 1.1em;
    font-weight: 600;
    opacity: 0.9;
    margin-top: 16px;
    margin-bottom: 8px;
    padding-bottom: 4px;
    border-bottom: 1px solid var(--color-ui);
}
.theme-category:first-child {
    margin-top: 0;
}
.preview-wrapper {
    --theme-title-single-line: 1.25rem;
    --theme-title-multi-line: 1rem;
    --theme-title-spacing: 8px;
    --theme-title-pixel-single: 1rem;
    --theme-title-pixel-multi: 0.875rem;
    container-type: inline-size;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: 1fr auto;
    gap: 8px;
    padding: 8px;
    background: var(--color-bg);
    border-radius: 8px;
    place-items: center;
    place-content: center;
    align-items: stretch;
}
.preview-cell {
    /* Tamaño fijo para todas las celdas */
    width: 48px;
    height: 48px;
    aspect-ratio: 1;
    background: var(--color-cell);
    border: var(--border-light);
    border-radius: var(--cell-radius);
    box-shadow: var(--shadow-sm);
    position: relative;
    /* Mejorar centrado */
    display: flex;
    align-items: center;
    justify-content: center;
    /* Eliminar margin:auto redundante */
    place-self: center;
}
.preview-mark {
    position: absolute;
    inset: 15%;
    border-radius: inherit;
    background: var(--color-selected);
    opacity: 0.8;
}
.preview-title {
    width: 100%;
    margin: 0;
    padding: 4px 8px;
    color: var(--color-title);
    font-family: var(--font-title-family);
    font-weight: 500;
    text-align: center;
    font-size: 0.9rem;
    line-height: 1.2;
    /* Nueva configuración fija para dos líneas */
    height: 2.4em;
    display: flex;
    align-items: center;
    justify-content: center;
    /* Ajuste de texto automático */
    word-break: normal;
    overflow: hidden;
    white-space: normal;
}
/* Nueva clase para términos que no deben dividirse */
.preview-title.no-break {
    white-space: nowrap !important;
    word-break: keep-all !important;
}
.preview-text {
    color: var(--color-letters);
    font-family: var(--font-title-family);
    z-index: 1;
}
.word-list {
    flex: 0 0 var(--words-height);
    margin-top: auto;
    display: flex;
    flex-wrap: wrap;
    place-content: flex-start center;
    gap: var(--word-list-gap);
    margin-bottom: auto;
}
.word {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: var(--word-height);
    min-height: var(--word-height);
    max-height: var(--word-height);
    border-radius: var(--cell-radius);
    background: var(--color-cell);
    border: var(--border-light);
    box-shadow: var(--shadow-sm);
    transition: all 0.3s ease;
    width: calc(var(--word-content-width) + (var(--word-padding-inline) * 2));
    font-size: var(--word-font-size);
}
.word:not(.found) {
    opacity: 1;
    color: var(--color-letters);
}
.word.found {
    background: var(--color-selected);
    transform: translate(0);
    font-family: inherit;
    color: var(--color-words);
}
.word span.fading-out {
    opacity: 0;
    position: absolute;
}
.word span.fading-in {
    opacity: 0;
}
.victory-time {
    text-align: center;
    font-size: var(--font-size-ui);
    margin-bottom: 20px;
    color: var(--color-text);
}
@media (prefers-reduced-motion: reduce) {
    :root {
        --animation-duration-found: 300ms;
        --animation-duration-particle: 200ms;
        --found-scale: 1.05;
        --unused-scale: 0.95;
    }
}
#confetti-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100dvh;
    pointer-events: none;
    z-index: 9999;
}
#victory-modal {
    position: fixed;
    z-index: 999;
}
#victory-modal #confetti-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
}
#victory-modal .modal-content {
    position: relative;
    z-index: 2;
}
@keyframes cell-found {
    0% {
        transform: scale(1);
        filter: brightness(1) blur(0);
    }
    50% {
        transform: scale(var(--found-scale));
        filter: brightness(var(--found-brightness, 1.5)) blur(var(--found-blur, 2px));
    }
    100% {
        transform: scale(1);
        filter: brightness(1) blur(0);
    }
}
[data-theme] .found-temp {
    animation-duration: var(--animation-duration-found) !important;
    animation-timing-function: var(--animation-timing) !important;
}
.game-container {
    width: var(--game-width);
    height: calc(100dvh - var(--header-height) - var(--safe-area-bottom));
    min-height: calc(var(--title-height) + var(--board-height) + var(--words-height) + (var(--game-min-gap) * 3));
    max-height: 100dvh;
    padding: var(--game-min-gap);
    padding-bottom: env(safe-area-inset-bottom);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--game-dynamic-gap);
    align-items: center;
    container-type: inline-size;
}
.animated-letter {
    will-change: transform, opacity;
}
.animated-letter.animating {
    animation: letter-motion-blur 300ms forwards;
    transition: all 300ms var(--animation-timing);
}
[data-theme] .animated-letter.animating {
    animation-duration: calc(var(--animation-duration-found) * 0.8);
    animation-timing-function: var(--animation-timing);
}
@keyframes letter-motion-blur {
    0% {
        filter: blur(0);
    }
    50% {
        filter: blur(2px);
    }
    100% {
        filter: blur(0);
    }
}
@keyframes modal-open {
    0% {
        opacity: 0;
        transform: scale(0.95);
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
}
.word-list::-webkit-scrollbar {
    width: 4px;
}
.word-list::-webkit-scrollbar-thumb {
    background-color: var(--color-selected);
    border-radius: 4px;
}
.word-list::-webkit-scrollbar-track {
    background-color: transparent;
}
.toggle-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s ease;
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    background: var(--color-button);
}
.toggle-button.active {
    background: var(--color-selected);
    opacity: 1;
}
.toggle-button:not(.active) {
    opacity: 0.7;
}
.toggle-button:active {
    transform: scale(0.95);
}
.toggle-button .icon {
    font-size: 1.2em;
    transition: transform 0.2s ease;
}
.toggle-button:hover {
    opacity: 0.9;
}
.toggle-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
.toggle-button:disabled:hover {
    opacity: 0.5;
    transform: none;
}

/* Theme: 8-Bit */
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
@import url('https://fonts.googleapis.com/css2?family=DotGothic16&display=swap');
:root[data-theme='8bitadventure'] {
    /* Fuentes */
    --font-toolbar-family: 'Press Start 2P', cursive;
    --font-title-family: 'Press Start 2P', cursive;
    --font-cell-family: 'DotGothic16', sans-serif;
    /* Colores */
    --color-bg: #581845;
    --color-cell: #900c3f;
    --color-modal: rgb(88 24 69 / 95%);
    --color-button: #ff5733;
    --color-letters: #fc0;
    --color-title: #fc0;
    --color-selected: #ff5733;
    --color-hover: #c70039;
    --color-line: #fc0;
    --color-ui: #fc0;
    --color-words: #fc0;
    --color-menu: #fc0;
    /* Efectos */
    --shadow-opacity: 0.6;
    --border-light: 2px solid #ff5733;
    /* Efectos especiales */
    --effect-color-1: rgb(255 87 51 / 20%);
    --effect-color-2: rgb(255 204 0 / 10%);
    --glow-radius: 12px;
    --glow-color: rgb(199 0 57 / 40%);
    /* Animaciones */
    --found-bg: linear-gradient(45deg, #ff5733, #fc0);
    --found-scale: 1.15;
    --found-shadow: 0 0 25px rgb(255 87 51 / 50%);
    --unused-scale: 0.9;
    --unused-opacity: 0.15;
    --confetti-colors: #fc0, #ff5733, #c70039, #900c3f;
}
:root[data-theme='8bitadventure'] .board {
    background: repeating-linear-gradient(
        45deg,
        #581845,
        #581845 10px,
        #4a1339 10px,
        #4a1339 20px
    );
    border: 4px solid #ff5733;
    image-rendering: pixelated;
}
:root[data-theme='8bitadventure'] .cell {
    background: #900c3f;
    border: 2px solid #ff5733;
    box-shadow:
        inset 2px 2px 0 rgb(255 255 255 / 20%),
        inset -2px -2px 0 rgb(0 0 0 / 20%);
    image-rendering: pixelated;
    align-items: baseline;
}
:root[data-theme='8bitadventure'] .title {
    text-shadow:
        2px 2px 0 #ff5733,
        4px 4px 0 #c70039;
    letter-spacing: 2px;
    image-rendering: pixelated;
}
:root[data-theme='8bitadventure'] .found-temp {
    animation: bit8-found 0.6s steps(6);
}
@keyframes bit8-found {
    0% {
        transform: scale(1);
        filter: brightness(1);
    }
    50% {
        transform: scale(var(--found-scale));
        filter: brightness(1.5);
        background: var(--found-bg);
    }
    100% {
        transform: scale(1);
        filter: brightness(1);
    }
}
:root[data-theme='8bitadventure'] .mark.selected {
    animation: bit8-selected 0.8s steps(4) infinite;
}
@keyframes bit8-selected {
    0% {
        background: #ff5733;
    }
    33% {
        background: #c70039;
    }
    66% {
        background: #900c3f;
    }
    100% {
        background: #ff5733;
    }
}

/* Theme: Arcade */
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Pixelify+Sans&display=swap');
:root[data-theme='arcade'] {
    /* Fuentes */
    --font-toolbar-family: 'VT323', monospace;
    --font-title-family: 'Press Start 2P', cursive;
    --font-cell-family: 'Pixelify Sans', sans-serif;
    /* Colores */
    --color-bg: #1a1a2e;
    --color-cell: #2a2a3e;
    --color-modal: rgb(26 26 46 / 95%);
    --color-button: #2a2a3e;
    --color-letters: #ffd700;
    --color-title: #ffd700;
    --color-selected: #8a2be2;
    --color-hover: rgb(138 43 226 / 80%);
    --color-line: #00bfff;
    --color-ui: #ff69b4;
    --color-words: #fff;
    --color-menu: #ffd700;
    /* Efectos */
    --shadow-opacity: 0.5;
    --border-light: 2px solid #ffd700;
    /* Efectos especiales */
    --effect-color-1: rgb(255 105 180 / 10%);
    --effect-color-2: rgb(0 191 255 / 10%);
    --glow-radius: 12px;
    --glow-color: rgb(255 215 0 / 30%);
    /* Animaciones */
    --found-bg: linear-gradient(45deg, #ff6347, #8a2be2);
    --found-scale: 1.15;
    --found-shadow: 0 0 20px rgb(255 105 180 / 50%);
    --unused-scale: 0.85;
    --unused-opacity: 0.3;
    --confetti-colors: #ffd700, #ff6347, #8a2be2, #ff69b4;
}
:root[data-theme='arcade'] .board {
    background: repeating-linear-gradient(
        45deg,
        #1a1a2e,
        #1a1a2e 10px,
        #2a2a3e 10px,
        #2a2a3e 20px
    );
}
:root[data-theme='arcade'] .cell {
    border: 2px solid #ffd700;
    image-rendering: pixelated;
    box-shadow:
        inset 0 0 0 2px rgb(255 215 0 / 20%),
        0 0 10px rgb(255 215 0 / 30%);
}
:root[data-theme='arcade'] .title {
    text-shadow:
        2px 2px 0 #ff6347,
        4px 4px 0 #8a2be2;
    letter-spacing: 1px;
    line-height: 1.5;
}
:root[data-theme='arcade'] .toolbar {
    filter: drop-shadow(2px 2px 0 #8a2be2);
}
@keyframes arcade-found {
    0% {
        transform: scale(1) rotate(0deg);
    }
    25% {
        transform: scale(1.15) rotate(-5deg);
    }
    75% {
        transform: scale(1.15) rotate(5deg);
    }
    100% {
        transform: scale(1) rotate(0deg);
    }
}
:root[data-theme='arcade'] .found-temp {
    animation-name: arcade-found !important;
}
:root[data-theme='arcade'] .mark.selected {
    border: 2px solid #ffd700;
    animation: arcade-blink 1s steps(2) infinite;
}
@keyframes arcade-blink {
    0%,
    100% {
        opacity: 1;
        border-color: #ffd700;
    }
    50% {
        opacity: 0.7;
        border-color: #ff69b4;
    }
}

/* Theme: Battle */
@import url('https://fonts.googleapis.com/css2?family=Staatliches&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Quantico:wght@700&display=swap');
:root[data-theme='battleready'] {
    /* Fuentes */
    --font-toolbar-family: 'Black Ops One', cursive;
    --font-title-family: 'Staatliches', cursive;
    --font-cell-family: 'Quantico', sans-serif;
    /* Colores */
    --color-bg: linear-gradient(135deg, #2f2f2f, #8b4513);
    --color-cell: #2a2a2a;
    --color-modal: rgb(42 42 42 / 95%);
    --color-button: linear-gradient(145deg, #dc143c, #228b22);
    --color-letters: #ffd700;
    --color-title: #ffd700;
    --color-selected: #dc143c;
    --color-hover: rgb(220 20 60 / 80%);
    --color-line: #1e90ff;
    --color-ui: #ffd700;
    --color-words: #fff;
    --color-menu: #ffd700;
    /* Efectos */
    --cell-radius: 4px;
    --shadow-opacity: 0.5;
    --border-light: 2px solid rgb(255 215 0 / 20%);
    /* Efectos especiales */
    --effect-color-1: rgb(139 69 19 / 20%);
    --effect-color-2: rgb(34 139 34 / 20%);
    --glow-radius: 15px;
    --glow-color: rgb(220 20 60 / 30%);
    /* Animaciones */
    --found-bg: linear-gradient(45deg, #dc143c, #ffd700);
    --found-scale: 1.15;
    --found-shadow: 0 0 25px rgb(30 144 255 / 50%);
    --unused-scale: 0.85;
    --unused-opacity: 0.25;
    --confetti-colors: #dc143c, #ffd700, #228b22, #1e90ff;
}
:root[data-theme='battleready'] .cell {
    border: 2px solid rgb(255 215 0 / 20%);
    box-shadow:
        inset 0 0 10px rgb(220 20 60 / 20%),
        0 0 15px rgb(30 144 255 / 20%);
    background: linear-gradient(
        135deg,
        rgb(42 42 42 / 95%),
        rgb(42 42 42 / 85%)
    );
}
:root[data-theme='battleready'] .title {
    text-shadow:
        2px 2px 0 #dc143c,
        -2px -2px 0 #228b22;
    letter-spacing: 2px;
    text-transform: uppercase;
}
@keyframes battle-found {
    0% {
        transform: scale(1);
    }
    25% {
        transform: scale(1.15) rotate(-2deg);
    }
    75% {
        transform: scale(1.15) rotate(2deg);
    }
    100% {
        transform: scale(1);
    }
}
:root[data-theme='battleready'] .found-temp {
    animation: battle-found 0.5s cubic-bezier(0.2, 0, 0.2, 1);
}
:root[data-theme='battleready'] .mark.selected {
    background: #dc143c;
    animation: battle-pulse 1.5s infinite;
}
@keyframes battle-pulse {
    0%,
    100% {
        box-shadow:
            0 0 15px #dc143c,
            0 0 30px #ffd700;
    }
    50% {
        box-shadow:
            0 0 20px #228b22,
            0 0 40px #1e90ff;
    }
}

/* Theme: Classic */
@import url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;700&display=swap');
:root[data-theme='classicconsole'] {
    /* Fuentes */
    --font-toolbar-family: 'IBM Plex Mono', monospace;
    --font-title-family: 'IBM Plex Mono', monospace;
    --font-cell-family: 'Inconsolata', monospace;
    /* Colores */
    --color-bg: #2c3e50;
    --color-cell: rgb(74 144 226 / 15%);
    --color-modal: rgb(44 62 80 / 95%);
    --color-button: #4a90e2;
    --color-letters: #50e3c2;
    --color-title: #50e3c2;
    --color-selected: #f5a623;
    --color-hover: #7fc43b;
    --color-line: #d0021b;
    --color-ui: #7fc43b;
    --color-words: #fff;
    --color-menu: #fff;
    /* Efectos */
    --shadow-opacity: 0.5;
    --border-light: 1px solid rgb(74 144 226 / 30%);
    /* Efectos especiales */
    --effect-color-1: rgb(74 144 226 / 10%);
    --effect-color-2: rgb(80 227 194 / 10%);
    --glow-radius: 15px;
    --glow-color: rgb(245 166 35 / 30%);
    /* Animaciones */
    --found-bg: linear-gradient(45deg, #4a90e2, #50e3c2);
    --found-scale: 1.1;
    --found-shadow: 0 0 30px rgb(208 2 27 / 50%);
    --unused-scale: 0.9;
    --unused-opacity: 0.2;
    --confetti-colors: #4a90e2, #50e3c2, #f5a623, #b8e986;
}
:root[data-theme='classicconsole'] .board {
    border: 2px solid #4a90e2;
}
:root[data-theme='classicconsole'] .cell {
    border: var(--border-light);
    background: linear-gradient(135deg,
            rgb(52 73 94 / 100%) 0%,
            rgb(52 73 94 / 90%) 100%);
    box-shadow:
        inset 0 0 0 1px rgb(74 144 226 / 10%),
        0 0 10px rgb(80 227 194 / 20%);
}
:root[data-theme='classicconsole'] .title {
    text-shadow: 2px 2px 4px rgb(74 144 226 / 40%);
    letter-spacing: 0.1em;
}
@keyframes console-found {
    0% {
        transform: scale(1);
        filter: brightness(1);
    }
    50% {
        transform: scale(var(--found-scale));
        filter: brightness(1.3) hue-rotate(45deg);
        box-shadow:
            0 0 20px rgb(245 166 35 / 60%),
            0 0 40px rgb(184 233 134 / 40%);
    }
    100% {
        transform: scale(1);
        filter: brightness(1);
    }
}
:root[data-theme='classicconsole'] .found-temp {
    animation: console-found 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}
:root[data-theme='classicconsole'] .mark.selected {
    animation: console-selected 2s infinite;
}
@keyframes console-selected {
    0% {
        background: #4a90e2;
    }
    33% {
        background: #50e3c2;
    }
    66% {
        background: #f5a623;
    }
    100% {
        background: #4a90e2;
    }
}

/* Theme: Cyberpunk */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;700&display=swap');
:root[data-theme='cyberpunk'] {
    /* Fuentes */
    --font-toolbar-family: 'Share Tech Mono', monospace;
    --font-title-family: 'Orbitron', sans-serif;
    --font-cell-family: 'Rajdhani', sans-serif;
    /* Colores */
    --color-bg: #1e1e1e;
    --color-cell: #2a2a2a;
    --color-modal: linear-gradient(
        180deg,
        rgb(30 30 30 / 95%),
        rgb(255 69 0 / 10%)
    );
    --color-button: linear-gradient(145deg, #2a2a2a, #ff4500);
    --color-letters: #0f0;
    --color-title: #0f0;
    --color-selected: #f0f;
    --color-hover: rgb(255 0 255 / 80%);
    --color-line: #0ff;
    --color-ui: #f0f;
    --color-words: #0f0;
    --color-menu: #0ff;
    /* Efectos */
    --cell-radius: 2px;
    --shadow-opacity: 0.6;
    --border-light: 1px solid #0f0;
    /* Efectos especiales */
    --effect-color-1: rgb(0 255 0 / 15%);
    --effect-color-2: rgb(255 69 0 / 15%);
    --glow-radius: 20px;
    --glow-color: rgb(0 255 0 / 30%);
    /* Animaciones */
    --found-bg: linear-gradient(45deg, #f0f, #0ff);
    --found-scale: 1.1;
    --found-shadow: 0 0 30px rgb(0 255 255 / 60%);
    --unused-scale: 0.9;
    --unused-opacity: 0.2;
    --confetti-colors: #0f0, #f0f, #0ff, #ff4500;
}
:root[data-theme='cyberpunk'] .board {
    background: linear-gradient(rgb(30 30 30 / 80%), rgb(42 42 42 / 80%));
}
:root[data-theme='cyberpunk'] .cell {
    border: 1px solid rgb(0 255 0 / 20%);
    background: linear-gradient(135deg, #1e1e1e, #2a2a2a);
    box-shadow:
        inset 0 0 15px rgb(0 255 0 / 10%),
        0 0 10px rgb(0 255 255 / 20%),
        0 0 20px rgb(255 69 0 / 10%);
}
:root[data-theme='cyberpunk'] .title {
    text-shadow:
        0 0 10px rgb(0 255 0 / 70%),
        0 0 20px rgb(0 255 0 / 50%);
    letter-spacing: 2px;
}
:root[data-theme='cyberpunk'] .timer {
    font-family: 'Share Tech Mono', monospace;
    color: #ff4500;
    text-shadow: 0 0 10px rgb(255 69 0 / 50%);
}
:root[data-theme='cyberpunk'] .level-number {
    font-family: 'Share Tech Mono', monospace;
    color: #0ff;
    text-shadow: 0 0 10px rgb(0 255 255 / 50%);
}
@keyframes cyberpunk-found {
    0% {
        transform: scale(1) skew(0deg);
        filter: hue-rotate(0deg);
    }
    50% {
        transform: scale(1.1) skew(-5deg);
        filter: hue-rotate(90deg);
        box-shadow:
            0 0 30px #f0f,
            0 0 60px #0ff;
    }
    100% {
        transform: scale(1) skew(0deg);
        filter: hue-rotate(0deg);
    }
}
:root[data-theme='cyberpunk'] .found-temp {
    animation-name: cyberpunk-found !important;
}
:root[data-theme='cyberpunk'] .mark.selected {
    box-shadow:
        0 0 20px #f0f,
        0 0 40px #0ff;
    animation: cyberpunk-glow 2s infinite;
}
@keyframes cyberpunk-glow {
    0%,
    100% {
        opacity: 0.8;
        transform: scale(1);
        box-shadow:
            0 0 20px #f0f,
            0 0 40px #0ff;
    }
    50% {
        opacity: 1;
        transform: scale(1.1);
        box-shadow:
            0 0 30px #0f0,
            0 0 50px #ff4500;
    }
}

/* Theme: Dark */
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@500;700&display=swap');
:root[data-theme='dark'] {
    --cell-radius: min(8px, 1.5vw);
    /* Fuentes */
    --font-toolbar-family: 'JetBrains Mono', monospace;
    --font-title-family: 'Rubik', sans-serif;
    --font-cell-family: 'Rubik', sans-serif;
    --font-cell-weight: 700;
    /* Colores */
    --color-bg: linear-gradient(135deg, #121212 0%, #1a1a1a 100%);
    --color-cell: linear-gradient(145deg, #1e1e1e, #2d2d2d);
    --color-modal: rgb(23 23 23 / 95%);
    --color-button: linear-gradient(145deg, #2d2d2d, #232323);
    --color-letters: #fff;
    --color-title: #3498db;
    --color-words: #fff;
    --color-menu: #fff;
    --color-ui: #3498db;
    --color-selected: #3498db;
    --color-hover: rgb(52 152 219 / 80%);
    --color-line: #2ecc71;
    /* Efectos */
    --effect-color-1: rgb(52 152 219 / 5%);
    --effect-color-2: rgb(46 204 113 / 5%);
    --blend-before: overlay;
    --glow-radius: 25px;
    --glow-color: rgb(52 152 219 / 20%);
    /* Animaciones */
    --found-bg: linear-gradient(45deg, #3498db, #2ecc71);
    --found-scale: 1.1;
    --found-shadow: 0 0 30px rgb(52 152 219 / 60%);
    --unused-scale: 0.8;
    --unused-opacity: 0.3;
    --confetti-colors: #ffd700, #ff3939, #4169e1, #ff69b4;
}
/* Efectos especiales para Dark */
:root[data-theme='dark'] .board {
    background: linear-gradient(rgb(18 18 18 / 70%), rgb(26 26 26 / 70%));
}
:root[data-theme='dark'] .cell {
    border: 1px solid rgb(255 255 255 / 5%);
    box-shadow:
        inset 0 2px 4px rgb(255 255 255 / 5%),
        0 4px 8px rgb(0 0 0 / 20%);
}
:root[data-theme='dark'] .title {
    color: transparent;
    background: linear-gradient(to right, #3498db, #2ecc71);
    background-clip: text;
}
:root[data-theme='dark'] .toolbar {
    filter: drop-shadow(3px 3px 2px rgb(52 152 219 / 40%));
}
@keyframes dark-found {
    0% {
        transform: scale(1);
        filter: brightness(1);
    }
    50% {
        transform: scale(1.1);
        filter: brightness(1.5);
        box-shadow: 0 0 30px rgb(45 125 210 / 60%);
    }
    100% {
        transform: scale(1);
        filter: brightness(1);
    }
}
:root[data-theme='dark'] .found-temp {
    animation-name: dark-found !important;
}

/* Theme: Dawn */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600&display=swap');
:root[data-theme='digitaldawn'] {
    /* Fuentes */
    --font-toolbar-family: 'Orbitron', sans-serif;
    --font-title-family: 'Rajdhani', sans-serif;
    --font-cell-family: 'Space Grotesk', sans-serif;
    /* Colores */
    --color-bg: #0a0a1a;
    --color-cell: #1a1a2a;
    --color-modal: rgb(10 10 26 / 95%);
    --color-button: #8a2be2;
    --color-letters: #fff;
    --color-title: #fff;
    --color-selected: #ff6347;
    --color-hover: #ff6347;
    --color-line: #00bfff;
    --color-ui: #00bfff;
    --color-words: #fff;
    --color-menu: #fff;
    /* Efectos */
    --cell-radius: 8px;
    --shadow-opacity: 0.6;
    --border-light: 1px solid rgb(0 191 255 / 30%);
    /* Efectos especiales */
    --effect-color-1: rgb(255 99 71 / 10%);
    --effect-color-2: rgb(0 191 255 / 10%);
    --glow-radius: 25px;
    --glow-color: rgb(138 43 226 / 40%);
    /* Animaciones */
    --found-bg: linear-gradient(135deg, #ff6347, #8a2be2);
    --found-scale: 1.1;
    --found-shadow: 0 0 40px rgb(0 191 255 / 50%);
    --unused-scale: 0.9;
    --unused-opacity: 0.15;
    --confetti-colors: #ff6347, #ffd700, #00bfff, #8a2be2;
}
:root[data-theme='digitaldawn'] .board {
    background: linear-gradient(
        135deg,
        rgb(10 10 26 / 95%) 0%,
        rgb(138 43 226 / 10%) 100%
    );
}
:root[data-theme='digitaldawn'] .cell {
    background: linear-gradient(
        145deg,
        rgb(26 26 42 / 100%) 0%,
        rgb(26 26 42 / 80%) 100%
    );
    box-shadow: 0 0 20px rgb(0 191 255 / 10%);
}
:root[data-theme='digitaldawn'] .title {
    text-shadow:
        0 0 10px rgb(0 191 255 / 50%),
        0 0 20px rgb(138 43 226 / 30%);
}
:root[data-theme='digitaldawn'] .toolbar {
    filter: drop-shadow(0 0 10px rgb(0 191 255 / 40%));
}
@keyframes dawn-found {
    0% {
        transform: scale(1);
        filter: brightness(1);
    }
    50% {
        transform: scale(var(--found-scale));
        filter: brightness(1.5);
        box-shadow:
            0 0 30px rgb(255 99 71 / 60%),
            0 0 50px rgb(0 191 255 / 40%);
    }
    100% {
        transform: scale(1);
        filter: brightness(1);
    }
}
:root[data-theme='digitaldawn'] .found-temp {
    animation: dawn-found 0.7s ease-in-out;
}
:root[data-theme='digitaldawn'] .mark.selected {
    animation: dawn-selected 2s infinite;
}
@keyframes dawn-selected {
    0% {
        background: #ff6347;
    }
    33% {
        background: #ffd700;
    }
    66% {
        background: #00bfff;
    }
    100% {
        background: #ff6347;
    }
}

/* Theme: Dreams */
@import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Syne+Mono&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Righteous&display=swap');
:root[data-theme='dreams'] {
    /* Fuentes */
    --font-toolbar-family: 'Syne Mono', monospace;
    --font-title-family: 'Chakra Petch', sans-serif;
    --font-cell-family: 'Righteous', cursive;
    /* Colores */
    --color-bg: #2f4f4f;
    --color-cell: #3a5f5f;
    --color-modal: rgb(47 79 79 / 95%);
    --color-button: #3a5f5f;
    --color-letters: #00ff7f;
    --color-title: #00ff7f;
    --color-selected: #ff1493;
    --color-hover: rgb(255 20 147 / 80%);
    --color-line: #1e90ff;
    --color-ui: #ff1493;
    --color-words: #fff;
    --color-menu: #00ff7f;
    /* Efectos */
    --cell-radius: 4px;
    --shadow-opacity: 0.5;
    --border-light: 1px solid rgb(0 255 127 / 20%);
    /* Efectos especiales */
    --effect-color-1: rgb(255 140 0 / 10%);
    --effect-color-2: rgb(30 144 255 / 10%);
    --glow-radius: 20px;
    --glow-color: rgb(0 255 127 / 30%);
    /* Animaciones */
    --found-bg: linear-gradient(45deg, #ff1493, #1e90ff);
    --found-scale: 1.12;
    --found-shadow: 0 0 25px rgb(255 20 147 / 50%);
    --unused-scale: 0.88;
    --unused-opacity: 0.25;
    --confetti-colors: #ff1493, #00ff7f, #1e90ff, #ff8c00;
}
:root[data-theme='dreams'] .board {
    background: linear-gradient(rgb(47 79 79 / 80%), rgb(58 95 95 / 80%));
}
:root[data-theme='dreams'] .cell {
    border: 1px solid rgb(0 255 127 / 20%);
    box-shadow:
        inset 0 0 18px rgb(0 255 127 / 10%),
        0 0 12px rgb(30 144 255 / 20%);
}
:root[data-theme='dreams'] .title {
    text-shadow:
        0 0 12px rgb(0 255 127 / 60%),
        0 0 24px rgb(30 144 255 / 40%);
    letter-spacing: 1px;
}
:root[data-theme='dreams'] .toolbar {
    filter: drop-shadow(0 0 12px rgb(30 144 255 / 50%));
}
@keyframes dreams-found {
    0% {
        transform: scale(1) rotate(0deg);
        filter: saturate(1);
    }
    50% {
        transform: scale(1.12) rotate(5deg);
        filter: saturate(1.5);
        box-shadow:
            0 0 30px #ff1493,
            0 0 50px #1e90ff;
    }
    100% {
        transform: scale(1) rotate(0deg);
        filter: saturate(1);
    }
}
:root[data-theme='dreams'] .found-temp {
    animation-name: dreams-found !important;
}
:root[data-theme='dreams'] .mark.selected {
    box-shadow:
        0 0 15px #ff1493,
        0 0 30px #1e90ff;
    animation: dreams-pulse 2s ease infinite;
}
@keyframes dreams-pulse {
    0%,
    100% {
        opacity: 0.8;
        transform: scale(1);
    }
    50% {
        opacity: 1;
        transform: scale(1.08);
    }
}

/* Theme: Elemental */
@import url('https://fonts.googleapis.com/css2?family=Righteous&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@500&display=swap');
:root[data-theme='elementalfury'] {
    /* Fuentes */
    --font-toolbar-family: 'Righteous', cursive;
    --font-title-family: 'Permanent Marker', cursive;
    --font-cell-family: 'Rubik', sans-serif;
    /* Colores */
    --color-bg: linear-gradient(135deg, #1e90ff, #ff4500);
    --color-cell: #2f4f4f;
    --color-modal: rgb(47 79 79 / 95%);
    --color-button: linear-gradient(145deg, #32cd32, #ff4500);
    --color-letters: #ffd700;
    --color-title: #ffd700;
    --color-selected: #8b008b;
    --color-hover: rgb(139 0 139 / 80%);
    --color-line: #32cd32;
    --color-ui: #32cd32;
    --color-words: #ffd700;
    --color-menu: #ffd700;
    /* Efectos */
    --cell-radius: 8px;
    --shadow-opacity: 0.6;
    --border-light: 2px solid rgb(255 215 0 / 30%);
    /* Efectos especiales */
    --effect-color-1: rgb(30 144 255 / 20%);
    --effect-color-2: rgb(255 69 0 / 20%);
    --glow-radius: 25px;
    --glow-color: rgb(50 205 50 / 30%);
    /* Animaciones */
    --found-bg: linear-gradient(45deg, #ff4500, #1e90ff);
    --found-scale: 1.15;
    --found-shadow: 0 0 30px rgb(139 0 139 / 60%);
    --unused-scale: 0.85;
    --unused-opacity: 0.2;
    --confetti-colors: #ff4500, #1e90ff, #32cd32, #ffd700;
}
:root[data-theme='elementalfury'] .cell {
    border: 2px solid rgb(255 215 0 / 30%);
    box-shadow:
        inset 0 0 20px rgb(50 205 50 / 20%),
        0 0 15px rgb(139 0 139 / 30%);
}
:root[data-theme='elementalfury'] .title {
    background: linear-gradient(to right, #ff4500 25%, #32cd32 75%);
    background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 0 10px rgb(30 144 255));
}
:root[data-theme='elementalfury'] .toolbar {
    filter: drop-shadow(2px 2px 4px rgb(139 0 139 / 40%));
}
@keyframes fury-found {
    0% {
        transform: scale(1) rotate(0deg);
    }
    50% {
        transform: scale(1.15) rotate(5deg);
        box-shadow:
            0 0 30px #ff4500,
            0 0 60px #1e90ff;
    }
    100% {
        transform: scale(1) rotate(0deg);
    }
}
:root[data-theme='elementalfury'] .found-temp {
    animation-name: fury-found !important;
}
:root[data-theme='elementalfury'] .mark.selected {
    background: #8b008b;
    animation: elemental-pulse 2s infinite;
}
@keyframes elemental-pulse {
    0%,
    100% {
        box-shadow:
            0 0 20px #ff4500,
            0 0 40px #1e90ff;
    }
    50% {
        box-shadow:
            0 0 30px #32cd32,
            0 0 50px #ffd700;
    }
}

/* Theme: Fantasy */
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Alegreya:wght@500;700&display=swap');
:root[data-theme='fantasy'] {
    /* Fuentes */
    --font-toolbar-family: 'MedievalSharp', cursive;
    --font-title-family: 'Cinzel', serif;
    --font-cell-family: 'Alegreya', serif;
    /* Colores */
    --color-bg: #8b4513;
    --color-cell: #a0522d;
    --color-modal: rgb(139 69 19 / 95%);
    --color-button: #a0522d;
    --color-letters: #f0e68c;
    --color-title: #f0e68c;
    --color-selected: #ff4500;
    --color-hover: rgb(255 69 0 / 80%);
    --color-line: #6a5acd;
    --color-ui: #f0e68c;
    --color-words: #f0e68c;
    --color-menu: #ffd700;
    /* Efectos */
    --cell-radius: 8px;
    --shadow-opacity: 0.4;
    --border-light: 2px solid rgb(240 230 140 / 30%);
    /* Efectos especiales */
    --effect-color-1: rgb(255 69 0 / 10%);
    --effect-color-2: rgb(106 90 205 / 10%);
    --glow-radius: 18px;
    --glow-color: rgb(240 230 140 / 25%);
    /* Animaciones */
    --found-bg: linear-gradient(45deg, #ffd700, #ff4500);
    --found-scale: 1.1;
    --found-shadow: 0 0 20px rgb(255 215 0 / 40%);
    --unused-scale: 0.9;
    --unused-opacity: 0.3;
    --confetti-colors: #ffd700, #ff4500, #6a5acd, #f0e68c;
}
:root[data-theme='fantasy'] .board {
    background: linear-gradient(rgb(139 69 19 / 80%), rgb(160 82 45 / 80%));
}
:root[data-theme='fantasy'] .cell {
    border: 2px solid rgb(240 230 140 / 30%);
    box-shadow:
        inset 0 0 15px rgb(240 230 140 / 10%),
        0 0 10px rgb(106 90 205 / 20%);
}
:root[data-theme='fantasy'] .title {
    text-shadow:
        2px 2px 4px rgb(139 69 19 / 80%),
        0 0 15px rgb(240 230 140 / 50%);
    letter-spacing: 1px;
}
:root[data-theme='fantasy'] .toolbar {
    filter: drop-shadow(2px 2px 4px rgb(139 69 19 / 60%));
}
@keyframes fantasy-found {
    0% {
        transform: scale(1);
        filter: brightness(1);
    }
    50% {
        transform: scale(1.1) rotate(3deg);
        filter: brightness(1.3);
        box-shadow:
            0 0 25px #ffd700,
            0 0 40px #ff4500;
    }
    100% {
        transform: scale(1);
        filter: brightness(1);
    }
}
:root[data-theme='fantasy'] .found-temp {
    animation-name: fantasy-found !important;
}
:root[data-theme='fantasy'] .mark.selected {
    border: 2px solid #ffd700;
    box-shadow: 0 0 20px rgb(255 215 0 / 50%);
    animation: fantasy-glow 1.5s ease-in-out infinite;
}
@keyframes fantasy-glow {
    0%,
    100% {
        box-shadow: 0 0 15px #ffd700;
    }
    50% {
        box-shadow: 0 0 25px #ff4500;
    }
}

/* Theme: Forest */
@import url('https://fonts.googleapis.com/css2?family=Philosopher:wght@700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Cormorant:wght@700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@500&display=swap');
:root[data-theme='forest'] {
    /* Fuentes */
    --font-toolbar-family: 'Philosopher', serif;
    --font-title-family: 'Cormorant', serif;
    --font-cell-family: 'Crimson Pro', serif;
    /* Colores */
    --color-bg: linear-gradient(135deg, #2f4f4f 0%, #228b22 200%);
    --color-cell: linear-gradient(145deg, #2f4f4f, #3a5f5f);
    --color-modal: rgb(47 79 79 / 95%);
    --color-button: linear-gradient(145deg, #2f4f4f, #228b22);
    --color-letters: #d3d3d3;
    --color-title: #d3d3d3;
    --color-selected: #8b0000;
    --color-hover: rgb(139 0 0 / 80%);
    --color-line: #a0522d;
    --color-ui: #a0522d;
    --color-words: #d3d3d3;
    --color-menu: #d3d3d3;
    /* Efectos */
    --cell-radius: 6px;
    --shadow-opacity: 0.45;
    --border-light: 1px solid rgb(211 211 211 / 20%);
    /* Efectos especiales */
    --effect-color-1: rgb(34 139 34 / 15%);
    --effect-color-2: rgb(139 0 0 / 15%);
    --glow-radius: 20px;
    --glow-color: rgb(211 211 211 / 20%);
    /* Animaciones */
    --found-bg: linear-gradient(45deg, #228b22, #a0522d);
    --found-scale: 1.08;
    --found-shadow: 0 0 22px rgb(34 139 34 / 45%);
    --unused-scale: 0.92;
    --unused-opacity: 0.28;
    --confetti-colors: #228b22, #8b0000, #a0522d, #d3d3d3;
}
:root[data-theme='forest'] .board {
    background: linear-gradient(rgb(47 79 79 / 85%), rgb(58 95 95 / 85%));
}
:root[data-theme='forest'] .cell {
    background: linear-gradient(135deg, #2f4f4f, #228b22);
    border: 1px solid rgb(211 211 211 / 20%);
    box-shadow:
        inset 0 0 20px rgb(34 139 34 / 20%),
        0 0 15px rgb(139 0 0 / 15%);
}
:root[data-theme='forest'] .title {
    text-shadow:
        2px 2px 0 #228b22,
        4px 4px 0 #8b0000;
}
:root[data-theme='forest'] .toolbar {
    filter: drop-shadow(1px 1px 3px rgb(34 139 34 / 50%));
}
@keyframes forest-found {
    0% {
        transform: scale(1);
        filter: brightness(1);
    }
    50% {
        transform: scale(1.08);
        filter: brightness(1.3);
        box-shadow:
            0 0 25px rgb(34 139 34 / 60%),
            0 0 40px rgb(139 0 0 / 40%);
    }
    100% {
        transform: scale(1);
        filter: brightness(1);
    }
}
:root[data-theme='forest'] .found-temp {
    animation-name: forest-found !important;
}
:root[data-theme='forest'] .mark.selected {
    background: rgb(34 139 34 / 80%);
    box-shadow: 0 0 18px rgb(34 139 34 / 40%);
    animation: forest-pulse 2s ease-in-out infinite;
}
@keyframes forest-pulse {
    0%,
    100% {
        opacity: 0.8;
        box-shadow: 0 0 18px rgb(34 139 34 / 40%);
    }
    50% {
        opacity: 1;
        box-shadow: 0 0 25px rgb(139 0 0 / 50%);
    }
}

/* Theme: Game Over */
@import url('https://fonts.googleapis.com/css2?family=Audiowide&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700&display=swap');
:root[data-theme='gameoverglow'] {
    --font-toolbar-family: 'Audiowide', cursive;
    --font-title-family: 'Audiowide', cursive;
    --font-cell-family: 'Syncopate', sans-serif;
    --color-bg: #210958;
    --color-cell: rgb(0 206 209 / 15%);
    --color-modal: rgb(0 0 0 / 95%);
    --color-button: #ff1493;
    --color-letters: #adff2f;
    --color-title: #00ced1;
    --color-selected: #ff4500;
    --color-hover: #00ced1;
    --color-line: #ff1493;
    --color-ui: #adff2f;
    --color-words: #f0e68c;
    --color-menu: #ffd700;
    /* Efectos */
    --cell-radius: 4px;
    --shadow-opacity: 0.8;
    --border-light: 1px solid rgb(0 206 209 / 30%);
    /* Efectos especiales */
    --effect-color-1: rgb(255 20 147 / 10%);
    --effect-color-2: rgb(173 255 47 / 10%);
    --glow-radius: 25px;
    --glow-color: rgb(0 206 209 / 30%);
    /* Animaciones */
    --found-bg: linear-gradient(45deg, #ff1493, #ff4500);
    --found-scale: 1.15;
    --found-shadow: 0 0 20px rgb(255 20 147 / 60%),
        0 0 40px rgb(0 206 209 / 40%);
    --unused-scale: 0.85;
    --unused-opacity: 0.15;
    --confetti-colors: #ff1493, #ff4500, #adff2f, #00ced1;
}
:root[data-theme='gameoverglow'] .cell {
    border: var(--border-light);
    box-shadow:
        inset 0 0 20px rgb(255 20 147 / 10%),
        0 0 15px rgb(0 206 209 / 20%);
    background: linear-gradient(
        135deg,
        rgb(45 45 45 / 100%) 0%,
        rgb(45 45 45 / 80%) 100%
    );
}
:root[data-theme='gameoverglow'] .title {
    text-shadow:
        0 0 10px rgb(0 206 209 / 80%),
        0 0 20px rgb(255 20 147 / 40%);
    letter-spacing: 2px;
}
@keyframes glow-found {
    0% {
        transform: scale(1);
        filter: brightness(1);
    }
    50% {
        transform: scale(var(--found-scale));
        filter: brightness(1.5);
        box-shadow:
            0 0 40px rgb(255 20 147 / 80%),
            0 0 80px rgb(173 255 47 / 60%);
    }
    100% {
        transform: scale(1);
        filter: brightness(1);
    }
}
:root[data-theme='gameoverglow'] .found-temp {
    animation: glow-found 0.8s ease-in-out;
}
:root[data-theme='gameoverglow'] .mark.selected {
    animation: glow-pulse 1.5s infinite;
    box-shadow: 0 0 20px rgb(0 206 209 / 60%);
}
@keyframes glow-pulse {
    0%,
    100% {
        background: #ff4500;
        box-shadow: 0 0 30px rgb(255 69 0 / 60%);
    }
    50% {
        background: #ff1493;
        box-shadow: 0 0 40px rgb(255 20 147 / 80%);
    }
}

/* Theme: Glitch */
@import url('https://fonts.googleapis.com/css2?family=Teko:wght@600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Rubik+Glitch&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
:root[data-theme='glitcheffect'] {
    /* Fuentes */
    --font-toolbar-family: 'Share Tech Mono', monospace;
    --font-title-family: 'Rubik Glitch', cursive;
    --font-cell-family: 'Teko', sans-serif;
    /* Colores */
    --color-bg: #1e1e1e;
    --color-cell: #2a2a2a;
    --color-modal: rgb(30 30 30 / 95%);
    --color-button: linear-gradient(145deg, #f0f, #0ff);
    --color-letters: #0ff;
    --color-title: #0ff;
    --color-selected: #f0f;
    --color-hover: rgb(255 53 0 / 80%);
    --color-line: #ff3700;
    --color-ui: #f0f;
    --color-words: #fff;
    --color-menu: #0ff;
    /* Efectos */
    --cell-radius: 2px;
    --shadow-opacity: 0.7;
    --border-light: 1px solid rgb(0 255 255 / 20%);
    /* Efectos especiales */
    --effect-color-1: rgb(255 0 255 / 10%);
    --effect-color-2: rgb(0 255 255 / 10%);
    --glow-radius: 15px;
    --glow-color: rgb(255 53 0 / 30%);
    /* Animaciones */
    --found-bg: linear-gradient(45deg, #f0f, #0ff);
    --found-scale: 1.1;
    --found-shadow: 0 0 30px rgb(255 55 0 / 60%);
    --unused-scale: 0.9;
    --unused-opacity: 0.2;
    --confetti-colors: #f0f, #0ff, #ff3500, #ff3700;
}
:root[data-theme='glitcheffect'] body::before {
    content: '';
    position: fixed;
    inset: 0;
    background: repeating-linear-gradient(
        transparent 0%,
        rgb(0 255 255 / 10%) 0.5%,
        transparent 1%
    );
    animation: scan-lines 8s linear infinite;
    pointer-events: none;
}
:root[data-theme='glitcheffect'] .board {
    background: transparent;
    overflow: hidden;
}
:root[data-theme='glitcheffect'] .cell {
    border: 1px solid rgb(0 255 255 / 20%);
    position: relative;
    overflow: hidden;
}
:root[data-theme='glitcheffect'] .title {
    text-shadow:
        2px 0 #f0f,
        -2px 0 #ff3500;
    animation: glitch-title 3s infinite;
}
:root[data-theme='glitcheffect'] .text::after {
    color: var(--color-title);
    animation: glitch-text 2s infinite reverse;
    clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
}
@keyframes scan-lines {
    0% {
        transform: translateY(-100%);
    }
    100% {
        transform: translateY(100%);
    }
}
@keyframes glitch-bg {
    0%,
    100% {
        transform: translateX(-100%);
    }
    50% {
        transform: translateX(100%);
    }
}
@keyframes glitch-title {
    0%,
    100% {
        transform: none;
        filter: none;
    }
    92% {
        transform: skew(2deg);
    }
    94% {
        transform: skew(-2deg);
    }
    96% {
        transform: none;
        filter: hue-rotate(90deg);
    }
    98% {
        transform: none;
        filter: hue-rotate(-90deg);
    }
}
@keyframes glitch-text {
    0%,
    100% {
        transform: none;
        opacity: 0.8;
    }
    92% {
        transform: translate(2px, -2px);
        opacity: 0.8;
    }
    94% {
        transform: translate(-2px, 2px);
        opacity: 0.8;
    }
    96% {
        transform: none;
        opacity: 0;
    }
    98% {
        transform: none;
        opacity: 0.8;
    }
}
:root[data-theme='glitcheffect'] .found-temp {
    animation: glitch-found 0.6s steps(2, end);
}
@keyframes glitch-found {
    0% {
        transform: scale(1);
        filter: none;
    }
    25% {
        transform: scale(1.1) skew(10deg);
        filter: hue-rotate(90deg);
    }
    50% {
        transform: scale(1.1) skew(-10deg);
        filter: hue-rotate(-90deg);
    }
    75% {
        transform: scale(0.9);
        filter: invert(1);
    }
    100% {
        transform: scale(1);
        filter: none;
    }
}
:root[data-theme='glitcheffect'] .mark.selected {
    animation: glitch-selected 1s steps(2, end) infinite;
}
@keyframes glitch-selected {
    0%,
    100% {
        background: #f0f;
        transform: none;
    }
    25% {
        background: #0ff;
        transform: translate(2px, -2px);
    }
    50% {
        background: #ff3500;
        transform: translate(-2px, 2px);
    }
    75% {
        background: #ff3700;
        transform: none;
    }
}

/* Theme: Hero */
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Metamorphous&display=swap');
:root[data-theme='herojourney'] {
    /* Fuentes */
    --font-toolbar-family: 'MedievalSharp', cursive;
    --font-title-family: 'Cinzel', serif;
    --font-cell-family: 'Metamorphous', cursive;
    /* Colores */
    --color-bg: #1a1a1a;
    --color-cell: #2a2a2a;
    --color-modal: rgb(26 26 26 / 95%);
    --color-button: #8b0000;
    --color-letters: #d3d3d3;
    --color-title: #ffd700;
    --color-selected: #aa9000;
    --color-hover: #32cd32;
    --color-line: #1e90ff;
    --color-ui: #ffd700;
    --color-words: #fff;
    --color-menu: #fff;
    /* Efectos */
    --cell-radius: 4px;
    --shadow-opacity: 0.5;
    --border-light: 2px solid rgb(255 215 0 / 30%);
    /* Efectos especiales */
    --effect-color-1: rgb(139 0 0 / 20%);
    --effect-color-2: rgb(255 215 0 / 10%);
    --glow-radius: 20px;
    --glow-color: rgb(50 205 50 / 30%);
    /* Animaciones */
    --found-bg: linear-gradient(45deg, #8b0000, #ffd700);
    --found-scale: 1.15;
    --found-shadow: 0 0 30px rgb(30 144 255 / 60%);
    --unused-scale: 0.85;
    --unused-opacity: 0.2;
    --confetti-colors: #8b0000, #ffd700, #32cd32, #1e90ff;
}
:root[data-theme='herojourney'] .board {
    background: radial-gradient(
        circle at center,
        rgb(139 0 0 / 20%) 0%,
        rgb(26 26 26 / 90%) 70%
    );
    border: 3px solid rgb(255 215 0 / 30%);
}
:root[data-theme='herojourney'] .cell {
    border: var(--border-light);
    box-shadow: 0 0 15px rgb(30 144 255 / 20%);
    background: linear-gradient(
        135deg,
        rgb(42 42 42 / 100%) 0%,
        rgb(42 42 42 / 80%) 100%
    );
}
:root[data-theme='herojourney'] .title {
    text-shadow: 2px 2px 4px rgb(139 0 0 / 60%);
    letter-spacing: 2px;
}
:root[data-theme='herojourney'] .toolbar {
    filter: drop-shadow(1px 1px 2px rgb(139 0 0 / 40%));
}
@keyframes hero-found {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(var(--found-scale));
        box-shadow: 0 0 30px #ffd700;
    }
    100% {
        transform: scale(1);
    }
}
:root[data-theme='herojourney'] .found-temp {
    animation: hero-found 0.8s ease-out;
}
:root[data-theme='herojourney'] .mark.selected {
    animation: hero-selected 1.5s infinite;
}
@keyframes hero-selected {
    0%,
    100% {
        transform: scale(1);
        box-shadow: 0 0 15px #ffd700;
    }
    50% {
        transform: scale(1.1);
        box-shadow: 0 0 25px #32cd32;
    }
}

/* Theme: Light */
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;700&display=swap');
:root[data-theme='light'] {
    /* Fuentes */
    --font-toolbar-family: 'Space Mono', monospace;
    --font-title-family: 'Outfit', sans-serif;
    --font-cell-family: 'DM Sans', sans-serif;
    /* Colores */
    --color-bg: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    --color-cell: linear-gradient(145deg, #e9ecef, #dee2e6);
    --color-modal: #f0f0f0;
    --color-button: #e0e0e0;
    --color-letters: #000;
    --color-title: #1971c2;
    --color-selected: #228be6;
    --color-hover: rgb(34 139 230 / 80%);
    --color-line: #1e5899;
    --color-ui: #1864ab;
    --color-words: #000;
    --color-menu: #000;
    /* Efectos */
    --shadow-opacity: 0.2;
    --border-light: 1px solid rgb(0 0 0 / 8%);
    /* Animaciones */
    --found-bg: linear-gradient(45deg, var(--color-selected), #4b9ced);
    --found-scale: 1.15;
    --found-shadow: 0 0 16px rgb(45 125 210 / 25%);
    --unused-scale: 0.85;
    --unused-opacity: 0.4;
    --confetti-colors: #ffaf00, #fe5840, #00d779, #58f;
}
/* Efectos especiales para Light */
:root[data-theme='light'] .board {
    background: linear-gradient(rgb(248 249 250 / 70%), rgb(233 236 239 / 70%));
}
:root[data-theme='light'] .cell {
    border: 1px solid rgb(0 0 0 / 8%);
    box-shadow:
        inset 0 2px 4px rgb(255 255 255 / 90%),
        0 4px 8px rgb(0 0 0 / 10%);
}
:root[data-theme='light'] .mark.selected {
    box-shadow: 0 0 15px rgb(34 139 230 / 40%);
}
:root[data-theme='light'] .title {
    text-shadow: 1px 1px 2px rgb(0 0 0 / 10%);
}
@keyframes light-found {
    0% {
        transform: scale(1);
        filter: brightness(1);
    }
    50% {
        transform: scale(1.15);
        filter: brightness(1.3);
        box-shadow: 0 0 25px rgb(45 125 210 / 40%);
    }
    100% {
        transform: scale(1);
        filter: brightness(1);
    }
}
:root[data-theme='light'] .found-temp {
    animation-name: light-found !important;
}

/* Theme: Mint */
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;700&display=swap');
:root[data-theme='mint'] {
    --cell-radius: min(12px, 2vw);
    /* Fuentes */
    --font-toolbar-family: 'DM Sans', sans-serif;
    --font-title-family: 'DM Sans', sans-serif;
    --font-cell-family: 'DM Sans', sans-serif;
    --font-cell-weight: 700;
    /* Colores */
    --color-bg: #f0f9f6;
    --color-cell: #fff;
    --color-modal: rgb(255 255 255 / 95%);
    --color-button: linear-gradient(145deg, #fff, #e6f3ee);
    --color-letters: #2d3436;
    --color-title: #00b894;
    --color-words: #2d3436;
    --color-menu: #2d3436;
    --color-ui: #00b894;
    --color-selected: #00b894;
    --color-hover: rgb(0 184 148 / 80%);
    --color-line: #00b894;
    /* Efectos */
    --effect-color-1: rgb(0 184 148 / 5%);
    --effect-color-2: rgb(0 206 201 / 5%);
    --glow-radius: 20px;
    --glow-color: rgb(0 184 148 / 20%);
    --border-light: 1px solid rgb(0 184 148 / 10%);
    /* Animaciones */
    --found-bg: linear-gradient(45deg, #00b894, #00cec9);
    --found-scale: 1.1;
    --found-shadow: 0 0 30px rgb(0 184 148 / 60%);
}

/* Theme: Mystic */
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500&display=swap');
:root[data-theme='mysticshadows'] {
    /* Fuentes */
    --font-toolbar-family: 'Orbitron', sans-serif;
    --font-title-family: 'Cinzel', serif;
    --font-cell-family: 'Space Grotesk', sans-serif;
    /* Colores */
    --color-bg: linear-gradient(135deg, #4b0082, #2f4f4f);
    --color-cell: #2f4f4f;
    --color-modal: rgb(47 79 79 / 95%);
    --color-button: linear-gradient(145deg, #4b0082, #8a2be2);
    --color-letters: #0ff;
    --color-title: #0ff;
    --color-selected: #ff1493;
    --color-hover: rgb(255 20 147 / 80%);
    --color-line: #8a2be2;
    --color-ui: #ff1493;
    --color-words: #fff;
    --color-menu: #0ff;
    /* Efectos */
    --cell-radius: 12px;
    --shadow-opacity: 0.7;
    --border-light: 1px solid rgb(0 255 255 / 20%);
    /* Efectos especiales */
    --effect-color-1: rgb(75 0 130 / 20%);
    --effect-color-2: rgb(138 43 226 / 20%);
    --glow-radius: 30px;
    --glow-color: rgb(0 255 255 / 25%);
    /* Animaciones */
    --found-bg: linear-gradient(45deg, #8a2be2, #ff1493);
    --found-scale: 1.1;
    --found-shadow: 0 0 40px rgb(0 255 255 / 50%);
    --unused-scale: 0.9;
    --unused-opacity: 0.15;
    --confetti-colors: #4b0082, #8a2be2, #0ff, #ff1493;
}
:root[data-theme='mysticshadows'] .cell {
    border: 1px solid rgb(0 255 255 / 20%);
    box-shadow:
        inset 0 0 25px rgb(138 43 226 / 15%),
        0 0 20px rgb(255 20 147 / 20%);
}
:root[data-theme='mysticshadows'] .title {
    background: linear-gradient(to right, #0ff, #ff1493);
    background-clip: text;
    color: transparent;
    text-shadow: 0 0 20px rgb(138 43 226 / 50%);
}
:root[data-theme='mysticshadows'] .toolbar {
    filter: drop-shadow(0 0 10px rgba(0 255 255 / 50%));
}
@keyframes mystic-found {
    0% {
        transform: scale(1);
        filter: hue-rotate(0deg);
    }
    50% {
        transform: scale(1.1);
        filter: hue-rotate(180deg);
        box-shadow:
            0 0 40px #4b0082,
            0 0 80px #8a2be2;
    }
    100% {
        transform: scale(1);
        filter: hue-rotate(360deg);
    }
}
:root[data-theme='mysticshadows'] .found-temp {
    animation-name: mystic-found !important;
}
:root[data-theme='mysticshadows'] .mark.selected {
    animation: shadow-wave 3s ease infinite;
}
@keyframes shadow-wave {
    0%,
    100% {
        box-shadow:
            0 0 20px #4b0082,
            0 0 40px #8a2be2;
    }
    50% {
        box-shadow:
            0 0 30px #0ff,
            0 0 60px #ff1493;
    }
}
img,
picture,
video,
canvas,
svg {
    display: block;
    max-width: 100%;
}

/* Theme: Neon */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;700&display=swap');
:root[data-theme='neon'] {
    --cell-radius: min(8px, 1.5vw);
    /* Fuentes */
    --font-toolbar-family: 'Orbitron', sans-serif;
    --font-title-family: 'Orbitron', sans-serif;
    --font-cell-family: 'Rajdhani', sans-serif;
    --font-cell-weight: 700;
    /* Colores */
    --color-bg: #000;
    --color-cell: #1a1a1a;
    --color-modal: rgb(0 0 0 / 95%);
    --color-button: linear-gradient(145deg, #1a1a1a, #000);
    --color-letters: #0f0;
    --color-title: #f0f;
    --color-words: #fff;
    --color-menu: #0ff;
    --color-ui: #0ff;
    --color-selected: #f0f;
    --color-hover: rgb(255 0 255 / 80%);
    --color-line: #0f0;
    /* Efectos */
    --effect-color-1: rgb(0 255 255 / 10%);
    --effect-color-2: rgb(255 0 255 / 10%);
    --glow-radius: 30px;
    --glow-color: rgb(0 255 255 / 30%);
    --border-light: 1px solid rgb(0 255 255 / 20%);
    /* Animaciones */
    --found-bg: linear-gradient(45deg, #0ff, #f0f);
    --found-scale: 1.2;
    --found-shadow: 0 0 30px rgb(0 255 255 / 80%);
}

/* Theme: Nostalgia */
@import url('https://fonts.googleapis.com/css2?family=Monoton&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;700&display=swap');
:root[data-theme='neonnostalgia'] {
    /* Fuentes */
    --font-toolbar-family: 'Monoton', cursive;
    --font-title-family: 'Monoton', cursive;
    --font-cell-family: 'Chakra Petch', sans-serif;
    /* Colores */
    --color-bg: #360000;
    --color-cell: rgb(0 163 224 / 15%);
    --color-modal: rgb(0 0 0 / 95%);
    --color-button: #360000;
    --color-letters: #fbb03b;
    --color-title: #fbb03b;
    --color-selected: #f15a29;
    --color-hover: #00a3e0;
    --color-line: #d5006d;
    --color-ui: #f15a29;
    --color-words: #fff;
    --color-menu: #fbb03b;
    /* Efectos */
    --cell-radius: 4px;
    --border-light: 2px solid rgb(251 176 59 / 30%);
    /* Efectos especiales */
    --effect-color-1: rgb(57 181 74 / 10%);
    --effect-color-2: rgb(0 163 224 / 10%);
    --glow-radius: 30px;
    --glow-color: rgb(213 0 109 / 40%);
    /* Animaciones */
    --found-bg: linear-gradient(45deg, #39b54a, #00a3e0);
    --found-scale: 1.2;
    --found-shadow: 0 0 20px rgb(213 0 109 / 60%),
        0 0 40px rgb(251 176 59 / 40%);
    --unused-scale: 0.85;
    --unused-opacity: 0.2;
    --confetti-colors: #39b54a, #00a3e0, #f15a29, #fbb03b, #d5006d;
}
:root[data-theme='neonnostalgia'] .board {
    background: transparent;
    border: 3px solid rgb(213 0 109 / 30%);
    box-shadow: 0 0 50px rgb(0 163 224 / 20%);
}
:root[data-theme='neonnostalgia'] .cell {
    border: 2px solid rgb(251 176 59 / 20%);
    box-shadow:
        inset 0 0 20px rgb(57 181 74 / 20%),
        0 0 15px rgb(213 0 109 / 30%);
    background: linear-gradient(
        135deg,
        rgb(42 42 42 / 100%) 0%,
        rgb(42 42 42 / 80%) 100%
    );
}
:root[data-theme='neonnostalgia'] .title {
    text-shadow:
        0 0 5px rgb(251 176 59 / 80%),
        0 0 10px rgb(241 90 41 / 60%),
        0 0 20px rgb(213 0 109 / 40%);
}
@keyframes neon-found {
    0% {
        transform: scale(1);
        filter: brightness(1);
    }
    50% {
        transform: scale(var(--found-scale));
        filter: brightness(1.5);
        box-shadow:
            0 0 30px rgb(57 181 74 / 60%),
            0 0 60px rgb(0 163 224 / 40%);
    }
    100% {
        transform: scale(1);
        filter: brightness(1);
    }
}
:root[data-theme='neonnostalgia'] .found-temp {
    animation: neon-found 0.8s ease-in-out;
}
:root[data-theme='neonnostalgia'] .mark.selected {
    animation: neon-pulse 2s infinite;
}
@keyframes neon-pulse {
    0%,
    100% {
        background: #00a3e0;
        box-shadow: 0 0 20px rgb(0 163 224 / 60%);
    }
    50% {
        background: #f15a29;
        box-shadow: 0 0 30px rgb(241 90 41 / 60%);
    }
}

/* Theme: Odyssey */
@import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Audiowide&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Tomorrow:wght@500&display=swap');
:root[data-theme='odyssey'] {
    /* Fuentes */
    --font-toolbar-family: 'Audiowide', cursive;
    --font-title-family: 'Exo 2', sans-serif;
    --font-cell-family: 'Tomorrow', sans-serif;
    /* Colores */
    --color-bg: linear-gradient(135deg, #1e1e1e, #8a2be2 200%);
    --color-cell: linear-gradient(145deg, #1e1e1e, #2a2a2a);
    --color-modal: linear-gradient(
        180deg,
        rgb(30 30 30 / 95%),
        rgb(138 43 226 / 10%)
    );
    --color-button: linear-gradient(145deg, #2a2a2a, #ff4500);
    --color-letters: #00bfff;
    --color-title: #00bfff;
    --color-selected: #ff4500;
    --color-hover: rgb(255 215 0 / 80%);
    --color-line: #ff4500;
    --color-ui: #ff4500;
    --color-words: #fff;
    --color-menu: #00bfff;
    /* Efectos */
    --cell-radius: 5px;
    --shadow-opacity: 0.55;
    --border-light: 1px solid rgb(0 191 255 / 20%);
    /* Efectos especiales */
    --effect-color-1: rgb(0 191 255 / 15%);
    --effect-color-2: rgb(255 69 0 / 15%);
    --glow-radius: 22px;
    --glow-color: rgb(138 43 226 / 30%);
    /* Animaciones */
    --found-bg: linear-gradient(45deg, #8a2be2, #ff4500);
    --found-scale: 1.12;
    --found-shadow: 0 0 30px rgb(138 43 226 / 50%);
    --unused-scale: 0.88;
    --unused-opacity: 0.25;
    --confetti-colors: #00bfff, #ff4500, #ffd700, #8a2be2;
}
:root[data-theme='odyssey'] .board {
    background: linear-gradient(rgb(30 30 30 / 85%), rgb(42 42 42 / 85%));
}
:root[data-theme='odyssey'] .cell {
    background: linear-gradient(135deg, #1e1e1e, #2a2a2a);
    border: 1px solid rgb(0 191 255 / 20%);
    box-shadow:
        inset 0 0 20px rgb(0 191 255 / 10%),
        0 0 15px rgb(138 43 226 / 20%),
        0 0 30px rgb(255 69 0 / 10%);
}
:root[data-theme='odyssey'] .title {
    background: linear-gradient(to right, #00bfff, #8a2be2);
    background-clip: text;
    color: transparent;
    text-shadow:
        0 0 15px rgb(0 191 255 / 50%),
        0 0 30px rgb(138 43 226 / 30%);
    letter-spacing: 2px;
}
:root[data-theme='odyssey'] .toolbar {
    filter: drop-shadow(0 0 10px rgb(255 69 0 / 50%));
}
@keyframes odyssey-found {
    0% {
        transform: scale(1) rotate(0deg);
        filter: hue-rotate(0deg);
    }
    50% {
        transform: scale(1.12) rotate(3deg);
        filter: hue-rotate(180deg);
        box-shadow:
            0 0 35px rgb(138 43 226 / 60%),
            0 0 55px rgb(255 69 0 / 40%);
    }
    100% {
        transform: scale(1) rotate(0deg);
        filter: hue-rotate(360deg);
    }
}
:root[data-theme='odyssey'] .found-temp {
    animation-name: odyssey-found !important;
}
:root[data-theme='odyssey'] .mark.selected {
    box-shadow:
        0 0 20px #8a2be2,
        0 0 40px #ff4500;
    animation: odyssey-glow 2.5s ease infinite;
}
@keyframes odyssey-glow {
    0%,
    100% {
        box-shadow:
            0 0 20px #ffd700,
            0 0 40px #ff4500;
        filter: brightness(1);
    }
    50% {
        box-shadow:
            0 0 30px #00bfff,
            0 0 60px #8a2be2;
        filter: brightness(1.3);
    }
}

/* Theme: Pixel */
@import url('https://fonts.googleapis.com/css2?family=Silkscreen:wght@700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
@import url('https://fonts.googleapis.com/css2?family=DotGothic16&display=swap');
:root[data-theme='pixel'] {
    /* Fuentes */
    --font-toolbar-family: 'Silkscreen', cursive;
    --font-title-family: 'Press Start 2P', cursive;
    --font-cell-family: 'DotGothic16', sans-serif;
    /* Colores */
    --color-bg: linear-gradient(135deg, #1a1a1a, #8a2be2 200%);
    --color-cell: #2a2a2a;
    --color-modal: rgb(26 26 26 / 95%);
    --color-button: linear-gradient(145deg, #2a2a2a, #8a2be2);
    --color-letters: #0ff;
    --color-title: #0ff;
    --color-selected: #ff69b4;
    --color-hover: rgb(255 105 180 / 80%);
    --color-line: #ffd700;
    --color-ui: #ff69b4;
    --color-words: #0ff;
    --color-menu: #0ff;
    /* Efectos */
    --shadow-opacity: 0.5;
    --border-light: 2px solid rgb(0 255 255 / 30%);
    /* Efectos especiales */
    --effect-color-1: rgb(255 105 180 / 10%);
    --effect-color-2: rgb(138 43 226 / 10%);
    --glow-radius: 15px;
    --glow-color: rgb(0 255 255 / 25%);
    /* Animaciones */
    --found-bg: linear-gradient(45deg, #ff69b4, #8a2be2);
    --found-scale: 1.15;
    --found-shadow: 0 0 25px rgb(255 105 180 / 50%);
    --unused-scale: 0.85;
    --unused-opacity: 0.3;
    --confetti-colors: #ff69b4, #0ff, #ffd700, #ff6347;
}
:root[data-theme='pixel'] .board {
    background-image: linear-gradient(
            45deg,
            transparent 25%,
            rgb(255 99 71 / 10%) 25%
        ),
        linear-gradient(-45deg, transparent 25%, rgb(255 99 71 / 10%) 25%),
        linear-gradient(45deg, rgb(255 99 71 / 10%) 75%, transparent 75%),
        linear-gradient(-45deg, rgb(255 99 71 / 10%) 75%, transparent 75%);
    background-size: 20px 20px;
    background-color: #1a1a1a;
    image-rendering: pixelated;
}
:root[data-theme='pixel'] .cell {
    align-items: baseline;
    border: 2px solid rgb(0 255 255 / 30%);
    image-rendering: pixelated;
    box-shadow:
        inset 0 0 0 2px rgb(255 105 180 / 20%),
        0 0 10px rgb(138 43 226 / 30%);
}
:root[data-theme='pixel'] .title {
    text-shadow:
        2px 2px 0 #ff69b4,
        4px 4px 0 #8a2be2;
    letter-spacing: 2px;
    line-height: 1.5;
}
:root[data-theme='pixel'] .toolbar {
    filter: drop-shadow(2px 2px 0 #ffd700);
}
@keyframes pixel-found {
    0% {
        transform: scale(1);
        clip-path: inset(0 0 0 0);
    }
    50% {
        transform: scale(1.15);
        clip-path: inset(10% 10% 10% 10%);
    }
    100% {
        transform: scale(1);
        clip-path: inset(0 0 0 0);
    }
}
:root[data-theme='pixel'] .found-temp {
    animation-name: pixel-found !important;
}
:root[data-theme='pixel'] .mark.selected {
    border: 2px dashed #ff69b4;
    animation: pixel-rainbow 2s steps(6) infinite;
}
@keyframes pixel-rainbow {
    0% {
        border-color: #ff69b4;
    }
    20% {
        border-color: #0ff;
    }
    40% {
        border-color: #ffd700;
    }
    60% {
        border-color: #ff6347;
    }
    80% {
        border-color: #8a2be2;
    }
    100% {
        border-color: #ff69b4;
    }
}

/* Theme: Paradise */
@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
:root[data-theme='pixelparadise'] {
    /* Fuentes */
    --font-toolbar-family: 'Press Start 2P', cursive;
    --font-title-family: 'Press Start 2P', cursive;
    --font-cell-family: 'VT323', monospace;
    /* Colores */
    --color-bg: #6b5b95;
    --color-cell: #92a8d1;
    --color-modal: rgb(107 91 149 / 95%);
    --color-button: #ff6f61;
    --color-letters: #f7cac9;
    --color-title: #f7cac9;
    --color-selected: #88b04b;
    --color-hover: #ff6f61;
    --color-line: #f7cac9;
    --color-ui: #f7cac9;
    --color-words: #f7cac9;
    --color-menu: #fff;
    /* Efectos */
    --shadow-opacity: 0.4;
    --border-light: 2px solid #f7cac9;
    /* Efectos especiales */
    --effect-color-1: rgb(255 111 97 / 20%);
    --effect-color-2: rgb(136 176 75 / 10%);
    --glow-radius: 15px;
    --glow-color: rgb(247 202 201 / 30%);
    /* Animaciones */
    --found-bg: linear-gradient(45deg, #ff6f61, #88b04b);
    --found-scale: 1.2;
    --found-shadow: 0 0 20px rgb(247 202 201 / 60%);
    --unused-scale: 0.85;
    --unused-opacity: 0.2;
    --confetti-colors: #ff6f61, #88b04b, #92a8d1, #f7cac9;
}
:root[data-theme='pixelparadise'] .board {
    background: linear-gradient(
        45deg,
        rgb(107 91 149 / 80%),
        rgb(146 168 209 / 40%)
    );
    image-rendering: pixelated;
}
:root[data-theme='pixelparadise'] .title {
    text-shadow: 2px 2px 0 #ff6f61;
    letter-spacing: 1px;
    image-rendering: pixelated;
}
:root[data-theme='pixelparadise'] .found-temp {
    animation: pixel-found 0.5s steps(5);
}
@keyframes pixel-found {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(var(--found-scale));
        background: var(--found-bg);
    }
    100% {
        transform: scale(1);
    }
}
:root[data-theme='pixelparadise'] .mark.selected {
    animation: pixel-selected 1s steps(4) infinite;
}
@keyframes pixel-selected {
    0%,
    100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.1);
    }
}

/* Theme: Retro */
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
:root[data-theme='retroarcade'] {
    /* Fuentes */
    --font-toolbar-family: 'Press Start 2P', cursive;
    --font-title-family: 'Press Start 2P', cursive;
    --font-cell-family: 'VT323', monospace;
    /* Colores */
    --color-bg: #121212;
    --color-cell: #1e1e1e;
    --color-modal: rgb(30 30 30 / 95%);
    --color-button: #ff3d00;
    --color-letters: #ffd600;
    --color-title: #ffd600;
    --color-selected: #00b0ff;
    --color-hover: #00e676;
    --color-line: #00b0ff;
    --color-ui: #00e676;
    --color-words: #fff;
    --color-menu: #fff;
    /* Efectos */
    --shadow-opacity: 0.6;
    --border-light: 2px solid rgb(0 176 255 / 30%);
    /* Efectos especiales */
    --effect-color-1: rgb(255 61 0 / 10%);
    --effect-color-2: rgb(0 176 255 / 10%);
    --glow-radius: 20px;
    --glow-color: rgb(0 230 118 / 30%);
    /* Animaciones */
    --found-bg: linear-gradient(45deg, #ff3d00, #00b0ff);
    --found-scale: 1.15;
    --found-shadow: 0 0 30px rgb(255 214 0 / 50%);
    --unused-scale: 0.9;
    --unused-opacity: 0.15;
    --confetti-colors: #ff3d00, #00b0ff, #ffd600, #00e676;
}
:root[data-theme='retroarcade'] .board {
    background: repeating-linear-gradient(
        45deg,
        #121212,
        #121212 10px,
        #1a1a1a 10px,
        #1a1a1a 20px
    );
    box-shadow:
        inset 0 0 20px rgb(0 176 255 / 20%),
        0 0 30px rgb(255 61 0 / 30%);
}
:root[data-theme='retroarcade'] .cell {
    border: 2px solid rgb(0 176 255 / 30%);
    box-shadow:
        inset 0 0 10px rgb(0 230 118 / 20%),
        0 0 15px rgb(255 61 0 / 20%);
    image-rendering: pixelated;
}
:root[data-theme='retroarcade'] .title {
    text-shadow:
        3px 3px 0 #ff3d00,
        -3px -3px 0 #00b0ff;
}
@keyframes arcade-found {
    0% {
        transform: scale(1);
        filter: brightness(1);
    }
    50% {
        transform: scale(var(--found-scale));
        filter: brightness(1.5) hue-rotate(45deg);
    }
    100% {
        transform: scale(1);
        filter: brightness(1);
    }
}
:root[data-theme='retroarcade'] .found-temp {
    animation: arcade-found 0.6s steps(4);
}
:root[data-theme='retroarcade'] .mark.selected {
    animation: arcade-selected 1s steps(2) infinite;
}
@keyframes arcade-selected {
    0%,
    100% {
        background: #00b0ff;
        transform: translateY(0);
    }
    50% {
        background: #00e676;
        transform: translateY(-2px);
    }
}

/* Theme: Rainbow */
@import url('https://fonts.googleapis.com/css2?family=Righteous&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;700&display=swap');
:root[data-theme='retrorainbow'] {
    /* Fuentes */
    --font-toolbar-family: 'Righteous', cursive;
    --font-title-family: 'Righteous', cursive;
    --font-cell-family: 'Quicksand', sans-serif;
    /* Colores */
    --color-bg: linear-gradient(
        135deg,
        rgb(70 130 180 / 90%),
        /* Steel Blue */ rgb(138 43 226 / 90%) /* Blue Violet */
    );
    --color-cell: rgb(255 99 71 / 15%);
    --color-modal: rgb(0 0 0 / 90%);
    --color-button: #ff6347;
    --color-letters: #ffd700;
    --color-title: #ffd700;
    --color-selected: #32cd32;
    --color-hover: #4682b4;
    --color-line: #8a2be2;
    --color-ui: #ffd700;
    --color-words: #fff;
    --color-menu: #fff;
    /* Efectos */
    --cell-radius: 8px;
    --shadow-opacity: 0.6;
    --border-light: 2px solid rgb(255 215 0 / 30%);
    /* Efectos especiales */
    --effect-color-1: rgb(255 99 71 / 10%);
    --effect-color-2: rgb(50 205 50 / 10%);
    --glow-radius: 25px;
    --glow-color: rgb(138 43 226 / 30%);
    /* Animaciones */
    --found-bg: linear-gradient(45deg, #ff6347, #8a2be2);
    --found-scale: 1.12;
    --found-shadow: 0 0 25px rgb(255 215 0 / 50%), 0 0 50px rgb(50 205 50 / 30%);
    --unused-scale: 0.88;
    --unused-opacity: 0.2;
    --confetti-colors: #ff6347, #4682b4, #ffd700, #32cd32, #8a2be2;
}
:root[data-theme='retrorainbow'] .board {
    box-shadow:
        0 0 40px rgb(138 43 226 / 20%),
        inset 0 0 25px rgb(255 215 0 / 10%);
}
:root[data-theme='retrorainbow'] .cell {
    border: var(--border-light);
    background: linear-gradient(
        145deg,
        rgb(61 61 61 / 100%) 0%,
        rgb(61 61 61 / 80%) 100%
    );
    box-shadow:
        inset 0 0 15px rgb(255 215 0 / 10%),
        0 0 20px rgb(138 43 226 / 15%);
    position: relative;
}
:root[data-theme='retrorainbow'] .cell::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
        135deg,
        transparent 0%,
        rgb(138 43 226 / 5%) 100%
    );
    pointer-events: none;
}
:root[data-theme='retrorainbow'] .title {
    text-shadow:
        2px 2px 0 #ff6347,
        -2px -2px 0 #4682b4;
    letter-spacing: 1px;
}
@keyframes rainbow-found {
    0% {
        transform: scale(1);
        filter: hue-rotate(0deg);
    }
    50% {
        transform: scale(var(--found-scale));
        filter: hue-rotate(180deg) brightness(1.3);
    }
    100% {
        transform: scale(1);
        filter: hue-rotate(360deg);
    }
}
:root[data-theme='retrorainbow'] .found-temp {
    animation: rainbow-found 1s ease-in-out;
}
:root[data-theme='retrorainbow'] .mark.selected {
    animation: rainbow-cycle 2s infinite;
}
@keyframes rainbow-cycle {
    0% {
        background: #ff6347;
    }
    25% {
        background: #4682b4;
    }
    50% {
        background: #04d0ca;
    }
    75% {
        background: #32cd32;
    }
    100% {
        background: #8a2be2;
    }
}

/* Theme: Solarized */
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@500;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;700&display=swap');
:root[data-theme='solarized'] {
    /* Fuentes más apropiadas para un tema tipo terminal */
    --font-toolbar-family: 'Source Code Pro', monospace;
    --font-title-family: 'Fira Code', monospace;
    --font-cell-family: 'IBM Plex Mono', monospace;
    --color-bg: #002b36;
    --color-cell: #073642;
    --color-modal: rgb(0 43 54 / 95%);
    --color-button: #073642;
    --color-letters: #b9c3c3;
    --color-title: #b9c3c3;
    --color-selected: #859900;
    --color-hover: #687800;
    --color-line: #cb4b16;
    --color-ui: #2aa198;
    --color-words: #b9c3c3;
    --color-menu: #b9c3c3;
    /* Efectos de terminal */
    --shadow-opacity: 0.4;
    --border-light: 1px solid #094754;
    /* Efectos especiales */
    --effect-color-1: rgb(133 153 0 / 10%);
    --effect-color-2: rgb(203 75 22 / 10%);
    --glow-radius: 15px;
    --glow-color: rgb(133 153 0 / 20%);
    /* Animaciones */
    --found-bg: linear-gradient(45deg, #859900, #2aa198);
    /* green to cyan */
    --found-scale: 1.05;
    --unused-scale: 0.95;
    --unused-opacity: 0.25;
    --confetti-colors: #859900, #2aa198, #268bd2, #6c71c4;
}
:root[data-theme='solarized'] .board {
    background: #001f27;
    box-shadow:
        inset 0 0 20px rgb(0 0 0 / 30%),
        inset 0 0 60px rgb(7 54 66 / 50%);
}
:root[data-theme='solarized'] .cell {
    border: 1px solid #094754;
    background: linear-gradient(135deg, #073642, #002b36);
    box-shadow:
        inset 0 0 10px rgb(0 0 0 / 20%),
        0 0 2px rgb(133 153 0 / 20%);
}
:root[data-theme='solarized'] .title {
    letter-spacing: 1px;
    text-shadow: 0 0 10px rgb(147 161 161 / 30%);
}
:root[data-theme='solarized'] .toolbar {
    filter: drop-shadow(0 0 8px rgb(42 161 152 / 40%));
}
@keyframes solarized-found {
    0%,
    100% {
        transform: scale(1);
        filter: brightness(1);
    }
    50% {
        transform: scale(1.05);
        filter: brightness(1.2);
        box-shadow:
            0 0 20px rgb(133 153 0 / 40%),
            0 0 40px rgb(42 161 152 / 30%);
    }
}
:root[data-theme='solarized'] .found-temp {
    animation-name: solarized-found !important;
}
:root[data-theme='solarized'] .mark.selected {
    animation: solarized-cursor 2s ease infinite;
}
@keyframes solarized-cursor {
    0%,
    100% {
        box-shadow: 0 0 15px rgb(133 153 0);
    }
    50% {
        box-shadow: 0 0 25px rgb(203 75 22);
    }
}

/* Theme: Stealth */
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@500;700&display=swap');
:root[data-theme='stealth'] {
    /* Fuentes */
    --font-toolbar-family: 'Roboto Mono', monospace;
    --font-title-family: 'Space Grotesk', sans-serif;
    --font-cell-family: 'Inter', sans-serif;
    /* Colores */
    --color-bg: linear-gradient(135deg, #000, #696969);
    --color-cell: linear-gradient(145deg, #696969, #000);
    --color-modal: linear-gradient(
        180deg,
        rgb(0 0 0 / 95%),
        rgb(169 169 169 / 95%)
    );
    --color-button: linear-gradient(145deg, #696969, #a9a9a9);
    --color-letters: #fff;
    --color-title: #fff;
    --color-selected: #898989;
    --color-hover: #646464;
    --color-line: #a9a9a9;
    --color-ui: #c0c0c0;
    --color-words: #fff;
    --color-menu: #fff;
    /* Efectos */
    --cell-radius: 2px;
    --shadow-opacity: 0.4;
    --border-light: 1px solid rgb(255 255 255 / 10%);
    /* Efectos especiales */
    --effect-color-1: rgb(169 169 169 / 10%);
    --effect-color-2: rgb(192 192 192 / 10%);
    --glow-radius: 16px;
    --glow-color: rgb(255 255 255 / 15%);
    /* Animaciones */
    --found-bg: linear-gradient(45deg, #646464, #898989);
    --found-scale: 1.08;
    --found-shadow: 0 0 20px rgb(255 255 255 / 30%);
    --unused-scale: 0.92;
    --unused-opacity: 0.2;
    --confetti-colors: #fff, #c0c0c0, #a9a9a9, #696969;
}
:root[data-theme='stealth'] .board {
    background: linear-gradient(rgb(0 0 0 / 90%), rgb(26 26 26 / 90%));
}
:root[data-theme='stealth'] .cell {
    border: 1px solid rgb(255 255 255 / 10%);
    background: linear-gradient(135deg, #696969, #000);
    box-shadow:
        inset 0 0 20px rgb(255 255 255 / 5%),
        0 0 15px rgb(169 169 169 / 20%);
}
:root[data-theme='stealth'] .title {
    text-shadow: 0 0 15px rgb(255 255 255 / 30%);
    letter-spacing: 3px;
}
:root[data-theme='stealth'] .toolbar {
    filter: drop-shadow(0 0 10px rgb(192 192 192 / 40%));
}
@keyframes stealth-found {
    0% {
        transform: scale(1);
        filter: contrast(1);
    }
    50% {
        transform: scale(1.08);
        filter: contrast(1.3);
        box-shadow:
            0 0 25px rgb(192 192 192 / 40%),
            0 0 40px rgb(169 169 169 / 30%);
    }
    100% {
        transform: scale(1);
        filter: contrast(1);
    }
}
:root[data-theme='stealth'] .found-temp {
    animation-name: stealth-found !important;
}
:root[data-theme='stealth'] .mark.selected {
    box-shadow: 0 0 20px rgb(192 192 192 / 30%);
    animation: stealth-fade 2s ease-in-out infinite;
}
@keyframes stealth-fade {
    0%,
    100% {
        background: #646464;
        box-shadow: 0 0 20px rgb(169 169 169 / 30%);
    }
    50% {
        background: #898989;
        box-shadow: 0 0 30px rgb(192 192 192 / 40%);
    }
}

/* Theme: Synthwave */
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&display=swap');
:root[data-theme='synthwave'] {
    /* Fuentes */
    --font-toolbar-family: 'Space Mono', monospace;
    --font-title-family: 'Space Grotesk', sans-serif;
    --font-cell-family: 'Space Mono', monospace;
    /* Colores */
    --color-bg: linear-gradient(180deg, #1a0f2e 0%, #2d1f3d 100%);
    --color-cell: linear-gradient(135deg, #2d1f3d 0%, #1a0f2e 100%);
    --color-modal: rgb(26 15 46 / 95%);
    --color-button: linear-gradient(145deg, #2d1f3d, #241831);
    --color-letters: #ff65d4;
    --color-title: #ff65d4;
    --color-selected: #f700ff;
    --color-hover: rgb(247 0 255 / 80%);
    --color-line: #00fff9;
    --color-ui: #00fff9;
    --color-words: #fff;
    --color-menu: #fff;
    /* Efectos */
    --cell-radius: 12px;
    --shadow-opacity: 0.5;
    --border-light: 1px solid rgb(255 101 212 / 20%);
    /* Animaciones */
    --found-bg: linear-gradient(45deg, #f700ff, #00fff9);
    --found-scale: 1.15;
    --found-shadow: 0 0 20px rgb(247 0 255 / 40%), 0 0 40px rgb(0 255 249 / 20%);
    --unused-scale: 0.85;
    --unused-opacity: 0.2;
    --confetti-colors: #fb36ff, #ffdf36, #f667ff, #ff6565;
}
/* Efectos especiales para Synthwave */
:root[data-theme='synthwave'] .board {
    background: linear-gradient(rgb(26 15 46 / 70%), rgb(45 31 61 / 70%));
}
:root[data-theme='synthwave'] .cell {
    border: 1px solid rgb(247 0 255 / 20%);
    box-shadow:
        inset 0 0 20px rgb(247 0 255 / 10%),
        0 0 15px rgb(0 255 249 / 20%);
}
:root[data-theme='synthwave'] .title {
    background: linear-gradient(to right, #f700ff, #00fff9);
    background-clip: text;
    color: transparent;
    text-shadow:
        0 0 10px rgb(247 0 255 / 50%),
        0 0 20px rgb(0 255 249 / 30%);
}
:root[data-theme='synthwave'] .toolbar {
    filter: drop-shadow(0 0 10px rgb(0 255 249 / 70%));
}
@keyframes synthwave-found {
    0% {
        filter: hue-rotate(0deg) brightness(1);
        transform: scale(1);
    }
    50% {
        filter: hue-rotate(180deg) brightness(1.8);
        transform: scale(1.15);
        box-shadow:
            0 0 30px rgb(247 0 255 / 60%),
            0 0 60px rgb(0 255 249 / 40%);
    }
    100% {
        filter: hue-rotate(360deg) brightness(1);
        transform: scale(1);
    }
}
:root[data-theme='synthwave'] .found-temp {
    animation-name: synthwave-found !important;
}
:root[data-theme='synthwave'] .mark.selected {
    animation: synthwave-glow 2s infinite;
}
@keyframes synthwave-glow {
    0%,
    100% {
        box-shadow:
            0 0 20px #f700ff,
            0 0 40px #00fff9;
    }
    50% {
        box-shadow:
            0 0 40px #f700ff,
            0 0 80px #00fff9;
    }
}

/* Theme: Techno */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500&display=swap');
:root[data-theme='technovibes'] {
    /* Fuentes */
    --font-toolbar-family: 'Syncopate', sans-serif;
    --font-title-family: 'Orbitron', sans-serif;
    --font-cell-family: 'Chakra Petch', sans-serif;
    /* Colores */
    --color-bg: #2d0036;
    --color-cell: #1a1a1a;
    --color-modal: rgb(26 26 26 / 95%);
    --color-button: linear-gradient(145deg, #f0f, #1e90ff);
    --color-letters: #ffd700;
    --color-title: #0f0;
    --color-selected: #f0f;
    --color-hover: rgb(255 0 255 / 70%);
    --color-line: #0f0;
    --color-ui: #1e90ff;
    --color-words: #fff;
    --color-menu: #fff;
    /* Efectos */
    --shadow-opacity: 0.6;
    --border-light: 1px solid rgb(0 255 0 / 30%);
    /* Efectos especiales */
    --effect-color-1: rgb(30 144 255 / 15%);
    --effect-color-2: rgb(255 99 71 / 15%);
    --glow-radius: 20px;
    --glow-color: rgb(0 255 0 / 20%);
    /* Animaciones */
    --found-bg: linear-gradient(45deg, #f0f, #1e90ff);
    --found-scale: 1.1;
    --found-shadow: 0 0 35px rgb(0 255 0 / 50%);
    --unused-scale: 0.9;
    --unused-opacity: 0.2;
    --confetti-colors: #0f0, #f0f, #1e90ff, #ffd700;
}
:root[data-theme='technovibes'] .cell {
    border: 1px solid rgb(0 255 0 / 30%);
    box-shadow:
        inset 0 0 15px rgb(30 144 255 / 20%),
        0 0 10px rgb(255 0 255 / 20%);
    background: linear-gradient(
        135deg,
        rgb(26 26 26 / 90%),
        rgb(26 26 26 / 70%)
    );
}
:root[data-theme='technovibes'] .title {
    text-shadow:
        0 0 10px rgb(0 255 0 / 70%),
        0 0 20px rgb(30 144 255 / 50%);
    letter-spacing: 3px;
}
@keyframes techno-found {
    0% {
        transform: scale(1);
        filter: hue-rotate(0deg);
    }
    50% {
        transform: scale(1.1);
        filter: hue-rotate(180deg);
        border-color: #f0f;
    }
    100% {
        transform: scale(1);
        filter: hue-rotate(360deg);
    }
}
:root[data-theme='technovibes'] .found-temp {
    animation: techno-found 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
:root[data-theme='technovibes'] .mark.selected {
    animation: techno-pulse 2s infinite;
}
@keyframes techno-pulse {
    0%,
    100% {
        box-shadow:
            0 0 15px #0f0,
            0 0 30px #1e90ff;
    }
    50% {
        box-shadow:
            0 0 25px #f0f,
            0 0 50px #ffd700;
    }
}

/* Theme: Vintage */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Old+Standard+TT:wght@400;700&display=swap');
:root[data-theme='vintagevibes'] {
    /* Fuentes */
    --font-toolbar-family: 'Playfair Display', serif;
    --font-title-family: 'Playfair Display', serif;
    --font-cell-family: 'Old Standard TT', serif;
    /* Colores */
    --color-bg: #7d7d7d;
    --color-cell: #c0c0c0;
    --color-modal: rgb(125 125 125 / 95%);
    --color-button: #c5793a;
    --color-letters: #c5793a;
    --color-title: #f5deb3;
    --color-selected: #d2691e;
    --color-hover: #a0522d;
    --color-line: #d2691e;
    --color-ui: #f5deb3;
    --color-words: #bb955c;
    --color-menu: #f5deb3;
    /* Efectos */
    --cell-radius: 2px;
    --shadow-opacity: 0.4;
    --border-light: 1px solid rgb(245 222 179 / 30%);
    /* Efectos especiales */
    --effect-color-1: rgb(160 82 45 / 10%);
    --effect-color-2: rgb(210 105 30 / 10%);
    --glow-radius: 20px;
    --glow-color: rgb(245 222 179 / 20%);
    /* Animaciones */
    --found-bg: linear-gradient(45deg, #60301a, #43220b);
    --found-scale: 1.08;
    --found-shadow: 0 0 25px rgb(245 222 179 / 40%);
    --unused-scale: 0.92;
    --unused-opacity: 0.25;
    --confetti-colors: #c0c0c0, #a0522d, #d2691e, #f5deb3;
}
:root[data-theme='vintagevibes'] .board {
    background: transparent;
    border: 3px solid rgb(245 222 179 / 30%);
    box-shadow: inset 0 0 30px rgb(160 82 45 / 20%);
}
:root[data-theme='vintagevibes'] .cell {
    align-items: end;
    border: var(--border-light);
    box-shadow:
        inset 0 0 15px rgb(160 82 45 / 10%),
        0 2px 4px rgb(0 0 0 / 10%);
}
:root[data-theme='vintagevibes'] .title {
    text-shadow: 2px 2px 4px rgb(160 82 45 / 40%);
    font-style: italic;
    letter-spacing: 0.05em;
}
:root[data-theme='vintagevibes'] .toolbar {
    filter: drop-shadow(1px 1px 2px rgb(160 82 45 / 30%));
}
@keyframes vintage-found {
    0% {
        transform: scale(1);
        filter: sepia(0);
    }
    50% {
        transform: scale(var(--found-scale));
        filter: sepia(0.5) brightness(1.2);
        box-shadow:
            0 0 20px rgb(210 105 30 / 60%),
            0 0 40px rgb(245 222 179 / 40%);
    }
    100% {
        transform: scale(1);
        filter: sepia(0);
    }
}
:root[data-theme='vintagevibes'] .found-temp {
    animation: vintage-found 0.8s var(--animation-timing);
}
:root[data-theme='vintagevibes'] .mark.selected {
    animation: vintage-selected 2s infinite;
}
@keyframes vintage-selected {
    0%,
    100% {
        background: #854212;
        transform: scale(1);
    }
    50% {
        background: #442111;
        transform: scale(1.05);
    }
}
:root[data-theme='vintagevibes'] .word {
    font-family: var(--font-cell-family);
    font-style: italic;
}
:root[data-theme='vintagevibes'] .word.found {
    background: var(--found-bg);
    color: #f5deb3;
    text-shadow: 1px 1px 2px rgb(160 82 45 / 40%);
}

/* Theme: Bloodborne */
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Marcellus&display=swap');
:root[data-theme='bloodborne'] {
    /* Fuentes */
    --font-toolbar-family: 'Cinzel', serif;
    --font-title-family: 'Cinzel', serif;
    --font-cell-family: 'Marcellus', serif;
    /* Colores */
    --color-bg: linear-gradient(135deg, #050203 0%, #1e0a0a 100%);
    --color-cell: #2b0b0b;
    --color-modal: #0d0404;
    --color-button: #900;
    --color-letters: #d4c1c1;
    --color-title: #d4c1c1;
    --color-selected: #c00;
    --color-hover: #c70000;
    --color-line: #8b0000;
    --color-ui: #900;
    --color-words: #d4c1c1;
    --color-menu: #d4c1c1;
    /* Efectos */
    --cell-radius: min(10px, 2vw);
    --border-light: 1px solid rgb(139 0 0 / 30%);
    --shadow-opacity: 0.8;
    /* Animaciones */
    --found-bg: radial-gradient(circle, #c00 0%, #800000 100%);
    --found-scale: 1.12;
    --found-shadow: 0 0 40px rgb(204 0 0 / 70%), 0 0 70px rgb(139 0 0 / 50%);
    --unused-scale: 0.88;
    --unused-opacity: 0.12;
    --animation-duration-found: 750ms;
    --animation-timing: cubic-bezier(0.3, 0, 0.7, 1);
    --confetti-colors: #940004, #3c3c3c, #f00, #700000;
}
@keyframes bloodborne-found {
    0% {
        transform: scale(1) rotate(0deg);
        filter: brightness(1) blur(0);
    }
    25% {
        transform: scale(1.15) rotate(2deg);
        filter: brightness(1.8) blur(2px);
        box-shadow:
            0 0 40px #c00,
            0 0 80px #800000;
    }
    50% {
        transform: scale(0.9) rotate(-2deg);
        filter: brightness(0.7) blur(0);
    }
    75% {
        transform: scale(1.1) rotate(1deg);
        filter: brightness(1.4) blur(1px);
    }
    100% {
        transform: scale(1) rotate(0deg);
        filter: brightness(1) blur(0);
    }
}
:root[data-theme='bloodborne'] .found-temp {
    animation-name: bloodborne-found !important;
}

/* Theme: Dark Souls */
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Marcellus&display=swap');
:root[data-theme='darksouls'] {
    /* Fuentes */
    --font-toolbar-family: 'Cinzel', serif;
    --font-title-family: 'Cinzel', serif;
    --font-cell-family: 'Marcellus', serif;
    /* Colores */
    --color-bg: linear-gradient(135deg, #0c0c0c 0%, #221e1b 100%);
    --color-cell: linear-gradient(135deg, #2b261f, #0f0b09);
    --color-modal: rgb(13 13 13 / 95%);
    --color-button: #bb6f10;
    --color-letters: #e4d6a7;
    --color-title: #e4d6a7;
    --color-selected: #e19038;
    --color-hover: #ffa533;
    --color-line: #ff4500;
    --color-ui: #bb6f10;
    --color-words: #e4d6a7;
    --color-menu: #e4d6a7;
    /* Efectos */
    --cell-radius: min(8px, 2vw);
    --border-light: 1px solid rgb(255 140 0 / 30%);
    --shadow-opacity: 0.85;
    /* Animaciones */
    --found-bg: radial-gradient(circle, #ff8c00 0%, #b35a00 100%);
    --found-scale: 1.1;
    --found-shadow: 0 0 30px rgb(255 140 0 / 60%), 0 0 60px rgb(255 69 0 / 40%);
    --found-brightness: 2.2;
    --found-blur: 4px;
    --unused-scale: 0.9;
    --unused-opacity: 0.15;
    --animation-duration-found: 700ms;
    --animation-timing: cubic-bezier(0.4, 0, 0.2, 1);
    --confetti-colors: #4f4f4f, #dbb82c, #9c9c9c, #000;
}
@keyframes darksouls-found {
    0% {
        transform: scale(1);
        filter: brightness(1) blur(0);
    }
    40% {
        transform: scale(1.2);
        filter: brightness(2.2) blur(4px);
        box-shadow:
            0 0 50px rgb(255 140 0 / 80%),
            0 0 100px rgb(255 69 0 / 60%);
    }
    70% {
        transform: scale(0.9);
        filter: brightness(0.8) blur(0);
    }
    100% {
        transform: scale(1);
        filter: brightness(1) blur(0);
    }
}
:root[data-theme='darksouls'] .found-temp {
    animation-name: darksouls-found !important;
}

/* Theme: Elden Ring */
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Cormorant:wght@500;700&display=swap');
:root[data-theme='eldenring'] {
    /* Fuentes */
    --font-toolbar-family: 'Cinzel', serif;
    --font-title-family: 'Cinzel', serif;
    --font-cell-family: 'Cormorant', serif;
    /* Colores */
    --color-bg: linear-gradient(135deg, #0f0e0a 0%, #2b2615 100%);
    --color-cell: #2a2a2a;
    --color-modal: #1f1f1f;
    --color-button: #a58c00;
    --color-letters: #ffebc2;
    --color-title: #ffebc2;
    --color-selected: #a58c00;
    --color-hover: #634700;
    --color-line: #ffc125;
    --color-ui: #dac083;
    --color-words: #ffebc2;
    --color-menu: #ffebc2;
    /* Efectos */
    --cell-radius: 15%;
    --border-light: 2px solid rgb(255 215 0 / 30%);
    --shadow-opacity: 0.6;
    /* Animaciones */
    --found-bg: radial-gradient(circle, #ffd700 0%, #daa520 100%);
    --found-scale: 1.12;
    --found-shadow: 0 0 45px rgb(255 215 0 / 60%),
        0 0 80px rgb(218 165 32 / 50%);
    --unused-scale: 0.9;
    --unused-opacity: 0.25;
    --animation-duration-found: 900ms;
    --animation-timing: cubic-bezier(0.4, 0, 0.2, 1);
    --confetti-colors: #c3b38e, #6e6e6e, #2f2f2f, #e1e1c4;
}
@keyframes eldenring-found {
    0% {
        transform: scale(1);
        filter: brightness(1);
    }
    20% {
        transform: scale(1.2);
        filter: brightness(2.5);
        box-shadow:
            0 0 50px #ffd700,
            0 0 100px #daa520;
    }
    40% {
        transform: scale(0.95) rotate(1deg);
        filter: brightness(0.8);
    }
    60% {
        transform: scale(1.1) rotate(-1deg);
        filter: brightness(1.6);
    }
    100% {
        transform: scale(1) rotate(0deg);
        filter: brightness(1);
    }
}
:root[data-theme='eldenring'] .found-temp {
    animation-name: eldenring-found !important;
}

/* Theme: Portal */
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@100;200;400&display=swap');
:root[data-theme='portal'] {
    /* Fuentes */
    --font-toolbar-family: 'Oswald', sans-serif;
    --font-title-family: 'Oswald', sans-serif;
    --font-cell-family: 'Oswald', sans-serif;
    --font-cell-weight: 600;
    --portal-blue: #27a7d8;
    --portal-orange: #ff9a00;
    --color-bg: linear-gradient(135deg, #e6e6e6 0%, #d1d1d1 100%);
    --color-cell: radial-gradient(
        circle at center,
        #fff 30%,
        #f2f2f2 50%,
        #e6e6e6 70%,
        #d1d1d1 100%
    );
    --color-modal: rgb(220 220 220 / 90%);
    --color-button: #1a1a1a;
    --color-letters: #1a1a1a;
    --color-title: #1a1a1a;
    --color-selected: var(--portal-blue);
    --color-hover: var(--portal-orange);
    --color-line: var(--portal-orange);
    --color-ui: var(--portal-blue);
    --color-words: #fff;
    --color-menu: #000;
    /* Configuración de celdas */
    --mark-size-override: calc(var(--mark-size) * 1.1);
    /* Efectos y animaciones */
    --border-light: 1px solid rgb(0 0 0 / 20%);
    --shadow-opacity: 0.15;
    --found-bg: var(--portal-orange);
    --found-scale: 1.05;
    --found-shadow: 0 0 0 1px rgb(0 0 0 / 20%), 0 0 30px rgb(0 168 214 / 40%),
        0 0 60px rgb(255 68 0 / 30%);
    --unused-scale: 0.85;
    --unused-opacity: 0.2;
    --animation-duration-found: 800ms;
    --animation-timing: cubic-bezier(0.4, 0, 0.2, 1);
    --confetti-colors: var(--portal-blue), var(--portal-orange), #ffc0cb, #fff;
}
/* Estilizar celdas como paneles de prueba */
:root[data-theme='portal'] .cell {
    background: radial-gradient(
        circle at center,
        #fff 30%,
        #f2f2f2 50%,
        #e6e6e6 70%,
        #d1d1d1 100%
    );
    border:
        calc(var(--cell-size) * 0.02),
        solid #000;
    box-shadow:
        inset 0 0 0 1px rgb(255 255 255 / 90%),
        inset 0 2px 0 rgb(255 255 255 / 50%),
        0 0 0 1px rgb(0 0 0 / 80%);
}
/* Personalización tipográfica ajustada */
:root[data-theme='portal'] .title {
    text-transform: uppercase;
    letter-spacing: 1px;
}
:root[data-theme='portal'] .text {
    padding-bottom: 0.1em;
}
/* Efecto de selección tipo portal */
:root[data-theme='portal'] .mark {
    height: var(--mark-size-override);
    top: calc(50% - var(--mark-size-override) / 2);
}
:root[data-theme='portal'] .mark.selected {
    box-shadow:
        inset 0 0 0 1px rgb(255 255 255 / 20%),
        0 0 20px rgb(0 168 214 / 40%);
}
:root[data-theme='portal'] .hitbox:hover + .mark:not(.selected) {
    box-shadow:
        inset 0 0 0 1px rgb(255 255 255 / 20%),
        0 0 20px rgb(255 68 0 / 40%);
}
:root[data-theme='portal'] .found-temp {
    animation: portal-found 0.8s var(--animation-timing);
    background: #fff;
}
:root[data-theme='portal'] .menu-options {
    color: #fff;
}
@keyframes logo-spin {
    from {
        transform: translate(-50%, -50%) rotate(0deg);
    }
    to {
        transform: translate(-50%, -50%) rotate(360deg);
    }
}
/* Vamos a usar el board como referencia */
:root[data-theme='portal'] .board {
    isolation: isolate;
}
:root[data-theme='portal'] .board::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: min(110%, 150vh);
    aspect-ratio: 1;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 532 532"><g id="c"><g id="b"><path id="a" fill="rgba(0,0,0,0.08)" d="M165 32C108 56 60 101 34 159l248-46"/><use xlink:href="%23a" transform="rotate(45 266 266)"/></g><use xlink:href="%23b" transform="rotate(90 266 266)"/></g><use xlink:href="%23c" transform="rotate(180 266 266)"/></svg>')
        center / 100% no-repeat;
    transform: translate(-50%, -50%);
    animation: logo-spin 60s linear infinite;
    will-change: transform;
    pointer-events: none;
    z-index: 1;
    mix-blend-mode: color;
}
/* Animación de encontrar palabra más dramática */
@keyframes portal-found {
    0% {
        transform: scale(1);
        background: var(--portal-blue);
    }
    33% {
        transform: scale(1.08);
        background: var(--portal-blue);
    }
    40% {
        transform: scale(1.08);
        background: var(--portal-orange);
    }
    66% {
        transform: scale(0.96);
        background: var(--portal-orange);
    }
    100% {
        transform: scale(1);
        background: radial-gradient(
            circle at center,
            #fff 30%,
            #f2f2f2 50%,
            #e6e6e6 70%,
            #d1d1d1 100%
        );
    }
}

/* Theme: Sekiro */
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@500;700&display=swap');
:root[data-theme='sekiro'] {
    /* Fuentes */
    --font-toolbar-family: 'Cinzel', serif;
    --font-title-family: 'Noto Serif JP', serif;
    --font-cell-family: 'Noto Sans JP', sans-serif;
    /* Colores */
    --color-bg: linear-gradient(135deg, #1e1a17 0%, #39342d 100%);
    --color-cell: #2b2823;
    --color-modal: #1c1c1c;
    --color-button: #b32d0f;
    --color-letters: #f1efe9;
    --color-title: #f76b6b;
    --color-selected: #d0491e;
    --color-hover: #f76b6b;
    --color-line: #991b1b;
    --color-ui: #f1efe9;
    --color-words: #f1efe9;
    --color-menu: #f1efe9;
    /* Efectos */
    --cell-radius: 8px;
    --border-light: 1px solid rgb(185 28 28 / 30%);
    --shadow-opacity: 0.5;
    /* Animaciones */
    --found-bg: radial-gradient(circle, #dc2626 0%, #991b1b 100%);
    --found-scale: 1.2;
    --found-shadow: 0 0 30px rgb(220 38 38 / 60%), 0 0 60px rgb(153 27 27 / 40%);
    --unused-scale: 0.88;
    --unused-opacity: 0.2;
    --animation-duration-found: 600ms;
    --animation-timing: cubic-bezier(0.22, 1, 0.36, 1);
    --confetti-colors: #be5f46, #e3e2de, #6d6e71, #acbda9;
}
@keyframes sekiro-found {
    0% {
        transform: scale(1) translateX(0);
        filter: brightness(1) blur(0);
    }
    10% {
        transform: scale(1.25) translateX(-5%);
        filter: brightness(2) blur(2px);
    }
    20% {
        transform: scale(0.9) translateX(5%);
        filter: brightness(0.8) blur(0);
    }
    30% {
        transform: scale(1.15) translateX(0);
        filter: brightness(1.5) blur(1px);
    }
    100% {
        transform: scale(1) translateX(0);
        filter: brightness(1) blur(0);
    }
}
:root[data-theme='sekiro'] .found-temp {
    animation-name: sekiro-found !important;
}

/* Theme: Zelda BOTW */
@import url('https://fonts.googleapis.com/css2?family=Cardo:wght@400;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap');
:root[data-theme='zelda-botw'] {
    /* Fuentes */
    --font-toolbar-family: 'Cardo', serif;
    --font-title-family: 'Cardo', serif;
    --font-cell-family: 'Noto Sans', sans-serif;
    /* Colores - Paleta Sheikah mejorada */
    --color-bg: linear-gradient(135deg, #0f1922 0%, #1a2f3d 50%, #243b4d 100%);
    --color-cell: linear-gradient(145deg, rgb(38 67 87), rgb(29 53 67));
    --color-modal: linear-gradient(
        180deg,
        rgb(22 40 52 / 98%) 0%,
        rgb(15 25 34 / 95%) 100%
    );
    --color-button: linear-gradient(to bottom right, #5ccce0, #45b7ce);
    --color-letters: #e8f1ff;
    --color-title: #e8f1ff;
    --color-selected: #25a5bc;
    --color-hover: rgb(85 145 159 / 80%);
    --color-line: cyan;
    --color-ui: #7cd3e6;
    --color-words: #e8f1ff;
    --color-menu: #e8f1ff;
    /* Efectos mejorados */
    --cell-radius: 3px;
    --border-light: 1px solid rgb(92 204 224 / 20%);
    --shadow-opacity: 0.6;
    --glow-effect: 0 0 20px rgb(69 183 206 / 20%);
    /* Animaciones mejoradas */
    --found-bg: radial-gradient(
        circle,
        rgb(92 204 224 / 100%) 0%,
        rgb(69 183 206 / 90%) 50%,
        rgb(44 149 171 / 80%) 100%
    );
    --found-scale: 1.15;
    --found-shadow: 0 0 25px rgb(92 204 224 / 70%),
        0 0 45px rgb(69 183 206 / 50%), inset 0 0 20px rgb(124 211 230 / 40%);
    --unused-scale: 0.92;
    --unused-opacity: 0.15;
    --animation-duration-found: 800ms;
    --animation-timing: cubic-bezier(0.4, 0, 0.2, 1);
    --confetti-colors: #45b7ce, #e2e9f3, #2c95ab, #7cd3e6;
}
/* Modificar comportamiento de mark */
:root[data-theme='zelda-botw'] .mark {
    transition: all 0.2s ease;
}
:root[data-theme='zelda-botw'] .cell {
    box-shadow:
        var(--glow-effect),
        inset 0 1px 1px rgb(255 255 255 / 10%),
        inset 0 -1px 1px rgb(0 0 0 / 10%);
}
/* Actualizar animación para que sea más similar a los efectos del juego */
@keyframes zelda-found {
    0% {
        transform: scale(1);
        filter: brightness(1) blur(0);
    }
    30% {
        transform: scale(1.15) rotate(1deg);
        filter: brightness(2.5) blur(2px);
        box-shadow:
            0 0 35px rgb(92 204 224 / 80%),
            0 0 65px rgb(69 183 206 / 60%),
            inset 0 0 20px rgb(124 211 230 / 40%);
    }
    60% {
        transform: scale(0.95) rotate(-1deg);
        filter: brightness(0.95) blur(0);
    }
    100% {
        transform: scale(1) rotate(0);
        filter: brightness(1) blur(0);
    }
}
:root[data-theme='zelda-botw'] .found-temp {
    animation-name: zelda-found !important;
    background: var(--found-bg);
    border-color: rgb(124 211 230 / 40%);
}

/* Theme: Among Us */
@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Goldman&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
:root[data-theme='amongus'] {
    /* Fuentes */
    --font-toolbar-family: 'VT323', monospace;
    --font-title-family: 'Goldman', sans-serif;
    --font-cell-family: 'Share Tech Mono', monospace;
    --font-cell-weight: 600;
    /* Colores */
    --color-bg: linear-gradient(180deg, #0b1015 0%, #1b2a32 100%);
    --color-cell: linear-gradient(to bottom, #1b2a32 60%, #132329 100%);
    --color-modal: #15292f;
    --color-button: #ff1c1c;
    --color-letters: #fff;
    --color-title: #fff;
    --color-selected: #ff1c1c;
    --color-hover: #2e5bff;
    --color-line: #98ff4a;
    --color-ui: #98ff4a;
    --color-words: #fff;
    --color-menu: #fff;
    /* Efectos */
    --cell-radius: min(20px, 4vw);
    --border-light: none;
    --shadow-opacity: 0.4;
    /* Animaciones */
    --found-bg: linear-gradient(45deg, #ff1c1c, #ff4d4d);
    --found-scale: 1.12;
    --found-shadow: 0 6px 0 rgb(0 0 0 / 30%);
    --unused-scale: 0.88;
    --unused-opacity: 0.15;
    --animation-duration-found: 700ms;
    --animation-timing: cubic-bezier(0.2, 0, 0.4, 1);
    --confetti-colors: #f00, #00f, #0f0, #ff0;
}
/* Efectos especiales Among Us */
:root[data-theme='amongus'] .board {
    background: linear-gradient(rgb(11 16 21 / 70%), rgb(27 42 50 / 70%));
}
:root[data-theme='amongus'] .cell {
    border-radius: var(--cell-radius) var(--cell-radius)
        calc(var(--cell-radius) * 1.8) calc(var(--cell-radius) * 1.8);
    background: linear-gradient(180deg, #1b2a32 60%, #132329 100%);
    box-shadow:
        inset 0 -4px 0 #132329,
        0 4px 8px rgb(0 0 0 / 20%);
}
:root[data-theme='amongus'] .hitbox:hover + .mark:not(.selected) {
    border-radius: inherit;
}
:root[data-theme='amongus'] .mark.selected {
    border-radius: inherit;
    animation: sus-move 1s infinite;
}
:root[data-theme='amongus'] .title {
    text-shadow: 0 0 3px red;
}
@keyframes sus-move {
    0%,
    100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-3px);
    }
}
@keyframes amongus-found {
    0% {
        transform: scale(1) translateY(0) rotate(0);
        filter: brightness(1);
    }
    40% {
        transform: scale(1.15) translateY(-10px) rotate(-3deg);
        filter: brightness(1.4);
    }
    70% {
        transform: scale(0.95) translateY(5px) rotate(3deg);
        filter: brightness(0.9);
    }
    100% {
        transform: scale(1) translateY(0) rotate(0);
        filter: brightness(1);
    }
}
:root[data-theme='amongus'] .found-temp {
    animation-name: amongus-found !important;
}
:root[data-theme='amongus'] .board svg line {
    filter: drop-shadow(0 0 8px rgb(152 255 74 / 40%));
}

/* Theme: Minecraft */
@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
:root[data-theme='minecraft'] {
    --font-toolbar-family: 'VT323', monospace;
    --font-title-family: 'Press Start 2P', monospace;
    --font-cell-family: 'VT323', monospace;
    /* Colores */
    --color-bg: #45523e;
    --color-cell: #747474;
    --color-modal: #1a1a1a;
    --color-button: #5794df;
    --color-letters: #fff;
    --color-title: #fff;
    --color-selected: #5794df;
    --color-hover: #549551;
    --color-line: #ffd83d;
    --color-ui: #66bb6a;
    --color-words: #fff;
    --color-menu: #fff;
    /* Efectos */
    --border-light: 2px solid #000;
    --shadow-opacity: 0.3;
    /* Animaciones */
    --found-bg: linear-gradient(45deg, #5794df, #66bb6a);
    --found-scale: 1.15;
    --found-shadow: 3px 3px 0 #000;
    --unused-scale: 0.85;
    --unused-opacity: 0.2;
    --confetti-colors: #5794df, #66bb6a, #ffd83d, #c6c6c6;
}
:root[data-theme='minecraft'] body {
    background: var(--color-bg);
}
:root[data-theme='minecraft'] .board {
    background: repeating-conic-gradient(
        from 0deg at 0% 0%,
        #45523e 0% 25%,
        #3b4734 25% 50%,
        #45523e 50% 75%,
        #3b4734 75%
    );
    background-size: 32px 32px;
}
:root[data-theme='minecraft'] .cell {
    background: repeating-conic-gradient(
        from 0deg at 0% 0%,
        #747474 0% 25%,
        #656565 25% 50%,
        #747474 50% 75%,
        #656565 75%
    );
    background-size: 16px 16px;
    image-rendering: pixelated;
    border: 2px solid #000;
    box-shadow:
        inset -2px -2px 0 #404040,
        inset 2px 2px 0 #8b8b8b;
}
:root[data-theme='minecraft'] .text {
    transform: translateY(-1px);
    text-shadow: 2px 2px #000;
}
/* Animación específica de Minecraft */
@keyframes minecraft-found {
    0% {
        transform: translateY(0);
    }
    25% {
        transform: translateY(-8px);
    }
    50% {
        transform: translateY(-6px);
    }
    75% {
        transform: translateY(-8px);
    }
    100% {
        transform: translateY(0);
    }
}
:root[data-theme='minecraft'] .found-temp {
    animation: minecraft-found 600ms;
    background: linear-gradient(45deg, #5794df, #66bb6a);
    box-shadow: 3px 3px 0 #000;
}

/* Theme: Pac-Man */
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
:root[data-theme='pacman'] {
    --font-toolbar-family: 'Press Start 2P', monospace;
    --font-title-family: 'Press Start 2P', monospace;
    --font-cell-family: 'VT323', monospace;
    /* Colores */
    --color-bg: #000;
    --color-cell: #2121de;
    --color-modal: rgb(0 0 64 / 95%);
    --color-button: #2121de;
    --color-letters: #ffd800;
    --color-title: #ffd800;
    --color-selected: #f00;
    --color-hover: rgb(145 0 0);
    --color-line: #0ff;
    --color-ui: #ffb897;
    --color-words: #ffd800;
    --color-menu: #0ff;
    /* Efectos */
    --cell-radius: 4px;
    --border-light: 1px solid #2121ff;
    --line-cap: round;
    --line-dash: 1 15;
    --line-animation: pacman-dots 0.5s linear infinite;
    /* Animaciones */
    --found-bg: linear-gradient(45deg, #ffd700, #ff7f00);
    --found-scale: 1.15;
    --found-shadow: 0 0 20px rgb(255 215 0 / 60%);
    --unused-scale: 0.85;
    --unused-opacity: 0.3;
    --animation-duration-found: 500ms;
    --animation-timing: cubic-bezier(0.36, 0, 0.66, 1);
    --confetti-colors: #ffda00, #00008b, #f00, #fff;
}
:root[data-theme='pacman'] .cell {
    border: 1px solid #2121ff;
    box-shadow: 0 0 10px rgb(33 33 255 / 30%);
}
@keyframes pacman-dots {
    to {
        stroke-dashoffset: -16;
    }
}
@keyframes pacman-found {
    0% {
        transform: scale(1);
    }
    25% {
        transform: scale(1.2) rotate(-15deg);
    }
    50% {
        transform: scale(0.8) rotate(15deg);
    }
    75% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
}
:root[data-theme='pacman'] .found-temp {
    animation: pacman-found var(--animation-duration-found)
        var(--animation-timing);
    background: linear-gradient(45deg, #ffd700, #ff7f00);
    box-shadow: 0 0 20px rgb(255 215 0 / 60%);
}

/* Theme: Space Invaders */
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
:root[data-theme='spaceinvaders'] {
    --font-toolbar-family: 'Press Start 2P', monospace;
    --font-title-family: 'Press Start 2P', monospace;
    --font-cell-family: 'VT323', monospace;
    /* Colores */
    --color-bg: #000;
    --color-cell: #111;
    --color-modal: rgb(0 0 0 / 90%);
    --color-button: #f00;
    --color-letters: #fff;
    --color-title: #fff;
    --color-selected: #f00;
    --color-hover: #0f0;
    --color-line: #0f0;
    --color-ui: #0f0;
    --color-words: #fff;
    --color-menu: #fff;
    /* Efectos */
    --border-light: 1px solid #0f0;
    /* Animaciones */
    --found-bg: linear-gradient(45deg, #f00, #ff0);
    --found-scale: 1.2;
    --found-shadow: 0 0 20px rgb(255 0 0 / 70%);
    --unused-scale: 0.8;
    --unused-opacity: 0.15;
    --animation-duration-found: 600ms;
    --confetti-colors: #0f0, #f00, #ff0, #fff;
}
:root[data-theme='spaceinvaders'] body::before {
    content: '';
    position: fixed;
    inset: 0;
    background: radial-gradient(2px 2px at 20px 30px, #fff, transparent 70%),
        radial-gradient(2px 2px at 40px 70px, #fff, transparent 70%),
        radial-gradient(3px 3px at 50px 160px, #fff, transparent 70%),
        radial-gradient(2px 2px at 80px 120px, #fff, transparent 70%);
    background-repeat: repeat;
    background-size: 150px 150px;
    animation: space-stars 12s linear infinite;
    pointer-events: none;
    opacity: 0.8;
}
:root[data-theme='spaceinvaders'] .toolbar {
    filter: drop-shadow(0 0 10px rgb(0 255 0 / 100%));
}
:root[data-theme='spaceinvaders'] .cell,
:root[data-theme='spaceinvaders'] .word {
    box-shadow: inset 0 0 10px rgb(0 255 0 / 60%);
}
@keyframes space-stars {
    from {
        background-position: 0 0;
    }
    to {
        background-position: 200px 200px;
    }
}
@keyframes invader-found {
    0% {
        transform: translateY(0) scale(1);
    }
    25% {
        transform: translateY(-15px) scale(1.2);
    }
    50% {
        transform: translateY(5px) scale(0.8);
    }
    75% {
        transform: translateY(-5px) scale(1.1);
    }
    100% {
        transform: translateY(0) scale(1);
    }
}
:root[data-theme='spaceinvaders'] .found-temp {
    animation: invader-found var(--animation-duration-found) steps(4);
    background: linear-gradient(45deg, #f00, #ff0);
    box-shadow: 0 0 20px rgb(255 0 0 / 70%);
}
:root[data-theme='spaceinvaders'] .mark.selected {
    animation: invader-selected 1s steps(2) infinite;
}
@keyframes invader-selected {
    0%,
    100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-2px);
    }
}

/* Theme: Tetris */
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
:root[data-theme='tetris'] {
    --font-toolbar-family: 'Press Start 2P', monospace;
    --font-title-family: 'VT323', monospace;
    --font-cell-family: 'Press Start 2P', monospace;
    /* Colores */
    --color-bg: #000;
    --color-cell: #0341ae;
    --color-modal: #000;
    --color-button: #0341ae;
    --color-letters: #fff;
    --color-title: #fff;
    --color-selected: #0f0;
    --color-hover: #40c2ff;
    --color-line: #ffa500;
    --color-ui: #17b2ff;
    --color-words: #fff;
    --color-menu: #fff;
    /* Efectos */
    --border-light: 2px solid #17b2ff;
    /* Animaciones */
    --found-bg: linear-gradient(45deg, #f00, #ff8e00);
    --found-scale: 1.2;
    --found-shadow: 0 0 20px #17b2ff;
    --unused-scale: 0.8;
    --unused-opacity: 0.25;
    --animation-duration-found: 800ms;
    --confetti-colors: #f00, #0f0, #00f, #ff0;
}
:root[data-theme='tetris'] .board {
    background: repeating-linear-gradient(
        0deg,
        #000,
        #000 1px,
        #111 1px,
        #111 2px
    );
}
:root[data-theme='tetris'] .text {
    margin-left: calc(var(--cell-size) * 0.07);
    margin-top: calc(var(--cell-size) * 0.1);
}
@keyframes tetris-found {
    0% {
        transform: rotate(0) scale(1);
        filter: brightness(1);
    }
    50% {
        transform: rotate(180deg) scale(0.8);
        filter: brightness(1.5);
    }
    100% {
        transform: rotate(360deg) scale(1);
        filter: brightness(1);
    }
}
:root[data-theme='tetris'] .found-temp {
    animation: tetris-found var(--animation-duration-found)
        var(--animation-timing);
    background: linear-gradient(45deg, #f00, #ff8e00);
    box-shadow: 0 0 20px #17b2ff;
}`,wt={categories:{basic:{themes:[{file:"8bitadventure.css",name:"8-Bit"},{file:"arcade.css",name:"Arcade"},{file:"battleready.css",name:"Battle"},{file:"classicconsole.css",name:"Classic"},{file:"cyberpunk.css",name:"Cyberpunk"},{file:"dark.css",name:"Dark",isDefault:!0},{file:"digitaldawn.css",name:"Dawn"},{file:"dreams.css",name:"Dreams"},{file:"elementalfury.css",name:"Elemental"},{file:"fantasy.css",name:"Fantasy"},{file:"forest.css",name:"Forest"},{file:"gameoverglow.css",name:"Game Over"},{file:"glitcheffect.css",name:"Glitch"},{file:"herojourney.css",name:"Hero"},{file:"light.css",name:"Light"},{file:"mint.css",name:"Mint"},{file:"mysticshadows.css",name:"Mystic"},{file:"neon.css",name:"Neon"},{file:"neonnostalgia.css",name:"Nostalgia"},{file:"odyssey.css",name:"Odyssey"},{file:"pixelparadise.css",name:"Paradise"},{file:"pixel.css",name:"Pixel"},{file:"retrorainbow.css",name:"Rainbow"},{file:"retroarcade.css",name:"Retro"},{file:"solarized.css",name:"Solarized"},{file:"stealth.css",name:"Stealth"},{file:"synthwave.css",name:"Synthwave"},{file:"technovibes.css",name:"Techno"},{file:"vintagevibes.css",name:"Vintage"}]},"modern-games":{themes:[{file:"bloodborne.css",name:"Bloodborne"},{file:"darksouls.css",name:"Dark Souls"},{file:"eldenring.css",name:"Elden Ring"},{file:"portal.css",name:"Portal"},{file:"sekiro.css",name:"Sekiro"},{file:"zelda-botw.css",name:"Zelda BOTW"}]},"retro-games":{themes:[{file:"amongus.css",name:"Among Us"},{file:"minecraft.css",name:"Minecraft"},{file:"pacman.css",name:"Pac-Man"},{file:"spaceinvaders.css",name:"Space Invaders"},{file:"tetris.css",name:"Tetris"}]}}};class vt{constructor(){this.currentTheme="dark",this.themesData=wt,this.availableThemes=new Map,this.categoryOrder=[],this.loadedStylesheets=new Set,this.loadedFonts=new Set,this.singleWordTerms=new Set(["pac-man"]),this._styleCache=new Map,this._previewStyles=new Map,this._themeLoadPromise=null,this._activeTheme=null,this._pendingThemeLoad=null,this._activeStyleElement=null,this._styleElement=document.createElement("style"),this._themesStyleElement=document.createElement("style"),this._themesStyleElement.id="theme-styles",this._themeGrid=null}loadThemeData(){var e;if(!((e=this.themesData)!=null&&e.categories)){console.error("❌ No se encontraron datos de temas");return}this.categoryOrder=[],this.availableThemes.clear(),Object.entries(this.themesData.categories).forEach(([t,o])=>{this.categoryOrder.push(t),o.themes.forEach(a=>{this.availableThemes.set(a.file.replace(".css",""),a.name)})}),this._themeGrid=document.querySelector(".theme-grid"),this._themeGrid&&this.generateThemeGrid(),xt({categorías:this.categoryOrder,temas:Array.from(this.availableThemes.entries())},"loadThemeData")}generateThemeGrid(){if(!this._themeGrid){console.error("❌ Elemento theme-grid no encontrado");return}this._themeGrid.innerHTML="",Object.entries(this.themesData.categories).forEach(([e,t])=>{const o=e.split("-").map(i=>i.charAt(0).toUpperCase()+i.slice(1)).join(" "),a=document.createElement("div");a.className="theme-category",a.textContent=o,this._themeGrid.appendChild(a),t.themes.forEach(i=>{const n=i.file.replace(".css",""),c=document.createElement("button");c.className="theme-option",c.dataset.theme=n;const d=document.createElement("div");d.className="preview-wrapper";const f=document.createElement("div");f.className="preview-cell";const k=document.createElement("div");k.className="preview-text",k.textContent="A",f.appendChild(k);const h=document.createElement("div");h.className="preview-mark",f.appendChild(h);const x=document.createElement("div");x.className="preview-title",x.textContent=i.name,d.appendChild(f),d.appendChild(x),c.appendChild(d),c.addEventListener("click",()=>this.setTheme(n)),this._themeGrid.appendChild(c)})})}async injectBaseStyles(){console.log("💉 Inyectando estilos base..."),this._styleElement.textContent=Ee,document.head.appendChild(this._styleElement),this.loadThemeData(),this._themesStyleElement||(this._themesStyleElement=document.createElement("style"),this._themesStyleElement.id="theme-styles"),this._themesStyleElement.textContent=this.getThemeStyles(),document.head.appendChild(this._themesStyleElement),await new Promise(e=>{requestAnimationFrame(()=>setTimeout(e,100))})}getThemeStyles(){var t;if(!((t=this.themesData)!=null&&t.categories))return console.error("❌ No hay datos de temas"),"";const e=[];return Object.values(this.themesData.categories).forEach(o=>{o.themes.forEach(a=>{const i=a.file.replace(".css",""),n=this.findThemeStylesInCss(i);n&&e.push(n)})}),e.join(`

`)}findThemeStylesInCss(e){const t=`[data-theme='${e}']`,o=Ee;let a=o.indexOf(t);if(a===-1)return null;let i=0,n=a,c=!1;for(let d=a;d<o.length;d++){const f=o[d];if(f==="{"?(i++,c=!0):f==="}"&&i--,c&&i===0){n=d+1;break}}return o.substring(a,n)}async initialize(){console.group("[ThemeSelector] Inicializando");try{const e=await S.get(S.KEYS.THEME,"dark");return console.log("Tema guardado:",e),this._pendingTheme=e,await this.injectBaseStyles(),this.loadThemeData(),console.log("✅ ThemeSelector preparado"),!0}catch(e){return console.error("❌ Error:",e),document.documentElement.setAttribute("data-theme","dark"),!1}finally{console.groupEnd()}}async applyPendingTheme(){if(this._pendingTheme){console.log("🎨 Aplicando tema:",this._pendingTheme);try{await this.loadFontsForTheme(this._pendingTheme),document.documentElement.setAttribute("data-theme",this._pendingTheme),this._activeTheme=this._pendingTheme,await document.fonts.ready,await new Promise(e=>setTimeout(e,100)),this._pendingTheme=null,console.log("✅ Tema aplicado")}catch(e){console.error("❌ Error aplicando tema:",e)}}}async parseFonts(e){const t=/@import url\(['"]([^'"]+)['"]\);/g,o=new Set;let a;for(;(a=t.exec(e))!==null;)o.add(a[1]);return Array.from(o)}async loadFontsForTheme(e){try{const o=(await this.parseFonts(Ee)).map(a=>{const i=document.createElement("link");return i.rel="stylesheet",i.href=a,i});await Promise.all(o.map(a=>new Promise((i,n)=>{a.onload=()=>i(),a.onerror=()=>n(),document.head.appendChild(a)}))),await document.fonts.ready,console.log("✅ Fuentes cargadas para el tema:",e)}catch(t){console.error("❌ Error cargando fuentes:",t)}}async preloadFontsForTheme(e){try{console.log("🔤 Precargando fuentes para:",e);const o=(await this.parseFonts(Ee)).map(a=>{const i=document.createElement("link");return i.rel="stylesheet",i.href=a,i});await Promise.all(o.map(a=>new Promise(i=>{a.onload=i,a.onerror=i,document.head.appendChild(a)}))),await document.fonts.ready,console.log("✅ Fuentes cargadas")}catch(t){console.error("❌ Error cargando fuentes:",t)}}async setTheme(e){if(this._activeTheme===e)return!0;try{return console.group("🎨 Cambiando tema a:",e),document.documentElement.setAttribute("data-theme",e),await this.loadFontsForTheme(e),await document.fonts.ready,this._activeTheme=e,await S.setCurrentTheme(e),window.dispatchEvent(new CustomEvent("themechange",{detail:{theme:e}})),console.log("✅ Tema aplicado"),console.groupEnd(),!0}catch(t){return console.error("❌ Error aplicando tema:",t),console.groupEnd(),!1}}}const Ue=new Set;function xt(l,e){const t=`${e}-${JSON.stringify(l)}`;Ue.has(t)||(console.log("✅ Temas cargados:",l),Ue.add(t))}class Et{constructor(e){this.titleElement=e,this.observer=new MutationObserver(()=>this.fit()),this.observe(),this.bindEvents()}observe(){this.observer.observe(this.titleElement,{childList:!0,characterData:!0,subtree:!0})}bindEvents(){window.addEventListener("resize",()=>{requestAnimationFrame(()=>this.fit())})}async fit(e=1){if(!this._fitInProgress){this._fitInProgress=!0;try{const a=this.titleElement,i=a.parentElement,n=$.getPlatform()==="android",c=getComputedStyle(i),d=i.clientWidth,f=parseFloat(c.paddingLeft)+parseFloat(c.paddingRight),k=n?d*.05:Math.min(16,d*.03),h=d-f-k;a.style="",await document.fonts.ready,a.style.display="inline-block",a.offsetWidth;const x=getComputedStyle(a),L=parseFloat(x.fontSize),T=document.createElement("span");T.style.cssText=`
                position: absolute;
                visibility: hidden;
                white-space: nowrap;
                font-family: ${x.fontFamily};
                font-size: ${L}px;
            `,T.textContent=a.textContent,document.body.appendChild(T);const N=T.offsetWidth;if(document.body.removeChild(T),e===1&&await D.logToNative(`📏 [${n?"Android":"Web"}] Ajuste inicial`,{texto:a.textContent,contenedor:Math.round(d),disponible:Math.round(h),anchoActual:Math.round(N)}),N>h){const v=n?.5:.85,A=.15*(e-1),U=Math.max(.3,v-A),O=h/N*U*.9,q=n?14:18,G=n?d*.05:d*.08;let R=Math.floor(Math.max(q,Math.min(L*O,G)));for(await D.logToNative("📊 Cálculos",{factorEscala:U,escalaFinal:O.toFixed(2),fuenteMinima:Math.round(q),fuenteNueva:R,maximoPermitido:Math.round(G)});R>=q;){a.style.fontSize=`${R}px`,a.offsetWidth,await new Promise(z=>requestAnimationFrame(z)),T.style.fontSize=`${R}px`,document.body.appendChild(T);const V=T.offsetWidth;document.body.removeChild(T);const M={anchoFinal:Math.round(V),anchoDisponible:Math.round(h),ajustado:V<=h,porcentajeReduccion:Math.round((1-R/L)*100)};if(await D.logToNative("📐 Resultado",M),V<=h){await D.logToNative("✅ Ajuste completado");return}if(R=Math.floor(R*.9),R<q)break}if(e<3)return await D.logToNative("⚠️ Reintentando ajuste..."),await new Promise(V=>setTimeout(V,50)),this.fit(e+1)}else await D.logToNative("✅ No necesita ajuste")}catch(a){console.error("Error ajustando título:",a)}finally{this._fitInProgress=!1,this.titleElement.style.display=""}}}destroy(){this.observer.disconnect()}}const ue=class ue{constructor(){if(ue.instance)return ue.instance;ue.instance=this,console.group("🎮 GameState Constructor");const e="base-styles";if(!document.getElementById(e)){console.log("💉 Inyectando estilos base...");const t=document.createElement("style");t.id=e,t.textContent=`
                @keyframes rotation {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .loader {
                    width: 48px;
                    height: 48px;
                    border: 5px solid #fff;
                    border-bottom-color: transparent;
                    border-radius: 50%;
                    display: inline-block;
                    animation: rotation 1s linear infinite;
                }
                .js-loading-overlay {
                    position: fixed;
                    inset: 0;
                    background: #121212;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999;
                    opacity: 1;
                    transition: opacity 0.3s ease-out;
                }
                .js-loading-overlay.hidden {
                    opacity: 0;
                    pointer-events: none;
                }
            `,document.head.appendChild(t)}document.getElementById(e)&&document.getElementById(e).remove(),window.themeSelector||(window.themeSelector=new vt),this.themeSelector=window.themeSelector,console.log("✅ GameState inicializado"),console.groupEnd(),this._lastAppliedTheme=null}async initialize(){console.group("🔄 Inicialización");try{await this.themeSelector.injectBaseStyles(),await this.themeSelector.initialize();const e=await S.get(S.KEYS.THEME,"dark"),[t,o]=await Promise.all([this.themeSelector.setTheme(e),Promise.all([D.initialize(),S.initialize()])]);this.initializeElements(),this.initializeState(),this.initializeBoard();const a=Q[0],i=await S.getCurrentLevel(),n=i&&re[i]?i:a;this.currentLevel={...re[n],id:n,name:re[n].name},this.bindEvents(),await this.updateAllWithoutTitleFit(n),document.dispatchEvent(new CustomEvent("initialization-complete")),this.titleFitter&&(await this.titleFitter.fit(),requestAnimationFrame(()=>{document.dispatchEvent(new CustomEvent("title-adjusted",{detail:{final:!0}}))})),console.log("✅ Inicialización completada")}catch(e){console.error("❌ Error:",e),this.handleInitializationError()}console.groupEnd()}handleInitializationError(){const e=Q[0];console.log("Recuperando con nivel por defecto:",e),this.currentLevel={...re[e],id:e,name:re[e].name},this.initializeElements(),this.initializeState(),this.initializeBoard(),this.updateAll(e),this.showContent()}async onAppPause(){this.timer&&!this.timer.isPaused&&(this.pauseTimer(),this._wasTimerRunning=!0),await S.setCurrentLevel(this.currentLevel.id)}onAppResume(){var e;this.checkAndHandleDataReset(),this._wasTimerRunning&&((e=this.timer)!=null&&e.isPaused)&&(this.resumeTimer(),this._wasTimerRunning=!1)}async saveGameState(){try{await S.setCurrentLevel(this.currentLevel.id)}catch(e){console.error("Error guardando estado:",e)}}async checkAndHandleDataReset(){try{await S.get(S.KEYS.THEME)||await this.handleDataReset()}catch(e){console.error("Error verificando datos:",e),await this.handleDataReset()}}async handleDataReset(){try{await S.resetToDefaults(),await this.themeSelector.initialize(),await this.loadLevel(Q[0])}catch(e){console.error("Error reinicializando datos:",e)}}async initializeGame(){await S.initialize();const e=await S.get(S.KEYS.CURRENT_LEVEL,Q[0]);this.currentLevel={...re[e],id:e}}async initPhase1(){try{await this.themeSelector.initialize(),this.initializeElements(),this.initializeState(),this.initializeBoard(),this.bindEvents()}catch(e){console.error("Error in initPhase1:",e),document.documentElement.setAttribute("data-theme","dark")}}async initPhase2(){const e=await S.get(S.KEYS.CURRENT_LEVEL,Q[0]);this.currentLevel={...re[e],id:e},this.updateAll(this.currentLevel.id),this.showContent()}setTheme(e){return this.themeSelector.setTheme(e)}async handleThemeChange(e){console.group("🔄 Cambio de tema:",e);try{if(this._lastAppliedTheme===e){console.log("⏩ Tema ya aplicado, omitiendo...");return}console.log("🎨 Aplicando tema..."),await this.themeSelector.setTheme(e),this._lastAppliedTheme=e,console.log("🔄 Reseteando estilos del título..."),this.titleElement.style="",console.log("⌛ Esperando fuentes..."),await document.fonts.ready;const t=getComputedStyle(this.titleElement);console.log("🔤 Precargando fuente:",t.fontFamily),await document.fonts.load(`${t.fontSize} ${t.fontFamily}`),this.titleFitter&&(console.log("📏 Ajustando título..."),await this.titleFitter.fit()),console.log("📝 Actualizando lista de palabras..."),this.updateWordList(),console.log("✅ Cambio de tema completado")}catch(t){console.error("❌ Error al cambiar tema:",t)}console.groupEnd()}async showContent(){var e;console.group("👁️ Mostrando Contenido");try{const t=document.querySelector(".js-loading-overlay"),o=t.querySelector(".progress-bar");o.style.transform="scaleX(0)",await new Promise(i=>requestAnimationFrame(i)),document.documentElement.setAttribute("data-theme","dark"),await this.themeSelector.injectBaseStyles(),o.style.animationPlayState="running",await this.themeSelector.initialize();const a=await S.get(S.KEYS.THEME,"dark");await this.themeSelector.setTheme(a),await document.fonts.ready,await new Promise(i=>{o.addEventListener("animationend",i,{once:!0})}),t.classList.add("fade-out")}catch(t){console.error("❌ Error:",t),(e=document.querySelector(".js-loading-overlay"))==null||e.remove()}finally{document.body.classList.remove("js-loading"),console.groupEnd()}}async updateAllWithoutTitleFit(e){var t;(t=this.currentLevel)!=null&&t.data&&(this.updateBoard(),this.updateTitleContent(),this.updateWordList(),this.updateUnusedLetters(),this.updateLevelNumber(e),this.resetTimer(),this.startTimer())}updateTitleContent(){var a;if(!this.titleElement||!((a=this.currentLevel)!=null&&a.name))return;const e="user-select: text; -webkit-user-select: text; -moz-user-select: text;",o=$.getPlatform()==="android"?"16px":"24px";this.titleElement.textContent=this.currentLevel.name,this.titleElement.style.cssText=`${e}; font-size: ${o};`}async fitTitle(){if(!(this._titleFitInProgress||!this.titleFitter))try{this._titleFitInProgress=!0,await this.titleFitter.fit()}finally{this._titleFitInProgress=!1}}initializeElements(){try{const e={titleContainer:document.querySelector(".title-container"),titleElement:document.querySelector(".title"),board:document.querySelector(".board"),wordList:document.querySelector(".word-list"),levelNumber:document.querySelector(".level-number"),timerElement:document.querySelector(".timer")};if(!e.titleElement||!e.board)throw new Error("Elementos críticos no encontrados");if(Object.entries(e).forEach(([t,o])=>{o||console.warn(`Elemento ${t} no encontrado`),this[t]=o}),this.timer={element:this.timerElement,startTime:0,elapsed:0,interval:null,isPaused:!1},this.titleElement){this.titleFitter=new Et(this.titleElement);const t=$.getPlatform()==="android",o="user-select: text; -webkit-user-select: text; -moz-user-select: text;",a=t?"16px":"24px";this.titleElement.style.cssText=`${o}; font-size: ${a};`}}catch(e){throw console.error("Error inicializando elementos:",e),e}}initializeState(){this.currentLevel=null,this.foundWords=new Set,this.usedLetters=new Set,this.availableThemes=new Map,this.themeDisplayNames=new Map,this.categoryOrder=[],this.selectionManager=new ht(this.board,null,e=>this.onSelectionUpdate(e))}onSelectionUpdate(e){this.checkWord(e)&&oe.resetSelectionWithDelay(this.selectionManager)}initializeBoard(){const e=document.createDocumentFragment();for(let t=1;t<=16;t++){const o=String.fromCharCode(96+Math.ceil(t/4)),a=(t-1)%4+1,i=`${o}${a}`,n=document.createElement("div");n.className="cell",n.id=`tile-${i}`,n.innerHTML=`
                <div class="hitbox" data-position="${i}"></div>
                <div class="mark" id="mark-${i}"></div>
                <div class="text" id="letter-${i}"></div>
            `,e.appendChild(n)}this.board.appendChild(e)}updateBoard(){var o;if(!((o=this.currentLevel)!=null&&o.data)){console.warn("No hay nivel actual o datos para mostrar");return}const e=Array(4).fill().map(()=>Array(4).fill("")),t=Array(16).fill().map((a,i)=>{const n=String.fromCharCode(96+Math.ceil((i+1)/4)),c=i%4+1;return`${n}${c}`});t.forEach(a=>document.getElementById(`tile-${a}`).classList.remove("found-temp","unused")),Object.entries(this.currentLevel.data).forEach(([a,i])=>{a.replace(/\s+/g,"").split("").forEach((n,c)=>{const d=i.slice(c*2,c*2+2);if(d.length===2){const f=d.charCodeAt(0)-97,k=parseInt(d[1])-1;f>=0&&f<4&&k>=0&&k<4&&!e[f][k]&&(e[f][k]=n)}})}),t.forEach((a,i)=>{document.getElementById(`letter-${a}`).textContent=e[Math.floor(i/4)][i%4]})}resetSelection(){this.selectionManager.reset()}async loadLevel(e){oe.stopConfetti(),this.resetControls(),document.querySelectorAll(".animated-letter").forEach(t=>t.remove()),this.currentLevel={...re[e],id:e},[this.foundWords,this.usedLetters].forEach(t=>t.clear()),this.resetSelection(),this.updateAll(e),await S.setCurrentLevel(e)}updateAll(e){var t;if(!((t=this.currentLevel)!=null&&t.data)){console.error("❌ No hay nivel actual para actualizar",{levelId:e,currentLevel:this.currentLevel});return}this.updateBoard(),this.updateTitle(),this.titleFitter&&requestAnimationFrame(()=>this.titleFitter.fit()),this.updateWordList(),this.updateUnusedLetters(),this.updateLevelNumber(e),this.resetTimer(),this.startTimer()}updateTitle(){var e;if(!this.titleElement&&(console.error("Título no encontrado, reinicializando elementos..."),this.initializeElements(),!this.titleElement)){console.error("No se pudo recuperar el elemento título");return}if(!((e=this.currentLevel)!=null&&e.name)){console.error("Nivel actual sin nombre:",this.currentLevel);return}try{const t="user-select: text; -webkit-user-select: text; -moz-user-select: text;";this.titleElement.textContent=this.currentLevel.name;const a=$.getPlatform()==="android"?"16px":"24px";this.titleElement.style.cssText=`${t}; font-size: ${a};`,this.titleFitter&&requestAnimationFrame(()=>this.titleFitter.fit()),console.log("Título actualizado:",{contenido:this.currentLevel.name,elemento:this.titleElement.textContent,estilos:this.titleElement.style.cssText})}catch(t){console.error("Error actualizando título:",t)}}updateWordList(){var a;if(!this.wordList||!((a=this.currentLevel)!=null&&a.data)){console.warn("No hay lista de palabras o nivel actual");return}this.wordList.innerHTML="";const e=document.createDocumentFragment(),t=Object.keys(this.currentLevel.data).sort((i,n)=>i.localeCompare(n)),o=document.createElement("div");o.className="word word-measure",o.style.cssText=`
            position: absolute;
            visibility: hidden;
            height: auto;
            width: auto;
            white-space: nowrap;
        `,document.body.appendChild(o),t.forEach((i,n)=>{const c=document.createElement("div");c.className="word",c.setAttribute("data-index",n);const d=this.foundWords.has(i),f=document.createElement("span");if(o.textContent=i+"M",c.style.setProperty("--word-content-width",`${o.offsetWidth}px`),d)c.classList.add("found"),f.textContent=i;else{const k=i.split(" ").map(h=>h.length);f.innerHTML=`<span class="word-length">${k.join(", ")}</span>`}c.appendChild(f),e.appendChild(c)}),document.body.removeChild(o),this.wordList.appendChild(e)}checkWord(e){if(!(e!=null&&e.length))return!1;const t=e.join("");for(const[o,a]of Object.entries(this.currentLevel.data))if(a===t&&!this.foundWords.has(o)){const i=Object.keys(this.currentLevel.data).sort((c,d)=>c.localeCompare(d)).indexOf(o),n=this.wordList.querySelector(`[data-index="${i}"]`);return n!=null&&n.classList.contains("found")?!1:(this.foundWords.add(o),n&&(n.classList.add("found","found-initial"),n.addEventListener("animationend",()=>{n.classList.remove("found-initial")},{once:!0})),this.animateFound(e),this.resetControls(),!0)}return!1}async animateFound(e){var a;const t=e.join(""),o=(a=Object.entries(this.currentLevel.data).find(([,i])=>i===t))==null?void 0:a[0];if(o){S.isVibrationEnabled&&await D.vibrate(),this.foundWords.size===Object.keys(this.currentLevel.data).length&&(this.pauseTimer(),document.getElementById("final-time").textContent=this.timer.element.textContent);const i=Object.keys(this.currentLevel.data).sort((c,d)=>c.localeCompare(d)).indexOf(o),n=this.wordList.querySelector(`[data-index="${i}"]`);if(!n)return;await oe.animateWordFound(e,n,o),this.updateUnusedLetters(),this.foundWords.size===Object.keys(this.currentLevel.data).length&&this.onLevelComplete()}}updateUnusedLetters(){var t;this.usedLetters.clear(),Object.entries(this.currentLevel.data).forEach(([o,a])=>{if(!this.foundWords.has(o))for(let i=0;i<a.length;i+=2){const n=a.slice(i,i+2);n.length===2&&this.usedLetters.add(n)}});const e=[];for(let o=1;o<=16;o++){const a=String.fromCharCode(96+Math.ceil(o/4)),i=(o-1)%4+1,n=`${a}${i}`,c=document.getElementById(`tile-${n}`);if(!this.usedLetters.has(n))e.push(n),(t=c.querySelector(".hitbox"))==null||t.remove();else if(oe.updateCellStates([c],{remove:["unused"]}),!c.querySelector(".hitbox")){const d=document.createElement("div");d.className="hitbox",d.dataset.position=n,c.insertBefore(d,c.firstChild)}}e.length&&oe.animateUnusedCells(e)}onLevelComplete(){S.isVibrationEnabled&&D.vibrate("HEAVY"),oe.animateVictory(()=>{this.showVictoryModal()})}bindEvents(){Object.entries({touchstart:"handlePointerDown",touchmove:"handleTouchMove",touchend:"handlePointerUp",touchcancel:"handlePointerUp",mousedown:"handlePointerDown",mousemove:"handlePointerMove",mouseup:"handlePointerUp",mouseleave:"handlePointerOut",mouseenter:"handlePointerEnter"}).forEach(([i,n])=>{this.board.addEventListener(i,c=>this.selectionManager[n].call(this.selectionManager,c),{passive:!1})}),window.addEventListener("themechange",i=>{this.handleThemeChange(i.detail.theme)}),this.bindModalEvents(),window.addEventListener("resize",()=>this.selectionManager.drawLine()),document.addEventListener("click",i=>{const n=i.target;n.closest("#victory-modal")||n.closest(".modal-content")||n.closest(".menu")||n.closest(".board")||(this.selectionManager.reset(),n.closest(".modal-overlay")&&this.handleModalClose())}),new ResizeObserver(()=>{requestAnimationFrame(()=>{oe.cleanupAnimations(),this.updateWordList()})}).observe(document.documentElement);const t={"vibration-toggle":async()=>{try{const i=document.getElementById("vibration-toggle"),n=!S.isVibrationEnabled;await S.setVibrationEnabled(n),i.textContent=n?"Desactivar Vibración":"Activar Vibración",n&&await D.vibrate("LIGHT")}catch(i){console.error("Error al cambiar estado de vibración:",i)}},"test-notification":async()=>{console.group("🔔 Test Notificación");try{console.log("1. Inicializando notificaciones..."),await D.initializeNotifications(),console.log("2. Activando notificaciones..."),await S.setNotificationEnabled(!0),console.log("3. Intentando enviar notificación..."),await D.sendNotification("¡Hora de jugar!","Te esperan nuevos desafíos en GameSalad"),console.log("✅ Notificación enviada con éxito")}catch(i){console.error("❌ Error en notificación:",i)}finally{console.groupEnd()}}},o=document.getElementById("vibration-toggle");o&&(o.textContent=S.isVibrationEnabled?"Desactivar Vibración":"Activar Vibración"),Object.entries(t).forEach(([i,n])=>{var c;(c=document.getElementById(i))==null||c.addEventListener("click",n)}),Object.entries({"reset-game":()=>{this.resetTimer(),this.loadLevel(this.currentLevel.id),document.getElementById("modal").classList.remove("active")},"restart-level":()=>{this.resetTimer(),this.loadLevel(this.currentLevel.id),document.getElementById("victory-modal").classList.remove("active")},"next-level":()=>{const n=Q.indexOf(this.currentLevel.id)+1;n<Q.length?(this.resetTimer(),this.loadLevel(Q[n]),document.getElementById("victory-modal").classList.remove("active")):(this.resetTimer(),this.loadLevel(Q[0]),document.getElementById("victory-modal").classList.remove("active"))}}).forEach(([i,n])=>{var c;(c=document.getElementById(i))==null||c.addEventListener("click",n)}),document.addEventListener("appPause",()=>{this.onAppPause()}),document.addEventListener("appResume",()=>{this.onAppResume()}),document.addEventListener("visibilitychange",()=>{document.hidden?this.onAppPause():this.onAppResume()})}bindModalEvents(){var i;const e={menu:document.querySelector(".menu"),modal:document.getElementById("modal"),themeModal:document.getElementById("theme-modal"),victoryModal:document.getElementById("victory-modal")},t=()=>Object.values(e).some(n=>n==null?void 0:n.classList.contains("active")),o=n=>{(n==null?void 0:n.id)!=="victory-modal"&&(n==null||n.classList.remove("active"),t()||this.resumeTimer())};Object.entries({menu:()=>{e.modal.classList.add("active"),this.pauseTimer()},"theme-button":()=>{e.modal.classList.remove("active"),e.themeModal.classList.add("active")},"back-button":()=>{e.themeModal.classList.remove("active"),e.modal.classList.add("active")}}).forEach(([n,c])=>{var d;(d=document.querySelector(n==="menu"?".menu":`#${n}`))==null||d.addEventListener("click",f=>{f.stopPropagation(),c()})}),(i=e.victoryModal)==null||i.addEventListener("click",n=>{n.target===e.victoryModal&&n.stopPropagation()}),document.querySelectorAll(".modal-overlay").forEach(n=>{n.id!=="victory-modal"&&n.addEventListener("click",c=>{c.target===n&&(o(n),t()||this.resumeTimer())})})}handleModalClose(){const e=document.querySelector(".modal-overlay.active:not(#victory-modal)");e&&(e.classList.remove("active"),document.querySelector(".modal-overlay.active")||this.resumeTimer())}startTimer(){this.timer.startTime=Date.now()-this.timer.elapsed,this.timer.isPaused=!1,this.timer.interval&&clearInterval(this.timer.interval),this.timer.interval=setInterval(()=>{this.timer.isPaused||(this.timer.elapsed=Date.now()-this.timer.startTime,this.updateTimerDisplay())},100)}pauseTimer(){this.timer.isPaused||(this.timer.isPaused=!0,this.timer.elapsed=Date.now()-this.timer.startTime,this.saveGameState())}resumeTimer(){this.timer.isPaused&&(this.timer.isPaused=!1,this.timer.startTime=Date.now()-this.timer.elapsed)}resetTimer(){this.timer.interval&&clearInterval(this.timer.interval),this.timer.elapsed=0,this.timer.isPaused=!1,this.updateTimerDisplay()}updateTimerDisplay(){const e=Math.floor(this.timer.elapsed/1e3),t=Math.floor(e/60),o=String(e%60).padStart(2,"0"),a=String(t).padStart(2,"0");this.timer.element.textContent=`${a}:${o}`}showVictoryModal(){this.pauseTimer(),document.getElementById("final-time").textContent=this.timer.element.textContent,document.getElementById("victory-modal").classList.add("active")}updateLevelNumber(e){if(!this.levelNumberElement&&(this.levelNumberElement=document.querySelector(".level-number"),!this.levelNumberElement)){console.error("No se pudo encontrar/crear el número de nivel");return}const t=Q.indexOf(e)+1;if(!t){console.warn("ID de nivel inválido:",e);return}requestAnimationFrame(()=>{this.levelNumberElement.textContent=`#${t}`,this.levelNumberElement.style.cssText=`
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
            `})}resetControls(){this.selectionManager.resetControls()}};be(ue,"instance",null);let Me=ue;const Ve=async()=>{var l;try{await D.initialize(),await new Me().initialize()}catch(e){console.error("Error:",e),(l=document.querySelector(".js-loading-overlay"))==null||l.remove(),document.body.classList.remove("js-loading")}};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Ve):Ve();export{ke as I,Le as N,qe as W};
//# sourceMappingURL=main.js.map
