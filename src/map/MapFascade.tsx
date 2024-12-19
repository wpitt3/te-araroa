
import React, {useEffect, useState} from "react";
import MapWrapper from "./MapWrapper";
import {LayerBuilder} from "./LayerBuilder";
import {Vector as VectorLayer} from "ol/layer";
import Feature from "ol/Feature";
import {LineString} from "ol/geom";
import Point from "ol/geom/Point";
import {AdventureConfig, AllAdventures} from "../config/adventuresDefs";
import VectorSource from "ol/source/Vector";

interface MapFascadeProps {
    allAdventures: AllAdventures;
    stylingConfig: AdventureConfig;
    selectedJourney: number;
    selectedRoute: string;
    hoverLocation: number[];
    currentLocation?: number[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getKeyIndex = <T extends Record<string, any>>(obj: T, searchKey: keyof T): number => {
    const entries = Object.entries(obj);
    return entries.findIndex(([key]) => key === searchKey);
}

const MapFascade = (props: MapFascadeProps) => {
    const [layers, setLayers] = useState<VectorLayer<Feature<Point | LineString>>[]>([]);
    const [routes, setRoutes] = useState<Feature<LineString>[]>([])

    useEffect(() => {
        const layerBuilder = new LayerBuilder(props.stylingConfig)
        const newRoutes = layerBuilder.createRouteFeatures(props.allAdventures.routes)
        const features: Feature<Point | LineString>[] = newRoutes;
        setRoutes(newRoutes)
        setLayers([new VectorLayer({
            source: new VectorSource({features}),
        })]);
    }, [props.stylingConfig, props.allAdventures.adventures, props.allAdventures.routes]);

    if (props.selectedJourney !== null && !!routes) {
        if (props.selectedJourney === -1) {
            layers.forEach((layer) => layer.setVisible(true))
        } else {
            layers.forEach((layer, i) => layer.setVisible(i === props.selectedJourney) )
        }
    }

    const routeIndex = getKeyIndex(props.allAdventures.routes, props.selectedRoute)
    return (
        <MapWrapper layers={layers} viewExtent={props.selectedJourney !== -1 ? layers[props.selectedJourney].getSource()?.getExtent() : undefined} selectedRoute={routeIndex !== -1 ? routes[routeIndex] : undefined} hoverLocation={props.hoverLocation} currentLocation={props.currentLocation}/>
    );
}

export default MapFascade;