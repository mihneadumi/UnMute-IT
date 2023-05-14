import DeviceDetector from "https://cdn.skypack.dev/device-detector-js@2.2.10";
const mpHands = window;
const drawingUtils = window;
const controls = window;
const controls3d = window;

// Usage: testSupport({client?: string, os?: string}[])
// Client and os are regular expressions.
// See: https://cdn.jsdelivr.net/npm/device-detector-js@2.2.10/README.md for
// legal values for client and os
testSupport([
    { client: 'Chrome' },
]);

const utterThis = new SpeechSynthesisUtterance();
const synth = window.speechSynthesis;
let ourText = "";

let j = 0, res = "", diff_res = "", contor = 0,inauntru = 0;
function changeInHtml(data){
   if(res == data.result)
     j++;
   else{
     j = 1;
     res = data.result;
   }
   if(j == 3 && (diff_res != res || res == "")){
    console.log(data.result)
    console.log(inauntru)
    if(data.result == "greeting" && contor == 0)
    {
        addBuffer("Hi everyone,so nice to see you all here today!");
        ourText = "Hi everyone,so nice to see you all here today!";
        utterThis.text = ourText
        synth.speak(utterThis)
        contor++;
    }
    if(data.result == "how" && contor == 1)
    {
        document.getElementById("p3").innerHTML = " ";
        addBuffer("How are you all feeling today?");
        ourText = "How are you all feeling today?";
        utterThis.text = ourText
        synth.speak(utterThis)
        contor++;
    }
    if(data.result == "custom2" && contor == 2)
    {
        document.getElementById("p3").innerHTML = " ";
        addBuffer("Our inability to form deep connections in a world where we are more connected than ever!");
        ourText = "Today I wanted to come here and raise some awareness about a big problem everyone encounters. Our inability to form deep connections in a world where we are more connected than ever!";
        utterThis.text = ourText
        synth.speak(utterThis)
        contor++;
    }
    if(contor > 2)
    {
        if(data.result != "custom1")
        {
            if(data.result == "okay" && inauntru == 0)
            {

                ourText = document.getElementById("p3").innerHTML;
                utterThis.text = ourText
                synth.speak(utterThis)

                document.getElementById("p3").innerHTML = " ";
                return;
            }
            if(data.result == "custom2")
            {
                addBuffer("Together we can change the world!This is only the beginning!");
            }
            else 
            {
                addBuffer(data.result);
            }
            
        }
        if(data.result == "custom1" && inauntru == 0)
        {
            document.getElementById("p3").innerHTML = " ";
            inauntru = 1;
        }
        else if(data.result == "custom1" &&  inauntru == 1)
        {
            ourText = document.getElementById("p3").innerHTML;
            utterThis.text = ourText
            synth.speak(utterThis)

            document.getElementById("p3").innerHTML = " ";
            inauntru = 0;
        }
    }

    diff_res = res;
    j = 0;
   }
}
function addBuffer(data){

    document.getElementById("p3").innerHTML += " " + data;
}
function isCorrectData(data){
   if(data.result != "no data"){

   	changeInHtml(data);
   	document.getElementById("p4").innerHTML = '<a href="#" class="btn-neon_a"><div class="fade-out-image"> </div><svg height="50" width="180"><div id="p2"> </div><polyline points="0,0 180,0 180,50 0,50 0,00"></polyline></svg></a>';
   	document.getElementById("p2").innerHTML = data.result;
   }
  else{
  document.getElementById("p4").innerHTML = '<a href="#" class="btn-neon"><div class="fade-out-image"> </div><svg height="50" width="180"><div id="p2"> </div><polyline points="0,0 180,0 180,50 0,50 0,00"></polyline></svg></a>';
  }
  	
}
function exportToJsonFile(jsonData) {
 if(jsonData != []){
  let dataStr = JSON.stringify(jsonData);
  if(dataStr != []){
	  fetch('http://10.10.11.2:8000/', {
	    method: 'POST',
	    headers: {
	      'Content-Type': 'application/json'
	    },
	    body: JSON.stringify(jsonData)
	  })
	  .then(response => response.json())
	  .then(data => {
	    // Handle the response data
	    if(data != [])
	     isCorrectData(data);
	  })
	}
  }
}

