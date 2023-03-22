exports.getRandomDate = (dateStart, dateEnd) => {
    if (!dateStart) { throw new Error("argument dateStart missing") };
    if (!((new Date(dateStart)) instanceof Date)) { throw new Error("dateStart is not a valifd date format") };

    if (!dateEnd) { throw new Error("argument dateStart missing") };
    if (!((new Date(dateEnd)) instanceof Date)) { throw new Error("dateStart is not a valifd date format") };

    const startTime = (new Date(dateStart)).getTime();
    const endTime = (new Date(dateEnd)).getTime();

    const randomDate = (new Date(startTime + Math.random() * (endTime - startTime))).toJSON();

    return randomDate;
};