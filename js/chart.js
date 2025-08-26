// js/chart.js - Versão compatível com GitHub Pages

console.log('Chart.js script carregado');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado, verificando Chart.js...');
    
    // Verifica se Chart.js está disponível
    if (typeof Chart === 'undefined') {
        console.error('Chart.js não foi carregado. Verifique se o CDN está funcionando.');
        return;
    }
    
    console.log('Chart.js disponível, inicializando gráficos...');
    
    // Função para obter cores das variáveis CSS
    function getCssVariable(variable) {
        return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
    }

    // Cores obtidas do seu arquivo style.css
    const primaryColor = getCssVariable('--primary-color') || '#004d40';
    const accentGreen = getCssVariable('--accent-color-green') || '#81c784';
    const accentBrown = getCssVariable('--accent-color-brown') || '#a1887f';
    const accentRed = '#D45D5D';
    
    console.log('Cores carregadas:', { primaryColor, accentGreen, accentBrown, accentRed });

    // Dados originais dos gráficos
    const dadosGrafico1 = {
        labels: ['2015', '2016', '2017', '2018', '2019', '2020'],
        poluicao: [180, 210, 230, 250, 275, 300],
        pib: [50, 55, 60, 68, 75, 82]
    };

    const dadosGrafico2 = {
        labels: ['Antes do Desenvolvimento', 'Após o Desenvolvimento'],
        area: [8500, 3200]
    };

    // Função para gerar CSV
    function exportarCSV(headers, rows, nomeArquivo) {
        let csv = headers.join(',') + '\n';
        rows.forEach(row => {
            csv += row.join(',') + '\n';
        });
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = nomeArquivo;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // ===========================================
    // Gráfico 1: Crescimento Econômico vs. Poluição do Ar
    // ===========================================

    const airPollutionChartElement = document.getElementById('airPollutionChart');
    console.log('Elemento do gráfico 1 encontrado:', airPollutionChartElement);
    
    if (airPollutionChartElement) {
        try {
            function getDatasetsGrafico1(tipo) {
                const datasets = [];
                if (tipo === 'ambos' || tipo === 'poluicao') {
                    datasets.push({
                        label: 'Poluição do Ar (μg/m³)',
                        data: dadosGrafico1.poluicao,
                        borderColor: accentRed,
                        backgroundColor: 'rgba(212, 93, 93, 0.2)',
                        yAxisID: 'y',
                        tension: 0.4,
                        pointStyle: 'circle',
                        pointRadius: 6,
                        pointHoverRadius: 8
                    });
                }
                if (tipo === 'ambos' || tipo === 'pib') {
                    datasets.push({
                        label: 'PIB (bilhões de R$)',
                        data: dadosGrafico1.pib,
                        borderColor: primaryColor,
                        backgroundColor: primaryColor,
                        yAxisID: 'y1',
                        tension: 0.4,
                        pointStyle: 'rectRot',
                        pointRadius: 6,
                        pointHoverRadius: 8
                    });
                }
                return datasets;
            }

            let pollutionChart;
            pollutionChart = new Chart(airPollutionChartElement, {
                type: 'line',
                data: {
                    labels: dadosGrafico1.labels,
                    datasets: getDatasetsGrafico1('ambos')
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        mode: 'index',
                        intersect: false,
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Crescimento Econômico e Poluição do Ar',
                            font: { size: 18, family: 'Montserrat' }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.dataset.label.includes('Poluição')) {
                                        label += `${context.parsed.y} µg/m³`;
                                    } else {
                                        label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(context.parsed.y * 1000000000).replace(',00', '');
                                    }
                                    return label;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            title: {
                                display: true,
                                text: 'Poluição do Ar (µg/m³)',
                                font: { size: 14, family: 'Open Sans' }
                            },
                            beginAtZero: false
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            grid: {
                                drawOnChartArea: false,
                            },
                            title: {
                                display: true,
                                text: 'PIB (em bilhões de R$)',
                                font: { size: 14, family: 'Open Sans' }
                            },
                            beginAtZero: true
                        }
                    }
                }
            });

            // Filtro de variáveis
            const selectGrafico1 = document.getElementById('grafico1-variavel');
            if (selectGrafico1) {
                selectGrafico1.addEventListener('change', (e) => {
                    const tipo = e.target.value;
                    pollutionChart.data.datasets = getDatasetsGrafico1(tipo);
                    pollutionChart.update();
                });
            }

            // Botão de download CSV
            const btnDownload1 = document.getElementById('download-grafico1');
            if (btnDownload1) {
                btnDownload1.addEventListener('click', () => {
                    const headers = ['Ano'];
                    const rows = dadosGrafico1.labels.map((ano, i) => [ano]);
                    if (selectGrafico1.value === 'ambos' || selectGrafico1.value === 'poluicao') {
                        headers.push('Poluição do Ar (μg/m³)');
                        rows.forEach((row, i) => row.push(dadosGrafico1.poluicao[i]));
                    }
                    if (selectGrafico1.value === 'ambos' || selectGrafico1.value === 'pib') {
                        headers.push('PIB (bilhões de R$)');
                        rows.forEach((row, i) => row.push(dadosGrafico1.pib[i]));
                    }
                    exportarCSV(headers, rows, 'grafico1_suape.csv');
                });
            }

        } catch (error) {
            console.error('Erro ao criar o gráfico 1:', error);
        }
    } else {
        console.error('Elemento airPollutionChart não encontrado');
    }

    // ===========================================
    // Gráfico 2: Degradação de Manguezais
    // ===========================================

    const mangroveChartElement = document.getElementById('mangroveChart');
    console.log('Elemento do gráfico 2 encontrado:', mangroveChartElement);
    
    if (mangroveChartElement) {
        try {
            const mangroveChart = new Chart(mangroveChartElement, {
                type: 'bar',
                data: {
                    labels: dadosGrafico2.labels,
                    datasets: [{
                        label: 'Área de Manguezal',
                        data: dadosGrafico2.area,
                        backgroundColor: [accentGreen, accentBrown],
                        borderColor: [accentGreen, accentBrown],
                        borderWidth: 1,
                        barPercentage: 0.6,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Impacto na Área de Manguezal de Suape',
                            font: { size: 18, family: 'Montserrat' }
                        },
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `${context.dataset.label}: ${context.parsed.y} ha`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Área (em hectares)',
                                font: { size: 14, family: 'Open Sans' }
                            }
                        }
                    }
                }
            });

            // Botão de download CSV para gráfico 2
            const btnDownload2 = document.getElementById('download-grafico2');
            if (btnDownload2) {
                btnDownload2.addEventListener('click', () => {
                    const headers = ['Categoria', 'Área de Manguezal (ha)'];
                    const rows = dadosGrafico2.labels.map((label, i) => [label, dadosGrafico2.area[i]]);
                    exportarCSV(headers, rows, 'grafico2_manguezal.csv');
                });
            }

        } catch (error) {
            console.error('Erro ao criar o gráfico 2:', error);
        }
    } else {
        console.error('Elemento mangroveChart não encontrado');
    }
});
