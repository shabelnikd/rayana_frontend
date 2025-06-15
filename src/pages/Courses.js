import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Tabs,
  Tab,
  IconButton,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  Avatar,
  CircularProgress,
  Alert,
} from '@mui/material';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

// API services
import { courseService } from '../services/api';

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuCourse, setMenuCourse] = useState(null);
  
  const open = Boolean(anchorEl);
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await courseService.getAllCourses();
        setCourses(response.data);
        setError(null);
      } catch (err) {
        console.error('Ошибка при загрузке курсов:', err);
        setError('Не удалось загрузить курсы. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);
  
  const handleOpenMenu = (event, course) => {
    setAnchorEl(event.currentTarget);
    setMenuCourse(course);
  };
  
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuCourse(null);
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}`);
  };
  
  // Filter courses based on search term and active tab
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // В API нет поля status, поэтому временно отключим фильтрацию по вкладкам
    return matchesSearch;
  });

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={500} gutterBottom>
            Курсы
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Управление и просмотр учебных курсов
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          sx={{ borderRadius: 2, py: 1 }}
        >
          Добавить курс
        </Button>
      </Box>
      
      {/* Filters */}
      <Box mb={4}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Поиск курсов..."
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 }
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 500,
                },
                '& .Mui-selected': {
                  color: 'primary.main',
                  fontWeight: 600,
                }
              }}
            >
              <Tab label="Все курсы" />
              <Tab label="Активные" />
              <Tab label="Предстоящие" />
            </Tabs>
          </Grid>
        </Grid>
      </Box>
      
      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Loading Indicator */}
      {loading ? (
        <Box display="flex" justifyContent="center" my={5}>
          <CircularProgress />
        </Box>
      ) : (
        /* Course Cards */
        <Grid container spacing={3}>
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <Grid item xs={12} md={6} lg={4} key={course.id}>
                <Card 
                  sx={{ 
                    borderRadius: 3, 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                      cursor: 'pointer'
                    }
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="180"
                      image={course.image || 'https://via.placeholder.com/300x180?text=Нет+изображения'}
                      alt={course.title}
                    />
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        top: 12, 
                        right: 12,
                        bgcolor: 'background.paper',
                        borderRadius: '50%'
                      }}
                    >
                      <IconButton 
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenMenu(e, course);
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <CardContent sx={{ p: 3 }} onClick={() => handleCourseClick(course.id)}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {course.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: 60, overflow: 'hidden' }}>
                      {course.description}
                    </Typography>
                    
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar sx={{ width: 32, height: 32, mr: 1 }} />
                      <Typography variant="body2" fontWeight={500}>
                        {course.instructor_name || 'Преподаватель'}
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ mb: 2 }} />
                    
                    <Grid container spacing={1}>
                      <Grid item xs={4}>
                        <Box display="flex" flexDirection="column" alignItems="center">
                          <PeopleIcon color="primary" sx={{ mb: 0.5 }} />
                          <Typography variant="body2" color="text.secondary">
                            Студенты
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box display="flex" flexDirection="column" alignItems="center">
                          <AutoStoriesIcon color="primary" sx={{ mb: 0.5 }} />
                          <Typography variant="body2" color="text.secondary">
                            Уроки
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box display="flex" flexDirection="column" alignItems="center">
                          <AccessTimeIcon color="primary" sx={{ mb: 0.5 }} />
                          <Typography variant="body2" color="text.secondary">
                            {new Date(course.start_date).toLocaleDateString()} - {new Date(course.end_date).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Box width="100%" textAlign="center" py={5}>
              <Typography variant="h6" color="text.secondary">
                Курсы не найдены
              </Typography>
            </Box>
          )}
        </Grid>
      )}
      
      {/* Course Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleCloseMenu}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Редактировать
        </MenuItem>
        <MenuItem onClick={handleCloseMenu}>
          <ListItemIcon>
            <DeleteOutlineIcon fontSize="small" />
          </ListItemIcon>
          Удалить
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Courses; 