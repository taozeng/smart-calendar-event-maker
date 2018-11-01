var taggedLocation;
var exceptKeyword = ["floor", "of", "and", "the", "th", "st", "rd", "nd", "&", ",", "-", "'", "~", "[", "]", "(", ")", "–", "/", "<", ">"];
var venueKeyword = ["apartment", "avenue", "block", "canteen", "flat", "house", "floor", "level", "storey", "room", "rm", "street", "state", "road", "province", "resort", "town", "tower", "village", "district", "region", "city", "estate", "bank", "bakery", "barbershop", "salon", "store", "shop", "plaza", "mall", "market", "supermarket", "hotel", "motel", "cafe", "bar", "pub", "bistro", "restaurant", "atrium", "corridor", "barn", "hall", "building", "theater", "theatre", "lt", "office", "school", "university", "airport", "tunnel", "station", "platform", "exit", "bus stop", "pier", "pool", "hospital", "library", "park", "castle", "church", "museum", "stadium", "court", "beach", "coast", "forest", "hill", "bay", "center", "centre", "lake", "waterfall", "mountain", "shan", "river", "sea", "valley", "inn", "clinic", "square", "field", "suite", "drive", "boulevard", "blvd", "highway", "parkway"];
var historyArr;
var historyScoreArr;
var venueArr;
var savedVenue;



function VenueExtractor(inputtaggedLocation, inputHistoryArr, inputhistoryScoreArr) {
  //taggedLocation is the output of POS(e.g taggedLocation[0][0] is the first word, taggedLocation[0][1] is the POS of first word)
  taggedLocation = inputtaggedLocation;
  historyArr = inputHistoryArr;//["test1 and test2", "testing3" , "the testing university of hehe and haha"];
  historyScoreArr = inputhistoryScoreArr;//[1,2,3];
  venueArr = [];
  savedVenue = [];
  //alert(inputtaggedLocation);
  //window.alert(historyArr.length);
}


function MyVenue(inputWord, startPos, VenueScore, format) {
  this.venue = inputWord;
  this.startIndex = startPos;
  this.score = VenueScore;
  this.venueFormat = format;

}


VenueExtractor.prototype.extractVenue = function () {
  //alert(taggedLocation);
  for (var i = 0; i < taggedLocation.length; i++) {
    //extract venue by keyword e.g Venue: Location: (2word)
    var type1 = parseInt(extractByKeyword(i));
    if (type1 != -1) {
      //i=i+1+type1;
      i = i + 1;
      continue;
    }
    //window.alert(venueArr[0]);
    var type4 = extractByHistory(i);
    if (type4 != -1) {
      //i=i+type4-1;
      i--;
      continue;
    }

    //extract venue by hardcoded word like floor, flat, building
    var type3 = extractByLibrary(i);
    if (type3 != -1) {
      //i=i+type3;
      continue;
    }

    //extract venue by keyowrd e.g at, in (1 word)
    var type2 = parseInt(extractByKeyword2(i));
    if (type2 != -1) {
      //i=i+type2;
      continue;
    }

  }
  //alert(printVenue());
  modifyExtractedVenue();
  //alert(printVenue());
  //sortByVenue();
  //alert(printVenue());
  //removeDuplicateVenue();
  //alert(printVenue());
  //sortVenueByLocation();
  //alert(printVenue());
  sortVenueByScore();
  //alert(printVenue());
  //  alert(taggedLocation);

  //window.alert( venueArr[0].venue);
  return venueArr;
};



function extractByHistory(i) {
  for (var j = 0; j < historyArr.length; j++) {
    var extractedVenue = "";
    var check = true;

    var words = new Lexer().lex(historyArr[j]);
    if (i + words.length > taggedLocation.length)
      continue;
    for (var k = 0; k < words.length; k++) {
      if (taggedLocation[i + k][0].toLowerCase() != words[k].toLowerCase())
        check = false;
      extractedVenue += taggedLocation[i + k][0] + " ";
    }

    if (check && savedVenue.indexOf(extractedVenue) == -1) {
      venueArr.push(new MyVenue(extractedVenue.trim(), i, 80 + parseInt(historyScoreArr[j]), 4));
      savedVenue.push(extractedVenue);
      return words.length;
    }
  }
  return -1;
}


