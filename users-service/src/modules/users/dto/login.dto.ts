export interface LoginDTO {
user: {
    email: string;
    password: string;
  };
}

export type LoginResponseDTO = {
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  access_token: string;
};