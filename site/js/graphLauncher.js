/*
Load dataset and parse values before displaying on graph
 */

baseColour = 229;
colourSeed = 1;
colourIncrement = 3;

function genColor() {
  var  newShade = baseColour - colourSeed * colourIncrement;
  newShade = 10;
  var alpha = (colourIncrement/100) * colourSeed;
  console.log(alpha)
  colourSeed += 1
  return 'rgb(' + newShade + ',' + newShade + ',' + newShade + ',' + alpha + ')';
}


 $.getJSON("datasets/mcu_data_locked.json", function(json) {
   loadGlobalBoxOfficeGraph(json);
   loadDailyBoxOfficeGraph(json);
   loadDBoxOfficeRankingGraph(json);
   loadDailyThreatreGraph(json);
   loadRTGraph(json);
   loadCSGraph(json);
   loadAccumBOGraph(json);

 });

 function getMonetaryValue(amount){
   // return 400 from $4,00 etc
   return parseFloat(amount.replace('$','').replace(',','').replace(',','').replace(',','') / 1000000);

 }

 function getRTData(movieList){
   labels = []
   datasets = [
     {
       label: 'Audience Rating',
       borderColor: '#21A0A0',
       data: [],
       type: 'line',
       fill: false
     },
     {
       label: 'Rotten (%)',
       backgroundColor: '#00c94d',
       data: []
     },
     {
       label: 'Fresh (%)',
       backgroundColor: '#fd2d00',
       data: []
     }

   ]
   movieList.forEach(function(movie){

     official_score = parseInt(movie.rt_data.official_score.replace('%',''));
     audience_score = parseInt(movie.rt_data.audience_rating.replace('%',''));
     fresh_count = parseInt(movie.rt_data.fresh_count);
     rotten_count = parseInt(movie.rt_data.rotten_count);

     total_reviews = fresh_count + rotten_count;
     fresh_mapped = official_score * (fresh_count/total_reviews);
     rotten_mapped = official_score * (rotten_count/total_reviews);

     datasets[2].data.push(fresh_mapped)
     datasets[1].data.push(rotten_mapped)
     datasets[0].data.push(audience_score)
     labels.push(movie.movie)
   });

   console.log(datasets[1].data)

   return [labels, datasets]

 }


 function getGlobalBoxOfficeData(movieList){
   labels = []
   datasets = [
     {
       label: 'Domestic',
       backgroundColor: '#ED1024',
       data: []
     },
     {
       label: 'International',
       backgroundColor: '#F36673',
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

 function getCSData(movieList){
   labels = []
   datasets = [
     {
       label: 'Score',
       backgroundColor: '#ED1024',
       data: []
     }
   ]
   movieList.forEach(function(movie){
     console.log(movie.cinema_score);
     datasets[0].data.push(gradeMap[movie.cinema_score]);
     console.log(datasets[0].data);
     labels.push(movie.movie);
   });
   return [labels, datasets]
 }

 function getAccumBOData(movieList){
   labels = []
   datasets = [
     {
       label: 'Dollars ($/million)',
       borderColor: '#ED1024',
       data: []
     }
   ]
   index = 0;

   for(i in movieList){
       var movie = movieList[i];
       var movieGross = movie.bom_data.summary.lifetime_gross;
       var movieGrossInt = parseInt(getMonetaryValue(movieGross));
       console.log(datasets[0].data[i-1]);
       if(i == 0) datasets[0].data.push(movieGrossInt)
       else datasets[0].data.push((movieGrossInt + datasets[0].data[i-1]));

       labels.push(movie.movie);
   }
   return [labels, datasets]
 }


 function getDailyBoxOfficeData(movieList){
   datasets = []
   maxLabelLength = 0;
   movieList.forEach(function(movie){
     dataset = {
       label: movie.movie,
       borderColor: genColor(),
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
   labels = Array.apply(null, {length: 30}).map(Number.call, Number)
   console.log(labels);
   return [labels, datasets]

 }

 function getBoxOfficeRankingData(movieList){
   datasets = []
   maxLabelLength = 0;
   movieList.forEach(function(movie){
     dataset = {
       label: movie.movie,
       borderColor: genColor(),
       fill: false,
       data: []
     }
     if(movie.bom_data.daily == null){
       console.log("No data for " + movie.movie)
       return;
     }
     movie.bom_data.daily.forEach(function(day){
       rank = day.rank == '-'? 25 : parseInt(day.rank);
       dataset.data.push(rank)
     });
     if(dataset.data.length > maxLabelLength) maxLabelLength = dataset.data.length;
     datasets.push(dataset);
   });
   console.log(maxLabelLength);
   labels = Array.apply(null, {length: 60}).map(Number.call, Number)
   console.log(labels);
   return [labels, datasets]

 }

 function getDailyTheatreData(movieList){
   datasets = []
   maxLabelLength = 0;
   movieList.forEach(function(movie){
     dataset = {
       label: movie.movie,
       borderColor: genColor(),
       fill: false,
       data: []
     }
     if(movie.bom_data.daily == null){
       console.log("No data for " + movie.movie)
       return;
     }
     movie.bom_data.daily.forEach(function(day){
       theatreCount = parseInt(day.theatres.replace(',',''))
       dataset.data.push(theatreCount)
     });
     datasets.push(dataset);
   });
   console.log(maxLabelLength);
   labels = Array.apply(null, {length: 60}).map(Number.call, Number)
   console.log(labels);
   return [labels, datasets]

 }



function loadGlobalBoxOfficeGraph(json){
  colourSeed = 1;
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
              labelString: 'Dollars ($/millions)'
            }
        }]
      }
    }
  })
}

