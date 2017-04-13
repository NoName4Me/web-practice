var weatherTable = {
  color: {
    'clear': '#c41c00',
    'clouds': '#fdd835',
    'rain': '#4caf50',
    'snow': '#2196f3',
    'overcast': '#616161'
  },
  icon: {
    'clear': 'sunny',
    'clouds': 'cloudy',
    'rain': 'rain',
    'snow': 'snow',
    'overcast': 'sunny-overcast'
  }
};

var degreeC, degreeF;

function switchFC() {
  var $btn = $('.degree button');
  var $degree = $('.degree span');
  console.log(degreeC + "," + degreeF);
  if ($btn.text() === "C") {
    $degree.text(degreeF + unit);
    $btn.text('F');
  } else {
    $degree.text(degreeC + unit);
    $btn.text('C');
  }

}

var unit = '°';
$(document).ready(function() {
  $('.degree button').on('click', switchFC);

  var openWeatherMap = 'https://api.apixu.com/v1/current.json?key=1d4b8bacb8624f3585b93444171304&q=';
  if (window.navigator && window.navigator.geolocation) {
    window.navigator.geolocation.getCurrentPosition(function(position) {
      $.getJSON(openWeatherMap + position.coords.latitude + ',' + position.coords.longitude).done(function(weather) {
        console.log(weather)
        degreeC = weather.current.feelslike_c;
        degreeF = weather.current.feelslike_f;
        $('.degree span').text(degreeC + unit);
        $('.city p').text(weather.location.name + ", " + weather.location.country);
        var weatherText = weather.current.condition.text.toLowerCase();
        var iconClass = Object.keys(weatherTable.icon).filter(x => weatherText.includes(x));
        $('.weather i').removeClass().addClass('wi ' + 'wi-day-' + weatherTable.icon[iconClass]);
        $('.date p').text(weather.location.localtime);
        $('body').css("background-color", weatherTable.color[iconClass])
      });
    });
  }
});
