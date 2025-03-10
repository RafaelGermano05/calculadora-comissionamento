let resultadoConquista = 0;
let resultadoSafra = 0;
let resultadoAceleradores = 0;


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

    document.getElementById("resultado-conquista").innerHTML = `<p>Conquista: R$ ${resultadoConquista.toFixed(2)}</p>`;
    calcularTotal();
}

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
    document.getElementById("resultado-safra").innerHTML = `<p>Safra: R$ ${resultadoSafra.toFixed(2)}</p>`;
    calcularTotal();
}


function calcularAceleradores() {
    const migradosTotais = parseInt(document.getElementById("migrados-totais").value);
    const ponderadoMedio = parseFloat(document.getElementById("ponderado-medio").value);

    let totalAceleradores = 0;


    if (migradosTotais >= 7 && migradosTotais <= 11) totalAceleradores += resultadoSafra * 0.20;
    else if (migradosTotais >= 12) totalAceleradores += resultadoSafra * 0.30;

 
    if (ponderadoMedio >= 200000 && ponderadoMedio <= 300000) totalAceleradores += resultadoSafra * 0.20;
    else if (ponderadoMedio > 300000) totalAceleradores += resultadoSafra * 0.30;

    resultadoAceleradores = totalAceleradores;
    document.getElementById("resultado-aceleradores").innerHTML = `<p>Aceleradores: R$ ${resultadoAceleradores.toFixed(2)}</p>`;
    calcularTotal();
}

function calcularTotal() {
    const nomeConsultor = document.getElementById("nome-consultor").value;
    const totalComissionamento = resultadoConquista + resultadoSafra + resultadoAceleradores;

    document.getElementById("resultado-final").innerHTML = `
        <h3>Resultado Final para ${nomeConsultor}</h3>
        <p>Conquista: R$ ${resultadoConquista.toFixed(2)}</p>
        <p>Safra: R$ ${resultadoSafra.toFixed(2)}</p>
        <p>Aceleradores: R$ ${resultadoAceleradores.toFixed(2)}</p>
        <p><strong>Total: R$ ${totalComissionamento.toFixed(2)}</strong></p>
    `;
}

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

function exportarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const nomeConsultor = document.getElementById("nome-consultor").value;
    const totalComissionamento = resultadoConquista + resultadoSafra + resultadoAceleradores;

    doc.text(`Relatório de Comissionamento - ${nomeConsultor}`, 10, 10);
    doc.text(`Conquista: R$ ${resultadoConquista.toFixed(2)}`, 10, 20);
    doc.text(`Safra: R$ ${resultadoSafra.toFixed(2)}`, 10, 30);
    doc.text(`Aceleradores: R$ ${resultadoAceleradores.toFixed(2)}`, 10, 40);
    doc.text(`Total: R$ ${totalComissionamento.toFixed(2)}`, 10, 50);

    doc.save(`comissionamento_${nomeConsultor}.pdf`);
}
