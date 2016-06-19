function GameModeProject(name) {
    GameMode.call(this, name);

    this.scene = new THREE.Scene();
    this.projClearColor = new THREE.Color(0xdddddd);
    this.visitClearColor = new THREE.Color(0x00ff00);
    
    this.cameraType = 1;

    if (this.cameraType === 1) {
        this.camera = new THREE.OrthographicCamera(
                window.innerWidth / -2, window.innerWidth / 2,
                window.innerHeight / 2, window.innerHeight / -2, -1000, 10000);
        //-2.5, 2.5,
        //2.5, -2.5, 
        //-500, 1000);
    } else {
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    }
    this.cameraRestrict = new THREE.Vector3(1000, 1000, 1000);
    this.camera.position.set(0, this.cameraRestrict.y, this.cameraRestrict.z);

    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.gridStep = 50.0;
    this.stageSizeX = 9.0;
    this.stageSizeY = 11.0;
    this.gridSizeX = this.stageSizeX * this.gridStep;
    this.gridSizeY = this.stageSizeY * this.gridStep;
    this.halfGridStep = this.gridStep * 0.5;
    
    this.Files = ['','rbn','rbn_0','rbn_1','rbn_2','sprite','sprite0','sprite1','t1'];
    this.TexNames = this.Files.slice();
    this.StripTexNames = [""];
            
    this.guiData = new PGUIData(this);    
    this.selTexData = null; //new SelTexData();    
    this.selTex = null;
    
    this.guiSelTexFolder = null;
    this.guiSelTexParamsFolder = null;
    this.guiSelTexOrienCntr = null;
    this.guiSelTexNumOfColorsCntr = null;
    this.guiSelTexColorsCntrs = [];
    this.guiSelTexColorsFolders = [];

    this.createGUI();
    this.createGUITex();
    this.prepareTextures();
    this.createDraggedFloor();
    this.createFloor();
    this.createAxis();
    this.createGrid();
    this.createPlayerPos(new THREE.Vector2(0,0), 0, 2);
    
    this.walls = [];
    this.selectedWall = null;
    this.highlightWall = null;
    this.draggedWall = null;
    this.draggedWallOffset = null;

    this.moveUp = false;
    this.moveDown = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.rotateObject = false;
    this.rotateOrigin = new THREE.Vector2();
    this.scaleX = false;
    this.scaleY = false;
    this.scaleOrigin = new THREE.Vector2();

    this.xrat = Math.PI * 0.25;
    this.yrat = Math.PI * 0.25;
    this.zrat = Math.PI * 0.25;
    this.updateCamera();
    
    this.raycaster = new THREE.Raycaster();
    this.setSelected(null);    
}

GameModeProject.prototype = Object.create(GameMode.prototype);
GameModeProject.prototype.constructor = GameModeProject;

GameModeProject.prototype.getClearColor = function () {
    return this.projClearColor;
};

GameModeProject.prototype.activate = function () {
    //console.log('activate project');
    renderer.setClearColor(this.projClearColor);
    $(this.gui.domElement).attr("hidden", false);
    $(this.guiTex.domElement).attr("hidden", false);
    this.clear();
};

GameModeProject.prototype.deactivate = function () {
    //console.log('deactivate project');
    $(this.gui.domElement).attr("hidden", true);
    $(this.guiTex.domElement).attr("hidden", true);
    this.clear();
};

GameModeProject.prototype.clear = function () {
    //console.log('deactivate project');
    this.moveUp = false;
    this.moveDown = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.rotateObject = false;
    this.scaleX = false;
    this.scaleY = false;

    this.setSelected(null);
    this.setHighlighted(null);
    this.draggedWall = null;
};

dat.GUI.prototype.removeFolder = function (name) {
    var folder = this.__folders[name];
    if (!folder) {
        return;
    }
    folder.close();
    this.__ul.removeChild(folder.domElement.parentNode);
    delete this.__folders[name];
    this.onResize();
};

