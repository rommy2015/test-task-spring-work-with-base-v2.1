/*обработка ajax-запроса*/

/*запрос на аутентификаци, проверка имени пользователя*/
function authUsername(uri, credentials) {

    $.ajax({
        type: "get",
        url: uri,
        dataType: 'json',
        success: function () {

            authFieldUserDelegation(credentials);

        },
        error: function (error) {

            if( langLocaleBrowser === 'ru') {
                var message = "Нет такого логина.";

                messageErrAuth(message , selectorLoginErrMessage);
            } else{
                outputError(error, selectorLoginErrMessage);
            }

            counterLogin++;
        }
    });
}

function outputError(error,selectorLoginErrMessage) {

    var responseIntoJson = getResponseTxt(error);

    var message = "";

    $.each(responseIntoJson, function (key, value) {

        if(key === "errorMessage"){
            message = value;
        }
    });

    messageErrAuth(message , selectorLoginErrMessage);

}


function messageErrAuth(message, selector){

    $(selector).animate({opacity: "1"}, durationUp);
    $(selector).html("");
    $(selector).html(message).css("color", "red");
    $(selector).animate({opacity: "0.3"}, durationDown);
}


/*запрос на аутентификаци, проверка пароля пользователя
* searchAuthenticationDetails - разбор деталей аутентификации*/
function authPassword(uri, credentialsJson) {

    /*преобразует значение JavaScript в строку JSON*/
    var jsonObj = JSON.stringify(credentialsJson);

    $.ajax({
        type: "POST",
        url: uri,
        data: jsonObj,
           headers: {
            'Content-Type': 'application/json'
        },
        success: function (data) {

            var tokenValue;

            $.each(data, function (key, value) {
                if(key === "value"){
                    tokenValue = value;
                }
            });

            redirectUrlServer(uriSuccess, tokenValue);
       },
        error: function (error) {

            if( langLocaleBrowser === 'ru') {
                var message = "Введенный пароль не корректен.";

                messageErrAuth(message , selectorPasswordErrMessage);
            } else{
                outputError(error, selectorPasswordErrMessage);
            }
             counterPassword++;
        }
    });
}


function redirectUrlServer(uri, tokenValue) {


    window.location.href = uri + "?token=" + tokenValue;

}