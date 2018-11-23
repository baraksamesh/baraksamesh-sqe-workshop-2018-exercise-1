import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('')),
            '[]'
        );
    });

    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a = 1;')),
            '[[1,"variable declaration","a","","1"]]')});

    it('is parsing a single-expression-if statement correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('if (x<4) x=5;')),
            '[[1,"if statement","","x < 4",""],[1,"assignment expression","x","","5"]]')});

    it('is parsing a multy-expression-if statement with single-expression-else statement correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('if(x==y){x=4;y=5} else x=5;')),
            '[[1,"if statement","","x == y",""],'+
            '[1,"assignment expression","x","","4"],[1,"assignment expression","y","","5"]'+
            ',[1,"else statement","","",""],[1,"assignment expression","x","","5"]]')});

    it('is parsing an if statement with a multy-expression-else statement scorrectly', () => {
        assert.equal(
            JSON.stringify(parseCode('if(x == y){x=4} else{x = 5;y = x};')),
            '[[1,"if statement","","x == y",""],[1,"assignment expression","x","","4"],'+
            '[1,"else statement","","",""]'+
            ',[1,"assignment expression","x","","5"],[1,"assignment expression","y","","x"]]')});

    it('is parsing a single-expression-while statement correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('while( true )x=x + 1;')),
            '[[1,"while statement","","true",""],[1,"assignment expression","x","","x + 1"]]')});

    it('is parsing a multy-expression-while statement correctly correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('while(x > 5){b1=true;b2=false;}')),
            '[[1,"while statement","","x > 5",""],'+
            '[1,"assignment expression","b1","","true"],[1,"assignment expression","b2","","false"]]')});

   it('is parsing a single-expression for statement correctly', () => {
    assert.equal(
        JSON.stringify(parseCode('for(i = 2; i < 4; i++)x = x + 2;')),
        '[[1,"for statement","","i = 2; i < 4; i++",""],[1,"assignment expression","x","","x + 2"]]')});

    it('is parsing a multi-expression for statement correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('for(i = 2; i < 4; i++){x = x + 2;y = true}')),
            '[[1,"for statement","","i = 2; i < 4; i++",""],'+
            '[1,"assignment expression","x","","x + 2"],[1,"assignment expression","y","","true"]]')});

    it('is parsing a return statement correctly', () => {
        assert.equal(
        JSON.stringify(parseCode('function foo(){return x + 2;}')),
        '[[1,"function declaration","foo","",""],[1,"return statement","","","x + 2"]]')});

        it('is parsing a function correctly', () => {
            assert.equal(
            JSON.stringify(parseCode('function foo(x){let y;}')),
            '[[1,"function declaration","foo","",""],'+
            '[1,"variable declaration","x","",""],[1,"variable declaration","y","",""]]')});
});
