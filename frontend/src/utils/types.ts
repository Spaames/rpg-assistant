export interface User
{
    username: string;
}

export interface PJ {
    name : string;
    hp : number;
    defence : number;
    initiative : number;
    image : string;
}

export interface Enemy {
    name: string;
    hp: number;
    defence: number;
    initiative: number;
    attackCac: number;
    dmgCac: string;
    attackDistance: number;
    dmgDistance: string;
    attackMagic: number;
    dmgMagic: string;
    image: string;
    position: {
        x: string;
        y: string;
    };
}
