{
  type: 'line',
  data: {
    labels: [$label$],
    datasets: [{
      label: 'RX',
      lineTension: 0.3,
      //backgroundColor: 'rgba(2,117,216,0.2)',
      borderColor: 'rgba(2,117,216,1)',
      pointRadius: 5,
      pointBackgroundColor: 'rgba(2,117,216,1)',
      pointBorderColor: 'rgba(255,255,255,0.8)',
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(2,117,216,1)',
      pointHitRadius: 50,
      pointBorderWidth: 2,
      data: [$rx$]}, {
      label: 'TX',
      lineTension: 0.3,
      data: [$tx$]}, {
      label: 'Total',
      lineTension: 0.3,
      data: [$total$]},
    ],
  },
  options: {
    scales: {
      xAxes: [{
        time: {
          unit: 'minute'
        },
        gridLines: {
          display: false
        },
        ticks: {
          maxTicksLimit: 7
        }
      }],
      yAxes: [{
        ticks: {
          min: 0,
          max: 2000,
          maxTicksLimit: 5
        },
        gridLines: {
          color: 'rgba(0, 0, 0, .125)',
        }
      }],
    },
    legend: {
      display: false
    }
  }
}