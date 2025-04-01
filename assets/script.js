
        function createParticles() {
            const container = document.getElementById('particles');
            const particleCount = 30;
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                
                // Posição aleatória para a imagem logo fortsn
                const posX = Math.random() * 100;
                const posY = Math.random() * 100;
                
                // Tamanho aleatório entre 1px e 3px
                const size = Math.random() * 2 + 1;
                
               
                const opacity = Math.random() * 0.5 + 0.1;
                
                const duration = Math.random() * 20 + 10;
                const delay = Math.random() * 5;
                
                particle.style.left = `${posX}%`;
                particle.style.top = `${posY}%`;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.opacity = opacity;
                particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
                
                container.appendChild(particle);
            }
        }


        let resultadoConquista = 0;
        let resultadoSafra = 0;
        let resultadoAceleradores = 0;


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

        // usar enter para calcular
        document.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                // Verifica qual campo está ativo para chamar a função correta
                if (document.activeElement.id === 'new-mas' || 
                    document.activeElement.id === 'valor-referencia' || 
                    document.activeElement.id === 'categoria') {
                    calcularConquista();
                } else if (document.activeElement.id === 'migrados-totais' || 
                          document.activeElement.id === 'ponderado-medio') {
                    calcularSafraEAceleradores();
                }
            }
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

            // Animação de resultado
            const resultBox = document.getElementById("resultado-conquista");
            resultBox.innerHTML = `<p>Conquista: <strong>${formatarMoeda(resultadoConquista)}</strong></p>`;
            resultBox.classList.add('animate__animated', 'animate__pulse');
            setTimeout(() => {
                resultBox.classList.remove('animate__animated', 'animate__pulse');
            }, 1000);

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
                    <div class="tip-box animate__animated animate__shakeX">
                        <div class="tip-title">Aviso:</div> 
                        <p>Ponderado Médio abaixo de R$ 100.000 - Valor Safra reduzido em 50%</p>
                    </div>`;
            } else {
                document.getElementById("dica-safra").innerHTML = "";
            }

            resultadoSafra = totalSafra;
            
            // Animação de resultado Safra
            const resultSafra = document.getElementById("resultado-safra");
            resultSafra.innerHTML = `<p><strong>${formatarMoeda(resultadoSafra)}</strong></p>`;
            resultSafra.classList.add('animate__animated', 'animate__fadeIn');
            setTimeout(() => {
                resultSafra.classList.remove('animate__animated', 'animate__fadeIn');
            }, 1000);

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
            
            // Animação de resultado Aceleradores
            const resultAceleradores = document.getElementById("resultado-aceleradores");
            resultAceleradores.innerHTML = `<p><strong>${formatarMoeda(resultadoAceleradores)}</strong></p>`;
            resultAceleradores.classList.add('animate__animated', 'animate__fadeIn');
            setTimeout(() => {
                resultAceleradores.classList.remove('animate__animated', 'animate__fadeIn');
            }, 1000);
            
            // Mostrar dicas de aceleradores
            if (dicaAcelerador) {
                const dicaBox = document.getElementById("dica-aceleradores");
                dicaBox.innerHTML = `
                    <div class="tip-box animate__animated animate__fadeIn">
                        <div class="tip-title">Aceleradores aplicados:</div> 
                        ${dicaAcelerador}
                    </div>`;
                setTimeout(() => {
                    dicaBox.firstChild.classList.remove('animate__animated', 'animate__fadeIn');
                }, 1000);
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

            // Animação de resultado final
            const resultFinal = document.getElementById("resultado-final");
            resultFinal.innerHTML = `
                <h3>Resultado Final para ${nomeConsultor}</h3>
                <p>Conquista: ${formatarMoeda(resultadoConquista)}</p>
                <p>Safra: ${formatarMoeda(resultadoSafra)}</p>
                <p>Aceleradores: ${formatarMoeda(resultadoAceleradores)}</p>
                <p class="animate__animated animate__pulse" style="font-size: 1.3rem; margin-top: 15px;"><strong>Total: ${formatarMoeda(totalComissionamento)}</strong></p>
            `;
            
            // Adiciona efeito de confete quando o total é maior que zero
            if (totalComissionamento > 0) {
                setTimeout(() => {
                    const totalElement = resultFinal.querySelector('p:last-child');
                    totalElement.classList.add('animate__animated', 'animate__tada');
                    setTimeout(() => {
                        totalElement.classList.remove('animate__animated', 'animate__tada');
                    }, 1000);
                }, 300);
            }
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
            
            // Resetar resultados com animação
            const resetElements = [
                "resultado-conquista",
                "resultado-safra",
                "resultado-aceleradores",
                "resultado-final",
                "dica-safra",
                "dica-aceleradores"
            ];
            
            resetElements.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.classList.add('animate__animated', 'animate__fadeOut');
                    setTimeout(() => {
                        element.innerHTML = "";
                        element.classList.remove('animate__animated', 'animate__fadeOut');
                        element.classList.add('animate__animated', 'animate__fadeIn');
                        setTimeout(() => {
                            element.classList.remove('animate__animated', 'animate__fadeIn');
                        }, 500);
                    }, 500);
                }
            });
            
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
            const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
            const ano = dataAtual.getFullYear();
            const dataFormatada = `${dia}-${mes}-${ano}`;
            
            // Animação de confirmação
            const exportBtn = document.querySelector('.btn-export');
            exportBtn.innerHTML = '✔ PDF Gerado!';
            exportBtn.style.backgroundColor = '#28a745';
            setTimeout(() => {
                exportBtn.innerHTML = 'Exportar PDF';
                exportBtn.style.backgroundColor = '';
                doc.save(`Comissionamento_${nomeConsultor.replace(/\s/g, '_')}_${dataFormatada}.pdf`);
            }, 1500);
        }

        // Inicialização
        document.addEventListener('DOMContentLoaded', function() {
            createParticles();
            
            document.getElementById("dica-safra").innerHTML = `
                <div class="tip-box animate__animated animate__fadeIn">
                    <div class="tip-title">Atenção:</div>
                    <p>O campo Ponderado Médio deve ser preenchido com o valor total (ex: 150.000,00)</p>
                </div>`;
                
            document.getElementById("dica-aceleradores").innerHTML = `
                <div class="tip-box animate__animated animate__fadeIn">
                    <div class="tip-title">Informação:</div>
                    <p>Os aceleradores são calculados automaticamente com base no valor Safra</p>
                </div>`;
                
            // Adiciona efeito de digitação ao título
            const typingElements = document.querySelectorAll('.typing-effect');
            typingElements.forEach(el => {
                const text = el.textContent;
                el.textContent = '';
                let i = 0;
                const typing = setInterval(() => {
                    if (i < text.length) {
                        el.textContent += text.charAt(i);
                        i++;
                    } else {
                        clearInterval(typing);
                    }
                }, 50);
            });
        });