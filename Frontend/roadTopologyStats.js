var width = 600;
function findRoadTopologyWiseStats(){
    handleStyling();
    fetch('http://127.0.0.1:8000/roadTopology')
    .then((response) => response.json())
    .then((result) => {
        drawChart(result)
    })
}

function handleStyling() {
    var panel = document.getElementById("input-panel");
    panel.style.display = "none";
}

function drawChart(data){
  d3.select("#map").select("svg").remove();
  var svg1 = d3.select("#map")
               .append("svg")
               .attr("class","svg")
               .attr("width", "750px")
               .attr("height", "600px")
               .style("background-color","white")
               .style("margin-top","5%")
               .style("margin-left","10%")
  svg1.append("text")
      .attr("x",width/2 -100)
      .attr("y", 70)
      .attr("text-anchor", "center")
      .attr("font-size", "20px")
      .attr("font-weight","bold")
      .text("Road Topology Wise Distribution of all accidents")

  var g = svg1.append("g")
              .attr("transform", "translate(" + 100 + "," + 100 + ")");


  x_axis = ["Bump", "Crossing","Give_Way","Junction","No_Exit","Railway","Roundabout","Station","Stop", "Traffic_Calming","Traffic_Signal"]

  var x = d3.scaleBand()
            .domain(x_axis.map(function(d) { return d; })	)
            .range([ 0, 650 ]);

  var y = d3.scaleLinear()
            .domain([0, 210000])
            .range([ 400, 0 ]);

  svg1.append("g")
      .attr("transform", "translate(50," + 550 + ")")
      .style("font", "9px times")
      .call(d3.axisBottom(x));

  svg1.append("g")
      .attr("transform", "translate(50," + 150 + ")")
      .call(d3.axisLeft(y));

  var u = svg1.selectAll("rect")
              .data(data)

  bar =  u
         .enter()
         .append("rect")
         .attr("x", function(d,i) { return ( x(x_axis[i])); })
         .attr("y", function(d) { return (y(d)); })
         .attr("width", 30)
         .attr("height", function(d) {return 400 - (y(d)); })
         .attr("fill", "#e6550d")
         .attr("transform", "translate(71," + 150 + ")")

  bar.append("title")
       .text(function(d) {
            return d;
        });
}