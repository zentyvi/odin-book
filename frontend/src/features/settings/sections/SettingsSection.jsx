function SettingsSection({ children, title }) {
  return (
    <div>
      <header>
        <div>
          <h3>{title}</h3>
        </div>
      </header>
      {children}
    </div>
  );
}

export default SettingsSection;
