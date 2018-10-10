// Global reference to the status display SPAN
var statusDisplay = null;
chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
    if (req.details) {
        var details = req.details;
        if(details.title !== null)
          document.getElementById('title').value = details.title;
        if (details.text.length > 900)
          details.text = details.text.substring(0, 900) + ".......";
      details.text = details.text + "\n\n"+"Imported from: "+details.pageUrl;
        document.getElementById('message').value = details.text;
        document.getElementById('startDate').value = details.startdate;
        document.getElementById('endDate').value = details.enddate;
        document.getElementById('startTime').value = details.startTime;
        document.getElementById('endTime').value = details.endTime;
        
        document.getElementById('location').value = details.location_0;
        var selectBoxOptions = details.location_0 + ";" +details.location_1 + ";"+details.location_2;
        document.getElementById('location').setAttribute("selectBoxOptions", selectBoxOptions);
        
        createEditableSelect(document.forms[0].location);
    }

});

function addEvent() {
  
    var timezone = 800;
    var timeformat = "0000";
    var title = document.getElementById('title').value;
    var message = document.getElementById('message').value;
    var location = document.getElementById('location').value;
    var startTime = document.getElementById('startTime').value.replace(/:/g, "");
    var endTime = document.getElementById('endTime').value.replace(/:/g, "");
    var startDate = document.getElementById('startDate').value.replace(/-/g, "");
    var endDate = document.getElementById('endDate').value.replace(/-/g, "");

    var now = new Date();
    var date = now.getDate();
    var month = now.getMonth();
    date = date+2;
    month = month+1;
    if(date<10){
      date= "0"+date;
    }
    if(month<10){
      month= "0"+month;
    }
  
    //Error Handling
    var nowText = now.getFullYear()+""+month+""+date;
    if(startTime === "" && endTime === ""){
      startTime = "0800";
      endTime = "0800";
    }else if(startTime === ""){
      startTime = endTime;
    }else if(endTime === ""){
      endTime = startTime;
    }
    
    else if(startDate === "" && endDate === ""){
      startDate = nowText;
      endDate = nowText;
    }else if(startDate === ""){
      startDate = endDate;
    }else if(endDate === ""){
      endDate = startDate;
    }
    
    //Time convert
    if(parseInt(startTime)>=800){
      startTime = parseInt(startTime) -timezone;
    }else{
      startTime = parseInt(startTime) +2*timezone;
      startDate = parseInt(startDate) -1;
    }
    if(parseInt(endTime)>=800){
      endTime = parseInt(endTime) -timezone;
    }else{
      endTime = parseInt(endTime) +2*timezone;
      endDate = parseInt(endDate) -1;
    }
  
    startTime= startTime.toString();
    startTime = timeformat.substring(0, timeformat.length - startTime.length) + startTime;

    endTime= endTime.toString();
    endTime = timeformat.substring(0, timeformat.length - endTime.length) + endTime;

    //Date + time to render string
    var start = startDate+"T"+startTime+"00";
    var end = endDate+"T"+endTime+"00";

    //message symbol convert
    message = message.replace(/&/g, "%26");
    title = title.replace(/&/g, "%26");
    location = location.replace(/&/g, "%26");
    
    
    var url = "http://www.google.com/calendar/event?action=TEMPLATE&text=" + title + "&location=" + location + "&dates=" + start + "Z/" + end + "Z&trp=true&details=" + message;
    
    //url = url.replace(/&/g, "%26");
    url = url.replace(/#/g, "%23");
    url = url.replace(/\n/g,"%0A");
    url = url.replace(/\s+/g, " ");
    url = url.replace(/\u2019/g, "%E2%80%99");
    url = url.replace(/\u2013/g, "%E2%80%93");
    
    //statusDisplay.innerHTML = url;
    //add to history
    if(location !== ""){
      saveHistory(location, url);
    }else{
      window.open(url);
      window.close();
    }
    //window.alert(321);
    //window.open(url);
    //window.close();
}


// When the popup HTML has loaded
window.addEventListener('load', function(evt) {

    // Handle the event form submit event with our addEvent function
    document.getElementById('addevent').addEventListener('submit', addEvent);
    // Cache a reference to the status display SPAN
    statusDisplay = document.getElementById('status-display');


});