/**
 * Create projects table and update pagination of page.
 * @param {Number} page actual page
 */
function createProjectsTableAndPaginationOfPage(page){
    if(dev === true || page <= 0 || page > numberPages) return 

    if(Object.keys(githubProjectsJson).length === 0 || githubProjectsJson.length === 0){ 
        $("#projects").html("")
    }

    if(githubProjectsJson.length > 0){
        createProjectsTable(page)
        updatePagination(page)
        lastPage = page
    }
}