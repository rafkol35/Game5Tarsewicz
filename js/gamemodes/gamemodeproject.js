/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function GameModeProject(name) {
    GameMode.call(this, name);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    this.gui = new dat.GUI({
//        height: 5 * 32 - 1
//        autoPlace: false
    });
    var params = {
        project: 5000
    };
    this.gui.add(params, 'project');
    
    this.gui.domElement.id = 'guiProject';
    var customContainer = $('.moveGUI').append($(this.gui.domElement));
    
    //$(this.gui.domElement).attr("hidden", true);
}

GameModeProject.prototype = Object.create(GameMode.prototype);
GameModeProject.prototype.constructor = GameModeProject;

GameModeProject.prototype.f1 = function () {
    console.log("GameModeProject::f1 " + this.name);
};

GameModeProject.prototype.f2 = function () {
    console.log("GameModeProject::f2 " + this.name);
};

GameModeProject.prototype.getClearColor = function () {
    return 0x0000ff;
};

GameModeProject.prototype.activate = function(){
    console.log('activate project');
    $(this.gui.domElement).attr("hidden", false);
};
GameModeProject.prototype.deactivate = function(){
    console.log('deactivate project');
    $(this.gui.domElement).attr("hidden", true);
};
