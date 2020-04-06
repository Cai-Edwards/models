(this.webpackJsonpmodels=this.webpackJsonpmodels||[]).push([[0],{23:function(e,t,n){e.exports=n(35)},28:function(e,t,n){},29:function(e,t,n){},35:function(e,t,n){"use strict";n.r(t);var a,i,l,r,o,s,c,h,u,d,m,b=n(0),p=n.n(b),f=n(20),v=n.n(f),y=(n(28),n(3)),E=n(5),g=n(10),w=n(11),k=n(13),C=n(7),x=n(15),O=n(8),j=[],M="none",S=!1,P=!1,R=0,q=1e5,T=0,A=1,L=function(){function e(t,n,a,i){Object(y.a)(this,e),this.G=6674e-14,this.mass=t,this.position=n,this.velocity=a,this.trail=[],this.color=i,R=R<t?t:R}return Object(E.a)(e,[{key:"displacement",value:function(e){return Math.pow(Math.pow(e.position[0]-this.position[0],2)+Math.pow(e.position[1]-this.position[1],2),.5)}},{key:"force",value:function(e){var t=this.displacement(e),n=this.G*(e.mass*this.mass/Math.pow(t,2)),a=[(e.position[0]-this.position[0])/t,(e.position[1]-this.position[1])/t];return[n*a[0],n*a[1]]}},{key:"total",value:function(e){var t=this,n=[0,0];return e.forEach((function(e){if(e!==t){var a=t.force(e);n[0]+=a[0],n[1]+=a[1]}})),n}},{key:"apply",value:function(e){this.velocity[0]=(this.velocity[0]*this.mass+e[0]*A)/this.mass,this.velocity[1]=(this.velocity[1]*this.mass+e[1]*A)/this.mass}},{key:"update",value:function(){this.position[0]+=this.velocity[0]*A,this.position[1]+=this.velocity[1]*A,20===this.trail.length&&this.trail.shift();var e=[this.position[0],this.position[1]];this.trail.push(e)}}]),e}();function D(e,t){return Math.random()*(t-e)+e}function I(e,t,n,i,l){M=e,S=t,A=n,P=l,i?(a.addEventListener("mousedown",B),a.addEventListener("mouseup",F)):(a.removeEventListener("mousedown",B),a.removeEventListener("mouseup",F)),q=1e3,T=0}function B(e){d=e.clientX,m=e.clientY}function F(e){var t=[(e.clientX-d)/20,(e.clientY-m)/20];j.push(new L(1e10,[d,m],t,"rgb(0, 0, 0)")),G(j[j.length-1])}function G(e){i.beginPath(),i.arc(e.position[0],e.position[1],function(e){return Math.floor(Math.pow(2,Math.log10(e.mass)/3))}(e),0,2*Math.PI),i.fill(),i.closePath()}function H(){l||requestAnimationFrame(H),o=Date.now(),(c=o-s)>r&&(s=o-c%r,i.clearRect(0,0,h,u),P&&function(){var e=Math.round(1e3/c);T=e>T?e:T,q=e<q?e:q,i.font="18px serif",i.strokeStyle="rgb(0, 0, 0)",i.fillText("fps: "+e.toString(),10,20),i.fillText("max: "+T.toString(),10,40),i.fillText("min: "+q.toString(),10,60),i.fillText("bodies: "+j.length.toString(),10,80)}(),j.forEach((function(e){switch(i.globalAlpha=1,e.apply(e.total(j)),e.update(),i.strokeStyle=e.color,i.fillStyle=e.color,G(e),i.globalAlpha=.8,i.lineWidth=1,M){case"curve":!function(e){i.beginPath(),i.moveTo(e.trail[0],e.trail[1]);for(var t=0;t<e.trail.length-2;t++){var n=(e.trail[t][0]+e.trail[t+1][0])/2,a=(e.trail[t][1]+e.trail[t+1][1])/2;i.quadraticCurveTo(e.trail[t][0],e.trail[t][1],n,a)}if(e.trail.length>1){var l=e.trail.length-2;i.quadraticCurveTo(e.trail[l][0],e.trail[l][1],e.trail[l+1][0],e.trail[l+1][1])}i.stroke(),!0===S&&i.fill(),i.closePath()}(e);break;case"line":!function(e){i.beginPath(),i.moveTo(e.trail[0][0],e.trail[0][1]),e.trail.forEach((function(e){i.lineTo(e[0],e[1])})),i.stroke(),!0===S&&i.fill(),i.closePath()}(e)}})))}var X,Y,J,N,U=function(e){Object(w.a)(n,e);var t=Object(g.a)(n);function n(e){var a;return Object(y.a)(this,n),(a=t.call(this,e)).state={num:100,trail:"none",fill:!1,time:1,click:!1,text:!1},a.handleChange=a.handleChange.bind(Object(O.a)(a)),a.handleCheckboxChange=a.handleCheckboxChange.bind(Object(O.a)(a)),a.handleReset=a.handleReset.bind(Object(O.a)(a)),a.handleClear=a.handleClear.bind(Object(O.a)(a)),a.handleRender=a.handleRender.bind(Object(O.a)(a)),a}return Object(E.a)(n,[{key:"componentDidMount",value:function(){a=document.getElementById("orbit"),i=a.getContext("2d"),h=a.width,u=a.height,l=1}},{key:"componentDidUpdate",value:function(){I(this.state.trail,this.state.fill,this.state.time,this.state.click,this.state.text)}},{key:"handleChange",value:function(e){this.setState(Object(x.a)({},e.target.name,e.target.value))}},{key:"handleReset",value:function(e){!function(e){l=1,i.clearRect(0,0,h,u),(j=[]).push(new L(1e14,[Math.round(h/2),Math.round(u/2)],[0,0],"rgb(0, 0, 0)"));for(var t=0;t<e;t++)j.push(new L(1e10*Math.random(),[D(0,h),D(0,u)],[D(-5,5),D(-5,5)],"rgb("+Math.round(255*Math.random())+","+Math.round(255*Math.random())+","+Math.round(255*Math.random())+")")),i.fillStyle=j[t].color,G(j[t])}(this.state.num)}},{key:"handleClear",value:function(e){j=[],i.clearRect(0,0,h,u)}},{key:"handleCheckboxChange",value:function(e){this.setState(Object(x.a)({},e.target.name,e.target.checked))}},{key:"handleRender",value:function(){l^=1,r=1e3/60,s=Date.now(),H()}},{key:"render",value:function(){return p.a.createElement("div",{id:"outer"},p.a.createElement("div",{id:"canvas"},p.a.createElement("canvas",{id:"orbit",width:1600,height:800})),p.a.createElement("button",{onClick:this.handleRender},"Stop/Start"),p.a.createElement("br",null),p.a.createElement("label",null,"Number of bodies",p.a.createElement("input",{name:"num",type:"number",value:this.state.num,onChange:this.handleChange})),p.a.createElement("br",null),p.a.createElement("label",null,"Trail type",p.a.createElement("select",{name:"trail",value:this.state.trail,onChange:this.handleChange},p.a.createElement("option",{value:"none"},"No trail"),p.a.createElement("option",{value:"line"},"Lines"),p.a.createElement("option",{value:"curve"},"Approximate curve"))),p.a.createElement("br",null),p.a.createElement("label",null,"Fill curve",p.a.createElement("input",{name:"fill",type:"checkbox",checked:this.state.fill,onChange:this.handleCheckboxChange})),p.a.createElement("br",null),p.a.createElement("label",null,"Add planet on click.",p.a.createElement("input",{name:"click",type:"checkbox",checked:this.state.click,onChange:this.handleCheckboxChange})),p.a.createElement("br",null),p.a.createElement("label",null,"Show details",p.a.createElement("input",{name:"text",type:"checkbox",checked:this.state.text,onChange:this.handleCheckboxChange})),p.a.createElement("br",null),p.a.createElement("label",null,"Simulation speed",p.a.createElement("input",{name:"time",type:"number",value:this.state.time,onChange:this.handleChange})),p.a.createElement("br",null),p.a.createElement("button",{onClick:this.handleReset},"Generate"),p.a.createElement("button",{onClick:this.handleClear},"Clear"))}}]),n}(p.a.Component),W=(n(29),function(){function e(t,n){Object(y.a)(this,e),this.boundary=t,this.capacity=n,this.points=[],this.divided=!1}return Object(E.a)(e,[{key:"insert",value:function(e){this.boundary.contains(e)&&(this.points.length<this.capacity?this.points.push(e):(this.divided||(this.divide(),this.divided=!0),this.ne.insert(e),this.nw.insert(e),this.se.insert(e),this.sw.insert(e)))}},{key:"divide",value:function(){var t=this.boundary.x,n=this.boundary.y,a=this.boundary.w,i=this.boundary.h;this.ne=new e(new K(t-a/2,n-i/2,a/2,i/2),this.capacity),this.nw=new e(new K(t+a/2,n-i/2,a/2,i/2),this.capacity),this.se=new e(new K(t-a/2,n+i/2,a/2,i/2),this.capacity),this.sw=new e(new K(t+a/2,n+i/2,a/2,i/2),this.capacity)}},{key:"draw",value:function(){var e=this.boundary.x,t=this.boundary.y,n=this.boundary.w,a=this.boundary.h;N.beginPath(),N.rect(e-n,t-a,2*n,2*a),N.closePath(),this.points.forEach((function(e){N.beginPath(),N.arc(e.x,e.y,1,0,2*Math.PI),N.closePath()})),N.stroke(),this.divided&&(this.ne.draw(),this.nw.draw(),this.se.draw(),this.sw.draw()),N.stroke()}}]),e}()),z=function e(t,n){Object(y.a)(this,e),this.x=t,this.y=n},K=function(){function e(t,n,a,i){Object(y.a)(this,e),this.x=t,this.y=n,this.w=a,this.h=i}return Object(E.a)(e,[{key:"contains",value:function(e){return e.x>this.x-this.w&&e.x<this.x+this.w&&e.y>this.y-this.h&&e.y<this.y+this.h}}]),e}();function Q(e){Z.push(new z(e.clientX,e.clientY))}function V(){Y=new W(X,1),Z.forEach((function(e){Y.insert(e)})),Y.draw(),requestAnimationFrame(V)}var Z=[],$=function(e){Object(w.a)(n,e);var t=Object(g.a)(n);function n(e){return Object(y.a)(this,n),t.call(this,e)}return Object(E.a)(n,[{key:"componentDidMount",value:function(){!function(e){J=document.getElementById("quad"),N=J.getContext("2d"),X=new K(e/2,e/2,e/2,e/2),window.addEventListener("click",Q),V()}(window.innerHeight)}},{key:"render",value:function(){return p.a.createElement("div",null,p.a.createElement("canvas",{id:"quad",width:window.innerHeight,height:window.innerHeight}))}}]),n}(p.a.Component),_=function(e){Object(w.a)(n,e);var t=Object(g.a)(n);function n(){return Object(y.a)(this,n),t.apply(this,arguments)}return Object(E.a)(n,[{key:"render",value:function(){return p.a.createElement(k.a,null,p.a.createElement(C.c,null,p.a.createElement(C.a,{exact:!0,path:"/"},p.a.createElement("div",{id:"main"},p.a.createElement("div",{class:"tile",id:"orbits"},p.a.createElement(k.b,{class:"link",to:"/orbits"},p.a.createElement("div",{class:"inside"},p.a.createElement("h1",null,"Orbits")))),p.a.createElement("div",{class:"tile",id:"quadtree"},p.a.createElement(k.b,{class:"link",to:"/quadtree"},p.a.createElement("div",{class:"inside"},"quadtree"))))),p.a.createElement(C.a,{path:"/orbits"},p.a.createElement(U,null)),p.a.createElement(C.a,{path:"/quadtree"},p.a.createElement($,null))))}}]),n}(p.a.Component);v.a.render(p.a.createElement(_,null),document.getElementById("app"))}},[[23,1,2]]]);
//# sourceMappingURL=main.1e719af9.chunk.js.map