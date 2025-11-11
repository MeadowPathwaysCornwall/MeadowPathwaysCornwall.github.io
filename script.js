// ===========================
// Navigation Active State
// ===========================
document.addEventListener('DOMContentLoaded', function () {
    const tabs = document.querySelectorAll('.side-nav a');
    tabs.forEach(tab => {
        if (tab.href === window.location.href) {
            tab.classList.add('active');
        }
    });
});

// ===========================
// Carousel Auto-scroll
// ===========================
const carouselContainers = document.querySelectorAll('.carousel-container');

carouselContainers.forEach(container => {
    const slides = container.querySelectorAll('.carousel-slides img');
    let index = 0;

    setInterval(() => {
        slides.forEach((slide, i) => {
            slide.style.display = (i === index) ? 'block' : 'none';
        });
        index = (index + 1) % slides.length;
    }, 3000); // change slide every 3 seconds
});

// ===========================
// Staff Page Password Protection
// ===========================
const staffPage = document.querySelector('.staff-container');
if (staffPage) {
    const password = 'staff123'; // Set your staff password here
    const userPass = prompt('Enter staff password to access this page:');
    if (userPass !== password) {
        alert('Incorrect password. Redirecting to homepage.');
        window.location.href = 'index.html';
    }
}

// ===========================
// Smooth Scroll for Anchor Links
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===========================
// Pill/Tab Hover Effects
// ===========================
const pills = document.querySelectorAll('.pill, .tab');
pills.forEach(pill => {
    pill.addEventListener('mouseenter', () => {
        pill.style.transform = 'scale(1.05)';
        pill.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
    });
    pill.addEventListener('mouseleave', () => {
        pill.style.transform = 'scale(1)';
        pill.style.boxShadow = 'none';
    });
});

// ===========================
// Footer and Header BG Fix
// ===========================
const headerSections = document.querySelectorAll('.header-section');
headerSections.forEach(header => {
    header.style.background = "url('BG.png') no-repeat center/cover";
});

const footers = document.querySelectorAll('.site-footer');
footers.forEach(footer => {
    footer.style.background = "url('BG.png') no-repeat center/cover";
});

