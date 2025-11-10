// Auto-slide carousel
let slideIndex = 0;
function showSlides() {
    const slides = document.querySelectorAll(".carousel img");
    slides.forEach((slide) => slide.classList.remove("active"));
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1; }
    slides[slideIndex - 1].classList.add("active");
    setTimeout(showSlides, 4000); // Change image every 4 seconds
}
document.addEventListener("DOMContentLoaded", showSlides);

// Tabs
function openTab(evt, tabName) {
    const tabcontents = document.querySelectorAll(".tab-content");
    tabcontents.forEach(tc => tc.classList.remove("active"));

    const tablinks = document.querySelectorAll(".tab-button");
    tablinks.forEach(tl => tl.classList.remove("active"));

    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

// Back to top
const backToTop = document.getElementById("back-to-top");
window.onscroll = () => {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        backToTop.style.display = "block";
    } else {
        backToTop.style.display = "none";
    }
};
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Staff password
function unlockStaff() {
    const pwd = document.getElementById("staff-password").value;
    if (pwd === "MPWEC!") {
        document.getElementById("staff-content").style.display = "block";
        document.getElementById("staff-login").style.display = "none";
    } else {
        alert("Incorrect password");
    }
}
