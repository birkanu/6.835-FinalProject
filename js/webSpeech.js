startLatLng = null;
endLatLng = null;
startLocationSet = false;
endLocationSet = false;
routeSet = false;

$(document).ready(function() {
    //$("#end").hide();
    $("#feedback").hide();
    //$("#generate_hyperlapse_button_div").hide();
    var interimResult = '';
    var divID = 'start';
    var textField = $("#start_textfield");
    var textFieldID = "start_textfield";

    var curState = "listen";

    var init_recognition = function() {
        var recognition = new webkitSpeechRecognition();
        recognition.continuous = false;        
        recognition.lang = 'en';
        recognition.onresult = function (event) {
            for (i = 0; i < event.results.length; i++) {
                if (event.results[i][0].transcript.toUpperCase() == "start".toUpperCase()) {
                    $("#start_textfield").focus();
                    $("#start_textfield_label").html("Say a start address or landmark");
                    // var start_recognition = start_location_recognition();
                    break;
                } else if (event.results[i][0].transcript.toUpperCase() == "start".toUpperCase()) {
                    $("#start_textfield").focus();
                    $("#start_textfield_label").html("Say a start address or landmark");
                    break;
                }   
            }            
        }
        return recognition;
    }

    var recognition = init_recognition();
    recognition.start();

});







































//     var init_recognition = function() {
//         var recognition = new webkitSpeechRecognition();
//         recognition.continuous = true;
//         recognition.interimResults = true;
//         recognition.lang = 'en';

//         recognition.onresult = function (event) {
//             var pos = textField.getCursorPosition() - interimResult.length;
//             textField.val(textField.val().replace(interimResult, ''));
//             interimResult = '';
//             textField.setCursorPosition(pos);
//             for (var i = event.resultIndex; i < event.results.length; ++i) {
//                 if (event.results[i].isFinal) {
//                     recognition.stop();
//                     insertAtCaret(textFieldID, event.results[i][0].transcript);
//                     var latlng = getLatLng(event.results[i][0].transcript, setLatLng);
//                 } else {
//                     isFinished = false;
//                     if (interimResult == '') {
//                         if (event.results[i][0].transcript.toUpperCase() == "start".toUpperCase()) {
//                             $("#start_textfield").focus();
//                             $("#start_textfield_label").html("Say a start address or landmark");
//                             break;
//                         }    
//                     }
//                     console.log(event.results[i][0].transcript);
//                     insertAtCaret(textFieldID, event.results[i][0].transcript + '\u200B');
//                     interimResult += event.results[i][0].transcript + '\u200B';
//                 }
//             }
//         };
//         return recognition;
//     };

//     //$("#feedback").text("Say an address or landmark you would like to start at.");
//     //$("#feedback").show();
//     var recognition = init_recognition();
//     recognition.start();
    
//     var setLatLng = function(loc) {
//         // If invalid location, prompt user to reenter
//         if (loc == null) {
//             $("#"+divID).css("background-color", "red");
//             textField.val("");
//             $("#feedback").text("Couldn't find location. Say a different location.");
//             $("#feedback").show();
//             recognition = init_recognition();
//             recognition.start();
//             return;
//         }

//         // Set start or end latlng
//         if (textFieldID == "start_textfield") {
//             startLatLng = loc;
//             startLocationSet = true;
//             $("#start").css("background-color", "green");
//             $("#end").show();
//             divID = 'end';
//             textField = $("#end_textfield");
//             textFieldID = "end_textfield";
//             textField.focus();
//             $("#feedback").text("Say an address or landmark you would like to end at.");
//             $("#feedback").show();            
//             recognition = init_recognition();
//             recognition.start();
//             return;            
//         } else if(textFieldID == "end_textfield") {
//             endLatLng = loc;
//             endLocationSet = true;
//             $("#end").css("background-color", "green");            
//             $("#feedback").text("Good job! Make any last minute changes, then click the 'Generate Hyperlapse' button");
//             $("#feedback").show();            
//             $("#generate_hyperlapse_button_div").show();            
//         }
//     };
// });