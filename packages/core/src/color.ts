import { COLOR_GRADIENTS, COLOR_HEX } from './constants';
import type { PulseColor } from './types';
export function colorToHex(color: PulseColor): string { return COLOR_HEX[color]; }
export function colorToGradient(color: PulseColor): string { return COLOR_GRADIENTS[color]; }
export function colorCopy(color: PulseColor): string { const map: Record<PulseColor,string> = { Blue:'青い静けさ', Red:'赤い熱', Yellow:'淡い灯り', Green:'湿った緑', Purple:'夜の紫', White:'白い余白', Black:'深い影', Orange:'帰り道の橙', Pink:'柔らかな桃色', Gray:'曇った銀色' }; return map[color]; }
