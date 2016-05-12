var SOPos = function () {
    this.X = 0.0;
    this.Y = 0.0;
    this.Z = 0.0;    
};

var SORot = function () {
    this.X = 0;
    this.Y = 0;
    this.Z = 0;    
};

var SOScale = function () {
    this.X = 0.0;
    this.Y = 0.0;
    this.Z = 0.0;    
};

var SOD = function () {
    this.pos = new SOPos();
    this.rot = new SORot();
    this.scale = new SOScale();
    
    this.Color = "#000000";
    
    this.Textures = ['','',"rbn_0","rbn_1","rbn_2"];
    this.Texture = this.Textures[0];
    
    this.AddWall = function(){
        //console.log("AddWall");
        gameModeProject.addWall();        
    };
    
    this.DeleteSelectedWall = function(){
        //console.log("DeleteSelectedWall");
        gameModeProject.deleteSelectedWall();
    };
    
    this.DuplicateSelectedWall = function(){
        //console.log("DuplicateSelectedWall");
        gameModeProject.duplicateSelectedWall();
    };
    
    //this.AddWall = GameModeProject.addWall;                
    //this.DeleteSelectedWall = gameModeProject.deleteSelectedWall;        
    //this.DuplicateSelectedWall = gameModeProject.duplicateSelectedWall;    
};
      
var selObjPosChanged = function (val) {
    if( gameModeProject.selectedCube === null ) return;
    switch(this.property){
        case "X":
            gameModeProject.selectedCube.position.x = val * gameModeProject.gridStep;
            break;
        case "Y":
            gameModeProject.selectedCube.position.y = val * gameModeProject.gridStep;
            break;
        case "Z":
            gameModeProject.selectedCube.position.z = val * gameModeProject.gridStep;
            break;
    }
    gameModeProject.draggedIndicator.position.x = gameModeProject.selectedCube.position.x;
    gameModeProject.draggedIndicator.position.z = gameModeProject.selectedCube.position.z;
};

var selObjRotChanged = function (val) {
    if( gameModeProject.selectedCube === null ) return;
    
    var newRot = gameModeProject.selectedCube.rotation;
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
    gameModeProject.selectedCube.rotation = newRot;
    
    var axesRot = gameModeProject.draggedIndicator.rotation;
    //axesRot.x = 0;
    //axesRot.z = 0;
    //axesRot.y = newRot.y;
    axesRot.z = newRot.y;
    //console.log(axesRot.y);
    gameModeProject.draggedIndicator.rotation = axesRot.clone();
};

var selObjScaleChanged = function (val) {
    if( gameModeProject.selectedCube === null ) return;
    switch(this.property){
        case "X":            
            gameModeProject.selectedCube.scale.x = val;
            break;
        case "Y":
            gameModeProject.selectedCube.scale.y = val;
            break;
        case "Z":
            gameModeProject.selectedCube.scale.z = val;
            break;
    }
};

var selObjColorChanged = function(val){
    if( gameModeProject.selectedCube === null ) return;
    gameModeProject.selectedCube.material.color = new THREE.Color(val);
}

var selObjTextureChanged = function(val){
    if( gameModeProject.selectedCube === null ) return;
    
    var currentMaterial = gameModeProject.selectedCube.material;
    
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


