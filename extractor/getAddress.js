var addressMatch=/[1-9]\d{2,4}\s+(\S+\s+){2,9}\d{5}/igm;

function getAddress(text) {
    var addrArry=text.match(addressMatch);
    //console.log(addrArry);
    return addrArry;
}