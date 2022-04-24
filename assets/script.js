console.log(`
    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
    ░░░░░░░░██░░░░░██░███████░██████████░░░░░██████░░░██░░░░██░██░░░░░██░░░███░░░███░░███░░░██████░░░░░
    ░░░░░░░░████░░░██░██░░░░░░░░░░██░░░░░░░░░██░░░██░░██░░░░██░████░░░██░░██░██░░████████░░██░░░░██░░░░
    ░░░░░░░░██░░██░██░██░░░░░░░░░░██░░░░░░░░░██░░░░██░░██░░██░░██░██░░██░██░░░██░██░██░██░██░░░░░░██░░░
    ░░░░░░░░██░░░████░██████░░░░░░██░░░░░░░░░██░░░░██░░░░██░░░░██░░░█░██░███████░██░██░██░██░░░░░░██░░░
    ░░░░░░░░██░░░░░██░██░░░░░░░░░░██░░░░░░░░░██░░░██░░░░░██░░░░██░░░░███░██░░░██░██░░░░██░░██░░░░██░░░░
    ░░░░░░░░██░░░░░██░██░░░░░░░░░░██░░░░░░░░░██████░░░░░░██░░░░██░░░░░██░██░░░██░██░░░░██░░░██████░░░░░
    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░`);



let layer = "background";
let bodyLayer = layer;
let Rarity;
let LayerAssetsCount = 0;
let rarities = [];
// const baseURL = "https://nftdynamo.herokuapp.com"
const baseURL = "http://localhost:3010"

let session = {
    TotalAssetsCount: 0,
    layers: ["background"]
}
session[layer] = {
    assetsCount: 0,
    assets: [],
};


// dropzoneOption function for multiple instances of dropzone.
const dropzoneOption = (layer) => {
    return {
        url: `${baseURL}/upload`,
        previewTemplate: document.getElementById(layer + '-template-preview').innerHTML,
        paramName: "file",
        maxFilesize: 10,
        parallelUploads: 3,
        autoProcessQueue: false,
        headers: {
            sesID: session.sesID
        },
        // maxFiles: 10,
        // uploadMultiple: true,
        acceptedFiles: "image/*, video/mp4",
        init: function () {
            this.on("addedfiles", async function (files) {
                for (i = 0; i < files.length; i++) {
                    let file = files[i];
                    console.log(layer, "<========== Layer");
                    const { value: rarity } = await Swal.fire({
                        title: 'Select asset rarity',
                        input: 'radio',
                        inputOptions: {
                            'original': 'Original',
                            'rare': 'Rare',
                            'epic': 'Epic',
                            'legendary': 'Legendary'
                        },
                        inputValidator: (value) => {
                          if (!value) {
                            return 'You need to choose something!'
                          }
                        }
                    });
                    session["TotalAssetsCount"] += 1;
                    updateUI("totalAssetsCount", session["TotalAssetsCount"]);
                    session[layer]["assetsCount"] += 1;
                    updateUI("layerAssetsCount", session[layer]["assetsCount"]);
                    session[layer].assets.push(file);
                    if (rarity) {
                        Rarity = rarity;
                        rarities.push(rarity);
                        rarities = [...new Set(rarities)];
                    }
                    this.processFile(file);
                }
                // this.processQueue();
            });
        },
        removedfile: async function (file) {
            session[layer].assets = session[layer].assets.filter(x => {
                return x.upload.uuid !== file.upload.uuid;
            });
            var _ref;
            session["TotalAssetsCount"] -= 1;
            updateUI("totalAssetsCount", session["TotalAssetsCount"]);
            session[layer]["assetsCount"] -= 1;
            updateUI("layerAssetsCount", session[layer]["assetsCount"]);
            return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;
        },
        sending: (file, xhr, formData) => {
            // Will send the filesize along with the file as POST data.

            formData.append("layer", layer);
            formData.append("rarity", Rarity);

            session[layer].assets.push(file);
        }
    }
}


