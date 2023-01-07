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
    //clearing the bdayApodList in case it was output
    document.getElementById("bdayApodList").innerHTML = '';
    //making sure apodRow is displayed
    document.getElementById("currentApodRow").style.display = 'flex';

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
            else if(data.media_type === 'video'){
                //only displaying the iframe element
                document.getElementById("apodImage").style.display = 'none';
                document.getElementById("apodVideo").style.display = 'block';
                //get video url
                document.getElementById("apodVideo").src = data.url;
            }
            else{
                //display neither the iframe nor the image
                document.getElementById("apodImage").style.display = 'none';
                document.getElementById("apodVideo").style.display = 'none';
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

//function to add bdayApodColumn to bdayApodList element
function addBdayApodColumn(imgDisplay, vidDisplay, imgSrc, vidSrc, apodName, apodDate, loopCount){
    var content = '';

    content += '<div id="bdayApod'+loopCount+'" class="col-md-4 p-2">';
        content += '<div class="row bg-secondary">';
            content += '<img id="bdayApodImage'+loopCount+'" style="object-fit:cover; object-position:50% 50%; height:200px; width:100%; display:'+imgDisplay+';" src="'+imgSrc+'" alt="bday-apod-image" />';
            content += '<iframe id="bdayApodVideo'+loopCount+'" style="object-fit:cover; height:200px; width:100%; display:'+vidDisplay+';" src="'+vidSrc+'" frameborder="0"></iframe>';
        content += '</div>';
        content += '<div class="row text-center p-3">';
            content += '<h4 class="fw-semibold" id="bdayApodName'+loopCount+'">'+apodName+'</h4>';
            content += '<p id="bdayApodDate'+loopCount+'">'+apodDate+'</p>';
        content += '</div>';
    content += '</div>';

    document.getElementById("bdayApodList").innerHTML += content;
}

//function to fetch apod data for bdayApodsList
//function is asynchronous so that the function can await the completion of fetch before continuing(solves asynchronous apod data bug)
async function fetchBdayApodData(url, loopDate, loopCount){
    //fetching data from NASA API
    await fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if(data.media_type === 'image'){
                addBdayApodColumn('block', 'none', data.hdurl, '', data.title, loopDate, loopCount);
            }
            else if(data.media_type === 'video'){
                addBdayApodColumn('none', 'block', '', data.url, data.title, loopDate, loopCount);
            }
            else{
                addBdayApodColumn('none', 'none', '', '', data.title, loopDate, loopCount);
            }
        })
        .catch(err => {
            console.log(err);
        });
}



//this function fetches data from NASA API to get APODs released on a user's bday since their DOB
//or since the date of the first APOD(June 1995)
//function is asynchronous so that the while loop can await the completion of fetchBdayData() before continuing.(solves asynchronous apod data bug)
async function getBirthdayAPODs(){
    //changing apodTitle, removing today's apod and removing previous bdayApodList if there was any
    document.getElementById("apodTitle").innerText = 'Birthday APOD list';
    document.getElementById("currentApodRow").style.display = 'none';
    document.getElementById("bdayApodList").innerHTML = '';

    let bday = document.getElementById("birthdayInput").value;
    let bdayDate = new Date(bday);
    //if someone is born before 1995 then convert their bdayDate year to 1995
    //this makes the logic for checking if to start their apods in '95 or '96 easier
    if(Number(bdayDate.getFullYear()) < 1995){
        bdayDate = new Date(`1995${bday.substring(4)}`);
    }
    
    let currentDate = new Date();
    let firstApodDate = new Date("1995-06-16");

    
    //getting every birthday after June 15th 1995 and outputting their apod to the DOM
    //This includes the ones which were converted to '95 and come after 15th June 1995
    if(bdayDate.getTime() >= firstApodDate.getTime()){
        var counterYear = bdayDate.getFullYear();
        var loopCount = 1;
        
        while(bdayDate.getTime() <= currentDate.getTime()){
            let loopDate = `${bdayDate.getFullYear()}-${Number(bdayDate.getMonth())+1}-${bdayDate.getDate()}`;
            let url = 'https://api.nasa.gov/planetary/apod?api_key=GTgDxMg6JEfbQPwYdlLPfygL8XDmEVWp8HWkzNnm&date='+loopDate;

            await fetchBdayApodData(url, bdayDate.toDateString(), loopCount);
            console.log(bdayDate.toDateString());

            loopCount += 1;
            counterYear += 1;
            bdayDate = new Date(`${counterYear}-${Number(bdayDate.getMonth())+1}-${bdayDate.getDate()}`);
        }
    }
    else{
        var counterYear = 1996;
        var loopCount = 1;
        bdayDate = new Date(`${counterYear}-${Number(bdayDate.getMonth())+1}-${bdayDate.getDate()}`);

        while(bdayDate.getTime() <= currentDate.getTime()){
            let loopDate = `${bdayDate.getFullYear()}-${Number(bdayDate.getMonth())+1}-${bdayDate.getDate()}`;
            let url = 'https://api.nasa.gov/planetary/apod?api_key=GTgDxMg6JEfbQPwYdlLPfygL8XDmEVWp8HWkzNnm&date='+loopDate;

            await fetchBdayApodData(url, bdayDate.toDateString(), loopCount);
            console.log(bdayDate.toDateString());
            
            loopCount += 1;
            counterYear += 1;
            bdayDate = new Date(`${counterYear}-${Number(bdayDate.getMonth())+1}-${bdayDate.getDate()}`);
        }
    }
}