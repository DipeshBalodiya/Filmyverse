
import React, { useState } from 'react'
import { TailSpin } from 'react-loader-spinner';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import swal from 'sweetalert';
import app from '../firebase/firebase';
import { addDoc } from 'firebase/firestore';
import { usersRef } from '../firebase/firebase';
import bcrypy from 'bcryptjs';


const auth = getAuth(app);

const Signup = () => {
  const [form, setForm] = useState({
    name: '',
    mobile: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [otpSent, serOtpSent] = useState(false);
  const [OTP, setOTP] = useState("");

  const genereateRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: (response) => {
      }
    },);
  }

  const requestOtp = () => {
    setLoading(true);
    genereateRecaptcha();
    let appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, `+91${form.mobile}`, appVerifier)
      .then(confirmationResult => {
        window.confirmationResult = confirmationResult;
        swal({
          text: "OTP sent",
          icon: 'success',
          button: false,
          timer: 3000,
        });
        serOtpSent(true);
        setLoading(false)
      }).catch((error) => {
        console.log(error)
      })
  }
  const helper = useNavigate();
  const verifyOTP = () => {
    try {
      setLoading(true);
      window.confirmationResult.confirm(OTP).then((result) => {
        uploadData();
        swal({
          text: "Sucessfully Registere",
          icon: 'success',
          buttons: false,
          timer: 3000,
        });
        helper('/login')
        setLoading(false);
      })
    } catch (error) {
      console.log(error);
    }
  }

  const uploadData = async () => {
    try {
      const salt = bcrypy.genSaltSync(10);
      var harh = bcrypy.hashSync(form.password, salt);
      await addDoc(usersRef, {
        name: form.name,
        password: harh,
        mobile: form.mobile,
      });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className='w-full flex flex-col mt-12 items-center'>
      {otpSent ?
        <>
          <h1 className='text-xl font-bold'>Sign Up</h1>
          <div class="relative">
            <label for="message" class="leading-7 text-sm text-gray-300">
              OTP
            </label>
            <input
              id="message"
              name="message"
              value={OTP}
              onChange={(e) => setOTP(e.target.value)}
              class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <div class="p-2 w-full">
            <button
              onClick={verifyOTP}
              class="flex mx-auto text-white bg-green-500 border-0 py-2 px-8 focus:outline-none hover:bg-green-700 rounded text-lg">
              {loading ? <TailSpin height={25} color='white' /> : 'Confirm OTP'}
            </button>
          </div>
        </>
        :
        <>
          <h1 className='text-xl font-bold'>Sign Up</h1>
          <div class="p-2 w-1/2 md:w-1/3">
            <div class="relative">
              <label for="message" class="leading-7 text-sm text-gray-300">
                Name
              </label>
              <input
                id="message"
                name="message"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div class="relative">
              <label for="message" class="leading-7 text-sm text-gray-300">
                Mobile No.
              </label>
              <input
                type={'number'}
                id="message"
                name="message"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div class="relative">
              <label for="message" class="leading-7 text-sm text-gray-300">
                Password
              </label>
              <input
                type={"password"}
                id="message"
                name="message"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div class="p-2 w-full">
              <button
                onClick={requestOtp}
                class="flex mx-auto text-white bg-green-500 border-0 py-2 px-8 focus:outline-none hover:bg-green-700 rounded text-lg">
                {loading ? <TailSpin height={25} color='white' /> : 'Request OTP'}
              </button>
            </div>
          </div>
        </>
      }
      <div className='flex items-center'>
        <p>Already have an account? <Link to={'/login'}><span className='text-blue-500'>Login</span></Link></p>
      </div>
      <div id='recaptcha-container'></div>
    </div>
  )
}

export default Signup;