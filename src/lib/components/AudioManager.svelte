<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  // Audio sources
  const AUDIO_SOURCES = {
    logo: '/assets/audio/logo.mp3',
    initial: '/assets/audio/1.5.mp3',
    second: '/assets/audio/1.mp3',
    level1: '/assets/audio/level1.mp3',
    level2: '/assets/audio/level2.mp3',
    level3: '/assets/audio/level3.mp3',
    level4: '/assets/audio/level4.mp3',
    final: '/assets/audio/final.mp3'
  };

  // Create audio elements
  const audioElements: { [key: string]: HTMLAudioElement } = {};

  export let currentPhase: number;
  export let isStarted: boolean;

  let currentAudio: HTMLAudioElement | null = null;
  let previouslyStarted = false;
  let lastGameAudio: HTMLAudioElement | null = null;

  onMount(() => {
    // Create audio elements
    Object.entries(AUDIO_SOURCES).forEach(([key, src]) => {
      const audio = new Audio(src);
      audio.loop = true; // All background music loops by default
      audioElements[key] = audio;
    });
  });

  // Stop all audio
  function stopAllAudio() {
    Object.values(audioElements).forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  }

  // Play audio for current phase
  function playPhaseAudio(phase: number) {
    if (!isStarted) return;
    
    // Don't stop the current game level audio during its completion screen
    const isCompletionScreen = phase === 4 || phase === 6 || phase === 8;
    if (!isCompletionScreen) {
      stopAllAudio();
    }
    
    let newAudio: HTMLAudioElement | null = null;
    
    switch (phase) {
      case 0:
        newAudio = audioElements.logo;
        break;
      case 1:
        newAudio = audioElements.initial;
        break;
      case 2:
        newAudio = audioElements.second;
        break;
      case 3:
        newAudio = audioElements.level1;
        lastGameAudio = newAudio;
        break;
      case 4: // Level 1 completion
        newAudio = lastGameAudio;
        break;
      case 5:
        newAudio = audioElements.level2;
        lastGameAudio = newAudio;
        break;
      case 6: // Level 2 completion
        newAudio = lastGameAudio;
        break;
      case 7:
        newAudio = audioElements.level3;
        lastGameAudio = newAudio;
        break;
      case 8: // Level 3 completion
        newAudio = lastGameAudio;
        break;
      case 9:
        newAudio = audioElements.level4;
        break;
      case 11:
        // Don't play final audio immediately - it will be triggered by LastPresentor
        newAudio = null;
        break;
      default:
        newAudio = null;
    }

    if (newAudio && newAudio !== currentAudio) {
      currentAudio = newAudio;
      currentAudio.play().catch(error => {
        console.error('Audio playback failed:', error);
      });
    }
  }

  // Watch for phase changes and isStarted changes
  $: if (currentPhase !== undefined) {
    playPhaseAudio(currentPhase);
  }

  // Watch for isStarted changes
  $: if (isStarted && !previouslyStarted) {
    previouslyStarted = true;
    playPhaseAudio(currentPhase);
  }

  // Expose a method to play final audio
  export function playFinalAudio() {
    stopAllAudio();
    currentAudio = audioElements.final;
    currentAudio.play().catch(error => {
      console.error('Final audio playback failed:', error);
    });
  }

  onDestroy(() => {
    stopAllAudio();
  });
</script> 