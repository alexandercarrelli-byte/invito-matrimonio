# 📋 Istruzioni per Visualizzare le Conferme

## Come Visualizzare i Risultati delle Conferme

### Metodo 1: Pagina Admin (Consigliato)

1. **Apri il file `admin.html` nel browser**
   - Doppio click sul file `admin.html` nella cartella del progetto
   - Oppure apri il browser e vai su: `file:///C:/Users/Alexander/admin.html`

2. **Visualizza le statistiche**
   - Nella parte superiore vedrai 4 card con le statistiche:
     - **Totale Risposte**: numero totale di conferme ricevute
     - **Conferme**: numero di persone che hanno confermato presenza
     - **Dispiace**: numero di persone che non possono partecipare
     - **Totale Ospiti**: numero totale di ospiti che parteciperanno

3. **Visualizza i dettagli**
   - Scorri la pagina per vedere tutte le conferme
   - Ogni conferma mostra:
     - Email del contatto
     - Data e ora della conferma
     - Stato (Confermato / Non può partecipare)
     - Lista degli ospiti con nomi, cognomi e allergie/intolleranze
     - Eventuale messaggio lasciato

### Metodo 2: Console del Browser (Avanzato)

1. Apri `index.html` o `admin.html` nel browser
2. Premi `F12` per aprire gli strumenti per sviluppatori
3. Vai alla tab "Console"
4. Digita: `JSON.parse(localStorage.getItem('weddingRSVPs'))`
5. Vedrai tutti i dati in formato JSON

### Metodo 3: Esportazione CSV

1. Apri `admin.html`
2. Clicca sul pulsante **"Esporta in CSV"**
3. Il file verrà scaricato automaticamente
4. Apri il file CSV con Excel, Google Sheets o qualsiasi editor di testo
5. Il file contiene tutte le informazioni organizzate in colonne

## Struttura dei Dati Salvati

I dati vengono salvati nel **localStorage** del browser con la chiave `weddingRSVPs`.

Ogni conferma contiene:
```json
{
  "id": 1234567890,
  "timestamp": "2026-02-04T10:30:00.000Z",
  "presence": "yes" o "no",
  "contactEmail": "email@example.com",
  "message": "Messaggio opzionale",
  "guests": [
    {
      "nome": "Mario",
      "cognome": "Rossi",
      "allergie": "Glutine, Lattosio"
    }
  ]
}
```

## Funzionalità Disponibili

### Nella Pagina Admin:

1. **Visualizzazione Statistiche**: Vedi subito numeri e tendenze
2. **Lista Dettagliata**: Ogni conferma con tutti i dettagli
3. **Esportazione CSV**: Scarica i dati per analisi esterne
4. **Cancellazione Dati**: Pulsante per resettare tutto (con conferma)

### Nel Form Principale:

1. **Conferma Presenza**: Sì o No
2. **Numero Ospiti**: Seleziona da 1 a 6 persone
3. **Campi Dinamici**: Si creano automaticamente campi per ogni ospite
4. **Gestione Allergie**: Campo dedicato per ogni persona
5. **Messaggio Opzionale**: Spazio per un messaggio agli sposi

## Note Importanti

⚠️ **Attenzione**: I dati sono salvati nel **localStorage del browser**. Questo significa:
- I dati sono salvati localmente sul computer
- Se cambi browser o computer, i dati non saranno disponibili
- Per pubblicare online, sarà necessario un backend per salvare i dati su un server

✅ **Per la pubblicazione futura**: Quando pubblicherai il sito, dovrai:
- Creare un backend (es. Node.js, PHP, Python)
- Salvare i dati in un database
- Modificare il codice JavaScript per inviare i dati al server invece che al localStorage

## Test del Sistema

Per testare il sistema:

1. Apri `index.html` nel browser
2. Compila il form con dati di prova
3. Invia la conferma
4. Apri `admin.html` per vedere i risultati
5. Prova a esportare in CSV

## Accesso Rapido

- **Sito Principale**: `index.html`
- **Pagina Admin**: `admin.html`
- **Link Admin dal Sito**: C'è un piccolo link in fondo alla pagina principale

---

*Buona gestione delle conferme! 💕*
