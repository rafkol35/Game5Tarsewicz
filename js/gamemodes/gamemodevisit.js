/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function GameModeVisit(name, subject) {
  GameMode.call(this, name);
  
  this.subject = subject;
}

GameModeVisit.prototype = Object.create(GameMode.prototype);
GameModeVisit.prototype.constructor = GameModeVisit;

GameModeVisit.prototype.f1 = function(){
    console.log("GameModeVisit::f1 " + this.name);
};

//// Add a "sayGoodBye" method
//Student.prototype.sayGoodBye = function () {
//    console.log("Goodbye!");
//};