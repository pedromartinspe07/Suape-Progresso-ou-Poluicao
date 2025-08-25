// js/chart.js - Versão compatível com GitHub Pages

console.log('Chart.js script carregado');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado, verificando Chart.js...');
    
    // Aguarda o carregamento do Chart.js via CDN
    if (typeof Chart === 'undefined') {
        console.error('Chart.js não foi carregado. Verifique se o CDN está funcionando.');
        // Tenta carregar novamente após um delay
        setTimeout(() => {
            if (typeof Chart === 'undefined') {
                console.error('Chart.js ainda não disponível após timeout');
                return;
            } else {
                console.log('Chart.js carregado após timeout');
                initializeCharts();
            }
        }, 1000);
        return;
    }
    
    console.log('Chart.js disponível, inicializando gráficos...');
    initializeCharts();
});

function initializeCharts() {
    // Função para obter cores das variáveis CSS
    function getCssVariable(variable) {
        return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
    }

    // Cores obtidas do seu arquivo style.css
    const primaryColor = getCssVariable('--primary-color') || '#004d40';
    const accentGreen = getCssVariable('--accent-color-green') || '#81c784';
    const accentBrown = getCssVariable('--accent-color-brown') || '#a1887f';
    const accentRed = '#D45D5D';
    
    // Verifica se as cores foram carregadas corretamente
    console.log('Verificação de cores:');
    console.log('- primaryColor:', primaryColor);
    console.log('- accentGreen:', accentGreen);
    console.log('- accentBrown:', accentBrown);
    console.log('- accentRed:', accentRed);

    console.log('Cores carregadas:', { primaryColor, accentGreen, accentBrown, accentRed });

    // ===========================================
    // Gráfico 1: Crescimento Econômico vs. Poluição do Ar
    // ===========================================

    const pollutionData = {
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
    };

    const airPollutionChartElement = document.getElementById('airPollutionChart');
    console.log('Elemento do gráfico 1 encontrado:', airPollutionChartElement);
    
    if (airPollutionChartElement) {
        try {
            new Chart(airPollutionChartElement, pollutionConfig);
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

    const mangroveData = {
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
    };

    const mangroveChartElement = document.getElementById('mangroveChart');
    console.log('Elemento do gráfico 2 encontrado:', mangroveChartElement);
    
    if (mangroveChartElement) {
        try {
            new Chart(mangroveChartElement, mangroveConfig);
            console.log('Gráfico 2 criado com sucesso');
        } catch (error) {
            console.error('Erro ao criar o gráfico 2:', error);
        }
    } else {
        console.error('Elemento mangroveChart não encontrado');
    }
}
