import React, {useEffect, useState} from 'react';
import './App.css';
import MapFascade from "./map/MapFascade";
import {readFile, parseState, parseLocation} from "./config/configMapper";
import {AdventureConfig, AllAdventures} from "./config/adventuresDefs";
import AdventureSidebar from "./AdventureSidebar";
import { styled } from '@mui/material/styles';
import {
    Box,
    Drawer,
    useTheme,
} from '@mui/material';
import ElevationProfile from "./ElevationProfile";

function App() {
    const [selectedJourney] = useState<number> (-1);
    const [selectedRoute, selectRoute] = useState("");
    const [allAdventures, setAllAdventures] = useState<AllAdventures> ({routes:{}, adventures: []});
    const [stylingConfig, setStylingConfig] = useState<AdventureConfig> ({});
    const [hoverLocation, setHoverLocation] = useState<number[]> ([]);
    const [currentLocation, setCurrentLocation] = useState<number[]> ([]);

    useEffect(() => {
        const fetchFiles = async () => {
            const location = parseLocation(await readFile(`${process.env.PUBLIC_URL}/config/location.json`))
            const state = parseState(await readFile(`${process.env.PUBLIC_URL}/config/example.json`))
            setStylingConfig(state.config);
            setCurrentLocation(location)
            setAllAdventures({adventures: state.adventures, routes: state.routes});
        };

        fetchFiles();
    }, []);


    const HiddenOnMobile = styled(Box)(({ theme }) => ({
        display: 'block',

        // Hide on mobile
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    }));

    const currentHoverLocation = (location: number[]) => {
        setHoverLocation(location)
    }

    const LEFT_DRAWER_WIDTH = 280;
    const BOTTOM_DRAWER_HEIGHT = 320;

    const BottomDrawer = styled(Box)(({ theme }) => ({
        position: 'fixed',
        bottom: 0,
        right: 0,
        left: LEFT_DRAWER_WIDTH,
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
        zIndex: theme.zIndex.drawer - 1,
    }));

    const Main = styled('main')(() => ({
        flexGrow: 1,
    }));

    const theme = useTheme();
    const [bottomOpen] = useState(true);

    return (
        <div className="App" >
            <HiddenOnMobile>
            <Drawer
                variant="permanent"
                anchor="left"
                sx={{
                    width: LEFT_DRAWER_WIDTH,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: LEFT_DRAWER_WIDTH,
                        boxSizing: 'border-box',
                    },
                }}
            >
                <AdventureSidebar allAdventures={allAdventures} selectedRoute={selectedRoute} selectRoute={selectRoute}/>
            </Drawer>
            </HiddenOnMobile>

            <Main>
                <Box>
                    <MapFascade allAdventures={allAdventures} selectedJourney={selectedJourney} stylingConfig={stylingConfig} hoverLocation={hoverLocation} selectedRoute={selectedRoute} currentLocation={currentLocation}/>
                </Box>
                <HiddenOnMobile>
                    <BottomDrawer
                        sx={{
                            height: bottomOpen ? BOTTOM_DRAWER_HEIGHT : 0,
                            transition: theme.transitions.create('height', {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.enteringScreen,
                            }),
                        }}
                    >
                        {bottomOpen && !!allAdventures.routes && !!allAdventures.routes[selectedRoute] && (
                            <ElevationProfile coordinates={allAdventures.routes[selectedRoute]} currentHoverLocation={currentHoverLocation}/>
                        )}
                    </BottomDrawer>
                </HiddenOnMobile>
            </Main>
        </div>
    );
}

export default App;
