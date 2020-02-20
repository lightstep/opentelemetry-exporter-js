/**
 * generates uuid for tracing
 */
export function generateLongUUID() {
  const p0 = `00000000${Math.abs((Math.random() * 0xffffffff) | 0).toString(
    16
  )}`.substr(-8);
  const p1 = `00000000${Math.abs((Math.random() * 0xffffffff) | 0).toString(
    16
  )}`.substr(-8);
  return `${p0}${p1}`;
}

/**
 *
 * @param hexStr
 */
export function hexToDec(hexStr: string): string {
  if (hexStr.substring(0, 2) === '0x') {
    hexStr = hexStr.substring(2);
  }
  hexStr = hexStr.toLowerCase();
  return convertBase(hexStr, 16, 10);
}

function add(x: number[], y: number[], base: number): number[] {
  const z = [];
  const n = Math.max(x.length, y.length);
  let carry = 0;
  let i = 0;
  while (i < n || carry) {
    const xi = i < x.length ? x[i] : 0;
    const yi = i < y.length ? y[i] : 0;
    const zi = carry + xi + yi;
    z.push(zi % base);
    carry = Math.floor(zi / base);
    i++;
  }
  return z;
}

function convertBase(str: string, fromBase: number, toBase: number): string {
  const digits = parseToDigitsArray(str, fromBase);
  if (digits === null) return '';

  let outArray: any[] = [];
  let power = [1];
  for (let i = 0; i < digits.length; i++) {
    // invariant: at this point, fromBase^i = power
    if (digits[i]) {
      outArray = add(
        outArray,
        multiplyByNumber(digits[i], power, toBase),
        toBase
      );
    }
    power = multiplyByNumber(fromBase, power, toBase);
  }

  let out = '';
  for (let i = outArray.length - 1; i >= 0; i--) {
    out += outArray[i].toString(toBase);
  }
  return out;
}

function multiplyByNumber(num: number, x: number[], base: number): number[] {
  if (num < 0) return [];
  if (num == 0) return [];

  let result: number[] = [];
  let power = x;
  while (true) {
    if (num & 1) {
      result = add(result, power, base);
    }
    num = num >> 1;
    if (num === 0) break;
    power = add(power, power, base);
  }

  return result;
}

function parseToDigitsArray(str: string, base: number): number[] | null {
  const digits = str.split('');
  const arr = [];
  for (let i = digits.length - 1; i >= 0; i--) {
    const n = parseInt(digits[i], base);
    if (isNaN(n)) {
      return null;
    }
    arr.push(n);
  }
  return arr;
}
