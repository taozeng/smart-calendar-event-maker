var addressMatchUS = /\b[1-9]\d{2,4}\s+(\S+\s+){2,9}\d{5}\b/igm;
var addressMatchCA = /\b[1-9]\d{1,4}\s+(\S+\s+){2,9}[ABCEGHJKLMNPRSTVXY]\d[A-Z][ -]\d[A-Z]\d\b/igm;
var addressMatchUK = /\b[1-9]\d{1,4}\s+(\S+\s+){2,9}([A-PR-UWYZ0-9][A-HK-Y0-9][AEHMNPRTVXY0-9]?[ABEHMNPRVWXY0-9]? {1,2}[0-9][ABD-HJLN-UW-Z]{2}|GIR 0AA)\b/igm;

function getAddress(text) {
    var addrArry = text.match(addressMatchUS);
    if (addrArry == null)
        addrArry = text.match(addressMatchCA);
    if (addrArry == null)
        addrArry = text.match(addressMatchUK);
    return addrArry;
}
