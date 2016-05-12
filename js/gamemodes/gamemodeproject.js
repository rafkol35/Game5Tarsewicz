function GameModeProject(name) {
    GameMode.call(this, name);

    this.scene = new THREE.Scene();

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

    this.gridStep = 50;
    this.stageSize = 10;
    this.gridSize = this.stageSize * this.gridStep;
    this.halfGridStep = this.gridStep * 0.5;

    this.sod = new SOD();
    this.createGUI();
    this.prepareTextures();
    this.createDraggedFloor();
    this.createFloor();
    this.createAxis();
    this.createGrid();
    
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
    
    //this.createWall();

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
    return 0xffffff;
};

GameModeProject.prototype.activate = function () {
    //console.log('activate project');
    $(this.gui.domElement).attr("hidden", false);
    this.clear();
};

GameModeProject.prototype.deactivate = function () {
    //console.log('deactivate project');
    $(this.gui.domElement).attr("hidden", true);
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

GameModeProject.prototype.keyDown = function (event) {

    //console.log(event.keyCode);
    //console.log(this.text.PosX++);

    //this.text.PosX = "asdf";

    //console.log(this.gui);

    switch (event.keyCode) {

        case 82:
            if (this.draggedWall !== null) {
                this.rotateObject = true;
                this.rotateOrigin = mouse;
            }
            break;

        case 81: //q
            //this.pressedKeys[event.keyCode] = true;

            //this.camera.zoom = Math.min(5,this.camera.zoom+0.1);
            //console.log( this.camera.zoom );
            //this.onWindowResize();

            break;

        case 69: //e
            //this.pressedKeys[event.keyCode] = true;

            //this.camera.zoom = Math.max(0.1,this.camera.zoom-0.1);
            //console.log( this.camera.zoom );
            //this.onWindowResize();

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
//            if (canJump === true)
//                velocity.y += 350;
//            canJump = false;
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
        //console.log("asdf");
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
    
//    if (cm) {
//        this.camera.position.x = Math.sin(this.xrat) * this.cameraRestrict.x;
//        this.camera.position.y = Math.sin(this.yrat) * this.cameraRestrict.y;
//        this.camera.position.z = Math.cos(this.zrat) * this.cameraRestrict.z;
//        this.camera.lookAt(this.scene.position);        
//    }
    //if (this.draggedWall === null) {
    //    this.setHighlighted(this.getFirstUnderMouse());
    //}

    renderer.setClearColor(this.getClearColor());
    renderer.render(this.scene, this.camera);
};

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
            //this.draggedIndicator.rotation = cube.rotation.y
            var axesRot = this.draggedIndicator.rotation;
            axesRot.z = cube.rotation.y;
            this.draggedIndicator.rotation = axesRot;
        }
    }
};
GameModeProject.prototype.udpateGUIPos = function (cube) {
    if (cube !== null) {
        this.sod.pos.X = cube.position.x / this.gridStep;
        this.sod.pos.Y = cube.position.y / this.gridStep;
        this.sod.pos.Z = cube.position.z / this.gridStep;
    } else {
        this.sod.pos.X = "Nan";
        this.sod.pos.Y = "Nan";
        this.sod.pos.Z = "Nan";
    }
};

GameModeProject.prototype.updateGUIRotation = function (cube) {
    if (cube !== null) {
        var sor = cube.rotation;
        this.sod.rot.X = THREE.Math.radToDeg(sor.x);
        this.sod.rot.Y = THREE.Math.radToDeg(sor.y);
        this.sod.rot.Z = THREE.Math.radToDeg(sor.z);
    } else {
        this.sod.rot.X = "Nan";
        this.sod.rot.Y = "Nan";
        this.sod.rot.Z = "Nan";
    }
};

GameModeProject.prototype.updateGUIScale = function (cube) {
    if (cube !== null) {
        this.sod.scale.X = cube.scale.x;
        this.sod.scale.Y = cube.scale.y;
        this.sod.scale.Z = cube.scale.z;
    } else {
        this.sod.scale.X = "Nan";
        this.sod.scale.Y = "Nan";
        this.sod.scale.Z = "Nan";
    }
};

