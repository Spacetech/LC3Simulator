class ST extends Instruction {

    getName() {
        return "ST";
    }

    getOperandCount() {
        return 2;
    }

    getInstructionBits(operands: Operand[]) {
        return "0011" + Program.toBinaryPadded(operands[0].getRegisterNumber(), 3) + Program.toBinaryPadded(operands[1].getLabelAddressOffset(), 9);
    }

    areValidOperands(operands: Operand[]) {
        return operands[0].isRegisterNumber() && operands[1].isLabelAddress();
    }

    execute(program: Program, operands: Operand[]) {
        program.setInstructionBits((program.getProgramCounter() + operands[1].getLabelAddressOffset()), program.getRegister(operands[0].getRegisterNumber()));
    }

}
