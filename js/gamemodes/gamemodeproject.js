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
    this.stageSize = 10.0;
    this.gridSize = this.stageSize * this.gridStep;
    this.halfGridStep = this.gridStep * 0.5;

    this.Files = ['',"all",'rbn','rbn_0','rbn_1','rbn_2','sprite','sprite0','sprite1','t1'];
    this.guiData = new PGUIData(this);    
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
    
    //this.light = new THREE.PointLight( 0xffffff, 1, 1000 );
    //this.light.position.set( 0, 0, 0 );
    //this.light.castShadow = true;
    //cube2.add( this.light );

    //var light = new THREE.AmbientLight( 0xffffff ); // soft white light
    //this.scene.add( light );
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

    //console.log(event.keyCode);
    //console.log(this.text.PosX++);

    //this.text.PosX = "asdf";

    //console.log(this.gui);

    //this.Files.push('afafa');
    //this.floorFileCntr.updateDisplay();
    //this.floorFileCntr.remove();
    //this.floorFileCntr = folder.add(this.guiData.fm, 'File', this.Files).listen();
    //this.floorFileCntr.onFinishChange(floorTextureChanged);
    
    //this.floorFileCntr = this.guiFolder.add(this.guiData.fm, 'File', this.Files).listen();
    //this.floorFileCntr.onFinishChange(floorTextureChanged);
        
    //this.guiFolder.close();
    //this.guiFolder.close();
    //this.gui.removeFolder("Floor");
        
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
            var newWallData = new WallData();
            newWallData.Pos.X = -100;
            newWallData.Pos.Y = 50;
            newWallData.Pos.Z = -100;
//    
//    newWallData.Rot.X = THREE.Math.degToRad(0);
//    newWallData.Rot.Y = THREE.Math.degToRad(45);
//    newWallData.Rot.Z = THREE.Math.degToRad(0);
//    
            //newWallData.Scale.X = 4;
            newWallData.Scale.Y = 5;
            //newWallData.Scale.Z = 6;

            newWallData.Material.Color = "#ff00ff";
            newWallData.Material.TexName = this.Files[1];
            newWallData.Material.RepeatX = 2;
            newWallData.Material.RepeatY = 8;

            var newWall = this.createWall(newWallData);
            this.setHighlighted(newWall);
            this.setSelected(newWall);
    
            var ndt = new MyTexStrip("MyTex1");
            newWall.material.map = ndt.getTHREETexture();
            newWall.material.needsUpdate = true;
            
            //console.log(newWall.geometry.faceVertexUvs);
            
//            for( var i = 0 ; i < newWall.geometry.faceVertexUvs[0].length ; ++i ){
//                var _faceVertUV = newWall.geometry.faceVertexUvs[0][i];
//                
//                //console.log("_faceVertUV " + _faceVertUV);
//                
//                for( var j = 0 ; j < _faceVertUV.length ; ++j ){
//                    var _vertUV = _faceVertUV[j];
//                    
//                    //console.log("_vertUV " + _vertUV);
//                    
//                    if( _vertUV.x === 1 ) {                         
//                        _vertUV.x = 2;
//                        //console.log(_faceVertUV[j]);
//                    }
//                    
//                    if( _vertUV.y === 1 ) {                         
//                        _vertUV.y = 8;
//                        //console.log(_faceVertUV[j]);
//                    }
//                }
//            }
    
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

    //console.log(event.keyCode);

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

