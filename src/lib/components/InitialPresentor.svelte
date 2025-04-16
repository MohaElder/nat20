<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import type { Slide } from '$lib/types/Slide';

  export let slides: Slide[];
  export let onDone: () => void;

  let displayedSlides: string[] = [];
  let currentIndex = 0;
  let typing = false;
  let showingTitle = false;
  let titleText = "";
  let showSubtitle = false;

  async function typeText(text: string): Promise<void> {
    typing = true;
    const chars = text.split('');
    let currentText = '';
    
    for (const char of chars) {
      currentText += char;
      displayedSlides[displayedSlides.length - 1] = currentText;
      displayedSlides = displayedSlides; // trigger update
      await new Promise(resolve => setTimeout(resolve, 50)); // typing speed
    }
    typing = false;
  }

  async function typeTitle(): Promise<void> {
    const title = "L.R.E.S";
    for (const char of title) {
      titleText += char;
      await new Promise(resolve => setTimeout(resolve, 300)); // slower typing for title
    }
    await new Promise(resolve => setTimeout(resolve, 500)); // pause after title
    showSubtitle = true;
  }

  async function showNextSlide() {
    if (currentIndex >= slides.length) {
      setTimeout(async () => {
        displayedSlides = [];
        showingTitle = true;
        await typeTitle();
        setTimeout(onDone, 8000); // Show complete title screen for 8 seconds after everything is shown
      }, 1000); // Wait 1 second before clearing text
      return;
    }

    displayedSlides = [...displayedSlides, ''];
    await typeText(slides[currentIndex].text);
    
    if (currentIndex < slides.length - 1) {
      setTimeout(showNextSlide, slides[currentIndex].delay);
    } else {
      // For the last slide, wait its delay before showing title
      setTimeout(() => {
        currentIndex++;
        showNextSlide();
      }, slides[currentIndex].delay);
    }
    
    currentIndex++;
  }

  onMount(() => {
    showNextSlide();
  });
</script>

<div class="presenter">
  {#if !showingTitle}
    {#each displayedSlides as text}
      <p class="text" in:fade={{ duration: 200 }} out:fade={{ duration: 200 }}>
        {text}
      </p>
    {/each}
  {:else}
    <div class="title-screen">
      <h1 class="title">{titleText}</h1>
      {#if showSubtitle}
        <div in:fade={{ duration: 1000 }}>
          <h2 class="subtitle">Welcome to Life Re-Experience System</h2>
          <p class="version">v2005.04.16</p>
        </div>
      {/if}
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
    background-color: black;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
    padding: 2rem;
  }

  .text {
    font-family: 'Courier New', Courier, monospace;
    font-size: 20px;
    font-weight: bold;
    margin: 0;
    padding: 0.25rem 0;
    white-space: pre-wrap;
  }

  .title-screen {
    width: 100%;
    text-align: center;
    font-family: 'Courier New', Courier, monospace;
    font-weight: bold;
  }

  .title {
    font-size: 48px;
    margin: 0 0 2rem 0;
    letter-spacing: 1rem;
    min-height: 60px;
  }

  .subtitle {
    font-size: 24px;
    margin: 0 0 1rem 0;
  }

  .version {
    font-size: 20px;
    margin: 0;
  }
</style> 