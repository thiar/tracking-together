$(function() {
	// generate unique user id
	var userId = $('#username').text();
	var token= $('#token').val()
	var socket = io();

	var map;

	var info = $('#infobox');
	var doc = $(document);

	// custom marker's icon styles
	// var tinyIcon = L.Icon.extend({
	// 	options: {
	// 		shadowUrl: '../assets/marker-shadow.png',
	// 		iconSize: [25, 39],
	// 		iconAnchor:   [12, 36],
	// 		shadowSize: [41, 41],
	// 		shadowAnchor: [12, 38],
	// 		popupAnchor: [0, -30],
	// 		className:'image-icon'
	// 	}
	// });
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
	
	var redIcon = new tinyIcon({ iconUrl: '../assets/pusheen.jpg',className:'image-green'});

	var yellowIcon = new tinyIcon({ iconUrl: '../assets/pusheen.gif',className:'image-yellow' });
	var sentData = {};

	var connects = {};
	var markers = {};
	var requestHelp={};
	
	var active = false;
	$('#helpBtn').click(function(e){
		console.log($('#reqHelp').val())
		var msg=$('#reqHelp').val()
		var lat=userMarker.getLatLng().lat
	    var lng=userMarker.getLatLng().lng	
		sentData = {
			id: userId,
			socketid:socket.id,
			token:token,
			option:"reqhelp",
			msg:msg,
			coords: [{
				lat: lat,
				lng: lng
			}]
		};
		socket.emit('reqHelp',sentData)
		$('#helpBtn').hide()
		$('#reqHelp').hide()
		$('#showHelpCtrl').children().removeClass('fa-spin')

	})
	
	$('#showHelpCtrl').click(function(e){
		$(this).children().addClass('fa-spin')
		$('#helpBtn').show()
		$('#reqHelp').show()		
	})

	socket.on('connection:reqHelp',function(data){
		if(data.id==userId)return;
		var latLng =userMarker.getLatLng()
		var lat=data.coords[0].lat
	    var lng=data.coords[0].lng
	    var reqLatlng=L.latLng(lat,lng)
	    console.log(latLng.distanceTo(reqLatlng))
	    var distance=latLng.distanceTo(reqLatlng)
	    var date=new Date();
	    var dd=date.getDay();
	    var mm = date.getMonth()+1; //January is 0!
		var sc = date.getSeconds();
		var mn = date.getMinutes();
		var hr = date.getHours();
	    var msgId=data.id +'_'+sc+'_'+mn+'_'+hr+'_'+dd+'_'+mm
	   
	    requestHelp[msgId]=data.msg
	    markers[data.id].setIcon(redIcon);
	    $('#notif ul').append('<li>	<a href="#" id="'+msgId+'" > <span class="label label-danger"><i class="fa fa-user"></i></span><span class="message"> ' + data.id + ' Need Your Aid</span><span class="time">'+ Math.floor(distance) +' meters from you</span></a></li>');
		$('#'+msgId).click(function(e){	
			e.preventDefault();
			var id=$(this).attr('id')
			var thisId=$(this)
			var msgusr=id.split("_")[0]
			console.log(msgusr)
			bootbox.dialog({
		        message: data.msg,
		        title: "Help "+data.id,
		        buttons: {
		          buttons: {
		            label: "Don't Help, I'm Bussy Right Now",
		            className: "btn-danger",
		            callback: function() {
		              thisId.parent('li').remove();	
		            }
		          },
		          success: {
		            label: "Help",
		            className: "btn-success",
		            callback: function() {
		               thisId.parent('li').remove();
					   delete requestHelp[id]
					   markers[msgusr].setIcon(yellowIcon)
		            }
		          }
		        }
		      });
			

		})
	})
	


	socket.on('load:coords', function(data) {
		if (!(data.id in connects) && data.id!=userId) {
			setMarker(data);
			//console.log(data)
			connects[data.id] = data;
		}

		connects[data.id] = data;
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
		//console.log(data)
		
	});
	socket.on('connection:remove', function(data) {
		console.log("remove " + data)
		if ((data.id in connects) && data.id!=userId) {
			//console.log("remove")
			map.removeLayer(markers[data.id]);
			delete connects[data.id];
			delete markers[data.id]
		}
		
	});
	socket.on('connection:clear', function(data) {
		
		for(var i in data)
		{
			if ((data.id in connects) && data.id!=userId) {
				console.log("clear "+ data.id)
				map.removeLayer(markers[data.id]);
				delete connects[data.id];
				delete markers[data.id];
			}
		}
		
	});
	socket.on('connection:updatelocation', function(data) {
		if ((data.id in connects) && data.id!=userId) {
			//console.log(data.coords[0])
			var updateLoc=false
			var lat=data.coords[0].lat
			var lng=data.coords[0].lng
	    	var currlat=markers[data.id].getLatLng().lat
		    var currlng=markers[data.id].getLatLng().lng
		    var currlatlng = L.latLng(currlat,currlng);
	    	
	    	var latlng = L.latLng(lat, lng);
	    	
		    var counter = 0;
		    var distance=(Math.floor(latlng.distanceTo(userMarker.getLatLng()))+1)*10

		    var sellat=(lat-currlat)/distance
	    	var sellng=(lng-currlng)/distance
			
			
			if(updateLoc){
				intervalUpdate = window.setInterval(function() { 
			  
				  counter++;
				  // just pretend you were doing a real calculation of
				  // new position along the complex path
				  console.log("update")
				  currlat+=sellat;
				  currlng+=sellng;

				  userMarker.setLatLng([currlat,currlng])
				  markers[data.id].setLatLng([currlat,currlng])
				  if (counter >= distance) {
				    window.clearInterval(intervalUpdate);
				    updateLoc=true   
				  }
				}, 10);
				
			}
			
		}
		else{
			if (!(data.id in connects) && data.id!=userId) {
				setMarker(data);
				//console.log(data)
			}
			connects[data.id] = data;
		}
		
	});

	var watch =false;
	var updateLoc=true;
	var track=false;
	options = {
	  enableHighAccuracy: false,
	  timeout: 5000,
	  maximumAge: 30000,
	};

	var userMarker;
	var currPosition;
	var circleMarker
	function success(e) {
		console.log(map.getZoom())
		var lat = e.latlng.lat;
		var lng = e.latlng.lng;
		var acr = e.accuracy;
		currPosition=e.latlng;
		if(!watch)
		{

			userMarker = new L.marker([lat, lng], {
				icon: redIcon
			});
			userMarker.addTo(map);
			userMarker.bindPopup('<p>You are there! Your ID is ' + userId + '</p>').openPopup();
			
			sentData = {
				id: userId,
				socketid:socket.id,
				token:token,
				coords: [{
					lat: lat,
					lng: lng,
					acr: acr
				}]
			};
			map.setView([lat,lng],16);
			console.log(sentData)
			socket.emit('send:location',sentData);
			watch=true;
			
		}
		else if(updateLoc)
		{
			
			updateLoc=false
	    	var radius = e.accuracy / 2;
	    	var currlat=userMarker.getLatLng().lat
		    var currlng=userMarker.getLatLng().lng
		    var currlatlng = L.latLng(currlat,currlng);
	    	
	    	var latlng = L.latLng(lat, lng);
	    	
		    var counter = 0;
		    var distance=(Math.floor(e.latlng.distanceTo(userMarker.getLatLng()))+1)*10

		    var sellat=(lat-currlat)/distance
	    	var sellng=(lng-currlng)/distance
		    //console.log("current lat lng= " +currlat+" "+currlng+",new lat lng= "+ lat+" "+lng + "selisih lat lng =  "+(currlatlng.distanceTo(latlng)))
			console.log(sellat+" "+sellng)
			interval = window.setInterval(function() { 
			  
			  counter++;
			  // just pretend you were doing a real calculation of
			  // new position along the complex path
			  console.log("update")
			  currlat+=sellat;
			  currlng+=sellng;
			  
			  if(track)map.setView([currlat,currlng], map.getZoom());

			  userMarker.setLatLng([currlat,currlng])
			  // circleMarker.setLatLng(e.latlng)
		   //    circle.setRadius(radius);
			  if (counter >= distance) {
			    window.clearInterval(interval);
			    updateLoc=true   
			  }
			}, 10);
			//userMarker.closePopup()
			socket.emit("log","lat= "+lat+" lng= "+lng+" currlat= "+currlat+" currlng= "+currlng)
		    // userMarker.bindPopup("You are within " +currlatlng.distanceTo(latlng)+ " meters from this point").openPopup()
		    //circleMarker.setLatLng(e.latlng)
		    //circle.setRadius(radius)
		    sentData = {
				id: userId,
				socketid:socket.id,
				token:token,
				coords: [{
					lat: lat,
					lng: lng,
					acr: acr
				}]
			};
		    socket.emit('connection:update',sentData);
		    
		}
		
		
		
		
	}
	window.onbeforeunload = function() {
	    socket.emit('connection:close',sentData);
	};
	$("body").disableSelection();
	$('#track').click(function(){
		if(track)
		{
			track=false;
			//$('#track-img').attr("src","./assets/find1.png")
			$('#track-img').show()
			$('#track-img2').hide()
			userMarker.setIcon(redIcon)
		}
		else{
			map.setView(currPosition,18);
			track=true;
			$('#track-img2').show()
			$('#track-img').hide()
			userMarker.setIcon(yellowIcon)
		} 
		console.log(track)
	});
	$('#map').tap(function(){
		track=false;
		$('#track-img').show()
		$('#track-img2').hide()
		userMarker.setIcon(redIcon)
	})
	$('#map').touchmove(function(){
		track=false;
		$('#track-img').show()
		$('#track-img2').hide()
		userMarker.setIcon(redIcon)
	})
	
	// check whether browser supports geolocation api
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(positionSuccess, positionError);
		
	} else {
		$('.map').text('Your browser is out of fashion, there\'s no geolocation!');
	}
	function positionSuccess(e){
	
		map = L.map('map',{
			center: [e.coords.latitude,e.coords.longitude],
    		zoom: 3,
    		zoomControl:false
    		
    		
		});
		//L.control.zoom({position:'bottomleft'}).addTo(map)

		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		 	maxZoom: 19,
		 	minZoom:7, 
		 	detectRetina: true,
		 	attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
		}).addTo(map);
		map.locate({watch: true, setView: false,enableHighAccuracy:true, maximumAge:1000,timeout: 3000000, frequency: 1});
		map.on('locationerror', positionError);
		map.on('locationfound', success);
	}
	

	
	// showing markers for connections
	function setMarker(data) {
		for (var i = 0; i < data.coords.length; i++) {
			var marker = L.marker([data.coords[i].lat, data.coords[i].lng], { icon: yellowIcon }).addTo(map);
			
			marker.bindPopup('<p>One more external user is '+ data.id+'</p>');
			
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

	
});
