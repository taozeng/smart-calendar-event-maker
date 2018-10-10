var fullMonth = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
var shortMonth = ["jan","feb","mar","apr", "may", "jun", "jul", "aug","sep","oct","nov","dec"];
var fullWeekday = ["sunday","monday", "tuesday", "wednesday","thursday","friday","saturday"];
var shortWeekday = ["sun","mon", "tue", "wed","thu","fri","sat"];
var holiday = [["silent night", "12/24"],["new year ' s day","1/1"],["valentine ' s day","2/14"],["patrick ' s day","3/17"],["april fools day","4/1"],["canada day","7/1"],["independence day","7/4"],["national day","10/1"],["halloween","10/31"],["veterans day","11/11"],["remembrance day","11/11"],["christmas eve","12/24"],["christmas", "12/25"],["boxing day","12/26"],["new year ' s eve","12/31"]]; //support multiple word
var relativeKeyword = ["this", "next", "last", "coming"];  // support one word only now
var otherKeyword = ["tomorrow", "today"]; //support one word only
//changed
var timeKeyword=[["morning",6],["afternoon",12], ["evening",18], ["night",18], ["noon", 12]];
//changed
var ampmWord = ["am", "a+.+m+.", "a+.+m","pm","p+.+m+.","p+.+m"];
//multiple word should have a space between words. Size should match between ScoredKeyWord and scoreOfWord.
// 2 variable (keyword, number of words to check in front of keyword)

//changed
var scoredKeyword = [["date :",10] , ["date",3],["on",3]];  
//changed
var scoreOfWord = [40,10,1]; //the score for each keyword when match
//changed
var scoredTimeKeyword = [["time :",7] , ["time",3], ["during",3]];  
//changed
var scoreOfTimeWord = [40,10,1]; //the score for each keyword when match


var taggedWords;
var today;
var emailDate;
var startDate;
var endDate;
//changed
var startTime;
//changed
var endTime;
//dateArr will store the object of MyDate class
var dateArr;
//changed
var timeArr;
var POSresult = " ";

//changed
function MyTime(inputHour1,inputMinute1, startPos , endPos , timeScore, format){
  this.startHour = inputHour1;
  this.startMinute = inputMinute1;
  this.endHour = null;
  this.endMinute = null;
  this.startIndex = startPos;
  this.endIndex = endPos;
  this.score = timeScore;
  this.timeFormat = format;
}

//changed
// MyDate class
function MyDate(inputDate_temp, startPosition, endPosition ,score_temp) {
    this.date = inputDate_temp;
    this.date2 = null;
    this.startIndex = startPosition;
    this.endIndex = endPosition;
    this.score = score_temp;
    this.dateFormat = 1;
}

//changed
//constructor
function DateExtractor(inputTaggedWords, mailDate){
	//taggedWords is the output of POS(e.g taggedWords[0][0] is the first word, taggedWords[0][1] is the POS of first word)
	taggedWords = inputTaggedWords;
	//alert(taggedWords);
	// initial default current date
	// will be changed to the date of email later
	today = new Date();
	emailDate = mailDate;
	startDate = mailDate; 
	endDate = mailDate;
	dateArr = [];
	timeArr= [];
}

//changed
DateExtractor.prototype.extractDate = function(){	
	//different date format have different score
	extractDifferentFormat();
	//alert(printResult());
	extractDateRange();
	//alert(printResult());
	extractTimeRange();
	//alert(printTime());
	/*
	Rule number1: If "Date:" exist before the date within 15 words, add 30 for it
	Rule number2: If "Date" exist before the date within 5 words, add 10 for it
	Rule number3: If "From" exist before the date within 5 words, add 15 for it
	Rule number4: If "to" exist before the date within 5 words, add 15 for it
	Rule number5: If "on" exist before the date within 5 words, add 5 for it
	*/
	dateScoring();
		//alert(printTime());
	timeScoring();
		//alert(printTime());
	sortByDate();
	//alert(printResult());
	// if duplicated, add 5 mark each
	removeDuplicateDate();
	sortByDateIndex();
	sortByScore();
  //alert(printResult());
	sortTimeByScore();
	//alert(printResult());

	dateDecision();
	timeDecision();
  //alert (startDate.toDateString() + " " + endDate.toDateString() +  "   " + startTime + "  " +endTime);
	//alert("Start Date: " + startDate.toDateString() +"\n"+"End Date: " + endDate.toDateString());
	var start_endDateTime={};

	start_endDateTime[0]=startDate;
	start_endDateTime[1]=endDate;
  start_endDateTime[2]=startTime;
  start_endDateTime[3]=endTime;
	return start_endDateTime;
};

