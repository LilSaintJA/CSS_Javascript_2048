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
 * [[Description]]
 * @param {[[Type]]} position [[Description]]
 * @param {[[Type]]} value    [[Description]]
 */
function TileControl(position, value) {
    'use strict';
    log('Je suis le TileControl');

    this.x = position.x;
    this.y = position.y;
    this.value = value || 2;

    this.previousPosition = null;
    this.mergedTile = null;

    //    log(this.x);
    //    log(this.y);
}

/**
 * Sauvegarde la position de la tile
 */
TileControl.prototype.savePosition = function () {
    'use strict';
    // ## Syntaxe d'initialisateur d'object
    // ## x -> la clef
    // ## this.x -> la valeur
    // ## Débug console navigateur -> x et y sont undefined
    this.previousPosition = { x: this.x, y: this.y };
};

/**
 * Met à jour la position de la tile
 * @param {object} position [[Description]]
 */
TileControl.prototype.updatePosition = function (position) {
    'use strict';
    log('Mise à jour des position');
    this.x = position.x;
    this.y = position.y;
};

/**
 * [[Description]]
 * @returns {object} [[Description]]
 */
TileControl.prototype.serialize = function () {
    'use strict';
    // Débug console navigateur
    // ## Object qui contient l'object position avec comme clef x et y et comme valeur undefined
    // ## Contient value qui est undefined
    //    log({ position: { x: this.x, y: this.y }, value: this.value });
    return {
        position: {
            x: this.x,
            y: this.y
        },
        value: this.value
    };
};
