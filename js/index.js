var devices = [];
var sensor_data = [];

function getDeviceInfo(tmpDevices) {
    console.log(tmpDevices)
    var device;
    var tmp;
    for (var a = 0; a < tmpDevices.length; a++) {
        device = tmpDevices[a];
        console.log("getData for id: " + device.id);
        tmp = {
            id: device.id,
            name: device.name,
            state: device.state,
            dimmer: (device.model.indexOf("dimmer") > -1)
        }
        devices.push(tmp);
    }
}

function getDeviceData() {
    $.ajax({
        type: "GET",
        dataType: "jsonp",
        //async: false,
        url: "http://192.168.1.5:8080/json/devices/list",
        success: function(data) {
            getDeviceInfo(data.device);
            addUI();
        },
        error: function(error) {
            console.log("error: " + error);
        },
        complete: function() {

        }
    });
}


function getSensorData() {
    $.ajax({
        type: "GET",
        //async: false,
        url: "http://192.168.1.5:82/temperature/info",
        success: function(data) {
            if (data == null || data == "" || data == undefined) {
                console.log("no data");
                return;
            }

            console.log(data);
            $("#insideTemperature").html(data[data.length - 1].temperature_inside + " &deg;c"); //temp
            $("#insideHumidity").text(data[data.length - 1].humidity_inside + " %"); //humidity
            $("#insideLastUpdated").text(data[data.length - 1].time_inside); //lastupdated*/

            $("#outsideTemperature").html(data[data.length - 1].temperature_outside + " &deg;c"); //temp
            $("#outsideLastUpdated").text(data[data.length - 1].time_outside); //lastupdated
        },
        error: function(error) {
            console.log("error: " + error);
        },
    });
    /*//inside
    $.ajax(
    {
        type: "GET",
        dataType: "jsonp",
        //async: false,
        url: "http://192.168.1.5:8080/json/sensor/info?id=135",
        success: function(data)
        {
            if(data == null || data == "" || data == undefined)
            {
                console.log("no data");
                return;
            }

            console.log(data);
            //console.log(new Date(data.lastUpdated * 1000));
            var tmpDate = new Date(data.lastUpdated * 1000);
            var tmpDateString = tmpDate.toDateString() + " " + tmpDate.toTimeString().split(" ")[0];

            $("#insideTemperature").html(data.data[0].value +" &deg;c"); //temp
            $("#insideHumidity").text(data.data[1].value +" %"); //humidity
            $("#insideLastUpdated").text(tmpDateString); //lastupdated
        },
        error: function(error)
        {
            console.log("error: " + error);
        },
    });

    //outside
    $.ajax(
    {
        type: "GET",
        dataType: "jsonp",
        //async: false,
        url: "http://192.168.1.5:8080/json/sensor/info?id=136",
        success: function(data)
        {
            if(data == null || data == "" || data == undefined)
            {
                console.log("no data");
                return;
            }


            console.log(data);
            //console.log(data.data[0].value);
            //console.log(new Date(data.lastUpdated * 1000));
            var tmpDate = new Date(data.lastUpdated * 1000);
            var tmpDateString = tmpDate.toDateString() + " " + tmpDate.toTimeString().split(" ")[0];

            $("#outsideTemperature").html(data.data[0].value +" &deg;c"); //temp
            $("#outsideLastUpdated").text(tmpDateString); //lastupdated
        },
        error: function(error)
        {
            console.log("error: ");
            console.log(error);
        },
    });
    //test fetch sensor
    /*$.ajax(
    {

        type: "GET",
        //dataType: "jsonp",
        //async: false,
        url: "http://192.168.1.5:83/info",
        success: function(data)
        {
            console.log(data);
            //sensor_data
            //
            console.log(data[0].temperature_inside);

        },
        error: function(error)
        {
            console.log("error: ");
            console.log(error);
        },
        complete: function()
        {

        }
    });*/

}

function getData() {
    getDeviceData();
    getSensorData();

}

function getPioneerData() {
    sendResponsePioneer("power/info");
    //sendResponsePioneer("volume/info");
}