//changed
function extractDifferentFormat(){
	for(var i=0; i<taggedWords.length;i++){	
		// extract different kind of date format and push it to an array
		//11/22/1992
		if (dateExtract("MM+/+DD+/+YYYY",i)){
			if (isValidDate(taggedWords[i+2][0]+"/"+ taggedWords[i][0] + "/" + taggedWords[i+4][0])){
				dateArr.push(new MyDate(new Date( taggedWords[i+4][0],taggedWords[i][0]-1, taggedWords[i+2][0]),i,i+4,20));
				i=i+4;
				continue;
			}
		}
		//11-22-1992
		if (dateExtract("MM+-+DD+-+YYYY",i)){
			if (isValidDate(taggedWords[i+2][0]+"/"+ taggedWords[i][0] + "/" + taggedWords[i+4][0])){
				dateArr.push(new MyDate(new Date( taggedWords[i+4][0],taggedWords[i][0]-1, taggedWords[i+2][0]),i,i+4,20));
				
				i=i+4;
				continue;
			}
		}
		//11.22.1992
		if (dateExtract("MM+.+DD+.+YYYY",i)){
			if (isValidDate(taggedWords[i+2][0]+"/"+ taggedWords[i][0] + "/" + taggedWords[i+4][0])){
				dateArr.push(new MyDate(new Date( taggedWords[i+4][0],taggedWords[i][0]-1, taggedWords[i+2][0]),i,i+4,20));
				i=i+4;
				continue;
			}
		}
		
		//22/11/1992
		if (dateExtract("DD+/+MM+/+YYYY",i)){
			if (isValidDate(taggedWords[i][0]+"/"+ taggedWords[i+2][0] + "/" + taggedWords[i+4][0])){
				dateArr.push( new MyDate (new Date (taggedWords[i+4][0],taggedWords[i+2][0]-1, taggedWords[i][0]),i, i+4,20));
				i=i+4;
				continue;
			}
		}	
		
		//22-11-1992
		if (dateExtract("DD+-+MM+-+YYYY",i)){
			if (isValidDate(taggedWords[i][0]+"/"+ taggedWords[i+2][0] + "/" + taggedWords[i+4][0])){
				dateArr.push( new MyDate (new Date( taggedWords[i+4][0],taggedWords[i+2][0]-1, taggedWords[i][0]),i,i+4,20));
				i=i+4;
				continue;
			}
		}
		//22.11.1992
		if (dateExtract("DD+.+MM+.+YYYY",i)){
			if (isValidDate(taggedWords[i][0]+"/"+ taggedWords[i+2][0] + "/" + taggedWords[i+4][0])){
				dateArr.push(new MyDate(new Date( taggedWords[i+4][0],taggedWords[i+2][0]-1, taggedWords[i][0]),i,i+4,20));
				i=i+4;
				continue;
			}
		}

		//1992/11/22
		if (dateExtract("YYYY+/+MM+/+DD",i)){
			if (isValidDate(taggedWords[i+4][0]+"/"+ taggedWords[i+2][0] + "/" + taggedWords[i][0])){
				dateArr.push(new MyDate(new Date( taggedWords[i][0],taggedWords[i+2][0]-1, taggedWords[i+4][0]),i,i+4,20));
				i=i+4;
				continue;
			}
		}
		//1992-11-22
		if (dateExtract("YYYY+-+MM+-+DD",i)){
			if (isValidDate(taggedWords[i+4][0]+"/"+ taggedWords[i+2][0] + "/" + taggedWords[i][0])){
				dateArr.push(new MyDate(new Date( taggedWords[i][0],taggedWords[i+2][0]-1, taggedWords[i+4][0]),i,i+4,20));
				i=i+4;
				continue;
			}
		}
		//1992-11-22
		if (dateExtract("YYYY+.+MM+.+DD",i)){
			if (isValidDate(taggedWords[i+4][0]+"/"+ taggedWords[i+2][0] + "/" + taggedWords[i][0])){
				dateArr.push(new MyDate(new Date( taggedWords[i][0],taggedWords[i+2][0]-1, taggedWords[i+4][0]),i,i+4,20));
				i=i+4;
				continue;
			}
		}
		
		//11/22
		if (dateExtract("MM+/+DD",i)){
			if (isValidDate(taggedWords[i+2][0]+"/"+ taggedWords[i][0] + "/" + emailDate.getFullYear())){
				dateArr.push(new MyDate(new Date( emailDate.getFullYear(),taggedWords[i][0]-1, taggedWords[i+2][0]),i,i+2,20));
				i=i+2;
				continue;
			}
		}
		//22/11
		if (dateExtract("DD+/+MM",i)){
			if (isValidDate(taggedWords[i][0]+"/"+ taggedWords[i+2][0] + "/" + emailDate.getFullYear())){
				dateArr.push(new MyDate(new Date( emailDate.getFullYear(),taggedWords[i+2][0]-1, taggedWords[i][0]),i,i+2,20));
				i=i+2;
				continue;
			}
		}

		//22nd November,1992
		if (dateExtract("DD+pp+MMM+,+YYYY",i)){
			var tempMonth = fullMonth.indexOf(taggedWords[i+2][0].toLowerCase()) + 1;
			if (isValidDate(taggedWords[i][0]+"/"+ tempMonth + "/" + taggedWords[i+4][0])){
				dateArr.push(new MyDate(new Date( taggedWords[i+4][0],tempMonth-1, taggedWords[i][0]),i,i+4,20));
				i=i+4;
				continue;
			}
			
		}
		//22 November,1992
		if (dateExtract("DD+MMM+,+YYYY",i)){
			var tempMonth = fullMonth.indexOf(taggedWords[i+1][0].toLowerCase()) + 1;
			if (isValidDate(taggedWords[i][0]+"/"+ tempMonth + "/" + taggedWords[i+3][0])){
				dateArr.push(new MyDate(new Date( taggedWords[i+3][0],tempMonth-1, taggedWords[i][0]),i,i+3,20));
				dateArr[dateArr.length-1].dateFormat = 2;
				i=i+3;
				continue;
			}
			
		}
		//22 Nov,1992
		if (dateExtract("DD+mmm+,+YYYY",i)){
			var tempMonth = shortMonth.indexOf(taggedWords[i+1][0].toLowerCase()) + 1;
			if (isValidDate(taggedWords[i][0]+"/"+ tempMonth + "/" + taggedWords[i+3][0])){
				dateArr.push(new MyDate(new Date( taggedWords[i+3][0],tempMonth-1, taggedWords[i][0]),i,i+3,20));
				dateArr[dateArr.length-1].dateFormat = 2;
				i=i+3;
				continue;
			}			
		}
		//22nd Nov,1992
		if (dateExtract("DD+pp+mmm+,+YYYY",i)){
			var tempMonth = shortMonth.indexOf(taggedWords[i+2][0].toLowerCase()) + 1;
			if (isValidDate(taggedWords[i][0]+"/"+ tempMonth + "/" + taggedWords[i+4][0])){
				dateArr.push(new MyDate(new Date( taggedWords[i+4][0],tempMonth-1, taggedWords[i][0]),i,i+4,20));
				i=i+4;
				continue;
			}
			
		}		
		
		//22 November 1992
		if (dateExtract("DD+MMM+YYYY",i)){
			var tempMonth = fullMonth.indexOf(taggedWords[i+1][0].toLowerCase()) + 1;
			if (isValidDate(taggedWords[i][0]+"/"+ tempMonth + "/" + taggedWords[i+2][0])){
				dateArr.push(new MyDate(new Date( taggedWords[i+2][0],tempMonth-1, taggedWords[i][0]),i,i+2,20));
				dateArr[dateArr.length-1].dateFormat = 2;
				i=i+2;
				continue;
			}
			
		}
		//22nd November 1992
		if (dateExtract("DD+pp+MMM+YYYY",i)){
			var tempMonth = fullMonth.indexOf(taggedWords[i+2][0].toLowerCase()) + 1;
			if (isValidDate(taggedWords[i][0]+"/"+ tempMonth + "/" + taggedWords[i+3][0])){
				dateArr.push(new MyDate(new Date( taggedWords[i+3][0],tempMonth-1, taggedWords[i][0]),i,i+3,20));
				i=i+3;
				continue;
			}
		}
		//22 Nov 1992
		if (dateExtract("DD+mmm+YYYY",i)){
			var tempMonth = shortMonth.indexOf(taggedWords[i+1][0].toLowerCase()) + 1;
			if (isValidDate(taggedWords[i][0]+"/"+ tempMonth + "/" + taggedWords[i+2][0])){
				dateArr.push(new MyDate(new Date( taggedWords[i+2][0],tempMonth-1, taggedWords[i][0]),i,i+2,20));
			  dateArr[dateArr.length-1].dateFormat = 2;
				i=i+2;
				continue;
			}
		}
		//22nd Nov 1992
		if (dateExtract("DD+pp+mmm+YYYY",i)){
			var tempMonth = shortMonth.indexOf(taggedWords[i+2][0].toLowerCase()) + 1;
			if (isValidDate(taggedWords[i][0]+"/"+ tempMonth + "/" + taggedWords[i+3][0])){
				dateArr.push(new MyDate(new Date( taggedWords[i+3][0],tempMonth-1, taggedWords[i][0]),i,i+3,20));
				i=i+3;
				continue;
			}
		}
		
		//November 22, 1992
		if (dateExtract("MMM+DD+,+YYYY",i)){
			var tempMonth = fullMonth.indexOf(taggedWords[i][0].toLowerCase()) + 1;
			if (isValidDate(taggedWords[i+1][0]+"/"+ tempMonth + "/" + taggedWords[i+3][0])){
				dateArr.push(new MyDate(new Date( taggedWords[i+3][0] ,tempMonth-1, taggedWords[i+1][0]),i,i+3,20));
				i=i+3;
				continue;
			}
		}
		//Nov 22, 1992
		if (dateExtract("mmm+DD+,+YYYY",i)){
			var tempMonth = shortMonth.indexOf(taggedWords[i][0].toLowerCase()) + 1;
			if (isValidDate(taggedWords[i+1][0]+"/"+ tempMonth + "/" + taggedWords[i+3][0])){
				dateArr.push(new MyDate(new Date( taggedWords[i+3][0] ,tempMonth-1, taggedWords[i+1][0]),i,i+3,20));
				i=i+3;
				continue;
			}
		}
		//22 November
		if (dateExtract("DD+MMM",i)){
			var tempMonth = fullMonth.indexOf(taggedWords[i+1][0].toLowerCase()) + 1;
			if (isValidDate(taggedWords[i][0]+"/"+ tempMonth + "/" + emailDate.getFullYear())){
				dateArr.push(new MyDate(new Date( emailDate.getFullYear() ,tempMonth-1, taggedWords[i][0]),i,i+1,20));
				dateArr[dateArr.length-1].dateFormat = 2;
				i=i+1;
				continue;
			}
		}
		//22nd November
		if (dateExtract("DD+pp+MMM",i)){
			var tempMonth = fullMonth.indexOf(taggedWords[i+2][0].toLowerCase()) + 1;
			if (isValidDate(taggedWords[i][0]+"/"+ tempMonth + "/" + emailDate.getFullYear())){
				dateArr.push(new MyDate(new Date( emailDate.getFullYear() ,tempMonth-1, taggedWords[i][0]),i,i+2,20));
				i=i+2;
				continue;
			}
		}
		//22 Nov
		if (dateExtract("DD+mmm",i)){
			var tempMonth = shortMonth.indexOf(taggedWords[i+1][0].toLowerCase()) + 1;
			if (isValidDate(taggedWords[i][0]+"/"+ tempMonth + "/" + emailDate.getFullYear())){
				dateArr.push(new MyDate(new Date( emailDate.getFullYear() ,tempMonth-1, taggedWords[i][0]),i,i+1,20));
				dateArr[dateArr.length-1].dateFormat = 2;
				i=i+1;
				continue;
			}
		}
		//22nd Nov
		if (dateExtract("DD+pp+mmm",i)){
			var tempMonth = shortMonth.indexOf(taggedWords[i+2][0].toLowerCase()) + 1;
			if (isValidDate(taggedWords[i][0]+"/"+ tempMonth + "/" + emailDate.getFullYear())){
				dateArr.push(new MyDate (new Date( emailDate.getFullYear() ,tempMonth-1, taggedWords[i][0]),i,i+2,20));
				i=i+2;
				continue;
			}
		}
		//November 22
		if (dateExtract("MMM+DD",i)){
			var tempMonth = fullMonth.indexOf(taggedWords[i][0].toLowerCase()) + 1;
			if (isValidDate(taggedWords[i+1][0]+"/"+ tempMonth + "/" + emailDate.getFullYear())){
				dateArr.push(new MyDate(new Date(emailDate.getFullYear() ,tempMonth-1, taggedWords[i+1][0]),i,i+1,20));
				dateArr[dateArr.length-1].dateFormat = 3;
				i=i+1;
				continue;
			}
		}
		
		//Nov 22
		if (dateExtract("mmm+DD",i)){
			var tempMonth = shortMonth.indexOf(taggedWords[i][0].toLowerCase()) + 1;
			if (isValidDate(taggedWords[i+1][0]+"/"+ tempMonth + "/" + emailDate.getFullYear())){
				dateArr.push(new MyDate(new Date( emailDate.getFullYear() ,tempMonth-1, taggedWords[i+1][0]),i,i+1,20));
				dateArr[dateArr.length-1].dateFormat = 3;
				i=i+1;
				continue;
			}
		}
		
		//holiday date (e.g. Christmas)
		var holidayPos = isHoliday(i);
		if (holidayPos >=0){
			var splitHolidayDate = holiday[holidayPos][1].split("/");
			if (isValidDate(splitHolidayDate[1]+"/"+ splitHolidayDate[0] + "/" + emailDate.getFullYear())){
				dateArr.push(new MyDate(new Date( emailDate.getFullYear() ,splitHolidayDate[0]-1, splitHolidayDate[1]),i,i,5));
				dateArr[dateArr.length-1].dateFormat = 4;
				i=i+1;
				continue;
			}
		}
		
		// relative keyword + Full weekday (e.g. next wednesday)
		else if (dateExtract("RW+WD",i)){
			var emailWeekDay = emailDate.getDay();
			var tempWeekDay = fullWeekday.indexOf(taggedWords[i+1][0].toLowerCase());
			if (taggedWords[i][0].toLowerCase() == "this"){			
				var newDate = new Date();
				newDate.setTime(emailDate.getTime()+ (tempWeekDay - emailWeekDay)*86400000);
				dateArr.push(new MyDate(newDate,i,i+1,15));
				dateArr[dateArr.length-1].dateFormat = 5;
			}
			else if (taggedWords[i][0].toLowerCase() == "coming"){
				if (tempWeekDay >= emailWeekDay){
					var newDate = new Date();
					newDate.setTime(emailDate.getTime()+ (tempWeekDay - emailWeekDay)*86400000);
					dateArr.push(new MyDate(newDate,i,i+1,15));
					dateArr[dateArr.length-1].dateFormat = 5;
				}
				else{
					var newDate = new Date();
					newDate.setTime(emailDate.getTime()+ (7-emailWeekDay + tempWeekDay)*86400000);
					dateArr.push(new MyDate(newDate,i,i+1,15));
					dateArr[dateArr.length-1].dateFormat = 5;
				}
			}
			else if (taggedWords[i][0].toLowerCase() == "next"){
				var newDate = new Date();
				newDate.setTime(emailDate.getTime()+ (7- emailWeekDay + tempWeekDay)*86400000);
				dateArr.push(new MyDate(newDate,i,i+1,15));
				dateArr[dateArr.length-1].dateFormat = 5;
			}
			else if (taggedWords[i][0].toLowerCase() == "last"){
				var newDate = new Date();
				newDate.setTime(emailDate.getTime() - emailWeekDay*86400000 - (7 - tempWeekDay)*86400000);
				dateArr.push(new MyDate(newDate,i,i+1,15));
				dateArr[dateArr.length-1].dateFormat = 5;
			}
			i=i+1;
		}
		
		// relative keyword + Short form weekday (e.g. next wed)
		else if (dateExtract("RW+wd",i)){
			var emailWeekDay = emailDate.getDay();
			var tempWeekDay = shortWeekday.indexOf(taggedWords[i+1][0].toLowerCase());
			if (taggedWords[i][0].toLowerCase() == "this"){			
				var newDate = new Date();
				newDate.setTime(emailDate.getTime()+ (tempWeekDay - emailWeekDay)*86400000);
				dateArr.push(new MyDate(newDate,i,i+1,15));
				dateArr[dateArr.length-1].dateFormat = 5;
			}
			else if (taggedWords[i][0].toLowerCase() == "coming"){
				if (tempWeekDay >= emailWeekDay){
					var newDate = new Date();
					newDate.setTime(emailDate.getTime()+ (tempWeekDay - emailWeekDay)*86400000);
					dateArr.push(new MyDate(newDate,i,i+1,15));
					dateArr[dateArr.length-1].dateFormat = 5;
				}
				else{
					var newDate = new Date();
					newDate.setTime(emailDate.getTime()+ (7-emailWeekDay + tempWeekDay)*86400000);
					dateArr.push(new MyDate(newDate,i,i+1,15));
					dateArr[dateArr.length-1].dateFormat = 5;
				}
			}
			else if (taggedWords[i][0].toLowerCase() == "next"){
				var newDate = new Date();
				newDate.setTime(emailDate.getTime()+ (7- emailWeekDay + tempWeekDay)*86400000);
				dateArr.push(new MyDate(newDate,i,i+1,15));
				dateArr[dateArr.length-1].dateFormat = 5;
			}
			else if (taggedWords[i][0].toLowerCase() == "last"){
				var newDate = new Date();
				newDate.setTime(emailDate.getTime() - emailWeekDay*86400000 - (7 - tempWeekDay)*86400000);
				dateArr.push(new MyDate(newDate,i,i+1,15));
				dateArr[dateArr.length-1].dateFormat = 5;
			}
			i=i+1;
		}
		
		//full form weekday (e.g.monday)
		else if (dateExtract("WD",i)){
			var tempWeekDay = fullWeekday.indexOf(taggedWords[i][0].toLowerCase());
			var emailWeekDay = emailDate.getDay();
			if (tempWeekDay >= emailWeekDay){
				var newDate = new Date();
				newDate.setTime(emailDate.getTime()+ (tempWeekDay - emailWeekDay)*86400000);
				dateArr.push(new MyDate(newDate,i,i,1));
				dateArr[dateArr.length-1].dateFormat = 5;
			}
			else{
				var newDate = new Date();
				newDate.setTime(emailDate.getTime()+ (7-emailWeekDay + tempWeekDay)*86400000);
				dateArr.push(new MyDate(newDate,i,i,1));
				dateArr[dateArr.length-1].dateFormat = 5;
			}
		}
		
		//short form weekday (e.g.mon)
		else if (dateExtract("wd",i)){
			var tempWeekDay = shortWeekday.indexOf(taggedWords[i][0].toLowerCase());
			var emailWeekDay = emailDate.getDay();
			if (tempWeekDay >= emailWeekDay){
				var newDate = new Date();
				newDate.setTime(emailDate.getTime()+ (tempWeekDay - emailWeekDay)*86400000);
				dateArr.push(new MyDate(newDate,i,i,1));
				dateArr[dateArr.length-1].dateFormat = 5;
			}
			else{
				var newDate = new Date();
				newDate.setTime(emailDate.getTime()+ (7-emailWeekDay + tempWeekDay)*86400000);
				dateArr.push(new MyDate(newDate,i,i,1));
				dateArr[dateArr.length-1].dateFormat = 5;
			}
		}
		
		//other relative keyword (e.g. tomorrow);
		else if (dateExtract ("OK",i)){
			if ( taggedWords[i][0].toLowerCase() == "tomorrow"){
				var newDate = new Date();
				newDate.setTime(emailDate.getTime()+ 86400000);
				dateArr.push(new MyDate(newDate,i,i,15));
				dateArr[dateArr.length-1].dateFormat = 1;
			}
			else if ( taggedWords[i][0].toLowerCase() == "today"){
			  var newDate = new Date();
				dateArr.push(new MyDate(newDate,i,i,10));
				dateArr[dateArr.length-1].dateFormat = 1;
			}
		}
		
		//changed
		//start extracting Time Format
		//extract format HH:MM am/pm
		//e.g 14:00 am or 9:15pm 
	  if (dateExtract("HH+:+MIN",i) && isAmPm(i+3) != -1){
	    var matchArr = [1,4,3,1,4,3];
	    var tempIndex = isAmPm(i+3);
	    if (tempIndex >=0 && tempIndex <=2){
	       if (taggedWords[i][0] ==12)
	        timeArr.push(new MyTime(0,taggedWords[i+2][0],i,i+2+matchArr[tempIndex],30,2));
	       else
	        timeArr.push(new MyTime(taggedWords[i][0],taggedWords[i+2][0],i,i+2+matchArr[tempIndex],30,2));
	    }
	    else{
	      if (taggedWords[i][0]<12)
	        timeArr.push(new MyTime(parseInt(taggedWords[i][0])+12,taggedWords[i+2][0],i,i+2+matchArr[tempIndex],30,2));
	      else
	        timeArr.push(new MyTime(taggedWords[i][0],taggedWords[i+2][0],i,i+2+matchArr[tempIndex],30,2));
	    }
	    i = i+2 +matchArr[tempIndex];
	  }
	  else if (dateExtract("HH+.+MIN",i) && isAmPm(i+3) != -1){
	    var matchArr3 = [1,4,3,1,4,3];
	    var tempIndex3 = isAmPm(i+3);
	    if (tempIndex3 >=0 && tempIndex3 <=2){
	       if (taggedWords[i][0] ==12)
	        timeArr.push(new MyTime(0,taggedWords[i+2][0],i,i+2+matchArr3[tempIndex3],30,2));
	       else
	        timeArr.push(new MyTime(taggedWords[i][0],taggedWords[i+2][0],i,i+2+matchArr3[tempIndex3],30,2));
	    }
	    else{
	      if (taggedWords[i][0]<12)
	        timeArr.push(new MyTime(parseInt(taggedWords[i][0])+12,taggedWords[i+2][0],i,i+2+matchArr3[tempIndex3],30,2));
	      else
	        timeArr.push(new MyTime(taggedWords[i][0],taggedWords[i+2][0],i,i+2+matchArr3[tempIndex3],30,2));
	    }
	    i = i+2 +matchArr3[tempIndex3];
	  }
	  //extract format HH.MM e.g 11:40
		else if (dateExtract("HH+.+MIN",i)){
		  timeArr.push(new MyTime(taggedWords[i][0],taggedWords[i+2][0],i,i+2,30,1));
		  i=i+2;
		}
	  //extract format HH:MM e.g 11:40
		else if (dateExtract("HH+:+MIN",i)){
		  timeArr.push(new MyTime(taggedWords[i][0],taggedWords[i+2][0],i,i+2,30,1));
		  i=i+2;
		}
		
		//extract format HH am/pm e.g 6am/pm
		else if (dateExtract("HH",i) && isAmPm(i+1) != -1){
	    var matchArr2 = [1,4,3,1,4,3];
	    var tempIndex2 = isAmPm(i+1);
	    if (tempIndex2 >=0 && tempIndex2 <=2){
	       if (taggedWords[i][0] ==12)
	        timeArr.push(new MyTime(0,0,i,i+matchArr2[tempIndex2],30,3));
	       else
	        timeArr.push(new MyTime(taggedWords[i][0],0,i,i+matchArr2[tempIndex2],30,3));
	    }
	    else{
	      if (taggedWords[i][0]<12)
	        timeArr.push(new MyTime(parseInt(taggedWords[i][0])+12,0,i,i+matchArr2[tempIndex2],30,3));
	      else
	        timeArr.push(new MyTime(taggedWords[i][0],0,i,i+matchArr2[tempIndex2],30,3));
	    }
	    i = i +matchArr2[tempIndex2];
	  }
	  //extract format of time keyword e.g morning afternoon
	  else if (findTimeKeyword(taggedWords[i][0]) != -1){
	    timeArr.push(new MyTime(findTimeKeyword(taggedWords[i][0]),0,i,i,20,4));
	  }
	}
}

