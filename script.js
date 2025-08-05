// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to navigation
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.classList.add('backdrop-blur-sm');
        header.style.background = 'rgba(255, 255, 255, 0.95)';
    } else {
        header.classList.remove('backdrop-blur-sm');
        header.style.background = '#fff';
    }
});

// Simple animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe project card for animation
document.addEventListener('DOMContentLoaded', function() {
    const projectCard = document.querySelector('.bg-white.rounded-xl');
    if (projectCard) {
        projectCard.style.opacity = '0';
        projectCard.style.transform = 'translateY(20px)';
        projectCard.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(projectCard);
    }
});