$(document).ready(function () {

    validateForm();

    /*Получение текущей локали браузера*/
    var lang = navigator.languages[0];

    createRulesForClass();
    //createCalendar();
    addRulesForFields();

    addCustomMethodsForValidate();
    addClassErr();
});

/*создание json для регистрации пользователя*/
function createJsonForSignUp() {

}


function addClassErr() {
    $(".myForm2").validate({
        highlight: function (element, errorClass, validClass) {
            $(element).addClass(errorClass).removeClass(validClass);
            $(element.form).find("label[for=" + element.id + "]")
              .addClass(errorClass);
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass(errorClass).addClass(validClass);
            $(element.form).find("label[for=" + element.id + "]")
              .removeClass(errorClass);
        }
    });

}



/*Создаем пользовательское правило, для валидации*/
function addCustomMethodsForValidate() {

    $(".centInput").validate({

        rules: {
            one: {
                required: true,
                digits: true,
                checkUpperRange: 20
            },
        }

    });

    var max = 100;

    /*пользовательское правило проверки*/
    $.validator.addMethod('checkUpperRange', function (val, el, args) {
        
        if (Number(val) * args <= max) {
            return true;
        } else {
            return false;
        }
    },
   jQuery.validator.format("Введеное значение, умноженное на {0}, - больше  " + max + ", пожайлуста введите другое значение!") );

}


function addRulesForFields() {
    $('.nameInput').rules('add', {
        required: true,
        maxlength: '10',
        minlength: '2',

        messages: {
            maxlenght: jQuery.validator.format("Можно ввести не больше {0} символов")
        }
    });

    $('.priceInput').rules('add', {
        required: true,
        digits: 'true',
        minlength: '2',

        messages: {
            digits: jQuery.validator.format("Можно вводить только цифры")
        }
    });

    /*Запускаем валидацию*/
    $('.myForm2').validate();
}


function createCalendar() {


    $(".dateForm").datepicker({
        showOtherMonths: true,
        selectOtherMonths: true,

        /*Включается скрытая кнопка, по нажатии на которую,
        * происходит переход на текущий месяц, если календарь показывал
        * месяц, отличный от текущего*/
        showButtonPanel: true,

        /*показ опций выбора года и месяца*/
        changeMonth: true,
        changeYear: true,
        defaultDate: null, /* при открытии страницы, будет установлена текущая дата*/
        maxDate: "0", /* указывает на то, что пользователь не может ввести дату больше, чем дата по умолчанию*/


    });

    /*локализация на русский язык (требуется подключить плагин)*/
    $(".dateForm").datepicker(

        $.datepicker.setDefaults($.datepicker.regional["ru"])
    );

    /*анимации при показе и сворачивании календаря*/
    $(".dateForm").datepicker("option", "showAnim", "clip");


}


/* Создание правил, для группы полей, объединенных одним классом*/
function createRulesForClass() {

    /*Создаем пользовательские сообщения*/
    $.validator.messages.required = jQuery.validator.format("Поле обязательно нужно заполнить.");
    $.validator.messages.max = jQuery.validator.format("Введите число меньшее или равное {0}");

    /* правила валидации для указанных классов или класса.*/
    $.validator.addClassRules({

        maxValidation: {
            required: true,
            max: 20, /*допустимое максимальное значение - 30*/

        }
    });

    /*Запускаем валидацию*/
    $('.myForm2').validate();
}


function validateForm() {

    /*пользовательский метод, на проверку ввода только букв (русских или английских)*/
    $.validator.addMethod("lettersonlyRusEng", function (value, element) {
        return this.optional(element) || /^[а-яА-ЯёЁa-zA-Z]+$/.test(value);
    },
     "Please don't insert numbers.");
    lang = navigator.languages[0];

    var MessageForLettersOnlyRusEng = '';

    /*Создание сообщения об ошибке для пользовательского метода,
    в зависимости от локали браузера*/
    if (lang == 'ru-RU') {
        MessageForLettersOnlyRusEng = "Пожалуйста, вводите только буквы.";
    } else {
        MessageForLettersOnlyRusEng = "Please, enter only letters.";
    }

    $('.myForm').validate({


        rules: {
            email: {
                required: true, /*поле должно быть заполнено*/
                /* проверять на соответсвие формату написания электронного адреса*/
                email: true,
                minlength: 7,


            },
            name: {
                required: true,
                minlength: 3, /*в поле с атрбутом name="name", нужно ввести миниму 5 символов */
                maxlength: 10, /* можно ввести не более 10 символов */
                lettersonlyRusEng: true, /*проверка на ввод только букв*/

            },

            lastname:{
                required: true,
                minlength: 3, /*в поле с атрбутом name="name", нужно ввести миниму 5 символов */
                maxlength: 10, /* можно ввести не более 10 символов */
                lettersonlyRusEng: true, /*проверка на ввод только букв*/
            },
            login:{
                required: true,
                minlength: 3, /*в поле с атрбутом name="name", нужно ввести миниму 5 символов */
                maxlength: 10, /* можно ввести не более 10 символов */

            },

            password: {
                required: true,
                minlength: 2,
                maxlength: 8

            },

            passwordRepeat: {
                required: true,
                minlength: 2,
                maxlength: 8,
                equalTo: ".classPassword"

            },
            date: {
                date: true,
                required: true,
            },
            telephone: {
                required: true,
                digits: true
            },
            /* валидация кредитной карты*/
            creditcardName: {
                required: true,
                creditcard: true
            },

        },


        focusCleanup: true,
        focusInvalid: false,

        /*вывод общих ошибок формы, в общий контейнер*/
        invalidHandler: function (event, validator) {
            $('.js-form-message').text("Исправьте пожайлуста все ошибки !")
        },

        /*очистка контейнера  для общих ошибок, в случае первого ввода символа в любое из полей ввода*/
        onkeyup: function (element) {
            $('.js-form-message').text("")
        },


        /*указание на отключение сообщений об ошибках для отдельного поля
        и использование общего контейенра для сообщения об ошибках*/
        //  errorPlacement: function (error, element) {
        //return false;
        //    }


        /*Настройка пользовательских сообщений об ошибках*/
        messages: {
            email: {
                // required: "Поле 'email' обязательно для заполнения",
                /* эта опция работает, если не подключен пакет локализации сообщений*/
                //email: "Необходим ввести данные, соответствующие формату адреса email !"
            },

            password: {

                //  required: "Поле 'password' обязательно для заполнения",
                //    minlength: jQuery.validator.format("Длина пароля должна быть больше {0} символов"),
                //    maxlength: jQuery.validator.format("Длина пароля должна быть не больше {0} символов")
            },

            /*поле для повторения ввода пароля*/
            passwordRepeat: {
                //   required: "Поле 'password' обязательно для заполнения",
                //   minlength: jQuery.validator.format("Длина пароля должна быть больше {0} символов"),
                //   maxlength: jQuery.validator.format("Длина пароля должна быть не больше {0} символов")
            },
            name: {
                lettersonlyRusEng: jQuery.validator.format(MessageForLettersOnlyRusEng)
                //   required: "Поле 'имя' обязательно для заполнения",
                //   minlength: jQuery.validator.format("Длина имени должна быть больше {0} символов"),
                //  maxlength: jQuery.validator.format("Длина имени должна быть не больше {0} символов")
            },

        },




    });


}

