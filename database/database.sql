CREATE TYPE user_role AS ENUM ('driver', 'passenger');
CREATE TYPE start_stop_location AS ENUM ('Gewrgiou Square', 'Olgas square', 'Pyrosvestio', 'Aretha');
CREATE TYPE choice AS ENUM ('aceept', 'decline');


CREATE TABLE App_user (
	user_id SERIAL,
	university_id INT,
	first_name VARCHAR(50) NOT NULL,
	last_name VARCHAR(50) NOT NULL,
	username VARCHAR(50) UNIQUE NOT NULL,
	password VARCHAR(50) NOT NULL,
	email VARCHAR(50) NOT NULL,
	role user_role,
	phone VARCHAR(20),
	rating DECIMAL(3,2) DEFAULT 0,
	overall_points INT DEFAULT 0,
	PRIMARY KEY (user_id)
);

CREATE TABLE Driver (
	driver_id SERIAL,
	vehicle_id INT UNIQUE NOT NULL,
	license_id INT NOT NULL,
	PRIMARY KEY (driver_id),
	FOREIGN KEY (driver_id) REFERENCES App_user (user_id)
);

CREATE TABLE Vehicle (
	owner_id INT NOT NULL,
	plate_number INT UNIQUE NOT NULL,
	no_of_seats SMALLINT NOT NULL,
	image BYTEA,
	model VARCHAR(50),
	PRIMARY KEY (plate_number),
	FOREIGN KEY (owner_id) REFERENCES Driver (driver_id)
-- 	color enum
);

CREATE TABLE Stops (
	stop_id SERIAL,
	stop_loc start_stop_location NOT NULL,
	PRIMARY KEY (stop_id)
);

CREATE TABLE Trip_stops (
	trip_id INT,
	stop_id INT,
	PRIMARY KEY (trip_id, stop_id),
	FOREIGN KEY (stop_id) REFERENCES Stops (stop_id)
);

CREATE TABLE Trip (
	trip_id SERIAL,
	driver_id INT NOT NULL,
	start_loc start_stop_location NOT NULL,
	stops INT,
	date DATE NOT NULL,
	PRIMARY KEY (trip_id)
);

ALTER TABLE Trip_stops ADD FOREIGN KEY (trip_id) REFERENCES Trip (trip_id);


CREATE TABLE Trip_passengers (
	trip_id INT,
	passenger_id INT,
	PRIMARY KEY (trip_id, passenger_id),
	FOREIGN KEY (trip_id) REFERENCES Trip (trip_id),
	FOREIGN KEY (passenger_id) REFERENCES App_user (user_id)
);

CREATE TABLE Notifications (
	notification_id SERIAL,
	user_id INT NOT NULL,
	mess_cont TEXT NOT NULL,
	time_sent TIMESTAMP,
	is_read BOOLEAN DEFAULT FALSE,
	accept_decline choice,
	PRIMARY KEY (notification_id),
	FOREIGN KEY (user_id) REFERENCES App_user (user_id)
);

CREATE TABLE Chat (
	chat_id SERIAL,
	trip_id INT NOT NULL,
	PRIMARY KEY (chat_id),
	FOREIGN KEY (trip_id) REFERENCES Trip (trip_id)
);

CREATE TABLE Chat_participants (
	chat_id INT NOT NULL,
	participant_id INT NOT NULL,
	PRIMARY KEY (chat_id, participant_id),
	FOREIGN KEY (chat_id) REFERENCES Chat (chat_id),
	FOREIGN KEY (participant_id) REFERENCES App_user (user_id)
);