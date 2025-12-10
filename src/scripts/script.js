 let pontos = { A: 0, B: 0 };

  function atualizarPlacar(team) {
    if (team === "A") {
      document.getElementById("placarA").textContent = pontos.A;
    } else {
      document.getElementById("placarB").textContent = pontos.B;
    }
  }

  function adicionarPontos(team, valor) {
    pontos[team] += valor;
    if (pontos[team] < 0) pontos[team] = 0; // evita negativo
    atualizarPlacar(team);
  }

  document.querySelectorAll(".add-fixed").forEach(btn => {
    btn.addEventListener("click", () => {
      const team = btn.dataset.team;
      const valor = parseInt(btn.dataset.value);
      adicionarPontos(team, valor);
    });
  });

  document.querySelectorAll(".remove-one").forEach(btn => {
    btn.addEventListener("click", () => {
      const team = btn.dataset.team;
      adicionarPontos(team, -1);
    });
  });

  document.querySelectorAll(".add-free").forEach(btn => {
    btn.addEventListener("click", () => {
      const team = btn.dataset.team;
      const inputId = team === "A" ? "valorLivreA" : "valorLivreB";
      const valor = parseInt(document.getElementById(inputId).value);

      if (isNaN(valor)) {
        alert("Digite um número válido!");
        return;
      }

      adicionarPontos(team, valor);
      document.getElementById(inputId).value = "";
    });
  });

    document.getElementById("resetTudo").addEventListener("click", () => {
    pontos.A = 0;
    pontos.B = 0;
    atualizarPlacar("A");
    atualizarPlacar("B");
  });