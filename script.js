// Model for a Monthly Expenses, Weather Data, and Quiz Scores dataset
const DatasetModel = Backbone.Model.extend({
    defaults: {
        currentDataset: 'Monthly Expenses',
        datasets: {
            'Monthly Expenses': {
                caption: 'Monthly Expenses Table',
                headers: ['Month', 'Rent', 'Food', 'Transport', 'Utilities', 'Entertainment'],
                rows: [
                    ['Jan', 1200, 300, 100, 150, 200],
                    ['Feb', 1200, 310, 90, 140, 180],
                    ['Mar', 1000, 320, 110, 160, 190],
                    ['Apr', 1200, 315, 120, 150, 220],
                    ['May', 1200, 325, 100, 155, 210],
                    ['Jun', 1200, 330, 105, 145, 230],
                ]
            },
            'Weather Data': {
                caption: 'Weather Data Table',
                headers: ['Month', 'Avg Temp (°C)'],
                rows: [
                    ['Jan', 5],
                    ['Feb', 7],
                    ['Mar', 12],
                    ['Apr', 18],
                    ['May', 22],
                    ['Jun', 27],
                ],
            },
            'Quiz Scores': {
                caption: 'Quiz Scores Table',
                headers: ['Test', 'Math', 'Science', 'History', 'English'],
                rows: [
                    ['Test 1', 80, 85, 78, 90],
                    ['Test 2', 82, 80, 75, 88],
                    ['Test 3', 78, 89, 82, 84],
                    ['Test 4', 90, 92, 85, 87],
                    ['Test 5', 85, 88, 80, 90],
                ],
            }
        }
    }
});

// View for rendering the dataset
const DatasetView = Backbone.View.extend({
    el: 'body',
    model: new DatasetModel(),

    /**trigger change event when <input name="dataset"> changes -> calls updateDataset*/
    events: {
        'change input[name="dataset"]': 'updateDataset'
    },

    /**aria-live polite, table-container and template initialized
     * listenTo method to listen for changes in the model and call render
     */
    initialize: function () {
        this.ariaLiveAnnouncer = $('#announcement');
        this.tableContainer = $('#table-container');
        this.tableTemplate = Handlebars.compile($('#table-template').html());
        this.listenTo(this.model, 'change', this.render);
        this.render();
    },

    /** changes the aria-live content */
    announceChange: function (message) {
        this.ariaLiveAnnouncer.text(message);
    },

    /** updates the current dataset based on user selection from radio group*/
    updateDataset: function (event) {
        const selectedDataset = event.currentTarget.value;
        console.log(selectedDataset)
        this.model.set('currentDataset', selectedDataset);
        this.announceChange(`Dataset changed to: ${selectedDataset}`);
    },

    /** renders the table handlebrar template based on the current dataset */
    render: function () {
        const currentDataset = this.model.get('currentDataset');
        const dataset = this.model.get('datasets')[currentDataset];
        console.log(dataset)
        this.tableContainer.html(this.tableTemplate(dataset));
        this.plotChart(dataset);
    },

    plotChart: function (dataset) {
        this.seriesCharts(dataset);
        this.barCharts(dataset);

    },
    seriesCharts: function (dataset) {
        const headers = dataset.headers;
        const rows = dataset.rows;
        const seriesData = [];

        // Find all numeric columns (skip the first column, which is a label)
        // Prepare a series for each numeric column
        for (let col = 1; col < headers.length; col++) {
            const data = rows.map((row, i) => [i, row[col]]); //[[1, 1200], [1, 1200], ... [2, 1000], ...]]
            /**flot js data format */
            seriesData.push({
                label: headers[col],
                data: data,
                lines: { show: true },
                points: { show: true }
            });
        }

        // X-axis labels (first column)
        const xLabels = rows.map((row, i) => [i, row[0]]);

        // Draw the chart
        $('#chart-container').empty();
        $('#chart-container').append('<div id="chart" style="width:100%;height:300px;"></div>');
        $.plot('#chart', seriesData, {
            xaxis: {
                ticks: xLabels,
                mode: "categories"
            },
            yaxis: {
                min: 0
            },
            legend: {
                show: true
            }
        });
    },
    barCharts: function (dataset) {
        // var data1 = [["January", 10], ["February", 8], ["March", 4], ["April", 13], ["May", 17], ["June", 9]];
        // var data2 = [["January", 1], ["February", 5], ["March", 6], ["April", 3], ["May", 37], ["June", 39]];
        console.log(dataset.rows)

        // $.plot($("#placeholder"),
        //     [{
        //         data: data1,
        //         bars: {
        //             show: true,
        //             barWidth: 0.2,
        //             align: "left",
        //         }
        //     },
        //     {
        //         data: data2,
        //         bars: {
        //             show: true,
        //             barWidth: 0.2,
        //             align: "right",
        //         }
        //     }
        //     ],
        //     {
        //         xaxis: {
        //             mode: "categories",
        //             tickLength: 0
        //         }
        //     }
        // );

    }
});

// Initialize the view when the page loads
$(document).ready(function () {
    new DatasetView();
});