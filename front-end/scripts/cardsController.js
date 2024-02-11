let CardsArray = []
let STAGES = ['Default', 'ReadyToCreateDiff', 'ReadyToShowDiff']

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
    this.readyToCreateDiff = this.status == 'SUCCESS';
    this.readyToShowDiff = this.DiffPreview != undefined && this.status == 'PREVIEW_IS_READY';
    
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

    let previewImg = document.createElement("img"); 
    previewImg.setAttribute("src", this.ScreenPreview===undefined || this.ScreenPreview == '' ? "../src/img/cards/placeholder.png" : '/job' + this.ScreenPreview);
    let previewUrl = '/job'

    previewImg.addEventListener('click', () => {window.open(`${previewUrl}${this.ScreenFullLink}`, '_blank').focus();})

    leftSide.appendChild(previewImg);

    // Отображение статуса

    let status = null;

    let message = null;

    let messageIcon = null;

    let request = null;

    let temp_ID = this.id;
    let temp_UUID = this.UUID;
    function createContextByStatus(className, text, messageIconPath, requestText){
      status = document.createElement("div"); status.classList.add(className);
      message = document.createElement("p"); message.textContent = text;
      status.appendChild(message);
      messageIcon = document.createElement("img"); messageIcon.setAttribute("src", messageIconPath);
      status.appendChild(messageIcon);
      request = document.createElement("a");
      request.textContent = requestText;
      request.classList.add('none')
      request.addEventListener('click', () => { retry(temp_ID, temp_UUID); display()})
      status.appendChild(request)
    }

    switch (this.status.toUpperCase()) {
      case 'CREATED':
        createContextByStatus("card-state", "Задание в очереди", "", "");
        break;
      case 'SUCCESS':
        createContextByStatus("card-state", "", "");
        break;
      
      case 'PREVIEW_IS_READY':
        createContextByStatus("card-state", "", "");
        break;

      case 'IN_PROGRESS':
        createContextByStatus("animation--card-state", "В обработке", "../src/icons/informative/loading.svg");
        break;

      default: //ERROR
        createContextByStatus("card-state", "Не удалось отрисовать", "../src/icons/informative/sad-failed.svg", "Попробовать еще раз");
        break;
    }
    

    leftSide.appendChild(status);
    //Конец отображения статуса

    cardMiddle.appendChild(leftSide);

    //Правая часть
    let rightSide = document.createElement("div"); rightSide.classList.add("render-card--state-display--right"); 
    if (this.status.toUpperCase() == 'PREVIEW_IS_READY') {
      
      
      let dash = document.createElement("div"); dash.classList.add("vertical-dash");

      rightSide.appendChild(dash);

      let diffPicture = document.createElement("img"); diffPicture.setAttribute("src", '/job' + this.DiffPreview);

      rightSide.appendChild(diffPicture);

      cardMiddle.appendChild(rightSide);
    }
    

    


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

    if (this.DiffPreview != '' && this.DiffPreview != undefined) {
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
      this.diffIsShowing ? _card.className = 'render-card--big' : 'render-card';
      this.diffIsShowing ? rightSide.classList.remove('hidden') : rightSide.classList.add('hidden')

      labelForCheckbox.appendChild(innerLabel)
      cardBottom.appendChild(labelForCheckbox);
    }
    
    _card.appendChild(cardMiddle);
    _card.appendChild(cardBottom);

    rootNode.appendChild(_card);
  }
}


function CheckForStage(arrayByUUID){

  arrayByUUID.Stage = STAGES[0];
  if (arrayByUUID.Cards.find((item => item['readyToCreateDiff'] == false)) === undefined) {
    arrayByUUID.Stage = STAGES[1];
  }
  if (arrayByUUID.Cards.filter((item => item['readyToShowDiff'] == true)) >= 0) {
    arrayByUUID.Stage = STAGES[2];
  }
  console.log(arrayByUUID.Cards.filter((item => item['readyToShowDiff'] == false)));
  arrayByUUID.Cards.forEach(element => {
    element.stage = arrayByUUID.Stage;
  });
  console.log(arrayByUUID.Stage);
}

function updateInArray(array, UUID, id, updatedItem){
  // Возможно найдется баг при обновлении карточки
  let elementId = array.findIndex((item => item.id == id && item.UUID == UUID));
  console.log(elementId);
  array[elementId] = updatedItem;
}

function retry(id, uuid){
  let cardAtIndex = CardsArray.findIndex((item => item.UUID == uuid))
  CardsArray[cardAtIndex].Cards[CardsArray[cardAtIndex].Cards.findIndex((item => item.id == id))].status = 'IN_PROGRESS'
  // sendRequestToRetry(uuid, id);
}


function getArrayOfSections(objectJSON){
  let newUUIDSection = { "UUID" : objectJSON.uuid, "Cards" : [], "Stage" : STAGES[0]}
  objectJSON.cards.forEach(card => {
    newUUIDSection.Cards.push(new Card({ "UUID":objectJSON.uuid, "Stage" : newUUIDSection.Stage, "id": card.uuid, "OS": card.os, "Status" : card.status, "Browser": card.browser, "LINKS":[{"ScreenPreview": card.links.screenPreview, "ScreenFullLink": card.links.screenFull, "DiffPreview": card.links.diffPreview, "DiffFullLink": card.links.diffFull}]} ));
  });
  CardsArray.push(newUUIDSection);
}

function display(){
  // Create UUIDSections
  let rootNode = document.getElementById("cards--section");
  rootNode.innerHTML = '';
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

// TODO
async function sendRequestToRetry(jobUUID, taskUUID){
  return;
  try {
    // PUT /rest/{task_id}/{job_id}

    const response = await fetch(``, {
      method: 'PUT',
      headers: {
        accept: 'application/json',
      }
    });

    
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    const result = await response.json();
    getArrayOfSections(result);
    display();
    return result;

  } catch (err) {
    console.log(err);
  }
}

async function getCards() {
  try {
    let local =  '../scripts/test.json';
    let taskUUID = window.location.href.substring(window.location.href.lastIndexOf('/')+1, window.location.href.indexOf('?'));
    let testOnline = '/rest/v2/' + taskUUID + '/data';
    const response = await fetch(`${testOnline}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        accept: 'application/json',
      }
    });

    
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Log trace: 290');
    console.log(result);
    getArrayOfSections(result);
    display();
    return result;

  } catch (err) {
    console.log(err);
  }
}

window.onload = () => {
  getCards();
}