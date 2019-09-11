/** Вывод таблицы
 *массивы arrTh и arrDataAttrName, должны
 быть одинаковой длины (одинаковое количество элементов)
 *
 * arrTh - массив для заголовков-столбцов
 * */
$(document).ready(function () {

    var urlRequestOwner = "api/users/owner";
    getRequestOwner(urlRequestOwner);

    /*адрес endpoint of rest-controller*/
    var urlToServer = 'api/users';
    /*api/users*/
    var urlDeleteData = 'api/users/delete';
    /*пакетное удаление*/
    var urlUpdateData = 'api/users/update/list';
    /*пакетное обновление*/

    /*селекор обертки над таблицей*/
    var selectorNameOfTable = 'tableEmployees';

    /*селектор тега `table`*/
    var selectorForTable = 'tableFirst';

    var pathButtonImageDatePicker = 'resources/tableEditPlugin/images/calendar.gif';
    var pathToImgCloseModalBox = 'resources/tableEditPlugin/images/close.png';

    /*Заголовки колонок для текущей таблицы, на английском и русском */
    var arrThRu = [
        'Ид', 'Имя', 'Фамилия', 'Учетная запись', 'Пароль',
        'Электронная почта', 'Кредитная карта', 'Телефон', 'Дата', 'Уровень доступа',
        'Cостояние учетной записи'
    ];

    var arrThEn = [
        'ID', 'First name', 'Last name', 'Login', 'Password',
        'Email', 'Credit card', 'Phone', 'Date', 'Authority',
        'account Status'
    ];

    $('body').createTablePlugin({

        imgCloseForModalBox: pathToImgCloseModalBox, /*путь к значку-изображения для закрытия окна*/
        pathToButtonImage: pathButtonImageDatePicker, /*путь к изображению кнопки календаря*/

        isUsedDataTables: false,

        /*Массив, который содержит ассоциативные массивы,
        * содержащие названия таблиц на английском и русском языках*/
        nameTable: [
            {'captionRu': 'Сотрудники'},
            {'captionEn': 'Employees'}
        ],

        /* здесь указывается адрес ресурса rest, который будет выдавать текущий уровень
        * доступа пользователя*/
        nameLevelAccessValue: '', /*значение уровня доступа*/
        nameElemForOwner: [
            {'nameElemRu': 'Пользователь'},
            {'nameElemEn': 'User'}
        ],
        nameOwner: "", /*имя владельца текущего запроса*/

        /*селекор обертки над таблицей*/
        classTableName: selectorForTable,

        /*селектор тега `table`*/
        selectorForCreateTable: selectorNameOfTable,

        /*массив, который содержит массивы с заголовками столбцов на русском
        * и английском языках*/
        arrTh: [
            {"arrThRu": arrThRu},
            {"arrThEn": arrThEn}
        ],

        /*данные для ограничения ввода значений в ячейки табилцы*/
        arrDataAttrName: [
            {}, /*ид*/
            {
                'data-dataType': 'nameType', /*имя*/
                // 'data-maxLength': '7',
                'data-rangeLengthSymbol': '[2,10]'
            },
            {
                'data-dataType': 'nameType', /*фамилия*/
                // 'data-maxLength': '7',
                'data-rangeLengthSymbol': '[2,10]'
            },
            {
                'data-dataType': 'loginType', /*логин*/
                //   'data-minLength': '',
                //  'data-maxLength': '',
                'data-rangeLengthSymbol': '[7,20]'
            },
            {}, /*password*/
            {
                'data-dataType': "emailType" /*почта*/
            },
            {
                'data-dataType': 'creditCardType' /*номер кредитной карты*/
            },
            {
                'data-dataType': 'telType', /*телефон*/
                'data-country': 'by'
            },

            {
                'data-dataType': 'dateType'/*дата*/
            },
            {}, /*роль доступа*/
            {} /*состояние учетной записи*/

        ],
        urlDeleteData: urlDeleteData, /*адрес ресурса на удаление данных*/
        urlUpdateData: urlUpdateData, /*адрес ресурса на обновление данных*/
        urlGetData: urlToServer, /*адрес сервера для запроса данных*/
        selectorErrMessageFromServer: '.errMessageEmployees',

        columnDefsForDataTables: [
            {targets: 5, className: 'tdEmail'},
            {targets: 4, className: 'tdPassword'},
            {targets: [7], className: 'tdTelephone'}, /*телефон*/
            {targets: [8], className: 'tdData'} /*дата*/

        ],

        /*указывает стили для колонок, определенного типа данных*/

        arrStyleTdEmail: {
            'white-space': 'nowrap'
        },

        arrStyleTdPassword: {
            'font-size': '10px',
            'word-break': 'break-all', /*перенос слов*/
            'wrap': 'soft'
        },

        arrStyleTdCurrency: {
            'white-space': 'nowrap'
        },

        arrStyleTdTelephone: {
            'white-space': 'nowrap'
        },

        arrStyleTdData: {
            'white-space': 'nowrap'
        },

        arrStyleTdCreditNumber: {
            'white-space': 'nowrap'
        },

        /*если указан false, тогда будет показан вертикальный скроллинг*/
        pagingForDataTables: true, /*постраничный вывод*/

        urlUpdateOfResource: '', /*адрес ресурса, на который отправляется запрос на обновление данных*/
        urlDelete: '', /*адрес ресурса, на который отправляется запрос на удаление данных*/

        lengthCreditCardNumber: 16, /*длина номера кредитной карты*/

        /*стили для колонок таблицы (`th`) (елси не используется плагин dataTables)*/
        arrStyleForWidthTh: [
            {}, /*0*/
            {}, /*1*/
            {}, /*2*/
            {}, /*3*/
            {}, /*4*/
            {
                /*пароль*/
                'width': '10%',
                'word-break': 'break-all', /*перенос слов*/
                'wrap': 'soft'
            }, /*5*/
            {}, /*6*/
            {
                'padding-left': '5px',
                'padding-right': '5px',
                'white-space': 'nowrap' /* Запрещаем перенос текста */
            }, /*7*/
            {
                'padding-left': '5px',
                'padding-right': '5px',
                'white-space': 'nowrap' /* Запрещаем перенос текста */
            }, /*8*/
            {}, /*9*/
            {} /*10*/
        ]
    });

});

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

    var selectorOwner = 'selectorOwner';
    var selectorLevelAccess = 'levelAccess';

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

    $('.' + selectorOwner + ' ' + 'span').html(firstName + " " + lastName);

    $('.' + selectorLevelAccess + ' ' + 'span').html(authority);

}