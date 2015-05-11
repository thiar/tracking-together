$(function() {
	// generate unique user id
	var userId = Math.random().toString(16).substring(2,15);
	
	var socket = io();
	var map;

	var info = $('#infobox');
	var doc = $(document);

	// custom marker's icon styles
	var tinyIcon = L.Icon.extend({
		options: {
			shadowUrl: '../assets/marker-shadow.png',
			iconSize: [25, 39],
			iconAnchor:   [12, 36],
			shadowSize: [41, 41],
			shadowAnchor: [12, 38],
			popupAnchor: [0, -30]
		}
	});
	var redIcon = new tinyIcon({ iconUrl: '../assets/marker-red.png' });
	var yellowIcon = new tinyIcon({ iconUrl: '../assets/marker-yellow.png' });

	var sentData = {};

	var connects = {};
	var markers = {};
	
	var active = false;

	socket.on('load:coords', function(data) {
		if (!(data.id in connects) && data.id!=userId) {
			setMarker(data);
			//console.log(data)
		}

		connects[data.id] = data;
		connects[data.id].updated = $.now();
	});
	socket.on('connection:list', function(data) {
		
		for(var i in data)
		{
			if (!(data[i].id in connects) && data[i].id!=userId) {
				//console.log(i)
				setMarker(data[i]);
				connects[data[i].id] = data[i];
			}
		}
		
	});
	socket.on('connection:remove', function(data) {
		if ((data.id in connects) && data.id!=userId) {
			//console.log(i)
			map.removeLayer(markers[data.id]);
			delete connects[data.id];
		}
		
	});
	socket.on('connection:updatelocation', function(data) {
		if ((data.id in connects) && data.id!=userId) {
			console.log(data.coords[0])
			markers[data.id].setLatLng([data.coords[0].lat,data.coords[0].lng])
		}
		
	});

	var watch =false;
	options = {
	  enableHighAccuracy: false,
	  timeout: 5000,
	  maximumAge: 0
	};
	var userMarker;
	function success(e) {
		var lat = e.coords.latitude;
		var lng = e.coords.longitude;
		var acr = e.coords.accuracy;
		
		if(!watch)
		{
			

			// mark user's position
			userMarker = new L.marker([lat, lng], {
				icon: redIcon
			});
			
			// load leaflet map
			map = L.map('map');

			L.tileLayer('https://{s}.tiles.mapbox.com/v3/examples.map-i87786ca/{z}/{x}/{y}.png', { maxZoom: 18, detectRetina: true}).addTo(map);
			map.setView([-7.275862, 112.791744], 16);

			userMarker.addTo(map);
			userMarker.bindPopup('<p>You are there! Your ID is ' + userId + '</p>').openPopup();

			sentData = {
				id: userId,
				coords: [{
					lat: lat,
					lng: lng,
					acr: acr
				}]
			};
			

			socket.emit('send:location',sentData);
			watch=true;
			
		}
		else
		{
	    	var radius = e.accuracy / 2;
	    	console.log(userMarker)
		    userMarker.setLatLng([lat,lng])
		    userMarker.closePopup()
		    userMarker.bindPopup("You are within " + e.coords.latitude +" "+ e.coords.longitude  + " meters from this point").openPopup()
		    //circleMarker.setLatLng(e.latlng)
		    //circle.setRadius(radius)
		    sentData = {
				id: userId,
				coords: [{
					lat: lat,
					lng: lng,
					acr: acr
				}]
			};
		    socket.emit('connection:update',sentData);
		}
		
		window.onbeforeunload = function() {
		    socket.emit('connection:close',sentData);
		};
		console.log(watch)
		
	}
	
	
	// check whether browser supports geolocation api
	if (navigator.geolocation) {
		//navigator.geolocation.getCurrentPosition(positionSuccess, positionError);
		navigator.geolocation.watchPosition(success, positionError, options);
	} else {
		$('.map').text('Your browser is out of fashion, there\'s no geolocation!');
	}
	

	function positionSuccess(position) {
		var lat = position.coords.latitude;
		var lng = position.coords.longitude;
		var acr = position.coords.accuracy;

		// mark user's position
		userMarker = L.marker([lat, lng], {
			icon: redIcon
		});
		
		// load leaflet map
		map = L.map('map');

		L.tileLayer('https://{s}.tiles.mapbox.com/v3/examples.map-i87786ca/{z}/{x}/{y}.png', { maxZoom: 18, detectRetina: true}).addTo(map);
		map.setView([-7.275862, 112.791744], 16);

		userMarker.addTo(map);
		userMarker.bindPopup('<p>You are there! Your ID is ' + userId + '</p>').openPopup();
		
		sentData = {
			id: userId,
			coords: [{
				lat: lat,
				lng: lng,
				acr: acr
			}]
		};
		

		socket.emit('send:location',sentData);
		window.onbeforeunload = function() {
		    socket.emit('connection:close',sentData);
		};

		var emit = $.now();
		// send coords on when user is active
		doc.on('mousemove', function() {
			active = true;

			sentData = {
				id: userId,
				active: active,
				coords: [{
					lat: lat,
					lng: lng,
					acr: acr
				}]
			};

			if ($.now() - emit > 30) {
				socket.emit('send:coords', sentData);
				emit = $.now();
			}
		});
	}

	

	doc.bind('mouseup mouseleave', function() {
		active = false;
	});

	// showing markers for connections
	function setMarker(data) {
		for (var i = 0; i < data.coords.length; i++) {
			var marker = L.marker([data.coords[i].lat, data.coords[i].lng], { icon: yellowIcon }).addTo(map);
			
			marker.bindPopup('<p>One more external user is here!</p>');
			
			markers[data.id] = marker;
		}
	}

	// handle geolocation api errors
	function positionError(error) {
		var errors = {
			1: 'Authorization fails', // permission denied
			2: 'Can\'t detect your location', //position unavailable
			3: 'Connection timeout' // timeout
		};
		showError('Error:' + errors[error.code]);
	}

	function showError(msg) {
		info.addClass('error').text(msg);

		doc.click(function() {
			info.removeClass('error');
		});
	}

	// delete inactive users every 15 sec
	// setInterval(function() {
	// 	for (var ident in connects){
	// 		if ($.now() - connects[ident].updated > 15000) {
	// 			delete connects[ident];
	// 			map.removeLayer(markers[ident]);
	// 		}
	// 	}
	// }, 15000);
});
