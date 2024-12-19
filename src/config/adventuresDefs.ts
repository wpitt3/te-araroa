export interface Location {
    name: string;
    location: number[];
    fromDate?: string;
    toDate?: string;
}

export interface Route {
    name: string;
    reference: string;
    fromDate?: string;
    toDate?: string;
}

export interface Adventure {
    name: string;
    fromDate?: string;
    toDate?: string;
    locations: Record<string, Location[]>;
    routes: Record<string, Route[]>;
}

export type Coordinate = [number, number, number];

export interface AllAdventures {
    routes: Record<string, Coordinate[]>;
    adventures: Adventure[];
}

export type AdventureConfigType = 'location' | 'route'

export interface RouteConfig {
    type: AdventureConfigType;
    colour: string;
    width: number;
}

export interface LocationConfig {
    type: AdventureConfigType;
    image: string;
    scale: number;
}

export type AdventureConfig = Record<string, RouteConfig|LocationConfig>;

export interface GlobalState {
    config: AdventureConfig,
    routes: Record<string, Coordinate[]>;
    adventures: Adventure[];
}