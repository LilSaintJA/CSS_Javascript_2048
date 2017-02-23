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

/**
 * Fonction qui créé la grille du jeu par rapport à une taille donnée (quand la grille est vide)
 * @returns {array} [Les cellules du jeu]
 */
GridControl.prototype.empty = function () {
    'use strict';
    //Déclaration du tableau de cellule
    var cells = [],
        x,
        y,
        row;

    for (x = 0; x < this.size; x += 1) {
        // Chaque ligne sur l'axe des x contient une cellule du tableau
        row = cells[x] = [];
        //        log(row);

        for (y = 0; y < this.size; y += 1) {
            row.push(null);
        }
    }
    //    log(cells);
    return cells;
};

/**
 * [[Description]]
 * @param   {[[Type]]} state [[Description]]
 * @returns {[[Type]]} [[Description]]
 */
GridControl.prototype.fromState = function (state) {
    'use strict';
    log('Je suis dans fromState');

    var cells = [],
        x,
        y,
        row,
        tile;

    for (x = 0; x < this.size; x += 1) {
        row = cells[x] = [];
        //        log('row');
        //        log(row);

        for (y = 0; y < this.size; y += 1) {
            tile = state[x][y];
            log(tile);
            //            if (tile) {
            //                row.push(tile = new Tuile(tile.position, tile.value));
            //                log(tile);
            //            } else {
            //                return null;
            //            }
            row.push(tile ? new TileControl(tile.position, tile.value) : null);
        }
    }
    return cells;
};

GridControl.prototype.randomAvailableCells = function () {
    'use strict';

    var cells = this.availableCells();
    // ## Débug log -> vaut tjrs 16 et 15
    log('cells.length');
    log(cells.length);

    if (cells.length) {
        return cells[Math.floor(Math.random() * cells.length)];
    }
};

/**
 * Fonction qui gère les cellules disponibles
 * @returns {array} [Le tableau contenant toutes les cellules]
 */
GridControl.prototype.availableCells = function () {
    'use strict';
    var cells = [];
    this.eachCell(function (x, y, tile) {
        // Tile renvoie null
        if (!tile) {
            // Renvoie true 2 fois pour chaque axe
            cells.push({x: x, y: y});
            //            log(cells.push({x: x, y: y}));
        }
    });
    //    log(cells);
    return cells;
};

/**
 * Fonction de rappel pour les cases
 * @param {function} callback [callback fait référence à la méthode appelée dans availableCells]
 */
GridControl.prototype.eachCell = function (callback) {
    'use strict';
    var x,
        y;
    //    log(callback);
    // Tourne une fois pour l'axe des x
    for (x = 0; x < this.size; x += 1) {
        // Tourne une fois pour l'axe des y
        for (y = 0; y < this.size; y += 1) {
            callback(x, y, this.cells[x][y]);
            // ## Debug log -> renvoie undefined
            //            log(callback(x, y, this.cells[x][y]));
        }
    }
};

/**
 * Vérifie si il y a des cases de disponibles
 * @returns {object} [[Description]]
 */
GridControl.prototype.cellsAvailable = function () {
    'use strict';
    log(!!this.availableCells().length);
    return !!this.availableCells().length;
};

/**
 * Ajoute une case
 * @param {object} tile [[Description]]
 */
GridControl.prototype.insertTile = function (tile) {
    'use strict';
    this.cells[tile.x][tile.y] = tile;
};