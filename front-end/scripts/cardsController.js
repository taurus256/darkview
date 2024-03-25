let STAGES = { DEFAULT : 0, READY_TO_CREATE_DIFF : 1, READY_TO_SHOW_DIFF : 1 };

let HTML_CLASS = {
  CARD_CONTAINER : "render-card",
  CARD_TOP : "render-card--top",
  CARD_MIDDLE : "render-card--state-display",
  CARD_STATE_DISPLAY : "render-card--state-display--left"
};

let HTML_CONSTANTS {
  SCN_PREVIEW_URL_DEFAULT : "../src/img/cards/placeholder.png",
  SCN_PREVIEW_URL_PRE : '/job'
};


// Генератор случайных строк (для уникальных коротких id в html)
function generator_rnd_uuid () {
  let res_len = 4;
  let res = '';
  let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let len = chars.length;
  for ( let i=0; i < res_len; i++) {
    let pos = Math.floor ( Math.random() * len );
    res += chars.charAt(pos);
  }
  return res;
}


class Task {
  constructor ( task_uuid ) {
    this.uuid = task_uuid;
    this.jobsMap = new Map();
    this.toRedrawArray = [];
    this.stage = STAGES.DEFAULT;
    this.uuidHTML = generator_rnd_uuid();
  }
}

class Job {

  constructor ( json_data ) {

    if( json_data === undefined ) { return; }

    this.id = json_data.id;
    this.os = json_data.OS.toUpperCase();
    this.status = json_data.Status;
    this.browser = json_data.Browser.toUpperCase();

    this.idHTML = generator_rnd_uuid();
    this.osIconPathHTML = `../src/icons/systems/${this.os}.png`;

    // Ссылка на превью скриншота (url)
    this.scnPreviewURL = json_data.LINKS[0].ScreenPreview;
    // Ссылка на полный скриншот (url)
    this.scnURL = json_data.LINKS[0].ScreenFullLink;
    // Ссылка на превью карты различий (url)
    this.diffPreviewURL = json_data.LINKS[0].DiffPreview;
    // Ссылка на полную карту различий (url)
    this.diffURL = json_data.LINKS[0].DiffFullLink;

    // статус показа превью карты различий в данный помент (true / false)
    this.diffIsShowing = false;
  }

