var fs = require("fs");
var d3 = require("d3/d3.min")
window.d3= d3;

// Data Models
var Domain = require("../../models/socketModels/domain")
var Variation = require("../../models/socketModels/variation");
var Exon = require("../../models/socketModels/exon");

var el;
var min;
var max;
var arrayOfTargets = [];
var currentVariableWidth;
var mouse = {x: 0, y: 0};

document.addEventListener('mousemove', function(e){
    mouse.x = e.clientX || e.pageX;
    mouse.y = e.clientY || e.pageY
}, false);

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

// Inicial Function //
function init(target){
  Domain.bind("refresh", function(){
    defineDomainValues()
    makeXScale(min,max);
    activeLabels()
    addRange(min,max)
    changeInput()
    renderDomain();
  });

  Variation.bind("refresh", function(){
    setTimeout(function(){
      makeAxis()
      renderVariation()
    }, 500)
  });
  Exon.bind("refresh",function(){
    setTimeout(function(){
      renderExon()
    }, 300)
  })

}

function activeLabels(){
  $("#range > label").addClass('active');
  $("#domain > label").addClass('active');
  $("#domainsLabels > span").addClass('active')
  $("#exon > label").addClass('active');
  $("#variation > label").addClass('active')
}

function addRange(minValue,maxValue){
  $( "#slider-range" ).addClass('active')
      var tooltipfirst = $('.tooltipfirst');
      var tooltiplast = $('.tooltiplast');
      $( "#slider-range" ).slider({
        range: true,
        min: minValue,
        max: maxValue,
        values: [ minValue, maxValue ],
        step: 1,

        // start: function(event,ui) {
				//     tooltipfirst.fadeIn('fast');
        //     tooltiplast.fadeIn('fast');
				// },

        slide: function( event, ui ) {
          var valuefirst  = ui.values[0]
          var valuelast  = ui.values[1]
          tooltipfirst.css('left', valuefirst).text(ui.values[0]);
          tooltiplast.css('left', valuelast).text(ui.values[1]);
          update(ui.values[0],ui.values[1])
          }
      })
}

function changeInput(){
  $( "#rangeInput" ).val( $( "#slider-range" ).slider( "values", 0 ) +
    " — " + $( "#slider-range" ).slider( "values", 1 ) );
}

function update(first,last){
  makeXScale(first,last)
  makeAxis()
  changeInput()
  var element = d3.select(".axis").remove()
  drawAxis()

  var domainsRemove = d3.selectAll(".domainData").remove()
  drowDomainData()

  var exonRemove = d3.selectAll(".exonData").remove()
  drowExonData(allExons)

  var variablesChartRemove = d3.selectAll(".variablePart").remove()
  rank = makeRank(first,last)
  addChartVariables(rank)

  // updateLines(first,last)
  var linksRemoved = d3.selectAll(".linksContainer").remove()
  links=[]
  sources=[]
  setSources(first,last)
  makeArrayLinks()
  drawLinks(links);
  var linksLine = d3.selectAll(".link");
  linksLine.attr("stroke-width", currentVariableWidth)
  // tooltips = Variation.tooltipVariations(first,last);
  // var currentId = "#variable"+first
  // var currentVariable = $(currentId)
  // var currentVariableWidth = currentVariable.width()
  // console.log(currentVariableWidth)
  // console.log(currentVariableWidth)

  // setSources(data.slice(first,last))
}

function updateLines(left,rigth){
  d3.selectAll(".link")
    .style("stroke-opacity",0)
  for (var i = left; i < rigth; i++) {
    var currentLink = ".k" + i
    d3.selectAll(currentLink)
      .style("stroke-opacity",0.4)
  }
}

function defineDomainValues(){
  rankParameters = Domain.getRank()
  min = rankParameters[0]
  max = rankParameters[1]
}

function makeXScale(x1,x2){
  xScale = d3.scale.linear()
                     .domain([x1, x2])
                     .range([0, width]);
}

function makeAxis(){
  axis = d3.svg.axis()
            .scale(xScale)
            .orient("top")
            .tickFormat(function(d) { return d + " aa" })
            // .ticks(20)
}

// ---------------------- Domain Code ---------------------- //

