var app = app || {};


app.stackedController = function () {

    var data = [
        {
            "group": "a",
            "value": 0.33,
            "label": "Data Quality",
            "color": "#9BB9BB"
        },
        {
            "group": "b",
            "value": 1.33,
            "label": "Data Quality",
            "color": "#D37503"
        },
        {
            "group": "a",
            "value": 2.5,
            "label": "Data Timeline",
            "color": "#C4E06F"
        },
        {
            "group": "b",
            "value": 2.5,
            "label": "Data Timeline",
            "color": "#86A5A7"
        },
        {
            "group": "a",
            "value": 0,
            "label": "Milestone 1",
            "color": "#DEE0BB"
        },
        {
            "group": "a",
            "value": 0,
            "label": "Milestone 2",
            "color": "#D4D0CD"
        },
        {
            "group": "a",
            "value": 0,
            "label": "Protocol A",
            "color": "#E0E2B1"
        },
        {
            "group": "a",
            "value": 0.71,
            "label": "Site Management",
            "color": "#4880B9"
        },
        {
            "group": "a",
            "value": 0,
            "label": "Site Visit C",
            "color": "#EAC6D4"
        },
        {
            "group": "a",
            "value": 0.50,
            "label": "Subject Sa",
            "color": "#F8A032"
        },
    ];

    var risks = {
        "mediumRisk": 2,
        "mediumRiskColor": "#EFD051",
        "highRisk": 3,
        "highRiskColor": "#8A1A33"
    };


    $("#stacked-chart").kendoChart({
        dataSource: {
            data: data,
            group: {
                field: "group",
            }
        },
        chartArea: {
            width: 900,

        },
        series: [{
            field: "value",
            categoryField: "label",
            stack: true,
            color: "color",
            labels: {
                visible: true,
                background: "transparent"
            }
        }],
        valueAxis: {
            label: "Risk Category",
            plotBands: [{
                from: risks.mediumRisk - 0.02,
                to: risks.mediumRisk + 0.02,
                color: risks.mediumRiskColor
            }, {
                from: risks.highRisk - 0.02,
                to: risks.highRisk + 0.02,
                color: risks.highRiskColor
            }]
        },
    });


}