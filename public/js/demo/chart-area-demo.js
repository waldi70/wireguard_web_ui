// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Area Chart Example
function createChart(){
var ctx = document.getElementById("myAreaChart");
myLineChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ["5", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55", "0"],
    datasets: [{
      label: "RX Kib",
      lineTension: 0.3,
      //backgroundColor: "rgba(2,117,216,0.2)",
      borderColor: "rgba(2,117,216,1)",
      pointRadius: 5,
      pointBackgroundColor: "rgba(2,117,216,1)",
      pointBorderColor: "rgba(255,255,255,0.8)",
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "rgba(2,117,216,1)",
      pointHitRadius: 50,
      pointBorderWidth: 2,
      data: [10,30,80,50,100,20,70,65,10,30,74,29]}, {
      label: "TX Kib",
      lineTension: 0.3,
      data: [40,63,18,98,72,46,19,58,86,27,47,36]}, {
      label: "Total Kib",
      lineTension: 0.3,
      data: [0,0,0,0,0,0,0,0,0,0,0,0]},
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
          color: "rgba(0, 0, 0, .125)",
        }
      }],
    },
    legend: {
      display: false
    }
  }
});
//return myLineChart;
}
