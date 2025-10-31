// --- 1. FAKE USER DATA ---
const users = [
    {
        name: 'Priya',
        age: 24,
        bio: 'Loves coding and chai.',
        imageUrl: 'https://images.unsplash.com/photo-1599423652399-2b346ab73c0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=400&h=600'
    },
    {
        name: 'Rohan',
        age: 26,
        bio: 'Weekend hiker and aspiring chef.',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=400&h=600'
    },
    {
        name: 'Aisha',
        age: 22,
        bio: 'Graphic designer. Thinks pineapple belongs on pizza.',
        imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=400&h=600'
    },
    {
        name: 'Karan',
        age: 27,
        bio: 'Gym, movies, and my dog. What else is there?',
        imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=400&h=600'
    }
];

// --- 2. VARIABLES ---
let currentUserIndex = 0;
const cardContainer = document.getElementById('card-container');
const likeBtn = document.getElementById('like-btn');
const dislikeBtn = document.getElementById('dislike-btn');

// --- 3. FUNCTIONS ---
function createProfileCard(user) {
    cardContainer.innerHTML = ''; // Clear old card

    const card = document.createElement('div');
    card.className = "pop-in absolute w-full h-full bg-cover bg-center rounded-2xl shadow-lg overflow-hidden";
    card.style.backgroundImage = `url(${user.imageUrl})`;

    const info = document.createElement('div');
    info.className = "absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent text-white";
    info.innerHTML = `
        <h2 class="text-3xl font-bold">${user.name}, ${user.age}</h2>
        <p class="text-lg mt-1">${user.bio}</p>
    `;

    card.appendChild(info);
    cardContainer.appendChild(card);
}

function showNextUser() {
    currentUserIndex++;
    
    if (currentUserIndex >= users.length) {
        cardContainer.innerHTML = `
            <div class="flex flex-col items-center justify-center w-full h-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
                <h2 class="text-2xl font-bold mb-2 dark:text-white">No more profiles nearby!</h2>
                <p class="text-gray-600 dark:text-gray-400">Check back later.</p>
            </div>
        `;
        likeBtn.disabled = true;
        dislikeBtn.disabled = true;
    } else {
        createProfileCard(users[currentUserIndex]);
    }
}

// --- 4. EVENT LISTENERS ---
likeBtn.addEventListener('click', () => {
    console.log('User Liked:', users[currentUserIndex].name);
    showNextUser();
});

dislikeBtn.addEventListener('click', () => {
    console.log('User Disliked:', users[currentUserIndex].name);
    showNextUser();
});

// --- 5. INITIAL LOAD ---
createProfileCard(users[currentUserIndex]);

// --- DARK MODE TOGGLE LOGIC ---
const themeToggle = document.getElementById('theme-toggle');
const lightIcon = document.getElementById('theme-icon-light');
const darkIcon = document.getElementById('theme-icon-dark');

if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    if (lightIcon) lightIcon.style.display = 'block';
    if (darkIcon) darkIcon.style.display = 'none';
} else {
    document.documentElement.classList.remove('dark');
    if (lightIcon) lightIcon.style.display = 'none';
    if (darkIcon) darkIcon.style.display = 'block';
}

themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    if (document.documentElement.classList.contains('dark')) {
        localStorage.theme = 'dark';
        if (lightIcon) lightIcon.style.display = 'block';
        if (darkIcon) darkIcon.style.display = 'none';
    } else {
        localStorage.theme = 'light';
        if (lightIcon) lightIcon.style.display = 'none';
        if (darkIcon) darkIcon.style.display = 'block';
    }
});