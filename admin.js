// Endpoint Google Apps Script (stesso usato nel form)
const RSVP_API_URL = 'https://script.google.com/macros/s/AKfycbwOvRfUz7Y6rbGJWM-BRjwa8TAdzVr2WxPB6SsROirpv-lsUcTjs4LdZTz6jzdU-2rPuA/exec';

// Cache RSVP normalizzati per export
let rsvpsForExport = [];

// Carica e visualizza tutte le conferme
document.addEventListener('DOMContentLoaded', () => {
    loadRSVPs();
});

function loadRSVPs() {
    const container = document.getElementById('rsvpsContainer');

    container.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">⏳</div>
            <h2>Caricamento in corso...</h2>
            <p>Recupero le conferme dal foglio Google.</p>
        </div>
    `;

    fetch(RSVP_API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Errore nel caricamento dei dati');
            }
            return response.json();
        })
        .then(rows => {
            // Le righe possono arrivare in formato piatto (una per ospite, con
            // guest_nome/guest_cognome/guest_allergie) oppure annidato (una per
            // conferma, con un array guests[]): le normalizziamo in entrambi i casi.
            const rsvps = groupRowsByRSVP(rows || []);
            rsvpsForExport = rsvps;

            if (!rsvps.length) {
                container.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">📋</div>
                        <h2>Nessuna conferma ancora</h2>
                        <p>Le conferme appariranno qui quando gli invitati compileranno il form.</p>
                    </div>
                `;
                updateStats([]);
                return;
            }

            // Calcola statistiche
            updateStats(rsvps);

            // Ordina per data (più recenti prima)
            rsvps.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            container.innerHTML = rsvps.map(rsvp => createRSVPItem(rsvp)).join('');
        })
        .catch(error => {
            console.error(error);
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">⚠️</div>
                    <h2>Errore nel caricamento</h2>
                    <p>Non riesco a leggere le conferme dal foglio Google. Riprova tra qualche istante.</p>
                </div>
            `;
        });
}

// Raggruppa le righe in oggetti RSVP con lista ospiti.
// Gestisce sia il formato piatto (una riga per ospite con guest_nome/...)
// sia quello annidato (una riga per conferma con un array guests[]).
function groupRowsByRSVP(rows) {
    const map = new Map();

    rows.forEach(row => {
        const key = `${row.timestamp}|${row.contactEmail}`;
        if (!map.has(key)) {
            map.set(key, {
                timestamp: row.timestamp,
                presence: row.presence,
                contactEmail: row.contactEmail,
                message: row.message,
                guests: []
            });
        }

        const current = map.get(key);

        // Formato annidato: array di ospiti sulla stessa riga
        if (Array.isArray(row.guests)) {
            row.guests.forEach(guest => addGuest(current, guest));
        }

        // Formato piatto: campi guest_* sulla riga (una riga per ospite)
        if (row.guest_nome || row.guest_cognome || row.guest_allergie) {
            addGuest(current, {
                nome: row.guest_nome,
                cognome: row.guest_cognome,
                allergie: row.guest_allergie
            });
        }
    });

    return Array.from(map.values());
}

// Aggiunge un ospite all'RSVP normalizzando i campi
function addGuest(rsvp, guest) {
    if (!guest) return;
    const nome = (guest.nome || '').trim();
    const cognome = (guest.cognome || '').trim();
    const allergie = (guest.allergie || '').trim();

    if (!nome && !cognome && !allergie) return;

    rsvp.guests.push({
        nome,
        cognome,
        allergie: allergie || 'Nessuna'
    });
}

function createRSVPItem(rsvp) {
    const date = new Date(rsvp.timestamp);
    const formattedDate = date.toLocaleString('it-IT', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const statusClass = rsvp.presence === 'yes' ? 'status-yes' : 'status-no';
    const statusText = rsvp.presence === 'yes' ? '✓ Confermato' : '✗ Non può partecipare';

    let guestsHTML = '';
    if (rsvp.presence === 'yes' && rsvp.guests && rsvp.guests.length > 0) {
        guestsHTML = `
            <div class="guest-list">
                <h4 style="margin-bottom: 15px; color: var(--text-dark); font-family: var(--font-serif);">Ospiti:</h4>
                ${rsvp.guests.map(guest => `
                    <div class="guest-item">
                        <div class="guest-name">${guest.nome} ${guest.cognome}</div>
                        <div class="guest-allergies">
                            ${guest.allergie && guest.allergie !== 'Nessuna' 
                                ? `<strong>Allergie:</strong> ${guest.allergie}` 
                                : '<span class="no-allergies">Nessuna allergia/intolleranza</span>'}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    const messageHTML = rsvp.message 
        ? `<div class="rsvp-message"><strong>Messaggio:</strong> "${rsvp.message}"</div>`
        : '';

    return `
        <div class="rsvp-item">
            <div class="rsvp-header">
                <div>
                    <h3 style="margin: 0; color: var(--text-dark); font-family: var(--font-serif);">
                        ${rsvp.contactEmail}
                    </h3>
                    <p style="margin: 5px 0 0 0; color: var(--text-light); font-size: 0.9rem;">
                        ${formattedDate}
                    </p>
                </div>
                <span class="rsvp-status ${statusClass}">${statusText}</span>
            </div>
            ${guestsHTML}
            ${messageHTML}
        </div>
    `;
}

function updateStats(rsvps) {
    const total = rsvps.length;
    const yes = rsvps.filter(r => r.presence === 'yes').length;
    const no = rsvps.filter(r => r.presence === 'no').length;
    const totalGuests = rsvps
        .filter(r => r.presence === 'yes')
        .reduce((sum, r) => sum + (r.guests ? r.guests.length : 0), 0);

    document.getElementById('totalRSVPs').textContent = total;
    document.getElementById('totalYes').textContent = yes;
    document.getElementById('totalNo').textContent = no;
    document.getElementById('totalGuests').textContent = totalGuests;
}

function exportToCSV() {
    if (!rsvpsForExport.length) {
        alert('Nessun dato da esportare');
        return;
    }

    // Crea header CSV
    let csv = 'Data,Email,Presenza,Nome,Cognome,Allergie,Messaggio\n';

    rsvpsForExport.forEach(rsvp => {
        const date = new Date(rsvp.timestamp).toLocaleString('it-IT');
        const presence = rsvp.presence === 'yes' ? 'Sì' : 'No';
        const message = (rsvp.message || '').replace(/"/g, '""');
        const email = (rsvp.contactEmail || '').replace(/"/g, '""');

        if (rsvp.guests && rsvp.guests.length) {
            // Una riga per ogni ospite
            rsvp.guests.forEach(guest => {
                const nome = (guest.nome || '').replace(/"/g, '""');
                const cognome = (guest.cognome || '').replace(/"/g, '""');
                const allergie = (guest.allergie || 'Nessuna').replace(/"/g, '""');
                csv += `"${date}","${email}","${presence}","${nome}","${cognome}","${allergie}","${message}"\n`;
            });
        } else {
            // Conferma senza ospiti (es. risposta "No")
            csv += `"${date}","${email}","${presence}","","","","${message}"\n`;
        }
    });

    // Scarica file
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `conferme_matrimonio_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function clearAllData() {
    alert('Per cancellare tutti i dati devi aprire il foglio Google e rimuovere le righe manualmente.');
}
