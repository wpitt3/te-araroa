import React, {useEffect, useState} from "react";
import Map from "ol/Map";
import 'ol/ol.css';
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import View from "ol/View";
import {fromLonLat} from "ol/proj";
import Feature from "ol/Feature";
import {LineString} from "ol/geom";
import {Vector as VectorLayer} from "ol/layer";
import Point from "ol/geom/Point";
import {Extent} from "ol/extent";
import "./Map.css"
import VectorSource from "ol/source/Vector";
import {Style, Icon} from "ol/style";

interface MapWrapperProps {
    layers: VectorLayer<Feature<Point | LineString>>[];
    viewExtent?: Extent
    selectedRoute?: Feature<LineString>;
    hoverLocation: number[],
    currentLocation?: number[],
}

const initialLocation = [170.522737063777, -44.6642786290552];

const MapWrapper = (props: MapWrapperProps) => {
    const padding = 100;

    const [oMap, setMap] = useState<Map | null>(null);

    // Set up Map
    useEffect(() => {
        const map = new Map({
            target: 'map',
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
            ],
            view: new View({
                center: fromLonLat(initialLocation),
                zoom: 5.4
            })
        });
        setMap(map);

        return () => {
            map.dispose();
        };
    }, []);

    // Add layers to Map
    useEffect(() => {
        if (props.layers && !!oMap) {
            oMap.setLayers([
                new TileLayer({
                    source: new OSM()
                }),
                ...props.layers]
            )
        }
    }, [oMap, props.layers]);

    // zoom to fit on viewExtent change
    useEffect(() => {
        if (props.viewExtent && !!oMap) {
            oMap.getView().fit(props.viewExtent, { duration: 1000, padding:[padding, padding, padding, padding], maxZoom: 14})

        }
        if (!props.viewExtent && !!oMap) {
            const point = new Point(fromLonLat(initialLocation));
            oMap.getView().fit(point, { duration: 2000, padding:[padding, padding, padding, padding], maxZoom: 5.7})
        }

    }, [oMap, props.viewExtent]);

    useEffect(() => {
        if (!!oMap && !!props.currentLocation) {
            const currentPointSource = new VectorSource();
            const currentPointLayer = new VectorLayer({
                source: currentPointSource,
                style: new Style({
                    image: new Icon({
                        src: `${process.env.PUBLIC_URL}/images/hiking.png`,
                        scale: 0.07,
                    })
                })
            });

            oMap.addLayer(currentPointLayer);
            const currentPoint = new Feature({
                geometry: new Point(fromLonLat(props.currentLocation))
            });

            currentPointSource.clear();
            currentPointSource.addFeature(currentPoint);
        }
    }, [oMap]);

    return <div className="map-container" id="map"></div>;
};

export default MapWrapper;