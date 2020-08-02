const githubUsername = 'josepereira1'
var maxProjectsPerPage = 5
var lastPage
var numberPages
var jsonData = {}
var downloadIcon = '<svg width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-cloud-download" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z"/><path fill-rule="evenodd" d="M7.646 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V5.5a.5.5 0 0 0-1 0v8.793l-2.146-2.147a.5.5 0 0 0-.708.708l3 3z"/></svg>'

//  birthday here to calculate age
const year = 1997, month = 6, day = 19;

//  used to not spend unnecessary requests in development (aboute me information, projects requested to github, because exists max limit of requests)
var dev = false

function getProjectsByPage(page){

    if(dev === true) return ;

    if(page <= 0 || page > numberPages) return 

    let controlFlag = 1

    if(!jsonData || jsonData.length == 0){
        $(document).ready(function(){
            $.get('https://api.github.com/users/' + githubUsername + '/repos?sort=updated') .done(function(data) {
                console.log('GET https://api.github.com/users/' + githubUsername + '/repos?sort=updated')
                jsonData = data
            }).fail(function(){
                controlFlag = 0
                $("#sideNavlinkProjects").css('display', 'none')
                $("#linkProjects").css('display', 'none')
                $("#projects").html("")
            })
        });
    }

    if(controlFlag == 1 || jsonData.length > 0){
        let content = ""
    
        let minIndex = (page-1)*maxProjectsPerPage
        let maxIndex = (page-1)*maxProjectsPerPage + (maxProjectsPerPage-1)

        if(maxIndex > (jsonData.length -1)) maxIndex = (jsonData.length -1)

        $('#projectTableContent').html("")
        $("#pag" + page).addClass("disabled")
        $("#pag" + lastPage).removeClass("disabled")

        for(i = minIndex; i <= maxIndex; i++){

            substr = jsonData[i].updated_at.split('T')
            date = substr[0]
            time = substr[1].split(':')

            hour = time[0]
            min = time[1]

            if(jsonData[i].language)language = jsonData[i].language 
            else language = " -- "
            content = "<tr onclick=location.href=\"" + jsonData[i].html_url + '"><td style="word-break: break-all;">' + jsonData[i].name + "</td><td>" + date + ' ' + hour + 'h' + min + 'min' + "</td><td>" + language + '</td><td><a href="https://api.github.com/repos/josepereira1/' + jsonData[i].name + '/zipball/master">' + downloadIcon + '</a></td></tr>';
            $('#projectsTable').append(content);
        }

        $('#back').removeClass('disabled')
        $('#linkBack').removeClass('disabled')
        $('#next').removeClass('disabled')
        $('#linkNext').removeClass('disabled')

        if(page == 1){
            $('#back').addClass('disabled')
            $('#linkBack').attr('onclick', '')
            $('#linkNext').attr('onclick', 'getProjectsByPage(' + (page + 1) + ')')
        }else if (page == numberPages){
            $('#next').addClass('disabled')
            $('#linkNext').attr('onclick', '')
            $('#linkBack').attr('onclick', 'getProjectsByPage(' + (page - 1) + ')')
        }else{
            $('#linkBack').attr('onclick', 'getProjectsByPage(' + (page - 1) + ')')
            $('#linkNext').attr('onclick', 'getProjectsByPage(' + (page + 1) + ')')
        }

        lastPage = page
    }
}

function numberPages(page){
    if(dev === true) return ;
    
    if(page <= 0 || page > numberPages) return

    $(document).ready(function(){
        $.get('https://api.github.com/users/' + githubUsername + '/repos?sort=updated') .done(function(data) {
            console.log('GET https://api.github.com/users/' + githubUsername + '/repos?sort=updated')
            jsonData = data
            let content = ""

            console.log(jsonData)

            let decimalValue = (jsonData.length / maxProjectsPerPage)
            let constValue = Math.round(decimalValue)
            
            //  this if is needed, because, if the result is 4.1 I want to numberPages = 5
            if(decimalValue > constValue) numberPages = constValue + 1
            else numberPages = constValue

            $('#pagination').append('<li id="back" class="waves-effect disabled"><a id="linkBack" href="#!"><i class="material-icons">chevron_left</i></a></li>')

            for(i = 1; i <= numberPages; i++){
                if(i == page) content = "<li id=\"pag" + i + "\" class=\"waves-effect disabled\"><a onclick=getProjectsByPage(" + i + ")>" + i +"</a></li>";
                else content = "<li id=\"pag" + i + "\" class=\"waves-effect\"><a onclick=getProjectsByPage(" + i + ")>" + i +"</a></li>";
                $('#pagination').append(content);
            }

            $('#pagination').append('<li id="next" class="waves-effect"><a id="linkNext" onclick="getProjectsByPage(' + (page + 1) + ')" href="#!"><i class="material-icons">chevron_right</i></a></li>')

            minIndex = (page-1)*maxProjectsPerPage
            maxIndex = (page-1)*maxProjectsPerPage + (maxProjectsPerPage-1)

            for(i = minIndex; i <= maxIndex; i++){

                substr = jsonData[i].updated_at.split('T')
                date = substr[0]
                time = substr[1].split(':')

                hour = time[0]
                min = time[1]

                if(jsonData[i].language)language = jsonData[i].language 
                else language = " -- "
                content = '<tr onclick=location.href="' + jsonData[i].html_url + '"><td style="word-break: break-all;">' + jsonData[i].name + "</td><td>" +  date + ' ' + hour + 'h' + min + 'min' + "</td><td>" + language + '</td><td><a href="https://api.github.com/repos/josepereira1/' + jsonData[i].name + '/zipball/master">' + downloadIcon + '</a></td></tr>';
                $('#projectsTable').append(content);
            }

            lastPage = page

        }).fail(function(){
            $("#sideNavlinkProjects").css('display', 'none')
            $("#linkProjects").css('display', 'none')
            $("#projects").html("")
        })
    });
}

function calculateAge() {
    //  you could specify hour and minutes
    var ageDifMs = Date.now() - new Date(year, month, day, 0, 0, 0, 0);
    var ageDate = new Date(ageDifMs);
    $('#age').html(Math.abs(ageDate.getUTCFullYear() - 1970) + ' years')
}

function aboutme(){
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
            jsonData = data
            var skills = {}

            for(i = 0; i < jsonData.length; i++){
                if(jsonData[i].languages_url){
                    $.get(jsonData[i].languages_url).done(function(data){
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