  // отрисовка карточки, которой еще не было
  render_card_create_html ( cardHTML ) {

    cardHTML = document.createElement("div");
    cardHTML.className = HTML_CLASS.CARD_CONTAINER;
    cardHTML.setAttribute("id", this.idHTML );

    // Верхняя часть карточки

    let cardTopHTML = document.createElement("div");
    cardTopHTML.className = HTML_CLASS_CARD_TOP;

    let osIconHTML = document.createElement("img");
    osIconHTML.setAttribute ("src", this.osIconPathHTML );

    let browserNameHTML = document.createElement ("h5");
    browserNameHTML.textContent = this.browser;

    cardTopHTML.appendChild(osIconHTML);
    cardTopHTML.appendChild(browserNameHTML);
    cardHTML.appendChild(cardTopHTML);

    // Средняя часть карточки

    let cardMiddleHTML = document.createElement("div");
    cardMiddleHTML.classList.add( HTML_CLASS.CARD_MIDDLE );
   
    // Средняя часть карточки - левая сторона (превью скриншота, статус обработки)

    let leftSideHTML = document.createElement("div");
    leftSideHTML.classList.add( HTML_CLASS.CARD_STATE_DISPLAY );

    let scnPreviewHTML = document.createElement("img");
    let scnPreviewPath = HTML_CONSTANTS.SCN_PREVIEW_URL_DEFAULT;
    if ( this.scnPreviewURL !== undefined && this.scnPreviewURL != '' ) {
      scnPreviewPath = '/job' + this.scnPreviewURL;
    }
    previewImg.setAttribute ("src", scnPreviewPath );

    previewImg.addEventListener ( 'click', () => {
      window.open ( '/job' + this.scnURL, '_blank').focus();
    });

   leftSide.appendChild(previewImg);
   
   // Левая часть: Отображение статуса
   let htmlStatus = null;
   let htmlMessage = null;
   let htmlMessageIcon = null;
   let htmlRequest = null;
   let curCardId = this.id;

   function createContextByStatus ( className, text, messageIconPath, requestText ) {
     htmlStatus = document.createElement("div");
     htmlStatus.classList.add(className);
     htmlMessage = document.createElement("p");
     htmlMessage.textContent = text;
     htmlStatus.appendChild ( htmlMessage );
     htmlMessageIcon = document.createElement("img");
     htmlMessageIcon.setAttribute ("src", messageIconPath);
     htmlStatus.appendChild(htmlMessageIcon);
     htmlRequest = document.createElement("a");
     htmlRequest.textContent = requestText;
     htmlRequest.classList.add('none');
     htmlRequest.addEventListener('click', () => { retry ( curCardId ); display()});
     htmlStatus.appendChild( htmlRequest );
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
   leftSide.appendChild ( htmlStatus );
   // Левая часть: Конец отображения статуса
   cardMiddle.appendChild(leftSide);
   // Левая часть: конец

   // Правая часть
   let rightSide = document.createElement("div");
   rightSide.classList.add("render-card--state-display--right"); 
   
   if (this.status.toUpperCase() === 'PREVIEW_IS_READY') {
     console.log("render id=" + this.id + ", PREVIEW_IS_READY");
     let dash = document.createElement("div");
     dash.classList.add("vertical-dash");
     rightSide.appendChild(dash);

     let diffPicture = document.createElement("img");
     diffPicture.setAttribute("src", '/job' + this.DiffPreview);
     diffPicture.addEventListener('click', () => {window.open(`${previewUrl}${this.DiffFullLink}`, '_blank').focus();})
     rightSide.appendChild(diffPicture);

     cardMiddle.appendChild(rightSide);
   }

   // НИЖНЯЯ ЧАСТЬ
   let cardBottom = null;
   if ( is_new_flag === true ) {
       cardBottom = document.createElement("div"); 
       cardBottom.classList.add("render-card--bottom");
       cardBottom.classList.add("flex");
       cardBottom.classList.add("center");
   } else {
     cardBottom = _card.getElementsByClassName("render-card--bottom").item(0);
     cardBottom.innerHTML = '';
   }

   // Если сравнение скриншотов ещё не происходило
   if(this.stage == STAGES[1]) {
     console.log("STAGE 1 for id = " + this.id )
     // Галочка для выбора данной карточки за образец 
     let radioAsExample = document.createElement("input"); 
     radioAsExample.setAttribute("type", "radio"); 
     radioAsExample.setAttribute("id", "cardRadio" + this.id );
     radioAsExample.setAttribute("name", "cardRadio" );
     radioAsExample.onchange = () => {
         if (radioAsExample.checked) {
           window.popup.showButton (
             'Нажмите кнопку "Старт" для запуска сравнения',
             'Старт',
             () => sendRequestToDiff( this.id)
             );
         }
     };

     let labelForRadio = document.createElement("label");
     labelForRadio.setAttribute("for","cardRadio" + this.id );

     let innerlabelForRadio = document.createElement("p");
     innerlabelForRadio.textContent = "Образец для сравнения";

     labelForRadio.appendChild(innerlabelForRadio);
     
     cardBottom.appendChild(radioAsExample);
     cardBottom.appendChild(labelForRadio);
   }

   if (this.DiffPreview != '' && this.DiffPreview != undefined) {
     // Checkbox для демонстрации сравнения
     let showDiffCheckbox = document.createElement("input"); 
     showDiffCheckbox.setAttribute("type", "checkbox" );
     showDiffCheckbox.setAttribute("id", "diffCheckBox" + this.id );
     showDiffCheckbox.setAttribute("name", "diffCheckBox" );
     showDiffCheckbox.checked = this.diffIsShowing;
     showDiffCheckbox.onchange = () => this.diffPreviewToggle();

     cardBottom.appendChild(showDiffCheckbox);

     let labelForCheckbox = document.createElement("label");
     labelForCheckbox.setAttribute("for","diffCheckBox" + this.id);

     let innerLabel = document.createElement("p");
     innerLabel.textContent = this.diffIsShowing ?  "Свернуть сравнение <" : "Развернуть сравнение >"
     this.diffIsShowing ? _card.className = 'render-card--big' : 'render-card';
     this.diffIsShowing ? rightSide.classList.remove('hidden') : rightSide.classList.add('hidden')

     labelForCheckbox.appendChild(innerLabel)
     cardBottom.appendChild(labelForCheckbox);
   }
   
   if ( is_new_flag === true ) {
     _card.appendChild(cardMiddle);
     _card.appendChild(cardBottom);
     rootNode.appendChild(_card);
   }
 }
  }

