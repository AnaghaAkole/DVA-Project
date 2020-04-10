
  var height =1200;
  var data = []
  width = 600;
  function findDayWiseStats() {
    handleStyling();
    fetch('http://127.0.0.1:8000/daywiseCount')
    .then((response) => response.json())
    .then((result) => {
      var data = [];
      for (let i =0 ; i < result.length; i++) {
        data[i] = {
          'day':getDay(result[i][0]),
          'count': result[i][1]
        }
      }
      drawBarChart(data) 
    })
  }

  function handleStyling() {
    var panel = document.getElementById("input-panel");
    panel.style.display = "none";
  }

  function getDay(number) {
    switch(number) {
    case "0":
      return "Sunday"
      break;
    case "1":
      return "Monday"
      break;
    case "2":
      return "Tuesday"
      break;
    case "3":
      return "Wednesday"
      break;
    case "4":
      return "Thursday"
      break;
    case "5":
      return "Friday"
      break;
    default:
      return "Saturday"
    }
  }

  function drawBarChart(data) {
    	var len = 7; // number of days of week
      var max = d3.max(data.map(d=> d.count));
  	  // define x-scale and y-scale
      var xScale = d3.scaleBand().range([0, 600]); 
    	var yScale = d3.scaleLinear().range([400, 0]); 
      	yScale.domain([0, max]);
      	xScale.domain(data.map(function (d) {
                    return d.day;
                }));

       var tip = d3.tip()
      .attr('class', 'tooltip')
      .offset([-10, 0])
      .html(function(d) {
            return "<p>"+d.count+"</p>";
       })
      d3.select("#map").select("svg").remove();
     	var svg = d3.select("#map")
        .append("svg")
        .attr("class","svg")
        .attr("width", "750px")
        .attr("height", "600px")
        .style("background-color","white")
        .style("margin-top","5%")
        .style("margin-left","10%")

     	var g = svg.append("g").attr("transform", "translate(" + 150 + "," + 150 + ")");
           // add x- axis
       g.append("g")
          .attr("transform", "translate(0," + 400 + ")")
          .call(d3.axisBottom(xScale))
       g.append("g")
          .call(d3.axisLeft(yScale).tickFormat(function(d){
              return d;
          }).ticks(10));

      // draw bars
    	g.selectAll().data(data).enter()
    	    .append("rect")
    	    .attr("x", function(d) {
    			return xScale(d.day);
    	     })
    	    .attr("y", function(d) {
    	        return yScale(d.count);
    	    })
    	    .attr("width", 60)
    	    .attr("height", function(d) {
    	        return height - (yScale(d.count))-800;
    	    })
    	    .style("fill", function(d) {
            if (d.count > 80000) {
                return "#e6550d";
            }
            else {
              return "#fdae6b";
            }
    	      
    	    })
          .call(tip)
          .on('mouseover',tip.show)
          .on('mouseout', tip.hide)

           // add chart title
        svg.append("text")
          .attr("x",width/2 -50)
           .attr("y", 70)
           .attr("text-anchor", "center")
           .attr("font-size", "20px")
           .attr("font-weight","bold")
           .text("Day Wise Distribution of all accidents") 
  }
