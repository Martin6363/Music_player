const wrapper  = document.querySelector('.wrapper ');
const playBtn = document.getElementById('mainPlayBtn');
const audio = document.getElementById('audio');
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');
const trackTitle = document.querySelector('.track-title');
const range = document.getElementById('range');
const thumb = document.querySelector('.slider-thumb');
const progress = document.querySelector('.progress');
const time = document.querySelector('.time');
const fullTime = document.querySelector('.fulltime');
const volumeSlider = document.querySelector('.volume-slider #slider');
const volumeProgress = document.querySelector('.volume-slider .progress');
const volumeIcon = document.querySelector('.volume-icon');
const playerImg = document.getElementById('player-img');
const playerDiv = document.getElementById('player');
const menuBtn = document.getElementById("menu-btn");
const menuTrackList = document.getElementById("menu-track-list");

// Is track playing
let trackPlaying = false;
// Is the volume muted
let volumeMute = false;
// Which track is currently
let trackId = 0;


// Menu button function
menuBtn.onclick = function() {
    playerDiv.classList.toggle('menu-active');
    if (menuBtn.innerHTML.includes('fa-xmark')) {
        menuBtn.innerHTML = '<i class="fa-sharp fa-solid fa-bars"></i>';
      } else {
        menuBtn.innerHTML = '<i class="fa-sharp fa-solid fa-xmark"></i>';
      }
    
}


// All Music
let tracks = [
    {
        music: "Arthur Meschian-Zarmanum_em",
        artist: "Artur Meschian",
        image: "Meschian.jpg"
    },
    {
        music: "DAN BALAN-Люби",
        artist: "DAN BALAN",
        image: "danBalan.jpg"
    },
    {
        music: "Dan Balan & Vera Brezhneva - Petals of tears",
        artist: "Dan Balan & Vera Brezhneva",
        image: "Dan_Balan_2.jpg"
    },
    {
        music: "Arabic Remix Mawjou Galbi",
        artist: "Arabic Remix - Mawjou Galbi",
        image: "woman-img2.jpg"
    },

    {
        music: "АРТУР САРКИСЯН - _РАНИЛА_ (ПРЕМЬЕРА КЛИПА)",
        artist: "АРТУР САРКИСЯН - РАНИЛА",
        image: "artur_sargisyan.jpg"
    },       
    
    {
        music: "bomb_remix",
        artist: "Rap REMIX",
        image: "mercedes.jpg"
    },
    {
        music: "Artem Valter - Es Qo Sirov (Safaryan Remix) 2023",
        artist: "Artem Valter",
        image: "woman-img1.jpg"
    },
    {
        music: "Arshavir_Martirosyan_DU_CHKAS",
        artist: "Arshavir Martirosyan",
        image: "music_img1.jpg",
    },
    {
        music: "AKSA_vor",
        artist: "Aksa",
        image: "music_img2.jpg"
    }
]

// Play && Stop Music
playBtn.addEventListener('click', function () {
    playTrack();
    if (!trackPlaying) {
        playerDiv.classList.remove("rotateAnimate");
    } else {
        playerDiv.classList.add("rotateAnimate");
    }
});


// Play music function
function playTrack () {
    if(!trackPlaying) {
        audio.play();
        playBtn.innerHTML = `
            <i class="fa-sharp fa-solid fa-pause"></i>
        `
        trackPlaying = true;
    } else {
        audio.pause();
        playBtn.innerHTML = `
            <i class="fa-sharp fa-solid fa-play"></i>
        `
        trackPlaying = false;
    }
}


// play music left && right btn
function switchTrack () {
    if (trackPlaying) {
        audio.play();
    }
}


function loadTrack () {
    audio.addEventListener('loadeddata', () => {
        setTime(fullTime, audio.duration);
        range.setAttribute('max', audio.duration);
    });
    audio.src = `./tracks/${tracks[trackId].music}.mp3`;
    audio.load();
    trackTitle.innerHTML = tracks[trackId].artist;
    playerImg.src = `./img/${tracks[trackId].image}`;
    wrapper.style.backgroundImage = `url(./img/${tracks[trackId].image}`;
    progress.style.width = 0;
    thumb.style.left = 0;
    if (!tracks[trackId].image) {
        wrapper.style.background = '#26282c';
        playerImg.src = "./img/disk-img.png"
    }
}
loadTrack();


btnPrev.addEventListener('click', () => {
    trackId--;

    if (trackId < 0) {
        trackId = tracks.length - 1
    }
    loadTrack()
    switchTrack();
})


btnNext.addEventListener('click', nextTrack);


function nextTrack () {
    trackId++
    if (trackId > tracks.length - 1) {
        trackId = 0;
    }
    loadTrack();
    switchTrack()
}

// if the song survives the next one will come
audio.addEventListener('ended', nextTrack)


