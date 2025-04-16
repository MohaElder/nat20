<script lang="ts">
  import { fade } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';

  export let avatarUrl: string;
  export let infoText: string;
  export let infoPic: string;
  export let gamePicUrl: string;
  export let hitboxes: Array<{ x: number; y: number; visible: boolean }>;
  export let onClear: () => void;
  export let bg: string = "#faf5d3"; // Default background color

  let showText = true;
  const dispatch = createEventDispatcher();

  function toggleDisplay() {
    showText = !showText;
  }

  function handleHitboxClick(index: number) {
    hitboxes[index].visible = true;
    hitboxes = hitboxes; // trigger reactivity

    // Check if all hitboxes are visible
    if (hitboxes.every(hitbox => hitbox.visible)) {
      onClear();
    }
  }
</script>

<div class="container">
  <div class="left-section" style="background: {bg}" on:click={toggleDisplay}>
    <div class="text-bubble">
      {#if showText}
        <p class="bubble-text" transition:fade={{ duration: 200 }}>
          {infoText}
        </p>
      {:else}
        <div class="milk-wrapper" transition:fade={{ duration: 200 }}>
          <img src={infoPic} alt="Info" class="milk-image" />
        </div>
      {/if}
    </div>
    <div class="baby-image">
      <img src={avatarUrl} alt="Avatar character" />
    </div>
  </div>
  <div class="right-section" style="background: {bg}">
    <div class="image-container">
      <img src={gamePicUrl} alt="Game pattern" />
      {#each hitboxes as hitbox, i}
        <div 
          class="hitbox"
          style="left: {hitbox.x}px; top: {hitbox.y}px;"
          on:click|stopPropagation={() => handleHitboxClick(i)}
        >
          {#if hitbox.visible}
            <div class="hitbox-circle" transition:fade={{ duration: 200 }}></div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .container {
    display: flex;
    width: 100%;
    height: 100vh;
    gap: 0;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    overflow: hidden;
  }

  .left-section {
    flex: 1;
    border: 10px solid #634040;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    cursor: pointer;
  }

  .text-bubble {
    background-image: url('/assets/textbubble.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    padding: 0.75rem 2.5rem 2.25rem;
    margin: 2rem;
    flex-shrink: 0;
    width: 80%;
    min-height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .bubble-text {
    font-family: 'Courier', monospace;
    font-size: 14px;
    color: #634040;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    text-align: center;
    max-width: 200px;
    margin: 0;
  }

  .milk-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .milk-image {
    max-width: 200px;
    max-height: 50px;
    object-fit: contain;
  }

  .baby-image {
    height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: relative;
  }

  .baby-image img {
    height: 100%;
    width: auto;
    object-fit: contain;
  }

  .right-section {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }

  .image-container {
    height: 100%;
    width: 100%;
    position: relative;
  }

  .image-container img {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }

  .hitbox {
    position: absolute;
    width: 50px;
    height: 50px;
    transform: translate(-50%, -50%);
    cursor: pointer;
  }

  .hitbox-circle {
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.5);
    border: 2px solid white;
    border-radius: 50%;
  }

  :global(body) {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  :global(html) {
    margin: 0;
    padding: 0;
  }

  :global(*) {
    box-sizing: border-box;
  }
</style> 