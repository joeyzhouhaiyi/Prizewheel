declare module '@evshiron/winwheel.js' {
    export class Winwheel {
      constructor(options: any);
      startAnimation(): void;
      stopAnimation(canCallback?: boolean): void;
      draw(): void;
      // Add other methods as needed
    }
  }
  