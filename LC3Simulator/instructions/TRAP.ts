class TRAP extends Instruction {

    getName() {
        return "TRAP";
    }

    getOperandCount() {
        return 1;
    }

    getInstructionBits(operands: Operand[]) {
        return "11110000" + Program.toBinaryPadded(operands[0].getImmediate(), 8);
    }

    areValidOperands(operands: Operand[]) {
        return operands[0].isImmediate();
    }

    execute(program: Program, operands: Operand[]) {
        //program.setRegister(7, program.getProgramCounter());
        //program.setProgramCounter(

        if (operands[0].getImmediate() == 37) {
            program.setHalted(true, true);
        }
    }

}
 