var app = app || {};


app.dashboardController = function () {
    // This is how the category model sent from the server should look like
    // This model can be modified if needed but the modifications should be updated in the template as well
    // The category template has an id="category-template"
    var categoryModel = {
        pane: "",
        title: "",
        icon: "",
        id: ""
    };

    var recievedCategories = {};

    function loadCategories() {

        setTemplate({ pane: "pane0", title: "New Items", icon: "pencil", id: "new-items" });

        var Categories =
            [{ pane: "pane1", title: "Key Partners", icon: "pencil", id: "key-partners" },
            { pane: "pane2", title: "Value Propositions", icon: "custom", id: "value-propositions" },
            { pane: "pane3", title: "Customer Segments", icon: "unlock", id: "customer-segments" },
            { pane: "pane4", title: "Key Activities", icon: "clock", id: "key-activities" },
            { pane: "pane5", title: "Key Resources", icon: "note", id: "key-resources" },
            { pane: "pane6", title: "Customer-Relationships", icon: "restore", id: "customer-relationships" },
            { pane: "pane7", title: "Channels", icon: "ungroup", id: "channels" },
            { pane: "pane8", title: "Cost-Structure", icon: "restore", id: "cost-structure" },
            { pane: "pane9", title: "Revenue-Streams", icon: "group", id: "revenue-streams" }];


        $.getJSON("/resources/data/categories.json", function (response) {
            recievedCategories = response;
            var connectedCategories = recievedCategories.map(function (elem) {
                return "#" + elem.id;
            }).join(",");

            $.each(recievedCategories, function (index, category) {
                setTemplate(category);
            });

            $(".body").kendoSortable({
                cursor: "move",
                container: $(".wrapper"),
                connectWith: connectedCategories,
                placeholder: placeholder,
                change: function (e) {
                    if (e.action == "receive") {
                        var newCategory = e.sender.element[0].id;
                        var elementId = $(e.item[0]).children()[0].id;
                        var item = vm.getItem(elementId);
                        item.category = newCategory;
                        $(e.item[0]).find(".item-category").text("Category: " + newCategory);
                    }
                },
            });

            vm.dataModel.fetch(function () {
                $.each(vm.dataModel.data(), function (index, item) {
                    setItem(item);
                });
                kendo.bind($("body"), vm);
            });
        });
    }

    var model = [
        { id: "1", index: "1", name: "Item1", description: "This is Item1 description", category: "key-partners" },
        { id: "2", index: "2", name: "Item2", description: "This is Item2 description", category: "key-partners" },
        { id: "3", index: "1", name: "Item3", description: "This is Item3 description", category: "key-activities" }
    ];

    var validator = $("#form").kendoValidator().data('kendoValidator');

    var vm = kendo.observable({
        addItem: function () {
            if (validator.validate()) {
                var item = {
                    id: this.getNextId(),
                    name: this.get("itemName"),
                    description: "No description",
                    category: "new-items"
                };
                this.dataModel.add(item);
                setItem(item);
                this.set("itemName", "");
                kendo.bind($("body"), vm);
            }
        },
        deleteItem: function (e) {
            if (confirm("Are you sure you want to delete this item!")) {
                var item = vm.getItem(e.toElement.parentElement.id);
                vm.dataModel.remove(item);
                var element = $(e.toElement.parentElement.parentElement).remove();
                $(e.toElement.parentElement).data('kendoDraggable').destroy();
            }
        },
        editItem: function (e) {
            $("[data-role='window']").getKendoWindow().center().open();
            var item = vm.getItem(e.toElement.parentElement.id);
            this.set("selectedItem", item);
        },
        selectedItem: {},
        originalItem: {},
        getItem: function (id) {
            var foundItem = {};
            $.each(vm.dataModel.data(), function (index, item) {
                if (item.id == id) {
                    foundItem = item;
                }
            });
            return foundItem;
        },
        dataModel: new kendo.data.DataSource({
            data: model
        }),
        getNextId: function () {
            var nextId = 0;
            $.each(vm.dataModel.data(), function (index, item) {
                var itemId = parseInt(item.id);
                if (itemId > nextId) {
                    nextId = itemId;
                }
            });
            return nextId + 1;
        },
        persistLayout: function () {
            var layout = {};

            $.each(vm.get("splitters"), function (index, splitter) {
                layout[splitter] = getSplitterValues(splitter);
            });

            localStorage.setItem('splitterLayout', JSON.stringify(layout));
            
            app.successNotification.show({
                message: "Layout has been persisted"
            }, "update-success");
        },
        splitters: ["splitter1", "splitter2", "splitter3", "splitter4", "splitter5"],
        isViewMode: true,
        isEditMode: function () {
            return !this.get("isViewMode");
        },
        switchToEditMode: function () {
            this.set("isViewMode", false);
            this.set("originalItem", $.extend({}, this.get("selectedItem")));
        },
        switchToViewMode: function () {
            this.set("isViewMode", true);

            var elementId = this.get("selectedItem").id;
            var dropItem = vm.getItem(elementId);

            var element = $("#" + elementId + " > div")[0];
            element.innerHTML = "Name: " + this.get("selectedItem").name;

            kendo.bind($("body"), vm);
        },
        switchToCancelMode: function () {
            this.set("isViewMode", true);
            var item = vm.getItem(this.get("originalItem").id);
            this.set("selectedItem", this.get("originalItem"));
            item.name = this.get("originalItem").name;
            item.description = this.get("originalItem").description;
            kendo.bind($("body"), vm);
        },
        saveItems: function () {
            postItemsToServer();
        }
    });

    kendo.bind($("body"), vm);

    function postItemsToServer() {
        $.each(recievedCategories, function (idx, category) {
            var items = $("#" + category.id).data('kendoSortable').items();
            if (items.length > 0) {
                $.each(items, function (index, item) {
                    var elementId = $(item).children()[0].id;
                    var item = vm.getItem(elementId);
                    item.index = index;

                });
            }
        });

        app.successNotification.show({
            message: "Items posted Successfully"
        }, "update-success");

    }

    function getSplitterValues(splitterName) {
        var values = {};

        var splitter = $("#" + splitterName).data('kendoSplitter');

        $.each($("#" + splitterName + " > .k-pane"), function (index, item) {
            if (splitter.size(item)) {
                values[index] = splitter.size(item);
            }
        });

        return values;
    }

    function placeholder(element) {
        return $("<div class='item' id='placeholder'>Drop Here!</div>");
    }

    $(function () {
        loadCategories();
        applySplitterSize();
    });

    function applySplitterSize() {
        resizeSplitter("splitter1", {
            width: $(".wrapper").width(),
            height: $(".wrapper").height()
        });

        var result = localStorage.getItem('splitterLayout');
        if (result != null) {
            var layout = JSON.parse(result);

            $.each(vm.get("splitters"), function (index, splitter) {
                if (layout[splitter] != {})
                    setSplitterValues(splitter, layout[splitter]);
            });
        }
    }

    function setSplitterValues(splitterName, values) {

        var splitter = $("#" + splitterName).data('kendoSplitter');

        $.each($("#" + splitterName + " > .k-pane"), function (index, item) {
            if (values[index] != undefined) {
                splitter.size(item, values[index]);
            }
        });
    }

    function resizeSplitter(id, size) {
        var splitter = $("#" + id).data('kendoSplitter');
        splitter.wrapper.height(size.height);
        splitter.wrapper.width(size.width);
        splitter.resize();
    }

    function setItem(item) {
        var template = kendo.template($("#item-template").html());
        var result = template(item);
        $("#" + item.category).append(result);

    }

    function setTemplate(category) {
        var template = kendo.template($("#category-template").html());
        var result = template(category);
        $("#" + category.pane).html(result);
    }




}