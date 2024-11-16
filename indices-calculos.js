// Dados dos cálculos
const calculos = {
    'complacencia': {
        titulo: 'Complacência pulmonar',
        formula: 'C = ΔV / ΔP',
        descricao: 'Onde:<br>' +
                  'C = Complacência (mL/cmH2O)<br>' +
                  'ΔV = Variação de volume (Volume corrente)<br>' +
                  'ΔP = Variação de pressão (Pressão de platô - PEEP)',
        referencia: 'Valores normais: 50-100 mL/cmH2O',
        campos: [
            { id: 'volume', label: 'Volume corrente (mL)', type: 'number' },
            { id: 'plato', label: 'Pressão de platô (cmH2O)', type: 'number' },
            { id: 'peep', label: 'PEEP (cmH2O)', type: 'number' }
        ],
        calcular: (valores) => {
            const deltaP = valores.plato - valores.peep;
            return (valores.volume / deltaP).toFixed(2) + ' mL/cmH2O';
        }
    },
    'volume-minuto': {
        titulo: 'Volume minuto',
        formula: 'VM = VC × f',
        descricao: 'Onde:<br>' +
                  'VM = Volume minuto (L/min)<br>' +
                  'VC = Volume corrente (mL)<br>' +
                  'f = Frequência respiratória (rpm)',
        referencia: 'Valores normais: 5-8 L/min',
        campos: [
            { id: 'vc', label: 'Volume corrente (mL)', type: 'number' },
            { id: 'fr', label: 'Frequência respiratória (rpm)', type: 'number' }
        ],
        calcular: (valores) => {
            return ((valores.vc * valores.fr) / 1000).toFixed(2) + ' L/min';
        }
    },
    'resistencia': {
        titulo: 'Resistência da via aérea',
        formula: 'Raw = (Ppico - Pplatô) / Fluxo',
        descricao: 'Onde:<br>' +
                  'Raw = Resistência da via aérea (cmH2O/L/s)<br>' +
                  'Ppico = Pressão de pico (cmH2O)<br>' +
                  'Pplatô = Pressão de platô (cmH2O)<br>' +
                  'Fluxo = Fluxo inspiratório (L/s)',
        referencia: 'Valores normais: < 10 cmH2O/L/s',
        campos: [
            { id: 'pico', label: 'Pressão de pico (cmH2O)', type: 'number' },
            { id: 'plato', label: 'Pressão de platô (cmH2O)', type: 'number' },
            { id: 'fluxo', label: 'Fluxo inspiratório (L/s)', type: 'number' }
        ],
        calcular: (valores) => {
            return ((valores.pico - valores.plato) / valores.fluxo).toFixed(2) + ' cmH2O/L/s';
        }
    },
    'volume-corrente': {
        titulo: 'Volume corrente',
        formula: 'VC = 4-6 mL/kg (peso ideal)',
        descricao: 'Volume corrente baseado no peso ideal do paciente para ventilação protetora.',
        referencia: 'Valores recomendados: 4-6 mL/kg de peso ideal',
        campos: [
            { id: 'peso', label: 'Peso ideal (kg)', type: 'number' }
        ],
        calcular: (valores) => {
            const vcMin = (valores.peso * 4).toFixed(0);
            const vcMax = (valores.peso * 6).toFixed(0);
            return `${vcMin} - ${vcMax} mL`;
        }
    },
    'pao2-idade': {
        titulo: 'PaO2 esperado por idade',
        formula: 'PaO2 = 103.5 - (0.42 × idade)',
        descricao: 'Cálculo da PaO2 esperada de acordo com a idade do paciente.',
        referencia: 'Fórmula de Sorbini',
        campos: [
            { id: 'idade', label: 'Idade (anos)', type: 'number' }
        ],
        calcular: (valores) => {
            return (103.5 - (0.42 * valores.idade)).toFixed(1) + ' mmHg';
        }
    },
    'pao2-fio2': {
        titulo: 'Relação PaO2 e FiO2',
        formula: 'P/F = PaO2 / FiO2',
        descricao: 'Onde:<br>' +
                  'P/F = Relação PaO2/FiO2<br>' +
                  'PaO2 = Pressão arterial de oxigênio (mmHg)<br>' +
                  'FiO2 = Fração inspirada de oxigênio (em decimal)',
        referencia: 'Valores de referência:<br>' +
                   'Normal: > 400<br>' +
                   'SDRA leve: ≤ 300<br>' +
                   'SDRA moderada: ≤ 200<br>' +
                   'SDRA grave: ≤ 100',
        campos: [
            { id: 'pao2', label: 'PaO2 (mmHg)', type: 'number' },
            { id: 'fio2', label: 'FiO2 (ex: 0.21 a 1.0)', type: 'number', step: '0.01' }
        ],
        calcular: (valores) => {
            return (valores.pao2 / valores.fio2).toFixed(1);
        }
    },
    'indice-oxigenacao': {
        titulo: 'Índice de Oxigenação',
        formula: 'IO = (FiO2 × Pmédia × 100) / PaO2',
        descricao: 'Onde:<br>' +
                  'IO = Índice de Oxigenação<br>' +
                  'FiO2 = Fração inspirada de oxigênio (em decimal)<br>' +
                  'Pmédia = Pressão média das vias aéreas (cmH2O)<br>' +
                  'PaO2 = Pressão arterial de oxigênio (mmHg)',
        referencia: 'Valores de referência:<br>' +
                   'Normal: < 4<br>' +
                   'Leve: 4-8<br>' +
                   'Moderado: 8-15<br>' +
                   'Grave: 15-25<br>' +
                   'Muito grave: > 25',
        campos: [
            { id: 'fio2', label: 'FiO2 (ex: 0.21 a 1.0)', type: 'number', step: '0.01' },
            { id: 'pmedia', label: 'Pressão média (cmH2O)', type: 'number' },
            { id: 'pao2', label: 'PaO2 (mmHg)', type: 'number' }
        ],
        calcular: (valores) => {
            return ((valores.fio2 * valores.pmedia * 100) / valores.pao2).toFixed(1);
        }
    },
    'indice-tobin': {
        titulo: 'Índice de respiração rápida e superficial (Tobin)',
        formula: 'f/VT = FR / (VC/1000)',
        descricao: 'Onde:<br>' +
                  'f/VT = Índice de Tobin<br>' +
                  'FR = Frequência respiratória (rpm)<br>' +
                  'VC = Volume corrente (mL)',
        referencia: 'Valores de referência:<br>' +
                   '< 105: Sucesso no desmame<br>' +
                   '> 105: Provável falha no desmame',
        campos: [
            { id: 'fr', label: 'Frequência respiratória (rpm)', type: 'number' },
            { id: 'vc', label: 'Volume corrente (mL)', type: 'number' }
        ],
        calcular: (valores) => {
            return ((valores.fr / (valores.vc/1000))).toFixed(1);
        }
    },
    'peso-ideal': {
        titulo: 'Peso Ideal',
        formula: 'Homens: 50 + 2.3 × (altura(cm)/2.54 - 60)<br>Mulheres: 45.5 + 2.3 × (altura(cm)/2.54 - 60)',
        descricao: 'Cálculo do peso ideal baseado na altura e sexo do paciente.',
        referencia: 'Fórmula de Devine',
        campos: [
            { id: 'altura', label: 'Altura (cm)', type: 'number' },
            { 
                id: 'sexo', 
                label: 'Sexo', 
                type: 'select', 
                options: [
                    { value: 'M', label: 'Masculino' },
                    { value: 'F', label: 'Feminino' }
                ]
            }
        ],
        calcular: (valores) => {
            const alturaPolegadas = valores.altura / 2.54;
            if (valores.sexo === 'M') {
                return (50 + 2.3 * (alturaPolegadas - 60)).toFixed(1) + ' kg';
            } else {
                return (45.5 + 2.3 * (alturaPolegadas - 60)).toFixed(1) + ' kg';
            }
        }
    },
    'imc': {
        titulo: 'Índice de Massa Corporal',
        formula: 'IMC = peso / (altura)²',
        descricao: 'Onde:<br>' +
                  'IMC = Índice de Massa Corporal (kg/m²)<br>' +
                  'Peso em kg<br>' +
                  'Altura em metros',
        referencia: 'Classificação:<br>' +
                   '< 18.5: Abaixo do peso<br>' +
                   '18.5-24.9: Peso normal<br>' +
                   '25-29.9: Sobrepeso<br>' +
                   '30-34.9: Obesidade grau I<br>' +
                   '35-39.9: Obesidade grau II<br>' +
                   '≥ 40: Obesidade grau III',
        campos: [
            { id: 'peso', label: 'Peso (kg)', type: 'number' },
            { id: 'altura', label: 'Altura (m)', type: 'number', step: '0.01' }
        ],
        calcular: (valores) => {
            const imc = valores.peso / (valores.altura * valores.altura);
            return imc.toFixed(1) + ' kg/m²';
        }
    },
    'rox': {
        titulo: 'Índice ROX',
        formula: 'ROX = (SpO2/FiO2) / FR',
        descricao: 'Onde:<br>' +
                  'ROX = Índice ROX<br>' +
                  'SpO2 = Saturação de oxigênio (%)<br>' +
                  'FiO2 = Fração inspirada de oxigênio (em decimal)<br>' +
                  'FR = Frequência respiratória (rpm)',
        referencia: 'Valores de referência:<br>' +
                   '> 4.88: Baixo risco de falha da CNAF<br>' +
                   '< 3.85: Alto risco de falha da CNAF',
        campos: [
            { id: 'spo2', label: 'SpO2 (%)', type: 'number' },
            { id: 'fio2', label: 'FiO2 (ex: 0.21 a 1.0)', type: 'number', step: '0.01' },
            { id: 'fr', label: 'Frequência respiratória (rpm)', type: 'number' }
        ],
        calcular: (valores) => {
            return ((valores.spo2/valores.fio2) / valores.fr).toFixed(2);
        }
    }
};

