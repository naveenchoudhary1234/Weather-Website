const userTab=document.querySelector("[data-userWeather]")
const searchTab=document.querySelector("[data-searchWeather]")
const userContainer=document.querySelector(".weather-container")
const grantAccessContainer=document.querySelector(".grant-location-container")
const searchForm=document.querySelector("[data-searchForm]")
const loadingScreen=document.querySelector(".loading-container")
const userInfoContainer=document.querySelector(".user-info-container")


let oldTab=userTab;
const API_KEY="cde09739a6e2f620708efe45324d456f";
oldTab.classList.add("current-tab");



function switchTab(newTab){
    if(newTab!=oldTab){
        oldTab.classList.remove("current-tab");
        oldTab=newTab;
        oldTab.classList.add("current-tab");
        
        if(!searchForm.classList.contains("active")){
            // kya search vala tab invisible hai to make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            // main pehle seach vale tab p tha your weather visible karna hai
            searchTab.classList.remove("active");
            userInfoContainer.classList.remove("active");

    // ab main your weather tab m aagya hy to weather display krna pdega to visible bnayenge so check local storage
    // local storage m latitude aur longitude pde h save h
    getfromSessionStorage();
        }

    }
}
// function h jp switch krega
userTab.addEventListener("click",()=>{
    switchTab(userTab);
})
searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
})
// check coordinates are already present
function getfromSessionStorage(){
const localCoordinates=sessionStorage.getItem("user-coordinates");
if(!localCoordinates){
    grantAccessContainer.classList.add("active");
}
else{
    const coordinates=JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
}
}

 async function fetchUserWeatherInfo(coordinates){
    const {lat,lon}=coordinates;
    // make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    // make loader visible
    loadingScreen.classList.add("active");

    // make API CALL
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}`);
    const data= await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    // data m vaise value nikalega aur put kardega
    renderWeatherInfo(data);

    }
    catch(err){
        loadingScreen.classList.remove("active")
    }
}

function renderWeatherInfo(weatherInfo){
    // firsty we have yo fetch the element
    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windSpeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");

    // fetch values from weather info object and put in ui object
    cityName.innerText=weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherInfo?.weather?.[0]?.description;
    weatherIcon.src= weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText=weatherInfo?.main?.temp;
    windSpeed.innerText=weatherInfo?.wind?.speed;
    humidity.innerText=weatherInfo?.main?.humidity;
    cloudiness.innerText=weatherInfo?.clouds?.all;
    
}

// grant acces p listener lgana pdegaa
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("no geolocation support");
    }
}

function showPosition(position){
    const userCoordinates={
    lat:position.coords.latitude,
    lon:position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);

// search form 
let searchInput=document.querySelector("[data-searchInput]")
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName=searchInput.ariaValueMax;
    if(cityName==="") return;
    else
    fetchSearchWeatherInfo(cityName);

})
async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        
    }
}
