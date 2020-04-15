var loadData = true;
var jsonData;
var seletedYear;
var legendG = null;
var csvData = [];

var svg = d3.select("svg");
var width = svg.attr("width");
var height = svg.attr("height");

var accidents = d3.map();

var path = d3.geoPath();

var g = svg.append("g")
    .attr("class", "key")
    .attr("transform", "translate(0,100)");

// var dataTime = d3.range(0, 6).map(function (d) {
//     return new Date(2010 + d, 10, 1);
// });
//
// defaultDate = new Date(2010, 10, 1);
// var sliderTime = d3
//     .sliderBottom()
//     .min(d3.min(dataTime))
//     .max(d3.max(dataTime))
//     .step(1000 * 60 * 60 * 24 * 365)
//     .width(300)
//     .tickFormat(d3.timeFormat('%Y'))
//     .tickValues(dataTime)
//     .ticks(5)
//     .default(defaultDate)
//     .on('onchange', function (d) {
//         if (loadData) {
//             drawChoropleth(d3.timeFormat('%Y')(d));
//         } else {
//             drawChoroplethWithoutFetchingData(d3.timeFormat('%Y')(d));
//         }
//     });
//
//
// var gTime = d3
//     .select('div#slider-time')
//     .append('svg')
//     .attr('width', 600)
//     .attr('height', 150)
//     .append('g')
//     .attr('transform', 'translate(30,30)');
//
// gTime.call(sliderTime);

//drawChoropleth("2010");

function drawChoroplethWithoutFetchingData(year) {
    seletedYear = year;
    accidents = d3.map();
    csvData.forEach(function (d) {
        accidents.set(d.States, [d.Region, +d[year], year])
    });
    resolvePromises([jsonData]);
}

function drawChoropleth(data) {
    data = data['results'];
    for (var key in data){
         state = data[key];
         accidents.set(state[0], [+state[1], state[2]]);
         csvData.push(state)
    }
    var promises = [d3.json("states-10m.json")];
    Promise.all(promises).then(resolvePromises);
}

function getStateAccidentCount() {
    let fetchData = {
        method: 'GET'
    };
    var states = null;
    fetch('http://127.0.0.1:8000/maps/hotspots', fetchData).then((response) => response.json()).then((result) => {
        states = result;
        drawChoropleth(states);
    });
}

function resolvePromises([us]) {
    jsonData = us;
    loadData = false;

    var color = d3.scaleThreshold()
        .domain(d3.range(0, 9))
        .range(d3.schemeOranges[9]);

    var logScale = d3.scaleLog()
        .domain([1, 300000])
        .range([0, 9]);

    drawLegend(color, logScale);

    var projection = d3.geoAlbersUsa()
        .translate([width / 2, height / 2 + 100])
        .scale(1200);

    var tip = addTip(svg);

    svg.append("g")
        .attr("class", "states")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
        .enter().append("path")
        .attr("fill", function (d) {
            if (accidents.has(d.properties.name)) {
                d.total = parseInt(accidents.get(d.properties.name)[0])
            } else {
                d.total = 0;
            }
            return color(logScale(d.total));
        })
        .attr("d", d3.geoPath(projection))
        .on('mouseout', tip.hide)
        .on('mouseover', tip.show);
}

function addTip(svg) {

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-8, 0])
        .html(function (d) {
            var state = d.properties.name;
            var accidentNum = accidents.get(d.properties.name)[0];
            var cities = accidents.get(d.properties.name)[1];
            var hotspots = "Hotspots";
            cities.forEach(function (city) {
                hotspots = hotspots + "<br>" +city[0]+ ":" + city[1];
            });
            return "State:" + state +  "<br>Total Accidents:" + accidentNum + "<br>" + hotspots;
        });
    svg.call(tip);
    return tip;
}

function drawLegend(color, logScale){

    if (legendG!=null){
        legendG.remove();
    }
    var legendData = [];
    svg.append("text")
        .attr("transform", "translate(100,0)")
        .attr("x", width - 300)
        .attr("y", 30)
        .attr("font-size", "20px")
        .text("Earthquake Frequency");

    var legendMap = new Map();

    csvData.forEach(function (d) {
        var c = color(logScale(+d[1]));
        if (legendMap.has(c)){
            var total = legendMap.get(c) + (+d[1]);
            legendMap.set(c,total);
        }else{
            legendMap.set(c,+d[1]);
        }
    });

    legendMap.forEach(function (key,value) {
        legendData.push({"fill":value,"name":key});
    });

    legendData.sort(function (a,b) {
        return a['name'] - b["name"];
    });

    var legend = svg.append("g").selectAll("g")
        .data(legendData)
        .enter()
        .append("g")
        .attr('class', 'legend');

    legendG = legend;

    legend.append('rect')
        .attr('x', width-150)
        .attr('y', function(d, i){ return i*20 + 50;})
        .attr('width', 15)
        .attr('height', 15)
        .style('fill', function(d) {
            return d.fill;
        });

    legend.append('text')
      .attr('x', width - 125)
      .attr('y', function(d, i){ return (i *  20 + 9) + 54;})
      .text(function(d){ return d.name; });
}

getStateAccidentCount();
