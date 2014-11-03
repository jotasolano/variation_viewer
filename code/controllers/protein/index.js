var fs = require("fs");
var Protein = require("../../models/proteins");
var el;
var Item = require("./item")

function init(target){
  el = document.getElementById(target);
  Protein.bind("refresh", render);
}

function render(){
  str = ""
  addProteins()
  selectProtein()
  el.innerHTML = str;
}


// ------------- Funciones ------------- //

function addProteins(){
  var proteins = Protein.all()
  for (var i = 0; i < proteins.length; i++){
    var source = proteins[i];
    str+= Item(source)
  }
}


var getVariation = require("../../managers").getVariation;
var getDomain = require("../../managers").getDomain;
var getExon = require("../../managers").getExon;


function selectProtein(){
  var options = el;
  var correntProtein;
  options.onchange = function(e){
    var correntProtein = el.value
    var protein = Protein.find(correntProtein);
    getDomain(protein.domain);
    getVariation(protein.variation);
    getExon(protein.exon);
  }
}


module.exports = init;