function addUI() {
    var tmp = "";

    for (var a = 0; a < devices.length; a++) {
        tmp += "<div class=\"row text-center\" style=\"margin-bottom: 10px\">";
        tmp += "<div class=\"col-md-4 col-md-offset-4\">";

        if (devices[a].state == 1 || devices[a].state == 16)
            tmp += "<h2 class=\"font-color-green\" data-id=\"" + devices[a].id + "\">"
        else if (devices[a].state == 2)
            tmp += "<h2 class=\"font-color-red\" data-id=\"" + devices[a].id + "\">"
        else
            tmp += "<h2 data-id=\"" + devices[a].id + "\">"

        tmp += devices[a].name.substring(6, devices[a].name.length) + "</h2>";
        tmp += "<button type=\"button\" class=\"btn btn-danger btn-lg btnOff\" data-id=\"" + devices[a].id + "\">Off</button>";
        tmp += "<span>&nbsp; &nbsp; </span>";
        tmp += "<button type=\"button\" class=\"btn btn-success btn-lg btnOn\" data-id=\"" + devices[a].id + "\">On</button>";

        if (devices[a].dimmer) {
            tmp += "<br><br><label>Dimmer</label><br>";
            tmp += "<button type=\"button\" class=\"btn btn-warning btn-md btnDimmer\" data-dimmervalue=\"51\" data-id=\"" + devices[a].id + "\">1</button>";
            tmp += "<button type=\"button\" class=\"btn btn-primary btn-md btnDimmer\" data-dimmervalue=\"128\" data-id=\"" + devices[a].id + "\">2</button>"; //102 doesnt seem to be any different from 51, wtf??
            tmp += "<button type=\"button\" class=\"btn btn-success btn-md btnDimmer\" data-dimmervalue=\"153\" data-id=\"" + devices[a].id + "\">3</button>";
            tmp += "<button type=\"button\" class=\"btn btn-info btn-md btnDimmer\" data-dimmervalue=\"204\" data-id=\"" + devices[a].id + "\">4</button>";
            tmp += "<button type=\"button\" class=\"btn btn-danger btn-md btnDimmer\" data-dimmervalue=\"255\" data-id=\"" + devices[a].id + "\">5</button>";
        }

        tmp += "<hr></div></div>";
    }

    $("#list-of-devices").append(tmp);
}

function sendResponse(id, status) {
    console.log("http://192.168.1.5:8080/json/device/" + status + "?id=" + id);
    $.ajax({
        type: "GET",
        dataType: "jsonp",
        url: "http://192.168.1.5:8080/json/device/" + status + "?id=" + id,
        success: function(data) {
            console.log(data)

            if (status == "turnon")
                console.log("Sucessfully sent to turn on device " + id);
            else if (status == "turnoff")
                console.log("Sucessfully sent to turn off device " + id);
        },
        error: function(error) {
            console.log(error);
        }
    });
}

function sendResponseDim(id, val) {
    console.log("http://192.168.1.5:8080/json/device/dim?id=" + id + "&level=" + val);

    $.ajax({
        type: "GET",
        dataType: "jsonp",
        //async: false,
        url: "http://192.168.1.5:8080/json/device/dim?id=" + id + "&level=" + val,
        success: function(data) {
            console.log("Sucessfully sent to dim device: " + id + " to level " + val);
        },
        error: function(error) {
            console.log("error: " + error);
        }
    });
}

function sendResponseCheckIfHome(page) {
    console.log("http://192.168.1.5:82/" + page);
    $.ajax({
        type: "GET",
        url: "http://192.168.1.5:82/" + page,
        success: function(data) {
            console.log(data)
        },
        error: function(error) {
            console.log(error);
        }
    });
}

