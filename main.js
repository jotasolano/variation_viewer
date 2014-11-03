
// Requiere un layout diferente para mantener orden MVC
var fs = require("fs")
var Layout = fs.readFileSync( __dirname + "/code/views/layout.html" )
_3vot.el.innerHTML = Layout;

// // ----------- Models ----------- //
var Protein = require("./code/models/proteins")
//Variation Model
var Variation = require("./code/models/socketModels/variation");
// //Exon Model
var Exon = require("./code/models/socketModels/exon");
// // //Domain Model
var Domain = require("./code/models/socketModels/domain");

// // ----------- Controlers ----------- //
var Protein = require("./code/controllers/protein")
Protein("selectProtein")

var Chart = require("./code/controllers/chart");
Chart("chart");

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] == obj) {
            return true;
        }
    }
    return false;
}

require("./code/managers")
