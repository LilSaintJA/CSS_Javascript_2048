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

    this.tuileContainer     = $('.tuile-container');
    this.scoreContainer     = $('.score-container');
    this.bestContainer      = $('.best-container');
    this.msgContainer       = $('.game-msg');

    this.score = 0;

    //    log('TuileContainer');
    //    log(this.tuileContainer);
    //    log(this.bestContainer);
}

/**
 * [[Description]]
 * @param {[[Type]]} grid     [[Description]]
 * @param {[[Type]]} metadata [[Description]]
 */
HTMLControl.prototype.refresh = function (grid, metadata) {
    'use strict';
    log('Je suis la');
    var self = this;
    window.requestAnimationFrame(function () {
        grid.cells.forEach(function (column) {
            column.forEach(function (cell) {
                if (cell) {
                    // Appel la méthode addTile
                    self.addTile(cell);
                }
            });
        });
    });
};

/**
 * [[Description]]
 * @param {object} tile [[Description]]
 */
HTMLControl.prototype.addTile = function (tile) {
    'use strict';
    log('Je suis dans addTile');

    var self = this,
        divWrapper = $('<div></div>'),
        divInner = $('<div></div>'),
        position = tile.previousPosition || { x: tile.x, y: tile.y },
        positionClass = this.positionClass(position),
        classes = ['tile', 'tile-' + tile.value, positionClass];

    if (tile.value > 2048) {
        classes.push('tile-2048');
    }

    this.applyClasses(divWrapper, classes);

    divInner.addClass('tile-inner');
    log(divInner);
    divInner.textContent = tile.value;
    divInner.text(tile.value);
    log(divInner);

    function callBackAnim() {
        classes[2] = self.positionClass({ x: tile.x, y: tile.y });
        // Mise à jour de la position
        self.applyClasses(divWrapper, classes);
    }

    if (tile.previousPosition) {
        window.requestAnimationFrame(callBackAnim());
    } else if (tile.mergedForm) {
        classes.push('tile-merged');
        this.applyClasses(divWrapper, classes);

        tile.mergedForm.forEach(function (merged) {
            self.addTile(merged);
        });
    } else {
        classes.push('tile-new');
        this.applyClasses(divWrapper, classes);
    }
    // Ajout de la partie interne de la case
    divWrapper.append(divInner);
    // Ajout de la case à la div .tuile-container
    this.tuileContainer.append(divWrapper);
};

/**
 * [[Description]]
 * @param {[[Type]]} ele     [[Description]]
 * @param {Array}    classes [[Description]]
 */
HTMLControl.prototype.applyClasses = function (ele, classes) {
    'use strict';
    ele.attr('class', classes.join(" "));
};

/**
 * [[Description]]
 * @param   {object} position [[Description]]
 * @returns {object} [[Description]]
 */
HTMLControl.prototype.normalizePosition = function (position) {
    'use strict';
    return { x: position.x + 1, y: position.y + 1 };
};

/**
 * [[Description]]
 * @param   {object} position [[Description]]
 * @returns {string} [[Description]]
 */
HTMLControl.prototype.positionClass = function (position) {
    'use strict';
    position = this.normalizePosition(position);
    return 'tile-position-' + position.x + '-' + position.y;
};