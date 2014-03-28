class LDR extends Instruction {

    getName() {
        return "LDR";
    }

    getOperandCount() {
        return 3;
    }

    getInstructionBits(operands: Operand[]) {
        return "0110" + Program.toBinaryPadded(operands[0].getRegisterNumber(), 3) + Program.toBinaryPadded(operands[1].getRegisterNumber(), 3) + Program.toBinaryPadded(operands[2].getImmediate(), 6);
    }

    areValidOperands(operands: Operand[]) {
        return operands[0].isRegisterNumber() && operands[1].isRegisterNumber() && operands[2].isImmediate();
    }

    execute(program: Program, operands: Operand[]) {
        program.setRegister(operands[0].getRegisterNumber(), program.getInstructionBits(program.getRegister(operands[1].getRegisterNumber()) + operands[2].getImmediate()));
    }

}
