import styles from "../styles/components/GitHubLogInButton.module.css";

function GitHubLogInButton() {
  const handleGitHubLogin = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/github`;
    const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri,
    )}&scope=read:user user:email`;

    window.location.href = githubUrl;
  };

  return (
    <div className={styles["github-btn-wrapper"]}>
      <button
        type="button"
        onClick={handleGitHubLogin}
        className={styles["github-btn"]}
        aria-label="Log in via GitHub"
      >
        <img
          src="https://www.svgrepo.com/show/394174/github.svg"
          alt=""
          aria-hidden="true"
          className={styles["github-btn__icon"]}
        />
        <span className={styles["github-btn__text"]}>Continue with GitHub</span>
      </button>
    </div>
  );
}

export default GitHubLogInButton;
