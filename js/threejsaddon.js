/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

THREE.Mesh.prototype._addMyParams = function(){
    this._myUVX = 1;
    this._myUVY = 1;
    this._myTex = null;
};

THREE.Mesh.prototype._setMyTex = function(myTex){
    this._myTex = myTex;
    this._updateTex();
};

THREE.Mesh.prototype._updateTex = function(){
    if( this._myTex ){
        this.material.map = this._myTex.getTHREETexture();
    }else{
        this.material.map = null;
    }        
    this.material.needsUpdate = true;
};


THREE.Mesh.prototype._printMyParams = function(){
    console.log("THREE.Mesh : " + this._myUVX + " " + this._myUVY + " " + this._myTex);
};

THREE.Mesh.prototype._setMyUV = function(uvx,uvy){
    this._myUVX = uvx;
    this._myUVY = uvy;
    for (var i = 0; i < this.geometry.faceVertexUvs[0].length; ++i) {
        var _faceVertUV = this.geometry.faceVertexUvs[0][i];

        for (var j = 0; j < _faceVertUV.length; ++j) {
            var _vertUV = _faceVertUV[j];
            if (_vertUV.x !== 0) _vertUV.x = this._myUVX;
            if (_vertUV.y !== 0) _vertUV.y = this._myUVY;
       }
    }
    this.geometry.uvsNeedUpdate = true;
};

THREE.Mesh.prototype._setMyUVX = function(val){
    this._myUVX = val;
    for (var i = 0; i < this.geometry.faceVertexUvs[0].length; ++i) {
        var _faceVertUV = this.geometry.faceVertexUvs[0][i];

        for (var j = 0; j < _faceVertUV.length; ++j) {
            var _vertUV = _faceVertUV[j];
            if (_vertUV.x !== 0) _vertUV.x = this._myUVX;
       }
    }
    this.geometry.uvsNeedUpdate = true;
};

THREE.Mesh.prototype._setMyUVY = function(val){
    this._myUVY = val;
    for (var i = 0; i < this.geometry.faceVertexUvs[0].length; ++i) {
        var _faceVertUV = this.geometry.faceVertexUvs[0][i];

        for (var j = 0; j < _faceVertUV.length; ++j) {
            var _vertUV = _faceVertUV[j];
            if (_vertUV.y !== 0) _vertUV.y = this._myUVY;
       }
    }
    this.geometry.uvsNeedUpdate = true;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


