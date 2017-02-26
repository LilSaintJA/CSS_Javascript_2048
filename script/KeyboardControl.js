/*global console, $, jQuery, document, window */

/**
 * Fonction de débug
 * @param {data} D [La data à débuguer]
 */
function log(D) {
    'use strict';
    console.log(D);
}


/**
 * Gère les déplacements par le clavier
 */
function KeyboardControl() {
    'use strict';
    this.events = {};
    // Appel de la méthode listen qui gére l'écouteur de touche clavier
    this.listen();
}

/* ------------------- */
/* *** GESTION EVENTS *** */
/* ------------------- */

/**
 * [[Description]]
 * @param {[[Type]]} evt      [[Description]]
 * @param {[[Type]]} callback [[Description]]
 */
KeyboardControl.prototype.onEvent = function (evt, callback) {
    'use strict';

    if (!this.events[evt]) {
        this.events[evt] = [];
    }
    this.events[evt].push(callback);
};

/**
 * [[Description]]
 * @param {[[Type]]} evt  [[Description]]
 * @param {[[Type]]} data [[Description]]
 */
KeyboardControl.prototype.emitEvent = function (evt, data) {
    'use strict';
    // Quand j'appuie sur une touche la fonction est appelé

    var callbacks = this.events[evt];

    // En appuyant sur une touche je passe dans la condition
    // ## callback rappel la function moveGrid -> GameControl
    if (callbacks) {
        callbacks.forEach(function (callback) {
            callback(data);
        });
    }
};

/**
 * Fonction qui écoute les touches du clavier
 */
KeyboardControl.prototype.listen = function () {
    'use strict';
    var self = this,
        map = {
            38: 0, // Touche UP
            39: 1, // Touche RIGHT
            40: 2, // Touche DOWN
            37: 3  // Touche LEFT
        },
        btnRetry = $('.retry'),
        btnContinue = $('.continue'),
        btnNewGame = $('.restart-game');

    /**
     * Ecoute les fléches du clavier
     * @param {[[Type]]} document).keydown(function (event [[Description]]
     */
    document.addEventListener('keydown', function (event) {

        // Rassemble les touches de ALT, CRTL, SHIFT
        var specialKey = event.altKey || event.ctrlKey || event.shiftKey,
            // Récupère la valeur des touches clavier initialisée dans l'objet map
            mapped = map[event.which];

        if (!specialKey) {
            if (mapped !== undefined) {
                event.preventDefault();
                self.emitEvent('move', mapped);
            }
        }
    });

    // Ecouteurs de click

    btnRetry.click(function (event) {
        event.preventDefault();
        self.emitEvent('retry');
    });

    btnContinue.click(function (event) {
        event.preventDefault();
        self.emitEvent('continue');
    });

    btnNewGame.click(function (event) {
        event.preventDefault();
        self.emitEvent('retry');
    });
};