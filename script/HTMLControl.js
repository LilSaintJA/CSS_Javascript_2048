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
 * Gère l'interface du jeu côté front
 */
function HTMLControl() {
    'use strict';

    // Selecteur de div nécessaire pour le jeu
    this.tileContainer      = document.querySelector('.tuile-container');
    this.scoreContainer     = document.querySelector('.score');
    this.bestContainer      = document.querySelector('.best-container');
    this.msgContainer       = document.querySelector('.game-msg');

    this.score = 0;

}

/**
 * Actualise l'interface graphique du jeu
 * @param {object} grid     [[Description]]
 * @param {[[Type]]} metadata [[Description]]
 */
HTMLControl.prototype.actualize = function (grid, metadata) {
    'use strict';

    // Garde la référence à l'objet
    var self = this;

    // Efface les divs
    self.resetContainer(self.tileContainer);
    // Parcour les cellules de la grille
    grid.cells.forEach(function (column) {
        // Parcour les columns des cellules
        column.forEach(function (cell) {
            // ## Si il y a une cellule de dispo
            if (cell) {
                self.addTile(cell);
            }
        });
    });

    // Ajout des méthodes pour le score

    self.updateScore(metadata.score);

    if (metadata.finished) {
        if (metadata.loose) {
            self.msg(false);
        } else if (metadata.won) {
            self.msg(true);
        }
    }
};

/**
 * Méthode qui gère l'effacement des divs
 * @param {[[Type]]} container [[Description]]
 */
HTMLControl.prototype.resetContainer = function (container) {
    'use strict';
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
};

/**
 * Gère l'ajout d'une tile dans la grille HTML
 * @param {[[Type]]} tile [[Description]]
 */
HTMLControl.prototype.addTile = function (tile) {
    'use strict';

    // ## self garde la référence à l'objet que l'on appelle et pas à l'objet dans lequel on se trouve
    var self = this,
        tileWrapper = document.createElement("div"),
        tileInner = document.createElement("div"),
        position = tile.previousPosition || { x: tile.x, y: tile.y },
        classPosition = this.positionClass(position),
        classes = ['tile', 'tile-' + tile.value, classPosition];

    // Si le joueur fait 2048
    if (tile.value > 2048) {
        classes.push('tile-2048');
    }

    // ## Ajout de la classe .tile-inner à la div tileInner
    // ## .tile-inner contient la div avec la value
    tileInner.classList.add("tile-inner");
    // Ajout de la valeur de la tile dans le HTML
    tileInner.textContent = tile.value;

    // Si il y a déjà une position 
    if (tile.previousPosition) {
        // ## Récupère le 3ème index du tableau classes -> classPosition
        classes[2] = self.positionClass({ x: tile.x, y: tile.y });
        self.applyClasses(tileWrapper, classes);
        // ## Ou si il y un merge entre 2 tiles
    } else if (tile.mergedTile) {
        classes.push('tile-merged');
        this.applyClasses(tileWrapper, classes);

        // ## Pour les cases qui ont fusionnées
        tile.mergedTile.forEach(function (merged) {
            self.addTile(merged);
        });
        // ## Sinon charge une nouvelle tile avec la classe tile-new
    } else {
        classes.push('tile-new');
        this.applyClasses(tileWrapper, classes);
    }

    // ## Ajoute la div tileInner à la div tileWrapper
    tileWrapper.appendChild(tileInner);

    // ## Ajoute la div dans le DOM
    this.tileContainer.appendChild(tileWrapper);
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
    return { x: position.x + 1, y: position.y + 1 };
};

/**
 * Gère le nom de la classe à charger en fonction de la position de la tile sur la grille
 * @param {sring} position [Le nom de la class avec la position de x et y]
 */
HTMLControl.prototype.positionClass = function (position) {
    'use strict';
    position = this.normalizeClass(position);
    return 'tile-position-' + position.x + '-' + position.y;
};

/**
 * Permet d'appliquer les classes sur les éléments mis en paramètre
 * @param {object} ele     [L'éléement dont on veut récupère la classe]
 * @param {Array} classes [Tableaux contenant le nom des classes à ajouter]
 */
HTMLControl.prototype.applyClasses = function (ele, classes) {
    'use strict';
    // ## Récupère la classe des div, et réunit ces classes avec celle présente dans le tableau classes[] avec un espace
    ele.setAttribute('class', classes.join(" "));
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

    this.resetContainer(this.scoreContainer);

    var difference = score - this.score,
        addition;
    this.score = score;

    this.scoreContainer.innerHTML = this.score;

    if (difference > 0) {
        addition = document.createElement("div");
        addition.classList.add("score-addition");
        addition.textContent = '+' + difference;

        this.scoreContainer.append(addition);
    }
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
    var type    = won ? 'winner' : 'looser',
        message = won ? 'Gagné 2048 tu as' : 'Vaincu par 2048 tu es';

    this.msgContainer.classList.add(type);
    var test = document.querySelector('.msg');
    test.textContent = message;

};

/**
 * Efface les messages de fin de partie, gagnée ou perdu
 */
HTMLControl.prototype.resetMSG = function () {
    'use strict';
    this.msgContainer.classList.remove('winner');
    this.msgContainer.classList.remove('looser');
};