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

function calculateAge() { // birthday is a date
    let year = 1997, month = 6, day = 19, hour = 14, min = 15;
    var ageDifMs = Date.now() - new Date(year, month, day, hour, min, 0, 0);
    var ageDate = new Date(ageDifMs); // miliseconds from epoch

    $('#age').html(Math.abs(ageDate.getUTCFullYear() - 1970) + ' years')
}

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

function aboutme(){
    $(document).ready(function(){
        $.get("https://api.github.com/users/josepereira1") .done(function(data) {
            console.log("GET https://api.github.com/users/josepereira1")
            var profile = data

            console.log(profile.bio)
            
            $('#bio').append(profile.bio)
        }).fail(function(){
        })
    });
}


$(window).on("resize", function(){
    if(window.innerWidth < 1200 || mobileCheck() === false){
        $('#about-me-table').removeClass('s9')
        $('#about-me-table').addClass('s12')
        $('#about-me-img').css('display', 'none')
    }else{
        $('#about-me-table').removeClass('s12')
        $('#about-me-table').addClass('s9')
        $('#about-me-img').css('display', 'block')
    }
});

window.mobileCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};