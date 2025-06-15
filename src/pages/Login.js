import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { alpha } from '@mui/material/styles';
import Alert from '@mui/material/Alert';

// Icons
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import SchoolIcon from '@mui/icons-material/School';

// API services
import { authService } from '../services/api';

// College image
const collegeImageUrl = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Вызов реального API для аутентификации
      await authService.login(username, password);
      onLogin();
    } catch (error) {
      console.error('Ошибка входа:', error);
      setError('Неверный логин или пароль');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container component="main" maxWidth="lg" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Grid container component={Paper} elevation={6} sx={{ borderRadius: 2, overflow: 'hidden', height: '80vh' }}>
        {/* Left side - College Image */}
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${collegeImageUrl})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: alpha('#2e7d32', 0.7), // Green overlay
              zIndex: 1,
            },
          }}
        >
          <Box
            sx={{
              position: 'relative',
              zIndex: 2,
              height: '100%',
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              color: '#fff',
            }}
          >
            <Box display="flex" alignItems="center" mb={3}>
              <SchoolIcon sx={{ fontSize: 40, mr: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                Система Управления Обучением
              </Typography>
            </Box>
            <Typography variant="h5" mb={2}>
              Добро пожаловать!
            </Typography>
            <Typography variant="body1">
              Онлайн-платформа для эффективного образовательного процесса в колледже. 
              Проводите уроки, управляйте курсами, следите за успеваемостью студентов.
            </Typography>
          </Box>
        </Grid>

        {/* Right side - Login Form */}
        <Grid item xs={12} sm={8} md={5}>
          <Box
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Avatar sx={{ mx: 'auto', bgcolor: 'primary.main', mb: 1 }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Вход в систему
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Имя пользователя"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Пароль"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Запомнить меня"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Вход...' : 'Войти'}
              </Button>
              <Grid container>
                <Grid item xs>
                  <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                    Забыли пароль?
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                    {"Нет аккаунта? Обратитесь к администратору"}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login; 