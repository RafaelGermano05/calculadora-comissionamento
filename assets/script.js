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

function removerFormatacaoMoeda(valorFormatado) {
    if (!valorFormatado) return 0;
    return parseFloat(valorFormatado
        .replace(/\./g, '') 
        .replace(',', '.') 
        .replace(/[^0-9.]/g, '')); 
}

// Formatação automática do campo Ponderado Médio
document.getElementById('ponderado-medio').addEventListener('input', function (e) {
    let valor = e.target.value.replace(/\D/g, ''); 
    valor = (Number(valor) / 100).toFixed(2); 
    e.target.value = formatarMoeda(valor); 
});

function calcularConquista() {
    const valorRef = document.getElementById("valor-referencia").value || "0";
    const valorReferencia = parseFloat(valorRef);
    const newMas = parseInt(document.getElementById("new-mas").value || "0");
    const categoria = document.getElementById("categoria").value;

    resultadoConquista = 0; // Resetar antes de recalcular

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

function calcularSafraEAceleradores() {
    // Cálculo da Safra
    const porcentagemParcelado = parseFloat(document.getElementById("porcentagem-parcelado").value || "0");
    const migradosCPF15_30 = parseInt(document.getElementById("migrados-cpf-15-30").value || "0");
    const migradosCPF30 = parseInt(document.getElementById("migrados-cpf-30").value || "0");
    const migradosCNPJ15_30 = parseInt(document.getElementById("migrados-cnpj-15-30").value || "0");
    const migradosCNPJ30 = parseInt(document.getElementById("migrados-cnpj-30").value || "0");
    const ponderadoMedio = removerFormatacaoMoeda(document.getElementById('ponderado-medio').value);

    let totalSafra = 0;

    // Cálculos para CPF 15k-29,99k
    if (porcentagemParcelado < 50) totalSafra += migradosCPF15_30 * 100;
    else if (porcentagemParcelado >= 50 && porcentagemParcelado <= 59.9) totalSafra += migradosCPF15_30 * 150;
    else if (porcentagemParcelado > 60) totalSafra += migradosCPF15_30 * 225;

    // Cálculos para CPF +30k
    if (porcentagemParcelado < 50) totalSafra += migradosCPF30 * 130;
    else if (porcentagemParcelado >= 50 && porcentagemParcelado <= 59.9) totalSafra += migradosCPF30 * 195;
    else if (porcentagemParcelado > 60) totalSafra += migradosCPF30 * 292;

    // Cálculos para CNPJ 15k-29,99k
    if (porcentagemParcelado < 50) totalSafra += migradosCNPJ15_30 * 150;
    else if (porcentagemParcelado >= 50 && porcentagemParcelado <= 59.9) totalSafra += migradosCNPJ15_30 * 200;
    else if (porcentagemParcelado > 60) totalSafra += migradosCNPJ15_30 * 270;

    // Cálculos para CNPJ +30k
    if (porcentagemParcelado < 50) totalSafra += migradosCNPJ30 * 180;
    else if (porcentagemParcelado >= 50 && porcentagemParcelado <= 59.9) totalSafra += migradosCNPJ30 * 234;
    else if (porcentagemParcelado > 60) totalSafra += migradosCNPJ30 * 350;

    // Aplicar redução de 50% se PonderadoMédio for menor que 100k
    if (ponderadoMedio < 100000) {
        totalSafra = totalSafra * 0.5;
        document.getElementById("dica-safra").innerHTML = `
            <div class="tip-box">
                <div class="tip-title">Aviso:</div> 
                <p>Ponderado Médio abaixo de R$ 100.000 - Valor Safra reduzido em 50%</p>
            </div>`;
    } else {
        document.getElementById("dica-safra").innerHTML = "";
    }

    resultadoSafra = totalSafra;
    document.getElementById("resultado-safra").innerHTML = `<p>${formatarMoeda(resultadoSafra)}</p>`;

    // Cálculo dos Aceleradores (usa o resultadoSafra calculado acima)
    const migradosTotais = parseInt(document.getElementById("migrados-totais").value || "0");
    let totalAceleradores = 0;
    let dicaAcelerador = "";

    // Acelerador de Qualidade
    if (migradosTotais >= 7 && migradosTotais <= 11) {
        totalAceleradores += resultadoSafra * 0.20;
        dicaAcelerador += "Acelerador de Qualidade (7-11 migrados): +20%<br>";
    } else if (migradosTotais >= 12) {
        totalAceleradores += resultadoSafra * 0.30;
        dicaAcelerador += "Acelerador de Qualidade (12+ migrados): +30%<br>";
    }

    // Acelerador de Volume
    if (ponderadoMedio >= 200000 && ponderadoMedio <= 300000) {
        totalAceleradores += resultadoSafra * 0.20;
        dicaAcelerador += "Acelerador de Volume (Ponderado R$ 200k-300k): +20%";
    } else if (ponderadoMedio > 300000) {
        totalAceleradores += resultadoSafra * 0.30;
        dicaAcelerador += "Acelerador de Volume (Ponderado > R$ 300k): +30%";
    }

    resultadoAceleradores = totalAceleradores;
    document.getElementById("resultado-aceleradores").innerHTML = `<p>${formatarMoeda(resultadoAceleradores)}</p>`;
    
    // Mostrar dicas de aceleradores
    if (dicaAcelerador) {
        document.getElementById("dica-aceleradores").innerHTML = `
            <div class="tip-box">
                <div class="tip-title">Aceleradores aplicados:</div> 
                ${dicaAcelerador}
            </div>`;
    } else {
        document.getElementById("dica-aceleradores").innerHTML = `
            <div class="tip-box">
                Nenhum acelerador aplicado
            </div>`;
    }
    
    calcularTotal();
}

function calcularTotal() {
    const nomeConsultor = document.getElementById("nome-consultor").value || "Consultor";
    const totalComissionamento = resultadoConquista + resultadoSafra + resultadoAceleradores;

    document.getElementById("resultado-final").innerHTML = `
        <h3>Resultado Final para ${nomeConsultor}</h3>
        <p>Conquista: ${formatarMoeda(resultadoConquista)}</p>
        <p>Safra: ${formatarMoeda(resultadoSafra)}</p>
        <p>Aceleradores: ${formatarMoeda(resultadoAceleradores)}</p>
        <p><strong>Total: ${formatarMoeda(totalComissionamento)}</strong></p>
    `;
}

function resetar() {
    // Resetar inputs
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
    
    // Resetar resultados
    document.getElementById("resultado-conquista").innerHTML = "";
    document.getElementById("resultado-safra").innerHTML = "";
    document.getElementById("resultado-aceleradores").innerHTML = "";
    document.getElementById("resultado-final").innerHTML = "";
    document.getElementById("dica-safra").innerHTML = "";
    document.getElementById("dica-aceleradores").innerHTML = "";
    
    // Resetar variáveis
    resultadoConquista = 0;
    resultadoSafra = 0;
    resultadoAceleradores = 0;
}

function exportarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Configurações iniciais
    doc.setProperties({
        title: 'Relatório de Comissionamento',
        subject: 'Cálculo de comissionamento',
        author: 'Calculadora Fortsun',
        keywords: 'comissionamento, cálculo, relatório',
        creator: 'Fortsun'
    });

    // Cabeçalho
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.setFont("helvetica", "bold");
    doc.text("Relatório de Simulação de Comissionamento", 105, 15, { align: "center" });
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Dados gerados pela Simuladora de Comissionamento Fortsun", 105, 22, { align: "center" });
    
    // Linha divisória
    doc.setDrawColor(200, 200, 200);
    doc.line(10, 27, 200, 27);

    // Informações do Consultor
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Informações do Consultor", 10, 35);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const nomeConsultor = document.getElementById("nome-consultor").value || "Não informado";
    doc.text(`Nome: ${nomeConsultor}`, 10, 42);
    doc.text(`Data: ${new Date().toLocaleDateString()}`, 10, 49);

    // Dados de Conquista
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Conquista", 10, 60);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Valor de Referência: ${formatarMoeda(parseFloat(document.getElementById("valor-referencia").value || "0"))}`, 10, 67);
    doc.text(`Quantidade de New Mas: ${document.getElementById("new-mas").value || "0"}`, 10, 74);
    doc.text(`Categoria: ${document.getElementById("categoria").value.toUpperCase()}`, 10, 81);
    doc.text(`Total Conquista: ${formatarMoeda(resultadoConquista)}`, 10, 88);

    // Dados de Safra
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Safra", 10, 100);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Porcentagem de Parcelado: ${document.getElementById("porcentagem-parcelado").value || "0"}%`, 10, 107);
    doc.text(`Migrados CPF 15k-29,99k: ${document.getElementById("migrados-cpf-15-30").value || "0"}`, 10, 114);
    doc.text(`Migrados CPF +30k: ${document.getElementById("migrados-cpf-30").value || "0"}`, 10, 121);
    doc.text(`Migrados CNPJ 15k-29,99k: ${document.getElementById("migrados-cnpj-15-30").value || "0"}`, 10, 128);
    doc.text(`Migrados CNPJ +30k: ${document.getElementById("migrados-cnpj-30").value || "0"}`, 10, 135);
    doc.text(`Total Safra: ${formatarMoeda(resultadoSafra)}`, 10, 142);

    // Dados de Aceleradores
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Aceleradores", 10, 154);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Ponderado Médio: ${formatarMoeda(removerFormatacaoMoeda(document.getElementById("ponderado-medio").value))}`, 10, 161);
    doc.text(`Migrados Totais: ${document.getElementById("migrados-totais").value || "0"}`, 10, 168);
    doc.text(`Total Aceleradores: ${formatarMoeda(resultadoAceleradores)}`, 10, 175);

    // Resultado Final
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 100, 0);
    doc.text("RESULTADO FINAL", 105, 190, { align: "center" });
    
    doc.setFontSize(14);
    doc.text(`Total de Comissionamento: ${formatarMoeda(resultadoConquista + resultadoSafra + resultadoAceleradores)}`, 105, 200, { align: "center" });

    // Rodapé
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "italic");
    doc.text("Relatório gerado automaticamente pela Simuladora de Comissionamento Fortsun", 105, 290, { align: "center" });

    const dataAtual = new Date();
    const dia = String(dataAtual.getDate()).padStart(2, '0');
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0'); // +1 porque janeiro é 0
    const ano = dataAtual.getFullYear();
    const dataFormatada = `${dia}-${mes}-${ano}`;
    doc.save(`Comissionamento_${nomeConsultor.replace(/\s/g, '_')}_${dataFormatada}.pdf`);
}

// Inicialização das dicas
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("dica-safra").innerHTML = `
        <div class="tip-box">
            <div class="tip-title">Atenção:</div>
            <p>O campo Ponderado Médio deve ser preenchido com o valor total (ex: 150.000,00)</p>
        </div>`;
        
    document.getElementById("dica-aceleradores").innerHTML = `
        <div class="tip-box">
            <div class="tip-title">Informação:</div>
            <p>Os aceleradores são calculados automaticamente com base no valor Safra</p>
        </div>`;
});