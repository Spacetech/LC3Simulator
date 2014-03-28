class NOT extends Instruction {

    getName() {
        return "NOT";
    }

    getOperandCount() {
        return 2;
    }

    getInstructionBits(operands: Operand[]) {
        return "1001" + Program.toBinaryPadded(operands[0].getRegisterNumber(), 3) + Program.toBinaryPadded(operands[1].getRegisterNumber(), 3) + "111111";
    }

    areValidOperands(operands: Operand[]) {
        return operands[0].isRegisterNumber() && operands[1].isRegisterNumber();
    }

    execute(program: Program, operands: Operand[]) {
        program.setRegister(operands[0].getRegisterNumber(), -program.getRegister(operands[1].getRegisterNumber()) - 1);
    }
}