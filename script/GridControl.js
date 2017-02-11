/*global console, $, jQuery, document, window */

function log(D) {
    'use strict';
    console.log(D);
}

/**
 * Gestion du système de grille du jeu
 * @param {[[Type]]} size          [[Description]]
 * @param {[[Type]]} previousState [[Description]]
 */
function GridControl(size, previousState) {
    'use strict';
    console.log('Je suis le Grid Control');
    this.size = size;
    this.cells = previousState ? this.fromState(previousState) : this.empty();

    //    console.log(this.cells);
}

/**
 * Fonction qui créé la grille du jeu par rapport à une taille donnée
 * @returns {array} [Les cellules du jeu]
 */
GridControl.prototype.empty = function () {
    'use strict';
    //Déclaration du tableau de cellule
    var cells = ['prout'],
        x,
        y,
        row;

    for (x = 0; x < 5; x += 1) {
        // Chaque ligne sur l'axe des x contient une cellule du tableau
        row = cells[x] = [];
        log(row);

        for (y = 0; y < this.size; y += 1) {
            row.push(null);
        }
    }
    log(cells);
    return cells;
};