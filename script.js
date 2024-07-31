// Referências aos elementos
const openPopupBtn = document.getElementById("openPopupBtn");
const closePopupBtn = document.getElementById("closePopupBtn");
const popupOverlay = document.getElementById("popupOverlay");
const popupForm = document.getElementById("popupForm");
const descricao = document.querySelector("#desc");
const valor = document.querySelector("#valor");
const data = document.querySelector("#data");
const th = document.querySelector("tbody");

// Referências aos boxes de resultado de entrada, saída e total
const entrada = document.querySelector("#entradaH1");
const totalFinal = document.querySelector("#totalH1");
const saida = document.querySelector("#saidaH1");

// Função para abrir o pop-up de formulário de preenchimento
openPopupBtn.addEventListener("click", () => {
  popupOverlay.style.display = "block";
  popupForm.style.display = "block";
});

// Função para fechar o pop-up
cancelarPopupBtn.addEventListener("click", () => {
  popupOverlay.style.display = "none";
  popupForm.style.display = "none";
});

// Também fechamos o pop-up ao clicar na sobreposição
popupOverlay.addEventListener("click", () => {
  popupOverlay.style.display = "none";
  popupForm.style.display = "none";
});

// Função para formatar a data inserida para o formato dd/mm/aaaa
function formatarData(dataValor) {
  // Cria um objeto Date com a data fornecida
  const data = new Date(dataValor);

  // Extrai o dia, mês e ano
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0"); // Mês começa em 0
  const ano = data.getFullYear();

  // Retorna a data formatada no formato brasileiro
  return `${dia}/${mes}/${ano}`;
}

// Função para converter os valores inseridos no formato da moeda Real BR
function converterParaReal(numero) {
  numero = numero.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  numero = `R$ ${numero}`;
  return numero;
}

function retirarFormatacaoNumero(numeroFormatado) {
  return parseFloat(
    numeroFormatado.textContent
      .replace("R$ ", "")
      .replace(".", "")
      .replace(",", ".")
  );
}

//Função para calcular os resultados
function calcularValores() {
  let entradaTotal = 0;
  let saidaTotal = 0;
  let totals = 0;
  const valores = document.querySelectorAll("tbody td:nth-child(2)");
  valores.forEach((valor) => {
    const valorNum = valor;
    const valorNum2 = retirarFormatacaoNumero(valorNum);
    totals += valorNum2;

    if (valorNum2 > 0) {
      entradaTotal += valorNum2;
    } else if (valorNum2 < 0) {
      saidaTotal += valorNum2;
    }
  });
  totalFinal.innerHTML = converterParaReal(totals);
  entrada.innerHTML = converterParaReal(entradaTotal);
  saida.innerHTML = converterParaReal(saidaTotal);
}

// Função para salvar os dados do formulário
salvarPopupBtn.addEventListener("click", function () {
  // Verifica se todos os campos foram preenchidos
  // if (descricao.value === "" || valor.value === "" || data.value === "") {
  //   alert("Por favor, preencha todos os campos.");
  //   return; // Para a execução da função caso algum campo esteja vazio
  // }
  //Fecha o formulário quando é salvo
  popupOverlay.style.display = "none";
  popupForm.style.display = "none";
  const dataValor = data.value;

  // Chama a função e armazena a data formatada
  const dataFormatada = formatarData(dataValor);
  const valorValue = parseFloat(valor.value);
  const ValorFormatado = converterParaReal(valorValue);
  const descricaoValue = descricao.value;

  if (valorValue > 0) {
    th.innerHTML += `<tr><td>${descricaoValue}</td><td id="positivo">${ValorFormatado}</td><td>${dataFormatada}</td><td><img src="./assets/delete.svg" class="delete"></td><tr>`;
  } else if (valorValue < 0) {
    th.innerHTML += `<tr><td>${descricaoValue}</td><td id="negativo">${ValorFormatado}</td><td>${dataFormatada}</td><td><img src="./assets/delete.svg" class="delete"></td><tr>`;
  }

  calcularValores();
  //Reseta os valores do formulário
  descricao.value = "";
  data.value = "";
  valor.value = "";
});

// Função para deletar um item da tabela
th.onclick = function (event) {
  if (event.target.classList.contains("delete")) {
    if (confirm("Deseja deletar esse item?")) {
      // Pega o valor do elemento anterior ao botão de delete
      let row = event.target.closest("tr");
      // Seleciona a segunda célula <td> dessa linha
      let valorCelula = row.querySelector("td:nth-child(2)");
      // Converte o valor para o formato de número(retira)
      let valorDaCelulaFormatado = retirarFormatacaoNumero(valorCelula);
      let valorExcluido = parseFloat(valorDaCelulaFormatado);
      let entradaAtual = retirarFormatacaoNumero(entrada);
      let saidaAtual = retirarFormatacaoNumero(saida);
      let totalAtual = retirarFormatacaoNumero(totalFinal);

      // Calcula o novo total de entrada, saída e do resultado
      let novoTotalSaida = saidaAtual - valorExcluido;
      let novoTotalEntrada = entradaAtual - valorExcluido;
      let novoTotalFinal = totalAtual - valorExcluido;

      if (valorExcluido < 0) {
        saida.innerHTML = converterParaReal(novoTotalSaida);
        totalFinal.innerHTML = converterParaReal(novoTotalFinal);
      } else if (valorExcluido > 0) {
        entrada.innerHTML = converterParaReal(novoTotalEntrada);
        totalFinal.innerHTML = converterParaReal(novoTotalFinal);
      }

      // Remove o item da tabela
      event.target.parentElement.parentElement.remove();
    }
  }
};