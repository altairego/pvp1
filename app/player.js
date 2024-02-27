__class("Player" , {
    l: 0,
    c: 0,
    team: '',
    id: 'player',
    $jq: null,
    map: null,
    nextmove: null,
    moving: false,
    orient: 's',
    loots: {fruits:[0,0,0,0],potions:0,kills:0,killed:0,treasure:0},
    __construct: function(map, team, l, c) {
        var __this = this.__this;
        __this.map = map;
        __this.team = team;
        __this.id = 'player-'+team;
        __this.$jq = $('<div id="'+__this.id+'" class="player '+team+'"></div>');
        __this.place(l, c);
    },
    place(l, c) {
        this.l = l;
        this.c = c;
        this.$jq.css({left:(this.c*32)+'px',top:(this.l*32-4)+'px',zIndex: l+100});
    },
    stopmove(dir) {
        var __this=this;
        if (__this.nextmove == dir) __this.nextmove = null;
    },
    fire() {
		this.map.fire(this, this.orient);
    },
    move(dir) {
        var __this=this;

        if (__this.moving) {
            __this.nextmove = dir;
            return;
        }

        __this.$jq.removeClass('north est west south');
        __this.$jq.addClass(App.variants[dir]);
        var nl = __this.l + App.deltas[dir].l;
        var nc = __this.c + App.deltas[dir].c;
        if (!__this.map.map[nl][nc].walk) {
            __this.$jq.removeClass('walking');
            return;
        }

        __this.orient = __this.moving = dir;
        __this.l += App.deltas[dir].l;
        __this.c += App.deltas[dir].c;
        __this.$jq.addClass('walking');
        __this.$jq.animate(
            {left:(__this.c*32)+'px',top:(__this.l*32-4)+'px',zIndex: __this.l+100}, 
            {
                duration: App.tick,
                easing: 'linear',
                complete: function(){
                    __this.moving = false;
                    if (__this.nextmove) {
						var nm = __this.nextmove;
                        __this.nextmove = null;
                        __this.move(nm);
                    } else 
                        __this.$jq.removeClass('walking');
                }
            }
        );
    },
    display(board) {
        $(board).append(this.$jq);
    }
});