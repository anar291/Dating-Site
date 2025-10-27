// script.js (This is the only code you need in this file)

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. MOBILE MENU LOGIC ---
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    // This 'if' check is a safety.
    // It only runs the menu code if it's on a page that HAS a mobile menu.
    // On login.html, it skips this block and doesn't cause an error.
    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', () => {
            // Toggles the 'hidden' class
            mobileMenu.classList.toggle('hidden');
        });
    }

    // --- 2. DARK MODE TOGGLE LOGIC ---
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement; // This is the <html> tag

    // Helper function to set the theme
    function setTheme(theme) {
        if (theme === 'dark') {
            htmlElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            htmlElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }

    // Check for a saved theme in localStorage.
    // If not found, check the user's system preference.
    const savedTheme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    // Apply the saved or preferred theme on page load
    setTheme(savedTheme);

    // This 'if' check is a safety.
    // It only runs if it's on a page that HAS a theme toggle button.
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            // Check current theme and toggle it
            const currentTheme = htmlElement.classList.contains('dark') ? 'light' : 'dark';
            setTheme(currentTheme);
        });
    }
});