GameModeProject.prototype.keyDown = function (event) {       
    switch (event.keyCode) {

        case 82:
            if (this.draggedWall !== null) {
                this.rotateObject = true;
                this.rotateOrigin = mouse;
            }
            break;

        case 81: //q
            break;
            
        case 71: //g
            break;

        case 69: //e
            break;

        case 38: // up
        case 87: // w
            this.moveUp = true;
            break;

        case 37: // left
        case 65: // a
            this.moveLeft = true;
            break;

        case 40: // down
        case 83: // s
            this.moveDown = true;
            break;

        case 39: // right
        case 68: // d
            this.moveRight = true;
            break;

        case 32: // space
            break;
    }
};

GameModeProject.prototype.keyUp = function (event) {
    switch (event.keyCode) {
        case 84:
            {
                this.scaleX = false;
                this.scaleY = false;
                if (this.draggedWall !== null) {
                    this.raycaster.setFromCamera(mouse, this.camera);
                    var intersects = this.raycaster.intersectObject(this.draggedFloor);
                    if (intersects.length > 0) {
                        this.draggedWallOffset = intersects[0].point.clone().sub(this.draggedWall.position.clone());
                        this.draggedWallOffset.y = 0;
                    }
                }
            }
            break;

        case 82:
            this.rotateObject = false;
            if (this.draggedWall !== null) {
                this.raycaster.setFromCamera(mouse, this.camera);
                var intersects = this.raycaster.intersectObject(this.draggedFloor);
                if (intersects.length > 0) {
                    //this.draggedWall = this.selectedWall;
                    this.draggedWallOffset = intersects[0].point.clone().sub(this.draggedWall.position.clone());
                    this.draggedWallOffset.y = 0;
                }
            }
            break;

        case 81: //q
            //this.pressedKeys[event.keyCode] = false;
            break;

        case 69: //e
            //this.pressedKeys[event.keyCode] = false;
            break;

        case 38: // up
        case 87: // w
            this.moveUp = false;
            break;

        case 37: // left
        case 65: // a
            this.moveLeft = false;
            break;

        case 40: // down
        case 83: // s
            this.moveDown = false;
            break;

        case 39: // right
        case 68: // d
            this.moveRight = false;
            break;

    }

};

GameModeProject.prototype.addNewTexture = function(){
    var newTexName = prompt("New texture name", "MyTex");
    if (newTexName !== null) {
        if( this.TexNames.indexOf(newTexName) !== -1 ){
            alert("Texture " + newTexName + " already exist. Type unique texture name.");
            return;
        }
        this.createMyStripTexture(newTexName);
    }
};
    
GameModeProject.prototype.onWindowResize = function () {
    if (this.cameraType === 1) {
        this.camera.left = window.innerWidth / -2;
        this.camera.right = window.innerWidth / 2;
        this.camera.top = window.innerHeight / 2;
        this.camera.bottom = window.innerHeight / -2;
        this.camera.updateProjectionMatrix();
    } else {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }
};

GameModeProject.prototype.mouseDown = function (event) {
    if (pressedKeys[84]) {
        this.raycaster.setFromCamera(mouse, this.camera);
        var intersects = this.raycaster.intersectObject(this.draggedAxisX);
        if (intersects.length > 0) {
            this.scaleX = true;
            this.draggedWall = this.selectedWall;
            this.scaleOrigin = intersects[0].point.clone();
            return;
        }
        var intersects = this.raycaster.intersectObject(this.draggedAxisY);
        if (intersects.length > 0) {
            this.scaleY = true;
            this.draggedWall = this.selectedWall;
            this.scaleOrigin = intersects[0].point.clone();
            return;
        }
    }
    if (event.srcElement === renderer.domElement //chrome
            || event.target === renderer.domElement //firefox
            ) {
        this.setSelected(this.getFirstUnderMouse());

        if (this.selectedWall) {
            this.raycaster.setFromCamera(mouse, this.camera);
            var intersects = this.raycaster.intersectObject(this.draggedFloor);
            if (intersects.length > 0) {
                this.draggedWall = this.selectedWall;
                this.draggedWallOffset = intersects[0].point.clone().sub(this.draggedWall.position.clone());
                this.draggedWallOffset.y = 0;
                if (pressedKeys[82])
                    this.rotateObject = true;
            }
        }else{
            this.setHighlighted(null);
        }
    }
};
GameModeProject.prototype.mouseUp = function (event) {
    this.draggedWall = null;
    this.rotateObject = false;
    this.scaleX = false;
    this.scaleY = false;
};

