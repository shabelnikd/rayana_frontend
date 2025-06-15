import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Badge from '@mui/material/Badge';
import Popover from '@mui/material/Popover';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

// API services
import { userService, authService } from '../../services/api';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import SchoolIcon from '@mui/icons-material/School';

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const open = Boolean(anchorEl);
  const notificationsOpen = Boolean(notificationsAnchorEl);

  useEffect(() => {
    // Получаем данные профиля пользователя
    const fetchUserProfile = async () => {
      try {
        const response = await userService.getProfile();
        setUserProfile(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке профиля:', error);
        setLoading(false);
      }
    };

    // Получаем уведомления
    const fetchNotifications = async () => {
      try {
        const response = await userService.getUnreadNotifications();
        setNotifications(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке уведомлений:', error);
      }
    };

    fetchUserProfile();
    fetchNotifications();

    // Обновляем уведомления каждые 60 секунд
    const interval = setInterval(() => {
      fetchNotifications();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsClick = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    authService.logout();
    onLogout();
  };

  const handleProfileClick = () => {
    handleClose();
    navigate('/profile');
  };

  const handleSettingsClick = () => {
    handleClose();
    navigate('/settings');
  };

  const handleMarkAllRead = async () => {
    try {
      await userService.markAllNotificationsRead();
      setNotifications([]);
    } catch (error) {
      console.error('Ошибка при отметке уведомлений:', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      await userService.markNotificationRead(notification.id);
      setNotifications(notifications.filter(n => n.id !== notification.id));
      
      if (notification.link) {
        navigate(notification.link);
      }
    } catch (error) {
      console.error('Ошибка при отметке уведомления:', error);
    }
    handleNotificationsClose();
  };

  const getInitials = (user) => {
    if (!user) return 'U';
    return user.first_name && user.last_name 
      ? `${user.first_name[0]}${user.last_name[0]}`
      : user.username[0];
  };

  const getNotificationColor = (type) => {
    switch(type) {
      case 'success': return 'success.main';
      case 'error': return 'error.main';
      case 'warning': return 'warning.main';
      default: return 'info.main';
    }
  };

  return (
    <AppBar position="fixed" elevation={1} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo/Brand */}
        <SchoolIcon sx={{ mr: 1 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          Система Управления Обучением
        </Typography>

        {/* Notification Icon */}
        <IconButton 
          color="inherit" 
          sx={{ mr: 1 }}
          onClick={handleNotificationsClick}
        >
          <Badge badgeContent={notifications.length} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        {/* Notifications Menu */}
        <Popover
          id="notifications-menu"
          open={notificationsOpen}
          anchorEl={notificationsAnchorEl}
          onClose={handleNotificationsClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: { width: 320, maxHeight: 400 }
          }}
        >
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Уведомления</Typography>
            {notifications.length > 0 && (
              <Button size="small" onClick={handleMarkAllRead}>
                Отметить все как прочитанные
              </Button>
            )}
          </Box>
          <Divider />
          <List sx={{ pt: 0 }}>
            {notifications.length === 0 ? (
              <ListItem>
                <ListItemText primary="Нет новых уведомлений" />
              </ListItem>
            ) : (
              notifications.map((notification) => (
                <ListItem key={notification.id} disablePadding>
                  <ListItemButton onClick={() => handleNotificationClick(notification)}>
                    <ListItemIcon>
                      <Box 
                        sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%', 
                          bgcolor: getNotificationColor(notification.notification_type),
                          mr: 1
                        }} 
                      />
                    </ListItemIcon>
                    <ListItemText 
                      primary={notification.title} 
                      secondary={notification.message}
                      primaryTypographyProps={{ fontWeight: 'medium' }}
                      secondaryTypographyProps={{ 
                        sx: { 
                          textOverflow: 'ellipsis', 
                          overflow: 'hidden', 
                          whiteSpace: 'nowrap' 
                        } 
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))
            )}
          </List>
        </Popover>

        {/* User Menu */}
        <Button
          color="inherit"
          onClick={handleClick}
          startIcon={
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
              {loading ? 'U' : getInitials(userProfile?.user)}
            </Avatar>
          }
          endIcon={open ? null : null}
        >
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            {loading ? 'Загрузка...' : userProfile?.user?.username || 'Пользователь'}
          </Box>
        </Button>

        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleProfileClick}>
            <ListItemIcon>
              <AccountCircleIcon fontSize="small" />
            </ListItemIcon>
            Мой профиль
          </MenuItem>
          <MenuItem onClick={handleSettingsClick}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            Настройки
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Выйти
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 