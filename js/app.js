var maxProjectsPerPage = 6
var lastPage

function getProjectsByPage(page){

    $(document).ready(function(){
        $.get("https://api.github.com/users/josepereira1/repos") .done(function(data) {
            jsonData = data
            let content = ""

            console.log(jsonData)

            minIndex = (page-1)*maxProjectsPerPage
            maxIndex = (page-1)*maxProjectsPerPage + (maxProjectsPerPage-1)

            $('#projectsTable').html("")

            console.log("pag" + page);
            $("#pag" + page).addClass("disabled")
            $("#pag" + lastPage).removeClass("disabled")

            for(i = minIndex; i <= maxIndex; i++){
                last_update = jsonData[i].updated_at.split(" ")
                if(jsonData[i].language)language = jsonData[i].language 
                else language = " -- "
                content = "<tr onclick=location.href=\"" + jsonData[i].html_url + "\"><td>" + jsonData[i].name + "</td><td>" +  last_update[0] + "</td><td>" + language + "</td></tr>";
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

function numberPages(page){
    $(document).ready(function(){
        $.get("https://api.github.com/users/josepereira1/repos") .done(function(data) {
            jsonData = data
            let content = ""

            numberPages = Math.round(jsonData.length / maxProjectsPerPage);

            for(i = 1; i <= numberPages; i++){
                if(i == page)content = "<li id=\"pag" + i + "\" class=\"disabled\"><a>" + i +"</a></li>";
                else content = "<li id=\"pag" + i + "\" class=\"waves-effect\"><a onclick=getProjectsByPage(" + i + ")>" + i +"</a></li>";
                $('#pagination').append(content);
            }
            minIndex = (page-1)*maxProjectsPerPage
            maxIndex = (page-1)*maxProjectsPerPage + (maxProjectsPerPage-1)

            for(i = minIndex; i <= maxIndex; i++){
                last_update = jsonData[i].updated_at.split(" ")
                if(jsonData[i].language)language = jsonData[i].language 
                else language = " -- "
                content = "<tr onclick=location.href=\"" + jsonData[i].html_url + "\"><td>" + jsonData[i].name + "</td><td>" +  last_update[0] + "</td><td>" + language + "</td></tr>";
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
    $(document).ready(function(){
        $.get("https://api.github.com/users/josepereira1/repos") .done(function(data) {
            var jsonData = data
            var skills = {}

            console.log(jsonData)

            for(i = 0; i < jsonData.length; i++){
                console.log(jsonData[i].languages_url)
                if(jsonData[i].languages_url){
                    $.get(jsonData[i].languages_url).done(function(data){
                        $.each(data, function(){
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