GameModeProject.prototype.mouseMove = function (event) {    
    if (this.draggedWall) {        
        this.raycaster.setFromCamera(mouse, this.camera);
        var intersects = this.raycaster.intersectObject(this.draggedFloor);
        if (intersects.length > 0) {
            if (this.scaleX) {
                var _diff = intersects[0].point.clone().sub(this.draggedIndicator.position.clone());
                this.draggedWall.scale.x = (_diff.length() / this.gridStep) * 2;
                this.updateGUIScale(this.selectedWall);

            } else if (this.scaleY) {
                var _diff = intersects[0].point.clone().sub(this.draggedIndicator.position.clone());
                this.draggedWall.scale.z = (_diff.length() / this.gridStep) * 2;
                this.updateGUIScale(this.selectedWall);
            } else if (this.rotateObject) {
                var _diff = intersects[0].point.clone().sub(this.draggedIndicator.position.clone());
                var diff = new THREE.Vector2(_diff.z, _diff.x);
                if (diff.length() > this.gridStep) {
                    var rad = Math.atan2(diff.y, diff.x);

                    var newRot = this.selectedWall.rotation;
                    newRot.y = rad;
                    this.selectedWall.rotation = newRot;

                    var axesRot = this.draggedIndicator.rotation;
                    axesRot.z = newRot.y;
                    this.draggedIndicator.rotation = axesRot;

                    this.updateGUIRotation(this.selectedWall);
                }
            } else {
                var newPos = intersects[0].point.clone().sub(this.draggedWallOffset.clone());
                newPos.x = Math.min(Math.max(-this.gridSizeX, newPos.x), this.gridSizeX);
                newPos.z = Math.min(Math.max(-this.gridSizeY, newPos.z), this.gridSizeY);
                this.draggedWall.position.set(newPos.x, this.draggedWall.position.y, newPos.z);
                this.draggedIndicator.position.x = this.draggedWall.position.x;
                this.draggedIndicator.position.z = this.draggedWall.position.z;
                this.udpateGUIPos(this.selectedWall);
            }
        }
    } else {
        //console.log("mousemove");
        this.setHighlighted(this.getFirstUnderMouse());
    }
};

GameModeProject.prototype.render = function (renderer) {
    var ms = 1.5;
    if (pressedKeys[81]) {
        this.camera.zoom = Math.min(5, this.camera.zoom + deltaTime * ms);
        this.onWindowResize();
    } else if (pressedKeys[69]) {
        this.camera.zoom = Math.max(0.1, this.camera.zoom - deltaTime * ms);
        this.onWindowResize();
    }

    if (this.moveLeft) {
        this.xrat -= deltaTime * ms;
        this.zrat -= deltaTime * ms;
    } else if (this.moveRight) {
        this.xrat += deltaTime * ms;
        this.zrat += deltaTime * ms;
    }

    if (this.moveUp) {
        this.yrat = Math.min(Math.PI * 0.5, this.yrat + deltaTime * ms);
    } else if (this.moveDown) {
        this.yrat = Math.max(0, this.yrat - deltaTime * ms);
    }

    // camera moved
    var cm = pressedKeys[81] || pressedKeys[69] || 
            this.moveLeft || this.moveRight || this.moveUp || this.moveDown;
  
    if(cm) this.updateCamera();
  
    renderer.render(this.scene, this.camera);
};

GameModeProject.prototype.setProjClearColor = function(val){
    this.projClearColor = new THREE.Color(val);
    renderer.setClearColor(this.projClearColor);
}
GameModeProject.prototype.setVisitClearColor = function(val){
    this.visitClearColor = new THREE.Color(val);
    //this.renderer.setClearColor(this.projClearColor);
}

GameModeProject.prototype.updateCamera = function () {
    this.camera.position.x = Math.sin(this.xrat) * this.cameraRestrict.x;
    this.camera.position.y = Math.sin(this.yrat) * this.cameraRestrict.y;
    this.camera.position.z = Math.cos(this.zrat) * this.cameraRestrict.z;
    this.camera.lookAt(this.scene.position);
}
        
