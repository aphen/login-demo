/**
 * Created by web on 20/7/18.
 */
var mongoose = require('mongoose');
var schema = mongoose.Schema;
var models = require('./models');

for(var m in models){
    console.log(m);
    mongoose.model(m, new schema(models[m]), m);
}

module.exports = {
    getModel: function(type){
        return _getModel(type);
    }
}

var _getModel = function(type){
    return mongoose.model(type);
}