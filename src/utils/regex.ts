export const passwordReg = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/);

export const namingReg = new RegExp(/^(?!.*\s)(?=.*\w)[\w\s\-_]+(?!.*\s)$/);