GameModeProject.prototype.setSelected = function (cube) {
    if (this.selectedWall !== null)
        this.selectedWall.material.opacity = 1;
    this.selectedWall = cube;

    if (this.selectedWall !== null) {
        this.selectedWall.material.opacity = 0.5;

        //this.sod.pos.X = this.selectedWall.position.x / this.gridStep;
        //this.sod.pos.Y = this.selectedWall.position.y / this.gridStep;
        //this.sod.pos.Z = this.selectedWall.position.z / this.gridStep;        
        this.udpateGUIPos(this.selectedWall);

        //var sor = this.selectedWall.rotation;
        //this.sod.rot.X = THREE.Math.radToDeg(sor.x);
        //this.sod.rot.Y = THREE.Math.radToDeg(sor.y);
        //this.sod.rot.Z = THREE.Math.radToDeg(sor.z);
        this.updateGUIRotation(this.selectedWall);

        //this.sod.scale.X = this.selectedWall.scale.x;
        //this.sod.scale.Y = this.selectedWall.scale.y;
        //this.sod.scale.Z = this.selectedWall.scale.z;
        this.updateGUIScale(this.selectedWall);

        //this.sod.Color = "#000000";
        this.sod.Color = "#" + this.selectedWall.material.color.getHexString();

        //console.log(this.selectedWall.material.map);
        //console.log(this.selectedWall.material.map.image.src);

        var curMap = this.selectedWall.material.map;
        if (curMap !== null) {
            var texName = this.selectedWall.material.map.image.src;
            var n1 = texName.lastIndexOf('/') + 1;
            var n2 = texName.lastIndexOf('.png');
            this.sod.Texture = texName.substr(n1, n2 - n1);
        } else {
            this.sod.Texture = "";
        }

    } else {
        //this.sod.pos.X = "Nan";
        //this.sod.pos.Y = "Nan";
        //this.sod.pos.Z = "Nan";
        this.udpateGUIPos(null);

        //this.sod.rot.X = "Nan";
        //this.sod.rot.Y = "Nan";
        //this.sod.rot.Z = "Nan";
        this.updateGUIRotation(null);

        //this.sod.scale.X = "Nan";
        //this.sod.scale.Y = "Nan";
        //this.sod.scale.Z = "Nan";
        this.updateGUIScale(null);

        this.sod.Color = "#000000";

        this.sod.Texture = "";
    }

//    if( cube === null ){ //zerowanie
//        if( this.selectedWall !== null ) {
//            this.selectedWall.material.opacity = 1;
//            this.selectedWall = null;
//        }
//    }else{ //ustawianie
//        if( this.selectedWall !== cube ){
//            if( this.selectedWall !== null ) this.selectedWall.material.opacity = 1;
//            this.selectedWall = cube;
//            this.selectedWall.material.opacity = 0.5;
//        }        
//    }
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
    //this.highlightWall = cube;
    //console.log("this.highlightOn");
    this.highlightWall.material.opacity = hl === true ? 0.5 : 1;
};

GameModeProject.prototype.createGUI = function () {
    this.gui = new dat.GUI({
//        height: 5 * 32 - 1
//        autoPlace: false
    });

    {
        var folderPosition = this.gui.addFolder('Position');

        var cntr = folderPosition.add(this.sod.pos, 'X', -this.stageSize, this.stageSize).listen();
        cntr.step(0.1);
        //cntr.min(-this.stageSize/2);
        //cntr.max(this.stageSize/2);
        cntr.onChange(selObjPosChanged);
        cntr.onFinishChange(selObjPosChanged);

        cntr = folderPosition.add(this.sod.pos, 'Y', 0, 10).listen();
        cntr.step(0.1);//.min(0).max(30);
        cntr.onChange(selObjPosChanged);
        cntr.onFinishChange(selObjPosChanged);

        cntr = folderPosition.add(this.sod.pos, 'Z', -this.stageSize, this.stageSize).listen();
        cntr.step(0.1).min(-this.stageSize).max(this.stageSize);
        cntr.onChange(selObjPosChanged);
        cntr.onFinishChange(selObjPosChanged);
    }

    {
        var folder = this.gui.addFolder('Rotation');

        var cntr = folder.add(this.sod.rot, 'X').listen();
        //cntr.step(0.1);
        cntr.onChange(selObjRotChanged);
        cntr.onFinishChange(selObjRotChanged);

        cntr = folder.add(this.sod.rot, 'Y').listen();
        //cntr.step(0.1);
        cntr.onChange(selObjRotChanged);
        cntr.onFinishChange(selObjRotChanged);

        cntr = folder.add(this.sod.rot, 'Z').listen();
        //cntr.step(0.1);
        cntr.onChange(selObjRotChanged);
        cntr.onFinishChange(selObjRotChanged);
    }

    {
        var folder = this.gui.addFolder('Scale');

        var cntr = folder.add(this.sod.scale, 'X').listen();
        cntr.step(0.1).min(0.1);
        cntr.onChange(selObjScaleChanged);
        cntr.onFinishChange(selObjScaleChanged);

        cntr = folder.add(this.sod.scale, 'Y').listen();
        cntr.step(0.1).min(0.1);
        cntr.onChange(selObjScaleChanged);
        cntr.onFinishChange(selObjScaleChanged);

        cntr = folder.add(this.sod.scale, 'Z').listen();
        cntr.step(0.1).min(0.1);
        cntr.onChange(selObjScaleChanged);
        cntr.onFinishChange(selObjScaleChanged);
    }

    {
        var cntr = null;
        cntr = this.gui.addColor(this.sod, 'Color').listen();
        cntr.onChange(selObjColorChanged);
        cntr.onFinishChange(selObjColorChanged);
    }

    {
        var cntr = null;
        cntr = this.gui.add(this.sod, 'Texture', this.sod.Textures).listen();
        //cntr.onChange(selObjTextureChanged);
        cntr.onFinishChange(selObjTextureChanged);
    }

    {
        var cntr = null;
        cntr = this.gui.add(this.sod, "AddWall");
        cntr = this.gui.add(this.sod, "DeleteSelectedWall");
        cntr = this.gui.add(this.sod, "DuplicateSelectedWall");
    }
};

