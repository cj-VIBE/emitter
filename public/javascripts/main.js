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

    if (status === "running") {
      window.clearInterval(runningLoop);
      $this.attr('data-status', 'notrunning');
      $this.text($this.data('notrunning-text'));
    } else {
      runningLoop = window.setInterval(loop, 5*1000);
      loop();
      $this.attr('data-status', 'running');
      $this.text($this.data('running-text'));
    }
  });

  $('[data-action="loop"]').trigger('click');

});
