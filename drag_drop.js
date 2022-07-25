let dropArea = document.getElementById('drop-area')
    ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false)
    })

function preventDefaults(e) {
    e.preventDefault()
    e.stopPropagation()
}
;['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false)
})

    ;['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false)
    })

function highlight(e) {
    dropArea.classList.add('highlight')
}

function unhighlight(e) {
    dropArea.classList.remove('highlight')
}

dropArea.addEventListener('drop', handleDrop, false)

function handleDrop(e) {
    let dt = e.dataTransfer
    let files = dt.files

    handleFiles(files)

}

function handleFiles(files) {
    var fileInput = document.getElementById("dropzone-file");
    fileInput.files = files;
    console.log(fileInput.files);
    console.log("file changed");
    fileLink = "";
    // hide info-title
    document.getElementById("info-title").style.display = "none";
    // show file-status
    var fn = document.getElementById("dropzone-file").files[0].name;
    document.getElementById("file-status").innerHTML = "File name: " + fn;

}