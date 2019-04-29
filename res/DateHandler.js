class DateHandler {
    static beautify(stringDate){
        console.log("input", stringDate)
        const date = new Date(stringDate)
        var mm = date.getMonth() + 1; // getMonth() is zero-based
        var dd = date.getDate();

        const toReturn = [date.getFullYear(),
            (mm>9 ? '' : '0') + mm,
            (dd>9 ? '' : '0') + dd
        ].join('')

        return toReturn
    }
}
DateHandler.shared = new DateHandler()
export default DateHandler