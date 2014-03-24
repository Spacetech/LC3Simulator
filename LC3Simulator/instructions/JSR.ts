class JSR extends Instruction {

    getName() {
        return "JSR";
    }

    getOperandCount() {
        return 1;
    }

    getInstructionBits(operands: Operand[]) {
        return "01001" + Program.toBinaryPadded(operands[0].getLabelAddressOffset(), 11);
    }

    areValidOperands(operands: Operand[]) {
        return operands[0].isLabelAddress();
    }

    execute(program: Program, operands: Operand[]) {
        program.setRegister(7, program.getProgramCounter());
        program.setProgramCounter(program.getProgramCounter() + operands[0].getLabelAddressOffset());
    }

}