//    this.Files.push('afafa');
//    this.floorFileCntr.updateDisplay();
//    //this.floorFileCntr = folder.add(this.guiData.fm, 'File', this.Files).listen();
//    //this.floorFileCntr.onFinishChange(floorTextureChanged);
//    

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
//                var _diffPrev = this.scaleOrigin.clone().sub(this.draggedIndicator.position.clone());
//                var _diffCurr = intersects[0].point.clone().sub(this.draggedIndicator.position.clone());
//                
//                var scl = this.draggedWall.scale.x;
//                scl += ( (_diffCurr.length()-_diffPrev.length()) / this.gridStep) * 2;
//                console.log(scl);
//                scl = Math.max(scl,0.1);
//                this.draggedWall.scale.x = scl;
//                
//                this.scaleOrigin = intersects[0].point.clone();
//                this.updateGUIScale(this.selectedWall);

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
                    //console.log(diff);
                    //console.log( THREE.Math.radToDeg( Math.atan2(diff.y,diff.x)) );
                    var rad = Math.atan2(diff.y, diff.x);

                    var newRot = this.selectedWall.rotation;
                    //var rad = THREE.Math.degToRad(val);
                    newRot.y = rad;
                    this.selectedWall.rotation = newRot;

                    var axesRot = this.draggedIndicator.rotation;
                    axesRot.z = newRot.y;
                    this.draggedIndicator.rotation = axesRot;

                    this.updateGUIRotation(this.selectedWall);
                }
            } else {
                var newPos = intersects[0].point.clone().sub(this.draggedWallOffset.clone());
                newPos.x = Math.min(Math.max(-this.gridSize, newPos.x), this.gridSize);
                newPos.z = Math.min(Math.max(-this.gridSize, newPos.z), this.gridSize);
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
    //var cm = false;
    
    if (pressedKeys[81]) {
        this.camera.zoom = Math.min(5, this.camera.zoom + deltaTime * ms);
        this.onWindowResize();
        //cm = true;
    } else if (pressedKeys[69]) {
        this.camera.zoom = Math.max(0.1, this.camera.zoom - deltaTime * ms);
        this.onWindowResize();
        //cm = true;
    }

    if (this.moveLeft) {
        this.xrat -= deltaTime * ms;
        this.zrat -= deltaTime * ms;
        //cm = true;
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
  
    //renderer.setClearColor(this.getClearColor());
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
            //console.log("this.draggedIndicator.visible = false;");
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
            //this.draggedIndicator.rotation = cube.rotation.y
            var axesRot = this.draggedIndicator.rotation;
            axesRot.z = cube.rotation.y;
            this.draggedIndicator.rotation = axesRot;
        }
    }
};
GameModeProject.prototype.udpateGUIPos = function (cube) {
    if (cube !== null) {
        this.guiData.wd.Pos.X = cube.position.x / this.gridStep;
        this.guiData.wd.Pos.Y = cube.position.y / this.gridStep;
        this.guiData.wd.Pos.Z = cube.position.z / this.gridStep;
    } else {
        this.guiData.wd.Pos.X = "Nan";
        this.guiData.wd.Pos.Y = "Nan";
        this.guiData.wd.Pos.Z = "Nan";
    }
};

GameModeProject.prototype.updateGUIRotation = function (cube) {
    if (cube !== null) {
        var sor = cube.rotation;
        this.guiData.wd.Rot.X = THREE.Math.radToDeg(sor.x);
        this.guiData.wd.Rot.Y = THREE.Math.radToDeg(sor.y);
        this.guiData.wd.Rot.Z = THREE.Math.radToDeg(sor.z);
    } else {
        this.guiData.wd.Rot.X = "Nan";
        this.guiData.wd.Rot.Y = "Nan";
        this.guiData.wd.Rot.Z = "Nan";
    }
};

GameModeProject.prototype.updateGUIScale = function (cube) {
    if (cube !== null) {
        this.guiData.wd.Scale.X = cube.scale.x;
        this.guiData.wd.Scale.Y = cube.scale.y;
        this.guiData.wd.Scale.Z = cube.scale.z;
    } else {
        this.guiData.wd.Scale.X = "Nan";
        this.guiData.wd.Scale.Y = "Nan";
        this.guiData.wd.Scale.Z = "Nan";
    }
};

GameModeProject.prototype.updateGUIMaterial = function (cube) {
    if (cube !== null) {
        this.guiData.wd.Material.Color = "#" + this.selectedWall.material.color.getHexString();
        var curMap = this.selectedWall.material.map;
        if (curMap !== null) {
            this.guiData.wd.Material.TexName = cube._myTex._name;                        
        } else {
            this.guiData.wd.Material.TexName = "";            
        }
        this.guiData.wd.Material.RepeatX = cube._myUVX;
        this.guiData.wd.Material.RepeatY = cube._myUVY;
    } else {
        this.guiData.wd.Material.Color = "#000000";            
        this.guiData.wd.Material.TexName = "";
        this.guiData.wd.Material.RepeatX = 1;
        this.guiData.wd.Material.RepeatY = 1;
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
        
        //this.selectedWall.ff11();
        //this.selectedWall._printMyParams();
    } else {
        this.udpateGUIPos(null);
        this.updateGUIRotation(null);
        this.updateGUIScale(null);
        this.updateGUIMaterial(null);        
    }
};

GameModeProject.prototype.highlightOn = function (cube) {
    this.highlightWall = cube;
    //console.log("this.highlightOn");
    this.highlightWall.material.opacity = 0.5;
};

GameModeProject.prototype.highlightOff = function () {
    //console.log(this.highlightWall);
    if (this.highlightWall === null)
        return;
    if (this.highlightWall === this.selectedWall)
        return;

    this.highlightWall.material.opacity = 1.0;
    //console.log("this.highlightOff");
    //console.log(this.highlightWall);
    this.highlightWall = null;
};

