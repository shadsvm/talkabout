
const RegisterBox = ({children}) => {
  return (
    <div className='register-box-row row justify-content-center'>
      <div className="register-box-col col-11 col-sm-9 col-md-7 col-lg-6 col-xl-5  shadow">
        {children}
      </div>
    </div>
  )
};

export default RegisterBox;
