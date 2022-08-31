window.onload = function() {

    let input = document.getElementById("input2");

    input.addEventListener('keydown', (KeyboardEvent) => {

        if (KeyboardEvent.code === "Enter") {
            console.log(input.value);
            console.log(KeyboardEvent);
        }
    })

    //window.onkeyup = (KeyboardEvent) => {
    //    console.log(KeyboardEvent);
    //
    //    if (KeyboardEvent.code === "Enter") {
    //        console.log("Press Enter");
    //    }
    //}

}