const validateFirstName = (e, setValue, setErrors, field = "firstName") => {
  const { value } = e.target;
  setValue(value);

  if (value.length > 0) {
    const alphaRegex = /^[A-ZА-ЯЁ]+$/i;
    const result = alphaRegex.test(value);
    if (!result) {
      setErrors((prev) => ({
        ...prev,
        [field]: {
          msg: "First name cannot contain special characters and numbers",
        },
      }));
      return;
    }
    if (value.length > 20) {
      setErrors((prev) => ({
        ...prev,
        [field]: { msg: "First name's length cannot exceed 20 characters" },
      }));
      return;
    }
  }
  setErrors((prev) => ({ ...prev, [field]: null }));
};

const validateLastName = (e, setValue, setErrors, field = "lastName") => {
  const { value } = e.target;
  setValue(value);

  if (value.length > 0) {
    const alphaRegex = /^[A-ZА-ЯЁ]+$/i;
    const result = alphaRegex.test(value);
    if (!result) {
      setErrors((prev) => ({
        ...prev,
        [field]: {
          msg: "Last name cannot contain special characters and numbers",
        },
      }));
      return;
    }
    if (value.length > 20) {
      setErrors((prev) => ({
        ...prev,
        [field]: { msg: "Last name's length cannot exceed 20 characters" },
      }));
      return;
    }
  }
  setErrors((prev) => ({ ...prev, [field]: null }));
};

const validateUsername = (e, setValue, setErrors, field = "username") => {
  const { value } = e.target;
  setValue(value);

  if (value.length > 0) {
    const alphaNumericRegex = /^[a-z0-9]+$/i;
    const result = alphaNumericRegex.test(value);
    if (!result) {
      setErrors((prev) => ({
        ...prev,
        [field]: {
          msg: "Username cannot contain special characters",
        },
      }));
      return;
    }
    if (value.length > 20 || value.length < 3) {
      setErrors((prev) => ({
        ...prev,
        [field]: {
          msg: "Username must be between 3 and 20 characters",
        },
      }));
      return;
    }
  }
  setErrors((prev) => ({ ...prev, [field]: null }));
};

const validatePassword = (e, setValue, setErrors, field = "password") => {
  const { value } = e.target;
  setValue(value);

  if (value.length > 0) {
    const passwordRegex = /^[A-Za-z0-9!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+$/;
    const result = passwordRegex.test(value);
    if (!result) {
      setErrors((prev) => ({
        ...prev,
        [field]: {
          msg: "Password can contain only letters, numbers and symbols without spaces",
        },
      }));
      return;
    }
    if (value.length < 6) {
      setErrors((prev) => ({
        ...prev,
        [field]: { msg: "Password must contain at least 6 characters" },
      }));
      return;
    }
  }
  setErrors((prev) => ({ ...prev, [field]: null }));
};

export {
  validateFirstName,
  validateLastName,
  validateUsername,
  validatePassword,
};
