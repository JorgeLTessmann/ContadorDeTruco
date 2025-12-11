// script.js - Contador de Pontos Otimizado
class ScoreSystem {
  constructor() {
    this.pontos = { A: 0, B: 0 };
    this.init();
  }

  init() {
    this.cacheElements();
    this.bindEvents();
    this.atualizarPlacar();
    this.adicionarEstilos();
  }

  cacheElements() {
    this.elements = {
      placarA: document.getElementById('placarA'),
      placarB: document.getElementById('placarB'),
      valorLivreA: document.getElementById('valorLivreA'),
      valorLivreB: document.getElementById('valorLivreB'),
      resetTudo: document.getElementById('resetTudo')
    };
  }

  adicionarEstilos() {
    // Adiciona estilos dinâmicos para feedback visual
    const style = document.createElement('style');
    style.textContent = `
            .pulse-animation {
                animation: pulse 0.3s ease-in-out;
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            
            .score-positive { color: #4CAF50 !important; }
            .score-negative { color: #f44336 !important; }
            .score-normal { color: inherit; }
            
            .message-toast {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 20px;
                border-radius: 8px;
                color: white;
                font-weight: bold;
                z-index: 1000;
                opacity: 0;
                transform: translateX(100%);
                transition: all 0.3s ease;
            }
            
            .message-toast.show {
                opacity: 1;
                transform: translateX(0);
            }
            
            .message-error { background: #f44336; }
            .message-warning { background: #ff9800; }
            .message-success { background: #4CAF50; }
            .message-info { background: #2196F3; }
        `;
    document.head.appendChild(style);
  }