GameModeProject.prototype.getFirstUnderMouse = function () {
    this.raycaster.setFromCamera(mouse, this.camera);
    var intersects = this.raycaster.intersectObjects(this.walls);
    if (intersects.length > 0) {
        return intersects[0].object;
    } else {
        return null;
    }
};

GameModeProject.prototype.setHighlighted = function (cube) {
    if (cube === null) { //zerowanie        
        if (this.highlightWall !== null && this.highlightWall !== this.selectedWall) {
            this.highlightWall.material.opacity = 1;
            this.highlightWall = null;
            this.draggedIndicator.visible = false;
            this.draggedAxisX.visible = false;
            this.draggedAxisY.visible = false;
        }
    } else { //ustawianie
        if (this.highlightWall !== cube) {
            if (this.highlightWall !== null && this.highlightWall !== this.selectedWall) {
                this.highlightWall.material.opacity = 1;
            }
            this.highlightWall = cube;
            this.highlightWall.material.opacity = 0.5;
            this.draggedIndicator.visible = true;
            this.draggedAxisX.visible = true;
            this.draggedAxisY.visible = true;
            this.draggedIndicator.position.x = cube.position.x;
            this.draggedIndicator.position.z = cube.position.z;
            var axesRot = this.draggedIndicator.rotation;
            axesRot.z = cube.rotation.y;
            this.draggedIndicator.rotation = axesRot;
        }
    }
};

GameModeProject.prototype.setSelected = function (cube) {
    if (this.selectedWall !== null)
        this.selectedWall.material.opacity = 1;
    this.selectedWall = cube;

    if (this.selectedWall !== null) {
        this.selectedWall.material.opacity = 0.5;
        this.udpateGUIPos(this.selectedWall);
        this.updateGUIRotation(this.selectedWall);
        this.updateGUIScale(this.selectedWall);
        this.updateGUIMaterial(this.selectedWall);        
    } else {
        this.udpateGUIPos(null);
        this.updateGUIRotation(null);
        this.updateGUIScale(null);
        this.updateGUIMaterial(null);        
    }
};

GameModeProject.prototype.highlightOn = function (cube) {
    this.highlightWall = cube;
    this.highlightWall.material.opacity = 0.5;
};

GameModeProject.prototype.highlightOff = function () {
    if (this.highlightWall === null)
        return;
    if (this.highlightWall === this.selectedWall)
        return;

    this.highlightWall.material.opacity = 1.0;
    this.highlightWall = null;
};

GameModeProject.prototype.highlightOnOff = function (cube, hl) {
    this.highlightWall.material.opacity = hl === true ? 0.5 : 1;
};

GameModeProject.prototype.prepareTextures = function () {
    this.textures = [];
    this.textures[""] = null;
    this.TexNames = this.Files.slice();
    this.StripTexNames = [""];
    for (var i = 0; i < this.Files.length; ++i) {
        if (this.Files[i]) {
            var _tex = new MyTexGfx(this.Files[i]);            
            this.textures[ this.Files[i] ] = _tex;
        }
    }
};

GameModeProject.prototype.createMyStripTexture = function (newTexName) {
    var mtsp = new MyTexStripParams();
    mtsp.numOfStrips = 5;
    this.createMyStripTexture2(newTexName,mtsp);
};

GameModeProject.prototype.createMyStripTexture2 = function (newTexName, params) {
    var _newTex = new MyTexStrip(newTexName,params);
    this.textures[_newTex._name] = _newTex;
    this.TexNames.push(_newTex._name);
    this.StripTexNames.push(_newTex._name);
    
    this.guiData.StripTexName = _newTex._name;

    this.updateWallTexGUI();
    this.updateStripTexGUI();
    this.selStripTextureChanged(_newTex._name);  
};

GameModeProject.prototype.createDraggedFloor = function () {
    var draggedFloorGeometry = new THREE.BoxGeometry(this.gridStep * this.stageSizeX * 4, 10, this.gridStep * this.stageSizeY * 4);
    var draggedFloorMaterial = new THREE.MeshBasicMaterial({color: 0x888888});
    this.draggedFloor = new THREE.Mesh(draggedFloorGeometry, draggedFloorMaterial);
    this.draggedFloor.position.set(0, -this.halfGridStep - 5 - 0.5, 0);
    this.scene.add(this.draggedFloor);    
};

