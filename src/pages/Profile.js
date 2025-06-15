import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Avatar, 
  Grid, 
  Divider, 
  Button,
  TextField,
  Card,
  CardContent,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Icons
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import DateRangeIcon from '@mui/icons-material/DateRange';

// API services
import { userService } from '../services/api';

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: `4px solid ${theme.palette.background.paper}`,
  boxShadow: theme.shadows[3],
}));

const ProfileHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(6, 3),
  borderRadius: '16px 16px 0 0',
  position: 'relative',
}));

const InfoItem = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
    <Box sx={{ mr: 2, color: 'primary.main' }}>
      {icon}
    </Box>
    <Box>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1">
        {value || 'Не указано'}
      </Typography>
    </Box>
  </Box>
);

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    bio: ''
  });
  const [fileInput, setFileInput] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileResponse = await userService.getProfile();
        setProfile(profileResponse.data);
        setFormData({
          first_name: profileResponse.data.user.first_name || '',
          last_name: profileResponse.data.user.last_name || '',
          email: profileResponse.data.user.email || '',
          bio: profileResponse.data.bio || ''
        });
        setLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке профиля:', error);
        setAlert({
          open: true,
          message: 'Не удалось загрузить профиль',
          severity: 'error'
        });
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFileInput(e.target.files[0]);
  };

  const handleEditToggle = () => {
    setEditing(!editing);
    if (!editing) {
      // Сбросить форму при начале редактирования
      setFormData({
        first_name: profile.user.first_name || '',
        last_name: profile.user.last_name || '',
        email: profile.user.email || '',
        bio: profile.bio || ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Обновление данных пользователя
      const userData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
      };
      
      await userService.updateUser(profile.user.id, userData);
      
      // Обновление профиля
      const profileData = new FormData();
      profileData.append('bio', formData.bio);
      
      if (fileInput) {
        profileData.append('profile_picture', fileInput);
      }
      
      const updatedProfile = await userService.updateProfile(profileData);
      setProfile(updatedProfile.data);
      
      setAlert({
        open: true,
        message: 'Профиль успешно обновлен',
        severity: 'success'
      });
      
      setEditing(false);
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
      setAlert({
        open: true,
        message: 'Ошибка при обновлении профиля',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  if (loading && !profile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={500} gutterBottom>
        Профиль пользователя
      </Typography>
      
      <Paper sx={{ borderRadius: 4, overflow: 'hidden', mb: 4 }}>
        <ProfileHeader>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <ProfileAvatar 
                src={profile?.profile_picture} 
                alt={profile?.user?.username}
              >
                {!profile?.profile_picture && (
                  profile?.user?.first_name && profile?.user?.last_name 
                    ? `${profile.user.first_name[0]}${profile.user.last_name[0]}`
                    : (profile?.user?.username?.[0] || 'U')
                )}
              </ProfileAvatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {profile?.user?.first_name && profile?.user?.last_name 
                  ? `${profile.user.first_name} ${profile.user.last_name}`
                  : profile?.user?.username}
              </Typography>
              <Typography variant="h6">
                {profile?.role === 'teacher' ? 'Преподаватель' : 
                 profile?.role === 'student' ? 'Студент' : 
                 profile?.role === 'admin' ? 'Администратор' : 'Пользователь'}
              </Typography>
            </Grid>
            <Grid item>
              <Button 
                variant="contained" 
                color="secondary" 
                startIcon={editing ? <CloseIcon /> : <EditIcon />}
                onClick={handleEditToggle}
                disabled={loading}
              >
                {editing ? 'Отменить' : 'Редактировать'}
              </Button>
            </Grid>
          </Grid>
        </ProfileHeader>
        
        <Box sx={{ p: 4 }}>
          {editing ? (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Имя"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Фамилия"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="О себе"
                    name="bio"
                    multiline
                    rows={4}
                    value={formData.bio}
                    onChange={handleInputChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Фото профиля
                  </Typography>
                  <input
                    accept="image/*"
                    id="profile-picture-upload"
                    type="file"
                    onChange={handleFileChange}
                    style={{ marginBottom: 16 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={handleEditToggle}
                      disabled={loading}
                    >
                      Отмена
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={<SaveIcon />}
                      disabled={loading}
                    >
                      {loading ? 'Сохранение...' : 'Сохранить изменения'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          ) : (
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      Личная информация
                    </Typography>
                    <Box sx={{ mt: 3 }}>
                      <InfoItem 
                        icon={<PersonIcon />} 
                        label="Имя пользователя" 
                        value={profile?.user?.username} 
                      />
                      <InfoItem 
                        icon={<BadgeIcon />} 
                        label="Полное имя" 
                        value={profile?.user?.first_name && profile?.user?.last_name 
                          ? `${profile.user.first_name} ${profile.user.last_name}`
                          : 'Не указано'} 
                      />
                      <InfoItem 
                        icon={<EmailIcon />} 
                        label="Email" 
                        value={profile?.user?.email} 
                      />
                      <InfoItem 
                        icon={<DateRangeIcon />} 
                        label="Дата регистрации" 
                        value="Информация недоступна" 
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      О себе
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 3 }}>
                      {profile?.bio || 'Информация не заполнена'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </Box>
      </Paper>
      
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

export default Profile; 