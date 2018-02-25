interface Command {
  cmd: CommandName;
  args: Args;
}
type CommandName = string;
type Args = any[];

type Func = (any: any) => any;

export class Coat {
  x: {};
  cmd: Command[];

  public constructor(x: {}, cmd: Command[] = []) {
    this.x = x;
    this.original = JSON.parse(JSON.stringify(x));
    this.cmd = cmd;
  }

  /*public map(f: Func): Coat {
    return new Coat(f(this.x), this.cmd);
  }*/

  public call(cmd: CommandName, args: Args) {
    const fixedArgs = args.map(calcSpecialArg(this.x, this.cmd));
    const command = makeCommand(cmd, fixedArgs);
    return new Coat(this.x, [...this.cmd, command]);
  }

  public set(field: string, value: any) {
    return this.call("_set", [field, value]);
  }

  public get(field, callback) {
    const value = calcValue(this.x, this.cmd, field);
    callback({ value, coat: this });
    return this;
  }

  public run() {
    // do changes
    this.cmd.map(runCommand(this.x));
    this.x = this.original;
  }
}

// allows an arg like '_width'
const calcSpecialArg = (x, cmds) => arg => {
  if (String(arg) !== arg) {
    return arg;
  }
  if (arg.charAt(0) === "_") {
    const cleanArg = arg.substr(1);
    return calcValue(x, cmds, cleanArg);
  }
  return arg;
};

const runCommand = x => (cmd: Command) => {
  if (cmd.cmd.charAt(0) === "_") {
    return specialCommand(cmd, x);
  }
  return x[cmd.cmd](...cmd.args);
};

const specialCommand = (cmd, x) => {
  if (cmd.cmd === "_set") {
    if (cmd.args.length < 2) {
      throw new Error("Insufficient arguments passed to _set", cmd);
    }
    x[cmd.args[0]] = cmd.args[1];
  }
};

const makeCommand = (cmd: CommandName, args: Args): Command => ({
  cmd,
  args
});

// get initial value
const calcValue = (x, cmds, field) => {
  const initial = x[field];
  return cmds.reduce((total, cmd) => {
    if (cmd.cmd !== "_set") {
      return total;
    }
    const newValue = findSet(field)(cmd);
    if (newValue !== null) {
      return newValue;
    }
    return total;
  }, initial);
};

const findSet = field => cmd => {
  if (cmd.args[0] === field) {
    return cmd.args[1];
  }
  return null;
};
