export interface User
{
    username: string;
}

export interface Character {
    name: string;
    hp: number;
    defence: number;
    initiative: number;
    attackCac: number;
    dmgCac?: string;
    attackDistance: number;
    dmgDistance?: string;
    attackMagic: number;
    dmgMagic?: string;
    image: string;
    hexId: number;
}

export interface HexData {
  id: number;
  row: number;
  col: number;
  x: number;
  y: number;
}