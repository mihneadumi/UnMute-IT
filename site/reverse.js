import DeviceDetector from "https://cdn.skypack.dev/device-detector-js@2.2.10";
import ungapstructuredClone from 'https://cdn.jsdelivr.net/npm/@ungap/structured-clone@1.2.0/+esm'
const mpHands = window;
const drawingUtils = window;
const controls = window;
const controls3d = window;

let dict;

await fetch("./reverse_data.json").then(response => response.text()).then((text) => {dict = JSON.parse(text);});

let connections_one_hand=[
    [
        0,
        1
    ],
    [
        1,
        2
    ],
    [
        2,
        3
    ],
    [
        3,
        4
    ],
    [
        0,
        5
    ],
    [
        5,
        6
    ],
    [
        6,
        7
    ],
    [
        7,
        8
    ],
    [
        5,
        9
    ],
    [
        9,
        10
    ],
    [
        10,
        11
    ],
    [
        11,
        12
    ],
    [
        9,
        13
    ],
    [
        13,
        14
    ],
    [
        14,
        15
    ],
    [
        15,
        16
    ],
    [
        13,
        17
    ],
    [
        0,
        17
    ],
    [
        17,
        18
    ],
    [
        18,
        19
    ],
    [
        19,
        20
    ]
]

let connections_two_hands=[
    [
        0,
        1
    ],
    [
        1,
        2
    ],
    [
        2,
        3
    ],
    [
        3,
        4
    ],
    [
        0,
        5
    ],
    [
        5,
        6
    ],
    [
        6,
        7
    ],
    [
        7,
        8
    ],
    [
        5,
        9
    ],
    [
        9,
        10
    ],
    [
        10,
        11
    ],
    [
        11,
        12
    ],
    [
        9,
        13
    ],
    [
        13,
        14
    ],
    [
        14,
        15
    ],
    [
        15,
        16
    ],
    [
        13,
        17
    ],
    [
        0,
        17
    ],
    [
        17,
        18
    ],
    [
        18,
        19
    ],
    [
        19,
        20
    ],
    [
        21,
        22
    ],
    [
        22,
        23
    ],
    [
        23,
        24
    ],
    [
        24,
        25
    ],
    [
        21,
        26
    ],
    [
        26,
        27
    ],
    [
        27,
        28
    ],
    [
        28,
        29
    ],
    [
        26,
        30
    ],
    [
        30,
        31
    ],
    [
        31,
        32
    ],
    [
        32,
        33
    ],
    [
        30,
        34
    ],
    [
        34,
        35
    ],
    [
        35,
        36
    ],
    [
        36,
        37
    ],
    [
        34,
        38
    ],
    [
        21,
        38
    ],
    [
        38,
        39
    ],
    [
        39,
        40
    ],
    [
        40,
        41
    ]
]


let colors=[
    {
        "list": [
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20
        ],
        "color": "Left"
    }
]

let colors_two_hands=[
    {
        "list": [
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20,
            21,
            22,
            23,
            24,
            25,
            26,
            27,
            28,
            29,
            30,
            31,
            32,
            33,
            34,
            35,
            36,
            37,
            38,
            39,
            40,
            41
        ],
        "color": "Left"
    },
]



const landmarkContainer = document.getElementsByClassName('landmark-grid-container')[0];
const buton1 = document.getElementsByClassName("btn-neon1")[0];
const buton2 = document.getElementsByClassName("btn-neon2")[0];


const grid = new controls3d.LandmarkGrid(landmarkContainer, {
    connectionColor: 0xCCCCCC,
    definedColors: [{ name: 'Left', value: 0xffa500 }, { name: 'Right', value: 0x00ffff }],
    range: 0.2,
    fitToGrid: false,
    labelSuffix: 'm',
    landmarkSize: 2.4,
    numCellsPerAxis: 0,
    showHidden: false,
    centered: false,
    isRotating: false,
    connectionWidth: 6.5,
});
grid.axesMaterial.visible = false;
grid.gridMaterial.visible = false;
grid.updateLandmarks([{"x":0,"y":0,"z":0},{"x":0.1,"y":0.1,"z":0.1}]);

document.body.classList.add('loaded');

let text = "";

function update() {
    if (dict[text] != undefined){
        if(dict[text].length == 21)
            grid.updateLandmarks(dict[text],connections_one_hand,colors);
        else{
            let landmarkTwoHands = structuredClone(dict[text]);
            for(let i = 0; i < landmarkTwoHands.length/2; i++){
                landmarkTwoHands[i].x = landmarkTwoHands[i].x + 0.07;
                landmarkTwoHands[i+21].x = landmarkTwoHands[i+21].x - 0.07;
            }
            grid.updateLandmarks(landmarkTwoHands,connections_two_hands,colors_two_hands);
        }
    }
    else{
        grid.updateLandmarks([{}]);
    }
}

async function main() {
    setInterval(update, 50);
}
main();

async function translate(){
    let words_a = [];
    text = document.getElementById("text").value.toLowerCase();
    text = text.replace(/[^a-zA-Z ']/g, "");
    text = text.replace(/\s+/g, ' ').trim();
    let words = text.split(" ");
    for (let i = 0; i < words.length; i++) {
        text = words[i];
        if(dict[text] == undefined)
                continue;
        words_a.push(text);
        await new Promise(r => setTimeout(r, 1000));
    }
    text = "";
}

let isRecording = false;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.interimResults = true;
recognition.continuous = true;
recognition.maxAlternatives = 1;

recognition.onstart = (event) => {
    document.getElementById("text").value = "Listening...";
}

recognition.onresult = (event) => {
    const speechToText = event.results[0][0].transcript;
    document.getElementById("text").value = speechToText;
}

recognition.onend = (event) => {
    translate();
}


document.addEventListener('keydown', (event) => {
    const keyName = event.key;
    if (keyName === 'Enter') {
        translate();
        return;
    }
    if(event.target.localName!="input"&&keyName === ' ' && isRecording){
        recognition.stop();
        isRecording = false;
        return;
    }
    if(event.target.localName!="input" && keyName === ' ' && !isRecording){
        recognition.start();
        isRecording = true;
        return;
    }

});

buton1.addEventListener("click" ,(event)=>{
    console.log("ads")
    if(isRecording){
        recognition.stop();
        isRecording = false;
        return;
    }
    if(!isRecording){
        recognition.start();
        isRecording = true;
        return;
    }
})

buton2.addEventListener("click" ,(event)=>{
    translate();
})



