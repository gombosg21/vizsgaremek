export function durationStringtoDate(duration: string): Date {

    const segments: string[] = duration.split(" ");
    var years: number = 0;
    var days: number = 0;
    var hours: number = 0;
    var minits: number = 0;
    var seconds: number = 0;
    var miliseconds: number = 0;


    segments.forEach((segment: string) => {
        if (segment.includes("y")) {
            years = (Number(segment.replace("y", "")) * 365 * 24 * 60 * 60 * 60);
        };
        if (segment.includes("mm")) {
            minits = (Number(segment.replace("mm", "")) * 60 * 60);
        };
        if (segment.includes("ms")) {
            miliseconds = (Number(segment.replace("ms", "")));
        };
        if (segment.includes("d")) {
            days = (Number(segment.replace("d", "")) * 24 * 60 * 60 * 60);
        };
        if (segment.includes("h")) {
            hours = (Number(segment.replace("h", "")) * 60 * 60 * 60);
        };
        if (segment.includes("s")) {
            seconds = (Number(segment.replace("s", "")) * 60);
        };
    });

    var date: number = new Date().getTime();

    date += years;
    date += days;
    date += hours;
    date += minits;
    date += seconds;
    date += miliseconds;

    return new Date(date);
};