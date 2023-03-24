exports.isArray = (item, failureMessage) => {
    if (!item) { throw new Error("argument item missing"); };

    if (!failureMessage) { throw new Error("argument failureMessage missing"); };
    if (typeof failureMessage != "string") { throw new TypeError("failureMessage must be a string"); };
    if (failureMessage.length == 0) { throw new RangeError("failureMessage cannot be an empty string"); };

    if (item instanceof Array) {
        return item;
    };
    throw new Error(failureMessage);
};

exports.nonEmptyArray = (array, failureMessage) => {
    if (!array) { throw new Error("argument array missing"); };
    if (!(array instanceof Array)) { throw new TypeError("array must be any array"); };

    if (!failureMessage) { throw new Error("argument failureMessage missing"); };
    if (typeof failureMessage != "string") { throw new TypeError("failureMessage must be a string"); };
    if (failureMessage.length == 0) { throw new RangeError("failureMessage cannot be an empty string"); };

    if (array.lenght != 0) {
        return array;
    };
    throw new Error(failureMessage);
};

exports.itemIDOnylArray = (array, failureMessage) => {
    if (!array) { throw new Error("argument array missing"); };
    if (!(array instanceof Array)) { throw new TypeError("array must be any array"); };
    if (array.length == 0) { throw new RangeError("array cannot be an empty array"); };

    if (!failureMessage) { throw new Error("argument failureMessage missing"); };
    if (typeof failureMessage != "string") { throw new TypeError("failureMessage must be a string"); };
    if (failureMessage.length == 0) { throw new RangeError("failureMessage cannot be an empty string"); };

    array.forEach(item => {
        try {
            item = Number(item);
            if (item < 0) { throw new Error(failureMessage); };
            if (item % 1 != 0) { throw new Error(failureMessage); };
        } catch (error) {
            throw new Error(failureMessage);
        };
    });

    return array;
};