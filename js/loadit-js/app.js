//  variables
var lastPage
var numberPages
var githubProjectsJson = {}

/**
 * load information necessary to create projects table
 * @param {String} comparator comparator is the sort method (options: created, updated, pushed, full_name)
 */
function loadProjects(comparator){
    if(dev === true) return ;

    $(document).ready(function(){
        $.get('https://api.github.com/users/' + githubUsername + '/repos?sort=' + comparator).done(function(data) {
            githubProjectsJson = data

            if(Object.keys(githubProjectsJson).length === 0){
                $("#projects").html("")
                console.log('%c' + '[LOG FROM LOADIT]: This message appears when there are no projects associated with this github account (username: ' + githubUsername +') or you forgot to put your github username in the loadit-js/variables.js file. The table of projects was not displayed for this reason!', 'color: red')
                return ;
            }

            createPagination(1);
            createProjectsTableAndPaginationOfPage(1)
        }).fail(function(){
            $("#projects").html("")
        })
    });
}