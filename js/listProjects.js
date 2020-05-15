function loadProjects(){
    $(document).ready(function(){
        $.get("https://api.github.com/users/josepereira1/repos") .done(function(data) {
            jsonData = data
            let content = ""
            let languages = []
            for(i = 0; i < jsonData.length; i++){
                last_update = jsonData[i].updated_at.split(" ")
                if(jsonData[i].language)language = jsonData[i].language 
                else language = " -- "
                content = "<tr onclick=location.href=\"" + jsonData[i].html_url + "\"><td>" + jsonData[i].name + "</td><td>" +  last_update[0] + "</td><td>" + language + "</td></tr>";
                $('#projectsTable').append(content);
            }
        }).fail(function(){
            $("#message").html("")
            $("#projectsTable").html("")
            $('#message').append("Error loading the information of projects, you can see on <a href=\"https://github.com/josepereira1\">github</a>.")
            $("footer").html("")
        })
    });
}