function findTimeKeyword(str){
			for(var j=0; j<timeKeyword.length; j++){
				if (str.toLowerCase() == timeKeyword[j][0])
					return timeKeyword[j][1];
			}
			return -1;
}


function dateExtract(format, i){
	var splitted="";
	var splitedFormat = format.split("+");
	var formatLength = splitedFormat.length;
	if (i+formatLength > taggedWords.length){
		return false;}
	for (var k = 0; k<formatLength; k++){
		if (!(checkFormat(splitedFormat[k], taggedWords[i+k][0],i)))
			return false;
	}
	return true;
}

//changed
//check the required format and the word match or not
function checkFormat(format, word, i){
	if (format == "/" || format == "-" || format == "." || format == "," || format == ":"){	
		if (format == word)
			return true;
		else 
			return false;
	}
	//DD is day (e.g 1 - 31)
	else{
		if (format == "DD"){
			
			if (word >=1 && word <= 31){
				if (isInt(word))
					return true;
			return false;
			}
		}
		//MM is month in numerical form (e.g. 1 - 12)
		else if (format == "MM"){
			if (word >=1 && word <= 12){
				if (isInt(word))
					return true;
			return false;
			}
		}
		// YYYY is year (e.g. 1950 - 2100 )
		else if (format == "YYYY"){
			if (word >=1950 && word <= 2100){
				if (isInt(word))
					return true;
			return false;
			}
		}
		// MMM is the full form of month in English (e.g. January)
		else if (format == "MMM"){
			for(var j=0; j<12; j++){
				if (word.toLowerCase() == fullMonth[j])
					return true;
			}
			return false;
		}
		// mmm is the short form of month in English (e.g. Jan)
		else if (format == "mmm"){
			for(var j=0; j<12; j++){
				if (word.toLowerCase() == shortMonth[j])
					return true;
			}
			return false;
		}
		//pp is st or nd or rd or th
		else if (format == "pp"){
			if (word.toLowerCase() =="st" || word.toLowerCase() =="nd" || word.toLowerCase() =="rd" || word.toLowerCase() =="th")
				return true;
		}
		
		else if (format == "WD"){
			for (var j =0; j < fullWeekday.length; j++){
				if (word.toLowerCase() == fullWeekday[j])
					return true;
			}
			return false;
		}
		else if (format == "wd"){
			for (var j =0; j < fullWeekday.length; j++){
				if (word.toLowerCase() == shortWeekday[j])
					return true;
			}
			return false;
		}
		else if (format == "RW"){
			for (var j =0; j < relativeKeyword.length; j++){
				if (word.toLowerCase() == relativeKeyword[j])
					return true;
			}
			return false;
		}
		else if (format == "OK"){
			for (var j =0; j < otherKeyword.length; j++){
				if (word.toLowerCase() == otherKeyword[j])
					return true;
			}
			return false;
		}
		else if (format == "HH"){
			if (word >=0 && word <= 23){
				if (isInt(word))
					return true;
			return false;
			}
		}
		else if (format == "MIN"){
			if (word >=0 && word <= 59 && word.length == 2){
				if (isInt(word))
					return true;
			return false;
			}
		}
		else
			return false;	
	}
}

