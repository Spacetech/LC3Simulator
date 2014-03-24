class LDI extends Instruction {

    getName() {
        return "LDI";
    }

    getOperandCount() {
        return 2;
    }

    getInstructionBits(operands: Operand[]) {
        return "1010" + Program.toBinaryPadded(operands[0].getRegisterNumber(), 3) + Program.toBinaryPadded(operands[1].getLabelAddressOffset(), 9);
    }

    areValidOperands(operands: Operand[]) {
        return operands[0].isRegisterNumber() && operands[1].isLabelAddress();
    }

    execute(program: Program, operands: Operand[]) {
        program.setRegister(operands[0].getRegisterNumber(), program.getInstructionBits(program.getInstructionBits(operands[1].getLabelAddressOffset())));
    }

}
