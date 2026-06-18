// MenuCidadeTesouro.js

class MenuCidadeTesouro extends Phaser.Scene {
    constructor() {
        super('MenuCidadeTesouro');
    }

    preload() {
        this.load.image('fundo_menu', 'cenario/fase1.png');
    }

    create() {
        const { width, height } = this.scale;

        // ==========================================================================
        // 1. COMPOSIÇÃO DO PLANO DE FUNDO
        // ==========================================================================
        this.add.image(width / 2, height / 2, 'fundo_menu').setDisplaySize(width, height);
        
        // ==========================================================================
        // 2. TÍTULOS 
        // ==========================================================================
        const ty = height * 0.25;
        
        this.add.text(width / 2 + 6, ty + 6, 'CIDADE DO TESOURO', {
            fontFamily: '"Press Start 2P"', 
            fontSize: '42px', 
            fill: '#000'
        }).setOrigin(0.5);

        // Título Principal
        this.add.text(width / 2, ty, 'CIDADE DO TESOURO', {
            fontFamily: '"Press Start 2P"', 
            fontSize: '42px', 
            fill: '#ff9900', 
            stroke: '#160e0b', 
            strokeThickness: 6
        }).setOrigin(0.5);

        // Subtítulo descritivo
        this.add.text(width / 2, ty + 70, 'DESVENDE • CALCULE • CONQUISTE', {
            fontFamily: '"Press Start 2P"', 
            fontSize: '16px', 
            fill: '#f4eedb'
        }).setOrigin(0.5);

        // ==========================================================================
        // 3. PAINEL DE BOTÕES INTERATIVOS
        // ==========================================================================
        this.criarBotao(width / 2, height * 0.65, 'JOGAR', 0xff9900, 0x160e0b);
        this.criarBotao(width / 2, height * 0.80, 'SAIR', 0xb71c1c, 0x160e0b);
    }

    // ==========================================================================
    // 4. MÉTODOS AUXILIARES 
    // ==========================================================================
    criarBotao(x, y, label, corBorda, corSombra) {
        const container = this.add.container(x, y);
        
        const shadow = this.add.rectangle(0, 6, 320, 75, corSombra).setOrigin(0.5);
        const rect = this.add.rectangle(0, 0, 320, 75, 0xf4eedb).setStrokeStyle(4, 0x160e0b).setOrigin(0.5);
        const txt = this.add.text(0, 0, label, { 
            fontFamily: '"Press Start 2P"', 
            fontSize: '22px', 
            fill: '#160e0b' 
        }).setOrigin(0.5);
        
        container.add([shadow, rect, txt]);
        rect.setInteractive({ useHandCursor: true });
        
        // Microinterações de feedback visual aprimoradas
        rect.on('pointerover', () => { 
            rect.setFillStyle(0x160e0b);
            txt.setFill('#f4eedb');
            // Efeito sutil de flutuação / aproximação da sombra
            rect.y = 2;
            txt.y = 2;
        });
        
        rect.on('pointerout', () => { 
            rect.setFillStyle(0xf4eedb); 
            txt.setFill('#160e0b');
            rect.y = 0; 
            txt.y = 0;
        });

        rect.on('pointerdown', () => { 
            rect.y = 4; 
            txt.y = 4; 

            if (label === 'JOGAR') {
                const botaoHtmlJogar = document.getElementById("btn-jogar");
                if (botaoHtmlJogar) botaoHtmlJogar.click();
            } else if (label === 'SAIR') {
                const botaoHtmlSair = document.getElementById("btn-sair");
                if (botaoHtmlSair) botaoHtmlSair.click();
            }
        });
        
        rect.on('pointerup', () => { 
            rect.y = 2; 
            txt.y = 2; 
        });
    }
}