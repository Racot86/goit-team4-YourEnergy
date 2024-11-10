const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/task-manager-Di9FvUSR.css"])))=>i.map(i=>d[i]);
var ae=Object.defineProperty;var se=(t,e,r)=>e in t?ae(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r;var _=(t,e,r)=>se(t,typeof e!="symbol"?e+"":e,r);/* empty css               */import{a as V}from"./vendor-CNNbG8jS.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const n of a.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function r(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(o){if(o.ep)return;o.ep=!0;const a=r(o);fetch(o.href,a)}})();const ne="modulepreload",ie=function(t){return"/goit-team4-YourEnergy/"+t},U={},K=function(e,r,s){let o=Promise.resolve();if(r&&r.length>0){document.getElementsByTagName("link");const n=document.querySelector("meta[property=csp-nonce]"),i=(n==null?void 0:n.nonce)||(n==null?void 0:n.getAttribute("nonce"));o=Promise.allSettled(r.map(c=>{if(c=ie(c),c in U)return;U[c]=!0;const d=c.endsWith(".css"),L=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${L}`))return;const l=document.createElement("link");if(l.rel=d?"stylesheet":ne,d||(l.as="script"),l.crossOrigin="",l.href=c,i&&l.setAttribute("nonce",i),document.head.appendChild(l),d)return new Promise((h,y)=>{l.addEventListener("load",h),l.addEventListener("error",()=>y(new Error(`Unable to preload CSS for ${c}`)))})}))}function a(n){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=n,window.dispatchEvent(i),!i.defaultPrevented)throw n}return o.then(n=>{for(const i of n||[])i.status==="rejected"&&a(i.reason);return e().catch(a)})},I=()=>"https://your-energy.b.goit.study/api",Y=()=>I()+"/exercises",ce=()=>I()+"/filters",le=()=>I()+"/quote",de=()=>I()+"/subscription",ue=(t,e,r,s,o,a)=>`${Y()}?bodypart=${t}&muscles=${e}&equipment=${r}&keyword=${s}&page=${o}&limit=${a}`,me=()=>de();async function ge(){const t=new Date().toISOString().split("T")[0],e=localStorage.getItem("quote"),r=localStorage.getItem("author"),s=localStorage.getItem("quoteDate");if(e&&r&&s===t){document.querySelector(".sidebar-quote").textContent=`${e}`,document.querySelector(".sidebar-quote-author").textContent=`${r}`;return}try{const o=await fetch(le());if(!o.ok)throw new Error("Failed to fetch quote");const a=await o.json(),n=a.quote,i=a.author;document.querySelector(".sidebar-quote").textContent=`${n}`,document.querySelector(".sidebar-quote-author").textContent=`${i}`,localStorage.setItem("quote",n),localStorage.setItem("author",i),localStorage.setItem("quoteDate",t)}catch(o){console.error("Error fetching quote:",o)}}ge();function G(t){return t.sort((e,r)=>e.name.localeCompare(r.name)).map(({filter:e,name:r,imgURL:s})=>`<li class='categories-item' data-name='${r}' data-filter='${e}' tabindex="0"
             style="background-image:url('${s}');background-size:cover; background-repeat:no-repeat; background-position:center">
             <h3 class="categories-item-title">${r}</h3>
             <p class="categories-item-text">${e}</p>
          </li>`).join("")}function X(t){return typeof t=="string"&&t.length>0?t.charAt(0).toUpperCase()+t.slice(1):t}function fe(t){return t.sort((e,r)=>e.name.localeCompare(r.name)).map(({_id:e,name:r,burnedCalories:s,bodyPart:o,target:a,gifUrl:n,rating:i})=>{const d=Math.round(i).toFixed(1);return`
          <li class='workouts-card' data-name='${r}' data-id='${e}'>
            <div class="card-header">
              <div class="card-header_left-side">
                <span class="label">workout</span>
                <div class="rating-container">
                  <span class="rating">${d}</span>
                  <svg
                    class="star"
                    viewBox="0 0 16 16"
                    height="16"
                    width="16"
                    aria-hidden="true"
                  >
                    <use x="0" y="0" href="./img/icons.svg#icon-Star"></use>
                  </svg>
                </div>
                <div class="trash-container hide">
                  <svg width="16" height="16">
                    <use href="./img/icons.svg#icon-trash"></use>
                  </svg>
                </div>
               </div>
              <button type="button" class="workout-start-btn">
                Start
                  <svg
                    viewBox="0 0 16 16"
                    height="16"
                    width="16"
                    aria-hidden="true"
                  >
                    <use x="0" y="0" href="./img/icons.svg#icon-arrow"></use>
                  </svg>
              </button>
            </div>
            <div class="card-content">
              <svg
                class="card-icon"
                viewBox="0 0 24 24"
                height="20"
                width="24"
                aria-hidden="true"
              >
                <use x="0" y="0" href="./img/icons.svg#icon-running"></use>
              </svg>
              <h3 class="title text-overflow">${X(r)}</h3>
            </div>
            <div class="card-footer">
              <ul class="card-footer_items">
                <li class="card-footer_item">Burned calories: <span class="strong text-overflow item-one">${s}</span></li>
                <li class="card-footer_item">Body Part: <span class="strong text-overflow item-two">${o}</span></li>
                <li class="card-footer_item">Target: <span class="strong text-overflow item-three">${a}</span></li>
              </ul>
            </div>
          </li>`}).join("")}const C=(t,e)=>{let r=new DocumentFragment;for(let s=0;s<t;s++){let o=document.createElement("p");o.setAttribute("data-index",s),o.innerHTML=s+1,o.classList.add("pagination-page"),s===e&&o.classList.add("selected"),r.appendChild(o)}return r},pe=()=>{document.querySelectorAll(".pagination").forEach(e=>{if(e.hasAttribute("data-total")){e.innerHTML="";const r=parseInt(e.getAttribute("data-total")),s=parseInt(e.getAttribute("data-current"));e.appendChild(C(r,s)),e.addEventListener("click",async a=>{a.target.classList.contains("pagination-page")&&(a.preventDefault(),e.querySelectorAll(".pagination-page").forEach(i=>{i.classList.remove("selected")}),a.target.classList.add("selected"),e.setAttribute("data-current",a.target.getAttribute("data-index")))}),new MutationObserver(a=>{for(let n of a)if(n.type==="attributes"&&n.attributeName==="data-total"){const i=parseInt(e.getAttribute("data-total")),c=parseInt(e.getAttribute("data-current"));e.innerHTML="",e.appendChild(C(i,c))}}).observe(e,{attributes:!0})}})};document.addEventListener("DOMContentLoaded",pe);function he(t){let e=JSON.parse(localStorage.getItem("favorites"))||[];e=e.filter(r=>r.id!==t),localStorage.setItem("favorites",JSON.stringify(e))}const f=class f{constructor(){if(f.instance)return f.instance;this.backdrop=document.querySelector("[data-modal]"),this.closeBtn=document.querySelector("[data-modal-close]"),this.isOpen=!1,this.isFavorite=!1,this.backdrop||console.error("Modal backdrop not found"),this.closeBtn||console.error("Modal close button not found"),this.ratingBackdrop=document.querySelector("[data-rating-modal]"),this.ratingCloseBtn=document.querySelector("[data-rating-close]"),this.ratingForm=document.querySelector(".rating-form"),this.bindEvents(),f.instance=this}bindEvents(){if(this.closeBtn&&this.closeBtn.addEventListener("click",()=>this.close()),this.backdrop&&this.backdrop.addEventListener("click",r=>{r.target===this.backdrop&&this.close()}),document.addEventListener("keydown",r=>{r.key==="Escape"&&this.isOpen&&this.close()}),this.backdrop){const r=this.backdrop.querySelector(".modal-favorites-btn");r&&r.addEventListener("click",()=>this.toggleFavorite())}const e=this.backdrop.querySelector(".modal-rating-btn");e&&e.addEventListener("click",()=>this.openRatingModal()),this.ratingCloseBtn&&this.ratingCloseBtn.addEventListener("click",()=>this.closeRatingModal()),this.ratingBackdrop&&this.ratingBackdrop.addEventListener("click",r=>{r.target===this.ratingBackdrop&&this.closeRatingModal()}),this.ratingForm&&this.ratingForm.addEventListener("submit",r=>this.handleRatingSubmit(r))}async open(e){this.isOpen=!0,this.currentExerciseId=e._id,this.backdrop&&this.backdrop.classList.remove("is-hidden"),document.body.style.overflow="hidden",await this.updateContent(e);const r=JSON.parse(localStorage.getItem("favorites"))||[];this.isFavorite=r.some(o=>o.id===this.currentExerciseId);const s=this.backdrop.querySelector(".modal-favorites-btn");this.isFavorite?(s.innerHTML=`
        Remove from favorites
        <svg class="modal-icon-heart">
          <use href="./img/icons.svg#icon-trash"></use>
        </svg>
      `,s.classList.add("is-favorite")):(s.innerHTML=`
        Add to favorites
        <svg class="modal-icon-heart">
          <use href="./img/icons.svg#icon-heart"></use>
        </svg>
      `,s.classList.remove("is-favorite"))}close(){this.isOpen=!1,this.backdrop&&this.backdrop.classList.add("is-hidden"),this.ratingBackdrop&&(this.ratingBackdrop.classList.add("is-hidden"),this.ratingForm&&this.ratingForm.reset()),document.onkeydown=this.originalEscapeHandler,document.body.style.overflow=""}async updateContent(e){const{_id:r,name:s,rating:o,target:a,bodyPart:n,equipment:i,popularity:c,burnedCalories:d,description:L,gifUrl:l,time:h=3}=e,y=this.backdrop.querySelector(".modal-title");y&&(y.textContent=X(s));const S=this.backdrop.querySelector(".modal-media-container");S&&l&&(S.innerHTML=`<img src="${l}" alt="${s}" />`);const g={Target:a,"Body Part":n,Equipment:i,Popular:c,"Burned Calories":`${d} / ${h} min`},v=this.backdrop.querySelector(".modal-parameters");v&&(v.innerHTML="",Object.entries(g).forEach(([re,oe])=>{const P=document.createElement("li");P.className="parameter-item",P.innerHTML=`
          <p class="modal-parameter-label">${re}</p>
          <p class="modal-parameter-value">${this.capitalizeFirstLetter(oe)}</p>
        `,v.appendChild(P)}));const D=this.backdrop.querySelector(".modal-description");D&&(D.textContent=this.capitalizeFirstLetter(L));const H=this.backdrop.querySelector(".rating-value");H&&(H.textContent=o)}capitalizeFirstLetter(e){return typeof e=="string"&&e.length>0?e.charAt(0).toUpperCase()+e.slice(1):e}toggleFavorite(){this.isFavorite=!this.isFavorite;const e=this.backdrop.querySelector(".modal-favorites-btn");this.isFavorite?(e.innerHTML=`
        Remove from favorites
        <svg class="modal-icon-heart">
          <use href="./img/icons.svg#icon-trash"></use>
        </svg>
      `,e.classList.add("is-favorite"),this.saveToFavorites()):(e.innerHTML=`
        Add to favorites
        <svg class="modal-icon-heart">
          <use href="./img/icons.svg#icon-heart"></use>
        </svg>
      `,e.classList.remove("is-favorite"),he(this.currentExerciseId)),e.style.transform="scale(0.95)",setTimeout(()=>{e.style.transform="scale(1)"},200)}saveToFavorites(){const e={id:this.currentExerciseId,name:this.backdrop.querySelector(".modal-title").textContent};let r=JSON.parse(localStorage.getItem("favorites"))||[];r.push(e),localStorage.setItem("favorites",JSON.stringify(r))}openRatingModal(){this.ratingBackdrop&&this.backdrop&&(this.backdrop.classList.add("is-hidden"),this.ratingBackdrop.classList.remove("is-hidden"),this.originalEscapeHandler=document.onkeydown,document.onkeydown=e=>{e.key==="Escape"&&this.closeRatingModal()})}closeRatingModal(){this.ratingBackdrop&&this.backdrop&&(this.ratingBackdrop.classList.add("is-hidden"),this.backdrop.classList.remove("is-hidden"),this.ratingForm&&this.ratingForm.reset(),document.onkeydown=this.originalEscapeHandler)}async handleRatingSubmit(e){e.preventDefault();const r=this.ratingForm.querySelector("#rating-email").value.trim(),s=this.ratingForm.querySelector("#rating-comment").value.trim();if(!r||!s){console.log("Please fill in all fields");return}this.closeRatingModal()}};_(f,"instance",null);let M=f,N=null;document.addEventListener("DOMContentLoaded",()=>{if(!N)try{N=new M}catch(t){console.error("Error initializing modal:",t)}});let z=document.querySelector(".workouts-container-list");const m=document.querySelector(".m-workouts .workouts-pagination");let k={bodypart:"",muscles:"",equipment:"",keyword:""};async function q(t="",e="",r="",s="",o=1,a=10){k={bodypart:t,muscles:e,equipment:r,keyword:s};try{const n=ue(t,e,r,s,o,a);console.log(`Request URL: ${n}`);const i=await fetch(n);if(!i.ok)throw new Error("Failed to fetch workouts");const c=await i.json();console.log("Received data:",c),z&&(z.innerHTML=fe(c.results));const d=document.querySelector(".workouts-container");d&&(d.style.display="flex"),c.totalPages&&c.totalPages>0&&ye(c.totalPages,o),document.querySelectorAll(".workout-start-btn").forEach(l=>{l.addEventListener("click",async h=>{h.preventDefault();const S=l.closest(".workouts-card").dataset.id;try{const g=await fetch(`${Y()}/${S}`);if(!g.ok)throw new Error("Failed to fetch exercise details");const v=await g.json();window.modalWindow||(window.modalWindow=new M),window.modalWindow.open(v)}catch(g){console.error("Error opening modal:",g)}})})}catch(n){console.error("Error loading workouts:",n)}}function ye(t,e){if(console.log("Setting up pagination:",{totalPages:t,currentPage:e}),!m){console.error("Pagination container not found");return}if(m.innerHTML="",m.style.display="flex",m.setAttribute("data-total",t),m.setAttribute("data-current",e-1),t>1){const r=C(t,e-1);m.appendChild(r),m.querySelectorAll(".pagination-page").forEach(s=>{s.addEventListener("click",o=>{o.preventDefault();const a=parseInt(s.getAttribute("data-index"))+1;console.log("Pagination clicked, page:",a),q(k.bodypart,k.muscles,k.equipment,k.keyword,a,10)})})}}async function Z(t="Muscles",e=1,r=12){r=window.innerWidth<=768?9:r;const{data:o}=await V.get(ce(),{params:{filter:t,page:e,limit:r}});return o}const B=document.querySelector(".selected-category"),ve=document.querySelector(".categories-list"),j=document.querySelectorAll(".filter-button"),w=document.querySelector("#search-form"),be=document.querySelector("#search-input");let ee="Muscles";j.forEach(t=>{t.addEventListener("click",async e=>{let r=e.target.getAttribute("data-filter").replace("-"," ");ee=r,await O(r),j.forEach(s=>s.classList.remove("active")),e.target.classList.add("active"),F(),$(!1)})});w==null||w.addEventListener("submit",async t=>{t.preventDefault(),be.value.trim(),B.textContent.trim().split(" / ")[1]});function $(t){t?w.style.display="none":w.style.display="block"}function ke(t){const e=t.currentTarget.dataset.name;F(e),B.textContent=` / <span class="breadcrumbs">${e}</span>`,ve.style.display="none",$(!0),Le()}function F(t=""){B.textContent=t?` / ${t}`:""}function we(){document.querySelectorAll(".categories-item").forEach(e=>{e.addEventListener("click",ke)})}document.addEventListener("DOMContentLoaded",async()=>{await O(ee),we(),$(!1)});async function Le(t,e=""){}let T=document.querySelector(".categories-list");document.querySelector(".workouts-container");const u=document.querySelector(".m-categories .categories-pagination");async function O(t){const e=document.querySelector(".m-categories");e&&(e.style.display="flex");try{const r=await Z(t);if(console.log("Categories data:",r),u&&(u.innerHTML="",r.totalPages>1)){u.style.display="flex",u.setAttribute("data-total",r.totalPages),u.setAttribute("data-current",0);const s=C(r.totalPages,0);u.appendChild(s),u.querySelectorAll(".pagination-page").forEach(o=>{o.addEventListener("click",Se)})}T&&(T.innerHTML=G(r.results),te())}catch(r){console.error("Error loading categories:",r)}}async function Se(t){t.preventDefault();const e=Number(t.target.dataset.index),r=e+1,s=document.querySelector(".filter-button.active"),o=s?s.dataset.filter.replace("-"," "):"";try{const a=await Z(o,r);T&&(T.innerHTML=G(a.results),te()),u&&(u.setAttribute("data-current",e),u.querySelectorAll(".pagination-page").forEach(n=>{n.classList.remove("selected")}),t.target.classList.add("selected"))}catch(a){console.error("Error handling pagination:",a)}}function te(){document.querySelectorAll(".categories-item").forEach(e=>{e.addEventListener("click",Ee)})}function Ee(t){t.preventDefault();const e=document.querySelector(".m-categories"),r=document.querySelector(".m-workouts");if(e&&r){e.style.display="none",r.style.display="flex";const s=t.target.closest(".categories-item");if(!s)return;const o=encodeURIComponent(s.dataset.name);F(o);const a=s.dataset.filter;switch(console.log(o),a){case"Muscles":q("",o,"","",1,10);break;case"Body parts":q(o,"","","",1,10);break;case"Equipment":q("","",o,"",1,10);break}}}document.addEventListener("DOMContentLoaded",()=>{O("Muscles")});const x=document.querySelector(".subscribe-form"),A=x.elements.email;let p={email:""};const R="subscribe-form-state",qe=()=>{localStorage.setItem(R,JSON.stringify(p))},Ce=()=>{const t=localStorage.getItem(R);t&&(p=JSON.parse(t),A.value=p.email||"")};Ce();x.addEventListener("input",t=>{const{name:e,value:r}=t.target;p[e]=r.trim(),qe()});x.addEventListener("submit",async t=>{if(t.preventDefault(),!A.validity.valid){alert("Please enter a valid email");return}p.email=A.value.trim();try{const e=await V.post(me(),p);e.data.error?e.status===409?alert("This email is already subscribed."):alert("Subscription failed. Please try again later."):alert("Subscription successful!")}catch(e){e.response&&e.response.status===409?alert("This email is already subscribed."):alert("Subscription failed. Please try again later.")}x.reset(),localStorage.removeItem(R)});window.openMenu=function(){document.getElementById("backdrop").classList.add("is-open")};window.closeMenu=function(){document.getElementById("backdrop").classList.remove("is-open")};window.menuLayoutClickHandler=function(e){e.stopPropagation()};const E=document.querySelector(".router");document.querySelector("body");let J=0;window.addEventListener("scroll",()=>{const t=document.documentElement.scrollTop;document.body.hasAttribute("data-user-scrolling")&&(E.classList.add("sticky"),t>0?t>J?E.classList.add("hidden"):E.classList.remove("hidden"):E.classList.remove("sticky"),J=t)});document.addEventListener("wheel",()=>{document.body.setAttribute("data-user-scrolling","true"),setTimeout(()=>{document.body.removeAttribute("data-user-scrolling")},100)});const W=localStorage.getItem("quote"),Me=localStorage.getItem("author");localStorage.getItem("quoteDate");const Q=document.querySelector(".favorites-card");W!==null&&(Q.children[1].innerHTML=W,Q.children[2].innerHTML=Me);function Te(){const t=["/","/favorites"];function e(){const a=window.location.pathname;t.includes(a)?r(a):(window.history.replaceState({},"","/"),r("/"))}function r(a){const n=document.querySelector(".home-page"),i=document.querySelector(".favorites-page");a==="/"?(n.classList.remove("hidden"),i.classList.add("hidden")):a==="/favorites"&&(n.classList.add("hidden"),i.classList.remove("hidden"))}const s=history.pushState;history.pushState=function(...a){s.apply(history,a),e()};const o=history.replaceState;history.replaceState=function(...a){o.apply(history,a),e()},window.addEventListener("popstate",e),e()}document.addEventListener("DOMContentLoaded",Te);const b=document.querySelector(".router");b.addEventListener("click",t=>{switch(t.target.innerHTML.toLowerCase()){case"home":b.children[0].classList.add("active"),b.children[1].classList.remove("active");break;case"favorites":b.children[0].classList.remove("active"),b.children[1].classList.add("active");break}});window.location.pathname.includes("task-management")&&K(()=>Promise.resolve({}),__vite__mapDeps([0]));async function xe(){if(!window.taskManager)try{const e=(await K(()=>import("./task-manager-M1fNHe4L.js"),[])).default;window.taskManager=new e,await new Promise(r=>setTimeout(r,200))}catch(t){return console.error("Error initializing TaskManager:",t),null}return window.taskManager}document.addEventListener("DOMContentLoaded",async()=>{try{if(window.location.pathname.includes("task-management")){await xe();const t=document.getElementById("addTaskBtn");t&&t.addEventListener("click",async e=>{e.preventDefault(),window.taskManager?window.taskManager.showModal():console.error("TaskManager not initialized")})}}catch(t){console.error("Error initializing task manager:",t)}});
//# sourceMappingURL=index-BTcGg_na.js.map
