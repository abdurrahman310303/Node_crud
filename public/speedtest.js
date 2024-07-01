$(document).ready(function() {
    $('#start-speedtest').click(function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var lat = position.coords.latitude;
                var lon = position.coords.longitude;

                var apiKey = '8e5a008833msh3fc504684ff1899p118ce0jsn795547757c49';

                $.ajax({
                    url: `https://weatherapi-com.p.rapidapi.com/current.json?q=${lat},${lon}`,
                    type: 'GET',
                    dataType: 'json',
                    headers: {
                        'x-rapidapi-key': apiKey,
                        'x-rapidapi-host': 'weatherapi-com.p.rapidapi.com'
                    },
                    success: function(response) {
                        $('#speedtest-result').html(
                            '<p>Location: ' + response.location.name + ', ' + response.location.region + ', ' + response.location.country + '</p>' +
                            '<p>Temperature: ' + response.current.temp_c + '°C</p>' +
                            '<p>Humidity: ' + response.current.humidity + '%</p>' +
                            '<p>Wind: ' + response.current.wind_kph + ' km/h</p>'
                        );
                    },
                    error: function(xhr, status, error) {
                        console.error('Error fetching weather data:', error);
                        $('#speedtest-result').html('<p>Error fetching weather data</p>');
                    }
                });
            }, function(error) {
                console.error('Error getting location:', error);
                $('#speedtest-result').html('<p>Error getting location</p>');
            });
        } else {
            console.error('Geolocation is not supported by this browser.');
            $('#speedtest-result').html('<p>Geolocation is not supported by this browser</p>');
        }
    });
});
