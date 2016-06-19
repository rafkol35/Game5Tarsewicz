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
    var rad = THREE.Math.degToRad(val);

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
};

////////////////////////////// stage ////////////////////////////////////////////////////////////////////////////////////////

var stageSizeChanged = function (val) {
    gameModeProject.updateStageSize(val);
};

var stageProjColorChanged = function (val) {
    gameModeProject.setProjClearColor(val);
};

var stageVisitColorChanged = function (val) {
    gameModeProject.setVisitClearColor(val);
};

GameModeProject.prototype.createGUI = function () {
    this.gui = new dat.GUI({
//        height: 5 * 32 - 1
//        autoPlace: false
    });
    //this.gui.domElement.id = 'guiProject';
    
    this.guiTex = new dat.GUI({
        //height: 5 * 32 - 1,
        //autoPlace: false
    });
    //this.guiTex.domElement.id = 'guiTex';

    var stageFolder = this.gui.addFolder('Stage');
    
    {
        var cntr = stageFolder.add(this.guiData.sd,'Size',8,15).listen();
        cntr.step(1);
        cntr.onChange(stageSizeChanged);
        cntr.onFinishChange(stageSizeChanged);
        
        cntr = stageFolder.addColor(this.guiData.sd, 'ProjBackColor').listen();
        cntr.onChange(stageProjColorChanged);
        cntr.onFinishChange(stageProjColorChanged);
        
        cntr = stageFolder.addColor(this.guiData.sd, 'VisitBackColor').listen();
        cntr.onChange(stageVisitColorChanged);
        cntr.onFinishChange(stageVisitColorChanged);
    }
    
    var wallFolder = this.gui.addFolder('Wall');
    
    {
        var folderPosition = wallFolder.addFolder('Position');
        //var _t = this.stageSize;
        //var cntr = folderPosition.add(this.guiData.wd.Pos, 'X', -this.stageSize, this.stageSize).listen();
        var cntr = folderPosition.add(this.guiData.wd.Pos, 'X').listen();
        cntr.step(0.05);
        //cntr.min(-this.stageSize);
        //cntr.max(this.stageSize);
        //cntr.min(-this.stageSize/2);
        //cntr.max(this.stageSize/2);
        cntr.onChange(selObjPosChanged);
        cntr.onFinishChange(selObjPosChanged);

        cntr = folderPosition.add(this.guiData.wd.Pos, 'Y').listen();
        cntr.step(0.05);
        cntr.min(0);//.max(30);
        cntr.onChange(selObjPosChanged);
        cntr.onFinishChange(selObjPosChanged);

        cntr = folderPosition.add(this.guiData.wd.Pos, 'Z').listen();
        cntr.step(0.05);
        //cntr.step(0.1).min(-this.stageSize).max(this.stageSize);
        cntr.onChange(selObjPosChanged);
        cntr.onFinishChange(selObjPosChanged);
    }

    {
        var cntr = wallFolder.add(this.guiData.wd, 'Rot').listen();
        //cntr.step(0.1);
        cntr.onChange(selObjRotChanged);
        cntr.onFinishChange(selObjRotChanged);
    }

    {
        var folder = wallFolder.addFolder('Scale');

        var cntr = folder.add(this.guiData.wd.Scale, 'X').listen();
        cntr.step(0.1).min(0.1);
        cntr.onChange(selObjScaleChanged);
        cntr.onFinishChange(selObjScaleChanged);

        cntr = folder.add(this.guiData.wd.Scale, 'Y').listen();
        cntr.step(0.1).min(0.1);
        cntr.onChange(selObjScaleChanged);
        cntr.onFinishChange(selObjScaleChanged);

        cntr = folder.add(this.guiData.wd.Scale, 'Z').listen();
        cntr.step(0.1).min(0.1);
        cntr.onChange(selObjScaleChanged);
        cntr.onFinishChange(selObjScaleChanged);
    }

    {        
        var folder = wallFolder.addFolder('Material');
        this.WallFolderGUI = folder;
        
        var cntr = null;
        cntr = folder.addColor(this.guiData.wd.Material, 'Color').listen();
        cntr.onChange(selObjColorChanged);
        cntr.onFinishChange(selObjColorChanged);
        
        cntr = folder.add(this.guiData.wd.Material, 'RepeatX',1,20).listen();
        cntr.step(1);//.min(0.1);
        cntr.onChange(selObjTexRepeatXChanged);
        cntr.onFinishChange(selObjTexRepeatXChanged);
        
        cntr = folder.add(this.guiData.wd.Material, 'RepeatY',1,20).listen();
        cntr.step(1);//.min(0.1);
        cntr.onChange(selObjTexRepeatYChanged);
        cntr.onFinishChange(selObjTexRepeatYChanged);
        
        this.updateWallTexGUI();
    }
    
    {
        this.guiSelTexFolder = this.guiTex.addFolder('StripTextures');
        
        var cntr = null;
        
        this.guiData.AddNew = function () {
            gameModeProject.addNewTexture();
        };
                
        cntr = this.guiSelTexFolder.add(this.guiData, "AddNew");
        
        this.updateStripTexGUI();
    }
    
    {
        var cntr = null;
        cntr = wallFolder.add(this.guiData, "AddWall");
        cntr = wallFolder.add(this.guiData, "RemoveSelectedWall");
        cntr = wallFolder.add(this.guiData, "DuplicateSelectedWall");
    }
    
    {
        this.guiFolder = this.gui.addFolder('Floor');
        
        var cntr = null;
        
        cntr = this.guiFolder.addColor(this.guiData.fm, 'Color').listen();
        cntr.onChange(floorColorChanged);
        cntr.onFinishChange(floorColorChanged);
        
        cntr = this.guiFolder.add(this.guiData.fm, 'RepeatX',1,20).listen();
        cntr.step(1);//.min(0.1);
        cntr.onChange(floorTexRepeatXChanged);
        cntr.onFinishChange(floorTexRepeatXChanged);
        
        cntr = this.guiFolder.add(this.guiData.fm, 'RepeatY',1,20).listen();
        cntr.step(1);//.min(0.1);
        cntr.onChange(floorTexRepeatYChanged);
        cntr.onFinishChange(floorTexRepeatYChanged);
        
        this.floorFileCntr = this.guiFolder.add(this.guiData.fm, 'TexName', this.Files).listen();
        this.floorFileCntr.onFinishChange(floorTextureChanged);        
    }
    
    {
        var folder = this.gui.addFolder('Player');
        var cntr = null;
        
        this.cntrPlayerPosX = folder.add(this.guiData.pd, 'PosX', -this.stageSize, this.stageSize).listen();
        this.cntrPlayerPosX.step(0.1);
        this.cntrPlayerPosX.onChange(playerPosChanged);
        this.cntrPlayerPosX.onFinishChange(playerPosChanged);

        this.cntrPlayerPosZ = folder.add(this.guiData.pd, 'PosZ', -this.stageSize, this.stageSize).listen();
        this.cntrPlayerPosZ.step(0.1); //.min(-this.stageSize).max(this.stageSize);
        this.cntrPlayerPosZ.onChange(playerPosChanged);
        this.cntrPlayerPosZ.onFinishChange(playerPosChanged);
        
        cntr = folder.add(this.guiData.pd, 'Rot').listen();
        cntr.step(1); //.min(-this.stageSize).max(this.stageSize);
        cntr.onChange(playerRotChanged);
        cntr.onFinishChange(playerRotChanged);
        
        cntr = folder.add(this.guiData.pd, 'Height', 1, 5).listen();
        cntr.step(0.1); //.min(-this.stageSize).max(this.stageSize);
        cntr.onChange(playerHeightChanged);
        cntr.onFinishChange(playerHeightChanged);
    }
    
    {
        cntr = this.gui.add(this.guiData, "GoToVisit");
        
        cntr = this.gui.add(this.guiData, "Save");
        cntr = this.gui.add(this.guiData, "Load");
    }
};

