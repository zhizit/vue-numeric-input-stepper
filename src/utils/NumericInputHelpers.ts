/**
 * 数値入力のキーボード制限を処理
 * テキスト入力（数字、Backspace、Delete）は許可
 * +/-ボタンはクリック・長押しのみで操作可能
 * @param {KeyboardEvent} event - キーボードイベント
 */
export function handleNumericInputKeydown(event: KeyboardEvent): void {
  const blockedKeys = [
    'ArrowUp',
    'ArrowDown',
    'PageUp',
    'PageDown',
    'Home',
    'End',
    '+',
    '-',
    '=',
    '<',
    '>',
  ];

  const isNumpadPlus = event.key === '+' && event.code === 'NumpadAdd';
  const isNumpadMinus = event.key === '-' && event.code === 'NumpadSubtract';

  if (blockedKeys.includes(event.key) || isNumpadPlus || isNumpadMinus) {
    event.preventDefault();
    return;
  }

  if (event.key === 'Enter') {
    event.preventDefault();
    return;
  }
}

/**
 * 数値入力をバリデーション
 * @param {string} inputValue - 入力値
 * @return {boolean} 有効な数値入力かどうか
 */
export function validateNumericInput(inputValue: string): boolean {
  return inputValue === '' || /^\d+$/.test(inputValue);
}

/**
 * 値をmin/maxの範囲内に制限
 * @param {number} value - 制限する値
 * @param {number} min - 最小値
 * @param {number} max - 最大値
 * @return {number} 制限後の値
 */
export function clampValue(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * 入力値を数値に変換（範囲制限付き）
 * @param {string} inputStr - 入力文字列
 * @param {number} currentValue - 現在の値（空文字列の場合に使用）
 * @param {number} min - 最小値
 * @param {number} max - 最大値
 * @return {number} 変換後の数値
 */
export function parseAndClampInput(
  inputStr: string,
  currentValue: number,
  min: number,
  max: number
): number {
  const trimmed = inputStr.trim();

  if (trimmed === '') {
    return currentValue;
  }

  const numValue = parseInt(trimmed, 10);
  if (isNaN(numValue)) {
    return currentValue;
  }

  return clampValue(numValue, min, max);
}

