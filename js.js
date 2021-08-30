function hplOnChange(value)
{
    let index = 0;
    if(value.length > 2)
    {
        console.log("abc");
        document.getElementById("autoComplete").style.display = "flex";
        let heightIndex = 1;
        
        fetch(`https://api.resrobot.se/v2/location.name?key=8632211a-4860-4bb0-9ba2-ccadddd95457&input=${value}&format=json&maxNo=7`)
        .then(resp => resp.json())
        .then(data => {
            data.StopLocation.forEach(result => {

                document.getElementById("autoComplete").insertAdjacentHTML("beforeend", `<a class="autoCompleteResult" data-stationID="${result.id}" onClick="autoCompleteFunction(this)">${result.name}</a>`)
                heightIndex = (heightIndex + 1.65)
                document.getElementById("autoComplete").style.height = `${heightIndex}em`;
            })
        })
    }
    else
    {
        console.log("arg")
        document.getElementById("autoComplete").style.display = "none";
    }
}

function autoCompleteFunction(station)
{
    console.log("test")
    document.getElementById("hplInput").value = station.text;
    window.localStorage.setItem('station', station.text);
    window.localStorage.setItem('stationID', station.getAttribute("data-stationID"))
    document.getElementById("autoComplete").style.display = "none";
}

function searchButton()
{
    let distance = document.getElementById("gngInput").value;
    window.localStorage.setItem('distance', distance)

    if(hplInput.value.length > 6)
    {
    window.open ("resultat.html", "_self")

    
    }
    else
    {
        alert("Vänligen fyll i hållplats!")
    }
}






window.onload = function() 
{
    document.getElementById("HeaderText").textContent = window.localStorage.getItem('station')

    fetch(`https://api.resrobot.se/v2/departureBoard?key=8eb4ba1b-10c5-4965-a263-4c4e10b4fee3&id=${window.localStorage.getItem("stationID")}&maxJourneys=7&format=json`)
    .then(resp => resp.json())
    .then(data => 
        {
            data.Departure.forEach(result => 
            {
                document.getElementById("bodyContent").insertAdjacentHTML("beforeend", `<p class="finalResult">${result.name}</p>`)
            })
        })
}