GameModeProject.prototype.createFloor = function () {
    var floorGeometry = new THREE.PlaneGeometry(this.gridStep * this.stageSizeX * 2, this.gridStep * this.stageSizeY * 2, 1,1)

    var floorMaterial = new THREE.MeshBasicMaterial({color: 0xbbbbbb});
    this.floor = new THREE.Mesh(floorGeometry, floorMaterial);
    this.floor._addMyParams();
    
    this.floor.position.set(0, -this.halfGridStep, 0);
    var newRot = this.floor.rotation;
    var rad = THREE.Math.degToRad(-90);
    newRot.x = rad;
    this.floor.rotation = newRot;
    this.scene.add(this.floor);    
}

GameModeProject.prototype.createAxis = function () {
    var draggedIndicatorGeometry = new THREE.PlaneGeometry(this.gridStep, this.gridStep);
    var draggedIndicatorMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
    draggedIndicatorMaterial.transparent = true;
    draggedIndicatorMaterial.opacity = 0.5;
    this.draggedIndicator = new THREE.Mesh(draggedIndicatorGeometry, draggedIndicatorMaterial);
    this.draggedIndicator.position.set(100, -this.halfGridStep + 0.1, 100);
    var newRot = this.draggedIndicator.rotation;
    var rad = THREE.Math.degToRad(-90);
    newRot.x = rad;
    this.draggedIndicator.rotation = newRot;
    this.draggedIndicator.visible = false;
    this.scene.add(this.draggedIndicator);

    var draggedAxisXGeometry = new THREE.PlaneGeometry(this.gridStep * 2, this.gridStep / 3);
    var draggedAxisXMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
    draggedAxisXMaterial.transparent = false;
    this.draggedAxisX = new THREE.Mesh(draggedAxisXGeometry, draggedAxisXMaterial);
    this.draggedAxisX.position.set(this.gridStep, 0.1, 0);
    this.draggedAxisX.visible = false;
    this.draggedIndicator.add(this.draggedAxisX);

    var draggedAxisYGeometry = new THREE.PlaneGeometry(this.gridStep / 3, this.gridStep * 2);
    var draggedAxisYMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
    draggedAxisYMaterial.transparent = false;
    this.draggedAxisY = new THREE.Mesh(draggedAxisYGeometry, draggedAxisYMaterial);
    this.draggedAxisY.position.set(0, -this.gridStep, 1.0);
    this.draggedAxisY.visible = false;
    this.draggedIndicator.add(this.draggedAxisY);
};
    
GameModeProject.prototype.createGrid = function () {
    var ggoffset = 0.5;
    var gridGeometry = this.createGridGeometry();
    var gridMaterial = new THREE.LineBasicMaterial({color: 0x000000, opacity: 1.0});
    this.gridLine = new THREE.LineSegments(gridGeometry, gridMaterial);
    this.scene.add(this.gridLine);
};

GameModeProject.prototype.createGridGeometry = function () {
    var ggoffset = 0.5;
    var gridGeometry = new THREE.Geometry();
    for (var z = -this.gridSizeY; z <= this.gridSizeY; z += this.gridStep) {
        for (var x = -this.gridSizeX; x <= this.gridSizeX; x += this.gridStep) {
            gridGeometry.vertices.push(new THREE.Vector3(-this.gridSizeX, -this.halfGridStep + ggoffset, z));
            gridGeometry.vertices.push(new THREE.Vector3(this.gridSizeX, -this.halfGridStep + ggoffset, z));
            gridGeometry.vertices.push(new THREE.Vector3(x, -this.halfGridStep + ggoffset, -this.gridSizeY));
            gridGeometry.vertices.push(new THREE.Vector3(x, -this.halfGridStep + ggoffset, this.gridSizeY));
        }
    }
    return gridGeometry;
};
    
