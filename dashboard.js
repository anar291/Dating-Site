const availableUsers = [
    { id: 1, name: 'Priya', age: 24, bio: 'Developer & Chai Lover ☕', distance: '2 km away', img: 'https://images.unsplash.com/photo-1599423652399-2b346ab73c0a?auto=format&fit=crop&w=600&h=800' },
    { id: 2, name: 'Rohan', age: 26, bio: 'Hiker 🏔️', distance: '5 km away', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&h=800' },
    { id: 3, name: 'Aisha', age: 22, bio: 'Designer 🎨', distance: '12 km away', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&h=800' }
];
let notifications = [{ id: 1, type: 'system', text: 'Welcome to Courting!', time: 'Just now', read: false }];

function initDashboard() {
    const user = db.getCurrentUser();
    if (!user) return; // Handled by auth.js
    updateUI();
    createCard(availableUsers[0]);
    renderNotifications();
}

function updateUI() {
    const user = db.getCurrentUser();
    document.getElementById('sidebar-name').innerText = user.name;
    document.getElementById('sidebar-avatar').src = user.img;
    const mobileImg = document.getElementById('mobile-header-avatar');
    if(mobileImg) mobileImg.src = user.img;
}

// --- Profile ---
const modal = document.getElementById('profile-modal');
window.openProfile = function() {
    const user = db.getCurrentUser();
    document.getElementById('modal-name').innerText = user.name;
    document.getElementById('modal-avatar').src = user.img;
    document.getElementById('modal-job').querySelector('span').innerText = user.job;
    document.getElementById('modal-bio').innerText = user.bio;
    
    document.getElementById('input-name').value = user.name;
    document.getElementById('input-job').value = user.job;
    document.getElementById('input-bio').value = user.bio;
    
    const tags = document.getElementById('modal-tags');
    tags.innerHTML = user.interests.map(t => `<span class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">${t}</span>`).join('');

    toggleEdit(false);
    document.getElementById('edit-btn').classList.remove('hidden');
    document.getElementById('save-btn').classList.add('hidden');
    modal.classList.remove('hidden');
    setTimeout(() => { modal.classList.remove('opacity-0'); document.getElementById('profile-modal-content').classList.add('scale-100'); }, 10);
};

window.closeProfile = function() {
    modal.classList.add('opacity-0');
    setTimeout(() => modal.classList.add('hidden'), 300);
};

window.enableEditMode = function() {
    document.getElementById('edit-btn').classList.add('hidden');
    document.getElementById('save-btn').classList.remove('hidden');
    toggleEdit(true);
};

window.saveProfileChanges = function() {
    db.updateUser({
        name: document.getElementById('input-name').value,
        job: document.getElementById('input-job').value,
        bio: document.getElementById('input-bio').value
    });
    updateUI();
    openProfile();
};

function toggleEdit(edit) {
    ['name', 'job', 'bio'].forEach(f => {
        document.getElementById(`modal-${f}`).classList.toggle('hidden', edit);
        document.getElementById(`input-${f}`).classList.toggle('hidden', !edit);
    });
}

document.getElementById('avatar-upload').addEventListener('change', (e) => {
    const r = new FileReader();
    r.onload = (ev) => { db.updateUser({img: ev.target.result}); updateUI(); document.getElementById('modal-avatar').src = ev.target.result; };
    if(e.target.files[0]) r.readAsDataURL(e.target.files[0]);
});

// --- Notifications ---
window.toggleNotifications = function() {
    const drop = document.getElementById('notif-dropdown');
    drop.classList.toggle('hidden');
    if(!drop.classList.contains('hidden')) document.getElementById('notif-badge').classList.add('hidden');
}

function renderNotifications() {
    const list = document.getElementById('notif-list');
    if(notifications.length === 0) { list.innerHTML = '<p class="text-xs text-gray-400 text-center">Empty</p>'; return; }
    list.innerHTML = notifications.map(n => `<div class="p-2 bg-gray-50 rounded mb-1 text-sm">${n.text}</div>`).join('');
    document.getElementById('notif-badge').classList.remove('hidden');
}

// --- Cards ---
let cardIdx = 0;
function createCard(user) {
    const con = document.getElementById('card-container');
    con.innerHTML = '';
    const card = document.createElement('div');
    card.className = "tilt-card absolute inset-0 w-full h-full rounded-[2rem] overflow-hidden shadow-2xl bg-gray-200 hover-trigger";
    card.innerHTML = `<div class="tilt-content absolute inset-0"><img src="${user.img}" class="w-full h-full object-cover"><div class="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div><div class="absolute bottom-0 p-8 text-white"><h2 class="text-4xl font-bold">${user.name}, ${user.age}</h2><p>${user.distance}</p></div></div>`;
    con.appendChild(card);
    card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        card.style.transform = `perspective(1000px) rotateX(${(e.clientY - r.top - r.height/2)/-20}deg) rotateY(${(e.clientX - r.left - r.width/2)/20}deg)`;
    });
    card.addEventListener('mouseleave', () => card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`);
}

document.getElementById('like-btn').addEventListener('click', () => {
    if(cardIdx < availableUsers.length) {
        db.addMatch(availableUsers[cardIdx]);
        notifications.unshift({id: Date.now(), text: `Matched with ${availableUsers[cardIdx].name}!`});
        renderNotifications();
        cardIdx++;
        if(cardIdx < availableUsers.length) createCard(availableUsers[cardIdx]);
        else document.getElementById('card-container').innerHTML = '<div class="text-center mt-20 text-gray-500">No more profiles!</div>';
    }
});
document.getElementById('dislike-btn').addEventListener('click', () => {
    cardIdx++;
    if(cardIdx < availableUsers.length) createCard(availableUsers[cardIdx]);
    else document.getElementById('card-container').innerHTML = '<div class="text-center mt-20 text-gray-500">No more profiles!</div>';
});

// --- Nav ---
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.view-section').forEach(v => v.classList.add('hidden'));
        document.getElementById(btn.id.replace('nav-', 'view-')).classList.remove('hidden');
        
        document.querySelectorAll('.nav-btn').forEach(b => { b.classList.remove('bg-pink-50', 'text-pink-600'); b.classList.add('text-gray-500'); b.querySelector('i').classList.replace('ph-fill', 'ph-bold'); });
        btn.classList.add('bg-pink-50', 'text-pink-600'); btn.classList.remove('text-gray-500'); btn.querySelector('i').classList.replace('ph-bold', 'ph-fill');

        if(btn.id === 'nav-matches') renderMatches();
        if(btn.id === 'nav-messages') renderChatList();
    });
});

function renderMatches() {
    const m = db.getMatches();
    document.getElementById('matches-grid').innerHTML = m.length ? m.map(u => `<div onclick="openChat(${u.id})" class="rounded-xl overflow-hidden shadow-lg cursor-pointer hover-trigger"><img src="${u.img}" class="w-full h-48 object-cover"><div class="p-2 font-bold">${u.name}</div></div>`).join('') : 'No matches yet';
}

let activeChat = null;
function renderChatList() {
    const m = db.getMatches();
    document.getElementById('chat-list').innerHTML = m.length ? m.map(u => `<div onclick="openChat(${u.id})" class="flex gap-2 p-2 hover:bg-white/50 rounded cursor-pointer hover-trigger"><img src="${u.img}" class="w-10 h-10 rounded-full"><div class="font-bold">${u.name}</div></div>`).join('') : 'No matches';
}

window.openChat = function(id) {
    document.getElementById('nav-messages').click();
    activeChat = id;
    const user = db.getMatches().find(u => u.id === id);
    document.getElementById('chat-window').classList.remove('hidden');
    document.getElementById('chat-name').innerText = user.name;
    document.getElementById('chat-avatar').src = user.img;
    document.getElementById('chat-avatar').classList.remove('hidden');
    document.getElementById('message-input').disabled = false;
    document.getElementById('send-btn').disabled = false;
    renderMessages();
}

function renderMessages() {
    const msgs = db.getMessages(activeChat);
    document.getElementById('messages-area').innerHTML = msgs.map(m => `<div class="flex w-full ${m.isMe ? 'justify-end' : 'justify-start'}"><div class="px-3 py-1 rounded-lg text-sm mb-1 ${m.isMe ? 'bg-pink-500 text-white' : 'bg-white text-black'}">${m.text}</div></div>`).join('');
}

document.getElementById('send-btn').addEventListener('click', () => {
    const inp = document.getElementById('message-input');
    if(inp.value && activeChat) {
        db.saveMessage(activeChat, inp.value, true);
        inp.value = '';
        renderMessages();
        setTimeout(() => { db.saveMessage(activeChat, "Hey there!", false); renderMessages(); }, 1000);
    }
});

initDashboard();
