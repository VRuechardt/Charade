
function toOnlyLiterals(string){
    return string.toLowerCase().replace(/[^a-zA-Z0-9]/g,'');
}

function checkForUnique(array,text){
    if(text=='')return false;
    for(var item in array){
        if(toOnlyLiterals(array[item].name) == toOnlyLiterals(text)){
            return false;
        }
    }
    return true;
}

function ajustArrayIndex(array){
    for(var i in array){
        array[i].index = Number(i);
        if(array[i].selfcreated)array[i].selfcreated.wordindex = Number(i);
    }
    //localStorage.clear();
}