function extractByLibrary(i) {
  if (matchLibrary(taggedLocation[i][0])) {
    var j = 0;
    var k = 0;
    var lock = true;
    var lock2 = true;
    var extractedVenue = taggedLocation[i][0] + " ";
    while (i + 1 + j < taggedLocation.length) {
      if (taggedLocation[i + 1 + j][0] == ")") {
        extractedVenue += (taggedLocation[i + 1 + j][0] + " ");
        lock = true;
      }
      else if (lock === false) {
        if (taggedLocation[i + 1 + j][0] != "pppppp")
          extractedVenue += (taggedLocation[i + 1 + j][0] + " ");
      }
      else if (String(taggedLocation[i + 1 + j][0]).charCodeAt(0) >= 65 && String(taggedLocation[i + 1 + j][0]).charCodeAt(0) <= 90)
        extractedVenue += (taggedLocation[i + 1 + j][0] + " ");
      else if (taggedLocation[i + 1 + j][0] == "(") {
        extractedVenue += (taggedLocation[i + 1 + j][0] + " ");
        lock = false;
      }
      else if (matchExceptKeyword(taggedLocation[i + 1 + j][0]))
        extractedVenue += (taggedLocation[i + 1 + j][0] + " ");
      else if (taggedLocation[i + 1 + j][1] == "CD")
        extractedVenue += (taggedLocation[i + 1 + j][0] + " ");
      else
        break;
      j++;
    }
    while (i - 1 - k >= 0) {
      if (taggedLocation[i - 1 - k][0] == "(") {
        extractedVenue = (taggedLocation[i - 1 - k][0] + " ") + extractedVenue;
        lock2 = true;
      }
      else if (lock2 === false) {
        if (taggedLocation[i - 1 - k][0] != "pppppp")
          extractedVenue = (taggedLocation[i - 1 - k][0] + " ") + extractedVenue;
      }
      else if (String(taggedLocation[i - 1 - k][0]).charCodeAt(0) >= 65 && String(taggedLocation[i - 1 - k][0]).charCodeAt(0) <= 90)
        extractedVenue = (taggedLocation[i - 1 - k][0] + " ") + extractedVenue;
      else if (taggedLocation[i - 1 - k][0] == ")") {
        extractedVenue = (taggedLocation[i - 1 - k][0] + " ") + extractedVenue;
        lock2 = false;
      }
      else if (matchExceptKeyword(taggedLocation[i - 1 - k][0]))
        extractedVenue = (taggedLocation[i - 1 - k][0] + " ") + extractedVenue;
      else if (taggedLocation[i - 1 - k][1] == "CD")
        extractedVenue = (taggedLocation[i - 1 - k][0] + " ") + extractedVenue;
      else
        break;
      k++;
    }
    //window.alert(extractedVenue + ":"+savedVenue.indexOf(extractedVenue));
    if (extractedVenue.length > 1 && savedVenue.indexOf(extractedVenue) == -1) {
      venueArr.push(new MyVenue(extractedVenue.trim(), i - k, 50, 3));
      savedVenue.push(extractedVenue);
      return j;
    }
    else
      return -1;
  }
  else
    return -1;
}



function matchLibrary(str) {
  for (var j = 0; j < venueKeyword.length; j++) {
    if (str.toLowerCase() == venueKeyword[j].toLowerCase())
      return true;
  }

  return false;
}


