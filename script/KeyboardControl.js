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
    log('Je suis le KeyboardControl');
    this.events = {};
    //    log(this.events);
    //    log(this.listen);
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
    log('onEvent');

    if (!this.events[evt]) {
        this.events[evt] = [];
    }
    //    log('condition onEvents');
    this.events[evt].push(callback);
};

KeyboardControl.prototype.emitEvent = function (evt, data) {
    'use strict';
    // Quand j'appuie sur une touche la fonction est appelé
    //    log('emitEvent');

    var callbacks = this.events[evt];
    //    log(callbacks);

    if (callbacks) {
        // En appuyant sur une touche je passe dans la condition
        //        log('condition emitEvents');
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
        };

    /**
     * Ecoute les fléches du clavier
     * @param {[[Type]]} document).keydown(function (event [[Description]]
     */
    $(document).keydown(function (event) {
        //        log('Je passe dans l\'event');

        // Rassemble les touches de ALT, CRTL, SHIFT
        var specialKey = event.altKey || event.ctrlKey || event.shiftKey,
            // Récupère la valeur des touches clavier initialisée dans l'objet map
            mapped = map[event.which];

        //        log(specialKey);

        if (!specialKey) {
            if (mapped !== undefined) {
                //                log('condition keydown');
                event.preventDefault();
                self.emitEvent('move', mapped);
            }
        }
    });
};