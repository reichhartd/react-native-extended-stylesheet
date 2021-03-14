/**
 * Detects operation in string
 * Supports: '*', '+', '-'
 */

const operators = {
  '*': (v1:any, v2:any) => v1 * v2,
  '+': (v1:any, v2:any) => v1 + v2,
  '-': (v1:any, v2:any) => v1 - v2,
  '/': (v1:any, v2:any) => v1 / v2,
};

export default {
  isOperation,
  exec,
};

/**
 * Is operation in string: '0.25 * $abc' => {operator: '*', v1: '0.25', v2: '$abc'}
 * @param {String} str
 */
function isOperation(str:any) {
  let opInfo : any = findOperator(str);
  if (opInfo) {
    opInfo.v1 = str.substr(0, opInfo.pos).trim();
    opInfo.v2 = str.substr(opInfo.pos + 1).trim();
    delete opInfo.pos;
    return opInfo;
  } else {
    return false;
  }
}

/**
 * Executes operation
 * @param {Object} opInfo
 */
function exec(opInfo:any) {
  assertOperator(opInfo.operator);
  assertValue(opInfo.v1);
  assertValue(opInfo.v2);
  if (opInfo.operator === '/') {
    assertDivisor(opInfo.v2);
  }
  let fn = (operators as any)[opInfo.operator];
  return fn(opInfo.v1, opInfo.v2);
}

function findOperator(str:any) {
  for (let operator in operators) {
    let pos = str.indexOf(operator);
    if (pos >= 0) {
      return {operator, pos};
    }
  }
}

function assertOperator(operator:any) {
  if (!(operators as any)[operator]) {
    throw new Error('Unknown operator: ' + operator);
  }
}

function assertValue(value:any) {
  if (typeof value !== 'number') {
    throw new Error('Operation value should be number, you try: ' + String(value));
  }
}

function assertDivisor(divisor:any) {
  if (divisor === 0) {
    throw new Error('Operation divisor should not be zero');
  }
}
