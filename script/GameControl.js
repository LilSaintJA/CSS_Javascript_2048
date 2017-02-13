/*global console, $, jQuery, document, window, GridControl, Grid */

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
function GameControl(size, InputControl, HTMLControl, StorageControl) {
    'use strict';
    console.log('Je suis le game control');

    this.size               = size;
    this.inputControl       = new InputControl();
    this.htmlControl        = new HTMLControl();
    this.storageControl     = new StorageControl();

    this.startTiles         = 2;

    this.setup();
}

// ---- Init du jeu

/**
 * [[Description]]
 */
GameControl.prototype.setup = function () {
    'use strict';

    // Variable qui contient le JSON dans le local Storage
    var previousState = this.storageControl.getGameState();

    // Recharge le jeu
    // Si une partie existe déjà, conserve les states
    if (previousState) {
        this.grid       = new GridControl(previousState.grid.size, previousState.grid.cells);
        this.score      = previousState.score;
        this.over       = previousState.over;
        this.won        = previousState.won;
        this.continue   = previousState.continue;
    } else {
        this.grid       = new GridControl(this.size);
        this.score      = 0;
        this.over       = false;
        this.won        = false;
        this.continue   = false;

        // Ajoute les tuiles de départ
        this.addStartTiles();
    }

    // Mise à jour du jeu
    this.refresh();

};

/**
 * Création des cases aléatoires
 */
GameControl.prototype.addStartTiles = function () {
    'use strict';
    var i;
    // La boucle génére le nbr de tuiles de départ, par rapport à la valeur de startTiles
    for (i = 0; i < this.startTiles; i += 1) {
        this.addRandomTiles();
    }
};

/**
 * Ajout des cases aléatoires selon leur position
 */
GameControl.prototype.addRandomTiles = function () {
    'use strict';
    var tile,
        value;
    // Methode appartenant à la class GridControl
    if (this.grid.cellsAvailable()) {
        value = Math.random() < 0.9 ? 2 : 4;
        tile = new TileControl(this.grid.randomAvailableCells(), value);
        log(tile);

        this.grid.insertTile(tile);
    }
};

/**
 * [[Description]]
 */
GameControl.prototype.refresh = function () {
    'use strict';
};