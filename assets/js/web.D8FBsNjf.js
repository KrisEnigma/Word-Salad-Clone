import{W as r,I as i,N as n}from"./main.BCZujLLb.js";class c extends r{constructor(){super(...arguments),this.selectionStarted=!1}async impact(t){const e=this.patternForImpact(t==null?void 0:t.style);this.vibrateWithPattern(e)}async notification(t){const e=this.patternForNotification(t==null?void 0:t.type);this.vibrateWithPattern(e)}async vibrate(t){const e=(t==null?void 0:t.duration)||300;this.vibrateWithPattern([e])}async selectionStart(){this.selectionStarted=!0}async selectionChanged(){this.selectionStarted&&this.vibrateWithPattern([70])}async selectionEnd(){this.selectionStarted=!1}patternForImpact(t=i.Heavy){return t===i.Medium?[43]:t===i.Light?[20]:[61]}patternForNotification(t=n.Success){return t===n.Warning?[30,40,30,50,60]:t===n.Error?[27,45,50]:[35,65,21]}vibrateWithPattern(t){if(navigator.vibrate)navigator.vibrate(t);else throw this.unavailable("Browser does not support the vibrate API")}}export{c as HapticsWeb};
