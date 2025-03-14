let resultadoConquista = 0;
let resultadoSafra = 0;
let resultadoAceleradores = 0;

// Função para formatar o valor como moeda
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

// Função para remover a formatação e converter para número
function removerFormatacaoMoeda(valorFormatado) {
    return parseFloat(valorFormatado
        .replace(/\./g, '') // Remove pontos
        .replace(',', '.') // Substitui vírgula por ponto
        .replace(/[^0-9.]/g, '')); // Remove tudo que não for número ou ponto
}

// Função para formatar o input enquanto o usuário digita
document.getElementById('ponderado-medio').addEventListener('input', function (e) {
    let valor = e.target.value.replace(/\D/g, ''); // Remove tudo que não for número
    valor = (Number(valor) / 100).toFixed(2); // Converte para número com duas casas decimais
    e.target.value = formatarMoeda(valor); // Formata como moeda
});

// Função para calcular Conquista
function calcularConquista() {
    const valorReferencia = parseFloat(document.getElementById("valor-referencia").value);
    const newMas = parseInt(document.getElementById("new-mas").value);
    const categoria = document.getElementById("categoria").value;

    if (categoria === "m0") {
        if (newMas >= 3 && newMas <= 5) resultadoConquista = valorReferencia * 0.10;
        else if (newMas >= 6 && newMas <= 9) resultadoConquista = valorReferencia * 0.30;
        else if (newMas >= 10) resultadoConquista = valorReferencia * 0.50;
    } else if (categoria === "m1") {
        if (newMas >= 4 && newMas <= 6) resultadoConquista = valorReferencia * 0.10;
        else if (newMas >= 7 && newMas <= 9) resultadoConquista = valorReferencia * 0.30;
        else if (newMas >= 10) resultadoConquista = valorReferencia * 0.50;
    } else if (categoria === "m2" || categoria === "full") {
        if (newMas >= 7 && newMas <= 9) resultadoConquista = valorReferencia * 0.10;
        else if (newMas >= 10 && newMas <= 14) resultadoConquista = valorReferencia * 0.30;
        else if (newMas >= 15) resultadoConquista = valorReferencia * 0.50;
    }

    document.getElementById("resultado-conquista").innerHTML = `<p>Conquista: ${formatarMoeda(resultadoConquista)}</p>`;
    calcularTotal();
}

// Função para calcular Safra
function calcularSafra() {
    const porcentagemParcelado = parseFloat(document.getElementById("porcentagem-parcelado").value);
    const migradosCPF15_30 = parseInt(document.getElementById("migrados-cpf-15-30").value);
    const migradosCPF30 = parseInt(document.getElementById("migrados-cpf-30").value);
    const migradosCNPJ15_30 = parseInt(document.getElementById("migrados-cnpj-15-30").value);
    const migradosCNPJ30 = parseInt(document.getElementById("migrados-cnpj-30").value);

    let totalSafra = 0;

    if (porcentagemParcelado < 50) totalSafra += migradosCPF15_30 * 100;
    else if (porcentagemParcelado >= 50 && porcentagemParcelado <= 59.9) totalSafra += migradosCPF15_30 * 150;
    else if (porcentagemParcelado > 60) totalSafra += migradosCPF15_30 * 225;

    if (porcentagemParcelado < 50) totalSafra += migradosCPF30 * 130;
    else if (porcentagemParcelado >= 50 && porcentagemParcelado <= 59.9) totalSafra += migradosCPF30 * 195;
    else if (porcentagemParcelado > 60) totalSafra += migradosCPF30 * 292;

    if (porcentagemParcelado < 50) totalSafra += migradosCNPJ15_30 * 150;
    else if (porcentagemParcelado >= 50 && porcentagemParcelado <= 59.9) totalSafra += migradosCNPJ15_30 * 200;
    else if (porcentagemParcelado > 60) totalSafra += migradosCNPJ15_30 * 270;

    if (porcentagemParcelado < 50) totalSafra += migradosCNPJ30 * 180;
    else if (porcentagemParcelado >= 50 && porcentagemParcelado <= 59.9) totalSafra += migradosCNPJ30 * 234;
    else if (porcentagemParcelado > 60) totalSafra += migradosCNPJ30 * 350;

    resultadoSafra = totalSafra;
    document.getElementById("resultado-safra").innerHTML = `<p>Safra: ${formatarMoeda(resultadoSafra)}</p>`;
    calcularTotal();
}

