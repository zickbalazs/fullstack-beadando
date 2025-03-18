class Ficus{
    Id;
    #name;
    #type;
    #consumption;
    #frequency;
    constructor(){
        this.Id = crypto.randomUUID();
    }

    GenerateFormInDom(node){
        let inputGroup = document.createElement("div");
        
        inputGroup.classList.add("row");
        inputGroup.appendChild(this.#makeInputNode("ficusName", "text", "Növény neve"));
        inputGroup.appendChild(this.#makeInputNode("ficusType", "text", "Növény típusa"));
        inputGroup.appendChild(this.#makeInputNode("ficusConsumption", "number", "Fogyasztása"));
        inputGroup.appendChild(this.#makeInputNode("ficusFrequency", "number", "Gyakoriság"));

        node.appendChild(inputGroup);

    }

    GetObject(){
        this.#getValuesFromNodes();
        return {
            "name": this.#name,
            "type": this.#type,
            "consumption": this.#consumption,
            "frequency": this.#frequency
        }
    }


    #getValuesFromNodes(){
        this.#name = document.querySelector(`#ficusName-${this.Id}`).value;
        this.#type = document.querySelector(`#ficusType-${this.Id}`).value;
        this.#consumption = document.querySelector(`#ficusConsumption-${this.Id}`).value;
        this.#frequency = document.querySelector(`#ficusFrequency-${this.Id}`).value;
    }

    #makeInputNode(name, type, labelText){
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

class TableCell{
    #day;
    #consumption;
    #type;    
    AddCellToDomElement(node){
        let x = document.createElement("td");
        x.textContent = `Day ${this.#day}:\n${this.#consumption} l`;
        x.classList.add(this.#type);
        node.appendChild(x)
    }
}

let Fici = [];

let addFicus = ()=>{
    let ficus = new Ficus();
    Fici.push(ficus);
    ficus.GenerateFormInDom(document.querySelector("#ficaeToAdd"))
}

document.querySelector("#ficusAdder").addEventListener("click", addFicus)