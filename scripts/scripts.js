var input = require('fs').readFileSync('/dev/stdin', 'utf8');
var lines = input.split('\n');

function validarCPF(cpf) {
    // Remove pontos e hífen e transforma em array de números
    const numeros = cpf.replace(/[.-]/g, '').split('').map(Number);

    if (numeros.length !== 11) return false;

    const a = numeros.slice(0, 9);
    const b1 = numeros[9];
    const b2 = numeros[10];

    // Cálculo do primeiro dígito verificador (b1)
    let soma1 = 0;
    for (let i = 0; i < 9; i++) {
        soma1 += a[i] * (i + 1);
    }
    let calcB1 = soma1 % 11;
    if (calcB1 === 10) calcB1 = 0;

    // Cálculo do segundo dígito verificador (b2)
    let soma2 = 0;
    for (let i = 0; i < 9; i++) {
        soma2 += a[i] * (9 - i);
    }
    let calcB2 = soma2 % 11;
    if (calcB2 === 10) calcB2 = 0;

    return b1 === calcB1 && b2 === calcB2;
}

// Lendo a entrada do usuário
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on("line", (cpf) => {
    if (validarCPF(cpf.trim())) {
        console.log("CPF valido");
    } else {
        console.log("CPF invalido");
    }
});
