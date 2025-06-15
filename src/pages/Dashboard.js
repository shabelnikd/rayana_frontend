import React from 'react';
import { Grid, Paper, Typography, Box, Card, CardContent, Avatar, IconButton, Divider, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

// Icons
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ClassIcon from '@mui/icons-material/Class';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TimerIcon from '@mui/icons-material/Timer';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// Mock data
const statsCards = [
  { title: 'Всего курсов', value: '12', icon: <MenuBookIcon />, color: '#4caf50' },
  { title: 'Активных уроков', value: '24', icon: <ClassIcon />, color: '#2196f3' },
  { title: 'Заданий', value: '86', icon: <AssignmentIcon />, color: '#ff9800' },
  { title: 'Студентов', value: '156', icon: <PeopleIcon />, color: '#9c27b0' },
];

const upcomingLessons = [
  { id: 1, title: 'Программирование на Python', date: '24 мая, 10:00', status: 'upcoming', course: 'Основы программирования' },
  { id: 2, title: 'Введение в базы данных', date: '24 мая, 13:30', status: 'upcoming', course: 'Базы данных' },
  { id: 3, title: 'HTML и CSS', date: '25 мая, 09:15', status: 'upcoming', course: 'Веб-разработка' },
];

const recentAssignments = [
  { id: 1, title: 'Разработка алгоритмов', course: 'Основы программирования', deadline: '26 мая', submissions: 18, total: 25 },
  { id: 2, title: 'SQL запросы', course: 'Базы данных', deadline: '28 мая', submissions: 12, total: 25 },
  { id: 3, title: 'Создание лендинга', course: 'Веб-разработка', deadline: '30 мая', submissions: 5, total: 25 },
];

// Styled components
const StatsCardRoot = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  height: '100%',
}));

const IconWrapper = styled(Box)(({ bgcolor }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 12,
  width: 56,
  height: 56,
  backgroundColor: bgcolor,
  color: '#fff',
  '& svg': {
    fontSize: 28,
  },
}));

const LessonStatusChip = styled(Box)(({ status }) => {
  let bgcolor = '#e0e0e0';
  let color = '#616161';
  
  if (status === 'active') {
    bgcolor = '#e8f5e9';
    color = '#2e7d32';
  } else if (status === 'upcoming') {
    bgcolor = '#e3f2fd';
    color = '#1976d2';
  }
  
  return {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: 16,
    padding: '4px 12px',
    fontSize: 12,
    fontWeight: 500,
    backgroundColor: bgcolor,
    color: color,
    '& svg': {
      marginRight: 4,
      fontSize: 14,
    },
  };
});

const Dashboard = () => {
  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" fontWeight={500} gutterBottom>
          Добро пожаловать!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Обзор системы управления обучением колледжа
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        {statsCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatsCardRoot>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <IconWrapper bgcolor={card.color}>
                    {card.icon}
                  </IconWrapper>
                  <IconButton size="small">
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Typography variant="h4" fontWeight="bold">
                  {card.value}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {card.title}
                </Typography>
              </CardContent>
            </StatsCardRoot>
          </Grid>
        ))}
      </Grid>

      {/* Upcoming Lessons */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="bold">
                  Ближайшие уроки
                </Typography>
                <Button 
                  size="small" 
                  endIcon={<ArrowForwardIcon />}
                  sx={{ textTransform: 'none' }}
                >
                  Показать все
                </Button>
              </Box>
              <Box>
                {upcomingLessons.map((lesson, index) => (
                  <React.Fragment key={lesson.id}>
                    <Box py={2}>
                      <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                        <Typography variant="subtitle1" fontWeight={500}>
                          {lesson.title}
                        </Typography>
                        <LessonStatusChip status={lesson.status}>
                          <TimerIcon />
                          Скоро
                        </LessonStatusChip>
                      </Box>
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        {lesson.course}
                      </Typography>
                      <Box display="flex" alignItems="center">
                        <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
                        <Typography variant="body2" color="text.secondary">
                          {lesson.date}
                        </Typography>
                      </Box>
                    </Box>
                    {index < upcomingLessons.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Assignments */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="bold">
                  Текущие задания
                </Typography>
                <Button 
                  size="small" 
                  endIcon={<ArrowForwardIcon />}
                  sx={{ textTransform: 'none' }}
                >
                  Показать все
                </Button>
              </Box>
              <Box>
                {recentAssignments.map((assignment, index) => (
                  <React.Fragment key={assignment.id}>
                    <Box py={2}>
                      <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                        <Typography variant="subtitle1" fontWeight={500}>
                          {assignment.title}
                        </Typography>
                        <Box display="flex" alignItems="center">
                          <CheckCircleIcon sx={{ color: 'success.main', mr: 0.5, fontSize: 16 }} />
                          <Typography variant="body2" color="text.secondary">
                            {assignment.submissions}/{assignment.total}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        {assignment.course}
                      </Typography>
                      <Box display="flex" alignItems="center">
                        <TimerIcon fontSize="small" sx={{ mr: 1, color: 'warning.main', fontSize: 16 }} />
                        <Typography variant="body2" color="warning.main">
                          Срок: {assignment.deadline}
                        </Typography>
                      </Box>
                    </Box>
                    {index < recentAssignments.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 