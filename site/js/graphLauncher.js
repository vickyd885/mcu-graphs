/*
Load dataset and parse values before displaying on graph
 */


 $.getJSON("datasets/mcu_data_locked.json", function(json) {
   loadGlobalBoxOfficeGraph(json);

 });

 function getMonetaryValue(amount){
   // return 400 from $4,00 etc
   return parseInt(amount.replace('$','').replace(',',''));

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
            stacked: true
        }]
      }
    }
  })
}




//
//
// var ctx = document.getElementById('mcu_graph').getContext('2d');
// var myChart = new Chart(ctx, {
//     type: 'bar',
//     data: {
//         labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//         datasets: [{
//             label: '# of Votes',
//             data: [12, 19, 3, 5, 2, 3],
//             backgroundColor: [
//                 'rgba(255, 99, 132, 0.2)',
//                 'rgba(54, 162, 235, 0.2)',
//                 'rgba(255, 206, 86, 0.2)',
//                 'rgba(75, 192, 192, 0.2)',
//                 'rgba(153, 102, 255, 0.2)',
//                 'rgba(255, 159, 64, 0.2)'
//             ],
//             borderColor: [
//                 'rgba(255, 99, 132, 1)',
//                 'rgba(54, 162, 235, 1)',
//                 'rgba(255, 206, 86, 1)',
//                 'rgba(75, 192, 192, 1)',
//                 'rgba(153, 102, 255, 1)',
//                 'rgba(255, 159, 64, 1)'
//             ],
//             borderWidth: 1
//         }]
//     },
//     options: {
//         scales: {
//             yAxes: [{
//                 ticks: {
//                     beginAtZero: true
//                 }
//             }]
//         }
//     }
// });
