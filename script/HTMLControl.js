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
        classPosition = this.positionClass(position),
        classes = ['tile', 'tile-', tile.value, classPosition];
    //    log('Objet courant');
    //    log(self);
    log(classes);
    log('previousPosition');
    log(tile.previousPosition);

    // Si le joueur fait 2048
    if (tile.value > 2048) {
        classes.push('tile-2048');
    }

    // ## Ajout de la classe .tile-inner à la div tileInner
    // ## .tile-inner contient la div avec la value
    tileInner.addClass('tile-inner');
    log(tileInner.addClass('tile-inner'));
    // Ajout de la valeur de la tile dans le HTML
    tileInner.text(tile.value);

    if (tile.previousPosition) {
        window.requestAnimationFrame(function () {
            // ## Récupère le 3ème index du tableau classes -> tile.value
            classes[2] = self.positionClass({ x: tile.x, y: tile.y });
            self.applyClasses(tileWrapper, classes);
        });
    } else if (tile.mergedTile) {
        classes.push('tile-merged');
        this.applyClasses(tileWrapper, classes);

        // Rendu des cases qui ont fusionnées
        tile.mergedTile.forEach(function (merged) {
            self.addTile(merged);
        });
    } else {
        log('Je passe dans le else');
        classes.push('tile-new');
        this.applyClasses(tileWrapper, classes);
    }

    // ## Ajoute la div tileInner à la div tileWrapper
    tileWrapper.append(tileInner);
    //    log(tileWrapper);

    // ## Ajoute la div dans le DOM
    this.tuileContainer.append(tileWrapper);
};

/**
 * [[Description]]
 * @param   {object} position [[Description]]
 * @returns {object} [[Description]]
 */
HTMLControl.prototype.normalizeClass = function (position) {
    'use strict';
    //    log({ x: position.x + 1, y: position.y + 1 });
    return { x: position.x + 1, y: position.y + 1 };
};

/**
 * [[Description]]
 * @param {sring} position [Le nom de la class avec la position de x et y]
 */
HTMLControl.prototype.positionClass = function (position) {
    'use strict';
    position = this.normalizeClass(position);
    //    log('tile-position-' + position.x + '-' + position.y);
    return 'tile-position-' + position.x + '-' + position.y;
};

/**
 * Permet d'appliquer les classes élément mis en paramètre
 * @param {object} ele     [L'éléement dont on veut récupère la classe]
 * @param {Array}    classes [Tableaux contenant le nom des classes à ajouter]
 */
HTMLControl.prototype.applyClasses = function (ele, classes) {
    'use strict';
    log('ApplyClasses');
    // ## Récupère la classe des div, et réunit ces classes avec celle présente dans le tableau classes[] avec un espace
    ele.attr('class', classes.join(" "));
    log(typeof ele);
};