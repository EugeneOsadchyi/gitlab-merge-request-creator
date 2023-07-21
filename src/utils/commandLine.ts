import util from 'node:util';
import { exec as execBase } from 'node:child_process';
import { removeTrailingNewline } from './utility';

type NamedArguments = Record<string, string>;

type CommandOutput = {
  stdout: string;
  stderr: string;
  code: number;
  cmd: string;
};

function parseNamedArguments(): NamedArguments {
  const args: string[] = process.argv.slice(2);
  const namedArgs: NamedArguments = {};

  for (let i = 0; i < args.length; i += 2) {
    const argName: string = args[i].replace(/^-+/, ''); // Remove leading dashes
    const argValue: string = args[i + 1];
    namedArgs[argName] = argValue;
  }

  return namedArgs;
}

const exec = util.promisify(execBase);

function printIfErrorAndExit({ code, cmd, stderr }: CommandOutput) {
  if (stderr) {
    const error = removeTrailingNewline(stderr);
    console.error(`Command: "${cmd}".\nResult: "${error}"`);
    process.exit(code);
  }
}

export {
  exec,
  parseNamedArguments,
  printIfErrorAndExit
}