GameModeProject.prototype.createSelTexControls = function(){
    //if(!this.selTex) return;
    //var selTexName = this.selTex._name;
    //for(var i = 0 ; i < this.walls.length ; ++i){
    //    this.walls[i]._updateTex2(selTexName);
    //}
};

GameModeProject.prototype.selTexChanged2 = function(){
    if(!this.selTex) return;
    var selTexName = this.selTex._name;
    for(var i = 0 ; i < this.walls.length ; ++i){
        this.walls[i]._updateTex2(selTexName);
    }
};

GameModeProject.prototype.selTexChanged3 = function(newNumOfStrips){
    if (!this.selTex) return;
    this.selTex.setNumOfStrips(newNumOfStrips);
    this.selTexData.NumOfStrips = this.selTex.numOfStrips;
    this.updateGUISelTexColors();
    this.selTexChanged2();    
};

GameModeProject.prototype.selTexChanged = function (texName) {
    if(!texName) {
        this.hideGUISelTex();
        return;
    }

    if (this.textures[texName]._type === 2) {
        //console.log(this.textures[texName]._type);
        this.guiData.StripTexName = texName;
        this.hideGUISelTex();
        this.showGUISelTex(this.textures[texName]);
    } else {
        this.guiData.StripTexName = "";
        this.hideGUISelTex();
    }
};

