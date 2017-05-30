var app = app || {};


app.gridController = function (viewModel) {

    var $ctrl = viewModel;

    $("#window").kendoWindow({
        width: "600px",
        height: "400px",
        title: "Edit Grid Items",
        visible: false,
    });

    $("#update-button").kendoButton({
        click: function (e) {
            $("#window").data('kendoWindow').close();

            var action = $("#edit-items-container").attr('data-action');
            var uid = $("#edit-items-container").attr('data-uid');

            var dataItem = $("#grid").data('kendoGrid').dataSource.getByUid(uid);

            switch (action) {
                case "2":
                    dataItem.id = $("#edit-items-container .k-textbox.item-id").val();
                    break;
                case "3":

                    dataItem.set("text", $("#edit-items-container .k-textbox.item-text").val());
                    dataItem.set("description", $("#edit-items-container .k-textbox.item-description").val());
                    dataItem.set("id", $("#edit-items-container .k-textbox.item-id").val());
                    break;
                case "4":
     //               dataItem.description = $("#edit-items-container .k-textbox.item-description").val();
                    break;
                default:
                    break;
            }

//            $("#grid").data('kendoGrid').dataSource.sync();
    //        $("#grid").data('kendoGrid').refresh();
         //   setMenus();

        }
    });

    $("#cancel-button").kendoButton({
        click: function (e) {
            $("#window").data('kendoWindow').close();
        }
    });

    var commandColumn = `
        <div>Controle</div>
        <img src="resources/images/ok.png" alt="ok" height="15" width="15"> 
    `;

    var userRoles = $ctrl.get("roles");

    if (userRoles.indexOf('update') > -1) {
        commandColumn = commandColumn.concat('<img src="resources/images/edit.png" alt="edit" height="15" width="15"> ');
    }

    if (userRoles.indexOf('delete') > -1) {
        commandColumn = commandColumn.concat('<img src="resources/images/delete.png" alt="delete" height="15" width="15">');
    }

    var toolBar = [];

    if (userRoles.indexOf('create') > -1) {
        toolBar.push("create");
    }



    $("#grid").kendoGrid({
        dataSource: {
            data: [
                { id: 1, text: "new item", description: "description 1" },
                { id: 2, text: "new item 2", description: "description 2" },
                { id: 3, text: "new item 3", description: "description 3" }],
            schema: {
                model: {
                    id: "id"
                }
            },
            autoSync: false,
            change: function (e) {
                debugger;
            }
        },
        toolbar: toolBar,
        editable: "popup",
        detailTemplate: kendo.template($("#grid-template").html()),
        columns: [
            //define template column with checkbox and attach click event handler
            { template: "<input type='checkbox' class='checkbox' />", width: "40px" },
            { template: commandColumn, width: "80px" },
            { template: '<img src="resources/images/attach.png" alt="ok">', width: "40px" },
            {
                template: `
                <div><strong>Huuropzegging contract: 9 per 01/01/17 (case 32)</strong></div>
                <div>Folkers, N.A.</div>
                <div>Gordelweg 5, ROTTERDAM</div>
                <div>SCORPIO REAL ESTATE B.V. / 1000.0004.400.002</div>
                `, width: "350px"
            },
            {
                template: `



                    <div>afkomstig van: Jordey Estrada</div>
                    <div>22/11/2016 14:23</div>
                    <div>#: text #</div>
                    <input class='k-textbox #:id#' data-bind='value: description' />

                    # setTimeout(function(){var item = data; kendo.bind($('.' + id), item);}) #

                    `, width: "250px"
            },
            {
                template: `
                <div>Taak afronden voor: 23/11/201614:23</div>
                <div>Uiterste datum proces: 24/11/201616:45</div>
            `},

            { field: "description", title: "Description" },

            {
                template: `
                <ul class="myMenu">
                    <li class="defaultItem" data-action="1">Taak uitvoeren</li>
                    <li class="emptyItem"><span class="empty">&nbsp;</span>
                        <ul>
                            <li data-action="2">Uitstellen</li>
                            <li data-action="3">Overdragen</li>
                            <li data-action="4">Stoppen</li>
                            <li><hr/></li>
                            <li data-action="5">Uiterste datum aanpassen</li>
                        </ul>
                    </li>
                    </ul>
                                    
                    # setTimeout(function(){
                        $(".myMenu").kendoMenu({ 
                            openOnClick: true, 
                            select: function (event) { 
                                var action = $(event.item).attr('data-action');
                                if (action != undefined) { 
                                    editTemplateRender(event, action); 
                                } 
                            } 
                        }); 
                        
                        $('.emptyItem .k-icon')
                            .addClass('k-i-arrow-chevron-down')
                            .removeClass('k-i-arrow-60-down')
                            .css('margin-right', '-8px');
                    }) #
                `},
            {
                command: [{ template: "<button class='k-button'>Edit</button>" }, "destroy"]
            }

        ],
        edit: function (e) {
        },
        cancel: function (e) {
        },
        dataBound: function (e) {
        },
        itemChange: function (e) {
            alert("item change");
        }



    });


    function setMenus(viewModel) {
        $(".myMenu").kendoMenu({
            openOnClick: true,
            select: function (event) {

                var action = $(event.item).attr('data-action');

                if (action != undefined) {
                    editTemplateRender(event, action, viewModel);
                }
            }
        });


    }

  //  setMenus(viewModel);


    editTemplateRender = function(e, action) {

            var row = $(e.item).closest('tr');
            var dataItem = $("#grid").data('kendoGrid').dataItem(row);
            //var template = kendo.template($("#edit-items-" + action).html());
            viewModel.set("dataItem", dataItem);
            //var result = template(dataItem);
            $("#edit-items-container").html($("#edit-items-" + action).html());
            $("#edit-items-container").attr('data-uid', dataItem.uid);
            $("#edit-items-container").attr('data-action', action);

            kendo.bind($("#edit-items-container"), viewModel);

            $("#window").data('kendoWindow').center().open();


    }


}



function menuItemClick(e) {

    debugger;
}

function item1click() {
    $(".defaultItem").data("action", "1").children(".k-link").text("Uitstellen");
}

function item2click() {
    $(".defaultItem").data("action", "2").children(".k-link").text("Overdragen");
}

function item3click() {
    $(".defaultItem").data("action", "3").children(".k-link").text("Stoppen");
}

function item4click() {
    $(".defaultItem").data("action", "3").children(".k-link").text("Uiterste datum aanpassen");
}

function defaultitemclick() {
    alert($(".defaultItem").data("action"));
}