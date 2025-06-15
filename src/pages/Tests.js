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
} from '@mui/material';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AddIcon from '@mui/icons-material/Add';
import QuizIcon from '@mui/icons-material/Quiz';
import TimerIcon from '@mui/icons-material/Timer';
import EventIcon from '@mui/icons-material/Event';

// Services
import { testService } from '../services/api';

const Tests = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        const response = await testService.getTests();
        setTests(response.data);
        setError(null);
      } catch (err) {
        console.error('Ошибка при загрузке тестов:', err);
        setError('Не удалось загрузить тесты. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleTestClick = (testId) => {
    navigate(`/tests/${testId}`);
  };

  // Filter tests based on search term
  const filteredTests = tests.filter(test =>
    test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.description.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={500} gutterBottom>
            Тесты
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Управление и прохождение тестов для проверки знаний
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          sx={{ borderRadius: 2, py: 1 }}
        >
          Создать тест
        </Button>
      </Box>

      {/* Search bar */}
      <Box mb={4} maxWidth={600}>
        <TextField
          fullWidth
          placeholder="Поиск тестов..."
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

      {/* Tests List */}
      {loading ? (
        <Box display="flex" justifyContent="center" my={5}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredTests.length > 0 ? (
            filteredTests.map((test) => (
              <Grid item xs={12} md={6} key={test.id}>
                <Card 
                  sx={{ 
                    borderRadius: 3, 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <QuizIcon fontSize="large" color="primary" sx={{ mr: 2 }} />
                      <Typography variant="h6" fontWeight={600}>
                        {test.title}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {test.description}
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <List dense disablePadding>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <EventIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Доступен с"
                          secondary={formatDate(test.start_time)}
                          primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                          secondaryTypographyProps={{ fontWeight: 500 }}
                        />
                      </ListItem>
                      
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <EventIcon fontSize="small" color="error" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Доступен до"
                          secondary={formatDate(test.end_time)}
                          primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                          secondaryTypographyProps={{ fontWeight: 500 }}
                        />
                      </ListItem>
                      
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <TimerIcon fontSize="small" color="warning" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Ограничение времени"
                          secondary={`${test.time_limit} минут`}
                          primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                          secondaryTypographyProps={{ fontWeight: 500 }}
                        />
                      </ListItem>
                      
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <HelpOutlineIcon fontSize="small" color="info" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Количество вопросов"
                          secondary={test.questions_count || 'Нет данных'}
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
                      onClick={() => handleTestClick(test.id)}
                    >
                      Открыть тест
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Box width="100%" textAlign="center" py={5}>
              <Typography variant="h6" color="text.secondary">
                Тесты не найдены
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Попробуйте изменить параметры поиска или создать новый тест
              </Typography>
            </Box>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default Tests; 