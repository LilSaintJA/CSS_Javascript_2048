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

        switch (mapped) {
            case 0:
                log('Touch Up');
                break;
            case 1:
                log('Touch Right');
                break;
            case 2:
                log('Touch Down');
                break;
            case 3:
                log('Touch Left');
                break;
        }
    });
};