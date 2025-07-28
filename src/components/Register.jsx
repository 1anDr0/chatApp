import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  return (
    <div>
      <nav>
        <img src="logo1.png" alt="Buzz Logo" />
      </nav>
      <div className="form-wrapper">
        <h2>Sign Up</h2>
        <form>
          <div className="form-control">
            <input type="text" required />
            <label>Username</label>
          </div>
          <div className="form-control">
            <input type="text" required />
            <label>Password</label>
          </div>
          <div className="form-control">
            <input type="text" required />
            <label>Firstname</label>
          </div>
          <div className="form-control">
            <input type="text" required />
            <label>Lastname</label>
          </div>
          <div className="form-control">
            <input type="text" required />
            <label>Email</label>
          </div>
          <button>Sign Up To Buzz</button>
          <p>Already have an account?</p>
          <button
            id="signinhere"
            type="button"
            onClick={() => navigate("/")}
            className="signup-link"
          >
            Sign in here
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
