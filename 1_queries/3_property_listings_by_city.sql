SELECT  properties.id, properties.title, properties.cost_per_night, AVG(property_reviews.rating)
FROM property_reviews
JOIN properties ON property_id = properties.id
WHERE properties.city LIKE '%Vancouver'
GROUP BY properties.id
HAVING AVG(property_reviews.rating) >= 4
ORDER BY cost_per_night LIMIT 10
