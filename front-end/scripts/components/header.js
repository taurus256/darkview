(function(){
    let body = document.body;
    let header = document.createElement('header');
    header.innerHTML = '' + 
    '<div class="wrapper flex space-between">' + 
    '    <div class="nav--left-side"><img src="../src/img/DarkViewLogo.png" alt="DarkViewLogo"></div>' + 
    '    <div class="nav--right-side">' + 
    '        <ul class="sign--options flex">' + 
    '            <li><a href="/login"><p>ВОЙТИ</p></a></li>' +
    '            <li><a href="/register"><p>РЕГИСТРАЦИЯ</p></a></li>' +
    '        </ul>' + 
    '    </div>' + 
    '</div>' + 
    '<div class="dash"></div>' + 
    '';
    body.appendChild(header)
}())