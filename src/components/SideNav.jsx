import { useNavigate } from "react-router-dom";

const SideNav = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("auth");
    // 2) (Valfritt) feedback
    try {
      toast.dismiss(); // stäng ev. öppna toasts
      toast.success("Signed out");
    } catch {}

    // 3) Till login och ersätt historiken (så Back inte går till /chat)
    navigate("/", { replace: true });
  };
  return (
    <aside>
      <img src="logo1.png" alt="Buzz Logo" />
      <button className="signoutbtn" onClick={handleSignOut}>
        Sign out
      </button>
    </aside>
  );
};

export default SideNav;