function sendResponsePioneer(page) {
    console.log("http://192.168.1.5:83/" + page);

    $.ajax({
        type: "GET",
        url: "http://192.168.1.5:83/" + page,
        success: function(data) {
            console.log(data)

            console.log(page.substring(0, 6))

            if (page.substring(0, 11) == "volume/info") {
                if (data["ok"] != undefined) {
                    var tmp = (parseInt(data["ok"]) - 1) / 2
                    console.log("Volume: " + tmp)
                    //$("#receiverVolume").text("Vol: " + tmp)
                }
            } else if (page.substring(0, 5) == "power") {
                if (data["ok"] != undefined) {
                    if (data["ok"] == "on") {
                        $("#receiverPowerButton").removeClass().addClass("btn btn-danger btn-lg").text("Off")
                        $("#receiverLabel").removeClass().addClass("font-color-green")
                    } else if (data["ok"] == "off") {
                        $("#receiverPowerButton").removeClass().addClass("btn btn-success btn-lg").text("On")
                        $("#receiverLabel").removeClass().addClass("font-color-red")
                    } else {
                        console.log(data)
                    }
                }
            }
        },
        error: function(error) {
            console.log(error);
        }
    });
}

$(document).ready(function() {

    getData();
    getPioneerData();

    /*
        --------------------------------------------------------------
    */

    $("body").on("click", ".btnOff", function() {
        sendResponse($(this).data("id"), "turnoff");
        $(this).parent().find("h2").removeClass().addClass("font-color-red")
    });

    $("body").on("click", ".btnOn", function() {
        sendResponse($(this).data("id"), "turnon");
        $(this).parent().find("h2").removeClass().addClass("font-color-green")
    });

    $("body").on("click", ".btnAllOff", function() {
        for (var a = 0; a < devices.length; a++) {
            sendResponse(devices[a].id, "turnoff");
        }

        $(this).parent().parent().siblings().find("h2").each(function() {
            $(this).removeClass().addClass("font-color-red")
        });

    });

    $("body").on("click", ".btnAllOn", function() {
        for (var a = 0; a < devices.length; a++) {
            if (a == 4) //ignore lavalampan
                continue;

            sendResponse(devices[a].id, "turnon");
        }

        $(this).parent().parent().siblings().find("h2").each(function() {
            if ($(this).data("id") != 5)
                $(this).removeClass().addClass("font-color-green")
        });
    });

    $("body").on("click", ".btnDimmer", function() {
        sendResponseDim($(this).data("id"), $(this).data("dimmervalue"));
        $(this).parent().find("h2").removeClass().addClass("font-color-green")
    });

    $("body").on("click", "#btnCheckIfHome", function() {
        if ($(this).hasClass("btn-success")) {
            sendResponseCheckIfHome("start")
            $("#btnCheckIfHome").removeClass("btn-success").addClass("btn-danger").text("Stop");
        } else {
            sendResponseCheckIfHome("stop")
            $("#btnCheckIfHome").removeClass("btn-danger").addClass("btn-success").text("Start");
        }
    });

    $("body").on("click", "#receiverVolumeUp", function() {
        /*var tmp = parseInt($("#receiverVolume").text().substring(5))
        console.log(tmp)
        sendResponsePioneer("volume/up")
        tmp += 1
        console.log(tmp)
        $("#receiverVolume").text("Vol: " + tmp)*/

        sendResponsePioneer("volume/up")
    });

    $("body").on("click", "#receiverVolumeDown", function() {
        /*var tmp = parseInt($("#receiverVolume").text().substring(5))
        console.log(tmp)
        sendResponsePioneer("volume/down")
        tmp -= 1
        console.log(tmp)
        $("#receiverVolume").text("Vol: " + tmp)*/

        sendResponsePioneer("volume/down")
    });

    $("body").on("click", "#receiverPowerButton", function() {
        if ($(this).hasClass("btn-success")) {
            sendResponsePioneer("power/on")
        } else if ($(this).hasClass("btn-danger")) {
            sendResponsePioneer("power/off")
        }
    });

    $("body").on("click", "#button_toggle_sidebar", function() {
        $(".sidebar").toggle();
        if ($(this).children().hasClass("glyphicon-remove")) {
            $(this).children().removeClass("glyphicon-remove").addClass("glyphicon-menu-hamburger");
        } else {
            $(this).children().removeClass("glyphicon-menu-hamburger").addClass("glyphicon-remove");
        }

    });



});
