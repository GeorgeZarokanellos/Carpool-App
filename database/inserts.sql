-- Insert into App_user
INSERT INTO App_user (university_id, first_name, last_name, username, password, email, role, phone)
VALUES (1, 'John', 'Doe', 'johndoe', 'password', 'johndoe@example.com', 'driver', '1234567890'),
       (2, 'Jane', 'Doe', 'janedoe', 'password', 'janedoe@example.com', 'passenger', '0987654321'),
       (3, 'Bob', 'Smith', 'bobsmith', 'password', 'bobsmith@example.com', 'driver', '1122334455');

-- Insert into Driver
INSERT INTO Driver (driver_id, license_id)
VALUES (1, 12345),
       (3, 67890);

-- Insert into Vehicle
INSERT INTO Vehicle (plate_number, owner_id, no_of_seats, model)
VALUES (1234, 1, 4, 'Toyota'),
       (5678, 3, 4, 'Honda');

-- Insert into Stops
INSERT INTO Stops (loc)
VALUES ('Plateia Gewrgiou'),
       ('Plateia Olgas'),
       ('Pyrosvestio'),
       ('Aretha');

-- Insert into Trip
INSERT INTO Trip (creator_id, driver_id, start_loc, no_of_passengers, no_of_stops, starting_time, status)
VALUES (1, 1, 'Plateia Gewrgiou', 2, 2, '2022-01-01 15:30:00.000000', 'planning'),
       (2, 3, 'Plateia Olgas', 1, 1, '2022-01-01 14:30:00.000000', 'completed'),
       (2, 3, 'Aretha', 2, 1, '2024-05-12 14:30:00.000000', 'completed'),
       (2, 18, 'Pyrosvestio', 2, 2, '2023-05-12 14:30:00.000000', 'completed'),
       (2, 4, 'Aretha', 2, 1, '2024-05-12 14:30:00.000000', 'completed'),
       (2, 3, 'Plateia Gewrgiou', 2, 1, '2024-06-12 14:30:00.000000', 'completed');

-- Insert into Trip_stops
INSERT INTO Trip_stops (trip_id, stop_id)
VALUES (1, 1),
       (1, 2),
       (2, 3);

-- Insert into Trip_passengers
INSERT INTO Trip_passengers (trip_id, passenger_id)
VALUES (1, 2),
       (2, 2);

-- Insert into Reviews
INSERT INTO Reviews (rating, date, reviewed_user_id, trip_id, reviewer_id)
VALUES (4.5, '2022-01-03', 4, 1, 2),
       (3.5, '2022-01-04', 4, 2, 2),
       (5.0, '2023-01-04', 4, 2, 1),
       (3.5, '2024-01-04', 4, 2, 17),
       (3.5, '2025-01-04', 4, 2, 24);