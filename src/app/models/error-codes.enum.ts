export enum ErrorCodes {
  // Authentication Errors
  InvalidEmail = 'auth/invalid-email',
  InvalidCredential = 'auth/invalid-credential',
  UserCreationFailed = 'auth/user-not-found',
  UserNotFound = 'auth/user-creation-failed',
  WrongPassword = 'auth/wrong-password',
  EmailAlreadyInUse = 'auth/email-already-in-use',
  WeakPassword = 'auth/weak-password',
  TooManyRequests = 'auth/too-many-requests',

  // Firestore Errors
  NotFound = 'not-found',
  AlreadyExists = 'already-exists',
  InvalidArgument = 'invalid-argument',

  DefaultError = 'default-error'
}


export function getErrorMessage(code: any): string {
  let errorMessage = 'Something went wrong!';
  switch (code) {
    case ErrorCodes.InvalidEmail:
      errorMessage = 'The email address is not valid. Please check and try again.';
      break;
    case ErrorCodes.InvalidCredential:
      errorMessage = 'Invalid email or password. Please check and try again.';
      break;
    case ErrorCodes.UserCreationFailed:
      return 'Failed to create user account. Please try again later.';
    case ErrorCodes.UserNotFound:
      errorMessage = 'No registered user found. Please check and try again.';
      break;
    case ErrorCodes.WrongPassword:
      errorMessage = 'Invalid credentials. Please try again.';
      break;
    case ErrorCodes.EmailAlreadyInUse:
      errorMessage = 'This email is already registered. Please use a different email.';
      break;
    case ErrorCodes.WeakPassword:
      errorMessage = 'The password is too weak. Please use a stronger password.';
      break;
    case ErrorCodes.TooManyRequests:
      errorMessage = 'Too many login attempts. Please try again later.';
      break;

    // case ErrorCodes.NotFound:
    //   errorMessage = 'The requested document was not found.';
    //   break;
    case ErrorCodes.AlreadyExists:
      errorMessage = 'The document you are trying to create already exists.';
      break;
    case ErrorCodes.InvalidArgument:
      errorMessage = 'The data provided is not valid.';
      break;
    default:
      errorMessage = 'Something went wrong!';
  }

  return errorMessage;
}