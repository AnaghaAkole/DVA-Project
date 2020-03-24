var request = new XMLHttpRequest()
request.open('GET','http://127.0.0.1:5002/cities', true)

var cities =[]
var flag =0;

request.onload = function() {
	var f = JSON.parse(request.responseText);
	cities = f.results
}
request.send();

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
			}
			else if (cities[i].toString().toUpperCase().indexOf(filter) > -1 && count < 10)  {
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

function findAndDisplayRoute(directionsService, directionsRenderer) {
	var origin = document.getElementById('origin').value;
	var destination = document.getElementById('destination').value;
	if (origin == "" || destination == "") {
	}
	else {
		directionsService.route(
		{
			origin: {query: origin},
			destination: {query: destination},
			travelMode: 'DRIVING',
			provideRouteAlternatives: true
		},
		function(response, status) {
			if (status === 'OK') {
				var result = [];
				for(var i = 0; i < response["routes"].length; i++) {
					var route = response["routes"][i];
					var overview_path = route["overview_path"];
					var res = [];
					for(var j =0; j < overview_path.length; j++){
						var lat = overview_path[j].lat();
						var lng = overview_path[j].lng();
						var obj = {
							"latitude": lat,
							"longitude": lng
						}
						res[j] = obj;
					}
					result[i] = res;
				}
				console.log(response);
				console.log(result);
              	// modify the response here to remove unsafe routes from routes[] array to render only safest route on the UI
              	directionsRenderer.setDirections(response);
              } else {
              	window.alert('Directions request failed due to ' + status);
              }
          });
	}

}