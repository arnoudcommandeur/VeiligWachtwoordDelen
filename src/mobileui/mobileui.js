/*component-base*/var userAgent=navigator.userAgent||navigator.vendor||window.opera,SO={name:"unknown",code:0};/android/i.test(userAgent)&&(SO.name="Android",SO.class="platform-android",SO.code=1);/iPad|iPhone|iPod/.test(userAgent)&&!window.MSStream&&(SO.name="iOS",SO.class="platform-ios",SO.code=2);/windows phone/i.test(userAgent)&&(SO.name="Windows Phone",SO.class="platform-wp",SO.code=3);SO.class&&document.getElementsByTagName("body").length&&(document.getElementsByTagName("body")[0].className+=" "+SO.class);
/*component-button*/document.addEventListener("click",function(e){if(1!==SO.code)return!1;var t=e.target;if("button"!==t.tagName.toLowerCase())return!1;var o=t.getBoundingClientRect(),s=t.querySelector(".ripple");s||((s=document.createElement("span")).className="ripple",s.style.height=s.style.width=Math.max(o.width,o.height)+"px",t.appendChild(s)),s.classList.remove("show");var a=e.pageY-o.top-s.offsetHeight/2-document.body.scrollTop,l=e.pageX-o.left-s.offsetWidth/2-document.body.scrollLeft;return s.style.top=a+"px",s.style.left=l+"px",s.classList.add("show"),!1},!1);
/*component-include*/window.include=function(n,e,t){e.indexOf(".html")<0&&(e+=".html");var i=new XMLHttpRequest;i.onload=function(){if(4==this.readyState){var e=this.responseText,i="string"==typeof n?document.getElementById(n):n;console.log(i),i&&(i.innerHTML=e),t&&t()}},i.open("GET",e+"?cache="+(new Date).getTime(),!0),i.send()},window.bindIncludeEvent=function(){document.querySelectorAll("[include]").forEach(function(n,e){window.include(n,n.getAttribute("include"))})},window.bindIncludeEvent(),document.addEventListener("openPage",function(){window.bindIncludeEvent()});
/*component-input*/!function e(){setTimeout(function(){var t=document.getElementsByTagName("input");for(i in t){var a=t[i].parentNode;a&&(a.className.indexOf("left")>=0||a.className.indexOf("right")>=0)&&a.parentNode.className.indexOf("item")>=0&&(a=a.parentNode),a&&a.className.indexOf("item")>=0&&a.className.indexOf("bind-input-event-click")<0&&(a.className+=" bind-input-event-click",a.addEventListener("click",function(){this.getElementsByTagName("input").length&&(this.getElementsByTagName("input")[0].focus(),"radio"!==this.getElementsByTagName("input")[0].type||this.getElementsByTagName("input")[0].disabled||(this.getElementsByTagName("input")[0].checked=!0))},!1))}var l=document.getElementsByClassName("label-float");for(i in l)l[i].className&&l[i].className.indexOf("bind-input-event-focus")<0&&l[i].querySelectorAll("input,textarea").length&&(l[i].className+=" bind-input-event-focus",l[i].querySelectorAll("input,textarea")[0].addEventListener("focus",function(){this.parentNode.getElementsByTagName("label").length&&this.parentNode.getElementsByTagName("label")[0].className.indexOf("focus")<0&&(this.parentNode.getElementsByTagName("label")[0].className+=" focus")},!1),l[i].querySelectorAll("input,textarea")[0].addEventListener("blur",function(){this.parentNode.getElementsByTagName("label").length&&this.parentNode.getElementsByTagName("label")[0].className&&!this.value.length&&(this.parentNode.getElementsByTagName("label")[0].className=this.parentNode.getElementsByTagName("label")[0].className.replace("focus",""))},!1),l[i].querySelectorAll("input,textarea")[0].value&&l[i].querySelectorAll("input,textarea")[0].value.length&&(l[i].querySelectorAll("input,textarea")[0].parentNode.getElementsByTagName("label")[0].className+=" focus"));e()},500)}();
/*component-menu*/window.menu={},window.openMenu=function(e){var n=e;if((e=document.getElementById(e)).className.indexOf("menu")>=0&&e.className.indexOf("open")<0){var o=document.createElement("div");if(o.className="backdrop backdrop-menu",e.parentNode.appendChild(o),setTimeout(function(){o.className+=" show"}),o.addEventListener("click",function(e){window.closeMenu(n)},!1),2===SO.code){e.style.height=window.innerHeight+"px";var d=" side-menu";if(window.menu.position="left",e.className.indexOf("menu-right")>=0){d=" side-menu-right",window.menu.position="right";var a=document.getElementsByClassName("header");if(a.length)for(i in a)a[i].className&&a[i].className.indexOf("side-menu-right")<0&&(a[i].className+=" side-menu-right")}e.parentNode.className.indexOf("body")>=0?e.parentNode.className+=d:document.getElementsByTagName("body")[0].className+=d}e.className+=" open";var t=new CustomEvent("openMenu",{detail:{menu:n}});document.dispatchEvent(t),window.menu.openFired=!0,document.addEventListener("firedCloseMenu",function(e){window.closeMenu(n)},!1)}},window.closeMenu=function(e){var n=e;if((e=document.getElementById(e)).className.indexOf("open")<0)return!1;var o=new CustomEvent("closeMenu",{detail:{menu:n}});document.dispatchEvent(o),window.menu.openFired=!1,e.className=e.className.replace("open","");var d=document.getElementsByClassName("header");if(d.length)for(i in d)d[i].className&&d[i].className.indexOf("side-menu-right")>=0&&(d[i].className=d[i].className.replace(" side-menu-right",""));var a=e.parentNode.getElementsByClassName("backdrop-menu");a&&a.length&&((a=a[0]).className=a.className.replace("show",""),setTimeout(function(){a&&a.parentNode&&a.parentNode.removeChild(a)},500)),1!==SO.code&&(e.parentNode.className.indexOf("body")>=0?e.parentNode.className=e.parentNode.className.replace("side-menu",""):document.getElementsByTagName("body")[0].className=document.getElementsByTagName("body")[0].className.replace("side-menu",""))},document.querySelector("body").addEventListener("touchstart",function(e){window.menu.xDown=e.touches[0].clientX,window.menu.yDown=e.touches[0].clientY},!1),window.menu.handleTouchMove=function(e,n){if(window.menu.xDown&&window.menu.yDown){var o=e.touches[0].clientX,i=e.touches[0].clientY;if(window.menu.xDiff=window.menu.xDown-o,window.menu.yDiff=window.menu.yDown-i,Math.abs(window.menu.xDiff)>Math.abs(window.menu.yDiff)){var d=-1!==document.getElementById(n).classList.value.indexOf("menu-right");window.menu.xDiff>0?d&&!window.menu.openFired?window.openMenu(n):!d&&window.menu.openFired&&window.closeMenu(n):d||window.menu.openFired?d&&window.menu.openFired&&window.closeMenu(n):window.openMenu(n)}window.menu.xDown=null,window.menu.yDown=null}},window.menu.enableSwiper=function(e){document.querySelector("body").addEventListener("touchmove",function(n){window.menu.handleTouchMove(n,e)},!1)};
/*component-loading*/window.loading=function(e){var c={};"object"==typeof e?c=e:c.message=e,c.id||(c.id="LOADING"+(new Date).getTime());var t=document.getElementsByTagName("body")[0];event&&event.target&&event.target.parentNode&&event.target.parentNode.className.indexOf("body")>=0&&(t=event.target.parentNode);var d=document.createElement("div");d.className="backdrop show backdrop-alert",d.id=c.id+"_BACKDROP",t.appendChild(d);var a=document.createElement("div");a.className="alert-mobileui alert-loading",a.id=c.id,d.parentNode.appendChild(a);var l=document.createElement("div");c.class="white",l.className="alert "+c.class,window.SO&&2===SO.code?l.innerHTML='<div class="loading-circle"><svg xmlns="http://www.w3.org/2000/svg" width="37" height="37" viewBox="0 0 27 27"><path d="M18.696,10.5c-0.275-0.479-0.113-1.09,0.365-1.367l4.759-2.751c0.482-0.273,1.095-0.11,1.37,0.368 c0.276,0.479,0.115,1.092-0.364,1.364l-4.764,2.751C19.583,11.141,18.973,10.977,18.696,10.5z"/><path d="M16.133,6.938l2.75-4.765c0.276-0.478,0.889-0.643,1.367-0.366c0.479,0.276,0.641,0.886,0.365,1.366l-2.748,4.762 C17.591,8.415,16.979,8.58,16.5,8.303C16.021,8.027,15.856,7.414,16.133,6.938z"/><path d="M13.499,7.5c-0.552,0-1-0.448-1-1.001V1c0-0.554,0.448-1,1-1c0.554,0,1.003,0.447,1.003,1v5.499 C14.5,7.053,14.053,7.5,13.499,7.5z"/><path d="M8.303,10.5c-0.277,0.477-0.888,0.641-1.365,0.365L2.175,8.114C1.697,7.842,1.532,7.229,1.808,6.75 c0.277-0.479,0.89-0.642,1.367-0.368l4.762,2.751C8.416,9.41,8.58,10.021,8.303,10.5z"/><path d="M9.133,7.937l-2.75-4.763c-0.276-0.48-0.111-1.09,0.365-1.366c0.479-0.277,1.09-0.114,1.367,0.366l2.75,4.765 c0.274,0.476,0.112,1.088-0.367,1.364C10.021,8.581,9.409,8.415,9.133,7.937z"/><path d="M6.499,14.5H1c-0.554,0-1-0.448-1-1c0-0.554,0.447-1.001,1-1.001h5.499c0.552,0,1.001,0.448,1.001,1.001 C7.5,14.052,7.052,14.5,6.499,14.5z"/><path d="M8.303,16.502c0.277,0.478,0.113,1.088-0.365,1.366l-4.762,2.749c-0.478,0.273-1.091,0.112-1.368-0.366 c-0.276-0.479-0.111-1.089,0.367-1.368l4.762-2.748C7.415,15.856,8.026,16.021,8.303,16.502z"/><path d="M10.866,20.062l-2.75,4.767c-0.277,0.475-0.89,0.639-1.367,0.362c-0.477-0.277-0.642-0.886-0.365-1.365l2.75-4.764 c0.277-0.477,0.888-0.638,1.366-0.365C10.978,18.974,11.141,19.585,10.866,20.062z"/><path d="M13.499,19.502c0.554,0,1.003,0.448,1.003,1.002v5.498c0,0.55-0.448,0.999-1.003,0.999c-0.552,0-1-0.447-1-0.999v-5.498 C12.499,19.95,12.946,19.502,13.499,19.502z"/><path d="M17.867,19.062l2.748,4.764c0.275,0.479,0.113,1.088-0.365,1.365c-0.479,0.276-1.091,0.112-1.367-0.362l-2.75-4.767 c-0.276-0.477-0.111-1.088,0.367-1.365C16.979,18.424,17.591,18.585,17.867,19.062z"/><path d="M18.696,16.502c0.276-0.48,0.887-0.646,1.365-0.367l4.765,2.748c0.479,0.279,0.64,0.889,0.364,1.368 c-0.275,0.479-0.888,0.64-1.37,0.366l-4.759-2.749C18.583,17.59,18.421,16.979,18.696,16.502z"/><path d="M25.998,12.499h-5.501c-0.552,0-1.001,0.448-1.001,1.001c0,0.552,0.447,1,1.001,1h5.501c0.554,0,1.002-0.448,1.002-1 C27,12.946,26.552,12.499,25.998,12.499z"/></svg></div>':l.innerHTML='<svg class="loading-circle" width="40" height="40" version="1.1" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="15"></svg>',c.message&&(l.innerHTML+="<p>"+c.message+"</p>"),a.appendChild(l)},window.loadingElement=function(e,c,t,d){"object"!=typeof e&&(e=document.getElementById(e));var a=c?"with-message":"";d=d?"":"white-loading",t||(t="");document.createElement("div");var l="";l=window.SO&&2===SO.code?'<svg class="loading-circle loading-element '+d+" "+a+" "+t+'" xmlns="http://www.w3.org/2000/svg" width="37" height="37" viewBox="0 0 27 27"><path d="M18.696,10.5c-0.275-0.479-0.113-1.09,0.365-1.367l4.759-2.751c0.482-0.273,1.095-0.11,1.37,0.368 c0.276,0.479,0.115,1.092-0.364,1.364l-4.764,2.751C19.583,11.141,18.973,10.977,18.696,10.5z"/><path d="M16.133,6.938l2.75-4.765c0.276-0.478,0.889-0.643,1.367-0.366c0.479,0.276,0.641,0.886,0.365,1.366l-2.748,4.762 C17.591,8.415,16.979,8.58,16.5,8.303C16.021,8.027,15.856,7.414,16.133,6.938z"/><path d="M13.499,7.5c-0.552,0-1-0.448-1-1.001V1c0-0.554,0.448-1,1-1c0.554,0,1.003,0.447,1.003,1v5.499 C14.5,7.053,14.053,7.5,13.499,7.5z"/><path d="M8.303,10.5c-0.277,0.477-0.888,0.641-1.365,0.365L2.175,8.114C1.697,7.842,1.532,7.229,1.808,6.75 c0.277-0.479,0.89-0.642,1.367-0.368l4.762,2.751C8.416,9.41,8.58,10.021,8.303,10.5z"/><path d="M9.133,7.937l-2.75-4.763c-0.276-0.48-0.111-1.09,0.365-1.366c0.479-0.277,1.09-0.114,1.367,0.366l2.75,4.765 c0.274,0.476,0.112,1.088-0.367,1.364C10.021,8.581,9.409,8.415,9.133,7.937z"/><path d="M6.499,14.5H1c-0.554,0-1-0.448-1-1c0-0.554,0.447-1.001,1-1.001h5.499c0.552,0,1.001,0.448,1.001,1.001 C7.5,14.052,7.052,14.5,6.499,14.5z"/><path d="M8.303,16.502c0.277,0.478,0.113,1.088-0.365,1.366l-4.762,2.749c-0.478,0.273-1.091,0.112-1.368-0.366 c-0.276-0.479-0.111-1.089,0.367-1.368l4.762-2.748C7.415,15.856,8.026,16.021,8.303,16.502z"/><path d="M10.866,20.062l-2.75,4.767c-0.277,0.475-0.89,0.639-1.367,0.362c-0.477-0.277-0.642-0.886-0.365-1.365l2.75-4.764 c0.277-0.477,0.888-0.638,1.366-0.365C10.978,18.974,11.141,19.585,10.866,20.062z"/><path d="M13.499,19.502c0.554,0,1.003,0.448,1.003,1.002v5.498c0,0.55-0.448,0.999-1.003,0.999c-0.552,0-1-0.447-1-0.999v-5.498 C12.499,19.95,12.946,19.502,13.499,19.502z"/><path d="M17.867,19.062l2.748,4.764c0.275,0.479,0.113,1.088-0.365,1.365c-0.479,0.276-1.091,0.112-1.367-0.362l-2.75-4.767 c-0.276-0.477-0.111-1.088,0.367-1.365C16.979,18.424,17.591,18.585,17.867,19.062z"/><path d="M18.696,16.502c0.276-0.48,0.887-0.646,1.365-0.367l4.765,2.748c0.479,0.279,0.64,0.889,0.364,1.368 c-0.275,0.479-0.888,0.64-1.37,0.366l-4.759-2.749C18.583,17.59,18.421,16.979,18.696,16.502z"/><path d="M25.998,12.499h-5.501c-0.552,0-1.001,0.448-1.001,1.001c0,0.552,0.447,1,1.001,1h5.501c0.554,0,1.002-0.448,1.002-1 C27,12.946,26.552,12.499,25.998,12.499z"/></svg>':'<svg class="loading-circle loading-element '+d+" "+a+" "+t+'" width="40" height="40" version="1.1" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="15"></svg>',e.oldValue=e.innerHTML,e.innerHTML=l,e.disabled=!0,c&&(e.innerHTML+=c)},window.closeLoading=function(e){if(e)"object"!=typeof e&&(e=document.getElementById(e)),e.innerHTML=e.oldValue,e.disabled=!1;else{var c=document.getElementsByClassName("alert-mobileui")[0],t=c.id;(c=document.getElementById(t)).parentNode.removeChild(c);var d=document.getElementById(t+"_BACKDROP");d.parentNode.removeChild(d)}};
/*component-alert*/window.alert=function(e,t){var a={};"object"==typeof e?a=e:(a.message=e,a.title=t),a.id||(a.id="ALERT"+(new Date).getTime()),a.buttons&&a.buttons.length||(a.buttons=[{label:"OK",onclick:function(){closeAlert()}}]);var n=document.getElementsByTagName("body")[0];event&&event.target&&event.target.parentNode&&event.target.parentNode.className.indexOf("body")>=0&&(n=event.target.parentNode);var d=document.createElement("div");d.className="backdrop show backdrop-alert",d.id=a.id+"_BACKDROP",n.appendChild(d);var l=document.createElement("div");l.className="alert-mobileui",l.id=a.id,d.parentNode.appendChild(l);var o=document.createElement("div");if(a.class||(a.class="white"),o.className="alert "+a.class,a.width&&(o.style.maxWidth=a.width),l.appendChild(o),a.title){var r="<h1>"+a.title+"</h1>";o.insertAdjacentHTML("beforeend",r)}if(a.message){var s="<p>"+a.message+"</p>";o.insertAdjacentHTML("beforeend",s)}a.template&&o.insertAdjacentHTML("beforeend",document.getElementById(a.template).innerHTML);var c=document.createElement("div");c.className="buttons",o.appendChild(c);for(var i in a.buttons){var m=document.createElement("button");a.buttons[i].class||(a.buttons[i].class="text-teal"),m.className=a.buttons[i].class;var p=document.createTextNode(a.buttons[i].label);m.appendChild(p),a.buttons[i].onclick||(a.buttons[i].onclick=closeAlert),m.addEventListener("click",a.buttons[i].onclick),c.appendChild(m)}var u=new CustomEvent("alertOpened");document.dispatchEvent(u)},window.closeAlert=function(e){alertId=e,alertId||(alertId=event.target.parentNode.parentNode.parentNode.id);var t=document.getElementById(alertId);t.parentNode.removeChild(t);var a=document.getElementById(alertId+"_BACKDROP");a.parentNode.removeChild(a)};
