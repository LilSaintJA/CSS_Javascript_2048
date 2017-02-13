/*global console, $, jQuery, document, window, Tuile */

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

    for (x = 0; x < 5; x += 1) {
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
        tuile,
        tile;

    for (x = 0; x < 5; x += 1) {
        row = cells[x] = [];
        log(row);

        for (y = 0; y < this.size; y += 1) {
            tuile = state[x][y];
            log(tuile);
            if (tuile) {
                tile = new Tuile(tuile.position, tuile.value);
                log(tile);
            } else {
                return null;
            }
        }
    }
};