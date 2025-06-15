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
import AssignmentIcon from '@mui/icons-material/Assignment';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import GradeIcon from '@mui/icons-material/Grade';
import SchoolIcon from '@mui/icons-material/School';
import TimerIcon from '@mui/icons-material/Timer';

// Services
import { assignmentService } from '../services/api';

const Assignments = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const response = await assignmentService.getAssignments();
        setAssignments(response.data);
        setError(null);
      } catch (err) {
        console.error('Ошибка при загрузке заданий:', err);
        setError('Не удалось загрузить задания. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter assignments based on search term
  const filteredAssignments = assignments.filter(assignment =>
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.description.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Check if assignment is overdue
  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  // Get time remaining until due date
  const getTimeRemaining = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffMs = due - now;
    
    if (diffMs <= 0) return 'Просрочено';
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} д. ${diffHours} ч.`;
    } else {
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${diffHours} ч. ${diffMinutes} мин.`;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={500} gutterBottom>
            Задания
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Управление и выполнение учебных заданий
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          sx={{ borderRadius: 2, py: 1 }}
        >
          Добавить задание
        </Button>
      </Box>

      {/* Search bar */}
      <Box mb={4} maxWidth={600}>
        <TextField
          fullWidth
          placeholder="Поиск заданий..."
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

      {/* Assignments List */}
      {loading ? (
        <Box display="flex" justifyContent="center" my={5}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredAssignments.length > 0 ? (
            filteredAssignments.map((assignment) => (
              <Grid item xs={12} md={6} lg={4} key={assignment.id}>
                <Card 
                  sx={{ 
                    borderRadius: 3, 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'visible'
                  }}
                >
                  {isOverdue(assignment.due_date) ? (
                    <Chip
                      label="Просрочено"
                      color="error"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: -10,
                        right: 16,
                        fontWeight: 500,
                      }}
                    />
                  ) : (
                    <Chip
                      label={getTimeRemaining(assignment.due_date)}
                      color="primary"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: -10,
                        right: 16,
                        fontWeight: 500,
                      }}
                    />
                  )}
                  
                  <CardContent sx={{ flexGrow: 1, pt: 3 }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <AssignmentIcon fontSize="large" color="primary" sx={{ mr: 2 }} />
                      <Typography variant="h6" fontWeight={600}>
                        {assignment.title}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 2 }}>
                      {assignment.description}
                    </Typography>
                    
                    <Stack direction="row" spacing={1} mb={2}>
                      {assignment.file && (
                        <Chip 
                          icon={<AttachFileIcon />}
                          label="Файл задания" 
                          variant="outlined" 
                          size="small"
                          component="a"
                          href={assignment.file}
                          target="_blank"
                          clickable
                        />
                      )}
                      <Chip 
                        icon={<GradeIcon />}
                        label={`${assignment.max_score} баллов`}
                        variant="outlined" 
                        size="small" 
                        color="secondary"
                      />
                    </Stack>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <List dense disablePadding>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <EventIcon fontSize="small" color="error" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Срок сдачи"
                          secondary={formatDate(assignment.due_date)}
                          primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                          secondaryTypographyProps={{ fontWeight: 500 }}
                        />
                      </ListItem>
                      
                      {assignment.course && (
                        <ListItem disableGutters>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <SchoolIcon fontSize="small" color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Курс"
                            secondary={assignment.course}
                            primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                            secondaryTypographyProps={{ fontWeight: 500 }}
                          />
                        </ListItem>
                      )}
                    </List>
                  </CardContent>
                  
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button 
                      variant="contained" 
                      fullWidth
                    >
                      {isOverdue(assignment.due_date) ? 'Просмотреть задание' : 'Сдать задание'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Box width="100%" textAlign="center" py={5}>
              <Typography variant="h6" color="text.secondary">
                Заданий не найдено
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Попробуйте изменить параметры поиска или создать новое задание
              </Typography>
            </Box>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default Assignments; 