// S&P 500 monthly TR using Aphpa Vantage api 
// function fetchSP500DataAndBuildChart(apiKey) {
//     const queryUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=SPY&apikey=${apiKey}`;

//     fetch(queryUrl)
//         .then(response => response.json())
//         .then(data => {
//             const monthlyAdjusted = data['Monthly Adjusted Time Series'];
//             let cumulativeReturn = 0; // Initialize cumulativeReturn
//             const categories = [];
//             const cumulativeReturns = []; // This will store the cumulative return values

//             // Use the dates in ascending order (oldest first)
//             const dates = Object.keys(monthlyAdjusted).sort();

//             dates.forEach((date, index) => {
//                 const closePrice = parseFloat(monthlyAdjusted[date]['5. adjusted close']);
//                 categories.push(date); // Push the date into categories

//                 // Skip the first iteration since there's no previous month to compare
//                 if (index !== 0) {
//                     const monthlyReturn = ((closePrice - lastPrice) / lastPrice) * 100;
//                     cumulativeReturn += monthlyReturn; // Add the monthly return to the cumulative total
//                     cumulativeReturns.push(parseFloat(cumulativeReturn.toFixed(2))); // Push the cumulative return
//                 }

//                 lastPrice = closePrice; // Update lastPrice for the next iteration
//             });

//             // Build the chart using Highcharts
//             Highcharts.chart('container', {
//                 chart: {
//                     type: 'area', // Change to area chart
//                     backgroundColor: '#333', // Dark background
//                     style: {
//                         fontFamily: 'Arial' // Assuming Arial font is desired
//                     }
//                 },
//                 title: {
//                     text: 'S&P 500 Cumulative Monthly Returns',
//                     style: {
//                         color: '#fff' // White text for title
//                     }
//                 },
//                 xAxis: {
//                     categories: categories,
//                     lineColor: '#666', // Lighter line color for the axis
//                     labels: {
//                         style: {
//                             color: '#fff' // White text for labels
//                         }
//                     }
//                 },
//                 yAxis: {
//                     title: {
//                         text: 'Cumulative Returns (%)',
//                         style: {
//                             color: '#fff' // White text for labels
//                         }
//                     },
//                     gridLineColor: '#444' // Lighter grid line color
//                 },
//                 legend: {
//                     itemStyle: {
//                         color: '#fff' // White text for legends
//                     }
//                 },
//                 series: [{
//                     name: 'S&P 500 TR',
//                     data: cumulativeReturns,
//                     color: 'lightblue', // Adjust color as needed
//                     fillColor: {
//                         linearGradient: [0, 0, 0, 300],
//                         stops: [
//                             [0, Highcharts.color('lightblue').setOpacity(0.5).get('rgba')],
//                             [1, Highcharts.color('black').setOpacity(0).get('rgba')]
//                         ]
//                     }
//                 }],
//                 plotOptions: {
//                     area: {
//                         marker: {
//                             enabled: false
//                         },
//                         lineWidth: 1,
//                         lineColor: '#00FF00', // Adjust line color as needed
//                         fillOpacity: 0.3 // Adjust fill opacity as needed
//                     }
//                 },
//                 credits: {
//                     enabled: false // Disable the Highcharts credits
//                 }
//             });
//         })
//         .catch(error => {
//             console.error('Error fetching data: ', error);
//         });
// }

// fetchSP500DataAndBuildChart('YNG42A4O9HVN789M'); // Replace with your actual API key


//using Tweleve api 

function fetchAndDisplayData() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.twelvedata.com/time_series?symbol=GSPC&interval=1month&apikey=0776e130fd24455184617a48e28d3b1f&start_date=2020-12-01', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var rawData = JSON.parse(xhr.responseText);
            var processedData = calculateMonthlyReturns(rawData);
            createChart(processedData);
        }

    };
    xhr.send();
}

function calculateMonthlyReturns(data) {
    var values = data.values;
    var returns = [];


    // Loop from the start if the data is ordered oldest to newest
    for (var i = 0; i < values.length - 1; i++) {
        var currentMonthData = values[i];

        var currentMonthOpen = parseFloat(currentMonthData.open);
        var currentMonthClose = parseFloat(currentMonthData.close);

        // Calculate the return based on the closing of the current month and the opening of the same month
        var monthlyReturn = ((currentMonthClose - currentMonthOpen) / currentMonthOpen) * 100;

        // Create a Date object for the current month
        var date = new Date(currentMonthData.datetime);

        // Push the return if the month is within the desired year range
        if (date.getFullYear() >= 2021) {
            returns.push([date.getTime(), monthlyReturn]);
        }
    }

    return returns;
}