GameModeProject.prototype.createPlayerPos = function (pos,rot,height) {
    var geometry = new THREE.BoxGeometry(this.gridStep*0.5, this.gridStep, this.gridStep*0.5);
    var material = new THREE.MeshBasicMaterial({color: 0xff0000, map: null});
    this.playerPos = new THREE.Mesh(geometry, material);
    this.playerPos.position.x = pos.x;
    this.playerPos.position.z = pos.y;
    
    
    this.playerPos.scale.y = height;
    this.playerPos.position.y = this.gridStep*height / 2 - this.halfGridStep; 
    
    this.playerPos.rotation.y = rot;
    this.scene.add(this.playerPos); 
    
    var geometry2 = new THREE.BoxGeometry(this.gridStep*0.25, this.gridStep*0.5, this.gridStep*0.5);
    var material2 = new THREE.MeshBasicMaterial({color: 0x00ff00, map: null});
    this.playerPos2 = new THREE.Mesh(geometry2, material2);
    this.playerPos2.position.y = ( (this.gridStep*height / 2) - this.halfGridStep ) / height;
    this.playerPos2.position.z = -(this.gridStep*0.5 / 2) + (this.gridStep*0.25 / 2); 
    this.playerPos2.scale.y = 1/height;
    
    this.playerPos.add(this.playerPos2); 
};

GameModeProject.prototype.updatePlayerHeight = function(newHeight){
    this.playerPos.scale.y = newHeight;
    this.playerPos.position.y = this.gridStep*newHeight / 2 - this.halfGridStep; 
    this.playerPos2.position.y = ( (this.gridStep*newHeight / 2) - this.halfGridStep ) / newHeight;
    this.playerPos2.scale.y = 1/newHeight;
};

GameModeProject.prototype.updatePlayer = function(playerData){
    this.playerPos.position.x = playerData.PosX;
    this.playerPos.position.z = playerData.PosZ;
    this.playerPos.rotation.y = playerData.Rot;
    this.updatePlayerHeight(playerData.Height);
    
    this.guiData.pd.PosX = playerData.PosX / this.gridStep;
    this.guiData.pd.PosZ = playerData.PosZ / this.gridStep;
    this.guiData.pd.Rot = THREE.Math.radToDeg(playerData.Rot);
    this.guiData.pd.Height = playerData.Height;
};

GameModeProject.prototype.updateFloor = function(floorData){
    //console.log(floorData);
    
    floorColorChanged(floorData.Color);
    floorTextureChanged(floorData.File);
    floorTexRepeatXChanged(floorData.RepeatX);
    floorTexRepeatYChanged(floorData.RepeatY);
    
    this.guiData.fm.Color = floorData.Color;
    this.guiData.fm.File = floorData.File;
    this.guiData.fm.RepeatX = floorData.RepeatX;
    this.guiData.fm.RepeatY = floorData.RepeatY;
};
 
GameModeProject.prototype.updateStage = function(stageData){
    this.updateStageSize(stageData.SizeX,stageData.SizeY);
    this.setProjClearColor(stageData.ProjBackColor);
    this.setVisitClearColor(stageData.VisitBackColor);
    
    this.guiData.sd.SizeX = stageData.SizeX;
    this.guiData.sd.SizeY = stageData.SizeY;
    this.guiData.sd.ProjBackColor = stageData.ProjBackColor;
    this.guiData.sd.VisitBackColor = stageData.VisitBackColor;
};

GameModeProject.prototype.updateStageSizeX = function(newSizeX){
    this.updateStageSize(newSizeX, this.stageSizeY);
}

GameModeProject.prototype.updateStageSizeY = function (newSizeY) {
    this.updateStageSize(this.stageSizeX, newSizeY);
}

