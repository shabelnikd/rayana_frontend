import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from 'date-fns/locale';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DownloadIcon from '@mui/icons-material/Download';
import {
  courseService,
  lessonService,
  attendanceService,
} from '../services/api';

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedLesson, setSelectedLesson] = useState('');
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);

  // Загрузка курсов
  useEffect(() => {
    courseService.getAllCourses().then(res => {
      setCourses(res.data);
    });
  }, []);

  // Загрузка уроков при изменении курса или даты
  useEffect(() => {
    if (!selectedCourse) return;
    lessonService.getLessons(selectedCourse).then(res => {
      setLessons(res.data);
      setSelectedLesson(res.data[0]?.id || '');
    });
  }, [selectedCourse, selectedDate]);

  // Загрузка посещаемости при изменении урока или даты
  useEffect(() => {
    if (!selectedLesson) return;
    setLoading(true);
    attendanceService.getAttendance(selectedLesson, null, selectedDate.toISOString().slice(0, 10)).then(attRes => {
      setAttendance(attRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [selectedLesson, selectedDate]);

  // Получить статус посещаемости студента
  const getStudentAttendance = (studentId) => {
    const record = attendance.find(a => a.student === studentId);
    return record ? record.status : 'absent';
  };

  // Получить ФИО студента из attendance
  const getStudentName = (studentId) => {
    const record = attendance.find(a => a.student === studentId);
    return record ? (record.student_name || record.student) : studentId;
  };

  // Отметить посещаемость
  const handleAttendanceChange = (studentId, status) => {
    if (!selectedLesson) return;
    setLoading(true);
    attendanceService.markAttendance(
      selectedLesson,
      selectedDate.toISOString().slice(0, 10),
      [{ student: studentId, status }]
    ).then(() => {
      attendanceService.getAttendance(selectedLesson, null, selectedDate.toISOString().slice(0, 10)).then(attRes => {
        setAttendance(attRes.data);
        setLoading(false);
      });
    }).catch(() => setLoading(false));
  };

  const handleExportReport = () => {
    alert('Экспорт отчёта пока не реализован');
  };

  // Получить список студентов из attendance
  const students = attendance.map(a => ({ id: a.student, name: a.student_name }));

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Посещаемость
        </Typography>
        <Grid container spacing={3}>
          {/* Calendar Section */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <DateCalendar
                value={selectedDate}
                onChange={(newDate) => setSelectedDate(newDate)}
                sx={{ width: '100%' }}
              />
            </Paper>
          </Grid>
          {/* Filters */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Курс</InputLabel>
                  <Select
                    value={selectedCourse}
                    label="Курс"
                    onChange={(e) => setSelectedCourse(e.target.value)}
                  >
                    {courses.map((course) => (
                      <MenuItem key={course.id} value={course.id}>
                        {course.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Урок</InputLabel>
                  <Select
                    value={selectedLesson}
                    label="Урок"
                    onChange={(e) => setSelectedLesson(e.target.value)}
                  >
                    {lessons.map((lesson) => (
                      <MenuItem key={lesson.id} value={lesson.id}>
                        {lesson.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          {/* Attendance Table */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Список студентов</Typography>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={handleExportReport}
                >
                  Экспорт отчета
                </Button>
              </Box>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>ФИО</TableCell>
                        <TableCell>Статус</TableCell>
                        <TableCell>Действия</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>{student.id}</TableCell>
                          <TableCell>{student.name || getStudentName(student.id)}</TableCell>
                          <TableCell>
                            {getStudentAttendance(student.id) === 'present' ? (
                              <Typography color="success.main">Присутствует</Typography>
                            ) : (
                              <Typography color="error.main">Отсутствует</Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Tooltip title="Отметить присутствие">
                              <IconButton
                                color="success"
                                onClick={() => handleAttendanceChange(student.id, 'present')}
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Отметить отсутствие">
                              <IconButton
                                color="error"
                                onClick={() => handleAttendanceChange(student.id, 'absent')}
                              >
                                <CancelIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default Attendance; 