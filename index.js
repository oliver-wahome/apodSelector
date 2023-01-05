/**
 * Astronomy Picture of the Day Selector program
 */

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

//this function fetches data of the current APOD(Astronomy Picture of the Day) from NASA API.
//It then adds that information to html elements to be output to the DOM
function getAPOD(checkEvent){
    let url = '';
    let apodTitle = '';
    let apodDate = '';
    let apodDateStr = '';

    //checking whether the function was called onload or onclick
    if(checkEvent === 'onload'){
        url = 'https://api.nasa.gov/planetary/apod?api_key=GTgDxMg6JEfbQPwYdlLPfygL8XDmEVWp8HWkzNnm';
        apodTitle = 'Today\'s APOD';
    }
    else if(checkEvent === 'onclick'){
        apodDate = document.getElementById("apodDateInput").value;
        //changing the apodDate format from YYYY/MM/DD to DD/MM/YYYY
        apodDateStr = `${apodDate.substring(8)}/${months[Number(apodDate.substring(5,7))-1]}/${apodDate.substring(0,4)}`;
        //adding the date query parameter to the url and assigning it the value of apodDate
        url = 'https://api.nasa.gov/planetary/apod?api_key=GTgDxMg6JEfbQPwYdlLPfygL8XDmEVWp8HWkzNnm&date='+apodDate;
        
        //checking if user has selected a date before submitting
        //if not the apodTitle is changed
        if(apodDate){
            apodTitle = 'The APOD from ' + apodDateStr;
        }
        else {
            apodTitle = 'Select a date before submitting';
        }
    }

    document.getElementById("apodTitle").innerText = apodTitle;

    //fetching data from NASA API
    fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if(data.media_type === 'image'){
                //only displaying the image element
                document.getElementById("apodVideo").style.display = 'none';
                document.getElementById("apodImage").style.display = 'block';
                //get picture hd url
                document.getElementById("apodImage").src = data.hdurl;
            }
            else if(data.media.type === 'video'){
                //only displaying the iframe element
                document.getElementById("apodImage").style.display = 'none';
                document.getElementById("apodVideo").style.display = 'block';
                //get video url
                document.getElementById("apodVideo").src = data.url;
            }

            document.getElementById("apodName").innerText = data.title;
            document.getElementById("apodDescription").innerText = data.explanation;
        })
        .catch(err => {
            console.log(err);
        });
}
//this statement calls the getAPOD function onload of the window
window.onload = getAPOD('onload');

//this function fetches data from NASA API to get APODs released on a user's bday since their DOB
//or since the date of the first APOD(June 1995)
function getBirthdayAPODs(){
    let bday = document.getElementById("birthdayInput").value;
    const bdayDate = new Date(bday);
    let bdYear = bdayDate.getFullYear();
    var bdMonth = bdayDate.getMonth();
    let bdDay = bdayDate.getDate();
    const currentDate = new Date();
    let curYear = currentDate.getFullYear();
    let curMonth = currentDate.getMonth();
    let curDay = currentDate.getDate();
    const firstApodDate = new Date("1995-06-16");
    let apodYear = firstApodDate.getFullYear();
    let apodMonth = firstApodDate.getMonth();
    let apodDay = firstApodDate.getDate();

    //console.log(bdayDate.toString());
    //getting every birthday after June 16th 1995
    if(bdYear >= apodYear){
        while(bdYear <= curYear){
            console.log(`${bdDay}/${months[bdMonth]}/${bdYear}`);
            bdYear += 1;
        }
    }
    else{
        while(counterYear <= curYear){
            console.log(`${bdDay}/${months[bdMonth]}/${bdYear}`);
            bdYear += 1;
        }
    }
}