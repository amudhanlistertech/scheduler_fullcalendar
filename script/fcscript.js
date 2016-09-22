$(document).ready(function() {
	var filterArray = ['all', 'team', 'role', 'worker', 'patient'];

	//jQuery date picker for start and end.
	$('#start').datepicker({      
		inline: true,
		      showOtherMonths: true,
		      dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
		    
	});
	$('#end').datepicker({      
		inline: true,
		      showOtherMonths: true,
		      dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
		    
	});
	/* Initializing the draggable events*/
	$('#external-events .fc-event').each(function() {

		// store data so the calendar knows to render an event upon drop
		$(this).data('event', {
			title: $.trim($(this).text()), // use the element's text as the event title
			stick: true // maintain when user navigates
		});

		// make the event draggable using jQuery UI
		$(this).draggable({
			zIndex: 999,
			revert: true, // will cause the event to go back to its
			revertDuration: 0 //  original position after the drag
		});

	});
	$('#bootstrapModalFullCalendar').fullCalendar({
		header: {
			left: 'prev,next today',
			center: 'title',
			right: 'month,agendaWeek,agendaDay,listMonth'
		},
		navLinks: true, // can click day/week names to navigate views
		selectable: true,
		selectHelper: true,
		eventLimit: true,
		droppable: true, // this allows things to be dropped onto the calendar
		drop: function() {
			if ($('#drop-remove').is(':checked')) {
				// if so, remove the element from the "Draggable Events" list
				$(this).remove();
			}
		},
		eventClick: function(event, jsEvent, view) {
			$('#modalTitle').html("Event ID: " + event.id);
			$('#modalBody p.worker_p').html("Worker:" + event.worker);
			$('#modalBody p.role_p').html("Role:" + event.role);
			$('#modalBody p.team_p').html("Team:" + event.team);
			$('#modalBody p.location_p').html("Location:" + event.location);
			$('#modalBody p.status_p').html("Status:" + event.status);
			$('#modalBody p.outcome_p').html("Outcome:" + event.outcome);
			//$('#modalBody p.patient_p').html("Patient details:"+event.patient);
			$('#fullCalModal').modal();
			return false;
		},
		events: [{
			id: 101,
			worker: "great worker",
			role: "nurse",
			team: "A team",
			location: 'home',
			status: 'open',
			outcome: "Not completed",
			start: '2016-09-10',
			end: '2016-09-11',
			title: 'Not completed',
			filter: 'team'
		}],
		//This is triggered when an event is rendered.
		eventRender: function eventRender(event, element, view) {
			// Shows the event status as a tool tip
			element.qtip({
				content: event.status
			});
			// var fvalue = $('#filter-type').val();
			// return ['all', event.filter].indexOf(fvalue) >= 0;
		},
		select: function(start, end) {
			$('#createEventModal').modal('show');
		}
	});
	$('#submitButton').on('click', function(e) {
		e.preventDefault();
		doSubmit();
	});

	function doSubmit() {
		$("#createEventModal").modal('hide');
		var data = {
			worker: $('#worker').val(),
			role: $('#role').val(),
			team: $('#team').val(),
			location: $('#location').val(),
			status: $('#status').val(),
			outcome: $('#outcome').val(),
			start: new Date($('#start').val()),
			end: new Date($('#end').val())
		};
		/* Emptying the modal*/
		$('#worker').val(''),
			$('#role').val(''),
			$('#team').val(''),
			$('#location').val(''),
			$('#status').val(''),
			$('#outcome').val(''),
			$('#start').val(''),
			$('#end').val('')
		doAjax("/api/events", "POST", data, function(response) {
			//renderEvent renders a new event in the calendar
			$("#bootstrapModalFullCalendar").fullCalendar('renderEvent', {
				id: response.id,
				worker: response.worker,
				role: response.role,
				team: response.team,
				location: response.location,
				status: response.status,
				outcome: response.outcome,
				start: new Date(response.start),
				end: new Date(response.end),
				title: response.outcome
				/*The 'true' here is for the'stick' variable.
				When the user navigates to another month, the events rendered
				for the current month stay if the stick is true.*/
			}, true);
		}, function(response) {
			console.log("Request failed : "+response);
		});
	}
  getAllEvents();
  function getAllEvents(){
    doAjax("/api/events", "GET", "", function(response) {
			//From the response, each event is rendered.
      jQuery.each(response, function(index, val){
				$("#bootstrapModalFullCalendar").fullCalendar('renderEvent', {
					id: val.id,
					worker: val.worker,
					role: val.role,
					team: val.team,
					location: val.location,
					status: val.status,
					outcome: val.outcome,
					start: new Date(val.start),
					end: new Date(val.end),
					title: val.outcome
				}, true);
			});
		}, function(response) {
			console.log("The request failed for get calls");
		});

  }

	//TODO: Need to find out filter criteria
	// $('#filter-type').on('change', function() {
	// 	$('#bootstrapModalFullCalendar').fullCalendar('rerenderEvents');
	// })

	function doAjax(path, methodtype, argData, success, failed) {
		$.ajax({
			url: "http://127.0.0.1:8081" + path,
			type: methodtype,
			crossDomain: true,
			success: (function(response) {
				success(response);
			}).bind(this),
			error: function(response) {
				failed(response);
			},
			data: JSON.stringify(argData),
			dataType: "json",
			contentType: "application/json"
		});
	}
});
