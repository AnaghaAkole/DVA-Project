var jsonData;
var legendG = null;
var csvData = [];


var width = 600;
var height = 800;

var accidents = d3.map();

var path = d3.geoPath();
var svg;

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
    var states = null;
    handleStylingInStatesStats();
    fetch('http://127.0.0.1:8000/maps/hotspots').then((response) => response.json()).then((result) => {
        states = result;
        showSpinner("none")
        drawChoropleth(states);
    });
}
function handleStylingInStatesStats() {
    var panel = document.getElementById("input-panel");
    panel.style.display = "none";
    document.getElementById("map").innerHTML = "";
    showSpinner("inline-block")
}

function showSpinner(show) {
    var spinner = document.getElementById("spinner");
    spinner.style.display = show;
}

function resolvePromises([us]) {
    svg = d3.select("#map")
        .append("svg")
        .attr("class","svg")
        .attr("width", "600px")
        .attr("height", "800px")
        .style("background-color","white")
        .style("float","left")
    jsonData = us;

    var g = svg.append("g")
        .attr("class", "key")
        .attr("transform", "translate(0,100)");
    var color = d3.scaleThreshold()
        .domain(d3.range(0, 9))
        .range(d3.schemeOranges[9]);

    var logScale = d3.scaleLog()
        .domain([1, 300000])
        .range([0, 9]);

    drawLegend(color, logScale);

    var projection = d3.geoAlbersUsa()
        .translate([width / 2, height / 2 + 100])
        .scale(600);

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
        .on('mouseover', tip.show)
        .on('click', function(d){
            CreateTableFromJSON(state_mapping[d.properties.name]);
        })
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
        .text("Accidents Frequency");

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



function CreateTableFromJSON(state_name) {
        var statewiseMonthlyStats = data_states;
        var col = [];
        for (var i = 0; i < statewiseMonthlyStats.length; i++) {
            for (var key in statewiseMonthlyStats[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }
        var table = document.createElement("table");
        var tr = table.insertRow(-1);
        tr.style.backgroundColor = "rgba(255,12,32,.5)";   

        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th");    
            th.innerHTML = col[i];
            tr.appendChild(th);
        }

        for (var i = 0; i < statewiseMonthlyStats.length; i++) {
            if (statewiseMonthlyStats[i][col[0]] == state_name && statewiseMonthlyStats[i][col[2]] != 0){
                tr = table.insertRow(-1);
                tr.style.backgroundColor = "rgba(0,135,147,.3)";
            }    
            
            for (var j = 0; j < col.length; j++) {
                if (statewiseMonthlyStats[i][col[0]] == state_name && statewiseMonthlyStats[i][col[2]] != 0) {
                    var tabCell = tr.insertCell(-1);
                    tabCell.innerHTML = statewiseMonthlyStats[i][col[j]];
                }
            }
        }
        if (document.getElementById("show_data") == null) {
            var divContainer = document.createElement("div");
            divContainer.id = "show_data";
            divContainer.innerHTML = "";
            divContainer.appendChild(table);
            document.getElementById("map").appendChild(divContainer);
        }
        else {
             var divContainer = document.getElementById("show_data");
             divContainer.innerHTML = "";
             divContainer.appendChild(table);
        }
       
    }
