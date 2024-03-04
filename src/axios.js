// import axios from 'axios';

// const baseURL = 'http://127.0.0.1:8000';


// // Add a request interceptor
// axios.interceptors.request.use(function (config) {
//     console.log("request ", config.url);
//     config.url = config.url;
//     // Do something before request is sent
//     const token = localStorage.getItem('accessToken');
//     if (token) {
//         config.headers['Authorization'] = 'JWT ' + token }
//     return config;
// }, function (error) {
//     // Do something with request error
//     console.log("Request error", error);
//     return Promise.reject(error);
// });

// axios.interceptors.response.use(
//     (response) => {
//         return response;
//     },
//     async function (error) {
//         const originalRequest = error.config;

//         if (typeof error.response === 'undefined') {
//         	alert(
//         		'A server/network error occurred. ' +
//         			'Looks like server is not running. ' +
//         			'Please check your server and refresh.'
//         	);
//             window.location.href = '/dashboard';
//         	return Promise.reject(error);
//         }

//         console.log(originalRequest.url, originalRequest.url === baseURL + '/token/refresh');

// 		if (
// 			error.response.status === 401 &&
// 			originalRequest.url === baseURL + '/token/refresh'
// 		) {
//             localStorage.clear();
// 			window.location.href = '/';
// 			return Promise.reject(error);
// 		}

//         if (error.response.data.code === 'token_not_valid' &&
//             error.response.status === 401 &&
//             error.response.statusText === 'Unauthorized') 
//             {
//             const refreshToken = localStorage.getItem('refreshToken');

//             if (refreshToken) {
//                 return axios
//                     .post(baseURL + '/token/refresh', { refresh: refreshToken })
//                     .then((response) => {
//                         localStorage.setItem('accessToken', response.data?.access);

//                         originalRequest.headers.Authorization = 'JWT ' + localStorage.getItem('accessToken');

//                         return axios(originalRequest);
//                     })
//                     .catch((err) => {
//                         console.log(err);
//                     });
//             }else {
//                 console.log('Refresh token not available.');
//                 localStorage.clear();
//                 window.location.href = '/login';
//             }
//         }

//         // specific error handling done elsewhere
//         return Promise.reject(error);
//     }
// );