//changed
function extractDateRange(){
  for (var i =0; i<dateArr.length;i++){
  //Rule Number1: extract date range between 2 extracted date; can match between different format
    for(var k=i+1;k<dateArr.length;k++){
      if(dateArr[i].dateFormat == dateArr[k].dateFormat){
        var distance = dateArr[k].startIndex - dateArr[i].endIndex -1;
        if (distance>0 && distance <8){
          for (var j =0; j<distance;j++){
            if (taggedWords[dateArr[i].endIndex+1+j][0].toLowerCase() == "to" || taggedWords[dateArr[i].endIndex+1+j][0] == "-"|| taggedWords[dateArr[i].endIndex+1+j][0] == "–"){
              dateArr[i].date2 = dateArr[k].date;
              //dateArr[i].score = parseInt(dateArr[i].score) + 1;
            }
          }
        }
      break;
      }
    }
    //Rule Number 2: extract date range in this format 22-27 July or 22 to 27 July
    if (dateArr[i].startIndex-2 >=0 && dateArr[i].dateFormat == 2){
      if (taggedWords[dateArr[i].startIndex-1][0].toLowerCase() == "to" || taggedWords[dateArr[i].startIndex-1][0] == "-"|| taggedWords[dateArr[i].startIndex-1][0] == "–") {
        if (parseInt(taggedWords[dateArr[i].startIndex-2][0]) >= 1 && parseInt(taggedWords[dateArr[i].startIndex-2][0]) <= 31){
          dateArr[i].date2= new Date (dateArr[i].date.getTime());
          dateArr[i].date.setDate(taggedWords[dateArr[i].startIndex-2][0]);
          //dateArr[i].score = parseInt(dateArr[i].score) + 1;
          dateArr[i].startIndex = dateArr[i].startIndex-2;
        }
      }
    }
    //Rule Number 3: extract date range in this format July 22-27 or 22 to 27 July
    if (dateArr[i].startIndex+2 <taggedWords.length && dateArr[i].dateFormat == 3){
      if (taggedWords[dateArr[i].endIndex+1][0].toLowerCase() == "to" || taggedWords[dateArr[i].endIndex+1][0] == "-"|| taggedWords[dateArr[i].endIndex+1][0] == "–") {
        if (taggedWords[dateArr[i].endIndex+2][0] >= 1 && taggedWords[dateArr[i].endIndex+2][0] <= "31"){
          dateArr[i].date2= new Date (dateArr[i].date.getFullYear(),dateArr[i].date.getMonth(),taggedWords[dateArr[i].endIndex+2][0]);
          //dateArr[i].score = parseInt(dateArr[i].score) + 1;
        }
      }
    }
  }
}


