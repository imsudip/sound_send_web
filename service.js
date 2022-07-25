// curl -F "file=@test.txt" https://trixtj.deta.dev/api/v1/upload
var fileLink = "";



// listen when new file is inserted in dropzone
document.getElementById("dropzone-file").addEventListener("change", function () {
    console.log("file changed");
    fileLink = "";
    // hide info-title
    document.getElementById("info-title").style.display = "none";
    // show file-status
    var fn = document.getElementById("dropzone-file").files[0].name;
    document.getElementById("file-status").innerHTML = "File name: " + fn;
});

// add clicl event to 'send-button'
document.getElementById("send-button").addEventListener("click", async function () {
    // get file name
    var fn = document.getElementById("dropzone-file").files;
    if (fn.length == 0) {
        console.log("** PLEASE SELECT A FILE **");
        return;
    }
    console.log("Preparing to send file...");
    if (fileLink == "") {
        console.log("Uploading file...");
        function uploadFile() {
            var file = document.getElementById("dropzone-file").files[0];
            var form = new FormData();
            form.append("file", file);
            // make request
            var request = new XMLHttpRequest();
            // add origin header as anonfiles.com
            request.open("POST", "https://trixtj.deta.dev/api/v1/upload");
            request.send(form);
            request.onreadystatechange = function () {
                if (request.readyState == 4 && request.status == 200) {
                    var jsonResponse = JSON.parse(request.responseText);
                    console.log("File uploaded successfully...");
                    console.log("File name: " + jsonResponse.filename);
                    console.log("File size: " + jsonResponse.size);
                    var link = jsonResponse["link"]
                    // split link and take last part
                    var fid = link.split("/").pop();
                    console.log("File ID: " + fid);
                    fileLink = fid + "," + jsonResponse["name"];
                    console.log("** Make sure the other device has started caputuring, Otherwise the file will not be sent");
                    console.log("Sending File in 2 seconds");
                    setTimeout(function () {
                        console.log("Sending file...");
                        onSend(fileLink);
                    });
                }
                else {
                    console.log(request.status);
                }
            }

        }
        uploadFile();
    } else {
        console.log("Preparing to send file...");
        var fileName = fileLink.split(",")[1];
        var fid = fileLink.split(",")[0];
        console.log("** Make sure the other device has started caputuring, Otherwise the file will not be sent");
        console.log("Sending File in 2 seconds");
        setTimeout(function () {
            console.log("Sending file...");
            onSend(fileLink);
        });
    }

}, false);

