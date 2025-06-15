import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Card, 
  CardContent,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Button,
  Grid,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
  ListItemIcon,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

// Icons
import SaveIcon from '@mui/icons-material/Save';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import LanguageIcon from '@mui/icons-material/Language';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';

// API services
import { userService } from '../services/api';

const Settings = () => {
  const [settings, setSettings] = useState({
    theme: 'light',
    email_notifications: true,
    language: 'ru'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await userService.getSettings();
        setSettings(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке настроек:', error);
        setAlert({
          open: true,
          message: 'Не удалось загрузить настройки',
          severity: 'error'
        });
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChangeTheme = (event) => {
    setSettings({
      ...settings,
      theme: event.target.value
    });
  };

  const handleChangeLanguage = (event) => {
    setSettings({
      ...settings,
      language: event.target.value
    });
  };

  const handleToggleNotifications = (event) => {
    setSettings({
      ...settings,
      email_notifications: event.target.checked
    });
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    
    try {
      await userService.updateSettings(settings);
      
      setAlert({
        open: true,
        message: 'Настройки успешно сохранены',
        severity: 'success'
      });
    } catch (error) {
      console.error('Ошибка при сохранении настроек:', error);
      setAlert({
        open: true,
        message: 'Ошибка при сохранении настроек',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={500} gutterBottom>
        Настройки
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Персональные настройки приложения
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card variant="outlined" sx={{ borderRadius: 2, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Общие настройки
              </Typography>
              
              <List>
                <ListItem divider>
                  <ListItemIcon>
                    <ColorLensIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Тема оформления" 
                    secondary="Выберите предпочитаемую цветовую тему" 
                  />
                  <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
                    <Select
                      value={settings.theme}
                      onChange={handleChangeTheme}
                    >
                      <MenuItem value="light">Светлая</MenuItem>
                      <MenuItem value="dark">Темная</MenuItem>
                      <MenuItem value="system">Системная</MenuItem>
                    </Select>
                  </FormControl>
                </ListItem>
                
                <ListItem divider>
                  <ListItemIcon>
                    <LanguageIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Язык интерфейса" 
                    secondary="Выберите язык интерфейса" 
                  />
                  <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
                    <Select
                      value={settings.language}
                      onChange={handleChangeLanguage}
                    >
                      <MenuItem value="ru">Русский</MenuItem>
                      <MenuItem value="en">English</MenuItem>
                    </Select>
                  </FormControl>
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <NotificationsIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Email-уведомления" 
                    secondary="Получать уведомления на электронную почту" 
                  />
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={settings.email_notifications} 
                        onChange={handleToggleNotifications} 
                        color="primary"
                      />
                    }
                    label=""
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
          
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Безопасность
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <SecurityIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Изменение пароля" 
                    secondary="Изменить пароль для входа в систему" 
                  />
                  <Button variant="outlined" size="small">
                    Изменить пароль
                  </Button>
                </ListItem>
              </List>
            </CardContent>
          </Card>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveSettings}
              disabled={saving}
            >
              {saving ? 'Сохранение...' : 'Сохранить настройки'}
            </Button>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Информация
              </Typography>
              <Typography variant="body2" paragraph>
                Здесь вы можете изменить свои настройки приложения, включая тему оформления, 
                язык интерфейса и настройки уведомлений.
              </Typography>
              <Typography variant="body2">
                Изменения вступят в силу после сохранения настроек и обновления страницы.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity} variant="filled">
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings; 