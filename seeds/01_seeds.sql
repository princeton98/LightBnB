
INSERT INTO users (name, email, password)
VALUES ('Brian', 'Brian@hotmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Boxer', 'Boxer@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
 ('Popper', 'Popper@hotmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1, 'message', 'description', 'googleimage', 'googleimage2', 100, 3, 2, 2, 'Canada', '311 Jackdark street', 'Mississauga', 'Ontario', 'K3E 1L0', true),
 (2, 'message', 'description', 'googleimage3', 'googleimage4', 300, 1, 1, 1, 'Canada', '322 Jacklight street', 'Toronto', 'Ontario', 'K3E 1L0', true),
 (3, 'message', 'description', 'googleimage4', 'googleimage5', 500, 3, 2, 2, 'United States', '311 Jacknormal street', 'New York City', 'New York', 'K3E 1L0', true);

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2018-02-02', '2018-02-04', 1, 2),
 ('2019-02-02', '2019-02-04', 2, 3),
('2020-02-02', '2020-02-04', 3, 1);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (2, 1, 1, 5, 'messages'),
 (3, 2, 2, 4, 'messages'),
 (1, 3, 3, 3, 'messages');