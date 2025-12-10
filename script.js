const verificationScreen = document.getElementById('verificationScreen');
const mainDeobfuscator = document.getElementById('mainDeobfuscator');
const accessBtn = document.getElementById('accessBtn');

const inputArea = document.getElementById('inputCode');
const outputArea = document.getElementById('outputCode');
const modal = document.getElementById('processingModal');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const statusLog = document.getElementById('statusLog');
const estTime = document.getElementById('estTime');
const fileInput = document.getElementById('fileInput');

let processStartTime = 0;
let uploadedFileName = 'deobfuscated_script.js';

function aggressiveBotTrap() {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
        let crashLoop = 0;
        while (crashLoop < 10000) {
            console.log("CRITICAL ERROR: ENVIRONMENT INTEGRITY FAILED. BOT CRASH TRIGGERED. EXIT CODE: " + crashLoop);
            document.createElement(null); 
            crashLoop++; 
        }
    }
}

function activateClientProtections() {
    
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        alert("⚠️ ACCESS DENIED: Right-click is restricted by @XYCoolcraft Security Protocol.");
    });

    document.addEventListener('copy', (e) => {
        e.preventDefault();
        alert("⚠️ ACCESS DENIED: Content copying is disabled by @XYCoolcraft Security Protocol.");
    });

    document.onkeydown = function(e) {
        if (e.keyCode == 123) return false;
        if (e.ctrlKey && e.shiftKey && (e.keyCode == 'I'.charCodeAt(0) || e.keyCode == 'J'.charCodeAt(0) || e.keyCode == 'C'.charCodeAt(0))) return false;
        if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) return false;
    };

    setInterval(() => {
        const start = performance.now();
        (function() {}).constructor('debugger')(); 
        const end = performance.now();
        
        if (end - start > 100) {
            console.clear();
            document.body.innerHTML = "<h1 style='color:red;text-align:center;margin-top:20%'>SECURITY ALERT: JANGAN MENCOBA INSPECT ELEMENT!</h1>";
            clearInterval(this); 
        }
    }, 2000);

    (function checkDevTools() {
        try {
            (function() {}).constructor('debugger')();
        } catch(e) {
        }
        setTimeout(checkDevTools, 100);
    })();
}

window.captchaVerified = function(response) {
    if (response.length > 0) {
        accessBtn.disabled = false;
        accessBtn.classList.remove('disabled');
        accessBtn.textContent = "✅ VERIFIED | CLICK TO ACCESS";
    }
};

window.captchaExpired = function() {
    accessBtn.disabled = true;
    accessBtn.classList.add('disabled');
    accessBtn.textContent = "⚠️ VERIFICATION EXPIRED | RE-VERIFY";
    grecaptcha.reset();
}

function initVerification() {
    activateClientProtections();

    accessBtn.addEventListener('click', () => {
        if (!accessBtn.disabled) {
            verificationScreen.style.display = 'none';
            mainDeobfuscator.style.display = 'flex';
            grecaptcha.reset(); 
        }
    });

    aggressiveBotTrap();
}

document.addEventListener('DOMContentLoaded', initVerification);

function clearInput() {
    inputArea.value = '';
    outputArea.value = '// Hasil kode bersih akan muncul di sini...';
    fileInput.value = null; 
    uploadedFileName = 'deobfuscated_script.js';
    inputArea.focus();
}

function handleFileUpload() {
    const file = fileInput.files[0];
    if (!file) return;

    if (file.type !== 'application/javascript' && !file.name.toLowerCase().endsWith('.js')) {
        alert("⚠️ ERROR: Hanya file JavaScript (.js) yang didukung.");
        fileInput.value = null;
        return;
    }

    uploadedFileName = file.name.replace('.js', '_deobf.js');

    const reader = new FileReader();
    reader.onload = (e) => {
        inputArea.value = e.target.result;
    };
    reader.onerror = () => {
        alert("⚠️ ERROR: Gagal membaca file.");
    };
    reader.readAsText(file);
}

function downloadOutput() {
    if (!outputArea.value || outputArea.value.startsWith('// Hasil kode bersih')) {
        alert("⚠️ ERROR: Tidak ada hasil untuk diunduh!");
        return;
    }

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(outputArea.value));
    element.setAttribute('download', uploadedFileName);
    
    element.style.display = 'none';
    document.body.appendChild(element);
    
    element.click();
    
    document.body.removeChild(element);
    alert(`✅ SYSTEM: File ${uploadedFileName} berhasil diunduh!`);
}


