$(function() {
  // Helpers
  var getSensors = function() {
    return $('[data-sensor]');
  };

  var logToServer = function(data) {
    var id = $('[data-info="id"]').val();

    if (!id) return;

    var url = '/report?clientId=' + id;
    $.ajax(url, {
      method: 'POST',
      data: data,
      dataType: 'json'
    })
  };

  // Main loop
  var runningLoop;
  var loop = function() {
    var output = {};

    getSensors().each(function() {
      var $sensor = $(this);
      var sensorOutput = {};

      $sensor.find('[data-reading]').each(function(){
        var $reading = $(this);

        sensorOutput[$reading.data('reading')] = parseInt($reading.val(), 10);
      });

      output[$sensor.data('sensor')] = sensorOutput;
    });

    logToServer(output);
  };

  $('[data-action="loop"]').on('click', function() {
    var $this = $(this);
    var status = $this.attr('data-status');
    $this.removeClass('btn-success btn-default');

    if (status === "running") {
      window.clearInterval(runningLoop);
      $this.attr('data-status', 'notrunning')
        .text($this.data('notrunning-text'))
        .addClass('btn-default');
    } else {
      runningLoop = window.setInterval(loop, 5*1000);
      loop();
      $this
        .attr('data-status', 'running')
        .text($this.data('running-text'))
        .addClass('btn-success');
    }
  });

  $('[data-action="loop"]').trigger('click');


  $('.slider-input').each(function() {
    var $this = $(this);
    $this.attr('data-slider-value', $this.val());
  });

  $('.slider-input')
    .slider()
    .on('slide', function(slideEvt) {
      var $this = $(this);
      $this.attr('value', slideEvt.value);
    });

  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    $($(e.target).attr('href')).find('.slider-input').slider();
  });

});