GameModeProject.prototype.highlightOnOff = function (cube, hl) {
    this.highlightWall.material.opacity = hl === true ? 0.5 : 1;
};

GameModeProject.prototype.createGUI = function () {
    this.gui = new dat.GUI({
//        height: 5 * 32 - 1
//        autoPlace: false
    });

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
        var folder = wallFolder.addFolder('Rotation');

        var cntr = folder.add(this.guiData.wd.Rot, 'X').listen();
        //cntr.step(0.1);
        cntr.onChange(selObjRotChanged);
        cntr.onFinishChange(selObjRotChanged);

        cntr = folder.add(this.guiData.wd.Rot, 'Y').listen();
        //cntr.step(0.1);
        cntr.onChange(selObjRotChanged);
        cntr.onFinishChange(selObjRotChanged);

        cntr = folder.add(this.guiData.wd.Rot, 'Z').listen();
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
        
    }

    {        
        var folder = wallFolder.addFolder('Material');
        
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
        
        cntr = folder.add(this.guiData.wd.Material, 'TexName', this.Files).listen();
        //cntr.onChange(selObjTextureChanged);
        cntr.onFinishChange(selObjTextureChanged);
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

GameModeProject.prototype.createGUITex = function (){
    this.guiTex = new dat.GUI({
//        height: 5 * 32 - 1
//        autoPlace: false
    });
};

GameModeProject.prototype.prepareTextures = function () {
    this.textures = [];
    this.textures[""] = null;
    for (var i = 0; i < this.Files.length; ++i) {
        if (this.Files[i]) {
            //var _tex = new THREE.TextureLoader().load('textures/' + this.Files[i] + '.png');
            //_tex.wrapS = THREE.RepeatWrapping;
            //_tex.wrapT = THREE.RepeatWrapping;
            ////_tex.repeat = new THREE.Vector2(2,2);
            
            var _tex = new MyTexGfx(this.Files[i]);            
            this.textures[ this.Files[i] ] = _tex;
        }
    }
    
    //console.log(this.textures);
};

GameModeProject.prototype.createDraggedFloor = function () {
    var draggedFloorGeometry = new THREE.BoxGeometry(this.gridStep * this.stageSize * 4, 10, this.gridStep * this.stageSize * 4);
    var draggedFloorMaterial = new THREE.MeshBasicMaterial({color: 0x888888});
    //draggedFloorMaterial.transparent = true;
    //draggedFloorMaterial.opacity = 0.1;
    this.draggedFloor = new THREE.Mesh(draggedFloorGeometry, draggedFloorMaterial);
    this.draggedFloor.position.set(0, -this.halfGridStep - 5 - 0.5, 0);
    //this.draggedFloor.visible = true;
    this.scene.add(this.draggedFloor);
    //draggedFloorMaterial.needsUpdate = true;    
};

GameModeProject.prototype.createFloor = function () {
    var floorGeometry = new THREE.PlaneGeometry(
            this.gridStep * this.stageSize * 2,
            this.gridStep * this.stageSize * 2,
            //this.stageSize, this.stageSize);
            1,1)

    //var floorGeometry = new THREE.PlaneGeometry(100, 100);

    //var floorMaterial = new THREE.MeshBasicMaterial({color: 0xbbbbbb, map: this.textures["rbn_0"]});
    var floorMaterial = new THREE.MeshBasicMaterial({color: 0xbbbbbb});
    
    //floorMaterial.transparent = true;
    this.floor = new THREE.Mesh(floorGeometry, floorMaterial);
    this.floor._addMyParams();
    
    this.floor.position.set(0, -this.halfGridStep, 0);
    var newRot = this.floor.rotation;
    var rad = THREE.Math.degToRad(-90);
    newRot.x = rad;
    this.floor.rotation = newRot;
    //this.floor.receiveShadow = true;    
    //this.floor.visible = true;
    this.scene.add(this.floor);
    //console.log(this.floor);
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
    //console.log(this.floor);

    var draggedAxisXGeometry = new THREE.PlaneGeometry(this.gridStep * 2, this.gridStep / 3);
    var draggedAxisXMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
    draggedAxisXMaterial.transparent = false;
    this.draggedAxisX = new THREE.Mesh(draggedAxisXGeometry, draggedAxisXMaterial);
    this.draggedAxisX.position.set(this.gridStep, 0.1, 0);
    //   var newRot = this.draggedAxisX.rotation;
//    var rad = THREE.Math.degToRad(-90);    
//    newRot.x = rad;
//    this.draggedAxisX.rotation = newRot;
    this.draggedAxisX.visible = false;
    this.draggedIndicator.add(this.draggedAxisX);

    var draggedAxisYGeometry = new THREE.PlaneGeometry(this.gridStep / 3, this.gridStep * 2);
    var draggedAxisYMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
    draggedAxisYMaterial.transparent = false;
    this.draggedAxisY = new THREE.Mesh(draggedAxisYGeometry, draggedAxisYMaterial);
    this.draggedAxisY.position.set(0, -this.gridStep, 1.0);
//    var newRot = this.draggedAxisY.rotation;
//    var rad = THREE.Math.degToRad(-90);    
//    newRot.x = rad;
//    this.draggedAxisY.rotation = newRot;
    this.draggedAxisY.visible = false;
    this.draggedIndicator.add(this.draggedAxisY);
};
    
GameModeProject.prototype.createGrid = function () {
    var ggoffset = 0.5;
    var gridGeometry = new THREE.Geometry();
    for (var i = -this.gridSize; i <= this.gridSize; i += this.gridStep) {
        gridGeometry.vertices.push(new THREE.Vector3(-this.gridSize, -this.halfGridStep + ggoffset, i));
        gridGeometry.vertices.push(new THREE.Vector3(this.gridSize, -this.halfGridStep + ggoffset, i));
        gridGeometry.vertices.push(new THREE.Vector3(i, -this.halfGridStep + ggoffset, -this.gridSize));
        gridGeometry.vertices.push(new THREE.Vector3(i, -this.halfGridStep + ggoffset, this.gridSize));
    }
    var gridMaterial = new THREE.LineBasicMaterial({color: 0x000000, opacity: 1.0});
    this.gridLine = new THREE.LineSegments(gridGeometry, gridMaterial);
    this.scene.add(this.gridLine);
};
    
GameModeProject.prototype.createPlayerPos = function (pos,rot,height) {
    //console.log(pos);
    var geometry = new THREE.BoxGeometry(this.gridStep*0.5, this.gridStep, this.gridStep*0.5);
    var material = new THREE.MeshBasicMaterial({color: 0xff0000, map: null});
    //material.transparent = true;
    //material.opacity = 0.5;
    this.playerPos = new THREE.Mesh(geometry, material);
    this.playerPos.position.x = pos.x;
    this.playerPos.position.z = pos.y;
    
    
    this.playerPos.scale.y = height;
    this.playerPos.position.y = this.gridStep*height / 2 - this.halfGridStep; 
    
    this.playerPos.rotation.y = rot;
    this.scene.add(this.playerPos); 
    
    var geometry2 = new THREE.BoxGeometry(this.gridStep*0.25, this.gridStep*0.5, this.gridStep*0.5);
    var material2 = new THREE.MeshBasicMaterial({color: 0x00ff00, map: null});
    //material.transparent = true;
    //material.opacity = 0.5;
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
    this.updateStageSize(stageData.Size);
    this.setProjClearColor(stageData.ProjBackColor);
    this.setVisitClearColor(stageData.VisitBackColor);
    
    this.guiData.sd.Size = stageData.Size;
    this.guiData.sd.ProjBackColor = stageData.ProjBackColor;
    this.guiData.sd.VisitBackColor = stageData.VisitBackColor;
};

GameModeProject.prototype.updateStageSize = function(newSize){
    this.stageSize = newSize;
    this.gridSize = this.stageSize * this.gridStep;
    this.halfGridStep = this.gridStep * 0.5;
    
    //draggedFloor
    var draggedFloorGeometry = new THREE.BoxGeometry(this.gridStep * this.stageSize * 4, 10, this.gridStep * this.stageSize * 4);
    this.draggedFloor.geometry = draggedFloorGeometry;
    
    //floor
    var floorGeometry = new THREE.PlaneGeometry(
            this.gridStep * this.stageSize * 2,
            this.gridStep * this.stageSize * 2,
            1,1);
    this.floor.geometry = floorGeometry;
    this.floor._setMyUV(this.floor._myUVX,this.floor._myUVY);
     
    //grid
    var ggoffset = 0.5;
    var gridGeometry = new THREE.Geometry();
    for (var i = -this.gridSize; i <= this.gridSize; i += this.gridStep) {
        gridGeometry.vertices.push(new THREE.Vector3(-this.gridSize, -this.halfGridStep + ggoffset, i));
        gridGeometry.vertices.push(new THREE.Vector3(this.gridSize, -this.halfGridStep + ggoffset, i));
        gridGeometry.vertices.push(new THREE.Vector3(i, -this.halfGridStep + ggoffset, -this.gridSize));
        gridGeometry.vertices.push(new THREE.Vector3(i, -this.halfGridStep + ggoffset, this.gridSize));
    }
    this.gridLine.geometry = gridGeometry;
    
    this.cntrPlayerPosX.min(-this.stageSize);
    this.cntrPlayerPosX.max(this.stageSize);
    this.cntrPlayerPosZ.min(-this.stageSize);
    this.cntrPlayerPosZ.max(this.stageSize);
    
    //if( this.selectedWall ){
        //this.udpateGUIPos(this.selectedWall);
    //}
};

GameModeProject.prototype.createWall = function (nwd/*NewWallData*/) {
    var geometry = new THREE.BoxGeometry(this.gridStep, this.gridStep, this.gridStep);
    //var material = new THREE.MeshBasicMaterial({color: nwd.Material.Color, map: this.textures[nwd.Material.File]});
    var material = null;
    
    //if(this.textures[nwd.Material.TexName])
    //    material = new THREE.MeshBasicMaterial({color: nwd.Material.Color, map: this.textures[nwd.Material.File].getTHREETexture()});
    //else
      
    material = new THREE.MeshBasicMaterial({color: nwd.Material.Color, map: null});

    material.transparent = true;
//    if( nwd.Material.File ){
//        var _tex = this.textures[nwd.Material.File].clone();
//        _tex.repeat.x = nwd.Material.RepeatX;
//        _tex.repeat.y = nwd.Material.RepeatY;
//        _tex.needsUpdate = true;
//        material.map = _tex;
//        material.needsUpdate = true;
//    }
    var newWall = new THREE.Mesh(geometry, material);
    //var newWall = new Wall(geometry, material);
    newWall._addMyParams();    
    newWall.setMyTex(this.textures[nwd.Material.TexName])
    newWall._setMyUV(nwd.Material.RepeatX,nwd.Material.RepeatY);
    
    //newWall.position.set(nwd.Pos.X * this.gridStep, nwd.Pos.Y * this.gridStep, nwd.Pos.Z * this.gridStep);
    newWall.position.set(nwd.Pos.X, nwd.Pos.Y, nwd.Pos.Z);
    
    var _rot = newWall.rotation;
    //_rot.x = THREE.Math.degToRad(nwd.Rot.X);
    //_rot.y = THREE.Math.degToRad(nwd.Rot.Y);
    //_rot.z = THREE.Math.degToRad(nwd.Rot.Z);
    _rot.x = nwd.Rot.X;
    _rot.y = nwd.Rot.Y;
    _rot.z = nwd.Rot.Z;
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
    wallData.Rot.X = _rot.x;
    wallData.Rot.Y = _rot.y;
    wallData.Rot.Z = _rot.z;
    
    var _scl = wall.scale;
    wallData.Scale.X = _scl.x;    
    wallData.Scale.Y = _scl.y;
    wallData.Scale.Z = _scl.z;
    
    var _mat = wall.material;
    wallData.Material.Color = "#" + _mat.color.getHexString();
    if( _mat.map ){
        var texName = _mat.map.image.src;
        var n1 = texName.lastIndexOf('/') + 1;
        var n2 = texName.lastIndexOf('.png');        
        wallData.Material.File = texName.substr(n1, n2 - n1);
        
        //wallData.Material.RepeatX = _mat.map.repeat.x;
        //wallData.Material.RepeatY = _mat.map.repeat.y;        
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
    
//    newWallData.Pos.X = 100;
//    newWallData.Pos.Y = 50;
//    newWallData.Pos.Z = 100;
//    
//    newWallData.Rot.X = THREE.Math.degToRad(0);
//    newWallData.Rot.Y = THREE.Math.degToRad(45);
//    newWallData.Rot.Z = THREE.Math.degToRad(0);
//    
//    newWallData.Scale.X = 4;
//    newWallData.Scale.Y = 5;
//    newWallData.Scale.Z = 6;
//    
//    newWallData.Color = "#ff00ff";
//    
//    newWallData.Texture.File = this.Files[1];
//    newWallData.Texture.RepeatX = 2;
//    newWallData.Texture.RepeatY = 3;
    
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
        
        saveData.PlayerData = this.createPlayerData();
        
        try {
            saveData = JSON.stringify(saveData, null, '\t');
            saveData = saveData.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');

        } catch (e) {

            saveData = JSON.stringify(saveData);
        }
        
        saveString(saveData, fileName + '.game5scene');
        
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

