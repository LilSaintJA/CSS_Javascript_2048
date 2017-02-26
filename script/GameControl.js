/*global console, $, jQuery, document, window, GridControl, Grid, TileControl, KeyboardControl, HTMLControl */

/**
 * Fonction de débug
 * @param {data} D [La data à débuguer]
 */
function log(D) {
    'use strict';
    console.log(D);
}
/**
 * Gestionnaire du jeu
 * @param {object} KeyControl  [Objet qui gère le déplacement par le clavier]
 * @param {object} HTMLControl [Class qui gère l'interface graphique du jeu]
 */
function GameControl(KeyControl, HTMLControl) {
    'use strict';

    // ## Taille de la grille
    this.size               = 4;
    this.keyControl         = new KeyControl(); // KeyboardControl
    this.htmlControl        = new HTMLControl(); // HTMLControl

    // ## Nbr de tile générée en début de partie
    this.startTiles         = 2;

    // ## Appel de la méthode pour déplacer les tile
    this.keyControl.onEvent('move', this.moveGrid.bind(this));
    this.keyControl.onEvent('retry', this.restart.bind(this));
    this.keyControl.onEvent('continue', this.continue.bind(this));

    // ## Appel de la méthode setup
    this.setup();
}

/* -------------- */
/* *** INIT *** */
/* -------------- */

/**
 * Instancie et ajoute des propriétés nécessaire à la gestion du jeu
 * e.g -> la grille, le score, etc...
 * la méthode est appelés dans le constructeur
 */
GameControl.prototype.setup = function () {
    'use strict';

    this.grid       = new GridControl(this.size);
    this.score      = 0;
    this.loose      = false;
    this.won        = false;
    this.continue   = false;

    this.addStartTiles();

    this.actualize();
};

/* ----------------- */
/* *** ADD TILES *** */
/* ----------------- */

/**
 * Génére des tiles en fonction du nbr définit dans le constructeur
 * Appel la méthode addRandomTiles() tant que la boucle vaut true
 */
GameControl.prototype.addStartTiles = function () {
    'use strict';
    var i;

    for (i = 0; i < this.startTiles; i += 1) {
        this.addRandomTiles();
    }
};

/**
 * Génére aléatoirement la valeur de la tile 
 * Soit 2, soit 4
 * Gère l'ajout des tiles sur l'écran de jeu
 */
GameControl.prototype.addRandomTiles = function () {
    'use strict';
    var value,
        tile;
    if (this.grid.cellsAvailable()) {
        // Si value est inférieur à 0.9 alors génére des tiles de valeur 2 sinon génére des tiles de valeur 4
        value = Math.random() < 0.9 ? 2 : 4;

        tile = new TileControl(this.grid.randomAvailableCells(), value);
        this.grid.insertTile(tile);
    }
};

/**
 * Actualise l'écran de jeu
 * Si la partie est sauvegarder dans le localStorage
 * Alors on pourrait récupère les valeurs pour les afficher à l'écran
 */
GameControl.prototype.actualize = function () {
    'use strict';

    this.htmlControl.actualize(this.grid, {
        score: this.score,
        loose: this.loose,
        won: this.won,
        finished: this.gameFinish()
    });
};

/**
 * Gère la fin de partie
 * @returns {boolean} true 
 * [Si le joueur à perdu ou si le joueur à gagnée && qu'il ne continue pas la partie]
 */
GameControl.prototype.gameFinish = function () {
    'use strict';
    if (this.loose || (this.won && !this.continue)) {
        return true;
    }
};

/**
 * Redémarre le jeu
 * resetMSG() -> efface les msgs de fin de partie
 * Rappel la méthode setup()
 */
GameControl.prototype.restart = function () {
    'use strict';
    this.htmlControl.resetMSG();
    this.setup();
};

/**
 * Continue la partie après avoir fait 2048
 * On passe la propriété à true signifiant que le jeu continue
 */
GameControl.prototype.continue = function () {
    'use strict';
    this.continue = true;
    this.htmlControl.resetMSG();

};

/**
 * Sauvegarde les informations de positions des tiles
 * Supprime les informations de fusions
 * x et y sont définit dans la méthode de l'objet GridControl
 */
GameControl.prototype.prepareTiles = function () {
    'use strict';

    this.grid.eachCells(function (x, y, tile) {
        if (tile) {
            tile.mergedTile = null;
            tile.savePosition();
        }
    });
};

/**
 * Gère les déplacements des cases
 * @param {object} tile [[Description]]
 * @param {object} cell [[Description]]
 */
GameControl.prototype.moveTile = function (tile, cell) {
    'use strict';

    this.grid.cells[tile.x][tile.y] = null;
    this.grid.cells[cell.x][cell.y] = tile;
    tile.updatePosition(cell);
};

/**
 * Gère le déplacement de la case choisi par le joueur
 * en fonction de la direction choisi
 * @param {number} direction [Direction choisit par le joueur
 *                           voir KeyboardControl pour les références de valeur]
 */
