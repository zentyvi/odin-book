import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router";
import { githubLogIn } from "../api/functions/auth";
import Loader from "../components/Loader";
import { useAuth } from "../contexts/AuthProvider.jsx";

function GithubLogInPage() {
  const [params] = useSearchParams();
  const code = params.get("code");
  const [loading, setLoading] = useState(Boolean(code));
  const { login } = useAuth();

  useEffect(() => {
    if (!code) {
      return;
    }
    const main = async () => {
      try {
        const result = await githubLogIn(code);
        login(result.token);
      } catch (err) {
        setLoading(false);
        console.error(err);
      }
    };
    main();
  }, [code, login]);

  if (loading) return <Loader />;

  return (
    <main>
      <div>
        <div>
          <h2>Error has occured</h2>
          <p>
            The provided github authorization code is invalid or hasn't been
            provided in the url
          </p>
        </div>
        <div>
          <Link to="/auth/sign-up">Sign up</Link>
          <Link to="/auth/log-in">Log in</Link>
        </div>
      </div>
    </main>
  );
}

export default GithubLogInPage;
