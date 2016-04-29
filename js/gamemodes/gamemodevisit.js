/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function GameModeVisit(name) {
    GameMode.call(this, name);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    this.gui = new dat.GUI({
//        height: 5 * 32 - 1
//        autoPlace: false
    });
    var params = {        
        visit: 5000
    };
    this.gui.add(params, 'visit');
    
    var params2 = {
        visit2: 500,
    };
    this.gui.add(params2, 'visit2');
    
    this.gui.domElement.id = 'guiVisit';    
    var customContainer = $('.moveGUI').append($(this.gui.domElement));
    //$(this.gui.domElement).attr("hidden", true);
}

GameModeVisit.prototype = Object.create(GameMode.prototype);
GameModeVisit.prototype.constructor = GameModeVisit;

GameModeVisit.prototype.f1 = function () {
    console.log("GameModeVisit::f1 " + this.name);
};

GameModeVisit.prototype.getClearColor = function () {
    return 0xffff00;
};

GameModeVisit.prototype.activate = function(){
    console.log('activate visit');
    $(this.gui.domElement).attr("hidden", false);
};
GameModeVisit.prototype.deactivate = function(){
    console.log('deactivate visit');
    $(this.gui.domElement).attr("hidden", true);
};
