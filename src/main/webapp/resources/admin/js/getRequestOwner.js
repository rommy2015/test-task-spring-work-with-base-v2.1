$(document).ready(function () {

    var urlRequestOwner = "api/users/owner";

    $('body').requestOwnerPlugin({

        urlDataOwnerOfRequest: urlRequestOwner,

        nameElemForOwner: [
            {'nameElemRu': 'Пользователь'},
            {'nameElemEn': 'User'}
        ],

        nameElemForAccess: [
            {'nameElemRu': 'Уровень доступа'},
            {'nameElemEn': 'Access level'}
        ],
    });

});


