var app = app || {};


app.interactionController = function () {
    $.getJSON("/resources/data/chart-interaction.json", function (jsonData) {
        var data = jsonData.DonneesCourbe[0].Point;
        var dataSource = new kendo.data.DataSource({
            data: data
        });
        var xMin = -0.001;
        var xMax = 0.101;
        var zoomStep = 0.001;
        var markerStep = 0.0002;
        var yMin = -5;
        var yMax = 5;
        var markerOneX = 0.03;
        var markerTwoX = 0.08;
        var markerThreeX = 0.05;
        var orangeMarkerTimeInterval = 50;
        var initialOrangeMarkerValue = 0.05;
        var markerOneColor = 'red';
        var markerTwoColor = 'blue';
        var markerThreeColor = 'orange';
        var visible = false;
        var transitions = false;
        var chartType = 'scatterLine';
        var chartStyle = 'smooth';
        var xField = 'x';
        var yField = 'y';

        var blueSeries = 1;
        var redSeries = 2;
        var orangeSeries = 3;
        var roundValue = 4;


        $("#chart").kendoChart({
            dataSource: dataSource,
            transitions: transitions,
            seriesDefaults: {
                type: chartType,
                style: chartStyle,
                markers: {
                    visible: visible
                }
            },
            series: [{
                xField: xField,
                yField: yField,
            }, {
                color: markerOneColor,
                visible: visible,
                data: [[markerOneX, yMin], [markerOneX, yMax]]
            }, {
                color: markerTwoColor,
                visible: visible,
                data: [[markerTwoX, yMin], [markerTwoX, yMax]]
            }, {
                color: markerThreeColor,
                data: [[markerThreeX, yMin], [markerThreeX, yMax]]
            }],
            xAxis: {
                min: xMin,
                max: xMax
            },
            yAxis: {
                min: yMin,
                max: yMax
            }
        });

        var chart = $("#chart").data('kendoChart');

        var viewModel = kendo.observable({
            showRedButton: function (e) {
                chart.options.series[blueSeries].visible = true;
                chart.redraw();
            },
            showRedAndBlueButton: function (e) {
                chart.options.series[blueSeries].visible = true;
                chart.options.series[redSeries].visible = true;
                chart.redraw();
            },
            zoomOut: function () {
                this.zoom("zoomOut");
            },
            zoomIn: function () {
                this.zoom("zoomIn");
            },
            zoom: function (direction) {
                if (direction == "zoomOut") {
                    chart.options.xAxis.min = chart.options.xAxis.min - zoomStep;
                    chart.options.xAxis.max = chart.options.xAxis.max + zoomStep;
                }
                else {
                    chart.options.xAxis.min = chart.options.xAxis.min + zoomStep;
                    chart.options.xAxis.max = chart.options.xAxis.max - zoomStep;
                }
                chart.redraw();
            },
            exportToPdf: function () {
                // Also export as IMAGE and export as SVG is available 
                // http://demos.telerik.com/kendo-ui/chart-api/export
                chart.exportPDF().done(function (data) {
                    kendo.saveAs({
                        dataURI: data,
                        fileName: "chart.pdf",
                        proxyURL: "//demos.telerik.com/kendo-ui/service/export"
                    });
                });

                // Printing directly is also possible

                //var printContents = document.getElementById("chartContainer").innerHTML;
                //var originalContents = document.body.innerHTML;
                //document.body.innerHTML = printContents;
                //window.print();
                //document.body.innerHTML = originalContents;
                //kendo.bind($("#container"), viewModel);
            },
            moveOrangeMarkerLeft: function () {
                this.moveOrangeMarker('left');
            },
            moveOrangeMarkerRight: function () {
                this.moveOrangeMarker('right');
            },
            moveOrangeMarker: function (direction) {
                this.moveOrangeMarkerInDirection = setInterval(function () {
                    if (direction == 'left') {
                        viewModel.set("orangeMarkerValue", viewModel.get("orangeMarkerValue") - markerStep);
                    }
                    else {
                        viewModel.set("orangeMarkerValue", viewModel.get("orangeMarkerValue") + markerStep);
                    }
                    chart.options.series[orangeSeries].data = [[viewModel.get("orangeMarkerValue"), yMin], [viewModel.get("orangeMarkerValue"), yMax]];
                    chart.redraw();
                }, orangeMarkerTimeInterval);
            },
            stopOrangeMarker: function (e) {
                if (this.moveOrangeMarkerInDirection != null) {
                    clearInterval(this.moveOrangeMarkerInDirection);
                }
            },
            orangeMarkerValue: initialOrangeMarkerValue,
            crossingPoint: function () {
                var xValue = parseFloat(viewModel.get("orangeMarkerValue").toFixed(roundValue)); // Pay attention to this one it is JavaScript issue not Kendo
                var point = $.grep(data, function (element, index) {
                    return (element.x == xValue); // Have to round it because JavaScript is calculating wrong
                });
                if (point[0] != null)
                    return point[0].y; // Get the first point because JQuery will return array of data
            },
            moveOrangeMarkerInDirection: null
        });

        kendo.bind($("#container"), viewModel);
    });

}