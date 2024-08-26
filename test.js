const { Liquid } = require('liquidjs');
const  engine = new Liquid();
const fs = require('fs');
const path = require('path');
const { isUtf8 } = require('buffer');
const outputPath = path.join(__dirname,'out.json')

const template = fs.readFileSync(path.join(__dirname,'template.liquid'));

const data = JSON.parse(fs.readFileSync(path.join(__dirname,'data.json'))); 

function cleanJsonString(jsonString) {
    try {
        // Check if the JSON string is valid
        let jsonObject = JSON.parse(jsonString);
    
        // Clean the devices array
        if (jsonObject.devices && typeof jsonObject.devices === 'string') {
          jsonObject.devices = jsonObject.devices.split(',').map(device => device.trim());
        }
    
        // Return the cleaned JSON object
        return JSON.stringify(jsonObject, null, 2);
      } catch (error) {
        console.error("Invalid JSON string provided:", error);
        return null;
      }
    
    
}

engine.parseAndRender(template,{content: data})
.then(result => {

    const resultString = String(result);

    try{
        const outerJson = JSON.parse(JSON.stringify(result));
        const innerJsonString = cleanJsonString(outerJson);
        const jsonData = JSON.parse(innerJsonString);   

        fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 4),'utf8');
      console.log("Output written to out.json:",jsonData);
    } catch(error){
        console.error('error parsing rendered output or writing to file:',error);
    }
})
.catch(err =>{
    console.error(
        'error rendering template:',err);
});

