import { APP_ROUTES, TEXTS } from "@/modules/common/constants";
import {
  AuthAutoComplete,
  AuthCookie,
  AuthQueryParam,
  AuthFormField,
  AuthFormFieldId,
  AuthInputType,
  UserRole,
} from "./auth.enums";

interface AuthConfig {
  forms: {
    signIn: {
      autoComplete: {
        email: AuthAutoComplete.Email;
        password: AuthAutoComplete.CurrentPassword;
      };
      fieldIds: {
        email: AuthFormFieldId.Email;
        emailError: AuthFormFieldId.EmailError;
        password: AuthFormFieldId.Password;
        passwordError: AuthFormFieldId.PasswordError;
      };
      fields: {
        email: "email";
        password: "password";
        root: "root";
      };
      inputTypes: {
        email: AuthInputType.Email;
        password: AuthInputType.Password;
      };
    };
    signUp: {
      autoComplete: {
        email: AuthAutoComplete.Email;
        name: AuthAutoComplete.Name;
        password: AuthAutoComplete.NewPassword;
      };
      fieldIds: {
        email: AuthFormFieldId.Email;
        emailError: AuthFormFieldId.EmailError;
        name: AuthFormFieldId.Name;
        nameError: AuthFormFieldId.NameError;
        password: AuthFormFieldId.Password;
        passwordError: AuthFormFieldId.PasswordError;
        role: AuthFormFieldId.Role;
        roleError: AuthFormFieldId.RoleError;
      };
      fields: {
        email: "email";
        name: "name";
        password: "password";
        role: "role";
        root: "root";
      };
      inputTypes: {
        email: AuthInputType.Email;
        name: AuthInputType.Text;
        password: AuthInputType.Password;
      };
    };
  };
  cookies: {
    accessToken: AuthCookie.AccessToken;
    refreshToken: AuthCookie.RefreshToken;
  };
  googleOAuth: {
    codeParam: AuthQueryParam.Code;
    errorParam: AuthQueryParam.OAuthError;
    roleParam: AuthQueryParam.Role;
  };
  session: {
    /** Refresh this many seconds before the access token expires. */
    refreshLeewaySeconds: number;
  };
  roleHomeRoutes: Record<UserRole, string>;
  roleField: {
    fieldIds: {
      role: AuthFormFieldId.Role;
    };
    options: {
      label: string;
      value: UserRole;
    }[];
  };
}

export const AUTH_CONFIG: AuthConfig = {
  forms: {
    signIn: {
      autoComplete: {
        email: AuthAutoComplete.Email,
        password: AuthAutoComplete.CurrentPassword,
      },
      fieldIds: {
        email: AuthFormFieldId.Email,
        emailError: AuthFormFieldId.EmailError,
        password: AuthFormFieldId.Password,
        passwordError: AuthFormFieldId.PasswordError,
      },
      fields: {
        email: AuthFormField.Email,
        password: AuthFormField.Password,
        root: AuthFormField.Root,
      },
      inputTypes: {
        email: AuthInputType.Email,
        password: AuthInputType.Password,
      },
    },
    signUp: {
      autoComplete: {
        email: AuthAutoComplete.Email,
        name: AuthAutoComplete.Name,
        password: AuthAutoComplete.NewPassword,
      },
      fieldIds: {
        email: AuthFormFieldId.Email,
        emailError: AuthFormFieldId.EmailError,
        name: AuthFormFieldId.Name,
        nameError: AuthFormFieldId.NameError,
        password: AuthFormFieldId.Password,
        passwordError: AuthFormFieldId.PasswordError,
        role: AuthFormFieldId.Role,
        roleError: AuthFormFieldId.RoleError,
      },
      fields: {
        email: AuthFormField.Email,
        name: AuthFormField.Name,
        password: AuthFormField.Password,
        role: AuthFormField.Role,
        root: AuthFormField.Root,
      },
      inputTypes: {
        email: AuthInputType.Email,
        name: AuthInputType.Text,
        password: AuthInputType.Password,
      },
    },
  },
  cookies: {
    accessToken: AuthCookie.AccessToken,
    refreshToken: AuthCookie.RefreshToken,
  },
  googleOAuth: {
    codeParam: AuthQueryParam.Code,
    errorParam: AuthQueryParam.OAuthError,
    roleParam: AuthQueryParam.Role,
  },
  session: {
    refreshLeewaySeconds: 30,
  },
  roleHomeRoutes: {
    [UserRole.Student]: APP_ROUTES.COURSES,
    [UserRole.Teacher]: APP_ROUTES.STUDENTS,
  },
  roleField: {
    fieldIds: {
      role: AuthFormFieldId.Role,
    },
    options: [
      {
        label: TEXTS.AUTH.ROLE_TEACHER,
        value: UserRole.Teacher,
      },
      {
        label: TEXTS.AUTH.ROLE_STUDENT,
        value: UserRole.Student,
      },
    ],
  },
};
