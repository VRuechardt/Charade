

function submidWords(index){
    var text = $('#edit-words-text').text();
    if(checkForUnique(categories.categories[index].words,text)){
        categories.categories[index].words.unshift({'index':0,'name':text,'diff':0,'selfcreated':{'categorieindex':index,'wordindex':0}});
        ajustArrayIndex(categories.categories[index].words);
        openPage('words',categories.categories[index]);
    }
    else{
        Materialize.toast('Das Word ist bereits in der Liste',1000);
    }
}  

function editWords(index,context){
    $('#edit-words').css({'display':'none'});
    $('#editable-words').css({'display':'block'});
    $('#edit-words-text').focus().keyup(function(){
        if(checkForUnique(categories.categories[index].words,$('#edit-words-text').text()))$('#edit-words-text').css({'color':'black'});
        else $('#edit-words-text').css({'color':'red'});
    });
}

function removeWord(categorie,word){
    categories.categories[categorie].words.splice(word,1);
    ajustArrayIndex(categories.categories[categorie].words);
    openPage('words',categories.categories[categorie]);
}


function returnToEditCategory(){
    $('#edit-words').css({'display':'block'});
    $('#editable-words').css({'display':'none'});
}
