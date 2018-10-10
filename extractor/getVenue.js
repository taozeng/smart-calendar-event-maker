function getVenue(text, locationArray, scoreArray) {
	
	var words = new Lexer().lex(text);
	var inputTaggedWords = new POSTagger().tag(words);
	var result = {};
  
  
  if(locationArray[0] === undefined )
    locationArray[0] = "123";
  if(scoreArray[0] === undefined )
    scoreArray[0] = 1;
  //window.alert(inputTaggedWords);
	var venueExtractor = new VenueExtractor(inputTaggedWords, locationArray, scoreArray); 
  
	result = venueExtractor.extractVenue();
	//getHistory();
	return result;
	//return true;
}