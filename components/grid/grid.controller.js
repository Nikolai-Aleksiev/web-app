var app = app || {};


app.gridController = function (viewModel) {


    $("#grid").kendoGrid({
        dataSource: [1, 2, 3],


        detailTemplate: kendo.template($("#grid-template").html()),
        columns: [
            //define template column with checkbox and attach click event handler
            { template: "<input type='checkbox' class='checkbox' />", width: "40px" },
            {
                template: `
                <div>Controle</div>
                <img src="resources/images/ok.png" alt="ok" height="15" width="15"> 
                <img src="resources/images/edit.png" alt="edit" height="15" width="15"> 
                <img src="resources/images/delete.png" alt="delete" height="15" width="15"> 
            `, width: "80px"
            },
            { template: '<img src="resources/images/attach.png" alt="ok">', width: "40px" },
            {
                template: `
                <div><strong>Huuropzegging contract: 9 per 01/01/17 (case 32)</strong></div>
                <div>Folkers, N.A.</div>
                <div>Gordelweg 5, ROTTERDAM</div>
                <div>SCORPIO REAL ESTATE B.V. / 1000.0004.400.002</div>
                `, width: "350px"},
            {
                template: `
                    <div>afkomstig van: Jordey Estrada</div>
                    <div>22/11/2016 14:23</div>
                    `, width: "250px"},
            {
                template: `
                <div>Taak afronden voor: 23/11/201614:23</div>
                <div>Uiterste datum proces: 24/11/201616:45</div>
            `},
            {
                template: `
                <ul class="myMenu">
                    <li onclick="defaultitemclick();" class="defaultItem" data-action="1">Taak uitvoeren</li>
                    <li class="emptyItem"><span class="empty">&nbsp;</span>
                        <ul>
                        <li class="item1" onclick="item1click();">Uitstellen</li>
                        <li class="item2" onclick="item2click();">Overdragen</li>
                        <li class="item3" onclick="item3click();">Stoppen</li>
                        <li class="item3"><hr/></li>
                        <li class="item3" onclick="item4click();">Uiterste datum aanpassen</li>
                        </ul>
                    </li>
                    </ul>
                `}

        ],


    });


     $(".myMenu").kendoMenu({
          openOnClick: true
        });
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