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

var Material = function () {
    this.TexName = "";
    this.RepeatX = 1;
    this.RepeatY = 1;
    this.Color = "#ffffff";
};

var WallData = function () {
    this.Pos = new Pos();
    //this.Rot = new Rot();
    this.Rot = 0;
    this.Scale = new Scale();
    this.Material = new Material();
};

var PlayerData = function () {
    this.PosX = 0;
    this.PosZ = 0;
    this.Rot = 0;
    this.Height = 2;
};

var StageData = function (game) {
    this.Size = game.stageSize;
    this.ProjBackColor = "#" + game.projClearColor.getHexString();
    this.VisitBackColor = "#" + game.visitClearColor.getHexString();
};

var PGUIData = function (game) {
    this.game = game;

    /////////////// wall ///////////////////////////////////
    this.wd = new WallData();

    this.AddWall = function () {
        game.addWall();
    };

    this.RemoveSelectedWall = function () {
        game.removeSelectedWall();
    };

    this.DuplicateSelectedWall = function () {
        game.duplicateSelectedWall();
    };

    /////////////// floor //////////////////////////////////
    this.fm = new Material();
    this.fm.Color = "#bbbbbb";

    /////////////// player /////////////////////////////////
    this.pd = new PlayerData();

    ////////////////////////////////////////////////////////
    this.sd = new StageData(game);

    this.GoToVisit = function () {
        setMode(gameModeVisit);
    };

    this.Save = function () {
        gameModeProject.saveFile();
    };

    this.Load = function () {
        var fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'game5scene'
        fileInput.addEventListener('change', function (event) {
            //console.log(fileInput.files);
            //console.log(fileInput);
            gameModeProject.loadFile(fileInput.files[ 0 ]);
        });

        fileInput.click();
    };

    this.StripTexName = "";
};

var SelTexData = function(){
    this.Name = "";
    this.NumOfStrips = 2;
    this.Colors = ["#000000","#ffffff"];    
    this.Vertical = false;    
};

var link = document.createElement('a');
link.style.display = 'none';
document.body.appendChild(link); // Firefox workaround, see #6594

//var fileInput = document.createElement('input');
//fileInput.type = 'file';
//fileInput.accept = 'game5scene'
//fileInput.addEventListener('change', function (event) {
//    //console.log(fileInput.files);
//    //console.log(fileInput);
//    gameModeProject.loadFile(fileInput.files[ 0 ]);
//});

function save(blob, filename) {
    link.href = URL.createObjectURL(blob);
    link.download = filename || 'data.json';
    link.click();
    // URL.revokeObjectURL( url ); breaks Firefox...
}

function saveString(text, filename) {
    save(new Blob([text], {type: 'text/plain'}), filename);
}
////////////////////////////// SelTex ////////////////////////////////////////////////////////////////////////////////////////

function selTexColorChanged(val){
    if (!gameModeProject.selTex) return;
    
    //console.log(this.property + " " + val);
    gameModeProject.selTex.setStripColor(this.property,val);
    
    gameModeProject.selTexChanged2();
}

function selTexNumOfStripsChanged(val){    
    gameModeProject.selTexChanged3(val);
}

function selTexOrientationChanged(val){
    if (!gameModeProject.selTex) return;
    
    //console.log(val);
    var newOrientation = val === true ? MTSOrientation.VERTICAL : MTSOrientation.HORIZONTAL;
    gameModeProject.selTex.setOrientation(newOrientation);
    
    gameModeProject.selTexChanged2();
};

////////////////////////////// wall ////////////////////////////////////////////////////////////////////////////////////////

var selObjPosChanged = function (val) {
    if (gameModeProject.selectedWall === null)
        return;
    var gmp = gameModeProject;

    if (this.property === "X" || this.property === "Z") {
        if (val > gmp.stageSize) {
            val = gmp.stageSize;
            this.setValue(gmp.stageSize);
        } else if (val < -gmp.stageSize) {
            val = -gmp.stageSize;
            this.setValue(-gmp.stageSize);
        }
    }

    switch (this.property) {
        case "X":
            gmp.selectedWall.position.x = val * gmp.gridStep;
            break;
        case "Y":
            gmp.selectedWall.position.y = val * gmp.gridStep;
            break;
        case "Z":
            gmp.selectedWall.position.z = val * gmp.gridStep;
            break;
    }
    gmp.draggedIndicator.position.x = gmp.selectedWall.position.x;
    gmp.draggedIndicator.position.z = gmp.selectedWall.position.z;
};

