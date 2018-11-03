function getDate(text, mailDate, date_uk) {
	//document.getElementById('message').value = "123";
	//window.alert("test123");
	/*text = "February 05 th  8th my. a.b 5-06-5 2/10/2011 (22-11-1992) hihi 10/12 31-4-2012   Bonaparte has been as profuse in his disposal of the Imperial"+
	" diadem of 27/9-2012 Germany, as in his promises of the papal tiara of Rome.  The"+
	" Houses of Austria and Brandenburgh, the Electors of Bavaria and Baden,"+
	" have by turns been cajoled into a belief of his exclusive support towards"+
	" obtaining it 2/29/2015 at the first vacancy.  Those, however, who have paid"+
	" attention to his machinations, 14:00-15:00 and studied his actions; who remember his"+
	" pedantic 31/5/2013 affectation of being cons 2/28 idered a modern, or rather a second"+
	" Charlemagne; and who have traced his steps through the labyrinth of folly"+
	" and wickedness, of Jul 22, 2014 meanness and greatness, of art, corruption, and"+
	" policy, which have seated him on the present throne, can entertain little"+
	" doubt but that he is  25th Dec seriously bent on seizing and adding the sceptre of"+
	" Germany to the crowns of France and Italy 7/12/2011.";*/
	//clearHistory();
	//saveHistory("mk");
	var words = new Lexer().lex(text);
	var inputTaggedWords = new POSTagger().tag(words);
	var result = {};

	var dateExtractor = new DateExtractor(inputTaggedWords, mailDate, date_uk);

	result = dateExtractor.extractDate();
	//getHistory();
	return result;
	//return true;
}