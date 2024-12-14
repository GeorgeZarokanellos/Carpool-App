enum role {
  DRIVER = 'driver',
  PASSENGER = 'passenger',
  ALL_ROLES = 'all_roles'
}

declare namespace Express { 
    export interface User {
      userId: number;
      role: role;
      username: string;
      // Add other properties of your User model if needed
    }
}
