import React, { useMemo } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
} from 'recharts';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useTheme } from '@mui/material/styles';
import {Coordinate} from "./config/adventuresDefs";


type ElevationPoint = {
    distance: number;
    elevation: number;
    originalPoint: Coordinate;
};

interface ElevationProfileProps {
    coordinates: Coordinate[];
    currentHoverLocation: (location: number[]) => void;
}

const ElevationProfile: React.FC<ElevationProfileProps> = ({ coordinates }) => {
    // Calculate distances between points using the Haversine formula
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371; // Earth's radius in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.asin(Math.sqrt(a));
        return R * c;
    };

    // Process coordinates to include distance from start
    const data: ElevationPoint[] = useMemo(() => {
        let totalDistance = 0;
        return coordinates.map((coord, index) => {
            if (index > 0) {
                const prevCoord = coordinates[index - 1];
                totalDistance += calculateDistance(
                    prevCoord[1],
                    prevCoord[0],
                    coord[1],
                    coord[0]
                );
            }
            return {
                distance: Number(totalDistance.toFixed(2)),
                elevation: Number(coord[2].toFixed(2)),
                originalPoint: coord
            };
        });
    }, [coordinates]);

    // Generate whole number ticks for X-axis
    const generateXAxisTicks = useMemo(() => {
        if (data.length === 0) return [];

        const maxDistance = data[data.length - 1].distance;
        const tickCount = Math.min(20, maxDistance); // Maximum 10 ticks
        const interval = Math.ceil(maxDistance / tickCount);


        const ticks = [];
        for (let i = 0; i <= maxDistance; i += interval) {
            ticks.push(Math.round(i));
        }

        // Make sure we include the last tick if it's not already there
        const lastTick = Math.round(maxDistance);
        if (ticks[ticks.length - 1] !== lastTick) {
            ticks.push(lastTick);
        }

        // If we somehow ended up with more than 10 ticks, trim them
        return ticks.slice(0, 20);
    }, [data]);

    // Custom tooltip component using Material-UI
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const CustomTooltip = ({active, payload}: any) => {
        if (active && payload && payload.length) {
            const point = payload[0].payload;
            return (
                <Paper
                    elevation={3}
                    sx={{
                        p: 2,
                        backgroundColor: 'background.paper',
                    }}
                >
                    <Typography variant="subtitle2" gutterBottom>
                        Distance: {point.distance.toFixed(2)} km
                    </Typography>
                    <Typography variant="subtitle2" gutterBottom>
                        Elevation: {point.elevation}m
                    </Typography>
                </Paper>
            );
        }
        return null;
    };
    const theme = useTheme();
    return (
        <Card elevation={2}>
            <CardContent>
                <Box sx={{height: 300, width: '100%'}}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={data}
                            margin={{
                                top: 20,
                                right: 20,
                                left: 20,
                                bottom: 20
                            }}
                        >
                            <XAxis
                                dataKey="distance"
                                label={{
                                    value: 'Distance (km)',
                                    position: 'bottom',
                                    style: {fill: theme.palette.text.primary}
                                }}
                                type="number"
                                tick={{fill: theme.palette.text.primary}}
                                ticks={generateXAxisTicks}
                                domain={[0, 'dataMax']}
                            />
                            <YAxis
                                label={{
                                    value: 'Elevation (m)',
                                    angle: -90,
                                    position: 'insideLeft',
                                    style: {fill: theme.palette.text.primary}
                                }}
                                tick={{fill: theme.palette.text.primary}}
                            />
                            <Tooltip content={<CustomTooltip/>}/>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke={theme.palette.divider}
                            />
                            <Line
                                type="monotone"
                                dataKey="elevation"
                                stroke={theme.palette.primary.main}
                                strokeWidth={2}
                                dot={false}
                                activeDot={{
                                    r: 6,
                                    fill: theme.palette.primary.main,
                                    stroke: theme.palette.background.paper
                                }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ElevationProfile;