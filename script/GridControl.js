/*global console, $, jQuery, document, window, TileControl */

function log(D) {
    'use strict';
    console.log(D);
}

/**
 * Gestion du système de grille du jeu
 * @param {int} size          [[Description]]
 * @param {bool} previousState [[Description]]
 */
function GridControl(size, previousState) {
    'use strict';
    log('Je suis le Grid Control');
    this.size = size;
    this.cells = previousState ? this.fromState(previousState) : this.empty();
}

/* ------------------- */
/* *** STATE GAME *** */
/* ------------------- */

/**
 * Fonction qui créé la grille du jeu par rapport à une taille donnée (quand la grille est vide)
 * @returns {array} [Les cellules du jeu]
 */
GridControl.prototype.empty = function () {
    'use strict';

    var cells = [],
        x,
        y,
        row;

    for (x = 0; x < this.size; x += 1) {
        row = cells[x] = [];
        //        log(row);
        for (y = 0; y < this.size; y += 1) {
            row.push(null);
        }
    }
    //    log(cells);
    // Contient 4 tableaux qui contiennent 4 index
    return cells;
};

/**
 * [[Description]]
 * @param   {[[Type]]} state [[Description]]
 * @returns {array} [Tableau contenant les lignes et le colonnes de la grille]
 */
GridControl.prototype.fromState = function (state) {
    'use strict';

    var cells = [],
        x,
        y,
        row,
        tile;

    for (x = 0; x < this.size; x += 1) {
        row = cells[x] = [];

        for (y = 0; y < this.size; y += 1) {
            tile = state[x][y];
            log(tile);
            row.push(tile ? new TileControl(tile.position, tile.value) : null);
        }
    }
    //    log(cells);
    return cells;
};

/* ------------------- */
/* *** CELLULES *** */
/* ------------------- */

/**
 * Génére les cellules de la grille
 * @returns {array} [Retourne un objet pour chaque cellule de la grille]
 */
GridControl.prototype.randomAvailableCells = function () {
    'use strict';

    var cells = this.availableCells();

    // Si cells à une longueur
    if (cells.length) {
        log(cells[Math.floor(Math.random() * cells.length)]);
        // Génére aléatoirement un nombre compris entre 0 et 3
        return cells[Math.floor(Math.random() * cells.length)];
    }
};

/**
 * Gère les cellules disponibles
 * @returns {array} [Contient un objet pour chaque cellules]
 */
GridControl.prototype.availableCells = function () {
    'use strict';

    var cells = [];

    this.eachCells(function (x, y, tile) {
        // Si c'est différent de null
        if (!tile) {
            cells.push({ x: x, y: y});
        }
    });
    //    log(cells);
    return cells;
};

/**
 * [[Description]]
 * @param {[function} callback [Une fonction de rappel]
 */
GridControl.prototype.eachCells = function (callback) {
    'use strict';
    var x,
        y;

    for (x = 0; x < this.size; x += 1) {
        for (y = 0; y < this.size; y += 1) {
            callback(x, y, this.cells[x][y]);
        }
    }
};

/**
 * [[Description]]
 * @returns {[[Type]]} [[Description]]
 */
GridControl.prototype.cellsAvailable = function () {
    'use strict';
    return !!this.availableCells().length;
};

/* --------------------- */
/* *** TILE SETTINGS *** */
/* --------------------- */

/**
 * Ajoute une tile à la position définit dans la methode addRandomTile -> GameControl()
 * @param {object} tile [[Description]]
 */
GridControl.prototype.insertTile = function (tile) {
    'use strict';
    this.cells[tile.x][tile.y] = tile;
};