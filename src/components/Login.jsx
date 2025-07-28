import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div>
      <nav>
        <img src="logo1.png" alt="Buzz Logo" />
      </nav>
      <div className="form-wrapper">
        <h2>Sign In</h2>
        <form>
          <div className="form-control">
            <input type="text" required />
            <label>Username or Email</label>
          </div>
          <div className="form-control">
            <input type="text" required />
            <label>Password</label>
          </div>
          <button>Sign In To Buzz</button>
          <div className="form-help">
            <div class="remember-me">
              <input type="checkbox" />
              <label>Remember me</label>
            </div>
          </div>
          <p className="signup-text">
            New to Buzz?
            <span className="link" onClick={() => navigate("/Register")}>
              Sign up now
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
