class Instruction {

    getName() {
        return "";
    }

    getOperandCount() {
        return 0;
    }

    getInstructionBits(operands: Operand[]) {
        return "0";
    }

    areValidOperands(operands: Operand[]) {
        return true;
    }

    execute(program: Program, operands: Operand[]) {

    }

}
