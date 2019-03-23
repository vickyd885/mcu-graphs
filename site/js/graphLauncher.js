/*
Load dataset and parse values before displaying on graph
 */

 function getRandomColor() {
     var letters = '0123456789ABCDEF'.split('');
     var color = '#';
     for (var i = 0; i < 6; i++ ) {
         color += letters[Math.floor(Math.random() * 16)];
     }
     return color;
 }


 $.getJSON("datasets/mcu_data_locked.json", function(json) {
   loadGlobalBoxOfficeGraph(json);
   loadDailyBoxOfficeGraph(json);

 });

 function getMonetaryValue(amount){
   // return 400 from $4,00 etc
   return parseFloat(amount.replace('$','').replace(',','').replace(',','').replace(',','') / 1000000);

 }


 function getGlobalBoxOfficeData(movieList){
   labels = []
   datasets = [
     {
       label: 'Domestic',
       backgroundColor: '#FE5F55',
       data: []
     },
     {
       label: 'International',
       backgroundColor: '#F9C22E',
       data: []
     }
   ]
   movieList.forEach(function(movie){

     domestic_amount = movie.bom_data.summary.lifetime_domestic_gross
     world_amount = movie.bom_data.summary.lifetime_world_gross
     if( domestic_amount == null || world_amount == null) return;
     datasets[0].data.push(getMonetaryValue(domestic_amount))
     datasets[1].data.push(getMonetaryValue(world_amount))
     labels.push(movie.movie)
   });

   console.log(datasets[1].data)

   return [labels, datasets]

 }

 function getDailyBoxOfficeData(movieList){
   datasets = []
   maxLabelLength = 0;
   movieList.forEach(function(movie){
     dataset = {
       label: movie.movie,
       borderColor: getRandomColor(),
       fill: false,
       data: []
     }
     if(movie.bom_data.daily == null){
       console.log("No data for " + movie.movie)
       return;
     }
     movie.bom_data.daily.forEach(function(day){
       amount = getMonetaryValue(day.gross);
       dataset.data.push(amount)
     });
     if(dataset.data.length > maxLabelLength) maxLabelLength = dataset.data.length;
     datasets.push(dataset);
   });
   console.log(maxLabelLength);
   labels = Array.apply(null, {length: 60}).map(Number.call, Number)
   console.log(labels);
   return [labels, datasets]

 }


function loadGlobalBoxOfficeGraph(json){
  cleaned_data = getGlobalBoxOfficeData(json);
  var ctx = document.getElementById('globalboxoffice').getContext('2d');
  console.log(cleaned_data[1][0].data);
  var globalChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: cleaned_data[0],
      datasets: cleaned_data[1]
    },
    options: {
    scales: {
        responsive: true,
        xAxes: [{
            stacked: true
        }],
        yAxes: [{
            stacked: true,
            scaleLabel: {
              display: true,
              labelString: 'Dollars ($/million)'
            }
        }]
      }
    }
  })
}

function loadDailyBoxOfficeGraph(json){
  cleaned_data = getDailyBoxOfficeData(json);
  var ctx = document.getElementById('dailyboxoffice').getContext('2d');
  console.log(cleaned_data);
  var globalChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: cleaned_data[0],
      datasets: cleaned_data[1]
    },
    options: {
    scales: {
        responsive: true,
        yAxes:[{
          scaleLabel: {
            display: true,
            labelString: 'Dollars ($/million)'
          }
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Days after release'
          }
        }]
      }
    }
  })
}
