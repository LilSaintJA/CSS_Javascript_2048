/*global console, $, jQuery, document, window */

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

    log('TuileContainer');
    log(this.tuileContainer);
    log(this.bestContainer);
}

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
    divInner.textContent = tile.value;
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
    divWrapper.appendTo(divInner);
    // Ajout de la case à la div .tuile-container
    this.tuileContainer.appendTo(divWrapper);
};

HTMLControl.prototype.applyClasses = function (ele, classes) {
    'use strict';
    ele.setAttribute('class', classes.join(" "));
};