function renderDomain(){
  element = d3.select(".domainChart").transition().duration(500).attr("width", 0).remove()
  sourceArray = Domain.getTypeArray()
  domainColors = ["#030303","#525252","#7d7d7d","#949494","#b3b3b3","#d3d3d3"]
  domainHeight = 100
  yScaleDomain = d3.scale.linear()
                  .domain([0,sourceArray.length])
                  .range([0,domainHeight])

  drownDomainChart()
  drowDomainlines()
  drowDomainData()

}

function drownDomainChart(){
  domainCanvas = d3.select("#chart-domain").append("svg")
        .attr("class","domainChart")
        .attr("width", width)
        .attr("height", domainHeight)
        .append("g")
}



function drowDomainlines(){
  sourceArray.forEach(function(d,i){
    domainCanvas.append('line')
                .attr("x1", 0)
                .attr("y1", function(d){ return yScaleDomain(i)})
                .attr("x2", width)
                .attr("y2", function(d){return yScaleDomain(i)})
                .attr("stroke-width", 1)
                .attr("stroke", function(d){ return domainColors[i]})
  })
}

function drowDomainData(){
  for (var m = 0; m < sourceArray.length; m++) {
    var grupData = Domain.grupByType(sourceArray[m]);
    for (var r = 0; r < grupData.length; r++) {
      domainCanvas.append("line")
                  .attr("class","domainData")
                  .attr("x1", xScale(grupData[r].rango[0]))
                  .attr("y1", function(d){ return yScaleDomain(sourceArray.indexOf(sourceArray[m]))})
                  .attr("x2", xScale(grupData[r].rango[1]))
                  .attr("y2", function(d){return yScaleDomain(sourceArray.indexOf(sourceArray[m]))})
                  .attr("stroke-width", 5)
                  .attr("stroke-linecap", "round")
                  .attr("stroke", function(d){ return domainColors[sourceArray.indexOf(sourceArray[m])]})
    }
  }
}


// ---------------------- Variation Code ---------------------- //
function renderVariation(){
  el = d3.select(".variationChart").transition().duration(500).attr("width", 0).remove()
  rankParameters = Variation.getRank()
  data = Variation.all();
  var dataLength = data.length;
  typeArray = Variation.getTypeArray();
  typeLength = typeArray.length;
  sources = [];
  targets = [];
  links = [];
  rank = makeRank(min,max)
  numTot = rank.length;
  variations = Variation.grupVariations()
  tooltips = Variation.tooltipVariations()
  //Ejecutar todas las funciones

  drawChart();
  drawAxis()
  setSources(min,max)
  addChartVariables(rank);
  makeXScaleVariationsType(typeLength)
  addChartTypes(typeArray,typeLength);
  makeArrayLinks();
  drawLinks(links);
}

function setSources(x1,x2){
  var i = x1;
  var empotyArray = [];
  var count;
  for (i; i <= x2; i++) {
    count = Variation.findAllByAttribute("endaa", i);
    for (var t = 0; t < count.length; t++) {
      sources.push({source:{x:xScale(count[t].endaa), y: 11, type:count[t].type, id:count[t].endaa }})
    }
  }
  // for (x1; x1 < x2; x1++) {
  //   sources.push({source:{x:xScale(data[x1].endaa), y: 19, type:data[x1].type, id:data[x1].endaa }})
  // }
}

function makeArrayLinks(){
  for (var count = 0; count < sources.length; count++) {
    for (var intcount = 0; intcount < targets.length; intcount++) {
      if(sources[count].source.type == targets[intcount].target.type){
        links.push({
          id:sources[count].source.id,
          source:{x:sources[count].source.x, y:sources[count].source.y},
          target:{x:getRandomArbitrary(targets[intcount].target.minValue, targets[intcount].target.maxValue),y:targets[intcount].target.y},
          width:sources[count].source.width,
          color:targets[intcount].target.color,
          type:targets[intcount].target.type
        })
      }
    }
  }
}


// function makeRange(){
//   $( "#slider-range" ).append("<input type='range' min='1' max='150' id='nRadius'>")
// }


