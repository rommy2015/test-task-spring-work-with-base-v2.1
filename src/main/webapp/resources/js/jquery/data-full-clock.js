/*плагин выводить полную дату (день недели - число - месяц - год),
* показывает электронные часы.
* Вывод даты или времени, можно отключить
* Требуемые библиотеки:
   - jQuery-3.3.1
   */

(function ($) {

    $.fn.dataFullAndClock = function (prop) {

        /*хранит локаль текущего браузера*/
        var langLocaleBrowser = getLangClient();

        /*текущей массив сообщений*/
        var infoArr = defineLangOfMessage(langLocaleBrowser);

        /*селектор точки входа*/
        var selectorSource = 'body';

        /*Параметры по умолчанию:*/

        var options = $.extend({

            selectorSource: selectorSource, /*точка в документе, от которой будет строится вывод*/
            showDate: true, /*отображатть дату?*/
            showClock: true /*отображать часы?*/

        }, prop);

        /*точка входа*/
        this.fadeIn('normal', function () {
            createElemForDateAndClock(options.showDate, options.showClock, infoArr);
        });

        /*создание блоков для вывода часов и для даты в полном формате*/
        function createElemForDateAndClock(showDate, showClock, infoArr) {

            if (showDate && showClock) {
                createDateFull();
                createClock();
            } else {
                switch (true) {

                    case showDate:
                        createDateFull();
                        break;
                    case showClock:
                        createClock();
                        break;
                    default:
                        console.log(infoArr.disableClockAndDateOutput);

                }
            }
        }

        /* создаем блок с выводом полной даты*/
        function createDateFull() {

            /*основной контейнер для даты*/
            var selectorDateDiv = 'dateDiv';

            var selectorNameDayOfWeek = 'nameDayOfWeek';
            var selectorNumberDay = 'numberDay';
            var selectorMonth = 'nameMonth';
            var selectorYear = 'year';

            /*контейнеры для отображения даты*/
            createElemIntoAnotherElem(selectorDateDiv, '<div>', options.selectorSource);
            createElemIntoAnotherElem(selectorNameDayOfWeek, '<span>', '.' + selectorDateDiv);
            createElemIntoAnotherElem(selectorNumberDay, '<span>', '.' + selectorDateDiv);
            createElemIntoAnotherElem(selectorMonth, '<span>', '.' + selectorDateDiv);
            createElemIntoAnotherElem(selectorYear, '<span>', '.' + selectorDateDiv);

            /*стили для контейнера с датой */
            applyStyle('.' + selectorDateDiv, {
                'font-style': 'italic',
                'font-family': 'Calibri',
                'font-size': '16px',
                'margin-bottom': '0'
            });

            applyStyle('.' + selectorNameDayOfWeek, {
                'padding-right': '10px',
                'color': '#739C12',
                'font-weight': 'bold'
            });

            applyStyle('.' + selectorNumberDay, {
                'padding-right': '7px',
                'color': '#FF0080'
            });

            applyStyle('.' + selectorMonth, {
                'padding-right': '10px',
                'color': '#7472CB',
                'font-weight': 'bold'
            });

            applyStyle('.' + selectorYear, {
                'font-weight': ' 600'
            });

            setDate('.' + selectorNameDayOfWeek, '.' + selectorNumberDay, '.' + selectorMonth, '.' + selectorYear);

        }

        function setDate(selectorNameDayOfWeek, selectorNumberDay, selectorMonth, selectorYear) {
            /*определяем массивы имен для месяцев и дней недели*/

            var monthNames;
            var dayNames;
            switch (langLocaleBrowser){

                case 'ru':
                    monthNames = ["января", "февраля", "марта", "апреля",
                        "мая", "июня", "июля", "августа", "сентября",
                        "октября", "ноября", "декабря"];
                    dayNames = ["воскресенье", "понедельник", "вторник", "среда",
                        "четверг", "пятница", "суббота"];
                    break;

                case 'en':
                    monthNames = ["January", "February", "March", "April",
                        "May", "June", "July", "August", "September",
                        "October", "November", "December"];
                    dayNames = ["Sunday", "Monday", "Tuesday", "WednesDay",
                        "Thursday", "Friday", "Saturday"];
                    break;

                default:
                    console.log("Такая локаль не установлена!");

            }




            /* создаем новый объект для хранения даты*/
            var newDate = new Date();

            /* извлекаем текущую дату*/
            var currentDate = newDate.getDate();
            /*полученную дату, помещаем в новый объект*/
            newDate.setDate(currentDate);

            var dateFull = getDateFull(monthNames, dayNames, newDate);

            /* выводим день, число, месяц и год*/
            $(selectorNameDayOfWeek).html(dateFull.nameOfDayWeek);
            $(selectorNumberDay).html(dateFull.numberOfDate);
            $(selectorMonth).html(dateFull.nameMonth);
            $(selectorYear).html(dateFull.fullYear);
        }

        /*получаем полную дату*/
        function getDateFull(monthNames, dayNames, newDate) {

            var day = getDay(newDate, dayNames);
            /*получаем текущее число*/
            var numberOfDate = newDate.getDate();
            var nameMonth = getNameMonth(newDate, monthNames);
            var fullYear = newDate.getFullYear();

            /*Ассоциативный массив*/
            return {
                'nameOfDayWeek': day,
                'numberOfDate': numberOfDate,
                'nameMonth': nameMonth,
                'fullYear': fullYear
            };
        }

        /*получаем день недели*/
        function getDay(newDate, dayNames) {

            var newDateDay = newDate.getDay();
            /*получаем день недели, по индексу, полученному
            * от newDate.getDay()*/
            return dayNames[newDateDay];

        }


        /*получаем имя месяца*/
        function getNameMonth(newDate, monthNames) {

            var month = newDate.getMonth();

            return monthNames[month];
        }


        /* Создаем часы */
        function createClock() {

            var selectorClockDiv = 'clockDiv';
            var selectorHours = 'spanHours';
            var selectorMinutes = 'spanMinutes';
            var selectorSeconds = 'spanSeconds';

            /*контейнеры для отображения часов*/

            createElemIntoAnotherElem(selectorClockDiv, '<div>', options.selectorSource);
            createElemIntoAnotherElem(selectorHours, '<span>', '.' + selectorClockDiv);
            createElemIntoAnotherElem(selectorMinutes, '<span>', '.' + selectorClockDiv);
            createElemIntoAnotherElem(selectorSeconds, '<span>', '.' + selectorClockDiv);

            applyStyle('.' + selectorClockDiv, {
                'margin-top': '1%',
                'margin-left': '15%',
                'font-family': 'Calibri',
                'color': 'blue',
                'font-size': '17px',
                'font-weight': 'bold'

            });

            applyStyle('.' + selectorHours, {
                'color': 'red'
            });

            applyStyle('.' + selectorMinutes, {
                'color': 'blue'
            });

            applyStyle('.' + selectorSeconds, {
                'color': '#7F7F7F'
            });

            digitalWatch(selectorHours, selectorMinutes, selectorSeconds);
        }


        function digitalWatch(selectorHours, selectorMinutes, selectorSeconds) {

            setInterval(function () {
                /* создаем новый объект для хранения секунд*/
                var seconds = new Date().getSeconds();
                /*добавляем отсутствующий ноль*/
                $('.' + selectorSeconds).html(( seconds < 10 ? "0" : "" ) + seconds);
            }, 1000);

            setInterval(function () {
                /*создаем новый объект для хранения минут*/
                var minutes = new Date().getMinutes();
                /* добавляем отсутствующий ноль*/
                $('.' + selectorMinutes).html(( minutes < 10 ? "0" : "" ) + minutes + ' : ');
            }, 1000);

            setInterval(function () {
                /*создаем новый объект для хранения часов*/
                var hours = new Date().getHours();
                /* добавляем отсутствующий ноль*/
                $('.' + selectorHours).html(( hours < 10 ? "0" : "" ) + hours + ' : ');
            }, 1000);

        }


        /*Фукнция создания элемента, внутри другого элемента. Создаваемому элементу,
          назначается атрибут class со значением.
          nameNewClass - значение атрибута class, для создаваемого элемента
          elem -  создаваемый элемент
          toElemSelector - указание селектора контейнера, внутри которого создается текущий элемент*/
        function createElemIntoAnotherElem(nameNewClass, elem, toElemSelector) {
            $(elem, {class: nameNewClass}).appendTo(toElemSelector);
        }


        /*Применение стиля*/
        function applyStyle(selector, style) {
            $(selector).css(style);
        }

        /*получить локаль текущего клиента*/

        function getLangClient() {

            /*получение данных о локали браузера
           * window.navigator.browserLanguage - for IE
           * */

            var localOfClientRu = "Текущая локаль клиента : ";
            var localOfClientEn = "Current client Locale : ";
            var lang = window.navigator.languages ? window.navigator.languages [0] : null;
            lang = lang || window.navigator.language || window.navigator.browserLanguage || window.navigator.userLanguage;
            if (lang.indexOf('-') !== -1) {
                lang = lang.split('-')[0];
            }

            if (lang.indexOf('_') !== -1) {
                lang = lang.split('_')[0];
            }

            if (lang === 'ru') {
                console.log(localOfClientRu + lang);
            } else if (lang === 'en') {
                console.log(localOfClientEn + lang);
            } else {
                console.log('The current client locale is not defined!')
            }

            return lang;

        }

        /*определяем язык сообщений об ошибке*/
        function defineLangOfMessage(langLocaleBrowser) {

            /*определяем язык сообщений об ошибке*/

            if (langLocaleBrowser === 'ru') {

                return createArrMessages(langLocaleBrowser);

            }
            if (langLocaleBrowser === 'en') {

                return createArrMessages(langLocaleBrowser);
            }
        }


        /*создание массива сообщений*/
        function createArrMessages(lang) {

            /*Создаем массив сообщений для ошибок.*/
            if (lang === 'ru') {
                return {
                    disableClockAndDateOutput: ("Отключено создание часов, а также вывод даты в полном формате !")
                };
            }
            if (lang === 'en') {
                return {
                    disableClockAndDateOutput: ("Clock creation is disabled, as well as date display in full format !")
                }
            }
        }

        return this;

    };

})(jQuery);