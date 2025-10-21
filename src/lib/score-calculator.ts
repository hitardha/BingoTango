
export const scoreWeights = {
    "3": {
        cell: 1,
        line: 10,
        nMinus1: 3,
        nMinus2: 0, // Not applicable for 3x3
        corners: 0, // Not applicable for 3x3
    },
    "4": {
        cell: 1,
        line: 25,
        nMinus1: 5,
        nMinus2: 2,
        corners: 15,
    },
    "5": {
        cell: 1,
        line: 50,
        nMinus1: 10,
        nMinus2: 3,
        corners: 25,
    }
};

    