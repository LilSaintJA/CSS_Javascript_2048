/*global console, $, jQuery, document, window, GridControl */

/**
 * Fonction de débug
 * @param {data} D [La data à débuguer]
 */
function log(D) {
    'use strict';
    console.log(D);
}
/**
 * Gère l'interface du jeu du côté front
 */
function HTMLControl() {
    'use strict';
    log('Je suis le HTML Control');

    // Selecteur de div nécessaire pour le jeu
    this.tuileContainer     = $('.tuile-container');
    this.scoreContainer     = $('.score-container');
    this.bestContainer      = $('.best-container');
    this.msgContainer       = $('.game-msg');

    this.score = 0;

    this.addTile(this);

    //    log('TuileContainer');
    //    log(this.tuileContainer);
    //    log(this.bestContainer);
}

// *** Ajout de méthode à HTMLControl

/**
 * Gère l'ajout d'une tile dans la grille HTML
 * @param {[[Type]]} tile [[Description]]
 */
HTMLControl.prototype.addTile = function (tile) {
    'use strict';

    // self garde une référence vers "this" en cas de changement de scope
    var self = this,
        tileWrapper = $('<div></div>'),
        tileInner = $('<div></div>'),
        position = tile.previousPosition || { x: tile.x, y: tile.y },
        positionClass = this.positionClass(position);
    //    log('Objet courant');
    //    log(self);

    // Création des divs pour les tiles
};

/**
 * [[Description]]
 * @param   {object} position [[Description]]
 * @returns {object} [[Description]]
 */
HTMLControl.prototype.normalizeClass = function (position) {
    'use strict';
    log({ x: position.x + 1, y: position.y + 1 });
    return { x: position.x + 1, y: position.y + 1 };
};

/**
 * [[Description]]
 * @param {sring} position [Le nom de la class avec la position de x et y]
 */
HTMLControl.prototype.positionClass = function (position) {
    'use strict';
    position = this.normalizeClass(position);
    log('tile-position-' + position.x + '-' + position.y);
    return 'tile-position-' + position.x + '-' + position.y;
};