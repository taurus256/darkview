let CardsArray = []


function CheckForStage(array, state){
  return array.find((item => item[`${state}`] == false)) === undefined ? true : false;
}

function updateInArray(array, id, updatedItem){
  let elementId = array.findIndex((item => item.id == id));
  array[elementId] = updatedItem;
}

class Card{
  constructor(card){
    if(card !== undefined) 
    {
      this.id = card.id;
      this.OS = card.OS;
      this.status = card.Status;
      this.Browser = card.Browser;
      this.ScreenPreview = card.LINKS[0].ScreenPreview;
      this.ScreenFullLink = card.LINKS[0].ScreenFullLink;
      this.DiffPreview = card.LINKS[0].DiffPreview;
      this.DiffFullLink = card.LINKS[0].DiffFullLink;

      this.diffIsShowing = false;
      this.readyToCreateDiff = this.ScreenPreview != '' && this.ScreenFullLink != '' && this.status == '200';
      this.readyToShowDiff = this.DiffPreview != '' && this.DiffFullLink != '' && this.status == '200';
    }
  }

  diffPreviewToggle(){
    this.diffIsShowing = !this.diffIsShowing;
    updateInArray(CardsArray, this.id, this);
    display()
  }

  render(rootNode){
    if(this.id === undefined) 
    {return null;}

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

    // Левая часть
    let leftSide = document.createElement("div"); leftSide.classList.add("render-card--state-display--left");
    let previewImg = document.createElement("img"); previewImg.setAttribute("src", this.DiffPreview == '' ? "../src/img/cards/placeholder.png" : this.DiffPreview);
    leftSide.appendChild(previewImg);

    // Отображение статуса

    let status = null;

    let message = null;

    let messageIcon = null;

    function createContextByStatus(className, text, messageIconPath){
      status = document.createElement("div"); status.classList.add(className);
      message = document.createElement("p"); message.textContent = text;
      status.appendChild(message);
      messageIcon = document.createElement("img"); messageIcon.setAttribute("src", messageIconPath);
      status.appendChild(messageIcon);
    }

    switch (this.status.toUpperCase()) {
      case '200':
        createContextByStatus("card-state", "", this.ScreenPreview);
        break;

      case 'PENDING':
        createContextByStatus("animation--card-state", "В обработке", "../src/icons/loading.svg");
        break;

      default: //ERROR
        createContextByStatus("card-state", "Ошибка", "../src/icons/red-cross.svg");        
        break;
    }
    

    leftSide.appendChild(status);
    //Конец отображения статуса

    cardMiddle.appendChild(leftSide);

    //Правая часть
    if (this.diffIsShowing) {
      
      let rightSide = document.createElement("div"); rightSide.classList.add("render-card--state-display--right"); 
      let dash = document.createElement("div"); dash.classList.add("vertical-dash");

      rightSide.appendChild(dash);

      let diffPicture = document.createElement("img"); diffPicture.setAttribute("src", "../src/img/cards/DiffExample.png");

      rightSide.appendChild(diffPicture);

      cardMiddle.appendChild(rightSide);
    }
    

    _card.appendChild(cardMiddle)


    let cardBottom = document.createElement("div"); 
      cardBottom.classList.add("render-card--bottom");
      cardBottom.classList.add("flex");
      cardBottom.classList.add("center");

    // TODO Улучшить читаемость кода
    // Конец карточки
    if(CheckForStage(CardsArray, 'readyToCreateDiff') && !CheckForStage(CardsArray, 'readyToShowDiff')){
      

      // Radio для выбора образца 
      let radioAsExample = document.createElement("input"); 
      radioAsExample.setAttribute("type", "radio"); 
      radioAsExample.setAttribute("name", "cardRadio");

      let labelForRadio = document.createElement("label");
      labelForRadio.setAttribute("for","cardRadio");

      let innerlabelForRadio = document.createElement("p");
      innerlabelForRadio.textContent = "Образец для сравнения"

      labelForRadio.appendChild(innerlabelForRadio)
      

      cardBottom.appendChild(radioAsExample);
      cardBottom.appendChild(labelForRadio);
    }

    if (CheckForStage(CardsArray, 'readyToCreateDiff') && CheckForStage(CardsArray, 'readyToShowDiff')) {
      // Checkbox для демонстрации сравнения
      let showDiffCheckbox = document.createElement("input"); 
      showDiffCheckbox.setAttribute("type", "checkbox"); 
      showDiffCheckbox.setAttribute("name", "diffCheckBox");
      showDiffCheckbox.checked = this.diffIsShowing;
      showDiffCheckbox.onchange = () => this.diffPreviewToggle();

      cardBottom.appendChild(showDiffCheckbox);

      let labelForCheckbox = document.createElement("label");
      labelForCheckbox.setAttribute("for","diffCheckBox");

      let innerLabel = document.createElement("p");
      innerLabel.textContent = this.diffIsShowing ?  "Свернуть сравнение <" : "Развернуть сравнение >"

      labelForCheckbox.appendChild(innerLabel)
      cardBottom.appendChild(labelForCheckbox);
    }
    
    _card.appendChild(cardBottom);

    rootNode.appendChild(_card);
  }
}

let obj = { "id": 0, "OS": "WIN","Browser": "edge", "Status" : "Обрабатывается", "LINKS":[{"ScreenPreview": "w", "ScreenFullLink": "w", "DiffPreview": "", "DiffFullLink": ""}] }
CardsArray.push(new Card(obj))
CardsArray.push(new Card({ "id": 1, "OS": "MAC", "Status" : "Pending","Browser": "Safari", "LINKS":[{"ScreenPreview": "w", "ScreenFullLink": "w", "DiffPreview": "", "DiffFullLink": ""}]} ))
CardsArray.push(new Card({ "id": 2, "OS": "LIN", "Status" : "200", "Browser": "FIREfox", "LINKS":[{"ScreenPreview": "w", "ScreenFullLink": "w", "DiffPreview": "", "DiffFullLink": ""}]} ))
CardsArray.push(new Card(undefined))

function display(){
  let parent = document.getElementById("__UUID");
  parent.innerHTML = '';
  CardsArray.forEach(element => {
    element.render(parent);
  });
}

display();