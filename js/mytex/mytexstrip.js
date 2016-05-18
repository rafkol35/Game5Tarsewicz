MTSOrientation = {
    UNDEF: 0,
    HORIZONTAL: 1,
    VERTICAL: 2
};

var _texStripSize = 32;

function MyTexStrip(_name, params){
    MyTex.call(this,_name,2);
    
    this.numOfStrips = params.numOfStrips;
    this.orientation = params.orientation; // MTSOrientation.HORIZONTAL;
    this.colors = params.colors;
    
    this.pixels = new Array(_texStripSize * _texStripSize * 3);
    var ind = 0;
    for (var y = 0; y < _texStripSize; ++y) {
        for (var x = 0; x < _texStripSize; ++x) {
            ind = (y * _texStripSize + x) * 3;
            this.pixels[ind] = 255;
            this.pixels[ind + 1] = 0;
            this.pixels[ind + 2] = 0;
        }
    }
    //this.createTHREETex();    
    this.rebuild();
};

var MyTexStripParams = function(){
    this.numOfStrips = 2;
    this.orientation = MTSOrientation.HORIZONTAL;
    this.colors = [];
    for(var i = 0 ; i < 10 ; ++i){
        if( i%2 ) this.colors.push("#ffffff");
        else this.colors.push("#000000");
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
    
    selTexData.Name = this._name;
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
    if(this.orientation === newOrientation) return;
    this.orientation = newOrientation;
    this.rebuild();
};

MyTexStrip.prototype.setNumOfStrips = function(newNumOfStrips){    
    if(this.numOfStrips === newNumOfStrips) return;
    this.numOfStrips = newNumOfStrips;
    this.rebuild();
};

MyTexStrip.prototype.rebuild = function(){
    var paintColors = [];
    for( var i = 0 ; i < this.numOfStrips ; ++i){
        var __c = new THREE.Color(this.colors[i]);
        paintColors.push([__c.r*255.0, __c.g*255.0, __c.b*255.0]);
    }
    
    //console.log(this.numOfStrips);
    
    var lineWidth = Math.floor( _texStripSize / this.numOfStrips );
    var numOfExtraLines = _texStripSize % this.numOfStrips;
    var extraLinesGap = Math.floor(  _texStripSize / numOfExtraLines );
            
    var ind = 0;    
    var ccInd = 0;
    var cc = paintColors[ccInd];
    var currentStripWidth = 0;
    
    //if (this.orientation === MTSOrientation.HORIZONTAL) {        
        for (var y = 0; y < _texStripSize; ++y) {
            
            // ustalam kolor całego wiersza
            // sprawdzam czy to jest ekstra linia
            var extraLine = false;
            if( numOfExtraLines > 0 && (y % extraLinesGap === 0 ) ) extraLine = true;
            
            // jezeli to nie jest extra linia to badamy czy nie przelaczyc koloru na nastepny
            if(!extraLine){
                if( currentStripWidth === lineWidth ){
                    currentStripWidth = 0;
                    ccInd++;
                    cc = paintColors[ccInd];                    
                }
            }
            
            // wypelniam wiersz kolorem
            for (var x = 0; x < _texStripSize; ++x) {
                
                if( this.orientation === MTSOrientation.HORIZONTAL )
                    ind = (y * _texStripSize + x) * 3;
                else
                    ind = (x * _texStripSize + y) * 3;
                
                this.pixels[ind] = cc[0];
                this.pixels[ind + 1] = cc[1];
                this.pixels[ind + 2] = cc[2];
            }
            
            // jesli to nie byla extralina to aktualizuje grubosc aktualnie rysowanej
            if( !extraLine ) currentStripWidth++;
        }
//    } else {
//        for (var y = 0; y < _texStripSize; ++y) {
//            for (var x = 0; x < _texStripSize; ++x) {
//                if( x < 2 ) cc = c1;
//                else cc = c2;
//                ind = (y * _texStripSize + x) * 3;                
//                this.pixels[ind] = cc[0];
//                this.pixels[ind + 1] = cc[1];
//                this.pixels[ind + 2] = cc[2];
//            }
//        }
//    }
    
    this.createTHREETex();
};

MyTexStrip.prototype.createTHREETex = function(){
    var md = new Uint8Array(this.pixels);    
    this.threeTex = new THREE.DataTexture(md, _texStripSize, _texStripSize, THREE.RGBFormat);
    this.threeTex.wrapS = THREE.RepeatWrapping;
    this.threeTex.wrapT = THREE.RepeatWrapping;
    this.threeTex.needsUpdate = true;      
};

