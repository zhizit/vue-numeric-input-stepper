/**
 * 長押しタイマー管理クラス
 */
export class PressTimerManager {
  private intervalTimer: number | null = null;
  private delayTimer: number | null = null;
  private readonly interval: number;

  constructor(interval: number = 100) {
    this.interval = interval;
  }

  /**
   * タイマーを開始
   * @param {Function} callback - 繰り返し実行するコールバック関数
   * @param {number} initialDelayMs - 長押しとみなすまでの遅延（ms）。0の場合は即座にinterval開始
   */
  public start(callback: () => void, initialDelayMs: number = 0): void {
    this.stop();

    if (initialDelayMs > 0) {
      this.delayTimer = window.setTimeout(() => {
        // 遅延後に1回だけ即時実行し、その後はintervalで繰り返す
        callback();
        this.intervalTimer = window.setInterval(callback, this.interval);
      }, initialDelayMs);
      return;
    }

    this.intervalTimer = window.setInterval(callback, this.interval);
  }

  /**
   * タイマーを停止
   */
  public stop(): void {
    if (this.delayTimer !== null) {
      clearTimeout(this.delayTimer);
      this.delayTimer = null;
    }
    if (this.intervalTimer !== null) {
      clearInterval(this.intervalTimer);
      this.intervalTimer = null;
    }
  }

  /**
   * クリーンアップ（タイマーを停止）
   */
  public cleanup(): void {
    this.stop();
  }
}

