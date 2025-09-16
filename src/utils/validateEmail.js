const validateEmail = (value) =>
    /^\S+@\S+\.\S+$/.test(String(value).toLowerCase());

export default validateEmail;