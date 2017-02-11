/*global console, $, jQuery, document, window */
(function ($) {
    'use strict';

    /**
     * Fonction de débug
     * @param {data} D [La data à débuguer]
     */
    function log(D) {
        console.log(D);
    }

    log('Object Is Ready');

    /**
     * [[Description]]
     */
    function KeyboardInputManager() {
        // Appel de la méthode listen qui gére l'écouteur de touche clavier
        this.listen();
    }

    /**
     * Fonction qui écoute les touches du clavier
     */
    KeyboardInputManager.prototype.listen = function () {
        var map = {
            38: 0, // Touche UP
            39: 1, // Touche RIGHT
            40: 2, // Touche DOWN
            37: 3  // Touche LEFT
        };
        log('Je suis la clef');

        $(document).keydown(function (event) {

            // Rassemble les touches de ALT, CRTL, SHIFT
            var specialKey = event.altKey || event.ctrlKey || event.shiftKey,
                // Récupère la valeur des touches clavier initialiser dans l'objet map
                mapped = map[event.which];

            log(specialKey);

            //            if (mapped === 1) {
            //                log('Hello');
            //            }
            switch (mapped) {
                case 0:
                    log('Touch Up');
                    break;
                case 1:
                    log('Touch Right');
                    break;
                case 2:
                    log('Touch Down');
                    break;
                case 3:
                    log('Touch Left');
                    break;
            }
        });
    };

    // Instanciation de l'objet
    var test = new KeyboardInputManager();
    //    log(test.listen());
}(jQuery));