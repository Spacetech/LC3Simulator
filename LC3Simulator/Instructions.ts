class Instructions {
    private static instructions: { [opCode: string]: Instruction } = {
        "ADD": new ADD(),
        "AND": new AND(),
        "BR": new BR(),
        "JMP": new JMP(),
        "JSR": new JSR(),
        "JSRR": new JSRR(),
        "LD": new LD(),
        "LDI": new LDI(),
        "LDR": new LDR(),
        "LEA": new LEA(),
        "NOT": new NOT(),
        "RET": new RET(),
        "ST": new ST(),
        "STR": new STR(),
        "STI": new STI(),
        "TRAP": new TRAP()
    };

    static isInstruction(opCode: string) {
        return opCode in this.instructions;
    }

    static getInstruction(opCode: string) {
        return Instructions.instructions[opCode];
    }

}