GameModeProject.prototype.prepareTextures = function () {
    this.textures = [];
    this.textures[""] = null;
    for (var i = 0; i < this.sod.Textures.length; ++i) {
        if (this.sod.Textures[i]) {
            var _tex = new THREE.TextureLoader().load('textures/' + this.sod.Textures[i] + '.png');
            _tex.wrapS = THREE.RepeatWrapping;
            _tex.wrapT = THREE.RepeatWrapping;
            //_tex.repeat = new THREE.Vector2(2,2);
            this.textures[ this.sod.Textures[i] ] = _tex;
        }
    }
};

GameModeProject.prototype.createDraggedFloor = function () {
    var draggedFloorGeometry = new THREE.BoxGeometry(this.gridStep * this.stageSize * 4, 10, this.gridStep * this.stageSize * 4);
    var draggedFloorMaterial = new THREE.MeshBasicMaterial({color: 0x888888});
    draggedFloorMaterial.transparent = true;
    this.draggedFloor = new THREE.Mesh(draggedFloorGeometry, draggedFloorMaterial);
    this.draggedFloor.position.set(0, -this.halfGridStep - 5 - 0.5, 0);
    this.draggedFloor.visible = true;
    this.scene.add(this.draggedFloor);
};

GameModeProject.prototype.createFloor = function () {
    var floorGeometry = new THREE.PlaneGeometry(
            this.gridStep * this.stageSize * 2,
            this.gridStep * this.stageSize * 2,
            this.stageSize, this.stageSize);

    //var floorGeometry = new THREE.PlaneGeometry(100, 100);

    var floorMaterial = new THREE.MeshBasicMaterial({color: 0xbbbbbb, map: this.textures["rbn_0"]});
    //floorMaterial.transparent = false;
    this.floor = new THREE.Mesh(floorGeometry, floorMaterial);
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
    var gridLine = new THREE.LineSegments(gridGeometry, gridMaterial);
    this.scene.add(gridLine);
};
    
GameModeProject.prototype.createWall = function () {
    var geometry = new THREE.BoxGeometry(this.gridStep, this.gridStep, this.gridStep);
    //var material = new THREE.MeshBasicMaterial({color: 0xff8000, map: this.textures["rbn_0"]});
    var material = new THREE.MeshBasicMaterial({color: 0xff8000, map: null});
    material.transparent = true;
    var _tex = this.textures["rbn_0"].clone();
    _tex.needsUpdate = true;
    //console.log(_tex);
    material.map = _tex;
    material.needsUpdate = true;
    var newWall = new THREE.Mesh(geometry, material);
    newWall.position.set(0, 0, 0);
    this.scene.add(newWall);
    this.walls.push(newWall);
    //cube.castShadow = true;
    return newWall;
};
    
GameModeProject.prototype.addWall = function () {
    //console.log('asdf');
    var newWall = this.createWall();
    this.setSelected(newWall);
};

GameModeProject.prototype.deleteSelectedWall = function () {
    //if(this.selectedWall)
};

GameModeProject.prototype.duplicateSelectedWall = function () {
    
};
  