// Endpoint Google Apps Script per salvataggio RSVP
const RSVP_API_URL = 'https://script.google.com/macros/s/AKfycbwOvRfUz7Y6rbGJWM-BRjwa8TAdzVr2WxPB6SsROirpv-lsUcTjs4LdZTz6jzdU-2rPuA/exec';

// Animazioni al scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Applica animazioni fade-in alle sezioni
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.invitation-section, .details-section, .contact-section');
    
    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });

    // Animazione per le card dei dettagli
    const detailCards = document.querySelectorAll('.detail-card');
    detailCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease-out ${index * 0.2}s, transform 0.6s ease-out ${index * 0.2}s`;
        
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        cardObserver.observe(card);
    });

    // Smooth scroll per l'indicatore di scroll
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            document.getElementById('invitation').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    // Gestione form RSVP
    initRSVPForm();
});

// Parallax effect leggero per l'hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});


// Gestione Form RSVP
function initRSVPForm() {
    const form = document.getElementById('rsvpForm');
    const presenceRadios = document.querySelectorAll('input[name="presence"]');
    const numberGroup = document.getElementById('numberGroup');
    const numberOfGuests = document.getElementById('numberOfGuests');
    const guestsContainer = document.getElementById('guestsContainer');
    const successMessage = document.getElementById('successMessage');

    // Mostra/nascondi campo numero ospiti
    presenceRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'yes') {
                numberGroup.style.display = 'block';
                numberGroup.style.animation = 'fadeInUp 0.3s ease-out';
            } else {
                numberGroup.style.display = 'none';
                guestsContainer.innerHTML = '';
                numberOfGuests.value = '';
            }
        });
    });

    // Genera campi dinamici per gli ospiti
    numberOfGuests.addEventListener('change', () => {
        const num = parseInt(numberOfGuests.value);
        if (num > 0) {
            generateGuestFields(num);
        } else {
            guestsContainer.innerHTML = '';
        }
    });

    // Gestione submit form
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        saveRSVP();
    });
}

function generateGuestFields(number) {
    const container = document.getElementById('guestsContainer');
    container.innerHTML = '';

    for (let i = 1; i <= number; i++) {
        const guestDiv = document.createElement('div');
        guestDiv.className = 'guest-fields';
        guestDiv.innerHTML = `
            <div class="guest-title">Ospite ${i}</div>
            <div class="guest-row">
                <div class="guest-field">
                    <label>Nome *</label>
                    <input type="text" name="guest_${i}_nome" required placeholder="Nome">
                </div>
                <div class="guest-field">
                    <label>Cognome *</label>
                    <input type="text" name="guest_${i}_cognome" required placeholder="Cognome">
                </div>
                <div class="guest-field">
                    <label>Intolleranze/Allergie</label>
                    <input type="text" name="guest_${i}_allergie" placeholder="Es: glutine, lattosio, noci...">
                </div>
            </div>
        `;
        container.appendChild(guestDiv);
    }
}

function saveRSVP() {
    const form = document.getElementById('rsvpForm');
    const formData = new FormData(form);
    
    const presence = formData.get('presence');
    const numberOfGuests = formData.get('numberOfGuests');
    const contactEmail = formData.get('contactEmail');
    const message = formData.get('message') || '';

    const rsvpData = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        presence,
        contactEmail,
        message,
        guests: []
    };

    // Se presenti, raccogli dati ospiti
    if (presence === 'yes' && numberOfGuests) {
        const num = parseInt(numberOfGuests);
        for (let i = 1; i <= num; i++) {
            const nome = formData.get(`guest_${i}_nome`);
            const cognome = formData.get(`guest_${i}_cognome`);
            const allergie = formData.get(`guest_${i}_allergie`) || 'Nessuna';

            if (nome && cognome) {
                rsvpData.guests.push({
                    nome: nome.trim(),
                    cognome: cognome.trim(),
                    allergie: allergie.trim()
                });
            }
        }
    }

    // Invia i dati al backend Google Apps Script
    fetch(RSVP_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(rsvpData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Errore durante l\'invio della conferma');
        }
        return response.json().catch(() => ({}));
    })
    .then(() => {
        // Mostra messaggio di successo
        form.style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';

        // Scroll al messaggio
        document.getElementById('successMessage').scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Reset form dopo 5 secondi (opzionale)
        setTimeout(() => {
            form.reset();
            form.style.display = 'block';
            document.getElementById('successMessage').style.display = 'none';
            document.getElementById('numberGroup').style.display = 'none';
            document.getElementById('guestsContainer').innerHTML = '';
        }, 5000);
    })
    .catch((error) => {
        console.error(error);
        alert('Si è verificato un problema nel salvataggio della conferma. Per favore riprova tra qualche secondo.');
    });
}

