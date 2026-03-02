// Carica e visualizza tutte le conferme
document.addEventListener('DOMContentLoaded', () => {
    loadRSVPs();
});

function loadRSVPs() {
    const rsvps = JSON.parse(localStorage.getItem('weddingRSVPs') || '[]');
    const container = document.getElementById('rsvpsContainer');
    
    // Calcola statistiche
    updateStats(rsvps);
    
    if (rsvps.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <h2>Nessuna conferma ancora</h2>
                <p>Le conferme appariranno qui quando gli invitati compileranno il form.</p>
            </div>
        `;
        return;
    }

    // Ordina per data (più recenti prima)
    rsvps.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    container.innerHTML = rsvps.map(rsvp => createRSVPItem(rsvp)).join('');
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
    const rsvps = JSON.parse(localStorage.getItem('weddingRSVPs') || '[]');
    
    if (rsvps.length === 0) {
        alert('Nessun dato da esportare');
        return;
    }

    // Crea header CSV
    let csv = 'Data,Email,Presenza,Numero Ospiti,Nome,Cognome,Allergie,Messaggio\n';

    // Aggiungi dati
    rsvps.forEach(rsvp => {
        const date = new Date(rsvp.timestamp).toLocaleString('it-IT');
        const presence = rsvp.presence === 'yes' ? 'Sì' : 'No';
        const numGuests = rsvp.guests ? rsvp.guests.length : 0;
        const message = (rsvp.message || '').replace(/"/g, '""');

        if (rsvp.guests && rsvp.guests.length > 0) {
            rsvp.guests.forEach((guest, index) => {
                const nome = (guest.nome || '').replace(/"/g, '""');
                const cognome = (guest.cognome || '').replace(/"/g, '""');
                const allergie = (guest.allergie || 'Nessuna').replace(/"/g, '""');
                
                // Prima riga con tutti i dati, altre righe solo per ospiti aggiuntivi
                if (index === 0) {
                    csv += `"${date}","${rsvp.contactEmail}","${presence}","${numGuests}","${nome}","${cognome}","${allergie}","${message}"\n`;
                } else {
                    csv += `"","","","","${nome}","${cognome}","${allergie}",""\n`;
                }
            });
        } else {
            csv += `"${date}","${rsvp.contactEmail}","${presence}","0","","","","${message}"\n`;
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
    if (confirm('Sei sicuro di voler cancellare TUTTI i dati delle conferme? Questa azione non può essere annullata.')) {
        localStorage.removeItem('weddingRSVPs');
        loadRSVPs();
        alert('Tutti i dati sono stati cancellati.');
    }
}
