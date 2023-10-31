(function(){
    const widthArray = ['1920', '1440', '768', '600', '414']
    const rootNode = document.getElementById("settings-top")
    let dropDown = document.createElement('button')
    dropDown.classList.add("dropbtn")
    dropDown.id = "WidthDropDown_btn"
    let wrapper = document.createElement('div')
    wrapper.classList.add('button--wrap')
    let triangle = document.createElement('img')
    triangle.setAttribute('src', '../src/icons/triangle.svg')
    triangle.id = 'triangle-menu'

    let widthSpan = document.createElement('span')
    widthSpan.id = 'widthSpan'
    widthSpan.textContent = widthArray[0]
    let info = document.createElement('img')
    info.setAttribute('src', '../src/icons/info.svg')
    wrapper.appendChild(triangle)
    wrapper.appendChild(widthSpan)
    wrapper.appendChild(info)
    dropDown.appendChild(wrapper)
    let dropMenu = document.createElement("div")
    dropMenu.classList.add("dropdown-content")
    dropMenu.id = 'myDropdown';
    widthArray.forEach(width => {
        let widthOption = document.createElement('div');
        widthOption.innerText = width
        widthOption.addEventListener('click', () => {document.getElementById("widthSpan").textContent = width;})
        let separator = document.createElement('div');
        separator.classList.add('dash')
        dropMenu.appendChild(separator)
        dropMenu.appendChild(widthOption)
    });
    dropDown.appendChild(dropMenu)
    dropDown.addEventListener("click", () => {document.getElementById("myDropdown").classList.toggle("show"); document.getElementById('triangle-menu').classList.toggle("triangle-rotated");})
    rootNode.appendChild(dropDown)
}())