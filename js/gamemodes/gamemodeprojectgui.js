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
        fileInput.click();
    };

};

var link = document.createElement('a');
link.style.display = 'none';
document.body.appendChild(link); // Firefox workaround, see #6594

var fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = 'game5scene'
fileInput.addEventListener('change', function (event) {
    gameModeProject.loadFile(fileInput.files[ 0 ]);
});

function save(blob, filename) {
    link.href = URL.createObjectURL(blob);
    link.download = filename || 'data.json';
    link.click();
    // URL.revokeObjectURL( url ); breaks Firefox...
}

function saveString(text, filename) {
    save(new Blob([text], {type: 'text/plain'}), filename);
}

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

    switch (this.property) {
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
    if (gameModeProject.selectedWall === null)
        return;
    gameModeProject.selectedWall.material.color = new THREE.Color(val);
}

var selObjTextureChanged = function (val) {
    if (gameModeProject.selectedWall === null)
        return;

    var currentMaterial = gameModeProject.selectedWall.material;

    if (val !== "") {
        var befRepX = 1;
        var befRepY = 1;

        if (currentMaterial.map) {
            befRepX = currentMaterial.map.repeat.x;
            befRepY = currentMaterial.map.repeat.y;
        }

        var newTexture = gameModeProject.textures[val].clone();
        newTexture.repeat.x = befRepX;
        newTexture.repeat.y = befRepY;
        newTexture.needsUpdate = true;
        currentMaterial.map = newTexture;
        currentMaterial.needsUpdate = true;
    } else {
        currentMaterial.map = null;
        currentMaterial.needsUpdate = true;
    }
};

var selObjTexRepeatXChanged = function (val) {
    if (gameModeProject.selectedWall === null)
        return;

    var selWall = gameModeProject.selectedWall;
    
//    var curMat = gameModeProject.selectedWall.material;
//    var curMap = curMat.map;
//
//    if (curMap) {
//        curMap.repeat.x = val;
//        curMap.needsUpdate = true;
//        curMat.needsUpdate = true;
//    }

    //console.log(selWall);
    //console.log(val);
    
    for (var i = 0; i < selWall.geometry.faceVertexUvs[0].length; ++i) {
        var _faceVertUV = selWall.geometry.faceVertexUvs[0][i];

        for (var j = 0; j < _faceVertUV.length; ++j) {
            var _vertUV = _faceVertUV[j];

            if (_vertUV.x !== 0) {
                //console.log(_vertUV.x);
                _vertUV.x = val;
            }
       }
    }
    selWall.geometry.uvsNeedUpdate = true;
};

var selObjTexRepeatYChanged = function (val) {
    if (gameModeProject.selectedWall === null)
        return;

//    var curMat = gameModeProject.selectedWall.material;
//    var curMap = curMat.map;
//
//    if (curMap) {
//        curMap.repeat.y = val;
//        curMap.needsUpdate = true;
//        curMat.needsUpdate = true;
//    }
    
    var selWall = gameModeProject.selectedWall;
    
    for (var i = 0; i < selWall.geometry.faceVertexUvs[0].length; ++i) {
        var _faceVertUV = selWall.geometry.faceVertexUvs[0][i];

        for (var j = 0; j < _faceVertUV.length; ++j) {
            var _vertUV = _faceVertUV[j];

//            if (_vertUV.x !== 0) {
//                _vertUV.x = val;
//            }

            if (_vertUV.y !== 0) {
                _vertUV.y = val;
            }
        }
    }
    selWall.geometry.uvsNeedUpdate = true;
};

////////////////////////////// floor ////////////////////////////////////////////////////////////////////////////////////////

var floorColorChanged = function (val) {
    if (gameModeProject.floor === null)
        return;
    gameModeProject.floor.material.color = new THREE.Color(val);
}

var floorTextureChanged = function (val) {
    if (gameModeProject.floor === null)
        return;

    var currentMaterial = gameModeProject.floor.material;

    if (val !== "") {
        var befRepX = 1;
        var befRepY = 1;

        if (currentMaterial.map) {
            befRepX = currentMaterial.map.repeat.x;
            befRepY = currentMaterial.map.repeat.y;
        }

        var newTexture = gameModeProject.textures[val].clone();
        newTexture.repeat.x = befRepX;
        newTexture.repeat.y = befRepY;
        newTexture.needsUpdate = true;
        currentMaterial.map = newTexture;
        currentMaterial.needsUpdate = true;
    } else {
        currentMaterial.map = null;
        currentMaterial.needsUpdate = true;
    }
};

var floorTexRepeatXChanged = function (val) {
    if (gameModeProject.floor === null)
        return;

    var curMat = gameModeProject.floor.material;
    var curMap = curMat.map;

    if (curMap) {
        curMap.repeat.x = val;
        curMap.needsUpdate = true;
        curMat.needsUpdate = true;
    }
};

var floorTexRepeatYChanged = function (val) {
    if (gameModeProject.floor === null)
        return;

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