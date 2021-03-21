(()=>{"use strict";var e={d:(t,n)=>{for(var o in n)e.o(n,o)&&!e.o(t,o)&&Object.defineProperty(t,o,{enumerable:!0,get:n[o]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t)};e.d({},{Q:()=>u});const t={events:{},on:function(e,t){this.events[e]=this.events[e]||[],this.events[e].push(t)},off:function(e,t){if(this.events[e])for(let n=0;n<this.events[e].length;n++)if(this.events[e][n]===t){this.events[e].splice(n,1);break}},emit:function(e,...t){this.events[e]&&this.events[e].forEach((function(e){e(...t)}))}},n=function(){let e=[];return t.on("completeStatusChanged",(function(t){e.forEach((e=>{e.title!==t||(e.isCompleted=!e.isCompleted)}))})),t.on("taskDeleted",(function(t,n){for(let o=0;o<e.length;o++)e[o].title===t&&e[o].dueDate===n&&e.splice(o,1)})),t.on("taskAdded",(function(t,n,o,r){e.push(function(e,t,n,o){return{title:e,dueDate:t,project:n=n||"Default",priority:o,isCompleted:!1}}(t,n,o,r))})),{getCurrentToDoList:function(){return e},sortList:function(){e.sort(((e,t)=>e.priority===t.priority?0:e.priority>t.priority?1:-1))},saveToDoList:function(){localStorage.setItem("to-do",JSON.stringify(e))},getToDoList:function(){localStorage.getItem("to-do")&&(e=JSON.parse(localStorage.getItem("to-do")))}}}();n.getToDoList();const o=function(){const e=document.querySelector(".add-task-form"),o=document.querySelector(".add-task"),r=document.querySelector(".cancel-task"),c=document.querySelector(".modal-bg"),i=document.querySelector(".to-do-items"),d=document.getElementById("task-title"),l=document.getElementById("task-due-date"),s=document.getElementById("task-project"),a=document.getElementById("task-priority");function m(){const e=u();[...i.children].forEach((e=>{e.classList.contains("to-do-item")&&i.removeChild(e)}));const o=n.getCurrentToDoList();n.sortList(),o.forEach((n=>{let o;o="none"===e[n.title],function(e,n){const o=document.createElement("div");o.classList="to-do-item",o.id=e.project,e.isCompleted&&o.classList.add("completed"),i.appendChild(o),n&&(o.style.display="none");const r=document.createElement("div");r.classList="priority-title",o.appendChild(r);const c=document.createElement("div");c.classList="to-do-item-priority to-do-item-complete",c.style.borderColor=e.isCompleted?"#ddd":`${function(e){let t;switch(e.priority.toString()){case"1":t="red";break;case"2":t="orange";break;case"3":t="yellow";break;case"4":t="green"}return t}(e)}`,c.addEventListener("click",(e=>{e.target.parentElement.parentElement.classList.toggle("completed"),t.emit("completeStatusChanged",e.target.nextSibling.innerText),m()})),r.appendChild(c);const d=document.createElement("div");d.classList="to-do-item-title",d.appendChild(document.createTextNode(e.title)),r.appendChild(d);const l=document.createElement("div");l.classList="duedate-deletebtn",o.appendChild(l);const s=document.createElement("div");s.classList="to-do-item-duedate",s.appendChild(document.createTextNode(e.dueDate)),l.appendChild(s);const a=document.createElement("button");a.classList="to-do-item-delete",a.appendChild(document.createTextNode("x")),a.addEventListener("click",(e=>{const n=e.target.parentElement.parentElement.firstElementChild.innerText,o=e.target.previousSibling.innerText;t.emit("taskDeleted",n,o),m()})),l.appendChild(a);const u=document.createElement("div");u.classList="completed-line",o.appendChild(u)}(n,o)})),n.saveToDoList()}const p=document.querySelector(".task-project");return t.on("projectsRendered",(e=>{p.innerHTML="",e.forEach((e=>{const t=e.projectName,n=document.createElement("option");n.value=t,n.appendChild(document.createTextNode(t)),p.appendChild(n)}))})),t.on("projectAdded",(e=>{const t=document.createElement("option");t.value=e,t.appendChild(document.createTextNode(e)),p.appendChild(t)})),t.on("projectDeleted",(e=>{[...p].forEach((t=>{t.value.toLowerCase()===e.toLowerCase()&&p.removeChild(t)}));const o=n.getCurrentToDoList();let r=o.length;for(;r--;)o[r].project.toLowerCase()===e.toLowerCase()&&(t.emit("taskDeleted",o[r].title,o[r].dueDate),m())})),o.addEventListener("click",(()=>{c.style.display="block"})),r.addEventListener("click",(()=>{c.style.display="none",e.reset()})),c.addEventListener("click",(t=>{t.target.classList.contains("modal-bg")&&(c.style.display="none",e.reset())})),e.addEventListener("submit",(n=>{t.emit("taskAdded",d.value,l.value,s.value,a.value),m(),n.preventDefault(),c.style.display="none",e.reset()})),document.body.onload=function(){e.reset()},{render:m}}(),r=function(){let e=[{projectName:"Default"}];return t.on("projectAdded",(function(t){e.push(function(e){return{projectName:e}}(t))})),t.on("projectDeleted",(function(t){for(let n=0;n<e.length;n++)if(e[n].projectName===t)return void e.splice(n,1)})),{getCurrentProjectList:function(){return e},saveProjectList:function(){localStorage.setItem("project-list",JSON.stringify(e))},getProjectList:function(){localStorage.getItem("project-list")&&(e=JSON.parse(localStorage.getItem("project-list")))}}}();r.getProjectList();const c=function(){const e=document.querySelector(".projects-list");function n(){[...e.children].forEach((t=>{t.classList.contains("project-div")&&e.removeChild(t)}));const o=r.getCurrentProjectList();o.forEach((o=>{!function(o){const r=document.createElement("div");r.classList="project-div",e.appendChild(r);const c=document.createElement("div");c.classList="project-name-counter",r.appendChild(c);const i=document.createElement("div");i.classList="project-name",i.appendChild(document.createTextNode(o.projectName)),i.addEventListener("click",(e=>{[...document.querySelectorAll(".to-do-item")].forEach((t=>{const n=e.target.innerText;t.id==n?t.style.display="flex":t.style.display="none"}))})),c.appendChild(i);const d=document.createElement("div");if(d.classList="counter project-counter",d.id=`${o.projectName.toLowerCase()}-project-counter`,d.appendChild(document.createTextNode("0")),c.appendChild(d),"default"!==o.projectName.toLowerCase()){const e=document.createElement("button");e.classList="project-delete",e.appendChild(document.createTextNode("x")),e.addEventListener("click",(e=>{t.emit("projectDeleted",e.target.previousElementSibling.firstElementChild.innerText),n()})),r.appendChild(e)}}(o)})),t.emit("projectsRendered",o),r.saveProjectList()}return document.querySelector(".projects-add").addEventListener("click",(()=>{const e=prompt("Enter name of project:");e&&(t.emit("projectAdded",e),n())})),{render:n}}(),i=function(){const e=document.querySelector("#home-div-counter"),o=document.querySelector("#today-div-counter");function r(){const t=n.getCurrentToDoList(),r=document.querySelectorAll(".project-counter"),c=t.reduce(((e,t)=>{let n=t.project.toLowerCase();return e.hasOwnProperty(n)?e[n]+=1:e[n]=1,e}),{});r.forEach((e=>{const t=e.id.split("-")[0],n=c[t]||0;e.innerText=n})),e.innerText=t.length;let i=(new Date).getDate();i<10&&(i=`0${i}`),o.innerText=t.reduce(((e,t)=>t.dueDate.slice(-2)==i?e+1:e+0),0)}return t.on("taskAdded",r),t.on("taskDeleted",r),t.on("projectsRendered",r),{incrementCounters:r}}(),d=new Date;let l=d.getFullYear(),s=d.getMonth()+1;s<10&&(s=`0${s}`);let a=d.getDate();function u(){let e=document.querySelectorAll(".to-do-item");const t={};return e.forEach((e=>{"none"==e.style.display?t[e.firstElementChild.lastElementChild.innerText]="none":t[e.firstElementChild.lastElementChild.innerText]="flex"})),t}a<10&&(a=`0${a}`),document.querySelector("#task-due-date").min=`${l}-${s}-${a}`,o.render(),c.render(),i.incrementCounters(),document.querySelector(".home-div-name").addEventListener("click",(()=>{[...document.querySelectorAll(".to-do-item")].forEach((e=>{e.style.display="flex"}))})),document.querySelector(".today-div-name").addEventListener("click",(()=>{[...document.querySelectorAll(".to-do-item")].forEach((e=>{let t=(new Date).getDate();t<10&&(t=`0${t}`);let n=e.firstElementChild.nextElementSibling.firstElementChild.innerText.slice(-2);e.style.display=n==t?"flex":"none"}))})),document.querySelector(".this-week-div-name").addEventListener("click",(()=>{}))})();