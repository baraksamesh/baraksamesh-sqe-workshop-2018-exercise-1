import * as esprima from 'esprima';
import * as escodegen from 'escodegen';
const parseCode = (codeToParse) => {
    var tableData = [];
    var parsedObject = esprima.parseScript(codeToParse,{loc:true});
    parsedObject.body.forEach(element => {tableData = tableData.concat(jsonToArray(element, []))});
    return tableData;
};

const jsonToArray = (jsonObject, table) => {
    if(jsonObject.type == "FunctionDeclaration"){
        functionHandler(jsonObject, table);
    }else if(jsonObject.type == "WhileStatement"){
        whileHandler(jsonObject, table);
    }else if(jsonObject.type == "ForStatement"){
        forHandler(jsonObject, table);
    }else if(jsonObject.type == "IfStatement"){
        ifHandler(jsonObject, table);
    }else if(jsonObject.type == "ExpressionStatement"){
        expHandler(jsonObject, table);
    }else if(jsonObject.type == "VariableDeclaration"){
        vardecHandler(jsonObject, table);
    }else if(jsonObject.type == "ReturnStatement"){
        returnHandler(jsonObject, table);
    }
    
    return table;
};

const functionHandler = (jsonObject, table) =>{
    var row = [];
    row.push(jsonObject.loc.start.line);
    row.push("function declaration");
    row.push(jsonObject.id.name);
    row.push("");
    row.push("");
    table.push(row);
    jsonObject.params.forEach(param => {paramHandler(param, table)});   //params
    jsonObject.body.body.forEach(statement => {jsonToArray(statement, table)});   //body
    return table;
}

const whileHandler = (jsonObject, table) =>{
    var row = [];
    row.push(jsonObject.loc.start.line);
    row.push("while statement");
    row.push("");
    row.push(escodegen.generate(jsonObject.test));
    row.push("");
    table.push(row);
    (jsonObject.body.body === undefined) ? jsonToArray(jsonObject.body, table):
    jsonObject.body.body.forEach(statement => {jsonToArray(statement, table)});   //body
    return table;
}

const forHandler = (jsonObject, table) =>{
    var row = [];
    row.push(jsonObject.loc.start.line);
    row.push("for statement");
    row.push("");
    row.push(escodegen.generate(jsonObject.init)+"; "+escodegen.generate(jsonObject.test)+"; "+escodegen.generate(jsonObject.update));
    row.push("");
    table.push(row);
    jsonObject.body.body === undefined ? jsonToArray(jsonObject.body, table):
    jsonObject.body.body.forEach(statement => {jsonToArray(statement, table)});   //body
    return table;
}

const ifHandler = (jsonObject, table) =>{
    var row = [];
    row.push(jsonObject.loc.start.line);
    row.push("if statement"); row.push("");
    row.push(escodegen.generate(jsonObject.test));
    row.push("");
    table.push(row);
    jsonObject.consequent.body === undefined ? jsonToArray(jsonObject.consequent, table):
    jsonObject.consequent.body.forEach(statement => {jsonToArray(statement, table)});   //body
    if(jsonObject.alternate!==null){
        row = [];
        row.push(jsonObject.alternate.loc.start.line);
        row.push("else statement");
        row.push("");  row.push("");  row.push("");
        table.push(row);
        jsonObject.alternate.body === undefined ? jsonToArray(jsonObject.alternate, table):
        jsonObject.alternate.body.forEach(statement => {jsonToArray(statement, table)});   //body
    }
    return table;
}

const expHandler = (jsonObject, table) =>{
    var row = [];
    row.push(jsonObject.loc.start.line);
    row.push("assignment expression");
    row.push(jsonObject.expression.left.name);
    row.push("");
    row.push(escodegen.generate(jsonObject.expression.right));
    table.push(row);
    return table;
}

const vardecHandler = (jsonObject, table) =>{
    var row = [];
    jsonObject.declarations.forEach(vardec =>{
        row.push(vardec.id.loc.start.line);
        row.push("variable declaration");
        row.push(vardec.id.name);
        row.push("");
        row.push(vardec.init === null ? "" : escodegen.generate(vardec.init));
        table.push(row);
        row = [];
    });
    return table;
}

const paramHandler = (jsonObject, table) =>{
    var row = [];
    row.push(jsonObject.loc.start.line);
    row.push("variable declaration");
    row.push(jsonObject.name);
    row.push("");
    row.push("");
    table.push(row);
    row = [];
    return table;
}

const returnHandler = (jsonObject, table) =>{
    var row = [];
    row.push(jsonObject.loc.start.line);
    row.push("return statement");
    row.push("");
    row.push("");
    row.push(escodegen.generate(jsonObject.argument));
    table.push(row);
    return table;
}

export { parseCode };
export { jsonToArray };