const capitaliseString = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const createLayer = () => {
    const inputField = document.getElementById("layerInputField");
    const val = inputField.value;
    session[inputField.value.toLowerCase()] = {
        assets: [],
        assetsCount: 0
    };
    if (session.layers.includes(val.toLowerCase())) {
        Swal.fire("error", "Layer already exists!");
        return;
    }
    session.layers.push(val.toLowerCase());
    inputField.value = "";
    document.getElementById("layerList").insertAdjacentHTML("beforeend", `
    <div class="p-1 rounded-3 bg-bg-1 layerListing" the-id="${val.toLowerCase()}"
        style="margin-bottom: 1rem !important;" id="${val.toLowerCase()}">
            <div class="row">
                <div class="col-11 col-lg-8">
                <p class="mb-sm-2 text-light-2 fw-bold" onClick="clickLayer('${val.toLowerCase()}')">
                    <span class="layerText">${capitaliseString(val)}</span>
                </p>
                </div>
                <div class="col-1 col-lg-4">
                    <span class="layerDeleteBtn" onClick="deleteLayer('${val.toLowerCase()}')">x</span>
                </div>
            </div>
    </div>`);
    // creating dropzone upload box for newly created layer.
    document.getElementById("bodyBox").insertAdjacentHTML("beforeend", `
        <div id="${val.toLowerCase()}LayerUpload" class="d-none row my-dropzone px-sm-4 mt-sm-8 rounded-3 border border-bg-3 border-2 py-sm-12">
            <span class="dz-message mb-4" style="cursor:pointer">
                <h2 class="text-bg-3">
                    Click or drop images here.
                </h2>
                <p class="text-bg-3">
                    Allowed file types: "image/png, image/gif, video/mp4"
                    <br> Max Size Allowed: 10MB
                </p>
            </span>
            <div id="${val.toLowerCase()}-template-preview" class="row" style="color: white !important; display: none;">
                <div style="color: white !important" class="dz-preview dz-file-preview well col-sm-12 col-lg-4 col-md-3" id="dz-preview-template">
                    <div class="dz-details">
                        <img data-dz-thumbnail />
                        <div class="dz-filename"><span data-dz-name></span></div>
                        <div class="dz-size" data-dz-size></div>
                    </div>
                    <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span>
                    </div>
                    <button data-dz-remove class="btn btn-sm" style="color: white !important">
                        <i class="glyphicon glyphicon-trash"></i>
                        <span class="badge badge-light">x</span>
                    </button>
                    <div class="dz-success-mark"><span></span></div>
                    <div class="dz-error-mark"><span></span></div>
                    <div class="dz-error-message"><span data-dz-errormessage></span></div>
                </div>
            </div>
        </div>`);
    new Dropzone("div.my-dropzone#" + val.toLowerCase() + "LayerUpload", dropzoneOption(val.toLowerCase()));
}

const deleteLayer = (layer) => {
    console.log(layer, "<=========== In here");
    const el = document.querySelector(".layerListing[the-id='" + layer + "']");
    const idAttr = el.getAttribute("id");
    const box = document.getElementById(layer+"LayerUpload");
    if(idAttr == "active"){
        clickLayer("background");
    }
    console.log(idAttr);
    el.remove();
    box.remove();
    session["layers"] = session["layers"].filter(x => x != layer);
    session["TotalAssetsCount"] -= Number(session[layer]["assetsCount"]);
    updateUI("totalAssetsCount", session["TotalAssetsCount"]);
    return;
}


const clickLayer = (layer) => {
    console.log(layer, "<=========== Layer");
    updateUI("totalAssetsCount", session["TotalAssetsCount"]);
    updateUI("layerAssetsCount", session[layer]["assetsCount"]);
    activeLayer(layer);
}

const activeLayer = (id) => {
    const activeLayer = document.getElementById("active");
    const activeLayerString = activeLayer.querySelectorAll("p .layerText")[0].innerHTML.toLowerCase().trim();
    activeLayer.classList.remove("my-sm-3");
    activeLayer.classList.remove("bg-transparent");
    activeLayer.classList.add("bg-bg-1");
    activeLayer.id = activeLayerString;
    activeLayer.querySelector("p").setAttribute("onClick", "clickLayer('" + activeLayerString + "')");
    const newActive = document.getElementById(id);
    newActive.classList.add("my-sm-3");
    newActive.classList.add("bg-transparent");
    newActive.classList.remove("bg-bg-1");
    newActive.id = "active";
    newActive.removeAttribute("onClick");
    layer = id;
    bodyLayer = layer.toUpperCase();
    document.getElementById("bodyLayerID").innerHTML = bodyLayer;
    document.getElementById(activeLayerString + "LayerUpload").classList.remove("d-block");
    document.getElementById(activeLayerString + "LayerUpload").classList.add("d-none");
    document.getElementById(id + "LayerUpload").classList.add("d-block");
    document.getElementById(id + "LayerUpload").classList.remove("d-none");
}

