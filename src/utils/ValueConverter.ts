/**
 * 値の変換ユーティリティ
 * UI表示値と内部値を相互変換するための線形変換関数を提供
 */

export interface ConversionConfig {
  displayMin: number;
  displayMax: number;
  internalMin: number;
  internalMax: number;
}

/**
 * 変換設定から変換関数を生成
 * @param config - 変換設定
 * @returns 変換関数オブジェクト
 */
export function createValueConverter(config: ConversionConfig) {
  const displayRange = config.displayMax - config.displayMin;
  const internalRange = config.internalMax - config.internalMin;
  const slope = internalRange / displayRange;
  const intercept = config.internalMin - config.displayMin * slope;

  return {
    /**
     * 表示値を内部値に変換
     * @param displayValue - 表示値
     * @returns 内部値
     */
    toInternal: (displayValue: number): number => {
      return Math.round(displayValue * slope + intercept);
    },

    /**
     * 内部値を表示値に変換
     * @param internalValue - 内部値
     * @returns 表示値
     */
    toDisplay: (internalValue: number): number => {
      return Math.round((internalValue - intercept) / slope);
    },
  };
}

/**
 * テキストサイズ用の変換関数（元のコードとの互換性）
 * UI表示値: 1-100 → 内部値: 23-1000
 */
export const textSizeConverter = createValueConverter({
  displayMin: 1,
  displayMax: 100,
  internalMin: 23,
  internalMax: 1000,
});