// Função para calcular Aceleradores
function calcularAceleradores() {
    const ponderadoMedio = document.getElementById('ponderado-medio').value;
    const ponderadoMedioNumerico = removerFormatacaoMoeda(ponderadoMedio);
    const migradosTotais = parseInt(document.getElementById("migrados-totais").value);

    let totalAceleradores = 0;

    // Acelerador de Qualidade
    if (migradosTotais >= 7 && migradosTotais <= 11) totalAceleradores += resultadoSafra * 0.20;
    else if (migradosTotais >= 12) totalAceleradores += resultadoSafra * 0.30;

    // Acelerador de Volume
    if (ponderadoMedioNumerico >= 200000 && ponderadoMedioNumerico <= 300000) totalAceleradores += resultadoSafra * 0.20;
    else if (ponderadoMedioNumerico > 300000) totalAceleradores += resultadoSafra * 0.30;

    resultadoAceleradores = totalAceleradores;
    document.getElementById("resultado-aceleradores").innerHTML = `<p>Aceleradores: ${formatarMoeda(resultadoAceleradores)}</p>`;
    calcularTotal();
}

// Função para calcular o Total
function calcularTotal() {
    const nomeConsultor = document.getElementById("nome-consultor").value;
    const totalComissionamento = resultadoConquista + resultadoSafra + resultadoAceleradores;

    document.getElementById("resultado-final").innerHTML = `
        <h3>Resultado Final para ${nomeConsultor}</h3>
        <p>Conquista: ${formatarMoeda(resultadoConquista)}</p>
        <p>Safra: ${formatarMoeda(resultadoSafra)}</p>
        <p>Aceleradores: ${formatarMoeda(resultadoAceleradores)}</p>
        <p><strong>Total: ${formatarMoeda(totalComissionamento)}</strong></p>
    `;
}

// Função para resetar
function resetar() {
    document.getElementById("nome-consultor").value = "";
    document.getElementById("valor-referencia").value = "";
    document.getElementById("new-mas").value = "";
    document.getElementById("categoria").value = "m0";
    document.getElementById("porcentagem-parcelado").value = "";
    document.getElementById("migrados-cpf-15-30").value = "";
    document.getElementById("migrados-cpf-30").value = "";
    document.getElementById("migrados-cnpj-15-30").value = "";
    document.getElementById("migrados-cnpj-30").value = "";
    document.getElementById("migrados-totais").value = "";
    document.getElementById("ponderado-medio").value = "";
    document.getElementById("resultado-conquista").innerHTML = "";
    document.getElementById("resultado-safra").innerHTML = "";
    document.getElementById("resultado-aceleradores").innerHTML = "";
    document.getElementById("resultado-final").innerHTML = "";
    resultadoConquista = 0;
    resultadoSafra = 0;
    resultadoAceleradores = 0;
}

