/**
 * Fill the html table with content of current page projects (on tbody tag). 
 * @param {*} actualPage actual page 
 */
function createProjectsTable(actualPage){
    let minIndex = (actualPage-1)*maxProjectsPerPage
    let maxIndex = (actualPage-1)*maxProjectsPerPage + (maxProjectsPerPage-1)

    if(maxIndex > (githubProjectsJson.length -1)) maxIndex = (githubProjectsJson.length -1)

    $('#projectTableContent').html("")
    $("#pag" + actualPage).addClass("disabled")
    $("#pag" + lastPage).removeClass("disabled")

    for(i = minIndex; i <= maxIndex; i++){

        if(githubProjectsJson[i].language)language = githubProjectsJson[i].language 
        else language = " -- "
        content = "<tr class=\"" + classForTrTagOfHtmlTable + "\"onclick=location.href=\"" + githubProjectsJson[i].html_url + '"><td class="' + classForTdTagOfHtmlTable + '" style="word-break: break-all;">' + githubProjectsJson[i].name + '</td><td class="' + classForTdTagOfHtmlTable + '">' + parseDate(githubProjectsJson[i].created_at) + '</td><td class="' + classForTdTagOfHtmlTable + '">' + parseDate(githubProjectsJson[i].updated_at) + '</td><td class="' + classForTdTagOfHtmlTable + '">' + language + '</td><td class="' + classForTdTagOfHtmlTable + '"><a href="https://api.github.com/repos/' + githubUsername + '/' + githubProjectsJson[i].name + '/zipball/master">' + downloadItem + '</a></td></tr>';
        $('#projectsTable').append(content);
    }
}