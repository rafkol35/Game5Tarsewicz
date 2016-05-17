function MyTexStrip(_name){
    MyTex.call(this,_name,2);
    
    Orientation = {
        UNDEF : 0,
        HORIZONTAL : 1,
        VERTICAL : 2        
    };

    this.orientation = Orientation.HORIZONTAL;
    
    this.rebuild();
};

MyTexStrip.prototype = Object.create(MyTex);
MyTexStrip.prototype.constructor = MyTexStrip;

MyTexStrip.prototype.getTHREETexture = function(){
    return this.threeTex;
};

MyTexStrip.prototype.setOrientation = function(newOrientation){
    console.log("setOrientation : " + newOrientation);
    this.orientation = newOrientation;
    this.rebuild();
};

MyTexStrip.prototype.rebuild = function(){
    
    var pixels = [];
    if (this.orientation === Orientation.HORIZONTAL) {
        pixels = [
            0, 0, 0,
            0, 0, 0,
            0, 0, 0,
            0, 0, 0,
            255, 255, 255,
            255, 255, 255,
            255, 255, 255,
            255, 255, 255,
            0, 0, 0,
            0, 0, 0,
            0, 0, 0,
            0, 0, 0,
            255, 255, 255,
            255, 255, 255,
            255, 255, 255,
            255, 255, 255
        ];
    } else {
        pixels = [
            0, 0, 0,
            255, 255, 255,
            0, 0, 0,
            255, 255, 255,
            0, 0, 0,
            255, 255, 255,
            0, 0, 0,
            255, 255, 255,
            0, 0, 0,
            255, 255, 255,
            0, 0, 0,
            255, 255, 255,
            0, 0, 0,
            255, 255, 255,
            0, 0, 0,
            255, 255, 255
        ];
    }
    
    var md = new Uint8Array(pixels);    
    var noiseSize = 4;
    this.threeTex = new THREE.DataTexture(md, noiseSize, noiseSize, THREE.RGBFormat);
    this.threeTex.wrapS = THREE.RepeatWrapping;
    this.threeTex.wrapT = THREE.RepeatWrapping;
    //this.threeTex.repeat = new THREE.Vector2(1,1);
    this.threeTex.needsUpdate = true;      
};

