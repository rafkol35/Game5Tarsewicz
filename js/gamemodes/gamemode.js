/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var GameMode = function (name) {
    this.name = name;
};

GameMode.prototype.f1 = function () {
    console.log("GameMode::f1 " + this.name);
};

GameMode.prototype.f2 = function () {
    console.log("GameMode::f2 " + this.name);
};
