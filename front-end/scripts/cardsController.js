let CardsArray = []

function updateInArray(array, id, updatedItem){
  let elementId = array.findIndex((item => item.id == id));
  array[elementId] = updatedItem;
}

class Card{
  constructor(card){
    this.id = card.id;
    this.OS = card.OS;
    this.status = card.Status;
    // this.code = card.Code;
    this.Browser = card.Browser;
    this.ScreenPreview = card.LINKS[0].ScreenPreview;
    this.ScreenFull = card.LINKS[0].ScreenFull;
    this.DiffPreview = card.LINKS[0].DiffPreview;
    this.DiffFull = card.LINKS[0].DiffFull;

    this.hasDiffPreview = false;//card.LINKS[0].DiffPreview == '' ? false : true;
  }

  diffPreviewToggle(){
    this.hasDiffPreview = !this.hasDiffPreview;
    updateInArray(CardsArray, this.id, this);
    display()
  }

  render(rootNode){
    let _card = document.createElement("div"); _card.className = "render-card";
// Верхняя часть карточки
    let cardTop = document.createElement("div"); cardTop.className = "render-card--top";
    let osIcon = document.createElement("img"); osIcon.setAttribute("src", `../src/icons/systems/${this.OS.toUpperCase()}.png`);
    let browserName = document.createElement("h5"); browserName.textContent = this.Browser.toUpperCase();
    cardTop.appendChild(osIcon);
    cardTop.appendChild(browserName);
    _card.appendChild(cardTop);


    // Средняя часть карточки
    let cardMiddle = document.createElement("div"); cardMiddle.classList.add("render-card--state-display");

    //Left
    let leftSide = document.createElement("div"); leftSide.classList.add("render-card--state-display--left");
    let previewImg = document.createElement("img"); previewImg.setAttribute("src", "../src/img/cards/placeholder.png");
    leftSide.appendChild(previewImg);

    // Отображение статуса

    let status = null;

    let message = null;

    let messageIcon = null;

    switch (this.status.toUpperCase()) {
      case '200':
      status = document.createElement("div"); status.classList.add("card-state");

      message = document.createElement("p"); message.textContent = "Будет выводиться скриншот";
      status.appendChild(message);

      messageIcon = document.createElement("img"); messageIcon.setAttribute("src", "../src/icons/green-check.svg");
      status.appendChild(messageIcon);
        break;

      case 'PENDING':
        status = document.createElement("div"); status.classList.add("animation--card-state");

        message = document.createElement("p"); message.textContent = "В обработке";
        status.appendChild(message);

        messageIcon = document.createElement("img"); messageIcon.setAttribute("src", "../src/icons/loading.svg");
        status.appendChild(messageIcon);
    break;

      default: //ERROR
        status = document.createElement("div"); status.classList.add("card-state");

        message = document.createElement("p"); message.textContent = "Ошибка";
        status.appendChild(message);

        messageIcon = document.createElement("img"); messageIcon.setAttribute("src", "../src/icons/red-cross.svg");
        status.appendChild(messageIcon);
        
        break;
    }
    

    leftSide.appendChild(status);
    //Конец отображения статуса

    cardMiddle.appendChild(leftSide);

    //Rigth
    if (this.hasDiffPreview) {
      
      let rightSide = document.createElement("div"); rightSide.classList.add("render-card--state-display--right"); 
      let dash = document.createElement("div"); dash.classList.add("vertical-dash");

      rightSide.appendChild(dash);

      let diffPicture = document.createElement("img"); diffPicture.setAttribute("src", "../src/img/cards/DiffExample.png");

      rightSide.appendChild(diffPicture);

      cardMiddle.appendChild(rightSide);
    }
    

    _card.appendChild(cardMiddle)


    // Конец карточки
    let cardBottom = document.createElement("div"); 
    cardBottom.classList.add("render-card--bottom");
    cardBottom.classList.add("flex");
    cardBottom.classList.add("center");

    let radioAsExample = document.createElement("input"); 
    radioAsExample.setAttribute("type", "radio"); 
    radioAsExample.setAttribute("name", "card-radio");
    radioAsExample.classList.add("hidden");

    cardBottom.appendChild(radioAsExample);

    let showDiffCheckbox = document.createElement("input"); 
    showDiffCheckbox.setAttribute("type", "checkbox"); 
    showDiffCheckbox.setAttribute("name", "diffCheckBox");
    showDiffCheckbox.checked = this.hasDiffPreview;
    showDiffCheckbox.onchange = () => this.diffPreviewToggle();
    // showDiffCheckbox.classList.add("hidden");

    cardBottom.appendChild(showDiffCheckbox);

    let labelForCheckbox = document.createElement("label");
    labelForCheckbox.setAttribute("for","diffCheckBox");

    let innerLabel = document.createElement("p");
    innerLabel.textContent = this.hasDiffPreview ?  "Свернуть сравнение <" : "Развернуть сравнение >"

    labelForCheckbox.appendChild(innerLabel)
    // labelForCheckbox.setAttribute("text","cheese")
    cardBottom.appendChild(labelForCheckbox);
    
    
    
    _card.appendChild(cardBottom);

    rootNode.appendChild(_card);
  }
}

let obj = { "id": 0, "OS": "WIN","Browser": "edge", "Status" : "Обрабатывается", "LINKS":[{"ScreenPreview": "", "ScreenFull": "", "DiffPreview": "", "DiffFull": ""}] }
CardsArray.push(new Card(obj))
CardsArray.push(new Card({ "id": 1, "OS": "MAC", "Status" : "Pending","Browser": "Safari", "LINKS":[{"ScreenPreview": "", "ScreenFull": "", "DiffPreview": " w", "DiffFull": ""}]} ))
CardsArray.push(new Card({ "id": 2, "OS": "LIN", "Status" : "200", "Browser": "FIREfox", "LINKS":[{"ScreenPreview": "", "ScreenFull": "", "DiffPreview": "", "DiffFull": ""}]} ))

function display(){
  let parent = document.getElementById("__UUID");
  parent.innerHTML = '';
  CardsArray.forEach(element => {
    element.render(parent);
  });
}

display();

function updateView(){

}