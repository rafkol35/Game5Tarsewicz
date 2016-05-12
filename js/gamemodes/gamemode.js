/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var GameMode = function (name) {
    this.name = name;    
    this.scene = null;
    this.camera = null;
};

GameMode.prototype.getClearColor = function () {
    return 0xffffff;
};

GameMode.prototype.render = function(renderer){
    renderer.setClearColor(this.getClearColor());
    renderer.render(this.scene, this.camera);
};

GameMode.prototype.activate = function(){};
GameMode.prototype.deactivate = function(){};

GameMode.prototype.mouseMove = function(event){};

GameMode.prototype.mouseDown = function(event){};
GameMode.prototype.mouseUp = function(event){};

GameMode.prototype.keyDown = function(event){};
GameMode.prototype.keyUp = function(event){};

GameMode.prototype.onWindowResize = function(){};