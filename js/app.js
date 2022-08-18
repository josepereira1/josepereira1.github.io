function updateAboutMe(){
    $('#age').html(age('1997-06-19').years)
}

function age(date) {  
    var dob = new Date(date);

    var dobYear = dob.getYear();  
    var dobMonth = dob.getMonth();  
    var dobDate = dob.getDate();  
    var now = new Date();  
    var currentYear = now.getYear();  
    var currentMonth = now.getMonth();  
    var currentDate = now.getDate();  
    var age = {};  
    yearAge = currentYear - dobYear;

    if(currentYear == dobYear && currentMonth < dobMonth) return false;

    if (currentMonth >= dobMonth)  
        var monthAge = currentMonth - dobMonth;  
    else {  
        yearAge--;  
        var monthAge = 12 + currentMonth - dobMonth;  
    }
    if (currentDate >= dobDate)  
        var dateAge = currentDate - dobDate;  
    else {  
        monthAge--;  
        var dateAge = 31 + currentDate - dobDate;  
    
        if (monthAge < 0) {  
            monthAge = 11;  
            yearAge--;  
        }  
    }  
    age = {  
        years: yearAge,  
        months: monthAge,  
        days: dateAge  
    };
    return age
}