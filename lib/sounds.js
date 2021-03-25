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
        console.log(this.library)
        this.grab = new Audio(this.getPath("grab"))
        this.move = new Audio(this.getPath("move"));
        this.capture = new Audio(this.getPath("capture"));
        this.gameOver = new Audio(this.getPath("gameover"));        
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

    getPath(name)
    {
        let file = this.exists( this.library + name + ".wav") ? name + ".wav" : name + ".mp3";
        return this.library + file;
    }

    exists(path)
    {
        var xhr = new XMLHttpRequest();
        xhr.open('HEAD', path, false);
        xhr.send();
        return xhr.status != "404";
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