function startDeobfuscation() {
    const code = inputArea.value;
    if (!code || code.startsWith('/* Tempel kode JS')) {
        alert("⚠️ ERROR: Input kode kosong atau belum diisi!");
        return;
    }

    modal.style.display = 'flex';
    
    const sizeInKB = new Blob([code]).size / 1024;
    const estimatedSeconds = (sizeInKB * 0.05) + 0.5;
    
    estTime.textContent = `Est: ${estimatedSeconds.toFixed(2)}s`;
    estTime.style.color = sizeInKB > 1000 ? "#f87171" : "#94a3b8";
    
    processStartTime = performance.now();
    updateProgress(0, "INITIALIZING CORE...");

    setTimeout(() => {
        processCode(code);
    }, 500);
}

function updateProgress(percent, text) {
    progressBar.style.width = percent + '%';
    progressText.textContent = percent + '%';
    statusLog.textContent = text;
}

async function processCode(source) {
    let clean = source;

    try {
        updateProgress(15, "BYPASSING ANTI-DEBUG...");
        await new Promise(r => setTimeout(r, 200));
        clean = removeAntiDebug(clean);

        updateProgress(30, "UNPACKING LAYERS...");
        
        let isPacked = true;
        let loop = 0;
        const MAX_LOOPS = 20;

        while (isPacked && loop < MAX_LOOPS) {
            const packerRegex = /eval\s*\(\s*function\s*\(\s*p\s*,\s*a\s*,\s*c\s*,\s*k\s*,\s*e\s*,\s*[dr]\s*\).*?\.split\('\|'\)\)\)/;
            const match = packerRegex.exec(clean);

            if (match) {
                try {
                    let snippet = match[0].replace(/^eval/, "");
                    const unpacked = new Function("return " + snippet)();
                    
                    if (unpacked && typeof unpacked === 'string' && unpacked !== clean) {
                        clean = clean.replace(match[0], unpacked);
                        updateProgress(30 + loop, `LAYER ${loop + 1} REMOVED...`);
                    } else {
                        isPacked = false;
                    }
                } catch (e) {
                    isPacked = false;
                }
            } else {
                isPacked = false;
            }
            loop++;
        }

        updateProgress(60, "DECODING HEX/UNICODE...");
        await new Promise(r => setTimeout(r, 100));

        clean = clean.replace(/\\x([0-9A-Fa-f]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
        clean = clean.replace(/\\u([0-9A-Fa-f]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));

        updateProgress(80, "FIXING SYNTAX...");
        
        clean = clean.replace(/\["([a-zA-Z_$][0-9a-zA-Z_$]*)"\]/g, '.$1');
        clean = clean.replace(/\['([a-zA-Z_$][0-9a-zA-Z_$]*)'\]/g, '.$1');
        clean = clean.replace(/;;+/g, ';');

        updateProgress(90, "FORMATTING CODE...");
        await new Promise(r => setTimeout(r, 100));

        try {
            const beautified = js_beautify(clean, {
                indent_size: 4,
                indent_char: " ",
                max_preserve_newlines: 2,
                preserve_newlines: true,
                keep_array_indentation: false,
                break_chained_methods: false,
                indent_scripts: "normal",
                brace_style: "collapse",
                space_before_conditional: true,
                unescape_strings: true,
                jslint_happy: true,
                end_with_newline: true,
                wrap_line_length: 0,
                comma_first: false,
                e4x: false,
                indent_empty_lines: false
            });
            outputArea.value = beautified;
        } catch (err) {
            outputArea.value = clean;
        }

        const endTime = performance.now();
        const duration = ((endTime - processStartTime) / 1000).toFixed(2);

        updateProgress(100, "COMPLETED");
        estTime.textContent = `Done in ${duration}s`;
        estTime.style.color = "#4ade80";
        
        setTimeout(() => {
            modal.style.display = 'none';
        }, 1200);

    } catch (error) {
        console.error(error);
        alert("CRITICAL ERROR: Kode terlalu rusak atau terenkripsi biner.");
        modal.style.display = 'none';
    }
}

function removeAntiDebug(code) {
    let result = code;

    result = result.replace(/\bdebugger\s*;?/g, "/* debugger neutralized */");

    const antiDebugRegex1 = /\(function\s*\(\)\s*\{\s*\(function\s*\(\)\s*\{\s*return\s*false\s*;\s*\}\)\s*\.constructor\s*\(\s*['"]debugger['"]\s*\)\s*\(\)\s*;\s*\}\s*\)\s*\(\)/g;
    result = result.replace(antiDebugRegex1, ".constructor(\"console.log\")");

    const antiDebugRegex2 = /\.constructor\s*\(\s*['"]debugger['"]\s*\)/g;
    result = result.replace(antiDebugRegex2, ".constructor(\"console.log\")");

    result = result.replace(/console\.clear\(\)/g, "/* console.clear() skipped */");

    return result;
}