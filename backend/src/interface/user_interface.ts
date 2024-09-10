enum role {
  driver = 'driver',
  passenger = 'passenger'
}

declare namespace Express { 
    export interface User {
      userId: number;
      role: role;
      username: string;
      // Add other properties of your User model if needed
    }
}
