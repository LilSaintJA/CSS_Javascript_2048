/*global console, $, jQuery, document, window */

/**
 * Fonction de débug
 * @param {data} D [La data à débuguer]
 */
function log(D) {
    'use strict';
    console.log(D);
}

log('Je suis le KeyboardControl');

/**
 * Gère les déplacements par le clavier
 */
function KeyboardControl() {
    'use strict';
    this.events = {};
    log(this.listen);
    // Appel de la méthode listen qui gére l'écouteur de touche clavier
    this.listen();
}

/**
 * [[Description]]
 * @param {[[Type]]} event    [[Description]]
 * @param {function} callback [Fait référence à la function move dans le GameControl]
 */
KeyboardControl.prototype.onEvent = function (event, callback) {
    'use strict';
    log(this.events[event]);
    //    log(callback);
    if (!this.events[event]) {
        log('Je suis dans la condition');
        this.event[event] = [];
    } else {
        this.event[event].push(callback);
    }
};

/**
 * [[Description]]
 * @param {[[Type]]} event [[Description]]
 * @param {[[Type]]} data  [[Description]]
 */
KeyboardControl.prototype.emitEvent = function (event, data) {
    'use strict';
    var callbacks = this.events[event];
    log('Je suis dans la fonction emitEvent');

    if (callbacks) {
        callbacks.forEach(function (callback) {
            log(callback);
            callback(data);
        });
    }
};

/**
 * Fonction qui écoute les touches du clavier
 */
KeyboardControl.prototype.listen = function () {
    'use strict';
    var map = {
        38: 0, // Touche UP
        39: 1, // Touche RIGHT
        40: 2, // Touche DOWN
        37: 3  // Touche LEFT
    };
    //    log('Je suis la clef');

    /**
     * Ecoute les fléches du clavier
     * @param {[[Type]]} document).keydown(function (event [[Description]]
     */
    $(document).keydown(function (event) {

        var self = this;

        // Rassemble les touches de ALT, CRTL, SHIFT
        var specialKey = event.altKey || event.ctrlKey || event.shiftKey,
            // Récupère la valeur des touches clavier initialisée dans l'objet map
            mapped = map[event.which];

        log(specialKey);

        if (!specialKey) {
            if (mapped !== undefined) {
                log('Je passe dans la condition');
                event.preventDefault();
                //                self.emitEvent('move', mapped);
            }
        }
    });
};