// Time && Second song
function setTime(output, input) {
    const minutes = Math.floor(input / 60);
    const seconds = Math.floor(input % 60);
    if (seconds < 10) {
        output.innerHTML = minutes + ":0" + seconds;
    } else {
        output.innerHTML = minutes + ":" + seconds;
    }
}
setTime(fullTime, audio.duration);


audio.addEventListener('timeupdate', () => {
    const currentAudioTime = Math.floor(audio.currentTime);
    const timePrecept =  (currentAudioTime / audio.duration) * 100 + '%';
    progress.style.width = timePrecept;
    thumb.style.left = timePrecept;
    setTime(time, currentAudioTime);
})


function customSlider() {
    const val = (range.value / audio.duration) * 100 + '%';
    progress.style.width = val;
    thumb.style.left = val;
    setTime(time, range.value);
    audio.currentTime = range.value;
}
customSlider();

range.addEventListener("input", customSlider);


function customVolumeSlider () {
    const maxVal = volumeSlider.getAttribute("max");
    let val = (volumeSlider.value / maxVal) * 100 + "%";
    volumeProgress.style.width = val;
    audio.volume = volumeSlider.value / 100;
    if(audio.muted === false) {
        audio.muted = true;
    }
    audio.muted = false;
    if (audio.volume < 0.5) {
        volumeIcon.innerHTML = `
            <i class="fa-sharp fa-solid fa-volume-low"></i>
        `
    } else if (audio.volume === 0) {
        volumeIcon.innerHTML = `
            <i class="fa-sharp fa-solid fa-volume-off"></i>
        `
    } else {
        volumeIcon.innerHTML = `
            <i class="fa-sharp fa-solid fa-volume-high" id="slider"></i>
        `
    }
}

customVolumeSlider()
volumeSlider.addEventListener("input", customVolumeSlider);

// Volume mute and Sound
function muteVolume () {
    if (!volumeMute) {
        volumeIcon.innerHTML = '<i class="fa-sharp fa-solid fa-volume-xmark"></i>'
        volumeProgress.style.width = 0 + "%";
        audio.muted = true;
        volumeMute = true;
    } else {
        audio.muted = false;
        volumeProgress.style.width = volumeSlider.value + '%';
        volumeIcon.innerHTML = '<i class="fa-sharp fa-solid fa-volume-high"></i>'
        volumeMute = false;
    }
    
}
volumeIcon.onclick = function () {
    muteVolume();
}


// Create all tracks for menu list
function createTrackList (array) {
    return array.map((elem, i) => {
        return `
            <div class="list-tracks-block" onclick="menuTrack(${i})">
                <div class="remove-track" onclick="removeTrack(${i})"><i class="fa-sharp fa-solid fa-xmark"></i></div>
                ${indexTrack(i)}.<h4>${elem.artist}</h4>
            </div>
        `
    });
}
menuList();


// Check index number 0-9 
function indexTrack (index) {
    if (index < 9) {
        return `0${index + 1}`;
    } else {
        return index + 1
    }
}

function menuList () {
    menuTrackList.innerHTML = createTrackList(tracks).join('');
    if (tracks.length > 7) {
        menuTrackList.style.overflowY = 'scroll';
    }
};


// Menu all tracks
function menuTrack (index) {
    if (tracks[index] && tracks[index].music) {
        let track = tracks[index];
        audio.src = `./tracks/${track.music}.mp3`;
        trackTitle.innerHTML = track.artist;
        playerImg.src = `./img/${track.image}`;
        wrapper.style.backgroundImage = `url(./img/${track.image}`;
        playerDiv.classList.add("rotateAnimate");
        playTrack();
        audio.play();
    } else if (tracks.length === 0) {
        wrapper.style.background = '#26282c';
        playerImg.src = "./img/disk-img.png"
        audio.src = '';
        trackTitle.innerHTML = 'Not a music';
        time.innerHTML = '0:00';
        fullTime.innerHTML = '0:00';
        range.disabled = true;
        playBtn.innerHTML = '<i class="fa-sharp fa-solid fa-play"></i>';
        playBtn.disabled = true;
        btnPrev.disabled = true;
        btnNext.disabled = true;
        playerDiv.classList.remove("rotateAnimate") 
        
    }
}


function removeTrack (i) {
    tracks.splice(i, 1)
    console.log(tracks);
    
    menuList();
}


function calculatePurchaseAndSale(price, quantity) {
    const purchaseAmount = price * quantity;
    const saleAmount = purchaseAmount * 1.1; // Assuming a 10% profit margin
  
    return { purchase: purchaseAmount, sale: saleAmount };
  }
  
  // Input values
  const price = 40; // Price per unit
  const quantity = 100; // Quantity of items
  
  // Calculate purchase and sale amounts
  const { purchase, sale } = calculatePurchaseAndSale(price, quantity);
  
  // Output the results
  console.log(`Purchase amount: $${purchase}`);
  console.log(`Sale amount: $${sale}`);
  