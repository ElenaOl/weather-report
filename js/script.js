// Set up the page when it loads.

$(function() {
  $("#results").hide();
  // attach the form submission to the search function
  $("#search-form").on('submit', search);
});

function search(event) {
  // Stop the form from changing the page.
  event.preventDefault();

  $("#search-form").hide();
  $("#results").show();


  // Get the users search input and save it in a variable.
  var userQuery = $("#query").val();
//API call
  $.getJSON('http://api.openweathermap.org/data/2.5/weather?q=' + userQuery + '&units=imperial&appid=ba300113ee4b6deda22005cae2e3ecb9', callbackCurr);
  $.getJSON('http://api.openweathermap.org/data/2.5/forecast?q=' + userQuery + '&units=imperial&appid=ba300113ee4b6deda22005cae2e3ecb9', callbackForecast);
}

$('#x').on('click', function (){
  $("#results").hide();
  $("#search-form").show();
})
//update UI for current weather
var callbackCurr = function(data){ 
  // console.log(data);
  var city = $('#city')[0];
  city.innerText = data.name + ', ' + data.sys.country;
  var currT = $('#curr-temp')[0];
  currT.innerText = Math.floor(data.main.temp);
  var currDesc = data.weather[0].description;
  var capCurrDesc = currDesc.replace(/\b\w/g, function(l){ return l.toUpperCase() });
  $('#curr-description')[0].innerText = capCurrDesc;
  $('#curr-humidity')[0].innerText = data.main.humidity + "% Humidity";
} 
//update UI for forecast
var callbackForecast = function(data){ 
  // console.log(data);
  var tempPerDate = getTempPerDay(data.list);
  var i=1;
  for(var date in tempPerDate){
    $('#forecast-date-' + i)[0].innerText = date;
    $('#forecast-tempmax-'+ i)[0].innerText = tempPerDate[date].max;
    $('#forecast-tempmin-' + i)[0].innerText = tempPerDate[date].min;
    var icon = "http://openweathermap.org/img/w/" + tempPerDate[date].icon + ".png";
    $('#forecast-icon-' + i).attr("src", icon);
    i++;
  }
} 
//this funstion retrieves all the information from the 5 days API and saves only the required data
function getTempPerDay(list){
  var hash = {};
  var result = [];
  for(var i=0; i<list.length; i++){
    var date = new Date(list[i].dt * 1000).toLocaleString("en-us", { month: 'short', day: 'numeric'});
    var temp = {min: list[i].main.temp_min, max: list[i].main.temp_max, icon: list[i].weather[0].icon};
    if(hash[date] === undefined){
      hash[date] = temp;
    }else{
      if(hash[date].min > temp.min){
        hash[date].min = temp.min;
      }
      if(hash[date].max < temp.max){
        hash[date].max = temp.max;
        hash[date].icon = temp.icon;
      }
    }
  } 
  return hash;
}