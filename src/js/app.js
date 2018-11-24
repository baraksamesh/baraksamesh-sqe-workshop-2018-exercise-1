import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {jsonToArray} from './code-analyzer';

const createTable = (tableData) => {
    if(tableData.length == 0)
        return '';
    tableData.forEach(element => {tableData = tableData.concat(jsonToArray(element, []));});
    var titles = ['Line', 'Type', 'Name', 'Condition', 'Value'];
    var result = '<table width="40" border >';
    result += '<tr>';
    titles.forEach((element) => {result += '<th>'+element+'</th>';});
    result += '</tr>';
    for(var i=0; i<tableData.length; i++) {
        result += '<tr>';
        for(var j=0; j<tableData[i].length; j++)
            result += '<td>'+tableData[i][j]+'</td>';
        result += '</tr>';
    }
    result += '</table>';

    return result;
};


$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
    });
    $('#tableCreationButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        let table = createTable(parsedCode);
        $('#myTr').empty();
        $('#myTr').append(table);
    });
});
