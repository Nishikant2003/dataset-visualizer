// View for rendering the dataset
const DatasetView = Backbone.View.extend({
    el: 'body',
    model: new DatasetModel(),

    /**trigger change event when <input name="dataset"> changes -> calls updateDataset*/
    events: {
        'change .datasetInput': 'updateDataset',
    },

    /**aria-live polite, table-container and template initialized
     * listenTo method to listen for changes in the model and call render
     */
    initialize: function () {
        this.ariaLiveAnnouncer = $('#announcement');
        this.tableContainer = $('#table-container');
        this.chartContainer = $('#chart-container');
        this.tableTemplate = Handlebars.templates['table-template'];
        // window.addEventListener('resize', (event) => {
        // });
        $(window).resize((event)=>{
            this.resizeChart(event);
        })
        //const self=this
        // window.onresize= function (event){
        //     self.resizeChart(event)
        // }
        this.listenTo(this.model, 'change', this.render);
        this.render();
        this.updateChartAriaLabel();
    },

    /** Update resize function */
    resizeChart: function (event) {
        this.plotChart(this.getCurrentDatasetValues());
        console.log('sss')
        if (paper.view) {
            const chartWidth = $('#chart').width();
            const chartHeight = $('#chart').height();

            $('#paper-overlay').attr('width', chartWidth).attr('height', chartHeight);
            paper.view.viewSize = new paper.Size(chartWidth, chartHeight);
            paper.view.draw();
        }
    },
    /**Get the values of the current dataset */
    getCurrentDatasetValues: function () {
        const selectedDataset = this.model.get('currentDataset');
        return this.model.get('datasets')[selectedDataset]
    },
    /** changes the aria-live content */ 
    announceChange: function (selectedDataset) {
        const message = `Chart Updated to ${selectedDataset}`
        setTimeout(() => {
            this.ariaLiveAnnouncer.text(message);
        }, 0);
    },

    /** update the chart aria label */
    updateChartAriaLabel: function () {
        const dataset = this.getCurrentDatasetValues();
        const message = `${dataset.caption} chart with x axis as ${dataset.headers[0]} with intervals at ${dataset.rows.map(row => row[0])} and y axis as ${dataset.caption} and lines depicting ${dataset.headers.slice(1).join(', ')}`;
        this.chartContainer.attr('aria-label', message);
    },

    /** updates the current dataset based on user selection from radio group*/
    updateDataset: function (event) {
        const selectedDataset = event.currentTarget.value;
        console.log(selectedDataset)
        this.model.set('currentDataset', selectedDataset);
        this.updateChartAriaLabel();
        this.announceChange(selectedDataset)
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
        for (let col = 1; col < headers.length; col++) {
            const data = rows.map((row, i) => [i, row[col]]);
            seriesData.push({
                label: headers[col],
                data: data,
                lines: { show: true },
                points: { show: true },
            });
        }

        // X-axis labels (first column)
        const xLabels = rows.map((row, i) => [i, row[0]]);

        // $('#chart-container').removeEventListener('resize', this.resizeChart);
        $('#chart-container').empty();
        $('#chart-container').append(`
            <div aria-hidden='true' style="position: relative; width: 100%; height: 300px;">
                <div aria-hidden='true' id="chart" style="width:100%;height:300px;"></div>
                <canvas aria-hidden='true' id="paper-overlay" width="600" height="300" 
                        style="position:absolute;top:0;left:0;pointer-events:none;z-index:5;">
                </canvas>
            </div>
        `);

        // Create Flot chart
        const plot = $.plot('#chart', seriesData, {
            xaxis: {
                ticks: xLabels,
            },
            yaxis: {
                min: 0
            },
            grid: {
                hoverable: true,
            },
            series: {
                shadowSize: 0
            },
           
        });

        this.initializePaper();

        const self = this;
        $('#chart').bind('plothover', function (event, pos, item) {
            if (item) {
                const x = item.datapoint[0];
                const y = item.datapoint[1];
                console.log(x,y,"ss")
                // Show regular tooltip
                const message = `${headers[item.seriesIndex + 1]}: ${y} at ${xLabels[x][1]}`;
                $('#tooltips').html(message).css({
                    top: item.pageY + 5,
                    left: item.pageX + 5
                }).fadeIn(200);

                self.addPaperHighlight(plot, item);

            } else {
                $('#tooltips').hide();
                self.clearPaperHighlights();
            }
        });
    },

    initializePaper: function () {
        paper.setup('paper-overlay'); 
        paper.view.viewSize = new paper.Size($('#chart').width(), $('#chart').height());
    },

    /** Add Paper.js highlight effect  */
    addPaperHighlight: function (plot, item) {
        // Clear previous highlights
        this.clearPaperHighlights();

        const plotPoint = plot.pointOffset({
            x: item.datapoint[0],
            y: item.datapoint[1]
        });

        const circle = new paper.Path.Circle({
            center: [plotPoint.left, plotPoint.top + 0.5],
            radius: 10,
            strokeColor: '#ff6b6b',
            strokeWidth: 1,
            dashArray: [4, 4],
        });

        circle.onFrame = function (event) {
            this.rotate(2);
        }

        // Store reference for cleanup
        this.currentHighlight = circle;

        paper.view.draw();
    },

    clearPaperHighlights: function () {
        if (this.currentHighlight) {
            this.currentHighlight.remove();
            this.currentHighlight = null;
        }
        paper.view.draw();
    },


});

// Initialize the view when the page loads
$(document).ready(function () {
    new DatasetView();
});