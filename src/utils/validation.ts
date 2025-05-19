// Email
export function validateEmail(email: string): string | null {
  if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.(com|vn)$/.test(email))
    return "Invalid email format. The email must end with '.com' or '.vn' (e.g., example@domain.com).";
  if (email.includes(' '))
    return "Email must not contain spaces.";
  if (/[^A-Za-z0-9@._-]/.test(email))
    return "Email must not contain special characters except @ and .";
  return null;
}

// Password
export function validatePassword(password: string): string | null {
  if (password.length < 8)
    return "Password must be at least 8 characters long.";
  if (!/[A-Z]/.test(password))
    return "Password must contain at least one uppercase letter.";
  if (!/[a-z]/.test(password))
    return "Password must contain at least one lowercase letter.";
  if (!/[0-9]/.test(password))
    return "Password must contain at least one digit.";
  if (!/[@#$%]/.test(password))
    return "Password must contain at least one special character (e.g., @, #, $, %).";
  return null;
}

// Name fields
export function validateName(name: string): string | null {
  if (!/^[A-Za-zÀ-ỹà-ỹ\s]+$/.test(name))
    return "Name must only contain English or Vietnamese letters and spaces (e.g., Nguyễn Văn A).";
  if (name.length > 50)
    return "Name must not exceed 50 characters.";
  return null;
}

// National ID
export function validateNationalID(id: string): string | null {
  if (!/^\d{12}$/.test(id))
    return "National ID must be exactly 12 digits (e.g., 012345678901).";
  return null;
}

// Date of Birth
export function validateDOB(dob: string): string | null {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dob))
    return "Invalid date of birth format. Please use 'dd/mm/yyyy' (e.g., 15/08/2000).";
  const [d, m, y] = dob.split('/').map(Number);
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d)
    return "Date of birth is not a valid calendar date.";
  const now = new Date();
  const age = now.getFullYear() - y - (now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d) ? 1 : 0);
  if (age < 6)
    return "Staff must be at least 6 years old.";
  return null;
}

// Address fields
export function validateAddressPart(part: string): string | null {
  if (!/^[A-Za-zÀ-ỹà-ỹ0-9 ,./-]*$/.test(part))
    return "Address must not contain special symbols except , . - / (e.g., 123 Nguyen Trai, Ward 5).";
  return null;
}

// Phone Number
export function validatePhone(phone: string): string | null {
  if (!/^0\d{9}$/.test(phone))
    return "Phone number must be exactly 10 digits, start with 0 (e.g., 0921123456).";
  return null;
}

// Role
export function validateRole(role: string): string | null {
  if (!['Admin', 'Operator', 'Ticket Agent'].includes(role))
    return "Role must be Admin, Operator, or Ticket Agent.";
  return null;
}

// Shift
export function validateShift(shift: string): string | null {
  if (!['Day', 'Evening', 'Night'].includes(shift))
    return "Shift must be Day, Evening, or Night.";
  return null;
}