// Função para exportar PDF
// Função para exportar PDF
function exportarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Cabeçalho do PDF
    doc.setFontSize(18);
    doc.text("Calculadora de Simulação de Comissionamento", 10, 15);

    // Informações do Consultor
    const nomeConsultor = document.getElementById("nome-consultor").value;
    doc.setFontSize(12);
    doc.text(`Consultor: ${nomeConsultor}`, 10, 25);

    // Dados de Conquista
    doc.setFontSize(14);
    doc.text("Conquista", 10, 35);
    doc.setFontSize(12);
    const valorReferencia = parseFloat(document.getElementById("valor-referencia").value);
    const newMas = parseInt(document.getElementById("new-mas").value);
    const categoria = document.getElementById("categoria").value;
    const resultadoConquista = calcularValorPorCategoria(categoria); // Resultado calculado

    doc.text(`Valor de Referência: ${formatarMoeda(valorReferencia)}`, 10, 45);
    doc.text(`Quantidade de New Mas: ${newMas}`, 10, 55);
    doc.text(`Categoria: ${categoria}`, 10, 65);
    doc.text(`Total Conquista: ${formatarMoeda(resultadoConquista)}`, 10, 75);

    // Dados de Safra
    doc.setFontSize(14);
    doc.text("Safra", 10, 85);
    doc.setFontSize(12);
    const porcentagemParcelado = parseFloat(document.getElementById("porcentagem-parcelado").value);
    const resultadoSafra = calcularValorPorCategoria("safra"); // Resultado calculado

    doc.text(`Porcentagem de Parcelado: ${porcentagemParcelado}%`, 10, 95);
    doc.text(`Migrados CPF 15k-29,99k: ${document.getElementById("migrados-cpf-15-30").value}`, 10, 105);
    doc.text(`Valor por CPF 15k-29,99k: ${formatarMoeda(calcularValorPorCategoria("cpf-15-30"))}`, 10, 115);
    doc.text(`Migrados CPF +30k: ${document.getElementById("migrados-cpf-30").value}`, 10, 125);
    doc.text(`Valor por CPF +30k: ${formatarMoeda(calcularValorPorCategoria("cpf-30"))}`, 10, 135);
    doc.text(`Migrados CNPJ 15k-29,99k: ${document.getElementById("migrados-cnpj-15-30").value}`, 10, 145);
    doc.text(`Valor por CNPJ 15k-29,99k: ${formatarMoeda(calcularValorPorCategoria("cnpj-15-30"))}`, 10, 155);
    doc.text(`Migrados CNPJ +30k: ${document.getElementById("migrados-cnpj-30").value}`, 10, 165);
    doc.text(`Valor por CNPJ +30k: ${formatarMoeda(calcularValorPorCategoria("cnpj-30"))}`, 10, 175);
    doc.text(`Total Safra: ${formatarMoeda(resultadoSafra)}`, 10, 185);

    // Dados de Aceleradores
    doc.setFontSize(14);
    doc.text("Aceleradores", 10, 195);
    doc.setFontSize(12);
    const migradosTotais = parseInt(document.getElementById("migrados-totais").value);
    const ponderadoMedio = parseFloat(removerFormatacaoMoeda(document.getElementById("ponderado-medio").value));
    const resultadoAceleradores = calcularAceleradorQualidade() + calcularAceleradorVolume();

    doc.text(`Migrados Totais: ${migradosTotais}`, 10, 205);
    doc.text(`Ponderado Médio Total: ${formatarMoeda(ponderadoMedio)}`, 10, 215);
    doc.text(`Acelerador de Qualidade: ${formatarMoeda(calcularAceleradorQualidade())}`, 10, 225);
    doc.text(`Acelerador de Volume: ${formatarMoeda(calcularAceleradorVolume())}`, 10, 235);
    doc.text(`Total Aceleradores: ${formatarMoeda(resultadoAceleradores)}`, 10, 245);

    // Total de Comissionamento
    doc.setFontSize(14);
    doc.text("Total de Comissionamento", 10, 255);
    doc.setFontSize(12);
    const totalComissionamento = resultadoConquista + resultadoSafra + resultadoAceleradores;
    doc.text(`Total: ${formatarMoeda(totalComissionamento)}`, 10, 265);

    // Salvar o PDF
    doc.save(`comissionamento_${nomeConsultor}.pdf`);
}

// Função para calcular o valor por categoria 
function calcularValorPorCategoria(categoria) {
    const porcentagemParcelado = parseFloat(document.getElementById("porcentagem-parcelado").value) || 0;
    const migrados = parseInt(document.getElementById("migrados").value) || 0;
    let valor = 0;

    switch (categoria) {
        case "cpf-15-30":
            valor = migrados * 100 * (porcentagemParcelado / 100);
            break;
        case "cpf-30":
            valor = migrados * 150 * (porcentagemParcelado / 100);
            break;
        case "cnpj-15-30":
            valor = migrados * 200 * (porcentagemParcelado / 100);
            break;
        case "cnpj-30":
            valor = migrados * 250 * (porcentagemParcelado / 100);
            break;
        case "safra":
            valor = migrados * 50 * (porcentagemParcelado / 100);
            break;
        default:
            valor = migrados * 50;
            break;
    }

    return valor;
}
