/*
Плагин описывает динамическое создание и появление модального окна, с
    полем ввода, после того, как было поймано событие 'click' и 'dblclick',
    на ячейке редактируемой таблицы. После ввода в поле ввода значения,
    данное значение меняется предыдущее значение в редактируемой ячейке.

Требуемые библиотеки:
   jQuery;
   inputMask от Robin robinHerbots (jquery.inputmask.bundle.js);
   jQuery Masked Input Plugin (jquery.maskedinput.js);
   jquery-ui (jquery-ui.js);
   Russian (UTF-8) initialisation for the jQuery UI date picker plugin,(
   дополнение к datepicker, который находится в библиотеке (jquery-ui.js),
   дополнительно нужен jquery-ui.css и каталог с images (для украшений элементов) );
   jQuery Masked Input Plugin(jquery.maskedinput.js);

    var dataType = '' - хранит тип данных ячейки

   Возможные типы данных:

    noEditType = 'noedit'; - данные не редактируются
    emailType = 'emailtype'; - хранение электронных адресов
    currencyType = 'currencytype'; - храненение денежных сумм
    telType = 'teltype'; - хранение телефонных номеров
    dateType = 'datetype'; - хранение даты
    nameType = 'nametype'; - имя или фамилия пользователя

    loginType = 'logintype'; - значение пользовательского атрибута  (учетная запись)

    commonTextType = 'commontexttype'; - значение для пользовательского атрибута  (общий текст)
    digitType = 'digittype'; - ввод только цифр
    creditCardType = 'creditcardtype'; - ввод только цифр

    - эти классы нужно указать в тегах <th> заголовка таблицы,
    ячейки которой будут редактирвоваться.
     Эти классы характеризуют данные, которые содержит конкретный столбец,
     по общему признаку. И в зависимости от указанного класса, эти данные
     будут обрабатываться.

      Пользовательские атрибуты:
     data-country='by' - код страны
     data-maxLength="4" - максимальное ограничение на ввод символов
     data-minLength="4" - минимальное ограничение на ввод символов
     data-rangelengthsymbol = [] - диапазон ограничения ввода символов
     data-txt - здесь указывается тип данных содержащих текст

   Определение плагина jQuery:
     fn.modalBoxCellEdit - переменная хранит функцию которая будет
   хранить данные об создаваемом модальном окне. */

