exports.determineVisibility = (userContextID,dataOwnerID,visbilityFlag,data) => {

    if(visbilityFlag.typeOf() != Int) {
        throw new Error ("visbilityFlag must be an integer")
    };

    var returnData = {
        status : 0,
        data: ""
    };

    switch (visbilityFlag) {
        case (0): {
            if (userContextID == dataOwnerID) {
                returnData.status = 403, returnData.data = {"error":"private"}
            } else {
                returnData.status = 200, returnData.data = data;
            }
        }
        case (1): {
            returnData.status = 501, returnData.data = {"msg":"not implemented"}
        }
        case (2): {
            if (userContextID != undefined) {
                returnData.status = 200, returnData.data = data;
            }
            else {
                returnData.status = 401, returnData.data = {"error":"must log in to view"}
            }
        }
        case (3): {
            returnData.status = 200, returnData.data = data;
        }
        default: {
            returnData.status = 500, returnData.data = {"error":"attribute visibility out of range"};
        }
    }
   return returnData;
};