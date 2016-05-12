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
    this.X = 1.0;
    this.Y = 1.0;
    this.Z = 1.0;    
};

var Material = function(){
    this.File = '';
    this.RepeatX = 1;
    this.RepeatY = 1;
    this.Color = "#ffffff";    
};

var WallData = function () {
    this.Pos = new Pos();
    this.Rot = new Rot();
    this.Scale = new Scale();    
    this.Material = new Material();    
};

var PlayerData = function(){
    this.PosX = 0;
    this.PosZ = 0;
    this.Rot = 0;
    this.Height = 2;
};

var PGUIData = function (game) {
    this.game = game;
    
    /////////////// wall ///////////////////////////////////
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
    
    /////////////// floor //////////////////////////////////
    this.fm = new Material();
    this.fm.Color = "#bbbbbb";
    
    /////////////// player /////////////////////////////////
    this.pd = new PlayerData();
    
    ////////////////////////////////////////////////////////
    this.GoToVisit = function(){
        setMode(gameModeVisit);
    };
};

////////////////////////////// wall ////////////////////////////////////////////////////////////////////////////////////////

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
    //console.log(newRot);
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
        var befRepX = 1;
        var befRepY = 1;
        
        if( currentMaterial.map ){
            befRepX = currentMaterial.map.repeat.x;
            befRepY = currentMaterial.map.repeat.y;            
        }
        
        var newTexture = gameModeProject.textures[val].clone();        
        newTexture.repeat.x = befRepX;
        newTexture.repeat.y = befRepY;
        newTexture.needsUpdate = true;
        currentMaterial.map = newTexture; 
        currentMaterial.needsUpdate = true;        
    }else{
        currentMaterial.map = null;
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

////////////////////////////// floor ////////////////////////////////////////////////////////////////////////////////////////

var floorColorChanged = function(val){
    if( gameModeProject.floor === null ) return;
    gameModeProject.floor.material.color = new THREE.Color(val);
}

var floorTextureChanged = function(val){
    if( gameModeProject.floor === null ) return;
    
    var currentMaterial = gameModeProject.floor.material;
    
    if( val !== "" ){
        var befRepX = 1;
        var befRepY = 1;
        
        if( currentMaterial.map ){
            befRepX = currentMaterial.map.repeat.x;
            befRepY = currentMaterial.map.repeat.y;            
        }
        
        var newTexture = gameModeProject.textures[val].clone();        
        newTexture.repeat.x = befRepX;
        newTexture.repeat.y = befRepY;
        newTexture.needsUpdate = true;
        currentMaterial.map = newTexture; 
        currentMaterial.needsUpdate = true;        
    }else{
        currentMaterial.map = null;
        currentMaterial.needsUpdate = true;
    }
};

var floorTexRepeatXChanged = function(val){
    if( gameModeProject.floor === null ) return;
    
    var curMat = gameModeProject.floor.material;
    var curMap = curMat.map;
    
    if (curMap) {
        curMap.repeat.x = val;
        curMap.needsUpdate = true;
        curMat.needsUpdate = true;
    }
};

var floorTexRepeatYChanged = function(val){
    if( gameModeProject.floor === null ) return;
    
    var curMat = gameModeProject.floor.material;
    var curMap = curMat.map;
    
    if (curMap) {
        curMap.repeat.y = val;
        curMap.needsUpdate = true;
        curMat.needsUpdate = true;
    }
};

////////////////////////////// player ////////////////////////////////////////////////////////////////////////////////////////

var playerPosChanged = function (val) {
    if( gameModeProject.playerPos === null ) return;
    
    switch(this.property){
        case "PosX":
            gameModeProject.playerPos.position.x = val * gameModeProject.gridStep;
            break;
        case "PosY":
            gameModeProject.playerPos.position.y = val * gameModeProject.gridStep;
            break;
        case "PosZ":
            gameModeProject.playerPos.position.z = val * gameModeProject.gridStep;
            break;
    }
};

var playerRotChanged = function (val) {
    if( gameModeProject.playerPos === null ) return;
    
    var newRot = gameModeProject.playerPos.rotation;
    var rad = THREE.Math.degToRad(val);
    newRot.y = rad;
    gameModeProject.playerPos.rotation = newRot;    
};

var playerHeightChanged = function (val) {
    if( gameModeProject.playerPos === null ) return;
    gameModeProject.updatePlayerHeight(val);
    
    //var newRot = gameModeProject.playerPos.rotation;
    //var rad = THREE.Math.degToRad(val);
    //newRot.y = rad;
    //gameModeProject.playerPos.rotation = newRot;    
};