import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper } from '@mui/material';

const LessonDetail = () => {
  const { lessonId } = useParams();
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Информация об уроке
      </Typography>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6">
          Детали урока #{lessonId}
        </Typography>
        <Typography variant="body1">
          Здесь будет отображена подробная информация об уроке, материалы,
          задания и другие связанные данные.
        </Typography>
      </Paper>
    </Box>
  );
};

export default LessonDetail; 