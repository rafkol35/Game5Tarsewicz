var Pos = function () {
    this.X = 0.0;
    this.Y = 0.0;
    this.Z = 0.0;    
};

var Rot = function () {
    this.X = 0;
    this.Y = 0;
    this.Z = 0;    
};

var Scale = function () {
    this.X = 0.0;
    this.Y = 0.0;
    this.Z = 0.0;    
};

var Texture = function(){
    this.File = '';
    this.RepeatX = 1;
    this.RepeatY = 1;
};

var WallData = function () {
    this.Pos = new Pos();
    this.Rot = new Rot();
    this.Scale = new Scale();
    this.Color = "#000000";    
    this.Texture = new Texture();
    this.Texture.File = '';
};

var PGUIData = function (game) {
    this.game = game;
    this.wd = new WallData();
    
    this.AddWall = function(){
        game.addWall();        
    };
    
    this.RemoveSelectedWall = function(){
        game.removeSelectedWall();
    };
    
    this.DuplicateSelectedWall = function(){
        game.duplicateSelectedWall();
    };
};

var selObjPosChanged = function (val) {
    if( gameModeProject.selectedWall === null ) return;
    switch(this.property){
        case "X":
            gameModeProject.selectedWall.position.x = val * gameModeProject.gridStep;
            break;
        case "Y":
            gameModeProject.selectedWall.position.y = val * gameModeProject.gridStep;
            break;
        case "Z":
            gameModeProject.selectedWall.position.z = val * gameModeProject.gridStep;
            break;
    }
    gameModeProject.draggedIndicator.position.x = gameModeProject.selectedWall.position.x;
    gameModeProject.draggedIndicator.position.z = gameModeProject.selectedWall.position.z;
};

var selObjRotChanged = function (val) {
    if( gameModeProject.selectedWall === null ) return;
    
    var newRot = gameModeProject.selectedWall.rotation;
    var rad = THREE.Math.degToRad(val);
    
    switch(this.property){
        case "X":
            newRot.x = rad;
            break;
        case "Y":
            newRot.y = rad;
            break;
        case "Z":
            newRot.z = rad;
            break;
    }
    gameModeProject.selectedWall.rotation = newRot;
    
    var axesRot = gameModeProject.draggedIndicator.rotation;
    //axesRot.x = 0;
    //axesRot.z = 0;
    //axesRot.y = newRot.y;
    axesRot.z = newRot.y;
    //console.log(axesRot.y);
    gameModeProject.draggedIndicator.rotation = axesRot.clone();
};

var selObjScaleChanged = function (val) {
    if( gameModeProject.selectedWall === null ) return;
    switch(this.property){
        case "X":            
            gameModeProject.selectedWall.scale.x = val;
            break;
        case "Y":
            gameModeProject.selectedWall.scale.y = val;
            break;
        case "Z":
            gameModeProject.selectedWall.scale.z = val;
            break;
    }
};

var selObjColorChanged = function(val){
    if( gameModeProject.selectedWall === null ) return;
    gameModeProject.selectedWall.material.color = new THREE.Color(val);
}

var selObjTextureChanged = function(val){
    if( gameModeProject.selectedWall === null ) return;
    
    var currentMaterial = gameModeProject.selectedWall.material;
    
    if( val !== "" ){
        var newTexture = gameModeProject.textures[val].clone();
        newTexture.needsUpdate = true;        
        currentMaterial.map = newTexture; //  new THREE.TextureLoader().load('textures/' + val + '.png');    
        currentMaterial.needsUpdate = true;
        
        //newMaterial.map.wrapS = THREE.RepeatWrapping;
        //newMaterial.map.wrapT = THREE.RepeatWrapping;
        //newMaterial.map.repeat = new THREE.Vector2(5,5);
        
    }else{
        currentMaterial.map = null; //  new THREE.TextureLoader().load('textures/' + val + '.png');    
        currentMaterial.needsUpdate = true;
    }
};

var selObjTexRepeatXChanged = function(val){
    if( gameModeProject.selectedWall === null ) return;
    
    var curMat = gameModeProject.selectedWall.material;
    var curMap = curMat.map;
    
    if (curMap) {
        curMap.repeat.x = val;
        curMap.needsUpdate = true;
        curMat.needsUpdate = true;
    }
};

var selObjTexRepeatYChanged = function(val){
    if( gameModeProject.selectedWall === null ) return;
    
    var curMat = gameModeProject.selectedWall.material;
    var curMap = curMat.map;
    
    if (curMap) {
        curMap.repeat.y = val;
        curMap.needsUpdate = true;
        curMat.needsUpdate = true;
    }
};