//changedx2
function extractTimeRange(){
  for (var i =0; i<timeArr.length;i++){
    var extracted = false;
  //Rule Number1: extract time range between 2 extracted date
    for(var k=i+1;k<timeArr.length;k++){
        var distance = timeArr[k].startIndex - timeArr[i].endIndex -1;
        if (distance>0 && distance <2){
          for (var j =0; j<distance;j++){
            if (taggedWords[timeArr[i].endIndex+1+j][0].toLowerCase() == "to" || taggedWords[timeArr[i].endIndex+1+j][0] == "-"|| taggedWords[timeArr[i].endIndex+1+j][0] == "–"){
              if (timeArr[i].timeFormat ==1 && (timeArr[k].timeFormat ==3 || timeArr[k].timeFormat ==2) ||  parseInt(timeArr[k].timeFormat == 4)){
                if (parseInt(timeArr[i].startHour) +12 <= timeArr[k].startHour)
                  timeArr[i].startHour = parseInt(timeArr[i].startHour)+12;
              }
              timeArr[i].endHour = timeArr[k].startHour;
              timeArr[i].endMinute = timeArr[k].startMinute;
              extracted = true;
            }
          }
        }
        break;
    }
    if (extracted){
      i++;
      continue;
    }
    //Rule Number 2: extract time range in this format 2-4pm
    if ( timeArr[i].startIndex-2 >=0){
      if (taggedWords[timeArr[i].startIndex-1][0].toLowerCase() == "to" || taggedWords[timeArr[i].startIndex-1][0] == "-"|| taggedWords[timeArr[i].startIndex-1][0] == "–") {
        if (parseInt(taggedWords[timeArr[i].startIndex-2][0]) >= 0 && parseInt(taggedWords[timeArr[i].startIndex-2][0]) <= 23){
          timeArr[i].endHour = timeArr[i].startHour;
          timeArr[i].endMinute = timeArr[i].startMinute;
          timeArr[i].startHour = taggedWords[timeArr[i].startIndex-2][0];
          if (parseInt(timeArr[i].startHour) +12 <= timeArr[i].endHour)
            timeArr[i].startHour = parseInt(timeArr[i].startHour) +12;
          timeArr[i].startMinute = 0;
        }
      }
    }
  }
}


