class Operand {
    private register: number;
    private immediate: number;
    private address: number;
    private addressOffset: number;
    private program: Program;

    constructor(program: Program, public str: string, currentAddress: number) {
        this.program = program;
        this.register = -1;
        this.address = -1;
        this.addressOffset = -1;

        if (str.length == 0) {
            throw "invalid operand, length is 0";
        }

        if (str.length == 2 && str.charAt(0) == "R") {
            this.register = parseInt(str.charAt(1));
            if (this.register < 0 || this.register > 7) {
                throw "invalid register '" + this.register + "'";
            }
            return;
        }

        if (str.charAt(0) == "#") {
            this.immediate = parseInt(str.substr(1));
            if (this.immediate >= Math.pow(2, 5) || this.immediate < -Math.pow(2, 5)) {
                throw "invalid immediate value '" + this.immediate + "'";
            }
            return;
        }

        if (str.length > 2 && (str.charAt(0) == "X" || (str.charAt(0) == "0" && str.charAt(1) == "X"))) {
            if (str.charAt(0) == "X") {
                str = "0" + str;
            }
            this.immediate = parseInt(str, 16);
            if (this.immediate >= Math.pow(2, 7) || this.immediate < -Math.pow(2, 7)) {
                throw "invalid immediate value '" + this.immediate + "'";
            }
            return;
        }

        if (program.isLabel(str)) {
            this.address = program.getLabel(str);
            this.addressOffset = this.address - currentAddress - 1;
            return;
        }

        throw "invalid operand '" + str + "'. You may have supplied an undeclared label";
    }

    isRegisterNumber() {
        return this.register != -1;
    }

    isImmediate() {
        return !this.isRegisterNumber() && !this.isLabelAddress();
    }

    isLabelAddress() {
        return this.address != -1;
    }

    getRegisterNumber() {
        return this.register;
    }

    getImmediate() {
        return this.immediate;
    }

    getLabelAddress() {
        return this.address;
    }

    getLabelAddressOffset() {
        return this.addressOffset;
    }
}
