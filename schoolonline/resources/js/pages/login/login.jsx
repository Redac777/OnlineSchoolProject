import { useState,useEffect } from 'react';
import schoollogo from '../../../../public/images/schoollogobestqrmbg.png';
import promo from '../../../../public/images/promo.png';
import motdepasse from '../../../../public/images/motdepasse.png';
import etudiantremovebg from '../../../../public/images/etudiantremovebg.png';
import oeil from '../../../../public/images/oeil.png';
import cacher from '../../../../public/images/cacher.png';
import axios from 'axios';
import Spinner from '../components/reusable/spinner';

function Login() {
const [eye,setEye] = useState(true);
const [code,setCode] = useState("");
const [userType,setUserType] = useState("");
const [password,setPassword] = useState("");
const [codeInputColor,setCodeInputColor] = useState("main");
const [showSpinner, setShowSpinner] = useState(false);
const [credentialsInvalid, setCredentialsInvalid] = useState(false);
const [accountDeactivated, setAccountDeactivated] = useState(false);
const [user,setUser] = useState(null);
const [message,setMessage] = useState("");
const handleEyeClick =() => {
  setEye(!eye);
}
const handleCodeChange = (event) => {
  const newValue = event.target.value;

  // Validate the code based on the criteria
  const isValidCode = /^[A-Z]{2}\d{10}$/.test(newValue);

  // Update the code state and input color state
  setCode(newValue);
  setCodeInputColor(isValidCode ? "main" : "red");
};

const handlePasswordChange = (event) => {
    const newPass = event.target.value;
    setPassword(newPass);
}

useEffect(() => {
    if(user){
    if(message=='User is already authenticated'){
        let confirmation = "";
        if(user.lang=="eng"){
            alert("You are already authenticated");
            confirmation = confirm("Would you like to continue to Dashboard ?");}
            else if(user.lang=="fr"){
            alert("Vous vous êtes déjà authentifié");
            confirmation = confirm("Voulez vous continuer vers le panneau de bord ?");
            }
            else {
            alert("لقد قمت بالفعل بالمصادقة");
            confirmation = confirm("هل تريد المتابعة إلى لوحة القيادة؟");
            }
            if(confirmation){
                setCredentialsInvalid(false);
                setShowSpinner(true); // Show the spinner

                setTimeout(() => {
                    // Redirect the user to the "test" component route
                    window.location.href = '/dashboard';
                }, 500);
            }
    }
    else{
        if(user.account==='deactivated')
        {
            axios.get('/logout');
            setShowSpinner(true); // Show the spinner
                setTimeout(() => {
                    // Redirect the user to the "test" component route
                    setAccountDeactivated(true);
                    setShowSpinner(false); // Show the spinner after
                }, 300);

        }
        else {
            setShowSpinner(true); // Show the spinner

                setTimeout(() => {
                    // Redirect the user to the "test" component route
                    window.location.href = '/dashboard';
                }, 500);
            }
    }

}
      }, [user,message]);

const handleLogin = async (e) => {
    e.preventDefault();


    try {
        const response = await axios.post('/api/login', { code, password });
        setCredentialsInvalid(false);
        setAccountDeactivated(false);
        if (response.data.success) {
            setMessage(response.data.message);
            setUser(response.data.user);
        } else {
            setCredentialsInvalid(true);
            console.log('Authentication failed.');
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
};



  return (

  // Start of body
  <body className="w-full h-screen bg-main-bg m-0">
    <div className="relative w-full h-screen">
    {showSpinner && (
            <Spinner/>
        )}

            {/* Start of main part */}
    <div className={`${showSpinner ? 'opacity-40' : ''} flex items-center justify-center md:h-4/5 pt-16`}>

{/* Start of left part */}
<div className="bg-loginLeft h-full rounded-l-xl hidden lg:flex lg:w-1/4  items-center">
  <img src={etudiantremovebg} className="mt-14"/>
</div>
{/* End of left part */}

{/* Start of right part */}
<div className="flex-col bg-main-bg w-full rounded-r-xl p-5 h-full lg:w-1/3 lg:drop-shadow-2xl">

  {/* Start of platform logo */}
  <div className="flex justify-center items-center xl:pt-6">
    <img src={schoollogo} className="w-100 xl:w-200 h-auto"/>
  </div>
  {/* End of platform logo */}

  {/* Start of login form */}
  <form className="mt-14 w-2/3 m-auto flex-col justify-center items-center" onSubmit={handleLogin}>

    {/* Start of code part */}
    <div id="codePart" className="mt-2 xl:mt-4">
      <label for="code" class="flex mb-1 text-xs xl:text-xsm font-semibold  text-gray-700 gap-1">
        <span>
          Code
        </span>
        <span className="text-red-600">
          *
        </span>
      </label>
      <div className="flex items-center">
        <span className="relative z-10 pr-4 pl-2">
          <img src={promo} className="w-4 h-4"/>
        </span>
        <input type="text" value={code} onChange={handleCodeChange} id="first_name" class={`-ml-11 pl-9 ${codeInputColor=="main" ? "focus:outline-gray-400" : "focus:outline-red-500"} focus:outline-gray-400 bg-white ${codeInputColor=="main" ? "outline-gray-200" : "outline -red-500"} text-gray-700 text-xs xl:text-xsm rounded-xl block w-full p-2.5 border `}  required/>
      </div>
    </div>
    {/* End of code part */}

    {/* Start of password part */}
    <div id="passwordPart" className="mt-2 xl:mt-4">
      <label for="code" class="flex mb-1 text-xs xl:text-xsm font-semibold  text-gray-700 gap-1">
        <span>
          Mot de passe
        </span>
        <span className="text-red-600">
          *
        </span>
      </label>
      <div className="flex items-center">
        <span className="relative z-10 pr-4 pl-2">
          <img src={motdepasse} className="w-4 h-4"/>
        </span>
        <input type={eye? "password" : "text"} value={password} onChange={handlePasswordChange} id="first_name" class="-ml-11 pl-9 focus:outline-gray-400 bg-white text-gray-700 text-xs xl:text-xsm rounded-xl block w-full p-2.5 border border-gray-200" required/>
        <span className="relative z-10 -ml-7 lg:-ml-9">
          <img src={eye? cacher : oeil} className="w-4 h-4" onClick={handleEyeClick}/>
        </span>
      </div>
    </div>
    {/* End of code part */}

    {/* Start of Mot de passse oublié ? */}
    <div className="w-full flex justify-end mt-1">
      <a className="text-gray-700 text-3xs lg:text-2xs xl:text-xs font-semibold  underline cursor-pointer">mot de passe oublié ?</a>
    </div>
    {/* End of Mot de passse oublié ? */}

    {/* Start of input submit*/}
    <div className="w-full flex justify-center mt-9 lg:mt-6 xl:mt-8">
      <input type="submit" class="text-gray-900 bg-white hover:bg-gray-700 hover:text-white font-medium rounded-lg text-xs xl:text-xsm px-5 py-2.5 mr-2 mb-2 w-32 cursor-pointer" value="Login"/>
    </div>
    {credentialsInvalid && (<div className="w-full flex justify-center mt-9 lg:mt-6 xl:mt-8">
        <span className="text-xs text-red-500">Credentials invalid !</span>
    </div>)}

    {accountDeactivated && (<div className="w-full flex justify-center mt-9 lg:mt-6 xl:mt-8">
        <span className="text-xs text-red-500">Your account has been deactivated ! </span>
    </div>)}

    {/* End of input submit */}

  </form>
  {/* End of login form */}

</div>
{/* End of right part */}

</div>
{/* End of main part */}

{/* Start of footer part */}
<div className="flex justify-center pt-28 lg:pt-16 xl:pt-20 text-xs xl:text-xsm font-medium gap-1 w-full">
<span className="text-gray-900">© 2023 </span>
<span className="text-footerColor">Online School</span>
<span className="text-gray-900"> All rights reserved.</span>
</div>
{/* End of footer part */}
</div>
  </body>  // End of body
  )
}

export default Login;
