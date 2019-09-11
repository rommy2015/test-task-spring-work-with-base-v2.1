/*These are  functions of processing data entered
into authentication form*/

var selectorLogin = ".login";
var selectorPassword = ".password";
var selectorDivEnter = ".divEnter";
var selectorLoginUser = ".loginUser";
var selectorLoginInput = ".loginInput";
var selectorLoginEntered = ".loginEntered";
var selectorLoginErrMessage = ".loginErrMessage";
var selectorPasswordUser = ".passwordUser";
var selectorPasswordInput = ".passwordInput";
var selectorPasswordErrMessage = ".passwordErrMessage";
var selectorChoiceOption = ".choiceOption";
var selectorRepairAccountLabel = ".repairAccountLabel";
var repairAccountLabel = "Восстановление учетной записи";
var repairAccount = "Восстановление учетной записи";
var repairPassword = "Восстановление пароля";
var selectorCreateAccount = ".createAccount";
var createAccount = "Регистрация нового пользователя";
var selectorChoiceWidgetRadioBtn =".choiceOption input";
var selectorRadioAuth = ".radioAuth";
var storageYes = ".storageYes";

var uriSuccess = "/index";
var urlAuthLogin = "auth/login";
var uriPassword = "auth/password";
var uriAccountRepairPage = "/reg";
var uriRegistrationUserPage = "/reg";

/*The variable is for storage a locale the browser*/
var langLocaleBrowser = '';

/*This function get information about a locale the browser*/
getLang();


/*This is counter of mistakes the failed user name entry */
var counterLogin = 0;

/*This is counter for the field password*/
var counterPassword = 0;


/*This functions will performed before than a web page will load*/
$(function () {
    $(selectorLogin).hide();
    $(selectorPassword).hide();
    $(selectorDivEnter).show();
    setDivToCenter(selectorDivEnter);
    setTransparency(selectorLoginUser);

    if( langLocaleBrowser === 'ru') {
        $(selectorLoginUser).html("Учетная запись");
        $(selectorLoginInput).attr({
                "placeholder":"Введите логин"
            });
        $(selectorPasswordInput).attr({
            "placeholder":"Введите пароль"
        });
    } else {
        $(selectorLoginUser).html("Login");
        $(selectorLoginInput).attr(
            {
                "placeholder":"Enter the username"
            });
        $(selectorPasswordInput).attr({
            "placeholder":"Enter the password"
        });
    }

    setTransparency(selectorPasswordUser);

    $(selectorLogin).show();

    $(selectorLoginInput).trigger( "focus" );

    /*After load a page, listens the username field*/
    handlerEvents(selectorLoginInput, 'keypress focusout', authFieldUser);

    $(selectorChoiceWidgetRadioBtn).checkboxradio();
    handlerEventsOnRadioBtn();
    outputMessage(storageYes, " " , "blue");
    getLang();
});


function getLang() {
    var lang = window.navigator.languages ? window.navigator.languages [0] : null;
    lang = lang || window.navigator.language || window.navigator.browserLanguage || window.navigator.userLanguage;
    if (lang.indexOf('-') !== -1) {
        lang = lang.split('-')[0];
    }

    if (lang.indexOf('_') !== -1) {
        lang = lang.split('_')[0];
    }
    langLocaleBrowser = lang;

    console.log('current locale : ' + langLocaleBrowser);
}


/* this function is processing events :
 classEvent - it is name of selector
 e - a object for any events, that was fixed
 nameEvent - it is name one event or few events,
    that separated through whitespace
  e.key - get name of a key
 e.type - get name of event
 focusout - it is event loss
 functionTarget();  - through this variable will pass name of function,
 to be performed, after was processed event pointed.after event processing

*/
function handlerEvents(classEvent, nameEvent, functionTarget) {

    $(classEvent).on(nameEvent, function (e) {

        if (e.key === 'Enter' || e.type === 'focusout') {
            functionTarget();
        }
    });
}

function delHandlerEvents(selector, nameEvent) {

    $(selector).off(nameEvent);

}

