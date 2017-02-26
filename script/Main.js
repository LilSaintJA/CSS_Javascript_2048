/*global console, $, jQuery, Main, GameControl, KeyboardControl, HTMLControl, LocalStorageControl, GridControl */

// Appel de la class Main au chargement du DOM
$(Main);

function Main() {
    'use strict';
    console.log('jQuery Is Ready');
    // Instanciation de la class GameControl, qui appel les autres class du jeu
    var test = new GameControl(KeyboardControl, HTMLControl);
}
