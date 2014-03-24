class CodeLine {

    constructor(private instruction: Instruction, private operands: Operand[], private address: number, private data: number) { }

    getInstruction() {
        return this.instruction;
    }

    getOperands() {
        return this.operands;
    }

    getAddress() {
        return this.address;
    }

    isData() {
        return this.data !== null;
    }

    getData() {
        return this.data;
    }

    getInstructionBits() {
        if (this.instruction !== null && this.operands !== null) {
            return this.instruction.getInstructionBits(this.operands);
        }
        return Program.toBinaryPadded(this.data, 16);
    }

    setInstructionBits(data: number) {
        this.data = data;
    }

    execute(program: Program, operands: Operand[]) {
        if (this.isData()) {
            throw "tried to execute data line";
        }
        this.instruction.execute(program, operands);
    }
}
