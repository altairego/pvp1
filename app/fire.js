__class("Fire" , {
    l: 0,
    c: 0,
    owner: null,
    $jq: null,
    map: null,
    dir: null,
    loots: {fruits:[0,0,0,0],potions:0,kills:0,killed:0,treasure:0},
    __construct: function(map, player, l, c, dir) {
        var __this = this.__this;
        __this.map = map;
        __this.owner = player;
        __this.dir = dir;
        __this.l = l;
        __this.c = c;
        __this.id = 'fire-'+player.team+'-'+(++Fire.num);
        __this.$jq = $('<div id="'+__this.id+'" class="fire '+player.team+' '+App.variants[dir]+'"></div>');
        __this.$jq.appendTo($("#display"));

		__this.$jq.data('obj', __this);

        __this.place(l, c);
    },
    place(l, c) {
        this.l = l;
        this.c = c;
        this.$jq.css({left:(this.c*32)+'px',top:(this.l*32-4)+'px',zIndex: l+101});
    },
    step() {
        var __this=this;

        var nl = __this.l + App.deltas[__this.dir].l;
        var nc = __this.c + App.deltas[__this.dir].c;
        if (!__this.map.map[nl][nc].walk) {
			__this.$jq.remove();
			
            return;
        }

        __this.l += App.deltas[__this.dir].l;
        __this.c += App.deltas[__this.dir].c;

        __this.$jq.animate(
            {left:(__this.c*32)+'px',top:(__this.l*32-4)+'px',zIndex: __this.l+100}, 
            {
                duration: App.tick/4,
                easing: 'linear',
                complete: function(){
					__this.step();
                }
            }
        );
    },
    display(board) {
        $(board).append(this.$jq);
    }
});
Fire.num = 0;