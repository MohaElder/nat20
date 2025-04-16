export class Slide {
  text: string;
  delay: number;  // delay in milliseconds

  constructor(text: string, delay: number = 1000) {
    this.text = text;
    this.delay = delay;
  }
}

// Example usage:
// const slides: Slide[] = [
//   new Slide("First slide", 1000),
//   new Slide("Second slide", 2000),
//   new Slide("Quick slide", 500)
// ]; 