  // перерисовка карточки, которая уже была
  render_card_update_html ( cardHTML ) {

  }

  render_card_html ( rootNode ) {

    if ( this.id === undefined ) { return null; }

    let cardHTML = document.getElementById ( this.id);
    if ( cardHTML === null ) {
      this.render_card_create_html ( cardHTML );
    } else {
      this.render_card_update_html ( cardHTML );
    }
/*
    if ( _card === null ) {
       _card = document.createElement("div");
       _card.className = "render-card";
       _card.setAttribute("id", this.id );
       is_new_flag = true;
    }

    //let _card = document.createElement("div"); _card.className = "render-card";

    // Верхняя часть карточки
    if ( is_new_flag ) {
        let cardTop = document.createElement("div");
        cardTop.className = "render-card--top";
        let osIcon = document.createElement("img");
        osIcon.setAttribute("src", `../src/icons/systems/${this.OS.toUpperCase()}.png`);
        let browserName = document.createElement("h5");
        browserName.textContent = this.Browser.toUpperCase();
        cardTop.appendChild(osIcon);
        cardTop.appendChild(browserName);
        _card.appendChild(cardTop);
    }

    // Средняя часть карточки
    let cardMiddle = null;
    if (is_new_flag === false ) {
      cardMiddle = _card.getElementsByClassName("render-card--state-display").item(0);
      cardMiddle.innerHTML = '';
    } else {
      cardMiddle = document.createElement("div");
      cardMiddle.classList.add("render-card--state-display");
    }

    // Левая часть
    let leftSide = document.createElement("div");
    leftSide.classList.add("render-card--state-display--left");
    let previewImg = document.createElement("img"); 
    previewImg.setAttribute("src", this.ScreenPreview===undefined || this.ScreenPreview == '' ? "../src/img/cards/placeholder.png" : '/job' + this.ScreenPreview);
    let previewUrl = '/job';
    previewImg.addEventListener('click', () => {window.open(`${previewUrl}${this.ScreenFullLink}`, '_blank').focus();})
    leftSide.appendChild(previewImg);
    
    // Левая часть: Отображение статуса
    let htmlStatus = null;
    let htmlMessage = null;
    let htmlMessageIcon = null;
    let htmlRequest = null;
    let curCardId = this.id;

    function createContextByStatus ( className, text, messageIconPath, requestText ) {
      htmlStatus = document.createElement("div");
      htmlStatus.classList.add(className);
      htmlMessage = document.createElement("p");
      htmlMessage.textContent = text;
      htmlStatus.appendChild ( htmlMessage );
      htmlMessageIcon = document.createElement("img");
      htmlMessageIcon.setAttribute ("src", messageIconPath);
      htmlStatus.appendChild(htmlMessageIcon);
      htmlRequest = document.createElement("a");
      htmlRequest.textContent = requestText;
      htmlRequest.classList.add('none');
      htmlRequest.addEventListener('click', () => { retry ( curCardId ); display()});
      htmlStatus.appendChild( htmlRequest );
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
    leftSide.appendChild ( htmlStatus );
    // Левая часть: Конец отображения статуса
    cardMiddle.appendChild(leftSide);
    // Левая часть: конец

    // Правая часть
    let rightSide = document.createElement("div");
    rightSide.classList.add("render-card--state-display--right"); 
    
    if (this.status.toUpperCase() === 'PREVIEW_IS_READY') {
      console.log("render id=" + this.id + ", PREVIEW_IS_READY");
      let dash = document.createElement("div");
      dash.classList.add("vertical-dash");
      rightSide.appendChild(dash);

      let diffPicture = document.createElement("img");
      diffPicture.setAttribute("src", '/job' + this.DiffPreview);
      diffPicture.addEventListener('click', () => {window.open(`${previewUrl}${this.DiffFullLink}`, '_blank').focus();})
      rightSide.appendChild(diffPicture);

      cardMiddle.appendChild(rightSide);
    }

    // НИЖНЯЯ ЧАСТЬ
    let cardBottom = null;
    if ( is_new_flag === true ) {
        cardBottom = document.createElement("div"); 
        cardBottom.classList.add("render-card--bottom");
        cardBottom.classList.add("flex");
        cardBottom.classList.add("center");
    } else {
      cardBottom = _card.getElementsByClassName("render-card--bottom").item(0);
      cardBottom.innerHTML = '';
    }

    // Если сравнение скриншотов ещё не происходило
    if(this.stage == STAGES[1]) {
      console.log("STAGE 1 for id = " + this.id )
      // Галочка для выбора данной карточки за образец 
      let radioAsExample = document.createElement("input"); 
      radioAsExample.setAttribute("type", "radio"); 
      radioAsExample.setAttribute("id", "cardRadio" + this.id );
      radioAsExample.setAttribute("name", "cardRadio" );
      radioAsExample.onchange = () => {
          if (radioAsExample.checked) {
            window.popup.showButton (
              'Нажмите кнопку "Старт" для запуска сравнения',
              'Старт',
              () => sendRequestToDiff( this.id)
              );
          }
      };

      let labelForRadio = document.createElement("label");
      labelForRadio.setAttribute("for","cardRadio" + this.id );

      let innerlabelForRadio = document.createElement("p");
      innerlabelForRadio.textContent = "Образец для сравнения";

      labelForRadio.appendChild(innerlabelForRadio);
      
      cardBottom.appendChild(radioAsExample);
      cardBottom.appendChild(labelForRadio);
    }

    if (this.DiffPreview != '' && this.DiffPreview != undefined) {
      // Checkbox для демонстрации сравнения
      let showDiffCheckbox = document.createElement("input"); 
      showDiffCheckbox.setAttribute("type", "checkbox" );
      showDiffCheckbox.setAttribute("id", "diffCheckBox" + this.id );
      showDiffCheckbox.setAttribute("name", "diffCheckBox" );
      showDiffCheckbox.checked = this.diffIsShowing;
      showDiffCheckbox.onchange = () => this.diffPreviewToggle();

      cardBottom.appendChild(showDiffCheckbox);

      let labelForCheckbox = document.createElement("label");
      labelForCheckbox.setAttribute("for","diffCheckBox" + this.id);

      let innerLabel = document.createElement("p");
      innerLabel.textContent = this.diffIsShowing ?  "Свернуть сравнение <" : "Развернуть сравнение >"
      this.diffIsShowing ? _card.className = 'render-card--big' : 'render-card';
      this.diffIsShowing ? rightSide.classList.remove('hidden') : rightSide.classList.add('hidden')

      labelForCheckbox.appendChild(innerLabel)
      cardBottom.appendChild(labelForCheckbox);
    }
    
    if ( is_new_flag === true ) {
      _card.appendChild(cardMiddle);
      _card.appendChild(cardBottom);
      rootNode.appendChild(_card);
    }
  }
  */
}

function CheckForStage () {
  
  let curTaskStage = STAGES[0]; // DEFAULT

  let readyToCreateDiff_flag = true;
  let ReadyToShowDiffCards_num = 0;

  CardsMap.forEach ( ( curCard, curCardId ) => {
    if ( curCard.readyToCreateDiff == false ) {
      readyToCreateDiff_flag = false;
    }
    if ( curCard.readyToShowDiff == true ) {
      ReadyToShowDiffCards_num = ReadyToShowDiffCards_num + 1;
    }
  });

  // Если у всех карточек установлено ReadyToCreateDiff = true,
  // то предлагаем их сравнить (popup)
  if ( readyToCreateDiff_flag == true ) {
    curTaskStage = STAGES[1];//ReadyToCreateDiff
    this.popup.show('Выберите базовое изображение для сравнения, если хотите запустить определение различий');
    window.clearInterval(window.cardsUpdateInterval);
  }

  // Если у всех, кроме 1, карточек есть readyToShowDiff = true
  // то показываем различия и перестаем предлагать сравнить
  if ( ReadyToShowDiffCards_num == CardsMap.size - 1 ) {
    curTaskStage = STAGES[2]; //ReadyToShowDiff
    window.popup.hide();
    window.clearInterval(window.cardsUpdateInterval);
  }

  console.log( ReadyToShowDiffCards_num );

  let stage_was_changed = false;
  if ( TaskStage !== curTaskStage ) stage_was_changed = true;
  TaskStage = curTaskStage;

  if ( stage_was_changed ) CardsToRedraw = [];

  CardsMap.forEach ( (curCard, curCardId) => {
    curCard.stage = TaskStage;
    if ( stage_was_changed ) {
      CardsToRedraw.push ( curCard );
      console.log("checkForStage: add to Redraw - update, id=" + curCard.id );
    }
  });
  console.log(TaskStage);
}

function updateInArray ( id, updatedItem) {
  // Возможно найдется баг при обновлении карточки
  let elementId = CardsMap.get(id);
  if ( elementId === undefined ) {
    console.log ( "updateInArray: undefined " );
    return;
  }
  console.log(elementId);
  CardsMap.set(id, updatedItem);
}

function retry ( id ) {
  let curCard = CardsMap.get(id);
  curCard.status = 'IN_PROGRESS'
  // sendRequestToRetry(uuid, id);
}


function getArrayOfSections(objectJSON){
  CardsToRedraw = [];
  objectJSON.cards.forEach(
    card => {
    let curCard = new Card({ /*"UUID":objectJSON.uuid,*/
     "Stage" : STAGES[0],
      "id": card.uuid,
      "OS": card.os,
      "Status" : card.status,
      "Browser": card.browser,
      "LINKS":[{"ScreenPreview": card.links.screenPreview,
                "ScreenFullLink": card.links.screenFull,
                "DiffPreview": card.links.diffPreview,
                "DiffFullLink": card.links.diffFull}]
    } );
    let oldCard = CardsMap.get(curCard.id);
    if (oldCard !== undefined ) {
      if ( oldCard.status === curCard.status ) {
        // не перерисовывать эту карточку
      }
      else {
        CardsToRedraw.push ( curCard );
        CardsMap.set ( curCard.id, curCard );
        console.log("add to Redraw - update, id=" + curCard.id);
      }
    } else {
      CardsToRedraw.push ( curCard );
      CardsMap.set ( curCard.id, curCard );
      console.log ("add to Redraw - create, id=" + curCard.id);
    }
    //newUUIDSection.Cards.push(new Card({ "UUID":objectJSON.uuid, "Stage" : newUUIDSection.Stage, "id": card.uuid, "OS": card.os, "Status" : card.status, "Browser": card.browser, "LINKS":[{"ScreenPreview": card.links.screenPreview, "ScreenFullLink": card.links.screenFull, "DiffPreview": card.links.diffPreview, "DiffFullLink": card.links.diffFull}]} ));
  }); //forEach end
  TaskUUID = objectJSON.uuid;
  //CardsArray.push(newUUIDSection);
}

function display() {
  
  // Ищем контейнер для карточек
  //let rootNode = document.getElementById("cards--section");
  let rootNode = document.getElementById("cards--section");
  let newUUIDSection = document.getElementById ( TaskUUID );
  // Опустошаем содержимое секции для карточек
  // rootNode.innerHTML = '';



  CheckForStage ();

  // Создаём пустой контейнер для вывода карточек
  if ( newUUIDSection === null ) {
    newUUIDSection = document.createElement("div");
    newUUIDSection.classList.add("render-card--container");
    newUUIDSection.classList.add("flex");
    newUUIDSection.setAttribute("id", TaskUUID);
    rootNode.appendChild(newUUIDSection);
  }
  // Вывод всех карточек в контейнер
  CardsToRedraw.forEach ( ( curCard )  => {
    console.log("render id=" + curCard.id );
    curCard.render (newUUIDSection);
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

async function sendRequestToDiff ( jobUUID ) {
  console.log('Запущено вычисление разницы для задачи ' + TaskUUID + ' задания ' + jobUUID)
  try {
    // PUT /rest/{task_id}/{job_id}

    const response = await fetch('/task/' + TaskUUID + '/diff/' + jobUUID, {
      method: 'POST',
      headers: {
        accept: 'application/json',
      }
    });

    if ( !response.ok ) {
      throw new Error(`Error! status: ${response.status}`);
    }

    const result = await response.json();
    window.popup.show ('Идет вычисление различий...');
    window.cardsUpdateInterval = setInterval(() => getCards(), 5000);
    return result;

  } catch (err) {
    console.log(err);
  }
}

async function getCards() {
  try {
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
  window.cardsUpdateInterval = setInterval(() => getCards(), 5000);
  window.popup = new PopupMessage();
}