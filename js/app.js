var maxProjectsPerPage = 6
var lastPage
var numberPages

function getProjectsByPage(page){
    if(page != 0 || page != numberPages){
        $(document).ready(function(){
            $.get("https://api.github.com/users/josepereira1/repos") .done(function(data) {
                jsonData = data
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
            }).fail(function(){
                $("#sideNavlinkProjects").attr("href","https://github.com/josepereira1")
                $("#linkProjects").attr("href","https://github.com/josepereira1")
                $("#projects").html("")
            })
        });
    }
}

function numberPages(page){
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
            $("#sideNavlinkProjects").attr("href","https://github.com/josepereira1")
            $("#linkProjects").attr("href","https://github.com/josepereira1")
            $("#projects").html("")
        })
    });
}

function skills(){
    //  in development
    $(document).ready(function(){
        $.get("https://api.github.com/users/josepereira1/repos") .done(function(data) {
            var jsonData = data
            var skills = {}

            for(i = 0; i < jsonData.length; i++){
                console.log(jsonData[i].languages_url)
                if(jsonData[i].languages_url){
                    $.get(jsonData[i].languages_url).done(function(data){
                        $.each(data, function(){
                            console.log(data)
                            console.log(this)
                        })
                    })
                }
            }
        }).fail(function(){
            $("#sideNavlinkProjects").attr("href","https://github.com/josepereira1")
            $("#linkProjects").attr("href","https://github.com/josepereira1")
            $("#projects").html("")
        })
    });
}
