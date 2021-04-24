let ctx = document.getElementById('myChart').getContext('2d');
let chart;

const startDate = document.getElementById('startdate');
const endDate = document.getElementById('enddate');
let data, dates = [], bpi = [];

// check whether day and month have two digits
const numCheck = (num) => {
    return num < 10 ? (num = `0${num}`) : num;
}
// get today's date and the date for the beginning of the same month
const today = new Date();
let startValue = `${today.getFullYear()}-${numCheck(today.getMonth()+1)}-01`;
let endValue = `${today.getFullYear()}-${numCheck(today.getMonth()+1)}-${numCheck(today.getDate())}`

// set initial dates to create chart
startDate.value = startValue;
endDate.value = endValue;

startDate.addEventListener('input', function (evt) {
    startValue = startDate.value;
    updateChart(startValue, endValue);
});
endDate.addEventListener('input', function (evt) {
    endValue = endDate.value;
    updateChart(startValue, endValue);
});

// check whether end date is before start date
const dateCheck = (startValue, endValue) => {
    let bool = true;
    let startArr = startValue.split("-");
    let endArr = endValue.toString().split("-");

    Object.keys(endArr).forEach(key => {
        if (startArr[key] > endArr[key]) {
            bool = false;
        }
    })
    return bool;
}

// fill dates and BPI array with data received from coindesk API
const retrieveData = (data) => {
    Object.keys(data).forEach(key => {
        dates.push(key);
        bpi.push(data[key]);
    })
}

// initialise chart
axios.get(`http://api.coindesk.com/v1/bpi/historical/close.json?start=${startValue}&end=${endValue}`)
.then(res => {
    data = res.data.bpi;
    retrieveData(data);

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Bitcoin BPI',
                data: bpi,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                fill: false,
                tension: 0.3
            }]
        },
    });
})
.catch(err => console.log(err))


const updateChart = () => {
    let message = document.getElementById('message');
    if (dateCheck(startValue, endValue, message)) {
        message.innerText = '';
        axios.get(`http://api.coindesk.com/v1/bpi/historical/close.json?start=${startValue}&end=${endValue}`)
        .then(res => {
            // update data
            data = res.data.bpi;
            dates = [], bpi = [];
            retrieveData(data);

            // update chart
            chart.data.labels = dates;
            chart.data.datasets.data = bpi;
            chart.update();
        })
        .catch(err => console.log(err))
    }
    else {
        message.innerText = 'Please choose an end date that is after the start date.'
    }
}