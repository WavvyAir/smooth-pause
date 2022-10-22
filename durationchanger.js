document.getElementById("submitduration").addEventListener("click", durationchange);
function durationchange() {

    var VOLUME_CHANGE_DURATION = document.getElementById("durationslider").value;
    alert(VOLUME_CHANGE_DURATION);
  };