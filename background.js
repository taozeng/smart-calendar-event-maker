var maildate = new Date();
var mailtitle = "";
var details = {};
var mailtext = "";
var use_date_uk = false;

// A generic onclick callback function.
function onClickHandler(info, tab) {

  maildate = new Date();
  mailtitle = document.title;

  chrome.tabs.executeScript({ file: "content.js" });

  // This will get called by the content script we execute in
  // the tab as a result of the user pressing the browser action.
  chrome.runtime.onMessage.addListener(function (info) {
    if (info.date != undefined) {
      maildate = new Date(info.date);
    }
    if (info.title != undefined) {
      mailtitle = (info.title.length > 150) ? info.title.substring(0, 150) : info.title;
    }
    if (info.date_uk != undefined) {
      use_date_uk = info.date_uk;
    }
  });

  //mailtext = info.selectionText;

  chrome.tabs.executeScript({
    code: "window.getSelection().toString();"
  }, function (selection) {
    // selected contains text including line breaks
    mailtext = selection[0];
    if (mailtext === "") {
      mailtext = info.selectionText;
    }
  });

  //call extractor function
  details = {};
  details.url = info.linkUrl;

  details.editable = info.editable;
  details.id = info.menuItemId;
  details.pageUrl = info.pageUrl;

  // chrome.alarms.create({ delayInMinutes: 0.01 });
  //CreateTab(details);
  setTimeout(function () {
    CreateTab(details);
  }, 200);
}



function CreateTab() {
  //Set the information of the form
  details.title = mailtitle;

  //details.maildate = maildate;
  var locationArray = [];
  var scroeArray = [];
  details.location = [];

  var tempMailtext = mailtext.replace(/\n/g, " pppppp ");
  tempMailtext = tempMailtext.replace(/\s+/g, " ");
  tempMailtext = tempMailtext.replace(/：/g, ":");

  var i = 0;
  details.location[0] = "";
  var addressResult = getAddress(mailtext);
  if (addressResult != undefined) {
    for (; i < addressResult.length; i++)
      details.location[i] = addressResult[i];
  }

  //window.alert(tempMailtext);      
  var locationResult = getVenue(tempMailtext, locationArray, scroeArray);
  var whitespace = /\s+/;
  for (var j = 0; j < locationResult.length && i < 6; j++) {
    if (whitespace.test(locationResult[j].venue))
      details.location[i++] = locationResult[j].venue;
  }

  if (Object.prototype.toString.call(maildate) === "[object Date]") {
    // it is a date
    if (isNaN(maildate.getTime())) {  // d.valueOf() could also work
      // date is not valid
      maildate = new Date();
    }
  }
  else {
    // not a date
    maildate = new Date();
  }

  var result = getDate(tempMailtext, maildate, use_date_uk);
  //details.text = result[0]+" "+result[1]+" score "+result[2]+" "+result[3];
  var tempMonth, tempDate;
  tempMonth = result[0].getMonth() + 1;
  tempDate = result[0].getDate();
  if (tempMonth.toString().length < 2) {
    tempMonth = "0" + tempMonth;
  }
  if (tempDate.toString().length < 2) {
    tempDate = "0" + tempDate;
  }
  //window.alert(tempMonth);
  var startdate = result[0].getFullYear() + "-" + tempMonth + "-" + tempDate;

  tempMonth = result[1].getMonth() + 1;
  tempDate = result[1].getDate();
  if (tempMonth.toString().length < 2) {
    tempMonth = "0" + tempMonth;
  }
  if (tempDate.toString().length < 2) {
    tempDate = "0" + tempDate;
  }

  var enddate = result[1].getFullYear() + "-" + tempMonth + "-" + tempDate;



  details.text = mailtext;//.replace(/\s+/g, " ");
  details.startdate = startdate;
  details.enddate = enddate;
  details.startTime = result[2];
  details.endTime = result[3];

  chrome.tabs.create({ url: chrome.extension.getURL('popup.html'), active: false }, function (tab) {
    // After the tab has been created, open a window to inject the tab
    chrome.windows.create(
      {
        tabId: tab.id,
        height: 570, width: 525,
        type: 'popup',
        focused: true
        // incognito, top, left, ...
      }, function () {
        chrome.runtime.sendMessage({ details: details }, function (response) { });
      });
  });
}

// chrome.alarms.onAlarm.addListener(function (alarm) {
//   CreateTab();
// });






chrome.contextMenus.onClicked.addListener(onClickHandler);

chrome.runtime.onInstalled.addListener(function () {
  // //   // Intentionally create an invalid item, to show off error checking in the
  // //   // create callback.
  // //   console.log("About to try creating an invalid item - an error about " +
  // //       "duplicate item AddButton should show up");
  //   chrome.storage.local.set({'location':""}, function(){
  //       chrome.storage.local.set({'score':""});
  //   });
  //   console.log("History reseted");
  chrome.contextMenus.create({
    "title": "Create new event",
    "contexts": ["selection"],
    "id": "AddButton"
  },
    function () {
      if (chrome.extension.lastError) {
        console.log("Got expected error: " + chrome.extension.lastError.message);
      }
    });

  chrome.storage.sync.get({
    date_uk: false
  }, function (items) {
    use_date_uk = items.date_uk;
  })
});



