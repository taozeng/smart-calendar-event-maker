
function clearHistory() {
  
  chrome.storage.local.clear();
  var oSelField = document.getElementById("selectField");
  var i;
  for(i=oSelField.options.length-1;i>=0;i--){
    oSelField.remove(i);
  }
  document.getElementById("message").innerHTML = "History Cleared";
}

function addToSelect() {
  var location;
  
  chrome.storage.local.get('location', function (result) {
    //allKeys = Object.keys(result);
    location =  result.location;
    //document.getElementById("message").innerHTML = location;
    var oSelField = document.getElementById("selectField");
	  var oOption = document.createElement("OPTION");
    
    if(location === undefined){
      location="None";
      oOption.text = location;
	    oOption.value = location;
	    oSelField.options.add(oOption);
    }else{
      var tempArray = location.split("$");
      var locationArray = tempArray[0].split("#");
      
      for(var i=0;i<locationArray.length;i++){
        //window.alert(locationArray[i]);
        var tempOption = document.createElement("OPTION");
  	    tempOption.text = locationArray[i];
  	    tempOption.value = locationArray[i];
  	    oSelField.options.add(tempOption);
      }
    }
	  
  });
  
}
window.addEventListener('click',function(e){
  if(e.target.href!==undefined){
    chrome.tabs.create({url:e.target.href});
  }
});

// When the popup HTML has loaded
window.addEventListener('load', function(evt) {
    addToSelect();
    
    // Handle the event form submit event with our addEvent function
    document.getElementById("clear").addEventListener("click", clearHistory);
    // Cache a reference to the status display SPAN
    statusDisplay = document.getElementById('status-display');


});