//check the word is a holiday or not and return its position in the array if yes
function isHoliday( i){
	for(var j=0; j<holiday.length; j++){
		var check = true;
		var splitHoliday = holiday[j][0].split(" ");
		if ( splitHoliday.length + i > taggedWords.length)
			continue;
		for (var k=0; k<splitHoliday.length; k++){
			if (taggedWords[i+k][0].toLowerCase() != splitHoliday[k])
				check = false;
		}
		if (check)
			return [j];	
	}
	return [-1];
}

//find am/pm keyword 
//changed
function isAmPm(index){
  for (var i =0; i< ampmWord.length ;i++){
    var splitAmPm = ampmWord[i].split("+");
    var wordLength = splitAmPm.length;
    var ans = true;
    if (index+wordLength > taggedWords.length)
      continue;
    for (var j =0; j< wordLength; j++){
      if (taggedWords[index+j][0].toLowerCase() != splitAmPm[j])
        ans = false;
    }
    if (ans === true)
      return i;
  }
  return -1;
}



//check it is an integer or not
function isInt(value) {
  return !isNaN(value) && 
         parseInt(Number(value)) == value && 
         !isNaN(parseInt(value, 10));
}


//check a date is valid or not (e.g 29/2 may invalid, 31/4 is invalid)
function isValidDate(str) {
    var parts = str.split('/');
    if (parts.length < 3)
        return false;
    else {
        var day = parseInt(parts[0]);
        var month = parseInt(parts[1]);
        var year = parseInt(parts[2]);
        if (isNaN(day) || isNaN(month) || isNaN(year)) {
            return false;
        }
        if (day < 1 || year < 1)
            return false;
        if(month>12||month<1)
            return false;
        if ((month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) && day > 31)
            return false;
        if ((month == 4 || month == 6 || month == 9 || month == 11 ) && day > 30)
            return false;
        if (month == 2) {
            if (((year % 4) === 0 && (year % 100) !== 0) || ((year % 400) === 0 && (year % 100) === 0)) {
                if (day > 29)
                    return false;
            } else {
                if (day > 28)
                    return false;
            }      
        }
        return true;
    }
}


