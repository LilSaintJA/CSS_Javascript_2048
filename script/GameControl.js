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

    log(this.keyControl);
    //    log(this.inputControl.on("move", this.move(this)));
    //    this.keyControl.on("move", this.move.bind(this));

    this.setup();
}

// ---- Init du jeu

/**
 * Permet d'instancier les methodes utiles au démarrage du jeu
 * Ou à la recharge du jeu si une partie est présente dans le localStorage
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
        log(this.grid);

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
        // Methode randomAvailableCells qui appartient à GridControl
        tile = new TileControl(this.grid.randomAvailableCells(), value);
        // Me log la position et la valeur des tiles générer automatiquement
        log(tile);

        this.grid.insertTile(tile);
    }
};

/**
 * [[Description]]
 */
GameControl.prototype.refresh = function () {
    'use strict';

    this.htmlControl.refresh(this.grid, {
        score: this.score,
        over: this.over
    });
};

/**
 * Renvoie la position représentant la position choisit
 * @param   {[[Type]]} direction [[Description]]
 * @returns {array} [[Description]]
 */
GameControl.prototype.getPosition = function (direction) {
    'use strict';

    // Position représentant le mouvement de la case
    var map = {
        // Haut
        0: {
            x: 0,
            y: -1
        },
        // Droite
        1: {
            x: 1,
            y: 0
        },
        // Bas
        2: {
            x: 0,
            y: 1
        },
        // Gauche
        3: {
            x: -1,
            y: 0
        }
    };
    //    log('Je suis le map[direction]'); // Undefined
    //    log(map[direction]);
    return map[direction];
};

/**
 * Liste de position à parcourir dans un ordre déterminé
 * @param   {object}   position [[Description]]
 * @returns {[[Type]]} [[Description]]
 */
GameControl.prototype.buildTraversals = function (position) {
    'use strict';

    var i,
        traversals = { x: [], y: [] };
    //    log(traversals);

    for (i = 0; i < this.size; i += 1) {
        traversals.x.push(i);
        //        log(traversals.x.push(i));
        traversals.y.push(i);
        //        log(traversals.y.push(i));
    }
    // ## On commence toujours à partir de la case la plus éloignée de la direction choisie
    // Renverse l'emplacement des éléments dans le tableau
    // ## Les derniers deviennent les 1ers et les 1ers les derniers
    if (position.x === 1) {
        traversals.x = traversals.x.reverse();
    }
    if (position.y === 1) {
        traversals.y = traversals.y.reverse();
    }
    //    log('Je suis traversals, dans buildTraversals');
    //    log(traversals);
    return traversals;
};

/**
 * [[Description]]
 * @param {[[Type]]} direction [[Description]]
 */
GameControl.prototype.move = function (direction) {
    'use strict';
    // 0: up, 1: right, 2: down, 3: left

    var tile,
        cell,
        vector = this.getPosition(direction),
        traversals = this.buildTraversals(vector);
    //    log('Je suis Vector');
    //    log(vector);
    //    log(traversals);
};