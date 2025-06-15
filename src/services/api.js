import axios from 'axios';

// Create axios instance with base URL
const API_URL = 'http://localhost:8000/api/';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Обработка истекшего токена
    if (error.response && error.response.status === 401) {
      // Если токен истек, пытаемся обновить
      if (error.config.url !== '/api/token/refresh/') {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (refreshToken) {
          return axios.post('/api/token/refresh/', { refresh: refreshToken })
            .then(response => {
              localStorage.setItem('token', response.data.access);
              
              // Повторяем оригинальный запрос с новым токеном
              error.config.headers['Authorization'] = `Bearer ${response.data.access}`;
              return axios(error.config);
            })
            .catch(refreshError => {
              // Если не удалось обновить токен, выходим
              authService.logout();
              window.location.reload();
              return Promise.reject(refreshError);
            });
        }
      }
      
      // Если нет токена обновления, выходим
      authService.logout();
    }
    
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: (email, password) => {
    return api.post('token/', { username: email, password })
      .then(response => {
        localStorage.setItem('token', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
        return response;
      });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

// User services
export const userService = {
  getProfile: () => {
    return api.get('profiles/my_profile/');
  },
  updateProfile: (profileData) => {
    return api.patch('profiles/my_profile/', profileData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  updateUser: (id, userData) => {
    return api.patch(`users/${id}/`, userData);
  },
  getSettings: () => {
    return api.get('settings/my_settings/');
  },
  updateSettings: (settingsData) => {
    return api.put('settings/update_settings/', settingsData);
  },
  getNotifications: () => {
    return api.get('notifications/');
  },
  getUnreadNotifications: () => {
    return api.get('notifications/unread/');
  },
  markNotificationRead: (id) => {
    return api.post(`notifications/${id}/mark_read/`);
  },
  markAllNotificationsRead: () => {
    return api.post('notifications/mark_all_read/');
  }
};

// Course services
export const courseService = {
  getAllCourses: () => {
    return api.get('courses/');
  },
  getMyCourses: () => {
    return api.get('courses/my_courses/');
  },
  getCourseById: (id) => {
    return api.get(`courses/${id}/`);
  },
  createCourse: (courseData) => {
    return api.post('courses/', courseData);
  },
  updateCourse: (id, courseData) => {
    return api.put(`courses/${id}/`, courseData);
  },
  deleteCourse: (id) => {
    return api.delete(`courses/${id}/`);
  },
  enrollStudents: (courseId, studentIds) => {
    return api.post(`courses/${courseId}/enroll_students/`, { student_ids: studentIds });
  },
  removeStudents: (courseId, studentIds) => {
    return api.post(`courses/${courseId}/remove_students/`, { student_ids: studentIds });
  },
};

// Lesson services
export const lessonService = {
  getLessons: (courseId = null) => {
    const params = courseId ? { course_id: courseId } : {};
    return api.get('lessons/', { params });
  },
  getLessonById: (id) => {
    return api.get(`lessons/${id}/`);
  },
  createLesson: (lessonData) => {
    return api.post('lessons/', lessonData);
  },
  updateLesson: (id, lessonData) => {
    return api.put(`lessons/${id}/`, lessonData);
  },
  deleteLesson: (id) => {
    return api.delete(`lessons/${id}/`);
  },
};

// Material services
export const materialService = {
  getMaterials: (courseId = null, lessonId = null) => {
    const params = {};
    if (courseId) params.course_id = courseId;
    if (lessonId) params.lesson_id = lessonId;
    return api.get('materials/', { params });
  },
  getMaterialById: (id) => {
    return api.get(`materials/${id}/`);
  },
  createMaterial: (materialData) => {
    const formData = new FormData();
    
    // Handle file upload
    if (materialData.file) {
      formData.append('file', materialData.file);
    }
    
    // Add other fields
    Object.keys(materialData).forEach(key => {
      if (key !== 'file') {
        formData.append(key, materialData[key]);
      }
    });
    
    return api.post('materials/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  updateMaterial: (id, materialData) => {
    const formData = new FormData();
    
    // Handle file upload
    if (materialData.file) {
      formData.append('file', materialData.file);
    }
    
    // Add other fields
    Object.keys(materialData).forEach(key => {
      if (key !== 'file') {
        formData.append(key, materialData[key]);
      }
    });
    
    return api.put(`materials/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteMaterial: (id) => {
    return api.delete(`materials/${id}/`);
  },
};

// Assignment services
export const assignmentService = {
  getAssignments: (courseId = null, lessonId = null) => {
    const params = {};
    if (courseId) params.course_id = courseId;
    if (lessonId) params.lesson_id = lessonId;
    return api.get('assignments/', { params });
  },
  getAssignmentById: (id) => {
    return api.get(`assignments/${id}/`);
  },
  createAssignment: (assignmentData) => {
    const formData = new FormData();
    
    // Handle file upload
    if (assignmentData.file) {
      formData.append('file', assignmentData.file);
    }
    
    // Add other fields
    Object.keys(assignmentData).forEach(key => {
      if (key !== 'file') {
        formData.append(key, assignmentData[key]);
      }
    });
    
    return api.post('assignments/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  updateAssignment: (id, assignmentData) => {
    const formData = new FormData();
    
    // Handle file upload
    if (assignmentData.file) {
      formData.append('file', assignmentData.file);
    }
    
    // Add other fields
    Object.keys(assignmentData).forEach(key => {
      if (key !== 'file') {
        formData.append(key, assignmentData[key]);
      }
    });
    
    return api.put(`assignments/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteAssignment: (id) => {
    return api.delete(`assignments/${id}/`);
  },
};

// Submission services
export const submissionService = {
  getSubmissions: (assignmentId = null) => {
    const params = assignmentId ? { assignment_id: assignmentId } : {};
    return api.get('submissions/', { params });
  },
  getSubmissionById: (id) => {
    return api.get(`submissions/${id}/`);
  },
  createSubmission: (submissionData) => {
    const formData = new FormData();
    
    // Handle file upload
    if (submissionData.file) {
      formData.append('file', submissionData.file);
    }
    
    // Add other fields
    Object.keys(submissionData).forEach(key => {
      if (key !== 'file') {
        formData.append(key, submissionData[key]);
      }
    });
    
    return api.post('submissions/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  gradeSubmission: (id, score, feedback = '') => {
    return api.post(`submissions/${id}/grade/`, { score, feedback });
  },
};

// Test services
export const testService = {
  getTests: (courseId = null, lessonId = null) => {
    const params = {};
    if (courseId) params.course_id = courseId;
    if (lessonId) params.lesson_id = lessonId;
    return api.get('tests/', { params });
  },
  getTestById: (id) => {
    return api.get(`tests/${id}/`);
  },
  createTest: (testData) => {
    return api.post('tests/', testData);
  },
  updateTest: (id, testData) => {
    return api.put(`tests/${id}/`, testData);
  },
  deleteTest: (id) => {
    return api.delete(`tests/${id}/`);
  },
};

// Question services
export const questionService = {
  getQuestions: (testId) => {
    return api.get('questions/', { params: { test_id: testId } });
  },
  createQuestion: (questionData) => {
    return api.post('questions/', questionData);
  },
  updateQuestion: (id, questionData) => {
    return api.put(`questions/${id}/`, questionData);
  },
  deleteQuestion: (id) => {
    return api.delete(`questions/${id}/`);
  },
};

// Answer services
export const answerService = {
  getAnswers: (questionId) => {
    return api.get('answers/', { params: { question_id: questionId } });
  },
  createAnswer: (answerData) => {
    return api.post('answers/', answerData);
  },
  updateAnswer: (id, answerData) => {
    return api.put(`answers/${id}/`, answerData);
  },
  deleteAnswer: (id) => {
    return api.delete(`answers/${id}/`);
  },
};

// Test Result services
export const testResultService = {
  getTestResults: (testId = null) => {
    const params = testId ? { test_id: testId } : {};
    return api.get('test-results/', { params });
  },
  createTestResult: (resultData) => {
    return api.post('test-results/', resultData);
  },
};

// Attendance services
export const attendanceService = {
  getAttendance: (lessonId = null, studentId = null, date = null) => {
    const params = {};
    if (lessonId) params.lesson_id = lessonId;
    if (studentId) params.student_id = studentId;
    if (date) params.date = date;
    return api.get('attendance/', { params });
  },
  markAttendance: (lessonId, date, attendanceData) => {
    return api.post('attendance/mark_attendance/', {
      lesson_id: lessonId,
      date,
      attendance: attendanceData
    });
  },
};

export default api; 