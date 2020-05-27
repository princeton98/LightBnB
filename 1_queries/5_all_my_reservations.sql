SELECT properties.*, reservations.*, AVG(property_reviews.rating) as average_rating
FROM property_reviews
JOIN users ON guest_id = users.id
JOIN properties ON property_id = properties.id
JOIN reservations ON reservation_id = reservations.id
WHERE reservations.guest_id = 1 AND reservations.end_date < now()::date
GROUP BY reservations.id, properties.id
ORDER BY reservations.start_date LIMIT 10