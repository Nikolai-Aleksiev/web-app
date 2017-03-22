var app = app || {};


app.filterController = function () {


    var productsDataSource = new kendo.data.DataSource({
        schema: {
            model: {
                id: "ProductID",
                fields: {
                    ProductName: { type: "string" },
                    UnitPrice: { type: "number" }
                }
            }
        },
        //serverFiltering: true,
        type: "odata",
        pageSize: 5,
        transport: {
            read: {
                url: "https://demos.telerik.com/kendo-ui/service/Northwind.svc/Products?$expand=Category",
                dataType: "jsonp"
            },
            update: {
                url: "https://demos.telerik.com/kendo-ui/service/products/update",
                dataType: "jsonp"
            },
            create: {
                url: "https://demos.telerik.com/kendo-ui/service/products/create",
                dataType: "jsonp"
            },
        }
    });

    var categoriesDataSource = new kendo.data.DataSource({
        schema: {
            parse: function (data) {
                for (var i = 0; i < data.d.results.length; i++) {
                    data.d.results[i].productsCount = data.d.results[i].Products.results.length;
                }
                return data;
            },
        },
        type: "odata",
        transport: {
            read: {
                url: "https://demos.telerik.com/kendo-ui/service/Northwind.svc/Categories?$expand=Products",
                dataType: "jsonp"
            },
        }
    });

    $("#categories-chart").kendoChart({
        dataSource: categoriesDataSource,
        explodeField: 'explode',
        chartArea: {
            width: 600,
            height: 320
        },
        series: [
            {
                type: 'pie',
                name: 'name',
                field: 'productsCount',
                labels: {
                    visible: true,
                    background: "transparent",
                    template: function (data) {
                        return data.dataItem.CategoryName + " - " + data.dataItem.productsCount;
                    }
                },
            }
        ],
        seriesClick: function FilterCharts(e) {
            e.sender.options.transitions = false;
            if (e.dataItem.explode) {
                e.dataItem.explode = false;
            }
            else {
                e.dataItem.explode = true;
            }


            var filter = { logic: 'or', filters: [] };

            $.each(e.sender.dataSource.data(), function (index, item) {
                if (item.explode) {
                    filter.filters.push({ field: "Category.CategoryName", operator: "eq", value: item.CategoryName });
                }
            });


            $("#products-table").data('kendoGrid').dataSource.filter(filter);
            e.sender.refresh();
        }
    });

    $("#products-table").kendoGrid({
        dataSource: productsDataSource,
        pageable: {
            buttonCount: 3
        },
        columns: [
            { field: "ProductName", title: "Product Name" },
            {
                field: "Category",
                headerTemplate: "<span>Category</span><input id='categoryFilter' data-role='dropdownlist' data-bind='source: categoriesDataSource' />",
                width: "250px", editor: categoryDropDownEditor, template: "#=Category.CategoryName#"
            },
            { field: "UnitPrice", title: "Unit Price", format: "{0:c}", width: "130px" },
            { command: "destroy", title: " ", width: "150px" }],
        editable: true
    });

    $("#categoryFilter").kendoDropDownList({
        dataSource: categoriesDataSource,
        dataTextField: 'CategoryName',
        dataValueField: 'CategoryName',
        change: function (e) {

            var filter = { logic: 'or', filters: [] };

            filter.filters.push({ field: "Category.CategoryName", operator: "eq", value: e.sender.dataItem().CategoryName });

            $("#products-table").data('kendoGrid').dataSource.filter(filter);
        }
    })


}

function categoryDropDownEditor(container, options) {
    $('<input required name="' + options.field + '"/>')
        .appendTo(container)
        .kendoDropDownList({
            autoBind: false,
            dataTextField: "CategoryName",
            dataValueField: "CategoryID",
            dataSource: {
                type: "odata",
                transport: {
                    read: "https://demos.telerik.com/kendo-ui/service/Northwind.svc/Categories"
                }
            }
        });
}