var selObjRotChanged = function (val) {
    if (gameModeProject.selectedWall === null)
        return;

    var newRot = gameModeProject.selectedWall.rotation;
    //console.log(newRot);
    var rad = THREE.Math.degToRad(val);

//    switch (this.property) {
//        case "X":
//            newRot.x = rad;
//            break;
//        case "Y":
//            newRot.y = rad;
//            break;
//        case "Z":
//            newRot.z = rad;
//            break;
//    }
    newRot.y = rad;
    
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
    if (gameModeProject.selectedWall === null)
        return;
    switch (this.property) {
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

var selObjColorChanged = function (val) {
    if (gameModeProject.selectedWall === null) return;
    //console.log('selObjColorChanged');
    gameModeProject.selectedWall.material.color = new THREE.Color(val);
};

var selObjTextureChanged = function (val) {
    gameModeProject.selTexChanged(val);
    if (gameModeProject.selectedWall === null) return;
    gameModeProject.selectedWall._setMyTex(gameModeProject.textures[val]);    
};

var selObjTexRepeatXChanged = function (val) {
    if (gameModeProject.selectedWall === null) return;
    gameModeProject.selectedWall._setMyUVX(val);
};

var selObjTexRepeatYChanged = function (val) {
    if (gameModeProject.selectedWall === null) return;  
    gameModeProject.selectedWall._setMyUVY(val);
};

var selStripTextureChanged = function (val) {
    gameModeProject.selStripTextureChanged(val);    
}
////////////////////////////// floor ////////////////////////////////////////////////////////////////////////////////////////

var floorColorChanged = function (val) {
    if (gameModeProject.floor === null) return;
    gameModeProject.floor.material.color = new THREE.Color(val);
}

var floorTextureChanged = function (val) {
    if (gameModeProject.floor === null) return;
    var currentMaterial = gameModeProject.floor.material;
    if(val){
        currentMaterial.map = gameModeProject.textures[val].getTHREETexture();
    }else{
        currentMaterial.map = null;
    }
    currentMaterial.needsUpdate = true;
};

var floorTexRepeatXChanged = function (val) {
    if (gameModeProject.floor === null) return;
    gameModeProject.floor._setMyUVX(val);
};

var floorTexRepeatYChanged = function (val) {
    if (gameModeProject.floor === null) return;
    gameModeProject.floor._setMyUVY(val);
};

////////////////////////////// player ////////////////////////////////////////////////////////////////////////////////////////

var playerPosChanged = function (val) {
    if (gameModeProject.playerPos === null)
        return;

    switch (this.property) {
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
    if (gameModeProject.playerPos === null)
        return;

    var newRot = gameModeProject.playerPos.rotation;
    var rad = THREE.Math.degToRad(val);
    newRot.y = rad;
    gameModeProject.playerPos.rotation = newRot;
};

var playerHeightChanged = function (val) {
    if (gameModeProject.playerPos === null)
        return;
    gameModeProject.updatePlayerHeight(val);

    //var newRot = gameModeProject.playerPos.rotation;
    //var rad = THREE.Math.degToRad(val);
    //newRot.y = rad;
    //gameModeProject.playerPos.rotation = newRot;    
};

////////////////////////////// stage ////////////////////////////////////////////////////////////////////////////////////////

var stageSizeChanged = function (val) {
    gameModeProject.updateStageSize(val);

    //var newRot = gameModeProject.playerPos.rotation;
    //var rad = THREE.Math.degToRad(val);
    //newRot.y = rad;
    //gameModeProject.playerPos.rotation = newRot;    
};

var stageProjColorChanged = function (val) {
    gameModeProject.setProjClearColor(val);
};

var stageVisitColorChanged = function (val) {
    gameModeProject.setVisitClearColor(val);
};