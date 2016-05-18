MTSOrientation = {
    UNDEF: 0,
    HORIZONTAL: 1,
    VERTICAL: 2
};
    
function MyTexStrip(_name, params){
    MyTex.call(this,_name,2);
    
    this.numOfStrips = params.numOfStrips;
    this.orientation = params.orientation; // MTSOrientation.HORIZONTAL;
    this.colors = params.colors;
    
    this.pixels = new Array(16 * 3);
    //console.log(this.pixels2.length);
    
//    var _a1 = [12,15,16];
//    console.log(_a1);
//    var _a2 = _a1;
//    _a2[1] = 999;
//    console.log(_a1);
    
    this.rebuild();
};

var MyTexStripParams = function(){
    this.numOfStrips = 2;
    this.orientation = MTSOrientation.HORIZONTAL;
    this.colors = [];
    for(var i = 0 ; i < 10 ; ++i){
        this.colors.push("#000000");
    }
};

MyTexStrip.prototype = Object.create(MyTex);
MyTexStrip.prototype.constructor = MyTexStrip;

//SelTexData
MyTexStrip.prototype.getTHREETexture = function(){
    return this.threeTex;
};

MyTexStrip.prototype.getSelTexData = function(){
    var selTexData = new SelTexData();
    
    selTexData.NumOfStrips = this.numOfStrips;
    selTexData.Colors = this.colors;
    selTexData.Vertical = this.orientation === MTSOrientation.VERTICAL ? true : false;
            
    return selTexData;
};

MyTexStrip.prototype.setStripColor = function(ind,newColor){
    this.colors[ind] = newColor;
    this.rebuild();
};

MyTexStrip.prototype.setOrientation = function(newOrientation){
    this.orientation = newOrientation;
    this.rebuild();
};

MyTexStrip.prototype.setNumOfStrips = function(newNumOfStrips){    
    this.numOfStrips = newNumOfStrips;
    this.rebuild();
};

MyTexStrip.prototype.rebuild = function(){
    var _c1 = new THREE.Color(this.colors[0]);
    var _c2 = new THREE.Color(this.colors[1]);
    var c1 = [_c1.r*255.0, _c1.g*255.0, _c1.b*255.0];
    var c2 = [_c2.r*255.0, _c2.g*255.0, _c2.b*255.0];
    //console.log(c1);
    //console.log(c2);
    
    var ind = 0;
    var cc = [];
    if (this.orientation === MTSOrientation.HORIZONTAL) {        
        for (var y = 0; y < 4; ++y) {
            for (var x = 0; x < 4; ++x) {
                if( y < 2 ) cc = c1;
                else cc = c2;
                ind = (y * 4 + x) * 3;                
                this.pixels[ind] = cc[0];
                this.pixels[ind + 1] = cc[1];
                this.pixels[ind + 2] = cc[2];
            }
        }
    } else {
        for (var y = 0; y < 4; ++y) {
            for (var x = 0; x < 4; ++x) {
                if( x < 2 ) cc = c1;
                else cc = c2;
                ind = (y * 4 + x) * 3;                
                this.pixels[ind] = cc[0];
                this.pixels[ind + 1] = cc[1];
                this.pixels[ind + 2] = cc[2];
            }
        }
    }
    
//    var pixels = [];
//    if (this.orientation === MTSOrientation.HORIZONTAL) {
//        pixels = [
//            0, 0, 0,
//            0, 0, 0,
//            0, 0, 0,
//            0, 0, 0,
//            255, 255, 255,
//            255, 255, 255,
//            255, 255, 255,
//            255, 255, 255,
//            0, 255, 0,
//            0, 255, 0,
//            0, 255, 0,
//            0, 255, 0,
//            255, 0, 255,
//            255, 0, 255,
//            255, 0, 255,
//            255, 0, 255,            
//            255, 255, 0,
//            255, 255, 0,
//            255, 255, 0,
//            255, 255, 0,
//            255, 0, 0,
//            255, 0, 0,
//            255, 0, 0,
//            255, 0, 0,
//            255, 255, 0,
//            255, 255, 0,
//            255, 255, 0,
//            255, 255, 0,
//        ];
//    } else {
//        pixels = [
//            0, 0, 0,
//            255, 255, 255,
//            0, 0, 0,
//            255, 255, 255,
//            0, 0, 0,
//            255, 255, 255,
//            0, 0, 0,
//            255, 255, 255,
//            0, 0, 0,
//            255, 255, 255,
//            0, 0, 0,
//            255, 255, 255,
//            0, 0, 0,
//            255, 255, 255,
//            0, 0, 0,
//            255, 255, 255
//        ];
//    }
    
    var md = new Uint8Array(this.pixels);    
    //var noiseSize = 4;
    this.threeTex = new THREE.DataTexture(md, 4, 4, THREE.RGBFormat);
    //console.log(this.threeTex);
    this.threeTex.wrapS = THREE.RepeatWrapping;
    this.threeTex.wrapT = THREE.RepeatWrapping;
    //ClampToEdgeWrapping
    //this.threeTex.wrapS = THREE.ClampToEdgeWrapping;
    //this.threeTex.wrapT = THREE.ClampToEdgeWrapping;
    //this.threeTex.offset = new THREE.Vector2(0.5,0.5);
    //this.threeTex.repeat = new THREE.Vector2(1,1);
    this.threeTex.needsUpdate = true;      
};

