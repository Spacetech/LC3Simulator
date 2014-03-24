class STR extends Instruction {

    getName() {
        return "STR";
    }

    getOperandCount() {
        return 3;
    }

    getInstructionBits(operands: Operand[]) {
        return "0111" + Program.toBinaryPadded(operands[0].getRegisterNumber(), 3) + Program.toBinaryPadded(operands[1].getRegisterNumber(), 3) + Program.toBinaryPadded(operands[2].getLabelAddressOffset(), 6);
    }

    areValidOperands(operands: Operand[]) {
        return operands[0].isRegisterNumber() && operands[1].isRegisterNumber() && operands[2].isImmediate();
    }

    execute(program: Program, operands: Operand[]) {
        program.setInstructionBits((program.getRegister(operands[1].getRegisterNumber()) + operands[2].getImmediate()), program.getRegister(operands[0].getRegisterNumber()));
    }

}