(function ($) {

    var langLocaleBrowser = '';
    /*хранит локаль текущего браузера*/

    getLang();
    /*получение сведений о локали браузера*/

    /*получение данных о локали браузера
    * window.navigator.browserLanguage - for IE
    * */
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

    $.fn.modalBoxCellEdit = function (prop) {

        var selectorErrorClass = 'errorInput';
        /*селектор для контейнера,
               в котором будут выводиться ошибки.*/

        var selectorErrStyleInput = 'errorInputStyle';
        /*2-й селектор для контейнера input,
              в случае ошибочно введенного значения.*/

        var selectorForModalBox = 'popup_modal_box';
        /* Селектор для контейнера из которого запускается модальное окно*/

        /* Селектор для контейнера, который содержит страницу блокировки,
        во время появления модального окна*/
        var selectorBlockPage = 'popup_block_page';

        /*селектор для доступа к конетйнеру, который содержит значок, указывающий на закрытия модального окна*/
        var selectorModalBoxClose = 'popup_modal_close';

        /*Селектор для контейнера, который находится внутри основного контейнера, содержащего
        модальное окно*/
        var selectorInnerModalBox = 'popup_inner_modal_box';

        /*селектор для контейнера, создаваемого во внутренней части модального окна */
        var selectorForInputFields = 'forInputFields';

        /*общее название для класса в создаваемых контейнерах 'div' для
         элементов input*/
        var selectorDivForInput = "divForInputField";

        /*назвнание класса для текущего конейнера созданного
          из элемента div
          nameInput - значение атрибута 'name' создаваемого поля ввода*/
        var selectorDivCurrent = '';

        var nameInput = '';
        /* харнит значение в поле ввода (элемента input)*/

        var selectorInputCurrent = '';
        /*селектор текущего элемента input, куда вводится новое значение*/

        var selectorInputValidate = 'inputValidate';
        /*селектор, для элемента input*/

        var valueForInput = '';
        /*сохраняет значение при работе с текущей ячейкой*/

        var contextCellEditCurrent = '';
        /* Контекст текущей точки в документе*/

        //    var classCurrentCell = '';
        /*получаем значение атрибута 'class' для текущей ячейки*/

        var nameFieldInput = '';
        /* название поля ввода (то есть устанавливается над элементом input)*/

        var typeInput = '';
        /*значение атрибута type*/

        var readonlyInput = false;
        /*данное поле только для чтения или и редактирования (true или false)*/

        var requiredInput = false;
        /*требуется ли заполнять данное поле ввода (true или false)*/

        var errorMessage = '';
        /*определяем язык сообщений об ошибке*/
        var messagesRu = '';
        var messagesEn = '';

        var dataAttributeCountry = 'by';
        /*значение атрибута - код страны (data-country=''), для выбора маски телефона */

        var numberDigitsPhone = 0;
        /*количество символов в телефонном номере (только цифры)*/

        var maxLengthSymbol = 0;
        /*максимальное ограничение ввода символов*/
        var minLengthSymbol = 0;
        /*минимальное ограничение ввода символов*/
        var rangeLengthSymbol = [];
        /*диапазон огрничения ввода символов*/

        /*название пользовательского атрибута, который хранит типы данных*/
        var nameDataType = 'datatype';
        var dataType = '';
        /*хранит тип данных ячейки*/

        /*данные не редактируются*/
        var emailType = 'emailType';
        /* хранение электронных адресов*/
        var currencyType = 'currencyType';
        /*храненение денежных сумм*/
        var telType = 'telType';
        /*хранение телефонных номеров*/
        var dateType = 'dateType';
        /*хранение даты*/
        var nameType = 'nameType';
        /*имя или фамилия пользователя*/
        /*значение пользовательского атрибута  (учетная запись)*/
        var loginType = 'loginType';
        /*значение для пользовательского атрибута  (общий текст) */
        var commonTextType = 'commonTextType';
        /*ввод только цифр*/
        var digitType = 'digitType';

        var creditCardType = 'creditCardType';
        /*ввод только цифр*/

        /*имя пользовательского атрибута 'data-country'*/
        var country = 'country';

        /*обозначение кода беларуси*/
        var By = 'by';
        /*обозначение кода россии*/
        var Rus = 'ru';
        /*обозначение кода сша*/
        var Usa = 'usa';



        /*название пользовательского атрибута (максимальное количество символов)*/
        var maxLength = 'maxlength';
        var minLength = 'minlength';
        var rangeLengthSymbolNameData = 'rangelengthsymbol';

        /*название пользовательского атрибута ( максимальное число)*/
        var maxDigitNameData = 'digitmax';
        var minDigitNameData = 'digitmin';
        var rangeDigitNameData = 'digitrange';

        /*переменные для хранения значения пользовательского атрибута.*/
        var maxDigit = 0;
        var minDigit = 0;
        var rangeDigit = [];

        var pathButtonImageDatePicker = '';
        var pathToImgCloseModalBox = '';


        /*Параметры по умолчанию*/
        var options = $.extend({

            height: "150",
            width: "1000",
            title: "Редактирование.",
            top: "30%",
            left: "10%",
            maxLengthInput: '60', /*максимальное количество элементов в поле ввода*/
            sizeInput: '65', /*длина поля ввода*/
            maxNumberSum: '', /*максимальное ограничение ввода суммы*/
            minNumberSum: '', /*минимальное ограничение ввода суммы*/
            rangeSum: [-2147483648, 2147483647], /*диапазон значений денежной суммы*/
            regExpEmail: '^([a-z0-9_-]+\\.)*[a-z0-9_-]+@[a-z0-9_-]+(\\.[a-z0-9_-]+)*\\.[a-z]{2,6}$',
            pathToButtonImage: pathButtonImageDatePicker, /*путь к изображению кнопки календаря*/
            formatDate: 'dd-mm-yy', /*формат даты*/
            numberCharactersDate: 10, /*количество символов в формате даты*/

            maskForLetters: '^[а-яА-ЯёЁa-zA-Z]{2,15}$', /*маска для ввода только букв*/
            validCharactersForLetters: '[^а-яА-ЯёЁa-zA-Z]', /*допустимые символы для ввода только букв*/
            validCharactersForLettersInfo: 'а-я, А-Я, ё, Ё, a-z, A-Z', /*допустимые символы для ввода только букв*/
            exampleLetters: 'name, Name',

            maskForLogin: "^[a-z]{2,7}\\.[a-z]{2,10}-{0,1}[a-z]{3,5}$", /*маска для ввода логина*/
            exampleLogin: 'an.login, name.login-log, nm.loginlogin', /* пример ввода логина*/
            validCharactersForLoginInfo: " 'a-z', '.', '-' ", /*допустимые символы для ввода логина*/
            validCharactersForLogin: "[^-a-z\\.]", /* */

            maskForCommonText: '^[a-zA-ZА-Яа-я]{5,10}[-a-zA-ZА-Яа-я:\\d\\(\\)\\s\\*\\+]+$', /*маска для ввода целого текста*/
            exampleCommonText: 'The text is common: Maserati-192-fx', /* пример общего текста*/
            validCharactersForCommonTextInfo: "a-z, A-z, А-Я, а-я, ' - ' ,  ,' + ' , ' * ' , ' : ', ' , ( )  ", /*допустимые символы*/
            validCharactersForCommonText: "[^-a-zA-ZА-Яа-яёЁ,\\s\\+\\*:'\\(\\)\\d]", /*допустимые символы*/

            maskForDigit: '^[\\d]+$', /*маска для ввода цифр*/
            exampleDigit: '19878 ...', /* пример общего текста*/
            validCharactersForDigitInfo: '0 1 2 3 4 5 6 7 8 9 ', /*допустимые символы*/
            validCharactersForDigit: "[^\\d]", /*допустимые символы*/

            maskFilterDigit: /[\d]{1,4}/g, /*Фильтр, отсеивает цифры*/
            maskForCreditCardNumber: /[\d]{1,4}/g, /*для поиска групп цифр*/
            maskForCreditCardNumberFinal: '^[\\d]{13,19}$', /* (^[\d]{13,19}$)для првоерки готового номера(для номера кредитной карты)*/
            lengthCreditCardNumber: 19, /*количество цифр в номере кредитной карты*/
            validCharactersForCreditCard: /[^\d]/g, /*допустимые символы*/
            imgCloseForModalBox: pathToImgCloseModalBox /*путь к значку-изображения для закрытия окна*/
        }, prop);


        /*название пользовательских атрибутов для currencyType
        (ввод валюты)*/
        var maxNumberSum = 'maxNumberSum';
        var maxNumberSumOptions = options.maxNumberSum;

        var minNumberSum = 'minNumberSum';
        var minNumberSumOptions = options.minNumberSum;

        var rangeSum = 'rangeSum';
        var rangeSumOptions = options.rangeSum;

        /* Точка входа в плагин*/
        this.dblclick(function () {

            /*очистка консоли, перед каждым новым редактированием ячейки*/
            //console.clear();

            contextCellEditCurrent = $(this);

            /*индекс текущей ячейки в строке*/
            var indexCurrentCellIntoRow = $(this).index();

            /*Получение данных о столбце текущей ячейки*/
            var th = getThByTdForTable(indexCurrentCellIntoRow, this);


            /*получаем тип данных текущей ячейки*/
            getTypeData(th);

            /* получаем код страны, если есть, из пользовательского атрибута*/
            getCountryCode(th);

            setAttributesForInput();
            /* заполняем значения дополнительных параметров */

            nameFieldInput = $(th).html().trim();
            nameInput = $(this).attr('name').trim();
            /*значение атрибута для текущей ячейки*/

            /*Получение значение редактируемой ячейки
            trim() - удаляет крайние пробелы*/
            valueForInput = $(this).text().trim();


            /*Создаем модальное окно, применяем стили, обрабатываем события над модальным окном*/
            if (dataType !== '') {

                var selector = '.' + selectorInputValidate;

                /* ограничения на ввод символов*/
                getLimitCharacterInput(th);

                /* ограничения на ввод числа*/
                getLimitDigitInput(th);

                /*анализ атрибутов и их значений  для типа данных 'currency*/
                chooseTypeDataCurrency(th);

                /*создание массива сообщений*/
                createArrMessages();

                /*определеяем язык сообщений об ошибке*/
                defineLangOfMessage();
                

                /*Блокировка основной страницы*/
                addBblockPage();

                /*задание html-разметки модального окна*/
                addPopupBox();

                /*Добавление стилей на новые элементы*/
                addStyles();

                /*.fadeIn() позволяет плавно изменить прозрачность 
                для отдельных элементов (из скрытого состояния в видимое).
                 *плавное появляение модального окна, в указанном месте*/
                $('.' + selectorForModalBox).fadeIn();

                /*перетаскивание модального окна мышью*/
                dragModalBox();

                /*определение типа редактируемых данных и вызов
                           функций для первоначальной валидации;
                           * selector - Селектор поля ввода
                          *  th - селектор столбца текущей ячейки
                           */
                chooseTypeData(selector, th);

                /*активируем плагин datepicker, если подходящий тип данных*/
                if (dataType === dateType) {
                    mountCalendar(selector);
                    $(selector).datepicker("enable");
                    simulationBlurClickFocusClick(selector);

                }
            }
        });

        /*получаем тип данных, обязательно нужно, чтобы название атрибута
        * data-*** , при получении значения атрибута, было с маленькой буквы*/
        function getTypeData(selector) {

            /*обработка ошибки, на случай, если атрибут не указан*/
            try {
                dataType = $(selector).data(nameDataType).trim();
            } catch (exception) {
                console.log("Пользовательский атрибут ' data-*** '  - не указан : - " + exception);
                dataType = '';
            }
        }

        /*выбор типа данных 'валютыж' для валидации значения которое
        * загружается из ячейки, в поле ввода.
        * selectorTh - селектор столбца текущей ячейки
        * */
        function chooseTypeDataCurrency(selectorTh){

            switch (dataType) {
                case currencyType : {
                    getValuesOfDataTypesOfCurrencyType(selectorTh);
                    break;
                }
            }
        }


        /*выбор типа данных для валидации значения которое загружается из ячейки, в поле ввода.
        * selector - Селектор поля ввода
        * selectorTh - селектор столбца текущей ячейки
        * */
        function chooseTypeData(selector) {

            switch (dataType) {

                case nameType:
                    validateMaskWithRegular(selector, options.maskForLetters.trim(),
                        errorMessage.exampleLetters);
                    break;

                case loginType :
                    validateMaskWithRegular(selector, options.maskForLogin.trim(),
                        errorMessage.inputLogin);
                    break;

                case commonTextType : {
                    validateMaskWithRegular(selector, options.maskForCommonText.trim(),
                        errorMessage.inputCommonText);
                    break;
                }

                case digitType : {
                    validateMaskWithRegular(selector, options.maskForDigit.trim(),
                        errorMessage.inputDigits);
                    break;
                }

                case creditCardType : {
                    validateMaskWithRegularForCreditCard(selector, options.maskForCreditCardNumberFinal,
                        errorMessage.number);
                    break;
                }

            }
        }

        /*получение значений пользовательский атрибутов у заголовка
         с типом данных currencyType*/
        function getValuesOfDataTypesOfCurrencyType(selector) {

            maxNumberSumOptions = $(selector).data(maxNumberSum.toLowerCase());
            minNumberSumOptions = $(selector).data(minNumberSum.toLowerCase());

            switch (maxNumberSumOptions) {
                case undefined : {
                    maxNumberSumOptions = 0;
                    break;
                }
                case "" : {
                    maxNumberSumOptions = 0;
                    break;
                }
                case " " : {
                    maxNumberSumOptions = 0;
                    break;
                }
            }

            switch (minNumberSumOptions) {

                case undefined : {
                    minNumberSumOptions = 0;
                    break;
                }
                case '' : {
                    minNumberSumOptions = 0;
                    break;
                }
                case ' ' : {
                    minNumberSumOptions = 0;
                    break;
                }
            }

            rangeSumOptions = $(selector).data(rangeSum.toLowerCase());
            /*диапазон значений ввода символов суммы*/

            switch (rangeSumOptions) {

                case undefined : {
                    rangeSumOptions = [];
                    break;
                }

                case '' : {
                    rangeSumOptions = [];
                    break;
                }

                case ' ' : {
                    rangeSumOptions = [];
                    break;
                }
            }
        }


        /*првоерка маски ввода данных, с помощью регулярного выражения*/
        function validateMaskWithRegular(selector, regularExpMask, errMessage) {

            /*финальная маска для ввода логина*/
            var regExpFinalMaskReg = new RegExp(regularExpMask);

            /*получаем текущее значение из поля ввода*/
            var value = $(selector).val();


            var isFinalMask = regExpFinalMaskReg.test(value);

            if (!isFinalMask) {

                $(selector).val(value.replace(/^.*$/, ''));
                /*удаление всех символов*/
                showErrorMessage(errMessage, selector);

            }
        }

        /*валидация текущего значения (номера кредитной карты) в ячейке, которая редактруется*/
        function validateMaskWithRegularForCreditCard(selector, regularExpMask, errMessage) {

            /*финальная маска для ввода логина*/
            var regExpFinalMaskReg = new RegExp(regularExpMask);

            /*получаем текущее значение из поля ввода*/
            var value = $(selector).val();

            /*получаем фильтр, по которому будем убирать разделители*/
            var regFilter = options.maskFilterDigit;


            /*убаираем разделители знаков, если есть*/
            value = value.replace(regFilter, '');

            /*сравниваем по маске текущее значение и елси оно не подходит,
            * тогда поле ввода очищается.*/
            var isFinalMask = regExpFinalMaskReg.test(value);

            if (!isFinalMask) {

                $(selector).val(value.replace(/^.*$/, ''));
                /*удаление всех символов*/
                showErrorMessage(errMessage, selector);

            }
        }

        /*создание массива сообщений*/
        function createArrMessages() {

            var lowLimitCardNumber = 13;

            /*Создаем массив сообщений для ошибок.*/
            messagesRu = {
                required: "Поле ввода нужно заполнить.",
                email: "Пожайлуста введите правильный формат адреса email.",
                url: "Пожайлуста введите правильный формат URL.",
                number: ("Пожайлуста введите номер кредитной карты в нужном формате, " +
                    "например : 0120 5451 4271 7891 - длиной от " + lowLimitCardNumber + " до "
                    + options.lengthCreditCardNumber + "." ),

                max: ("Пожайлуста, введите значение не более  " + maxDigit + "."),
                min: ("Пожайлуста, введите значение не менее  " + minDigit + "."),
                range: ("Пожайлуста, введите значение в диапазоне между " + rangeDigit[0] + " и " + rangeDigit[1] + " ."),

                digits: "Пожайлуста введите только цифры.",
                inputDigits: ("Пожайлуста введите только цифры, например : ( " + options.exampleDigit + " )"),
                validCharactersForDigitInfo: ('Пожайлуста вводите только цифры: ' +
                    '( ' + options.validCharactersForDigitInfo + ' )'),

                alpha: "Пожайлуста введите только буквы.",
                exampleLetters: ("Пожайлуста, введите только буквы, например : ( " + options.exampleLetters + " )"),
                equalTo: "Пожайлуста повторите ввод такого значения, как написано выше.",
                maxLength: ("Пожайлуста введите не более " + maxLengthSymbol + " символов."),
                minLength: ("Пожайлуста введите не менее " + minLengthSymbol + " символов."),
                rangeLength: ("Пожайлуста введите значение в диапазоне от " + rangeLengthSymbol[0] +
                    " до " + rangeLengthSymbol[1] + " символов."),
                rangeSum: ("Пожайлуста введите значение в диапазоне от " + rangeSumOptions[0] +
                    " до " + rangeSumOptions[1] + '.'),
                maxSum: ("Пожайлуста введите значение не более " + maxNumberSumOptions + ' .'),
                minSum: ("Пожайлуста введите значение не менее " + minNumberSumOptions + ' .'),
                telephone: ("Пожалуйста введите телефонный номер в правильном формате, все позиции должны " +
                    "быть заполнены."),
                date: ('Пожалуйста введите дату в формате : ' + options.formatDate + ' ' + ' ' +
                    '(пример : 2900-12-01, 12-01-2900 ...)'),
                validCharactersForLoginInfo: ('Пожайлуста вводите допустимые символы: ' +
                    '( ' + options.validCharactersForLoginInfo + ' )'),
                inputLogin: ('Пожайлуста введите логин, используя заданный формат : ' +
                    '(например - ' + options.exampleLogin + ')'),
                inputCommonText: ('Пожайлуста введите текст (русский или английский), используя заданный формат : ' +
                    '(например - ' + options.exampleCommonText + ')'),
                validCharactersForCommonTextInfo: ('Пожайлуста вводите допустимые символы: ' +
                    '( ' + options.validCharactersForCommonTextInfo + ' )')

            };

            messagesEn = {
                required: "This field is required.",
                email: "Please enter a valid email address.",
                url: "Please enter a valid URL.",
                number: ("Please enter your credit card number in the desired format, " +
                    "for example : 0120 5451 4271 7891 - length from " + lowLimitCardNumber + " до " +
                    +options.lengthCreditCardNumber + "." ),

                max: ("Please enter no more than  " + maxDigit + "."),
                min: ("Please enter at least  " + minDigit + "."),
                range: ("Please enter a value between " + rangeDigit[0] + " and " + rangeDigit[1] + " ."),

                digits: "Please enter only digits.",
                inputDigits: ("Please enter only digits, for example : ( " + options.exampleDigit + " )"),
                validCharactersForDigitInfo: ('Please enter only digits: ' +
                    '( ' + options.validCharactersForDigitInfo + ' )'),

                alpha: "Please enter only letters.",
                exampleLetters: ("Please enter only letters, for example : ( " + options.exampleLetters + " )"),
                equalTo: "Please enter the same value again.",
                maxLength: ("Please enter no more than " + maxLengthSymbol + " characters."),
                minLength: ("Please enter at least " + minLengthSymbol + " characters."),
                rangeLength: ("Please enter a value between " + rangeLengthSymbol[0] +
                    " and " + rangeLengthSymbol[1] + " characters long."),
                rangeSum: ("Please enter a value between " + rangeSumOptions[0] +
                    " and " + rangeSumOptions[1] + '.'),
                maxSum: ("Please enter a value less than or equal to " + maxNumberSumOptions),
                minSum: ("Please enter a value greater than or equal to " + minNumberSumOptions),
                telephone: ("Please enter the phone number in the correct format, all positions must be filled in."),
                date: ('Please enter the date in the format : ' + options.formatDate + ' ' + ' ' +
                    '(for example : 2900-12-01, 12-01-2900 ...)'),
                validCharactersForLoginInfo: ('Please enter valid characters: ' +
                    '( ' + options.validCharactersForLoginInfo + ' )'),
                inputLogin: ('Please enter your login using the specified format : ' +
                    '(for example - ' + options.exampleLogin + ' )'),
                inputCommonText: ('Please enter text (Russian or English) using the specified format : ' +
                    '(for example - ' + options.exampleCommonText + ' )'),
                validCharactersForCommonTextInfo: ('Please enter your login using the specified format : ' +
                    '(for example - ' + options.validCharactersForCommonTextInfo + ' )')
            };
        }

        /*имитация потеря фокуса на элементе, щелчок вне элемента,
        снова фокус на элемент и щедчок на элементе*/
        function simulationBlurClickFocusClick(selector) {
            $(selector).trigger('blur');
            /*искуственно создаем событие 'потеря фокуса' на поле ввода*/
            $('.' + selectorInnerModalBox).click();
            /*искуственно создаем событие 'щелчок' вне поля ввода*/
            $(selector).trigger('focus');
            /*искуственно создаем событие 'фокус' на поле ввода*/
            $(selector).click();
            /*искуственно создаем событие 'щелчок' на поле ввода*/
        }


        /* ограничения на ввод символов*/
        function getLimitCharacterInput(selector) {
            maxLengthSymbol = $(selector).data(maxLength);
            minLengthSymbol = $(selector).data(minLength);

            switch (maxLengthSymbol) {
                case undefined : {
                    maxLengthSymbol = 0;
                    break;
                }
                case "" : {
                    maxLengthSymbol = 0;
                    break;
                }
                case " " : {
                    maxLengthSymbol = 0;
                    break;
                }
            }
            switch (minLengthSymbol) {

                case undefined : {
                    minLengthSymbol = 0;
                    break;
                }
                case '' : {
                    minLengthSymbol = 0;
                    break;
                }
                case ' ' : {
                    minLengthSymbol = 0;
                    break;
                }
            }

            rangeLengthSymbol = $(selector).data(rangeLengthSymbolNameData);
            /*диапазон значений ввода символов суммы*/

            switch (rangeLengthSymbol) {

                case undefined : {
                    rangeLengthSymbol = [];
                    break;
                }

                case '' : {
                    rangeLengthSymbol = [];
                    break;
                }

                case ' ' : {
                    rangeLengthSymbol = [];
                    break;
                }

            }

        }


        /* ограничения на ввод числа*/
        function getLimitDigitInput(selector) {
            maxDigit = $(selector).data(maxDigitNameData);
            minDigit = $(selector).data(minDigitNameData);

            switch (maxDigit) {
                case undefined : {
                    maxDigit = 0;
                    break;
                }
                case "" : {
                    maxDigit = 0;
                    break;
                }
                case " " : {
                    maxDigit = 0;
                    break;
                }
            }

            switch (minDigit) {
                case undefined : {
                    minDigit = 0;
                    break;
                }
                case "" : {
                    minDigit = 0;
                    break;
                }
                case " " : {
                    minDigit = 0;
                    break;
                }
            }

            rangeDigit = $(selector).data(rangeDigitNameData);
            /*диапазон значений ввода символов суммы*/

            switch (rangeDigit) {
                case undefined : {
                    rangeDigit = [];
                    /*объявляем пустой массив*/
                    break;
                }
                case "" : {
                    rangeDigit = [];
                    /*объявляем пустой массив*/
                    break;
                }
                case " " : {
                    rangeDigit = [];
                    /*объявляем пустой массив*/
                    break;
                }
            }
        }


        /*определяем язык сообщений об ошибке*/
        function defineLangOfMessage() {

            if (langLocaleBrowser === 'ru') {
                errorMessage = messagesRu;
            } else {
                errorMessage = messagesEn;
            }
        }


        /*получаем значение пользовательского атрибута для текущей ячейки (data-country='').*/
        function getCountryCode(selector) {

            if (dataType === telType) {

                var countryCode;

                /*Обрабатываем данные, в случае возможной ошибки.*/
                try {
                    countryCode = $(selector).data(country).toLowerCase().trim();
                } catch (e) {
                    console.log('запрашиваемое значение отсутвует в текущем веб-документе : ' + e);
                }

                switch (countryCode) {
                    case undefined: {
                        console.log(" Пользовательский атрибут 'country' - не определен для текущей ячейки.");
                        break;
                    }
                    case '': {
                        console.log(" Пользовательский атрибут 'country' - не определен для текущей ячейки.");
                        break;
                    }
                    default: {
                        dataAttributeCountry = countryCode;
                    }
                }
            }
        }


        /* Установка  псевдонима для валюты */
        function setAliasForCurrency() {

            Inputmask.extendAliases({
                byn: {
                    prefix: "",
                    groupSeparator: " ",
                    alias: "numeric",
                    placeholder: "0",
                    autoGroup: !0,
                    digits: 0,
                    digitsOptional: !1,
                    clearMaskOnLostFocus: !1,
                    allowMinus: 'false'
                }
            });
        }


        /* Проверяем значение атрибута 'class' для текущей ячейки*/
        function setAttributesForInput() {

            switch (dataType) {

                case emailType : {
                    applyForCellEmail();
                    break;
                }

                case nameType : {
                    applyForCellTxt();
                    break;
                }

                case loginType : {
                    applyForCellTxt();
                    break;
                }

                case commonTextType : {
                    applyForCellTxt();
                    break;
                }

                case digitType : {
                    applyForCellTxt();
                    break;
                }

                case creditCardType : {
                    applyForCellTxt();
                    break;
                }

                case dateType : {
                    applyForCellDate();
                    break;
                }
                case currencyType : {
                    applyForCellTxt();
                    break;
                }
                case telType : {
                    applyForCellTxt();
                    break;
                }
                default: {
                    console.log("Такой тип класса, не зарегистрирован в данном плагине!")
                }
            }
        }


        /* применить настройки для ячеек типа email*/
        function applyForCellEmail() {
            typeInput = 'email';
            readonlyInput = false;
            requiredInput = true;
        }

        /* применить настройки для ячеек типа text*/
        function applyForCellTxt() {
            typeInput = 'text';
            readonlyInput = false;
            requiredInput = true;
        }

        /* применить настройки для ячеек типа date*/
        function applyForCellDate() {
            typeInput = 'txt';
            readonlyInput = false;
            requiredInput = true;
        }


        /*indexCurrentCellIntoRow - индекс редактриуемой ячейки в строке;
        thisElement - контекст из точки в документе, где редактируется текущая ячейка*/
        function getThByTdForTable(indexCurrentCellIntoRow, thisElement) {

            var th = 0;
            var thColSpan = 0;

            var parentTheElem = thisElement.offsetParent;
            var tableHeadThisTable = parentTheElem.tHead;
            /*Свойство tHead хранит ссылку на tHead таблицы. */

            var indexRowTheTableHead = tableHeadThisTable.rows[0];

            /*Свойство cells хранит коллекцию ячеек TD/TH строки TR. */
            var listCells = indexRowTheTableHead.cells;

            var lengthTableHead = listCells.length;
            /*длина коллекции ячеек <th> заголовка*/

            /*перебираем коллекцию ячеек заголовка текущей таблицы, 
            ячейка которой редактируется*/
            for (var i = 0; i < lengthTableHead; i++) {

                /* получаем индекс ячейки заголовка в текущей итерации, из коллекции ячеек, текущего заголовка*/
                th = indexRowTheTableHead.cells[i];

                thColSpan = thColSpan + th.colSpan;

                if (thColSpan >= (indexCurrentCellIntoRow + thisElement.colSpan)) {
                    break;
                }
            }

            return th;
        }


        /*перетаскивание модального окна;для этого должна быть подключена в веб-документе, 
        библиотека 'jquery-ui.js'*/
        function dragModalBox() {

            $('.' + selectorForModalBox).draggable({
                containment: "parent", /*не выходить за рамки родительского конейнера*/
                scroll: false, /* Запрет появления полосы прокрутки*/
                /*изображение курсора и его расположение, относительно данного окна*/
                cursor: "pointer", cursorAt: {top: 25, left: 35}
            });
        }


        /*функция добавления стилей
        css - стили 
        'position': 'absolute' - Элемент исчезает с того места, где он должен быть 
        и позиционируется заново. Остальные элементы, располагаются так, 
        как будто этого элемента никогда не было.*/
        function addStyles() {

            /*Блокировка перекрываемой страницы*/
            var pageHeight = $(document).height();
            /*возвращает высоту HTML документа*/
            var pageWidth = $(window).width();
            /* возвращает ширину области просмотра браузера*/

            $('.' + selectorBlockPage).css({
                'position': 'absolute',
                /*top и left позиционируют элемент в левом верхнем углу,
                указанного селектора*/
                'top': '0',
                'left': '0',
                'background-color': 'rgba(0,0,0,0.6)', /*цвет фона; 0.6 - это альфа-канал и задает прозрачность элемента*/
                'height': pageHeight, /*высота страницы*/
                'width': pageWidth, /*ширина страницы*/
                'z-index': '10', /*Свойство z-index управляет порядком наложения 
            позиционированных элементов в случае, когда они накладываются друг на друга,
            то есть данный элемент указывает на то, элемент в этой точке будет на переднем плане*/

                'draggable': 'true' /*разрешить перетаскивание модального окна*/
            });

            /*'selectorForModalBox' - Этот селектор для основного блока div,
            модального окна, и был создан с помощью jquery в функции addPopupBox()*/
            $('.' + selectorForModalBox).css({
                /*элемент абсолютно позиционирован, при этом другие элементы отображаются 
                на веб-странице словно абсолютно позиционированного элемента и нет. */
                'position': 'absolute',
                /*top и left позиционируют элемент по координатам, 
                которые переданы в качестве параметров, при вызове основной функции данного плагина.
                указанного селектора*/
                'left': options.left,
                'top': options.top,

                'display': 'none', /*Элемент не генерирует никакой контейнер, полностью удаляясь со страницы.*/
                /*высота и ширина модального окна либо используются из занчений по умолчанию,
                указанных в данном плагине, либо передаются в качестве параметров, при вызове данного плагина*/
                'height': options.height + 'px',
                'width': options.width + 'px',
                'border': '1px solid #fff', /*рамка вокруг модального окна, линия белого цвета, толщиной 1px*/

                /*box-shadow позволяет сделать так, чтобы у блочных элементов появилась внешняя или внутренняя тень.
                0px (horizontal offset) – горизонтальное смещение
                2px (vertical offset) – вертикальное смещение 
               7px  (blur radius) – радиус размытия
               #292929 - цвет*/
                'box-shadow': '0px 2px 7px #292929',

                /*box-shadow -  для браузера Safari*/
                '-moz-box-shadow': '0px 2px 7px #292929',

                /*box-shadow -  для браузера Firefox*/
                '-webkit-box-shadow': '0px 2px 7px #292929',

                'border-radius': '10px', /*Устанавливает радиус скругления уголков рамки.*/
                '-moz-border-radius': '10px',
                '-webkit-border-radius': '10px',

                'background': '#f2f2f2', /*основной фон модального окна*/

                'z-index': '50' /*указывает что элемент будет находится на другим элементов
            на переднем фоне, по оси z, на 50 единиц впереди*/
            });

            /*описываем элемент, который символизирует закрытие модального окна*/
            $('.' + selectorModalBoxClose).css({

                'position': 'relative', /*Положение элемента устанавливается относительно его исходного места. */
                'top': '-15px', /* означает, что элемент, на указанное значение, будет выступать сверху над родительским блоком*/
                'left': '20px',

                'float': 'right', /*Выравнивает элемент по правому краю, а все остальные элементы обтекают его по левой стороне.*/
                'display': 'block', /*Элемент генерирует структурный блок, как и тег <div>*/

                'height': '50px', /* размеры значка*/
                'width': '50px',
                /*указанный элемент помещается на фон блока (Селектор selectorModalBoxClose),
                  и не будет дублироваться*/
                'background': 'url(' + options.imgCloseForModalBox + ') no-repeat'
            });

            /*внутреннее содержание модального окна*/
            $('.' + selectorInnerModalBox).css({

                'background-color': '#fff', /*белый фон*/

                /*размеры данного контейра, вычислются относительно размеров модального окна,
                А размеры модального окна берутся из парамерта options, который указан выше*/
                'height': (options.height - 50) + 'px',
                'width': (options.width - 50) + 'px',

                'padding': '10px', /*оступ со всех сторон, с внутреннй стороны текущего
            элемента*/
                'margin': '15px', /*оступ со всех сторон с внешней стороны текущего элемента,\
            то есть от внутренней рамки родительского элемента*/

                'border-radius': '10px', /*загругление углов текущего элемента.*/
                '-moz-border-radius': '10px',
                '-webkit-border-radius': '10px'
            });

        }

        /* примениие стиля, к конейнеру с сообщением об ошибке*/
        function styleForErrorLabel() {
            $('.' + selectorErrorClass).css({
                'width': '80%',
                'display': 'block',
                'color': '#f9066b',
                'margin-top': '1%',
                'font-style': 'italic',
                'font-weight': '300',
                'padding': '0.3% 0.3% 0.3% 0.3%',
                'font-size': '15px',
                'border-radius': '4px', /*загругление углов контейнера для ошибок*/
                'box-shadow': '0 0 3px #1023a2', /*тень вокруг контейнера для ошибок*/
                'z-index': '55'
            })
        }

        /*применение стиля для поля ввода, когда там содержится ошибка*/
        function styleForInputErr() {

            $('.' + selectorInputValidate)
                .addClass(selectorErrStyleInput)
                .css({
                    'border': 'solid 1px #E7145E',
                    'box-shadow': '5px 2px 3px #F161DF', /*тень вокруг контейнера для ошибок*/
                    'border-radius': '5px'
                });

            $('.' + selectorErrStyleInput).effect("highlight", {}, 1000);
        }

        /*Очистить стили для поля ввода, когда там содержится ошибка*/
        function styleForInputErrClear() {

            $('.' + selectorInputValidate).addClass(selectorErrStyleInput);

            $('.' + selectorErrStyleInput).css({
                'border': '',
                'box-shadow': '', /*тень вокруг контейнера для ошибок*/
                'border-radius': ''
            });

        }

        /* контейнер создается во внутренней части модального окна, 
        и будет flex-контейером, а элементы внутри, будут flex-элементами
         В данном контейнере будут создаваться элементы 'span' и 'input' */
        function createDivIntoInnerModalBox() {

            createElemWithAttrClassIntoAnotherElem(selectorForInputFields, '<div>', "." + selectorInnerModalBox);
            var selector = "." + selectorForInputFields;
            $(selector).css({
                'display': 'flex', /*для остальных браузеров*/
                'justify-content': 'center', /*Flex-элементы выравниваются по центру flex-контейнера.*/
                'flex-direction': 'column' /* 	Направление сверху вниз. Flex-элементы выкладываются в колонку*/
            });

            $(selector).css({
                /*отображает контейнер как блочный элемент*/
                'display': '-webkit-flex', /*для safary*/
                '-webkit-justify-content': 'center',
                '-webkit-flex-direction': 'column'
            });

        }

        /*контейнер div для элемента span и input
        selectorClass - название класса для создаваемого селектора.
        selectorBuildIn - название селектора того контейра, внутрь которого,
        добавляется элемент
        */
        function createDivForInput(selectorClass, selectorBuildIn) {

            createElemWithAttrClassIntoAnotherElem(selectorClass, '<div>', selectorBuildIn);

            $('.' + selectorClass).css({
                'border-bottom': 'solid 1px green', /*нижняя линия*/
                'padding-top': '5px',
                'padding-bottom': '5px'
            })
        }


        /*  создаем span-элемент с текстом внутри
        selectorToJoin - Селектор указывающий на элемент (контейнер),  в котором нужно создать тег span
        selectorForValue -  селектор указывающий на место  внутри создаваемого тега span,
        куда нужно записать значение
        options.nameFieldInput - значение, устанавливаемое в создаваемом теге span, 
        которое будет названием для поля ввода. Данное значение передается в праметрах.
        */
        function createTxtIntoSpanTag(selectorToJoin, selectorForValue) {

            $('<span>').appendTo('.' + selectorToJoin);
            $('.' + selectorToJoin + ' ' + 'span').css({'margin-right': '15px'});

            $(selectorForValue).html(nameFieldInput + ' : ');
            $(selectorForValue).css({
                'font-size': '20px',
                'font-weight': 'bold',
                'color': 'blue'
            });
        }

        /*создание элемента, после указанного элемента,с массивом атрибутов для создаваемого элемента,
         а также создаваемый элемент, создается после указанного контейнера*/
        function createElemWithAttrsAndInsertAfter(elem, attributes, afterElem) {

            $(elem, attributes).insertAfter(afterElem);
        }

        /*функция создает элемент <input> ;
        selectorDiv - указывает место, где должен быть создан данный контейнер*/
        function createInput(selectorDiv, afterElem) {

            /*данный селектор указывает на элемент,
            после которого должен быть создан текущий элемент input*/
            var selectorJoinAfter = '.' + selectorDiv + ' ' + afterElem;

            createElemWithAttrsAndInsertAfter('<input>', {
                    class: selectorInputValidate,
                    type: typeInput,
                    name: nameInput,
                    value: valueForInput,
                    maxlength: options.maxLengthInput,
                    readonly: readonlyInput,
                    required: requiredInput,
                    size: options.sizeInput
                },
                selectorJoinAfter);

            /*селектор указывает на место, где создан текущий элемент input*/
            selectorInputCurrent = '.' + selectorDiv + ' ' + 'input';

            if (readonlyInput === true) {
                $(selectorInputCurrent).css({
                    'border': 'solid 1px white' /*исчезновение рамки поля ввода*/
                });
            } else {
                $(selectorInputCurrent).css({
                    'border': 'solid 1px blue'/*исчезновение рамки поля ввода*/
                });
            }

            $(selectorInputCurrent).css({

                'margin': '5px', /*отступ контейнера input cнаружи, со всех сторон*/
                'font-size': '20px' /*размер шрифта для данных, внутри input*/
            })

        }


        /* создаем контейнер из элемнета div
       создаем элемент span, добавляем в текущий контейнер,
         а затем добавляем в элемент span, какое-то значение
         nameField - значение полученное извне, указывает название текщего поля ввода*/
        function createDivWithSpanAndInput() {

            /*назвнание класса для текущего конейнера созданного
            из элемента div
            nameInput - значение атрибута 'name' создаваемого поля ввода*/
            selectorDivCurrent = selectorDivForInput + nameInput;

            /*селектор указывающий на тег span в текущем контейнре */
            var selectorSpanCurrent = '.' + selectorDivCurrent + ' ' + 'span';

            createDivForInput(selectorDivCurrent, '.' + selectorForInputFields);
            /*созадем контейнер для span и input*/
            createTxtIntoSpanTag(selectorDivCurrent, selectorSpanCurrent);
            /*созадем span и указываем значение*/
            createInput(selectorDivCurrent, 'span');
            /*создаем input после созданного ранее span*/

        }


        /*Создаем заголовок модального окна*/
        function createTitleBox() {

            /*создаем элемент без селектора, внутри указаного контейнера*/
            createElemWithAttrClassIntoAnotherElem(null, '<h2>', '.' + selectorInnerModalBox);

            /*добавляем текст внутрь элемента, который не имеет селектора */
            addTextIntoElem(selectorInnerModalBox, 'h2', options.title);

            $('.' + selectorInnerModalBox + ' ' + 'h2').css({
                'margin-top': '-10px',
                'color': '#341EB0',
                'font-size': '15px',
                'font-style': 'italic',
                'text-decoration': 'underline',
                'text-align': 'center'

            })
        }


        /*Фукнция создания элемента, внутри другого элемента. Создаваемому элементу,
        назначается атрибут class со значением.
        selector - значение атрибута class, для создаваемого элемента
        elem -  создаваемый элемент
        toElemSelector - указание селектора контейнера, внутри которого создается текущий элемент*/
        function createElemWithAttrClassIntoAnotherElem(selector, elem, toElemSelector) {
            $(elem, {class: selector}).appendTo(toElemSelector);
        }

        /*создание элемента <a> c аттрибутами href и class*/
        function createElemReferenceIntoElem(selector, elem, toElemSelector) {
            $(elem, {class: selector, href: '#'}).appendTo(toElemSelector);
        }

        /*создание элемента, после указанного элемента*/
        function createElemAndInsertAfter(selector, elem, afterElem) {

            $(elem, {class: selector}).insertAfter(afterElem);
        }

        /*добавление текста в выбранный элемент, не имеющий атрибута class
         selector - указывающий на контейнер, внутри которого находится элемент,
         без атрибута class
         elemTarget - контейнер без без атрибута class внутри контейнера, имеющего селектор
       */
        function addTextIntoElem(selector, elemTarget, text) {
            var h2 = '.' + selector + ' ' + elemTarget;
            $(h2).html(text);
        }

        /* функция рисует блок div, который будет рисоваться на странице, 
        а качестве основного узла для него, выступает тег body*/
        function addBblockPage() {

            createElemWithAttrClassIntoAnotherElem(selectorBlockPage, '<div>', 'body');
        }

        /*создание модального окна
        options.title - Заголовок модального окна (указан в опциях, выше)
        options.description - текст в модальном окне
        'selectorForModalBox' - Селектор для div, который является контейнером для модального окна
        'selectorModalBoxClose' - элемент <a>, который содержит ссылку-изображение
        'selectorInnerModalBox' - внутренний div, рабочая часть модального окна
        */
        function addPopupBox() {

            var selector = '.' + selectorInputValidate;
            /*создаем контейнер, внутри контейнера блокирующей странцы.
            Данный контейнер описывает создание модального окна.*/
            createElemWithAttrClassIntoAnotherElem(selectorForModalBox, '<div>', '.' + selectorBlockPage);

            /*создаем контейнер, который содержит элемент <a> и распологается внутри контейра,
            с селектором selectorForModalBox*/
            createElemReferenceIntoElem(selectorModalBoxClose, '<a>', '.' + selectorForModalBox);

            /*создаем элемент после указанного контейнера*/
            createElemAndInsertAfter(selectorInnerModalBox, '<div>', '.' + selectorModalBoxClose);

            /* Создаем заголовок модального окна*/
            createTitleBox();

            createDivIntoInnerModalBox();
            /*создание контейнера для flex-элементов, контейнер создается
                        во внутренней части модального окна*/

            createDivWithSpanAndInput();
            /*создание контейнера 'div' и внутри его создание 'span' и 'input' */

            setExtendForPluginsMask();
            /* применение сторонних плагинов, к текущему полю ввода*/

            defineMaskForData(selector);
            /*определяем тип пользовательских данных*/

            workWithFieldInput();
            /*обрабатываем введенное значение в поле ввода*/

            /* Слушатель события click по элементу, который находится в селекторе selectorModalBoxClose*/
            $('.' + selectorModalBoxClose).on('click', function () {

                closeModalBox();
            });

        }

        /*конец функции addPopupBox()*/


        /*установка дополнительных настроек от сторонних плагинов, в зависимости от типа данных текущей ячейки*/
        function setExtendForPluginsMask() {

            var selector = '.' + selectorInputValidate;
            /*поле ввода*/

            switch (dataType) {

                case currencyType : {
                    setAliasForCurrency(selector);
                    /* задаем пользовательскую маску для поля ввода*/
                    $(selector).inputmask({alias: "byn"});
                    break;
                }
                case telType : {
                    maskPhone(selector);
                    /* зажаем пользовательскую маску для поля телефона*/
                    break;
                }
                case dateType : {
                    // mountCalendar(selector);
                    break;
                }

                default: {
                    console.log("Данный тип класса не определен!")
                }
            }
        }

        /*определяем необходимые данные для валидаци, в зависимости
        от типа данных текущей ячейки и ставим слушатель на поле ввода
        с этими настройками*/
        function defineMaskForData(selector) {

            if (dataType !== '' || dataType !== undefined) {

                switch (dataType) {

                    case nameType : {

                        validateValueWithRegularExp(selector, options.validCharactersForLetters,
                            errorMessage.validCharactersForLettersInfo);
                        break;
                    }

                    case loginType: {
                        /*валидация ввода логина в режиме реального времени*/
                        validateValueWithRegularExp(selector, options.validCharactersForLogin,
                            errorMessage.validCharactersForLoginInfo);
                        break;
                    }
                    case commonTextType: {
                        /*валидациия вводимых значений в поле ввода, в режиме работы реального времени
                        * (то есть в момент воода*/
                        validateValueWithRegularExp(selector, options.validCharactersForCommonText,
                            errorMessage.validCharactersForCommonTextInfo);
                        break;
                    }

                    case digitType: {
                        /*валидациия вводимых значений в поле ввода, в режиме работы реального времени
                        * (то есть в момент воода*/
                        validateValueWithRegularExp(selector, options.validCharactersForDigit,
                            errorMessage.validCharactersForDigitInfo);
                        break;
                    }

                    case creditCardType: {
                        /*валидациия вводимых значений в поле ввода, в режиме работы реального времени
                        * (то есть в момент воода*/
                        validateRealTimeCreditCardNumber(selector);
                        break;
                    }

                    default:
                        console.log('defineMaskForData - тип данных не определен')
                }
            }
        }


        /* валидация ввода символов в поле ввода*/
        function validateValueWithRegularExp(selector, regularExp, errorMessage) {

            /*функция each перебирает все символы в текущей точке на странице*/
            return $(selector).each(function () {

                /*регулярное выражение, по которому идет проверка символов, отбираются все
                символы, кроме указанных симовлов*/
                var regExpOne = new RegExp(regularExp);


                /* bind() прикрепляет обработчик к событию*/
                $(selector).bind("input ", function () {

                    /*если соответсвие найдено, тогда получаем - true, если
                            соответсвие не найдено, тогда возвращается -1 (false)*/
                    var isValid;

                    /*удаление контейнера, в котором содержаться сообщения об предыдущей ошибке*/
                    $('.' + selectorErrorClass).remove();

                    var currentValueInput = $(selector).val();
                    /*получение значений из текущего поля ввода*/

                    isValid = regExpOne.test(currentValueInput);

                    /*проверяем, если переменная isMatch содержит
                    соответствия, тогда это воспринимается как true*/
                    if (isValid) {
                        /*удаляется последний символ*/
                        var inputAccumulation = currentValueInput.replace(regExpOne, '');

                        /* отфильтрованные символы  возвращаются в текущую точку,
                        то есть в input (поле ввода)*/
                        $(selector).val(inputAccumulation);

                        showErrorMessage(errorMessage, selector);
                    }

                    validateInputMaxLengthSymbols(selector);
                });
            });
        }


        /*валидация номера кредитной карты во время ввода в поле ввода*/
        function validateRealTimeCreditCardNumber(selector) {

            var events = "input change blur keyup";

            var lengthCreditCardNumber = options.lengthCreditCardNumber;

            var reg = options.validCharactersForCreditCard;
            /*все кроме цифр*/

            var regGroupDigit = options.maskForCreditCardNumber;

            return $(selector).each(function () {

                $('.' + selectorErrorClass).remove();

                $(selector).on(events, function () {

                    /*получаем фильтр, по которому будем убирать разделители*/
                    var regFilter = options.maskFilterDigit;
                    var regValid = new RegExp(options.validCharactersForDigit);

                    /*убираем разделители знаков, если есть*/
                    var valueCurrent = this.value.replace(regFilter, '');

                    /*сравниваем по маске текущее значение и елси оно не подходит,
                    * тогда поле ввода очищается.*/
                    var isValid = regValid.test(valueCurrent);

                    if (isValid) {
                        showErrorMessage(errorMessage.digits, selector);
                    }

                    /*удаляются все символы, кроме цифр, а также любые символы, после достижения указанного предела*/
                    var cardCode = this.value.replace(reg, '').substring(0, lengthCreditCardNumber);

                    if (cardCode !== '') {
                        cardCode = cardCode.match(regGroupDigit).join(" ");
                    } else {
                        cardCode = '';
                    }

                    this.value = cardCode;
                    /*записываев в поле ввода, проверенный символ (если он там есть)*/
                });
            });
        }


        /*Функция описывает работу с полем ввода,
        которое появляется над редактируемой ячейкой
         selectorInputCurrent - указывает на текущее поле ввода (элемент input)
         trigger() - этот метод запускается, если поймано событие 'focus' (фокусировка в текущей точке документа),
         он позволяет выполнить все функции обработчиков событий, присоединенных к выбранному 
         элементу для данного типа события ('focus' ). Кроме того, получаем доступ к контексту 
         текущей точки в документе*/
        function workWithFieldInput() {

            var triggerFocus = $('.' + selectorInputValidate).trigger('focus');

            var enterKey = 13;
            /* код клавиши Enter*/
            var escapeKey = 27;
            /* код клавиши Esc*/


            $(triggerFocus).on({

                'keyup': function (e) {
                    if (Number(e.which) === enterKey) {
                        $(this).trigger('check');

                    } else if (Number(e.which) === escapeKey) {

                        closeModalBox();
                       // $(this).trigger('closeEditable');
                        /*закрытие модального окна*/
                    }
                },

                'check': function () {

                    valueForInput = $(this).val().trim();
                    chooseValidator(valueForInput, this);
                    /*валидация поля ввода*/

                },

                /*событие - потеря фокуса*/
                '-blur': function () {
                    $(this).trigger('closeEditable');
                },

                /* Пользовательское событие, которое когда сработает, когда метод trigger(),
                принудительно вызовет данное событие*/
                'closeEditable': function () {
                    closeModalBox();
                },

                /* пользовательское событие, если оно сработало (на него может переключить 
                  метод trigger('saveEditable') из какой-нибудь точки документа)
                  trim() - удаляет пробелы с обоих концов значения contextCellEditCurrent - 
                  точка в документе, куда нужно записать данные */
                'saveEditable': function () {

                    /*читаются данные из текущего контекста (то есть поля ввода)
                     и помещаются в переменную*/
                    valueForInput = $(this).val().trim();

                    /*указывает текущую ячейку и записываем туда значение*/
                    $(contextCellEditCurrent).html(valueForInput);

                    /*переключаемся на пользовательское событие, 
                    где в контекст текущей точки в документе, записываем изменное значение из переменной content*/
                    $(this).trigger('closeEditable');
                }
            });
        }


        /*выбор валидатора в зависимости от поля ввода*/
        function chooseValidator(valueFromInput, selector) {

            switch (dataType) {

                case emailType : {
                    validateInputEmail(valueFromInput, selector);
                    /* валидация email */
                    break;
                }
                case currencyType : {
                    validateInputCurrency(valueFromInput, selector);
                    /* валидация валюты */
                    break;
                }
                case telType : {
                    validateInputTelephone(valueFromInput, selector);
                    /* валидация телефона*/
                    break;
                }
                case dateType : {
                    validateInputDate(valueFromInput, selector);
                    /* валидация телефона*/
                    break;
                }

                case loginType: {
                    validateMaskWithRegularForEnter(selector, options.maskForLogin.trim(),
                        errorMessage.inputLogin);
                    break;
                }

                case commonTextType: {
                    validateMaskWithRegularForEnter(selector, options.maskForCommonText.trim(),
                        errorMessage.inputCommonText);

                    break;
                }

                case nameType : {

                    validateMaskWithRegularForEnter(selector, options.maskForLetters.trim(),
                        errorMessage.exampleLetters);
                    break;
                }


                case digitType : {

                    validateMaskWithRegularForEnter(selector, options.maskForDigit.trim(),
                        errorMessage.inputDigits);
                    break;
                }

                case creditCardType : {

                    validateMaskWithRegularForEnter(selector, options.maskForCreditCardNumberFinal.trim(),
                        errorMessage.number);
                    break;
                }

                default: {
                    console.log("Данный тип класса не определен!")
                }
            }
        }


        /*проверка маски ввода данных, с помощью регулярного выражения, после нажатия клавиши Enter*/
        function validateMaskWithRegularForEnter(selector, regularExpMask, errMessage) {

            var regExpFinalMaskReg = new RegExp(regularExpMask);
            /*финальная маска для ввода логина*/

            var value = $(selector).val();
            /*получаем текущее значение из поля ввода*/

            if (dataType === creditCardType) {
                value = value.replace(options.validCharactersForCreditCard, '');
            }

            var isFinalMask = regExpFinalMaskReg.test(value);

            var isMaxNumber;
            /*ограничение на максимальный ввод числа*/
            isMaxNumber = validateInputMaxDigit(selector);

            if (isMaxNumber === undefined) {
                isMaxNumber = false;
            }

            var isMinNumber;
            /*ограничение на максимальный ввод числа*/
            isMinNumber = validateInputMinDigit(selector);

            if (isMinNumber === undefined) {
                isMinNumber = false;
            }


            var isLittleSymbols;

            isLittleSymbols = validateInputMinLengthSymbols(selector);
            /* проверим на минимальный ввод символов*/

            if (isLittleSymbols === undefined) {

                isLittleSymbols = false;
            }

            var isManySymbols;
            isManySymbols = validateInputMaxLengthSymbols(selector);

            /* проверим на максимальный ввод символов*/
            if (isManySymbols === undefined) {
                isManySymbols = false;
            }

            /*если ошибка есть, тогда выход из функции*/
            if (isLittleSymbols || isManySymbols) {
                return;
            }

            if (isMaxNumber || isMinNumber) {
                return;
            }

            if (!isFinalMask) {

                $(selector).val(value.replace(/^.*$/, ''));
                /*удаление всех символов*/
                showErrorMessage(errMessage, selector);
                return;
            }

            $(selector).trigger('saveEditable');
            /* сохранение полученных данных*/
        }

        /* валидация значения в текущем поле ввода*/
        function validateInputEmail(valueFromInput, selector) {

            var regExp = new RegExp(options.regExpEmail);
            var isValid = regExp.test(valueFromInput);

            if (!isValid) {
                showErrorMessage(errorMessage.email, selector);
                console.log(" messages - " + errorMessage.email);
            } else {
                $(selector).trigger('saveEditable');
                /* сохранение полученных данных*/
            }
        }

        /*валидация валюты*/
        function validateInputCurrency(valueFromInput, selector) {

            /*преобразовываем строковое представление числа в числовое*/
            var sum = Number(parseStringHaveDigits(valueFromInput));
            var maxNumber = Number(parseStringHaveDigits(maxNumberSumOptions));
            var minNumber = Number(parseStringHaveDigits(minNumberSumOptions));

            console.log('rangeSumOptions =' + rangeSumOptions.length);

            var rangeSumArr = rangeSumOptions;
            var rangeSumArrLenght = rangeSumArr.length;
            /*длина массива rangeSum*/

            /* например, если  условие ( sum > maxNumber && maxNumber !==0 ) выполняется,
            тогда выполниться данный case, то есть тогда (sum : true:), указывает
            оператору switch, что нужно выполнить код в данном case     */

            switch (sum) {
                case ( sum > maxNumber && maxNumber !== 0 ) ? sum : true:
                    showErrorMessage(errorMessage.maxSum, selector);
                    return;
                case sum < minNumber ? sum : true:
                    showErrorMessage(errorMessage.minSum, selector);
                    return;
                /*проверка диапазона значений*/
                case (sum < rangeSumArr[0] || sum > rangeSumArr[1]) && (rangeSumArrLenght !== 0) ? sum : true:
                    showErrorMessage(errorMessage.rangeSum, selector);
                    return;
            }

            $(selector).trigger('saveEditable');
            /* сохранение полученных данных*/

            console.log('val=' + sum);
        }

        /*Валидация телефонного номера*/
        function validateInputTelephone(valueFromInput, selector) {

            var telephone = parseStringHaveDigits(valueFromInput);

            if (numberDigitsPhone > telephone.length) {
                showErrorMessage(errorMessage.telephone, selector);
                simulationBlurClickFocusClick(selector);
                /*имитация событий для текущего элемента*/

            } else {
                $(selector).trigger('saveEditable');
                /* сохранение полученных данных*/
            }
        }


        /*применение стилей для вывода ошибок*/
        function showErrorMessage(errMessage, selector) {

            /*создание контейнера для ошибки и вывод ошибки*/
            styleForInputErrClear();
            /*очистка стиля от предыдущей ошибки*/
            $('.' + selectorErrorClass).remove();
            /* Удаляем дополнительный класс из элемента input*/

            $(selector).removeClass(selectorErrStyleInput);
            $('<label>', {
                class: selectorErrorClass
            }).insertAfter(selector).html(errMessage);
            styleForInputErr();
            /* стиль для поля ввода, в случае ошибки*/
            styleForErrorLabel();
        }

        /*функция для удаления лишних символов из строки содержащей число*/
        function parseStringHaveDigits(sourceStr) {
            var result = '';
            var reg = /^\D+/g;
            /*регулярное выражение, распознает не цифры*/

            var digitsOnly = sourceStr.toString().replace(reg, "");
            /*извлекаем цифры, могут остаться пробелы и другие символы*/

            switch (digitsOnly) {

                case digitsOnly.match(/\(+\)+/g) ? digitsOnly : true:
                    result = digitsOnly.toString().replace(/\(+\)+/g, '');
                    /* оставляем только цифры, удаляем скобки*/
                    result = result.toString().replace(/\s+/g, '');
                    /* оставляем только цифры, удаляем пробелы*/
                    result = result.toString().replace(/[-+]/g, '');
                    /* оставляем только цифры, удаляем '-'*/
                    break;

                case digitsOnly.match(/\s+/g) ? digitsOnly : true:
                    result = digitsOnly.toString().replace(/\s+/g, '');
                    /* оставляем только цифры, удаляем пробелы*/
                    break;

                case digitsOnly.match(/\.+/g) ? digitsOnly : true:
                    result = digitsOnly.toString().replace(/\.+/g, '');
                    /* оставляем только цифры, удаляем точки*/
                    break;

                case digitsOnly.match(/^\d+/g) ? digitsOnly : true:
                    result = digitsOnly.toString().replace(/\s+/g, '');
                    /* оставляем только цифры, удаляем пробелы*/
                    break;

                default:
                    console.log("Используемый разделитель не определен или неизвестен!");

            }

            return result;
        }


        /*Создание маски для нескольких видов телефонных операторов*/
        function maskPhone(selector) {

            /*перебираем полученные значения, и в зависимости от значения,
            применяем соответсвующую маску ввода*/
            switch (dataAttributeCountry) {
                case Rus:
                    $(selector).mask("+7 (999)  999-99-99");
                    numberDigitsPhone = 11;
                    break;
                case Usa:
                    $(selector).mask("+1 (999)  999-99-99");
                    numberDigitsPhone = 11;
                    break;
                case By:
                    /*напишем ограничение ввода цифр в определенные позиции*/
                    $.mask.definitions['z'] = '^[0]';
                    /*ввод только 0*/
                    $.mask.definitions['f'] = '^[2,4]';
                    /*ввод только 2 или 4*/
                    $.mask.definitions['n'] = '^[4,5,9]';
                    /*ввод только 4, 5 или 9*/

                    $(selector).mask("+375 (zfn)  999-99-99");
                    numberDigitsPhone = 13;
                    break;
                default:
                    console.log("Такой код страны не предусмотрен в данном плагине.");
                    $(selector).trigger('closeEditable'); /* сохранение полученных данных*/
            }
        }


        /*установить календарь на поле ввода*/
        function mountCalendar(selector) {

            $(selector).datepicker({

                showOtherMonths: true, /*заполнение пустых ячеек датами предыдущего и последующего месяцев*/
                selectOtherMonths: true, /*даты соседних месяцев становяться доступнами для выбора*/

                /*Включается скрытая кнопка, по нажатии на которую,
                * происходит переход на текущий месяц, если календарь показывал
                * месяц, отличный от текущего*/
                showButtonPanel: true,

                /*показ опций выбора года и месяца*/
                changeMonth: true, /*непосредственная навигации по месяцам*/
                changeYear: true, /*непосредственная навигации по годам*/
                /*указывает на максимальный выбор даты, которую можно выбрать - задан текущий день*/
                maxDate: '+0m +0w',
                dateFormat: options.formatDate, /*формат вывода даты ('dd-mm-yy')*/

                // minDate: '01-01-2018', /*минимальная дата, возможна для выбора*/
                yearRange: '-2:+0', /*указывает на то, что календарь можно просмотреть на 2 года назад*/

                showWeek: false, /*показывать номера недель*/
                weekHeader: '', /*заголовок для номеров недель, если включена опция 'showWeek'("№ недели")*/

                numberOfMonths: 1, /*количество месяцев, одновременно отображаемых в календаре */

                /*показывает пиктограмму, по щелчку по ней, открывается календарь,
                а также при установке фокуса на поле ввода*/
                showOn: "both",
                buttonImage: options.pathToButtonImage,
                buttonImageOnly: true, /*указывает на изображение, вместо вспомогательной кнопки*/
                buttonText: "Select date", /*если изображение отсутствует, то видна данная надпись*/
                showAnim: "clip", /*анимация*/
                disabled: true, /*Приостанавливает работу виджета Datepicker для базового элемента*/
                onSelect: function () {
                    $(selector).trigger('focus');
                }
            });

            var langDatepicker;
            /* значение локали браузера клиента*/
            if (langLocaleBrowser === 'ru') {
                langDatepicker = 'ru';
            } else {
                langDatepicker = '';
            }

            /*установка локализации календаря*/
            $(selector).datepicker(
                $.datepicker.setDefaults($.datepicker.regional[langDatepicker])
            );
        }


        /*валидация даты и корректировка вывода сообщения об ошибке.
         * значок календаря будет обтекать блок вывода ошибки, справа */
        function validateInputDate(valueFromInput, selector) {

            if (valueFromInput.length === 0) {

                showErrorMessage(errorMessage.required, selector);
                $('.' + selectorErrorClass).css({
                    'float': 'left',
                    'width': '50%',
                    'margin-left': '50%'
                });

                simulationBlurClickFocusClick(selector);
                /*имитация событий для текущего элемента*/

            } else if (valueFromInput.length < options.numberCharactersDate) {

                showErrorMessage(errorMessage.date, selector);
                $('.' + selectorErrorClass).css({
                    'width': '50%',
                    'margin-left': '50%',
                    'float': 'left'
                });

                simulationBlurClickFocusClick(selector);
                /*имитация событий для текущего элемента*/

            } else {
                $(selector).datepicker('hide');
                /*скрытие календаря*/
                $(selector).trigger('saveEditable');
                /* сохранение полученных данных*/
            }
        }


        /*проверка огрничения на ввод символов.*/
        function validateInputMaxLengthSymbols(selector) {

            var currentValueInput = $(selector).val();

            var lengthCurrentString = currentValueInput.length;

            var max;
            /*максимальное ограничение ввода символов*/
            var maxFromRange;

            if (maxLengthSymbol !== undefined) {

                max = Number(maxLengthSymbol);

                if (max !== 0) {

                    switch (lengthCurrentString) {

                        case lengthCurrentString > max ? lengthCurrentString : true:
                            showErrorMessage(errorMessage.maxLength, selector);
                            return true;
                        default:
                            console.log("Ограничений на максимальную величину - не определено.")
                    }
                }
            }

            if (rangeLengthSymbol !== undefined) {

                if (rangeLengthSymbol[1] !== undefined) {

                    maxFromRange = rangeLengthSymbol[1];
                }
            }

            if (maxFromRange !== 0) {
                switch (lengthCurrentString) {

                    case  lengthCurrentString > maxFromRange ? lengthCurrentString : true:
                        showErrorMessage(errorMessage.rangeLength, selector);
                        return true;
                    default:
                        console.log("Ограничений из диапазона на максималную величину - не определено.")
                }
            }
        }

        /*валидация минимального ввода символов*/
        function validateInputMinLengthSymbols(selector) {

            var isError = false;

            var valueFromInput = $(selector).val();

            var lengthCurrentString = valueFromInput.length;
            /*длина введенного слова*/

            var min;
            /*максимальное ограничение ввода символов*/
            var minFromRange;

            if (minLengthSymbol !== undefined) {

                min = Number(minLengthSymbol);

                if (min !== 0) {

                    switch (lengthCurrentString) {

                        case lengthCurrentString < min ? lengthCurrentString : true:
                            showErrorMessage(errorMessage.minLength, selector);
                            isError = true;
                            return true;
                        default:
                            console.log("Ограничений на максимальную величину - не определено.")
                    }
                }
            }

            if (rangeLengthSymbol !== undefined) {

                if (rangeLengthSymbol[0] !== undefined) {

                    minFromRange = rangeLengthSymbol[0];

                }
            }

            if (minFromRange !== 0) {
                switch (lengthCurrentString) {

                    case lengthCurrentString < minFromRange ? lengthCurrentString : true:
                        showErrorMessage(errorMessage.rangeLength, selector);
                        isError = true;
                        return true;
                    default:

                        console.log("Ограничений из диапазона на максимальную величину - не определено.")
                }
            }

            if (isError) {
                $(selector).trigger('saveEditable');
            }
            /* сохранение полученных данных*/
        }


        /*проверка ограничения на ввод числа.*/
        function validateInputMaxDigit(selector) {

            var currentValueInput = $(selector).val();

            /*хранит значение из поля ввода*/
            var resultNumber = Number(parseStringHaveDigits(currentValueInput));


            /*максимальное ограничение числа*/
            var max;

            var maxFromRange;

            if (maxDigit !== undefined) {

                max = Number(maxDigit);

                if (max !== 0) {


                    switch (resultNumber) {

                        case resultNumber > max ? resultNumber : true:
                            showErrorMessage(errorMessage.max, selector);
                            return true;
                        default:
                            console.log("Ограничений на максимальную величину - не определено.")
                    }
                }
            }

            if (rangeDigit !== undefined) {

                if (rangeDigit [1] !== undefined) {

                    maxFromRange = rangeDigit [1];
                }
            }

            if (maxFromRange !== 0) {
                switch (resultNumber) {

                    case  resultNumber > maxFromRange ? resultNumber : true:
                        showErrorMessage(errorMessage.range, selector);
                        return true;
                    default:
                        console.log("Ограничений из диапазона на максималную величину - не определено.")
                }
            }
        }


        /*проверка ограничения на ввод числа.*/
        function validateInputMinDigit(selector) {

            var currentValueInput = $(selector).val();

            /*хранит значение из поля ввода*/
            var resultNumber = Number(parseStringHaveDigits(currentValueInput));


            /*максимальное ограничение числа*/
            var min;

            var minFromRange;

            if (minDigit !== undefined) {

                min = Number(minDigit);

                if (min !== 0) {


                    switch (resultNumber) {

                        case resultNumber < min ? resultNumber : true:
                            showErrorMessage(errorMessage.min, selector);
                            return true;
                        default:
                            console.log("Ограничений на максимальную величину - не определено.")
                    }
                }
            }

            if (rangeDigit !== undefined) {

                if (rangeDigit [0] !== undefined) {

                    minFromRange = rangeDigit [0];
                }
            }

            if (minFromRange !== 0) {
                switch (resultNumber) {

                    case  resultNumber < minFromRange ? resultNumber : true:
                        showErrorMessage(errorMessage.range, selector);
                        return true;
                    default:
                        console.log("Ограничений из диапазона на максималную величину - не определено.")
                }
            }
        }


        /*описывает закрытие модального окна*/
        function closeModalBox() {
            /*указывает на то, что родительский div, который и есть данное
              модальное окно, плавано исчезает, а затем удаляется.*/
            $(this).parent().fadeOut().remove();

            /*после элемента, который содержал модальное окно,
              происходит плавное исчезновение элемента, в котором находилось модальное окно,
              и который блокировал всю страницу.*/
            $('.' + selectorBlockPage).fadeOut().remove();
        }

        return this;
    };

})(jQuery);









