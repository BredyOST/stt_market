'use client';
import React from 'react';
import { CircularProgress } from '@mui/material';
import { Box } from '@mui/system';

const Loader = () => {
    return (
        <Box sx={{ display: 'flex' }}>
            <CircularProgress />
        </Box>
    );
};

export default Loader;
