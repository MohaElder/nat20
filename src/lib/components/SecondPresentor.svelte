<script lang="ts">
  import { fade } from 'svelte/transition';

  export let onDone: (userName: string) => void;

  const dialogues = [
    "Greetings,\nagent. Welcome to the team.",
    "I am YSO, your supervisor. YSO is my codename.",
    "We all use codename here, what's yours?",
    "", // This is a special case for name input
    "Hello {userName},\nnow I will give you a mission brief.",
    "You are looking at L.R.E.S. Life Re-Experience System.",
    "It's our State of the Art system to find the ultimate answer...",
    "to everything.",
    "Once you log into the system. It will let you re-experience...",
    "your life. To sync your DNA pattern with the universe core...",
    "which our expedition team extracted from Star-UA20 last year.",
    "We need your help agent {userName}. Without the ultimate answer, we...",
    "cannot weaponize it and use it to fight off the Pudding Empire.",
    "They are invading us fiercely with sugar and cream bombs...",
    "Once you start, you will experience different stages of...",
    "your life. You need to find the crucial parts for each stages...",
    "or at least what the system thinks. BE CAREFUL: IF YOU",
    "FAIL TO IDENTIFY ALL OF THEM AT A STAGE, YOU WILL...",
    "BE TRAPPED THERE FOREVER!\nBut maybe that's a good thing ;)",
    "Once you're ready, press IMMERSE. Good luck agent! Over and out."
  ];

  let currentIndex = 0;
  let userName = "";
  let showNameInput = false;

  $: currentText = dialogues[currentIndex];
  $: isNameInput = currentIndex === 3;
  $: isLastDialogue = currentIndex === dialogues.length - 1;
  $: buttonText = isNameInput ? "CONFIRM" : isLastDialogue ? "IMMERSE" : "OK";
  $: buttonDisabled = isNameInput && !userName.trim();
  $: displayText = currentText?.replace("{userName}", userName);

  function handleNext() {
    if (currentIndex < dialogues.length - 1) {
      currentIndex++;
      if (currentIndex === 3) {
        showNameInput = true;
      } else if (currentIndex === 4) {
        showNameInput = false;
      }
    } else {
      onDone(userName);
    }
  }
</script>

<div class="presenter">
  <div class="dialogue-container">
    <div class="character">
      <div class="name">YSO</div>
    </div>
    <div class="dialogue-box">
      {#if currentText}
        <div class="text-bubble" in:fade={{ duration: 200 }}>
          <p>{displayText}</p>
        </div>
      {/if}
    </div>
  </div>

  <div class="input-area">
    {#if showNameInput}
      <input
        type="text"
        bind:value={userName}
        placeholder="ENTER YOUR NAME"
        class="name-input"
      />
    {/if}
    <button
      class="action-button"
      class:name-confirm={isNameInput}
      on:click={handleNext}
      disabled={buttonDisabled}
    >
      {buttonText}
    </button>
  </div>
</div>

<style>
  .presenter {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: black;
    color: white;
    display: flex;
    flex-direction: column;
    padding: 2rem;
  }

  .dialogue-container {
    display: flex;
    gap: 2rem;
    flex: 1;
  }

  .character {
    width: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .name {
    font-family: 'Courier New', monospace;
    font-size: 32px;
    font-weight: bold;
    margin-top: 2rem;
  }

  .dialogue-box {
    flex: 1;
    display: flex;
    align-items: flex-start;
    padding-top: 2rem;
  }

  .text-bubble {
    border: 2px solid white;
    border-radius: 25px;
    padding: 1.5rem;
    position: relative;
    min-width: 300px;
    max-width: 600px;
  }

  .text-bubble p {
    font-family: 'Courier New', monospace;
    font-size: 18px;
    margin: 0;
    white-space: pre-wrap;
  }

  .input-area {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    padding: 1rem;
  }

  .name-input {
    background: white;
    border: none;
    padding: 0.5rem 1rem;
    font-family: 'Courier New', monospace;
    font-size: 16px;
    width: 300px;
  }

  .action-button {
    background: white;
    color: black;
    border: none;
    padding: 0.5rem 2rem;
    font-family: 'Courier New', monospace;
    font-size: 16px;
    cursor: pointer;
    min-width: 120px;
  }

  .action-button:not(:disabled):hover {
    background: #e0e0e0;
  }

  .action-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .name-confirm {
    background: #27F546;
  }

  .name-confirm:disabled {
    background: #CFFFD6;
    opacity: 1;
  }

  .name-confirm:not(:disabled):hover {
    filter: brightness(1.1);
    background: #27F546;
  }
</style> 