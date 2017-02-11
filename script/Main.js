/*global console, $, jQuery, Main, GameControl, KeyboardControl, HTMLControl, LocalStorageControl, GridControl */

// Appel de la class Main au chargement du DOM
$(Main);

function Main() {
    'use strict';
    console.log('jQuery Is Ready');
    var game = new GameControl(4, KeyboardControl, HTMLControl, LocalStorageControl),
        grid = new GridControl();
    // Instanciation de la class GameControl, qui prend en param les autres class du jeu
}
