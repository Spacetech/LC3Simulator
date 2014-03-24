﻿var Greeter = (function () {
    function Greeter(element) {
        this.element = element;
        this.element.innerHTML += "The time is: ";
        this.span = document.createElement('span');
        this.element.appendChild(this.span);
        this.span.innerText = new Date().toUTCString();
    }
    Greeter.prototype.start = function () {
        var _this = this;
        this.timerToken = setInterval(function () {
            return _this.span.innerHTML = new Date().toUTCString();
        }, 500);
    };

    Greeter.prototype.stop = function () {
        clearTimeout(this.timerToken);
    };
    return Greeter;
})();

var program;
var textarea;
var message;
var loadedCode;
var workingCode = false;

function CheckCompiled() {
    if (loadedCode === textarea.value) {
        message.style.display = "none";
    } else {
        message.style.display = "block";
    }
}

function ProgramLoad(str, compile) {
    if (typeof compile === "undefined") { compile = false; }
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

    try  {
        program.open(loadedCode);
        workingCode = true;
        program.log("Program successfully compiled", Program.LOG_SUCCESS);
        return true;
    } catch (ex) {
        workingCode = false;
        ShowSourceCodeTab();
        program.log("Compilation Error: " + ex, Program.LOG_DANGER);
    }

    return false;
}

window.onload = function () {
    textarea = document.getElementById("sourcecode");
    message = document.getElementById("message");

    program = new Program();

    ProgramLoad(".ORIG x3000\nLD R2, A\nLOOP: ADD R2, R2, #31\nBR LOOP\nHALT\nA .FILL x5\n.END");

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
