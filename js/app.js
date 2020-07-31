var maxProjectsPerPage = 6
var lastPage
var numberPages
var jsonData = {}
var control = 1

function getProjectsByPage(page){

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
            last_update = jsonData[i].updated_at.split(" ")
            if(jsonData[i].language)language = jsonData[i].language 
            else language = " -- "
            content = "<tr onclick=location.href=\"" + jsonData[i].html_url + "\"><td>" + jsonData[i].name + "</td><td>" +  last_update[0] + "</td><td>" + language + "</td></tr>";
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
    
    if(page <= 0 || page > numberPages) return

    $(document).ready(function(){
        $.get("https://api.github.com/users/josepereira1/repos") .done(function(data) {
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
                last_update = jsonData[i].updated_at.split(" ")
                if(jsonData[i].language)language = jsonData[i].language 
                else language = " -- "
                content = "<tr onclick=location.href=\"" + jsonData[i].html_url + "\"><td>" + jsonData[i].name + "</td><td>" +  last_update[0] + "</td><td>" + language + "</td></tr>"
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

function calculateAge() { // birthday is a date
    let year = 1997, month = 6, day = 19, hour = 14, min = 15;
    var ageDifMs = Date.now() - new Date(year, month, day, hour, min, 0, 0);
    var ageDate = new Date(ageDifMs); // miliseconds from epoch

    $('#paragraph-about-me').html('My name is José Pereira, I am '+ Math.abs(ageDate.getUTCFullYear() - 1970) + ' years old, from Portugal and live in <a href="https://www.google.pt/maps/place/Braga/data=!4m2!3m1!1s0xd24febc6cf5d867:0xbc5d054162d1e218?sa=X&ved=0ahUKEwiQ1IKygaTcAhUJC-wKHZIiA2cQ8gEIJzAA">Braga</a>. My main goals are become the development of my capacities about different programming languages and learn more about software design and development.')
}

function skills(){
    var topValue = 5 

    //  in development
    $(document).ready(function(){
        $.get("https://api.github.com/users/josepereira1/repos") .done(function(data) {
            var jsonData = data
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

            for(i = 0; i < topValue; i++){
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
