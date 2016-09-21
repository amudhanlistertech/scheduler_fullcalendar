$(document).ready(function() {
  var filterArray = ['all', 'team', 'role', 'worker','patient'];
  /* Initializing the external events*/
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
  $('#external-events .fc-event').each(function() {

    // store data so the calendar knows to render an event upon drop
    $(this).data('event', {
      title: $.trim($(this).text()), // use the element's text as the event title
      stick: true // maintain when user navigates
    });

    // make the event draggable using jQuery UI
    $(this).draggable({
      zIndex: 999,
      revert: true,      // will cause the event to go back to its
      revertDuration: 0  //  original position after the drag
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
        eventClick:  function(event, jsEvent, view) {
            $('#modalTitle').html("Event title");
            //$('#modalBody p.desc_p').html("Description:"+event.desc);
            $('#modalBody p.worker_p').html("Worker:"+event.worker);
            $('#modalBody p.role_p').html("Role:"+event.role);
            $('#modalBody p.team_p').html("Team:"+event.team);
            $('#modalBody p.location_p').html("Location:"+event.location);
            $('#modalBody p.status_p').html("Status:"+event.status);
            $('#modalBody p.outcome_p').html("Outcome:"+event.outcome);
            //$('#modalBody p.patient_p').html("Patient details:"+event.patient);
            $('#fullCalModal').modal();
            return false;
        },
        events:
        [
          {
              //title: 'Event 1',
              worker: "great worker",
              role: "nurse",
              team: "A team",
              //description:'Team visit',
              location: 'home',
              status: 'open',
              outcome: "Not completed",
              //patient: 'PatientA',
              start: '2016-09-10',
              end: '2016-09-11',
              title: 'Not completed',
              filter: 'team'
          }//,
          // {
          //     title: 'Event 2',
          //     start: '2016-09-15',
          //     description:'Team visit',
          //     status: 'open',
          //     location: 'home',
          //     patient: 'PatientB',
          //     filter: 'team'
          // },
          // {
          //     title: 'Event 3',
          //     start: '2016-09-21',
          //     description:'Role visit',
          //     status: 'closed',
          //     location: 'home',
          //     patient: 'PatientC',
          //     filter: 'role'
          // },
          // {
          //     title: 'Event 4',
          //     start: '2016-09-28',
          //     description:'Worker visit',
          //     status: 'canceled',
          //     location: 'home',
          //     patient: 'PatientD',
          //     filter: 'worker'
          // },
          // {
          //     title: 'Event 5',
          //     start: '2016-09-18',
          //     description:'Patient visit',
          //     status: 'canceled',
          //     location: 'home',
          //     patient: 'PatientE',
          //     filter: 'patient'
          // },
          // {
          //     title: 'Event 6',
          //     start: '2016-09-28',
          //     description:'Role visit',
          //     status: 'closed',
          //     location: 'home',
          //     patient: 'PatientF',
          //     filter: 'role'
          // }
        ],
        eventRender: function eventRender( event, element, view ) {
            // Shows the event status as a tool tip
            element.qtip({
                content: event.status
            });
            var fvalue = $('#filter-type').val();
            return ['all', event.filter].indexOf(fvalue) >= 0;
        },
        select: function(start, end) {
          $('#createEventModal').modal('show');
        }
    });
    $('#submitButton').on('click', function(e){
      e.preventDefault();
      doSubmit();
    });
    function doSubmit(){
      $("#createEventModal").modal('hide');
      $("#bootstrapModalFullCalendar").fullCalendar('renderEvent',
      {
        worker : $('#worker').val(),
        role : $('#role').val(),
        team : $('#team').val(),
        location:$('#location').val(),
        status:$('#status').val(),
        outcome: $('#outcome').val(),
        start: new Date($('#start').val()),
        end: new Date($('#end').val()),
        title: $('#outcome').val(),
      },true);
      /* Emptying the modal*/
      $('#worker').val(''),
      $('#role').val(''),
      $('#team').val(''),
      $('#location').val(''),
      $('#status').val(''),
      $('#outcome').val(),
      $('#start').val(''),
      $('#end').val('')
    }
    $('#filter-type').on('change',function(){
      $('#bootstrapModalFullCalendar').fullCalendar('rerenderEvents');
    })
});
