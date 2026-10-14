const members = [
  {name:"ANTU NANDY", age:"19", dept:"CSE", university:"CUET", image:"antu.jpg", tagline:"The principled dreamer", bio:"A CUET CSE student who believes in honesty, self-respect, and building something meaningful one small step at a time. Equal parts ambition, curiosity, and determination."},
  {name:"EMON MALLICK", age:"19", dept:"MIE", university:"CUET", image:"emon.jpg", tagline:"The unpredictable spark", bio:"A member of the crew known for bringing his own energy to the group. Every team needs a little unpredictability to keep the story interesting."},
  {name:"SOURAV DATTA", age:"19", dept:"PME", university:"CUET", image:"sourav.jpg", tagline:"The steady worker", bio:"Hard-working and focused, Sourav keeps moving forward even when the workload feels endless. Consistency is his quiet superpower."},
  {name:"SUDEEP DATTA", age:"19", dept:"IPE", university:"KUET", image:"sudeep.jpg", tagline:"The networker", bio:"A connector who builds friendships beyond his immediate circle. Sudeep brings curiosity and a wider-world perspective to the crew."},
  {name:"ANIRUDDHA DHAR", age:"19", dept:"CSE", university:"CUET", image:"aniruddha.jpeg", tagline:"The future strategist", bio:"A forward-thinker with an eye on what comes next. Aniruddha is always considering possibilities and planning the next move."}
];
const grid = document.getElementById("crewGrid");
const fallbackAvatar = (name) => `<span class="photo-fallback">${name.split(" ").map(p=>p[0]).join("")}</span>`;
function photoMarkup(member, cls="") { return `<div class="member-photo ${cls}">${fallbackAvatar(member.name)}<img src="${member.image}" alt="Photo of ${member.name}" onerror="this.style.display='none'"></div>`; }
grid.innerHTML = members.map(m=>`<article class="member-card" tabindex="0" role="button" aria-label="View ${m.name}'s profile" data-member="${m.name}">${photoMarkup(m)}<div class="card-meta"><span class="member-dept">${m.dept} · ${m.university}</span><span class="member-arrow">↗</span></div><h3>${m.name}</h3><p>${m.tagline}</p><div class="member-university">${m.university} · AGE ${m.age}</div></article>`).join("");
const loginModal = document.getElementById("loginModal");
const profileModal = document.getElementById("profileModal");
let currentMember = null;
const VAULT_PREFIX = "de-vault-v1:";
const THOUGHTS_KEY = "de-thoughts-v1";
const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
function showModal(modal){modal.classList.add("show");modal.setAttribute("aria-hidden","false")}
function hideModal(modal){modal.classList.remove("show");modal.setAttribute("aria-hidden","true")}
function showProfile(member, loggedIn=false){
  const content=document.getElementById("profileContent");
  content.innerHTML=`<div class="eyebrow">${loggedIn ? "NAME CHECK PASSED · DEMO ACCESS" : "CREW PROFILE"}</div><div class="profile-top"><img class="profile-photo" src="${member.image}" alt="Photo of ${member.name}" onerror="this.style.display='none'"><div><h2 id="profileName">${member.name}</h2><div class="profile-badge">${member.tagline.toUpperCase()}</div></div></div><p class="profile-bio">${member.bio}</p><div class="profile-facts"><div class="profile-fact"><span>DEPARTMENT</span><strong>${member.dept}</strong></div><div class="profile-fact"><span>UNIVERSITY</span><strong>${member.university}</strong></div><div class="profile-fact"><span>AGE</span><strong>${member.age}</strong></div><div class="profile-fact"><span>STATUS</span><strong>In the orbit ✦</strong></div></div><p>Choose a branch below to continue.</p><div class="workspace-actions"><button class="primary-btn" type="button" id="goVault">My Crew Vault ↗</button><button class="secondary-btn" type="button" id="goThoughts">Crew Thoughts ↗</button></div><small>Demo only: entering a name is not secure login or identity verification.</small>`;
  showModal(profileModal);
  document.getElementById("goVault").addEventListener("click",()=>{hideModal(profileModal);openVault(member);location.hash="vault"});
  document.getElementById("goThoughts").addEventListener("click",()=>{hideModal(profileModal);openThoughts(member);location.hash="thoughts"});
}
function openLogin(){document.getElementById("loginError").textContent="";document.getElementById("memberName").value="";showModal(loginModal);setTimeout(()=>document.getElementById("memberName").focus(),100)}
document.getElementById("openLogin").addEventListener("click",openLogin);
document.getElementById("vaultLoginBtn").addEventListener("click",openLogin);
document.getElementById("thoughtLoginBtn").addEventListener("click",openLogin);
document.getElementById("closeLogin").addEventListener("click",()=>hideModal(loginModal));
document.getElementById("closeProfile").addEventListener("click",()=>hideModal(profileModal));
document.querySelectorAll(".modal-backdrop").forEach(backdrop=>backdrop.addEventListener("click",e=>{if(e.target===backdrop)hideModal(backdrop)}));
document.addEventListener("keydown",e=>{if(e.key==="Escape"){hideModal(loginModal);hideModal(profileModal)}});
grid.addEventListener("click",e=>{const card=e.target.closest("[data-member]");if(card){const member=members.find(m=>m.name===card.dataset.member);if(member)showProfile(member)}});
grid.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.matches("[data-member]")){e.preventDefault();const member=members.find(m=>m.name===e.target.dataset.member);if(member)showProfile(member)}});
document.getElementById("loginForm").addEventListener("submit",e=>{e.preventDefault();const entered=document.getElementById("memberName").value.trim().replace(/\s+/g," ").toUpperCase();const member=members.find(m=>m.name===entered);const error=document.getElementById("loginError");if(!member){error.textContent="Name not found. Use a crew member's full name in CAPITAL LETTERS.";return}currentMember=member;hideModal(loginModal);syncWorkspace();showProfile(member,true)});

