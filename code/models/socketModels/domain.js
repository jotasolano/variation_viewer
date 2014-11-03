var _3Model = require("3vot-model/lib/ajaxless")

var fields = ["source","datatype","rango","exonid","startphase","endphase"];

Domain = _3Model.Model.setup("Domain", fields);

function deMenorAMayor(elem1, elem2) {return elem1-elem2;}

Domain.getRank = function(){
  var list = Domain.all();
  emptyListEndaa = [];
  emptyListStartaa = [];
  for (var i = 0; i < list.length; i++) {
    emptyListEndaa.push(list[i].endaa);
    emptyListStartaa.push(list[i].startaa);
    emptyListEndaa.sort(deMenorAMayor);
    emptyListStartaa.sort(deMenorAMayor);
  }
  var x = emptyListEndaa.length - 1;
  var first = parseInt(emptyListStartaa[0])
  var last = parseInt(emptyListEndaa[x]);
  var rank = [first,last];
  return rank
}

Domain.getTypeArray = function(){
  var list = Domain.all();
  var sourceArray = [];
  for (var i = 0; i < list.length; i++) {
    if (!sourceArray.contains(list[i].source)) {
      sourceArray.push(list[i].source);
    }
  }
  for (var i = 0; i < sourceArray.length; i++) {
    sourceArray[i] = sourceArray[i]
  }
  return sourceArray
}

Domain.grupByType = function(tipo){
  var array = Domain.findAllByAttribute("source",tipo)
  return array
}

module.exports = Domain
