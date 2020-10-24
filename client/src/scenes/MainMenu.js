export default class MainMenu extends Phaser.Scene{
    constructor(){
        super({
            key: 'MainMenu'
        });
    }

    preload(){

    }

    create(){

    }

    update(){
        console.log("Sirve");
        this.add.text(0, 0, 'Menu Prinicipal', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
    }
}