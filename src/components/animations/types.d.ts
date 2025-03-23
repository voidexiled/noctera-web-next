export type BoostedProps = {
	boostname: string | null;
	looktype: number;
	looktypeEx: number | null;
	lookaddons: number;
	lookhead: number;
	lookbody: number;
	looklegs: number;
	lookfeet: number;
	lookmount: number | null;
};

export interface Outfit {
	looktype: number;
	looktypeEx?: number;
	lookaddons?: number;
	lookhead?: number;
	lookbody?: number;
	looklegs?: number;
	lookfeet?: number;
	mount?: number | null;
	lookmount?: number | null;
}

export interface Frame {
	image: HTMLImageElement;
	duration: number;
}
