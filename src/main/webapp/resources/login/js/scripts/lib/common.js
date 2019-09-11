/*For common functions*/

/*уменьшение и увеличение времени анимации текста*/
var durationUp = 1;
var durationDown = 3000;


/* Цетрирование указанного блока.*/
function setDivToCenter(selector) {
    $(selector).each(
        function () {
            $(this).css("position", "absolute");
            $(this).css("left", "35%");
            $(this).css("margin-left", -$(this).outerWidth() / 2);
            $(this).css("top", "35%");
            $(this).css("margin-top", -$(this).outerHeight() / 2);
            return this;
        }
    );
}

/*Преобразование JSON в объект с текстовыми данными*/
function getResponseTxt(response) {

    var responseText = response.responseText;
    var parse = JSON.parse(responseText);

    return parse;
}


/*вывод диагностического сообщения*/
function outputMessage (selector, message, color) {

    $(selector).html("");
    $(selector).html(message).css("color", color);
}


/*очистка элемента от предыдущего сообщения в указанном селекторе*/
function clearSelectorMessage(selector) {
    $(selector).html("");
}


/*Установка прозрачности на указанный текст*/
function setTransparency(selector){

    var transparency = 0.5;
    var duration = 0;
    $(selector).fadeTo(duration, transparency);
}


