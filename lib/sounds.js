class SoundPlayer 
{
    constructor() 
    {
        this.setLibrary("default");    
        this.loadAudio;
    }

    setLibrary(library)
    {
        this.library = "sound/" + library + "/";
        this.loadAudio();
    }

    loadAudio()
    {
        this.grab = new Audio(this.library + "grab.wav");
        this.move = new Audio(this.library + "move.wav");
        this.capture = new Audio(this.library + "capture.wav");
        this.gameOver = new Audio(this.library + "gameover.wav");
    }

    playGrabSound()
    {
        this.stopAllSounds();
        this.grab.play();
    }

    playMoveSound()
    {
        this.stopAllSounds();
        this.move.play();
    }

    playCaptureSound()
    {
        this.stopAllSounds();
        this.capture.play();
    }

    playGameOverSound()
    {
        this.stopAllSounds();
        this.gameOver.play();
    }

    stopAllSounds()
    {
        this.grab.pause();
        this.move.pause();
        this.capture.pause();
        this.gameOver.pause();

        this.grab.currentTime = 0;
        this.move.currentTime = 0;
        this.capture.currentTime = 0;
        this.gameOver.currentTime = 0;
    }
}