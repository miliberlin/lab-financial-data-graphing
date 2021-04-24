
axios.get('http://api.coindesk.com/v1/bpi/historical/close.json')
  .then(res => {
    const data = res.data.bpi;
    const dates = [];
    const bpi = [];
    
    Object.keys(data).forEach(key => {
        dates.push(key);
        bpi.push(data[key]);
    })

    // console.log(dates);
    // console.log(bpi);

    var ctx = document.getElementById('myChart').getContext('2d');

    new Chart(ctx, {
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
        options: {}
    });
    })
  .catch(err => console.log(err))