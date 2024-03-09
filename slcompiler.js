class Compiler {
  constructor() {
    this.code = '';
    this.index = 0;
  }

  compile(code) {
    this.code = code;
    this.index = 0;
    const compiledCode = this.compileExpression();
    return compiledCode;
  }

  compileExpression() {
    const expression = this.parseExpression();
    const compiledCode = this.compileExpressionCode(expression);
    return compiledCode;
  }

  compileExpressionCode(expression) {
    switch (expression.type) {
      case 'number':
        return `push ${expression.value}`;
      case 'variable':
        return `push ${expression.name}`;
      case 'binaryOperation':
        const leftCompiledCode = this.compileExpressionCode(expression.left);
        const rightCompiledCode = this.compileExpressionCode(expression.right);
        return `${leftCompiledCode}\n${rightCompiledCode}\n${expression.operator}`;
      case 'functionCall':
        const argsCompiledCode = expression.args.map(arg => this.compileExpressionCode(arg)).join('\n');
        return `${argsCompiledCode}\ncall ${expression.name}`;
      default:
        throw new Error(`Unknown expression type: ${expression.type}`);
    }
  }

  parseExpression() {
    const expression = this.parseNumber() || this.parseVariable() || this.parseBinaryOperation() || this.parseFunctionCall();
    return expression;
  }

  parseNumber() {
    const regex = /^\d+/;
    const match = regex.exec(this.code.substring(this.index));
    if (match) {
      const number = parseInt(match[0], 10);
      this.index += match[0].length;
      return {
        type: 'number',
        value: number,
      };
    }
    return null;
  }

  parseVariable() {
    const regex = /^[a-zA-Z]+/;
    const match = regex.exec(this.code.substring(this.index));
    if (match) {
      const variable = match[0];
      this.index += match[0].length;
      return {
        type: 'variable',
        name: variable,
      };
    }
    return null;
  }

  parseBinaryOperation() {
    const regex = /^([+-])/;
    const match = regex.exec(this.code.substring(this.index));
    if (match) {
      const operator = match[1];
      this.index += match[0].length;
      const left = this.parseExpression();
      const right = this.parseExpression();
      return {
        type: 'binaryOperation',
        operator: operator,
        left: left,
        right: right,
      };
    }
    return null;
  }

  parseFunctionCall() {
    const regex = /^([a-zA-Z]+)\(/;
    const match = regex.exec(this.code.substring(this.index));
    if (match) {
      const name = match[1];
      this.index += match[0].length;
      const args = [];
      while (this.code[this.index] !== ')') {
        args.push(this.parseExpression());
        if (this.code[this.index] === ',') {
          this.index++;
        }
      }
      this.index++;
      return {
        type: 'functionCall',
        name: name,
        args: args,
      };
    }
    return null;
  }
}

async function main() {
  const code = await readFile(path.join(__dirname, 'index.js'), 'utf-8');
  const compiler = new Compiler();
  const compiledCode = compiler.compile(code);
  console.log(compiledCode);
}

async function main() {
  const code = await readFile(path.join(__dirname, 'main.sl'), 'utf-8');
  const compiler = new Compiler();
  const compiledCode = compiler.compile(code);
  console.log(compiledCode);
}

main();
