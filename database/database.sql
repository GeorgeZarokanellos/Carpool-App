CREATE TYPE user_role AS ENUM ('driver', 'passenger');
CREATE TYPE start_stop_location AS ENUM ('Πλατεία Γεωργίου', 'Πλατεία Όλγας', 'Πυροσβεστίο', 'Αρέθα');
CREATE TYPE choice AS ENUM ('accepted', 'pending', 'declined');
CREATE TYPE trip_status AS ENUM ('planning', 'locked', 'in_progress', 'completed', 'cancelled');

CREATE TABLE App_user (
	user_id SERIAL,
	university_id INT,
	first_name VARCHAR(50) NOT NULL,
	last_name VARCHAR(50) NOT NULL,
	username VARCHAR(50) UNIQUE NOT NULL,
	password VARCHAR(250) NOT NULL,
	email VARCHAR(250) NOT NULL,
	role user_role,
	phone VARCHAR(20),
	overall_rating DECIMAL(3,2) DEFAULT 0,
	overall_points INT DEFAULT 0,
    no_of_reviews INT DEFAULT 0,
    profile_picture bytea,
	PRIMARY KEY (user_id)
);

CREATE TABLE Driver (
	driver_id SERIAL,
	license_id INT UNIQUE NOT NULL,
	PRIMARY KEY (driver_id),
	FOREIGN KEY (driver_id) REFERENCES App_user (user_id)
);

CREATE TABLE Vehicle (
	plate_number VARCHAR(50) UNIQUE NOT NULL,
    owner_id INT UNIQUE NOT NULL,
	no_of_seats SMALLINT NOT NULL,
    maker VARCHAR(50),
	model VARCHAR(50),
	PRIMARY KEY (plate_number),
	FOREIGN KEY (owner_id) REFERENCES Driver (driver_id)
-- 	color enum
);

CREATE TABLE Stops (
	stop_id SERIAL,
	loc start_stop_location NOT NULL,
	PRIMARY KEY (stop_id)
);

CREATE TABLE Trip (
	trip_id SERIAL,
    creator_id INT NOT NULL ,
	driver_id INT,
	start_loc start_stop_location NOT NULL,
    starting_time TIMESTAMP NOT NULL,
    no_of_passengers INT,
	no_of_stops INT DEFAULT 0,
    status trip_status default 'planning',
	PRIMARY KEY (trip_id),
    FOREIGN KEY (creator_id) REFERENCES app_user(user_id),
    FOREIGN KEY (driver_id) REFERENCES driver(driver_id)
);

CREATE TABLE Trip_stops (
	trip_id INT NOT NULL ,
	stop_id INT NOT NULL ,
	PRIMARY KEY (trip_id, stop_id),
	FOREIGN KEY (stop_id) REFERENCES Stops (stop_id),
    FOREIGN KEY (trip_id) REFERENCES Trip (trip_id)
);

CREATE TABLE Trip_passengers (
	trip_id INT,
	passenger_id INT,
	PRIMARY KEY (trip_id, passenger_id),
	FOREIGN KEY (trip_id) REFERENCES Trip (trip_id),
	FOREIGN KEY (passenger_id) REFERENCES App_user (user_id)
);

CREATE TABLE Reviews (
    review_id SERIAL NOT NULL,
    rating decimal(2,1) NOT NULL,
    date DATE NOT NULL,
    trip_id INT NOT NULL,
    reviewed_user_id INT NOT NULL,
    reviewer_id INT NOT NULL,
    PRIMARY KEY (review_id),
    FOREIGN KEY (trip_id) REFERENCES Trip (trip_id),
    FOREIGN KEY (reviewed_user_id) REFERENCES app_user (user_id),
    FOREIGN KEY (reviewer_id) REFERENCES app_user (user_id)
);

CREATE TABLE Notifications (
	notification_id SERIAL,
	driver_id INT NOT NULL,
    passenger_id INT NOT NULL,
    trip_id INT NOT NULL,
	message TEXT NOT NULL,
    stop_id INT NOT NULL,
	time_sent TIMESTAMP DEFAULT NOW(),
	status choice default 'pending',
	PRIMARY KEY (notification_id),
	FOREIGN KEY (driver_id) REFERENCES Driver (driver_id),
    FOREIGN KEY (passenger_id) REFERENCES App_user (user_id),
    FOREIGN KEY (trip_id) REFERENCES Trip (trip_id)
);

-- CREATE TABLE Chat (
-- 	chat_id SERIAL,
-- 	trip_id INT NOT NULL,
-- 	PRIMARY KEY (chat_id),
-- 	FOREIGN KEY (trip_id) REFERENCES Trip (trip_id)
-- );
--
-- CREATE TABLE Chat_participants (
-- 	chat_id INT NOT NULL,
-- 	participant_id INT NOT NULL,
-- 	PRIMARY KEY (chat_id, participant_id),
-- 	FOREIGN KEY (chat_id) REFERENCES Chat (chat_id),
-- 	FOREIGN KEY (participant_id) REFERENCES App_user (user_id)
-- );