/* this data is from authentication form  */
function fillCredentials(login, password) {

     return {
        "login": login,
        "password": password
    };
}


/*The function displays radio buttons.*/
function showRadioBtn(selectorInput, valueSelector ) {

    clearSelectorMessage(selectorLoginErrMessage);
    clearSelectorMessage(selectorPasswordErrMessage);
    $(selectorInput).hide();
    $(selectorChoiceOption).css("margin-top", "-10%");
    $(selectorChoiceOption).css("margin-left", "-10%");
    $(selectorChoiceOption).show();

    outputMessage(selectorRepairAccountLabel, valueSelector);
    outputMessage(selectorCreateAccount,createAccount);
    $(selectorChoiceWidgetRadioBtn).trigger( "focus" );

}

/*it is processing data that was entered into username field */
function authFieldUser(){

    clearSelectorMessage(selectorLoginErrMessage);

    var login = $(selectorLoginInput).val();
    var password = "";

    var uriAuthUsername = urlAuthLogin +"/" + login;

    var credentialsJson = fillCredentials(login, password);

    if(counterLogin >= 3){

        showRadioBtn(selectorLogin, repairAccount);
    } else {
        var errorMessage = choiceMessage();

        sendRequestLogin(login, uriAuthUsername, errorMessage, credentialsJson);
        counterLogin++;
    }
}

function choiceMessage() {
    var errorMessage = "";

    if( langLocaleBrowser === 'ru') {
        errorMessage = "Вы не ввели значения";
    } else {
        errorMessage = "You have not entered a value";
    }

    return errorMessage;
}


function sendRequestLogin(login, uriAuthUsername, error , credentials) {

    if(login === undefined || login=== " " || login === ""){

        messageErrSimple(error, selectorLoginErrMessage);
    } else {
         authUsername(uriAuthUsername, credentials);
    }
}

function messageErrSimple(message, selector) {

    $(selector).animate({opacity: "1"}, durationUp);
    $(selector).html("");
    $(selector).html(message).css("color", "red");
    $(selector).animate({opacity: "0.3"}, durationDown);
}

/*this is processing events  on group of radio buttons*/
function handlerEventsOnRadioBtn() {
    $(selectorRadioAuth).on('click keypress', function(e) {
        var value = $(this).val();
        if (!$(this).hasClass('clicked')) {
            $(this).addClass('clicked');

        } else {
            $(this).removeClass('clicked');

            if (e.key === 'Enter' || e.type === 'click') {
                if (value === "repairAuth"){

                   window.location.href = uriAccountRepairPage;

                }else{
                    window.location.href = uriRegistrationUserPage;
                }
            }
        }
    });
}


/* The obtained data are processed, than hide the username field
and display a password field
Over the password field display earlier entered a login.*/
function authFieldUserDelegation(sourceCredentials){

    clearSelectorMessage(selectorLoginErrMessage);
    clearSelectorMessage(selectorPasswordErrMessage);

    $(selectorLogin).hide();

    delHandlerEvents(selectorLoginInput, 'keypress focusout');

    $(selectorPassword).show();
    $(selectorPasswordInput).trigger( "focus" );
     var username = sourceCredentials.login;

     setTransparency(selectorLoginEntered);
     $(selectorLoginEntered).html(username);

     handlerEventsPassword(selectorPasswordInput, 'keypress focusout', username);
}


/*This is processed a password field*/
function handlerEventsPassword(selector, nameEvent, username){

    $(selector).on(nameEvent, function (e) {

        if (e.key === 'Enter' || e.type === 'focusout') {
            authFieldPassword(username);
        }
    });
}

/* This is processed a password field*/
function authFieldPassword(username){

    var password = $(selectorPasswordInput).val();

    var uriAuthPassword = uriPassword ;


    var credentialsJson = fillCredentials(username, password);

    if(counterPassword >= 3){
        showRadioBtn(selectorPassword, repairPassword);
    } else {
        authPassword(uriAuthPassword, credentialsJson);
    }

}









