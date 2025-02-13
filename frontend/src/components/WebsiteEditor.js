import React, { useState, useEffect, useRef } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Alert,
    IconButton,
    Tooltip,
} from '@mui/material';
import { Save as SaveIcon, Image as ImageIcon, Edit as EditIcon, AddPhotoAlternate as AddPhotoIcon } from '@mui/icons-material';
import ContentEditable from 'react-contenteditable';
import parse from 'html-react-parser';
import * as Icons from '@mui/icons-material';

function WebsiteEditor({ open, onClose, websitePath }) {
    const [html, setHtml] = useState('');
    const [css, setCss] = useState('');
    const [error, setError] = useState('');
    const [editableElements, setEditableElements] = useState({});
    const fileInputRef = useRef(null);
    const [selectedImageElement, setSelectedImageElement] = useState(null);
    const [iconPickerOpen, setIconPickerOpen] = useState(false);
    const [selectedIconElement, setSelectedIconElement] = useState(null);

    useEffect(() => {
        if (websitePath && open) {
            fetch(`http://localhost:8000${websitePath}`)
                .then(response => response.text())
                .then(htmlContent => {
                    const modifiedHtml = htmlContent.replace(
                        /(<(?:p|h[1-6]|span|div|button|a)[^>]*>)(.*?)(<\/(?:p|h[1-6]|span|div|button|a)>)|(<img[^>]*>)|(<i class="fa[bs]? fa-([^"]*)"[^>]*><\/i>)/g,
                        (match, openTag, content, closeTag, imgTag, iconTag, iconName) => {
                            const id = `editable-${Math.random().toString(36).substr(2, 9)}`;
                            
                            if (imgTag) {
                                const srcMatch = imgTag.match(/src="([^"]*)"/);
                                let src = srcMatch ? srcMatch[1] : '';
                                
                                if (!src.startsWith('http')) {
                                    src = src.startsWith('/') ? src : `/${src}`;
                                    src = `/websites/${websitePath.split('/')[2]}${src}`;
                                }
                                
                                setEditableElements(prev => ({
                                    ...prev,
                                    [id]: {
                                        type: 'image',
                                        src: src,
                                        originalTag: imgTag
                                    }
                                }));
                                return `<div class="editable-image" id="${id}">${imgTag}</div>`;
                            } else if (iconTag) {
                                setEditableElements(prev => ({
                                    ...prev,
                                    [id]: {
                                        type: 'icon',
                                        name: iconName,
                                        originalTag: iconTag
                                    }
                                }));
                                return `<span class="editable-icon" id="${id}">${iconTag}</span>`;
                            } else {
                                setEditableElements(prev => ({
                                    ...prev,
                                    [id]: {
                                        type: 'text',
                                        content: content || '',
                                        originalTag: openTag
                                    }
                                }));
                                return `${openTag}<span class="editable" id="${id}">${content || ''}</span>${closeTag}`;
                            }
                        }
                    );
                    setHtml(modifiedHtml);

                    // Ładowanie CSS
                    const cssPath = htmlContent.match(/href="([^"]*\.css)"/)?.[1];
                    if (cssPath) {
                        const fullCssPath = cssPath.startsWith('http') 
                            ? cssPath 
                            : `http://localhost:8000/websites/${websitePath.split('/')[2]}/${cssPath}`;
                        
                        fetch(fullCssPath)
                            .then(response => response.text())
                            .then(cssContent => {
                                setCss(cssContent);
                            })
                            .catch(error => {
                                console.error('Błąd podczas wczytywania CSS:', error);
                            });
                    }
                })
                .catch(error => {
                    console.error('Błąd podczas wczytywania strony:', error);
                    setError('Nie udało się wczytać strony');
                });
        }
    }, [websitePath, open]);

    const handleContentChange = (id, event) => {
        const newContent = event.target.value;
        setEditableElements(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                content: newContent
            }
        }));
    };

    const handleImageClick = (id) => {
        setSelectedImageElement(id);
        fileInputRef.current?.click();
    };

    const handleImageChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file || !selectedImageElement) return;

        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('path', websitePath);

            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/api/websites/upload-image', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            });

            if (response.ok) {
                const { imageUrl } = await response.json();
                setEditableElements(prev => ({
                    ...prev,
                    [selectedImageElement]: {
                        ...prev[selectedImageElement],
                        type: 'image',
                        src: imageUrl,
                        originalTag: prev[selectedImageElement].originalTag.replace(
                            /src="[^"]*"/,
                            `src="images/${imageUrl.split('/').pop()}"`
                        )
                    }
                }));
            } else {
                throw new Error('Nie udało się przesłać zdjęcia');
            }
        } catch (error) {
            console.error('Błąd podczas przesyłania zdjęcia:', error);
            setError('Nie udało się przesłać zdjęcia');
        }
    };

    const IconPicker = ({ onSelect }) => {
        const commonIcons = [
            'Home', 'Person', 'Settings', 'Mail', 'Phone', 'LocationOn',
            'Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'GitHub',
            'Menu', 'Close', 'Search', 'ShoppingCart', 'Favorite'
        ];

        return (
            <Dialog open={iconPickerOpen} onClose={() => setIconPickerOpen(false)}>
                <DialogTitle>Wybierz ikonę</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 2, p: 2 }}>
                        {commonIcons.map(iconName => {
                            const Icon = Icons[iconName];
                            return (
                                <IconButton
                                    key={iconName}
                                    onClick={() => {
                                        onSelect(iconName);
                                        setIconPickerOpen(false);
                                    }}
                                >
                                    <Icon />
                                </IconButton>
                            );
                        })}
                    </Box>
                </DialogContent>
            </Dialog>
        );
    };

    const handleIconChange = (id, iconName) => {
        setEditableElements(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                name: iconName
            }
        }));
    };

    const handleSave = async () => {
        try {
            let finalHtml = html;
            Object.entries(editableElements).forEach(([id, element]) => {
                if (element.type === 'image') {
                    const regex = new RegExp(`<div class="editable-image" id="${id}">.*?</div>`);
                    const fileName = element.src.split('/').pop();
                    const newImgTag = element.originalTag.replace(
                        /src="[^"]*"/,
                        `src="images/${fileName}"`
                    );
                    finalHtml = finalHtml.replace(regex, newImgTag);
                } else if (element.type === 'text') {
                    const regex = new RegExp(`<span class="editable" id="${id}">.*?</span>`);
                    finalHtml = finalHtml.replace(regex, element.content);
                }
            });

            // Usuń podwójne "images/images/" jeśli występują
            finalHtml = finalHtml.replace(/src="images\/images\//g, 'src="images/');

            const response = await fetch('http://localhost:8000/api/websites/update', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    path: websitePath,
                    content: finalHtml
                }),
                credentials: 'include'
            });

            if (response.ok) {
                onClose();
                // Odśwież stronę po zapisaniu
                window.location.reload();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Nie udało się zapisać zmian');
            }
        } catch (error) {
            console.error('Błąd podczas zapisywania:', error);
            setError(error.message || 'Nie udało się zapisać zmian');
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="xl" 
            fullWidth
            PaperProps={{
                sx: {
                    minHeight: '90vh',
                    maxHeight: '90vh',
                }
            }}
        >
            <DialogTitle sx={{ fontFamily: 'Poppins', bgcolor: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
                Edytor wizualny
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
                {error && (
                    <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
                )}
                <input
                    type="file"
                    hidden
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                />
                <Box 
                    sx={{ 
                        height: 'calc(90vh - 130px)',
                        overflow: 'auto',
                        p: 3,
                        '& .editable, & .editable-image': {
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                outline: '2px solid #1976d2',
                                borderRadius: '4px',
                            },
                            '&:focus': {
                                backgroundColor: 'rgba(25, 118, 210, 0.12)',
                                outline: '2px solid #1976d2',
                                borderRadius: '4px',
                            }
                        },
                        '& .editable-image': {
                            display: 'inline-block',
                            position: 'relative',
                            '&:hover .image-overlay': {
                                display: 'flex',
                            }
                        },
                        '& .image-overlay': {
                            display: 'none',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            justifyContent: 'center',
                            alignItems: 'center'
                        },
                        '& .editable-icon': {
                            cursor: 'pointer',
                            display: 'inline-block',
                            padding: '4px',
                            '&:hover': {
                                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                borderRadius: '4px',
                            }
                        }
                    }}
                >
                    <style>{css}</style>
                    {parse(html, {
                        replace: (domNode) => {
                            if (domNode.attribs) {
                                if (domNode.attribs.class === 'editable') {
                                    const id = domNode.attribs.id;
                                    return (
                                        <ContentEditable
                                            html={editableElements[id]?.content || ''}
                                            onChange={(e) => handleContentChange(id, e)}
                                            tagName="span"
                                            className="editable"
                                        />
                                    );
                                } else if (domNode.attribs.class === 'editable-image') {
                                    const id = domNode.attribs.id;
                                    const element = editableElements[id];
                                    const imageSrc = element?.src 
                                        ? `http://localhost:8000${element.src}`
                                        : null;
                                    return (
                                        <div className="editable-image" onClick={() => handleImageClick(id)}>
                                            {imageSrc && (
                                                <img 
                                                    src={imageSrc}
                                                    alt="" 
                                                    style={{ maxWidth: '100%' }}
                                                />
                                            )}
                                            <div className="image-overlay">
                                                <Tooltip title="Zmień zdjęcie">
                                                    <IconButton color="primary">
                                                        <ImageIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </div>
                                        </div>
                                    );
                                } else if (domNode.attribs.class === 'editable-icon') {
                                    const id = domNode.attribs.id;
                                    const iconData = editableElements[id];
                                    return (
                                        <span 
                                            className="editable-icon"
                                            onClick={() => {
                                                setSelectedIconElement(id);
                                                setIconPickerOpen(true);
                                            }}
                                        >
                                            <i className={`fas fa-${iconData?.name || 'question'}`} />
                                        </span>
                                    );
                                }
                            }
                        }
                    })}
                </Box>
                <IconPicker 
                    onSelect={(iconName) => {
                        if (selectedIconElement) {
                            handleIconChange(selectedIconElement, iconName);
                        }
                    }}
                />
            </DialogContent>
            <DialogActions sx={{ bgcolor: '#f5f5f5', borderTop: '1px solid #ddd', p: 2 }}>
                <Button onClick={onClose} variant="outlined">
                    Anuluj
                </Button>
                <Button 
                    onClick={handleSave} 
                    startIcon={<SaveIcon />} 
                    variant="contained"
                >
                    Zapisz zmiany
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default WebsiteEditor; 