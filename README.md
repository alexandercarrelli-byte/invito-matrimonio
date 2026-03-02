# Invito Matrimonio - Anna & Massimo

Sito web elegante e responsive per l'invito al matrimonio di Benigno Anna e Massimo Ferrari.

## 🎉 Caratteristiche

- ✨ Design elegante e moderno
- 📱 Completamente responsive (PC, tablet, smartphone)
- 🎬 Animazioni fluide e accattivanti
- 💙 Tema blu elegante
- ⚡ Performance ottimizzate
- 🎵 Musica di sottofondo (arpa romantica)
- 📋 Form di conferma presenza con gestione dinamica ospiti

## 📅 Informazioni Evento

- **Data**: 26 Agosto 2026
- **Sposi**: Benigno Anna e Massimo Ferrari

## 🚀 Come Visualizzare in Locale

### Opzione 1: Aprire direttamente il file HTML
1. Apri il file `index.html` con il tuo browser preferito
2. Il sito sarà visualizzabile immediatamente

### Opzione 2: Usare un server locale (consigliato)

#### Con Python:
```bash
# Python 3
python -m http.server 8000

# Poi apri nel browser: http://localhost:8000
```

#### Con Node.js (se hai installato http-server):
```bash
npx http-server -p 8000
```

#### Con PHP:
```bash
php -S localhost:8000
```

## 📁 Struttura Progetto

```
INVITO MATRIMONIO/
├── index.html                      # Pagina principale
├── admin.html                      # Pagina admin per visualizzare conferme
├── styles.css                      # Stili e animazioni
├── script.js                       # JavaScript per interattività e form
├── admin.js                        # JavaScript per pagina admin
├── test-audio.html                 # Pagina di test per verificare audio
├── README.md                       # Questo file
├── ISTRUZIONI_VISUALIZZAZIONE.md   # Guida per visualizzare conferme
└── ISTRUZIONI_AUDIO.md             # Guida per aggiungere musica
```

## 🎨 Personalizzazioni Future

Il sito è pronto per essere personalizzato con:
- Informazioni complete su luogo e orario dell'evento
- Dettagli di contatto per le conferme
- Foto degli sposi
- Mappa del luogo
- Countdown timer fino alla data dell'evento

## 📱 Compatibilità

Il sito è stato testato e funziona su:
- ✅ Desktop (Chrome, Firefox, Safari, Edge)
- ✅ Tablet (iPad, Android tablets)
- ✅ Smartphone (iOS, Android)

## 🎵 Musica di Sottofondo

Per aggiungere la musica di sottofondo:
1. Scarica o prepara un file MP3 di musica romantica per arpa
2. Rinominalo come `harp-music.mp3`
3. Mettilo in questa cartella (stessa cartella di `index.html`)
4. Vedi `ISTRUZIONI_AUDIO.md` per maggiori dettagli

## 📋 Form di Conferma

Il sito include un form completo per la conferma presenza con:
- Selezione presenza (Sì/No)
- Numero di ospiti (1-6)
- Campi dinamici per nome, cognome e allergie di ogni ospite
- Salvataggio dati in localStorage
- Pagina admin per visualizzare tutte le conferme

Vedi `ISTRUZIONI_VISUALIZZAZIONE.md` per dettagli su come visualizzare i risultati.

## 🌐 Pubblicazione Futura

Quando sarai pronto a pubblicare il sito:

1. **Usa HTTPS**: Ricorda di pubblicare il sito con HTTPS per permettere l'autoplay della musica
2. **Carica tutti i file** su servizi come:
   - GitHub Pages
   - Netlify
   - Vercel
   - Altri servizi di hosting
3. **Acquista un dominio personalizzato** (opzionale)
4. **Condividi il link** con gli invitati

## 📝 Note Importanti

⚠️ **Dati LocalStorage**: I dati delle conferme sono salvati nel localStorage del browser. Quando pubblicherai online, considera di aggiungere un backend per salvare i dati su un server.

⚠️ **Musica**: Assicurati di avere i diritti per usare la musica scelta. Per un matrimonio privato, la maggior parte della musica royalty-free è adatta.

---

*Creato con ❤️ per Anna & Massimo*

**Data Creazione**: Febbraio 2026
**Data Evento**: 26 Agosto 2026
