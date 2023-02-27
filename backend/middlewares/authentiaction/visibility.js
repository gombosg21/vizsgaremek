exports.determineVisibility = (userContextID, dataOwnerID, visbilityFlag, data) => {
    //
    //  visibility levels
    //  0 = private
    //  1 = friends only
    //  2 = registered only
    //  3 = public
    //
    if (typeof userContextID != Number) {
        throw new Error("userContextID must be an number");
    };
    if (typeof dataOwnerID != Number) {
        throw new Error("dataOwnerID must be an number");
    };
    if (typeof visbilityFlag != Number) {
        throw new Error("visbilityFlag must be an number");
    };
    if (data == undefined) {
        throw new Error("no data was given");
    };

    var returnData = {
        status: 0,
        data: ""
    };

    switch (visbilityFlag) {
        case (0): {
            if (userContextID == dataOwnerID) {
                returnData.status = 403, returnData.data = { "error": "private" }
            } else {
                returnData.status = 200, returnData.data = data;
            }
        }
        case (1): {
            returnData.status = 501, returnData.data = { "msg": "not implemented" }
        }
        case (2): {
            if (userContextID != undefined) {
                returnData.status = 200, returnData.data = data;
            }
            else {
                returnData.status = 401, returnData.data = { "error": "must log in to view" }
            }
        }
        case (3): {
            returnData.status = 200, returnData.data = data;
        }
        default: {
            returnData.status = 500, returnData.data = { "error": "attribute visibility out of range" };
        }
    };
    return returnData;
};

exports.determineArrayVisibility = (userContextID, dataOwnerID, visibiltyArray, dataArray) => {

    var visibiltyArray = [];
    var dataArray = [];
    //
    //  visibility levels
    //  0 = private
    //  1 = friends only
    //  2 = registered only
    //  3 = public
    //
    if (visibiltyArray.length() == 0) {
        throw new Error("no visibility data was given");
    };

    if (dataArray.length() == 0) {
        throw new Error("no data was given");
    };

    if (visibiltyArray.every(item => { typeof item != Number })) {
        throw new Error("visibiltyArray must only contain numbers");
    };
    if (visibiltyArray.length() != dataArray.length()) {
        throw new Error("visibiltyArray must be as long as dataArray, not more nor less");
    };

    var returnDataArray = [];

    for (let i = 0; i < visibiltyArray.length(); i++) {
        var returnData = {
            status: 0,
            data: ""
        };

        switch (visbilityFlag[i]) {
            case (0): {
                if (userContextID == dataOwnerID) {
                    returnData.status = 403, returnData.data = { "error": "private" }
                } else {
                    returnData.status = 200, returnData.data = dataArray[i];
                }
            }
            case (1): {
                returnData.status = 501, returnData.data = { "msg": "not implemented" }
            }
            case (2): {
                if (userContextID != undefined) {
                    returnData.status = 200, returnData.data = dataArray[i];
                }
                else {
                    returnData.status = 401, returnData.data = { "error": "must log in to view" }
                }
            }
            case (3): {
                returnData.status = 200, returnData.data = dataArray[i];
            }
            default: {
                returnData.status = 500, returnData.data = { "error": "attribute visibility out of range" };
            }
        };
        returnDataArray.push(returnData);
    };
    return returnDataArray;
};