const canvas = document.getElementById("sim");
const ctx = canvas.getContext("2d");
const texto = document.getElementById("status");

const raios = [
  { simbolo: "α", cor: "#ff4fd8", y: 46, velocidade: 2, tamanho: 7, bloqueadoPor: 1 },
  { simbolo: "β", cor: "#a35cff", y: 115, velocidade: 3, tamanho: 4, bloqueadoPor: 2 },
  { simbolo: "γ", cor: "#3ea6ff", y: 184, velocidade: 4.5, tamanho: 3, bloqueadoPor: 3 }
];

const barreiras = [
  { texto: "Sem barreira, <b>alfa, beta e gama</b> seguem livres." },
  { nome: "papel", largura: 4, cor: "#e8e2c8", texto: "A folha de papel bloqueia <b>alfa</b>. Beta e gama atravessam." },
  { nome: "alumínio", largura: 14, cor: "#aab7bd", texto: "O alumínio bloqueia <b>alfa e beta</b>. A gama atravessa." },
  { nome: "chumbo", largura: 34, cor: "#5b6670", texto: "O chumbo espesso atenua a <b>gama</b> também: nada passa." }
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
  texto.innerHTML = barreiras[numero].texto;
}

function desenharParticula(p) {
  ctx.fillStyle = p.raio.cor;
  ctx.strokeStyle = p.raio.cor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  if (p.raio.simbolo === "γ") {
    for (let i = 0; i <= 24; i++) {
      const x = p.x - i;
      const y = p.raio.y + Math.sin(x * 0.9) * 5;
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

  ctx.fillStyle = "#3ea6ff";
  ctx.beginPath();
  ctx.arc(24, 115, 12, 0, Math.PI * 2);
  ctx.fill();


  const barreira = barreiras[barreiraAtual];
  if (barreiraAtual > 0) {
    ctx.fillStyle = barreira.cor;
    ctx.fillRect(xBarreira, 8, barreira.largura, 214);
    ctx.fillStyle = "#9d94b5";
    ctx.font = "13px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(barreira.nome, xBarreira + barreira.largura / 2, 229);
  }

  ctx.textAlign = "left";
  raios.forEach(r => {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, r.y);
    ctx.lineTo(765, r.y);
    ctx.stroke();
    ctx.fillStyle = r.cor;
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(r.simbolo, 775, r.y + 5);
  });


  if (contador % 30 === 0) {
    raios.forEach(r => particulas.push({ raio: r, x: 36 }));
  }


  for (let i = particulas.length - 1; i >= 0; i--) {
    const p = particulas[i];
    p.x += p.raio.velocidade;
    if (barreiraAtual >= p.raio.bloqueadoPor && p.x >= xBarreira) {
      impactos.push({ y: p.raio.y, cor: p.raio.cor, forca: 1 });
      particulas.splice(i, 1);
    } else if (p.x > 800) {
      particulas.splice(i, 1);
    } else {
      desenharParticula(p);
    }
  }


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
