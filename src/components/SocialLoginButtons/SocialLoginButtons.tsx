import React, { useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleActionButton from "./GoogleActionButton";
// import FacebookLogin from "react-facebook-login";
// import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
// import { checkSocialUserAPI } from "../../store/slices/authSlice";
// import { useAppDispatch } from "../../store";
// import { ReactComponent as FacebookIcon } from "../../images/Facebook-sginup.svg";
// import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// const googleClientId =
//   "699254002820-04s6pu7ju7hpsfj00p2d4mprr2d82ddn.apps.googleusercontent.com";
const googleClientId = "671836193303-1birniae3tqs9juo2mlmt3pmjavic3i4.apps.googleusercontent.com"; //stack
  
// const googleClientId =
//   "5064197760-huedfh96cnautjk5fkopvciu4qcf3n1e.apps.googleusercontent.com";

// const facebookApiId = "901275766694380";
// import FacebookLogin from 'react-facebook-login';

interface SocialLoginButtonsProps {
  closeModel?: any;
  navigateUserSocial?: any;
  isSignUp?: any;
  role?: any;
}
const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = (props) => {
  const { closeModel, navigateUserSocial, isSignUp,  role } =
    props;
  const dispatch = useDispatch();

  const responseFacebook = async (profile: any) => {
    // if (profile?.id) {
    //   const [first_name, last_name] = profile.name.split(/\s/);
    //   const body = {
    //     email: profile?.email,
    //     external_Identifier: profile?.id,
    //     external_Display_Identifier: "facebook",
    //     oAuthToken: profile?.accessToken,
    //     provider_SystemName: "FaceBook",
    //     firstName: first_name,
    //     lastName: last_name,
    //     roleCode: role?.roleCode || "GU",
    //     facebookuserID: profile?.userID,
    //   };
    //   closeModel();
    //   showPageLoader();
    //   const resp = (await dispatch(checkSocialUserAPI(body))) as any;
    //   navigateUserSocial(resp?.payload);
    //   closeModel();
    // }
  };
  const componentClicked = (response: any) => {};
  return (
    <>
      <div className="d-flex">
        <div className="col-6 social-btn1">
          <div id="mySigninButton"></div>

          <GoogleOAuthProvider clientId={googleClientId}>
            <GoogleActionButton
              closeModel={closeModel}
              isSignUp={isSignUp}
              navigateUserSocial={navigateUserSocial}
              role={role}
            />
          </GoogleOAuthProvider>
        </div>
      </div>
    </>
  );
};

export default SocialLoginButtons;
