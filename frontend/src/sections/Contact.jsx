// import { useDarkMode } from '../components/DarkModeContext';
// import AOS from 'aos';
// import 'aos/dist/aos.css';
// import { useEffect, useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import React from 'react';
// const Contact = () => {
//   const { darkMode } = useDarkMode();
//   const { user } = useAuth(); // Get logged-in user from context

//   const [formData, setFormData] = useState({
//     fullname: '',
//     email: '',
//     phone: '',
//     message: '',
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   useEffect(() => {
//     AOS.init({
//       offset: 200,
//       duration: 800,
//       easing: 'ease-in-sine',
//       delay: 100,
//     });
//   }, []);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   setError('');
//   setSuccess('');

//   if (!user) {
//     setError('Please login first to send a message.');
//     return;
//   }

//   setLoading(true);

//   try {
//     const res = await fetch('http://localhost:8080/api/contact', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${user?.accessToken}`, // use token from login response
//       },
//       credentials: 'include',
//       body: JSON.stringify(formData),
//     });

//     const data = await res.json();

//     if (res.ok) {
//       setSuccess(data.message || 'Message sent successfully!');
//       setFormData({ fullname: '', email: '', phone: '', message: '' });
//     } else {
//       setError(data.message || 'Failed to send message');
//     }
//   } catch (err) {
//     setError(err.message);
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} pb-20`}>
//       <section
//         id='contact'
//         className={`${darkMode ? 'bg-gray-900' : 'bg-red-100'} lg:w-[95%] w-full h-fit m-auto rounded-xl grid lg:grid-cols-2 grid-cols-1 justify-center items-center lg:px-36 px-6 py-20 gap-10`}
//       >
//         {/* Contact Form */}
//         <div
//           data-aos='zoom-in'
//           className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} p-10 flex flex-col justify-center items-center gap-6 rounded-xl w-full text-center`}
//         >
//           <h1 className={`${darkMode ? 'text-white' : 'text-black'} text-3xl font-bold mb-4`}>
//             Send a message today
//           </h1>

//           {error && <p className='text-red-500 text-sm'>{error}</p>}
//           {success && <p className='text-green-500 text-sm'>{success}</p>}

//           <form onSubmit={handleSubmit} className='w-full space-y-4'>
//             <input
//               type='text'
//               name='fullname'
//               placeholder='Enter your full name here'
//               value={formData.fullname}
//               onChange={handleChange}
//               required
//               className='w-full px-6 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-red-500'
//             />
//             <input
//               type='email'
//               name='email'
//               placeholder='Enter your valid email'
//               value={formData.email}
//               onChange={handleChange}
//               required
//               className='w-full px-6 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-red-500'
//             />
//             <input
//               type='text'
//               name='phone'
//               placeholder='Enter your valid mobile number'
//               value={formData.phone}
//               onChange={handleChange}
//               required
//               className='w-full px-6 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-red-500'
//             />
//             <textarea
//               name='message'
//               placeholder='Enter your message here....'
//               value={formData.message}
//               onChange={handleChange}
//               required
//               className='w-full px-6 py-3 border-2 border-gray-300 rounded-xl resize-none focus:outline-none focus:border-red-500'
//               rows='5'
//             ></textarea>

//             <button
//               type='submit'
//               disabled={loading}
//               className={`w-full text-lg py-4 px-8 rounded-xl font-semibold transition-colors ${
//                 darkMode
//                   ? 'bg-red-600 hover:bg-black text-white'
//                   : 'bg-red-500 hover:bg-black text-white'
//               }`}
//             >
//               {loading ? 'Sending...' : 'SEND MESSAGE'}
//             </button>
//           </form>
//         </div>

//         {/* Right Column */}
//         <div className='flex flex-col justify-center items-start gap-8 lg:p-10 p-6'>
//           <h1
//             data-aos='zoom-in'
//             data-aos-delay='200'
//             className={`text-2xl font-bold ${darkMode ? 'text-red-500' : 'text-red-600'}`}
//           >
//             REACH US
//           </h1>
//           <h1
//             data-aos='zoom-in'
//             data-aos-delay='200'
//             className={`text-4xl font-semibold leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}
//           >
//             Get in touch with us today and our team will assist you
//           </h1>
//           <p
//             data-aos='zoom-in'
//             data-aos-delay='200'
//             className={`text-xl leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}
//           >
//             Our experts and developers would love to contribute their expertise and
//             insights and help you today. Contact us to help you plan your next
//             transaction, either buying or selling a home.
//           </p>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Contact;
import { useDarkMode } from '../components/DarkModeContext';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import React from 'react';

