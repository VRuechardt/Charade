function editCategory(index){
    $('#edit-words').css({'display':'none'});
    $('#editable-words').css({'display':'block'});
}

function submidContent(index){
    var text = $('#edit-words-text').text();
    var exists = false;
    for(var item in categories.categories[index].words){
        if(categories.categories[index].words[item].name == text){
            exists = true;
            break;
        }
    }
    console.log(text == 'Alf Poier');
    console.log(exists);
}