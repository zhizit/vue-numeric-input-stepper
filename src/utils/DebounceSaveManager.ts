/**
 * Debounce保存管理クラス
 */
export class DebounceSaveManager {
  private timer: number | null = null;
  private readonly delay: number;
  private onSave: (value: number) => void;
  private onChange: (oldValue: number, newValue: number) => void;
  private committedValue: number;
  private pendingValue: number | null = null;

  constructor(
    delay: number,
    onSave: (value: number) => void,
    onChange: (oldValue: number, newValue: number) => void,
    initialValue: number
  ) {
    this.delay = delay;
    this.onSave = onSave;
    this.onChange = onChange;
    this.committedValue = initialValue;
  }

  /**
   * 保存をスケジュール（debounce）
   * @param {number} currentValue - 現在の値
   */
  public schedule(currentValue: number): void {
    this.pendingValue = currentValue;
    if (this.timer !== null) {
      clearTimeout(this.timer);
    }

    this.timer = window.setTimeout(() => {
      this.commit(currentValue);
      this.pendingValue = null;
    }, this.delay);
  }

  /**
   * 保存を確定
   * @param {number} currentValue - 現在の値
   */
  private commit(currentValue: number): void {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    // 保存確定時に変更イベントを発火（Undo対応）
    if (this.committedValue !== currentValue) {
      this.onChange(this.committedValue, currentValue);
      this.committedValue = currentValue;
    }

    // 保存イベントを発火
    this.onSave(currentValue);
  }

  /**
   * 確定済みの値を更新（外部からの変更時）
   * @param {number} value - 新しい値
   */
  public updateCommittedValue(value: number): void {
    this.committedValue = value;
  }

  /**
   * 即座に保存を確定（debounceをキャンセルして保存）
   * @param {number} currentValue - 現在の値
   */
  public commitNow(currentValue: number): void {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.commit(currentValue);
    this.pendingValue = null;
  }

  /**
   * 保留中の値を即座に保存（保留中の値がない場合は何もしない）
   */
  public commitPending(): void {
    if (this.pendingValue !== null) {
      this.commitNow(this.pendingValue);
    }
  }

  /**
   * クリーンアップ（タイマーを停止）
   */
  public cleanup(): void {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.pendingValue = null;
  }
}

