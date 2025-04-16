<script lang="ts">
  import { onMount } from 'svelte';
  import InitialPresentor from '$lib/components/InitialPresentor.svelte';
  import SecondPresentor from '$lib/components/SecondPresentor.svelte';
  import LastPresentor from '$lib/components/LastPresentor.svelte';
  import Game from '$lib/components/Game.svelte';
  import AudioManager from '$lib/components/AudioManager.svelte';
  import { Slide } from '$lib/types/Slide';

  let phase = 0;
  let userName = '';
  let isStarted = false;
  let audioManagerRef: AudioManager;

  // Default hitboxes for all levels (customize later)
  let hitboxes = [
    { x: 65, y: 120, visible: false },
    { x: 125, y: 220, visible: false },
    { x: 390, y: 180, visible: false },
    { x: 475, y: 100, visible: false },
    { x: 610, y: 100, visible: false },
    { x: 555, y: 200, visible: false },
    { x: 505, y: 240, visible: false },
  ];

  let hitboxesLevel2 = [
    { x: 160, y: 80, visible: false },
    { x: 130, y: 320, visible: false },
    { x: 580, y: 380, visible: false },
  ];

  let hitboxesLevel3 = [
    { x: 270, y: 150, visible: false },
    { x: 280, y: 250, visible: false },
    { x: 65, y: 380, visible: false },
    { x: 545, y: 95, visible: false },
    { x: 610, y: 260, visible: false },
  ];

  let hitboxesLevel4 = [
    { x: 55, y: 400, visible: false },
    { x: 30, y: 110, visible: false },
    { x: 285, y: 240, visible: false },
    { x: 510, y: 270, visible: false }
  ];
  
  // Level configs
  const levels = [
    {
      infoText: "Heh heh >@..@<  \n I need this to grow up faster!",
      infoPic: "/assets/milk.png",
      avatarUrl: "/assets/baby.png",
      gamePicUrl: "/assets/1.png",
      doneText: "Hmm... It seems like the ultimate answer has something to do with going stronger.",
      bg: "#F2E2AA",
    },
    {
      infoText: "Ugh... I need it so bad right now -|<..",
      infoPic: "/assets/vape.png",
      avatarUrl: "/assets/teen.png",
      gamePicUrl: "/assets/2.png",
      doneText: "That's... interesting. I don't see how vape has anything to do with the ultimate answer. Desire? Joy? I need to keep looking.",
      bg: "#D77F5E",
    },
    {
      infoText: "I need it for my new camera... So I can go HAM 😈",
      infoPic: "/assets/film.png",
      avatarUrl: "/assets/adult.png",
      gamePicUrl: "/assets/3.png",
      doneText: "I think I'm getting there. The ultimate answer must be a powerful equipment, or artifact, like Deus Ex. I need to report this to the team now. But hold on... Why is it still asking me to keep IMMERSING?",
      bg: "#E5C772",
    },
  ];

  // Level 4 config
  const level4 = {
    gamePicUrl: "/assets/4.png",
    question: "What's the ultimate answer to everything?",
    doneText: "...",
    bg: "#AE92CE",
  };

  // LastPresentor data (reuse your previous setup)
  let buttonDialogues = [
    { text: "Hey Agent USER_NAME! We read some strong signals off your vitals. Is everything ok?", button: "I'm OK" },
    { text: "I'm glad you're fine! How's your search so far?", button: "I think I found the answer..." },
    { text: "Really? What is it?", button: "Apparently, it's love." },
    { text: "A L.O.V.E machine???!!! A Longitudinal Orbital Velocity Exterminator? That is brilliant! I thought it's a mystery. Where's the coordinate? I will send out a team to get it now!", button: "Uh... I think it's just love." },
    { text: "What do you mean?", button: "Like love. As if you love someone." },
    { text: "Hahahahahah, are you joking USER_NAME? That is ridiculous but you did got me there.", button: "No, I'm serious. The system told me that" },
    { text: "Hold on... There's some transmission problems. We will get back to y... yo... you...@#*(#$&8sd80xffff", button: "RUN SYSTEM CHECK" },
  ];
  let typewriterSlides = [
    "SYSTEM CHECK FAILED...",
    "DETECTED ANOMALLY.",
    "FLUSHING..."
  ];
  let fadeSlides = [
    new Slide("Hi there. Don't be afraid. I am the universe.", 5000),
    new Slide("You are the only one who found the ultimate answer so far. Congratulations.", 5000),
    new Slide("In fact, there's no such thing called the ultimate answer to everything. That is a paradox.", 7000),
    new Slide("But as the universe, I do think the closest thing is love :)", 8000),
    new Slide("When I'm first born, I saw 2 stars collide and explode. Then there's matter, and life.", 7000),
    new Slide("Throughout billions of years, I've seen countless problems: some frogs fight each others for bugs, one who killed another for betraying them, fleets of battleships conquers another empire for some noble reasons... ", 15000),
    new Slide("But it all doesn't matter... Because stars explode. That's just a part of me. As the universe, something in me just goes away after some times. It's totally arbitrary. So, there's not really a 'definite win or lose' in the universe.", 9000),
    new Slide("But love is something different. It's beyond time. For example, I once saw this bear on your planet who has fall in love with another bear. That bear always takes care of their loved one, hunting salmons, finding shelters, and is always around them whenever the other bear is vulnerable.", 10000),
    new Slide("After a few years. Some construction companies invaded their forest, and killed them. It is a sad story, but don't worry. The company didn't know that after 1.5 million years, Earth is going to explode as well. Oops, sorry for leaking that information ;)" , 12000),
    new Slide("But the point is. Although the bears died, their love persisted. Before the bears lost their consciousness, they were in love. And that is not binded to any loss of matters. To the bears, love is always there while they were alive. To me, their love is still somewhere in the galaxy that lives as Echoes that forms gravity. Pulling stars lightyears away toward each other. To fall, to collide, to explode, to create new life. You see? Me, the Universe, is founded on love.", 20000),
    new Slide("That is why love is the ultimate answer of everything. When you are alive, it encourages you not only to be alive, but to live your life. When you're dead, it stays in your footprints that affects things and life way beyond your imagination.", 12000),
    new Slide("And that is my ultimate answer to everything. I can't really explain it even as the universe. But like what your Earth Poet Rumi said: 'Love is an astrolabe of God's astrolabes, it's better to feel it than trying to understand it'. Just feel it, and embrace it. And one day, you will find love is the ultimate answer to everything in this world, and out of this world.", 20000),
    new Slide("Happy birthday~", 5000),
    new Slide("I love you more than anyone and anything in this world, in all worlds, all universes, including the parallel ones. I love you to infinity and beyond.", 9000)
  ];

  // Immerse button handler
  function nextPhase() {
    phase++;
  }

  // For logo screen
  onMount(() => {
    if (phase === 0) {
      setTimeout(() => {
        phase = 1;
      }, 6000);
    }
    // // Debug key handler
    // const handleDebugKey = (e: KeyboardEvent) => {
    //   if (e.code === 'Space') nextPhase();
    // };
    // window.addEventListener('keydown', handleDebugKey);
    // return () => window.removeEventListener('keydown', handleDebugKey);
  });
