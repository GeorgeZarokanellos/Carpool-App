enum role {
  driver = 'driver',
  passenger = 'passenger'
}

declare namespace Express { 
    export interface User {
      userId: number;
      role: role;
      // Add other properties of your User model if needed
    }
}
