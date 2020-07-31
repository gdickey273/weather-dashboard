const apiKey = "77ecc596aad7e05b66bbdb9e1350922f";
var weatherObj;

$(document).ready(function() {
  $("#search-button").on("click", function() {
    var searchValue = $("#search-value").val();

    // clear input box
    $("#search-value").val("");
    searchWeather(searchValue);
  });

  $(".history").on("click", "li", function() {
    searchWeather($(this).text());
  });

  function makeRow(text) {
    var li = $("<li>").addClass("list-group-item list-group-item-action").text(text);
    $(".history").append(li);
  }

  function searchWeather(searchValue) {
    
    $.ajax({
      type: "GET",
      url: "http://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&units=imperial&appid=" + apiKey,
      dataType: "json",
      success: function(data) {
        weatherObj = data;
        console.log(data);
        // create history link for this search
        localStorage.getItem("history");
        if (history.indexOf(searchValue) === -1) {
          history.push(searchValue);
          window.localStorage.setItem("history", JSON.stringify(history));
    
          makeRow(searchValue);
        }
        
        // clear any old content
        $("#today").empty();
        // create html content for current weather
        var todayWeather = $("<div>");
        var todayWeatherHeader = $("<div>").addClass("row");
        var city = data.name;
        var date = moment().format("L");
        var iconSRC = "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";
        var icon = $("<img>").attr("src", iconSRC);
        var cardHeaderEl = $("<h3>").text(city + " " + date);
        todayWeatherHeader.append(cardHeaderEl, icon);
        todayWeather.append(todayWeatherHeader);

        var temperatureEl = $("<p>").html("Temperature: " + data.main.temp + " °F");
        var humidityEl = $("<p>").html("Humidity: " + data.main.humidity + "%");
        var windSpeedEl = $("<p>").html("Wind Speed: " + data.wind.speed + " mph");

        todayWeather.append(temperatureEl, humidityEl, windSpeedEl);

        // merge and add to page
        $("#today").append(todayWeather);
        // call follow-up api endpoints
        getForecast(searchValue);
        getUVIndex(data.coord.lat, data.coord.lon);
      }
    });
  }
  
  function getForecast(searchValue) {
    $.ajax({
      type: "",
      url: "" + searchValue + "",
      dataType: "json",
      success: function(data) {
        // overwrite any existing content with title and empty row

        // loop over all forecasts (by 3-hour increments)
        for (var i = 0; i < data.list.length; i++) {
          // only look at forecasts around 3:00pm
          if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
            // create html elements for a bootstrap card
            

            // merge together and put on page
          }
        }
      }
    });
  }

  function getUVIndex(lat, lon) {
    $.ajax({
      type: "GET",
      url: "http://api.openweathermap.org/data/2.5/uvi?appid="+ apiKey + "&lat=" + lat + "&lon=" + lon,
      dataType: "json",
      success: function(data) {
        console.log(data);
        var uv = $("<p>").text("UV Index: ");
        var btn = $("<span>").addClass("btn btn-sm").text(data.value);
        
        // change color depending on uv value
        if(data.value < 3){
          btn.addClass("btn-success");
        } else if(data.value < 8){
          btn.addClass("btn-warning");
        } else {
          btn.addClass("btn-danger");
        }
        
        $("#today").append(uv.append(btn));
      }
    });
  }

  // get current history, if any
  var history = JSON.parse(window.localStorage.getItem("history")) || [];

  if (history.length > 0) {
    searchWeather(history[history.length-1]);
  }

  for (var i = 0; i < history.length; i++) {
    makeRow(history[i]);
  }
});
