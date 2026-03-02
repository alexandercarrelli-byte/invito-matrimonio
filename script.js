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

    // Gestione audio player
    initAudioPlayer();
});

// Parallax effect leggero per l'hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

    // Aggiungi classe per animazioni quando la pagina è caricata
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Tentativo aggiuntivo di autoplay dopo il caricamento completo
    const audio = document.getElementById('backgroundMusic');
    if (audio && audio.paused) {
        setTimeout(() => {
            audio.play().catch(() => {
                // Autoplay ancora bloccato, aspetta interazione
            });
        }, 1000);
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
        presence: presence,
        contactEmail: contactEmail,
        message: message,
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

    // Salva in localStorage
    let rsvps = JSON.parse(localStorage.getItem('weddingRSVPs') || '[]');
    rsvps.push(rsvpData);
    localStorage.setItem('weddingRSVPs', JSON.stringify(rsvps));

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
}

// Gestione Audio Player
function initAudioPlayer() {
    const audio = document.getElementById('backgroundMusic');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const muteBtn = document.getElementById('muteBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');
    const volumeIcon = document.getElementById('volumeIcon');
    const muteIcon = document.getElementById('muteIcon');

    if (!audio) {
        console.error('Elemento audio non trovato');
        return;
    }

    // Imposta volume iniziale (basso per aumentare possibilità di autoplay)
    audio.volume = 0.3; // Volume più basso per autoplay
    if (volumeSlider) {
        volumeSlider.value = 30;
    }

    // Gestione errori di caricamento file audio
    audio.addEventListener('error', (e) => {
        console.error('Errore nel caricamento audio:', e);
        const error = audio.error;
        let errorMessage = 'Errore nel caricamento della musica. ';
        
        if (error) {
            switch(error.code) {
                case error.MEDIA_ERR_ABORTED:
                    errorMessage += 'Caricamento interrotto.';
                    break;
                case error.MEDIA_ERR_NETWORK:
                    errorMessage += 'Errore di rete.';
                    break;
                case error.MEDIA_ERR_DECODE:
                    errorMessage += 'Errore di decodifica.';
                    break;
                case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                    errorMessage += 'Formato audio non supportato o file non trovato. Assicurati che il file "harp-music.mp3" sia nella stessa cartella di index.html';
                    break;
                default:
                    errorMessage += 'File audio non trovato. Aggiungi il file "harp-music.mp3" nella cartella del progetto.';
            }
        } else {
            errorMessage += 'File audio non trovato. Aggiungi il file "harp-music.mp3" nella cartella del progetto.';
        }
        
        // Mostra messaggio all'utente
        const audioPlayer = document.getElementById('audioPlayer');
        if (audioPlayer) {
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = 'color: #dc3545; font-size: 0.75rem; margin-top: 5px; text-align: center;';
            errorDiv.textContent = 'File audio non trovato';
            audioPlayer.appendChild(errorDiv);
        }
        
        console.error(errorMessage);
    });

    // Verifica quando il file è caricato correttamente
    audio.addEventListener('loadeddata', () => {
        console.log('File audio caricato correttamente');
    });

    audio.addEventListener('canplay', () => {
        console.log('Audio pronto per la riproduzione');
    });

    // Tentativo di autoplay immediato
    const tryAutoplay = () => {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    // Autoplay riuscito
                    playIcon.style.display = 'none';
                    pauseIcon.style.display = 'block';
                })
                .catch(error => {
                    // Autoplay bloccato, aspetta interazione utente
                    console.log('Autoplay bloccato, in attesa di interazione utente');
                });
        }
    };

    // Prova autoplay quando la pagina è caricata
    if (audio.readyState >= 2) {
        tryAutoplay();
    } else {
        audio.addEventListener('canplay', tryAutoplay, { once: true });
    }

    // Tentativo di autoplay quando l'utente interagisce con la pagina
    const interactionEvents = ['click', 'touchstart', 'keydown', 'scroll', 'mousemove'];
    let autoplayAttempted = false;
    
    const tryAutoplayOnInteraction = () => {
        if (!autoplayAttempted && audio.paused) {
            autoplayAttempted = true;
            audio.play()
                .then(() => {
                    playIcon.style.display = 'none';
                    pauseIcon.style.display = 'block';
                    // Rimuovi i listener dopo il primo successo
                    interactionEvents.forEach(event => {
                        document.removeEventListener(event, tryAutoplayOnInteraction);
                    });
                })
                .catch(() => {
                    // Riprova al prossimo evento
                    autoplayAttempted = false;
                });
        }
    };

    // Aggiungi listener per vari eventi di interazione
    interactionEvents.forEach(event => {
        document.addEventListener(event, tryAutoplayOnInteraction, { once: false, passive: true });
    });

    // Tentativo dopo un breve delay (alcuni browser permettono questo)
    setTimeout(() => {
        if (audio.paused) {
            tryAutoplay();
        }
    }, 500);

    // Play/Pause
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            if (audio.paused) {
                const playPromise = audio.play();
                
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            // Riproduzione avviata con successo
                            if (playIcon) playIcon.style.display = 'none';
                            if (pauseIcon) pauseIcon.style.display = 'block';
                            console.log('Musica avviata');
                        })
                        .catch(error => {
                            console.error('Errore nella riproduzione audio:', error);
                            
                            // Verifica se è un errore di file non trovato
                            if (audio.error && audio.error.code === audio.error.MEDIA_ERR_SRC_NOT_SUPPORTED) {
                                alert('File audio non trovato!\n\nAggiungi il file "harp-music.mp3" nella stessa cartella di index.html\n\nVedi il file ISTRUZIONI_AUDIO.md per maggiori dettagli.');
                            } else {
                                console.log('Riproduzione bloccata dal browser, potrebbe essere necessario un\'interazione precedente');
                            }
                        });
                }
            } else {
                audio.pause();
                if (playIcon) playIcon.style.display = 'block';
                if (pauseIcon) pauseIcon.style.display = 'none';
            }
        });
    }

    // Controllo volume
    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            audio.volume = volume;
            
            // Aggiorna icona volume
            if (volume === 0) {
                if (volumeIcon) volumeIcon.style.display = 'none';
                if (muteIcon) muteIcon.style.display = 'block';
            } else {
                if (volumeIcon) volumeIcon.style.display = 'block';
                if (muteIcon) muteIcon.style.display = 'none';
            }
        });
    }

    // Mute/Unmute
    if (muteBtn) {
        muteBtn.addEventListener('click', () => {
            if (audio.muted) {
                audio.muted = false;
                if (volumeIcon) volumeIcon.style.display = 'block';
                if (muteIcon) muteIcon.style.display = 'none';
            } else {
                audio.muted = true;
                if (volumeIcon) volumeIcon.style.display = 'none';
                if (muteIcon) muteIcon.style.display = 'block';
            }
        });
    }

    // Aggiorna icona quando l'audio finisce o viene messo in pausa
    audio.addEventListener('pause', () => {
        if (playIcon) playIcon.style.display = 'block';
        if (pauseIcon) pauseIcon.style.display = 'none';
    });

    audio.addEventListener('play', () => {
        if (playIcon) playIcon.style.display = 'none';
        if (pauseIcon) pauseIcon.style.display = 'block';
    });

    // Debug: mostra lo stato dell'audio nella console
    console.log('Stato iniziale audio:', {
        paused: audio.paused,
        readyState: audio.readyState,
        error: audio.error,
        src: audio.currentSrc || audio.src
    });
}
