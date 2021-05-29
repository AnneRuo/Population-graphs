var currentChart;

document.getElementById('renderBtn').addEventListener('click', fetchData);

async function fetchData() {
    var countryCode = document.getElementById('country').value;
    const indicatorCode = 'SP.POP.TOTL';  
    const baseUrl = 'https://api.worldbank.org/v2/country/';
    const url = baseUrl + countryCode + '/indicator/' + indicatorCode + '?format=json';
    console.log('Fetching data from URL: ' + url);

    var response = await fetch(url);

    if (response.status == 200) {
        var fetchedData = await response.json();
        console.log(fetchedData);

        var data = getValues(fetchedData);
        var labels = getLabels(fetchedData);
        var countryName = getCountryName(fetchedData);
        renderChart(data, labels, countryName);
    }
}


//These helper functions will extract the actual population counts,
// the year labels and the country name from the data array that
// we got from the World Bank 
function getValues(data) {
    var vals = data[1].sort((a, b) => a.date - b.date).map(item => item.value);
    return vals;
}

function getLabels(data) {
    var labels = data[1].sort((a, b) => a.date - b.date).map(item => item.date);
    return labels;
}

function getCountryName(data) {
    var countryName = data[1][0].country.value;
    return countryName;
}


// Let’s add this function that will render the actual population
// graph using the population data, the year labels and the country
// name:
function renderChart(data, labels, countryName) {
    var ctx = document.getElementById('myChart').getContext('2d');

    if (currentChart) {
        // Clear the previous chart if it exists
        currentChart.destroy();
    }

    // Draw new chart
    currentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Population, ' + countryName,
                data: data,
                borderColor: '#10A2A2',
                backgroundColor: '#61C1C1',
            }]
        },
        options: {
            animation: {
                duration: 10000
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}