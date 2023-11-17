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
    xhr.open('GET', 'https://api.twelvedata.com/time_series?symbol=SPY&interval=1month&apikey=0917839f9a664b149bc0f98c16adce8b&start_date=2020-12-01', true);
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
    console.log(values);

    // Loop from the start if the data is ordered oldest to newest
    for (var i = 0; i < values.length - 1; i++) {
        var currentMonthData = values[i];
        var nextMonthData = values[i + 1];

        var currentMonthOpen = parseFloat(currentMonthData.open);
        var currentMonthClose = parseFloat(nextMonthData.close);

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

// function createChart(data) {
//     Highcharts.chart('container', {
//         chart: {
//             type: 'line',
//             backgroundColor: '#1C1C1E', // Set the chart background color to dark grey
//             style: {
//                 fontFamily: 'Robot' // Set the font for the chart
//             }
//         },
//         title: {
//             text: 'Monthly Returns',
//             align: 'center',
//             style: {
//                 color: 'white', // Title color
//                 fontSize: '20px' // Title font size
//             }
//         },
//         xAxis: {
//             type: 'datetime',
//             labels: {
//                 style: {
//                     color: 'white' // X-axis label color
//                 },
//                 formatter: function() {
//                     return Highcharts.dateFormat('%b \'%y', this.value);
//                 }
//             },
//             lineColor: 'gray', // X-axis line color
//             tickColor: 'gray', // X-axis tick color
//             tickInterval: 30 * 24 * 3600 * 1000, // approximately one month
//             startOnTick: true,
//             endOnTick: true,
//             showLastLabel: true
//         },
//         yAxis: {
//             title: {
//                 text: 'Monthly Return (%)',
//                 style: {
//                     color: 'white' // Y-axis title color
//                 }
//             },
//             gridLineColor: 'gray', // Y-axis grid line color
//             labels: {
//                 style: {
//                     color: 'white' // Y-axis label color
//                 }
//             }
//         },
//         legend: {
//             itemStyle: {
//                 color: 'white' // Legend text color
//             }
//         },
//         plotOptions: {
//             series: {
//                 lineWidth: 2, // Line width
//                 marker: {
//                     enabled: false // Disable markers
//                 }
//             }
//         },
//         tooltip: {
//             formatter: function() {
//                 return Highcharts.dateFormat('%B %Y', this.x) +
//                        ': <b>' + this.y.toFixed(2) + '%</b>';
//             },
//             style: {
//                 color: 'white' // Adjust the tooltip text color as needed
//             },
//             backgroundColor: 'rgba(0, 0, 0, 0.75)', // Semi-transparent black for tooltip background
//             borderColor: '#00ff00' // Green border to match the line color
//         },
//         series: [{
//             name: 'S&P 500 Monthly Returns', // Adjust to match the name in the image
//             data: data,
//             color: '#00ff00', // Line color for S&P 500 TR, using a standard green hex code

//         }, 
//     ],
//         credits: {
//             enabled: false // Disable the Highcharts credits
//         }
//     });
// }

function createChart(data) {
    Highcharts.chart('container', {
        chart: {
            type: 'line',
            backgroundColor: '#1C1C1E', // Set the chart background color to dark grey
            style: {
                fontFamily: 'Robot' // Set the font for the chart
            }
        },
        title: {
            text: 'Monthly Returns',
            align: 'center',
            style: {
                color: 'white', // Title color
                fontSize: '20px' // Title font size
            }
        },
        xAxis: {
            type: 'datetime',
            labels: {
                style: {
                    color: 'white' // X-axis label color
                },
                formatter: function() {
                    // Display only the full year for January (first month), and month for July
                    var date = new Date(this.value);
                    var month = date.getMonth() + 1; // Months are zero-based
                    var year = date.getFullYear();
                    if (month === 1) {
                        return year; // Just the year for January
                    } else if (month === 7) {
                        return 'Jul'; // "Jul" for July
                    }
                    return ''; // No label for other months
                }
            },
            tickPositions: data.map(function(point) {
                // Create a Date object for each point
                var date = new Date(point[0]);
                var month = date.getMonth() + 1; // Months are zero-based
                // Set ticks for January and July
                if (month === 1 || month === 7) {
                    return point[0];
                }
                return null;
            }).filter(function(position) {
                // Remove nulls (months that are not January or July)
                return position !== null;
            }),
            lineColor: 'gray', // X-axis line color
            tickColor: 'gray', // X-axis tick color
            // ... other xAxis configurations
        },
        yAxis: {
            title: {
                text: 'Monthly Return (%)',
                style: {
                    color: 'white' // Y-axis title color
                }
            },
            gridLineColor: 'gray', // Y-axis grid line color
            labels: {
                style: {
                    color: 'white' // Y-axis label color
                }
            }
        },
        legend: {
            itemStyle: {
                color: 'white' // Legend text color
            }
        },
        plotOptions: {
            series: {
                lineWidth: 2, // Line width
                marker: {
                    enabled: false // Disable markers
                }
            }
        },
        tooltip: {
            formatter: function() {
                return Highcharts.dateFormat('%B %Y', this.x) +
                       ': <b>' + this.y.toFixed(2) + '%</b>';
            },
            style: {
                color: 'white' // Adjust the tooltip text color as needed
            },
            backgroundColor: 'rgba(0, 0, 0, 0.75)', // Semi-transparent black for tooltip background
            borderColor: '#00ff00' // Green border to match the line color
        },
        series: [{
            name: 'S&P 500 Monthly Returns', // Adjust to match the name in the image
            data: data,
            color: '#00ff00', // Line color for S&P 500 TR, using a standard green hex code

        }, 
    ],
        credits: {
            enabled: false // Disable the Highcharts credits
        }
    });
}

// Call the function to execute
fetchAndDisplayData();
