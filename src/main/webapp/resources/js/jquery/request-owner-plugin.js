/*this plugin receives data about the owner of the request .
It than displays them on a web page. */
(function ($) {

    /*It is base of part the plugin*/
    $.fn.requestOwnerPlugin = function (prop) {

        /*the locale of the browser*/
        var langLocaleBrowser = '';

        var nameElemForOwner = '';
        var nameElemForAccessLevel = '';

        /*defines language messages about error*/
        var messageInfo = '';

        var messagesRu = '';
        var messagesEn = '';

        var selectorInfoBox = 'infoBox';
        var selectorUserDataFlex = 'userDataFlex';
        var selectorLevelAccess = 'levelAccess';

        var selectorOwner = 'owner';
        var nameOwner = '';

        /*getting information about the locale of the browser*/
        getLang();

        /*create messages and defines language messages about error*/
        defineLangOfMessage();

        var options = $.extend({

            /*it is resource address for receive data owner of request */
            urlDataOwnerOfRequest: '',
            /*It is name of element that will point on name of owner current page*/
            nameElemForOwner:'',
            /*It is name of element that will point on level access of owner current page*/
            nameElemForAccess:''
        }, prop);

        this.fadeIn('normal', function () {

            nameElemForOwner = getNameElemForOwnerFromArr(options.nameElemForOwner);
            nameElemForAccessLevel = getNameElemForOwnerFromArr(options.nameElemForAccess);

            makeInfoBoxesForTable();
            getRequestOwner(options.urlDataOwnerOfRequest);
        });

        /*оформление описания таблицы (заголовок и информационный блок*/
        function makeInfoBoxesForTable() {

            createElemFirstIntoParentElem('<div>', selectorInfoBox, 'body');
            createElemIntoAnotherElem(selectorUserDataFlex,'<div>', '.' + selectorInfoBox);

            applyStyle('.' + selectorUserDataFlex, {
                'max-width': '18%', /* блок занимает ширину родителя, max-width её ограничивает */
                'margin-left': 'auto',
                'margin-top': '1%',
                'margin-bottom': '0.5%',
                'margin-right': '0.1%',

                '-webkit-flex-direction': 'row',

                'flex-direction': 'row'
            });

            /*создание контейнера для хранения уровня доступа*/
            createElemWithHtml('<div>', {
                class: selectorLevelAccess,
                html: nameElemForOwner + " : "
            }, '.' + selectorUserDataFlex);

            applyStyle('.' + selectorLevelAccess, {
                'font-family': 'Calibri',
                'font-style': 'italic',
                'color': '#FF8000',
            });

            createElemWithHtml('<span>', {
                html: ' '/*nameLevelAccessValue*/
            }, '.' + selectorLevelAccess);

            applyStyle('.' + selectorLevelAccess + ' ' + 'span', {
                'color': '#009900',
                'padding-left': '8%'
            });
            /*-----------------------------------*/

            /*создание контейнера для хранения имени пользователя*/
            createElemWithHtml('<div>', {
                class: selectorOwner,
                html: nameElemForAccessLevel + " : "
            }, '.' + selectorUserDataFlex);

            applyStyle('.' + selectorOwner, {
                'font-family': 'Calibri',
                'font-style': 'italic',
                'color': '#345eff',
                'padding-top': '0'
            });

            createElemWithHtml('<span>', {
                html: ' '/*nameOwner*/
            }, '.' + selectorOwner);

            applyStyle('.' + selectorOwner + ' ' + 'span', {
                'color': '#753399',
                'padding-left': '3%'
            });

        }

        /* is created an element inside another of element and be set
        created this element first in list*/
        function createElemFirstIntoParentElem(elem, nameClass, selector) {
            $(elem, {class: nameClass}).prependTo(selector);
        }

        function createElemIntoAnotherElem(nameNewClass, elem, toElemSelector) {
            $(elem, {class: nameNewClass}).appendTo(toElemSelector);
        }

        /*создание контейнеров с текстом внутри*/
        function createElemWithHtml(elem, attributes, toElemSelector) {
            $(elem, attributes).appendTo(toElemSelector);
        }

        /*Применение стиля*/
        function applyStyle(selector, style) {
            $(selector).css(style);
        }

        function getNameElemForOwnerFromArr(arr) {

            var result = '';

            /*external  cycle: parse elements of  one-dimensional array */
            $.each(arr, function (index, associate) {

                /*parse elements of associate array*/
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

        /*defines language messages about error*/
        function defineLangOfMessage() {

            createArrMessages();

            if (langLocaleBrowser === 'ru') {
                messageInfo = messagesRu;
            } else {
                messageInfo = messagesEn;
            }
        }

        /*create array of messages*/
        function createArrMessages() {

            messagesRu = {
                langCaptionErr: ('Заголовок для такой локали - не определен!')
            };

            messagesEn = {
                langCaptionErr: ('The title for this locale is undefined !')
            }
        }

        /* The method describes receive data of browser locale
         * window.navigator.browserLanguage - using for IE
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

        function getRequestOwner(urlRequestOwner) {

            $.ajax({
                url: urlRequestOwner,
                method: 'get',
                dataType: 'json',
                success: function (data) {
                    getOwner(data);

                },
                error: function (error) {

                    console.log(error);
                }
            });
        }

        function getOwner(data) {
            var firstName = "";
            var lastName = "";
            var authority = "";

            $.each(data, function (key, value) {
                if (key === 'firstName') {
                    firstName = value;
                }

                if (key === 'lastName') {
                    lastName = value;
                }

                if (key === 'authority') {

                    switch (value.toLowerCase()) {
                        case 'admin':
                            authority = "Administrator";
                            break;
                        case 'manager':
                            authority = "Manager";
                            break;

                        case 'user':
                            authority = "User";
                            break;

                        default: "Authority do not set."
                    }

                }
            });

            console.log(firstName + " : " + lastName + " : " + authority);
            nameOwner = firstName + " " + lastName

            $('.' + selectorOwner + ' ' + 'span').html(nameOwner);

            $('.' + selectorLevelAccess + ' ' + 'span').html(authority);

        }

        return this;
    }
})
(jQuery);