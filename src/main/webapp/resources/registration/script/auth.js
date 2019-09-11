/*для сбора данных полей аутентификации.*/

var selectorEmail = "#inputEmail";
var selectorFirstName = "#inputName";
var selectorLastName = "#inputFamily";
var selectorLogin = "#inputLogin";
var selectorPassword = "#inputPassword";
var selectorDate = "#inputDate";
var selectorTelephone = "#inputTelephone";
var selectorCreditCard = "#inputCreditcard";
var selectorRole = "#inputRole option:selected";
var selectorStatus = "#inputStatus option:selected";
var selectorSubmit = ".btn";
var selectorMessageForCommonError = ".messageForCommonError";
var uriSingUp = "api/signup";
var selectorContainer = ".container";
var selectorErrMessage = ".errMessage";
var selectorSuccess = ".success";
var selectorFormValidate = "#myForm";


$(document).ready(function () {
    setOptionForValidate();
    $(selectorSuccess).hide();
    pressSubmit();
    focusOnInput();
});


function setOptionForValidate() {

    jQuery.validator.setDefaults({
    debug: true,
    success: "valid"
    });

    
}

/*отслеживаем нажатие кнопки Submit*/
function pressSubmit() {

    $(selectorSubmit).on('click', function(){

        var form = $(selectorFormValidate);
        form.validate();
        var valid = form.valid();
        if(valid){
            var json =  parseValueFromInput();
            signUpAnUser(uriSingUp, json);
            console.log(json);

        } else {

            console.log("Исправьте ошибки!");
        }

    });

/* 5404 3600 8922 0783 */
}

/*очистка поля об ошибки, при фокусировке на любом поле*/
function focusOnInput() {

    $("input").on('focus', function () {
        $(selectorMessageForCommonError).empty();
    });
}

/*сбор значений из полей input*/
function parseValueFromInput() {

    var email = $(selectorEmail).val();
    var firstName = $(selectorFirstName).val();
    var lastName = $(selectorLastName).val();
    var login = $(selectorLogin).val();
    var password = $(selectorPassword).val();
    var date = $(selectorDate).val();
    var telephone = $(selectorTelephone).val();
    var creditNumber = $(selectorCreditCard).val();
    var role = $(selectorRole).html();
    var status = $(selectorStatus).html();


    return {
        "firstName": firstName,
        "lastName": lastName,
        "login": login,
        "password": password,
        "email": email,
        "creditNumber": creditNumber,
        "telephone": telephone,
        "dateReg": date,
        "authority": role,
        "statusUser": status
    }
}


function signUpAnUser(uri, credentialsJson){

    var jsonObj = JSON.stringify(credentialsJson);

    $.ajax({
        url: uri,
        type: "post",
        data: jsonObj,
        headers: {
            'Content-Type': 'application/json'
        },
        success: function (principal) {

            $(selectorContainer).hide();
            $(selectorSuccess).show();
        },
        error: function (error) {

           $(selectorContainer).hide();

            messageErr(error,selectorErrMessage);

        }
    });

}

/*выводим результат полученный от сервера, в случае ошибки*/
function messageErr(error, selector){

    /*уменьшение и увеличение времени анимации текста*/
    var durationUp = 1;
    var durationDown = 3000;

    var answer = parseResponse(error);

    var message = answer.message;

    $(selector).animate({opacity: "1"}, durationUp);
    $(selector).html("");
    $(selector).html(message).css("color", "red");
    //$(selector).animate({opacity: "0.3"}, durationDown);
}

/*Преобразование JSON в объект с текстовыми данными*/
function parseResponse(response) {

    return JSON.parse(response.responseText);
}