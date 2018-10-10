//get the email date and title

var additionalInfo = {
  "title": "None",
  "date": "None"
};

function getAdditionalInfo(){
 
  additionalInfo.date= "None";
  additionalInfo.title="None";
  if(document.URL.indexOf("mail.google.com") > -1){
    
    //var 
    var dateString = document.getElementsByClassName('g3')[0].title;
    dateString = dateString.substring(5, 17);
    dateString = dateString.replace(",","");
    additionalInfo.date = dateString;
    additionalInfo.title = document.title;
  }
  else if(document.URL.indexOf("mail.live.com") > -1){
    additionalInfo.date = document.getElementsByClassName('Date TextSizeSmall')[0].innerHTML;
    additionalInfo.date = additionalInfo.date.trim();
    
    //window.alert(additionalInfo.date);
    if(additionalInfo.date.length <8){
      
      var temp = new Date();
      tempMonth = temp.getMonth()+1;
      tempDate = temp.getDate();
      if (tempMonth.toString().length<2){
        tempMonth="0"+tempMonth;
      }
      if (tempDate.toString().length<2){
        tempDate="0"+tempDate;
      }
      additionalInfo.date = tempDate+"/"+tempMonth+"/"+temp.getFullYear();
    }
    
    additionalInfo.title = document.getElementsByClassName('rmSubject')[0].innerHTML;
    additionalInfo.title = additionalInfo.title.trim();
    var i =  additionalInfo.title.length - 35;
    if(i>34){
      additionalInfo.title = additionalInfo.title.substring(34, i);
    }
  }
  else if(document.URL.indexOf("mail.yahoo.com") > -1){
     
    var j = document.getElementsByClassName('short').length;
    
    additionalInfo.date = document.getElementsByClassName('short')[j-1].title;
    //window.alert(additionalInfo.date);
    j = document.getElementsByClassName('thread-subject').length;
    additionalInfo.title = document.getElementsByClassName('thread-subject')[j-1].title;
  }
   
  return additionalInfo;
}


chrome.runtime.sendMessage(getAdditionalInfo());