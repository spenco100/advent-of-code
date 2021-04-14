// Serves to parse and clean up raw text file data
const fs = require('fs');
const path = require('path');


function readInput() {
  // read and return the unparsed data file
  try {
    const data = fs.readFileSync('../data/unparsed.txt', 'utf8')
    return data;
  } catch (err) {
    console.error(err)
  }
}

function cleanInput(data) {
  // remove any type of line breaks if present
  const rules = data.toString().replace(/(\r\n|\n|\r)/gm,"");
  // create an array with an item for each line/rule
  const separatedRules = rules.split(".");
  // console.log(separatedRules);
  return separatedRules;
}

function parseInput(cleanedData) {
  // data to return
  let parsedArray = [];

  // create a new array of arrays separated by bag name and it's children/contents
  const nameAndRules = cleanedData.map(rule => rule = rule.split(" contain "));

  let ruleIdx = 0;
  for (ruleIdx in nameAndRules) {
    let returnObject = {
      parentBagName: null,
      children: []
    };

    // for ease of use when referencing the current rule we are parsing
    let rules = nameAndRules[ruleIdx];

    // get the first item and remove it. the first item will always be the bag's name
    returnObject.parentBagName = rules.shift();
    // console.log(parentBagName);

    // using the remaining items, create a new array of rules as they are separated by a comma and a space
    // keep in mind rules is a single item array, so we use that single item for our mutations
    if (rules.length > 0) {
      // separate children in each rule, as denoted by commas
      const separatedRules = rules[0].split(", ");
      
      // for every rule, separate the child's quantity from name
      separatedRules.map((rule, idx) => {
        const r = /\d+/g;
        let match;
        while ((match = r.exec(rule)) != null) {
          const quantity = match[0];
          // remove the quantity from name
          const childBagName = match["input"].replace(`${quantity} `, "");
          // add an object containing name and quantity to the returnObject's children array
          returnObject.children.push({ quantity, childBagName });
          return
        }
      })
    }
    // add the assembled return object to the parsedArray
    if (returnObject.parentBagName !== "") { // prevent an empty object being added to the array
      parsedArray.push(returnObject);
    }
  }
  return parsedArray;
}


function init() {
  const data = readInput();
  const cleanedData = cleanInput(data);
  const parsedData = parseInput(cleanedData);

  const dataReadyForSave = JSON.stringify(parsedData, null, 4)
  const fileName = "parsed.json"
  // write our cleaned, parsed JSON data to a local directory
  fs.writeFile(path.resolve(__dirname, '../data/', fileName), dataReadyForSave, 'utf8', function(err) {
    if (err) { 
      return console.log(err);
    }
    console.log(`Saved parsed data to ${fileName}`);
  })
}

init();



