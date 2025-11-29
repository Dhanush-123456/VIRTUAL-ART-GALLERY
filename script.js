// Hamburger Menu Toggle
const hamburgerBtn = document.getElementById('hamburger-menu');
let isOpen = false;

hamburgerBtn.addEventListener('click', () => {
    isOpen = !isOpen;
    const spans = hamburgerBtn.querySelectorAll('span');

    if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Cookie Consent
const cookieBar = document.getElementById('cookie-consent');
const acceptBtn = document.getElementById('accept-cookies');

acceptBtn.addEventListener('click', () => {
    cookieBar.style.display = 'none';
});

// Check if cookies already accepted
if (localStorage.getItem('cookiesAccepted')) {
    cookieBar.style.display = 'none';
} else {
    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieBar.style.display = 'none';
    });
}