GameModeProject.prototype.updateStageSize = function(newSizeX,newSizeY){    
    this.stageSizeX = newSizeX;
    this.stageSizeY = newSizeY;
    this.gridSizeX = this.stageSizeX * this.gridStep;
    this.gridSizeY = this.stageSizeY * this.gridStep;
    this.halfGridStep = this.gridStep * 0.5;
    
    //draggedFloor
    var draggedFloorGeometry = new THREE.BoxGeometry(this.gridStep * this.stageSizeX * 4, 10, this.gridStep * this.stageSizeY * 4);
    this.draggedFloor.geometry = draggedFloorGeometry;
    
    //floor
    var floorGeometry = new THREE.PlaneGeometry(this.gridStep * this.stageSizeX * 2, this.gridStep * this.stageSizeY * 2, 1,1);
    this.floor.geometry = floorGeometry;
    this.floor._setMyUV(this.floor._myUVX,this.floor._myUVY);
     
    //grid
    var ggoffset = 0.5;
    var gridGeometry = this.createGridGeometry();
    this.gridLine.geometry = gridGeometry;
    
    this.cntrPlayerPosX.min(-this.stageSizeX);
    this.cntrPlayerPosX.max(this.stageSizeX);
    this.cntrPlayerPosZ.min(-this.stageSizeY);
    this.cntrPlayerPosZ.max(this.stageSizeY);

    //this.wallCntrX.min(-this.stageSizeX);
    //this.wallCntrX.max(this.stageSizeX);
    //this.wallCntrZ.min(-this.stageSizeY);
    //this.wallCntrZ.max(this.stageSizeY);
};

GameModeProject.prototype.createWall = function (nwd/*NewWallData*/) {
    var geometry = new THREE.BoxGeometry(this.gridStep, this.gridStep, this.gridStep);
    var material = null;
    
    material = new THREE.MeshBasicMaterial({color: nwd.Material.Color, map: null});
    material.transparent = true;
    
    var newWall = new THREE.Mesh(geometry, material);
    newWall._addMyParams();    
    newWall._setMyTex(this.textures[nwd.Material.TexName])
    newWall._setMyUV(nwd.Material.RepeatX,nwd.Material.RepeatY);
    
    newWall.position.set(nwd.Pos.X, nwd.Pos.Y, nwd.Pos.Z);
    
    var _rot = newWall.rotation;
    _rot.x = 0.0;
    _rot.y = nwd.Rot;
    _rot.z = 0.0;
    newWall.rotation = _rot;
    
    newWall.scale.set(nwd.Scale.X, nwd.Scale.Y, nwd.Scale.Z);
    
    this.scene.add(newWall);
    this.walls.push(newWall);
    return newWall;
};

GameModeProject.prototype.createWallData = function (wall) {
    var wallData = new WallData();
    
    var _pos = wall.position;
    wallData.Pos.X = _pos.x;
    wallData.Pos.Y = _pos.y;
    wallData.Pos.Z = _pos.z;
    
    var _rot = wall.rotation;
    wallData.Rot = _rot.y;
    
    var _scl = wall.scale;
    wallData.Scale.X = _scl.x;    
    wallData.Scale.Y = _scl.y;
    wallData.Scale.Z = _scl.z;
    
    var _mat = wall.material;
    wallData.Material.Color = "#" + _mat.color.getHexString();

    if( wall._myTex ){
        wallData.Material.TexName = wall._myTex._name;
    }
    
    wallData.Material.RepeatX = wall._myUVX;
    wallData.Material.RepeatY = wall._myUVY; 
        
    return wallData;
};
   
GameModeProject.prototype.createPlayerData = function(){
    var playerData = new PlayerData();
    
    playerData.PosX = this.playerPos.position.x;
    playerData.PosZ = this.playerPos.position.z;
    playerData.Rot = this.playerPos.rotation.y;
    playerData.Height = this.guiData.pd.Height;
    
    return playerData;
};
   
GameModeProject.prototype.addWall = function () {    
    var newWallData = new WallData();
    
    var newWall = this.createWall(newWallData);
    this.setHighlighted(newWall);
    this.setSelected(newWall);
    
    return newWall;
};

GameModeProject.prototype.removeSelectedWall = function () {
    if(!this.selectedWall) {
        alert("Select wall to remove");
        return;
    }
    var wallToRemove = this.selectedWall;
    var removedIndex = this.walls.indexOf(wallToRemove);
    this.walls.splice(removedIndex,1);        

    this.scene.remove(wallToRemove);  
    
    this.setSelected(null);  
    this.setHighlighted(null);
};    

GameModeProject.prototype.duplicateSelectedWall = function () {
    if(!this.selectedWall) {
        alert("Select wall to duplicate");
        return;
    }
    
    var newWallData = this.createWallData(this.selectedWall);
    
    newWallData.Pos.X = 0;
    newWallData.Pos.Z = 0;
    
    this.setSelected(null);  
    this.setHighlighted(null);
    
    var newWall = this.createWall(newWallData);
    
    this.setHighlighted(newWall);
    this.setSelected(newWall); 
};

