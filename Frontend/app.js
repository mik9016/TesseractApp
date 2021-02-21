//select url
const url = "http://localhost:3000/upload-picture";

// select file input
const input = document.getElementById("picture");

//select spinner
const spinner = document.getElementById("spinner");

//select copy button

const copyBtn = document.getElementById("copyBtn");

//select body

const body = document.getElementById("bod");

// add event listener
input.addEventListener("change", () => {
  uploadFile(input.files[0]);
});
/////////////////////////////////////////////////////
//FUNCTIONS

function spinnerOn() {
  spinner.style.display = "block";
  body.style.backgroundColor = "grey";
}

function spinnerOff() {
  spinner.style.display = "none";
  body.style.backgroundColor = "whitesmoke";
}

function handleErrors(response) {
  if (!response.ok) {
    alert("no file Uploaded!");
    throw Error(response.statusText);
  }
  return response;
}

//prepare consts to abort fetch requests

const controller = new AbortController();

function aborter(contr) {
  contr.abort();
}

//file extension check

function checkFileType(file) {
  //Allowed extensions
  const filetypes = /jpeg|png|jpg/;
  const lowFile = file.name.toLowerCase();
  //check ext
  const extname = filetypes.test(lowFile);

  if (!extname) {
    alert("Error: Images Only!");
    return aborter(controller);
  }
}
//////////////////////////////////////////////////////////
//fetching

const uploadFile = (file) => {
  // add file to FormData object
  const fd = new FormData();

  //check Filetype
  checkFileType(file);

  fd.append("picture", file); //mus be set exactly like on the server line 37

  //cancel post request if file has wrong extension

  const signal = controller.signal;
  // send `POST` request
  fetch(url, {
    method: "POST",
    signal: signal,
    body: fd,
  })
    .then((res) => res.json())
    .then((json) => console.log(json))
    .catch((err) => console.error(err));
};

//GET

//create a buttton
const getBtn = document.getElementById("getBtn");

//add image

const img = document.getElementById("img");

getBtn.addEventListener("click", () => {
  fetch(url)
    .then((res) => res.blob())
    .then((data) => {
      const rightType = "image/png";
      //check if file is selected
      if (data.type !== rightType) {
        console.log(data.type);
        alert("No File Selected or wrong file extension!");
        location.reload();
      } else {
        console.log(data.type);
        const objectURL = URL.createObjectURL(data);

        img.src = objectURL;

        //tesseract
        const exampleImage = img.src; //image path

        const worker = Tesseract.createWorker({
          logger: (m) => console.log(m),
          spinner: spinnerOn(),
        });
        Tesseract.setLogging(true);
        work();

        async function work() {
          await worker.load();
          await worker.loadLanguage("eng", "deu");
          await worker.initialize("eng", "deu");

          let result = await worker.detect(exampleImage);

          result = await worker.recognize(exampleImage);

          const output = document.getElementById("tes");
          let resultText = result.data.text;
          output.append(resultText);
          spinnerOff();

          copyBtn.addEventListener("click", () => {
            output.select();
            document.execCommand("copy");
            alert("Text copied");
          });

          await worker.terminate();
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

const resetBtn = document.getElementById("reset");
resetBtn.addEventListener("click", () => {
  location.reload();
});
