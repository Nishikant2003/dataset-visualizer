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

        this.loadTemplate().then(() => {
            this.listenTo(this.model, 'change', this.render);
            this.render();
            this.updateChartAriaLabel();
            this.updateTableRowsAriaLabels();
        });

    },
    /**load the template from the file and compile it using Handlebars */
    loadTemplate: function () {
        return $.get('templates/table-template.handlebars').then((templateSource) => {
            this.tableTemplate = Handlebars.compile(templateSource);
        }).catch((error) => {
            console.error('Error loading template:', error);
        });
    },
    /**Get the values of the current dataset */
    getCurrentDatasetValues: function () {
        const selectedDataset = this.model.get('currentDataset');
        return this.model.get('datasets')[selectedDataset]
    },
    /** changes the aria-live content */
    announceChange: function (selectedDataset) {
        const message = `Chart Updated to ${selectedDataset}`
        this.ariaLiveAnnouncer.text(message);
    },

    /** update the chart aria label */
    updateChartAriaLabel: function () {
        const dataset = this.getCurrentDatasetValues();
        const message = `${dataset.caption} chart with x axis as ${dataset.headers[0]} with intervals at ${dataset.rows.map(row => row[0])} and y axis as ${dataset.caption} and lines depicting ${dataset.headers.slice(1).join(', ')}`;
        this.chartContainer.attr('aria-label', message);
    },

    /** update the table rows aria labels */
    updateTableRowsAriaLabels: function () {
        $('#table-container tbody tr').each(function () {
            $(this).attr('aria-label', "Row data")
        })
    },

    /** updates the current dataset based on user selection from radio group*/
    updateDataset: function (event) {
        const selectedDataset = event.currentTarget.value;
        console.log(selectedDataset)
        this.model.set('currentDataset', selectedDataset);
        this.announceChange(selectedDataset);
        this.updateChartAriaLabel();
        this.updateTableRowsAriaLabels();

    },

    /** renders the table handlebrar template based on the current dataset */
    render: function () {
        const dataset = this.getCurrentDatasetValues();
        this.tableContainer.html(this.tableTemplate(dataset));
        this.plotChart(dataset);
    },

    /** plot the chart */
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