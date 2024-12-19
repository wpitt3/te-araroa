import React, { useState } from 'react';
import {
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
    Box,
    Collapse,
    styled,
    Divider
} from '@mui/material';
import {AllAdventures} from "./config/adventuresDefs";

const SidebarTitle = styled(Typography)(({ theme }) => ({
    padding: theme.spacing(2),
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
}));

const Section = styled(Box)(() => ({
}));

interface AdventureSidebarProps {
    allAdventures: AllAdventures
    selectedRoute: string
    selectRoute: (name: string) => void;
}

const AdventureSidebar: React.FC<AdventureSidebarProps> = ({ allAdventures, selectedRoute, selectRoute}) => {
    const [openSections, setOpenSections] = useState({routes: true});

    const routes = Object.entries(allAdventures.routes).map((x) => x[0]);

    const handleSectionToggle = (section: keyof typeof openSections) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleItemSelection = (index: number) => {
        selectRoute(routes[index] === selectedRoute ? "" : routes[index])
    };

    return (
        <div>
            <SidebarTitle variant="h5">
                Adventures
            </SidebarTitle>
            <Section>
                <ListItemButton onClick={() => handleSectionToggle('routes')}>
                    <ListItemText primary="Routes" />
                </ListItemButton>
                <Collapse in={openSections.routes} timeout="auto">
                    <Divider variant={"middle"} sx={{ opacity: 0.6 }}/>
                    <Divider variant={"middle"} sx={{ opacity: 0.6 }}/>
                    <List>
                        {routes.map((quest, index) => (
                            <ListItem key={index} disablePadding>
                                <ListItemButton selected={quest === selectedRoute} onClick={() => handleItemSelection(index)}>
                                    <ListItemText primary={quest} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Collapse>
            </Section>
            <Divider />
        </div>
    );
};

export default AdventureSidebar;