GameControl.prototype.moveGrid = function (direction) {
    'use strict';
    // ## 0: up, 1: right, 2: down, 3: left
    // ## self garde la référence à l'objet appelé
    var self = this,
        cell,
        tile,
        vector,
        traversals,
        moved = false;

    vector          = this.getVector(direction);
    traversals      = this.buildTraversals(vector);

    this.prepareTiles();

    traversals.x.forEach(function (x) {
        traversals.y.forEach(function (y) {
            // Récupère toutes les coordonées de x et y dans la grille
            cell = { x: x, y: y };
            // Récupère la position de la tile dans la grille
            tile = self.grid.cellContent(cell);

            // Si une tile est trouvé dans la grille
            if (tile) {
                var positions = self.findFarthestPosition(cell, vector),
                    next = self.grid.cellContent(positions.next),
                    merged;
                // Si next est définit et que la valeur de next et égale à la valeur de la tile 
                // alors on merge les tiles et on multiplie la valeur par 2
                if (next && next.value === tile.value && !next.mergedTile) {
                    merged = new TileControl(positions.next, tile.value * 2);
                    merged.mergedTile = [tile, next];

                    // ## On insert une tile qui correspond à la nouvelle valeur de merged
                    self.grid.insertTile(merged);
                    self.grid.removeTile(tile);

                    tile.updatePosition(positions.next);

                    // Met à jour le score par rapport à la valeur de la tile merge
                    self.score = self.score + merged.value;
                } else {
                    self.moveTile(tile, positions.farthest);
                }

                // Si la position de la cellule est différente de la position de la tile
                if (!self.positionEqual(cell, tile)) {
                    moved = true; // La case est déplacée de son point d'origine
                }
            }

        });
    });

    if (moved === true) {
        this.addRandomTiles();

        // Si la grille est remplie, alors la partie est perdu
        if (!this.movesAvailable()) {
            this.loose = true;
        }
        this.actualize();
    }
};

/**
 * Renvoie le vecteur représentant la direction choisit
 * @param   {number} direction [La direction choisit par le joueur]
 * @returns {Array}  [Représente la touche appuyé
 *                   et définit dans KeyboardControl]
 */
GameControl.prototype.getVector = function (direction) {
    'use strict';

    var map = {
        0: {x: 0, y: -1 }, // haut
        1: {x: 1, y: 0 }, // droite
        2: {x: 0, y: 1 }, // bas
        3: {x: -1, y: 0 } // gauche
    };
    return map[direction];
};

/**
 * Construit une liste de position à parcourir dans un ordre déterminée
 * @param   {number} vector [Représente une valeur à comparer]
 * @returns {object} [Contient x et y qui sont remplit avec les valeurs de pos]
 */
GameControl.prototype.buildTraversals = function (vector) {
    'use strict';

    var traversals = { x: [], y: [] },
        pos;

    for (pos = 0; pos < this.size; pos += 1) {
        traversals.x.push(pos);
        traversals.y.push(pos);
    }

    if (vector.x === 1) {
        traversals.x = traversals.x.reverse();
    }
    if (vector.y === 1) {
        traversals.y = traversals.y.reverse();
    }
    return traversals;
};

/**
 * Trouve la position la plus éloignée de la tile
 * @param   {object} cell   [[Description]]
 * @param   {[[Type]]} vector [[Description]]
 * @returns {object}   [[Description]]
 */
GameControl.prototype.findFarthestPosition = function (cell, vector) {
    'use strict';

    var previous;

    // ## L'instruction sera vérifiée aux moins une fois, qu'elle soit vraie ou pas
    do {
        previous = cell;
        cell = { x: previous.x + vector.x, y: previous.y + vector.y };
    } while (this.grid.withinBounds(cell) &&
             this.grid.cellAvailable(cell));
    
    return {
        farthest: previous, // La position la plus éloignée
        next: cell // utilisé pour vérifier si une fusion est nécessaire
    };
};

/**
 * Il y a t'il un mouvement possible
 * @returns {[[Type]]} [[Description]]
 */
GameControl.prototype.movesAvailable = function () {
    'use strict';

    return this.grid.cellsAvailable() || this.tileMatchesAvailable();
};

/**
 * Gère les disponibles
 * pour les déplacement ainsi que pour les fusions
 * @returns {boolean} [Renvoie true si les tiles peuvent être fusionnés, sinon false]
 */
GameControl.prototype.tileMatchesAvailable = function () {
    'use strict';

    // self garde la référence à l'objet appelé
    var self = this,
        tile,
        x,
        y,
        direction,
        vector,
        cell,
        other;

    for (x = 0; x < this.size; x += 1) {
        for (y = 0; y < this.size; y += 1) {
            tile = this.grid.cellContent({ x: x, y: y });
            
            if (tile) {
                for (direction = 0; direction < this.size; direction += 1) {
                    vector = self.getVector(direction);
                    cell = { x: x + vector.x, y: y + vector.y };

                    other = self.grid.cellContent(cell);

                    // Si les 2 tiles sont de la même valeur elles peuvent être fusionnées
                    if (other && other.value === tile.value) {
                        return true; // Les deux tiles peuvent être fusionnés
                    }
                }
            }
        }
    }
    return false;
};

/**
 * Vérifie si la position des cases est égal à la postion des tiles
 * @param   {object}   first  [[Description]]
 * @param   {object}   second [[Description]]
 * @returns {[[Type]]} [[Description]]
 */
GameControl.prototype.positionEqual = function (first, second) {
    'use strict';
    return first.x === second.x && first.y === second.y;
};