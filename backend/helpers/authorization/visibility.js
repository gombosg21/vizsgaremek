exports.determineVisibility = async (userContextID, dataOwnerID, visbilityFlag, data) => {
    //  visibility levels
    //  0 = private
    //  1 = friends only
    //  2 = registered only
    //  3 = public
    if (userContextID == null || undefined) { throw new Error("argument userContextID missing"); };
    if (typeof userContextID != "number") { throw new Error("userContextID must be an number"); };
    if (userContextID % 1 != 0) { throw new Error("userContextID must be a whole number"); };

    if (dataOwnerID == null || undefined) { throw new Error("argument dataOwnerID missing"); };
    if (typeof dataOwnerID != "number") { throw new Error("dataOwnerID must be an number"); };
    if (dataOwnerID < 0) { throw new Error("dataOwnerID must be a positive number"); };
    if (dataOwnerID % 1 != 0) { throw new Error("dataOwnerID must be a whole number"); };

    if (visbilityFlag == null || undefined) { throw new Error("argument visbilityFlag missing"); };
    if (typeof visbilityFlag != "number") { throw new Error("visbilityFlag must be an number"); };
    if (visbilityFlag % 1 != 0) { throw new Error("visbilityFlag must be a whole number"); };
    if (3 < visbilityFlag || visbilityFlag < 0) { throw new Error("visbilityFlag must be in range of 0-3"); };

    if (data == undefined) { throw new Error("argument data missing"); };
    // this is stupid
    if (Object.prototype.toString.call(data) != '[object Object]') { throw new Error("data must be a JSON object"); };
    if (Object.keys(data).length == 0) { throw new Error("data cannot be an empty JSON object"); };
    if (!(data.hasOwnProperty('ID'))) { throw new Error("data must have a field 'ID'"); };

    const returnData = {
        status: 0,
        data: ""
    };

    switch (visbilityFlag) {
        case 0: {
            if (userContextID != dataOwnerID) {
                returnData.status = 403, returnData.data = { "ID": data.ID, "msg": "private content" };
                break;
            } else {
                returnData.status = 200, returnData.data = data;
                break;
            };
        }
        case 1: {
            if (userContextID == dataOwnerID) {
                returnData.status = 200, returnData.data = data;
                break;
            };

            returnData.status = 501, returnData.data = { "ID": data.ID, "msg": "not implemented" };
            break;
        }
        case 2: {
            if (userContextID != undefined) {
                returnData.status = 200, returnData.data = data;
                break;
            } else {
                returnData.status = 401, returnData.data = { "ID": data.ID, "msg": "registered members only" };
                break;
            };
        }
        case 3: {
            returnData.status = 200, returnData.data = data;
            break;
        }
        default: {
            returnData.status = 500, returnData.data = { "ID": data.ID, "error": "server-side error" };
            break;
        };
    };
    return returnData;
};



exports.determineArrayVisibility = async (userContextID, dataOwnerID, visibiltyArray, dataArray) => {
    //  visibility levels
    //  0 = private
    //  1 = friends only
    //  2 = registered only
    //  3 = public
    if (userContextID == null || undefined) { throw new Error("argument userContextID missing"); };
    if (typeof userContextID != "number") { throw new Error("userContextID must be an number"); };
    if (userContextID % 1 != 0) { throw new Error("userContextID must be a whole number"); };

    if (dataOwnerID == null || undefined) { throw new Error("argument dataOwnerID missing"); };
    if (typeof dataOwnerID != "number") { throw new Error("dataOwnerID must be an number"); };
    if (dataOwnerID % 1 != 0) { throw new Error("dataOwnerID must be a whole number"); };
    if (dataOwnerID < 0) { throw new Error("dataOwnerID must be a positive number"); };

    if (visibiltyArray == null || undefined) { throw new Error("argument visbilityFlag missing"); };
    if (!(visibiltyArray instanceof Array)) { throw new Error("visibiltyArray must be an Array") };
    if (visibiltyArray.length == 0) { throw new Error("visibiltyArray cannot be an empty array"); };
    visibiltyArray.forEach(visibility => {
        if (typeof visibility != "number") { throw new Error("visibiltyArray can only contain numbers"); };
        if (visibility % 1 != 0) { throw new Error("visibiltyArray can only contain whole numbers"); };
        if (visibility < 0 || visibility > 3) { throw new Error("visibiltyArray can only contain vaules between 0-3"); };
    });

    if (!(dataArray instanceof Array)) { throw new Error("dataArray must be an Array") };
    if (dataArray.length == 0) { throw new Error("dataArray cannot be an empty array"); };
    dataArray.forEach(data => {
        if (Object.prototype.toString.call(data) != '[object Object]') { throw new Error("dataArray can only contain JSON objects") };
        if (Object.keys(data).length == 0) { throw new Error("dataArray cannot contain an empty JSON object"); };
        if (!(data.hasOwnProperty('ID'))) { throw new Error("dataArray objects must have a field 'ID'"); };
    });

    if (visibiltyArray.length != dataArray.length) {
        throw new Error("visibiltyArray must be as long as dataArray, not more nor less");
    };

    const returnDataArray = [];

    for (let i = 0; i < visibiltyArray.length; i++) {

        //  internally associate visibility with data
        switch (visibiltyArray[i]) {
            case (0): {
                if (userContextID != dataOwnerID) {
                    returnDataArray.push({ "ID": dataArray[i].ID, "msg": "private content" });
                    break;
                } else {
                    returnDataArray.push(dataArray[i]);
                    break;
                }
            }
            case (1): {
                if (userContextID == dataOwnerID) {
                    returnDataArray.push(dataArray[i]);
                    break;
                };
                returnDataArray.push({ "ID": dataArray[i].ID, "msg": "not implemented" });
                break;
            }
            case (2): {
                if (userContextID != undefined) {
                    returnDataArray.push(dataArray[i]);
                    break;
                } else {
                    returnDataArray.push({ "ID": dataArray[i].ID, "msg": "registered members only" });
                    break;
                };
            }
            case (3): {
                returnDataArray.push(dataArray[i]);
                break;
            }
            default: {
                returnDataArray.push({ "ID": dataArray[i].ID, "error": "server-side error" });
                break;
            };
        };
    };
    return returnDataArray;
};



