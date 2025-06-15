import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper } from '@mui/material';

const CourseDetail = () => {
  const { courseId } = useParams();
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Информация о курсе
      </Typography>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6">
          Детали курса #{courseId}
        </Typography>
        <Typography variant="body1">
          Здесь будет отображена подробная информация о курсе, список уроков, материалов, 
          список студентов, и другие связанные данные.
        </Typography>
      </Paper>
    </Box>
  );
};

export default CourseDetail; 