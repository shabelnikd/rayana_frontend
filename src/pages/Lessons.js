import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
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
  Stack,
} from '@mui/material';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import VideocamIcon from '@mui/icons-material/Videocam';
import SchoolIcon from '@mui/icons-material/School';
import OnlinePredictionIcon from '@mui/icons-material/OnlinePrediction';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ClassIcon from '@mui/icons-material/Class';
import VideoCallIcon from '@mui/icons-material/VideoCall';

// Services
import { lessonService } from '../services/api';

const Lessons = () => {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        const response = await lessonService.getLessons();
        setLessons(response.data);
        setError(null);
      } catch (err) {
        console.error('Ошибка при загрузке уроков:', err);
        setError('Не удалось загрузить уроки. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleLessonClick = (lessonId) => {
    navigate(`/lessons/${lessonId}`);
  };

  // Filter lessons based on search term
  const filteredLessons = lessons.filter(lesson =>
    lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lesson.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Check if lesson is current
  const isCurrentLesson = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    return now >= start && now <= end;
  };

  // Check if lesson is upcoming
  const isUpcomingLesson = (startTime) => {
    const now = new Date();
    const start = new Date(startTime);
    return start > now;
  };

  // Check if lesson is past
  const isPastLesson = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    return end < now;
  };

  // Get lesson status and color
  const getLessonStatus = (startTime, endTime) => {
    if (isCurrentLesson(startTime, endTime)) {
      return { text: 'Идет сейчас', color: 'success' };
    } else if (isUpcomingLesson(startTime)) {
      return { text: 'Предстоит', color: 'primary' };
    } else {
      return { text: 'Завершен', color: 'default' };
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={500} gutterBottom>
            Уроки
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Расписание и материалы учебных занятий
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          sx={{ borderRadius: 2, py: 1 }}
        >
          Добавить урок
        </Button>
      </Box>

      {/* Search bar */}
      <Box mb={4} maxWidth={600}>
        <TextField
          fullWidth
          placeholder="Поиск уроков..."
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

      {/* Lessons List */}
      {loading ? (
        <Box display="flex" justifyContent="center" my={5}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredLessons.length > 0 ? (
            filteredLessons.map((lesson) => {
              const status = getLessonStatus(lesson.start_time, lesson.end_time);
              
              return (
                <Grid item xs={12} md={6} lg={4} key={lesson.id}>
                  <Card 
                    sx={{ 
                      borderRadius: 3, 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                        <Box display="flex" alignItems="center">
                          <ClassIcon fontSize="large" color="primary" sx={{ mr: 2 }} />
                          <Typography variant="h6" fontWeight={600}>
                            {lesson.title}
                          </Typography>
                        </Box>
                        <Chip 
                          label={status.text} 
                          color={status.color} 
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 2 }}>
                        {lesson.description}
                      </Typography>
                      
                      <Stack direction="row" spacing={1} mb={2}>
                        {lesson.is_online && (
                          <Chip 
                            icon={<OnlinePredictionIcon />}
                            label="Онлайн" 
                            variant="outlined" 
                            size="small" 
                            color="success"
                          />
                        )}
                        {lesson.video_url && (
                          <Chip 
                            icon={<VideocamIcon />}
                            label="Видео" 
                            variant="outlined" 
                            size="small"
                            color="info"
                          />
                        )}
                      </Stack>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <List dense disablePadding>
                        <ListItem disableGutters>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <EventIcon fontSize="small" color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Начало занятия"
                            secondary={formatDate(lesson.start_time)}
                            primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                            secondaryTypographyProps={{ fontWeight: 500 }}
                          />
                        </ListItem>
                        
                        <ListItem disableGutters>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <EventIcon fontSize="small" color="error" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Окончание занятия"
                            secondary={formatDate(lesson.end_time)}
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
                        onClick={() => handleLessonClick(lesson.id)}
                      >
                        Открыть урок
                      </Button>
                      
                      {lesson.is_online && lesson.meeting_link && isCurrentLesson(lesson.start_time, lesson.end_time) && (
                        <Button 
                          variant="outlined" 
                          color="success" 
                          startIcon={<VideoCallIcon />}
                          href={lesson.meeting_link}
                          target="_blank"
                          sx={{ ml: 1 }}
                        >
                          Присоединиться
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              );
            })
          ) : (
            <Box width="100%" textAlign="center" py={5}>
              <Typography variant="h6" color="text.secondary">
                Уроки не найдены
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Попробуйте изменить параметры поиска или создать новый урок
              </Typography>
            </Box>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default Lessons; 