function loadDailyBoxOfficeGraph(json){
  colourSeed = 1;
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


function loadDailyThreatreGraph(json){
  colourSeed = 1;
  cleaned_data = getDailyTheatreData(json);
  var ctx = document.getElementById('theatres').getContext('2d');
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
            labelString: 'Number of theatres playing movie'
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

function loadDBoxOfficeRankingGraph(json){
  colourSeed = 1;
  cleaned_data = getBoxOfficeRankingData(json);
  var ctx = document.getElementById('boranking').getContext('2d');
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
            labelString: 'Ranking at the box office'
          },
          ticks: {
            reverse: true,
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

function loadRTGraph(json){
  colourSeed = 1;
  cleaned_data = getRTData(json);
  var ctx = document.getElementById('rtgraph').getContext('2d');
  console.log(cleaned_data);
  var globalChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: cleaned_data[0],
      datasets: cleaned_data[1]
    },
    options: {
    scales: {
        responsive: true,
        yAxes:[{
          stacked: true,
          scaleLabel: {
            display: true,
            labelString: 'RT Score'
          }
        }],
        xAxes: [{
          stacked: true,
          scaleLabel: {
            display: true
          }
        }]
      }
    }
  })
}

function loadCSGraph(json){
  colourSeed = 1;
  cleaned_data = getCSData(json);
  var ctx = document.getElementById('cinemascore').getContext('2d');
  var globalChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: cleaned_data[0],
      datasets: cleaned_data[1]
    },
    options: {
    scales: {
        responsive: true,
        yAxes:[{
          stacked: true,
          scaleLabel: {
            display: true,
            labelString: 'Cinema Score'
          },
          ticks: {
            // Include a dollar sign in the ticks
            callback: function(value, index, values) {
                return reversedGradeMap[value];
              }
          }
        }],
        xAxes: [{
          stacked: true,
          scaleLabel: {
            display: true
          }
        }]
      }
    }
  })
}

function loadAccumBOGraph(json){
  colourSeed = 1;
  cleaned_data = getAccumBOData(json);
  var ctx = document.getElementById('accumgraph').getContext('2d');
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
          stacked: true,
          scaleLabel: {
            display: true,
            labelString: 'Dollars ($/million)'
          }
        }],
        xAxes: [{
          stacked: true,
          scaleLabel: {
            display: true
          }
        }]
      }
    }
  })
}

var gradeMap = {
  'A+': 100,
  'A': 90,
  'A-': 80,
  'B+': 70,
  'B': 60,
}

var reversedGradeMap = {
  100: 'A+',
  90: 'A',
  80: 'A-',
  70: 'B+',
  60: 'B'
}
