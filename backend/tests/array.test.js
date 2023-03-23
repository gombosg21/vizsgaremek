const array = require('../helpers/seeding/array');

const sampleArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];

test('getRanodmArrayMember callable', () => {
    expect(array.getRandomArrayMember instanceof Function).toBe(true);
});

test('getRanodmArrayMember requires input', () => {
    try {
        expect(array.getRandomArrayMember()).toThrow(Error);
    } catch (error) {
    };
});

test('getRanodmArrayMember needs specific input', () => {
    try {
        expect(array.getRandomArrayMember(2131341)).toThrow(TypeError);
    } catch (error) {
    };
});

test('getRanodmArrayMember returns', () => {
    expect(array.getRandomArrayMember(sampleArray)).toBeTruthy();
});

test('getRanodmArrayMember doesnt return the same item', () => {
    expect(array.getRandomArrayMember(sampleArray)).not.toEqual(sampleArray);
});

test('getRanodmArrayMember returns one item from its input array', () => {
    expect(sampleArray.includes(array.getRandomArrayMember(sampleArray))).toBe(true);
});