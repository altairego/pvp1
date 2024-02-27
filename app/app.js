
var App = {
    variants: {
        r: 'red',
        g: 'green',
        b: 'blue',
        y: 'yellow',
        n: 'north',
        s: 'south',
        e: 'est',
        w: 'west',
        '*': 'common',
        '#': 'common',
        '$': 'common'
    },
    deltas: {
        n: {l:-1,c:0},
        s: {l:1,c:0},
        e: {l:0,c:1},
        w: {l:0,c:-1}
    },
    keybind: {
        ArrowLeft: {action: 'move', target: 'b', dir: 'w'},
        ArrowDown: {action: 'move', target: 'b', dir: 's'},
        ArrowRight: {action: 'move', target: 'b', dir: 'e'},
        ArrowUp: {action: 'move', target: 'b', dir: 'n'},
        Shift: {action: 'fire', target: 'b'},

        q: {action: 'move', target: 'r', dir: 'w'},
        x: {action: 'move', target: 'r', dir: 's'},
        d: {action: 'move', target: 'r', dir: 'e'},
        z: {action: 'move', target: 'r', dir: 'n'},
        w: {action: 'fire', target: 'r'},
        
        '4': {action: 'move', target: 'g', dir: 'w'},
        '2': {action: 'move', target: 'g', dir: 's'},
        '6': {action: 'move', target: 'g', dir: 'e'},
        '8': {action: 'move', target: 'g', dir: 'n'},
        Enter: {action: 'fire', target: 'g'},
        
        b: {action: 'move', target: 'y', dir: 'w'},
        n: {action: 'move', target: 'y', dir: 's'},
        j: {action: 'move', target: 'y', dir: 'e'},
        h: {action: 'move', target: 'y', dir: 'n'},
        " ": {action: 'fire', target: 'y'},
        
    },
    tick: 350
};
