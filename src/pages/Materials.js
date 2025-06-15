import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  IconButton,
  Chip,
  CardMedia,
} from '@mui/material';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import GetAppIcon from '@mui/icons-material/GetApp';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import ArticleIcon from '@mui/icons-material/Article';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import EventIcon from '@mui/icons-material/Event';
import SchoolIcon from '@mui/icons-material/School';
import ClassIcon from '@mui/icons-material/Class';

// Services
import { materialService } from '../services/api';

const Materials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        const response = await materialService.getMaterials();
        setMaterials(response.data);
        setError(null);
      } catch (err) {
        console.error('Ошибка при загрузке материалов:', err);
        setError('Не удалось загрузить учебные материалы. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter materials based on search term
  const filteredMaterials = materials.filter(material =>
    material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Get file icon based on filename
  const getFileIcon = (filename) => {
    if (!filename) return <InsertDriveFileIcon />;
    
    const extension = filename.split('.').pop().toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return <PictureAsPdfIcon color="error" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <ImageIcon color="info" />;
      case 'doc':
      case 'docx':
        return <ArticleIcon color="primary" />;
      case 'mp4':
      case 'avi':
      case 'mov':
        return <VideoFileIcon color="secondary" />;
      default:
        return <InsertDriveFileIcon />;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={500} gutterBottom>
            Учебные материалы
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Документы, презентации и другие учебные ресурсы
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          sx={{ borderRadius: 2, py: 1 }}
        >
          Добавить материал
        </Button>
      </Box>

      {/* Search bar */}
      <Box mb={4} maxWidth={600}>
        <TextField
          fullWidth
          placeholder="Поиск материалов..."
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            sx: { borderRadius: 2 }
          }}
        />
      </Box>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Materials List */}
      {loading ? (
        <Box display="flex" justifyContent="center" my={5}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredMaterials.length > 0 ? (
            filteredMaterials.map((material) => (
              <Grid item xs={12} md={6} lg={4} key={material.id}>
                <Card 
                  sx={{ 
                    borderRadius: 3, 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* Миниатюра для файла */}
                  <Box 
                    sx={{ 
                      p: 2, 
                      bgcolor: 'grey.100', 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      height: 140
                    }}
                  >
                    <Box sx={{ fontSize: 80, color: 'text.secondary', opacity: 0.7 }}>
                      {getFileIcon(material.file)}
                    </Box>
                  </Box>
                  
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {material.title}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 2 }}>
                      {material.description || 'Без описания'}
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <List dense disablePadding>
                      {material.course && (
                        <ListItem disableGutters>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <SchoolIcon fontSize="small" color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Курс"
                            secondary={material.course}
                            primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                            secondaryTypographyProps={{ fontWeight: 500 }}
                          />
                        </ListItem>
                      )}
                      
                      {material.lesson && (
                        <ListItem disableGutters>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <ClassIcon fontSize="small" color="secondary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Урок"
                            secondary={material.lesson}
                            primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                            secondaryTypographyProps={{ fontWeight: 500 }}
                          />
                        </ListItem>
                      )}
                      
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <EventIcon fontSize="small" color="info" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Дата добавления"
                          secondary={formatDate(material.created_at)}
                          primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                          secondaryTypographyProps={{ fontWeight: 500 }}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                  
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button 
                      variant="contained" 
                      fullWidth
                      startIcon={<GetAppIcon />}
                      href={material.file}
                      target="_blank"
                    >
                      Скачать
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Box width="100%" textAlign="center" py={5}>
              <Typography variant="h6" color="text.secondary">
                Материалы не найдены
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Попробуйте изменить параметры поиска или добавить новые материалы
              </Typography>
            </Box>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default Materials; 