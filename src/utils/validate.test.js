import { checkValidData } from "./validate";

describe("checkValidData", () => {
  const validEmail = "test@example.com";
  const validPassword = "Password1!";
  const validName = "Naaha";

  test("signup with valid name, email, and password returns no error", () => {
    expect(checkValidData(validEmail, validPassword, validName)).toBeNull();
  });

  test("signup with invalid name returns a name-related error", () => {
    expect(checkValidData(validEmail, validPassword, "")).toMatch(/name/i);
  });

  test("signup with invalid email returns an email-related error", () => {
    expect(checkValidData("not-an-email", validPassword, validName)).toMatch(/email/i);
  });

  test("signup with invalid password returns a password-related error", () => {
    expect(checkValidData(validEmail, "password", validName)).toMatch(/password/i);
  });

  test("signin with valid email and password and null name returns no error", () => {
    expect(checkValidData(validEmail, validPassword, null)).toBeNull();
  });

  test("signin with invalid email and null name returns an email-related error", () => {
    expect(checkValidData("not-an-email", validPassword, null)).toMatch(/email/i);
  });
});
