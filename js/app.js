const githubUsername = 'josepereira1'
var maxProjectsPerPage = 5
var lastPage
var numberPages
var githubProjectsJson = {}
var downloadIcon = '<svg width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-cloud-download" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z"/><path fill-rule="evenodd" d="M7.646 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V5.5a.5.5 0 0 0-1 0v8.793l-2.146-2.147a.5.5 0 0 0-.708.708l3 3z"/></svg>'
//  birthday here to calculate age
const year = 1997, month = 6, day = 19;

//  used to not spend unnecessary requests in development (aboute me information, projects requested to github, because exists max limit of requests)
var dev = false

function parseDate(dateFormat){
    substr = dateFormat.split('T')
    date = substr[0]
    time = substr[1].split(':')

    hour = time[0]
    min = time[1]

    return date + ' ' + hour + 'h' + min + 'min'
}

function getProjectsByPage(page){
    console.log('getProjectsByPage')
    
    if(dev === true || page <= 0 || page > numberPages) return 

    if(Object.keys(githubProjectsJson).length === 0){
        $("#sideNavlinkProjects").css('display', 'none')
        $("#linkProjects").css('display', 'none')
        $("#projects").html("")
    }

    if(githubProjectsJson.length > 0){
        createProjectsTable(page)
        updatePagination(page)
        lastPage = page
    }
}

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
        content = "<tr onclick=location.href=\"" + githubProjectsJson[i].html_url + '"><td style="word-break: break-all;">' + githubProjectsJson[i].name + "</td><td>" + parseDate(githubProjectsJson[i].created_at) + "</td><td>" + parseDate(githubProjectsJson[i].updated_at) + "</td><td>" + language + '</td><td><a href="https://api.github.com/repos/josepereira1/' + githubProjectsJson[i].name + '/zipball/master">' + downloadIcon + '</a></td></tr>';
        $('#projectsTable').append(content);
    }
}

function updatePagination(actualPage){
    $('#back').removeClass('disabled')
    $('#linkBack').removeClass('disabled')
    $('#next').removeClass('disabled')
    $('#linkNext').removeClass('disabled')

    if(actualPage == 1){
        $('#back').addClass('disabled')
        $('#linkBack').attr('onclick', '')
        $('#linkNext').attr('onclick', 'getProjectsByPage(' + (actualPage + 1) + ')')
    }else if (actualPage == numberPages){
        $('#next').addClass('disabled')
        $('#linkNext').attr('onclick', '')
        $('#linkBack').attr('onclick', 'getProjectsByPage(' + (actualPage - 1) + ')')
    }else{
        $('#linkBack').attr('onclick', 'getProjectsByPage(' + (actualPage - 1) + ')')
        $('#linkNext').attr('onclick', 'getProjectsByPage(' + (actualPage + 1) + ')')
    }
}

function loadProjects(comparator, firstTime){
    console.log('loadProjects')
    if(dev === true) return ;

    $(document).ready(function(){
        $.get('https://api.github.com/users/' + githubUsername + '/repos?sort=' + comparator).done(function(data) {
            console.log('GET https://api.github.com/users/' + githubUsername + '/repos?sort=' + comparator)
            githubProjectsJson = data

            numberPages = calculateNumberPages();
            if(firstTime === true) pagination(numberPages, 1);
            else updatePagination(lastPage)

            getProjectsByPage(1)

        }).fail(function(){
            $("#sideNavlinkProjects").css('display', 'none')
            $("#linkProjects").css('display', 'none')
            $("#projects").html("")
        })
    });
}

function calculateNumberPages(){
    console.log('calculateNumberPages')
    let decimalValue = (githubProjectsJson.length / maxProjectsPerPage)
    let constValue = Math.round(decimalValue)
    let tmp = 0
    //  this if is needed, because, if the result is 4.1 I want to numberPages = 5
    if(decimalValue > constValue)tmp = constValue + 1 
    else tmp = constValue

    return tmp
}

function pagination(numberPages, page){
    console.log('pagination')
    $('#pagination').append('<li id="back" class="waves-effect disabled"><a id="linkBack" href="#!"><i class="material-icons">chevron_left</i></a></li>')

    for(i = 1; i <= numberPages; i++){
        if(i == page) content = "<li id=\"pag" + i + "\" class=\"waves-effect disabled\"><a onclick=getProjectsByPage(" + i + ")>" + i +"</a></li>";
        else content = "<li id=\"pag" + i + "\" class=\"waves-effect\"><a onclick=getProjectsByPage(" + i + ")>" + i +"</a></li>";
        $('#pagination').append(content);
    }

    $('#pagination').append('<li id="next" class="waves-effect"><a id="linkNext" onclick="getProjectsByPage(' + (page + 1) + ')" href="#!"><i class="material-icons">chevron_right</i></a></li>')
}

function calculateAge() {
    console.log('calculateAge')
    //  you could specify hour and minutes
    var ageDifMs = Date.now() - new Date(year, month, day, 0, 0, 0, 0);
    var ageDate = new Date(ageDifMs);
    $('#age').html(Math.abs(ageDate.getUTCFullYear() - 1970) + ' years')
}

function aboutme(){
    console.log('aboutme')
    if(dev === true) return ;

    $(document).ready(function(){
        $.get('https://api.github.com/users/' + githubUsername) .done(function(data) {
            console.log('GET https://api.github.com/users/' + githubUsername)
            var profile = data
            
            if(profile.location != '')$('#location').append(profile.location)
            else $('#location').append('Portugal')
            
            if(profile.public_repos != '' && profile.public_repos != 0)$('#publicrepos').append(profile.public_repos)
            else $('#publicrepos').append('---')

            if(profile.name && profile.name != '')$('#name').append(profile.name)
            else $('#name').append('José Pereira')
            
        }).fail(function(){
            $('#location').append('Portugal')
            $('#publicrepos').append('---')
            $('#name').append('José Pereira')
        })
    });
}

//  future things ------------------------------------------------------------------------------

function skills(){
    if(dev) return ;

    var top = 5 

    //  in development
    $(document).ready(function(){
        $.get('https://api.github.com/users/' + githubUsername + '/repos') .done(function(data) {
            console.log('GET https://api.github.com/users/' + githubUsername + '/repos')
            githubProjectsJson = data
            var skills = {}

            for(i = 0; i < githubProjectsJson.length; i++){
                if(githubProjectsJson[i].languages_url){
                    $.get(githubProjectsJson[i].languages_url).done(function(data){
                        for(key in data){
                            skills[key] = skills[key] + data[key]
                        }
                    })
                }
            }

            let arr = []

            let big = -1

            console.log(skills)

            for(i = 0; i < top; i++){
                for(key in skills){
                    if(skills[key] > big && !arr.includes(key)){
                        big = skills[key]
                        console.log(big)
                        arr.push(key)
                    }
                }
            }

            console.log(arr)
        }).fail(function(){
            $("#sideNavlinkProjects").css('display', 'none')
            $("#linkProjects").css('display', 'none')
            $("#projects").html("")
        })
    });
}