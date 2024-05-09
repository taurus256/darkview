(function(){
    const widthArray = ['1900', '1280', '1024', '768']
    const rootNode = document.getElementById("settings-top")
    let dropDown = document.createElement('button')
    dropDown.classList.add("dropbtn")
    dropDown.type = "button"
    dropDown.id = "WidthDropDown_btn"
    let wrapper = document.createElement('div')
    wrapper.classList.add('button--wrap')
    let triangle = document.createElement('img')
    triangle.setAttribute('src', '../src/icons/triangle.svg')
    triangle.id = 'triangle-menu'

    let widthSpan = document.createElement('span')
    widthSpan.id = 'widthSpan'
    widthSpan.textContent = widthArray[0]

    let tooltipContainer = document.createElement('div')
    tooltipContainer.classList.add('container-info')

    let info = document.createElement('img')
    info.setAttribute('src', '../src/icons/info.svg')
    info.classList.add('img-info')
    // <div class="popup-info-msg" id="popup-info-msg-2"> Ширину выбрать нельзя - она фиксирована</div>

    let tooltip = document.createElement('div')
    tooltip.classList.add('popup-info-msg')
    tooltip.textContent = 'Выберите ширину'
    tooltip.id = 'popup-info-msg-1'

    tooltipContainer.appendChild(info)
    tooltipContainer.appendChild(tooltip)
    
    wrapper.appendChild(triangle)
    wrapper.appendChild(widthSpan)
    wrapper.appendChild(tooltipContainer)
    
    dropDown.appendChild(wrapper)
    let dropMenu = document.createElement("div")
    dropMenu.classList.add("dropdown-content")
    dropMenu.id = 'myDropdown';
    document.getElementById("widthInput").value = '_1900';
    widthArray.forEach(width => {
        let widthOption = document.createElement('div');
        widthOption.innerText = width
        widthOption.addEventListener('click', () => {document.getElementById("widthInput").value = '_' + width;
        document.getElementById("widthSpan").textContent = width;})
        let separator = document.createElement('div');
        separator.classList.add('dash')
        dropMenu.appendChild(separator)
        dropMenu.appendChild(widthOption)
    });
    dropDown.appendChild(dropMenu)
    dropDown.addEventListener("click", () => {document.getElementById("myDropdown").classList.toggle("show"); document.getElementById('triangle-menu').classList.toggle("triangle-rotated");})
    rootNode.appendChild(dropDown)
}())