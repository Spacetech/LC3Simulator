class RET extends Instruction {

    getName() {
        return "RET";
    }

    getOperandCount() {
        return 0;
    }

    getInstructionBits(operands: Operand[]) {
        return "1100000111000000";
    }

    execute(program: Program, operands: Operand[]) {
        program.setProgramCounter(program.getRegister(7));
    }
}