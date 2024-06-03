const _console = { ...console };

console.log = () => {};
console.warn = () => {};
console.error = () => {};
console.debug = () => {};
console.info = () => {};

const print = (...msgs: any[]) => {
  _console.log(...msgs);
};
const printn = (...msgs: any[]) => {
  _console.log(...msgs);
  _console.log();
};

export const log = {
  print,
  printn,
};
