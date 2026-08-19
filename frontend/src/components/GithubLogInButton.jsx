function GitHubLogInButton() {
  const handleGitHubLogin = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/github`;
    const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read:user user:email`;

    window.location.href = githubUrl;
  };

  return (
    <div>
      <button
        onClick={handleGitHubLogin}
        className="github-btn"
        aria-label="Log in via Github"
      >
        <img
          src="https://www.svgrepo.com/show/394174/github.svg"
          alt="Github logo"
        />
      </button>
    </div>
  );
}

export default GitHubLogInButton;
