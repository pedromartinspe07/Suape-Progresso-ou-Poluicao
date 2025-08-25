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

    // ===========================================
    // Gráfico 1: Crescimento Econômico vs. Poluição do Ar
    // ===========================================

    const airPollutionChartElement = document.getElementById('airPollutionChart');
    console.log('Elemento do gráfico 1 encontrado:', airPollutionChartElement);
    
    if (airPollutionChartElement) {
        try {
            const pollutionChart = new Chart(airPollutionChartElement, {
                type: 'line',
                data: {
                    labels: ['2015', '2016', '2017', '2018', '2019', '2020'],
                    datasets: [{
                        label: 'Poluição do Ar (μg/m³)',
                        data: [180, 210, 230, 250, 275, 300],
                        borderColor: accentRed,
                        backgroundColor: 'rgba(212, 93, 93, 0.2)',
                        yAxisID: 'y',
                        tension: 0.4,
                        pointStyle: 'circle',
                        pointRadius: 6,
                        pointHoverRadius: 8
                    }, {
                        label: 'PIB (bilhões de R$)',
                        data: [50, 55, 60, 68, 75, 82],
                        borderColor: primaryColor,
                        backgroundColor: primaryColor,
                        yAxisID: 'y1',
                        tension: 0.4,
                        pointStyle: 'rectRot',
                        pointRadius: 6,
                        pointHoverRadius: 8
                    }]
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
            console.log('Gráfico 1 criado com sucesso');
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
                    labels: ['Área Original (2000)', 'Área Atual (2020)'],
                    datasets: [{
                        label: 'Área de Manguezal',
                        data: [1500, 1050],
                        backgroundColor: [
                            accentGreen,
                            accentBrown
                        ],
                        borderColor: [
                            accentGreen,
                            accentBrown
                        ],
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
            console.log('Gráfico 2 criado com sucesso');
        } catch (error) {
            console.error('Erro ao criar o gráfico 2:', error);
        }
    } else {
        console.error('Elemento mangroveChart não encontrado');
    }
});