// Personal notes: local browser storage only. This is NOT private or secure storage.
const vaultForm=document.getElementById("vaultForm");
const vaultLocked=document.getElementById("vaultLocked");
function vaultKey(member){return VAULT_PREFIX+member.name;}
function openVault(member){currentMember=member;syncWorkspace();vaultForm.scrollIntoView({behavior:"smooth",block:"center"})}
function openThoughts(member){currentMember=member;syncWorkspace();document.getElementById("thoughtForm").scrollIntoView({behavior:"smooth",block:"center"})}
function syncWorkspace(){
  vaultLocked.hidden=!!currentMember;vaultForm.hidden=!currentMember;
  document.getElementById("thoughtComposerLocked").hidden=!!currentMember;document.getElementById("thoughtForm").hidden=!currentMember;
  if(currentMember){document.getElementById("vaultMemberTitle").textContent=currentMember.name+" · Personal notes";document.getElementById("thoughtAuthor").textContent=currentMember.name;const saved=readVault(currentMember);[...vaultForm.elements].forEach(el=>{if(el.name)el.value=saved[el.name]||""});document.getElementById("vaultSaveState").textContent="Stored in this browser";}
  renderThoughts();
}
function readVault(member){try{return JSON.parse(localStorage.getItem(vaultKey(member))||"{}")}catch{return {}}}
vaultForm.addEventListener("submit",e=>{e.preventDefault();if(!currentMember)return;const data={};[...vaultForm.elements].forEach(el=>{if(el.name)data[el.name]=el.value.trim()});try{localStorage.setItem(vaultKey(currentMember),JSON.stringify(data));document.getElementById("vaultSaveState").textContent="Saved ✓"}catch{document.getElementById("vaultSaveState").textContent="Could not save"}});
document.getElementById("clearVault").addEventListener("click",()=>{if(!currentMember)return;if(!confirm("Clear this member's saved notes from this browser?"))return;localStorage.removeItem(vaultKey(currentMember));vaultForm.reset();document.getElementById("vaultSaveState").textContent="Cleared"});

// Thoughts feed: local browser storage only; posts do not sync across devices.
const thoughtForm=document.getElementById("thoughtForm");
const thoughtText=document.getElementById("thoughtText");
function wordCount(text){return text.trim()?text.trim().split(/\s+/).length:0;}
function readThoughts(){try{const data=JSON.parse(localStorage.getItem(THOUGHTS_KEY)||"[]");return Array.isArray(data)?data:[]}catch{return []}}
thoughtText.addEventListener("input",()=>{document.getElementById("wordCount").textContent=`${wordCount(thoughtText.value)} / 300 words`;document.getElementById("thoughtError").textContent=""});
thoughtForm.addEventListener("submit",e=>{e.preventDefault();if(!currentMember)return;const text=thoughtText.value.trim();const words=wordCount(text);const error=document.getElementById("thoughtError");if(!text){error.textContent="Write something before publishing.";return}if(words>300){error.textContent=`Your post has ${words} words. Please keep it within 300 words.`;return}const posts=readThoughts();posts.unshift({id:Date.now().toString(36)+Math.random().toString(36).slice(2,7),author:currentMember.name,text,createdAt:new Date().toISOString()});try{localStorage.setItem(THOUGHTS_KEY,JSON.stringify(posts));thoughtText.value="";document.getElementById("wordCount").textContent="0 / 300 words";error.textContent="Published in this browser ✓";renderThoughts()}catch{error.textContent="Could not save this post in browser storage."}});
function renderThoughts(){const feed=document.getElementById("thoughtFeed");const posts=readThoughts();if(!posts.length){feed.innerHTML='<div class="thought-empty">No thoughts yet. Be the first to share an idea ✦</div>';return}feed.innerHTML=posts.map(post=>{const date=new Date(post.createdAt);const when=Number.isNaN(date.getTime())?"":date.toLocaleString();const canDelete=currentMember&&currentMember.name===post.author;return `<article class="thought-card"><div class="thought-card-head"><span class="thought-author">✦ ${esc(post.author)}</span><span class="thought-date">${esc(when)}</span></div><p class="thought-body">${esc(post.text)}</p>${canDelete?`<button class="thought-delete" type="button" data-delete-thought="${esc(post.id)}">Delete my post</button>`:""}</article>`}).join("")}
document.getElementById("thoughtFeed").addEventListener("click",e=>{const button=e.target.closest("[data-delete-thought]");if(!button||!currentMember)return;const posts=readThoughts();const target=posts.find(p=>p.id===button.dataset.deleteThought);if(!target||target.author!==currentMember.name)return;if(!confirm("Delete this post?"))return;localStorage.setItem(THOUGHTS_KEY,JSON.stringify(posts.filter(p=>p.id!==target.id)));renderThoughts()});
syncWorkspace();

// Background Music Controller
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");

if (bgMusic && musicToggle) {
    musicToggle.addEventListener("click", async () => {
        if (bgMusic.paused) {
            try {
                await bgMusic.play();
                musicToggle.textContent = "🔇 Pause Music";
            } catch (error) {
                musicToggle.textContent = "⚠️ Music unavailable";
                console.error("Music playback failed:", error);
            }
        } else {
            bgMusic.pause();
            musicToggle.textContent = "🎵 Play Music";
        }
    });

    bgMusic.addEventListener("ended", () => {
        musicToggle.textContent = "🎵 Play Music";
    });
}