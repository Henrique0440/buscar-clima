let hora = new Date().getHours();
let minuto = new Date().getMinutes();

function capitalizar(texto) {
  return texto.replace(/\b\w/g, letra => letra.toUpperCase());
}

const apiKey = "ff83a2bcb5fdd6477788b312343fb18d";

async function buscarClima() {
  const cidade = document.getElementById("cidade").value;

  if (cidade.trim() === "") {
    alert("Por favor, insira o nome de uma cidade.");
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}&lang=pt_br&units=metric`;
  buscarDadosClima(url);
}

function obterLocalizacao() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=pt_br&units=metric`;
        buscarDadosClima(url);
      },
      erro => {
        alert("Não foi possível obter a localização.");
      }
    );
  } else {
    alert("Geolocalização não suportada pelo seu navegador.");
  }
}

async function buscarDadosClima(url) {
  try {
    const resposta = await fetch(url);
    if (!resposta.ok) {
      throw new Error("Erro ao buscar dados do clima.");
    }
    const dados = await resposta.json();

    // Fundo de acordo com a temperatura
    if (dados.main.temp <= 24) {
      document.body.style.backgroundImage = "url('./imagens/climaFrio.png')";
    } else if (dados.main.temp <= 28) {
      document.body.style.backgroundImage = "url('./imagens/climaNublado.png')";
    } else {
      document.body.style.backgroundImage = "url('./imagens/climaQuente.png')";
    }

    document.getElementById("nomeCidade").innerHTML = dados.name;
    document.getElementById("hora").innerHTML = `${hora}:${minuto < 10 ? '0' + minuto : minuto}`;
    document.getElementById("temperatura").innerHTML = `${dados.main.temp}`;
    document.getElementById("descricao").innerHTML = capitalizar(dados.weather[0].description);

    document.getElementById("resultado").style.display = "block";
  } catch (erro) {
    alert(erro.message);
  }
}

window.onload = obterLocalizacao;
