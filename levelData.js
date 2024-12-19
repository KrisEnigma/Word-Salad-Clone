export const LEVELS = {
    'chess': {
        name: 'Piezas de ajedrez',
        wordPaths: {
            'PAWN': ['a1', 'a2', 'a3', 'b3'],
            'QUEEN': ['d4', 'c4', 'b4', 'a4', 'b3'],
            'KING': ['c3', 'c2', 'b3', 'b2'],
            'KNIGHT': ['c3', 'b3', 'c2', 'b2', 'c1', 'd1'],
            'BISHOP': ['d3', 'c2', 'd2', 'c1', 'b1', 'a1']
        }
    },
    'planets': {
        name: 'Planetas',
        wordPaths: {
            'MARS': ['c4', 'b3', 'c3', 'b4'],
            'MERCURY': ['c4', 'd4', 'c3', 'd2', 'c2', 'd1', 'c1'],
            'NEPTUNE': ['a3', 'a2', 'b1', 'b2', 'c2', 'd3', 'd4'],
            'SATURN': ['b4', 'b3', 'b2', 'c2', 'c3', 'd3'],
            'URANUS': ['c2', 'c3', 'b3', 'a3', 'a4', 'b4'],
            'VENUS': ['a1', 'a2', 'a3', 'a4', 'b4']
        }
    }
};

export const LEVEL_ORDER = ['chess', 'planets'];