function createChart(data) {
    Highcharts.chart('container', {
        chart: {
            type: 'area', // Changed to 'area' for area fill beneath the line
            backgroundColor: '#1C1C1E',
            style: {
                fontFamily: 'Arial'
            },
            zoomType: 'x' // Optional: allows users to zoom into the x-axis
        },
        title: {
            text: 'Monthly Returns',
            align: 'center',
            style: {
                color: '#E0E0E0',
                fontSize: '23px'
            }
        },
        xAxis: {
            type: 'datetime',
            labels: {
                style: {
                    color: 'white'
                },
                formatter: function() {
                    var date = new Date(this.value);
                    var month = date.getMonth() + 1;
                    var year = date.getFullYear();
                    if (month === 1) {
                        return year;
                    } else if (month === 7) {
                        return 'Jul';
                    }
                    return '';
                }
            },
            tickPositions: data.map(function(point) {
                var date = new Date(point[0]);
                var month = date.getMonth() + 1;
                if (month === 1 || month === 7) {
                    return point[0];
                }
                return null;
            }).filter(function(position) {
                return position !== null;
            }),
            lineColor: 'gray',
            tickColor: 'gray'
        },
        yAxis: {
            title: {
                text: 'Monthly Return (%)',
                style: {
                    color: '#E0E0E0' // Lighter color for better readability
                }
            },
            gridLineColor: 'gray',
            labels: {
                style: {
                    color: 'white'
                }
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080',
                dashStyle: 'dash'
            }],
            min: -15, // Set the minimum value of y-axis
            max: 15, // Set the maximum value of y-axis
            // You can also use 'tickInterval' to control how often ticks appear
            tickInterval: 5, // Set the interval of ticks to 5%
            startOnTick: true, // Start the axis on a tick
            endOnTick: true, // End the axis on a tick
        },
        legend: {
            itemStyle: {
                color: 'white'
            }
        },
        plotOptions: {
            series: {
                lineWidth: 2,
                marker: {
                    enabled: true // Enable markers
                },
                color: '#22C55E', // Green color for positive values
                negativeColor: '#EF4444', // Red color for negative values
                threshold: 0 // Set the threshold for color change
            },
            area: {
                fillOpacity: 0.5 // Set opacity for area fill
            }
        },
        tooltip: {
            formatter: function() {
                return Highcharts.dateFormat('%B %Y', this.x) +
                       ': <b>' + this.y.toFixed(2) + '%</b>';
            },
            style: {
                color: '#E0E0E0' // Lighter color for better readability
            },
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            borderColor: '#00ff00'
        },
        series: [{
            name: 'S&P 500 Monthly Returns',
            data: data,
            fillColor: { // Gradient fill for area
                linearGradient: [0, 0, 0, 300],
                stops: [
                    [0, 'rgba(34, 197, 94, 0.5)'], // Light green with opacity
                    [1, 'rgba(34, 197, 94, 0)'] // Transparent for a smooth gradientetOpacity(0).get('rgba')] // Gradient end
                ]
            },
            negativeFillColor: {
                linearGradient: [0, 0, 0, 300],
                stops: [
                    [0, 'rgba(239, 68, 68, 0.5)'], // Light red with opacity
                    [1, 'rgba(239, 68, 68, 0)'] // Transparent for a smooth gradient
                ]
            }
        }],
        credits: {
            enabled: false
        }
    });
}
// Call the function to execute
fetchAndDisplayData();

// daily price 
// (async () => {
//     const apiKey = '0776e130fd24455184617a48e28d3b1f'; // Replace with your API key
//     const symbol = 'GSPC'; // SPY is an ETF that tracks the S&P 500
//     const interval = '1day';
//     const apiUrl = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${interval}&apikey=${apiKey}`;

//     try {
//         const response = await fetch(apiUrl);
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const rawData = await response.json();
//         const data = processDataForHighcharts(rawData);

//         // Create the stock chart
//         Highcharts.stockChart('container2', {
//             rangeSelector: {
//                 selected: 0
//             },

//             title: {
//                 text: 'S&P 500 Stock Price'
//             },

//             series: [{
//                 name: 'S&P 500',
//                 data: data,
//                 tooltip: {
//                     valueDecimals: 2
//                 }
//             }],
//             rangeSelector: {
//                 buttons: [{
//                     type: 'week',
//                     count: 1,
//                     text: '1w'
//                 }, {
//                     type: 'week',
//                     count: 2,
//                     text: '2w'
//                 }, {
//                     type: 'month',
//                     count: 1,
//                     text: '1m'
//                 }],
//                 selected: 2,
//                 inputEnabled: false
//             },
            
//         });
//     } catch (error) {
//         console.error('Error fetching data:', error);
//     }
    
// })();

// function processDataForHighcharts(data) {
//     if (!data || !data.values) {
//         console.error('Invalid data format:', data);
//         return [];
//     }
//     console.log(data.values);

//     return data.values.map(point => {
//         return [
//             new Date(point.datetime).getTime(), // Convert date to milliseconds
//             parseFloat(point.close) // Convert the closing price to a float
//         ];
//     }).reverse(); // Reverse the array if the API returns data in descending order
// }