function extractByKeyword(i) {
  if (i + 1 >= taggedLocation.length)
    return -1;
  if (taggedLocation[i][0].toLowerCase() == "venue" || taggedLocation[i][0].toLowerCase() == "location" || taggedLocation[i][0].toLowerCase() == "place" || taggedLocation[i][0].toLowerCase() == "where") {
    if (taggedLocation[i + 1][0] == ":") {
      var j = 0;
      var test = false;
      var lock = true;
      var extractedVenue = "";
      while (i + 2 + j < taggedLocation.length) {
        //window.alert(taggedLocation[i+2+j][0] + " " + lock);

        if (test === false && i + 2 < taggedLocation.length && taggedLocation[i + 2][0] == "pppppp") {
          //window.alert(taggedLocation[i+2][0] + " " + lock);
          test = true;
          j++;
          continue;
        }
        if (taggedLocation[i + 2 + j][0] == ")") {
          extractedVenue += (taggedLocation[i + 2 + j][0] + " ");
          lock = true;
        }
        else if (lock === false) {
          if (taggedLocation[i + 2 + j][0] != "pppppp")
            extractedVenue += (taggedLocation[i + 2 + j][0] + " ");
        }
        else if (String(taggedLocation[i + 2 + j][0]).charCodeAt(0) >= 65 && String(taggedLocation[i + 2 + j][0]).charCodeAt(0) <= 90)
          extractedVenue += (taggedLocation[i + 2 + j][0] + " ");
        else if (taggedLocation[i + 2 + j][0] == "(") {
          extractedVenue += (taggedLocation[i + 2 + j][0] + " ");
          lock = false;
        }
        else if (matchExceptKeyword(taggedLocation[i + 2 + j][0]))
          extractedVenue += (taggedLocation[i + 2 + j][0] + " ");
        else if (taggedLocation[i + 2 + j][1] == "CD")
          extractedVenue += (taggedLocation[i + 2 + j][0] + " ");
        else
          break;

        j++;
      }

      if (extractedVenue.length > 1 && savedVenue.indexOf(extractedVenue) == -1) {            //changed to 1
        venueArr.push(new MyVenue(extractedVenue.trim(), i + 2, 100, 1));
        savedVenue.push(extractedVenue);
        return countWord(extractedVenue);
      }
      else
        return -1;
    }
  }
  return -1;
}




function extractByKeyword2(i) {
  if (i + 1 >= taggedLocation.length)
    return -1;
  if (taggedLocation[i][0].toLowerCase() == "at" || taggedLocation[i][0].toLowerCase() == "in") {
    var j = 0;
    var lock = true;
    var extractedVenue = "";
    while (i + 1 + j < taggedLocation.length) {
      if (taggedLocation[i + 1 + j][0] == ")") {
        extractedVenue += (taggedLocation[i + 1 + j][0] + " ");
        lock = true;
      }
      else if (lock === false) {
        if (taggedLocation[i + 1 + j][0] != "pppppp")
          extractedVenue += (taggedLocation[i + 1 + j][0] + " ");
      }
      else if (String(taggedLocation[i + 1 + j][0]).charCodeAt(0) >= 65 && String(taggedLocation[i + 1 + j][0]).charCodeAt(0) <= 90)
        extractedVenue += (taggedLocation[i + 1 + j][0] + " ");
      else if (taggedLocation[i + 1 + j][0] == "(") {
        extractedVenue += (taggedLocation[i + 1 + j][0] + " ");
        lock = false;
      }
      else if (matchExceptKeyword(taggedLocation[i + 1 + j][0]))
        extractedVenue += (taggedLocation[i + 1 + j][0] + " ");
      else if (taggedLocation[i + 1 + j][1] == "CD")
        extractedVenue += (taggedLocation[i + 1 + j][0] + " ");
      else
        break;
      j++;
    }

    if ((countWord(extractedVenue) == 1 && !fistWordIsInt(extractedVenue)) || countWord(extractedVenue) > 1) {            //changed to 1
      //window.alert(extractedVenue.length);
      if (savedVenue.indexOf(extractedVenue) == -1) {
        venueArr.push(new MyVenue(extractedVenue.trim(), i + 1, 40, 2));
        savedVenue.push(extractedVenue);
        return countWord(extractedVenue);
      }
      return -1;
    }
    else
      return -1;
  }
  return -1;
}

