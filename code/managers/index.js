function getProteins(){

	var script = document.createElement('script');
	script.src = 'https://spreadsheets.google.com/feeds/list/1XbR6f9nedo-GknHPzrzxJyB4cx0PQmuD6jVVBewqfvs/od6/public/values?alt=json-in-script&callback=proteinhooray';
	document.body.appendChild(script);

	window.proteinhooray = function(json) {
		var proteins = []
		for (var i = json.feed.entry.length - 1; i >= 0; i--) {
			var protein = json.feed.entry[i]
			proteins.push( {
				protein: protein["gsx$protein"]["$t"],
				variation: protein["gsx$variation"]["$t"],
				domain: protein["gsx$domain"]["$t"],
				exon: protein["gsx$exon"]["$t"],
			})
		};
		Protein.refresh(proteins);
	}

}




function getVariation(variation){
	Variation.destroyAll();

	var script = document.createElement('script');
	script.src = 'https://spreadsheets.google.com/feeds/list/'+ variation +'/od6/public/values?alt=json-in-script&callback=variationhooray';
  document.body.appendChild(script);

	window.variationhooray = function(json) {
		var variations = []
		for (var i = json.feed.entry.length - 1; i >= 0; i--) {
			var variation = json.feed.entry[i]
			variations.push( {
				source: variation["gsx$source"]["$t"],
				datatype: variation["gsx$datatype"]["$t"],
				startaa: variation["gsx$startaa"]["$t"],
				endaa: parseInt(variation["gsx$endaa"]["$t"]),
				variationname: variation["gsx$variationname"]["$t"],
				allelles: variation["gsx$allelles"]["$t"],
        class: variation["gsx$class"]["$t"],
				type: variation["gsx$type"]["$t"],
        alternativeresidues: variation["gsx$alternativeresidues"]["$t"],
				codon: variation["gsx$codon"]["$t"]
			})
		};

		Variation.refresh(variations);

	}

}

function getExon(exon){
	Exon.destroyAll();

  var script = document.createElement('script');
  script.src = 'https://spreadsheets.google.com/feeds/list/'+ exon +'/od6/public/values?alt=json-in-script&callback=exonhooray';
    document.body.appendChild(script);

  window.exonhooray = function(json) {
    var exons = []
    for (var i = json.feed.entry.length - 1; i >= 0; i--) {
      var exon = json.feed.entry[i]
      exons.push( {
        source: exon["gsx$source"]["$t"],
        datatype: exon["gsx$datatype"]["$t"],
        startaa: parseInt(exon["gsx$startaa"]["$t"]),
        endaa: parseInt(exon["gsx$endaa"]["$t"]),
        exonid: exon["gsx$exonid"]["$t"],
        startphase: exon["gsx$startphase"]["$t"],
        endphase: exon["gsx$endphase"]["$t"]
      })
    };
    Exon.refresh(exons);
  }

}

function getDomain(domain){
	Domain.destroyAll();

  var script = document.createElement('script');
  script.src = 'https://spreadsheets.google.com/feeds/list/'+ domain +'/od6/public/values?alt=json-in-script&callback=domainhooray';
    document.body.appendChild(script);

  window.domainhooray = function(json) {
    var domains = []
    for (var i = json.feed.entry.length - 1; i >= 0; i--) {
      var domain = json.feed.entry[i]
      domains.push( {
        source: domain["gsx$source"]["$t"],
        datatype: domain["gsx$datatype"]["$t"],
        startaa: domain["gsx$startaa"]["$t"],
        endaa: domain["gsx$endaa"]["$t"],
				rango:[parseInt(domain["gsx$startaa"]["$t"]), parseInt(domain["gsx$endaa"]["$t"])],
        domainid: domain["gsx$domainid"]["$t"],
        description: domain["gsx$description"]["$t"]
      })
    };
		Domain.refresh(domains)
  }

}
module.exports = {
	a:getProteins(),
	getVariation:getVariation,
	getExon:getExon,
	getDomain:getDomain
};
