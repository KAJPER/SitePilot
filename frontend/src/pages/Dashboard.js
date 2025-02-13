import React from 'react';
import { Container, Grid, Paper, Typography, Box } from '@mui/material';

function Dashboard() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Panel Administratora
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">
                Witaj w panelu administracyjnym. Wybierz sekcję z menu, aby rozpocząć zarządzanie treścią.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;