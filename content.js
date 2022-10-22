var VOLUME_STEPS = 20;
var VOLUME_CHANGE_DURATION = 250;
var DEBUG = false;
var VOLUME_CHANGE_INTERVAL = VOLUME_CHANGE_DURATION / VOLUME_STEPS;
var volumeCurrentStep = 0;
var userVolume = 0;
var volumeIsFadingDown = false;
var volumeIsFadingUp = false;
var video;
var playPauseButton;
var buttonSvg;
var volumeChangerInterval;
var buttonSvgColor = "#1a87ff";
//var defaultbutton = "#ff0000";
var buttoncolor;
var defaultbutton = buttoncolor;
(function() {
    video = document.getElementsByTagName("video")[0];
    playPauseButton = document.getElementsByClassName("ytp-play-button")[0];
    buttonSvg = playPauseButton.children[0].children[1];
    if (video && playPauseButton && buttonSvg) {
        buttonSvgColor = defaultbutton;
        buttonSvg.style.fill = buttonSvgColor;
        listenToPlayPauseButton();
        setInterval(setButtonSvgColor, 1000);
    }
})();
function setButtonSvgColor() {
    buttonSvg = playPauseButton.children[0].children[1];
    buttonSvg.style.fill = buttonSvgColor;
}
function listenToPlayPauseButton() {
    if (DEBUG) {
        console.log("Listening to Play/Pause button...");
    }
    // Play/pause button
    playPauseButton.addEventListener("click", function() {
        // Video has just been paused
        if (video.paused) {
            fadeVolumeDownThenPauseVideo();
        }
        // Video has just been played
        else {
            fadeVolumeUpAsVideoPlays();
        }
    }, false);
    // Video overlay
    /*
    document.getElementsByClassName("html5-video-player")[0].addEventListener("click", function() {
        // Video has just been paused
        if (video.paused) {
            fadeVolumeUpAsVideoPlays();
        }
        // Video has just been played
        else {
            fadeVolumeDownThenPauseVideo();
            setTimeout(function() {
                video.play();
            }, 500);
        }
    }, false);
    */
    // Spacebar
    /*
    document.getElementsByClassName("html5-video-player")[0].addEventListener("keypress", function(e) {
        if((e || window.event).keyCode === 32) {
            // Video has just been paused
            if (video.paused) {
                fadeVolumeDownThenPauseVideo();
            }
            // Video has just been played
            else {
                fadeVolumeUpAsVideoPlays();
            }
        }
    });
    */
}
function fadeVolumeDownThenPauseVideo() {
    // Volume already fading down: user is impatient => pause immediately.
    if (volumeIsFadingDown) {
        if (DEBUG) {
            console.log("Video pause already ongoing: pausing immediately.");
            console.log("Video paused.");
        }
        volumeIsFadingDown = false;
        buttonSvgColor = defaultbutton;
        buttonSvg.style.fill = buttonSvgColor;
        video.pause();
        video.volume = 0;
        clearInterval(volumeChangerInterval);
        return;
    }
    // Volume already fading up: user is impatient => play with normal volume immediately.
    if (volumeIsFadingUp) {
        if (DEBUG) {
            console.log("Video play already ongoing: playing with normal volume immediately.");
            console.log("Video playing at normal volume.");
        }
        volumeIsFadingUp = false;
        buttonSvgColor = defaultbutton;
        buttonSvg.style.fill = buttonSvgColor;
        video.play();
        video.volume = userVolume;
        clearInterval(volumeChangerInterval);
        return;
    }
    if (DEBUG) {
        console.log("Volume fading down...");
    }
    volumeIsFadingDown = true;
    buttonSvgColor = "#3f4e5f";
    buttonSvg.style.fill = buttonSvgColor;
    userVolume = video.volume;
    video.play();
    volumeChangerInterval = setInterval(fadeVolume, VOLUME_CHANGE_INTERVAL);
}
function fadeVolumeUpAsVideoPlays() {
    if (DEBUG) {
        console.log("Volume fading up...");
    }
    volumeIsFadingUp = true;
    buttonSvgColor = "#3f4e5f";
    buttonSvg.style.fill = buttonSvgColor;
    userVolume = (userVolume > 0) ? userVolume : video.volume;
    video.volume = 0;
    volumeChangerInterval = setInterval(fadeVolume, VOLUME_CHANGE_INTERVAL);
}
function fadeVolume() {
    if (volumeCurrentStep++ >= VOLUME_STEPS) {
        if (volumeIsFadingDown) {
            volumeIsFadingDown = false;
            buttonSvgColor = defaultbutton;
            buttonSvg.style.fill = buttonSvgColor;
            if (DEBUG) {
                console.log("Video paused.");
            }
            video.pause();
        }
        if (volumeIsFadingUp) {
            volumeIsFadingUp = false;
            buttonSvgColor = defaultbutton;
            buttonSvg.style.fill = buttonSvgColor;
            if (DEBUG) {
                console.log("Video plays.");
            }
        }
    }
    if (volumeIsFadingDown) {
        video.volume = Math.max(video.volume - userVolume / VOLUME_STEPS, 0);
        if (DEBUG) {
            console.log("Volume down to " + video.volume);
        }
    } else if (volumeIsFadingUp) {
        video.volume = Math.max(video.volume + userVolume / VOLUME_STEPS, 0);
        if (DEBUG) {
            console.log("Volume up to " + video.volume);
        }
    } else {
        clearInterval(volumeChangerInterval);
        volumeCurrentStep = 0;
    }
}
