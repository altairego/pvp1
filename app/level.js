__class("Level" , {
    map: [],
    loot: [],
    loottable: [],
    players: [],
    player: [],
    prize: 0,
    isDown: [],
    fires: [],

    __construct: function(lvl, ondone) {
        var __this=this.__this;
        $.get('data/lvl'+lvl+'.dat',function(dt){
            var bloc = 'map';

            var _lines = dt.split("\n");
            var _re;
            for (var _l=0; _l<_lines.length; _l++) {
                if ( _re = /^\:([a-z0-9]+)$/.exec(_lines[_l]) ) {
                    bloc = _re[1];
                } else {
                    if (__this[bloc] == undefined) __this[bloc] = [];
                    if (__this[bloc].push) __this[bloc].push(_lines[_l]);
                    else __this[bloc] = _lines[_l];
                }
            }

            __this.prize = parseInt(__this.prize);

            __this.map.forEach(function(row,line){
                var cells = [ ];
                var cell = '';

                row = row.split('');
                col = 0;
                while ((cell = row.splice(0,2)).length) {
                    cells.push(__this.createCell(line, col, ...cell));
                    col ++;
                } /* */
                __this.map[line] = cells;
            });

            __this.loottable.forEach(function(row,line){
                var loot = /([a-z\-]+) ?([0-9]*)/.exec(row);
                __this.loottable[line] = {type: loot[1],load: parseInt(loot[2])};
            });

            console.log(__this);

            if (ondone) ondone();
        });

    },

    start: function () {
        var __this=this;
        $(document).keydown(function(e){
            var kb = App.keybind[e.key];

            if (kb) {
                if (kb.action == 'move') {
                    __this.player[kb.target].move(kb.dir);
                }
                if (kb.action == 'fire') {
                    __this.player[kb.target].fire();
                }
                __this.isDown.push(e.key);
            }
        });
        $(document).keyup(function(e){
            var kb = App.keybind[e.key];

            if (kb) {
                if (kb.action == 'move') {
                    __this.player[kb.target].stopmove(kb.dir);
                }
                __this.isDown = __this.isDown.filter(x => x != e.key);
            }
        });
        setInterval(function(){
            __this.isDown.forEach(function(k){
                var kb = App.keybind[k];

                if (kb && kb.action == 'move') {
                    __this.player[kb.target].move(kb.dir);
                }
            });
        },250);
    },

    createCell: function(line, col, tile, variant) {
        var __this=this;

        var cell = {name: "free", walk: true, variant: 'v'+ Math.ceil(Math.random()*4)};
        switch(tile) {
            case '#':
                cell.name = 'wall';
                cell.color = variant;
                cell.variant = App.variants[variant];
                cell.walk = false;
                break;
            case '*':
                cell.name = 'fence';
                cell.color = variant;
                cell.variant = App.variants[variant];
                cell.walk = false;
                break;
            case '$':
                var loots = ['f1','f2','f3','f4','t1','t2','p1','p2'];
                __this.loot.push({l:line, c:col, loot:loots[Math.floor(Math.random()*8)]});
                break;
            case 'p':
                cell.name = 'camp';
                cell.team = variant;
                __this.players.push(cell.team);
                __this.player[cell.team] = __new(
                    Player,
                    __this,
                    App.variants[variant], 
                    line, col
                );
                cell.variant = App.variants[variant];
                
                break;
            case '[':
                cell.name = 'gate';
                cell.direction = variant;
                cell.variant = App.variants[variant];
                break;
        }
        return cell;
    },

    display(board) {
        var __this = this;
        var $board = $(board);
        for(var l=0; l<__this.map.length; l++) {
            var $row = $('<div class="maprow"></div>');
            for(var c=0; c<__this.map[l].length; c++) {
                $row.append(
                    '<div class="maptile '
                    + __this.map[l][c].name +' '
                    + __this.map[l][c].variant +'"></div>'
                );
            }
            $board.append($row);
        }

        __this.players.forEach(function(player) {
            __this.player[player].display(board);
        });

        __this.loot.forEach(function(loot) {
            var $loot = $('<div class="loot '
                + loot.loot +'"></div>');
            $loot.css({left:(loot.c*32)+'px',top:(loot.l*32)+'px'});
            $board.append($loot);
        });
        
    },
	
	fire(player, dir) {
        var __this = this;
		if (!dir) dir = player.orient;
		var _fire = __new(
			Fire,
			__this,
			player, 
			player.l, player.c,
			dir
		);
		_fire.step();
		//__this.fires.push(_fire);
	}

});
