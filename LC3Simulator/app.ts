class Greeter {
    element: HTMLElement;
    span: HTMLElement;
    timerToken: number;

    constructor(element: HTMLElement) {
        this.element = element;
        this.element.innerHTML += "The time is: ";
        this.span = document.createElement('span');
        this.element.appendChild(this.span);
        this.span.innerText = new Date().toUTCString();
    }

    start() {
        this.timerToken = setInterval(() => this.span.innerHTML = new Date().toUTCString(), 500);
    }

    stop() {
        clearTimeout(this.timerToken);
    }

}

var program;
var textarea;
var message;
var loadedCode;
var workingCode = false;

declare function ShowSourceCodeTab();
declare function ShowDebuggerTab();
declare function ShowDownloadFileDialog(value: string);

function CheckCompiled() {
    if (loadedCode === textarea.value) {
        message.style.display = "none";
    }
    else {
        message.style.display = "block";
    }
}

function ProgramLoad(str: string, compile: boolean = false) {
    if (loadedCode === str) {
        if (workingCode && compile) {
            program.log("Program already compiled", Program.LOG_INFO);
        }
        return workingCode;
    }

    loadedCode = str;

    textarea.value = loadedCode;

    message.style.display = "none";

    program.reset();

    try {
        program.open(loadedCode);
        workingCode = true;
        program.log("Program successfully compiled", Program.LOG_SUCCESS);
        return true;
    }
    catch (ex) {
        workingCode = false;
        ShowSourceCodeTab();
        program.log("Compilation Error: " + ex, Program.LOG_DANGER);
    }

    return false;
}

window.onload = () => {
    textarea = <HTMLTextAreaElement>document.getElementById("sourcecode");
    message = document.getElementById("message");

    program = new Program();

    //ProgramLoad(".ORIG x3000\nLD R2, A\nLOOP: ADD R2, R2, #31\nBR LOOP\nHALT\nA .FILL x5\n.END");
    //program.open(".ORIG x3000\nLD R2, A\nLOOP: ADD R2, R2, #10\nHALT\nA .FILL x5\n.END");
    ProgramLoad(".ORIG x3000\nLD R2, NUM\nAND R3, R3, #0\nAND R5, R5, #0\nLOOP\nADD R4, R2, #-2\nBRz DONE\nADD R3, R3, R5\nADD R5, R5, #1\nADD R2, R2, #-1\nST R2, ARRAY\nBRp LOOP\nDONE HALT\nNUM .FILL 10\nARRAY .BLKW 3\nNUM2 .FILL 16\n.END");
    //ProgramLoad(".ORIG x3000\nLD R2, NUM\nLD R3, NUM\nADD R2, R2, #3\nADD R3, R3, #8\nHALT\nNUM .FILL -5\n.END");

    document.getElementById("command-compile").onclick = function (event) {
        event.preventDefault();
        if (ProgramLoad(textarea.value, true)) {
            ShowDebuggerTab();
        }
    };

    document.getElementById("command-run").onclick = function (event) {
        event.preventDefault();
        if (ProgramLoad(textarea.value)) {
            ShowDebuggerTab();
            program.onCommandRun();
        }
    };

    document.getElementById("command-step").onclick = function (event) {
        event.preventDefault();
        if (ProgramLoad(textarea.value)) {
            ShowDebuggerTab();
            program.onCommandStep();
        }
    };

    document.getElementById("command-reset").onclick = function (event) {
        event.preventDefault();
        program.onCommandResetProgram();
    };

    document.getElementById("command-clear-log").onclick = function (event) {
        event.preventDefault();
        program.onCommandClearLog();
    };

    document.getElementById("command-download").onclick = function (event) {
        event.preventDefault();
        ShowDownloadFileDialog(textarea.value);
    };
};
