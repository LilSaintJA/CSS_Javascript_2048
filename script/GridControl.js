/*global console, $, jQuery, document, window, TileControl */

function log(D) {
    'use strict';
    console.log(D);
}

/**
 * Gestion du système de grille du jeu
 * @param {int} size [Taille de la grille, définit dans GameControl]
 */
function GridControl(size) {
    'use strict';
    log('Je suis le Grid Control');
    this.size = size;
    this.cells = this.startGame();
}

/* ------------------- */
/* *** STATE GAME *** */
/* ------------------- */

/**
 * Fonction qui créé la grille du jeu par rapport à une taille donnée (quand la grille est vide)
 * @returns {array} [Les cellules du jeu]
 */
GridControl.prototype.startGame = function () {
    'use strict';

    log('je suis dans StartGame');
    var cells = [],
        x,
        y,
        row;

    for (x = 0; x < this.size; x += 1) {
        row = cells[x] = [];
        for (y = 0; y < this.size; y += 1) {
            row.push(null);
        }
    }
    // Contient 4 tableaux qui contiennent chacun 4 index
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
    return this.availableCells().length;
};

/**
 * [[Description]]
 * @param   {[[Type]]} cell [[Description]]
 * @returns {[[Type]]} [[Description]]
 */
GridControl.prototype.cellAvailable = function (cell) {
    'use strict';
    return !this.cellOccupied(cell);
};

GridControl.prototype.cellOccupied = function (cell) {
    'use strict';
    return this.cellContent(cell);
};

/**
 * Gère le contenu des cellules
 * @param   {object}   cell [Les cellules de la grille]
 * @returns {array} [Renvoie null si il n'y a pas de tile dans la case, sinon renvoie la position de la tile dans la grille]
 */
GridControl.prototype.cellContent = function (cell) {
    'use strict';
    if (this.withinBounds(cell)) {
        return this.cells[cell.x][cell.y];
    }
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

GridControl.prototype.removeTile = function (tile) {
    'use strict';
    this.cells[tile.x][tile.y] = null;
};

/**
 * Détermine les limites des cellules de la grille
 * @param {object} position [La position des cellules dans la grille]
 */
GridControl.prototype.withinBounds = function (position) {
    'use strict';

    if (position.x >= 0 && position.x < this.size && position.y >= 0 && position.y < this.size) {
        return {
            x: position.x,
            y: position.y
        };
    }
    //    return position.x >= 0 && position.x < this.size &&
    //        position.y >= 0 && position.y < this.size;
};

/**
 * [[Description]]
 * @returns {object} [[Description]]
 */
GridControl.prototype.serialize = function () {
    'use strict';

    var cellState = [],
        x,
        y,
        row;

    for (x = 0; x < this.size; x += 1) {
        row = cellState[x] = [];

        for (y = 0; y < this.size; y += 1) {
            row.push(this.cells[x][y] ? this.cells[x][y].serialize() : null);
        }
    }
    return {
        size: this.size,
        cells: cellState
    };
};