function isDateEqual(date1, date2){
	if ((date1.getDate() ==date2.getDate()) && (date1.getMonth() == date2.getMonth()) && (date1.getFullYear() == date2.getFullYear()))
		return true;
	return false;
}


//Rule number1: If "Date:" exist before the date within 5 words, add 40 for it
//Rule number2: If "Date" exist before the date within 3 words, add 10 for it
//Rule number3: If "From" exist before the date within 3 words, add 5 for it
//Rule number4: If "to" exist before the date within 3 words, add 5 for it
//Rule number5: If "on" exist before the date within 3 words, add 5 for it
//changed
function dateScoring(){
	for (var i =0; i< dateArr.length; i++){
		for (var j =0; j< scoreOfWord.length;j++){
		  //alert(findInfront(scoredKeyword[j][0],scoredKeyword[j][1], dateArr[i].startIndex) + " " + dateArr[i].startIndex);
			if (findInfront(scoredKeyword[j][0],scoredKeyword[j][1], dateArr[i].startIndex)){
				dateArr[i].score = dateArr[i].score + scoreOfWord[j];
			}
		}
	}
}

//changed
function timeScoring(){
	for (var i =0; i< timeArr.length; i++){
		for (var j =0; j< scoreOfTimeWord.length;j++){
			if (findInfront(scoredTimeKeyword[j][0],scoredTimeKeyword[j][1], timeArr[i].startIndex)){
				timeArr[i].score = timeArr[i].score + scoreOfTimeWord[j];
			}
		}
	}
}


	