function modifyExtractedVenue() {
  for (var i = 0; i < venueArr.length; i++) {
    var tempWord = venueArr[i].venue.split(" ");
    //alert(tempWord.length -1  +" "+ matchExceptKeyword(tempWord[tempWord.length -1]));
    //alert(tempWord);

    while (tempWord.length - 1 >= 0 && matchExceptKeyword(tempWord[tempWord.length - 1])) {
      if (tempWord[tempWord.length - 1] == ")" || tempWord[tempWord.length - 1] == ">" || tempWord[tempWord.length - 1] == "}" || tempWord[tempWord.length - 1] == "]") {
        break;
        //extractBackUntil(")", parseInt(venueArr[i].startIndex) + tempWord.length, i);
      }
      else {
        venueArr[i].venue = "";
        for (var j = 0; j < tempWord.length - 1; j++)
          venueArr[i].venue += tempWord[j] + " ";
        venueArr[i].venue = venueArr[i].venue.trim();
        tempWord = venueArr[i].venue.split(" ");
      }
    }

    if (venueArr[i].venue.length === 0) {
      venueArr.splice(i, 1);
      i--;
      continue;
    }

    while (tempWord.length - 1 >= 0 && matchExceptKeyword(tempWord[0])) {
      if (tempWord[0] == "(" || tempWord[0] == "<" || tempWord[0] == "{" || tempWord[0] == "[") {
        break;
        //extractBackUntil(")", parseInt(venueArr[i].startIndex) + tempWord.length, i);
      }
      else {
        venueArr[i].venue = "";
        for (var k = 1; k < tempWord.length; k++)
          venueArr[i].venue += tempWord[k] + " ";
        venueArr[i].venue = venueArr[i].venue.trim();

        tempWord = venueArr[i].venue.split(" ");
      }
    }

    if (venueArr[i].venue.length === 0) {
      venueArr.splice(i, 1);
      i--;
      continue;
    }


  }
}


function matchExceptKeyword(str) {
  for (var i = 0; i < exceptKeyword.length; i++) {
    if (exceptKeyword[i].toLowerCase() == str.toLowerCase())
      return true;
  }
  return false;
}


function countWord(str) {
  var temp = str.split(" ");
  return temp.length - 1;
}


function sortVenueByScore() {
  for (var i = 1; i < venueArr.length; i++) {
    var key = venueArr[i];
    var j = i - 1;
    while (j >= 0 && venueArr[j].score < key.score) {
      venueArr[j + 1] = venueArr[j];
      j--;
    }
    venueArr[j + 1] = key;
  }

}

function sortVenueByLocation() {
  for (var i = 1; i < venueArr.length; i++) {
    var key = venueArr[i];
    var j = i - 1;
    while (j >= 0 && venueArr[j].startIndex > key.startIndex) {
      venueArr[j + 1] = venueArr[j];
      j--;
    }
    venueArr[j + 1] = key;
  }

}


/*

function sortVenueByScore(){
	for ( var i =0; i<venueArr.length; i++){
		for ( var j = i+1; j<venueArr.length; j++){
			if (venueArr[j].score > venueArr[i].score){
				var temp = venueArr[i];
				venueArr[i] = venueArr[j];
				venueArr[j] = temp;
			}
		}		
	}
}
*/

function sortByVenue() {
  for (var i = 1; i < venueArr.length; i++) {
    var key = venueArr[i];
    var j = i - 1;
    while (j >= 0 && venueArr[j].venue > key.venue) {
      venueArr[j + 1] = venueArr[j];
      j--;
    }
    venueArr[j + 1] = key;
  }

}
/*
function sortByVenue(){
	for ( var i =0; i<venueArr.length; i++){
		for ( var j = i+1; j<venueArr.length; j++){
			if (venueArr[j].venue < venueArr[i].venue){
				var temp = venueArr[i];
				venueArr[i] = venueArr[j];
				venueArr[j] = temp;
			}
		}		
	}
}
*/



function removeDuplicateVenue() {
  var i = 0;
  while (i + 1 < venueArr.length) {
    if (venueArr[i + 1].venue == venueArr[i].venue) {

      if (venueArr[i + 1].score < venueArr[i].score) {
        venueArr.splice(i + 1, 1);
        i--;
      }
    }
    i++;
  }
}


function fistWordIsInt(str) {
  var temp = str.split(" ");
  if (isInt2(temp[0]))
    return true;
  return false;

}

//check it is an integer or not
function isInt2(value) {
  return !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
}



function printVenue() {
  var result7 = "";
  for (var i = 0; i < venueArr.length; i++) {
    result7 += venueArr[i].venue + "    i=" + venueArr[i].startIndex + "   score=" + venueArr[i].score + "\n";
  }
  return result7;
}