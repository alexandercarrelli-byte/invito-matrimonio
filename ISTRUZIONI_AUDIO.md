# 🎵 Istruzioni per Aggiungere la Musica di Sottofondo

## Come Aggiungere il File Audio

Il player audio è già stato implementato nel sito. Ora devi solo aggiungere il file audio della musica romantica suonata con l'arpa.

### Passo 1: Trova o Prepara il File Audio

Puoi usare:
- Un file MP3 esistente di musica per arpa
- Un file scaricato da siti di musica royalty-free
- Un file che hai registrato tu stesso

**Formati supportati:**
- `.mp3` (consigliato - compatibilità universale)
- `.ogg` (alternativa per alcuni browser)

### Passo 2: Posiziona il File nella Cartella del Progetto

1. Salva il file audio nella stessa cartella dove si trova `index.html`
2. Rinomina il file come `harp-music.mp3` (o `harp-music.ogg`)

**Percorso completo:** `C:\Users\Alexander\harp-music.mp3`

### Passo 3: Verifica il File

Apri `index.html` nel browser e dovresti vedere il player audio in basso a destra.

## Dove Trovare Musica Gratuita per Arpa

Ecco alcuni siti dove puoi trovare musica royalty-free:

1. **Free Music Archive** (freemusicarchive.org)
   - Cerca "harp" o "romantic harp"
   - Filtra per licenza Creative Commons

2. **Pixabay Music** (pixabay.com/music)
   - Cerca "harp romantic"
   - Download gratuito senza attribuzione

3. **YouTube Audio Library** (studio.youtube.com)
   - Sezione "Audio Library"
   - Cerca musica romantica per arpa

4. **Incompetech** (incompetech.com)
   - Musica royalty-free
   - Cerca "harp" o "romantic"

5. **Bensound** (bensound.com)
   - Alcune tracce gratuite
   - Cerca "romantic" o "harp"

## Personalizzazione del Player

Se vuoi cambiare il nome del file audio, modifica `index.html`:

```html
<audio id="backgroundMusic" loop>
    <source src="TUO-FILE.mp3" type="audio/mpeg">
    <source src="TUO-FILE.ogg" type="audio/ogg">
</audio>
```

## Caratteristiche del Player

✅ **Riproduzione automatica**: L'utente deve cliccare play (richiesto dai browser moderni)
✅ **Loop infinito**: La musica si ripete automaticamente
✅ **Controllo volume**: Slider per regolare il volume
✅ **Mute/Unmute**: Pulsante per silenziare rapidamente
✅ **Design elegante**: Si integra perfettamente con il tema blu del matrimonio
✅ **Responsive**: Funziona su desktop, tablet e smartphone

## Note Importanti

⚠️ **Riproduzione automatica**: I browser moderni (Chrome, Firefox, Safari) bloccano la riproduzione automatica dell'audio. L'utente deve cliccare manualmente sul pulsante play.

⚠️ **Diritti d'autore**: Assicurati di avere i diritti per usare la musica scelta. Per un matrimonio privato, la maggior parte della musica royalty-free è adatta.

⚠️ **Dimensione file**: Cerca di mantenere il file sotto i 5-10 MB per un caricamento veloce del sito.

## Test

Dopo aver aggiunto il file audio:

1. Apri `index.html` nel browser
2. Clicca sul pulsante play (▶) nel player in basso a destra
3. Regola il volume con lo slider
4. Verifica che la musica si ripeta in loop

---

*Buona scelta musicale! 🎵💕*
