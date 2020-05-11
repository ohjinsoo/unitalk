const Time = {
    getTime(time, curr) {
        if (time == null) {
            return 0
        }
        var diff = (curr - time) / 1000;

        var MINS = 60;
        var HOURS = MINS * 60;

        if (diff < 60) {
            diff = parseInt(diff);
            time = diff + "s";
        } else if (diff < 60 * MINS) {
            diff = parseInt(diff / MINS);
            time = diff + "m";
        } else if (diff < 24 * HOURS) {
            diff = parseInt(diff / HOURS);
            time = diff + "h";
        } else {
            time = new Date(time).toLocaleDateString("en-US");
        }
        return time;
    }
}

export default Time;