//
function makeRank(first,last){
  var rank = [];
  for (var i = first; i <= last; i++) {
    rank.push(i)
  }
  return rank
}

var currentWidth = parseInt(d3.select('#chart').style('width'));

var	margin = {top: 30, right: 20, bottom: 30, left: 50},
  width = currentWidth,
  height = 400- margin.top - margin.bottom,
  width2 = 600 - margin.left - margin.right,
  height2 = 500 - margin.top - margin.bottom;

var colors = ["4de242", "1b74ce", "e53e3e", "00a9ac", "c6e541", "ff800d", "2935cc", "991010", "ffcf2d"]

// --- Funcion Main para generar el SVG --- //
function drawChart(){
  canvas = d3.select("#chart").append("svg")
        .attr("class","variationChart")
        .attr("width", width)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
}


function drawAxis(){
  var axisPart = canvas.append("g").attr("class", "axis")
                      .call(axis)
}

 // Funcion para agregar variables (texto y contenedor)
function addChartVariables(rango){
  var variableArray = [];
  for (var i = 0; i < rango.length; i++) {
    variableArray[i] = xScale(rango[i])
  }

  currentVariableWidth = width / variableArray.length

  var variablePart = canvas.append("g").attr("class","variablePart")
  variableArray.forEach(function(d,i){
    variablePart.append("rect")
          .attr("id", function (d){ return "variable" + i })
          .attr("class", "variableContainer")
          .attr("width",function (d){ return width / variableArray.length })
          .attr("x", d)
          .attr("height", 12)
          .style("fill", function (d) {if ( (i % 2) == 1)
            {
              return ("#e1e1e1")
            }  else {
              return ("#c1c1c1")
            }
          })
  })
  // data.forEach(function(d,i){
  //   variablePart.append("text")
  //         .attr("fill", "black")
  //         .attr("x",function () {return i * ( width  / numTot ) + (( width  / numTot )/2); })
  //         .attr("y", 14)
  //         .text (function () {return d.startaa;} )
  // })
}

function makeXScaleVariations(x1,x2,widthVariation){
  xScaleVariations = d3.scale.linear()
                     .domain([x1, x2])
                     .range([0, widthVariation]);
}

function makeXScaleVariationsType(x){
  xScaleVariations = d3.scale.linear()
                     .domain([0, x])
                     .range([0, width]);
}

// Funcion para agregar tipos (contenedor y textos)
function addChartTypes(typeArray,typeLength){
  var variableTypeArray = [];
  for (var i = 0; i < typeLength; i++) {
    variableTypeArray[i] = xScaleVariations(i)
  }
  var typesPart = canvas.append("g").attr("class","typesPart")
  var blocksPart = typesPart.append("g").attr("class","blocksPart")
  typeArray.forEach(function(d,i){
    var tipeColor = "";
    var countColor = "";
    blocksPart.append("rect")
          .attr("width",function (d){ return width / typeLength })
          .attr("class", "block")
          .attr("height", 12)
          .attr("y", height)
          .attr("x", function (){ return xScaleVariations(i) })
          .style("fill", function () {
            for (var count = 0; count < colors.length; count++) {
              tipeColor = colors[i]
              countColor = ".type" + colors[i]
              return "#"+colors[i]
            }
          })

          .on("mouseover", function(d,i) {
            d3.selectAll(".link")
              .style("stroke-opacity",0.2)
            d3.selectAll(countColor)
              .style("stroke-opacity",0.9)
          })
          .on("mouseout", function() {
            d3.selectAll(".link")
              .style("stroke-opacity",0.4)
            d3.selectAll(countColor)
              .style("stroke-opacity",0.4)
          });
          var minValue = i * ( width  / typeLength ) + (( width  / typeLength )/8);
          var maxValue = i * ( width  / typeLength ) + (( width  / typeLength )/1.125);
          targets.push({target:{type:d, x: getRandomArbitrary(minValue, maxValue), y:height + 1, color:tipeColor, width:width  / typeLength, minValue:minValue, maxValue:maxValue}})
  })

  var TextPart = typesPart.append("g").attr("class","TextPart")
  typeArray.forEach(function(d,i){
    typesPart.append("text")
          .attr("width",function (d){ return i * ( width  / typeLength ) + (( width  / typeLength )/2)  })
          .attr("height", 15)
          .attr("y", height + 40)
          .attr("x",function (d) { return variableTypeArray[i]})
          .text(function () {return d.charAt(0).toUpperCase() + d.slice(1).replace(/_/g, ' ');})
          .style("font-zi")
  })
}


