INSERT INTO Coupons (title, description, code, discount_value, points_cost, status) VALUES
('Summer Sale', '10% off on all items', 'SUMMER10', 10, 100, 'active'),
('Winter Sale', '15% off on all items', 'WINTER15', 15, 150, 'active'),
('Spring Sale', '20% off on all items', 'SPRING20', 20, 200, 'active'),
('Autumn Sale', '25% off on all items', 'AUTUMN25', 25, 250, 'active'),
('Black Friday', '30% off on all items', 'BLACK30', 30, 300, 'active'),
('Cyber Monday', '35% off on all items', 'CYBER35', 35, 350, 'active'),
('New Year Sale', '40% off on all items', 'NEWYEAR40', 40, 400, 'active'),
('Valentines Day', '45% off on all items', 'VALENTINE45', 45, 450, 'active'),
('Easter Sale', '50% off on all items', 'EASTER50', 50, 500, 'active'),
('Halloween Sale', '55% off on all items', 'HALLOWEEN55', 55, 550, 'active'),
('Christmas Sale', '60% off on all items', 'CHRISTMAS60', 60, 600, 'active'),
('Anniversary Sale', '65% off on all items', 'ANNIVERSARY65', 65, 650, 'active'),
('Birthday Sale', '70% off on all items', 'BIRTHDAY70', 70, 700, 'active'),
('Flash Sale', '75% off on all items', 'FLASH75', 75, 750, 'active'),
('Clearance Sale', '80% off on all items', 'CLEARANCE80', 80, 800, 'active' );


INSERT INTO App_user (university_id, first_name, last_name, username, password, email, role, phone, overall_rating, overall_points, no_of_reviews, profile_picture, current_trip_id, pending_request_trip_id) VALUES
(1, 'John', 'Doe', 'johndoe', 'password123', 'johndoe@example.com', 'passenger', '1234567890', 4.5, 100, 10, NULL, NULL, NULL),
(2, 'Jane', 'Smith', 'janesmith', 'password123', 'janesmith@example.com', 'driver', '0987654321', 4.7, 200, 20, NULL, NULL, NULL),
(3, 'Alice', 'Johnson', 'alicejohnson', 'password123', 'alicejohnson@example.com', 'admin', '1122334455', 4.8, 300, 30, NULL, NULL, NULL),
(4, 'Bob', 'Brown', 'bobbrown', 'password123', 'bobbrown@example.com', 'passenger', '2233445566', 4.6, 150, 15, NULL, NULL, NULL),
(5, 'Charlie', 'Davis', 'charliedavis', 'password123', 'charliedavis@example.com', 'driver', '3344556677', 4.9, 250, 25, NULL, NULL, NULL),
(6, 'David', 'Wilson', 'davidwilson', 'password123', 'davidwilson@example.com', 'passenger', '4455667788', 4.4, 120, 12, NULL, NULL, NULL),
(7, 'Eve', 'Miller', 'evemiller', 'password123', 'evemiller@example.com', 'admin', '5566778899', 4.3, 110, 11, NULL, NULL, NULL),
(8, 'Frank', 'Garcia', 'frankgarcia', 'password123', 'frankgarcia@example.com', 'driver', '6677889900', 4.2, 130, 13, NULL, NULL, NULL),
(9, 'Grace', 'Martinez', 'gracemartinez', 'password123', 'gracemartinez@example.com', 'passenger', '7788990011', 4.1, 140, 14, NULL, NULL, NULL),
(10, 'Hank', 'Rodriguez', 'hankrodriguez', 'password123', 'hankrodriguez@example.com', 'driver', '8899001122', 4.0, 160, 16, NULL, NULL, NULL);