/*global console, $, jQuery, document, window, GridControl, Grid, TileControl */

/**
 * Fonction de débug
 * @param {data} D [La data à débuguer]
 */
function log(D) {
    'use strict';
    console.log(D);
}
/**
 * Gestionnaire du jeu
 * @param {int} size           [Taille de la grille]
 * @param {object} InputControl   [Class qui gère les touches clavier]
 * @param {object} HTMLControl    [Class qui gère l'interface graphique du jeu]
 * @param {object} StorageControl [Class qui gère le localStorage, pour sauvegarder la partie en cours, le meilleurs scores, ect]
 */
function GameControl(size, KeyControl, HTMLControl, StorageControl) {
    'use strict';
    console.log('Je suis le game control');

    this.size               = size;
    this.keyControl         = new KeyControl(); // KeyboardControl
    this.htmlControl        = new HTMLControl();
    this.storageControl     = new StorageControl();

    this.startTiles         = 2;

    //    log(this.keyControl);
    //    log(this.inputControl.on("move", this.move(this)));
    log(this);
    //    this.keyControl.onEvent("move", this.move.bind(this));

    this.setup();
}

// ---- Init du jeu

/**
 * Permet d'instancier les methodes utiles au démarrage du jeu
 * Ou à la recharge du jeu si une partie est présente dans le localStorage
 */
GameControl.prototype.setup = function () {
    'use strict';

};