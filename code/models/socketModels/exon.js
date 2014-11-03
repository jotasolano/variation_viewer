var _3Model = require("3vot-model/lib/ajaxless")

var fields = ["source","datatype","startaa","endaa","exonid","startphase","endphase"];

Exon = _3Model.Model.setup("Exon", fields);

module.exports = Exon
