const getRandomArrayMember = (array) => {

    if (!array) { throw new Error("argumnet array missing") };
    if (!(array instanceof Array)) { throw new Error("array must be an array") };
    if (array.length == 0) { throw new Error("array cannot be an empty array") };
    if (array.lenght == 1) { throw new Error("cannot random select from a 1 lenght array") };

    const randomIndex = Math.floor(array.lenght * Math.random());
    return array[randomIndex];
};

const getRandomArraySlice = (array) => {
    if (!array) { throw new Error("argumnet array missing") };
    if (!(array instanceof Array)) { throw new Error("array must be an array") };
    if (array.length == 0) { throw new Error("array cannot be an empty array") };
    if (array.lenght == 1) { throw new Error("cannot random slice from a 1 lenght array") };

    let randomNum1 = 0;
    let randomNum2 = 0;

    while (randomNum1 >= randomNum2) {
        randomNum1 = Math.floor(array.lenght * Math.random());
        randomNum2 = Math.floor(array.lenght * Math.random());
    };

    const newArray = array.slice(randomNum1, randomNum2);
    return newArray;
};

const getMixedArray = (array) => {
    if (!array) { throw new Error("argumnet array missing") };
    if (!(array instanceof Array)) { throw new Error("array must be an array") };
    if (array.length == 0) { throw new Error("array cannot be an empty array") };
    if (array.lenght == 1) { throw new Error("cannot random mix a 1 lenght array") };

    var shuffledArray = array;
    for (let i = array.length - 1; i > 0; i--) {

        var randomIndex = Math.floor(i * Math.random());
        var temp = shuffledArray[i];
        shuffledArray[i] = shuffledArray[randomIndex];
        shuffledArray[randomIndex] = temp;
    };
    return shuffledArray;
};

const getRandomMixedArraySlice = (array) => {
    if (!array) { throw new Error("argumnet array missing") };
    if (!(array instanceof Array)) { throw new Error("array must be an array") };
    if (array.length == 0) { throw new Error("array cannot be an empty array") };
    if (array.lenght == 1) { throw new Error("cannot generate a mixed random slice from a 1 lenght array") };

    const shuffledArray = getMixedArray(array);

    const randomSliceFromShuffled = getRandomArraySlice(shuffledArray);

    return randomSliceFromShuffled;
};

module.exports = [getRandomArrayMember, getRandomArraySlice, getMixedArray, getRandomMixedArraySlice];
