const p="1aad3d84ed2ee332d869dd74a8b19d64";class l{static show(t,s="success",e=null){const a=document.createElement("div");if(a.className=`notification ${s}`,a.style.cssText=`
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 4px;
            background: ${s==="success"?"#4CAF50":"#f44336"};
            color: white;
            z-index: 1000;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease;
            min-width: 200px;
            max-width: 400px;
        `,a.innerHTML=`
            <div class="notification-content" style="margin-bottom: ${e?"10px":"0"}">
                ${t}
            </div>
        `,e){const n=document.createElement("div");n.style.cssText=`
                display: flex;
                gap: 10px;
                margin-top: 10px;
            `,e.forEach(i=>{const o=document.createElement("button");o.textContent=i.text,o.style.cssText=`
                    padding: 5px 10px;
                    border: none;
                    border-radius: 3px;
                    background: rgba(255,255,255,0.2);
                    color: white;
                    cursor: pointer;
                    transition: background 0.2s;
                `,o.onmouseover=()=>{o.style.background="rgba(255,255,255,0.3)"},o.onmouseout=()=>{o.style.background="rgba(255,255,255,0.2)"},o.onclick=()=>{i.callback(),a.remove()},n.appendChild(o)}),a.appendChild(n)}else setTimeout(()=>{a.style.animation="slideOut 0.3s ease",setTimeout(()=>a.remove(),300)},7e3);if(document.body.appendChild(a),!document.getElementById("notification-styles")){const n=document.createElement("style");n.id="notification-styles",n.textContent=`
                @keyframes slideIn {
                    from { transform: translateX(120%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(120%); opacity: 0; }
                }
            `,document.head.appendChild(n)}return a}}class h{constructor(){this.tasks=[],this.currentTaskId=null,this.modalEscapeListener=null,this.loadTheme(),this.loadTasks().then(()=>{this.init()}),this.setupImageHandling()}async loadTasks(){try{const s=await(await fetch("https://script.google.com/macros/s/AKfycby-Fn7_OyTn4iv_LMUwO79-WoDiJoP457UvSrEh5UzlRwW9nKGfRGKkbnXNE3oorLvq/exec")).json();this.tasks=await Promise.all((s.tasks||[]).map(async e=>{if(e.imageId)try{e.imageUrl=`https://i.ibb.co/${e.imageId}/image.jpg`,console.log(`Image URL set for task ${e.id}:`,e.imageUrl)}catch(a){console.error(`Error setting image URL for task ${e.id}:`,a)}return e})),console.log("Loaded tasks with images:",this.tasks),this.renderTasks()}catch(t){console.error("Error loading tasks:",t),this.tasks=[]}}async saveTasks(t){try{console.log("Saving task:",t);const e={tasks:[{...t,assignees:t.assignees||["empty"],subtasks:t.subtasks||[],updatedAt:new Date().toISOString()}]};console.log("Sending payload:",e);const a=await fetch("https://script.google.com/macros/s/AKfycby-Fn7_OyTn4iv_LMUwO79-WoDiJoP457UvSrEh5UzlRwW9nKGfRGKkbnXNE3oorLvq/exec",{method:"POST",mode:"no-cors",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});return{success:!0}}catch(s){throw console.error("Error saving task:",s),s}}init(){this.setupEventListeners(),this.renderTasks(),this.setupDragAndDrop();const t=document.getElementById("testDriveBtn");t&&t.addEventListener("click",()=>this.testDriveAccess());const s=document.getElementById("testImageUploadBtn");s&&s.addEventListener("click",()=>{const e=document.createElement("input");e.type="file",e.accept="image/*",e.onchange=a=>{a.target.files.length>0&&this.testImageUpload(a.target.files[0])},e.click()})}setupEventListeners(){console.log("Setting up event listeners");const t=document.getElementById("addTaskBtn");console.log("Add button:",t),t.addEventListener("click",()=>{console.log("Add button clicked"),this.currentTaskId=null,this.showModal()}),document.querySelector(".close").addEventListener("click",()=>{this.hideModal()}),document.getElementById("taskForm").addEventListener("submit",e=>{e.preventDefault(),this.handleFormSubmit()}),document.getElementById("themeToggleBtn").addEventListener("click",()=>{this.toggleTheme()}),document.getElementById("taskNumber").addEventListener("input",e=>{this.handleTaskNumberInput(e.target.value)}),document.addEventListener("click",e=>{e.target.closest(".task-number-container")||(document.getElementById("taskNumberSuggestions").style.display="none")}),document.getElementById("addAssigneeBtn").addEventListener("click",()=>{this.addAssigneeField()}),document.getElementById("assigneesList").addEventListener("click",e=>{if(e.target.classList.contains("remove-assignee-btn")){const a=e.target.closest(".assignee-item");a&&document.querySelectorAll(".assignee-item").length>1&&a.remove()}}),document.getElementById("addSubtaskBtn").addEventListener("click",()=>{this.addSubtaskField()}),document.getElementById("subtasksList").addEventListener("click",e=>{e.target.classList.contains("remove-subtask-btn")&&e.target.closest(".subtask-item").remove()})}addAssigneeField(){document.getElementById("assigneesList").appendChild(this.createAssigneeItem("empty"))}addSubtaskField(t="",s=!1){const e=document.getElementById("subtasksList"),a=document.createElement("div");a.className="subtask-item",a.innerHTML=`
            <input type="checkbox" class="subtask-checkbox" ${s?"checked":""}>
            <input type="text" class="subtask-text" value="${t}" placeholder="Введите подзадачу">
            <button type="button" class="remove-subtask-btn">×</button>
        `,e.appendChild(a)}handleTaskNumberInput(t){const s=document.getElementById("taskNumberSuggestions"),e=document.getElementById("taskNumber");if(!t){e.classList.remove("exists","available"),s.style.display="none";return}const a=this.tasks.map(i=>i.taskNumber).filter(i=>i).sort((i,o)=>i-o),n=a.includes(t);if(e.classList.toggle("exists",n),e.classList.toggle("available",!n&&t.length>0),t.length>0){const i=a.filter(o=>o.toString().includes(t)).slice(0,5);i.length>0?(s.innerHTML=i.map(o=>`
                        <div class="suggestion-item" onclick="window.taskManager.selectTaskNumber('${o}')">
                            ${o}
                        </div>
                    `).join(""),s.style.display="block"):s.style.display="none"}else s.style.display="none"}selectTaskNumber(t){document.getElementById("taskNumber").value=t,document.getElementById("taskNumberSuggestions").style.display="none"}showModal(t=null){console.log("Opening modal for taskId:",t),console.log("All tasks:",this.tasks);const s=document.getElementById("taskModal"),e=document.getElementById("taskForm"),a=document.getElementById("assigneesList"),n=s.querySelector(".delete-task-btn"),i=document.getElementById("taskImagePreview");i.innerHTML="",n.style.display=t?"block":"none",a.innerHTML="";const o=document.getElementById("subtasksList");if(o.innerHTML="",t){const r=this.tasks.find(d=>String(d.id)===String(t));if(console.log("Found task:",r),r){if(e.taskTitle.value=r.title||"",e.taskNumber.value=r.taskNumber||"",e.taskDescription.value=r.description||"",e.taskCategory.value=r.category||"Must_Have",e.taskPriority.value=r.priorityStatus||"normal",e.taskStatus.value=r.progressStatus||"who-take",r.imageUrl){console.log("Rendering image preview:",r.imageUrl);const c=document.createElement("div");c.className="preview-container",c.style.cssText=`
                        width: 100%;
                        max-height: 200px;
                        overflow: hidden;
                        border-radius: 4px;
                        position: relative;
                        margin-top: 10px;
                    `;const m=document.createElement("img");m.src=r.imageUrl,m.style.cssText=`
                        width: 100%;
                        height: auto;
                        object-fit: contain;
                    `;const u=document.createElement("button");u.className="remove-image-btn",u.textContent="×",u.onclick=()=>{r.imageUrl=null,r.imageId=null,c.remove()},c.appendChild(m),c.appendChild(u),i.appendChild(c)}const d=Array.isArray(r.assignees)?r.assignees:[r.assignee||"empty"];console.log("Processing assignees:",d),d.forEach(c=>{const m=this.createAssigneeItem(c);a.appendChild(m)}),r.subtasks&&Array.isArray(r.subtasks)&&(console.log("Processing subtasks:",r.subtasks),r.subtasks.forEach(c=>{typeof c=="string"?this.addSubtaskField(c,!1):typeof c=="object"&&this.addSubtaskField(c.text,c.completed)})),this.currentTaskId=t}else console.error("Task not found:",t)}else e.reset(),e.taskCategory.value="Must_Have",a.appendChild(this.createAssigneeItem("empty"));s.style.display="block",n.onclick=()=>this.showDeleteConfirmation(t),this.modalEscapeListener=r=>{r.key==="Escape"&&this.hideModal()},document.addEventListener("keydown",this.modalEscapeListener),s.addEventListener("click",r=>{r.target===s&&this.hideModal()})}showDeleteConfirmation(t){const s=document.getElementById("deleteConfirmModal");s.style.display="block";const e=()=>{this.deleteTask(t),s.style.display="none",this.hideModal(),o()},a=()=>{s.style.display="none",o()},n=r=>{r.target===s&&(s.style.display="none",o())},i=r=>{r.key==="Escape"&&(s.style.display="none",o())},o=()=>{document.getElementById("confirmDelete").removeEventListener("click",e),document.getElementById("cancelDelete").removeEventListener("click",a),s.removeEventListener("click",n),document.removeEventListener("keydown",i)};document.getElementById("confirmDelete").addEventListener("click",e),document.getElementById("cancelDelete").addEventListener("click",a),s.addEventListener("click",n),document.addEventListener("keydown",i)}hideModal(){const t=document.getElementById("taskModal");t.style.display="none",this.modalEscapeListener&&(document.removeEventListener("keydown",this.modalEscapeListener),this.modalEscapeListener=null)}async handleFormSubmit(){try{const t=document.getElementById("taskForm"),s={title:t.taskTitle.value,taskNumber:t.taskNumber.value||null,description:t.taskDescription.value,category:t.taskCategory.value,priorityStatus:t.taskPriority.value,progressStatus:t.taskStatus.value,assignees:Array.from(t.querySelectorAll(".taskAssignee")).map(e=>e.value).filter(e=>e)||["empty"],subtasks:Array.from(t.querySelectorAll(".subtask-item")).map(e=>({id:Date.now()+Math.random().toString(36).substr(2,9),text:e.querySelector(".subtask-text").value,completed:e.querySelector(".subtask-checkbox").checked}))};if(this.currentImage)try{const e=await this.uploadImage(this.currentImage);e&&e.success&&(s.imageUrl=e.url,s.imageId=e.id)}catch(e){console.error("Error uploading image:",e),l.show("Ошибка при загрузке изображения","error")}this.hideModal(),this.currentTaskId?await this.updateTask(this.currentTaskId,s):await this.addTask(s),this.currentImage=null,document.getElementById("taskImagePreview").innerHTML=""}catch(t){console.error("Error in handleFormSubmit:",t),l.show("Произошла ошибка","error")}}async uploadImage(t){var s;try{console.log("Starting image upload to ImgBB...");const e=new FormData;e.append("image",t),e.append("key",p);const a=await fetch("https://api.imgbb.com/1/upload",{method:"POST",body:e});if(!a.ok)throw new Error(`Upload failed: ${a.statusText}`);const n=await a.json();if(console.log("ImgBB response:",n),n.success)return{success:!0,id:n.data.id,url:n.data.url,delete_url:n.data.delete_url,thumbnail:n.data.thumb.url};throw new Error(((s=n.error)==null?void 0:s.message)||"Upload failed")}catch(e){throw console.error("Error uploading to ImgBB:",e),e}}async testImageUpload(t){try{console.log("Starting test image upload...");const s=await this.uploadImage(t);return console.log("Test upload result:",s),l.show(`
                Изображение успешно загружено!<br>
                ID: ${s.id}<br>
                URL: <a href="${s.url}" target="_blank">Открыть изображение</a>
            `),s}catch(s){throw console.error("Test image upload failed:",s),l.show(`❌ Ошибка зарузки: ${s.message}`,"error"),s}}fileToBase64(t){return new Promise((s,e)=>{const a=new FileReader;a.onload=()=>s(a.result),a.onerror=n=>e(n),a.readAsDataURL(t)})}async addTask(t){try{const s=()=>{const n=Date.now(),i=Math.floor(Math.random()*1e4);return`${n}-${i}`};let e;do e=s();while(this.tasks.some(n=>n.id===e));const a={id:e,taskNumber:t.taskNumber||null,title:t.title,description:t.description,category:t.category||"Must_Have",priorityStatus:t.priorityStatus,progressStatus:t.progressStatus,assignees:t.assignees,subtasks:t.subtasks||[],createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};if(await this.saveTasks(a),this.currentImage)try{const n=await this.uploadImage(this.currentImage);n&&n.success&&(a.imageId=n.id,a.imageUrl=n.url,a.imageThumbnail=n.thumbnail)}catch(n){console.error("Error uploading image:",n),l.show("Ошибка при загрузке изображения","error")}this.tasks.push(a),this.renderTasks(),this.hideModal(),this.currentImage=null,document.getElementById("taskImagePreview").innerHTML="",l.show("Задача успешно создана")}catch(s){throw console.error("Error in addTask:",s),l.show("Ошибка при создании задачи","error"),s}}async updateTask(t,s){try{const e=this.tasks.findIndex(a=>String(a.id)===String(t));if(e!==-1){const n={...this.tasks[e],...s,updatedAt:new Date().toISOString()};if(this.currentImage)try{const o=await this.uploadImage(this.currentImage);o&&o.id&&(n.imageId=o.id)}catch(o){console.error("Error uploading image:",o),l.show("Ошибка при загрузке изображения","error")}const i=await fetch("https://script.google.com/macros/s/AKfycby-Fn7_OyTn4iv_LMUwO79-WoDiJoP457UvSrEh5UzlRwW9nKGfRGKkbnXNE3oorLvq/exec",{method:"POST",mode:"no-cors",headers:{"Content-Type":"application/json"},body:JSON.stringify({tasks:[n]})});this.tasks[e]=n,this.renderTasks(),this.currentImage=null,document.getElementById("taskImagePreview").innerHTML="",l.show("Задача успешно обновлена")}else throw new Error("Task not found: "+t)}catch(e){throw console.error("Error updating task:",e),e}}async deleteTaskOnServer(t){try{const s=await fetch("https://script.google.com/macros/s/AKfycby-Fn7_OyTn4iv_LMUwO79-WoDiJoP457UvSrEh5UzlRwW9nKGfRGKkbnXNE3oorLvq/exec",{method:"POST",mode:"no-cors",headers:{"Content-Type":"application/json"},body:JSON.stringify({tasks:[],action:"delete",taskId:t})});return{success:!0}}catch(s){throw console.error("Error in deleteTaskOnServer:",s),s}}async deleteTask(t){try{const s=this.tasks.find(a=>a.id===t);if(!s)throw new Error("Task not found");this.tasks=this.tasks.filter(a=>a.id!==t),this.renderTasks(),await this.deleteTaskOnServer(t);const e=s.title.length>15?s.title.substring(0,15)+"...":s.title;l.show(`Задача "${e}" удалена`),this.hideModal()}catch(s){console.error("Error deleting task:",s),l.show("Ошибка при удалении задачи","error"),task&&(this.tasks.push(task),this.renderTasks())}}renderTasks(){this.renderImagesGallery(),this.renderCompactGrid(),document.querySelectorAll(".drop-zone").forEach(e=>{e.innerHTML=""}),this.tasks.forEach(e=>{if(!e.assignees&&e.assignee&&(e.assignees=[e.assignee],delete e.assignee),e.assignees.some(n=>n!=="empty")){console.log("Rendering task with image:",e.imageUrl);const n=this.createTaskElement(e),i=document.querySelector(`.drop-zone[data-priority="${e.priorityStatus}"][data-status="${e.progressStatus}"]`);i&&i.appendChild(n)}});const t=document.querySelector(".must-have-grid");if(t){t.innerHTML="";const e=this.tasks.filter(n=>n.category==="Must_Have"),a=this.groupTasksByAssignee(e,!0);this.renderGroupedTasks(a,t)}const s=document.querySelector(".upgrade-grid");if(s){s.innerHTML="";const e=this.tasks.filter(n=>n.category==="Upgrade"),a=this.groupTasksByAssignee(e,!0);this.renderGroupedTasks(a,s)}}createTaskElement(t){var i;const s=document.createElement("div");s.className="task-card",s.draggable=!0,s.dataset.taskId=t.id;const e=(t.assignees||[t.assignee||"empty"]).filter(o=>o!=="empty"),a=t.taskNumber?`№ ${t.taskNumber}`:"№ ***",n=t.imageUrl?`
            <div class="task-image">
                <img src="${t.imageUrl}" alt="Task image" style="
                    max-width: 100%;
                    max-height: 150px;
                    object-fit: contain;
                    border-radius: 4px;
                    margin-top: 8px;
                ">
            </div>
        `:"";if(s.innerHTML=`
            <div class="task-card-header">
                <div class="task-left">
                    <h4 class="task-title">${t.title}</h4>
                    <div class="task-number">${a}</div>
                    <p class="task-description">${t.description}</p>
                    ${n}
                </div>
                <div class="task-right">
                    <div class="assignees-list">
                        ${e.map(o=>`
                            <div class="assignee-badge">${o}</div>
                        `).join("")}
                    </div>
                    <div class="task-status-badge">${t.progressStatus}</div>
                    <div class="category-badge" data-category="${t.category}">${t.category}</div>
                </div>
            </div>
        `,((i=t.subtasks)==null?void 0:i.length)>0){const o=t.subtasks.filter(d=>d.completed).length,r=t.subtasks.length;s.querySelector(".task-left").insertAdjacentHTML("beforeend",`
                <div class="subtasks-progress">
                    ${o}/${r}
                </div>
            `)}return s.addEventListener("click",()=>this.showModal(t.id)),s}setupDragAndDrop(){console.log("Setting up drag and drop"),document.addEventListener("dragstart",s=>{s.target.classList.contains("task-card")&&(s.target.classList.add("dragging"),s.dataTransfer.setData("text/plain",s.target.dataset.taskId))}),document.addEventListener("dragend",s=>{s.target.classList.contains("task-card")&&s.target.classList.remove("dragging")}),document.querySelectorAll(".drop-zone").forEach(s=>{s.addEventListener("dragover",e=>{e.preventDefault(),s.classList.add("dragover")}),s.addEventListener("dragleave",()=>{s.classList.remove("dragover")}),s.addEventListener("drop",async e=>{e.preventDefault(),s.classList.remove("dragover");const a=e.dataTransfer.getData("text/plain"),n=this.tasks.findIndex(i=>String(i.id)===String(a));if(n!==-1){const i=document.querySelector(`[data-task-id="${a}"]`);i&&s.appendChild(i);const o={...this.tasks[n],priorityStatus:s.dataset.priority,progressStatus:s.dataset.status,updatedAt:new Date().toISOString()};try{this.tasks[n]=o,await this.saveTasks(o);const r=o.title.length>15?o.title.substring(0,15)+"...":o.title,d=o.assignees.filter(c=>c!=="empty")[0]||"не назначен";l.show(`Задача "${r}" перемещена
Исполнитель: ${d}
Номер: ${o.taskNumber||"не присвоен"}`)}catch(r){console.error("Error saving task:",r),this.tasks[n]={...this.tasks[n]},this.renderTasks(),l.show("Ошибка при сохранении позиции","error")}}})})}loadTheme(){const t=localStorage.getItem("theme")||"dark";document.documentElement.setAttribute("data-theme",t)}toggleTheme(){const s=document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",s),localStorage.setItem("theme",s)}groupTasksByAssignee(t,s=!1){const e={};return t.forEach(a=>{(a.assignees||[a.assignee||"empty"]).forEach(i=>{(i!=="empty"||s)&&(e[i]||(e[i]=[]),e[i].includes(a)||e[i].push(a))})}),e}renderGroupedTasks(t,s){Object.entries(t).forEach(([e,a])=>{const n=document.createElement("div");n.className="task-assignee",n.innerHTML=`
                <div class="assignee-name ${e==="empty"?"empty-assignee":""}">
                    ${e}
                </div>
                ${a.map(o=>`
                    <div class="task-status" data-task-id="${o.id}">${o.progressStatus}</div>
                `).join("")}
            `,n.addEventListener("click",o=>{const r=o.target.dataset.taskId;r&&this.showModal(r)}),s.appendChild(n);const i=document.createElement("div");i.className="task-content",i.innerHTML=a.map(o=>`
                <div class="task-item" data-task-id="${o.id}">
                    <h4>${o.title}</h4>
                    <div class="task-assignees">
                        ${(o.assignees||[o.assignee||"empty"]).map(r=>`
                            <span class="assignee-badge">${r}</span>
                        `).join("")}
                    </div>
                    <p>${o.description}</p>
                    ${o.imageUrl?`
                        <div class="task-image">
                            <img src="${o.imageUrl}" alt="Task image" style="
                                max-width: 100%;
                                max-height: 150px;
                                object-fit: contain;
                                border-radius: 4px;
                                margin-top: 8px;
                            ">
                        </div>
                    `:""}
                </div>
            `).join(""),i.addEventListener("click",o=>{const r=o.target.closest(".task-item");if(r){const d=r.dataset.taskId;this.showModal(d)}}),s.appendChild(i)})}createAssigneeSelect(){return`
            <select class="taskAssignee" required>
                <option value="empty">Empty</option>
                <option value="Andrii Sushylnikov">Andrii Sushylnikov</option>
                <option value="Daria Honcharuk">Daria Honcharuk</option>
                <option value="Dmytro Mayevsky">Dmytro Mayevsky</option>
                <option value="Maks Ki">Maks Ki</option>
                <option value="Mariia Sv.">Mariia Sv.</option>
                <option value="Roman Turas">Roman Turas</option>
                <option value="Viktoriia Didenko">Viktoriia Didenko</option>
                <option value="Hryhorii Chernysh">Hryhorii Chernysh (Mentor)</option>
                <option value="Daria">Daria (client manager)</option>
                <option value="Lesya Katanova">Lesya Katanova</option>
                <option value="Olena Deineha">Olena Deineha</option>
            </select>
        `}createAssigneeItem(t="empty"){const s=document.createElement("div");return s.className="assignee-item",s.innerHTML=`
            ${this.createAssigneeSelect()}
            <button type="button" class="remove-assignee-btn">×</button>
        `,s.querySelector("select").value=t,s}setupImageHandling(){const t=document.getElementById("addImageBtn"),s=document.getElementById("taskImageInput"),e=document.getElementById("taskImagePreview");t.addEventListener("click",()=>{s.click()}),s.addEventListener("change",async a=>{const n=a.target.files[0];if(n)try{const i=await this.previewImage(n);e.innerHTML=`
                        <div class="preview-container">
                            <img src="${i}" alt="Preview">
                            <button class="remove-image-btn" onclick="taskManager.removeImage()">×</button>
                        </div>
                    `,this.currentImage=n}catch(i){console.error("Error previewing image:",i),l.show("Ошибка при загрузке изображения","error")}})}previewImage(t){return new Promise((s,e)=>{const a=new FileReader;a.onload=n=>s(n.target.result),a.onerror=e,a.readAsDataURL(t)})}removeImage(){const t=document.getElementById("taskImagePreview");t.innerHTML="",this.currentImage=null,document.getElementById("taskImageInput").value=""}renderImagesGallery(){const t=document.getElementById("taskImagesGrid");if(!t)return;t.innerHTML="",t.style.cssText=`
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            padding: 20px;
            width: 100%;
            max-width: calc(100% - 40px);
            margin: 0 auto 20px;
            background: var(--secondary-background);
            border-radius: 8px;
            overflow-x: auto;
        `;const s=this.tasks.filter(e=>e.imageUrl).map(e=>{var a;return{url:e.imageUrl,taskId:e.id,taskTitle:e.title,assignees:((a=e.assignees)==null?void 0:a.filter(n=>n!=="empty"))||[]}});s.forEach(e=>{const a=document.createElement("div");a.className="gallery-image-container",a.style.cssText=`
                flex: 0 0 120px;
                height: 160px;
                border-radius: 4px;
                cursor: pointer;
                position: relative;
                transition: transform 0.2s;
                background: rgba(0, 0, 0, 0.05);
                padding: 8px;
                display: flex;
                flex-direction: column;
            `;const n=e.taskTitle.length>15?e.taskTitle.substring(0,15)+"...":e.taskTitle,i=document.createElement("div");i.style.cssText=`
                text-align: center;
                font-size: 12px;
                font-weight: bold;
                margin-bottom: 4px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            `,i.textContent=n,i.title=e.taskTitle;const o=document.createElement("div");o.style.cssText=`
                flex: 1;
                overflow: hidden;
                border-radius: 4px;
                margin: 4px 0;
            `;const r=document.createElement("img");r.src=e.url,r.style.cssText=`
                width: 100%;
                height: 100%;
                object-fit: cover;
            `;const d=e.assignees.join(", "),c=d.length>25?d.substring(0,25)+"...":d,m=document.createElement("div");m.style.cssText=`
                text-align: right;
                font-size: 11px;
                color: var(--text-secondary);
                margin-top: 4px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            `,m.textContent=c||"Нет исполнителя",m.title=d,a.onmouseover=()=>{a.style.transform="scale(1.05)"},a.onmouseout=()=>{a.style.transform="scale(1)"},a.onclick=()=>this.showModal(e.taskId),o.appendChild(r),a.appendChild(i),a.appendChild(o),a.appendChild(m),t.appendChild(a)}),t.style.display=s.length?"flex":"none"}async testDriveAccess(){try{if((await fetch(`https://api.imgbb.com/1/upload?key=${p}`,{method:"GET"})).ok)return console.log("ImgBB connection OK"),!0;throw new Error("ImgBB connection failed")}catch(t){throw console.error("ImgBB test error:",t),t}}renderCompactGrid(){const t=document.getElementById("tasksCompactGrid");if(!t)return;t.innerHTML="";const s=[...this.tasks].sort((n,i)=>{const o=parseInt(n.taskNumber)||0,r=parseInt(i.taskNumber)||0;return o-r}),e=s.filter(n=>{var i;return(i=n.assignees)==null?void 0:i.some(o=>o!=="empty")}),a=s.filter(n=>{var i;return!((i=n.assignees)!=null&&i.some(o=>o!=="empty"))});e.forEach(n=>{const i=document.createElement("div");i.className="compact-task-item";const o=document.createElement("span");o.className="compact-task-number",o.textContent=n.taskNumber?`№${n.taskNumber}`:"№***";const r=document.createElement("span");r.className="compact-task-image-icon",r.textContent=n.imageUrl?"🖼️":"👽";const d=document.createElement("span");d.className="compact-task-title",d.textContent=n.title.length>15?n.title.substring(0,15)+"...":n.title,d.title=n.title;const c=document.createElement("span");c.className="compact-task-status",n.progressStatus==="done"?c.textContent="✅":c.textContent="🔨",i.appendChild(o),i.appendChild(r),i.appendChild(d),i.appendChild(c),i.addEventListener("click",()=>this.showModal(n.id)),t.appendChild(i)}),a.forEach(n=>{const i=document.createElement("div");i.className="compact-task-item empty-task";const o=document.createElement("span");o.className="compact-task-number",o.textContent=n.taskNumber?`№${n.taskNumber}`:"№***";const r=document.createElement("span");r.className="compact-task-image-icon",r.textContent=n.imageUrl?"🖼️":"👽";const d=document.createElement("span");d.className="compact-task-title",d.textContent=n.title.length>15?n.title.substring(0,15)+"...":n.title,d.title=n.title,i.appendChild(o),i.appendChild(r),i.appendChild(d),i.addEventListener("click",()=>this.showModal(n.id)),t.appendChild(i)})}}document.addEventListener("DOMContentLoaded",()=>{const g=document.getElementById("taskImagePreview"),t=document.getElementById("fullscreenImageContainer"),s=document.getElementById("fullscreenImage");g.addEventListener("click",e=>{e.target.tagName==="IMG"&&(s.src=e.target.src,t.style.display="flex")}),t.addEventListener("click",()=>{t.style.display="none"})});document.addEventListener("DOMContentLoaded",()=>{window.taskManager=new h});
//# sourceMappingURL=task-manager-M1fNHe4L.js.map