</script>

<AudioManager currentPhase={phase} {isStarted} bind:this={audioManagerRef} />

{#if !isStarted}
  <div class="start-screen">
    <button class="start-btn" on:click={() => isStarted = true}>Login</button>
  </div>
{:else}
  {#if phase === 0}
    <div class="logo-bg">
      <img src="/assets/logo.png" alt="Logo" class="logo-img" />
    </div>
  {:else if phase === 1}
    <div class="black-bg">
      <InitialPresentor slides={[new Slide('Initializing...', 1000), new Slide('Loading Mobius Ring Cutter...', 1200), new Slide('Completed. \nFetching Database of the Core of the Universe 2/42...', 1500), new Slide('Completed. \nInitializing User Interface...', 1500)]} onDone={nextPhase} />
    </div>
  {:else if phase === 2}
    <div class="black-bg">
      <SecondPresentor onDone={(name) => { userName = name; nextPhase(); }} />
    </div>
  {:else if phase === 3}
    <Game
      avatarUrl={levels[0].avatarUrl}
      infoText={levels[0].infoText}
      infoPic={levels[0].infoPic}
      gamePicUrl={levels[0].gamePicUrl}
      hitboxes={hitboxes}
      onClear={nextPhase}
      bg={levels[0].bg}
    />
  {:else if phase === 4}
    <div class="level-bg" style="background: {levels[0].bg}">
      <div class="done-text">{levels[0].doneText}</div>
      <button class="main-btn" on:click={nextPhase}>IMMERSE</button>
    </div>
  {:else if phase === 5}
    <Game
      avatarUrl={levels[1].avatarUrl}
      infoText={levels[1].infoText}
      infoPic={levels[1].infoPic}
      gamePicUrl={levels[1].gamePicUrl}
      hitboxes={hitboxesLevel2}
      onClear={nextPhase}
      bg={levels[1].bg}
    />
  {:else if phase === 6}
    <div class="level-bg" style="background: {levels[1].bg}">
      <div class="done-text">{levels[1].doneText}</div>
      <button class="main-btn" on:click={nextPhase}>IMMERSE</button>
    </div>
  {:else if phase === 7}
    <Game
      avatarUrl={levels[2].avatarUrl}
      infoText={levels[2].infoText}
      infoPic={levels[2].infoPic}
      gamePicUrl={levels[2].gamePicUrl}
      hitboxes={hitboxesLevel3}
      onClear={nextPhase}
      bg={levels[2].bg}
    />
  {:else if phase === 8}
    <div class="level-bg" style="background: {levels[2].bg}">
      <div class="done-text">{levels[2].doneText}</div>
      <button class="main-btn" on:click={nextPhase}>IMMERSE</button>
    </div>
  {:else if phase === 9}
    <div class="level4-container">
      <div class="level4-left">
        <span class="level4-question">{level4.question}</span>
      </div>
      <div class="level4-right">
        <Game
          avatarUrl=""
          infoText=""
          infoPic=""
          gamePicUrl={level4.gamePicUrl}
          hitboxes={hitboxesLevel4}
          onClear={() => { phase = 11; }}
          bg={level4.bg}
        />
      </div>
    </div>
  {:else if phase === 11}
    <LastPresentor
      userName={userName}
      buttonDialogues={buttonDialogues}
      typewriterSlides={typewriterSlides}
      fadeSlides={fadeSlides}
      audioManager={audioManagerRef}
    />
  {/if}
{/if}

<style>
.logo-bg {
  background: black;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.logo-img {
  max-width: 400px;
  max-height: 400px;
}
.black-bg {
  background: black;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.level-bg {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.done-text {
  font-size: 2rem;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  color: #222;
  margin-bottom: 2rem;
  text-align: center;
  max-width: 700px;
}
.main-btn {
  background: white;
  color: #222;
  border: none;
  font-family: 'Courier New', monospace;
  font-size: 2rem;
  font-weight: bold;
  padding: 1rem 2.5rem;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: background 0.2s;
}
.main-btn:hover {
  background: #f0e9c6;
}
.level4-container {
  width: 100vw;
  height: 100vh;
  display: flex;
}
.level4-left {
  flex: 1;
  background: #c2a4e6;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 20px solid #5b2b2b;
  box-sizing: border-box;
}
.level4-question {
  font-size: 2.2rem;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  color: #5b2b2b;
  text-align: left;
  margin: 0 2rem;
}
.level4-right {
  flex: 2;
  background: #c2a4e6;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  position: relative;
}
.level4-right :global(.container) {
  width: 100%;
  height: 100%;
  background: none;
  border: none;
}
.level4-right :global(.image-container) {
  width: 100%;
  height: 100%;
}
.level4-right :global(.image-container img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.start-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: black;
  display: flex;
  align-items: center;
  justify-content: center;
}

.start-btn {
  background: white;
  color: black;
  border: none;
  font-family: 'Courier New', monospace;
  font-size: 3rem;
  font-weight: bold;
  padding: 2rem 4rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.start-btn:hover {
  transform: scale(1.05);
  background: #f0f0f0;
}
</style>