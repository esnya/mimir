export default interface Monster {
  id: number;
  name: Partial<{
    ja: string | null;
    cn1: string | null;
    cn2: string | null;
    en: string | null;
  }>;
  base: {
    サイズ: string | null;
    ジョブ経験値: number | null;
    ベース経験値: number | null;
    レベル: number | null;
    属性: string | null;
    種族: string | null;
  };
  status: {
    ATK: number | null;
    DEF: number | null;
    Flee: number | null;
    HP: number | null;
    Hit: number | null;
    MATK: number | null;
    MDEF: number | null;
    攻撃速度: number | null;
    移動速度: number | null;
  };
}
