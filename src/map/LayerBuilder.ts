import {Icon, Stroke, Style} from "ol/style";
import {fromLonLat} from "ol/proj";
import Feature from "ol/Feature";
import {LineString} from "ol/geom";
import {AdventureConfig, Coordinate, LocationConfig, RouteConfig} from "../config/adventuresDefs";

export class LayerBuilder {
    stylingConfig: Record<string, Style>;

     constructor(stylingConfig: AdventureConfig) {
        const sc = {} as Record<string, Style>;
        Object.entries(stylingConfig).forEach( ([key, styling]) => {
            if (styling.type === 'route') {
                sc[key] = new Style({
                    stroke: new Stroke({
                        color: (styling as RouteConfig).colour,
                        width: (styling as RouteConfig).width,
                    })
                });
            } else {
                sc[key] = new Style({
                    image: new Icon({
                        src: (styling as LocationConfig).image,
                        scale: (styling as LocationConfig).scale,
                    })
                });
            }
        })
        this.stylingConfig = sc;
    }

    createRouteFeatures(routes: Record<string, Coordinate[]>): Feature<LineString>[] {
        const features: Feature<LineString>[] = [];

        Object.entries(routes).forEach(([key]) => {
            const formattedRoute = routes[key].map(it => fromLonLat([it[1], it[0]]))
            const lineFeature = new Feature({
                geometry: new LineString(formattedRoute)
            });
            lineFeature.setStyle(key.includes("Bypass") ? this.stylingConfig.drive : this.stylingConfig.walks);
            features.push(lineFeature);
        })

        return features
    }
}
