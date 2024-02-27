/**
 * USE :
 * var myDb = LocalDatabase(db_name [, default_data_and_specific_methods[, should_it_be_saved_at_init] ])
 *
 *  myDb.<mydata> = ...;
 *  myDb.save();
 *
 *  myDb
 *      .record('a-list-name', {[id: ...,] ...} [, _auto_save])
 *      .record('a-list-name', {[id: ...,] ...} [, _auto_save])
 *      [.save()]
 *
 *  myDb.delete('a-list-name', _id [, _auto_save]);
 *
 */

        var LocalDatabase = (function(){
            var _salt;
            if (localStorage._localDatabase_salt){
                _salt = localStorage._localDatabase_salt.split(',');
                _salt[0] = parseInt(_salt[0]);
                _salt[1] = parseInt(_salt[1]);
            } else _salt = [0,0];
            var autoId = function (_d,_t) {

                var ret =
                    _d.substr(0,2).toUpperCase()+
                    _t.substr(0,2).toLowerCase()+
                    Date.now().toString(16).substr(-8,7)+
                    String.fromCharCode(_salt[0] + 65,_salt[1] + 65)
                    //+String.fromCharCode(Math.random()*25+65)
                    ;

                _salt[1] ++;
                if (_salt[1]>25) {
                    _salt[0] = (_salt[0]+1) % 26;
                    _salt[1] = 0;
                }
                localStorage._localDatabase_salt = _salt.join(',');
                return ret;
            }

            return function(_name, _init, _autosave) {
                if (_autosave === undefined) _autosave = true;
                var _db = {
                    name: _name,
                    data: {}
                };

                if (_init) {
                    _db.data = _init;
                }

                if (localStorage['ldb__'+_name]) {
                    var _db_data = JSON.parse(localStorage['ldb__'+_name]);
                    for(_d in _db_data)
                        _db.data[_d] = _db_data[_d];
                }


                _db.data.instance = function(){ return _db;};
                _db.data.save = function(){
                    localStorage['ldb__'+_name] = JSON.stringify(_db.data);
                    return this;
                };
                _db.data.find = function(_lst, _fld, _val) {
                    for (_i in _db.data[_lst]) {
                        if (_db.data[_lst][_i][_fld] && _db.data[_lst][_i][_fld] === _val) {
                            _db.data[_lst][_i]._idx = _i;
                            return _db.data[_lst][_i];
                        }
                    }
                    return null;
                };
                _db.data.filter = function(_lst, _fld, _val) {
                    var res = [];
                    for (_i in _db.data[_lst]) {
                        if (_db.data[_lst][_i][_fld] && ( (_val === undefined) || (_db.data[_lst][_i][_fld] === _val) ) ) {
                            _db.data[_lst][_i]._idx = _i;
                            res.push(_db.data[_lst][_i]);
                        }
                    }
                    return res;
                };
                _db.data.regexp = function(_lst, _fld, _re) {
                    var res = [];
                    for (_i in _db.data[_lst]) {
                        if (_db.data[_lst][_i][_fld] && _re.test(_db.data[_lst][_i][_fld]) ) {
                            _db.data[_lst][_i]._idx = _i;
                            res.push(_db.data[_lst][_i]);
                        }
                    }
                    return res;
                };
                _db.data.get = function(_lst, _id) { // eq to find(_lst, 'id', _id)
                    for (_i in _db.data[_lst]) {
                        if (_db.data[_lst][_i].id === _id) {
                            _db.data[_lst][_i]._idx = _i;
                            return _db.data[_lst][_i];
                        }
                    }
                    return null;
                };
                _db.data.delete = function(_lst, _id, _autosave) { // eq to find(_lst, 'id', _id)
                    if (_autosave === undefined) _autosave = true;
                    for (_i in _db.data[_lst]) {
                        if (_db.data[_lst][_i].id === _id) {
                            _db.data[_lst][_i]._idx = _i;
                            ret = _db.data[_lst].splice(_i,1)[0];
                            if(_autosave) this.save();
                            return ret;
                        }
                    }
                    return null;
                };
                _db.data.record = function(_lst, _record, _autosave) {
                    if (_autosave === undefined) _autosave = true;
                    if (!_record.id) _record.id = autoId(_name, _lst);

                    for (_i in _db.data[_lst]) {
                        if (_db.data[_lst][_i].id === _record.id) {
                            _db.data[_lst][_i] = _record;
                            return _autosave?this.save():this;
                        }
                    }
                    _db.data[_lst].push( _record );
                    return _autosave?this.save():this;
                };

                return _autosave?_db.data.save():_db.data;
            }
        })();
