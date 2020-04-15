var cities =[]
var flag =0;

fetch('http://127.0.0.1:8000/cities')
	.then((response) => response.json())
	.then((result) => {
		cities= result;
	})

function searchCities(isStart) {
	var count =0;
	var res = removeOldData(isStart);
	var filter = res["filter"];
	var list = res["list"];

	// begin recomendations after user has typed atleast 3 letters
	if (filter.length >= 3) {
		for (var i = 0; i < cities.length; i++) {
			if (cities[i].toString().toUpperCase() === filter) {
				while(list.firstChild) list.removeChild(list.firstChild);
				flag = 1;
				break;
			}
			else if (cities[i].toString().toUpperCase().indexOf(filter) > -1 && count < 20)  {
				let li = document.createElement('option');
				li.innerHTML = cities[i];
				li.style.display = "block";
				list.appendChild(li);
				count++;
				flag =1;
			}
		}

		if (flag ==0) {
			// city not found in our database so display error message div
			let errorDiv = document.getElementById('errorDiv');
			errorDiv.style.display = "block";
		}
		else {
			errorDiv.style.display = "none";
			flag =0;
		}
	}
}

function showSpinner(show) {
	var spinner = document.getElementById("spinner");
    spinner.style.display = show;
}

function removeOldData(isStart) {
	// remove any old suggestions in the list if there
	if(isStart) {
		filter = document.getElementById('origin').value.toUpperCase();
		list = document.getElementById("origin_list");
	}
	else {
		filter = document.getElementById('destination').value.toUpperCase();
		list = document.getElementById("dest_list");
	}
	while(list.firstChild) list.removeChild(list.firstChild);

	return {filter, list}
}

function findAndDisplayRoute(directionsService, directionsRenderer, map) {
	var origin = document.getElementById('origin').value;
	var destination = document.getElementById('destination').value;
	var timeOfTravel = $("#datetimepicker1").find("input").val();
	if (origin == "" || destination == "" || timeOfTravel == "") {
	}
	else {
		// call google map api to get routes
		directionsService.route(
		{
			origin: {query: origin},
			destination: {query: destination},
			travelMode: 'DRIVING',
			provideRouteAlternatives: true
		},
		function(response, status) {
			if (status === 'OK') {
				showSpinner("inline-block");
				var allRoutes = [];
				for(var i = 0; i < response["routes"].length; i++) {
					var route = response["routes"][i];
					var overview_path = route["overview_path"];
					var singleRoute = [];
					// set routes list
					var limit =  overview_path.length > 50 ? Math.ceil(overview_path.length/ 50) : 1;
					for(var j = 0; j < overview_path.length; j+= limit) {
						var lat = overview_path[j].lat();
						var lng = overview_path[j].lng();
						singleRoute.push({
							"latitude": lat,
							"longitude": lng
						}) ;
					}
					allRoutes.push(singleRoute) 

				}
				// set request body 
				finalRequestBody = {
					"timeOfTravel":timeOfTravel,
					"routes": allRoutes
				}
				getSafestRoute(finalRequestBody, directionsRenderer, response, map);
              	
              } else {
              	window.alert('Directions request failed due to ' + status);
              }
          });
	}

}
// call the api to get safest path
function getSafestRoute(params, directionsRenderer, response, map) {
	showSpinner("inline-block");
	let fetchData = { 
	    method: 'POST', 
	    body: JSON.stringify(params),
	    headers: new Headers({
	    	"content-type": "application/json"
	    })
	}
	fetch('http://127.0.0.1:8000/maps/safepath', fetchData)
	.then(function(resp) {
		return resp.json()
	})
	.then(function(result) {
		showSpinner("none");
		var severities = result['severity_scores'];
		var min_severity = 100;
		var min_index =0;
		var max_severity = 0;
		var max_index = 0;
		for (var i =0; i < severities.length; i++) {
			if (severities[i] < min_severity) {
				min_severity = severities[i];
				min_index = i;
			}
			if (severities[i] > max_severity) {
				max_severity = severities[i];
				max_index = i;
			}
		}
		if (max_index != min_index) {
			// render unsafest route
			var directionsRenderer2 = new google.maps.DirectionsRenderer({
			    directions: response,
			    routeIndex: max_index,
			    map: map,
			    polylineOptions: {
			      strokeColor: "grey"
			    }
			  }); 
			// render safest route
			 directionsRenderer.setOptions({directions:response,routeIndex:min_index});
			
		}
		else {
			directionsRenderer.setDirections(response);
		}
		
	})
	.catch(err =>{
		showSpinner("none");
		if (response['routes'].length > 1) {
			var directionsRenderer2 = new google.maps.DirectionsRenderer({
			    directions: response,
			    routeIndex: 1,
			    map: map,
			    polylineOptions: {
			      strokeColor: "grey"
			    }
			  });
			directionsRenderer.setOptions({directions:response,routeIndex:0});

        	 
		}
		else {
			directionsRenderer.setDirections(response);
		}
    });
}




