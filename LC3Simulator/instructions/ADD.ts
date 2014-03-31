class ADD extends Instruction {

    getName() {
        return "ADD";
    }

    getOperandCount() {
        return 3;
    }

    getInstructionBits(operands: Operand[]) {
        if (operands[2].isRegisterNumber()) {
            return "0001" + Program.toBinaryPadded(operands[0].getRegisterNumber(), 3) + Program.toBinaryPadded(operands[1].getRegisterNumber(), 3) + "000" + Program.toBinaryPadded(operands[2].getRegisterNumber(), 3);
        }
        return "0001" + Program.toBinaryPadded(operands[0].getRegisterNumber(), 3) + Program.toBinaryPadded(operands[1].getRegisterNumber(), 3) + "1" + Program.toBinaryPadded(operands[2].getImmediate(), 5);
    }

    areValidOperands(operands: Operand[]) {
        return operands[0].isRegisterNumber() && operands[1].isRegisterNumber() && (operands[2].isImmediate() || operands[2].isRegisterNumber());
    }

    execute(program: Program, operands: Operand[]) {

        if (operands[2].isRegisterNumber()) {
            program.setRegister(operands[0].getRegisterNumber(), program.getRegister(operands[1].getRegisterNumber()) + program.getRegister(operands[2].getRegisterNumber()));
        }
        else {
            program.setRegister(operands[0].getRegisterNumber(), program.getRegister(operands[1].getRegisterNumber()) + operands[2].getImmediate());
        }
    }

}
