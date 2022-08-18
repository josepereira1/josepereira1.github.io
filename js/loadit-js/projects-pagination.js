/**
 * Create pagination.
 * @param {*} page current page
 */
function createPagination(page){

    numberPages = calculateNumberPages()

    $('#pagination').html('')
    $('#pagination').append('<li id="back" class="' + classForPaginationItem + ' disabled"><a id="linkBack" class="' + classForPaginationLink +'" href="#!">Previous</a></li>')

    for(i = 1; i <= numberPages; i++){
        if(i == page) content = "<li id=\"pag" + i + "\" class=\"" + classForPaginationItem + " disabled\"><a class=\""+ classForPaginationLink +"\" onclick=createProjectsTableAndPaginationOfPage(" + i + ")>" + i +"</a></li>";
        else content = "<li id=\"pag" + i + "\" class=\"" + classForPaginationItem + "\"><a class=\""+ classForPaginationLink +"\" onclick=createProjectsTableAndPaginationOfPage(" + i + ")>" + i +"</a></li>";
        $('#pagination').append(content);
    }

    $('#pagination').append('<li id="next" class="'+ classForPaginationItem +'"><a class="'+ classForPaginationLink +'" id="linkNext" onclick="createProjectsTableAndPaginationOfPage(' + (page + 1) + ')" href="#!">Next</a></li>')
}

/**
 * Calculate number of pages based on max per page, and number of projects
 */
function calculateNumberPages(){
    let decimalValue = (githubProjectsJson.length / maxProjectsPerPage)
    let constValue = Math.round(decimalValue)
    let tmp = 0
    
    //  this if is needed, because, if the result is 4.1 I want to numberPages = 5
    if(decimalValue > constValue)tmp = constValue + 1 
    else tmp = constValue

    return tmp
}

/**
 * Update html of pagination, with currente page.
 * @param {*} actualPage current page
 */
function updatePagination(actualPage){
    $('#back').removeClass('disabled')
    $('#linkBack').removeClass('disabled')
    $('#next').removeClass('disabled')
    $('#linkNext').removeClass('disabled')

    if(actualPage == 1){
        $('#back').addClass('disabled')
        $('#linkBack').attr('onclick', '')
        $('#linkNext').attr('onclick', 'createProjectsTableAndPaginationOfPage(' + (actualPage + 1) + ')')
    }else if (actualPage == numberPages){
        $('#next').addClass('disabled')
        $('#linkNext').attr('onclick', '')
        $('#linkBack').attr('onclick', 'createProjectsTableAndPaginationOfPage(' + (actualPage - 1) + ')')
    }else{
        $('#linkBack').attr('onclick', 'createProjectsTableAndPaginationOfPage(' + (actualPage - 1) + ')')
        $('#linkNext').attr('onclick', 'createProjectsTableAndPaginationOfPage(' + (actualPage + 1) + ')')
    }
}