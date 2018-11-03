var addressMatchUS = /\b[1-9]\d{2,4}\s+(\S+\s+){2,9}\d{5}\b/igm;
var addressMatchCA = /\b[1-9]\d{1,4}\s+(\S+\s+){2,9}[ABCEGHJKLMNPRSTVXY]\d[A-Z][ -]\d[A-Z]\d\b/igm;

function getAddress(text) {
    var addrArry = text.match(addressMatchUS);
    if (addrArry == null)
        addrArry = text.match(addressMatchCA);
    return addrArry;
}
