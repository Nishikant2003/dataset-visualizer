// Model for a Monthly Expenses, Weather Data, and Quiz Scores dataset
const DatasetModel = Backbone.Model.extend({
    defaults: {
        currentDataset: 'Monthly Expenses',
        datasets: {
            'Monthly Expenses': {
                caption: 'Monthly Expenses',
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
                caption: 'Weather Data',
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
                caption: 'Quiz Scores',
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
        this.chartContainer = $('#chart-container');
        this.tableTemplate = Handlebars.compile($('#table-template').html());
        this.listenTo(this.model, 'change', this.render);
        this.updateChartAriaLabel();
        // this.updateTableAriaLabel();

        this.render();
    },

    /** changes the aria-live content */
    announceChange: function (selectedDataset) {
        this.model.get('datasets')[selectedDataset]
        const message = `Chart Updated to ${selectedDataset}`
        this.ariaLiveAnnouncer.text(message);
    }, 

    /** update the chart aria label */ 
    updateChartAriaLabel: function () {
        const selectedDataset=this.model.get('currentDataset')
        const message = `Current dataset is ${selectedDataset}`;
        this.chartContainer.attr('aria-label', message);
    },
    // updateTableAriaLabel:function () {
    //     const selectedDataset=this.model.get('currentDataset')
    //     const message = `Table for ${selectedDataset.caption} table is displayed.`;
    //     this.tableContainer.attr('aria-label',message);
    // },
    updateTableRowsAriaLabels:function (dataset) {
        $('#table-container tbody tr').each(function(){
            $(this).attr('aria-label',"Row data")
        })
    },
    
    /** updates the current dataset based on user selection from radio group*/
    updateDataset: function (event) {
        const selectedDataset = event.currentTarget.value;
        console.log(selectedDataset)
        this.model.set('currentDataset', selectedDataset);
        this.announceChange(selectedDataset);
        this.updateChartAriaLabel();
        // this.updateTableAriaLabel();
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
                points: { show: true },

            });
        }

        // X-axis labels (first column)
        const xLabels = rows.map((row, i) => [i, row[0]]);

        // Draw the chart
        $('#chart-container').empty();
        $('#chart-container').append('<div aria-hidden="true" id="chart" style="width:100%;height:300px;"></div>');
        $.plot('#chart', seriesData, {
            xaxis: {
                ticks: xLabels,
                mode: "categories"
            },
            yaxis: {
                min: 0
            },
            grid: {
                hoverable: true,
                clickable: true
            },
            series: {
                shadowSize: 0
            },
            responsive: true,
            legend: {
                show: true
            }
        });

        // //plothover event to show value on hover
        $('#chart').bind('plothover', function (event, pos, item) {
            if (item) {
                const x = item.datapoint[0];
                const y = item.datapoint[1];
                console.log(`Hovered at x: ${x}, y: ${y} (${headers[item.seriesIndex]}) ${item.seriesIndex}`);
                const message = `${headers[item.seriesIndex + 1]}: ${y} at ${xLabels[x][1]}`
                $('#tooltips').html(message).css({ top: item.pageY + 5, left: item.pageX + 5 }).fadeIn(200);
            } else {
                $('#tooltips').hide();
            }
        });
    },

});

// Initialize the view when the page loads
$(document).ready(function () {
    new DatasetView();
});