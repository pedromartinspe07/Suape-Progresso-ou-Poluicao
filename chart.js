// js/charts.js

document.addEventListener('DOMContentLoaded', () => {

    // Função para obter cores das variáveis CSS
    function getCssVariable(variable) {
        return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
    }

    // Cores obtidas do seu arquivo style.css
    const primaryColor = getCssVariable('--primary-color');
    const accentGreen = getCssVariable('--accent-color-green');
    const accentRed = getCssVariable('--accent-color-red');

    // ===========================================
    // Gráfico 1: Crescimento Econômico vs. Poluição do Ar
    // ===========================================

    const pollutionData = {
        labels: ['2015', '2016', '2017', '2018', '2019', '2020'],
        datasets: [{
            label: 'Poluição do Ar (μg/m³)',
            data: [180, 210, 230, 250, 275, 300],
            borderColor: accentRed,
            backgroundColor: 'rgba(220, 53, 69, 0.2)',
            yAxisID: 'y',
            tension: 0.4,
            pointStyle: 'circle',
            pointRadius: 6,
            pointHoverRadius: 8
        }, {
            label: 'PIB (bilhões de R$)',
            data: [50, 55, 60, 68, 75, 82],
            borderColor: primaryColor,
            backgroundColor: 'rgba(0, 51, 102, 0.2)',
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
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(context.parsed.y * 1000000000)
                                    .replace('R$', 'R$ ')
                                    .replace(',00', '');
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
                    beginAtZero: false // Inicia no valor mais baixo
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

    // Renderizar o Gráfico 1 se o elemento existir na página
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
                primaryColor
            ],
            borderColor: [
                accentGreen,
                primaryColor
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

    // Renderizar o Gráfico 2 se o elemento existir na página
    const mangroveChartElement = document.getElementById('mangroveChart');
    if (mangroveChartElement) {
        new Chart(mangroveChartElement, mangroveConfig);
    }
});
