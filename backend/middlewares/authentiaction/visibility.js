exports.determineVisibility = (userContextID, dataOwnerID, visbilityFlag, data) => {
    //
    //  visibility levels
    //  0 = private
    //  1 = friends only
    //  2 = registered only
    //  3 = public
    //
    if (typeof userContextID != "number") {
        throw new Error("userContextID must be an number");
    };
    if (typeof dataOwnerID != "number") {
        throw new Error("dataOwnerID must be an number");
    };
    if (typeof visbilityFlag != "number") {
        throw new Error("visbilityFlag must be an number");
    };

    if (3 < visbilityFlag || visbilityFlag < 0) {
        throw new Error("visbilityFlag must be in range of 0-3");
    };

    if (data == undefined) {
        throw new Error("no data was given");
    };

    var returnData = {
        status: 0,
        data: ""
    };

    switch (visbilityFlag) {
        case 0: {
            if (userContextID != dataOwnerID) {
                returnData.status = 403, returnData.data = { "error": "private" };
                break;
            } else {
                returnData.status = 200, returnData.data = data;
                break;
            };
        }
        case 1: {
            returnData.status = 501, returnData.data = { "msg": "not implemented" };
            break;
        }
        case 2: {
            if (userContextID != undefined) {
                returnData.status = 200, returnData.data = data;
                break;
            }
            else {
                returnData.status = 401, returnData.data = { "error": "must log in to view" };
                break;
            }
        }
        case 3: {
            returnData.status = 200, returnData.data = data;
            break;
        }
        default: {
            returnData.status = 500, returnData.data = { "error": "attribute visibility out of range" };
            break;
        }
    };
    return returnData;
};

exports.determineArrayVisibility = (userContextID, dataOwnerID, visibiltyArray, dataArray) => {

    //
    //  visibility levels
    //  0 = private
    //  1 = friends only
    //  2 = registered only
    //  3 = public
    //
    if (visibiltyArray.length == 0) {
        throw new Error("no visibility data was given");
    };

    if (dataArray.length == 0) {
        throw new Error("no data was given");
    };

    if (visibiltyArray.every(item => { typeof item != "number" })) {
        throw new Error("visibiltyArray must only contain numbers");
    };
    if (visibiltyArray.length != dataArray.length) {
        throw new Error("visibiltyArray must be as long as dataArray, not more nor less");
    };

    var returnDataArray = [];

    for (let i = 0; i < visibiltyArray.length; i++) {
        var returnData = {
            status: 0,
            data: ""
        };

        switch (visibiltyArray[i]) {
            case (0): {
                if (userContextID == dataOwnerID) {
                    returnData.status = 403, returnData.data = { "error": "private" };
                    break;
                } else {
                    returnData.status = 200, returnData.data = dataArray[i];
                    break;
                }
            }
            case (1): {
                returnData.status = 501, returnData.data = { "msg": "not implemented" };
                break;
            }
            case (2): {
                if (userContextID != undefined) {
                    returnData.status = 200, returnData.data = dataArray[i];
                    break;
                }
                else {
                    returnData.status = 401, returnData.data = { "error": "must log in to view" };
                    break;
                }
            }
            case (3): {
                returnData.status = 200, returnData.data = dataArray[i];
                break;
            }
            default: {
                returnData.status = 500, returnData.data = { "error": "attribute visibility out of range" };
                break;
            }
        };
        returnDataArray.push(returnData);
    };
    return returnDataArray;
};