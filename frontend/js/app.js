class Ficus {
  Id;
  #name;
  #type;
  #consumption;
  #frequency;
  constructor() {
    this.Id = crypto.randomUUID();
  }

  GenerateFormInDom(node) {
    let inputGroup = document.createElement("div");

    inputGroup.classList.add("row");
    inputGroup.appendChild(
      this.#makeInputNode("ficusName", "text", "Növény neve")
    );
    inputGroup.appendChild(
      this.#makeInputNode("ficusType", "text", "Növény típusa")
    );
    inputGroup.appendChild(
      this.#makeInputNode("ficusConsumption", "number", "Fogyasztása (l)")
    );
    inputGroup.appendChild(
      this.#makeInputNode("ficusFrequency", "number", "Gyakoriság (nap)")
    );

    node.appendChild(inputGroup);
  }

  GetObject() {
    this.#getValuesFromNodes();
    return {
      name: this.#name,
      type: this.#type,
      consumption: Number(this.#consumption),
      frequency: Number(this.#frequency),
    };
  }

  #getValuesFromNodes() {
    this.#name = document.querySelector(`#ficusName-${this.Id}`).value;
    this.#type = document.querySelector(`#ficusType-${this.Id}`).value;
    this.#consumption = document.querySelector(
      `#ficusConsumption-${this.Id}`
    ).value;
    this.#frequency = document.querySelector(
      `#ficusFrequency-${this.Id}`
    ).value;
  }

  #makeInputNode(name, type, labelText) {
    let inputDiv = document.createElement("div");
    let input = document.createElement("input");
    let label = document.createElement("label");

    //inputs classes, other parameters
    input.classList.add("form-control");
    input.name = `${name}-${this.Id}`;
    input.id = `${name}-${this.Id}`;
    input.type = type;
    input.classList.add("mb-3");

    //label classes, parameter
    label.htmlFor = `${name}-${this.Id}`;
    label.classList.add("form-label");
    label.textContent = labelText;

    //main div classes
    inputDiv.classList.add("col-md-3");

    //push label and input
    inputDiv.appendChild(label);
    inputDiv.appendChild(input);

    return inputDiv;
  }
}

class TableCell {
  #day;
  #consumption;
  #type;

  constructor(day, consumption, type) {
    this.#day = day;
    this.#consumption = consumption;
    this.#type = type;
  }

  AddCellToDomElement() {
    let x = document.createElement("td");
    x.textContent = `${this.#consumption} l`;
    x.classList.add(this.#type);
    return x;
  }
}

let Fici = [];
let Table = [];
let Stats = [];

let addRow = (week, weekNumber) => {
  let rowElement = document.createElement("tr");
  let weekIdentifierCell = document.createElement("td");

  weekIdentifierCell.textContent = `${weekNumber + 1}. hét`;
  weekIdentifierCell.classList.add("weekIdentifier");

  rowElement.appendChild(weekIdentifierCell);

  week.forEach((x) => {
    rowElement.appendChild(x.AddCellToDomElement());
  });

  document.querySelector("#resultData").appendChild(rowElement);
};

let addFicus = () => {
  let ficus = new Ficus();
  Fici.push(ficus);
  ficus.GenerateFormInDom(document.querySelector("#ficaeToAdd"));
};

let makeTableForDOM = () => {
  document.querySelector("#resultData").innerHTML = "";
  makeStats();
  Table.forEach(addRow);
  document.querySelector("#result").classList.remove("d-none");
};

let submitForm = () => {
  let fici = Fici.map((e) => e.GetObject());
  fetch("http://localhost:5069/Ficus", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fici),
  })
    .then((data) => data.json())
    .then((response) => {
      let conversion = response.tableRows.map(e => e.map(x => new TableCell(x.day, x.totalConsumption, x.type)))
      Stats = response.breakdown;
      Table = conversion;
      makeTableForDOM(document.querySelector("#result"));
    })
    .catch((e) => {
      console.error(e);
    });
};

let submitFile = () => {
  let file = document.forms[0][0].files[0]

  let fileForm = new FormData()
  fileForm.append('file', file);

  fetch('http://localhost:5069/Ficus/file', {
    method: 'POST',
    body: fileForm
  }).then(res => res.json()).then(data => {
    let conversion = data.tableRows.map(e => e.map(x => new TableCell(x.day, x.totalConsumption, x.type)))
    Table = conversion;
    Stats = data.breakdown;
    makeTableForDOM(document.querySelector("#result"));
  })
    .catch(error => console.error(error));

}

let makeStats = () => {
  document.querySelector("#statistics").innerHTML = "";
  let list = document.createElement("ul");

  Stats.forEach(x=>{
    let item = document.createElement("li")
    item.innerText = x.ficusName + ':'
    list.appendChild(item);
    
    let itemsDetailsList = document.createElement("ul");
    
    let consDOM = document.createElement("li");
    consDOM.innerText = `Teljes fogyasztás: ${x.totalConsumption} liter`;

    let daysDOM = document.createElement("li");
    daysDOM.innerText = `Összes locsolási nap: ${x.totalDaysNeededThisMonth}`

    itemsDetailsList.append(...[consDOM, daysDOM]);
    list.appendChild(itemsDetailsList)

  })

  document.querySelector("#statistics").append(list);
}
document.querySelector("#ficusAdder").addEventListener("click", addFicus);
document.querySelector("#fileUpload").addEventListener("click", submitFile);
document.querySelector("#submit").addEventListener("click", submitForm);