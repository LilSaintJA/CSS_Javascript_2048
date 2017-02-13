/*global console, $, jQuery, document, window */
/**
 * Gère l'interface du jeu du côté front
 */
function HTMLControl() {
    'use strict';

    function log(D) {
        console.log(D);
    }
    console.log('Je suis le HTML Control');

    this.tuileContainer = $('.tuile-container');
    this.scoreContainer = $('.score-container');
    this.bestContainer = $('.best-container');

    log('TuileContainer');
    log(this.tuileContainer);
    log(this.bestContainer);
}