/**
 * Convert date in format (YYYY-MM-DDTHH:MM:SSZ) to (YYYY-MM-DD HHhMMmin) (e.g. 2020-05-13T08:21:42Z to 2020-05-13 08h21min)
 * @param {String} dateFormat date in format YYYY-MM-DDTHH:MM:SSZ
 */
function parseDate(dateFormat){
    substr = dateFormat.split('T')
    date = substr[0]
    time = substr[1].split(':')

    hour = time[0]
    min = time[1]

    return date + ' ' + hour + 'h' + min + 'min'
}