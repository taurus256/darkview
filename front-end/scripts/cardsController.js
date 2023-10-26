let CardsArray = []
let STAGES = ['Default', 'ReadyToCreateDiff', 'ReadyToShowDiff']
let a = 0;

function CheckForStage(arrayByUUID){

  arrayByUUID.Stage = STAGES[0];
  if (arrayByUUID.Cards.find((item => item['readyToCreateDiff'] == false)) === undefined) {
    arrayByUUID.Stage = STAGES[1];
  }
  if (arrayByUUID.Cards.find((item => item['readyToShowDiff'] == false)) === undefined) {
    arrayByUUID.Stage = STAGES[2];
  }
  arrayByUUID.Cards.forEach(element => {
    element.stage = arrayByUUID.Stage;
  });
}

function updateInArray(array, UUID, id, updatedItem){
  // Возможно найдется баг при обновлении карточки
  let elementId = array.findIndex((item => item.id == id && item.UUID == UUID));
  array[elementId] = updatedItem;
}

class Card{
  constructor(card){
    if(card === undefined) 
    {return;}
    
    this.UUID = card.UUID;
    this.id = card.id;
    this.OS = card.OS;
    this.status = card.Status;
    this.Browser = card.Browser;
    this.ScreenPreview = card.LINKS[0].ScreenPreview;
    this.ScreenFullLink = card.LINKS[0].ScreenFullLink;
    this.DiffPreview = card.LINKS[0].DiffPreview;
    this.DiffFullLink = card.LINKS[0].DiffFullLink;

    this.diffIsShowing = false;
    this.readyToCreateDiff = this.ScreenPreview != '' && this.ScreenFullLink != ''; // && this.status == '200';
    this.readyToShowDiff = this.DiffPreview != '' && this.DiffFullLink != '' //&& this.status == '200';
    
    this.stage = card.Stage;
  }

  diffPreviewToggle(){
    this.diffIsShowing = !this.diffIsShowing;
    updateInArray(CardsArray, this.UUID, this.id, this);
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
    let previewImg = document.createElement("img"); previewImg.setAttribute("src", this.ScreenPreview == '' ? "../src/img/cards/placeholder.png" : this.ScreenPreview);
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
        createContextByStatus("card-state", "", "");
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
    if(this.stage == STAGES[1]){
      

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

    if (this.stage == STAGES[2]) {
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

function getArrayOfSections(array){
  array.forEach(requestByUUID => {
    let newUUIDSection = { "UUID" : requestByUUID.UUID, "Cards" : [], "Stage" : STAGES[0]}
    requestByUUID.CARDS.forEach(card => {
      newUUIDSection.Cards.push(new Card({ "UUID":requestByUUID.UUID, "Stage" : newUUIDSection.Stage, "id": card.id, "OS": card.OS, "Status" : card.Status, "Browser": card.Browser, "LINKS":[{"ScreenPreview": card.LINKS[0].ScreenPreview, "ScreenFullLink": card.LINKS[0].ScreenFull, "DiffPreview": card.LINKS[0].DiffPreview, "DiffFullLink": card.LINKS[0].DiffFull}]} ));
    });
    CardsArray.push(newUUIDSection)
  });
  
}

getArrayOfSections(cardsDataArray)

function display(){
  // Create UUIDSections
  let rootNode = document.getElementById("cards--section");
  CardsArray.forEach(element => {

    CheckForStage(CardsArray.find((item => item.UUID == element.UUID)))

    let newUUIDSection = document.createElement("div");
    newUUIDSection.classList.add("render-card--container");
    newUUIDSection.classList.add("flex");
    newUUIDSection.setAttribute("id", `${element.UUID}`);
    rootNode.appendChild(newUUIDSection);
  });

  // Display Cards in UUIDSections
  CardsArray.forEach(section => {
    let parent = document.getElementById(`${section.UUID}`);
    parent.innerHTML = '';
    section.Cards.forEach(card => {
      card.render(parent);
  });
});
}

display();