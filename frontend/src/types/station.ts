export interface Station {
  id: number;
  name: string;
  pinyin?: string; // 中文拼音或英文标识，后端可能缺省
  city?: string;   // 城市名称
  province?: string; // 省份名称
  code?: string;   // 车站代码
  district?: string;
  type?: 'highspeed' | 'normal' | 'bus' | 'metro' | 'rail';
  is_hot?: boolean;
  is_hub?: boolean;
  status?: 'active' | 'retired';
}
