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
    this.storageControl     = new StorageControl();
    this.htmlControl        = new HTMLControl();

    // ## Nbr de tile générer en début de partie
    this.startTiles         = 2;

    // ## Appel des méthodes de mouvement
    this.keyControl.onEvent('move', this.moveGrid.bind(this));

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
        this.over       = previousState.over;
        this.won        = previousState.won;
        this.continue   = previousState.continue;
    } else {
        this.grid       = new GridControl(this.size);
        this.score      = 0;
        this.over       = false;
        this.won        = false;
        this.continue   = false;

        this.addStartTiles();
    }

    this.actualize();
};

/* ----------------- */
/* *** ADD TILES *** */
/* ----------------- */

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
    var value,
        tile;
    if (this.grid.cellsAvailable()) {
        // Si value est inférieur à 0.9 alors génére des tiles de valeur 2 sinon génére des tiles de valeur 4
        value = Math.random() < 0.9 ? 2 : 4;

        tile = new TileControl(this.grid.randomAvailableCells(), value);
        log(tile);
        this.grid.insertTile(tile);
    }
};

/**
 * [[Description]]
 */
GameControl.prototype.actualize = function () {
    'use strict';

    this.htmlControl.actualize(this.grid, {
        over: this.over
    });
    log(this.htmlControl);
};

/**
 * [[Description]]
 * @returns {object} [[Description]]
 */
GameControl.prototype.serialize = function () {
    'use strict';
    return {
        grid: this.grid.serialize()
    };
};

GameControl.prototype.prepareTiles = function () {
    'use strict';

    this.grid.eachCells(function (x, y, tile) {
        if (tile) {
            tile.mergedFrom = null;
            tile.savePosition();
        }
    });
};

/**
 * [[Description]]
 * @param {object} tile [[Description]]
 * @param {object} cell [[Description]]
 */
GameControl.prototype.moveTile = function (tile, cell) {
    'use strict';

    log(tile);
    log(cell);

    this.grid.cells[tile.x][tile.y] = null;
    this.grid.cells[cell.x][cell.y] = tile;
    //    log(tile);
    tile.updatePosition(cell);
    log('tile moveTile');
    log(tile.updatePosition(cell));
};

/**
 * [[Description]]
 * @param {[[Type]]} direction [[Description]]
 */
GameControl.prototype.moveGrid = function (direction) {
    'use strict';

    // Garde la référence à l'objet appelé
    var self = this,
        cell,
        tile,
        vector,
        traversals,
        moved = false;

    log('self');
    log(self);

    vector = this.getVector(direction);
    traversals = this.buildTraversals(vector);

    this.prepareTiles();

    traversals.x.forEach(function (x) {
        traversals.y.forEach(function (y) {
            // Récupère toutes les coordonées de x et y dans la grille
            cell = { x: x, y: y };
            log('cell moveGrid');
            log(cell);
            // Récupère la position de la tile dans la grille
            tile = self.grid.cellContent(cell);
            log('tile moveGrid');
            log(tile);

            // Si une tile est trouvé dans la grille
            if (tile) {
                log('Je passe dans la condition tile');
                log(tile);
                var positions = self.findFarthestPosition(cell, vector),
                    next = self.grid.cellContent(positions.next);
                //                log(positions);
                //                log(next);
                //                log('je suis la');
                self.moveTile(tile, positions.farthest);
                
                if (!self.positionEqual(cell, tile)) {
                    log('je passe dans la condition');
                    moved = true;
                }
            }

        });
    });
    if (moved) {
        this.addRandomTiles();
        this.actualize();
    }
};

/**
 * [[Description]]
 * @param   {[[Type]]} direction [[Description]]
 * @returns {[[Type]]} [[Description]]
 */
GameControl.prototype.getVector = function (direction) {
    'use strict';

    var map = {
        0: {x: 0, y: -1 }, // haut
        1: {x: 1, y: 0 }, // droite
        2: {x: 0, y: 1 }, // gauche
        3: {x: -1, y: 0 } // bas
    };

    return map[direction];
};

/**
 * [[Description]]
 * @param   {[[Type]]} vector [[Description]]
 * @returns {[[Type]]} [[Description]]
 */
GameControl.prototype.buildTraversals = function (vector) {
    'use strict';

    var traversals = { x: [], y: [] },
        pos;

    for (pos = 0; pos < this.size; pos += 1) {
        traversals.x.push(pos);
        traversals.y.push(pos);
    }

    if (vector.x === 1) {
        traversals.x = traversals.x.reverse();
    }
    if (vector.y === 1) {
        traversals.y = traversals.y.reverse();
    }
    return traversals;
};

/**
 * Trouve la position la plus éloignée de la tile
 * @param   {[[Type]]} cell   [[Description]]
 * @param   {[[Type]]} vector [[Description]]
 * @returns {object}   [[Description]]
 */
GameControl.prototype.findFarthestPosition = function (cell, vector) {
    'use strict';

    var previous;

    // ## L'instruction sera vérifiée aux moins une fois, qu'elle soit vraie ou pas
    do {
        previous = cell;
        cell = { x: previous.x + vector.x, y: previous.y + vector.y };
    } while (this.grid.withinBounds(cell) && this.grid.cellAvailable(cell));

    return {
        farthest: previous,
        next: cell
    };
};

/**
 * [[Description]]
 * @returns {[[Type]]} [[Description]]
 */
GameControl.prototype.movesAvailable = function () {
    'use strict';

    return this.grid.cellsAvailable() || this.tileMatchesAvailable();
};

GameControl.prototype.tileMatchesAvailable = function () {
    'use strict';

    // Garde la référence à l'objet appelé
    var self = this,
        tile,
        x,
        y,
        direction,
        vector,
        cell,
        other;

    for (x = 0; x < this.size; x += 1) {
        for (y = 0; y < this.size; y += 1) {
            tile = this.grid.cellContent({ x: x, y: y });
            log(tile);
            if (tile) {

                for (direction = 0; direction < 4; direction += 1) {
                    vector = self.getVector(direction);
                    cell = {x: x + vector.x, y: y + vector.y };

                    other = self.grid.cellContent(cell);

                    // Si les 2 tiles sont de la même valeur elles peuvent être fusionnées
                    if (other && other.value === tile.value) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
};

/**
 * [[Description]]
 * @param   {object}   first  [[Description]]
 * @param   {object}   second [[Description]]
 * @returns {[[Type]]} [[Description]]
 */
GameControl.prototype.positionEqual = function (first, second) {
    'use strict';
    //    log(first.x);
    //    log(second);
    return first.x === second.x && first.y === second.y;
};