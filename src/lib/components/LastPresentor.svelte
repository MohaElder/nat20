<script lang="ts">
  import { fade } from 'svelte/transition';
  import type { Slide } from '$lib/types/Slide';
  import confetti from 'canvas-confetti';
  import { onDestroy, tick } from 'svelte';
  import type AudioManager from '$lib/components/AudioManager.svelte';

  export let userName: string;
  export let buttonDialogues: { text: string, button: string }[];
  export let typewriterSlides: string[];
  export let fadeSlides: Slide[];
  export let audioManager: AudioManager;

  // State
  let phase = 0; // 0: button dialogues, 1: typewriter, 2: fade, 3: image
  let dialogueIndex = 0;
  let typewriterLog: string[] = [];
  let typing = false;
  let fadeIndex = 0;
  let showFade = false;
  let confettiInterval: any = null;
  let confettiCanvas: HTMLCanvasElement | null = null;

  // Typewriter effect for log
  async function typeText(text: string) {
    typing = true;
    let chars = text.split('');
    let current = '';
    for (const char of chars) {
      current += char;
      typewriterLog[typewriterLog.length - 1] = current;
      typewriterLog = [...typewriterLog];
      await new Promise(r => setTimeout(r, 35));
    }
    typing = false;
  }

  async function startTypewriter() {
    for (let i = 0; i < typewriterSlides.length; i++) {
      typewriterLog = [...typewriterLog, ''];
      await typeText(typewriterSlides[i]);
      await new Promise(r => setTimeout(r, 400));
    }
    // Wait 5 seconds, then go to fade phase
    setTimeout(() => {
      phase = 2;
      showFade = true;
      fadeIndex = 0;
      startFadeSlides();
      // Play final audio when fade slides start
      audioManager?.playFinalAudio();
    }, 5000);
  }

  // Fade slides
  function startFadeSlides() {
    showFade = true;
    fadeIndex = 0;
    nextFadeSlide();
  }

  function nextFadeSlide() {
    if (fadeIndex < fadeSlides.length - 1) {
      setTimeout(() => {
        fadeIndex++;
        nextFadeSlide();
      }, fadeSlides[fadeIndex].delay);
    } else {
      // After last fade slide, show image
      setTimeout(async () => {
        phase = 3;
        await tick();
        startConfetti();
      }, fadeSlides[fadeIndex].delay);
    }
  }

  function handleButton() {
    if (dialogueIndex < buttonDialogues.length - 1) {
      dialogueIndex++;
    } else {
      // Move to typewriter phase
      phase = 1;
      typewriterLog = [];
      startTypewriter();
    }
  }

  $: currentDialogue = buttonDialogues[dialogueIndex]?.text.replace(/USER_NAME|NAME/g, userName);
  $: currentButton = buttonDialogues[dialogueIndex]?.button;
  $: currentFade = fadeSlides[fadeIndex]?.text?.replace(/USER_NAME|NAME/g, userName);

  function startConfetti() {
    if (!confettiCanvas) return;
    if (confettiInterval) clearInterval(confettiInterval);
    const myConfetti = confetti.create(confettiCanvas, { resize: true, useWorker: true });
    confettiInterval = setInterval(() => {
      myConfetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.6 },
      });
    }, 3000);
  }

  onDestroy(() => {
    if (confettiInterval) clearInterval(confettiInterval);
  });
</script>

<div class="presenter">
  {#if phase === 0}
    <div class="centered">
      <div class="dialogue" in:fade out:fade>
        <p>{currentDialogue}</p>
      </div>
      <button class="main-btn" on:click={handleButton}>{currentButton}</button>
    </div>
  {:else if phase === 1}
    <div class="typewriter-log">
      {#each typewriterLog as line, i}
        <div class="type-line" in:fade out:fade>{line}</div>
      {/each}
    </div>
  {:else if phase === 2}
    <div class="centered fade-slide">
      <div in:fade out:fade>
        <p>{currentFade}</p>
      </div>
    </div>
  {:else if phase === 3}
    <canvas bind:this={confettiCanvas} class="confetti-canvas"></canvas>
    <div class="centered">
      <img src="/assets/hbd.png" alt="Happy Birthday" class="hbd-img" />
    </div>
  {/if}
</div>

<style>
.presenter {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #faf5d3;
  color: #5b4436;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Courier New', Courier, monospace;
}
.centered {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.dialogue {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
  text-align: left;
  max-width: 600px;
}
.main-btn {
  background: white;
  color: #5b4436;
  border: none;
  font-family: 'Courier New', Courier, monospace;
  font-size: 2rem;
  font-weight: bold;
  padding: 1rem 2.5rem;
  margin-top: 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: background 0.2s;
}
.typewriter-log {
  min-height: 300px;
  max-width: 700px;
  font-size: 1.3rem;
  text-align: left;
}
.type-line {
  margin-bottom: 0.5rem;
  white-space: pre-wrap;
}
.fade-slide {
  font-size: 1.3rem;
  max-width: 700px;
  text-align: left;
}
.hbd-img {
  max-width: 400px;
  max-height: 400px;
  position: fixed;
  bottom: 0;
}
.confetti-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 10;
}
</style> 