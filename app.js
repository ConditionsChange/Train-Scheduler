// Initialize Firebase
var config = {
  apiKey: "AIzaSyB0i1uPJFeqzksEZ4PjV5f1SCekv1Nm-fg",
  authDomain: "train-scheduler-f30a4.firebaseapp.com",
  databaseURL: "https://train-scheduler-f30a4.firebaseio.com",
  projectId: "train-scheduler-f30a4",
  storageBucket: "train-scheduler-f30a4.appspot.com",
  messagingSenderId: "878761115047"
};
firebase.initializeApp(config);

var database = firebase.database();

//initial values
  var trainName = "";
  var destination = "";
  var firstTrain = "";
  var frequency = "";

//on form submission
$("#submit").on("click",function(){

  //get form inputs
  trainName = $("#train-name").val().trim();
  destination = $("#destination").val().trim();
  firstTrain = $("#first-train").val().trim();
  frequency = $("#frequency").val().trim();

  //clear form inputs
  $("#train-name").val("");
  $("#destination").val("");
  $("#first-train").val("");
  $("#frequency").val("");

  //format first train depart time and current time into moment objects
  var currentTime = moment().format("HH:mm");
  fisrtTrain = moment().format("HH:mm");
  currentTime  = moment(currentTime,"HH:mm");
  firstTrain = moment(firstTrain,"HH:mm");

  //calculate next arrival and minutes away
  var minsDiff = currentTime.diff(firstTrain,"minutes") ; 
  var minsAway = parseInt(frequency) - (parseInt(minsDiff) % parseInt(frequency));
  var nextArrival = moment(currentTime).add(minsAway, "minutes").format("HH:mm");


  //push child to firebase only if form data was inputted in the correct format
  if (isNaN(minsAway)===false && trainName !== "" && destination !== ""){
      database.ref().push({
            TrainName: trainName,
            Destination: destination,
            Frequency: parseInt(frequency),
            NextArrival: nextArrival,
            MinutesAway: minsAway
      });
  };

}); //end submit button


//child add listener which adds new trains into the table
database.ref().on("child_added", function(snapshot) {
  console.log(snapshot.val())  //print what's currently in the firebase
  $("tbody").append("<tr><td>" + snapshot.val().TrainName + "</td><td>" + snapshot.val().Destination + "</td><td>" + snapshot.val().Frequency + "</td><td>" + snapshot.val().NextArrival + "</td><td>" + snapshot.val().MinutesAway + "</td></tr>"); //append train date to table
})