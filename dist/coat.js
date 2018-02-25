"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Coat = /** @class */ (function () {
    function Coat(x, cmd) {
        if (cmd === void 0) { cmd = []; }
        this.x = x;
        this.original = JSON.parse(JSON.stringify(x));
        this.cmd = cmd;
    }
    /*public map(f: Func): Coat {
      return new Coat(f(this.x), this.cmd);
    }*/
    Coat.prototype.call = function (cmd, args) {
        var fixedArgs = args.map(calcSpecialArg(this.x, this.cmd));
        var command = makeCommand(cmd, fixedArgs);
        return new Coat(this.x, this.cmd.concat([command]));
    };
    Coat.prototype.set = function (field, value) {
        return this.call("_set", [field, value]);
    };
    Coat.prototype.get = function (field, callback) {
        var value = calcValue(this.x, this.cmd, field);
        callback({ value: value, coat: this });
        return this;
    };
    Coat.prototype.run = function () {
        // do changes
        this.cmd.map(runCommand(this.x));
        this.x = this.original;
    };
    return Coat;
}());
exports.Coat = Coat;
// allows an arg like '_width'
var calcSpecialArg = function (x, cmds) { return function (arg) {
    if (String(arg) !== arg) {
        return arg;
    }
    if (arg.charAt(0) === "_") {
        var cleanArg = arg.substr(1);
        return calcValue(x, cmds, cleanArg);
    }
    return arg;
}; };
var runCommand = function (x) { return function (cmd) {
    if (cmd.cmd.charAt(0) === "_") {
        return specialCommand(cmd, x);
    }
    return x[cmd.cmd].apply(x, cmd.args);
}; };
var specialCommand = function (cmd, x) {
    if (cmd.cmd === "_set") {
        if (cmd.args.length < 2) {
            throw new Error("Insufficient arguments passed to _set", cmd);
        }
        x[cmd.args[0]] = cmd.args[1];
    }
};
var makeCommand = function (cmd, args) { return ({
    cmd: cmd,
    args: args
}); };
// get initial value
var calcValue = function (x, cmds, field) {
    var initial = x[field];
    return cmds.reduce(function (total, cmd) {
        if (cmd.cmd !== "_set") {
            return total;
        }
        var newValue = findSet(field)(cmd);
        if (newValue !== null) {
            return newValue;
        }
        return total;
    }, initial);
};
var findSet = function (field) { return function (cmd) {
    if (cmd.args[0] === field) {
        return cmd.args[1];
    }
    return null;
}; };