const Contact = () => {
  const { darkMode } = useDarkMode();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Pre-fill user data if available
  useEffect(() => {
    if (user) {
      console.log('User object:', user); // Debug: Check user object
      setFormData(prev => ({
        ...prev,
        fullname: user.fullname || user.username || user.name || user.displayName || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  useEffect(() => {
    AOS.init({
      offset: 200,
      duration: 800,
      easing: 'ease-in-sine',
      delay: 100,
    });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error || success) {
      setError('');
      setSuccess('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user) {
      setError('Please login first to send a message.');
      return;
    }

    // Additional validation
    if (!formData.fullname.trim() || !formData.message.trim()) {
      setError('Full name and message are required.');
      return;
    }

    if (!formData.email.trim()) {
      setError('Email is required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      // Get token from various possible locations in user object
      const token = user.accessToken || user.token || user.jwtToken;
      console.log('Sending request with token:', token); // Debug token

      if (!token) {
        setError('Authentication token not found. Please login again.');
        setLoading(false);
        return;
      }

      const res = await fetch('http://localhost:8080/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      console.log('Response status:', res.status); // Debug response status

      const data = await res.json();
      console.log('Response data:', data); // Debug response data

      if (res.ok) {
        setSuccess(data.message || 'Message sent successfully! Our team will get back to you soon.');
        setFormData({ 
          fullname: user?.fullname || user?.username || user?.name || user?.displayName || '', 
          email: user?.email || '', 
          phone: '', 
          message: '' 
        });
        
        setTimeout(() => {
          setSuccess('');
        }, 5000);
      } else {
        // More specific error handling
        if (res.status === 401) {
          setError('Session expired. Please login again.');
        } else if (res.status === 403) {
          setError('You do not have permission to perform this action.');
        } else {
          setError(data.message || `Failed to send message. Status: ${res.status}`);
        }
      }
    } catch (err) {
      console.error('Contact form error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} min-h-screen py-8`}>
      <section
        id='contact'
        className={`${darkMode ? 'bg-gray-800' : 'bg-red-50'} lg:w-[95%] w-full h-fit mx-auto rounded-xl grid lg:grid-cols-2 grid-cols-1 justify-center items-center lg:px-12 px-6 py-12 gap-8 shadow-lg`}
      >
        {/* Contact Form */}
        <div
          data-aos='zoom-in'
          className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-8 flex flex-col justify-center items-center gap-6 rounded-xl w-full shadow-md`}
        >
          <div className="text-center mb-4">
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
              Send a Message
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {user ? `Logged in as ${user.email}` : 'Please login to send a message'}
            </p>
            {/* Debug info - remove in production */}
            {user && (
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                Token: {user.accessToken ? 'Present' : 'Missing'}
              </p>
            )}
          </div>

          {/* Status Messages */}
          {error && (
            <div className="w-full p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="w-full p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className='w-full space-y-4'>
            <div>
              <input
                type='text'
                name='fullname'
                placeholder='Enter your full name'
                value={formData.fullname}
                onChange={handleChange}
                required
                disabled={loading}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 focus:border-red-500 text-white' 
                    : 'bg-white border-gray-300 focus:border-red-500 text-gray-900'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
            </div>
            
            <div>
              <input
                type='email'
                name='email'
                placeholder='Enter your email address'
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 focus:border-red-500 text-white' 
                    : 'bg-white border-gray-300 focus:border-red-500 text-gray-900'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
            </div>
            
            <div>
              <input
                type='tel'
                name='phone'
                placeholder='Enter your phone number (optional)'
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 focus:border-red-500 text-white' 
                    : 'bg-white border-gray-300 focus:border-red-500 text-gray-900'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
            </div>
            
            <div>
              <textarea
                name='message'
                placeholder='Enter your message here...'
                value={formData.message}
                onChange={handleChange}
                required
                disabled={loading}
                rows='5'
                className={`w-full px-4 py-3 border-2 rounded-xl resize-none focus:outline-none transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 focus:border-red-500 text-white' 
                    : 'bg-white border-gray-300 focus:border-red-500 text-gray-900'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              ></textarea>
            </div>

            <button
              type='submit'
              disabled={loading || !user}
              className={`w-full py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
                !user 
                  ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                  : darkMode
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white'
              } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : !user ? (
                'PLEASE LOGIN TO SEND MESSAGE'
              ) : (
                'SEND MESSAGE'
              )}
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className='flex flex-col justify-center items-start gap-8 lg:p-8 p-4'>
          <h1
            data-aos='zoom-in'
            data-aos-delay='200'
            className={`text-2xl font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}
          >
            GET IN TOUCH
          </h1>
          
          <h1
            data-aos='zoom-in'
            data-aos-delay='200'
            className={`text-4xl font-bold leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}
          >
            Contact Us Today
          </h1>
          
          <p
            data-aos='zoom-in'
            data-aos-delay='200'
            className={`text-lg leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Our team of experts is ready to assist you with any questions or concerns. 
            We're committed to providing you with the best service and support.
          </p>

          <div className="space-y-4 w-full">
            <div data-aos='fade-right' data-aos-delay='300' className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-red-500' : 'bg-red-100'}`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Phone Support</h3>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Available 24/7</p>
              </div>
            </div>

            <div data-aos='fade-right' data-aos-delay='400' className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-red-500' : 'bg-red-100'}`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Email Support</h3>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Quick response guaranteed</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;