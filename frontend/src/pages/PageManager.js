import React, { useState, useEffect } from 'react';
import { 
    Container, Paper, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Button,
    Dialog, DialogTitle, DialogContent, TextField,
    DialogActions
} from '@mui/material';
import { pageService } from '../services/api';

function PageManager() {
    const [pages, setPages] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState({
        title: '',
        content: '',
        status: 'draft'
    });

    useEffect(() => {
        loadPages();
    }, []);

    const loadPages = async () => {
        try {
            const response = await pageService.getAll();
            setPages(response.data);
        } catch (error) {
            console.error('Error loading pages:', error);
        }
    };

    const handleOpen = (page = null) => {
        if (page) {
            setCurrentPage(page);
        } else {
            setCurrentPage({ title: '', content: '', status: 'draft' });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = async () => {
        try {
            if (currentPage.id) {
                await pageService.update(currentPage.id, currentPage);
            } else {
                await pageService.create(currentPage);
            }
            loadPages();
            handleClose();
        } catch (error) {
            console.error('Error saving page:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this page?')) {
            try {
                await pageService.delete(id);
                loadPages();
            } catch (error) {
                console.error('Error deleting page:', error);
            }
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={() => handleOpen()}
                sx={{ mb: 2 }}
            >
                Add New Page
            </Button>
            
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Created At</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pages.map((page) => (
                            <TableRow key={page.id}>
                                <TableCell>{page.title}</TableCell>
                                <TableCell>{page.status}</TableCell>
                                <TableCell>{new Date(page.created_at).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleOpen(page)}>Edit</Button>
                                    <Button color="error" onClick={() => handleDelete(page.id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{currentPage.id ? 'Edit Page' : 'New Page'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        fullWidth
                        value={currentPage.title}
                        onChange={(e) => setCurrentPage({...currentPage, title: e.target.value})}
                    />
                    <TextField
                        margin="dense"
                        label="Content"
                        fullWidth
                        multiline
                        rows={4}
                        value={currentPage.content}
                        onChange={(e) => setCurrentPage({...currentPage, content: e.target.value})}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default PageManager; 