var SaveData = function(){
    this.StageData = new StageData(gameModeProject);
    this.TexturesDatas = [];
    this.WallDatas = [];    
    this.PlayerData = new PlayerData();
    this.FloorData = gameModeProject.guiData.fm;
};

GameModeProject.prototype.saveFile = function(){
    var fileName = prompt("File name", "scene");
    if (fileName !== null) {

        //var output = gameModeProject.scene.toJSON();
        var saveData = new SaveData();
        
         for( var i = 0 ; i < this.walls.length ; ++i ){
            //var output = this.createWallData(this.selectedWall); //this.guiData.fm;// "{asdf}";
            var wallData = this.createWallData(this.walls[i]);
            saveData.WallDatas.push(wallData);
        }
        
//        //console.log(this.textures.length);
//        for( var i = 0 ; i < this.textures.length ; ++i ){
//            //console.log(this.textures[i]);
//            if( this.textures[i]._type === 2 ){
//                //console.log(this.textures[i].getSelTexData());
//                saveData.TexuresDatas.push(this.textures[i].getSelTexData());
//            }
//        }
        
        for (var key in this.textures) {
            //console.log(this.textures[key]);
            if(this.textures[key]) {
                if (this.textures[key]._type === 2) {
                    saveData.TexturesDatas.push(this.textures[key].getSelTexData());
                }
            }
        }
        
        saveData.PlayerData = this.createPlayerData();
        
        try {
            saveData = JSON.stringify(saveData, null, '\t');
            saveData = saveData.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');

        } catch (e) {

            saveData = JSON.stringify(saveData);
        }
        
        saveString(saveData, fileName + '.game5scene');
        
        //console.log(saveData);        
        //var loadData = jQuery.parseJSON(saveData);
        //this.load(loadData);
    }
};

GameModeProject.prototype.loadFile = function(file){
    
    var filename = file.name;
    //var extension = filename.split('.').pop().toLowerCase();

    var reader = new FileReader();
//    reader.addEventListener('progress', function (event) {
//        var size = '(' + Math.floor(event.total / 1000).format() + ' KB)';
//        var progress = Math.floor((event.loaded / event.total) * 100) + '%';
//        console.log('Loading', filename, size, progress);
//    });
    
    reader.addEventListener('load', function (event) {
        var contents = event.target.result;
        
        //var saveData = new SaveData();
        //console.log(contents);
        
        var loadData = jQuery.parseJSON(contents);
        gameModeProject.load(loadData);
    });    
    
    reader.readAsText( file );
};

GameModeProject.prototype.load = function(loadData){    
    //console.log("load");
    
    this.setSelected(null);
    this.setHighlighted(null);
    
    this.prepareTextures();
    for( var i = 0 ; i < loadData.TexturesDatas.length ; ++i ){
        var td = loadData.TexturesDatas[i];
//        var SelTexData = function () {
//            this.Name = "";
//            this.NumOfStrips = 2;
//            this.Colors = ["#000000", "#ffffff"];
//            this.Vertical = false;
//        };
        var mtsp = new MyTexStripParams();
        mtsp.numOfStrips = td.NumOfStrips;
        mtsp.colors = td.Colors;
        mtsp.orientation = td.Vertical ? MTSOrientation.VERTICAL : MTSOrientation.HORIZONTAL;
        gameModeProject.createMyStripTexture2( td.Name, mtsp );
    }
    //console.log(this.textures);
    
    for( var i = 0 ; i < this.walls.length ; ++i ){
        this.scene.remove(this.walls[i]);
    }
    this.walls = [];
    
    gameModeProject.updateStage(loadData.StageData);
        
    for( var i = 0 ; i < loadData.WallDatas.length ; ++i ){
        gameModeProject.createWall( loadData.WallDatas[i] );
    }
        
    gameModeProject.updatePlayer(loadData.PlayerData);        
    //console.log(loadData.FloorData);
    gameModeProject.updateFloor(loadData.FloorData);    
};

