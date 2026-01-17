// --- CONFIGURATION ET ETAT ---
const galleryStates = new Map();

// --- INITIALISATION DES GALERIES ---
document.addEventListener('DOMContentLoaded', () => {
    const galleries = ['mariage-gallery', 'sport-gallery', 'portrait-gallery'];
    
    galleries.forEach(galleryId => {
        const wrapper = document.getElementById(galleryId);
        if (wrapper) {
            initGallery(wrapper);
        }
    });

    // Animation d'apparition des sections
    document.querySelectorAll('.gallery-section').forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = `all 0.8s ease ${index * 0.2}s`;
        setTimeout(() => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, 100);
    });
});

function initGallery(wrapper) {
    const galleryId = wrapper.id.replace('-gallery', '');
    const track = wrapper.querySelector('.gallery-track');
    const items = track.querySelectorAll('.gallery-item');
    
    if (items.length === 0) return;

    // On stocke l'état de chaque galerie
    const state = {
        track: track,
        currentIndex: 0,
        totalItems: items.length,
        itemWidth: items[0].offsetWidth,
        gap: parseInt(window.getComputedStyle(track).gap) || 0,
        animating: false
    };

    galleryStates.set(galleryId, state);
    
    // Recalculer la largeur si la fenêtre change
    window.addEventListener('resize', () => {
        state.itemWidth = items[0].offsetWidth;
        updatePosition(state, true);
    });
}

// --- LOGIQUE DE DEFILEMENT ---
function scrollGallery(galleryId, direction) {
    const state = galleryStates.get(galleryId);
    if (!state || state.animating) return;

    let newIndex = state.currentIndex + direction;

    // Gestion des limites (Boucle)
    if (newIndex >= 4) {
        state.animating = true;
        state.track.style.transition = 'transform 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
        state.currentIndex = 0;
        updatePosition(state);
        
        state.track.addEventListener('transitionend', () => {
            state.track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            state.animating = false;
        }, { once: true });
        return;
    } 
    
    if (newIndex < 0) {
        newIndex = 3;
    }

    state.animating = true;
    state.currentIndex = newIndex;
    updatePosition(state);

    state.track.addEventListener('transitionend', () => {
        state.animating = false;
    }, { once: true });
}

function updatePosition(state, instant = false) {
    const offset = -(state.currentIndex * (state.itemWidth + state.gap));
    if (instant) state.track.style.transition = 'none';
    state.track.style.transform = `translateX(${offset}px)`;
    if (instant) {
        state.track.offsetHeight; // Force le rendu
        state.track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    }
}

// --- EFFETS VISUELS (Parallaxe Hero) ---
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && scrolled < 600) {
        heroTitle.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroTitle.style.opacity = 1 - (scrolled / 500);
    }
});
