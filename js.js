var carsList = document.getElementById('cars');
var registrationInput = document.getElementById('registration');
var entercar = document.getElementById('entercar');

function make_element(name,attr,content) {
	var e = document.createElement(name);
	for(var key in attr) {
		e.setAttribute(key,attr[key]);
	}
	if(content!==undefined) {
		e.innerHTML = content;
	}
	return e;
}

function show_time(time) {
	var d = new Date(time);
	var h = d.getHours() + '';
	var m = d.getMinutes() + '';
	h = '00'.slice(0,2-h.length)+h;
	m = '00'.slice(0,2-m.length)+m;
	return h+':'+m;
}

function Traffic() {
	this.init();
	this.load();
}
Traffic.prototype = {
	init: function() {
		this.cars = {};
		this.timeline = [];
		var tr = this;
		carsList.innerHTML = '';
		registration.value = '';
		entercar.onclick = function() {
			var registration = registrationInput.value;
			var car = new Car(registration);
			if(car.valid) {
				tr.addCar(car);
			}
			registrationInput.value = '';
		}
	},

	addCar: function(car) {
		this.cars[car.last_three] = this.cars[car.last_three] || [];
		if(this.cars[car.last_three].length>=1) {
			console.log("NEW MATCH");
			var n = this.cars[car.last_three].length+1;
			car.comment = "The "+n+"th seen";
		}
		this.cars[car.last_three].push(car);
		this.timeline.push(car);
		var li = make_element(
				'li',
			{class:'car'},
			'<span class="comment">'+car.comment+'</span> <span class="registration">'+car.registration+'</span> <span class="time">'+show_time(car.time)+'</span>'
		);
		carsList.appendChild(li);
		this.save();
	},

	save: function() {
		var ocars = this.timeline.map(function(car){
				return {
					time: car.time, 
					registration: car.registration
				}
		});
		localStorage['trafficthingy'] = JSON.stringify({cars: ocars});
	},

	load: function() {
		var tr = this;
		if(!('trafficthingy' in localStorage)) {
			return;
		}
		var d = JSON.parse(localStorage['trafficthingy']);
		d.cars.forEach(function(dc) {
			var car = new Car(dc.registration,dc.time);
			tr.addCar(car);
		});
	},

	reset: function() {
		this.init();
		this.save();
	}
}

var re_registration = /^([A-Z]{2}\d{2} ?)?([A-Z]{3})$/;

function Car(registration,time) {
	this.registration = registration.toUpperCase();
	this.time = time || Date.now();
	this.comment = '';
	var m = re_registration.exec(this.registration);;
	this.valid = m && true;
	if(!this.valid) {
		return;
	}
	this.last_three = m[2];
}

var traffic = new Traffic();
