var cities =[]
var flag =0;

fetch('http://127.0.0.1:8000/cities')
	.then((response) => response.json())
	.then((result) => {
		cities= result;
		getSafestRoute({});
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
	params = 	params = {
	"timeOfTravel": "2020-04-11 10:23:01",
	"routes": [
		[
		{
			"latitude": 40.782970000000006,
			"longitude": -73.97104
		},
		{
			"latitude": 40.783170000000005,
			"longitude": -73.97438000000001
		},
		{
			"latitude": 40.78235,
			"longitude": -73.97521
		},
		{
			"latitude": 40.78253,
			"longitude": -73.97685000000001
		},
		{
			"latitude": 40.78548000000001,
			"longitude": -73.98385
		},
		{
			"latitude": 40.785810000000005,
			"longitude": -73.98422000000001
		},
		{
			"latitude": 40.78595000000001,
			"longitude": -73.98456
		},
		{
			"latitude": 40.7858,
			"longitude": -73.98474
		},
		{
			"latitude": 40.78548000000001,
			"longitude": -73.98471
		},
		{
			"latitude": 40.78463,
			"longitude": -73.98491
		},
		{
			"latitude": 40.783950000000004,
			"longitude": -73.9852
		},
		{
			"latitude": 40.781620000000004,
			"longitude": -73.98692000000001
		},
		{
			"latitude": 40.779740000000004,
			"longitude": -73.98857000000001
		},
		{
			"latitude": 40.775760000000005,
			"longitude": -73.99148000000001
		},
		{
			"latitude": 40.771980000000006,
			"longitude": -73.99422000000001
		},
		{
			"latitude": 40.77111,
			"longitude": -73.99459
		},
		{
			"latitude": 40.76999,
			"longitude": -73.99478
		},
		{
			"latitude": 40.768710000000006,
			"longitude": -73.99553
		},
		{
			"latitude": 40.76559,
			"longitude": -73.99779000000001
		},
		{
			"latitude": 40.76348,
			"longitude": -73.99939
		},
		{
			"latitude": 40.762640000000005,
			"longitude": -74.00052000000001
		},
		{
			"latitude": 40.76185,
			"longitude": -74.00154
		},
		{
			"latitude": 40.7554,
			"longitude": -74.00624
		},
		{
			"latitude": 40.753870000000006,
			"longitude": -74.00725
		},
		{
			"latitude": 40.750550000000004,
			"longitude": -74.00847
		},
		{
			"latitude": 40.7498,
			"longitude": -74.00842
		},
		{
			"latitude": 40.749190000000006,
			"longitude": -74.00811
		},
		{
			"latitude": 40.74837,
			"longitude": -74.00782000000001
		},
		{
			"latitude": 40.744040000000005,
			"longitude": -74.00858000000001
		},
		{
			"latitude": 40.74204,
			"longitude": -74.00898000000001
		},
		{
			"latitude": 40.74058,
			"longitude": -74.00936
		},
		{
			"latitude": 40.739540000000005,
			"longitude": -74.00996
		},
		{
			"latitude": 40.73883,
			"longitude": -74.01013
		},
		{
			"latitude": 40.7366,
			"longitude": -74.01009
		},
		{
			"latitude": 40.7312,
			"longitude": -74.01058
		},
		{
			"latitude": 40.729110000000006,
			"longitude": -74.01078000000001
		},
		{
			"latitude": 40.72509,
			"longitude": -74.01131000000001
		},
		{
			"latitude": 40.72234,
			"longitude": -74.01186000000001
		},
		{
			"latitude": 40.71799,
			"longitude": -74.01284000000001
		},
		{
			"latitude": 40.717150000000004,
			"longitude": -74.01283000000001
		},
		{
			"latitude": 40.71629,
			"longitude": -74.01094
		},
		{
			"latitude": 40.714180000000006,
			"longitude": -74.00631
		},
		{
			"latitude": 40.7126,
			"longitude": -74.00466
		},
		{
			"latitude": 40.712230000000005,
			"longitude": -74.00537
		},
		{
			"latitude": 40.712250000000004,
			"longitude": -74.00577000000001
		},
		{
			"latitude": 40.712300000000006,
			"longitude": -74.00581000000001
		}],

		[
		{
			"latitude": 40.782970000000006,
			"longitude": -73.97104
		},
		{
			"latitude": 40.781600000000005,
			"longitude": -73.97139
		},
		{
			"latitude": 40.78041,
			"longitude": -73.97160000000001
		},
		{
			"latitude": 40.779590000000006,
			"longitude": -73.97029
		},
		{
			"latitude": 40.77816000000001,
			"longitude": -73.96627000000001
		},
		{
			"latitude": 40.777730000000005,
			"longitude": -73.96483
		},
		{
			"latitude": 40.7768,
			"longitude": -73.96337000000001
		},
		{
			"latitude": 40.773700000000005,
			"longitude": -73.95598000000001
		},
		{
			"latitude": 40.77163,
			"longitude": -73.95108
		},
		{
			"latitude": 40.77029,
			"longitude": -73.94784
		},
		{
			"latitude": 40.768910000000005,
			"longitude": -73.94903000000001
		},
		{
			"latitude": 40.76717,
			"longitude": -73.95042000000001
		},
		{
			"latitude": 40.76427,
			"longitude": -73.95292
		},
		{
			"latitude": 40.761010000000006,
			"longitude": -73.95625000000001
		},
		{
			"latitude": 40.75905,
			"longitude": -73.95843
		},
		{
			"latitude": 40.75612,
			"longitude": -73.96076000000001
		},
		{
			"latitude": 40.75486,
			"longitude": -73.96229000000001
		},
		{
			"latitude": 40.749970000000005,
			"longitude": -73.96658000000001
		},
		{
			"latitude": 40.745110000000004,
			"longitude": -73.97085000000001
		},
		{
			"latitude": 40.74273,
			"longitude": -73.97236000000001
		},
		{
			"latitude": 40.74047,
			"longitude": -73.97296
		},
		{
			"latitude": 40.73861,
			"longitude": -73.97361000000001
		},
		{
			"latitude": 40.735960000000006,
			"longitude": -73.97506
		},
		{
			"latitude": 40.731590000000004,
			"longitude": -73.97398000000001
		},
		{
			"latitude": 40.72993,
			"longitude": -73.97244
		},
		{
			"latitude": 40.72858,
			"longitude": -73.9718
		},
		{
			"latitude": 40.72623,
			"longitude": -73.97217
		},
		{
			"latitude": 40.722280000000005,
			"longitude": -73.97449
		},
		{
			"latitude": 40.71775,
			"longitude": -73.97521
		},
		{
			"latitude": 40.712500000000006,
			"longitude": -73.97777
		},
		{
			"latitude": 40.71157,
			"longitude": -73.97868000000001
		},
		{
			"latitude": 40.710840000000005,
			"longitude": -73.98162
		},
		{
			"latitude": 40.709950000000006,
			"longitude": -73.99019000000001
		},
		{
			"latitude": 40.70895,
			"longitude": -73.99737
		},
		{
			"latitude": 40.70848,
			"longitude": -73.99918000000001
		},
		{
			"latitude": 40.709120000000006,
			"longitude": -73.99997
		},
		{
			"latitude": 40.7102,
			"longitude": -74.00111000000001
		},
		{
			"latitude": 40.712880000000006,
			"longitude": -73.99859000000001
		},
		{
			"latitude": 40.71376,
			"longitude": -73.99922000000001
		},
		{
			"latitude": 40.71513,
			"longitude": -74.00053000000001
		},
		{
			"latitude": 40.71614,
			"longitude": -74.00247
		},
		{
			"latitude": 40.714850000000006,
			"longitude": -74.00314
		},
		{
			"latitude": 40.7126,
			"longitude": -74.00466
		},
		{
			"latitude": 40.71213,
			"longitude": -74.0057
		},
		{
			"latitude": 40.712480000000006,
			"longitude": -74.0062
		}],
		[
		{
			"latitude": 40.782970000000006,
			"longitude": -73.97104
		},
		{
			"latitude": 40.780440000000006,
			"longitude": -73.97586000000001
		},
		{
			"latitude": 40.78002,
			"longitude": -73.97692
		},
		{
			"latitude": 40.77891,
			"longitude": -73.97769000000001
		},
		{
			"latitude": 40.776740000000004,
			"longitude": -73.97932
		},
		{
			"latitude": 40.77263000000001,
			"longitude": -73.98231000000001
		},
		{
			"latitude": 40.771730000000005,
			"longitude": -73.98296
		},
		{
			"latitude": 40.770250000000004,
			"longitude": -73.98403
		},
		{
			"latitude": 40.768420000000006,
			"longitude": -73.98536
		},
		{
			"latitude": 40.7646,
			"longitude": -73.98816000000001
		},
		{
			"latitude": 40.761610000000005,
			"longitude": -73.99032000000001
		},
		{
			"latitude": 40.75927,
			"longitude": -73.99202000000001
		},
		{
			"latitude": 40.7561,
			"longitude": -73.99435000000001
		},
		{
			"latitude": 40.75489,
			"longitude": -73.99520000000001
		},
		{
			"latitude": 40.75368,
			"longitude": -73.99610000000001
		},
		{
			"latitude": 40.752010000000006,
			"longitude": -73.99734000000001
		},
		{
			"latitude": 40.74909,
			"longitude": -73.99950000000001
		},
		{
			"latitude": 40.74532000000001,
			"longitude": -74.00224
		},
		{
			"latitude": 40.742630000000005,
			"longitude": -74.00422
		},
		{
			"latitude": 40.74194000000001,
			"longitude": -74.00477000000001
		},
		{
			"latitude": 40.74206,
			"longitude": -74.00592
		},
		{
			"latitude": 40.74222,
			"longitude": -74.00894000000001
		},
		{
			"latitude": 40.74004,
			"longitude": -74.00968
		},
		{
			"latitude": 40.73912000000001,
			"longitude": -74.01010000000001
		},
		{
			"latitude": 40.73778,
			"longitude": -74.01003
		},
		{
			"latitude": 40.735240000000005,
			"longitude": -74.01021
		},
		{
			"latitude": 40.729870000000005,
			"longitude": -74.01071
		},
		{
			"latitude": 40.72663,
			"longitude": -74.01105000000001
		},
		{
			"latitude": 40.72374000000001,
			"longitude": -74.01156
		},
		{
			"latitude": 40.720960000000005,
			"longitude": -74.01214
		},
		{
			"latitude": 40.71725,
			"longitude": -74.01304
		},
		{
			"latitude": 40.714850000000006,
			"longitude": -74.00776
		},
		{
			"latitude": 40.71332,
			"longitude": -74.00448
		},
		{
			"latitude": 40.71273,
			"longitude": -74.00453
		},
		{
			"latitude": 40.712250000000004,
			"longitude": -74.00531000000001
		},
		{
			"latitude": 40.712480000000006,
			"longitude": -74.0062
		}]
	]
}
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
			// var directionsRenderer2 = new google.maps.DirectionsRenderer({
			//     directions: response,
			//     routeIndex: max_index,
			//     map: map,
			//     polylineOptions: {
			//       strokeColor: "grey"
			//     }
			//   });
			// // render safest route
			// directionsRenderer.setRouteIndex(min_index);
   //      	directionsRenderer.setDirections(response);

        	 
		}
		else {
			//directionsRenderer.setDirections(response);
		}
		
	})
	.catch(err =>{
		//directionsRenderer.setDirections(response);
    });
}




