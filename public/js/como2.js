//PLAY DE VIDEO TUTORIAL
 var vid = document.getElementById("videoTutorial");
            
            function setCurTime() {
                vid.currentTime=0;
                vid.pause();
            }
            
            function ponleplay() {
                vid.play();
            }
        