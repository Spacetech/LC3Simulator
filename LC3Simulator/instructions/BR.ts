class BR extends Instruction {

    getName() {
        return "BR";
    }

    getOperandCount() {
        return 4;
    }

    getInstructionBits(operands: Operand[]) {
        return "0000" + operands[0].getImmediate() + operands[1].getImmediate() + operands[2].getImmediate() + Program.toBinaryPadded(operands[3].isLabelAddress() ? operands[3].getLabelAddressOffset() : operands[3].getImmediate(), 9);
    }

    areValidOperands(operands: Operand[]) {
        return operands[0].isImmediate() && operands[1].isImmediate() && operands[2].isImmediate() && (operands[3].isLabelAddress() || operands[3].isImmediate());
    }

    execute(program: Program, operands: Operand[]) {
        if ((operands[0].getImmediate() == 1 && program.isConditionNegativeSet()) ||
            (operands[1].getImmediate() == 1 && program.isConditionZeroSet()) ||
            (operands[2].getImmediate() == 1 && program.isConditionPositiveSet()) ||
            (operands[0].getImmediate() == 0 && operands[1].getImmediate() == 0 && operands[2].getImmediate() == 0)
            ) {
            if (operands[3].isLabelAddress()) {
                program.setProgramCounter(program.getProgramCounter() + operands[3].getLabelAddressOffset());
            }
            else {
                program.setProgramCounter(program.getProgramCounter() + operands[3].getImmediate());
            }
        }
    }
}
