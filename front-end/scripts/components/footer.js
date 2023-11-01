(function(){
    let body = document.body;
    let footer = document.createElement('footer');
    footer.innerHTML = '' + 
    '<section class="footer--section">' + 
    '   <h6 class="blue">(C) Остапенко Е.В., 2023<br>ОГРНИП 123212321</h6>' + 
    '   <ul class="footer--links--wrap">' + 
    '       <li><a href="#">Договор-оферта</a></li>' + 
    '       <li><a href="#">Политика обработки<br>персональных<br>данных</a></li>' + 
    '       <li class="footer-telegram-wrap column center"><a href="#">О проекте</a><a href="#"><img src="../src/icons/telegram.svg" alt="telegram"></a></li>' + 
    '   </ul>' + 
    '</section>' + 
    '';
    body.appendChild(footer)
}())