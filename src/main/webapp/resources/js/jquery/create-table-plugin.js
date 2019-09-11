/**
 * Плагин описывает создание таблиц в автоматическом режиме и наполняет
 * их данными, которые получает от сервера.
 *  Данные запрашиваются через ajax-функцию.
 *   Адрес для запроса данных, данный плагин получает при вызове
 *   этого плагина из веб-документа.
 * v.4.0- 11.02.2019
 *
 * селекторы для страницы
 *      nameTable = 'tableFirst';
 nameTableHead = nameTable + 'Head';
 nameTableBody = nameTable + 'Body';
 divMessage = 'divMessage';
 divErrMessage = 'divErrMessage';
 *
 * зависимости:
 *  jquery-ui.css,
 *  datatables.min.css, - стили для плагина DataTables
 *  DataTables-1.10.18/images/, - рисунки для стилей плагина DataTables
 *  jquery-3.3.1.min.js,
 *  jquery-ui.js,
 *  datatables.min.js, - плагин DataTables, для работы с табилицей
 *  dataTables.scrollResize.js, - плагин для DataTables
 *  datepicker-ru.js, - календарь
 *  jquery.inputmask.bundle.js, - маска для валюты
 *  jquery.maskedinput.js, - маска для телефона
 *  jquery.modal-box-cell-edit.js - редактирование ячейки
 *
 */

