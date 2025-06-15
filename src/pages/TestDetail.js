import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper } from '@mui/material';

const TestDetail = () => {
  const { testId } = useParams();
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Информация о тесте
      </Typography>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6">
          Детали теста #{testId}
        </Typography>
        <Typography variant="body1">
          Здесь будет отображена детальная информация о тесте, вопросы,
          результаты и другие связанные данные.
        </Typography>
      </Paper>
    </Box>
  );
};

export default TestDetail; 