exports.determineMixedArrayVisibility = async (userContextID, dataOwnerIDArray, visibiltyArray, dataArray) => {
    //  visibility levels
    //  0 = private
    //  1 = friends only
    //  2 = registered only
    //  3 = public
    if (userContextID == null || undefined) { throw new Error("argument userContextID missing"); };
    if (typeof userContextID != "number") { throw new Error("userContextID must be an number"); };
    if (userContextID % 1 != 0) { throw new Error("userContextID must be a whole number"); };

    if (dataOwnerIDArray == null || undefined) { throw new Error("argument dataOwnerIDArray missing"); };
    if (!(dataOwnerIDArray instanceof Array)) { throw new Error("dataOwnerIDArray must be an array"); };
    dataOwnerIDArray.forEach(ownerID => {
        if (typeof ownerID != "number") { throw new Error("dataOwnerIDArray can only contain numbers"); };
        if (ownerID % 1 != 0) { throw new Error("dataOwnerIDArray can only contain whole numbers"); };
        if (ownerID < 0) { throw new Error("dataOwnerIDArray can only contain vaules above 0"); };
    });


    if (visibiltyArray == null || undefined) { throw new Error("argument visibiltyArray missing"); };
    if (!(visibiltyArray instanceof Array)) { throw new Error("visibiltyArray must be an array") };
    if (visibiltyArray.length == 0) { throw new Error("visibiltyArray cannot be an empty array"); };
    visibiltyArray.forEach(visibility => {
        if (typeof visibility != "number") { throw new Error("visibiltyArray can only contain numbers"); };
        if (visibility % 1 != 0) { throw new Error("visibiltyArray can only contain whole numbers"); };
        if (visibility < 0 || visibility > 3) { throw new Error("visibiltyArray can only contain vaules between 0-3"); };
    });

    if (!(dataArray instanceof Array)) { throw new Error("dataArray must be an Array") };
    if (dataArray.length == 0) { throw new Error("dataArray cannot be an empty array"); };
    dataArray.forEach(data => {
        if (Object.prototype.toString.call(data) != '[object Object]') { throw new Error("dataArray can only contain JSON objects") }
        if (Object.keys(data).length == 0) { throw new Error("dataArray cannot contain an empty JSON object"); };
        if (!(data.hasOwnProperty('ID'))) { throw new Error("dataArray objects must have a field 'ID'"); };
    });

    if (visibiltyArray.length != dataArray.length) {
        throw new Error("visibiltyArray must be as long as dataArray, not more nor less");
    };

    // internally associate visibiltyArray with dataArray
    const returnDataArray = [];

    for (let i = 0; i < visibiltyArray.length; i++) {

        switch (visibiltyArray[i]) {
            case (0): {
                if (userContextID != dataOwnerIDArray[i]) {
                    returnDataArray.push({ "ID": dataArray[i].ID, "error": "private content" });
                    break;
                } else {
                    returnDataArray.push(dataArray[i]);
                    break;
                };
            }
            case (1): {
                if (userContextID == dataOwnerIDArray[i]) {
                    returnDataArray.push(dataArray[i]);
                    break;
                };
                returnDataArray.push({ "ID": dataArray[i].ID, "msg": "not implemented" });
                break;
            }
            case (2): {
                if (userContextID != undefined) {
                    returnDataArray.push(dataArray[i]);
                    break;
                } else {
                    returnDataArray.push({ "ID": dataArray[i].ID, "error": "registered members only" });
                    break;
                };
            }
            case (3): {
                returnDataArray.push(dataArray[i]);
                break;
            }
            default: {
                returnDataArray.push({ "ID": dataArray[i].ID, "error": "server-side error" });
                break;
            };
        };
    };
    return returnDataArray;
};