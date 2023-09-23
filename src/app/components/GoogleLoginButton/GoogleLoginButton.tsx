import "./GoogleLoginButton.css";

interface GoogleLoginButtonProps {
  handleClick: Function;
}

function GoogleLoginButton({ handleClick }: GoogleLoginButtonProps) {
  return (
    <>
      <div onClick={() => handleClick()} className="login-with-google-btn">
        Login with Google
      </div>
    </>
  );
}

export default GoogleLoginButton;