function testSupport(supportedDevices) {
    const deviceDetector = new DeviceDetector();
    const detectedDevice = deviceDetector.parse(navigator.userAgent);
    let isSupported = false;
    for (const device of supportedDevices) {
        if (device.client !== undefined) {
            const re = new RegExp(`^${device.client}$`);
            if (!re.test(detectedDevice.client.name)) {
                continue;
            }
        }
        if (device.os !== undefined) {
            const re = new RegExp(`^${device.os}$`);
            if (!re.test(detectedDevice.os.name)) {
                continue;
            }
        }
        isSupported = true;
        break;
    }
    if (!isSupported) {
        alert(`This demo, running on ${detectedDevice.client.name}/${detectedDevice.os.name}, ` +
            `is not well supported at this time, continue at your own risk.`);
    }
}
// Our input frames will come from here.
const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const controlsElement = document.getElementsByClassName('control-panel')[0];
const canvasCtx = canvasElement.getContext('2d');
const config = { locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${mpHands.VERSION}/${file}`;
    } };
// We'll add this to our control panel later, but we'll save it here so we can
// call tick() each time the graph runs.
// Optimization: Turn off animated spinner after its hiding animation is done.
const spinner = document.querySelector('.loading');
spinner.ontransitionend = () => {
    spinner.style.display = 'none';
};
const landmarkContainer = document.getElementsByClassName('landmark-grid-container')[0];
const grid = new controls3d.LandmarkGrid(landmarkContainer, {
    connectionColor: 0x23a6d5,
    definedColors: [{ name: 'Left', value: 0x23d5ab }, { name: 'Right', value: 0xcf8fa7 }],
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
let i = 0;
function onResults(results) {
    // Hide the spinner.
    document.body.classList.add('loaded');
    // Draw the overlays.
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
    if (results.multiHandLandmarks && results.multiHandedness) {
        for (let index = 0; index < results.multiHandLandmarks.length; index++) {
            const classification = results.multiHandedness[index];
            const isRightHand = classification.label === 'Right';
            const landmarks = results.multiHandLandmarks[index];
            drawingUtils.drawConnectors(canvasCtx, landmarks, mpHands.HAND_CONNECTIONS, { color: isRightHand ? '#00FF00' : '#FF0000' });
            drawingUtils.drawLandmarks(canvasCtx, landmarks, {
                color: isRightHand ? '#00FF00' : '#FF0000',
                fillColor: isRightHand ? '#FF0000' : '#00FF00',
                radius: (data) => {
                    return drawingUtils.lerp(data.from.z, -0.15, .1, 10, 1);
                }
            });
        }
    }
    canvasCtx.restore();
    if (results.multiHandWorldLandmarks) {
        // We only get to call updateLandmarks once, so we need to cook the data to
        // fit. The landmarks just merge, but the connections need to be offset.
        const landmarks = results.multiHandWorldLandmarks.reduce((prev, current) => [...prev, ...current], []);
        const colors = [];
        let connections = [];
        for (let loop = 0; loop < results.multiHandWorldLandmarks.length; ++loop) {
            const offset = loop * mpHands.HAND_CONNECTIONS.length;
            const offsetConnections = mpHands.HAND_CONNECTIONS.map((connection) => [connection[0] + offset, connection[1] + offset]);
            connections = connections.concat(offsetConnections);
            const classification = results.multiHandedness[loop];
            for(let i = loop*21; i < (loop+1)*21; i++){
                if(classification.label === 'Right'){
                    landmarks[i].x = landmarks[i].x+0.1;
                }
                else{
                    landmarks[i].x = landmarks[i].x-0.1;
                }
            }
            colors.push({
                list: offsetConnections.map((unused, i) => i + offset),
                color: classification.label,
            });
        }
        grid.updateLandmarks(landmarks, connections, colors);
    }
    else {
        grid.updateLandmarks([]);
    }
    i += 1;
    if(i == 20){
    exportToJsonFile(results.multiHandLandmarks.reduce((prev, current) => [...prev, ...current], []));
    i = 0
    }
}
const hands = new mpHands.Hands(config);
hands.onResults(onResults);
// Present a control panel through which the user can manipulate the solution
// options.
new controls
    .ControlPanel(controlsElement, {
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
})
    .add([
    new controls.StaticText({ title: 'Sign language recognition' }),
    new controls.SourcePicker({
        onFrame: async (input, size) => {
            const aspect = size.height / size.width;
            let width, height;
            if (window.innerWidth > window.innerHeight) {
                height = window.innerHeight;
                width = height / aspect;
            }
            else {
                width = window.innerWidth;
                height = width * aspect;
            }
            canvasElement.width = width;
            canvasElement.height = height;
            await hands.send({ image: input });
        },
    }),
])
    .on(x => {
    const options = x;
    hands.setOptions(options);
});
