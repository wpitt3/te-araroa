import {Adventure, AdventureConfig, Coordinate, GlobalState, Route, RouteConfig} from "./adventuresDefs";

const verifyConfig = (config: AdventureConfig) => {
    const hexRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
    Object.values(config).forEach( (c) => {
        if (c.type === 'route' && !hexRegex.test((c as RouteConfig).colour)) {
            throw Error('Invalid route colour ' + (c as RouteConfig).colour)
        }
    });
}

export const verifyAdventures = (config: AdventureConfig, adventures: Adventure[], routes: Record<string, Coordinate[]>) =>  {
    adventures.forEach( adventure => {
        adventure.locations = {...adventure.locations}
        adventure.routes = {...adventure.routes}

        Object.keys(adventure.locations).forEach( (locationKey ) => {
            if (!config[locationKey] || config[locationKey]?.type !== 'location') {
                throw Error('Invalid location type ' + locationKey)
            }
        });

        Object.keys(adventure.routes).forEach((routeKey) => {
            if (!config[routeKey] || config[routeKey]?.type !== 'route') {
                throw Error('Invalid route type ' + routeKey)
            }
        });

        Object.values(adventure.routes).forEach((adventureRoutes: Route[]) => {
            adventureRoutes.forEach(route => {
                if (!routes[route.reference]) {
                    throw Error('Missing route ' + route.reference)
                }
            });
        });
    });
}

export const parseState = (stateData: string): GlobalState => {
    const state = JSON.parse(stateData) as GlobalState;
    verifyConfig(state.config)
    verifyAdventures(state.config, state.adventures, state.routes)
    return state;
}

export async function readFile(filePath: string): Promise<string> {
    const response = await fetch(filePath);
    if (!response.ok) {
        throw new Error(`Failed to fetch file: ${filePath}`);
    }
    return response.text();
}

export const parseLocation = (locationData: string): number[] => {
    return JSON.parse(locationData) as number[]
}