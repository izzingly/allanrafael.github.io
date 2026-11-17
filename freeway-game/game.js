const imgOnibus = new Image();
imgOnibus.src = 'onibus.png';

const imgPlayer1 = new Image();
imgPlayer1.src = 'player1.png';

const imgPlayer2 = new Image();
imgPlayer2.src = 'player2.png';

class GerenciadorAudio {
    constructor() {

        this.musica = new Audio('musica.wav');
        this.musica.loop = true;
        this.musica.volume = 0.3;

        this.passo = new Audio('passo.mp3');
        this.colisao = new Audio('colisao.mp3');
        this.ponto = new Audio('ponto.wav');
    }

    tocarPasso() {
        const som = this.passo.cloneNode();
        som.volume = 0.3;
        som.play().catch(() => {}); 
    }

    tocarColisao() {
        const som = this.colisao.cloneNode();
        som.play().catch(() => {});
    }

    tocarPonto() {
        const som = this.ponto.cloneNode();
        som.play().catch(() => {});
    }

    iniciarMusica() {
        this.musica.currentTime = 0;
        this.musica.play().catch(() => {});
    }

    pararMusica() {
        this.musica.pause();
        this.musica.currentTime = 0;
    }
}

const audio = new GerenciadorAudio();

class ElementoGrafico {
    constructor(x, y, largura, altura) {
        this.x = x;
        this.y = y;
        this.largura = largura;
        this.altura = altura;
    }

    getLimites() {
        return {
            esquerda: this.x,
            direita: this.x + this.largura,
            topo: this.y,
            base: this.y + this.altura
        };
    }
}

class Jogador extends ElementoGrafico {
    constructor(x, y, imagemObj, nome) {
        super(x, y, 28, 28);
        this.xInicial = x;
        this.yInicial = y;
        this.velocidade = 3.5;
        this.pontos = 0;
        this.nome = nome;
        this.imagem = imagemObj;
        this.ultimoSomPasso = 0;
    }

    moverCima() {
        if (this.y - this.velocidade >= 35) {
            this.y -= this.velocidade;
            this.executarSomPasso();
        }
    }

    moverBaixo() {
        if (this.y + this.altura + this.velocidade <= 465) {
            this.y += this.velocidade;
            this.executarSomPasso();
        }
    }

    executarSomPasso() {
        const agora = Date.now();
        if (agora - this.ultimoSomPasso > 130) {
            audio.tocarPasso();
            this.ultimoSomPasso = agora;
        }
    }

    reiniciarPosicao() {
        this.x = this.xInicial;
        this.y = this.yInicial;
    }

    desenhar(ctx) {
        if (this.imagem && this.imagem.complete) {
            ctx.drawImage(this.imagem, this.x, this.y, this.largura, this.altura);
        } else {
            ctx.fillStyle = "#ffeb3b";
            ctx.fillRect(this.x, this.y, this.largura, this.altura);
        }
    }
}

class Onibus extends ElementoGrafico {
    constructor(x, y, largura, velocidade, imagemObj) {
        super(x, y, largura, 24);
        this.velocidade = velocidade;
        this.imagem = imagemObj;
    }

    atualizar(larguraTela) {
        this.x += this.velocidade;

        if (this.velocidade > 0 && this.x > larguraTela) {
            this.x = -this.largura - Math.random() * 60;
        } else if (this.velocidade < 0 && this.x + this.largura < 0) {
            this.x = larguraTela + Math.random() * 60;
        }
    }

    desenhar(ctx) {
        if (this.imagem && this.imagem.complete) {
            if (this.velocidade < 0) {
                ctx.save();
                ctx.scale(-1, 1);
                ctx.drawImage(this.imagem, -this.x - this.largura, this.y, this.largura, this.altura);
                ctx.restore();
            } else {
                ctx.drawImage(this.imagem, this.x, this.y, this.largura, this.altura);
            }
        } else {
            ctx.fillStyle = "#e53935";
            ctx.fillRect(this.x, this.y, this.largura, this.altura);
        }
    }
}

class JogoFreeway {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        this.largura = this.canvas.width;
        this.altura = this.canvas.height;

        this.emExecucao = false;
        this.tempoRestante = 120;
        this.intervaloTempo = null;

        this.teclas = {};

        this.jogador1 = new Jogador(250, 435, imgPlayer1, "Player 1");
        this.jogador2 = new Jogador(530, 435, imgPlayer2, "Player 2");

        this.onibusLista = [];
        this.inicializarOnibus();