(function ($) {

    /*основная часть плагина*/
    $.fn.createTablePlugin = function (prop) {

        /*хранит локаль текущего браузера*/
        var langLocaleBrowser = '';

        /*получение сведений о локали браузера*/
        getLang();

        var nameTable = 'tableFirst';
        var nameTableHead = nameTable + 'Head';
        var nameTableBody = nameTable + 'Body';
        var divMessage = 'divMessage';
        var divErrMessage = 'divErrMessage';
        var divFooter = 'divFooter';

        /*оболочка для текущей страницы*/
        var selectorWrapperMain = 'wrapperPageMain';
        var selectorWrapper = 'wrapperPage';
        var selectorHeader = "headerIntoWrapperPage";

        var selectorHeaderInfo = 'headerInfo';

        var selectorDivMessageTips = 'divMessageTips';
        /*обертка блока подсказок*/
        var selectorDivShowFewTips = 'divShowFewTips';

        /*создаем общий flex-контейнер для кнопок*/
        var selectorButtonFlex = 'selectorButtonFlex';
        /*flex-контейнер оболочка, для кнопки delete*/
        var selectorButtonDivFlexDelete = 'buttonDeleteDivFlex';


        /*flex-контейнер оболочка, для кнопки update*/
        var selectorButtonDivFlexUpdate = 'buttonUpdateDivFlex';
        /*создание кнопки update*/
        var selectorButtonUpdate = 'buttonUpdate';


        /*создание кнопки delete*/
        var selectorButtonDelete = 'buttonDelete';

        /*селектор подсказки редактирования таблицы*/
        var selectorTipEditCell = 'tipEditCell';

        /*селектор подсказки выделения строки таблицы*/
        var selectorTipSelectRow = 'tipSelectRow';

        /*селектор подсказки управления полосами прокрутки*/
        var selectorTipControlScrollBar = 'tipControlScrollBar';

        /*назначается выделенной строке*/
        var selectorSelectedRow = 'selected';

        /*определяем язык сообщений об ошибке*/
        var messageInfo = '';

        var messagesRu = '';
        var messagesEn = '';

        var messageRuForPluginDataTables = {};

        setLocalizationForDataTablesPlugin();

        /*создаем сообщения и определяем язык сообщений для текущего клиента*/
        defineLangOfMessage();

        /*атибуты стиля тега 'table'*/
        var styleAttributesForTable = {};

        /*атибуты стиля тега 'th'*/
        var styleAttributesForTh = {};

        /*атибуты стиля тега 'td'*/
        var styleAttributesForTd = {};

        /*уменьшение и увеличение времени анимации текста*/
        var durationUp = 1;
        var durationDown = 3000;

        var pathButtonImageDatePicker = '';
        var pathToImgCloseModalBox = '';

        /*Параметры по умолчанию:
        * selectorForCreateTable - указываем селектор контейнера, внутри которого создается
        * элемент;
        * arrTh - массив заголовков*/
        var options = $.extend({

            isUsedDataTables: true, /*использовать плагин DataTables ?*/

            selectorForCreateTable: 'body',

            classTableName: nameTable,
            classTableHeadName: nameTableHead,
            classTableBodyName: nameTableBody,
            messageForPluginDataTables: messageRuForPluginDataTables,

            arrTh: [], /*['id', 'имя', 'возраст', 'login']*/
            arrDataAttrName: [], /*[ {'data-dataType': 'dateType'}, {data-dataType': 'nameType','data-maxLength': '7',}]*/

            styleForTable: styleAttributesForTable,
            styleForTh: styleAttributesForTh,
            styleForTd: styleAttributesForTd,

            urlDeleteData: '', /*адрес ресурса, на который отправляется запрос на удаление данных*/
            urlUpdateData: '', /*адрес ресурса на обновление данных*/
            urlGetData: '', /*адрес, для запроса данных от сервера*/
            selectorErrMessageFromServer: '', /*селектор, указывающий на вывод сообщений об ошбике*/
            nameTable: 'The table name must be specified here',
            nameLevelAccess: messageInfo.titleLevelAccessMessage, /*контейнер для указания уровня доступа*/
            nameElemForOwner: '', /*имя элемента на странице, который указывает на имя текущего пользователя*/
            nameOwner: '', /*имя владельца текущего запроса*/
            nameLevelAccessValue: 'description of current a level access', /*здесь указывается уровень доступа*/
            columnDefsForDataTables: [], /*управление столбцами (при использовании DataTables-plugin)*/
            pagingForDataTables: true, /*включение постраничного вывода таблицы*/
            lengthCreditCardNumber: 19, /*количество цифр в номере кредитной карты*/
            arrStyleForWidthTh: {}, /*массив значения ширины для колонок*/
            arrStyleTdEmail: {}, /*массив Ситлей для колонки с классом `tdEmail`*/
            arrStyleTdPassword: {}, /*массив Ситлей для колонки с классом `tdPassword`*/
            arrStyleTdCurrency: {}, /*массив Ситлей для колонки с классом `tdCurrency`*/
            arrStyleTdTelephone: {},
            arrStyleTdData: {},
            arrStyleTdCreditNumber: {},
            imgCloseForModalBox: pathToImgCloseModalBox, /*путь к значку-изображения для закрытия окна*/
            pathToButtonImage: pathButtonImageDatePicker /*путь к изображению кнопки календаря*/
        }, prop);

        /*заголовок над таблицей*/
        var captionAboveTable;

        /*имя элемента для обозначения имени текущего владельца странцы*/
        var nameElemForOwner;

        /*заголовоки для колонок таблицы*/
        var captionsForColumnsTable;

        /*указывает на все заголовки колонок таблицы*/
        var selectorTh;
        selectorTh = '.' + options.classTableHeadName + ' ' + 'th';

        /*указывает на все строки таблицы*/
        var selectorTr;
        selectorTr = '.' + options.classTableHeadName + ' ' + 'tr';

        /*указывает на все ячейки таблицы*/
        var selectorTd;
        selectorTd = '.' + options.classTableBodyName + ' ' + 'td';

        /*указывает текущий уровень доступа клиента и его имя*/
        var selectorUserDataFlex = 'userDataFlex';
        var selectorLevelAccess = 'levelAccess';
        var selectorOwner = 'selectorOwner';


        /*flex-block для верхнего информационного блока*/
        var selectorInfoHeaderFlex = 'infoHeaderFlex';

        var selectorDateAndClock = 'dateAndClock';

        /*указывает имя таблицы*/
        var selectorNameTable = 'nameTable';

        /*этот селектор нужен для получения доступа к контексту
        * структуры талицы, в случае применения плагина DataTables*/
        var selectorTableForDataTables;


        /*тут "this" - это элемент дерева DOM;
        fadeIn - указывает на перевод элементов из скрытого состояния в видимое.
        'normal' - указывает на появление элементов с нормальной скоростью.
         *  */
        this.fadeIn('normal', function () {

                captionAboveTable = getCaptionFromArr(options.nameTable);
                nameElemForOwner = getNameElemForOwnerFromArr(options.nameElemForOwner);

                captionsForColumnsTable = getCaptionsForColumnsTable(options.arrTh);

                applyStyle('*', {
                    'margin': '0',
                    'padding': '0'
                });

                /*обертка для всей страницы*/
                createElemIntoAnotherElem(selectorWrapperMain, '<div>', 'body');
                createElemIntoAnotherElem(selectorWrapper, '<div>', '.' + selectorWrapperMain);

                applyStyle('.' + selectorWrapper, {
                    'display': 'flex',
                    'flex-direction': 'column',
                    'height': '100%'
                });

                /*создание header*/
                createHeader();

                /*создание информационного flex-контейнера, вверху страницы*/
                createInfoContainerHeader();

                /*вывод даты и времени*/
                callDateAndClockOutput();

                /*информационные блоки над страницей*/
                makeInfoBoxesForTable();

                /*создаем контейнер, в котором будет строится таблица*/
                createElemIntoAnotherElem(options.selectorForCreateTable, '<div>', '.' + selectorWrapper);
                applyStyle('.' + options.selectorForCreateTable, {
                    'margin-left': '10px',
                    'margin-right': '10px'
                });

                /*создаем 'table'*/
                createElemIntoAnotherElem(options.classTableName, '<table>',
                    '.' + options.selectorForCreateTable);
                applyStyle('.' + options.classTableName, options.styleForTable);

                /*создаем 'tHead'*/
                createElemIntoAnotherElem(options.classTableHeadName, '<thead>',
                    '.' + options.classTableName);
                /*создаем 'tr'*/
                createElemIntoAnotherElem(null, '<tr>', '.' + options.classTableHeadName);

                /*Создаем заголовки
                * captionsForColumnsTable -  одномерный массив, содержит имена заголовков таблицы
                * arrDataAttributesName - - 2-х мерный массив, содержит ассоциативные массивы, в качестве
                * элеметнов, которые содержат имена атрибутов со значениями. */

                createTh(captionsForColumnsTable, options.arrDataAttrName, selectorTr);
                applyStyle(selectorTh, options.styleForTh);

                /*проверка заполнения массива стилей для колонок таблицы*/
                checkArrOfStylesForTh('.' + options.classTableName);

                /*создаем тег 'tbody' classTableBodyName*/
                createElemWithAttrsAndInsertAfter('<tbody>', {class: options.classTableBodyName}, '.' +
                    options.classTableHeadName);

                /*контейнер для контейнеров divMessage и divErrMessage*/
                createElemWithAttrsAndInsertAfter('<div>', {class: divFooter},
                    '.' + options.selectorForCreateTable);

                createElemIntoAnotherElemWithAttributes('<div>', {class: divMessage},
                    '.' + divFooter);

                /*создание подсказок*/
                createTips('.' + divMessage);

                createElemWithAttrsAndInsertAfter('<div>', {class: divErrMessage}, '.' + divMessage);

                /*адрес для запроса данных от сервера*/
                var url = options.urlGetData;

                /* запрашиваем даннные от сервера, перебираем и
                 * рисуем ячейки таблицы*/
                if (url !== '') {
                    getDataFromTable(url, '.' + nameTable);
                } else {
                    throw URIError("This URL is not available !");
                }

                if (url === undefined) {
                    throw URIError("This URL is not available !");
                }

                /*фиксирование заголовка страницы*/
                fixedSelectorInfoHeaderFlex('.' + selectorHeaderInfo, '.' + selectorInfoHeaderFlex);

                hideFromScrollBar('.' + options.selectorForCreateTable);

                /*фиксирование нижней части страницы*/
                fixedSelectorFooter('.' + divFooter);

                /*проверка выделения строк*/
                fetchRows("." + nameTable);


            }
        );

        /* header */
        function createHeader() {

            createElemFirstIntoParentElem('<div>', selectorHeader, '.' + selectorWrapper);

            fillHeaderData(selectorHeader);
        }

        /*наполняем заголовок страницы*/
        function fillHeaderData(selector) {

            createElemIntoAnotherElemWithAttributes('<a>', {href: "/index"},
                '.' + selectorHeader);
            $("." + selectorHeader + ' ' + "a").html("HOME");

            applyStyle("." + selectorHeader, {
                    'margin-top': '5%',
                    'padding-left': '25px',
                    'height': '10px',
                    'padding-bottom': '1%',
                    'border-bottom': '1px dotted blue'

                }
            );
        }


        /*проверка заполнения массива стилей для колонок таблицы;
        *проверяем подключен ли плагин DataTables,
        * а также проверяем, что количество столбцов, совпадает с
         * количеством элементов, в массиве стилей для столбцов*/
        function checkArrOfStylesForTh(selector) {

            if (!options.isUsedDataTables) {

                var row = $(selector).find('thead > tr > th');

                var quantityTh = row.length;
                /*количество колонок*/
                var lengthArr = options.arrStyleForWidthTh.length;
                /*длина массива стилей для колонок*/

                if (quantityTh !== lengthArr) {
                    throw RangeError("The length of the `arrStyleForWidth` array does not match the number of columns.");
                }
            }

        }

        /* перебор одномерного массива, получение в качестве элементов
         ассоциативные массивы и получение из ассоциативный массивов в качестве
          значения - одномерных массивов, которые содержат заголовки
          для текущей таблицы;
         result - содержит полученное значение из массива;
         */
        function getCaptionsForColumnsTable(arr) {
            var result = [];


            /*внешний цикл: перебирает элементы одномерного массива*/
            $.each(arr, function (index, associate) {

                /*внутренний цикл: перебирает элементы ассоциативного массива*/
                $.each(associate, function (name, value) {

                    switch (name) {
                        case 'arrThRu':
                            if (langLocaleBrowser === 'ru') {
                                result = value;
                            }
                            break;
                        case 'arrThEn':
                            if (langLocaleBrowser === 'en') {
                                result = value;
                            }
                            break;
                        default:
                            console.log(messageInfo.langCaptionErr);
                    }
                });

            });

            return result;

        }

        /*получение локализованного названия элемента, под которым указывается
        * имя владельца текущей странцы*/
        function getNameElemForOwnerFromArr(arr) {

            var result = '';

            /*внешний цикл: перебирает элементы одномерного массива*/
            /*внешний цикл: перебирает элементы одномерного массива*/
            $.each(arr, function (index, associate) {

                /*внутренний цикл: перебирает элементы ассоциативного массива*/
                $.each(associate, function (name, value) {

                    switch (name) {
                        case 'nameElemRu':
                            if (langLocaleBrowser === 'ru') {
                                result = value;
                            }
                            break;
                        case 'nameElemEn':
                            if (langLocaleBrowser === 'en') {
                                result = value;
                            }
                            break;
                        default:
                            console.log(messageInfo.langCaptionErr);
                    }
                });
            });

            return result;
        }

        /* перебор одномерного массива, получение в качестве элементов
         ассоциативные массивы и получение из ассоциативный массивов значения;
         result - содержить значение из массива;
         */
        function getCaptionFromArr(arr) {

            var result = '';

            /*внешний цикл: перебирает элементы одномерного массива*/
            /*внешний цикл: перебирает элементы одномерного массива*/
            $.each(arr, function (index, associate) {

                /*внутренний цикл: перебирает элементы ассоциативного массива*/
                $.each(associate, function (name, value) {

                    switch (name) {
                        case 'captionRu':
                            if (langLocaleBrowser === 'ru') {
                                result = value;
                            }
                            break;
                        case 'captionEn':
                            if (langLocaleBrowser === 'en') {
                                result = value;
                            }
                            break;
                        default:
                            console.log(messageInfo.langCaptionErr);
                    }
                });
            });

            return result;
        }


        /*создание подсаказок*/
        function createTips(selectorDivMessage) {

            /*создание информационных подсказок*/
            createElemIntoAnotherElemButton('<div>', selectorDivMessageTips, selectorDivMessage);

            $('.' + selectorDivMessageTips).css('margin-left', '15px');

            toggleOfTips('.' + selectorDivMessageTips);

            /*контейнер-обертка для подсказок*/
            createElemIntoAnotherElemButton('<div>', selectorDivShowFewTips, '.' + selectorDivMessageTips);

            /*создаем сами посказки*/
            makeFewTips(selectorDivShowFewTips);
            $('.' + selectorDivShowFewTips).css('display', 'none');
        }

        /*создаем сами посказки*/
        function makeFewTips(selectorDivShowFewTips) {
            /*создание подсказок*/
            createElemIntoAnotherElem(selectorTipEditCell, '<p>', '.' + selectorDivShowFewTips);
            createElemIntoAnotherElem(selectorTipSelectRow, '<p>', '.' + selectorDivShowFewTips);
            createElemIntoAnotherElem(selectorTipControlScrollBar, '<p>', '.' + selectorDivShowFewTips);

            $('.' + selectorTipEditCell).html(messageInfo.tipEditCell);
            $('.' + selectorTipSelectRow).html(messageInfo.tipSelectRow);
            $('.' + selectorTipControlScrollBar).html(messageInfo.tipControlScrollBar);


            applyStyle('.' + selectorDivShowFewTips, {
                'color': '#A8A8A8',
                'font-size': '14px'
            });
        }


        /**************** Переключатель подсказок *****************/


        /*переключатель подсказок*/
        function toggleOfTips(selector) {

            var selectorCheckbox = 'checkboxToggleLabel';
            /*селектор элемента 'label'*/

            var selectorInputCheckbox = 'inputCheckbox';
            /*'элемент 'input'*/

            /*элемент 'div', каркас для стилизации переключателя*/
            var selectorDivBaseToggle = 'divBaseToggle';

            /*для переключателя в положении 'off'*/
            var selectorToggleOff = 'toggleOff';

            /*для переключателя в положении 'off'*/
            var selectorToggleOn = 'toggleOn';

            var selectorShowTips = 'showTips';

            /*создаем элемент 'label'*/
            createLabelForCheckbox(selector, selectorCheckbox);

            /*создаем элемент 'input' типа 'checkbox', внутри элемента
            * 'label'*/
            createInputIntoLabel('.' + selectorCheckbox, selectorInputCheckbox);


            /*создаем каркас переключателя*/
            createFrameWork('.' + selectorCheckbox, selectorDivBaseToggle);

            /*создаем настройку для переключателя в положении 'off'*/
            createToggleOff('.' + selectorCheckbox, selectorToggleOff);

            /*создаем настройку для переключателя в положении 'on'*/
            createToggleOn('.' + selectorCheckbox, selectorToggleOn);

            /*обработка событий переключения*/
            switchTips(
                '.' + selectorInputCheckbox,
                '.' + selectorToggleOn,
                '.' + selectorToggleOff,
                '.' + selectorShowTips
            );

            /*создание текста для подсказок*/
            createDivOfTextOfTips('.' + selectorCheckbox, selectorShowTips);
        }

        /* Создание элемента 'label'.
         selectorTo - селектор элемента, внутри которого создается элемент
         nameClass - имя селектора, для создаваемого элемента
         */
        function createLabelForCheckbox(selectorTo, nameClass) {
            createElemIntoAnotherElemButton('<label>', nameClass, selectorTo);
        }

        /*создаем элемент 'input' типа 'checkbox', внутри элемента
         * 'label', то есть 'очищаем' площадку для перключателя*/
        function createInputIntoLabel(selectorTo, nameClass) {
            createElemIntoAnotherElemButton('<input>', nameClass, selectorTo);
            /*добавляем атрибут 'type' и добавляем название типа*/
            $('.' + nameClass).attr('type', 'checkbox');

            makeStyleCheckboxInput('.' + nameClass);
        }


        /*ситилизация для элемента 'input' типа 'checkbox';
        * 'checkbox' становится невидимым*/
        function makeStyleCheckboxInput(selector) {

            applyStyle(selector, {

                'position': 'absolute',
                'z-index': '-1',
                'opacity': '0',
                'margin': '10px 0 0 10px'
            });
        }


        /*создаем каркас переключателя*/
        function createFrameWork(selectorTo, nameClass) {

            createElemIntoAnotherElemButton('<div>', nameClass, selectorTo);
            makeStyleBaseOfToggle('.' + nameClass);
        }


        /*создаем базовый стиль переключателя
        * стилизация надписи, в контейнере 'div';
        'position': 'relative'- элемент с относительным
        позиционированием.
        'padding' - задает смещение элемента, относительно
        его позиции, а на его месте остается пустое пространство.
        'padding' - последнее значение задает не только смещение слева,
        но и влияет на ширину видимого элемента;
        'transition' - позволяет делать плавные переходы между
        двумя значениями какого-либо CSS свойства
        **/
        function makeStyleBaseOfToggle(selector) {

            applyStyle(selector, {
                'position': 'absolute',
                'padding': '0 0 0 45px',
                'cursor': 'pointer',
                'top': '5px',
                'left': '5px',
                'height': '20px',
                'border-radius': '13px',
                'background': '#CDD1DA',
                'box-shadow': 'inset 0 2px 3px rgba(0,0,0,.2)',
                'transition': '.2s'
            });
        }

        /*создаем настройку для переключателя в положении 'off'*/
        function createToggleOff(selectorTo, nameClass) {

            createElemIntoAnotherElemButton('<div>', nameClass, selectorTo);
            makeStyleToggleOff('.' + nameClass);
            $('.' + nameClass).addClass('off');
        }

        /*стиль для переключателя, в положении 'off'*/
        function makeStyleToggleOff(selector) {

            applyStyle(selector, {

                'position': 'absolute',
                'top': '6.4px',
                'left': '6px',
                'width': '17px',
                'height': '17px',
                'border-radius': '45px',
                'background': '#FFFFFF',
                'box-shadow': '0 2px 5px rgba(0,0,0,.3)',
                'transition': '.2s'

            });

        }

        /*создаем настройку для переключателя в положении 'on'*/
        function createToggleOn(selectorTo, nameClass) {
            createElemIntoAnotherElemButton('<div>', nameClass, selectorTo);
            makeStyleOn('.' + nameClass);

        }

        /*обработка событий переключения*/
        function switchTips(selectorInput, selectorOn, selectorOff, selectorShowTips) {

            $(selectorInput).on('click', function () {

                /*для первого значения в атрибуте 'class*/
                var selectorOfFirstClass = 'div' + selectorOff;

                var hasClass = $(selectorOfFirstClass).hasClass('off');

                if (hasClass) {
                    $('.' + selectorDivShowFewTips).css('display', 'inline');
                    /*показать блок подсказок*/
                    $(selectorOn).css('display', 'inline');
                    $(selectorOfFirstClass).removeClass('off');
                    $(selectorOff).css('display', 'none');
                    $(selectorShowTips).html(messageInfo.hideTips).css('color', '#4950C7');
                } else {
                    $('.' + selectorDivShowFewTips).css('display', 'none');
                    $(selectorShowTips).html(messageInfo.showTips).css('color', '#B8B8B8');
                    $(selectorOn).css('display', 'none');
                    $(selectorOff).addClass('off');
                    $(selectorOff).css('display', 'inline');
                }
            });
        }


        /*стиль для состояния переключателя 'on'*/
        function makeStyleOn(selector) {

            $(selector).css({
                'background': '#9FD468',
                'left': '30px',
                'position': 'absolute',
                'top': '6.4px',
                'width': '17px',
                'height': '17px',
                'border-radius': '45px',
                'transition': '.2s',
                'box-shadow': 'inset 0 2px 3px rgba(0, 0, 0, .2), 0 0 0 3px rgba(255, 255, 0, .7)',
                'display': 'none' /*Временно скрываем селектор*/
            });
        }

        /*создание текста для подсказок*/
        function createDivOfTextOfTips(selectorTo, nameClass) {
            createElemIntoAnotherElemButton('<div>', nameClass, selectorTo);
            makeStyleTips('.' + nameClass);
        }

        /*стиль для текста подсказок*/
        function makeStyleTips(selector) {

            $(selector).html(messageInfo.showTips);

            applyStyle(selector, {

                'padding-left': '55px',
                'padding-top': '5px',
                'color': '#B8B8B8',
                'cursor': 'pointer',
                'font-style': 'italic'
            });
        }


        /**************** Переключатель подсказок *****************/


        /*скрыть полосы прокрутки;
         * 'scrollbar-width' - позволяет установить максимальную величину
         * полос прокуртки, когда они показывается (Firefox);
         * -ms-overflow-style - для Microsoft, настройка полос прокуртки*/
        function hideFromScrollBar(selectorWrapperTable) {

            /*Для Chrome - скрытие полос прокрутки*/
            var style = $('<style> ::-webkit-scrollbar{width: 0;}</style>');
            $(selectorWrapperTable).append(style);


            /*работает для IE и Firefox.
            * Не работатет в Chrome*/
            applyStyle(selectorWrapperTable, {
                'width': 'auto',
                'height': '55%',

                'overflow-y': 'auto',
                'overflow-x': 'auto',
                'scrollbar-width': 'none', /* Firefox */
                '-ms-overflow-style': 'none', /* IE */
                'margin-bottom': '10%'
            });
        }


        /* фиксирование верхнего информационного блока;
         * selector - обертка верхнего информационного блока
         * */
        function fixedSelectorInfoHeaderFlex(selector, infoHeaderFlex) {

            $(selector).css({
                'height': '9%', /*высота основного контейнера*/
                'border-bottom': '1px dotted #FFA953',
                'margin-bottom': '0.5%'
            });

            $(infoHeaderFlex).css({
                'position': 'fixed',
                'top': '0',
                'left': '0',
                'right': '0',
                'z-index': '9999',
                'background': 'white'
            });
        }


        /*фиксирование footer*/
        function fixedSelectorFooter(selector) {

            applyStyle(selector, {
                'background': 'white',
                'border-top': '2px dotted #FFA953',
                'position': 'fixed',
                'left': '0',
                'bottom': '0',
                'height': '25%',
                'width': '100%',
                'margin-top': '1%',
                'overflow-y': 'auto',
                'overflow-x': 'auto',
                'scrollbar-width': 'none', /* Firefox */
                '-ms-overflow-style': 'none' /* IE */
            });
        }

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

        /****информационный контейнер вверху страницы****/


        /*создание информационного flex-контейнера, вверху страницы*/
        function createInfoContainerHeader() {

            /*общий контейнер для верхнего блока*/
            //  createElemIntoAnotherElem(selectorHeaderInfo, '<div>', '.' + selectorWrapper);
            createElemFirstIntoParentElem('<div>', selectorHeaderInfo, '.' + selectorWrapper);

            var selectorInfoHeader = '.' + selectorInfoHeaderFlex;

            createElemFirstIntoParentElem('<div>', selectorInfoHeaderFlex, '.' + selectorHeaderInfo);


            createElemIntoAnotherElem(selectorDateAndClock, '<div>', selectorInfoHeader);

            applyStyleFlexColumnSpaceBetweenInfo(selectorInfoHeader);

            applyStyle(selectorInfoHeader, {

                'margin-left': '0.5%',
                'margin-right': '0.5%',
                'margin-bottom': '2%'
            });

            applyStyle('.' + selectorDateAndClock, {
                'width': '20%',
                'margin-top': '5px'
            });

        }

        /*вызов плагина для показы даты и времени*/
        function callDateAndClockOutput() {
            $('.' + selectorWrapper).dataFullAndClock({

                /*указанный селектор, должен быть создан на странице,
                * тогда внутри него будет строится вывод даты и времени*/
                selectorSource: '.' + selectorDateAndClock,
                showDate: true, /*отображатть дату?*/
                showClock: true /*отображать часы?*/
            });

        }


        /*оформление описания таблицы (заголовок и информационный блок*/
        function makeInfoBoxesForTable() {

            createElemIntoAnotherElem(selectorUserDataFlex, '<div>', '.' + selectorInfoHeaderFlex);

            applyStyle('.' + selectorUserDataFlex, {
                'margin-top': '0.5%',
                'margin-bottom': '0.5%',
                'margin-right': '0.5%',

                '-webkit-flex-direction': 'row',

                'flex-direction': 'row'
            });

            /*создание контейнера для хранения уровня доступа*/
            createElemWithHtml('<div>', {
                class: selectorLevelAccess,
                html: options.nameLevelAccess
            }, '.' + selectorUserDataFlex);

            applyStyle('.' + selectorLevelAccess, {
                'font-family': 'Calibri',
                'font-style': 'italic',
                'color': '#FF8000',
            });

            createElemWithHtml('<span>', {
                html: options.nameLevelAccessValue
            }, '.' + selectorLevelAccess);

            applyStyle('.' + selectorLevelAccess + ' ' + 'span', {
                'color': '#009900'
            });
            /*-----------------------------------*/

            /*создание контейнера для хранения имени пользователя*/
            createElemWithHtml('<div>', {
                class: selectorOwner,
                html: nameElemForOwner + " : "
            }, '.' + selectorUserDataFlex);

            applyStyle('.' + selectorOwner, {
                'font-family': 'Calibri',
                'font-style': 'italic',
                'color': '#345eff',
                'padding-top': '0'
            });

            createElemWithHtml('<span>', {
                html: options.nameOwner
            }, '.' + selectorOwner);

            applyStyle('.' + selectorOwner + ' ' + 'span', {
                'color': '#753399'
            });


            /*создание контейнера для названия таблицы*/
            createElemWithHtml('<div>', {
                class: selectorNameTable,
                html: captionAboveTable
            }, '.' + selectorWrapper);

            applyStyle('.' + selectorNameTable, {
                'margin-top': '1%',
                'margin-bottom': '10px',
                'font-family': 'Adventure',
                'color': '#993300',
                'font-size': '30px',
                'text-align': 'center',
                'border-bottom': '1px dotted #FFA953'
            });
        }

        /****Окончание - информационный контейнер вверху страницы****/

        /*****Разбор полученного JSON и рисование таблицы с данными****/


        /* Метод срабатывает в случае успешного получения данных от сервера,
        * и начинает рисовать таблицу с данными, и подключать плагины для
        * данной таблицы;
        * Происходит перебор json-объекта
        * data - json-объект (коллекция строк таблицы)
        * index - номер элемента в json-массиве (соответствует
        * одной строке табилицы)
        * row - строка из json-объекта, которая содержит данные
        * для ячеек*/
        function searchDataFromTable(data, selectorTableList) {

            $(".tableFirstBody").empty();

            $.each(data, function (index, row) {

                addRow(row, selectorTableList, index);

            });

            /*применить для таблиц стили по умолчанию или подлючить плагин DataTables*/
            isAttachDataTablesOrDefaultSettings(selectorTableList);

            if (options.isUsedDataTables) {
                /*Получаем контекст таблицы, в случае подключения плагина DataTables*/
                var $td = selectorTableForDataTables.$('td');

                /*подключаем плагин редактирования ячеек*/
                $td.modalBoxCellEdit({
                    /*длина номера кредитной карты*/
                    imgCloseForModalBox: options.imgCloseForModalBox,
                    pathToButtonImage: options.pathToButtonImage,
                    lengthCreditCardNumber: options.lengthCreditCardNumber
                });


                /*проверка выделения строк*/
               // fetchRows(selectorTableForDataTables);

            } else {
                $(selectorTableList + ' ' + 'td').modalBoxCellEdit({
                    imgCloseForModalBox: options.imgCloseForModalBox,
                    pathToButtonImage: options.pathToButtonImage,
                    lengthCreditCardNumber: options.lengthCreditCardNumber
                });

                /*проверка выделения строк*/
               // fetchRows(selectorTableList);
            }
        }

        /*выборка нескольких строк, для удаления или обновления данных;
        * если был щелчок по строке, тогда идет анализ
        * строк, на предмет того, выделена ли хоть одна строка,
        * или выделение со строки было снято*/
        function fetchRows(table) {
            /*создание контейнера для кнопок в контейнере divMessage*/
            createContainerForButtons(divMessage);

            var tableContext;

            if (options.isUsedDataTables) {
                tableContext = table;
            } else {
                tableContext = $(table);
            }

            /*отслеживание редактирования ячейки;
            * если контейнер с кнопкой `обновить` отстуствует, тогда
            * создаем его*/
            tableContext.on('dblclick', 'tr', function () {

                var selectorUpdate = '.' + selectorButtonDivFlexUpdate;
                var divFlexUpdate = isElem(selectorUpdate);

                var selectorDelete = '.' + selectorButtonDivFlexDelete;
                var divFlexDelete = isElem(selectorDelete);

                /*если блока кнопки `update` нет тогда создаем, если
                * блок `delete` есть, удаляем*/

                if (divFlexDelete) {
                    $(selectorDelete).remove();
                }

                if (!divFlexUpdate) {
                    createContainerForButtonUpdate(selectorButtonFlex, tableContext);
                }
            });

            tableContext.on('click', 'tr', function (event) {

                event.preventDefault();

                /*проверяем, назначен ли указанный селектор, для текущей строки*/
                var isSelector = $(this).hasClass(selectorSelectedRow);

                /*если текущая строка выделена, значит удаляем с нее стиль*/
                if (isSelector) {
                    $(this).attr('style', '');
                }

                if (!isSelector) {/*если не назначен, добавляем селектор*/

                    /*добавили атрибут класс, со значением*/
                    $(this).addClass(selectorSelectedRow);

                    /*так как текущая строка не выделена, тогда назначаем фон*/
                    applyStyle(this, {
                        'background': '#FFFF66'
                    });

                    var selectorUpdate = '.' + selectorButtonDivFlexUpdate;
                    var divFlexUpdate = isElem(selectorUpdate);

                    var selectorDelete = '.' + selectorButtonDivFlexDelete;
                    var divFlexDelete = isElem(selectorDelete);

                    /*проверяем, создана ли кнопка `delete`, если нет, тогда
                    * создаем, если есть тогда показываем */
                    if (divFlexUpdate) {
                        $(selectorUpdate).remove();
                    }

                    if (!divFlexDelete) {
                        /*создание кнопки для удаления данных*/
                        createContainerForButtonDelete(selectorButtonFlex, tableContext);
                    }

                } else {

                    /*если класс был выделен, значит по данной строке был второй щелчок,
                    * тогда удаляем значение указанного класса из текущей точки*/
                    $(this).removeClass(selectorSelectedRow);

                    /*проверяем, есть ли выделенные строки в таблице*/
                    var isSelectedRow = parseSelectedRow(tableContext);

                    /*если выделенных строк нет, тогда удаляем кнопку 'delete'*/
                    if (!isSelectedRow) {
                        $('.' + selectorButtonDivFlexDelete).remove();
                    }
                }

            });
        }

        /*проверяет, есть ли указанный элемент на текущей странице,
        * елси элемнета нет, тогда возвращаем false,
        * если элемент есть, тогда вернем true*/
        function isElem(selector) {
            /*получаем длину элемента, по указанному селектору*/
            var lengthElem = $(selector).length;

            /*проверяем, существует ли указанный селектор*/
            return lengthElem > 0;

        }

        /*проверка выделенных строк, есть ли они*/
        function parseSelectedRow(table) {

            /*проверяю есть ли указанный класс*/
            var isClassSelected;
            isClassSelected = searchRowsSelected(table);

            return isClassSelected;
        }


        /*анализирует строки в таблице, и производит поиск строк
        * с классом 'selected';
        * если была найдена хоть одна выделенная строка, тогда в точку вызова вовращается
        * true*/
        function searchRowsSelected(table) {

            /*проверяю есть ли указанный класс*/
            var isClassSelected;

            var tableSelector;

            if (options.isUsedDataTables) {
                /*объект таблицы в DOM-структуре*/
                tableSelector = table.$('tbody > tr');
            } else {

                tableSelector = $(table).find('tbody > tr');
            }

            /*Массив json из значений таблицы*/
            var arrayJson = [];

            arrayJson = processingRowsSelected(tableSelector, arrayJson);

            /*если ничено не выделено очищаю переменную */
            if (arrayJson.length === 0) {

                arrayJson = null;
                isClassSelected = false;

            } else {
                isClassSelected = true;
            }
            console.log(arrayJson);

            return isClassSelected;
        }

        /*обработка данных из выделенных строк;
        * indexOf() - ищет по указанному шаблону подстроку в массиве строк*/
        function processingRowsSelected(tableSelector, arrayJson) {
            /*Внешний цикл, добавляет обработаные строки в массив arrayJson*/
            $.each(tableSelector, function (i, val) {

                /*получаем массив ячеек в текущей строке*/
                var tr = val.childNodes;

                /*получаю все значения атрибута class, для текущего тега 'tr'*/
                var classNameTr = val.getAttribute('class');

                var toLowerCaseClassNameTr = classNameTr.toLowerCase();

                /*проверяю есть ли указанный класс `selected`*/
                var isClass = toLowerCaseClassNameTr.indexOf(selectorSelectedRow) + 1;

                /*ассоциативный массив для текущей строки*/
                var arrFromRowCurrent = {};

                /*если текущая строка имеет указанный класс,
                * тогда строка собирается в массив*/
                if (isClass) {
                    var arr = fillArrAssociativeRowOnlyFirstColumn(tr, arrFromRowCurrent);

                    arrayJson.push(arr);
                    $(tr).removeAttr(selectorSelectedRow);
                }

            });

            return arrayJson;
        }


        /*заполнение ассоциативного массива только из
         1-й ячейки , полученой строки*/
        function fillArrAssociativeRowOnlyFirstColumn(tr, arrFromRowCurrent) {

            /*внутренний массив для обработки текущей строки
           * (обрабатываются ячейки)*/
            $.each(tr, function (i, keyValue) {

                /*получаю значение атрибута name, для текущей ячейки*/
                var name = $(keyValue).attr('name');

                /*получаю значение из текущей ячейки;
               *создаю запись в ассоциативном массиве;
               * если это не первая ячейка, тогда - выход из цикла*/
                if (i === 0) {
                    arrFromRowCurrent[name] = $(keyValue).html();

                } else {
                    return false;
                    /*выход из цикла*/
                }

            });

            return arrFromRowCurrent;
        }


        /*заполнение ассоциативного массива из ячеек,
        полученой строки, и возврат массива, в точку вызова
         tr - содержит какую-то строку из таблицы, с ячейками, в которых
         данные;
          - цикл foreach:
          создаем из полученной строки, ассоциативный массив.
                * (обрабатываются ячейки, текущей строки);
                * i - номер ячейки, в текущей итерации;
                * keyValue - контекст, текущей ячейки.
          contextCell - контекст текущей ячейки;
          valueCell - значение текущей ячейки;
          checkDataTypeConvertForServer() - возвращает отформатированное и
          преобразованное значение, если для текущего тип данных, определено форматирование.
          arrFromRowCurrent[name] - помещаем значение ячейки под полученным
          именем
         */
        function fillArrAssociativeRow(tr, arrFromRowCurrent) {

            /*массив с типами данных для столбцов*/
            var arrDataAttrName = options.arrDataAttrName;

            /*длина массива, который содержит data***- атрибуты для столбцов*/
            var lengthArrDataAttributes = arrDataAttrName.length;
            /*длина ассоциативного массива, данные которого помещаются в создаваемую строку*/
            var lengthAssociateArr = Object.keys(tr).length;

            if (lengthArrDataAttributes !== lengthAssociateArr) {
                throw new RangeError("Arrays are not equal, check 'options.arrDataAttrName'");
            }

            var index = 0;
            /*начальный элемент массива с типами данных для столбцов*/

            $.each(tr, function (i, keyValue) {

                var associateArr = arrDataAttrName[index];

                /*получаю значение атрибута name, для текущей ячейки*/
                var name = $(keyValue).attr('name');

                var valueCell;
                valueCell = $(keyValue).html();

                /*получаю значение из текущей ячейки;
                *создаю запись в ассоциативном массиве*/
                arrFromRowCurrent[name] = checkDataTypeConvertForServer(associateArr, valueCell);

                index++;

            });

            return arrFromRowCurrent;
        }

        /***********Преобразование данных определенных типов, перед отправлением на сервер*******/

        /*проверяем элемент массива с типами данных, на предмет
        * определенного типа данных;
        * затем конверитуем согласно маске, для удобного просмотра,
        * сконвертированное значение, возвращаем, для отображения
        * на странице;
        * если тип данных для конвертирования не определен,
        * тогда возвращаем значение не отформатированным.
         * */
        function checkDataTypeConvertForServer(elemement, value) {

            var currency = 'currencyType';
            /*тип данных для денег*/
            var telephone = 'telType';
            /*тип данных для телефонных номеров*/
            var creditCard = 'creditCardType';
            /*тип данных для номера кредитной карты*/

            var nameDataType = getNameDataType(elemement);

            switch (nameDataType) {

                case currency :
                    return parseStrAndConverseToNumber(value);
                case telephone:
                    return parseStrToNumberStr(value);
                case creditCard:
                    return parseStrToNumberStr(value);
                default:
                    return value;

            }
        }

        /*выбираем из строки только числа,
            * перед тем как вернуть в точку вызова результат,
            * проверяем, что результат - имеет тип данных number;
            * parseInt() - преобразование строки в число;
            * num - число*/
        function parseStrAndConverseToNumber(str) {

            var maxNumber = 1999999999999999;
            var strDigitsOnly = str.toString().replace(/\D+/g, '');

            var num = parseInt(strDigitsOnly);

            if (num > maxNumber) {
                throw new RangeError("Calculation of such number is invalid!");
            }

            if (typeof(num) === "number") {

                return num;

            } else {
                throw new TypeError("This is not number!");
            }
        }

        /*перебираем строку, удаляем все кроме цифр*/

        function parseStrToNumberStr(value) {
            return value.replace(/\D+/g, '');
        }


        /*******************************Buttons**************************************/

        /*создание контейнера для кнопок*/
        function createContainerForButtons(selector) {

            var isElem = $('div').is("." + selectorButtonFlex);

            if (!isElem) {
                createElemIntoAnotherElemButton('<div>', selectorButtonFlex, '.' + selector);

                applyStyleFlexColumnSpaceBetweenForButton('.' + selectorButtonFlex);
                applyStyle('.' + selectorButtonFlex, {
                    'margin-top': '2%',
                    'margin-bottom': '2%',

                    '-webkit-flex-direction': 'row',

                    'flex-direction': 'row'
                });
            }

        }

        /*Фукнция создания элемента, внутри другого элемента. Создаваемому элементу,
                   назначается атрибут class со значением.
                   nameNewClass - значение атрибута class, для создаваемого элемента
                   elem -  создаваемый элемент
                   toElemSelector - указание селектора контейнера, внутри которого создается текущий элемент*/
        function createElemIntoAnotherElemButton(elem, nameNewClass, toElemSelector) {
            $(elem, {class: nameNewClass}).appendTo(toElemSelector);

        }


        /*создание контейнера для кнопки 'удаления данных'*/
        function createContainerForButtonDelete(selector, table) {

            createElemIntoAnotherElemButton('<div>', selectorButtonDivFlexDelete, '.' + selector);

            applyStyleFlexColumn('.' + selectorButtonDivFlexDelete);
            applyStyle('.' + selectorButtonDivFlexDelete, {
                'margin-top': '2%',
                'margin-bottom': '2%',

                '-webkit-justify-content': 'center',
                'justify-content': 'center',
                'width': '30%'
            });

            /*Создание надписи, над кнопкой 'delete'*/
            createLabelForDelete(selectorButtonDivFlexDelete);

            /*создание кнопки для удаления*/
            createDeleteButton(selectorButtonDivFlexDelete, table);

        }

        /*Создание надписи, над кнопкой 'delete'*/
        function createLabelForDelete(selector) {

            /*элемент 'label' - надпись над кнопкой*/
            var selectorLabelDelete = 'labelDelete';
            createElemIntoAnotherElemButton('<label>', selectorLabelDelete, '.' + selector);

            var labelDelete = messageInfo.labelDeleteMessage;

            styleForLabelButton(selectorLabelDelete, labelDelete);
        }

        /*создание кнопки для удаления*/
        function createDeleteButton(selector, table) {

            var labelOnButtonDelete = messageInfo.labelOnButtonDelete;

            createButton(selectorButtonDelete, '.' + selector, labelOnButtonDelete);

            applyStyle('.' + selectorButtonDelete, {
                'color': 'white',
                'background': '#FF0099'
            });

            processingOfButtonDelete(table);
        }


        /*функция обрабатывает выделенные строки и собирает данные в
        * массив Json*/
        function processingOfButtonDelete(table) {

            $('.' + selectorButtonDelete).on('click', function () {

                /*При нажатии кнопки, очищаем блок от сообщений с ошибками*/
                $('.' + divErrMessage).empty();

                var tableSelector;
                if (options.isUsedDataTables) {
                    /*объект таблицы в DOM-структуре*/
                    tableSelector = table.$('tbody > tr');
                } else {
                    tableSelector = $(table).find('tbody > tr');
                }


                var arrayJson;

                /*Массив json из значений таблицы*/
                arrayJson = [];
                arrayJson = processingRowsSelected(tableSelector, arrayJson);
                console.log(" удалить -----");
                console.log(arrayJson);

                var urlDelete = options.urlDeleteData;
                /*если массив заполнен, отправляем на сервер*/

                processingValueOfUri(urlDelete);
                if (arrayJson.length !== 0) {
                    sendDataWithAjax(urlDelete, arrayJson);
                }
            });
        }

        /*общий стиль, для тега 'label'*/
        function styleForLabelButton(nameClassForLabel, labelTxt) {

            $('.' + nameClassForLabel).html(labelTxt);
            applyStyle('.' + nameClassForLabel, {

                'font-size': '18px',
                'font-family': 'Calibri',
                'font-weight': '400',
                'font-style': 'italic',
                'color': '#999999',
                'padding-left': '10px',
                'margin-bottom': '5px'
            });
        }

        /*Контейнер для кнопки обновления
        * selector - контейнер в документе, внутри которого
        * создается текущий элемент;
        * table - контекст таблицы, которая управляется плагином DataTable (если он
        * используется) или контекст таблицы (тег `table`)*/
        function createContainerForButtonUpdate(selector, table) {

            createElemIntoAnotherElemButton('<div>', selectorButtonDivFlexUpdate, '.' + selector);

            applyStyleFlexColumn('.' + selectorButtonDivFlexUpdate);
            applyStyle('.' + selectorButtonDivFlexUpdate, {

                'justify-content': 'flex-start',
                'width': '30%'

            });

            /*Создание надписи, над кнопкой 'update'*/
            createLabelForUpdate(selectorButtonDivFlexUpdate);

            /*создание кнопки для обновления*/
            createUpdateButton(selectorButtonDivFlexUpdate, table);

        }

        /*Создание надписи, над кнопкой 'update'*/
        function createLabelForUpdate(selector) {

            /*элемент 'label' - надпись над кнопкой*/
            var selectorLabelUpdate = 'labelUpdate';

            createElemIntoAnotherElemButton('<label>', selectorLabelUpdate, '.' + selector);

            var labelUpdate = messageInfo.labelUpdateMessage;

            /*общий стиль для тега 'label'*/
            styleForLabelButton(selectorLabelUpdate, labelUpdate)
        }

        /*создание кнопки для обновления*/
        function createUpdateButton(selector, table) {

            var labelOnButton = messageInfo.labelOnButtonUpdate;

            createButton(selectorButtonUpdate, '.' + selector, labelOnButton);

            applyStyle('.' + selectorButtonUpdate, {
                'color': 'white',
                'background': '#5F87C5'
            });

            processingOfButtonUpdate(table);
        }

        /*обработка события, нажатия на кнопку `update`*/
        function processingOfButtonUpdate(table) {

            $('.' + selectorButtonUpdate).on('click', function () {

                /*При нажатии кнопки, очищаем блок от сообщений с ошибками*/
                $('.' + divErrMessage).empty();

                var tableSelector;

                if (options.isUsedDataTables) {
                    /*объект таблицы в DOM-структуре*/
                    tableSelector = table.$('tbody > tr');
                } else {
                    tableSelector = $(table).find('tbody > tr');
                }

                /*Массив json из значений таблицы*/
                var arrayJson = [];

                /*Внешний цикл, добавляет обработаные строки в массив arrayJson*/
                $.each(tableSelector, function (i, val) {

                    /*получаем элементы в строке*/
                    var tr = val.childNodes;
                    /*ассоциативный массив для текущей строки*/
                    var arrFromRowCurrent = {};

                    /*если текущая строка имеет указанный класс,
                    * тогда строка собирается в массив*/

                    var arr = fillArrAssociativeRow(tr, arrFromRowCurrent);

                    arrayJson.push(arr)


                });
                console.log("++++++++++++++++++++++++++++++");
                console.log(arrayJson);

                var urlUpdate = options.urlUpdateData;
                processingValueOfUri(urlUpdate);

                if (arrayJson.length !== 0) {
                    sendDataWithAjax(urlUpdate, arrayJson);
                }
            });

        }


        /*Отправка данных на сервер, методом POST
        * sourceDataJson - источник данных, в формате JSON;
        * uri - адрес ресурса;
        * processingValueOfUri(uri) - проверяет, что введен url, если
        * url отсутствует, тогда выбрасывается exception */
        function sendDataWithAjax(uri, sourceDataJson) {

            processingValueOfUri(uri);
            var jsonObj = JSON.stringify(sourceDataJson);

            $.ajax({
                type: "POST",
                url: uri,
                data: jsonObj,
                headers: {
                    'Content-Type': 'application/json'
                },
                success: function () {

                    cancelEventsForDeleteAndUpdate();

                    getDataFromTable(options.urlGetData, '.' + nameTable);
                },
                error: function (error) {

                    messageErr(error, '.' + divErrMessage);
                }
            });
        }

        /** Отмена событий на строках таблицы (для редактирования данных
         * и удаления данных).
         * Также удаление блоков, которые содержат кнопки удаления и обновления*/
        function cancelEventsForDeleteAndUpdate() {

            $('.' + nameTable + ' ' + 'tr').off('click');
            $('.' + nameTable + ' ' + 'tr').off('dblclick');

            var selectorUpdate = '.' + selectorButtonDivFlexUpdate;
            var divFlexUpdate = isElem(selectorUpdate);

            var selectorDelete = '.' + selectorButtonDivFlexDelete;
            var divFlexDelete = isElem(selectorDelete);

            /*если блока кнопки `update` нет тогда создаем, если
            * блок `delete` есть, удаляем*/

            if (divFlexDelete) {
                $(selectorDelete).remove();
            }

            if (divFlexUpdate) {
                $(selectorUpdate).remove();
            }
        }

        /*проверка наличия адреса ресурса*/
        function processingValueOfUri(uri) {

            if (uri === '' || uri === undefined) {
                throw new SyntaxError(messageInfo.uriAddress);
            }

        }

        /*тестовый json ошибок*/
        /*        var jsonErr = [
                    {
                        'theme': 'База данных',
                        'reason': 'Подключение к базе данных недоступно'
                    },
                    {
                        'theme': 'Запрос данных',
                        'reason': 'Запрашиваемые данные отсутсвуют'
                    },
                    {
                        'theme': 'Сервер',
                        'reason': 'Сервер не доступен'
                    }
                ];*/

        /****Контейнер для вывода ошибок - начало***/


        /*общий стиль для заголовка контейнера с ошибками*/
        function applyStyleForHeadContainerOfErr(divErrMessage) {

            /*В случае ошибки, убираем кнопки*/
            $('.' + selectorButtonFlex).empty();

            /* Зaголовок для блока с ошибками*/
            createElemWithHtml('<p>', {
                html: "Ошибки:"
            }, divErrMessage);

            applyStyle(divErrMessage, {
                'color': 'red',
                'font-family': 'Calibri'
            });

            applyStyle(divErrMessage + ' ' + 'p', {
                'font-size': '20px',
                'padding-left': '2%',
                'text-decoration': 'underline',
                'width': '35px'
            });

        }

        /*разбор ошибок и вывод их в указанном месте, с использованием нумерованных списков*/
        function parseErrors(selector, jsonErr) {

            $.each(jsonErr, function (i, arr) {
                var index = 1;

                /*тег <li> - для значения заголовка маркировочного списка*/
                var selectorIlValue;

                $.each(arr, function (key, value) {

                    /*тег <ul> - для заголовка*/
                    var selectorUlHead = divErrMessage + '_' + key + '_' + i;

                    /*тег <li> - для заголовка*/
                    var selectorLiHead = selectorUlHead + '_' + 'Li' + '_' + i;

                    if (index === 1) {
                        makeIntoBulletedListUl(selectorUlHead, selector);

                        applyStyle('.' + selectorUlHead, {
                            'color': 'blueviolet',
                            'font-weight': 'bold'
                        });

                        makeIntoBulletedListLi({
                            class: selectorLiHead,
                            html: value + ' :'
                        }, '.' + selectorUlHead);
                        index++;
                        selectorIlValue = selectorLiHead;

                    } else {

                        /*тег < ul> - для значения заголовка маркировочного списка*/
                        var selectorUlValue = 'ulValue' + '_' + key + '_' + i;
                        var selectorIl = 'ilValue' + '_' + key + '_' + i;

                        makeIntoBulletedListUl(selectorUlValue, '.' + selectorIlValue);

                        applyStyle('.' + selectorUlValue, {
                            'color': 'red',
                            'font-weight': '150'
                        });

                        makeIntoBulletedListLi({
                            class: selectorIl,
                            html: '-' + value
                        }, '.' + selectorUlValue);
                        //  console.log("Второй ключ - " + key + " ; value - " + value);
                    }

                });

            });
        }

        /*создать марикировочный список*/
        function makeIntoBulletedListUl(nameSelector, toElemSelector) {

            createElemIntoAnotherElem(nameSelector, '<ul>', toElemSelector);

        }

        function makeIntoBulletedListLi(attributes, toElemSelector) {

            createElemWithHtml('<li>', attributes, toElemSelector);

        }


        /*выводим результат полученный от сервера, в случае ошибки*/
        function messageErr(error, selector) {

            var answer = parseResponse(error);

            var message = answer.message;

            $(selector).animate({opacity: "1"}, durationUp);
            $(selector).html("");
            $(selector).html(message).css("color", "red");
            $(selector).animate({opacity: "0.3"}, durationDown);
        }

        /****Контейнер для вывода ошибок - конец***/


        /*Преобразование JSON, в объект с текстовыми данными*/
        function parseResponse(response) {

            return JSON.parse(response.responseText);
        }


        /*создание элемента 'button'
        * toElemSelector -  Селектор, внутри которого создается элемент
        * nameClass - имя класса, для создаваемого элемента*/
        function createButton(nameClass, toElemSelector, name) {

            createElemIntoAnotherElemButton('<button>', nameClass, toElemSelector);
            $('.' + nameClass).html(name);
            applyStyle('.' + nameClass, {
                'width': '30%',
                'font-family': 'Calibri',
                'font-style': 'italic',
                'font-size': '23px',
                'padding-top': '4px',
                'border-radius': '10px',
                'margin-top': '5px'

            });
        }


        /************************************************************************************/

        /*подлкючить плагин DataTables или установить стили по умолчанию ?*/
        function isAttachDataTablesOrDefaultSettings(selector) {

            if (options.isUsedDataTables) {
                /*установка и настройка плагина DataTables*/
                setPluginDataTablesAndAddOptions(selector);
            } else {
                applySettingsDefault(selector);
            }

        }

        /*применить настройки по умолчанию*/
        function applySettingsDefault(selector) {

            /*Стили для таблицы*/
            styleAttributesForTable = {
                'border': "solid 2px blue",
                'border-collapse': 'collapse', /*убираем расстояние между ячейками*/
                'margin-top': '0.5%',
                'padding-top': '2%',
                'margin-left': '0.5%',
                'margin-bottom': '1%',
                'margin-right': '1%',
                'height': '40%',
                'width': '100%',
                'background-color': '#FFFFE0',

            };

            /*атибуты стиля тега 'th'*/
            styleAttributesForTh = {
                'border': 'solid 1px green',
                'padding': '5px',
                'font-size': '15px',
                'font-style': 'italic'
            };

            /*атибуты стиля тега 'td'*/
            styleAttributesForTd = {
                'border': 'solid 1px purple',
                'font-size': '15px'
            };


            applyStyle('.' + nameTable, styleAttributesForTable);
            applyStyle('.' + nameTable + ' ' + 'th', styleAttributesForTh);
            applyStyle('.' + nameTable + ' ' + 'td', styleAttributesForTd);

            /*применяем стили для колонок таблицы*/
            applyStyleForThOfTable(selector);

            /*     $(".tableFirstHead th").css({
                     'height': '10px'
                 });*/

            /*контейнер, вокруг табилцы)*/
            applyStyle('.tableEmployees', {
                'height': '350px'

            });
            /*полоса прокрутки*/
            applyStyle('.tableEmployees', {'overflow': 'scroll'});

        }

        /*применяем стили для колонок таблицы*/
        function applyStyleForThOfTable(selector) {

            if (!options.isUsedDataTables) {

                var row = $(selector).find('thead > tr > th');

                var i = 0;
                $.each(row, function (index, value) {

                    /*получаем текущий стиль из массива стилей*/
                    var currentStyle = options.arrStyleForWidthTh[index];

                    var length = Object.keys(currentStyle).length;

                    if (Object.keys(currentStyle).length === 0) {
                        return true;
                    }

                    /*так как использование :nth-child, требует индекса, а индексы
                     * там начинаются с 1, тогда нужно выполнить сложение.
                      * Индексы ячеек тега `tr` - начинаются с 0*/
                    var indexTd = index + 1;

                    /*применяем стиль для заголовка столбца*/
                    applyStyle(value, currentStyle);

                    /*применяем стиль для ячеек текущего столбца*/
                    applyStyle('td:nth-child(' + indexTd + ' )', currentStyle);

                });
            }

        }

        /*настраиваем плагин для оформления таблиц;
        * applyStyle - добавляем линии к заголовкам таблицы*/
        function setPluginDataTablesAndAddOptions(selectorTable) {

            $.fn.dataTable.moment('DD-MM-YYYY');

            /*добавляем имена классов в тег table, для текущей таблицы hover display compact*/
            $(selectorTable).addClass(' hover ');

            /*если включен постраничный вывод табилцы, тогда не применяем скроллинг,
            * иначе включаем вертакальный скроллинг*/
            if (options.pagingForDataTables) {

                selectorTableForDataTables = $(selectorTable).DataTable({

                    paging: options.pagingForDataTables, /*постарничный вывод таблицы*/
                    ordering: true,
                    "bRetrieve": false, //могут ли опции быть изменены после инициализации. true - не могут, false - могут
                    "bPaginate": false,
                    "bInfo": true,
                    bAutoWidth: false,
                    "oLanguage": options.messageForPluginDataTables,
                    scrollResize: true,
                    scrollCollapse: true,
                    /*настройка колонок, нумерация колонок начинается с 0*/
                    columnDefs: options.columnDefsForDataTables,


                });
            } else {
                $(selectorTable).DataTable({
                    paging: options.pagingForDataTables, /*постарничный вывод таблицы*/
                    ordering: true,
                    "bRetrieve": false, //могут ли опции быть изменены после инициализации. true - не могут, false - могут
                    "bPaginate": false,
                    "bInfo": true,
                    bAutoWidth: false,
                    "oLanguage": options.messageForPluginDataTables,
                    scrollResize: true,
                    scrollCollapse: true,
                    /*настройка колонок, нумерация колонок начинается с 0*/
                    columnDefs: options.columnDefsForDataTables,
                    scrollY: '200px',


                });
            }

            /*стили для таблицы*/
            applyStyleForDataTables(selectorTableForDataTables);
        }


        /*применить стили для таблицы, в случае использования плагина dataTables*/
        function applyStyleForDataTables(table) {
            /*делаем отступ между таблицей и полем поиска
            * '.dataTables_filter' - селектор для div, который содержит
             * строку поиска
             * '.dataTables_length' - селектор для div, который содержит
             * элемент для выбора количества вывода строк, при постраничном выводе
             * '.dataTables_info' - селектор для div, который содержит информационную
             * строку внизу таблицы
             * '.dataTables_paginate' -  селектор для div, который содержит
             * кнопки перелистовывания страниц
             * */

            var selectorFilter = '.dataTables_filter';
            var selectorLength = '.dataTables_length';
            var selectorInfo = '.dataTables_info';
            var selectorPaginate = '.dataTables_paginate';


            applyStyle(selectorFilter, {
                'margin-bottom': '10px'
            });

            /*надпись*/
            applyStyle(selectorFilter + ' ' + 'label', {
                'font-size': '15px',
                'font-style': 'italic',
                'color': 'blue'
            });

            /*поле поиска*/
            applyStyle(selectorFilter + ' ' + 'label' + ' ' + 'input', {
                'border': 'solid 1px #000099',
                'font-style': 'italic',
                'font-family': 'Calibri'
            });

            applyStyle(selectorLength, {
                'margin-bottom': '10px'
            });

            /*надпись*/
            applyStyle(selectorLength + ' ' + 'label', {
                'font-size': '15px',
                'font-style': 'italic',
                'color': 'blue'
            });

            /*выбор количества строк*/
            applyStyle(selectorLength + ' ' + 'label' + ' ' + 'select', {
                'border': 'solid 1px #000099',
                'padding-left': '5px',
                'margin-left': '5px',
                'margin-right': '5px'

            });

            table.$('#DataTables_Table_0').css('border', '1px solid red');


            applyStyle(table.$('td'), {
                'border': '0.5px solid #330099'
            });

            var tdEmail = '.tdEmail';
            var tdPassword = '.tdPassword';
            var tdCurrency = '.tdCurrency';
            var tdTelephone = '.tdTelephone';
            var tdData = '.tdData';
            var tdCreditNumber = '.tdCreditNumber';

            if (Object.keys(options.arrStyleTdEmail).length !== 0) {
                applyStyle(table.$('td' + tdEmail), options.arrStyleTdEmail);
            } else {
                applyStyle(table.$('td' + tdEmail), {
                    'white-space': ' nowrap'
                });
            }

            if (Object.keys(options.arrStyleTdPassword).length !== 0) {
                applyStyle(table.$('td' + tdPassword), options.arrStyleTdPassword);
            } else {
                /*сокращение шрифта в колонке Password*/
                applyStyle(table.$('td' + tdPassword), {
                    'font-size': '10px',
                    'word-break': 'break-all', /*перенос слов*/
                    'wrap': 'soft'
                });
            }

            if (Object.keys(options.arrStyleTdCurrency).length !== 0) {
                applyStyle(table.$('td' + tdCurrency), options.arrStyleTdCurrency);
            } else {
                applyStyle(table.$('td' + tdCurrency), {
                    'white-space': ' nowrap'
                });
            }

            if (Object.keys(options.arrStyleTdTelephone).length !== 0) {
                applyStyle(table.$('td' + tdTelephone), options.arrStyleTdTelephone);
            } else {
                applyStyle(table.$('td' + tdTelephone), {
                    'white-space': ' nowrap'
                });
            }


            if (Object.keys(options.arrStyleTdData).length !== 0) {
                applyStyle(table.$('td' + tdData), options.arrStyleTdData);
            } else {
                applyStyle(table.$('td' + tdData), {
                    'white-space': ' nowrap'
                });
            }


            if (Object.keys(options.arrStyleTdCreditNumber).length !== 0) {
                applyStyle(table.$('td' + tdCreditNumber), options.arrStyleTdCreditNumber);
            } else {
                applyStyle(table.$('td' + tdCreditNumber), {
                    'white-space': ' nowrap'
                });
            }


            /*информационная строка внизу таблицы*/
            applyStyle(selectorInfo, {
                'font-style': 'italic',
                'color': 'blue',
                'margin-bottom': '10px',
                'margin-top': '10px',
                'font-family': 'Calibri'
            });

            applyStyle(selectorPaginate, {
                'margin-bottom': '10px',
                'margin-top': '10px',
                'font-style': 'italic',
                'color': 'blue',
                'font-family': 'Calibri'
            });

        }


        /*установка локализации сообщений для плагина dataTables*/
        function setLocalizationForDataTablesPlugin() {
            if (langLocaleBrowser === 'ru') {

                messageRuForPluginDataTables = {
                    "sProcessing": "Подождите...",
                    "sLengthMenu": "Показать _MENU_ записей",
                    "sZeroRecords": "Записи отсутствуют.",
                    "sEmptyTable": "Записи отсутствуют.",
                    "sInfo": "Записи с _START_ до _END_ из _TOTAL_ ",
                    "sInfoEmpty": "Записи с 0 до 0 из 0 ",
                    "sInfoFiltered": "(в _MAX_)",
                    "sInfoPostFix": "",
                    "sSearch": "Поиск: ",
                    "sUrl": "",
                    "oPaginate": {
                        "sFirst": "Первая",
                        "sPrevious": "Предыдущая",
                        "sNext": "Следующая",
                        "sLast": "Последняя"
                    }
                };

            }
        }

        /* Рисование одной строки в таблице
        * Перебор всех имен полей объекта (имен ключей свойств в JSON),
        * по имени обращаемся к значению свойства;
        * имена ключей свойств JSON, имеет соответсвующие назавания
        * в POJO-классе на стороне клиента
        *  row - строка из json-объекта, которая содержит данные
        * для ячеек: содержит полную строку таблицы с ячейками и данными
        *  selectorTableList - указывает на точку в документе, гда находится
        * тег 'table'
        *  index - текущий индекс обрабатываемой строки
        * Получаем данные из json-объект, полученные от клиента.
        * rowIntoTBody - Получаем точку узла, где находится таблица, которая
        * обозначает позицию последней строки в теге tbody, либо указывает
        * на 1-ю позицию внутри тега tbody, если в таблице нет строк.
        * classTr - генерируем имя класса для тега 'tr'
        * key - имя ключа одного из значений ячеек, соответствует позиции колонки
        * в строке таблицы (например, id:1, login: m.login и т.д)
        * value - значение в ячейке
        * row - получаем строку из JSON-Массива
        * */
        function addRow(row, selectorTableList, index) {

            var rowIntoTBody = $(selectorTableList).find("tbody:last");

            var classTr = "row_" + index;

            createElemIntoAnotherElem(classTr, '<tr>', rowIntoTBody);

            /*массив с типами данных для столбцов*/
            var arrDataAttrName = options.arrDataAttrName;

            /*длина массива, который содержит data***- атрибуты для столбцов*/
            var lengthArrDataAttributes = arrDataAttrName.length;
            /*длина ассоциативного массива, данные которого помещаются в создаваемую строку*/
            var lengthAssociateArr = Object.keys(row).length;

            if (lengthArrDataAttributes !== lengthAssociateArr) {
                throw new RangeError("Arrays are not equal, check 'options.arrDataAttrName'");
            }


            var i = 0;
            /*начальный элемент массива с типами данных для столбцов*/

            $.each(row, function (key, value) {

                var associateArr = arrDataAttrName[i];

                var valueToCell;
                valueToCell = checkDataTypeConvertForView(associateArr, value);

                createElemIntoAnotherElemWithAttributes(
                    '<td>',
                    {name: key, html: valueToCell},
                    '.' + classTr
                );

                i++;
            });

            /*selectorTd - селектор относится к каждой ячйке таблицы
           * options.styleForTd - массив стилей*/
            applyStyle(selectorTd, options.styleForTd);
        }


        /*получаем значение атрибута 'data-dataType';
        * если такой атрибут отствует, тогда возвращаем
        * пустую строку ''*/
        function getNameDataType(elemement) {

            if ("data-dataType" in elemement) {
                return elemement['data-dataType'];
            } else {
                return '';
            }
        }

        /*проверяем элемент массива с типами данных, на предмет
        * определенного типа данных;
        * затем конверитуем согласно маске, для удобного просмотра,
        * сконвертированное значение, возвращаем, для отображения
        * на странице;
        * если тип данных для конвертирования не определен,
        * тогда возвращаем значение не отформатированным.
         * */
        function checkDataTypeConvertForView(elemement, value) {

            var currency = 'currencyType';
            /*тип данных для денег*/
            var telephone = 'telType';
            /*тип данных для телефонных номеров*/
            var creditCard = 'creditCardType';
            /*тип данных для номера кредитной карты*/

            var nameDataType = getNameDataType(elemement);

            switch (nameDataType) {

                case currency :
                    return thousandSeparator(value);
                case telephone:
                    return convertTelephoneNumber(value);
                case creditCard:
                    return formatCreditNumber(value);
                default:
                    return value;

            }
        }

        /********************************Формататирование числа по 3 разряда**********************************/
        function thousandSeparator(number) {
            var resultStr = "";

            var str = number.toString();

            for (var i = str.length; i >= 0; i = i - 3) {


                if (i > 3) {
                    /*Начальный Индекс элемента выбираемой подстроки*/
                    var startIndex = i - 3;

                    /*сохраняем часть подстроки*/
                    var partStr = str.slice(startIndex, i);
                    resultStr = " " + partStr + resultStr;
                } else {
                    /*последняя часть подстроки, обрабатываемой строки*/
                    var endStr = str.slice(0, i);
                    resultStr = endStr + resultStr;
                }

            }

            return resultStr;
        }


        /********************************Формататирование тлефонного номера**********************************/

        /*преобразование телефонного номера в удобный для чтения видж;
        * separator - массив разделителей*/
        function convertTelephoneNumber(value) {

            var ru = 'ru';
            var maskRu = '+ 9 (999) 999-99-99';

            /*длина телефонного номера*/
            var lengthTelRu = 11;

            var us = 'us';
            var maskUs = '+ 9 (999) 999-99-99';
            var lengthTelUs = 11;

            var by = 'by';
            var maskBy = '+ 999 (99) 999-99-99';
            var lengthTelBy = 12;

            var country;

            var numberStr = '';

            if (typeof value === 'undefined') {
                throw new TypeError("The data type of the current value is undefined!")
            }

            if (typeof value === 'number') {
                numberStr = value.toString();
            } else {
                /*оставляем только цифры*/
                numberStr = value.replace(/\D+/g, '');
            }

            country = defineCountryCode(numberStr);

            switch (country) {

                case ru:
                    if (numberStr.length !== lengthTelRu) {
                        return value;
                    } else {
                        return formatTelNumber(numberStr, maskRu);
                    }

                case us:
                    if (numberStr.length !== lengthTelUs) {
                        return value;
                    } else {
                        return formatTelNumber(numberStr, maskUs);
                    }
                case by:
                    if (numberStr.length !== lengthTelBy) {
                        return value;
                    } else {
                        return formatTelNumber(numberStr, maskBy);
                    }
                default:
                    return value;

            }

        }

        /*определить телефоный код страны*/
        function defineCountryCode(numberStr) {

            var ru = 'ru';
            var us = 'us';
            var by = 'by';

            var ruReg = /^7/;
            var usReg = /^1/;
            var byReg = /^375/;

            if (ruReg.test(numberStr)) {

                return ru;
            }

            if (usReg.test(numberStr)) {
                return us;
            }

            if (byReg.test(numberStr)) {
                return by;
            }
        }

        /*форматирвоание номера, сотового телефонного оператора России
        * numberFromPattern - число из шаблона телефонного номера*/
        function formatTelNumber(numberStr, mask) {

            var result = '';
            var numberFromPattern = '9';
            /*счетчик символов обрабатываемого номера*/
            var j = 0;

            for (var i = 0; i < mask.length; i++) {

                if (mask[i] !== numberFromPattern) {
                    result = result + mask[i];
                } else {
                    result = result + numberStr[j];
                    j++;
                }

            }

            return result;

        }


        /*****************************Форматирование номера кредитной карты****************************************/

        /*форматирование номера кредитной карты*/
        function formatCreditNumber(value) {

            if (typeof value === 'undefined') {
                throw new TypeError("The data type of the current value is undefined!")
            }

            var creditCard;

            if (typeof value === 'number') {
                creditCard = value.toString();
            } else {
                /*оставляем только цифры*/
                creditCard = value.replace(/\D+/g, '');
            }

            if (creditCard.length > 21 || creditCard.length <= 4) {
                return value;
            }

            var resultStr = "";

            for (var i = 0; i < creditCard.length;) {

                /*4 разряда*/
                var fourDigit = 4;
                /*3 разряда*/
                var threeDigit = 3;

                var startIndex = '';
                var endIndex = '';
                var partStr = '';

                if (i >= creditCard.length - 4) {
                    /*Начальный Индекс элемента выбираемой подстроки*/
                    startIndex = i;

                    /*конечный  Индекс элемента выбираемой подстроки*/
                    endIndex = i + creditCard.length - 1;

                    /*сохраняем часть подстроки*/
                    partStr = creditCard.slice(startIndex, endIndex);

                    resultStr = resultStr + partStr;

                    i += creditCard.length;
                }

                if (i >= 4 && i < creditCard.length - 4) {

                    /*Начальный Индекс элемента выбираемой подстроки*/
                    startIndex = i;
                    /*конечный  Индекс элемента выбираемой подстроки*/
                    endIndex = i + threeDigit;
                    /*сохраняем часть подстроки*/
                    partStr = creditCard.slice(startIndex, endIndex);

                    resultStr = resultStr + partStr + ' ';

                    i += threeDigit;
                }


                if (i === 0) {

                    /*Начальный Индекс элемента выбираемой подстроки*/
                    startIndex = i;
                    /*конечный Индекс элемента выбираемой подстроки*/
                    endIndex = i + fourDigit;

                    /*сохраняем часть подстроки*/
                    partStr = creditCard.slice(startIndex, endIndex);
                    resultStr = resultStr + partStr + ' ';
                    i += fourDigit;
                }

            }

            return resultStr;

        }


        /******************************Универсальные методы, для создания элементов********************/

        /*создает элемент, внутри другого элемента и ставит созданный элемент
        * первым в списке, внутри родительского элемента*/
        function createElemFirstIntoParentElem(elem, nameClass, selector) {
            $(elem, {class: nameClass}).prependTo(selector);
        }

        /*Фукнция создания элемента, внутри другого элемента. Создаваемому элементу,
              назначается атрибут class со значением.
              nameNewClass - значение атрибута class, для создаваемого элемента
              elem -  создаваемый элемент
              toElemSelector - указание селектора контейнера, внутри которого создается текущий элемент*/
        function createElemIntoAnotherElem(nameNewClass, elem, toElemSelector) {
            $(elem, {class: nameNewClass}).appendTo(toElemSelector);
        }

        /*создание контейнеров с текстом внутри*/
        function createElemWithHtml(elem, attributes, toElemSelector) {
            $(elem, attributes).appendTo(toElemSelector);
        }


        function createElemIntoAnotherElemWithAttributes(elem, attributes, toElemSelector) {
            $(elem, attributes).appendTo(toElemSelector);
        }

        /*создание элемента, после указанного элемента,с массивом атрибутов для создаваемого элемента,
        а также создаваемый элемент, создается после указанного контейнера*/
        function createElemWithAttrsAndInsertAfter(elem, attributes, afterElem) {

            $(elem, attributes).insertAfter(afterElem);
        }


        /*создаем загловки
        * arrHeadsCells -  одномерный массив, содержит имена заголовков таблицы
        * arrDataAttributesName - массив, содержит ассоциативные массивы, в качестве
        * элеметнов, которые содержат имена атрибутов со значениями.
        * */
        function createTh(arrHeadsCells, arrDataAttributesName, selector) {

            checkArraysAvailability(arrHeadsCells, arrDataAttributesName);


            $.each(arrHeadsCells, function (indexArrTwoDimensional, ArrTwoDimensional) {
                /* ассоциативный массив будет как объект javaScript */
                var arrAssociate = arrDataAttributesName[indexArrTwoDimensional];

                /*добавляем столбцы в указанную строку*/
                $('<th>', arrAssociate).appendTo(selector).html(ArrTwoDimensional);

            });

        }


        /*проверить доступность массивов*/
        function checkArraysAvailability(arrHeadsCells, arrDataAttributesName) {

            if (arrHeadsCells.length === 0 || arrDataAttributesName.length === 0) {
                throw messageInfo.lengthArraysNotNull;
            }

            /*если количество элементов массива не одинаково, тогда выбрасываем exception */
            if (arrHeadsCells.length !== arrDataAttributesName.length) {
                throw messageInfo.lengthArrays;
            }

        }

        /******************************Универсальные методы, для создания элементов**** - окончание**********/

        /******************************Универсальные методы, для создания стилей**** - начало**********/

        /*Применение стиля*/
        function applyStyle(selector, style) {
            $(selector).css(style);
        }

        /*flex-контейнер, направление элементов
        * вдоль вертикальной оси - `column`*/
        function applyStyleFlexColumn(selector) {
            $(selector).css({

                'margin-top': '2%',
                'margin-bottom': '2%',

                'display': 'flex', /*для остальных браузеров*/
                'flex-direction': 'column'
            });

            $(selector).css({
                /*отображает контейнер как блочный элемент*/
                'display': '-webkit-flex', /*для safary*/
                '-webkit-flex-direction': 'column'
            });

        }

        /*flex-контейнер для нижего блока (блок содержит кнопки), направление элементов
        * вдоль горизонтальной оси - `center`*/
        function applyStyleFlexColumnSpaceBetweenInfo(selector) {
            $(selector).css({
                /*отображает контейнер как блочный элемент*/
                'display': '-webkit-flex', /*для safary*/
                '-webkit-justify-content': 'space-between'
            });

            $(selector).css({
                'display': 'flex', /*для остальных браузеров*/
                'justify-content': 'space-between'
            });

        }

        /*flex-контейнер для нижего блока (блок содержит кнопки), направление элементов
   * вдоль горизонтальной оси - `center`*/
        function applyStyleFlexColumnSpaceBetweenForButton(selector) {
            $(selector).css({
                /*отображает контейнер как блочный элемент*/
                'display': '-webkit-flex', /*для safary*/
                '-webkit-justify-content': 'center'
            });

            $(selector).css({
                'display': 'flex', /*для остальных браузеров*/
                'justify-content': 'center'
            });

        }

        /******************************Универсальные методы, для создания стилей**** - окончание**********/

        /***Массив ошибок и определение языка, для вывода ошбок - начало******/

        /*определяем язык сообщений об ошибке*/
        function defineLangOfMessage() {

            createArrMessages();

            if (langLocaleBrowser === 'ru') {
                messageInfo = messagesRu;
            } else {
                messageInfo = messagesEn;
            }
        }

        /*создание массива сообщений*/
        function createArrMessages() {

            /*Создаем массив сообщений для ошибок.*/
            messagesRu = {
                langCaptionErr: ('Заголовок для такой локали - не определен!'),
                lengthArrays: ("Массивы не равны, создание таблицы невозможно !"),
                lengthArraysNotNull: ("Массив не может быть пустым !"),
                arrayNotDefined: ("Массивы не определены !"),
                notSelectorForErr: ("Не указан селектор для вывода ошибки !"),
                titleLevelAccessMessage: ('Уровень доступа : '),
                uriAddress: ('Адрес ресурса не введен !'),
                labelDeleteMessage: ('Удалить данные...'),
                labelOnButtonDelete: ('Удалить'),
                labelUpdateMessage: ('Обновить данные...'),
                labelOnButtonUpdate: ('Обновить'),
                tipEditCell: ('* Для редактирования ячейки, выполните двойной щелчок манипулятором мышь' +
                    ' по нужной ячейке.'),
                tipSelectRow: ('* Для выделения строки таблицы, выполните одиночный щелчок' +
                    ' манипулятором мышь по нужной ячейке. Для отмены выделения строки, ' +
                    ' выполните одиночный щелчок еще раз.'),
                tipControlScrollBar: ('* Управление полосами прокрутки, может выполняться либо ' +
                    'колесом манипулятора мышь ("вперед-назад", "влево-вправо"), либо клавишами ' +
                    'стрелок ("влево-вправо","вверз-вниз") .' ),
                showTips: ("Показать подсказки."),
                hideTips: ("Скрыть подсказки.")

            };

            messagesEn = {
                langCaptionErr: ('The title for this locale is undefined !'),
                lengthArrays: ("Arrays are not equal, table creation is impossible !"),
                lengthArraysNotNull: ("The array cannot be empty !"),
                arrayNotDefined: ("Arrays Not defined !"),
                notSelectorForErr: ("No selector for error output specified !"),
                titleLevelAccessMessage: ('Level access : '),
                uriAddress: ('The address of the resource is not entered !'),
                labelDeleteMessage: ('Delete data...'),
                labelOnButtonDelete: ('Delete'),
                labelUpdateMessage: ('Update data...'),
                labelOnButtonUpdate: ('Update'),
                tipEditCell: ('* To edit a cell, double-click the mouse' +
                    ' the desired cell.'),
                tipSelectRow: ('* To select a table row, single click' +
                    ' the mouse on the desired cell. To deselect a line,' +
                    ' perform a single click again'),
                tipControlScrollBar: ('* Scrollbars can be controlled by either ' +
                    'mouse wheel ("forward-backward", "left-right"), or keys' +
                    ' arrow ("left-right", "up-down" .)' ),
                showTips: ("Show tips."),
                hideTips: ("Hide tips.")
            }
        }


        /* Разбор данных для тестовой таблицы
        * jsonArr - тестовый массив
        * selectorTableList - имя селекторая тега 'table'
        * */
        function getDataFromTable(url, selectorTableList) {

            $.ajax({
                url: url,
                method: 'get',
                dataType: 'json',
                success: function (data) {

                    searchDataFromTable(data, selectorTableList);

                },
                error: function (error) {

                    parseErrors('.' + divErrMessage, error);

                }
            });
        }

        return this;
    }

})
(jQuery);

