//INDEX.HTML
function hplOnChange(value)
{
    if(value.length > 2)
    {
        document.getElementById("autoComplete").style.display = "flex";
        let heightIndex = 1;

        var child = document.getElementById("autoComplete").lastElementChild;
        while(child) 
        {
            document.getElementById("autoComplete").removeChild(child);
            child = document.getElementById("autoComplete").lastElementChild;
        }
        
        fetch(`https://api.resrobot.se/v2/location.name?key=8632211a-4860-4bb0-9ba2-ccadddd95457&input=${value}&format=json&maxNo=7`)
        .then(resp => resp.json())
        .then(data => 
        {
            data.StopLocation.forEach(result => 
            {
                document.getElementById("autoComplete").insertAdjacentHTML("beforeend", `<a class="autoCompleteResult" data-stationID="${result.id}" onClick="autoCompleteFunction(this)">${result.name}</a>`)
                heightIndex = (heightIndex + 1.65)
                document.getElementById("autoComplete").style.height = `${heightIndex}em`;
            })
        })
    }
    else
    {
        document.getElementById("autoComplete").style.display = "none";
    }
}

function autoCompleteFunction(station)
{
    document.getElementById("hplInput").value = station.text;
    window.localStorage.setItem('station', station.text);
    window.localStorage.setItem('stationID', station.getAttribute("data-stationID"));
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

//RESULTAT.HTML

window.onload = function() 
{
    loadData();
    setInterval(function() 
    {
        loadData();
    }, 60000);
}

function loadData()
{
    document.getElementById("bodyContent").innerHTML = "";
    document.getElementById("HeaderText").textContent = window.localStorage.getItem('station')
    
    fetch(`https://api.resrobot.se/v2/departureBoard?key=8eb4ba1b-10c5-4965-a263-4c4e10b4fee3&id=${window.localStorage.getItem("stationID")}&maxJourneys=10&format=json`)
    .then(resp => resp.json())
    .then(data => 
    {
        data.Departure.forEach(result => 
        {
            var timeMs = Math.abs(new Date(Date.parse(`${result.date}T${result.time}`)) - new Date());
            var minutes = Math.floor((timeMs/1000)/60);
            var distance = walkingDistance(minutes)
            document.getElementById("bodyContent").insertAdjacentHTML
            (
                "beforeend", `
                <div class="finalResultDiv">
                    <span class="finalResultNum">${result.transportNumber} </span> 
                    <span class"finalResultStop">${result.direction} </span>
                    <span class="finalResultTime">
                        ${Math.floor((timeMs/1000)/60)} min
                        <p class="finalResultTimeWalking">
                            ${distance}
                        </p>
                    </span>
                </div>`
            )
        })
    })
}

function walkingDistance(minutes)
{
    if(Math.floor(minutes - window.localStorage.getItem("distance")) < 0)
    {
        return `Hinner ej till </br> denna avgång`
    }
    else
    {
        return `Gå om ${Math.floor(minutes - window.localStorage.getItem("distance"))} min`
    }
}
