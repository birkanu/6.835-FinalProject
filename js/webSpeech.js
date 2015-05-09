startLatLng = null;
endLatLng = null;
startLocationSet = false;
endLocationSet = false;
routeSet = false;

$(document).ready(function() {
    $("#start_textfield").val("");
    $("#end_textfield").val("");
    $("#route_feedback").hide();
    var interimResult = '';
    var divID = 'start';

    var curState = "listen";

    var setStartLatLng = function(loc) {
        // If invalid location, prompt user to reenter
        if (loc == null) {
            startLocationSet = false;
            $("#start").css("background-color", "#FF6347");
            $("#start_textfield").val("");
            $("#start_textfield_label").html("That location is invalid! Say 'START' to edit start location:");
            return;
        } else {
            startLatLng = loc;
            startLocationSet = true;
            $("#start").css("background-color", "#90EE90");  
            $("#start_textfield").blur();
            $("#start_textfield_label").html("Successfully set start location! Say 'START' to edit start location:");
            if (startLocationSet && endLocationSet) {
                // Check to make sure route exists between startLatLng and endLatLng
                request = {
                    origin: startLatLng,
                    destination: endLatLng,
                    travelMode: google.maps.DirectionsTravelMode.DRIVING
                };
                var mapOpt = { 
                    center: startLatLng,
                    zoom: 13,
                    streetViewControl: false,
                    panControl: false
                };        
                var map = new google.maps.Map(document.getElementById("map-canvas"), mapOpt);
                var directions_service = new google.maps.DirectionsService();
                directions_service.route(request, function(response, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        $("#generate_hyperlapse_button").removeAttr("disabled");
                        $("#route_feedback_label").html("Say 'HYPERLAPSE' or click the 'Generate Hyperlapse' button to proceed.");
                        $("#route_feedback").css("background", "#90EE90");
                        $("#route_feedback").css("color", "black");
                        $("#route_feedback").show();             
                    } else {
                        console.log(status);
                        $("#route_feedback_label").html("There is no route between your chosen locations. Please say 'START' or 'DESTINATION' to edit your choices.");
                        $("#route_feedback").show();
                        var recognition = init_recognition();
                        recognition.start();
                    }
                });                
            }
            return;         
        }
    }

    var setEndLatLng = function(loc) {
        // If invalid location, prompt user to reenter
        if (loc == null) {
            endLocationSet = false;
            $("#end").css("background-color", "#FF6347");
            $("#end_textfield").val("");
            $("#end_textfield_label").html("That location is invalid! Say 'DESTINATION' to edit end location:");
            return;
        } else {
            endLatLng = loc;
            endLocationSet = true;
            $("#end").css("background-color", "#90EE90");  
            $("#end_textfield").blur();
            $("#end_textfield_label").html("Successfully set end location! Say 'DESTINATION' to edit end location:"); 
            if (startLocationSet && endLocationSet) {
                // Check to make sure route exists between startLatLng and endLatLng
                request = {
                    origin: startLatLng,
                    destination: endLatLng,
                    travelMode: google.maps.DirectionsTravelMode.DRIVING
                };
                var mapOpt = { 
                    center: startLatLng,
                    zoom: 13,
                    streetViewControl: false,
                    panControl: false
                };        
                var map = new google.maps.Map(document.getElementById("map-canvas"), mapOpt);
                var directions_service = new google.maps.DirectionsService();
                directions_service.route(request, function(response, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        $("#generate_hyperlapse_button").removeAttr("disabled");
                        $("#route_feedback_label").html("Say 'HYPERLAPSE' or click the 'Generate Hyperlapse' button to proceed.");
                        $("#route_feedback").css("background", "#90EE90");
                        $("#route_feedback").css("color", "black");
                        $("#route_feedback").show();
                    } else {
                        console.log(status);
                        $("#route_feedback_label").html("There is no route between your chosen locations. Please say 'START' or 'DESTINATION' to edit your choices.");
                        $("#route_feedback").show();
                        var recognition = init_recognition();
                        recognition.start();
                    }
                });                
            }
            return;         
        }
    }

    var start_location_recognition = function() {
        var recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en';
        var textField = $("#start_textfield");
        textField.val("");
        var textFieldID = "start_textfield";

        recognition.onresult = function (event) {
            var pos = textField.getCursorPosition() - interimResult.length;
            textField.val(textField.val().replace(interimResult, ''));
            interimResult = '';
            textField.setCursorPosition(pos);
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    recognition.stop();
                    $("#start_textfield_label").html("Processing...");
                    insertAtCaret(textFieldID, event.results[i][0].transcript);
                    $("#generate_hyperlapse_button").attr("disabled", "disabled");    
                    var latlng = getLatLng(event.results[i][0].transcript, setStartLatLng);
                    recognition = init_recognition();
                    recognition.start();
                } else {
                    startLocationSet = false;    
                    isFinished = false;
                    insertAtCaret(textFieldID, event.results[i][0].transcript + '\u200B');
                    interimResult += event.results[i][0].transcript + '\u200B';
                }
            }
        }

        return recognition;        
    }

    var end_location_recognition = function() {
        var recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en';
        var textField = $("#end_textfield");
        textField.val("");
        var textFieldID = "end_textfield";

        recognition.onresult = function (event) {
            var pos = textField.getCursorPosition() - interimResult.length;
            textField.val(textField.val().replace(interimResult, ''));
            interimResult = '';
            textField.setCursorPosition(pos);
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    recognition.stop();
                    $("#end_textfield_label").html("Processing...");
                    insertAtCaret(textFieldID, event.results[i][0].transcript);
                    $("#generate_hyperlapse_button").attr("disabled", "disabled"); 
                    var latlng = getLatLng(event.results[i][0].transcript, setEndLatLng);
                    recognition = init_recognition();
                    recognition.start();
                } else {
                    endLocationSet = false;       
                    isFinished = false;
                    insertAtCaret(textFieldID, event.results[i][0].transcript + '\u200B');
                    interimResult += event.results[i][0].transcript + '\u200B';
                }
            }
        }

        return recognition;        
    }

    $("#start_textfield").change(function(e) {
        e.preventDefault();
        startLocationSet = false;
        var latlng = getLatLng($("#start_textfield").val(), setStartLatLng);
        $("#generate_hyperlapse_button").attr("disabled", "disabled");        
        recognition = init_recognition();
        recognition.start();
    });

    $("#end_textfield").change(function(e) {
        e.preventDefault();
        endLocationSet = false;
        var latlng = getLatLng($("#end_textfield").val(), setEndLatLng);
        $("#generate_hyperlapse_button").attr("disabled", "disabled");                
        recognition = init_recognition();
        recognition.start();
    });

    var init_recognition = function() {
        var recognition = new webkitSpeechRecognition();
        recognition.continuous = true;        
        recognition.lang = 'en';
        recognition.onresult = function (event) {
            for (i = 0; i < event.results.length; i++) {
                console.log(event.results[i][0].transcript);
                if (event.results[i][0].transcript.toUpperCase() == "start".toUpperCase()) {
                    $("#route_feedback").hide();
                    recognition.stop();
                    $("#start_textfield").focus();
                    $("#start").css("background-color", "#87CEFA");  
                    $("#start_textfield_label").html("LISTENING: Say a start address or landmark:");
                    var start_recognition = start_location_recognition();
                    start_recognition.start();
                    break;
                } else if (event.results[i][0].transcript.toUpperCase() == "destination".toUpperCase()) {
                    $("#route_feedback").hide();                    
                    recognition.stop();
                    $("#end_textfield").focus();
                    $("#end").css("background-color", "#87CEFA");  
                    $("#end_textfield_label").html("LISTENING: Say an end address or landmark:");
                    var end_recognition = end_location_recognition();
                    end_recognition.start();                    
                    break;
                }  else if (event.results[i][0].transcript.toUpperCase() == "hyperlapse".toUpperCase()) {
                    if (startLocationSet && endLocationSet) {
                        localStorage.setItem('startLatLng', startLatLng.lat() + "," + startLatLng.lng());
                        localStorage.setItem('endLatLng', endLatLng.lat() + "," + endLatLng.lng());
                        document.location.href = "leapsv.html";                      
                    }
                } 
            }            
        }
        return recognition;
    }

    $("#generate_hyperlapse_button").click(function(e) {
        e.preventDefault();
        if (!startLatLng || !endLatLng) {
            if (!startLatLng) {
                $("#route_feedback_label").html("You did not enter a start location. Say 'START' to enter a start location.");
            }
            if (!end) {
                $("#route_feedback_label").html("You did not enter a destination. Say 'DESTINATION' to enter a destination.");
            }            
            $("#route_feedback").show();
            var recognition = init_recognition();
            recognition.start();
            return;
        }

        localStorage.setItem('startLatLng', startLatLng.lat() + "," + startLatLng.lng());
                                console.log( startLatLng.lat() + "," + startLatLng.lng())
        localStorage.setItem('endLatLng', endLatLng.lat() + "," + endLatLng.lng());
        document.location.href = "leapsv.html";        

    });

    var recognition = init_recognition();
    recognition.start();

});