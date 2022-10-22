document.getElementById("button").addEventListener("click", colorchange);
function colorchange() {

    var buttoncolor = document.getElementById("buttoncolor").value;
    //Debug to test if function works on text
    document.getElementById("colordisplay").style.color = buttoncolor;
    alert(buttoncolor)
}