function findInfront(dateKeyword, count, i){
	var  j= 1;
	while ( (i-j)>=0 && j <= count){
		var splitDateKeyword =  dateKeyword.split(" ");
		//alert(i-j-splitDateKeyword.length +1);
		if ((i-j-splitDateKeyword.length +1) <0)
			return false;
		var checkPoint = true;
		for (var k = 0; k< splitDateKeyword.length; k++){
			//alert(taggedWords[i-j-splitDateKeyword.length+1+k][0].toLowerCase() + " " + splitDateKeyword[k]);
			//if ( taggedWords[i-j+k][0].toLowerCase() != splitDateKeyword[k].toLowerCase())
			if ( taggedWords[i-j-splitDateKeyword.length+1+k][0].toLowerCase() != splitDateKeyword[k].toLowerCase())
				checkPoint = false;
		}
		//alert(checkPoint);
		if (checkPoint)
			return true;
		j++;
	}
	return false;
}




function sortByDate(){
	for ( var i =1; i<dateArr.length; i++){
	  var key = dateArr[i];
	  var j = i-1;
	  while (j>=0 && dateArr[j].date >key.date){
	    dateArr[j+1] = dateArr[j];
	    j--;
	  }
	  dateArr[j+1] = key;
	}

}


function sortByDateIndex(){
	for ( var i =1; i<dateArr.length; i++){
	  var key = dateArr[i];
	  var j = i-1;
	  while (j>=0 && dateArr[j].startIndex >key.startIndex){
	    dateArr[j+1] = dateArr[j];
	    j--;
	  }
	  dateArr[j+1] = key;
	}

}

function isDateSmaller(date1,date2){
  if (date1.getFullYear() < date1.getFullYear())
    return true;
  else if(date1.getFullYear() > date1.getFullYear())
    return false;
  else {
    if ( date1.getMonth() < date2.getMonth())
      return true;
    else if (date1.getMonth() > date2.getMonth())
      return false;
    else{
      if (date1.getDate() < date2.getDate())
        return true;
      else 
        return false;
    }
  }
  
}



function sortByScore(){
	for ( var i =0; i<dateArr.length; i++){
		for ( var j = i+1; j<dateArr.length; j++){
			if (dateArr[j].score > dateArr[i].score){
				var temp = dateArr[i];
				dateArr[i] = dateArr[j];
				dateArr[j] = temp;
			}
		}		
	}
}

//changed
function sortTimeByScore(){
	for ( var i =0; i<timeArr.length; i++){
		for ( var j = i+1; j<timeArr.length; j++){
			if (timeArr[j].score > timeArr[i].score){
				var temp = timeArr[i];
				timeArr[i] = timeArr[j];
			  timeArr[j] = temp;
			}
		}		
	}
}


function removeDuplicateDate(){
	var i=0;
	while (i+1 < dateArr.length){
		if (isDateEqual(dateArr[i+1].date, dateArr[i].date)){
			if (dateArr[i+1].score < dateArr[i].score){
				dateArr.splice(i+1,1);
				i--;  
			}
		}
		i++;
	}
}

//changed
function dateDecision(){
	if (dateArr.length === 0){
		startDate = emailDate;
		endDate = emailDate;
	}
	else {
	  if (dateArr[0].date2 === null){
		  startDate = dateArr[0].date;
		  endDate = dateArr[0].date;
	  }
	  else {
	    startDate = dateArr[0].date;
	    endDate = dateArr[0].date2;
	  }
	}
}


//changed
function timeDecision(){
	if (timeArr.length === 0){
		startTime = "12:00";
		endTime = "12:00";
	}
	else {
	  if (timeArr[0].endHour === null){
		  startTime = fillZero(timeArr[0].startHour) + ":" + fillZero(timeArr[0].startMinute);
		  endTime = startTime;
	  }
	  else {
	    startTime = fillZero(timeArr[0].startHour) + ":" + fillZero(timeArr[0].startMinute);
	    endTime = fillZero(timeArr[0].endHour) + ":" + fillZero(timeArr[0].endMinute);
	  }
	}
}

//changedx2
function fillZero(str){
  if (String(str).length ==1)
    return ("0" + str);
  return str;
}

//changed
function printTime(){
  var testing="";
  
  for(var i=0;i<timeArr.length;i++)
			testing += timeArr[i].timeFormat + "    startTime=" + timeArr[i].startHour +":"+ timeArr[i].startMinute + "   endTime=" + timeArr[i].endHour+":"+timeArr[i].endMinute +"   i="+ timeArr[i].startIndex+ "   j=" + timeArr[i].endIndex + "  score=" + timeArr[i].score+"\n" ;
  
  return testing;
 // alert(timeArr.length);
}

function printResult(){
		var testing="";
		for(var i=0;i<dateArr.length;i++)
			testing += (dateArr[i].dateFormat + "   "+dateArr[i].date.toDateString() + "   i=" + dateArr[i].startIndex + "   j=" + dateArr[i].endIndex + "      score="+ dateArr[i].score + "  date2: " + dateArr[i].date2 + "\n");
		return testing;
}

//function for output the POS
DateExtractor.prototype.posTagging = function(){
	for (var i in taggedWords) {
	  var taggedWord = taggedWords[i];
	  var word = taggedWord[0];
	  var tag = taggedWord[1];
	  // Note the use of document.writeln instead of print
	  POSresult += (word + "_" + tag + " ");
	}
	return POSresult;
};