// Função para mostrar o cálculo selecionado
function mostrarCalculo(tipo) {
    const calculo = calculos[tipo];
    if (!calculo) return;

    // Limpa o conteúdo anterior
    const container = document.getElementById('calculos-content');
    container.innerHTML = '';

    // Cria o novo conteúdo
    const content = document.createElement('div');
    content.className = 'calculo-content active';
    content.innerHTML = `
        <h3>${calculo.titulo}</h3>
        <form class="calculo-form" onsubmit="calcularResultado('${tipo}', event)">
            ${calculo.campos.map(campo => {
                if (campo.type === 'select') {
                    return `
                        <div class="input-group">
                            <label for="${campo.id}">${campo.label}</label>
                            <select id="${campo.id}" required>
                                ${campo.options.map(option => 
                                    `<option value="${option.value}">${option.label}</option>`
                                ).join('')}
                            </select>
                        </div>
                    `;
                } else {
                    return `
                        <div class="input-group">
                            <label for="${campo.id}">${campo.label}</label>
                            <input type="${campo.type}" id="${campo.id}" required>
                        </div>
                    `;
                }
            }).join('')}
            <button type="submit" class="btn-calcular">Calcular</button>
        </form>
        <div class="resultado" id="resultado-${tipo}"></div>
        <div class="referencia">${calculo.referencia}</div>
    `;

    container.appendChild(content);

    // Atualiza o estilo dos itens da lista
    document.querySelectorAll('.lista-item').forEach(item => {
        item.style.backgroundColor = 'var(--branco)';
    });
    event.currentTarget.style.backgroundColor = 'var(--azul-claro)';

    // Adiciona rolagem suave para dispositivos móveis
    setTimeout(() => {
        const targetElement = document.querySelector('.calculo-form');
        if (targetElement) {
            const headerOffset = 60;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }, 100);
}// Função para calcular o resultado
function calcularResultado(tipo, event) {
    event.preventDefault();
    const calculo = calculos[tipo];
    const valores = {};

    // Coleta os valores dos campos
    calculo.campos.forEach(campo => {
        valores[campo.id] = parseFloat(document.getElementById(campo.id).value);
    });

    // Calcula o resultado
    const resultado = calculo.calcular(valores);

    // Mostra o resultado
    const resultadoDiv = document.getElementById(`resultado-${tipo}`);
    resultadoDiv.innerHTML = `<strong>Resultado:</strong> ${resultado}`;
    resultadoDiv.classList.add('active');
}

// Mostrar primeiro cálculo por padrão
document.addEventListener('DOMContentLoaded', function() {
    mostrarCalculo('complacencia');
});