GameModeProject.prototype.showGUISelTex = function(selTex){
    //console.log(selTex);
    if(selTex._type !== 2) {
        //this.updateGUISelTex(this.textures[texName]);
        console.log('createGUISelTex => selTex._type !== 2');
        return;
    }

    this.selTex = selTex;
    this.selTexData = selTex.getSelTexData();
    
    this.guiSelTexOrienCntr = this.guiSelTexFolder.add(this.selTexData, 'Vertical').listen();
    this.guiSelTexOrienCntr.onChange(selTexOrientationChanged);

    this.guiSelTexNumOfColorsCntr = this.guiSelTexFolder.add(this.selTexData, 'NumOfStrips', 2, _maxNumStrips).listen();
    this.guiSelTexNumOfColorsCntr.step(1);
    this.guiSelTexNumOfColorsCntr.onChange(selTexNumOfStripsChanged);
    
    var curFolder = null;
    for (var i = 0; i < this.selTexData.NumOfStrips; i++) {
        if (i % 10 === 0) {
            curFolder = this.guiSelTexFolder.addFolder("Colors " + i + " : " + (i + 9));
            this.guiSelTexColorsFolders.push(curFolder);
        }
        var cntr = curFolder.addColor(this.selTexData.Colors, i, this.selTexData.Colors[i]);
        cntr.onChange(selTexColorChanged);
        cntr.onFinishChange(selTexColorChanged);
        this.guiSelTexColorsCntrs.push(cntr);
    }
};

GameModeProject.prototype.hideGUISelTex = function () {
    if(!this.selTex) return;
    
    this.selTex = null;
    this.setTexData = null;
    
    this.guiSelTexNumOfColorsCntr.remove();
    this.guiSelTexNumOfColorsCntr = null;
    
    this.guiSelTexOrienCntr.remove();
    this.guiSelTexOrienCntr = null;
    
    for(var i = 0 ; i < this.guiSelTexColorsCntrs.length ; ++i){
        this.guiSelTexColorsCntrs[i].remove();
    }
    this.guiSelTexColorsCntrs = [];
    
    for (var i = 0 ; i < this.guiSelTexColorsFolders.length ; ++i) {
        this.guiSelTexFolder.removeFolder(this.guiSelTexColorsFolders[i].name);
    }
    this.guiSelTexColorsFolders = [];
};

GameModeProject.prototype.updateGUISelTexColors = function(){    
    for (var i = 0 ; i < this.guiSelTexColorsFolders.length ; ++i) {
        //console.log('this.guiTex.removeFolder('+this.guiSelTexColorsFolders[i].name+');');
        this.guiSelTexFolder.removeFolder(this.guiSelTexColorsFolders[i].name);
    }
    this.guiSelTexColorsFolders = [];

    var curFolder = null;
    for (var i = 0; i < this.selTexData.NumOfStrips; i++) {
        if (i % 10 === 0) {
            curFolder = this.guiSelTexFolder.addFolder("Colors " + i + " : " + (i + 9) );
            this.guiSelTexColorsFolders.push(curFolder);
        }
        var cntr = curFolder.addColor(this.selTexData.Colors, i, this.selTexData.Colors[i]);
        cntr.onChange(selTexColorChanged);
        cntr.onFinishChange(selTexColorChanged);
        this.guiSelTexColorsCntrs.push(cntr);
    }
};

GameModeProject.prototype.createGUITex = function (){

};