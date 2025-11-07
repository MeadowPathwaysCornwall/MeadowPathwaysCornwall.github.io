document.addEventListener('DOMContentLoaded', function () {
    let current = 0;
    const slides = document.querySelectorAll('.carousel .slide');
    const dotsContainer = document.getElementById('dots');

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
        updateDots(index);
    }

    function updateDots(index) {
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
    }

    // Initialize dots
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'dot';
        dot.setAttribute('data-index', index);
        dot.addEventListener('click', () => showSlide(index));
        dotsContainer.appendChild(dot);
    });

    // Show the first slide
    showSlide(current);

    document.getElementById('prev').addEventListener('click', () => {
        current = (current - 1 + slides.length) % slides.length;
        showSlide(current);
    });

    document.getElementById('next').addEventListener('click', () => {
        current = (current + 1) % slides.length;
        showSlide(current);
    });
});
