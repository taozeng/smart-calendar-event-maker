function getHistory(){
  var allKeys={};
  chrome.storage.local.get('location', function (result) {
    //allKeys = Object.keys(result);
    
    //window.alert("get:"+result.location);
    var locationArray = result.location.split("#");
    return locationArray;
    
  });
  /*chrome.storage.sync.get(null, function (result) {
    allKeys = Object.keys(result);
    
    window.alert("get:"+allKeys[]);
    //return result.location;
    
  });*/
  
}

function saveHistory(theName, theUrl) {
  var theScore = 1;
  chrome.storage.local.get('location', function (result) {
    var location = result.location;
    if(location!==undefined){
      var tempArray =location.split("$");
      location = tempArray[0];
      var score = tempArray[1];
  
      if(location.indexOf(theName) == -1){
        theName = location+"#"+theName;
        theScore = score + "#"+theScore;
      }else{
        
        var locationArray = location.split("#");
        
        var num = locationArray.indexOf(theName);
        var scoreArray = score.split("#");
        scoreArray[num] = parseInt(scoreArray[num])+1;
        theScore =scoreArray[0];
        for(var i = 1; i<scoreArray.length; i++){
          theScore = theScore +"#"+ scoreArray[i];
        }
        theName = location;
      }
    }
    //window.alert("save:"+theName);
    chrome.storage.local.set({'location':theName+"$"+theScore});
      
    
    // Save it using the Chrome extension storage API.
    
    window.open(theUrl);
    window.close();
  });
  
}