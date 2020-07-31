var maxProjectsPerPage = 6
var lastPage
var numberPages
var jsonData = {}
var control = 1
var downloadIcon = '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-cloud-download" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z"/><path fill-rule="evenodd" d="M7.646 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V5.5a.5.5 0 0 0-1 0v8.793l-2.146-2.147a.5.5 0 0 0-.708.708l3 3z"/></svg>'

//  used to not spend unnecessary requests in development
var dev = new Boolean(false)

function getProjectsByPage(page){

    if(dev === true) return ;

    if(page <= 0 || page > numberPages) return 

    let controlFlag = 1

    if(!jsonData || jsonData.length == 0){
        $(document).ready(function(){
            $.get("https://api.github.com/users/josepereira1/repos") .done(function(data) {
                console.log("GET https://api.github.com/users/josepereira1/repos")
                control = 50
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
    
        minIndex = (page-1)*maxProjectsPerPage
        maxIndex = (page-1)*maxProjectsPerPage + (maxProjectsPerPage-1)

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
            content = "<tr onclick=location.href=\"" + jsonData[i].html_url + "\"><td>" + jsonData[i].name + "</td><td>" + date + ' ' + hour + 'h' + min + 'min' + "</td><td>" + language + '</td><td><a href="https://api.github.com/repos/josepereira1/' + jsonData[i].name + '/zipball/master">' + downloadIcon + '</a></td></tr>';
            $('#projectsTable').append(content);
        }

        $('#back').removeClass('disabled')
        $('#linkBack').removeClass('disabled')
        $('#next').removeClass('disabled')
        $('#linkNext').removeClass('disabled')

        if(page == 1){
            $('#back').addClass('disabled')
            $('#linkBack').addClass('disabled')
            $('#linkNext').attr('onclick', 'getProjectsByPage(' + (page + 1) + ')')
        }else if (page == numberPages){
            $('#next').addClass('disabled')
            $('#linkNext').addClass('disabled')
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
        $.get("https://api.github.com/users/josepereira1/repos") .done(function(data) {
            console.log("GET https://api.github.com/users/josepereira1/repos")
            jsonData = data
            let content = ""

            numberPages = Math.round(jsonData.length / maxProjectsPerPage);

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
                content = "<tr onclick=location.href=\"" + jsonData[i].html_url + "\"><td>" + jsonData[i].name + "</td><td>" +  date + ' ' + hour + 'h' + min + 'min' + "</td><td>" + language + '</td><td><a href="https://api.github.com/repos/josepereira1/' + jsonData[i].name + '/zipball/master">' + downloadIcon + '</a></td></tr>';
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
    let year = 1997, month = 6, day = 19, hour = 14, min = 15;
    var ageDifMs = Date.now() - new Date(year, month, day, hour, min, 0, 0);
    var ageDate = new Date(ageDifMs);
    $('#age').html(Math.abs(ageDate.getUTCFullYear() - 1970) + ' years')
}

function aboutme(){
    $(document).ready(function(){
        $.get("https://api.github.com/users/josepereira1") .done(function(data) {
            console.log("GET https://api.github.com/users/josepereira1")
            var profile = data
            
            $('#location').append(profile.location)
            $('#publicrepos').append(profile.public_repos)
            $('#name').append(profile.name)
            
        }).fail(function(){
            $('#location').append('---')
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
        $.get("https://api.github.com/users/josepereira1/repos") .done(function(data) {
            console.log("GET https://api.github.com/users/josepereira1/repos")
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