-- Insert into App_user
INSERT INTO App_user (university_id, first_name, last_name, username, password, email, role, phone)
VALUES (101, 'George', 'Zarokanellos', 'gzarokanellos', 'password123', 'gzarokanellos@example.com', 'driver', '1234567890'),
       (102, 'John', 'Doe', 'jdoe', 'password456', 'jdoe@example.com', 'passenger', '0987654321'),
       (103, 'Jane', 'Smith', 'jsmith', 'password789', 'jsmith@example.com', 'passenger', '1122334455');

-- Insert into Driver
INSERT INTO Driver (driver_id, vehicle_id, license_id)
VALUES (1, 1234, 5678),
       (2, 5678, 1234),
       (3, 9012, 3456);

-- Insert into Vehicle
INSERT INTO Vehicle (owner_id, plate_number, no_of_seats, model)
VALUES (1, 1234, 4, 'Toyota'),
       (2, 5678, 5, 'Honda'),
       (3, 9012, 5, 'Ford');

-- Insert into Stops
INSERT INTO Stops (stop_loc)
VALUES ('Gewrgiou Square'),
       ('Olgas square'),
       ('Pyrosvestio');

-- Insert into Trip
INSERT INTO Trip (driver_id, start_loc, stops, date)
VALUES (1, 'Gewrgiou Square', 1, '2023-12-31'),
       (2, 'Olgas square', 1, '2024-01-01'),
       (3, 'Pyrosvestio', 1, '2024-02-01');

-- Insert into Trip_stops
INSERT INTO Trip_stops (trip_id, stop_id)
VALUES (1, 1),
       (2, 2),
       (3, 3);

-- Insert into Trip_passengers
INSERT INTO Trip_passengers (trip_id, passenger_id)
VALUES (1, 1),
       (2, 2),
       (3, 3);

-- Insert into Notifications
INSERT INTO Notifications (user_id, mess_cont, time_sent)
VALUES (1, 'Your trip has been created.', CURRENT_TIMESTAMP),
       (2, 'Your trip has been updated.', CURRENT_TIMESTAMP),
       (3, 'Your trip has been deleted.', CURRENT_TIMESTAMP);

-- Insert into Chat
INSERT INTO Chat (trip_id)
VALUES (1),
       (2),
       (3);

-- Insert into Chat_participants
INSERT INTO Chat_participants (chat_id, participant_id)
VALUES (1, 1),
       (2, 2),
       (3, 3);