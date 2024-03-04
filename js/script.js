// console.log("Lets write JavaScript");
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if(isNaN(seconds) || seconds < 0){
        return "00:00";
    }
    // Calculate minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2,'0');
    const formattedSeconds = String(remainingSeconds).padStart(2,'0');
    

    // Concatenate minutes and seconds with a colon and return
    return `${formattedMinutes}:${formattedSeconds}`;
}

// Example usage:
var totalSeconds = 12;
var formattedTime = secondsToMinutesSeconds(totalSeconds);
// console.log(formattedTime); // Output will be "00:12"


// Example usage:
var totalSeconds = 72;
var formattedTime = secondsToMinutesSeconds(totalSeconds);
// console.log(formattedTime); // Output will be "01:12"


async function getSongs(folder){ 
currFolder = folder;
let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
let response = await a.text();
// console.log(response)
let div = document.createElement("div");
div.innerHTML = response;
let as = div.getElementsByTagName("a");

songs = [];
for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if(element.href.endsWith(".mp3")){
        songs.push(element.href.split(`/${folder}/`)[1])
    } 
    
}

//Play the first song

//show all the songs in the playlist
let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
songUL.innerHTML = "";
for (const song of songs) {
    songUL.innerHTML = songUL.innerHTML + `<li> <img class="invert" src="img/music.svg" alt="">
            <div class="info">
               <div>${song.replaceAll("%20", " ").replaceAll("%5D", "").replaceAll("%5", "")}</div>
               <div>Kabir</div>
            </div>
            <div class="playNow">
              <span>Play Now</span>
              <img class = "invert" src="img/play.svg" alt="">
            </div> </li>`;  
}
// Attach an event listener to each song
Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
    e.addEventListener("click", element=>{
        // console.log(e.querySelector(".info").firstElementChild.innerHTML)
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

    })
})
return songs

}

const playMusic = (track, pause=false)=>{
    // let audio = new Audio("/songs/" + track)
    currentSong.src = `/${currFolder}/` + track
    if(!pause){
        currentSong.play()
        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function displayAlbums(){
    let a = await fetch("http://127.0.0.1:5500/songs/")
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
        for (let index = 2; index < array.length; index++) {
            const e = array[index];
        // console.log(e.href)
        if(e.href.includes("/songs")){
        let folder = e.href.split("/").slice(-1)[0]; 
        
        // Get the metadata of the folder 
        let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
        let response = await a.json();
        // console.log(response)
        cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
        <div class="play">
            <svg xmlns="http://www.w3.org/2000/svg" width="55" height="55" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="12" style="fill: black;" />
              <circle cx="12" cy="12" r="12" style="fill: rgb(68, 162, 68);" />
              <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="000000" stroke-width="1" stroke-linejoin="round"  />        
            </svg>
        </div>
        <img src="/songs/${folder}/cover.jpeg" alt="">
        <h2>${response.title}</h2>
        <p>${response.description}</p>
        </div>`
        }
    }
    
    //Load the playlist whenever the card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click", async item=>{
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
    })
    
    // Attach an event listener play and pause. 
    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })
    //Add an event listener to previous
    previous.addEventListener("click", ()=>{
        // console.log("previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index-1) >= 0){
            playMusic(songs[index-1])
        } 
    })

    //Add an event listener to next
    next.addEventListener("click", async ()=>{

        
        let index = await songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index+1) < songs.length ){
            playMusic(songs[index+1])
        }
    })
    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent+ "%"
        currentSong.currentTime = ((currentSong.duration) * percent)/100;
    })
     // Add an event to volume
     document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
        // console.log("Setting volume to", e.target.value ,"/ 100")
        currentSong.volume = parseInt(e.target.value)/100;
    }) 
    // Add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e=>{
        // console.log(e.target)
        if(e.target.src.includes("img/volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 20;
        }
    })
}

async function main(){

    //Get the list of all the songs
    await getSongs("songs/ncs");
    playMusic(songs[0], true)

    // Display all the albums on the page
    displayAlbums()
    // Attach an event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element=>{
            // console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    })
    
    // Attach an event listener play, next and previous 
    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })


    //Listen for time update event
    currentSong.addEventListener("timeupdate", ()=>{
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration) * 100 + "%";
    })

    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent+ "%"
        currentSong.currentTime = ((currentSong.duration) * percent)/100;
    })

    //Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0";
    })
    //Add an event listener for close button
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-110%";
    })

    //Add an event listener to previous
    previous.addEventListener("click", ()=>{
        // console.log("previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index-1) >= 0){
            playMusic(songs[index-1])
        } 
    })

    //Add an event listener to next
    next.addEventListener("click", ()=>{
        // console.log("Next clicked")
        // currentSong.pause(); (not required)

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index+1) < songs.length ){
            playMusic(songs[index+1])
        }
    })

    // Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
        // console.log("Setting volume to", e.target.value ,"/ 100")
        currentSong.volume = parseInt(e.target.value)/100;
    }) 

    // Add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e=>{
        console.log(e.target)
        if(e.target.src.includes("img/volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 20;
        }
    })

    // //Load the playlist whenever the card is clicked
    // Array.from(document.getElementsByClassName("card")).forEach(e=>{
    //     e.addEventListener("click", async item=>{
    //         songs = await getSongs(`songs/${ item.currentTarget.dataset.folder}`)
    //     })
    // })
    //play the first song
    // var audio = new Audio(songs[0]);
    // audio.play();

    // audio.addEventListener("loadeddata", ()=>{
    //     console.log(audio.duration, audio.currentSrc, audio.currentTime)
    // });

}

main()