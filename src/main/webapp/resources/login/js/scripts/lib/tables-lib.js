/*Функции для работы с таблицами*/


/*разбор json-объекта, содержащего данные 
* из таблицы
* data - объект, содержащие данные из таблицы
* selectorTableList - селектор тега <table>  */
function searchDataFromTable (data, selectorTableList) {
    $.each(data, function (index, row) {
        addRow(row, selectorTableList);
       // $(".tableList").floatThead('reflow');
    });
}


/*рисование одной строки в таблице*/
function addRow(row, selectorTableList) {

    var listFromRow ='';
    
    /*Получаем данные из json-объект, полученные от клиента.
  Перебор всех имен полей объекта (имен ключей свойств в JSON),
  по имнеи обращаемся к значению свойства;
   имена ключей свойств JSON, имеет соответсвующие назавания
   в POJO-классе на стороне клиента
   */
    $.each(row, function (key, value){
        listFromRow += '<td>' + value + '</td>';
    });

    /*Полученные ячейки одной строки, добавляем в теги, обозначющие
    * строку в таблице*/
    var employeeRow = '<tr>' + listFromRow + '</tr>';

    /*Получаем точку узла, где находится таблица, а затем получаем
    * доступ к последнему ряду тела таблицы*/
    var employeeList = $(selectorTableList).find("tbody:last");

    /*добавляем строку в указанное место*/
    employeeList.append(employeeRow);
}