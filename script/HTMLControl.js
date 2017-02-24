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
    this.tileContainer      = $('.tuile-container');
    this.scoreContainer     = $('.score-container');
    this.bestContainer      = $('.best-container');
    this.msgContainer       = $('.game-msg');

    this.score = 0;

    //    this.addTile(this);

    //    log('TileContainer');
    //    log(this.tileContainer);
    //    log(this.bestContainer);
}

// *** Ajout de méthode à HTMLControl

/* -------------- */
/* *** TILE *** */
/* -------------- */

/**
 * Actualise l'interface graphique du jeu
 * @param {object} grid     [[Description]]
 * @param {[[Type]]} metadata [[Description]]
 */
HTMLControl.prototype.actualize = function (grid, metadata) {
    'use strict';

    // Garde la référence à l'objet
    var self = this;

    //    window.requestAnimationFrame(function () {
    // Efface les divs
    self.resetContainer(self.tileContainer);
    // Parcour les cellules de la grille
    grid.cells.forEach(function (column) {
        // Parcour les columns des cellules
        column.forEach(function (cell) {
            // ## Si il y a une cellule de dispo
            if (cell) {
                //                log('Cell HTMLControl');
                //                log(cell);
                self.addTile(cell);
            }
        });
    });

    // Ajout des méthodes pour le score
    //    });
};

/**
 * Gère l'ajout d'une tile dans la grille HTML
 * @param {[[Type]]} tile [[Description]]
 */
HTMLControl.prototype.addTile = function (tile) {
    'use strict';

    // self garde une référence vers "this" en cas de changement de scope
    // ## self garde la référence à l'objet que l'on appelle et pas à l'objet dans lequel on se trouve
    var self = this,
        tileWrapper = $('<div></div>'),
        tileInner = $('<div></div>'),
        position = tile.previousPosition || { x: tile.x, y: tile.y },
        classPosition = this.positionClass(position),
        classes = ['tile', 'tile-', tile.value, classPosition];
    //    log(classes);
    //    log('tile');
    //    log(tile);
    log('previousPosition');
    log(tile.previousPosition);

    // Si le joueur fait 2048
    if (tile.value > 2048) {
        classes.push('tile-2048');
    }

    // ## Ajout de la classe .tile-inner à la div tileInner
    // ## .tile-inner contient la div avec la value
    tileInner.addClass('tile-inner');
    //    log(tileInner.addClass('tile-inner'));
    // Ajout de la valeur de la tile dans le HTML
    tileInner.text(tile.value);

    // Si il y a déjà une position 
    if (tile.previousPosition) {
        //        window.requestAnimationFrame(function () {
        // ## Récupère le 3ème index du tableau classes -> tile.value
        classes[2] = self.positionClass({ x: tile.x, y: tile.y });
        self.applyClasses(tileWrapper, classes);
        //        });
        // Ou si il y un merge entre 2 tiles
    } else if (tile.mergedTile) {
        classes.push('tile-merged');
        this.applyClasses(tileWrapper, classes);

        // Rendu des cases qui ont fusionnées
        tile.mergedTile.forEach(function (merged) {
            self.addTile(merged);
        });
        // Sinon charge une nouvelle tile
    } else {
        log('Je passe dans le else');
        classes.push('tile-new');
        this.applyClasses(tileWrapper, classes);
    }

    // ## Ajoute la div tileInner à la div tileWrapper
    tileWrapper.append(tileInner);
    //    log(tileWrapper);

    // ## Ajoute la div dans le DOM
    this.tileContainer.append(tileWrapper);
};

/* -------------- */
/* *** CLASSE *** */
/* -------------- */

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
 * Gère le nom de la classe à charger en fonction de la position de la tile sur la grille
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
 * @param {Array} classes [Tableaux contenant le nom des classes à ajouter]
 */
HTMLControl.prototype.applyClasses = function (ele, classes) {
    'use strict';
    //    log('ApplyClasses');
    // ## Récupère la classe des div, et réunit ces classes avec celle présente dans le tableau classes[] avec un espace
    ele.attr('class', classes.join(" "));
};

/* -------------- */
/* *** SCORE *** */
/* -------------- */

/**
 * Gère le score 
 * @param {[[Type]]} score [[Description]]
 */
HTMLControl.prototype.updateScore = function (score) {
    'use strict';
};

/**
 * Gère l'affichage du meilleur score, si sauvegarder dans le localStorage
 * @param {[[Type]]} bestScore [[Description]]
 */
HTMLControl.prototype.updateBestScore = function (bestScore) {
    'use strict';
    this.bestContainer.text(bestScore);
};

/* -------------- */
/* *** MESSAGE *** */
/* -------------- */

/**
 * Gère l'affichage des messages en cas de victoire ou de défaite
 * @param {[[Type]]} won [[Description]]
 */
HTMLControl.prototype.msg = function (won) {
    'use strict';
    var type = won ? '2048' : 'looser',
        message = won ? 'Gagné 2048 tu as' : 'Vaincu par 2048 tu es';

    this.msgContainer.addClass(type);
    this.msgContainer.$('.msg').text(message);
};

HTMLControl.prototype.resetMSG = function () {
    'use strict';
    this.msgContainer.removeClass('2048');
    this.msgContainer.removeClass('looser');
};

/* -------------- */
/* *** PARTIE *** */
/* -------------- */

/**
 * [[Description]]
 * @param {[[Type]]} container [[Description]]
 */
HTMLControl.prototype.resetContainer = function (container) {
    'use strict';
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
};

/**
 * [[Description]]
 */
HTMLControl.prototype.continuePlay = function () {
    'use strict';
    this.resetContainer();
};