import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, CardActions, Button } from '@mui/material';
import { websiteService } from '../services/api';
import WebsiteEditor from '../components/WebsiteEditor';
import EditIcon from '@mui/icons-material/Edit';
import PreviewIcon from '@mui/icons-material/Preview';

function WebsiteList() {
    const [websites, setWebsites] = useState([]);
    const [selectedWebsite, setSelectedWebsite] = useState(null);
    const [editorOpen, setEditorOpen] = useState(false);

    useEffect(() => {
        const fetchWebsites = async () => {
            try {
                const response = await websiteService.getAll();
                setWebsites(response.data);
            } catch (error) {
                console.error('Błąd podczas pobierania stron:', error);
            }
        };
        fetchWebsites();
    }, []);

    const handleOpenWebsite = (path) => {
        window.open(`http://localhost:8000${path}`, '_blank');
    };

    const handleEdit = (website) => {
        setSelectedWebsite(website);
        setEditorOpen(true);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom fontFamily="Poppins">
                Dostępne strony
            </Typography>
            <Grid container spacing={3}>
                {websites.map((website) => (
                    <Grid item xs={12} sm={6} md={4} key={website.name}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="div" fontFamily="Poppins">
                                    {website.name}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button 
                                    size="small" 
                                    onClick={() => handleOpenWebsite(website.path)}
                                    variant="contained"
                                    startIcon={<PreviewIcon />}
                                >
                                    Podgląd
                                </Button>
                                <Button 
                                    size="small"
                                    onClick={() => handleEdit(website)}
                                    variant="outlined"
                                    startIcon={<EditIcon />}
                                >
                                    Edytuj
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <WebsiteEditor 
                open={editorOpen}
                onClose={() => setEditorOpen(false)}
                websitePath={selectedWebsite?.path}
            />
        </Container>
    );
}

export default WebsiteList; 