// js/charts.js

// Importa a biblioteca Chart.js
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Importa o plugin de rótulos de dados

// Registra o plugin para que Chart.js possa usá-lo
Chart.register(ChartDataLabels);

document.addEventListener('DOMContentLoaded', () => {

    // Função para obter cores das variáveis CSS
    function getCssVariable(variable) {
        return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
    }

    // Cores obtidas do seu arquivo style.css (Corrigido: 'accent-color-red' substituído por uma cor padrão)
    const primaryColor = getCssVariable('--primary-color');
    const accentGreen = getCssVariable('--accent-color-green');
    const accentBrown = getCssVariable('--accent-color-brown');
    const accentRed = '#D45D5D'; // ✨ CORREÇÃO: Variável inexistente foi substituída por um valor fixo.

    // ===========================================
    // Gráfico 1: Crescimento Econômico vs. Poluição do Ar
    // ===========================================

    const pollutionData = {
        labels: ['2015', '2016', '2017', '2018', '2019', '2020'],
        datasets: [{
            label: 'Poluição do Ar (μg/m³)',
            data: [180, 210, 230, 250, 275, 300],
            borderColor: accentRed,
            backgroundColor: 'rgba(212, 93, 93, 0.2)', // ✨ MELHORIA: Usa a cor corrigida
            yAxisID: 'y',
            tension: 0.4,
            pointStyle: 'circle',
            pointRadius: 6,
            pointHoverRadius: 8
        }, {
            label: 'PIB (bilhões de R$)',
            data: [50, 55, 60, 68, 75, 82],
            borderColor: primaryColor,
            backgroundColor: primaryColor, // ✨ MELHORIA: Usa a cor principal para o PIB
            yAxisID: 'y1',
            tension: 0.4,
            pointStyle: 'rectRot',
            pointRadius: 6,
            pointHoverRadius: 8
        }]
    };

    const pollutionConfig = {
        type: 'line',
        data: pollutionData,
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
                                // ✨ MELHORIA: Formatação mais clara para o PIB
                                label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(context.parsed.y * 1000000000).replace(',00', '');
                            }
                            return label;
                        }
                    }
                },
                // ✨ MELHORIA: Adiciona plugin para exibir rótulos de dados para o Gráfico 1 também
                datalabels: {
                    display: false, // Desativa por padrão para o gráfico de linhas
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
    };

    const airPollutionChartElement = document.getElementById('airPollutionChart');
    if (airPollutionChartElement) {
        new Chart(airPollutionChartElement, pollutionConfig);
    }

    // ===========================================
    // Gráfico 2: Degradação de Manguezais
    // ===========================================

    const mangroveData = {
        labels: ['Área Original (2000)', 'Área Atual (2020)'],
        datasets: [{
            label: 'Área de Manguezal',
            data: [1500, 1050],
            backgroundColor: [
                accentGreen,
                accentBrown // ✨ MELHORIA: Usando uma cor mais apropriada da paleta
            ],
            borderColor: [
                accentGreen,
                accentBrown
            ],
            borderWidth: 1,
            barPercentage: 0.6,
        }]
    };

    const mangroveConfig = {
        type: 'bar',
        data: mangroveData,
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
                // ✨ MELHORIA: Adiciona plugin para exibir rótulos de dados
                datalabels: {
                    anchor: 'end',
                    align: 'top',
                    formatter: (value) => `${value} ha`,
                    color: primaryColor,
                    font: {
                        size: 14,
                        weight: 'bold'
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
    };

    const mangroveChartElement = document.getElementById('mangroveChart');
    if (mangroveChartElement) {
        // ✨ NOTA: Para usar o plugin `datalabels`, você precisa importá-lo:
        // Exemplo: import ChartDataLabels from 'chartjs-plugin-datalabels';
        // Chart.register(ChartDataLabels);
        new Chart(mangroveChartElement, mangroveConfig);
    }
});
