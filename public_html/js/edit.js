function searchCategories(){
    var text = toOnlyLiterals($('#search-categories-text').val());
    for(var i in categories.categories){
        if(toOnlyLiterals(categories.categories[i].name).includes(text))$($('#category-wrapper').children()[i]).css({'display':'block'});
        else $($('#category-wrapper').children()[i]).css({'display':'none'});
    }
}

function submidCategory(index){
    var text = $('#edit-words-text').text();
    if(checkForUnique(categories.categories,text)){
        categories.categories.unshift({'index':0,'name':text,'words':[]});
        ajustArrayIndex(categories.categories);
        openPage('edit',categories);
    }
    else{
        Materialize.toast('Das Word ist bereits in der Liste',1000);
    }
}  

function editCategory(){
    $('#edit-words').css({'display':'none'});
    $('#editable-words').css({'display':'block'});
    $('#edit-words-text').focus().keyup(function(){
        if(checkForUnique(categories.categories,$('#edit-words-text').text()))$('#edit-words-text').css({'color':'black'});
        else $('#edit-words-text').css({'color':'red'});
    });
}