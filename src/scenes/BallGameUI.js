export default class BallGameUI extends Phaser.Scene{
    constructor(){
        super({
            key: "BallGameUI"
        })
    }

    preload(){
        this.load.audio("gameMusic", "src/assets/music/game.ogg","src/assets/music/game.mp3");
    }

    create(){
        let musicConfig = {
            mute: false,
            volume: 0.5,
            loop: true,
            delay: 0
        }
        this.music = this.sound.add("gameMusic");
        this.music.play(musicConfig);
    }   

    update(){

    }
}