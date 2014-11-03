var _3Model = require("3vot-model/lib/ajaxless")

var fields = ["protein","variation","domain","exon"];

Protein = _3Model.Model.setup("Protein", fields);

module.exports = Protein
