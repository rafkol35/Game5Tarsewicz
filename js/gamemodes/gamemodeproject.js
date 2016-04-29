/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function GameModeProject(name, subject) {
  GameMode.call(this, name);
  
  this.subject = subject;
}

GameModeProject.prototype = Object.create(GameMode.prototype);
GameModeProject.prototype.constructor = GameModeProject;

GameModeProject.prototype.f1 = function(){
    console.log("GameModeVisit::f1 " + this.name);
};

GameModeProject.prototype.f2 = function () {
    console.log("GameModeProject::f2 " + this.name);
};
