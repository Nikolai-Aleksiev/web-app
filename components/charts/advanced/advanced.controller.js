var app = app || {};


app.advancedController = function () {
    var charts = [];
    var chartsData = {};
    var chartDataSources = {};
    var gridDataSource = new kendo.data.DataSource({
        pageSize: 5,
    });

    // First get the whole data from the service
    $.getJSON("/resources/data/data.json", function (jsonData) {
        gridDataSource.data(jsonData);

        $("#grid").kendoGrid({
            dataSource: gridDataSource,
            pageable: true,
            columns: ['$id', 'Category', 'LogID', 'MachineName', 'AppDomainName', 'Message']
        });
        // Now get the data inofming you for which properties to setup charts
        // In properties.json oyu specify property names from the data json file
        // For every property you specify the code below will create one chart
        // It is all dynamic data could be send from service also so you can keep it in the DB
        $.getJSON("/resources/data/properties.json", function (data) {
            chartsData = data;
            InitializeCharts(chartsData);
        });
    });

    function InitializeCharts(chartsData) {
        $.each(chartsData, function (chartName, chartData) {
            CalculateChartData(gridDataSource.data(), chartName);
            var explodedItems = [];
            $.each(chartsData[chartName], function (name, count) {
                explodedItems[name] = false;
            });
            var newDataSource = new kendo.data.DataSource({
                data: GetData(chartsData[chartName], explodedItems),
            });
            chartDataSources[chartName] = newDataSource;
            CreateChart(chartName, chartData, newDataSource);
        });
    }

    function CalculateChartData(data, chartName) {
        chartsData[chartName] = {};
        $.each(data, function (index, data) {
            if (chartsData[chartName][data[chartName]] != null) {
                chartsData[chartName][data[chartName]] += 1;
            }
            else {
                chartsData[chartName][data[chartName]] = 1;
            }
        });
    }

    function CreateChart(chartName, chartData, newDataSource) {
        // Create HTML element
        $("#chartsContainer").append("<div id='" + chartName + "'></div>");
        // Create Kendo Chart
        $("#" + chartName).kendoChart({
            dataSource: newDataSource,
            explodeField: 'explode',
            chartArea: {
                width: 300,
                height: 320
            },
            series: [{
                type: "pie",
                name: "name",
                field: "count",
            }],
            tooltip: {
                visible: true,
                template: function (data) {
                    return data.dataItem.name + " - " + data.dataItem.count;
                }
            },
            seriesClick: FilterCharts
        });
        // Add Chart to the Charts array for later reference
        charts.push($("#" + chartName).data("kendoChart"));
    }

    function FilterCharts(e) {
        e.sender.options.transitions = false;
        // Set clicked Item explode state
        var senderChartName = e.sender.element.context.id;
        SetCurrentClickedItemExplodeState(senderChartName, e.dataItem.name);
        e.sender.refresh();

        // Set Charts and Grid filters
        var filter = GetCombinedFilter(chartDataSources);
        gridDataSource.filter(filter);
        // Filter all charts but the sender which does not need to be filtered now
        FilterAllCharts(senderChartName);
    }

    function FilterAllCharts(senderChartName) {
        $.each(chartsData, function (chartName, chartData) {
            if (chartName != senderChartName) {
                var otherDataSource = GetOtherChartsDatasource(chartName);
                var filter = GetCombinedFilter(otherDataSource);

                var query = new kendo.data.Query(gridDataSource.data());
                var data = query.filter(filter).data;

                CalculateChartData(data, chartName);
                var explodedItems = GetChartExplodedItems(chartName);
                // Set current chart dataSource
                chartDataSources[chartName].data(GetData(chartsData[chartName], explodedItems));
                //charts[chartName].refresh();
            }
        });
    }

    function GetOtherChartsDatasource(name) {
        var otherDataSource = {};
        $.each(chartDataSources, function (chartName, dataSource) {
            if (chartName != name) {
                otherDataSource[chartName] = dataSource;
            }
        });
        return otherDataSource;
    }

    function GetCombinedFilter(arrayOfDataSource) {
        var filter = { logic: "and", filters: [] };
        var chartName;
        $.each(arrayOfDataSource, function (index, dataSource) {
            var nestedFilter = { logic: "or", filters: [] };
            chartName = index;
            $.each(dataSource.data(), function (dataIndex, data) {
                if (data.explode == true)
                    nestedFilter.filters.push({ field: chartName, operator: "eq", value: data.name });
            });
            if (nestedFilter.filters.length > 0) {
                filter.filters.push(nestedFilter);
            }
        });
        return filter;
    }

    function GetChartExplodedItems(chartName) {
        var explodedItems = [];
        var chartDataSource = chartDataSources[chartName].data();
        $.each(chartDataSource, function (index, element) {
            explodedItems[chartDataSource[index].name] = chartDataSource[index].explode;
        });
        return explodedItems;
    }

    function SetCurrentClickedItemExplodeState(chartName, itemName) {
        // Get chart dataSource
        var chartDataSource = chartDataSources[chartName].data();
        $.each(chartDataSource, function (index, element) {
            // find the clicked item and set the relevant explode state
            if (chartDataSource[index].name == itemName) {
                if (chartDataSource[index].explode) {
                    chartDataSource[index].explode = false;
                }
                else {
                    chartDataSource[index].explode = true;
                }
            }
        });
    }

    function GetData(container, explodedItems) {
        // Convert data in format convinient for Kendo Charts
        var dataSource = [];
        $.each(container, function (name, count) {
            dataSource.push({ name: name, count: count, explode: explodedItems[name] });
        });
        return dataSource;
    }


}
