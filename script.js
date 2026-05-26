let challengeNr
let planTime = 60
let playTime = 600

let planTimer
let playTimer

let synth = window.speechSynthesis
let voices
let voice
const readyTexts = [
  "Pennen neer.",
  "Tingeling. Tingeling.",
  "Game over.",
  "Batterij 0%.",
  "De ballon is leeg."
]

// section: settings
const settingsSection = document.querySelector("#settings")
const settingsForm = settingsSection.querySelector("form")

// section: plan 
const planSection = document.querySelector("#plan")
const planChallengeNr = planSection.querySelector("strong")
const planTimeEl = planSection.querySelector("time")

// section: play 
const playSection = document.querySelector("#play")
const playChallengeNr = playSection.querySelector("strong")
const playTimeEl = playSection.querySelector("time")

// reset buttons
const resetButtons = document.querySelectorAll('button[type="reset"]')





// ini
ini()
// interaction
settingsForm.onsubmit = startPlanning
resetButtons.forEach(resetButton => {
  resetButton.onclick = resetTimer
})





function ini() {
  window.speechSynthesis.onvoiceschanged = () => {
    // get voices
    // filter on dutch and enhanced
    voices = speechSynthesis.getVoices().filter( voice => 
      voice.lang.startsWith("nl") && voice.name.includes("Enhanced")
    )

    // create option for each voice
    const voiceSelect = settingsForm.querySelector('[name="voice"]')
    
    voices.forEach( voice => {
      const option = document.createElement("option")
      option.textContent = voice.name.split(" ")[0]
      option.value = voice.name

      voiceSelect.appendChild(option)
    })
  }  
}





function startPlanning(e) {
  e.preventDefault()

  const formData = Object.fromEntries( new FormData(e.target) );

  // handle input
  challengeNr =  formData.battle
  playTime =  formData.minutes * 60
  voice = voices.find(voice => voice.name == formData.voice)

  // set pan and play time in CSS
  document.documentElement.style.setProperty("--duration-plan", planTime);
  document.documentElement.style.setProperty("--duration-play", playTime);

  // set timers
  document.documentElement.classList.remove("ready")
  updateTime(planTime, planTimeEl)
  updateTime(playTime, playTimeEl)

  // set ballte nr
  planChallengeNr.textContent = challengeNr;
  playChallengeNr.textContent = challengeNr;

  // inerten
  settingsSection.inert = true
  planSection.inert = false

  // scroll to plan section
  planSection.scrollIntoView()

  // announce battle
  speak({
    text: `The bettel is nummer ${challengeNr}. Kijken, nog niet typen.`
  });

  // start plan timer
  startPlanTimer()
  planSection.classList.add("is-planning")
}





function startPlanTimer() {
  // set timer
  let timer = planTime

  // update timer
  planTimer = setInterval(() => {
    timer--
    updateTime(timer, planTimeEl)

    switch (timer) {
      case 5:
        speak({
          text:"nog 5 seconden."
        })
        break
      case 0:
        clearInterval(planTimer);
        // when ready start playing
        startPlaying()
        break
    }

  }, 1000);
}





function startPlaying() {
  // inerten
  planSection.inert = true
  playSection.inert = false

  // scroll to play section
  playSection.scrollIntoView()
  
  // announce duration
  speak({
    text:`Tiepuh.`, 
    rate:.9,
    pitch:1
  })
  speak({
    text:`Tiepuh.`, 
    rate:1.1,
    pitch:.8
  })
  speak({
    text:`Tiepuh.`, 
    rate:1.3,
    pitch:.6
  })
  speak({
    text:`Je hebt ${playTime/60} minuten.`
  })

  // start play timer
  startPlayTimer()
  playSection.classList.add("is-playing")
}





function startPlayTimer() {
  // ini timer
  let timer = playTime

  // update timer
  playTimer = setInterval(() => {
    timer--
    updateTime(timer, playTimeEl)

    switch (timer) {
      case 60:
        speak("nog 1 minuut.")
        break
      case 5:
        speak({
          text:`5.`
        })
        document.documentElement.classList.add("invert")
        break
      case 4:
        speak({
          text:`4.`, 
          rate:.8,
          pitch:1.2
        })
        document.documentElement.classList.remove("invert")
        break
      case 3:
        speak({
          text:`3.`, 
          rate:.6,
          pitch:1.4
        })
        document.documentElement.classList.add("invert")
        break
      case 2:
        speak({
          text:`2.`, 
          rate:.4,
          pitch:1.6
        })
        document.documentElement.classList.remove("invert")
        break
      case 1:
        speak({
          text:`1.`, 
          rate:.2,
          pitch:1.8
        })
        document.documentElement.classList.add("invert")
        break
      case 0:
        speak({
          text:`Klaar.`, 
          pitch:1.8
        })

        console.log(  Math.random() )
        console.log( readyTexts.length )
        console.log( Math.random() * readyTexts.length )
        console.log( Math.floor( Math.random() * readyTexts.length ) )

        speak({
          text:readyTexts[ Math.floor( Math.random() * readyTexts.length ) ], 
          pitch:.5
        })
        ready(playTimeEl)
        document.documentElement.classList.remove("invert")
        document.documentElement.classList.add("ready")
        clearInterval(playTimer)
        break
    }
  }, 1000);
}





function resetTimer() {
  settingsSection.inert = false
  planSection.inert = true
  playSection.inert = true

  planSection.classList.remove("is-planning")
  playSection.classList.remove("is-playing")
  document.documentElement.classList.remove("invert")
  
  clearInterval(planTimer)
  clearInterval(playTimer)

  settingsSection.scrollIntoView()
}





// BASICS

function updateTime(secs, timeEl) {
  spans = getTimeElSpans(timeEl)

  spans.tenMin.textContent = Math.floor(secs / 600 )
  spans.min.textContent = Math.floor((secs % 600) / 60)
  spans.colon.textContent = ":"
  spans.tenSec.textContent = Math.floor( (secs % 60) / 10 )
  spans.sec.textContent = secs % 10
}


function ready(timeEl) {
  spans = getTimeElSpans(timeEl)

  spans.tenMin.textContent = "K"
  spans.min.textContent = "L"
  spans.colon.textContent = "A"
  spans.tenSec.textContent = "A"
  spans.sec.textContent = "R"
}


function getTimeElSpans(timeEl) {
  return {
    tenMin: timeEl.querySelector("span:nth-of-type(1)"),
    min: timeEl.querySelector("span:nth-of-type(2)"),
    colon: timeEl.querySelector("span:nth-of-type(3)"),
    tenSec: timeEl.querySelector("span:nth-of-type(4)"),
    sec: timeEl.querySelector("span:nth-of-type(5)")
  }
}




function speak(args) {
  let defaults = {
      rate:.9,
      pitch:1,
  };

  let {text, rate, pitch} = Object.assign(defaults, args);

  let speech = new SpeechSynthesisUtterance()
  
  // the text
  speech.text = text

  // settings
  speech.lang = "nl"
  speech.voice = voice
  speech.rate = rate;
  speech.pitch = pitch;

  // speak
  synth.speak(speech);
}