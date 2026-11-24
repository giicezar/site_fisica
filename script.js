const canvas = document.getElementById("sim");
const ctx = canvas.getContext("2d");
const texto = document.getElementById("status");

const raios = [
  { simbolo: "α", nome: "Alfa", cor: "#ff4fd8", y: 46, velocidade: 2, tamanho: 7, bloqueadoPor: 1 },
  { simbolo: "β", nome: "Beta", cor: "#a35cff", y: 115, velocidade: 3.2, tamanho: 4, bloqueadoPor: 2 },
  { simbolo: "γ", nome: "Gama", cor: "#3ea6ff", y: 184, velocidade: 4.8, tamanho: 3, bloqueadoPor: 3 }
];

const barreiras = [
  {
    texto: "<b>Sem barreira:</b> As partículas <b>alfa (α)</b>, <b>beta (β)</b> e os raios <b>gama (γ)</b> viajam livremente pelo espaço."
  },
  {
    nome: "Papel",
    largura: 5,
    cor: "#e8e2c8",
    texto: "<b>Folha de papel:</b> Por serem pesadas e terem carga +2, as partículas <b>alfa (α)</b> colidem com as fibras do papel e param. <b>Beta</b> e <b>gama</b> atravessam."
  },
  {
    nome: "Alumínio",
    largura: 16,
    cor: "#aab7bd",
    texto: "<b>Chapa de alumínio:</b> Bloqueia tanto as partículas <b>alfa (α)</b> quanto os elétrons/pósitrons da radiação <b>beta (β)</b>. Apenas os raios <b>gama (γ)</b> atravessam."
  },
  {
    nome: "Chumbo",
    largura: 36,
    cor: "#5b6670",
    texto: "<b>Bloco de chumbo espesso:</b> A alta densidade atômica do chumbo absorve e atenua até os energéticos raios <b>gama (γ)</b> — nenhuma radiação atravessa."
  }
];

const xBarreira = 480;
let barreiraAtual = 0;
let particulas = [];
let impactos = [];
let contador = 0;

texto.innerHTML = barreiras[0].texto;

function escolherBarreira(numero, botao) {
  document.querySelectorAll("#barreiras button").forEach(b => b.classList.remove("ativo"));
  botao.classList.add("ativo");
  barreiraAtual = numero;
  particulas = [];
  impactos = [];
  texto.innerHTML = barreiras[numero].texto;
}

function desenharParticula(p) {
  ctx.fillStyle = p.raio.cor;
  ctx.strokeStyle = p.raio.cor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  if (p.raio.simbolo === "γ") {
    for (let i = 0; i <= 26; i++) {
      const x = p.x - i;
      const y = p.raio.y + Math.sin(x * 0.85) * 5;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  } else {
    ctx.arc(p.x, p.raio.y, p.raio.tamanho, 0, Math.PI * 2);
    ctx.fill();
  }
}

function desenhar() {
  contador++;
  ctx.clearRect(0, 0, 800, 230);

  // Núcleo emissor à esquerda
  ctx.fillStyle = "rgba(62, 166, 255, 0.2)";
  ctx.beginPath();
  ctx.arc(26, 115, 18, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#3ea6ff";
  ctx.beginPath();
  ctx.arc(26, 115, 11, 0, Math.PI * 2);
  ctx.fill();

  // Desenhar barreira selecionada
  const barreira = barreiras[barreiraAtual];
  if (barreiraAtual > 0) {
    ctx.fillStyle = barreira.cor;
    ctx.fillRect(xBarreira, 10, barreira.largura, 198);
    ctx.fillStyle = "#cfc7e6";
    ctx.font = "13px Fredoka, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(barreira.nome, xBarreira + barreira.largura / 2, 224);
  }

  // Linhas guia e símbolos
  ctx.textAlign = "left";
  raios.forEach(r => {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(46, r.y);
    ctx.lineTo(760, r.y);
    ctx.stroke();

    ctx.fillStyle = r.cor;
    ctx.font = "bold 17px Fredoka, sans-serif";
    ctx.fillText(r.simbolo, 772, r.y + 6);
  });

  // Gerar novas partículas periodicamente
  if (contador % 28 === 0) {
    raios.forEach(r => particulas.push({ raio: r, x: 40 }));
  }

  // Atualizar e desenhar partículas
  for (let i = particulas.length - 1; i >= 0; i--) {
    const p = particulas[i];
    p.x += p.raio.velocidade;
    if (barreiraAtual >= p.raio.bloqueadoPor && p.x >= xBarreira) {
      impactos.push({ y: p.raio.y, cor: p.raio.cor, forca: 1 });
      particulas.splice(i, 1);
    } else if (p.x > 790) {
      particulas.splice(i, 1);
    } else {
      desenharParticula(p);
    }
  }

  // Efeito visual de impacto na barreira
  for (let i = impactos.length - 1; i >= 0; i--) {
    const impacto = impactos[i];
    ctx.globalAlpha = impacto.forca;
    ctx.strokeStyle = impacto.cor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(xBarreira, impacto.y, (1 - impacto.forca) * 18 + 3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
    impacto.forca -= 0.05;
    if (impacto.forca <= 0) impactos.splice(i, 1);
  }

  requestAnimationFrame(desenhar);
}

desenhar();
