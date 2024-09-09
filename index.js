// Função para obter o valor do cookie
function getCookie(name) {
  const cookieArr = document.cookie.split("; ");
  for (let cookie of cookieArr) {
    const cookiePair = cookie.split("=");
    if (name == cookiePair[0]) {
      return decodeURIComponent(cookiePair[1]);
    }
  }
  return null;
}

// Função para definir um cookie
function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + d.toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/`;
}

// Função para adicionar novo gasto
function adicionarGasto(event) {
  event.preventDefault();

  const valor = parseFloat(document.getElementById("valor").value);
  const categoria = document.getElementById("categoria").value;

  if (isNaN(valor) || categoria === "") {
    alert("Preencha todos os campos corretamente!");
    return;
  }

  // Obter os gastos do cookie
  let gastos = getCookie("gastos");
  gastos = gastos ? JSON.parse(gastos) : [];

  // Adicionar novo gasto
  gastos.push({ valor, categoria });
  setCookie("gastos", JSON.stringify(gastos), 7);

  // Atualizar a lista e o total
  atualizarListaEGastoTotal();

  // Limpar os campos
  document.getElementById("gastosForm").reset();
}

// Função para excluir um gasto
function excluirGasto(index) {
  let gastos = getCookie("gastos");
  gastos = gastos ? JSON.parse(gastos) : [];

  // Remover o gasto no índice fornecido
  gastos.splice(index, 1);

  // Atualizar o cookie
  setCookie("gastos", JSON.stringify(gastos), 7);

  // Atualizar a lista e o total
  atualizarListaEGastoTotal();
}

// Função para atualizar a lista de gastos e o total gasto
function atualizarListaEGastoTotal() {
  const listaGastos = document.getElementById("listaGastos");
  const totalGastoElem = document.getElementById("totalGasto");

  // Obter os gastos do cookie
  let gastos = getCookie("gastos");
  gastos = gastos ? JSON.parse(gastos) : [];

  // Limpar a lista de gastos atual
  listaGastos.innerHTML = "";

  // Variável para o total gasto
  let totalGasto = 0;

  // Adicionar os gastos na lista
  gastos.forEach((gasto, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${gasto.categoria}: R$ ${gasto.valor.toFixed(2)}`;

    // Criar botão de exclusão
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Excluir";
    deleteButton.style.marginLeft = "10px";
    deleteButton.onclick = () => excluirGasto(index);

    // Adicionar o botão ao item da lista
    listItem.appendChild(deleteButton);
    listaGastos.appendChild(listItem);

    // Somar ao total
    totalGasto += gasto.valor;
  });

  // Atualizar o valor total gasto
  totalGastoElem.textContent = totalGasto.toFixed(2);
}

// Adicionar evento de submit no formulário
document
  .getElementById("gastosForm")
  .addEventListener("submit", adicionarGasto);

// Atualizar a lista de gastos ao carregar a página
document.addEventListener("DOMContentLoaded", atualizarListaEGastoTotal);
