var fs = require("fs");

var ItemTemplate = require("./item");

var el;

var Domain = require("../../models/domain");

function init(target){
	el = document.getElementById(target);
	Domain.bind("refresh", render);
}


function render(){
	var str = ""

	var domainsSuperfamily = Domain.findAllByAttribute("source","Superfamily");
	var domainsSmart = Domain.findAllByAttribute("source","Smart");
	var domainsPrints = Domain.findAllByAttribute("source","Prints");
	var domainsPfam = Domain.findAllByAttribute("source","Pfam");
	var domainsProfile = Domain.findAllByAttribute("source","Profile");

  console.log(domainsSuperfamily)

	function addItems(domainsSource) {
		for (var i = 0; i < domainsSource.length; i++){
			var source = domainsSource[i];
			str+= ItemTemplate(source)
		}
	}

	addItems(domainsSuperfamily);
	addItems(domainsSmart);
	addItems(domainsPrints);
	addItems(domainsPfam);
	addItems(domainsProfile);



	el.innerHTML = str;


}


module.exports = init;
