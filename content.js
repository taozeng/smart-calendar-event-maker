//get the email date and title

var additionalInfo = {};

function getAdditionalInfo() {
  if (document.URL.indexOf("mail.google.com") > -1) {
    additionalInfo.title = document.title;
    // Oct 2, 2018, 7:00 AM
    let dateString = document.getElementsByClassName('g3')[0].title;
    let strs = dateString.split(",");
    additionalInfo.date = strs[0] + ", " + strs[1];
  }
  else if (document.URL.indexOf("outlook.live.com") > -1) {
    let main = document.querySelector('[role="main"]');
    if (main != null)  {
      additionalInfo.title = main.querySelector('[role="heading"]').title;
      let buttons = main.querySelectorAll('[role="button"]');
      if (buttons.length == 4) {
        // Fri 11/02/2018, 8:10 PM
        let dateString = buttons[1].nextElementSibling.innerText;
        additionalInfo.date = dateString.split(",")[0];
      }
    }
  }
  else if (document.URL.indexOf("mail.yahoo.com") > -1) {
    additionalInfo.title = document.querySelector('[data-test-id="message-group-subject-text"]').innerText;
    // Nov 2 at 6:11 AM
    let dateString = document.querySelector('[data-test-id="message-date"] > span').innerText;
    additionalInfo.date = dateString.split("at")[0] + ", " + new Date().getFullYear();
  }
  return additionalInfo;
}

chrome.runtime.sendMessage(getAdditionalInfo());