// Funcion que crea los links entre elementos
function drawLinks(links){
  var linksContainer = canvas.append("g").attr("class","linksContainer")
  var diagonal = d3.svg.diagonal()
          .source(function(d) { return {"x":d.source.x + (currentVariableWidth/2), "y":d.source.y}; })
          .target(function(d) { return {"x":d.target.x, "y":d.target.y};})
          .projection(function(d) { return [d.x, d.y]; })

  var link = linksContainer.selectAll(".link")
          .data(links)
          .enter()
            .append("path")
            .attr("id",function(d){ return d.id })
            .attr("class", function(d){ return "type" + d.color + " link " +"k"+ d.id })
            .classed( function(d){ return d.type} )
            .style("stroke",function(d){ return "#" + d.color })
            .style("stroke-opacity",0.4)
            //.style("stroke-width", function(d){ return d.width - (d.width /1.5) })
            .style("stroke-width", currentVariableWidth )
            .attr("d", diagonal)
            .on("mouseover", function(d,i) {

              if(tooltips[i]){

                var xPosition = mouse.x + 50;
                var yPosition = mouse.y + 50;

                //Update the tooltip position and value
                d3.select("#tooltip-variation")
                  .style("left", xPosition + "px")
                  .style("top", yPosition + "px");

                d3.select("#variationname")
                  .text(tooltips[i].variationname);

                d3.select("#type")
                  .text(tooltips[i].type);

                d3.select("#codon")
                  .text(tooltips[i].codon);

                d3.select("#residues")
                  .text(tooltips[i].alternativeresidues);

                d3.select("#allelles")
                  .text(tooltips[i].allelles);

                //Show the tooltip
                d3.select("#tooltip-variation").classed("hidden", false);
              }
            })
            .on("mouseout", function() {
              //Hide the tooltip
              d3.select("#tooltip-variation").classed("hidden", true);
            });

}

// ---------------------- Exon Code ---------------------- //

function renderExon(){
  var currentElement = d3.select(".exonChart").transition().duration(500).attr("width", 0).remove()
  allExons = Exon.all()
  drownExonChart();
  // drowExonline()
  drowExonData(allExons)
}

function drownExonChart(){
  exonCanvas = d3.select("#chart-exon").append("svg")
        .attr("class","exonChart")
        .attr("width", width)
        .attr("height", 30)
        .style("margin-bottom", 20)
        .append("g")
}

// function drowExonline(){
//     exonCanvas.append('line')
//                 .attr("x1", 0)
//                 .attr("y1", 20)
//                 .attr("x2", width)
//                 .attr("y2", 20)
//                 .attr("stroke-width", 1)
//                 .attr("stroke", "#000000")
//
// }

function drowExonData(allExon){
  for (var i = 0; i < allExon.length; i++) {
    exonCanvas.append("line")
                .attr("class","exonData")
                .attr("x1", xScale(allExon[i].startaa))
                .attr("x2", xScale(allExon[i].endaa))
                .attr("y1", function (d) {if ( (i % 2) == 1)
                  {
                    return (13)
                  }  else {
                    return (17)
                  }
                })
                .attr("y2", function (d) {if ( (i % 2) == 1)
                  {
                    return (13)
                  }  else {
                    return (17)
                  }
                })
                .attr("stroke-width", 5)
                .attr("stroke", "#2094a6")
                .attr("stroke-linecap", "round")
  }
}
//
// variablePart.append("rect")
//       .attr("id", d)
//       .attr("class", "variableContainer")
//       .attr("width",function (d){ return width / variableArray.length })
//       .attr("x", d)
//       .attr("height", 20)
//       .style("fill", function (d) {if ( (i % 2) == 1)
//         {
//           return ("#e1e1e1")
//         }  else {
//           return ("#c1c1c1")
//         }
//       })
module.exports = init;
