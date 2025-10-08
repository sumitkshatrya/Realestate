// import { useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { useDarkMode } from './DarkModeContext';
// import aboutImage from '../assets/images/about.jpg';

// const SignupForm = ({ onClose, switchToLogin }) => {
//   const { darkMode } = useDarkMode();
//   const { signup } = useAuth();
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     verificationMethod: ''
//   });
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setError('');

//     if (!formData.name || !formData.email || !formData.password) {
//       setError('Please fill in all fields');
//       return;
//     }

//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }

//     if (formData.password.length < 6) {
//       setError('Password must be at least 6 characters long');
//       return;
//     }

//     const newUser = {
//       id: Date.now(),
//       name: formData.name,
//       email: formData.email
//     };

//     signup(newUser);
//     onClose();
//   };

//   return (
//     <div 
//       className="fixed inset-0 flex items-center justify-center z-50 p-4"
//       style={{
//         backgroundImage: `url(${aboutImage})`,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         backgroundRepeat: 'no-repeat',
//         backgroundColor: '#1f2937'
//       }}
//     >
     
//       <div className="absolute inset-0 bg-opacity-30"></div>
      
//       <div className={`relative w-full max-w-md rounded-xl shadow-2xl ${
//         darkMode ? 'bg-gray-900 bg-opacity-95 text-white' : 'bg-white bg-opacity-98 text-gray-900'
//       } backdrop-blur-sm`}>
//         <button
//           onClick={onClose}
//           className={`absolute top-4 right-4 p-2 rounded-full z-10 transition-colors duration-200 ${
//             darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-200 text-gray-700'
//           }`}
//         >
//           ×
//         </button>

//         <div className="p-8">
//           <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
//             Create Your Account
//           </h2>
          
//           {error && (
//             <div className={`p-3 rounded-lg mb-6 ${
//               darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700'
//             }`}>
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label className="block text-sm font-semibold mb-3">Full Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
//                   darkMode 
//                     ? 'bg-gray-800 border-gray-700 text-white focus:border-red-500' 
//                     : 'bg-white border-gray-300 text-gray-900 focus:border-red-500'
//                 }`}
//                 placeholder="Enter your full name"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold mb-3">Email Address</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
//                   darkMode 
//                     ? 'bg-gray-800 border-gray-700 text-white focus:border-red-500' 
//                     : 'bg-white border-gray-300 text-gray-900 focus:border-red-500'
//                 }`}
//                 placeholder="Enter your email"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold mb-3">Password</label>
//               <input
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
//                   darkMode 
//                     ? 'bg-gray-800 border-gray-700 text-white focus:border-red-500' 
//                     : 'bg-white border-gray-300 text-gray-900 focus:border-red-500'
//                 }`}
//                 placeholder="Enter your password (min. 6 characters)"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold mb-3">Confirm Password</label>
//               <input
//                 type="password"
//                 name="confirmPassword"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
//                   darkMode 
//                     ? 'bg-gray-800 border-gray-700 text-white focus:border-red-500' 
//                     : 'bg-white border-gray-300 text-gray-900 focus:border-red-500'
//                 }`}
//                 placeholder="Confirm your password"
//               />
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
//             >
//               Create Account
//             </button>
//           </form>

//           <div className="mt-8 text-center">
//             <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//               Already have an account?{' '}
//               <button
//                 onClick={switchToLogin}
//                 className="text-red-500 hover:text-red-600 font-semibold underline transition-colors duration-200"
//               >
//                 Sign in here
//               </button>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignupForm;
import { useState } from "react";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    verificationMethod: "email",
  });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleOtpChange = (e) => setOtp(e.target.value);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");

    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword || !formData.phone) {
      setError("All fields are required"); return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match"); return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) { setStep(2); setSuccess(data.message); }
      else { setError(data.message); }
    } catch (err) { setError(err.message || "Something went wrong"); }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault(); setError(""); setSuccess("");

    if (!otp) { setError("Please enter OTP"); return; }

    try {
      const res = await fetch("http://localhost:8080/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, phone: formData.phone, verificationCode: otp }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(data.message); setStep(1);
        setFormData({ username: "", email: "", password: "", confirmPassword: "", phone: "", verificationMethod: "email" });
        setOtp("");
      } else { setError(data.message); }
    } catch (err) { setError(err.message || "Something went wrong"); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-6 text-gray-900">
        {step === 1 && (
          <form onSubmit={handleRegister} className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-red-600">Create Account</h2>
            {error && <p className="text-red-600">{error}</p>}
            {success && <p className="text-green-600">{success}</p>}

            <input className="w-full border px-3 py-2 rounded" name="username" placeholder="Username" value={formData.username} onChange={handleChange}/>
            <input className="w-full border px-3 py-2 rounded" name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange}/>
            <input className="w-full border px-3 py-2 rounded" name="phone" placeholder="Phone (+919999999999)" value={formData.phone} onChange={handleChange}/>
            <input className="w-full border px-3 py-2 rounded" name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange}/>
            <input className="w-full border px-3 py-2 rounded" name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange}/>

            <select className="w-full border px-3 py-2 rounded" name="verificationMethod" value={formData.verificationMethod} onChange={handleChange}>
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="call">Call</option>
            </select>

            <button className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700" type="submit">Register</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-red-600">Verify OTP</h2>
            {error && <p className="text-red-600">{error}</p>}
            {success && <p className="text-green-600">{success}</p>}

            <input className="w-full border px-3 py-2 rounded" placeholder="Enter OTP" value={otp} onChange={handleOtpChange}/>
            <button className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700" type="submit">Verify OTP</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignupForm;