  bindEvents() {
    // Botões de pontos fixos (incluindo o que era para ser -1)
    document.querySelectorAll('.add-fixed').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const team = e.target.dataset.team;
        const valorText = e.target.dataset.value;
        const btnText = e.target.textContent.trim();

        // Verifica se é o botão de -1 (sem data-value e texto "-1")
        if (!valorText && btnText === '-1') {
          this.adicionarPontos(team, -1);
          return;
        }

        // Verifica se é o botão de valor livre
        if (btnText.includes('valor livre')) {
          const inputId = `valorLivre${team}`;
          const inputElement = this.elements[inputId];
          const valor = parseInt(inputElement.value, 10);

          if (isNaN(valor)) {
            this.showMessage('Digite um número válido!', 'error');
            inputElement.focus();
            return;
          }

          if (valor === 0) {
            this.showMessage('O valor não pode ser zero!', 'warning');
            return;
          }

          this.adicionarPontos(team, valor);
          inputElement.value = '';
          inputElement.focus();
          return;
        }

        // Botões normais com data-value
        const valor = parseInt(valorText, 10);
        if (!isNaN(valor)) {
          this.adicionarPontos(team, valor);
        }
      });
    });

    // Reset completo
    this.elements.resetTudo.addEventListener('click', () => this.resetCompleto());

    // Permitir Enter nos inputs de valor livre
    ['valorLivreA', 'valorLivreB'].forEach(id => {
      const input = document.getElementById(id);
      if (input) {
        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            const team = id === 'valorLivreA' ? 'A' : 'B';
            // Encontra o botão correspondente
            const btn = document.querySelector(`.add-fixed[data-team="${team}"]`);
            if (btn && btn.textContent.includes('valor livre')) {
              btn.click();
            }
          }
        });
      }
    });
  }

  adicionarPontos(team, valor) {
    // Validações
    if (!['A', 'B'].includes(team)) {
      console.error('Time inválido:', team);
      return;
    }

    if (typeof valor !== 'number' || isNaN(valor)) {
      console.error('Valor inválido:', valor);
      return;
    }

    // Salva estado anterior
    const pontosAntes = this.pontos[team];

    // Atualiza pontos
    this.pontos[team] += valor;

    // Evita valores negativos
    if (this.pontos[team] < 0) {
      this.pontos[team] = 0;
      this.showMessage('Pontuação não pode ser negativa!', 'warning');
    }

    // Atualiza interface
    this.atualizarPlacar(team, pontosAntes);

    // Feedback visual
    this.animarPlacar(team, valor);

    // Log no console para debug
    console.log(`Time ${team}: ${pontosAntes} → ${this.pontos[team]} (${valor > 0 ? '+' : ''}${valor})`);
  }

  atualizarPlacar(team = null, pontosAntes = 0) {
    // Atualiza ambos os placares ou apenas um específico
    if (team === 'A' || team === null) {
      this.elements.placarA.textContent = this.pontos.A;
      this.aplicarEfeitoCor(this.elements.placarA, this.pontos.A, pontosAntes);
    }

    if (team === 'B' || team === null) {
      this.elements.placarB.textContent = this.pontos.B;
      this.aplicarEfeitoCor(this.elements.placarB, this.pontos.B, pontosAntes);
    }
  }

  aplicarEfeitoCor(elemento, pontosAtuais, pontosAntes) {
    // Remove classes anteriores
    elemento.classList.remove('score-positive', 'score-negative', 'score-normal');

    // Aplica efeito de cor baseado na mudança
    if (pontosAtuais > pontosAntes) {
      elemento.classList.add('score-positive');
      setTimeout(() => elemento.classList.remove('score-positive'), 500);
    } else if (pontosAtuais < pontosAntes) {
      elemento.classList.add('score-negative');
      setTimeout(() => elemento.classList.remove('score-negative'), 500);
    } else {
      elemento.classList.add('score-normal');
    }
  }

  animarPlacar(team, valor) {
    const elemento = team === 'A' ? this.elements.placarA : this.elements.placarB;

    // Adiciona animação
    elemento.classList.remove('pulse-animation');
    void elemento.offsetWidth; // Trigger reflow
    elemento.classList.add('pulse-animation');

    // Remove a classe após a animação
    setTimeout(() => {
      elemento.classList.remove('pulse-animation');
    }, 300);
  }

  resetCompleto() {

    // Mostra animação de reset
    this.elements.placarA.classList.add('score-negative');
    this.elements.placarB.classList.add('score-negative');

    // Reseta os pontos
    this.pontos.A = 0;
    this.pontos.B = 0;
    this.atualizarPlacar();

    // Feedback
    this.showMessage('Placar reiniciado com sucesso!', 'success');

    // Remove as classes de cor
    setTimeout(() => {
      this.elements.placarA.classList.remove('score-negative');
      this.elements.placarB.classList.remove('score-negative');
    }, 1000);

  }

  showMessage(mensagem, tipo = 'info') {
    // Remove mensagem anterior se existir
    const mensagemAnterior = document.querySelector('.message-toast');
    if (mensagemAnterior) {
      mensagemAnterior.remove();
    }

    // Cria nova mensagem
    const mensagemDiv = document.createElement('div');
    mensagemDiv.className = `message-toast message-${tipo}`;
    mensagemDiv.textContent = mensagem;
    document.body.appendChild(mensagemDiv);

    // Mostra a mensagem
    setTimeout(() => mensagemDiv.classList.add('show'), 10);

    // Remove após 3 segundos
    setTimeout(() => {
      mensagemDiv.classList.remove('show');
      setTimeout(() => {
        if (mensagemDiv.parentNode) {
          mensagemDiv.remove();
        }
      }, 300);
    }, 3000);
  }
}

// Inicializa o sistema quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
  window.scoreSystem = new ScoreSystem();

  // Adiciona dicas visuais nos inputs
  const inputs = document.querySelectorAll('.valor-livre');
  inputs.forEach(input => {
    // Placeholder mais descritivo
    input.placeholder = 'Digite os pontos...';

    // Dica no foco
    input.addEventListener('focus', function () {
      this.style.borderColor = '#4CAF50';
    });

    input.addEventListener('blur', function () {
      this.style.borderColor = '';
    });
  });

  console.log('✅ Sistema de placar inicializado com sucesso!');
});