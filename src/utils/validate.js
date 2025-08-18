export const checkValidData = (email,password,name) => {

    const validEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
    const validPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/.test(password);
    const validName = /^[a-zA-Z]+$/.test(name);

    if (!validName) return "Name is not valid";
    if (!validEmail) return "Email ID is not valid";
    if (!validPassword) return "Password is not valid";

    return null;

};