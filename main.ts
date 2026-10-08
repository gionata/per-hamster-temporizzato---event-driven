// ==========================================
// DEFINIZIONE DEGLI STATI (ENUM)
// ==========================================

enum StatoCriceto {
    Addormentato = 0,
    Felice = 1,
    Triste = 2
}

// ==========================================
// DICHIARAZIONE DELLE VARIABILI GLOBALI
// ==========================================

let stato: StatoCriceto = StatoCriceto.Addormentato

// Identificatore univoco del timer corrente per invalidare i vecchi thread
let idTimer: number = 0


// ==========================================
// FUNZIONI DI STATO CON TIMEOUT INTEGRATO
// ==========================================

/**
 * Avvia il timer di addormentamento a basso consumo in background.
 */
function avviaTimerInattivita() {
    // Incrementa l'ID del timer per invalidare eventuali timer precedenti
    idTimer += 1
    let idCorrente = idTimer

    // Crea un Fiber leggero che resta in "deep pause" senza impegnare la CPU
    control.inBackground(function () {
        basic.pause(5000) // La CPU dorme per 5000ms

        // Verifica se questo timer è ancora valido e se il criceto non è già addormentato
        if (idCorrente == idTimer && stato != StatoCriceto.Addormentato) {
            music.stopMelody(MelodyStopOptions.All)
            music.beginMelody(music.builtInMelody(Melodies.PowerDown), MelodyOptions.OnceInBackground)
            annoiato()
        }
    })
}

/**
 * Imposta il criceto nello stato "Felice"
 */
function felice() {
    stato = StatoCriceto.Felice
    music.stopMelody(MelodyStopOptions.All)
    basic.showIcon(IconNames.Happy)
    music.beginMelody(music.builtInMelody(Melodies.Entertainer), MelodyOptions.OnceInBackground)

    // Avvia/Ripristina il conto alla rovescia
    avviaTimerInattivita()
}

/**
 * Imposta il criceto nello stato "Triste"
 */
function triste() {
    stato = StatoCriceto.Triste
    music.stopMelody(MelodyStopOptions.All)
    basic.showIcon(IconNames.Sad)
    music.beginMelody(music.builtInMelody(Melodies.Funeral), MelodyOptions.OnceInBackground)

    // Avvia/Ripristina il conto alla rovescia
    avviaTimerInattivita()
}

/**
 * Imposta il criceto nello stato "Annoiato/Dormiente"
 */
function annoiato() {
    stato = StatoCriceto.Addormentato
    // Incrementa l'ID per disattivare eventuali timer attivi
    idTimer += 1
    basic.showIcon(IconNames.Asleep)
}


// ==========================================
// AVVIO DEL PROGRAMMA (INIZIALIZZAZIONE)
// ==========================================

music.beginMelody(music.builtInMelody(Melodies.PowerUp), MelodyOptions.OnceInBackground)
annoiato()


// ==========================================
// GESTIONE DEGLI EVENTI DI INPUT (ISR/Fiber)
// ==========================================

// Tocco del logo touch: rende il criceto felice
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    if (stato != StatoCriceto.Felice) {
        felice()
    } else {
        // Se è già felice, ripristina semplicemente il timer da 5 secondi
        avviaTimerInattivita()
    }
})

// Scossa del micro:bit: rende il criceto triste
input.onGesture(Gesture.Shake, function () {
    if (stato != StatoCriceto.Triste) {
        triste()
    } else {
        // Se è già triste, ripristina semplicemente il timer da 5 secondi
        avviaTimerInattivita()
    }
})

// Pressione del Pulsante A: addormenta manualmente il criceto
input.onButtonPressed(Button.A, function () {
    if (stato != StatoCriceto.Addormentato) {
        music.stopMelody(MelodyStopOptions.All)
        music.beginMelody(music.builtInMelody(Melodies.PowerDown), MelodyOptions.OnceInBackground)
        annoiato()
    }
})