// const baseURL = "https://nftdynamo.herokuapp.com"
const baseURL = "http://localhost:3010"
/**
 * This function handles getting ipfs data from the backend service.
 */
const getIPFSData = async (code) => {
    try {
        const payload = await fetch(`${baseURL}/view`, {
            method: 'GET', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
                sesID: code
            },
        });
        const ress = await payload.json();
        const imagePath = ress.data.imageFolderLink;
        document.getElementById("ipfsDisplay").src = imagePath;
        document.getElementById("nftTitle").innerText = ress.data.title;
        document.title = ress.data.title + " - NFT Dynamo";
        document.getElementById("nftDescription").innerText = ress.data.description;
        // Swal.fire({
        //     title: 'Sweet!',
        //     text: '',
        //     imageUrl: ress.imageInfo[0].path,
        //     imageWidth: 300,
        //     imageHeight: 300,
        //     imageAlt: 'Custom image',
        // });
    } catch (err) {
        console.log(err, "<==========");
    }
}


const params = new URLSearchParams(window.location.search);
const code = params.get('code');
console.log(code)
if (code) {
    getIPFSData(code);
}

