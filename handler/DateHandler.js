class DateHandler {
    static isInThePast(date, time){
        const today = new Date()
        const thatDate = new Date(date)
        thatDate.setHours(time.substring(0, time.indexOf(":")))
        thatDate.setMinutes(time.substring(time.indexOf(":") + 1, time.length))

        return today.getTime() >= thatDate.getTime()
    }

    static dateToString(date){
        var mm = date.getMonth() + 1 // getMonth() is zero-based
        var dd = date.getDate()
        const month = (mm>9 ? '' : '0') + mm
        const day = (dd>9 ? '' : '0') + dd
        const toReturn = date.getFullYear() + '-' + month + '-' + day
        return toReturn
    }

    static timeToString(date){
        const hh = (date.getHours() > 9 ? '' : '0') + date.getHours()
        const mm = (date.getMinutes() > 9 ? '' : '0') + date.getMinutes()
        return hh + ":" + mm
    }
}
DateHandler.shared = new DateHandler()
export default DateHandler