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

    // ## Nbr de tile générer en début de partie
    this.startTiles         = 2;

    this.setup();
}

/* -------------- */
/* *** INIT *** */
/* -------------- */

/**
 * Permet d'instancier les methodes utiles au démarrage du jeu
 * Ou à la recharge du jeu si une partie est présente dans le localStorage
 */
GameControl.prototype.setup = function () {
    'use strict';

    var previousState = this.storageControl.getGameState();

    // ## Si une partie existe déjà relance le jeu à partir de celle-ci
    if (previousState) {
        this.grid       = new GridControl(previousState.grid.size, previousState.grid.cells);
        this.score      = previousState.score;
        this.loose      = previousState.loose;
        this.won        = previousState.won;
        this.continue   = previousState.continue;
    } else {
        this.grid       = new GridControl(this.size);
        this.score      = 0;
        this.loose      = false;
        this.won        = false;
        this.continue   = false;

        this.addStartTiles();
    }

    //    this.actualize();
};

/**
 * Génére aléatoirement des cases par rapport aux cases générée en début de partie
 */
GameControl.prototype.addStartTiles = function () {
    'use strict';
    var i;

    for (i = 0; i < this.startTiles; i += 1) {
        this.addRandomTiles();
    }
};

/**
 * Ajoute une case aléatoirement
 */
GameControl.prototype.addRandomTiles = function () {
    'use strict';
    log('addRandomTiles');
    var value,
        tile;
    if (this.grid.availableCells()) {
        // Si value est inférieur à 0.9 alors génére des tiles de valeur 2 sinon génére des tiles de valeur 4
        value = Math.random() < 0.9 ? 2 : 4;

        tile = new TileControl(this.grid.randomAvailableCells(), value);
        log(tile);
        //        this.grid.insertTile(tile);
    }
};