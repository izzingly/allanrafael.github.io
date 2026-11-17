/* ── SIDEBAR ───────────────────────────── */
function openNav() {
    document.getElementById("mySidebar").style.width = "300px";
}
function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
}

/* ── CARROSSEL (baseado em px) ─────────── */
const TOTAL = document.querySelectorAll(".carrossel-slide").length;
let posicaoAtual = 0;

function visiveis() {
    return window.innerWidth <= 600 ? 1 : 3;
}

function larguraSlide() {
    const viewport = document.querySelector(".carrossel-viewport");
    if (!viewport) return 0;
    return viewport.offsetWidth / visiveis();
}

function aplicarPosicao(animado = true) {
    const faixa = document.getElementById("carrosselFaixa");
    const slides = faixa.querySelectorAll(".carrossel-slide");
    const lSlide = larguraSlide();

    // Define largura de cada slide em px
    slides.forEach(s => s.style.width = lSlide + "px");
    // Define largura total da faixa
    faixa.style.width = (lSlide * TOTAL) + "px";
    // Move a faixa
    faixa.style.transition = animado ? "transform 0.4s cubic-bezier(0.4,0,0.2,1)" : "none";
    faixa.style.transform = `translateX(-${posicaoAtual * lSlide}px)`;
    atualizarPontos();
}

function moverCarrossel(direcao) {
    posicaoAtual = (posicaoAtual + direcao + TOTAL) % TOTAL;
    aplicarPosicao();
}

function atualizarPontos() {
    document.querySelectorAll(".ponto").forEach((p, i) => {
        p.classList.toggle("ativo", i === posicaoAtual);
    });
}

function criarPontos() {
    const container = document.getElementById("carrosselPontos");
    container.innerHTML = "";
    for (let i = 0; i < TOTAL; i++) {
        const btn = document.createElement("button");
        btn.className = "ponto" + (i === 0 ? " ativo" : "");
        btn.setAttribute("aria-label", "Ir para slide " + (i + 1));
        btn.onclick = () => { posicaoAtual = i; aplicarPosicao(); };
        container.appendChild(btn);
    }
}

// Recalcula ao redimensionar
window.addEventListener("resize", () => aplicarPosicao(false));

/* ── MODAL ─────────────────────────────── */
const projetos = [
    {
        img: "imagens/cold_secret.png",
        titulo: "Cold Secret",
        subtitulo: "Jogo 3D FPS — Sala de Escape · Agosto–Novembro/2025",
        descricao: "Projeto acadêmico desenvolvido em equipe no IFPR. Cold Secret é um jogo de sala de escape (escape room) em perspectiva FPS onde o jogador precisa resolver puzzles para escapar. Atuei como designer de arte: modelei objetos e cenários no Blender, criei interfaces de UI, desenvolvi a ambientação visual e integrei os assets de sonorização.",
        tags: ["Blender", "Unity", "Design 3D", "UI/UX", "Trabalho em Equipe"]
    },
    {
        img: "imagens/jogo_2d.jpg",
        titulo: "Jogo 2D Plataforma",
        subtitulo: "Plataforma 2D com mecânicas de coleta e inimigos",
        descricao: "Jogo de plataforma 2D desenvolvido como projeto acadêmico. O jogador controla um personagem que deve capturar slimes enquanto coleta moedas e mantém suas vidas. Contribuí com o design visual do HUD (vida, moedas, missão), a arte do personagem e dos elementos de cenário.",
        tags: ["Design de Personagem", "HUD", "Arte 2D", "Game Design"]
    },
    {
        img: "imagens/casa_de_campo.png",
        titulo: "Casa de Campo",
        subtitulo: "Modelagem 3D de cenário arquitetônico · Blender",
        descricao: "Modelagem 3D de uma casa de campo com estilo estilizado e low poly, desenvolvida no Blender. O projeto inclui uma torre de água, a residência principal e uma garagem coberta, com atenção aos detalhes arquitetônicos, proporções e linguagem visual coesa.",
        tags: ["Blender", "Low Poly", "Modelagem 3D", "Cenário"]
    },
    {
        img: "imagens/barril.png",
        titulo: "Barril — Asset 3D",
        subtitulo: "Prop texturizado low poly · Blender",
        descricao: "Asset 3D de barril de madeira com estilo low poly texturizado. Desenvolvido no Blender como prop reutilizável para cenários de jogos. O modelo conta com texturização manual das tábuas e das argolas metálicas, buscando equilíbrio entre qualidade visual e baixa contagem de polígonos.",
        tags: ["Blender", "Low Poly", "Texturização", "Asset 3D", "Props"]
    },
    {
        img: "imagens/inkscape.png",
        titulo: "Ilustração Vetorial",
        subtitulo: "Personagem estilo cartoon · Inkscape",
        descricao: "Ilustração vetorial de personagem estilo cartoon desenvolvida no Inkscape. O trabalho explora anatomia estilizada, expressão facial e composição de cores, demonstrando domínio da ferramenta vetorial para criação de personagens e identidades visuais.",
        tags: ["Inkscape", "Ilustração Vetorial", "Design de Personagem", "Cartoon"]
    }
];

function abrirModal(index) {
    const p = projetos[index];
    document.getElementById("modalImg").src = p.img;
    document.getElementById("modalImg").alt = p.titulo;
    document.getElementById("modalTitulo").textContent = p.titulo;
    document.getElementById("modalSubtitulo").textContent = p.subtitulo;
    document.getElementById("modalDescricao").textContent = p.descricao;

    const tagsEl = document.getElementById("modalTags");
    tagsEl.innerHTML = p.tags.map(t => `<span class="modal-tag">${t}</span>`).join("");

    document.getElementById("modalOverlay").classList.add("aberto");
    document.body.style.overflow = "hidden";
}

function fecharModal() {
    document.getElementById("modalOverlay").classList.remove("aberto");
    document.body.style.overflow = "";
}

document.addEventListener("keydown", e => {
    if (e.key === "Escape") fecharModal();
});

window.addEventListener("load", () => {
    criarPontos();
    aplicarPosicao(false);
});