        this.configurarControles();
    }

    inicializarOnibus() {
        this.onibusLista = [];
        const faixasY = [65, 100, 135, 170, 205, 245, 280, 315, 350, 385];

        faixasY.forEach((y, idx) => {
            const direcao = (idx % 2 === 0) ? 1 : -1;
            const velocidade = (2 + (idx % 4) * 0.8) * direcao;
            const larguraOnibus = 48;

            const bus1 = new Onibus(Math.random() * this.largura, y, larguraOnibus, velocidade, imgOnibus);
            const bus2 = new Onibus((bus1.x + 300) % this.largura, y, larguraOnibus, velocidade, imgOnibus);

            this.onibusLista.push(bus1, bus2);
        });
    }

    configurarControles() {
        window.addEventListener('keydown', (e) => {
            this.teclas[e.key] = true;
        });

        window.addEventListener('keyup', (e) => {
            this.teclas[e.key] = false;
        });
    }

    processarEntradas() {
        if (!this.emExecucao) return;

        // Player 1 (W/S)
        if (this.teclas['w'] || this.teclas['W']) this.jogador1.moverCima();
        if (this.teclas['s'] || this.teclas['S']) this.jogador1.moverBaixo();

        // Player 2 (Setas)
        if (this.teclas['ArrowUp']) this.jogador2.moverCima();
        if (this.teclas['ArrowDown']) this.jogador2.moverBaixo();
    }

    atualizar() {
        if (!this.emExecucao) return;

        this.onibusLista.forEach(bus => bus.atualizar(this.largura));

        this.onibusLista.forEach(bus => {
            if (this.verificarColisao(this.jogador1, bus)) {
                audio.tocarColisao();
                this.jogador1.reiniciarPosicao();
            }
            if (this.verificarColisao(this.jogador2, bus)) {
                audio.tocarColisao();
                this.jogador2.reiniciarPosicao();
            }
        });

        if (this.jogador1.y <= 40) {
            audio.tocarPonto();
            this.jogador1.pontos += 1;
            this.jogador1.reiniciarPosicao();
        }

        if (this.jogador2.y <= 40) {
            audio.tocarPonto();
            this.jogador2.pontos += 1;
            this.jogador2.reiniciarPosicao();
        }
    }

    verificarColisao(obj1, obj2) {
        const box1 = obj1.getLimites();
        const box2 = obj2.getLimites();

        return !(
            box1.direita < box2.esquerda ||
            box1.esquerda > box2.direita ||
            box1.base < box2.topo ||
            box1.topo > box2.base
        );
    }

    desenharCenario() {
        this.ctx.fillStyle = "#1e1e1e";
        this.ctx.fillRect(0, 0, this.largura, this.altura);

        this.ctx.fillStyle = "#8d6e63";
        this.ctx.fillRect(0, 0, this.largura, 40);
        this.ctx.fillRect(0, 460, this.largura, 40);

        this.ctx.strokeStyle = "#fbc02d";
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([15, 15]);

        const faixasY = [60, 95, 130, 165, 200, 240, 275, 310, 345, 380, 425];
        faixasY.forEach(y => {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.largura, y);
            this.ctx.stroke();
        });

        this.ctx.setLineDash([]);
    }

    desenharInterface() {
        this.ctx.fillStyle = "#fff";
        this.ctx.font = "bold 18px sans-serif";

        this.ctx.fillStyle = "#ffeb3b";
        this.ctx.fillText(`Player 1: ${this.jogador1.pontos}`, 30, 26);

        this.ctx.fillStyle = "#fff";
        this.ctx.fillText(`Tempo: ${this.tempoRestante}s`, this.largura / 2 - 45, 26);

        this.ctx.fillStyle = "#00e676";
        this.ctx.fillText(`Player 2: ${this.jogador2.pontos}`, this.largura - 150, 26);

        if (!this.emExecucao && this.tempoRestante <= 0) {
            this.ctx.fillStyle = "rgba(0,0,0,0.85)";
            this.ctx.fillRect(0, 0, this.largura, this.altura);

            this.ctx.fillStyle = "#ffeb3b";
            this.ctx.font = "bold 32px sans-serif";
            this.ctx.textAlign = "center";
            this.ctx.fillText("FIM DE PARTIDA!", this.largura / 2, this.altura / 2 - 30);

            let vencedor = "EMPATE!";
            if (this.jogador1.pontos > this.jogador2.pontos) {
                vencedor = "PLAYER 1 VENCEU!";
            } else if (this.jogador2.pontos > this.jogador1.pontos) {
                vencedor = "PLAYER 2 VENCEU!";
            }

            this.ctx.fillStyle = "#fff";
            this.ctx.font = "bold 24px sans-serif";
            this.ctx.fillText(vencedor, this.largura / 2, this.altura / 2 + 20);
            this.ctx.textAlign = "start";
        }
    }

    renderizar() {
        this.desenharCenario();
        this.onibusLista.forEach(bus => bus.desenhar(this.ctx));
        this.jogador1.desenhar(this.ctx);
        this.jogador2.desenhar(this.ctx);
        this.desenharInterface();
    }

    loop() {
        this.processarEntradas();
        this.atualizar();
        this.renderizar();

        requestAnimationFrame(() => this.loop());
    }

    iniciar() {
        if (this.emExecucao) return;

        audio.iniciarMusica();

        this.emExecucao = true;
        this.tempoRestante = 120;
        this.jogador1.pontos = 0;
        this.jogador2.pontos = 0;
        this.jogador1.reiniciarPosicao();
        this.jogador2.reiniciarPosicao();

        if (this.intervaloTempo) clearInterval(this.intervaloTempo);

        this.intervaloTempo = setInterval(() => {
            if (this.tempoRestante > 0) {
                this.tempoRestante--;
            } else {
                this.emExecucao = false;
                audio.pararMusica();
                clearInterval(this.intervaloTempo);
            }
        }, 1000);
    }

    reiniciar() {
        this.emExecucao = false;
        audio.pararMusica();
        if (this.intervaloTempo) clearInterval(this.intervaloTempo);
        this.tempoRestante = 120;
        this.jogador1.pontos = 0;
        this.jogador2.pontos = 0;
        this.jogador1.reiniciarPosicao();
        this.jogador2.reiniciarPosicao();
        this.inicializarOnibus();
        this.renderizar();
    }
}

window.addEventListener('load', () => {
    const jogo = new JogoFreeway('gameCanvas');
    jogo.renderizar();

    document.getElementById('btnStart').addEventListener('click', () => {
        jogo.iniciar();
    });

    document.getElementById('btnReset').addEventListener('click', () => {
        jogo.reiniciar();
    });

    jogo.loop();
});