const preview = async () => {
    try {
        if (session.TotalAssetsCount < 1) {
            Swal.fire("error", "More assets are required to generate a preview")
        } else {
            const data = {
                "description": descriptionFieldVal,
                "width": 300,
                "height": 300,
                "editionSize": collectionSizeFieldVal,
                "layers": session["layers"],
                "rarities": rarities
            }
            console.log(data);
            const payload = await fetch(`${baseURL}/preview`, {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                    sesID: session.sesID
                },
                body: JSON.stringify(data),
            });
            const ress = await payload.json();
            console.log(ress);
            Swal.fire({
                title: 'Sweet!',
                text: '',
                imageUrl: ress.imageInfo[0].path,
                imageWidth: 300,
                imageHeight: 300,
                imageAlt: 'Custom image',
            });
        }
    } catch (err) {
        console.log(err, "<==========");
    }
}

const generateNFTs = async () => {
    try {
        const nameField = document.getElementById("projectName");
        const nameFieldVal = nameField.value;
        const descriptionField = document.getElementById("projectDescription");
        const descriptionFieldVal = descriptionField.value;
        const collectionSizeField = document.getElementById("collectionSize");
        const collectionSizeFieldVal = collectionSizeField.value;
        const emailField = document.getElementById("email");
        const emailFieldVal = emailField.value;
        if (emailFieldVal.length < 1 || !validate("email", "email")) {
            Swal.fire("error", "Please specify an email the collection will be sent to.");
            return;
        }
        if (session.TotalAssetsCount > 5) {
            Swal.fire("error", "More than 4 assets are required to generate a collection");
            return;
        } else {
            if ((nameFieldVal.length < 1) || descriptionFieldVal.length < 1) {
                Swal.fire("error", "Both Project Name and Project Descriptions are required");
                return;
            }
            if (collectionSizeFieldVal.length < 1 && collectionSizeFieldVal == "0") {
                Swal.fire("error", "Please specify Collection Size");
                return;
            }
            Swal.fire({
                title: 'We are currently generating your collection!',
                text: 'Please check your email for a link to your generated collection.',
            });
            const obj = {emailFieldVal, nameFieldVal, descriptionFieldVal, collectionSizeFieldVal, rarities};
            generationHTTPRequest(obj);
            localStorage.removeItem("sesID");
            window.top.location = window.top.location
            const ress = await payload.json();
            return true;
        }
    } catch (err) {
        Swal.fire("Oops!!", "We messed up somewhere, no worries we are fixing it.");
        console.log(err, "<==========");
    }
}

const generationHTTPRequest = async (obj) => {
    const {emailFieldVal, nameFieldVal, descriptionFieldVal, collectionSizeFieldVal, rarities} = obj;
    const data = {
        email: emailFieldVal,
        name: nameFieldVal,
        "description": descriptionFieldVal,
        "width": 300,
        "height": 300,
        "editionSize": collectionSizeFieldVal,
        "layers": session["layers"],
        "rarities": rarities
    }
    const payload = await fetch(`${baseURL}/generate`, {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
            sesID: session.sesID
        },
        body: JSON.stringify(data),
    });
}


// To make this function work please make sure the variable passed is the same as the HTML id of the element and the objext key
const updateUI = (htmlID, value) => {
    document.getElementById(htmlID).innerHTML = value;
}


function validate(el, type) {
    var input = document.getElementById(el);

    if (input.checkValidity()) {
        return true
    } else {
        return false;
    }
}


const startup = async () => {
    try {
        const ses = getSes();
        if (!ses) {
            const payload = await fetch(`${baseURL}/`, {
                method: 'GET', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Expose-Headers': '*'
                },
            });
            const sesID = payload.headers.get("sesID");
            localStorage.setItem("sesID", sesID);
            getSes();
        }
        // Dropzone has been added as a global variable.
        new Dropzone("div.my-dropzone", dropzoneOption("background"));
    } catch (err) {
        console.log(err);
    }
}


const getSes = () => {
    const ses = localStorage.getItem("sesID");
    if (ses) {
        session["sesID"] = ses;
        return true;
    } else {
        return false;
    }
}


startup();