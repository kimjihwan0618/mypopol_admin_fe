import { GoogleLogin } from "react-google-login";
import { gapi } from "gapi-script";
import { useEffect } from 'react';

const GoogleLoginButton = () => {
  const clientId = '758355856653-q79pejj73m2td29ivugqc8osadu2ds2j.apps.googleusercontent.com'

  useEffect(() => {
    window.gapi.load('client:auth2', () => {
      window.gapi.client.init({
        clientId,
        plugin_name: "chat"
      })
    })
  }, []);
  return (
    <>
      <GoogleLogin
        clientId={clientId}
        buttonText="구글아이디 로그인"
        onSuccess={(res) => {
          console.log(res);
        }}
        onFailure={(err) => {
          console.log(err);
        }}
      />
    </>
  );
};

export default GoogleLoginButton